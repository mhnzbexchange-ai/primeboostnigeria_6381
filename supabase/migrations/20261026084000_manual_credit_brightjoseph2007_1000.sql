-- PrimeBoost Nigeria - One-time manual wallet credit for Brightjoseph2007@gmail.com
--
-- Owner-approved credit of NGN 1,000.00.
-- IDEMPOTENCY: fixed unique reference MANUAL-OWNER-brightjoseph2007-20261026-1000.
--   The unique index on wallet_transactions.reference guarantees this credit
--   can never be applied twice, even if this migration is re-run.
-- SCOPE: only the wallet of the user with email Brightjoseph2007@gmail.com.

DO $$
DECLARE
  v_user_id   UUID;
  v_wallet    RECORD;
  v_credited  BOOLEAN;
  v_ref       TEXT    := 'MANUAL-OWNER-brightjoseph2007-20261026-1000';
  v_amount    NUMERIC := 1000.00;
  v_email     TEXT    := 'brightjoseph2007@gmail.com';
  v_reason    TEXT    := 'Owner-approved one-time manual credit of NGN 1,000 applied via migration';
BEGIN
  SELECT id INTO v_user_id
  FROM public.user_profiles
  WHERE LOWER(email) = v_email
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User % not found in user_profiles - no credit applied', v_email;
    RETURN;
  END IF;

  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_wallet IS NULL THEN
    RAISE NOTICE 'No wallet found for % - no credit applied', v_email;
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.wallet_transactions WHERE reference = v_ref
  ) THEN
    RAISE NOTICE 'Reference % already credited - skipping', v_ref;
    RETURN;
  END IF;

  v_credited := public.credit_wallet_for_payment(
    v_user_id,
    v_wallet.id,
    v_amount,
    v_ref,
    'Wallet funded via Bank Transfer (manual credit by owner)'
  );

  IF v_credited THEN
    IF to_regclass('public.manual_credit_audit_log') IS NOT NULL
       AND NOT EXISTS (
         SELECT 1 FROM public.manual_credit_audit_log WHERE reference = v_ref
       ) THEN
      INSERT INTO public.manual_credit_audit_log (
        admin_id, admin_email, user_id, user_email, amount, reference,
        credit_source, reason, outcome
      ) VALUES (
        NULL,
        'owner-migration',
        v_user_id,
        v_email,
        v_amount,
        v_ref,
        'bank_transfer',
        v_reason,
        'credited'
      );
    END IF;
    RAISE NOTICE 'SUCCESS: credited NGN % to % (ref: %)', v_amount, v_email, v_ref;
  ELSE
    RAISE NOTICE 'Duplicate reference % - no credit applied', v_ref;
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'Duplicate reference detected for % - credit already applied', v_ref;
END $$;

NOTIFY pgrst, 'reload schema';
