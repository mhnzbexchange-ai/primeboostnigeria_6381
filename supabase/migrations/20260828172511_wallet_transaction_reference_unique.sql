-- Fix: Enforce unique constraint on wallet_transactions.reference
-- This prevents double-crediting when both /api/paystack/verify and
-- /api/webhooks/paystack fire concurrently for the same payment.
-- The UNIQUE constraint is the atomic, database-level idempotency guard.

-- Add unique constraint on reference (only for non-empty references)
-- Using a partial unique index so empty/null references are not affected
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_transactions_reference_unique
  ON public.wallet_transactions (reference)
  WHERE reference IS NOT NULL AND reference <> '';

-- Also create a Postgres function that atomically credits the wallet
-- and inserts the transaction in a single call, returning whether it
-- actually ran (true) or was a duplicate (false).
CREATE OR REPLACE FUNCTION public.credit_wallet_for_payment(
  p_user_id      UUID,
  p_wallet_id    UUID,
  p_amount       NUMERIC,
  p_reference    TEXT,
  p_description  TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inserted BOOLEAN := FALSE;
BEGIN
  -- Try to insert the transaction record first.
  -- If the reference already exists the unique index will raise a
  -- unique_violation which we catch below — wallet is NOT updated.
  INSERT INTO public.wallet_transactions (
    user_id,
    wallet_id,
    transaction_type,
    source,
    amount,
    reference,
    description
  ) VALUES (
    p_user_id,
    p_wallet_id,
    'credit'::public.transaction_type,
    'wallet_fund'::public.transaction_source,
    p_amount,
    p_reference,
    p_description
  );

  -- Only reaches here if insert succeeded (no duplicate)
  UPDATE public.wallets
  SET
    balance      = balance      + p_amount,
    total_funded = total_funded + p_amount,
    updated_at   = CURRENT_TIMESTAMP
  WHERE id = p_wallet_id
    AND user_id = p_user_id;

  v_inserted := TRUE;
  RETURN v_inserted;

EXCEPTION
  WHEN unique_violation THEN
    -- Reference already processed — do nothing, return false
    RETURN FALSE;
END;
$$;
