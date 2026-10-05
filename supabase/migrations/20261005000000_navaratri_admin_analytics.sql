-- Platform analytics visible only to the authenticated Navaratri administrator.

CREATE TABLE IF NOT EXISTS public.navaratri_analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('QR_SCAN', 'AD_CLICK', 'AD_IMPRESSION')),
  mandapam_id text,
  ad_id text,
  visitor_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS navaratri_analytics_event_created_idx
  ON public.navaratri_analytics_events (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS navaratri_analytics_mandapam_idx
  ON public.navaratri_analytics_events (mandapam_id, event_type)
  WHERE mandapam_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS navaratri_analytics_ad_idx
  ON public.navaratri_analytics_events (ad_id, event_type)
  WHERE ad_id IS NOT NULL;

ALTER TABLE public.navaratri_analytics_events ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.navaratri_analytics_events TO anon, authenticated;
GRANT SELECT ON public.navaratri_analytics_events TO authenticated;
GRANT ALL ON public.navaratri_analytics_events TO service_role;

DROP POLICY IF EXISTS "Public record Navaratri analytics" ON public.navaratri_analytics_events;
CREATE POLICY "Public record Navaratri analytics"
  ON public.navaratri_analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    event_type IN ('QR_SCAN', 'AD_CLICK', 'AD_IMPRESSION')
    AND length(visitor_id) BETWEEN 8 AND 100
  );

DROP POLICY IF EXISTS "Admin read Navaratri analytics" ON public.navaratri_analytics_events;
CREATE POLICY "Admin read Navaratri analytics"
  ON public.navaratri_analytics_events
  FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()));

-- Organizer audit records contain user-agent and session data. Restrict reads
-- to the authenticated platform administrator while retaining public inserts.
DROP POLICY IF EXISTS "Mandapam view own logins" ON public.navaratri_organizer_logins;
DROP POLICY IF EXISTS "Admin read organizer logins" ON public.navaratri_organizer_logins;
CREATE POLICY "Admin read organizer logins"
  ON public.navaratri_organizer_logins
  FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Public insert organizer logins" ON public.navaratri_organizer_logins;
CREATE POLICY "Authenticated record organizer logins"
  ON public.navaratri_organizer_logins
  FOR INSERT TO authenticated
  WITH CHECK (
    (select public.is_portal_admin())
    OR EXISTS (
      SELECT 1 FROM public.navaratri_mandapams m
      WHERE m.id::text = mandapam_id
        AND m.owner_user_id = (select auth.uid())
    )
  );

ALTER TABLE public.navaratri_organizer_logins
  DROP CONSTRAINT IF EXISTS navaratri_organizer_logins_login_mode_check;
ALTER TABLE public.navaratri_organizer_logins
  ADD CONSTRAINT navaratri_organizer_logins_login_mode_check
  CHECK (login_mode IN ('mobile', 'email', 'google'));

CREATE INDEX IF NOT EXISTS navaratri_mandapams_owner_user_idx
  ON public.navaratri_mandapams (owner_user_id)
  WHERE owner_user_id IS NOT NULL;

-- Organizer changes now use Supabase Auth ownership instead of a browser-only
-- Mandapam ID/passcode. Public directory reads remain available.
DROP POLICY IF EXISTS "Public create mandapams" ON public.navaratri_mandapams;
DROP POLICY IF EXISTS "Anyone can register mandapam" ON public.navaratri_mandapams;
DROP POLICY IF EXISTS "Public update mandapams" ON public.navaratri_mandapams;
DROP POLICY IF EXISTS "Organizer create owned mandapam" ON public.navaratri_mandapams;
DROP POLICY IF EXISTS "Organizer update owned mandapam" ON public.navaratri_mandapams;
DROP POLICY IF EXISTS "Admin manage all mandapams" ON public.navaratri_mandapams;

CREATE POLICY "Organizer create owned mandapam"
  ON public.navaratri_mandapams
  FOR INSERT TO authenticated
  WITH CHECK (owner_user_id = (select auth.uid()) OR (select public.is_portal_admin()));

CREATE POLICY "Organizer update owned mandapam"
  ON public.navaratri_mandapams
  FOR UPDATE TO authenticated
  USING (owner_user_id = (select auth.uid()) OR (select public.is_portal_admin()))
  WITH CHECK (owner_user_id = (select auth.uid()) OR (select public.is_portal_admin()));

CREATE POLICY "Admin manage all mandapams"
  ON public.navaratri_mandapams
  FOR DELETE TO authenticated
  USING ((select public.is_portal_admin()));

NOTIFY pgrst, 'reload schema';
