-- PrimeBoost Nigeria - Manual Credit Audit Log (dispute resolution)

-- ============================================================
-- 1. TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.manual_credit_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  admin_email TEXT,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  reference TEXT NOT NULL DEFAULT '',
  credit_source TEXT NOT NULL DEFAULT 'manual',
  reason TEXT NOT NULL DEFAULT '',
  related_payment_id UUID,
  outcome TEXT NOT NULL DEFAULT 'credited',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_manual_credit_audit_log_created_at
  ON public.manual_credit_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_manual_credit_audit_log_user_id
  ON public.manual_credit_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_credit_audit_log_reference
  ON public.manual_credit_audit_log(reference);

-- ============================================================
-- 3. FUNCTIONS (before RLS policies)
-- ============================================================

-- Admin manually credits a user's wallet (idempotent on reference) and writes an audit entry
CREATE OR REPLACE FUNCTION public.admin_manual_credit_wallet(
  p_user_email   TEXT,
  p_amount       NUMERIC,
  p_reference    TEXT,
  p_reason       TEXT,
  p_credit_source TEXT DEFAULT 'manual'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id     UUID;
  v_wallet      RECORD;
  v_credited    BOOLEAN;
  v_admin_email TEXT;
BEGIN
  IF NOT public.is_admin_from_auth() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized - admin only');
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Amount must be greater than zero');
  END IF;

  IF p_reference IS NULL OR TRIM(p_reference) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Reference is required');
  END IF;

  IF p_reason IS NULL OR TRIM(p_reason) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'A reason is required for manual credits');
  END IF;

  SELECT id INTO v_user_id
  FROM public.user_profiles
  WHERE LOWER(email) = LOWER(TRIM(p_user_email))
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No user found with email: ' || p_user_email);
  END IF;

  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE user_id = v_user_id
  LIMIT 1;

  IF v_wallet IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No wallet found for user');
  END IF;

  SELECT email INTO v_admin_email
  FROM public.user_profiles
  WHERE id = auth.uid()
  LIMIT 1;

  v_credited := public.credit_wallet_for_payment(
    v_user_id,
    v_wallet.id,
    p_amount,
    TRIM(p_reference),
    'Manual credit by admin: ' || TRIM(p_reason)
  );

  INSERT INTO public.manual_credit_audit_log (
    admin_id, admin_email, user_id, user_email, amount, reference,
    credit_source, reason, outcome
  ) VALUES (
    auth.uid(),
    v_admin_email,
    v_user_id,
    LOWER(TRIM(p_user_email)),
    p_amount,
    TRIM(p_reference),
    COALESCE(NULLIF(TRIM(p_credit_source), ''), 'manual'),
    TRIM(p_reason),
    CASE WHEN v_credited THEN 'credited' ELSE 'duplicate_skipped' END
  );

  IF v_credited THEN
    RETURN jsonb_build_object('success', true, 'already_credited', false, 'message', 'Wallet credited and logged');
  END IF;

  RETURN jsonb_build_object('success', true, 'already_credited', true, 'message', 'Reference already credited - no duplicate created (logged)');
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_manual_credit_wallet(TEXT, NUMERIC, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================================
-- 4. ENABLE RLS
-- ============================================================
ALTER TABLE public.manual_credit_audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RLS POLICIES (admin read-only; writes only via SECURITY DEFINER RPC)
-- ============================================================
DROP POLICY IF EXISTS "admin_read_manual_credit_audit_log" ON public.manual_credit_audit_log;
CREATE POLICY "admin_read_manual_credit_audit_log"
ON public.manual_credit_audit_log
FOR SELECT
TO authenticated
USING (public.is_admin_from_auth());

-- ============================================================
-- 6. BACKFILL: record the earlier manual credit for emzybadm@gmail.com
-- ============================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.wallet_transactions
    WHERE reference = 'MANUAL-BANK-emzybadm-20261002-1000'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.manual_credit_audit_log
    WHERE reference = 'MANUAL-BANK-emzybadm-20261002-1000'
  ) THEN
    INSERT INTO public.manual_credit_audit_log (
      admin_id, admin_email, user_id, user_email, amount, reference,
      credit_source, reason, outcome, created_at
    )
    SELECT
      NULL,
      'system-migration',
      up.id,
      'emzybadm@gmail.com',
      1000.00,
      'MANUAL-BANK-emzybadm-20261002-1000',
      'bank_transfer',
      'Bank transfer received 2 Oct 2026 and credited manually via migration',
      'credited',
      '2026-10-02 18:53:31+00'
    FROM public.user_profiles up
    WHERE LOWER(up.email) = 'emzybadm@gmail.com'
    LIMIT 1;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Audit backfill skipped: %', SQLERRM;
END $$;

NOTIFY pgrst, 'reload schema';
