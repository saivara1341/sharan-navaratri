-- Admin Preassigned Roles
-- When admin adds an email here, the PortalGateway will auto-assign the role
-- on that user's first Google OAuth sign-in.

CREATE TABLE IF NOT EXISTS public.admin_preassigned_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  role text NOT NULL DEFAULT 'client'
    CHECK (role IN ('client','agency','employee','intern','investor','partner')),
  notes text,
  -- if role='client', optionally link billing to an agency (by agency email)
  linked_agency_email text,
  -- if role='agency', their default commission percentage
  commission_pct numeric(5,2) DEFAULT 0,
  added_by text NOT NULL DEFAULT 'admin',
  added_at timestamptz NOT NULL DEFAULT now(),
  applied_at timestamptz,       -- set when the user first signs in and role is auto-applied
  CONSTRAINT admin_preassigned_roles_email_key UNIQUE (email)
);

-- Only admins (service_role) can read/write this table
ALTER TABLE public.admin_preassigned_roles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_preassigned_roles FROM anon, authenticated;
GRANT ALL ON public.admin_preassigned_roles TO service_role;

-- Index for fast lookup on sign-in
CREATE INDEX IF NOT EXISTS admin_preassigned_roles_email_idx
  ON public.admin_preassigned_roles (lower(email));
