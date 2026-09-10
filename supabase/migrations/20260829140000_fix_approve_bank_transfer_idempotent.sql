-- PrimeBoost Nigeria - Fix approve_bank_transfer to use idempotent credit RPC
-- Prevents double-crediting if admin accidentally approves the same payment twice.
-- The credit_wallet_for_payment function uses a UNIQUE index on reference to prevent duplicates.

CREATE OR REPLACE FUNCTION public.approve_bank_transfer(payment_id UUID, admin_note_text TEXT DEFAULT '')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payment    RECORD;
  v_wallet     RECORD;
  v_credited   BOOLEAN;
  v_new_balance NUMERIC;
BEGIN
  -- Only admins can call this
  IF NOT public.is_admin_from_auth() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Fetch payment and lock the row to prevent concurrent approvals
  SELECT * INTO v_payment
  FROM public.bank_transfer_payments
  WHERE id = payment_id
  FOR UPDATE;

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

  -- Use the idempotent credit function (protected by UNIQUE index on reference)
  -- This prevents double-crediting even if approve is called twice concurrently
  SELECT public.credit_wallet_for_payment(
    v_payment.user_id,
    v_wallet.id,
    v_payment.amount,
    COALESCE(NULLIF(v_payment.reference, ''), 'BT-' || payment_id::TEXT),
    'Wallet funded via Bank Transfer'
  ) INTO v_credited;

  -- Mark payment approved regardless (idempotency guard is in credit function)
  UPDATE public.bank_transfer_payments
  SET
    status      = 'approved',
    admin_note  = admin_note_text,
    reviewed_by = auth.uid(),
    reviewed_at = CURRENT_TIMESTAMP,
    updated_at  = CURRENT_TIMESTAMP
  WHERE id = payment_id;

  -- Get updated balance for response
  SELECT balance INTO v_new_balance FROM public.wallets WHERE id = v_wallet.id;

  RETURN jsonb_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'already_credited', NOT v_credited
  );
END;
$$;
