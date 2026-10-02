-- PrimeBoost Nigeria - Manual wallet credit for emzybadm@gmail.com
--
-- REASON: Customer transferred ₦1,000 directly to our bank account on
--         October 2, 2026. Payment was received but wallet was not credited.
--
-- IDEMPOTENCY: Uses a fixed reference MANUAL-BANK-emzybadm-20261002-1000.
--              The UNIQUE index on wallet_transactions.reference (created in
--              migration 20260914110000) guarantees this credit can NEVER be
--              applied twice, even if this migration is re-run.
--
-- SCOPE: Only touches the single user with email emzybadm@gmail.com.
--        No other user's balance is affected.

DO $$
DECLARE
  v_user_id   UUID;
  v_wallet    RECORD;
  v_credited  BOOLEAN;
  v_ref       TEXT := 'MANUAL-BANK-emzybadm-20261002-1000';
BEGIN

  -- ── 1. Locate the user ──────────────────────────────────────────────────
  SELECT id INTO v_user_id
  FROM public.user_profiles
  WHERE LOWER(email) = 'emzybadm@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User emzybadm@gmail.com not found in user_profiles';
  END IF;

  -- ── 2. Locate the wallet ─────────────────────────────────────────────────
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_wallet IS NULL THEN
    RAISE EXCEPTION 'No wallet found for user emzybadm@gmail.com (user_id: %)', v_user_id;
  END IF;

  -- ── 3. Guard: skip if already credited ──────────────────────────────────
  IF EXISTS (
    SELECT 1 FROM public.wallet_transactions
    WHERE reference = v_ref
  ) THEN
    RAISE NOTICE 'Reference % already exists — credit already applied, skipping.', v_ref;
    RETURN;
  END IF;

  -- ── 4. Insert transaction record ─────────────────────────────────────────
  --   The UNIQUE index on reference is the final safety net against duplicates.
  INSERT INTO public.wallet_transactions (
    user_id,
    wallet_id,
    transaction_type,
    source,
    amount,
    reference,
    description,
    created_at
  ) VALUES (
    v_user_id,
    v_wallet.id,
    'credit'::public.transaction_type,
    'wallet_fund'::public.transaction_source,
    1000.00,
    v_ref,
    'Wallet funded via Bank Transfer (manual credit — payment received 2 Oct 2026)',
    '2026-10-02 18:53:31+00'
  );

  -- ── 5. Update wallet balance ─────────────────────────────────────────────
  UPDATE public.wallets
  SET
    balance      = balance      + 1000.00,
    total_funded = COALESCE(total_funded, 0) + 1000.00,
    updated_at   = CURRENT_TIMESTAMP
  WHERE id = v_wallet.id
    AND user_id = v_user_id;

  v_credited := TRUE;

  RAISE NOTICE 'SUCCESS: Credited ₦1,000 to wallet of emzybadm@gmail.com (user_id: %, wallet_id: %, ref: %)',
    v_user_id, v_wallet.id, v_ref;

EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Duplicate reference detected — credit already applied for ref: %', v_ref;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Manual credit failed: %', SQLERRM;
END $$;
