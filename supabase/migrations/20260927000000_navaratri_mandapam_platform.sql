-- ==============================================================================
-- NAVARATRI MANDAPAM MULTI-TENANT PLATFORM MIGRATION
-- Production-ready schema with RLS, Indexes, and Constraints
-- ==============================================================================

-- 1. SEASONS TABLE
CREATE TABLE IF NOT EXISTS public.navaratri_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REGISTRATION_OPEN', 'LIVE', 'ENDED', 'ARCHIVED')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MANDAPAMS TABLE
CREATE TABLE IF NOT EXISTS public.navaratri_mandapams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES public.navaratri_seasons(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  devi_name TEXT NOT NULL DEFAULT 'Maa Durga',
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Telangana',
  pincode TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'SUSPENDED', 'ARCHIVED')),
  owner_user_id UUID,
  organizer_name TEXT,
  organizer_mobile TEXT,
  organizer_email TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  contact_phone TEXT,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mandapams_slug ON public.navaratri_mandapams(slug);
CREATE INDEX IF NOT EXISTS idx_mandapams_city_area ON public.navaratri_mandapams(city, area);
CREATE INDEX IF NOT EXISTS idx_mandapams_status ON public.navaratri_mandapams(verification_status);

-- 3. MANDAPAM MEMBERS (Team & Role Management)
CREATE TABLE IF NOT EXISTS public.navaratri_mandapam_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'CONTENT_MANAGER' CHECK (role IN ('MANDAPAM_ADMIN', 'CONTENT_MANAGER', 'BOOKING_MANAGER', 'COMMUNITY_MANAGER')),
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. STANDARD FESTIVAL DAYS (Central Knowledge Base)
CREATE TABLE IF NOT EXISTS public.navaratri_standard_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID REFERENCES public.navaratri_seasons(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 10),
  date DATE,
  devi_name TEXT NOT NULL,
  telugu_devi_name TEXT,
  hindi_devi_name TEXT,
  color_code TEXT,
  description TEXT,
  suggested_offerings TEXT,
  suggested_items TEXT,
  standard_activities TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. MANDAPAM DAY CUSTOMIZATIONS
CREATE TABLE IF NOT EXISTS public.navaratri_mandapam_day_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  season_id UUID REFERENCES public.navaratri_seasons(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 10),
  date DATE,
  use_standard_devi BOOLEAN DEFAULT true,
  custom_devi_name TEXT,
  use_standard_pooja BOOLEAN DEFAULT true,
  custom_pooja_timings TEXT,
  use_standard_naivedhyam BOOLEAN DEFAULT true,
  custom_naivedhyam TEXT,
  use_standard_prasadam BOOLEAN DEFAULT true,
  custom_prasadam TEXT,
  use_standard_items BOOLEAN DEFAULT true,
  custom_items_to_bring TEXT,
  annadanam_enabled BOOLEAN DEFAULT false,
  annadanam_start_time TEXT,
  annadanam_end_time TEXT,
  annadanam_location TEXT,
  annadanam_expected_count INTEGER DEFAULT 0,
  annadanam_notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(mandapam_id, day_number)
);

-- 6. ALANKARANA (Daily Physical Darshan Uploads)
CREATE TABLE IF NOT EXISTS public.navaratri_alankaranas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  season_id UUID REFERENCES public.navaratri_seasons(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  devi_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  published BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alankaranas_mandapam_date ON public.navaratri_alankaranas(mandapam_id, date);

-- 7. SERVICES & SERVICE SLOTS
CREATE TABLE IF NOT EXISTS public.navaratri_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  enabled BOOLEAN DEFAULT true,
  booking_enabled BOOLEAN DEFAULT true,
  items_required TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_service_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.navaratri_services(id) ON DELETE CASCADE,
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 50,
  booked_count INTEGER NOT NULL DEFAULT 0,
  walkin_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'FULL', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_slots_mandapam_date ON public.navaratri_service_slots(mandapam_id, date);

-- 8. BOOKINGS & WALK-IN REGISTER
CREATE TABLE IF NOT EXISTS public.navaratri_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES public.navaratri_service_slots(id) ON DELETE SET NULL,
  service_id UUID NOT NULL REFERENCES public.navaratri_services(id) ON DELETE CASCADE,
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  booking_code TEXT NOT NULL UNIQUE,
  user_id UUID,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  booking_type TEXT NOT NULL DEFAULT 'ONLINE' CHECK (booking_type IN ('ONLINE', 'WALK_IN')),
  status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'NO_SHOW', 'COMPLETED')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_mandapam ON public.navaratri_bookings(mandapam_id);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.navaratri_bookings(booking_code);

-- 9. ACTIVITIES & EVENTS
CREATE TABLE IF NOT EXISTS public.navaratri_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Pooja', 'Annadanam', 'Game', 'Cultural Program', 'Competition', 'Bhajan', 'Children Activity', 'Special Program', 'Pallaki Seva', 'Nimarjanam', 'Other')),
  description TEXT,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  location TEXT,
  capacity INTEGER,
  booking_enabled BOOLEAN DEFAULT false,
  instructions TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. PALLAKI SEVA (Procession) & DHEEKSHA & NIMARJANAM
CREATE TABLE IF NOT EXISTS public.navaratri_pallaki_seva (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  route_details TEXT,
  darshan_points TEXT,
  coordinator_name TEXT,
  coordinator_phone TEXT,
  live_status TEXT DEFAULT 'SCHEDULED' CHECK (live_status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED')),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_dheeksha_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  dheeksha_name TEXT NOT NULL DEFAULT 'Bhavani Dheeksha',
  mala_dharana_date DATE,
  viramam_date DATE,
  daily_niyamas TEXT,
  irumudi_pooja_date DATE,
  contact_guru_name TEXT,
  contact_guru_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_nimarjanam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  nimarjanam_date DATE NOT NULL,
  shobha_yatra_start_time TEXT,
  designated_ghat TEXT NOT NULL,
  city TEXT NOT NULL,
  vehicle_type TEXT,
  vehicle_pass_number TEXT,
  queue_status TEXT DEFAULT 'NORMAL' CHECK (queue_status IN ('WAITING', 'ON_ROUTE', 'AT_GHAT', 'COMPLETED')),
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.navaratri_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. COMMUNITY QUESTIONS & ANSWERS
CREATE TABLE IF NOT EXISTS public.navaratri_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id UUID,
  asker_name TEXT NOT NULL,
  question TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'REPORTED', 'HIDDEN')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.navaratri_questions(id) ON DELETE CASCADE,
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  responder_name TEXT NOT NULL,
  is_official BOOLEAN DEFAULT true,
  answer TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. CITIZEN FOLLOWS & REMINDERS
CREATE TABLE IF NOT EXISTS public.navaratri_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id UUID,
  device_token TEXT,
  notification_preferences JSONB DEFAULT '{"alankarana": true, "announcements": true, "reminders": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandapam_id UUID NOT NULL REFERENCES public.navaratri_mandapams(id) ON DELETE CASCADE,
  user_id UUID,
  target_type TEXT NOT NULL CHECK (target_type IN ('POOJA', 'SERVICE', 'ANNADANAM', 'ACTIVITY', 'PALLAKI')),
  target_id TEXT NOT NULL,
  reminder_minutes_before INTEGER DEFAULT 30,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. ADVERTISING SYSTEM TABLES (Low-Cost Local Ads)
CREATE TABLE IF NOT EXISTS public.navaratri_ad_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_inr INTEGER NOT NULL,
  duration_days INTEGER NOT NULL,
  impression_limit INTEGER NOT NULL,
  placement_type TEXT NOT NULL,
  targeting_enabled BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_advertisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  verification_status TEXT DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES public.navaratri_advertisers(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.navaratri_ad_packages(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cta_text TEXT DEFAULT 'Contact Store',
  cta_url TEXT,
  target_city TEXT NOT NULL,
  target_area TEXT,
  target_mandapam_id UUID REFERENCES public.navaratri_mandapams(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'PAUSED', 'EXPIRED')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_ad_impressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.navaratri_advertisements(id) ON DELETE CASCADE,
  placement TEXT NOT NULL,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_ad_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES public.navaratri_advertisements(id) ON DELETE CASCADE,
  placement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. AUDIT LOGS & REPORTS
CREATE TABLE IF NOT EXISTS public.navaratri_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'DISMISSED')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.navaratri_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.navaratri_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_mandapams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_mandapam_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_standard_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_mandapam_day_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_alankaranas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_service_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_pallaki_seva ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_dheeksha_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_nimarjanam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_ad_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navaratri_advertisements ENABLE ROW LEVEL SECURITY;

-- Public READ for published / verified content
CREATE POLICY "Public read verified mandapams" ON public.navaratri_mandapams FOR SELECT USING (true);
CREATE POLICY "Public read alankaranas" ON public.navaratri_alankaranas FOR SELECT USING (published = true);
CREATE POLICY "Public read services" ON public.navaratri_services FOR SELECT USING (enabled = true);
CREATE POLICY "Public read service slots" ON public.navaratri_service_slots FOR SELECT USING (true);
CREATE POLICY "Public read standard days" ON public.navaratri_standard_days FOR SELECT USING (true);
CREATE POLICY "Public read day settings" ON public.navaratri_mandapam_day_settings FOR SELECT USING (true);
CREATE POLICY "Public read activities" ON public.navaratri_activities FOR SELECT USING (published = true);
CREATE POLICY "Public read pallaki seva" ON public.navaratri_pallaki_seva FOR SELECT USING (published = true);
CREATE POLICY "Public read dheeksha" ON public.navaratri_dheeksha_programs FOR SELECT USING (true);
CREATE POLICY "Public read nimarjanam" ON public.navaratri_nimarjanam_schedules FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.navaratri_announcements FOR SELECT USING (published = true);
CREATE POLICY "Public read questions" ON public.navaratri_questions FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read answers" ON public.navaratri_answers FOR SELECT USING (true);
CREATE POLICY "Public read active ads" ON public.navaratri_advertisements FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public read ad packages" ON public.navaratri_ad_packages FOR SELECT USING (active = true);

-- Citizen INSERT for bookings, questions, follows, reminders
CREATE POLICY "Anyone can create bookings" ON public.navaratri_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view booking by code" ON public.navaratri_bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can submit questions" ON public.navaratri_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can follow mandapams" ON public.navaratri_follows FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can set reminders" ON public.navaratri_reminders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can register mandapam" ON public.navaratri_mandapams FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit ads" ON public.navaratri_advertisements FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can register as advertiser" ON public.navaratri_advertisers FOR INSERT WITH CHECK (true);
