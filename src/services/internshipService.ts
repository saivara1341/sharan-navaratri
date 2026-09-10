import { supabase } from '@/integrations/supabase/client';

export interface InternshipApplication {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  graduation_year: string;
  role: 'Business Development Intern' | 'Digital Marketing Intern';
  duration: '3 Months' | '6 Months' | '9 Months' | '12 Months';
  linkedin?: string;
  portfolio_or_social?: string;
  statement_of_purpose: string;
  resume_url?: string;
  status: 'Received' | 'Interview Scheduled' | 'Offered' | 'Active' | 'Completed' | 'Rejected';
  interview_details?: {
    date: string;
    time: string;
    meet_link: string;
  };
}

export interface WhitelistedUser {
  id: string;
  email: string;
  name: string;
  role: 'intern' | 'employee';
  added_at: string;
  notes?: string;
}

export interface OnboardingAgreement {
  email: string;
  full_name: string;
  accepted_at: string;
  role: string;
  rules_agreed: boolean;
  terms_agreed: boolean;
  nda_agreed: boolean;
  signature_text: string;
  govt_id_type: 'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID';
  govt_id_number: string;
  college_id_number: string;
  college_name: string;
}

export interface CertificateRecord {
  id: string;
  certificate_no: string; // e.g. SD-CERT-2026-BD-0108
  recipient_name: string;
  recipient_email: string;
  role: string;
  college_name: string;
  college_id_number: string;
  govt_id_type: string;
  govt_id_masked: string; // e.g. XXXX-XXXX-1234
  duration: string;
  start_date: string;
  completion_date: string;
  issue_date: string;
  grade: 'Outstanding' | 'Exemplary' | 'Distinction' | 'Merit';
  issued_by: string;
  verification_checksum: string;
  key_achievements: string[];
  points_of_proof_count: number;
  status: 'Valid' | 'Revoked';
}

export interface InternTask {
  id: string;
  title: string;
  description: string;
  assigned_to_role: 'Business Development' | 'Digital Marketing' | 'All';
  assigned_to_email?: string;
  stipulated_deadline: string;
  priority: 'High' | 'Medium' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Completed';
  created_at: string;
  created_by: string; // CEO
}

export interface DeadlineExtensionRequest {
  id: string;
  task_id: string;
  task_title: string;
  intern_email: string;
  intern_name: string;
  reason: string;
  requested_deadline: string;
  original_deadline: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  admin_remarks?: string;
  requested_at: string;
  reviewed_at?: string;
}

export interface DataAssetRequest {
  id: string;
  title: string;
  description: string;
  category: 'PrintFlow Assets' | 'Client Brief' | 'Instagram Media Kit' | 'Market Research' | 'Competitor Data';
  intern_email: string;
  intern_name: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  admin_response_data?: string;
  requested_at: string;
  reviewed_at?: string;
}

export interface PointOfProof {
  id: string;
  intern_email: string;
  intern_name: string;
  role: string;
  title: string;
  before_state: string;
  after_state: string;
  metric_summary: string;
  proof_link_or_notes: string;
  status: 'Draft' | 'Submitted' | 'Verified by CEO';
  created_at: string;
}

export interface InterlinkAlert {
  id: string;
  created_by_email: string;
  created_by_name: string;
  role: 'Business Development Intern';
  loophole_identified: string;
  product_or_client: 'PrintFlow' | 'Siddhi Dynamics' | 'Nexus ERP' | 'Custom Client Project';
  action_requested_from_dm: string;
  target_audience: string;
  status: 'Open' | 'Campaign In Progress' | 'Resolved';
  dm_response_notes?: string;
  created_at: string;
}

export interface IncentiveReward {
  id: string;
  title: string;
  description: string;
  items_included: string[];
  required_milestone: string;
  role_target: 'All' | 'Business Development' | 'Digital Marketing';
  image_url?: string;
  scratch_code?: string;
  is_active: boolean;
}

export interface InternReview {
  id: string;
  intern_email: string;
  intern_name: string;
  role: string;
  rating: number; // 1 to 5
  category: 'Overall Experience' | 'Mentorship & Guidance' | 'Skill & Practical Learning' | 'Platform & Task Clarity';
  review_title: string;
  review_text: string;
  would_recommend: boolean;
  posted_to_google: boolean;
  submitted_at: string;
  admin_notes?: string;
  status: 'Published to Google' | 'Internal Attention Needed' | 'Resolved Internally';
}

// ── Default Mock Seeds ────────────────────────────────────────────────────────
const DEFAULT_REVIEWS: InternReview[] = [
  {
    id: 'rev-1',
    intern_email: 'intern.bd@siddhidynamics.in',
    intern_name: 'Rohan Sharma',
    role: 'Business Development Intern',
    rating: 5,
    category: 'Skill & Practical Learning',
    review_title: 'Unmatched practical sales exposure directly with founder!',
    review_text: 'The Business Development internship at Siddhi Dynamics gave me real hands-on experience pitching AI tools to SMB owners. The Point of Proof system helped me document every client interaction, and the mentorship by Sai Vara Prasad sir was phenomenal.',
    would_recommend: true,
    posted_to_google: true,
    submitted_at: '2026-07-15',
    status: 'Published to Google'
  },
  {
    id: 'rev-2',
    intern_email: 'intern.dm@siddhidynamics.in',
    intern_name: 'Ananya Verma',
    role: 'Digital Marketing Intern',
    rating: 5,
    category: 'Overall Experience',
    review_title: 'Gained real algorithmic growth skills for PrintFlow & Instagram',
    review_text: 'Unlike regular theoretical internships, here I actually created Reels and campaigns for @siddhidynamics that reached over 50,000 people. Seeing conversions happen in real-time was super rewarding.',
    would_recommend: true,
    posted_to_google: true,
    submitted_at: '2026-08-01',
    status: 'Published to Google'
  }
];

const DEFAULT_WHITELIST: WhitelistedUser[] = [
  { id: 'w-1', email: 'ssaivaraprasad51@gmail.com', name: 'Sai Vara Prasad (CEO)', role: 'employee', added_at: '2026-01-01' },
  { id: 'w-2', email: 'saivaraprasad@siddhidynamics.in', name: 'Sai Vara Prasad', role: 'employee', added_at: '2026-01-01' },
  { id: 'w-3', email: 'careers@siddhidynamics.in', name: 'Careers Desk', role: 'employee', added_at: '2026-01-01' },
  { id: 'w-4', email: 'hello@siddhidynamics.in', name: 'Hello Desk', role: 'employee', added_at: '2026-01-01' },
  { id: 'w-5', email: 'intern.bd@siddhidynamics.in', name: 'Rohan Sharma (BD Intern)', role: 'intern', added_at: '2026-06-01' },
  { id: 'w-6', email: 'intern.dm@siddhidynamics.in', name: 'Ananya Verma (DM Intern)', role: 'intern', added_at: '2026-06-01' },
];

const DEFAULT_INCENTIVES: IncentiveReward[] = [
  {
    id: 'inc-1',
    title: 'Executive Welcome Goodies Kit',
    description: 'Custom-crafted Siddhi Dynamics premium office bag paired with an executive laser-engraved metal pen.',
    items_included: ['Premium Branded Office Bag / Laptop Backpack', 'Laser-Engraved Siddhi Dynamics Metal Pen'],
    required_milestone: 'Complete 30 Days + 1st Verified Point of Proof',
    role_target: 'All',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    scratch_code: 'SD-EXEC-BAG-2026',
    is_active: true
  },
  {
    id: 'inc-2',
    title: 'Hydration & Workspace Comfort Bundle',
    description: 'Ceramic matte coffee mug for late night strategy sessions + insulated stainless steel sipper bottle.',
    items_included: ['Siddhi Dynamics Ceramic Coffee Mug', 'Vacuum-Insulated 750ml Stainless Steel Sipper Bottle'],
    required_milestone: 'BD: 3 New Clients Onboarded | DM: 25k Organic Instagram Reach + 10 PrintFlow Reels',
    role_target: 'All',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
    scratch_code: 'SD-MUG-SIPPER-99X',
    is_active: true
  },
  {
    id: 'inc-3',
    title: 'Pro Studio Audio Headset',
    description: 'Active Noise-Cancelling over-ear headset for high-stake client pitch calls and audio-video reel editing.',
    items_included: ['ANC Wireless Bluetooth Headset', 'Braided Audio Cable + Hard Shell Travel Case'],
    required_milestone: 'BD: ₹2.5 Lakh Pipeline Generated | DM: 100k Views across Instagram Campaigns',
    role_target: 'All',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    scratch_code: 'SD-AUDIO-PRO-ANC',
    is_active: true
  }
];

const DEFAULT_TASKS: InternTask[] = [
  {
    id: 'task-1',
    title: 'PrintFlow Instagram Reel Campaign (5 High-Retention Hooks)',
    description: 'Produce and schedule 5 reels showcasing PrintFlow AI invoice & packaging automation. Highlight manual invoicing vs AI extraction with clear CTA to demo.',
    assigned_to_role: 'Digital Marketing',
    stipulated_deadline: '2026-09-15',
    priority: 'Critical',
    status: 'In Progress',
    created_at: '2026-09-01',
    created_by: 'CEO'
  },
  {
    id: 'task-2',
    title: 'SME Client Acquisition Outreach (Nizamabad & Hyderabad Hubs)',
    description: 'Target 20 manufacturing / retail distributors for Siddhi Dynamics custom business automation & ERP. Apply BBA/MBA sales funnel mechanics.',
    assigned_to_role: 'Business Development',
    stipulated_deadline: '2026-09-18',
    priority: 'High',
    status: 'In Progress',
    created_at: '2026-09-02',
    created_by: 'CEO'
  },
  {
    id: 'task-3',
    title: 'Competitor Pricing & Instagram Engagement Audit',
    description: 'Analyze 5 leading Indian business automation SaaS pages on Instagram. Benchmark follower growth, hook styles, and comment conversion rates.',
    assigned_to_role: 'Digital Marketing',
    stipulated_deadline: '2026-09-22',
    priority: 'Medium',
    status: 'Pending',
    created_at: '2026-09-05',
    created_by: 'CEO'
  }
];

const DEFAULT_INTERLINKS: InterlinkAlert[] = [
  {
    id: 'alert-1',
    created_by_email: 'intern.bd@siddhidynamics.in',
    created_by_name: 'Rohan Sharma',
    role: 'Business Development Intern',
    loophole_identified: 'Prospects in wholesale printing have severe hesitation regarding GST invoice setup in PrintFlow.',
    product_or_client: 'PrintFlow',
    action_requested_from_dm: 'Create 2 step-by-step reels and a carousel showing 1-click GST invoice matching and error reduction.',
    target_audience: 'Small Printers, Packaging Owners, Stationers',
    status: 'Campaign In Progress',
    dm_response_notes: 'Reel 1 storyboard ready! Scheduled for Wednesday morning release.',
    created_at: '2026-09-04'
  }
];

const DEFAULT_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-1',
    certificate_no: 'SD-CERT-2026-BD-0108',
    recipient_name: 'Rohan Sharma',
    recipient_email: 'intern.bd@siddhidynamics.in',
    role: 'Business Development Intern',
    college_name: 'Anurag University, Hyderabad',
    college_id_number: '22AG1E0045',
    govt_id_type: 'Aadhaar Card',
    govt_id_masked: 'XXXX-XXXX-9821',
    duration: '6 Months',
    start_date: '2026-03-01',
    completion_date: '2026-08-31',
    issue_date: '2026-09-01',
    grade: 'Outstanding',
    issued_by: 'Sarugu Sai Vara Prasad, Founder & Designated Partner',
    verification_checksum: 'SD-HASH-7F89B2A1C49E',
    key_achievements: [
      'Successfully acquired 4 regional distribution clients for custom ERP automations.',
      'Generated ₹1,80,000 in enterprise software contract pipeline.',
      'Collaborated on 6 cross-functional loophole sprints with the digital marketing team.'
    ],
    points_of_proof_count: 8,
    status: 'Valid'
  },
  {
    id: 'cert-2',
    certificate_no: 'SD-CERT-2026-DM-0214',
    recipient_name: 'Ananya Verma',
    recipient_email: 'intern.dm@siddhidynamics.in',
    role: 'Digital Marketing Intern',
    college_name: 'Osmania University, Hyderabad',
    college_id_number: '1005-23-672-019',
    govt_id_type: 'PAN Card',
    govt_id_masked: 'ABCDE****F',
    duration: '6 Months',
    start_date: '2026-03-01',
    completion_date: '2026-08-31',
    issue_date: '2026-09-01',
    grade: 'Exemplary',
    issued_by: 'Sarugu Sai Vara Prasad, Founder & Designated Partner',
    verification_checksum: 'SD-HASH-3D45E8F9A102',
    key_achievements: [
      'Generated 140,000+ organic Instagram reel impressions for PrintFlow.',
      'Drove 320+ qualified website clicks to Siddhi Dynamics automation demo portals.',
      'Pioneered the viral packaging automation video series with 12 published assets.'
    ],
    points_of_proof_count: 11,
    status: 'Valid'
  }
];

const STORAGE_KEYS = {
  APPLICATIONS: 'sd_intern_applications',
  WHITELIST: 'sd_authorized_whitelist',
  AGREEMENTS: 'sd_onboarding_agreements',
  TASKS: 'sd_intern_tasks',
  EXTENSIONS: 'sd_deadline_extensions',
  DATA_REQUESTS: 'sd_data_requests',
  PROOFS: 'sd_point_of_proofs',
  INTERLINKS: 'sd_interlink_alerts',
  INCENTIVES: 'sd_incentive_rewards',
  SCRATCHED: 'sd_scratched_rewards',
  CERTIFICATES: 'sd_issued_certificates',
  REVIEWS: 'sd_intern_reviews'
};

// These records are created by admins and must never be populated with sample
// people, certificates, tasks, or reviews in a fresh browser session.
const ADMIN_DATA_KEYS_WITHOUT_SEEDS = new Set([
  STORAGE_KEYS.APPLICATIONS,
  STORAGE_KEYS.WHITELIST,
  STORAGE_KEYS.AGREEMENTS,
  STORAGE_KEYS.TASKS,
  STORAGE_KEYS.EXTENSIONS,
  STORAGE_KEYS.DATA_REQUESTS,
  STORAGE_KEYS.PROOFS,
  STORAGE_KEYS.INTERLINKS,
  STORAGE_KEYS.INCENTIVES,
  STORAGE_KEYS.SCRATCHED,
  STORAGE_KEYS.CERTIFICATES,
  STORAGE_KEYS.REVIEWS,
]);

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return ADMIN_DATA_KEYS_WITHOUT_SEEDS.has(key) ? ([] as T) : defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const internshipService = {
  // ── 1. Applications ────────────────────────────────────────────────────────

  /** Returns true if an application with this email OR phone already exists */
  async checkDuplicate(email: string, phone: string): Promise<{ isDuplicate: boolean; field?: 'email' | 'phone' }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // Check local storage first (fast)
    const local = getLocal<InternshipApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    if (local.some(a => a.email.toLowerCase() === cleanEmail)) return { isDuplicate: true, field: 'email' };
    if (local.some(a => a.phone.replace(/\D/g, '').slice(-10) === cleanPhone)) return { isDuplicate: true, field: 'phone' };

    // 1. Check Supabase career_applications table
    try {
      const { data: directData } = await supabase
        .from('career_applications')
        .select('email, phone');

      if (directData && directData.length > 0) {
        for (const row of directData) {
          if ((row.email || '').toLowerCase() === cleanEmail) return { isDuplicate: true, field: 'email' };
          const storedPhone = (row.phone || '').replace(/\D/g, '').slice(-10);
          if (storedPhone && storedPhone === cleanPhone) return { isDuplicate: true, field: 'phone' };
        }
      }
    } catch {
      // Table may still be syncing
    }

    // 2. Cross-check legacy contact_submissions
    try {
      const { data } = await supabase
        .from('contact_submissions')
        .select('email, message')
        .eq('inquiry_type', 'internship_application');

      if (data) {
        for (const row of data) {
          if ((row.email || '').toLowerCase() === cleanEmail) return { isDuplicate: true, field: 'email' };
          const phoneInMsg = (row.message || '').match(/Phone:\s*([^\n]+)/);
          if (phoneInMsg) {
            const storedPhone = phoneInMsg[1].replace(/\D/g, '').slice(-10);
            if (storedPhone === cleanPhone) return { isDuplicate: true, field: 'phone' };
          }
        }
      }
    } catch {
      // Supabase unavailable — rely on local check above
    }

    return { isDuplicate: false };
  },

  async submitApplication(appData: Omit<InternshipApplication, 'id' | 'created_at' | 'status'>): Promise<InternshipApplication> {
    const newApp: InternshipApplication = {
      ...appData,
      id: 'app-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      status: 'Received'
    };

    // Save in local storage
    const current = getLocal<InternshipApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    setLocal(STORAGE_KEYS.APPLICATIONS, [newApp, ...current]);

    // 1. Primary: Persist into dedicated career_applications table in Supabase
    try {
      const { error: directErr } = await supabase.from('career_applications').insert([{
        full_name: newApp.full_name,
        email: newApp.email.toLowerCase().trim(),
        phone: newApp.phone,
        college: newApp.college,
        degree: newApp.degree,
        graduation_year: newApp.graduation_year || '2026',
        role: newApp.role,
        duration: newApp.duration,
        linkedin: newApp.linkedin || null,
        portfolio_or_social: newApp.portfolio_or_social || null,
        statement_of_purpose: newApp.statement_of_purpose,
        resume_url: newApp.resume_url || null,
        status: 'Received',
      }]);
      if (directErr) {
        console.warn('Could not insert to career_applications (table may be pending migration):', directErr);
      }
    } catch (err) {
      console.warn('career_applications insert error:', err);
    }

    // 2. Secondary fallback: Also mirror into contact_submissions table
    try {
      await supabase.from('contact_submissions').insert([{
        name: newApp.full_name,
        email: newApp.email,
        designation: `${newApp.degree} Student (${newApp.graduation_year})`,
        organization: newApp.college,
        inquiry_type: 'internship_application',
        message: `Role Applied: ${newApp.role}\nDuration: ${newApp.duration}\nPhone: ${newApp.phone}\nLinkedIn/Social: ${newApp.linkedin || newApp.portfolio_or_social || 'N/A'}\n\nStatement of Purpose:\n${newApp.statement_of_purpose}\n\nResume/Portfolio Link:\n${newApp.resume_url || 'N/A'}`,
        status: 'Received',
        progress: 10,
        consent_given: true,
        consent_at: new Date().toISOString(),
        is_public: false
      }]);
    } catch (err) {
      console.warn('Could not mirror to Supabase contact_submissions:', err);
    }

    return newApp;
  },

  /**
   * Uploads candidate resume or supporting files to Supabase Storage.
   * Uploads to 'career-resumes' bucket, falling back to 'project-attachments'.
   */
  async uploadResumeFile(file: File): Promise<string | null> {
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${Date.now()}-${safeName}`;

      // 1. Try 'career-resumes' bucket
      const { error: uploadErr } = await supabase.storage
        .from('career-resumes')
        .upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false });

      if (!uploadErr) {
        const { data } = supabase.storage.from('career-resumes').getPublicUrl(path);
        return data.publicUrl;
      }

      // 2. Fallback to existing 'project-attachments' bucket if 'career-resumes' is pending migration
      const fallbackPath = `${crypto.randomUUID()}/${crypto.randomUUID()}-${safeName}`;
      const { error: fallbackErr } = await supabase.storage
        .from('project-attachments')
        .upload(fallbackPath, file, { contentType: file.type || 'application/octet-stream', upsert: false });

      if (!fallbackErr) {
        const { data } = supabase.storage.from('project-attachments').getPublicUrl(fallbackPath);
        return data.publicUrl;
      }

      console.warn('Resume file upload failed on both buckets:', uploadErr, fallbackErr);
      return null;
    } catch (err) {
      console.warn('uploadResumeFile exception:', err);
      return null;
    }
  },

  async getApplications(): Promise<InternshipApplication[]> {
    let directMapped: InternshipApplication[] = [];
    let directQueried = false;

    // 1. Primary: Load from dedicated career_applications table
    try {
      const { data: directData, error: directErr } = await supabase
        .from('career_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!directErr && directData !== null) {
        directQueried = true;
        directMapped = directData.map((row: any) => ({
          id: row.id,
          created_at: row.created_at || new Date().toISOString(),
          full_name: row.full_name,
          email: row.email,
          phone: row.phone || '',
          college: row.college || '',
          degree: row.degree || 'Other',
          graduation_year: row.graduation_year || '2026',
          role: row.role as any,
          duration: row.duration as any,
          linkedin: row.linkedin || '',
          portfolio_or_social: row.portfolio_or_social || '',
          statement_of_purpose: row.statement_of_purpose || '',
          resume_url: row.resume_url || '',
          status: (row.status || 'Received') as any,
          interview_details: row.interview_details || undefined,
        }));
      }
    } catch (e) {
      console.warn('Direct career_applications load error:', e);
    }

    // If career_applications succeeded, it is the authoritative source!
    // Overwrite local storage cache so deleted records are permanently removed locally too.
    if (directQueried) {
      setLocal(STORAGE_KEYS.APPLICATIONS, directMapped);
      return directMapped;
    }

    // 2. Fallback: Only if career_applications failed (e.g. table not created yet), load from contact_submissions
    let contactMapped: InternshipApplication[] = [];
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('inquiry_type', 'internship_application')
        .order('created_at', { ascending: false });

      if (!error && data !== null) {
        contactMapped = data.map((sub: any) => {
          const msg = sub.message || '';
          const roleMatch = msg.match(/Role Applied:\s*([^\n]+)/);
          const durationMatch = msg.match(/Duration:\s*([^\n]+)/);
          const phoneMatch = msg.match(/Phone:\s*([^\n]+)/);
          const linkedinMatch = msg.match(/LinkedIn\/Social:\s*([^\n]+)/);
          const resumeMatch = msg.match(/Resume\/Portfolio Link:\s*([^\n]+)/);
          const parsedResume = resumeMatch && resumeMatch[1].trim() !== 'N/A' ? resumeMatch[1].trim() : '';
          const attachmentUrl = Array.isArray(sub.attachment_urls) && sub.attachment_urls.length > 0
            ? sub.attachment_urls.join(' | ')
            : '';
          const resumeUrl = sub.resume_url || parsedResume || attachmentUrl || '';
          const sopMatch = msg.match(/Statement of Purpose:\s*([\s\S]*?)(?=\n\nResume\/Portfolio Link:|$)/);

          return {
            id: sub.id,
            created_at: sub.created_at || new Date().toISOString(),
            full_name: sub.name,
            email: sub.email,
            phone: phoneMatch ? phoneMatch[1].trim() : '',
            college: sub.organization || 'University',
            degree: (sub.designation?.includes('MBA') ? 'MBA' : sub.designation?.includes('BBA') ? 'BBA' : 'Other') as any,
            graduation_year: '2026',
            role: (roleMatch ? roleMatch[1].trim() : 'Business Development Intern') as any,
            duration: (durationMatch ? durationMatch[1].trim() : '6 Months') as any,
            linkedin: linkedinMatch ? linkedinMatch[1].trim() : '',
            resume_url: resumeUrl,
            statement_of_purpose: sopMatch ? sopMatch[1].trim() : msg,
            status: (sub.status === 'Interview Scheduled' ? 'Interview Scheduled' : sub.status === 'Offered' ? 'Offered' : 'Received') as any
          };
        });

        setLocal(STORAGE_KEYS.APPLICATIONS, contactMapped);
        return contactMapped;
      }
    } catch (e) {
      console.warn('contact_submissions load error:', e);
    }

    // 3. Fallback to local storage ONLY if offline / all network queries failed
    return getLocal<InternshipApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  },

  async deleteApplication(id: string, email?: string): Promise<boolean> {
    try {
      // 1. Delete from career_applications
      if (id && !id.startsWith('app-')) {
        await supabase.from('career_applications').delete().eq('id', id);
      }
      if (email) {
        await supabase.from('career_applications').delete().ilike('email', email.trim());
      }

      // 2. Delete from contact_submissions
      if (email) {
        await supabase.from('contact_submissions').delete().eq('inquiry_type', 'internship_application').ilike('email', email.trim());
      }
      if (id && !id.startsWith('app-')) {
        await supabase.from('contact_submissions').delete().eq('id', id);
      }

      // 3. Purge from local storage cache
      const current = getLocal<InternshipApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
      const updated = current.filter(a => a.id !== id && (email ? a.email.toLowerCase() !== email.toLowerCase() : true));
      setLocal(STORAGE_KEYS.APPLICATIONS, updated);

      return true;
    } catch (err) {
      console.warn('deleteApplication error:', err);
      return false;
    }
  },

  async updateApplicationStatus(id: string, status: InternshipApplication['status'], interviewDetails?: InternshipApplication['interview_details']) {
    const list = getLocal<InternshipApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
    const updated = list.map(item => item.id === id ? { ...item, status, interview_details: interviewDetails || item.interview_details } : item);
    setLocal(STORAGE_KEYS.APPLICATIONS, updated);

    // Update career_applications
    try {
      await supabase.from('career_applications').update({
        status,
        ...(interviewDetails ? { interview_details: interviewDetails } : {})
      }).eq('id', id);
    } catch (err) {
      console.warn('Error updating status in career_applications:', err);
    }

    // Also update legacy contact_submissions
    try {
      await supabase.from('contact_submissions').update({ status }).eq('id', id);
    } catch (err) {
      console.warn('Error updating status in contact_submissions:', err);
    }
    return updated;
  },

  // ── 2. Whitelist / Approved Emails ──────────────────────────────────────────
  getWhitelist(): WhitelistedUser[] {
    return getLocal<WhitelistedUser[]>(STORAGE_KEYS.WHITELIST, DEFAULT_WHITELIST);
  },

  addWhitelistedEmail(email: string, name: string, role: 'intern' | 'employee', notes?: string): WhitelistedUser[] {
    const current = this.getWhitelist();
    const cleanEmail = email.trim().toLowerCase();
    if (current.some(u => u.email.toLowerCase() === cleanEmail)) {
      return current;
    }
    const newUser: WhitelistedUser = {
      id: 'w-' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      name: name.trim(),
      role,
      added_at: new Date().toISOString().split('T')[0],
      notes
    };
    const updated = [newUser, ...current];
    setLocal(STORAGE_KEYS.WHITELIST, updated);
    return updated;
  },

  removeWhitelistedEmail(id: string): WhitelistedUser[] {
    const current = this.getWhitelist();
    const updated = current.filter(u => u.id !== id);
    setLocal(STORAGE_KEYS.WHITELIST, updated);
    return updated;
  },

  isEmailApproved(email?: string, targetRole?: 'intern' | 'employee'): { approved: boolean; role?: 'intern' | 'employee'; user?: WhitelistedUser } {
    if (!email) return { approved: false };
    const clean = email.trim().toLowerCase();

    // God mode admins are always approved for all roles
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com,saivaraprasad@siddhidynamics.in,careers@siddhidynamics.in,hello@siddhidynamics.in")
      .split(",")
      .map((e: string) => e.trim().toLowerCase());

    if (adminEmails.includes(clean)) {
      return { approved: true, role: 'employee' };
    }

    const whitelist = this.getWhitelist();
    const match = whitelist.find(u => u.email.toLowerCase() === clean);
    if (!match) return { approved: false };

    if (targetRole && match.role !== targetRole) {
      // If target is employee, but user is intern: allow intern access only
      return { approved: false, role: match.role, user: match };
    }

    return { approved: true, role: match.role, user: match };
  },

  // ── 3. Onboarding & Terms Acceptance ────────────────────────────────────────
  hasAcceptedOnboarding(email: string): boolean {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    const agreements = getLocal<OnboardingAgreement[]>(STORAGE_KEYS.AGREEMENTS, []);
    return agreements.some(a => a.email.toLowerCase() === clean && a.rules_agreed && a.terms_agreed);
  },

  async checkOnboardingStatus(email: string): Promise<boolean> {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    if (this.hasAcceptedOnboarding(clean)) return true;

    try {
      const { data } = await supabase
        .from('intern_onboarding_agreements')
        .select('email, rules_agreed, terms_agreed')
        .ilike('email', clean)
        .limit(1);

      if (data && data.length > 0 && data[0].rules_agreed && data[0].terms_agreed) {
        const current = getLocal<OnboardingAgreement[]>(STORAGE_KEYS.AGREEMENTS, []);
        if (!current.some(a => a.email.toLowerCase() === clean)) {
          setLocal(STORAGE_KEYS.AGREEMENTS, [{
            email: clean,
            full_name: '',
            role: '',
            accepted_at: new Date().toISOString(),
            rules_agreed: true,
            terms_agreed: true,
            nda_agreed: true,
            signature_text: '',
            govt_id_type: 'Aadhaar Card',
            govt_id_number: '',
            college_id_number: '',
            college_name: ''
          }, ...current]);
        }
        return true;
      }
    } catch (err) {
      console.warn('Error checking onboarding agreement in Supabase:', err);
    }
    return false;
  },

  recordOnboardingAcceptance(
    email: string, 
    full_name: string, 
    role: string, 
    signature_text: string,
    govt_id_type: 'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID',
    govt_id_number: string,
    college_id_number: string,
    college_name: string
  ): OnboardingAgreement {
    const agreements = getLocal<OnboardingAgreement[]>(STORAGE_KEYS.AGREEMENTS, []);
    const clean = email.trim().toLowerCase();
    const newAgreement: OnboardingAgreement = {
      email: clean,
      full_name,
      role,
      accepted_at: new Date().toISOString(),
      rules_agreed: true,
      terms_agreed: true,
      nda_agreed: true,
      signature_text,
      govt_id_type,
      govt_id_number,
      college_id_number,
      college_name
    };
    const filtered = agreements.filter(a => a.email.toLowerCase() !== clean);
    setLocal(STORAGE_KEYS.AGREEMENTS, [newAgreement, ...filtered]);

    // Persist to Supabase intern_onboarding_agreements table
    try {
      supabase.from('intern_onboarding_agreements').insert([{
        email: clean,
        full_name,
        role,
        signature_text,
        govt_id_type,
        govt_id_number,
        college_id_number,
        college_name,
        rules_agreed: true,
        terms_agreed: true,
        nda_agreed: true,
        accepted_at: newAgreement.accepted_at
      }]).then(({ error }) => {
        if (error) console.warn('Could not sync onboarding agreement to Supabase:', error);
      });
    } catch (err) {
      console.warn('intern_onboarding_agreements insert error:', err);
    }

    return newAgreement;
  },

  getOnboardingAgreement(email?: string): OnboardingAgreement | null {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    const agreements = getLocal<OnboardingAgreement[]>(STORAGE_KEYS.AGREEMENTS, []);
    return agreements.find(a => a.email.toLowerCase() === clean) || null;
  },

  getAllOnboardingAgreements(): OnboardingAgreement[] {
    return getLocal<OnboardingAgreement[]>(STORAGE_KEYS.AGREEMENTS, []);
  },

  // ── 4. Tasks & Stipulated Deadlines ─────────────────────────────────────────
  getTasks(): InternTask[] {
    return getLocal<InternTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
  },

  createTask(task: Omit<InternTask, 'id' | 'created_at'>): InternTask {
    const newTask: InternTask = {
      ...task,
      id: 'task-' + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString().split('T')[0]
    };
    const current = this.getTasks();
    const updated = [newTask, ...current];
    setLocal(STORAGE_KEYS.TASKS, updated);
    return newTask;
  },

  updateTaskStatus(id: string, status: InternTask['status']): InternTask[] {
    const current = this.getTasks();
    const updated = current.map(t => t.id === id ? { ...t, status } : t);
    setLocal(STORAGE_KEYS.TASKS, updated);
    return updated;
  },

  // ── 5. Deadline Extensions ──────────────────────────────────────────────────
  getExtensionRequests(): DeadlineExtensionRequest[] {
    return getLocal<DeadlineExtensionRequest[]>(STORAGE_KEYS.EXTENSIONS, []);
  },

  requestDeadlineExtension(req: Omit<DeadlineExtensionRequest, 'id' | 'status' | 'requested_at'>): DeadlineExtensionRequest {
    const newReq: DeadlineExtensionRequest = {
      ...req,
      id: 'ext-' + Math.random().toString(36).substring(2, 7),
      status: 'Pending',
      requested_at: new Date().toISOString()
    };
    const current = this.getExtensionRequests();
    const updated = [newReq, ...current];
    setLocal(STORAGE_KEYS.EXTENSIONS, updated);
    return newReq;
  },

  reviewExtension(id: string, status: 'Approved' | 'Rejected', adminRemarks: string, revisedDeadline?: string): DeadlineExtensionRequest[] {
    const current = this.getExtensionRequests();
    const updated = current.map(req => {
      if (req.id === id) {
        return {
          ...req,
          status,
          admin_remarks: adminRemarks,
          reviewed_at: new Date().toISOString()
        };
      }
      return req;
    });
    setLocal(STORAGE_KEYS.EXTENSIONS, updated);

    // If approved, update the task deadline as well
    if (status === 'Approved' && revisedDeadline) {
      const match = current.find(r => r.id === id);
      if (match) {
        const tasks = this.getTasks();
        const updatedTasks = tasks.map(t => t.id === match.task_id ? { ...t, stipulated_deadline: revisedDeadline } : t);
        setLocal(STORAGE_KEYS.TASKS, updatedTasks);
      }
    }

    return updated;
  },

  // ── 6. Data & Asset Requests ────────────────────────────────────────────────
  getDataRequests(): DataAssetRequest[] {
    return getLocal<DataAssetRequest[]>(STORAGE_KEYS.DATA_REQUESTS, []);
  },

  requestDataAsset(req: Omit<DataAssetRequest, 'id' | 'status' | 'requested_at'>): DataAssetRequest {
    const newReq: DataAssetRequest = {
      ...req,
      id: 'data-' + Math.random().toString(36).substring(2, 7),
      status: 'Pending',
      requested_at: new Date().toISOString()
    };
    const current = this.getDataRequests();
    const updated = [newReq, ...current];
    setLocal(STORAGE_KEYS.DATA_REQUESTS, updated);
    return newReq;
  },

  reviewDataRequest(id: string, status: 'Approved' | 'Rejected', adminResponse: string): DataAssetRequest[] {
    const current = this.getDataRequests();
    const updated = current.map(req => req.id === id ? {
      ...req,
      status,
      admin_response_data: adminResponse,
      reviewed_at: new Date().toISOString()
    } : req);
    setLocal(STORAGE_KEYS.DATA_REQUESTS, updated);
    return updated;
  },

  // ── 7. Point of Proof (PoP) Activity Ledger ─────────────────────────────────
  getPointsOfProof(): PointOfProof[] {
    return getLocal<PointOfProof[]>(STORAGE_KEYS.PROOFS, [
      {
        id: 'pop-1',
        intern_email: 'intern.bd@siddhidynamics.in',
        intern_name: 'Rohan Sharma',
        role: 'Business Development Intern',
        title: 'Retail Store POS & Inventory Pitch Conversion',
        before_state: 'Client had 0 digital automation; tracking inventory on paper ledgers with 12% discrepancy rate.',
        after_state: 'Presented Siddhi Dynamics ERP solution. Closed 6-month trial contract and generated ₹40,000 initial invoice.',
        metric_summary: '1 Client Closed • ₹40,000 Deal • 100% On-Time Proof',
        proof_link_or_notes: 'Invoice #INV-2026-NIZ-01 + WhatsApp confirmation signed agreement.',
        status: 'Verified by CEO',
        created_at: '2026-09-03'
      },
      {
        id: 'pop-2',
        intern_email: 'intern.dm@siddhidynamics.in',
        intern_name: 'Ananya Verma',
        role: 'Digital Marketing Intern',
        title: 'PrintFlow Launch Reel & Carousel Viral Spike',
        before_state: 'Instagram account had 120 baseline impressions per post; low brand recall in SME circles.',
        after_state: 'Engineered viral packaging reel hook. Reached 18,400 non-followers, generated 38 website clicks to PrintFlow.',
        metric_summary: '18.4k Organic Impressions • +142 Followers • 38 Web Enquiries',
        proof_link_or_notes: 'https://instagram.com/p/reel-printflow-demo-01',
        status: 'Verified by CEO',
        created_at: '2026-09-04'
      }
    ]);
  },

  submitPointOfProof(proof: Omit<PointOfProof, 'id' | 'created_at' | 'status'>): PointOfProof {
    const newProof: PointOfProof = {
      ...proof,
      id: 'pop-' + Math.random().toString(36).substring(2, 7),
      status: 'Submitted',
      created_at: new Date().toISOString().split('T')[0]
    };
    const current = this.getPointsOfProof();
    const updated = [newProof, ...current];
    setLocal(STORAGE_KEYS.PROOFS, updated);
    return newProof;
  },

  verifyPointOfProof(id: string, status: PointOfProof['status']): PointOfProof[] {
    const current = this.getPointsOfProof();
    const updated = current.map(p => p.id === id ? { ...p, status } : p);
    setLocal(STORAGE_KEYS.PROOFS, updated);
    return updated;
  },

  // ── 8. BD ⇄ DM Interlinking Channel ─────────────────────────────────────────
  getInterlinks(): InterlinkAlert[] {
    return getLocal<InterlinkAlert[]>(STORAGE_KEYS.INTERLINKS, DEFAULT_INTERLINKS);
  },

  createInterlinkAlert(alert: Omit<InterlinkAlert, 'id' | 'status' | 'created_at'>): InterlinkAlert {
    const newAlert: InterlinkAlert = {
      ...alert,
      id: 'alert-' + Math.random().toString(36).substring(2, 7),
      status: 'Open',
      created_at: new Date().toISOString().split('T')[0]
    };
    const current = this.getInterlinks();
    const updated = [newAlert, ...current];
    setLocal(STORAGE_KEYS.INTERLINKS, updated);
    return newAlert;
  },

  updateInterlinkStatus(id: string, status: InterlinkAlert['status'], dmNotes?: string): InterlinkAlert[] {
    const current = this.getInterlinks();
    const updated = current.map(a => a.id === id ? {
      ...a,
      status,
      dm_response_notes: dmNotes !== undefined ? dmNotes : a.dm_response_notes
    } : a);
    setLocal(STORAGE_KEYS.INTERLINKS, updated);
    return updated;
  },

  // ── 9. Milestones & Scratch Card Incentives ─────────────────────────────────
  getIncentiveRewards(): IncentiveReward[] {
    return getLocal<IncentiveReward[]>(STORAGE_KEYS.INCENTIVES, DEFAULT_INCENTIVES);
  },

  createIncentiveReward(reward: Omit<IncentiveReward, 'id'>): IncentiveReward {
    const newReward: IncentiveReward = {
      ...reward,
      id: 'inc-' + Math.random().toString(36).substring(2, 7)
    };
    const current = this.getIncentiveRewards();
    const updated = [newReward, ...current];
    setLocal(STORAGE_KEYS.INCENTIVES, updated);
    return newReward;
  },

  deleteIncentiveReward(id: string): IncentiveReward[] {
    const current = this.getIncentiveRewards();
    const updated = current.filter(r => r.id !== id);
    setLocal(STORAGE_KEYS.INCENTIVES, updated);
    return updated;
  },

  getScratchedCodes(): string[] {
    return getLocal<string[]>(STORAGE_KEYS.SCRATCHED, []);
  },

  scratchReward(rewardId: string): string[] {
    const current = this.getScratchedCodes();
    if (!current.includes(rewardId)) {
      const updated = [...current, rewardId];
      setLocal(STORAGE_KEYS.SCRATCHED, updated);
      return updated;
    }
    return current;
  },

  // ── 10. Official Verified Certificates Ledger ──────────────────────────────
  getCertificates(): CertificateRecord[] {
    return getLocal<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES);
  },

  async fetchCertificates(): Promise<CertificateRecord[]> {
    try {
      const { data, error } = await supabase
        .from('issued_certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: CertificateRecord[] = data.map((row: any) => ({
          id: row.id,
          certificate_no: row.certificate_no,
          recipient_name: row.recipient_name,
          recipient_email: row.recipient_email,
          role: row.role,
          college_name: row.college_name,
          college_id_number: row.college_id_number,
          govt_id_type: row.govt_id_type,
          govt_id_masked: row.govt_id_masked,
          duration: row.duration,
          start_date: row.start_date,
          completion_date: row.completion_date,
          issue_date: row.issue_date,
          grade: row.grade as any,
          issued_by: row.issued_by,
          verification_checksum: row.verification_checksum,
          key_achievements: Array.isArray(row.key_achievements) ? row.key_achievements : [],
          points_of_proof_count: row.points_of_proof_count || 0,
          status: (row.status || 'Valid') as any
        }));

        const local = getLocal<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, DEFAULT_CERTIFICATES);
        const combined = [...mapped];
        for (const loc of local) {
          if (!combined.some(c => c.certificate_no.toUpperCase() === loc.certificate_no.toUpperCase())) {
            combined.push(loc);
          }
        }
        setLocal(STORAGE_KEYS.CERTIFICATES, combined);
        return combined;
      }
    } catch (err) {
      console.warn('Error fetching certificates from Supabase:', err);
    }
    return this.getCertificates();
  },

  getCertificateByNo(query: string): CertificateRecord | null {
    if (!query) return null;
    const clean = query.trim().toUpperCase();
    const certs = this.getCertificates();
    return certs.find(c => c.certificate_no.toUpperCase() === clean || c.id.toUpperCase() === clean || c.recipient_email.toLowerCase() === query.trim().toLowerCase()) || null;
  },

  async fetchCertificateByNo(query: string): Promise<CertificateRecord | null> {
    if (!query) return null;
    const clean = query.trim().toUpperCase();

    // 1. Try Supabase
    try {
      const { data, error } = await supabase
        .from('issued_certificates')
        .select('*')
        .or(`certificate_no.ilike.${clean},recipient_email.ilike.${query.trim()}`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          id: row.id,
          certificate_no: row.certificate_no,
          recipient_name: row.recipient_name,
          recipient_email: row.recipient_email,
          role: row.role,
          college_name: row.college_name,
          college_id_number: row.college_id_number,
          govt_id_type: row.govt_id_type,
          govt_id_masked: row.govt_id_masked,
          duration: row.duration,
          start_date: row.start_date,
          completion_date: row.completion_date,
          issue_date: row.issue_date,
          grade: row.grade as any,
          issued_by: row.issued_by,
          verification_checksum: row.verification_checksum,
          key_achievements: Array.isArray(row.key_achievements) ? row.key_achievements : [],
          points_of_proof_count: row.points_of_proof_count || 0,
          status: (row.status || 'Valid') as any
        };
      }
    } catch (err) {
      console.warn('Error fetching certificate from Supabase:', err);
    }

    // 2. Fallback to local
    return this.getCertificateByNo(query);
  },

  issueCertificate(certData: Omit<CertificateRecord, 'id' | 'certificate_no' | 'verification_checksum' | 'status' | 'issue_date'>): CertificateRecord {
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const year = new Date().getFullYear();
    const rolePrefix = certData.role.includes('Business') ? 'BD' : certData.role.includes('Digital') ? 'DM' : 'EMP';
    const certNo = `SD-CERT-${year}-${rolePrefix}-${randomHex}`;
    const checksum = `SD-HASH-${Math.random().toString(16).substring(2, 14).toUpperCase()}`;

    const newCert: CertificateRecord = {
      ...certData,
      id: 'cert-' + Math.random().toString(36).substring(2, 7),
      certificate_no: certNo,
      issue_date: new Date().toISOString().split('T')[0],
      verification_checksum: checksum,
      status: 'Valid'
    };

    const current = this.getCertificates();
    const updated = [newCert, ...current];
    setLocal(STORAGE_KEYS.CERTIFICATES, updated);

    // Persist to Supabase
    try {
      supabase.from('issued_certificates').insert([{
        certificate_no: newCert.certificate_no,
        recipient_name: newCert.recipient_name,
        recipient_email: newCert.recipient_email.toLowerCase(),
        role: newCert.role,
        college_name: newCert.college_name,
        college_id_number: newCert.college_id_number,
        govt_id_type: newCert.govt_id_type,
        govt_id_masked: newCert.govt_id_masked,
        duration: newCert.duration,
        start_date: newCert.start_date,
        completion_date: newCert.completion_date,
        issue_date: newCert.issue_date,
        grade: newCert.grade,
        issued_by: newCert.issued_by,
        verification_checksum: newCert.verification_checksum,
        key_achievements: newCert.key_achievements,
        points_of_proof_count: newCert.points_of_proof_count,
        status: newCert.status
      }]).then(({ error }) => {
        if (error) console.warn('Could not sync certificate to Supabase:', error);
      });
    } catch (err) {
      console.warn('issued_certificates insert error:', err);
    }

    return newCert;
  },

  revokeCertificate(id: string): CertificateRecord[] {
    const current = this.getCertificates();
    const updated = current.map(c => c.id === id ? { ...c, status: 'Revoked' as const } : c);
    setLocal(STORAGE_KEYS.CERTIFICATES, updated);

    try {
      supabase.from('issued_certificates').update({ status: 'Revoked' }).eq('id', id).then(({ error }) => {
        if (error) console.warn('Could not sync certificate revocation to Supabase:', error);
      });
    } catch (err) {
      console.warn('issued_certificates revoke error:', err);
    }

    return updated;
  },

  // ── 11. Intern Reviews & Gated Google Review Flow ─────────────────────────
  getInternReviews(): InternReview[] {
    return getLocal<InternReview[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
  },

  getReviewByEmail(email: string): InternReview | undefined {
    if (!email) return undefined;
    const all = this.getInternReviews();
    return all.find(r => r.intern_email.toLowerCase() === email.toLowerCase());
  },

  submitInternReview(review: Omit<InternReview, 'id' | 'submitted_at' | 'status' | 'posted_to_google'>): InternReview {
    const isGood = review.rating >= 4;
    const newRev: InternReview = {
      ...review,
      id: `rev-${Date.now()}`,
      submitted_at: new Date().toISOString().split('T')[0],
      posted_to_google: false,
      status: isGood ? 'Published to Google' : 'Internal Attention Needed',
    };

    const current = this.getInternReviews();
    const updated = [newRev, ...current.filter(r => r.intern_email.toLowerCase() !== review.intern_email.toLowerCase())];
    setLocal(STORAGE_KEYS.REVIEWS, updated);
    return newRev;
  },

  markReviewPostedToGoogle(id: string): void {
    const current = this.getInternReviews();
    const updated = current.map(r => r.id === id ? { ...r, posted_to_google: true, status: 'Published to Google' as const } : r);
    setLocal(STORAGE_KEYS.REVIEWS, updated);
  },

  updateReviewStatus(id: string, status: InternReview['status'], admin_notes?: string): void {
    const current = this.getInternReviews();
    const updated = current.map(r => r.id === id ? { ...r, status, admin_notes: admin_notes ?? r.admin_notes } : r);
    setLocal(STORAGE_KEYS.REVIEWS, updated);
  }
};
