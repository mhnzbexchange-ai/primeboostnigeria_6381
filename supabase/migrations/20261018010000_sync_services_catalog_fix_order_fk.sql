-- Fix: orders.service_id foreign key violation for YouTube (and other) orders.
--
-- ROOT CAUSE: public.services was seeded with an old catalogue (17 rows).
-- The app's catalogue (src/lib/pricing.ts) uses 33 service ids, so ids such as
-- svc-yt-*, svc-fb-* and svc-tg-subscribers did not exist in public.services and
-- INSERT INTO public.orders failed with "orders_service_id_fkey".
--
-- This migration upserts every service id used by the app so the FK always
-- resolves, and re-defines place_order_debit_wallet so that it refuses to
-- debit the wallet when the service does not exist (nothing is charged).

INSERT INTO public.services (id, platform, name, price_per_unit, min_qty, max_qty, delivery, quality, is_active) VALUES
  ('svc-tt-followers',            'TikTok',      'Followers',            10, 500,  100000,   'Usually starts within 1 hour',         'Premium',  true),
  ('svc-tt-likes',                'TikTok',      'Likes',                10, 500,  500000,   'Usually starts within 15 minutes',     'High',     true),
  ('svc-tt-views',                'TikTok',      'Views',                10, 500,  10000000, 'Usually starts within 10 minutes',     'Standard', true),
  ('svc-ig-followers',            'Instagram',   'Followers',            10, 500,  100000,   'Usually starts within 2 hours',        'Premium',  true),
  ('svc-ig-likes',                'Instagram',   'Likes',                10, 500,  50000,    'Usually starts within 30 minutes',     'High',     true),
  ('svc-ig-views',                'Instagram',   'Reel Views',           10, 500,  5000000,  'Usually starts within 20 minutes',     'Standard', true),
  ('svc-fb-followers',            'Facebook',    'Followers',            10, 1000, 100000,   'Usually starts within 2 hours',        'Premium',  true),
  ('svc-fb-page-likes',           'Facebook',    'Page Likes',           10, 1000, 100000,   'Usually starts within 2 hours',        'Premium',  true),
  ('svc-fb-post-likes',           'Facebook',    'Post Likes',           10, 1000, 500000,   'Usually starts within 30 minutes',     'High',     true),
  ('svc-fb-reels-likes',          'Facebook',    'Reels Likes',          10, 1000, 500000,   'Usually starts within 30 minutes',     'High',     true),
  ('svc-fb-reels-views',          'Facebook',    'Reels Views',          10, 1000, 10000000, 'Usually starts within 15 minutes',     'Standard', true),
  ('svc-fb-video-views',          'Facebook',    'Video Views',          10, 1000, 10000000, 'Usually starts within 15 minutes',     'Standard', true),
  ('svc-fb-comments',             'Facebook',    'Comments',             15, 1000, 50000,    'Usually starts within 1 hour',         'High',     true),
  ('svc-fb-shares',               'Facebook',    'Post Shares',          15, 1000, 100000,   'Usually starts within 1 hour',         'High',     true),
  ('svc-fb-live-views',           'Facebook',    'Live Video Views',     10, 1000, 5000000,  'Usually starts within 15 minutes',     'Standard', true),
  ('svc-fb-page-promotion',       'Facebook',    'Page Promotion',       10, 1000, 100000,   'Usually starts within 1 business day', 'Premium',  true),
  ('svc-fb-post-promotion',       'Facebook',    'Post Promotion',       10, 1000, 100000,   'Usually starts within 1 business day', 'Premium',  true),
  ('svc-fb-traffic-campaign',     'Facebook',    'Website Traffic',      10, 1000, 1000000,  'Usually starts within 1 business day', 'Premium',  true),
  ('svc-fb-engagement-campaign',  'Facebook',    'Engagement Campaign',  10, 1000, 1000000,  'Usually starts within 1 business day', 'High',     true),
  ('svc-fb-leads-campaign',       'Facebook',    'Lead Generation',      10, 1000, 1000000,  'Usually starts within 1 business day', 'Premium',  true),
  ('svc-fb-messages-campaign',    'Facebook',    'Messages Campaign',    10, 1000, 1000000,  'Usually starts within 1 business day', 'Premium',  true),
  ('svc-fb-sales-campaign',       'Facebook',    'Sales & Conversion',   10, 1000, 1000000,  'Usually starts within 1 business day', 'Premium',  true),
  ('svc-x-followers',             'X (Twitter)', 'Followers',            10, 500,  75000,    'Usually starts within 1 hour',         'Premium',  true),
  ('svc-x-likes',                 'X (Twitter)', 'Likes',                10, 500,  100000,   'Usually starts within 30 minutes',     'High',     true),
  ('svc-x-views',                 'X (Twitter)', 'Views',                10, 500,  5000000,  'Usually starts within 20 minutes',     'Standard', true),
  ('svc-sc-followers',            'Snapchat',    'Followers',            10, 500,  50000,    'Usually starts within 4 hours',        'Standard', true),
  ('svc-sc-views',                'Snapchat',    'Story Views',          10, 500,  500000,   'Usually starts within 15 minutes',     'High',     true),
  ('svc-tg-channel',              'Telegram',    'Channel Members',      10, 500,  200000,   'Usually starts within 2 hours',        'Premium',  true),
  ('svc-tg-group',                'Telegram',    'Group Members',        10, 500,  100000,   'Usually starts within 3 hours',        'High',     true),
  ('svc-tg-subscribers',          'Telegram',    'Channel Subscribers',  10, 500,  200000,   'Usually starts within 2 hours',        'Standard', true),
  ('svc-yt-likes',                'YouTube',     'Likes',                15, 500,  100000,   'Usually starts within 1 hour',         'High',     true),
  ('svc-yt-views',                'YouTube',     'Views',                20, 500,  10000000, 'Usually starts within 2 hours',        'Standard', true),
  ('svc-yt-subscribers',          'YouTube',     'Subscribers',          50, 500,  50000,    'Usually starts within 4 hours',        'Premium',  true)
ON CONFLICT (id) DO UPDATE SET
  platform       = EXCLUDED.platform,
  name           = EXCLUDED.name,
  price_per_unit = EXCLUDED.price_per_unit,
  min_qty        = EXCLUDED.min_qty,
  max_qty        = EXCLUDED.max_qty,
  delivery       = EXCLUDED.delivery,
  quality        = EXCLUDED.quality,
  is_active      = true;

-- Re-define the order RPC: refuse unknown services BEFORE any money moves.
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
  v_service_name TEXT;
  v_new_balance  NUMERIC;
  v_order_id     UUID;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid order amount');
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid quantity');
  END IF;

  SELECT name INTO v_service_name
  FROM public.services
  WHERE id = p_service_id AND is_active = true
  LIMIT 1;

  IF v_service_name IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'This service is currently unavailable. You have not been charged.'
    );
  END IF;

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

  INSERT INTO public.orders (
    user_id, service_id, platform, service_name,
    target_url, quantity, amount, order_status, progress
  ) VALUES (
    p_user_id, p_service_id, p_platform, v_service_name,
    p_target_url, p_quantity, p_amount, 'pending'::public.order_status, 0
  )
  RETURNING id INTO v_order_id;

  UPDATE public.wallets
  SET
    balance     = v_new_balance,
    total_spent = COALESCE(total_spent, 0) + p_amount,
    updated_at  = CURRENT_TIMESTAMP
  WHERE id = p_wallet_id;

  INSERT INTO public.wallet_transactions (
    user_id, wallet_id, transaction_type, source, amount, description, reference
  ) VALUES (
    p_user_id,
    p_wallet_id,
    'debit'::public.transaction_type,
    'order_payment'::public.transaction_source,
    p_amount,
    format('Order payment - %s %s', p_platform, v_service_name),
    v_order_id::TEXT
  );

  RETURN jsonb_build_object(
    'success',     true,
    'order_id',    v_order_id,
    'new_balance', v_new_balance
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order_debit_wallet(UUID, UUID, TEXT, TEXT, TEXT, INTEGER, NUMERIC) TO authenticated;

NOTIFY pgrst, 'reload schema';
