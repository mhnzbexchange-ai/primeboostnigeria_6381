-- PrimeBoost Nigeria - Secure server-side wallet debit for orders
-- Replaces client-side wallet update in OrderFormWizard

-- Atomically:
--   1. Verifies user owns the wallet and has sufficient balance
--   2. Creates the order record
--   3. Debits the wallet
--   4. Inserts the wallet_transaction
-- Returns JSONB with success flag and new_balance or error message.

CREATE OR REPLACE FUNCTION public.place_order_debit_wallet(
  p_user_id      UUID,
  p_wallet_id    UUID,
  p_service_id   TEXT,
  p_platform     TEXT,
  p_service_name TEXT,
  p_target_url   TEXT,
  p_quantity     INTEGER,
  p_amount       NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet        RECORD;
  v_service       RECORD;
  v_new_balance   NUMERIC;
  v_order_id      UUID;
BEGIN
  -- Caller must be the user placing the order
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Validate service exists and is active
  SELECT * INTO v_service FROM public.services WHERE id = p_service_id AND is_active = true LIMIT 1;
  IF v_service IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Service not found or inactive');
  END IF;

  -- Validate quantity bounds
  IF p_quantity < v_service.min_qty OR p_quantity > v_service.max_qty THEN
    RETURN jsonb_build_object('success', false, 'error',
      format('Quantity must be between %s and %s', v_service.min_qty, v_service.max_qty));
  END IF;

  -- Validate amount is positive
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid order amount');
  END IF;

  -- Lock the wallet row for this transaction
  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE id = p_wallet_id AND user_id = p_user_id
  FOR UPDATE;

  IF v_wallet IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
  END IF;

  IF v_wallet.balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance');
  END IF;

  v_new_balance := v_wallet.balance - p_amount;

  -- Create the order
  INSERT INTO public.orders (
    user_id, service_id, platform, service_name,
    target_url, quantity, amount, order_status, progress
  ) VALUES (
    p_user_id, p_service_id, p_platform, p_service_name,
    p_target_url, p_quantity, p_amount, 'pending'::public.order_status, 0
  )
  RETURNING id INTO v_order_id;

  -- Debit the wallet
  UPDATE public.wallets
  SET
    balance    = v_new_balance,
    total_spent = COALESCE(total_spent, 0) + p_amount,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_wallet_id;

  -- Record the transaction
  INSERT INTO public.wallet_transactions (
    user_id, wallet_id, transaction_type, source,
    amount, description, reference
  ) VALUES (
    p_user_id, p_wallet_id, 'debit'::public.transaction_type,
    'order_payment'::public.transaction_source,
    p_amount,
    format('Order payment - %s %s', p_platform, p_service_name),
    v_order_id::TEXT
  );

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'new_balance', v_new_balance
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order_debit_wallet(UUID, UUID, TEXT, TEXT, TEXT, TEXT, INTEGER, NUMERIC) TO authenticated;
