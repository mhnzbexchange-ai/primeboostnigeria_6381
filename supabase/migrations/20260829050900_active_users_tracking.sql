-- PrimeBoost Nigeria - Active Users Tracking
-- Adds last_seen field to user_profiles and secure RPC functions for aggregate counts

-- ============================================================
-- 1. ADD last_seen COLUMN TO user_profiles
-- ============================================================
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT NULL;

-- Index for efficient active-user queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_seen ON public.user_profiles(last_seen DESC);

-- ============================================================
-- 2. CONFIGURABLE ACTIVITY WINDOW (minutes)
--    Default: 30 minutes = "recently active"
-- ============================================================

-- ============================================================
-- 3. RPC: get_active_users_count
--    Returns ONLY aggregate numbers — no PII exposed to browser
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_active_users_count(activity_window_minutes INTEGER DEFAULT 30)
RETURNS TABLE(
  total_registered BIGINT,
  active_users BIGINT,
  active_today BIGINT,
  active_last_7_days BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  window_cutoff TIMESTAMPTZ;
  today_start TIMESTAMPTZ;
  week_start TIMESTAMPTZ;
BEGIN
  window_cutoff := NOW() - (activity_window_minutes || ' minutes')::INTERVAL;
  today_start   := DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC');
  week_start    := NOW() - INTERVAL '7 days';

  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT                                                          AS total_registered,
    COUNT(*) FILTER (WHERE last_seen >= window_cutoff)::BIGINT               AS active_users,
    COUNT(*) FILTER (WHERE last_seen >= today_start)::BIGINT                 AS active_today,
    COUNT(*) FILTER (WHERE last_seen >= week_start)::BIGINT                  AS active_last_7_days
  FROM public.user_profiles;
END;
$$;

-- ============================================================
-- 4. RPC: update_user_last_seen
--    Called by authenticated users to record their activity.
--    Only updates the caller's own row — no privilege escalation.
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_user_last_seen()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_profiles
  SET last_seen = NOW()
  WHERE id = auth.uid();
END;
$$;

-- ============================================================
-- 5. GRANT execute to authenticated & anon roles
--    get_active_users_count: anon can call (public stat, no PII)
--    update_user_last_seen: authenticated only
-- ============================================================
GRANT EXECUTE ON FUNCTION public.get_active_users_count(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_last_seen() TO authenticated;
