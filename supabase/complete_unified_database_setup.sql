-- ==============================================================================
-- SIDDHI DYNAMICS & SHARAN NAVARATRI - COMPLETE UNIFIED DATABASE SETUP
-- Target Supabase Project: oiazysnimrdkwcubzzxd
-- Includes:
-- 1. Helper Functions & Triggers
-- 2. Core Siddhi Dynamics Tables & Security Policies (RLS)
-- 3. Sharan Navaratri Multi-Tenant Mandapam Tables & Security Policies (RLS)
-- 4. Advertising System Tables (Direct Contact — No Payment Processing)
-- 5. Storage Buckets & Policies
-- 6. PostgREST Schema Cache Reload
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. HELPER FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_portal_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'ssaivaraprasad51@gmail.com'
  );
$$;

CREATE OR REPLACE FUNCTION public.jwt_email()
RETURNS text LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT lower(coalesce((select auth.jwt() ->> 'email'), ''));
$$;

CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS text LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT coalesce((select auth.jwt() -> 'user_metadata' ->> 'role'), 'client');
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------------------------
-- 2. CORE PLATFORM TABLES
-- ------------------------------------------------------------------------------

-- Portal Users
CREATE TABLE IF NOT EXISTS public.portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL UNIQUE,
  full_name text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'employee', 'client', 'agency', 'investor')),
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Invited', 'Suspended', 'Deactivated')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portal_users ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portal_users TO authenticated;
GRANT ALL ON public.portal_users TO service_role;

DROP POLICY IF EXISTS "Admins full access portal_users" ON public.portal_users;
CREATE POLICY "Admins full access portal_users" ON public.portal_users FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Users read own portal_user" ON public.portal_users;
CREATE POLICY "Users read own portal_user" ON public.portal_users FOR SELECT TO authenticated
  USING (lower(email) = public.jwt_email());

-- Admin Preassigned Roles
CREATE TABLE IF NOT EXISTS public.admin_preassigned_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'employee', 'client', 'agency', 'investor')),
  assigned_by text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_preassigned_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_preassigned_roles TO authenticated;
GRANT ALL ON public.admin_preassigned_roles TO service_role;

DROP POLICY IF EXISTS "Admins manage preassigned roles" ON public.admin_preassigned_roles;
CREATE POLICY "Admins manage preassigned roles" ON public.admin_preassigned_roles FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Users lookup preassigned role" ON public.admin_preassigned_roles;
CREATE POLICY "Users lookup preassigned role" ON public.admin_preassigned_roles FOR SELECT TO authenticated
  USING (lower(email) = public.jwt_email());

-- Contact Submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  name text,
  email text NOT NULL,
  phone text,
  company text,
  service text,
  budget text,
  timeline text,
  message text,
  status text NOT NULL DEFAULT 'New Request',
  progress integer NOT NULL DEFAULT 0,
  is_public boolean NOT NULL DEFAULT false,
  bounty_reward text,
  assigned_to text,
  consent_given boolean NOT NULL DEFAULT false,
  consent_at timestamptz,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  inquiry_type text DEFAULT 'general_inquiry',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT INSERT ON public.contact_submissions TO anon;
GRANT ALL ON public.contact_submissions TO service_role;

DROP POLICY IF EXISTS "Admins full access submissions" ON public.contact_submissions;
CREATE POLICY "Admins full access submissions" ON public.contact_submissions FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Public insert submissions" ON public.contact_submissions;
CREATE POLICY "Public insert submissions" ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users read own submissions" ON public.contact_submissions;
CREATE POLICY "Users read own submissions" ON public.contact_submissions FOR SELECT TO authenticated
  USING (lower(email) = public.jwt_email());

-- Project Waitlist
CREATE TABLE IF NOT EXISTS public.project_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  project_type text,
  description text,
  source text DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_waitlist ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.project_waitlist TO authenticated;
GRANT INSERT ON public.project_waitlist TO anon;
GRANT ALL ON public.project_waitlist TO service_role;

DROP POLICY IF EXISTS "Public insert project_waitlist" ON public.project_waitlist;
CREATE POLICY "Public insert project_waitlist" ON public.project_waitlist FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read project_waitlist" ON public.project_waitlist;
CREATE POLICY "Admins read project_waitlist" ON public.project_waitlist FOR SELECT TO authenticated
  USING ((select public.is_portal_admin()));

-- Clients
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  phone text,
  industry text,
  website text,
  status text NOT NULL DEFAULT 'Lead' CHECK (status IN ('Lead','Active','Paused','Churned')),
  tier text NOT NULL DEFAULT 'Standard' CHECK (tier IN ('Standard','Growth','Enterprise')),
  owner_email text,
  agency_email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;

DROP POLICY IF EXISTS "Admins manage clients" ON public.clients;
CREATE POLICY "Admins manage clients" ON public.clients FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

DROP POLICY IF EXISTS "Clients read own record" ON public.clients;
CREATE POLICY "Clients read own record" ON public.clients FOR SELECT TO authenticated
  USING (lower(contact_email) = public.jwt_email());

-- Requirements
CREATE TABLE IF NOT EXISTS public.requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Critical')),
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Approved','In Progress','Completed','Archived')),
  assigned_to text,
  due_date date,
  estimated_hours numeric(6,2),
  tags text[] DEFAULT '{}'::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.requirements TO authenticated;
GRANT ALL ON public.requirements TO service_role;

DROP POLICY IF EXISTS "Admins manage requirements" ON public.requirements;
CREATE POLICY "Admins manage requirements" ON public.requirements FOR ALL TO authenticated
  USING ((select public.is_portal_admin())) WITH CHECK ((select public.is_portal_admin()));

-- (Career roles, applications, intern agreements, certificates removed — no career section)
-- (admin_payment_settings removed — ads use direct contact, no bank/UPI payment processing)

-- ------------------------------------------------------------------------------
-- 3. SHARAN NAVARATRI MULTI-TENANT MANDAPAM TABLES
-- ------------------------------------------------------------------------------

-- Seasons Table
CREATE TABLE IF NOT EXISTS public.navaratri_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REGISTRATION_OPEN', 'LIVE', 'ENDED', 'ARCHIVED')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_seasons ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_seasons TO anon, authenticated;
GRANT ALL ON public.navaratri_seasons TO service_role;

DROP POLICY IF EXISTS "Public view seasons" ON public.navaratri_seasons;
CREATE POLICY "Public view seasons" ON public.navaratri_seasons FOR SELECT TO anon, authenticated USING (true);

-- Mandapams Table
CREATE TABLE IF NOT EXISTS public.navaratri_mandapams (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  season_id uuid REFERENCES public.navaratri_seasons(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  devi_name text NOT NULL DEFAULT 'Maa Durga',
  address text NOT NULL,
  area text NOT NULL,
  city text NOT NULL,
  state text NOT NULL DEFAULT 'Telangana',
  pincode text NOT NULL,
  latitude double precision,
  longitude double precision,
  verification_status text NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'SUSPENDED', 'ARCHIVED')),
  owner_user_id uuid,
  organizer_name text,
  organizer_mobile text,
  organizer_email text,
  logo_url text,
  cover_image_url text,
  contact_phone text,
  whatsapp_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_mandapams ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navaratri_mandapams TO anon, authenticated;
GRANT ALL ON public.navaratri_mandapams TO service_role;

CREATE INDEX IF NOT EXISTS idx_mandapams_slug ON public.navaratri_mandapams(slug);
CREATE INDEX IF NOT EXISTS idx_mandapams_city_area ON public.navaratri_mandapams(city, area);
CREATE INDEX IF NOT EXISTS idx_mandapams_status ON public.navaratri_mandapams(verification_status);

DROP POLICY IF EXISTS "Public view verified mandapams" ON public.navaratri_mandapams;
CREATE POLICY "Public view verified mandapams" ON public.navaratri_mandapams FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public create mandapams" ON public.navaratri_mandapams;
CREATE POLICY "Public create mandapams" ON public.navaratri_mandapams FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public update mandapams" ON public.navaratri_mandapams;
CREATE POLICY "Public update mandapams" ON public.navaratri_mandapams FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Mandapam Members
CREATE TABLE IF NOT EXISTS public.navaratri_mandapam_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'CONTENT_MANAGER' CHECK (role IN ('MANDAPAM_ADMIN', 'CONTENT_MANAGER', 'BOOKING_MANAGER', 'COMMUNITY_MANAGER')),
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_mandapam_members ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navaratri_mandapam_members TO authenticated;
GRANT ALL ON public.navaratri_mandapam_members TO service_role;

-- Standard Festival Days
CREATE TABLE IF NOT EXISTS public.navaratri_standard_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES public.navaratri_seasons(id) ON DELETE CASCADE,
  day_number integer NOT NULL CHECK (day_number BETWEEN 1 AND 10),
  date date,
  devi_name text NOT NULL,
  telugu_devi_name text,
  hindi_devi_name text,
  color_code text,
  description text,
  suggested_offerings text,
  suggested_items text,
  standard_activities text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_standard_days ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_standard_days TO anon, authenticated;
GRANT ALL ON public.navaratri_standard_days TO service_role;

DROP POLICY IF EXISTS "Public read standard festival days" ON public.navaratri_standard_days;
CREATE POLICY "Public read standard festival days" ON public.navaratri_standard_days FOR SELECT TO anon, authenticated USING (true);

-- Mandapam Day Customizations
CREATE TABLE IF NOT EXISTS public.navaratri_mandapam_day_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  season_id uuid REFERENCES public.navaratri_seasons(id) ON DELETE CASCADE,
  day_number integer NOT NULL CHECK (day_number BETWEEN 1 AND 10),
  date date,
  use_standard_devi boolean DEFAULT true,
  custom_devi_name text,
  use_standard_pooja boolean DEFAULT true,
  custom_pooja_timings text,
  use_standard_naivedhyam boolean DEFAULT true,
  custom_naivedhyam text,
  use_standard_prasadam boolean DEFAULT true,
  custom_prasadam text,
  use_standard_items boolean DEFAULT true,
  custom_items_to_bring text,
  annadanam_enabled boolean DEFAULT false,
  annadanam_start_time text,
  annadanam_end_time text,
  annadanam_location text,
  annadanam_expected_count integer DEFAULT 0,
  annadanam_notes text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(mandapam_id, day_number)
);
ALTER TABLE public.navaratri_mandapam_day_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_mandapam_day_settings TO anon, authenticated;
GRANT ALL ON public.navaratri_mandapam_day_settings TO authenticated, service_role;

DROP POLICY IF EXISTS "Public read day settings" ON public.navaratri_mandapam_day_settings;
CREATE POLICY "Public read day settings" ON public.navaratri_mandapam_day_settings FOR SELECT TO anon, authenticated USING (true);

-- Alankarana (Daily Physical Darshan Uploads)
CREATE TABLE IF NOT EXISTS public.navaratri_alankaranas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  season_id uuid REFERENCES public.navaratri_seasons(id) ON DELETE SET NULL,
  date date NOT NULL,
  title text NOT NULL,
  devi_name text NOT NULL,
  description text,
  image_url text NOT NULL,
  published boolean DEFAULT true,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_alankaranas ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_alankaranas TO anon, authenticated;
GRANT ALL ON public.navaratri_alankaranas TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_alankaranas_mandapam_date ON public.navaratri_alankaranas(mandapam_id, date);

DROP POLICY IF EXISTS "Public view alankaranas" ON public.navaratri_alankaranas;
CREATE POLICY "Public view alankaranas" ON public.navaratri_alankaranas FOR SELECT TO anon, authenticated USING (published = true);

-- Services & Service Slots
CREATE TABLE IF NOT EXISTS public.navaratri_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  type text NOT NULL,
  name text NOT NULL,
  description text,
  instructions text,
  enabled boolean DEFAULT true,
  booking_enabled boolean DEFAULT true,
  items_required text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_services ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_services TO anon, authenticated;
GRANT ALL ON public.navaratri_services TO authenticated, service_role;

DROP POLICY IF EXISTS "Public view services" ON public.navaratri_services;
CREATE POLICY "Public view services" ON public.navaratri_services FOR SELECT TO anon, authenticated USING (enabled = true);

CREATE TABLE IF NOT EXISTS public.navaratri_service_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES public.navaratri_services(id) ON DELETE CASCADE,
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  capacity integer NOT NULL DEFAULT 50,
  booked_count integer NOT NULL DEFAULT 0,
  walkin_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'FULL', 'CANCELLED')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_service_slots ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_service_slots TO anon, authenticated;
GRANT ALL ON public.navaratri_service_slots TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_slots_mandapam_date ON public.navaratri_service_slots(mandapam_id, date);

DROP POLICY IF EXISTS "Public view slots" ON public.navaratri_service_slots;
CREATE POLICY "Public view slots" ON public.navaratri_service_slots FOR SELECT TO anon, authenticated USING (true);

-- Bookings & Walk-In Register
CREATE TABLE IF NOT EXISTS public.navaratri_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid REFERENCES public.navaratri_service_slots(id) ON DELETE SET NULL,
  service_id uuid NOT NULL REFERENCES public.navaratri_services(id) ON DELETE CASCADE,
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  booking_code text NOT NULL UNIQUE,
  user_id uuid,
  name text NOT NULL,
  mobile text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  booking_type text NOT NULL DEFAULT 'ONLINE' CHECK (booking_type IN ('ONLINE', 'WALK_IN')),
  status text NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'NO_SHOW', 'COMPLETED')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_bookings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.navaratri_bookings TO anon, authenticated;
GRANT ALL ON public.navaratri_bookings TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_bookings_mandapam ON public.navaratri_bookings(mandapam_id);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.navaratri_bookings(booking_code);

DROP POLICY IF EXISTS "Public create bookings" ON public.navaratri_bookings;
CREATE POLICY "Public create bookings" ON public.navaratri_bookings FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Devotees view own bookings by mobile" ON public.navaratri_bookings;
CREATE POLICY "Devotees view own bookings by mobile" ON public.navaratri_bookings FOR SELECT TO anon, authenticated USING (true);

-- Activities & Events
CREATE TABLE IF NOT EXISTS public.navaratri_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('Pooja', 'Annadanam', 'Game', 'Cultural Program', 'Competition', 'Bhajan', 'Children Activity', 'Special Program', 'Pallaki Seva', 'Nimarjanam', 'Other')),
  description text,
  date date NOT NULL,
  start_time text NOT NULL,
  end_time text,
  location text,
  capacity integer,
  booking_enabled boolean DEFAULT false,
  instructions text,
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_activities ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_activities TO anon, authenticated;
GRANT ALL ON public.navaratri_activities TO authenticated, service_role;

DROP POLICY IF EXISTS "Public view activities" ON public.navaratri_activities;
CREATE POLICY "Public view activities" ON public.navaratri_activities FOR SELECT TO anon, authenticated USING (published = true);

-- Pallaki Seva & Dheeksha & Nimarjanam
CREATE TABLE IF NOT EXISTS public.navaratri_pallaki_seva (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  title text NOT NULL,
  date date NOT NULL,
  start_time text NOT NULL,
  end_time text,
  route_details text,
  darshan_points text,
  coordinator_name text,
  coordinator_phone text,
  live_status text DEFAULT 'SCHEDULED' CHECK (live_status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED')),
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_pallaki_seva ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_pallaki_seva TO anon, authenticated;
GRANT ALL ON public.navaratri_pallaki_seva TO authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.navaratri_dheeksha_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  dheeksha_name text NOT NULL DEFAULT 'Bhavani Dheeksha',
  mala_dharana_date date,
  viramam_date date,
  daily_niyamas text,
  irumudi_pooja_date date,
  contact_guru_name text,
  contact_guru_phone text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_dheeksha_programs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_dheeksha_programs TO anon, authenticated;
GRANT ALL ON public.navaratri_dheeksha_programs TO authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.navaratri_nimarjanam_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  nimarjanam_date date NOT NULL,
  shobha_yatra_start_time text,
  designated_ghat text NOT NULL,
  city text NOT NULL,
  vehicle_type text,
  vehicle_pass_number text,
  queue_status text DEFAULT 'NORMAL' CHECK (queue_status IN ('WAITING', 'ON_ROUTE', 'AT_GHAT', 'COMPLETED')),
  emergency_contact text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_nimarjanam_schedules ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_nimarjanam_schedules TO anon, authenticated;
GRANT ALL ON public.navaratri_nimarjanam_schedules TO authenticated, service_role;

-- Announcements
CREATE TABLE IF NOT EXISTS public.navaratri_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  priority text DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_announcements ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.navaratri_announcements TO anon, authenticated;
GRANT ALL ON public.navaratri_announcements TO authenticated, service_role;

-- Questions & Answers
CREATE TABLE IF NOT EXISTS public.navaratri_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id uuid,
  asker_name text NOT NULL,
  question text NOT NULL,
  language text DEFAULT 'en',
  status text DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'REPORTED', 'HIDDEN')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_questions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.navaratri_questions TO anon, authenticated;
GRANT ALL ON public.navaratri_questions TO authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.navaratri_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.navaratri_questions(id) ON DELETE CASCADE,
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  responder_name text NOT NULL,
  is_official boolean DEFAULT true,
  answer text NOT NULL,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_answers ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.navaratri_answers TO anon, authenticated;
GRANT ALL ON public.navaratri_answers TO authenticated, service_role;

-- Follows & Reminders
CREATE TABLE IF NOT EXISTS public.navaratri_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id uuid,
  device_token text,
  notification_preferences jsonb DEFAULT '{"alankarana": true, "announcements": true, "reminders": true}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_follows ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON public.navaratri_follows TO anon, authenticated;
GRANT ALL ON public.navaratri_follows TO authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.navaratri_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id text NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id uuid,
  target_type text NOT NULL CHECK (target_type IN ('POOJA', 'SERVICE', 'ANNADANAM', 'ACTIVITY', 'PALLAKI')),
  target_id text NOT NULL,
  reminder_minutes_before integer DEFAULT 30,
  scheduled_time timestamptz NOT NULL,
  status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'CANCELLED')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_reminders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.navaratri_reminders TO anon, authenticated;
GRANT ALL ON public.navaratri_reminders TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 4. ADVERTISING SYSTEM (Direct Contact — No Payment Processing)
-- Advertisers submit details; admin contacts them to confirm & publish.
-- navaratri_ad_packages, navaratri_ad_impressions, navaratri_ad_clicks removed.
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.navaratri_advertisers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  business_name text NOT NULL,
  category text NOT NULL,
  phone text NOT NULL,
  email text,
  website text,
  address text NOT NULL,
  city text NOT NULL,
  verification_status text DEFAULT 'APPROVED',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_advertisers ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.navaratri_advertisers TO anon, authenticated;
GRANT ALL ON public.navaratri_advertisers TO authenticated, service_role;

DROP POLICY IF EXISTS "Public register advertiser" ON public.navaratri_advertisers;
CREATE POLICY "Public register advertiser" ON public.navaratri_advertisers FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public read advertisers" ON public.navaratri_advertisers;
CREATE POLICY "Public read advertisers" ON public.navaratri_advertisers FOR SELECT TO anon, authenticated USING (true);

-- Advertisement Submissions (status managed by admin after direct contact; no payment gating)
CREATE TABLE IF NOT EXISTS public.navaratri_advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id uuid NOT NULL REFERENCES public.navaratri_advertisers(id) ON DELETE CASCADE,
  title text NOT NULL,
  business_name text NOT NULL,
  description text NOT NULL,
  image_url text,
  cta_text text DEFAULT 'Contact Store',
  cta_url text,
  target_city text NOT NULL,
  target_area text,
  target_mandapam_id text REFERENCES public.navaratri_mandapams(id),
  preferred_frame text NOT NULL DEFAULT 'BOTTOM' CHECK (preferred_frame IN ('TOP', 'BOTTOM', 'BOTH')),
  campaign_duration_label text,            -- e.g. "1 Day Booster", "3 Days Rush", "9 Days Pass"
  campaign_duration_days integer,          -- 1, 3, or 9
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL DEFAULT CURRENT_DATE + interval '3 days',
  status text NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'PAUSED', 'EXPIRED')),
  rejection_reason text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.navaratri_advertisements ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.navaratri_advertisements TO anon, authenticated;
GRANT ALL ON public.navaratri_advertisements TO authenticated, service_role;

DROP POLICY IF EXISTS "Public view approved ads" ON public.navaratri_advertisements;
CREATE POLICY "Public view approved ads" ON public.navaratri_advertisements FOR SELECT TO anon, authenticated
  USING (status IN ('APPROVED', 'ACTIVE') OR (select public.is_portal_admin()));

DROP POLICY IF EXISTS "Public insert ads" ON public.navaratri_advertisements;
CREATE POLICY "Public insert ads" ON public.navaratri_advertisements FOR INSERT TO anon, authenticated WITH CHECK (true);

-- (navaratri_ad_impressions and navaratri_ad_clicks removed — no analytics tracking needed for direct-contact ads)

-- ------------------------------------------------------------------------------
-- 5. STORAGE BUCKETS SETUP
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('media', 'media', true, 26214400, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','image/avif','video/mp4']),
  ('client-documents', 'client-documents', false, 52428800, ARRAY['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/plain']),
  ('project-attachments', 'project-attachments', true, 52428800, ARRAY['application/pdf','image/jpeg','image/png','image/webp','application/zip','text/plain']),
  ('admin-assets', 'admin-assets', true, 26214400, ARRAY['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('mandapam-media', 'mandapam-media', true, 26214400, ARRAY['image/jpeg','image/png','image/webp']),
  ('alankarana-photos', 'alankarana-photos', true, 26214400, ARRAY['image/jpeg','image/png','image/webp']),
  ('advertisement-creatives', 'advertisement-creatives', true, 26214400, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS
DROP POLICY IF EXISTS "Public view media" ON storage.objects;
CREATE POLICY "Public view media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('media', 'project-attachments', 'admin-assets', 'mandapam-media', 'alankarana-photos', 'advertisement-creatives'));

DROP POLICY IF EXISTS "Allow uploads to public buckets" ON storage.objects;
CREATE POLICY "Allow uploads to public buckets" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id IN ('media', 'project-attachments', 'mandapam-media', 'alankarana-photos', 'advertisement-creatives'));

-- ------------------------------------------------------------------------------
-- 6. RELOAD SCHEMA CACHE
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
