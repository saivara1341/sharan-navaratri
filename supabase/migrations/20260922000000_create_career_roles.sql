-- ==============================================================================
-- Migration: Create career_roles table and seed default job postings
-- Description: Dedicated table for storing job descriptions, requirements,
-- compensation, and terms for careers/internships at Siddhi Dynamics.
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.career_roles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    employment_type TEXT NOT NULL,
    compensation TEXT NOT NULL,
    certificate_policy TEXT,
    lor_policy TEXT,
    workflow_details TEXT,
    target_audience TEXT,
    tagline TEXT,
    durations TEXT[] NOT NULL DEFAULT '{}',
    overview TEXT NOT NULL,
    key_responsibilities TEXT[] NOT NULL DEFAULT '{}',
    learning_outcomes TEXT[] NOT NULL DEFAULT '{}',
    interlinking_feature TEXT,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.career_roles ENABLE ROW LEVEL SECURITY;

-- 3. Grants
GRANT ALL ON public.career_roles TO postgres, service_role;
GRANT SELECT ON public.career_roles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.career_roles TO authenticated;

-- 4. Policies
-- Allow anyone (public visitors) to view active job roles
DROP POLICY IF EXISTS "Allow public read of active career_roles" ON public.career_roles;
CREATE POLICY "Allow public read of active career_roles"
    ON public.career_roles
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_portal_admin());

-- Allow portal admins full management
DROP POLICY IF EXISTS "Admins can insert career_roles" ON public.career_roles;
CREATE POLICY "Admins can insert career_roles"
    ON public.career_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_portal_admin());

DROP POLICY IF EXISTS "Admins can update career_roles" ON public.career_roles;
CREATE POLICY "Admins can update career_roles"
    ON public.career_roles
    FOR UPDATE
    TO authenticated
    USING (public.is_portal_admin())
    WITH CHECK (public.is_portal_admin());

DROP POLICY IF EXISTS "Admins can delete career_roles" ON public.career_roles;
CREATE POLICY "Admins can delete career_roles"
    ON public.career_roles
    FOR DELETE
    TO authenticated
    USING (public.is_portal_admin());

-- 5. Updated At Trigger
DROP TRIGGER IF EXISTS tr_career_roles_updated_at ON public.career_roles;
CREATE TRIGGER tr_career_roles_updated_at
    BEFORE UPDATE ON public.career_roles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_career_roles_category ON public.career_roles(category);
CREATE INDEX IF NOT EXISTS idx_career_roles_active ON public.career_roles(is_active);
CREATE INDEX IF NOT EXISTS idx_career_roles_display_order ON public.career_roles(display_order ASC);

-- 7. Seed Data with Idempotent UPSERT
INSERT INTO public.career_roles (
    id,
    title,
    category,
    employment_type,
    compensation,
    certificate_policy,
    lor_policy,
    workflow_details,
    target_audience,
    tagline,
    durations,
    overview,
    key_responsibilities,
    learning_outcomes,
    interlinking_feature,
    requirements,
    is_active,
    display_order
)
VALUES
(
    'pm-intern',
    'Product Manager Intern',
    'Product Management',
    'Remote',
    'Unpaid Internship (Skill-Building & Academic Practical Track)',
    'Official Certificate of Internship Completion awarded upon successful tenure and task completion.',
    'Lette
    r of Recommendation (LOR) is provided strictly upon completing 2 years of continuous active working with Siddhi Dynamics.',
    'Tasks assigned via internal platform with stipulated deadlines. PRD reviews, feature wireframes, and sprint extensions require direct CEO portal approval.',
    'MBA / B.Tech / BCA / Engineering & Management Students / Aspiring Product Managers',
    'Bridge business strategy, user experience, and agile engineering. Architect PRDs, wireframes, and feature roadmaps for PrintFlow and AI tools.',
    ARRAY['3 Months', '6 Months', '9 Months', '12 Months'],
    'As a Product Manager Intern at Siddhi Dynamics, you sit at the epicenter of software engineering, user experience, and business strategy. You will collaborate directly with our engineering squad and business development teams to translate real-world client requirements into structured Product Requirement Documents (PRDs), user stories, and interactive wireframes. You will work on flagship platforms like PrintFlow (our print industry SaaS/ERP) and AI automation suites. This is an unpaid learning and credentialing track where every shipped feature, PRD, and usability test directly contributes to your verifiable Point of Proof portfolio.',
    ARRAY[
        'Collaborate with Business Development and Digital Marketing teams to gather real client pain points, feature requests, and workflow bottlenecks.',
        'Draft detailed Product Requirement Documents (PRDs), user journeys, system flowcharts, and wireframes for PrintFlow and internal enterprise tools.',
        'Break down strategic initiatives into actionable sprint tickets with clear acceptance criteria for engineering teams.',
        'Conduct usability reviews, user acceptance testing (UAT), and telemetry analysis to validate feature releases.',
        'Maintain product backlogs and sprint milestones within the internal task platform, adhering to stipulated deadlines.'
    ],
    ARRAY[
        'Mastery of end-to-end agile product development lifecycles, PRD formulation, and backlog prioritization (RICE / MoSCoW frameworks).',
        'Direct experience driving AI-native SaaS product iterations and enterprise workflows.',
        'Official Certificate of Internship Completion with a verifiable cryptographic checksum on our ledger upon concluding tenure.',
        'Clear eligibility for a formal institutional Letter of Recommendation (LOR) upon completing 2 years of active service.'
    ],
    'Tri-Squad Synergy: You translate market signals captured by Business Development and content engagement insights from Digital Marketing into clear engineering specifications.',
    ARRAY[
        'Currently enrolled in or graduate of B.Tech / BE, MBA, MCA, BBA, or related technical/management disciplines.',
        'Deep curiosity about SaaS architecture, user experience design, and AI automation tools.',
        'Strong written and verbal communication skills with the ability to articulate complex technical ideas simply.',
        'Understanding and acceptance that this is an unpaid internship granting an official completion certificate (with LOR upon 2 years of working).'
    ],
    true,
    1
),
(
    'bd-intern',
    'Business Development Intern',
    'Business Development',
    'Remote',
    'Unpaid Internship (Skill-Building & Academic Practical Track)',
    'Official Certificate of Internship Completion awarded upon successful tenure and task completion.',
    'Letter of Recommendation (LOR) is provided strictly upon completing 2 years of continuous active working with Siddhi Dynamics.',
    'Tasks assigned via internal platform with stipulated deadlines. Client lead approvals and timeline extensions require direct CEO portal approval.',
    'MBA & BBA Students / Business Graduates',
    'Drive client acquisition, identify market opportunities, and convert real-world enterprise pipeline across regional hubs.',
    ARRAY['3 Months', '6 Months', '9 Months', '12 Months'],
    'As a Business Development Intern at Siddhi Dynamics, you operate at the frontier of technology commercialization. You will research regional enterprises, introduce cutting-edge business automation, ERP solutions (like PrintFlow & Nexus ERP), and customized digital transformation pipelines to business owners. This role provides practical boardroom sales and B2B consultative experience. It is an unpaid learning track where deliverables build your verifiable Point of Proof portfolio.',
    ARRAY[
        'Research and identify target client segments across regional hubs (Hyderabad, Nizamabad, Bangalore, Mumbai) needing business automation & ERP solutions.',
        'Conduct exploratory client discovery calls and demonstrate product capabilities including PrintFlow, Nexus ERP, and Custom Automations.',
        'Execute structured business development tasks assigned through the internal platform within stipulated timelines.',
        'Log verified outreach milestones, client requirements, and stage transitions directly in the internal portal for audit and review.',
        'Coordinate with the Digital Marketing team to align client outreach campaigns with tailored content assets.'
    ],
    ARRAY[
        'Mastery of B2B SaaS sales cycles, enterprise product demonstrations, and CRM pipeline governance.',
        'Direct real-world experience negotiating and structuring software solution proposals for regional MSMEs.',
        'Official Certificate of Internship Completion with a verifiable online record on our ledger upon concluding tenure.',
        'Clear eligibility for a formal institutional Letter of Recommendation (LOR) upon completing 2 years of active service.'
    ],
    'Cross-functional synergy: Every BD lead feeds real-time market data to our Digital Marketing interns for contextual collateral generation.',
    ARRAY[
        'Currently enrolled in or graduate of MBA, BBA, B.Com, or related business and management programs.',
        'Strong communication and interpersonal skills in English and Hindi or Telugu.',
        'High ownership mindset, dedication to meeting stipulated deadlines, and eagerness to build genuine career credentials.',
        'Understanding and acceptance that this is an unpaid internship granting an official completion certificate (with LOR upon 2 years of working).'
    ],
    true,
    2
),
(
    'dm-intern',
    'Digital Marketing Intern',
    'Digital Marketing',
    'Remote',
    'Unpaid Internship (Skill-Building & Academic Practical Track)',
    'Official Certificate of Internship Completion awarded upon successful tenure and task completion.',
    'Letter of Recommendation (LOR) is provided strictly upon completing 2 years of continuous active working with Siddhi Dynamics.',
    'Tasks assigned via internal platform with stipulated deadlines. Creative asset access and deadline extensions can be requested by interns and approved by CEO.',
    'BBA / MBA Marketing, Media & Creative Innovators',
    'Scale Instagram reach, craft viral content for PrintFlow & client brands, and engineer data-driven social conversion funnels.',
    ARRAY['3 Months', '6 Months', '9 Months', '12 Months'],
    'Shape the visual and organic identity of Siddhi Dynamics and our flagship products (like PrintFlow and AI automation suites). You will oversee growth for @siddhidynamics, architect high-retention Instagram reels, create educational carousels, and respond to sales intelligence to drive inbound client pipeline. This is an unpaid educational internship with tasks assigned through our platform to build a verifiable public portfolio.',
    ARRAY[
        'Drive organic growth and audience engagement on the official Instagram page (@siddhidynamics) and partner accounts.',
        'Create high-hook Reels, carousel infographics, and short-form video scripts highlighting PrintFlow and AI automation.',
        'Collaborate in real-time with the Business Development team to deploy targeted content based on real market questions.',
        'Execute content sprint tasks within stipulated platform deadlines, requesting asset access or timeline extensions via admin.',
        'Track reach, hook retention rate, non-follower discovery, and profile conversion metrics as verifiable Points of Proof.'
    ],
    ARRAY[
        'Hands-on expertise in algorithm-driven organic social growth, A/B video hook testing, and SaaS product marketing.',
        'Attribution tracking mastery: track customer journey from Instagram Reel view to demo booking.',
        'Official Certificate of Internship Completion with a verifiable online record on our ledger upon concluding tenure.',
        'Clear eligibility for a formal institutional Letter of Recommendation (LOR) upon completing 2 years of active service.'
    ],
    'Agile Content Sprints: You work hand-in-hand with the BD team using our unified referral and interlink tracker for mutual attribution.',
    ARRAY[
        'Enrolled in or completed BBA, MBA (Marketing), Mass Communication, or passionate self-taught social media marketer.',
        'Familiarity with Instagram Reels, CapCut/Premiere/Canva, and current B2B social media trends.',
        'Creativity, prompt turnaround, and passion for AI and software automation.',
        'Understanding and acceptance that this is an unpaid internship granting an official completion certificate (with LOR upon 2 years of working).'
    ],
    true,
    3
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    employment_type = EXCLUDED.employment_type,
    compensation = EXCLUDED.compensation,
    certificate_policy = EXCLUDED.certificate_policy,
    lor_policy = EXCLUDED.lor_policy,
    workflow_details = EXCLUDED.workflow_details,
    target_audience = EXCLUDED.target_audience,
    tagline = EXCLUDED.tagline,
    durations = EXCLUDED.durations,
    overview = EXCLUDED.overview,
    key_responsibilities = EXCLUDED.key_responsibilities,
    learning_outcomes = EXCLUDED.learning_outcomes,
    interlinking_feature = EXCLUDED.interlinking_feature,
    requirements = EXCLUDED.requirements,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order,
    updated_at = now();
