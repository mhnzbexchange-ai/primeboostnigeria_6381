-- Migration: paystack_webhook_events
-- Logs all incoming Paystack webhook events for admin visibility

CREATE TABLE IF NOT EXISTS public.paystack_webhook_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL,
  reference     TEXT,
  email         TEXT,
  amount_kobo   BIGINT,
  status        TEXT NOT NULL DEFAULT 'received',
  payload       JSONB,
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paystack_webhook_events_created_at
  ON public.paystack_webhook_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_paystack_webhook_events_event_type
  ON public.paystack_webhook_events (event_type);

CREATE INDEX IF NOT EXISTS idx_paystack_webhook_events_reference
  ON public.paystack_webhook_events (reference);

ALTER TABLE public.paystack_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only admins (service_role) can read/write — no authenticated user access
-- The webhook API route uses the service role key via createClient (server-side)
-- so inserts bypass RLS. We add a restrictive policy so no regular user can read.
DROP POLICY IF EXISTS "admin_only_webhook_events" ON public.paystack_webhook_events;
CREATE POLICY "admin_only_webhook_events"
  ON public.paystack_webhook_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );
