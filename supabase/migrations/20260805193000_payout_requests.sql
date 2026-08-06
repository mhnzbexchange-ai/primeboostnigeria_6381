-- PrimeBoost Nigeria - Payout Requests & Bank Accounts Migration

-- ============================================================
-- 1. TYPES (ENUMs)
-- ============================================================
DROP TYPE IF EXISTS public.payout_status CASCADE;
CREATE TYPE public.payout_status AS ENUM ('pending', 'approved', 'rejected', 'processing', 'completed');

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Bank Accounts (saved bank accounts per user)
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Payout Requests
CREATE TABLE IF NOT EXISTS public.payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE RESTRICT,
  amount NUMERIC(12, 2) NOT NULL,
  status public.payout_status DEFAULT 'pending'::public.payout_status,
  note TEXT DEFAULT '',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_user_id ON public.payout_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON public.payout_requests(status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_created_at ON public.payout_requests(created_at DESC);

-- ============================================================
-- 4. ENABLE RLS
-- ============================================================
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RLS POLICIES
-- ============================================================

-- bank_accounts
DROP POLICY IF EXISTS "users_manage_own_bank_accounts" ON public.bank_accounts;
CREATE POLICY "users_manage_own_bank_accounts"
ON public.bank_accounts FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_bank_accounts" ON public.bank_accounts;
CREATE POLICY "admin_full_access_bank_accounts"
ON public.bank_accounts FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- payout_requests
DROP POLICY IF EXISTS "users_manage_own_payout_requests" ON public.payout_requests;
CREATE POLICY "users_manage_own_payout_requests"
ON public.payout_requests FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_payout_requests" ON public.payout_requests;
CREATE POLICY "admin_full_access_payout_requests"
ON public.payout_requests FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- ============================================================
-- 6. TRIGGERS
-- ============================================================
DROP TRIGGER IF EXISTS set_bank_accounts_updated_at ON public.bank_accounts;
CREATE TRIGGER set_bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_payout_requests_updated_at ON public.payout_requests;
CREATE TRIGGER set_payout_requests_updated_at
  BEFORE UPDATE ON public.payout_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 7. MOCK DATA
-- ============================================================
DO $$
DECLARE
  existing_user_id UUID;
  bank_acc_id UUID;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_profiles'
  ) THEN
    SELECT id INTO existing_user_id FROM public.user_profiles WHERE role = 'user' LIMIT 1;

    IF existing_user_id IS NOT NULL THEN
      -- Insert sample bank accounts
      INSERT INTO public.bank_accounts (id, user_id, bank_name, account_number, account_name, is_default)
      VALUES
        (gen_random_uuid(), existing_user_id, 'Guaranty Trust Bank', '0123456789', 'Adaeze Chukwu', true),
        (gen_random_uuid(), existing_user_id, 'Access Bank', '9876543210', 'Adaeze Chukwu', false)
      ON CONFLICT (id) DO NOTHING;

      -- Get the default bank account
      SELECT id INTO bank_acc_id FROM public.bank_accounts WHERE user_id = existing_user_id AND is_default = true LIMIT 1;

      IF bank_acc_id IS NOT NULL THEN
        -- Insert sample payout requests
        INSERT INTO public.payout_requests (id, user_id, bank_account_id, amount, status, note, processed_at, created_at)
        VALUES
          (gen_random_uuid(), existing_user_id, bank_acc_id, 5000.00, 'completed'::public.payout_status, '', now() - INTERVAL '5 days', now() - INTERVAL '6 days'),
          (gen_random_uuid(), existing_user_id, bank_acc_id, 3200.00, 'completed'::public.payout_status, '', now() - INTERVAL '12 days', now() - INTERVAL '13 days'),
          (gen_random_uuid(), existing_user_id, bank_acc_id, 2500.00, 'pending'::public.payout_status, '', null, now() - INTERVAL '1 day')
        ON CONFLICT (id) DO NOTHING;
      END IF;
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Payout mock data insertion failed: %', SQLERRM;
END $$;
