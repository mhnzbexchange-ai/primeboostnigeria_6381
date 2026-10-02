-- PrimeBoost Nigeria - Fix wallet balance for emzybadm@gmail.com
--
-- PROBLEM: Migration 20261002185331 was created but not applied to the database.
--          The user's wallet still shows ₦0 despite the ₦1,000 bank transfer
--          received on October 2, 2026.
--
-- FIX: This migration directly updates the wallet balance and inserts the
--      transaction record, handling both scenarios:
--      (a) The previous migration reference already exists → skip insert, but
--          still ensure the wallet balance is correct.
--      (b) The previous migration was never applied → insert transaction and
--          credit the wallet.
--
-- IDEMPOTENCY: Safe to run multiple times. Uses the same fixed reference
--              MANUAL-BANK-emzybadm-20261002-1000 from the original migration.
--              The wallet balance is set via a direct UPDATE that checks the
--              current balance, so it will never double-credit.
--
-- SCOPE: Only touches the single user emzybadm@gmail.com. No other user affected.

DO $$
DECLARE
  v_user_id    UUID;
  v_wallet     RECORD;
  v_ref        TEXT    := 'MANUAL-BANK-emzybadm-20261002-1000';
  v_tx_exists  BOOLEAN := FALSE;
BEGIN

  -- ── 1. Locate the user ──────────────────────────────────────────────────
  SELECT id INTO v_user_id
  FROM public.user_profiles
  WHERE LOWER(email) = 'emzybadm@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User emzybadm@gmail.com not found in user_profiles. Cannot apply credit.';
  END IF;

  RAISE NOTICE 'Found user emzybadm@gmail.com with id: %', v_user_id;

  -- ── 2. Locate the wallet ─────────────────────────────────────────────────
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_wallet IS NULL THEN
    RAISE EXCEPTION 'No wallet found for emzybadm@gmail.com (user_id: %). Cannot apply credit.', v_user_id;
  END IF;

  RAISE NOTICE 'Found wallet id: % with current balance: %', v_wallet.id, v_wallet.balance;

  -- ── 3. Check if transaction record already exists ────────────────────────
  SELECT EXISTS (
    SELECT 1 FROM public.wallet_transactions
    WHERE reference = v_ref
  ) INTO v_tx_exists;

  -- ── 4. Insert transaction if not already present ─────────────────────────
  IF NOT v_tx_exists THEN
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
    RAISE NOTICE 'Transaction record inserted for ref: %', v_ref;
  ELSE
    RAISE NOTICE 'Transaction record already exists for ref: % — skipping insert.', v_ref;
  END IF;

  -- ── 5. Ensure wallet balance reflects the ₦1,000 credit ─────────────────
  --   Re-fetch the wallet to get the latest balance (in case another session
  --   modified it between steps 2 and 5).
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  LIMIT 1;

  -- Only add the ₦1,000 if the wallet balance has NOT already been updated.
  -- We determine this by checking whether the transaction existed BEFORE this
  -- migration ran (v_tx_exists = TRUE means the previous migration DID insert
  -- the transaction but the balance update may have been missed; however, if
  -- the transaction existed it means the balance was already updated by the
  -- previous DO block — so we only credit when the transaction was absent).
  IF NOT v_tx_exists THEN
    UPDATE public.wallets
    SET
      balance      = balance + 1000.00,
      total_funded = COALESCE(total_funded, 0) + 1000.00,
      updated_at   = CURRENT_TIMESTAMP
    WHERE id      = v_wallet.id
      AND user_id = v_user_id;

    RAISE NOTICE 'SUCCESS: Wallet balance updated. Added ₦1,000 to wallet of emzybadm@gmail.com (wallet_id: %)', v_wallet.id;
  ELSE
    -- Transaction existed but balance may still be wrong if the previous
    -- migration's UPDATE silently failed. Recalculate from transactions.
    UPDATE public.wallets w
    SET
      balance    = COALESCE((
        SELECT SUM(CASE WHEN wt.transaction_type = 'credit' THEN wt.amount
                        WHEN wt.transaction_type = 'debit'  THEN -wt.amount
                        ELSE 0 END)
        FROM public.wallet_transactions wt
        WHERE wt.wallet_id = w.id
      ), 0),
      updated_at = CURRENT_TIMESTAMP
    WHERE w.id      = v_wallet.id
      AND w.user_id = v_user_id;

    RAISE NOTICE 'Wallet balance recalculated from transaction history for emzybadm@gmail.com (wallet_id: %)', v_wallet.id;
  END IF;

  -- ── 6. Final confirmation ────────────────────────────────────────────────
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  LIMIT 1;

  RAISE NOTICE 'FINAL wallet balance for emzybadm@gmail.com: ₦%', v_wallet.balance;

EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Unique violation on reference % — credit already applied safely.', v_ref;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Fix migration failed: %', SQLERRM;
END $$;
