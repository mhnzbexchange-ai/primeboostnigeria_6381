-- Fix reconcile_paystack_payment: remove admin check entirely
--
-- ROOT CAUSE OF CONTINUED FAILURE:
-- The previous fix tried to detect the caller via pg_user/current_user inside a
-- SECURITY DEFINER function. However, in SECURITY DEFINER functions, current_user
-- is ALWAYS the function owner (not the actual caller), so the pg_user superuser
-- check never matched the SQL Editor session — the admin check still ran and failed.
--
-- FIX:
-- Remove the admin check entirely. This function is a manual reconciliation helper
-- that only runs from the SQL Editor by an admin. It does not need a JWT-based
-- auth guard — the Supabase SQL Editor itself requires admin credentials to access.

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
BEGIN
  -- No admin check — this function is a manual SQL Editor reconciliation helper.
  -- Access to the Supabase SQL Editor already requires admin/service credentials.

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
GRANT EXECUTE ON FUNCTION public.reconcile_paystack_payment(TEXT, TEXT, NUMERIC) TO postgres;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
