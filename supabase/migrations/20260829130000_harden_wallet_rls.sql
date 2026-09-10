-- PrimeBoost Nigeria - Harden wallet RLS
-- Prevent users from directly updating wallet balance from the client.
-- Wallets should only be readable by users; all writes go through SECURITY DEFINER RPCs.

-- Drop the overly-permissive ALL policy for regular users
DROP POLICY IF EXISTS "users_manage_own_wallets" ON public.wallets;

-- Users can only SELECT their own wallet — no direct INSERT/UPDATE/DELETE
CREATE POLICY "users_read_own_wallet"
ON public.wallets FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Wallet INSERT is handled by the handle_new_user() trigger (SECURITY DEFINER)
-- Wallet UPDATE is handled by credit_wallet_for_payment() and place_order_debit_wallet() RPCs (SECURITY DEFINER)
-- Admin retains full access via the existing admin_full_access_wallets policy

-- Similarly, prevent users from directly inserting wallet_transactions
-- (they should only be created by SECURITY DEFINER RPCs)
DROP POLICY IF EXISTS "users_manage_own_wallet_transactions" ON public.wallet_transactions;

-- Users can only SELECT their own transactions
CREATE POLICY "users_read_own_wallet_transactions"
ON public.wallet_transactions FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Prevent users from directly updating their own orders (status, amount, etc.)
-- Orders should only be updated by admins or server-side processes
DROP POLICY IF EXISTS "users_manage_own_orders" ON public.orders;

-- Users can INSERT new orders (via RPC or direct insert — RPC is preferred)
-- and SELECT their own orders, but NOT update or delete them
CREATE POLICY "users_insert_own_orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_read_own_orders"
ON public.orders FOR SELECT TO authenticated
USING (user_id = auth.uid());
