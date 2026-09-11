-- PrimeBoost Nigeria - Fix place_order_debit_wallet to match frontend 7-param signature
-- 
-- ROOT CAUSE: The previous function had 8 parameters including p_service_name TEXT.
-- The frontend calls the RPC with exactly 7 parameters (no p_service_name).
-- This migration replaces the function with the correct 7-parameter signature.
-- The service name is derived internally from the services table using p_service_id.
--
-- Frontend call signature (7 params):
--   p_user_id, p_wallet_id, p_service_id, p_platform, p_target_url, p_quantity, p_amount
--
-- This function atomically:
--   1. Verifies the caller is the authenticated user
--   2. Verifies the wallet belongs to the user
--   3. Checks sufficient balance (prevents negative balances)
--   4. Creates the order record
--   5. Debits the wallet
--   6. Inserts the wallet_transaction
-- All steps run in a single transaction — any failure rolls back everything.

-- Drop the old 8-parameter version first to avoid overload ambiguity
DROP FUNCTION IF EXISTS public.place_order_debit_wallet(UUID, UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, NUMERIC);

-- Create the correct 7-parameter version matching the frontend exactly
CREATE OR REPLACE FUNCTION public.place_order_debit_wallet(
  p_user_id    UUID,
  p_wallet_id  UUID,
  p_service_id TEXT,
  p_platform   TEXT,
  p_target_url TEXT,
  p_quantity   INTEGER,
  p_amount     NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet       RECORD;
  v_service      RECORD;
  v_service_name TEXT;
  v_new_balance  NUMERIC;
  v_order_id     UUID;
BEGIN
  -- Caller must be the authenticated user placing the order
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Validate amount is positive
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid order amount');
  END IF;

  -- Validate quantity is positive
  IF p_quantity <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid quantity');
  END IF;

  -- Look up service name from the services table (no need for frontend to pass it)
  SELECT name INTO v_service_name
  FROM public.services
  WHERE id = p_service_id AND is_active = true
  LIMIT 1;

  IF v_service_name IS NULL THEN
    -- Service not found or inactive — still allow order but use service_id as fallback name
    v_service_name := p_service_id;
  END IF;

  -- Lock the wallet row for this transaction to prevent race conditions
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE id = p_wallet_id AND user_id = p_user_id
  FOR UPDATE;

  IF v_wallet IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  -- Check sufficient balance (prevents negative wallet balances)
  IF v_wallet.balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance');
  END IF;

  v_new_balance := v_wallet.balance - p_amount;

  -- Create the order record
  INSERT INTO public.orders (
    user_id,
    service_id,
    platform,
    service_name,
    target_url,
    quantity,
    amount,
    order_status,
    progress
  ) VALUES (
    p_user_id,
    p_service_id,
    p_platform,
    v_service_name,
    p_target_url,
    p_quantity,
    p_amount,
    'pending'::public.order_status,
    0
  )
  RETURNING id INTO v_order_id;

  -- Debit the wallet atomically
  UPDATE public.wallets
  SET
    balance     = v_new_balance,
    total_spent = COALESCE(total_spent, 0) + p_amount,
    updated_at  = CURRENT_TIMESTAMP
  WHERE id = p_wallet_id;

  -- Record the wallet transaction
  INSERT INTO public.wallet_transactions (
    user_id,
    wallet_id,
    transaction_type,
    source,
    amount,
    description,
    reference
  ) VALUES (
    p_user_id,
    p_wallet_id,
    'debit'::public.transaction_type,
    'order_payment'::public.transaction_source,
    p_amount,
    format('Order payment - %s %s', p_platform, v_service_name),
    v_order_id::TEXT
  );

  -- Return success with order_id and new_balance for the frontend
  RETURN jsonb_build_object(
    'success',     true,
    'order_id',    v_order_id,
    'new_balance', v_new_balance
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Any error rolls back the entire transaction automatically
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.place_order_debit_wallet(UUID, UUID, TEXT, TEXT, TEXT, INTEGER, NUMERIC) TO authenticated;

-- Notify PostgREST to reload its schema cache so the new function is immediately available
NOTIFY pgrst, 'reload schema';
