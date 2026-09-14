-- PrimeBoost Nigeria - Fix credit_wallet_for_payment RPC
-- 
-- ROOT CAUSES FIXED:
-- 1. Re-creates credit_wallet_for_payment with explicit GRANT to both
--    authenticated (browser verify route) AND service_role (webhook).
--    Without the service_role grant the webhook could never credit the wallet.
-- 2. Adds a partial unique index on wallet_transactions.reference to prevent
--    duplicate credits (idempotency guard). Safe to run even if index exists.
-- 3. Adds a reconcile_paystack_payment() helper that an admin can call once
--    to credit the already-confirmed transaction PB-1789379123881-4ihd5q3u
--    without creating a duplicate if it was already credited.
-- 4. Ensures the function is accessible from the service_role key used by
--    the Paystack webhook (Next.js API route /api/webhooks/paystack).

-- ============================================================
-- 1. Idempotency index (safe to re-run)
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_transactions_reference_unique
  ON public.wallet_transactions (reference)
  WHERE reference IS NOT NULL AND reference <> '';

-- ============================================================
-- 2. Drop old version and re-create with correct grants
-- ============================================================
DROP FUNCTION IF EXISTS public.credit_wallet_for_payment(UUID, UUID, NUMERIC, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.credit_wallet_for_payment(
  p_user_id      UUID,
  p_wallet_id    UUID,
  p_amount       NUMERIC,
  p_reference    TEXT,
  p_description  TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted BOOLEAN := FALSE;
BEGIN
  -- Validate inputs
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid amount: %', p_amount;
  END IF;

  IF p_reference IS NULL OR TRIM(p_reference) = '' THEN
    RAISE EXCEPTION 'Reference is required';
  END IF;

  -- Verify wallet belongs to the user
  IF NOT EXISTS (
    SELECT 1 FROM public.wallets
    WHERE id = p_wallet_id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Wallet does not belong to user';
  END IF;

  -- Try to insert the transaction record first.
  -- The unique index on reference will raise unique_violation if already processed.
  INSERT INTO public.wallet_transactions (
    user_id,
    wallet_id,
    transaction_type,
    source,
    amount,
    reference,
    description
  ) VALUES (
    p_user_id,
    p_wallet_id,
    'credit'::public.transaction_type,
    'wallet_fund'::public.transaction_source,
    p_amount,
    p_reference,
    p_description
  );

  -- Only reaches here if insert succeeded (no duplicate)
  UPDATE public.wallets
  SET
    balance      = balance      + p_amount,
    total_funded = COALESCE(total_funded, 0) + p_amount,
    updated_at   = CURRENT_TIMESTAMP
  WHERE id = p_wallet_id
    AND user_id = p_user_id;

  v_inserted := TRUE;
  RETURN v_inserted;

EXCEPTION
  WHEN unique_violation THEN
    -- Reference already processed — do nothing, return false (not an error)
    RETURN FALSE;
END;
$$;

-- Grant to authenticated users (browser-side verify route uses user's JWT)
GRANT EXECUTE ON FUNCTION public.credit_wallet_for_payment(UUID, UUID, NUMERIC, TEXT, TEXT) TO authenticated;

-- Grant to service_role (webhook uses SUPABASE_SERVICE_ROLE_KEY / server-side createClient)
GRANT EXECUTE ON FUNCTION public.credit_wallet_for_payment(UUID, UUID, NUMERIC, TEXT, TEXT) TO service_role;

-- ============================================================
-- 3. Reconciliation helper for admin use
--    Call this ONCE to credit the confirmed transaction
--    PB-1789379123881-4ihd5q3u if it was never credited.
--    Safe to call multiple times — duplicate is silently ignored.
-- ============================================================
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
  -- Only admins can call this
  IF NOT public.is_admin_from_auth() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized — admin only');
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

-- ============================================================
-- 4. Reload PostgREST schema cache
-- ============================================================
NOTIFY pgrst, 'reload schema';
