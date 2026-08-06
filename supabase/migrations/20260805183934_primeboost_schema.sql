-- PrimeBoost Nigeria - Full Schema Migration
-- Tables: user_profiles, wallets, wallet_transactions, services, orders, referrals

-- ============================================================
-- 1. TYPES (ENUMs)
-- ============================================================
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

DROP TYPE IF EXISTS public.order_status CASCADE;
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'active', 'completed', 'failed', 'cancelled');

DROP TYPE IF EXISTS public.transaction_type CASCADE;
CREATE TYPE public.transaction_type AS ENUM ('credit', 'debit');

DROP TYPE IF EXISTS public.transaction_source CASCADE;
CREATE TYPE public.transaction_source AS ENUM ('wallet_fund', 'order_payment', 'referral_bonus', 'refund', 'withdrawal');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- User Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  role public.user_role DEFAULT 'user'::public.user_role,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  avatar_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Wallets (one per user)
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  balance NUMERIC(12, 2) DEFAULT 0.00,
  total_funded NUMERIC(12, 2) DEFAULT 0.00,
  total_spent NUMERIC(12, 2) DEFAULT 0.00,
  referral_earnings NUMERIC(12, 2) DEFAULT 0.00,
  pending_referral_withdrawal NUMERIC(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  transaction_type public.transaction_type NOT NULL,
  source public.transaction_source NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  reference TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Services catalog
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  price_per_unit NUMERIC(10, 4) NOT NULL,
  min_qty INTEGER NOT NULL DEFAULT 100,
  max_qty INTEGER NOT NULL DEFAULT 100000,
  delivery TEXT NOT NULL DEFAULT '< 1 hour',
  quality TEXT NOT NULL DEFAULT 'Standard',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL REFERENCES public.services(id),
  platform TEXT NOT NULL,
  service_name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  order_status public.order_status DEFAULT 'pending'::public.order_status,
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  commission_earned NUMERIC(12, 2) DEFAULT 0.00,
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_referral_code ON public.user_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);

-- ============================================================
-- 4. FUNCTIONS
-- ============================================================

-- Generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  prefix TEXT;
BEGIN
  prefix := UPPER(REGEXP_REPLACE(SPLIT_PART(user_name, ' ', 1), '[^A-Za-z]', '', 'g'));
  IF LENGTH(prefix) > 8 THEN prefix := SUBSTRING(prefix, 1, 8); END IF;
  IF LENGTH(prefix) < 2 THEN prefix := 'PRIME'; END IF;
  code := 'PRIME-' || prefix || FLOOR(RANDOM() * 9000 + 1000)::TEXT;
  RETURN code;
END;
$$;

-- Handle new user signup: create profile + wallet
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  ref_code TEXT;
  referrer_profile_id UUID;
  new_wallet_id UUID;
BEGIN
  -- Generate unique referral code
  ref_code := public.generate_referral_code(COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.user_profiles WHERE referral_code = ref_code) LOOP
    ref_code := 'PRIME-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
  END LOOP;

  -- Check if referred by someone
  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    SELECT id INTO referrer_profile_id
    FROM public.user_profiles
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code'
    LIMIT 1;
  END IF;

  -- Insert user profile
  INSERT INTO public.user_profiles (id, email, full_name, phone, role, referral_code, referred_by, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role,
    ref_code,
    referrer_profile_id,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  -- Create wallet for user
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id)
  RETURNING id INTO new_wallet_id;

  -- If referred, create referral record
  IF referrer_profile_id IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_id)
    VALUES (referrer_profile_id, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Admin check function (safe, uses auth metadata)
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.id = auth.uid()
  AND (au.raw_user_meta_data->>'role' = 'admin' OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 5. ENABLE RLS
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. RLS POLICIES
-- ============================================================

-- user_profiles
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_user_profiles" ON public.user_profiles;
CREATE POLICY "admin_full_access_user_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- wallets
DROP POLICY IF EXISTS "users_manage_own_wallets" ON public.wallets;
CREATE POLICY "users_manage_own_wallets"
ON public.wallets FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_wallets" ON public.wallets;
CREATE POLICY "admin_full_access_wallets"
ON public.wallets FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- wallet_transactions
DROP POLICY IF EXISTS "users_manage_own_wallet_transactions" ON public.wallet_transactions;
CREATE POLICY "users_manage_own_wallet_transactions"
ON public.wallet_transactions FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_wallet_transactions" ON public.wallet_transactions;
CREATE POLICY "admin_full_access_wallet_transactions"
ON public.wallet_transactions FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- services (public read, admin write)
DROP POLICY IF EXISTS "public_read_services" ON public.services;
CREATE POLICY "public_read_services"
ON public.services FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_services" ON public.services;
CREATE POLICY "admin_manage_services"
ON public.services FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- orders
DROP POLICY IF EXISTS "users_manage_own_orders" ON public.orders;
CREATE POLICY "users_manage_own_orders"
ON public.orders FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_orders" ON public.orders;
CREATE POLICY "admin_full_access_orders"
ON public.orders FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- referrals
DROP POLICY IF EXISTS "users_view_own_referrals" ON public.referrals;
CREATE POLICY "users_view_own_referrals"
ON public.referrals FOR SELECT TO authenticated
USING (referrer_id = auth.uid() OR referred_id = auth.uid());

DROP POLICY IF EXISTS "admin_full_access_referrals" ON public.referrals;
CREATE POLICY "admin_full_access_referrals"
ON public.referrals FOR ALL TO authenticated
USING (public.is_admin_from_auth()) WITH CHECK (public.is_admin_from_auth());

-- ============================================================
-- 7. TRIGGERS
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_wallets_updated_at ON public.wallets;
CREATE TRIGGER set_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 8. SEED SERVICES
-- ============================================================
INSERT INTO public.services (id, platform, name, price_per_unit, min_qty, max_qty, delivery, quality) VALUES
  ('svc-tt-followers', 'TikTok', 'Followers', 1.5, 100, 100000, '< 1 hour', 'Premium'),
  ('svc-tt-likes', 'TikTok', 'Likes', 0.8, 50, 500000, '< 15 min', 'High'),
  ('svc-tt-views', 'TikTok', 'Views', 0.09, 1000, 10000000, '< 10 min', 'Standard'),
  ('svc-tt-comments', 'TikTok', 'Comments', 15.0, 10, 5000, '< 2 hours', 'Premium'),
  ('svc-tt-shares', 'TikTok', 'Shares', 2.5, 50, 50000, '< 1 hour', 'Standard'),
  ('svc-ig-followers', 'Instagram', 'Followers', 1.8, 100, 100000, '< 2 hours', 'Premium'),
  ('svc-ig-likes', 'Instagram', 'Likes', 0.8, 50, 50000, '< 30 min', 'High'),
  ('svc-ig-views', 'Instagram', 'Reel Views', 0.12, 500, 5000000, '< 20 min', 'Standard'),
  ('svc-ig-comments', 'Instagram', 'Comments', 18.0, 10, 3000, '< 3 hours', 'Premium'),
  ('svc-tg-channel', 'Telegram', 'Channel Members', 2.0, 100, 200000, '< 2 hours', 'Premium'),
  ('svc-tg-group', 'Telegram', 'Group Members', 2.2, 100, 100000, '< 3 hours', 'High'),
  ('svc-tg-views', 'Telegram', 'Post Views', 0.05, 1000, 20000000, '< 5 min', 'Standard'),
  ('svc-sc-views', 'Snapchat', 'Story Views', 0.6, 100, 500000, '< 15 min', 'High'),
  ('svc-sc-followers', 'Snapchat', 'Followers', 2.5, 100, 50000, '< 4 hours', 'Standard'),
  ('svc-x-followers', 'X (Twitter)', 'Followers', 1.2, 100, 75000, '< 1 hour', 'Premium'),
  ('svc-x-likes', 'X (Twitter)', 'Likes', 0.9, 50, 100000, '< 30 min', 'High'),
  ('svc-x-retweets', 'X (Twitter)', 'Retweets', 3.0, 50, 20000, '< 1 hour', 'Standard')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 9. MOCK USERS (Demo credentials)
-- ============================================================
DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  user_uuid UUID := gen_random_uuid();
  admin_wallet_id UUID;
  user_wallet_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'admin@primeboostng.com', crypt('PrimeAdmin2026!', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'PrimeBoost Admin', 'role', 'admin', 'phone', '+2348000000001'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[], 'role', 'admin'),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Create regular user
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES (
    user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
    'adaeze.chukwu@gmail.com', crypt('PrimeUser2026!', gen_salt('bf', 10)), now(), now(), now(),
    jsonb_build_object('full_name', 'Adaeze Chukwu', 'role', 'user', 'phone', '+2348012345678'),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
    false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
  ) ON CONFLICT (id) DO NOTHING;

  -- Fund demo user wallet with sample balance
  SELECT id INTO user_wallet_id FROM public.wallets WHERE user_id = user_uuid LIMIT 1;
  IF user_wallet_id IS NOT NULL THEN
    UPDATE public.wallets
    SET balance = 24750, total_funded = 30000, total_spent = 5250, referral_earnings = 8420, pending_referral_withdrawal = 2500
    WHERE id = user_wallet_id;

    -- Sample wallet transactions
    INSERT INTO public.wallet_transactions (user_id, wallet_id, transaction_type, source, amount, description, created_at)
    VALUES
      (user_uuid, user_wallet_id, 'credit'::public.transaction_type, 'wallet_fund'::public.transaction_source, 10000, 'Wallet funded via Paystack', now() - INTERVAL '1 day'),
      (user_uuid, user_wallet_id, 'debit'::public.transaction_type, 'order_payment'::public.transaction_source, 7500, 'Order payment - TikTok Followers', now() - INTERVAL '2 days'),
      (user_uuid, user_wallet_id, 'credit'::public.transaction_type, 'referral_bonus'::public.transaction_source, 500, 'Referral bonus - Emeka Nwosu', now() - INTERVAL '2 days'),
      (user_uuid, user_wallet_id, 'debit'::public.transaction_type, 'order_payment'::public.transaction_source, 1600, 'Order payment - Instagram Likes', now() - INTERVAL '1 day'),
      (user_uuid, user_wallet_id, 'credit'::public.transaction_type, 'wallet_fund'::public.transaction_source, 20000, 'Wallet funded via Bank Transfer', now() - INTERVAL '3 days')
    ON CONFLICT (id) DO NOTHING;

    -- Sample orders for demo user
    INSERT INTO public.orders (user_id, service_id, platform, service_name, target_url, quantity, amount, order_status, progress, started_at, completed_at)
    VALUES
      (user_uuid, 'svc-tt-followers', 'TikTok', 'Followers', 'tiktok.com/@adaeze_creates', 5000, 7500, 'completed'::public.order_status, 100, now() - INTERVAL '2 days', now() - INTERVAL '2 days'),
      (user_uuid, 'svc-ig-likes', 'Instagram', 'Likes', 'instagram.com/p/Cxyz123', 2000, 1600, 'active'::public.order_status, 78, now() - INTERVAL '1 day', null),
      (user_uuid, 'svc-tg-channel', 'Telegram', 'Channel Members', 't.me/adaeze_news', 10000, 20000, 'processing'::public.order_status, 45, now() - INTERVAL '1 day', null),
      (user_uuid, 'svc-x-followers', 'X (Twitter)', 'Followers', 'x.com/adaeze_creates', 1000, 1200, 'completed'::public.order_status, 100, now() - INTERVAL '3 days', now() - INTERVAL '3 days'),
      (user_uuid, 'svc-sc-views', 'Snapchat', 'Story Views', 'snapchat.com/add/adaeze', 5000, 3000, 'completed'::public.order_status, 100, now() - INTERVAL '4 days', now() - INTERVAL '4 days'),
      (user_uuid, 'svc-ig-followers', 'Instagram', 'Followers', 'instagram.com/adaeze_fashion', 3000, 5400, 'failed'::public.order_status, 12, now() - INTERVAL '5 days', null)
    ON CONFLICT (id) DO NOTHING;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
