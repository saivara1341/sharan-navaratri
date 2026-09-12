CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college TEXT NOT NULL,
    degree TEXT NOT NULL,
    graduation_year TEXT NOT NULL DEFAULT '2026',
    role TEXT NOT NULL,
    duration TEXT NOT NULL DEFAULT '6 Months',
    linkedin TEXT,
    portfolio_or_social TEXT,
    statement_of_purpose TEXT NOT NULL,
    resume_url TEXT,
    status TEXT NOT NULL DEFAULT 'Received',
    interview_details JSONB DEFAULT NULL
);

ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.career_applications TO postgres, service_role;
GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.career_applications TO authenticated;