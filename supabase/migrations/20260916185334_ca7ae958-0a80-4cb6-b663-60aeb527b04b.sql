-- 1. Intern Onboarding Agreements Table
CREATE TABLE IF NOT EXISTS public.intern_onboarding_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    signature_text TEXT NOT NULL,
    govt_id_type TEXT NOT NULL,
    govt_id_number TEXT NOT NULL,
    college_id_number TEXT NOT NULL,
    college_name TEXT NOT NULL,
    rules_agreed BOOLEAN NOT NULL DEFAULT true,
    terms_agreed BOOLEAN NOT NULL DEFAULT true,
    nda_agreed BOOLEAN NOT NULL DEFAULT true,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.intern_onboarding_agreements ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.intern_onboarding_agreements TO postgres, service_role;
GRANT INSERT ON public.intern_onboarding_agreements TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.intern_onboarding_agreements TO authenticated;

DROP POLICY IF EXISTS "Allow public insert of onboarding agreements" ON public.intern_onboarding_agreements;
CREATE POLICY "Allow public insert of onboarding agreements"
    ON public.intern_onboarding_agreements FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own onboarding agreement" ON public.intern_onboarding_agreements;
CREATE POLICY "Users can read own onboarding agreement"
    ON public.intern_onboarding_agreements FOR SELECT TO authenticated
    USING (lower(email) = public.jwt_email() OR public.is_portal_admin());

DROP POLICY IF EXISTS "Admins manage onboarding agreements" ON public.intern_onboarding_agreements;
CREATE POLICY "Admins manage onboarding agreements"
    ON public.intern_onboarding_agreements FOR ALL TO authenticated
    USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());

DROP TRIGGER IF EXISTS tr_intern_onboarding_agreements_updated_at ON public.intern_onboarding_agreements;
CREATE TRIGGER tr_intern_onboarding_agreements_updated_at
    BEFORE UPDATE ON public.intern_onboarding_agreements
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_onboarding_agreements_email ON public.intern_onboarding_agreements(lower(email));

-- 2. Official Issued Certificates Ledger
CREATE TABLE IF NOT EXISTS public.issued_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    certificate_no TEXT NOT NULL UNIQUE,
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    role TEXT NOT NULL,
    college_name TEXT NOT NULL,
    college_id_number TEXT NOT NULL,
    govt_id_type TEXT NOT NULL,
    govt_id_masked TEXT NOT NULL,
    duration TEXT NOT NULL,
    start_date DATE NOT NULL,
    completion_date DATE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    grade TEXT NOT NULL DEFAULT 'Outstanding',
    issued_by TEXT NOT NULL DEFAULT 'Siddhi Dynamics LLP',
    verification_checksum TEXT NOT NULL,
    key_achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
    points_of_proof_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Valid'
);

ALTER TABLE public.issued_certificates ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.issued_certificates TO postgres, service_role;
GRANT SELECT ON public.issued_certificates TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.issued_certificates TO authenticated;

DROP POLICY IF EXISTS "Public can verify issued certificates" ON public.issued_certificates;
CREATE POLICY "Public can verify issued certificates"
    ON public.issued_certificates FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage certificates" ON public.issued_certificates;
CREATE POLICY "Admins manage certificates"
    ON public.issued_certificates FOR ALL TO authenticated
    USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());

DROP TRIGGER IF EXISTS tr_issued_certificates_updated_at ON public.issued_certificates;
CREATE TRIGGER tr_issued_certificates_updated_at
    BEFORE UPDATE ON public.issued_certificates
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_issued_certificates_no ON public.issued_certificates(upper(certificate_no));
CREATE INDEX IF NOT EXISTS idx_issued_certificates_email ON public.issued_certificates(lower(recipient_email));

-- 3. Intern Tasks Table
CREATE TABLE IF NOT EXISTS public.intern_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    assigned_to_role TEXT NOT NULL DEFAULT 'All',
    assigned_to_email TEXT,
    stipulated_deadline DATE NOT NULL,
    priority TEXT NOT NULL DEFAULT 'High',
    status TEXT NOT NULL DEFAULT 'Pending',
    created_by TEXT NOT NULL DEFAULT 'CEO'
);

ALTER TABLE public.intern_tasks ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.intern_tasks TO postgres, service_role;
GRANT SELECT, UPDATE ON public.intern_tasks TO authenticated;
GRANT INSERT, DELETE ON public.intern_tasks TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read tasks" ON public.intern_tasks;
CREATE POLICY "Authenticated users can read tasks"
    ON public.intern_tasks FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Interns can update task status" ON public.intern_tasks;
CREATE POLICY "Interns can update task status"
    ON public.intern_tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage intern tasks" ON public.intern_tasks;
CREATE POLICY "Admins manage intern tasks"
    ON public.intern_tasks FOR ALL TO authenticated
    USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());

DROP TRIGGER IF EXISTS tr_intern_tasks_updated_at ON public.intern_tasks;
CREATE TRIGGER tr_intern_tasks_updated_at
    BEFORE UPDATE ON public.intern_tasks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_intern_tasks_assigned_role ON public.intern_tasks(assigned_to_role);
CREATE INDEX IF NOT EXISTS idx_intern_tasks_deadline ON public.intern_tasks(stipulated_deadline);

-- 4. Intern Deadline Extensions Table
CREATE TABLE IF NOT EXISTS public.intern_deadline_extensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    task_id TEXT NOT NULL,
    task_title TEXT NOT NULL,
    intern_email TEXT NOT NULL,
    intern_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    requested_deadline DATE NOT NULL,
    original_deadline DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    admin_remarks TEXT,
    reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.intern_deadline_extensions ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.intern_deadline_extensions TO postgres, service_role;
GRANT SELECT, INSERT ON public.intern_deadline_extensions TO authenticated;
GRANT UPDATE, DELETE ON public.intern_deadline_extensions TO authenticated;

DROP POLICY IF EXISTS "Interns read own extensions or admins read all" ON public.intern_deadline_extensions;
CREATE POLICY "Interns read own extensions or admins read all"
    ON public.intern_deadline_extensions FOR SELECT TO authenticated
    USING (lower(intern_email) = public.jwt_email() OR public.is_portal_admin());

DROP POLICY IF EXISTS "Interns can submit extensions" ON public.intern_deadline_extensions;
CREATE POLICY "Interns can submit extensions"
    ON public.intern_deadline_extensions FOR INSERT TO authenticated
    WITH CHECK (lower(intern_email) = public.jwt_email() OR public.is_portal_admin());

DROP POLICY IF EXISTS "Admins manage extensions" ON public.intern_deadline_extensions;
CREATE POLICY "Admins manage extensions"
    ON public.intern_deadline_extensions FOR ALL TO authenticated
    USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());

CREATE INDEX IF NOT EXISTS idx_extensions_intern_email ON public.intern_deadline_extensions(lower(intern_email));

-- 5. Intern Data Requests Table
CREATE TABLE IF NOT EXISTS public.intern_data_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Client Engagement Data',
    intern_email TEXT NOT NULL,
    intern_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    admin_response TEXT,
    reviewed_at TIMESTAMPTZ
);

ALTER TABLE public.intern_data_requests ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.intern_data_requests TO postgres, service_role;
GRANT SELECT, INSERT ON public.intern_data_requests TO authenticated;
GRANT UPDATE, DELETE ON public.intern_data_requests TO authenticated;

DROP POLICY IF EXISTS "Interns read own data requests or admins read all" ON public.intern_data_requests;
CREATE POLICY "Interns read own data requests or admins read all"
    ON public.intern_data_requests FOR SELECT TO authenticated
    USING (lower(intern_email) = public.jwt_email() OR public.is_portal_admin());

DROP POLICY IF EXISTS "Interns can submit data requests" ON public.intern_data_requests;
CREATE POLICY "Interns can submit data requests"
    ON public.intern_data_requests FOR INSERT TO authenticated
    WITH CHECK (lower(intern_email) = public.jwt_email() OR public.is_portal_admin());

DROP POLICY IF EXISTS "Admins manage data requests" ON public.intern_data_requests;
CREATE POLICY "Admins manage data requests"
    ON public.intern_data_requests FOR ALL TO authenticated
    USING (public.is_portal_admin()) WITH CHECK (public.is_portal_admin());

CREATE INDEX IF NOT EXISTS idx_data_requests_intern_email ON public.intern_data_requests(lower(intern_email));

NOTIFY pgrst, 'reload schema';