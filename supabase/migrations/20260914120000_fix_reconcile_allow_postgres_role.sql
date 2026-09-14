-- Fix reconcile_paystack_payment to allow execution by postgres/superuser role
--
-- ROOT CAUSE:
-- The function calls public.is_admin_from_auth() which relies on auth.uid() (JWT session).
-- When run from the Supabase SQL Editor, the session runs as the 'postgres' role with
-- no JWT, so auth.uid() returns NULL and the admin check always fails with
-- "Unauthorized — admin only".
--
-- FIX:
-- Add a bypass for the postgres superuser role using current_user / pg_has_role checks.
-- If the caller IS the postgres role (or any superuser), skip the JWT admin check.
-- All other callers (authenticated users via API) still go through is_admin_from_auth().

CREATE OR REPLACE FUNCTION public.reconcile_paystack_payment(
  p_reference    TEXT,
  p_email        TEXT,
  p_amount_naira NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id  UUID;
  v_wallet   RECORD;
  v_credited BOOLEAN;
  v_is_superuser BOOLEAN;
BEGIN
  -- Check if caller is a superuser (postgres role / SQL Editor)
  SELECT usesuper INTO v_is_superuser
  FROM pg_user
  WHERE usename = current_user;

  -- Allow superusers (postgres role / SQL Editor) to bypass JWT admin check.
  -- Regular API callers must pass the is_admin_from_auth() check.
  IF NOT COALESCE(v_is_superuser, FALSE) THEN
    IF NOT public.is_admin_from_auth() THEN
      RETURN jsonb_build_object('success', false, 'error', 'Unauthorized — admin only');
    END IF;
  END IF;

  -- Check if already credited
  IF EXISTS (
    SELECT 1 FROM public.wallet_transactions
    WHERE reference = p_reference
  ) THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_credited', true,
      'message', 'Reference already exists in wallet_transactions — no duplicate credit created'
    );
  END IF;

  -- Look up user by email (case-insensitive)
  SELECT id INTO v_user_id
  FROM public.user_profiles
  WHERE LOWER(email) = LOWER(p_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No user found with email: ' || p_email);
  END IF;

  -- Get wallet
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_wallet IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No wallet found for user');
  END IF;

  -- Credit the wallet atomically
  SELECT public.credit_wallet_for_payment(
    v_user_id,
    v_wallet.id,
    p_amount_naira,
    p_reference,
    'Wallet funded via Paystack (reconciled)'
  ) INTO v_credited;

  IF v_credited THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_credited', false,
      'user_id', v_user_id,
      'wallet_id', v_wallet.id,
      'amount', p_amount_naira,
      'reference', p_reference,
      'message', 'Wallet successfully credited'
    );
  ELSE
    RETURN jsonb_build_object(
      'success', true,
      'already_credited', true,
      'message', 'Reference already processed — no duplicate credit'
    );
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reconcile_paystack_payment(TEXT, TEXT, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reconcile_paystack_payment(TEXT, TEXT, NUMERIC) TO service_role;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
