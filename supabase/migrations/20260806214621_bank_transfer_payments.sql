-- PrimeBoost Nigeria - Bank Transfer Payments Module
-- Adds bank_transfer_payments table for manual payment verification flow

-- ============================================================
-- 1. STORAGE BUCKET for proof of payment uploads
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
DROP POLICY IF EXISTS "users_upload_own_payment_proofs" ON storage.objects;
CREATE POLICY "users_upload_own_payment_proofs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "users_view_own_payment_proofs" ON storage.objects;
CREATE POLICY "users_view_own_payment_proofs"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "admin_manage_payment_proofs" ON storage.objects;
CREATE POLICY "admin_manage_payment_proofs"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'payment-proofs' AND public.is_admin_from_auth())
WITH CHECK (bucket_id = 'payment-proofs' AND public.is_admin_from_auth());

-- ============================================================
-- 2. BANK TRANSFER PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bank_transfer_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  reference TEXT NOT NULL DEFAULT '',
  proof_url TEXT DEFAULT '',
  proof_path TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  admin_note TEXT DEFAULT '',
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bank_transfer_payments_user_id ON public.bank_transfer_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transfer_payments_status ON public.bank_transfer_payments(status);
CREATE INDEX IF NOT EXISTS idx_bank_transfer_payments_created_at ON public.bank_transfer_payments(created_at DESC);

-- ============================================================
-- 4. FUNCTIONS
-- ============================================================

-- Admin approve bank transfer: funds wallet and logs transaction
CREATE OR REPLACE FUNCTION public.approve_bank_transfer(payment_id UUID, admin_note_text TEXT DEFAULT '')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment RECORD;
  v_wallet RECORD;
  v_new_balance NUMERIC;
BEGIN
  -- Only admins can call this
  IF NOT public.is_admin_from_auth() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Fetch payment
  SELECT * INTO v_payment FROM public.bank_transfer_payments WHERE id = payment_id LIMIT 1;
  IF v_payment IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;
  IF v_payment.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment already processed');
  END IF;

  -- Fetch wallet
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_payment.user_id LIMIT 1;
  IF v_wallet IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  v_new_balance := COALESCE(v_wallet.balance, 0) + v_payment.amount;

  -- Update wallet
  UPDATE public.wallets
  SET
    balance = v_new_balance,
    total_funded = COALESCE(total_funded, 0) + v_payment.amount,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = v_wallet.id;

  -- Log transaction
  INSERT INTO public.wallet_transactions (
    user_id, wallet_id, transaction_type, source, amount, description, reference
  ) VALUES (
    v_payment.user_id,
    v_wallet.id,
    'credit'::public.transaction_type,
    'wallet_fund'::public.transaction_source,
    v_payment.amount,
    'Wallet funded via Bank Transfer',
    v_payment.reference
  );

  -- Mark payment approved
  UPDATE public.bank_transfer_payments
  SET
    status = 'approved',
    admin_note = admin_note_text,
    reviewed_by = auth.uid(),
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = payment_id;

  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$;

-- Admin reject bank transfer
CREATE OR REPLACE FUNCTION public.reject_bank_transfer(payment_id UUID, admin_note_text TEXT DEFAULT '')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment RECORD;
BEGIN
  IF NOT public.is_admin_from_auth() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  SELECT * INTO v_payment FROM public.bank_transfer_payments WHERE id = payment_id LIMIT 1;
  IF v_payment IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;
  IF v_payment.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment already processed');
  END IF;

  UPDATE public.bank_transfer_payments
  SET
    status = 'rejected',
    admin_note = admin_note_text,
    reviewed_by = auth.uid(),
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = payment_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================
ALTER TABLE public.bank_transfer_payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "users_manage_own_bank_transfer_payments" ON public.bank_transfer_payments;
CREATE POLICY "users_manage_own_bank_transfer_payments"
ON public.bank_transfer_payments FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_bank_transfer_payments" ON public.bank_transfer_payments;
CREATE POLICY "admin_full_access_bank_transfer_payments"
ON public.bank_transfer_payments FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- ============================================================
-- 7. TRIGGERS
-- ============================================================
DROP TRIGGER IF EXISTS set_bank_transfer_payments_updated_at ON public.bank_transfer_payments;
CREATE TRIGGER set_bank_transfer_payments_updated_at
  BEFORE UPDATE ON public.bank_transfer_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
