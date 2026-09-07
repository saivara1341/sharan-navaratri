import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  Clock, 
  GraduationCap, 
  Download, 
  CheckCircle2, 
  Send, 
  FileText, 
  ArrowRight, 
  Target, 
  Upload,
  X,
  Rocket,
  Users,
  Globe,
  Building2,
  Coffee,
  Lightbulb,
  Layers,
  AlertCircle,
  Award,
  ShieldCheck,
  Mail,
  Calendar,
  Radio
} from 'lucide-react';
import { toast } from 'sonner';
import { internshipService } from '@/services/internshipService';

// ─── Filter Types & Categories ───────────────────────────────────────────────
type EmploymentType = 'Full Time' | 'Remote' | 'Part Time';
type RoleCategory = 'Business Development' | 'Digital Marketing' | 'Software Engineering' | 'Operations & Strategy';

interface RoleJD {
  id: string;
  title: string;
  category: RoleCategory;
  employmentType: EmploymentType;
  compensation: string;
  certificatePolicy: string;
  lorPolicy: string;
  workflowDetails: string;
  targetAudience: string;
  tagline: string;
  durations: string[];
  overview: string;
  keyResponsibilities: string[];
  learningOutcomes: string[];
  interlinkingFeature: string;
  requirements: string[];
}

// ─── Master Jobs & Internship Matrix ─────────────────────────────────────────
// Complete transparency: Unpaid internship, Official Certificate on completion,
// LOR provided strictly upon 2 years of active service, platform-based task allocation with CEO approvals.
const ROLES: RoleJD[] = [
  {
    id: 'bd-intern',
    title: 'Business Development Intern',
    category: 'Business Development',
    employmentType: 'Remote',
    compensation: 'Unpaid Internship (Skill-Building & Academic Practical Track)',
    certificatePolicy: 'Official Certificate of Internship Completion awarded upon successful tenure and task completion.',
    lorPolicy: 'Letter of Recommendation (LOR) is provided strictly upon completing 2 years of continuous active working with Siddhi Dynamics.',
    workflowDetails: 'Tasks assigned via internal platform with stipulated deadlines. Client lead approvals and timeline extensions require direct CEO portal approval.',
    targetAudience: 'MBA & BBA Students / Business Graduates',
    tagline: 'Drive client acquisition, identify market opportunities, and convert real-world enterprise pipeline across regional hubs.',
    durations: ['3 Months', '6 Months', '9 Months', '12 Months'],
    overview: 'As a Business Development Intern at Siddhi Dynamics, you operate at the frontier of technology commercialization. You will research regional enterprises, introduce cutting-edge business automation, ERP solutions (like PrintFlow & Nexus ERP), and customized digital transformation pipelines to business owners. This role provides practical boardroom sales and B2B consultative experience. It is an unpaid learning track where deliverables build your verifiable Point of Proof portfolio.',
    keyResponsibilities: [
      'Research and identify target client segments across regional hubs (Hyderabad, Nizamabad, Bangalore, Mumbai) needing business automation & ERP solutions.',
      'Conduct exploratory client discovery calls and demonstrate product capabilities including PrintFlow, Nexus ERP, and Custom Automations.',
      'Execute structured business development tasks assigned through the internal platform within stipulated timelines.',
      'Log verified outreach milestones, client requirements, and stage transitions directly in the internal portal for audit and review.',
      'Coordinate with the Digital Marketing team to align client outreach campaigns with tailored content assets.'
    ],
    learningOutcomes: [
      'Mastery of B2B SaaS sales cycles, enterprise product demonstrations, and CRM pipeline governance.',
      'Direct real-world experience negotiating and structuring software solution proposals for regional MSMEs.',
      'Official Certificate of Internship Completion with a verifiable online record on our ledger upon concluding tenure.',
      'Clear eligibility for a formal institutional Letter of Recommendation (LOR) upon completing 2 years of active service.'
    ],
    interlinkingFeature: 'Cross-functional synergy: Every BD lead feeds real-time market data to our Digital Marketing interns for contextual collateral generation.',
    requirements: [
      'Currently enrolled in or graduate of MBA, BBA, B.Com, or related business and management programs.',
      'Strong communication and interpersonal skills in English and Hindi or Telugu.',
      'High ownership mindset, dedication to meeting stipulated deadlines, and eagerness to build genuine career credentials.',
      'Understanding and acceptance that this is an unpaid internship granting an official completion certificate (with LOR upon 2 years of working).'
    ]
  },
  {
    id: 'dm-intern',
    title: 'Digital Marketing Intern',
    category: 'Digital Marketing',
    employmentType: 'Remote',
    compensation: 'Unpaid Internship (Skill-Building & Academic Practical Track)',
    certificatePolicy: 'Official Certificate of Internship Completion awarded upon successful tenure and task completion.',
    lorPolicy: 'Letter of Recommendation (LOR) is provided strictly upon completing 2 years of continuous active working with Siddhi Dynamics.',
    workflowDetails: 'Tasks assigned via internal platform with stipulated deadlines. Creative asset access and deadline extensions can be requested by interns and approved by CEO.',
    targetAudience: 'BBA / MBA Marketing, Media & Creative Innovators',
    tagline: 'Scale Instagram reach, craft viral content for PrintFlow & client brands, and engineer data-driven social conversion funnels.',
    durations: ['3 Months', '6 Months', '9 Months', '12 Months'],
    overview: 'Shape the visual and organic identity of Siddhi Dynamics and our flagship products (like PrintFlow and AI automation suites). You will oversee growth for @siddhidynamics, architect high-retention Instagram reels, create educational carousels, and respond to sales intelligence to drive inbound client pipeline. This is an unpaid educational internship with tasks assigned through our platform to build a verifiable public portfolio.',
    keyResponsibilities: [
      'Drive organic growth and audience engagement on the official Instagram page (@siddhidynamics) and partner accounts.',
      'Create high-hook Reels, carousel infographics, and short-form video scripts highlighting PrintFlow and AI automation.',
      'Collaborate in real-time with the Business Development team to deploy targeted content based on real market questions.',
      'Execute content sprint tasks within stipulated platform deadlines, requesting asset access or timeline extensions via admin.',
      'Track reach, hook retention rate, non-follower discovery, and profile conversion metrics as verifiable Points of Proof.'
    ],
    learningOutcomes: [
      'Hands-on expertise in algorithm-driven organic social growth, A/B video hook testing, and SaaS product marketing.',
      'Attribution tracking mastery: track customer journey from Instagram Reel view to demo booking.',
      'Official Certificate of Internship Completion with a verifiable online record on our ledger upon concluding tenure.',
      'Clear eligibility for a formal institutional Letter of Recommendation (LOR) upon completing 2 years of active service.'
    ],
    interlinkingFeature: 'Agile Content Sprints: You work hand-in-hand with the BD team using our unified referral and interlink tracker for mutual attribution.',
    requirements: [
      'Enrolled in or completed BBA, MBA (Marketing), Mass Communication, or passionate self-taught social media marketer.',
      'Familiarity with Instagram Reels, CapCut/Premiere/Canva, and current B2B social media trends.',
      'Creativity, prompt turnaround, and passion for AI and software automation.',
      'Understanding and acceptance that this is an unpaid internship granting an official completion certificate (with LOR upon 2 years of working).'
    ]
  }
];

// ─── Filter Category Definitions ─────────────────────────────────────────────
const ALL_CATEGORIES: { id: RoleCategory; label: string }[] = [
  { id: 'Business Development', label: 'Business Development' },
  { id: 'Digital Marketing', label: 'Digital Marketing' },
  { id: 'Software Engineering', label: 'Software Engineering' },
  { id: 'Operations & Strategy', label: 'Operations & Strategy' },
];

// ─── Employment type icon & styling helpers ──────────────────────────────────
function empIcon(t: EmploymentType) {
  if (t === 'Full Time') return Building2;
  if (t === 'Remote') return Globe;
  return Coffee;
}

function empColor(t: EmploymentType) {
  if (t === 'Full Time') return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
  if (t === 'Remote') return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
  return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
}

// ─── Stay Tuned Dynamic Animated Illustration Component ─────────────────────
function StayTunedIllustration() {
  return (
    <div className="relative w-72 h-72 mx-auto mb-6 flex items-center justify-center select-none">
      {/* Ambient Pulsing Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-primary/25 rounded-full blur-3xl pointer-events-none"
      />

      {/* Outer Radar Rings (Harmonious with theme card and border) */}
      <div className="absolute inset-2 rounded-full border border-border/80 bg-card/60 backdrop-blur-sm shadow-inner" />
      <div className="absolute inset-10 rounded-full border border-primary/20 dark:border-primary/30 border-dashed" />
      <div className="absolute inset-20 rounded-full border border-primary/30 dark:border-primary/40" />
      <div className="absolute inset-28 rounded-full border border-primary/40 dark:border-primary/60" />

      {/* Crosshair coordinate axes */}
      <div className="absolute inset-x-4 top-1/2 h-[1px] bg-primary/20 dark:bg-primary/30 -translate-y-1/2" />
      <div className="absolute inset-y-4 left-1/2 w-[1px] bg-primary/20 dark:bg-primary/30 -translate-x-1/2" />

      {/* Cardinal calibration ticks */}
      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold tracking-widest text-primary/70">N·360°</span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold tracking-widest text-primary/70">S·180°</span>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold tracking-widest text-primary/70">W·270°</span>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold tracking-widest text-primary/70">E·090°</span>

      {/* Expanding Pulse Waves */}
      {[0, 1.2, 2.4].map((delay, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full border border-primary/50 pointer-events-none"
          initial={{ width: 44, height: 44, opacity: 0.8 }}
          animate={{
            width: [44, 250],
            height: [44, 250],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            delay,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Smooth Rotating Radar Sweep Cone */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        className="absolute inset-2 rounded-full pointer-events-none overflow-hidden"
      >
        <div
          className="w-full h-full"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, hsl(var(--primary) / 0.4) 0deg, hsl(var(--primary) / 0.08) 50deg, transparent 70deg, transparent 360deg)'
          }}
        />
      </motion.div>

      {/* Floating Target Nodes (Upcoming Roles in Pipeline) */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
        className="absolute top-14 right-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-primary/40 shadow-lg text-[10px] font-bold text-foreground"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Full-Time Eng</span>
      </motion.div>

      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.6 }}
        className="absolute bottom-14 left-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-amber-500/40 shadow-lg text-[10px] font-bold text-foreground"
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span>Ops & Strategy</span>
      </motion.div>

      {/* Center Beacon Hub with Live Broadcast Icon */}
      <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 border border-primary/60 flex items-center justify-center shadow-xl text-primary-foreground">
        <Radio className="w-7 h-7 animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
        </span>
      </div>
    </div>
  );
}

// ─── Main Careers Page ───────────────────────────────────────────────────────
export default function Careers() {
  const [empFilter, setEmpFilter] = useState<'all' | EmploymentType>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleCategory>('all');
  const [selectedJdModal, setSelectedJdModal] = useState<RoleJD | null>(null);
  const [applicationModal, setApplicationModal] = useState<RoleJD | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when either modal is open to ensure clean scrolling inside modal
  useEffect(() => {
    if (applicationModal || selectedJdModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [applicationModal, selectedJdModal]);

  // Application Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState<'MBA' | 'BBA' | 'B.Tech' | 'B.Com' | 'Other'>('MBA');
  const [duration, setDuration] = useState<'3 Months' | '6 Months' | '9 Months' | '12 Months'>('6 Months');
  const [linkedin, setLinkedin] = useState('');
  const [portfolioOrSocial, setPortfolioOrSocial] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // ─── Filtering ─────────────────────────────────────────────────────────────
  const filteredRoles = ROLES.filter(r => {
    if (empFilter !== 'all' && r.employmentType !== empFilter) return false;
    if (roleFilter !== 'all' && r.category !== roleFilter) return false;
    return true;
  });

  // Current active filter name for display
  const activeFilterName = () => {
    if (empFilter !== 'all' && roleFilter !== 'all') {
      return `"${empFilter}" + "${roleFilter}"`;
    }
    if (empFilter !== 'all') return `"${empFilter}"`;
    if (roleFilter !== 'all') return `"${roleFilter}"`;
    return 'this category';
  };

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleOpenApply = (role: RoleJD) => {
    setApplicationModal(role);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // ─── Download Official JD File (.txt) ───────────────────────────────────────
  const handleDownloadJd = (role: RoleJD) => {
    const jdText = `
================================================================================
SIDDHI DYNAMICS LLP — OFFICIAL JOB DESCRIPTION & INTERNSHIP TERMS
Position: ${role.title}
Department: ${role.category}
Employment Type: ${role.employmentType} (Remote Task-Based Platform Workflow)
Compensation: Unpaid Internship (Hands-on Academic & Skill Learning Track)
Target Candidates: ${role.targetAudience}
Available Durations: ${role.durations.join(', ')}
Location: Remote / Virtual (Offices in Hyderabad & Nizamabad)
Official Careers Email: careers@siddhidynamics.in
General Enquiries: hello@siddhidynamics.in
Website: https://siddhidynamics.in
================================================================================

1. TRANSPARENT TERMS & CREDENTIALING POLICY (CRUCIAL INFORMATION)
--------------------------------------------------------------------------------
• COMPENSATION: This is an UNPAID INTERNSHIP designed strictly for practical 
  skill development, hands-on enterprise experience, and academic alignment 
  for MBA, BBA, and business students. No monthly stipend or base salary is provided.

• CERTIFICATE OF INTERNSHIP COMPLETION: Every intern who successfully completes 
  their selected tenure (${role.durations.join(' / ')}) and fulfills their 
  assigned task deliverables will be awarded an Official Certificate of Internship 
  Completion. The certificate features a unique Certificate Number and tamper-proof 
  cryptographic verification checksum, verifiable on:
  https://siddhidynamics.in/verify-certificate

• LETTER OF RECOMMENDATION (LOR) POLICY: A formal, signed institutional Letter 
  of Recommendation (LOR) is provided STRICTLY upon completing a minimum of 
  TWO (2) YEARS of continuous active working / association with Siddhi Dynamics LLP. 
  Standard internship tenures (3, 6, 9, or 12 months) receive the Certificate 
  of Completion only, and do not qualify for an LOR.

• TASK WORKFLOW & TIMELINES: All tasks are assigned through the internal platform 
  with stipulated deadlines. If an intern requires additional time to conclude a 
  client engagement or needs proprietary company data/assets, they can submit 
  an official request directly through the portal, which will be reviewed and 
  approved by the Founder & CEO.

• ZERO SCAM GUARANTEE: Siddhi Dynamics LLP maintains 100% transparency. There are 
  no hidden costs, registration fees, or false claims. All deliverables are 
  recorded in our Point of Proof ledger for authentic portfolio building.

2. ROLE OVERVIEW
--------------------------------------------------------------------------------
${role.overview}

3. KEY RESPONSIBILITIES & DAILY IMPACT
--------------------------------------------------------------------------------
${role.keyResponsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

4. CROSS-FUNCTIONAL COLLABORATION
--------------------------------------------------------------------------------
${role.interlinkingFeature}

5. LEARNING OUTCOMES & CAREER ADVANCEMENT
--------------------------------------------------------------------------------
${role.learningOutcomes.map((l) => `• ${l}`).join('\n')}

6. ELIGIBILITY & REQUIREMENTS
--------------------------------------------------------------------------------
${role.requirements.map((req) => `✓ ${req}`).join('\n')}

7. SELECTION & ONBOARDING WORKFLOW
--------------------------------------------------------------------------------
Step 1: Online Application via https://siddhidynamics.in/careers
Step 2: Profile Screening & Interview Scheduling by Careers Team
Step 3: Virtual Interview with Founder & CEO (Google Meet)
Step 4: Digital Offer Letter Issuance (Signable securely inside portal)
Step 5: Portal Onboarding, Rules & Code of Conduct Acceptance
Step 6: Stipulated Timeline Task Execution & Point of Proof Documentation
Step 7: Official Certificate of Internship Completion Generation

Official Contact: careers@siddhidynamics.in | hello@siddhidynamics.in
Authorized by: Founder & Designated Partner, Siddhi Dynamics LLP
================================================================================
    `.trim();

    const blob = new Blob([jdText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Siddhi_Dynamics_JD_${role.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Job Description for ${role.title} downloaded!`);
  };

  const resetForm = () => {
    setFullName(''); setEmail(''); setPhone(''); setCollege('');
    setStatementOfPurpose(''); setResumeUrl(''); setLinkedin('');
    setPortfolioOrSocial(''); setUploadedFiles([]);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !college || !statementOfPurpose) {
      toast.error('Please fill all mandatory fields.');
      return;
    }
    setSubmitting(true);
    try {
      await internshipService.submitApplication({
        full_name: fullName,
        email,
        phone,
        college,
        degree,
        graduation_year: '2026',
        role: (applicationModal?.title || 'Business Development Intern') as any,
        duration,
        linkedin,
        portfolio_or_social: portfolioOrSocial,
        statement_of_purpose: statementOfPurpose,
        resume_url: resumeUrl
      });
      toast.success('Application submitted! Check your email for interview scheduling.');
      setApplicationModal(null);
      resetForm();
    } catch {
      toast.error('Failed to submit. Please try again or email careers@siddhidynamics.in');
    } finally {
      setSubmitting(false);
    }
  };

  // Dashboard UI input & select styling
  const dashboardInput = "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm";
  const dashboardSelect = "w-full px-3 py-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Helmet>
        <title>Careers — Jobs & Internships | Siddhi Dynamics LLP</title>
        <meta name="description" content="Explore transparent careers and internships at Siddhi Dynamics. Remote business development and digital marketing roles with verifiable certification and CEO mentorship." />
        <link rel="canonical" href="https://siddhidynamics.in/careers" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        {/* ─── Hero Section ─── */}
        <section className="py-20 relative overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-purple-500/8 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">Careers</li>
              </ol>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                <Rocket className="w-3.5 h-3.5" /> Careers at Siddhi Dynamics
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                Build Your Career at the{' '}
                <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
                  Intersection of Business & AI
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                We offer <strong className="text-foreground">full-time, remote, and part-time</strong> opportunities
                across business development, digital marketing, software engineering, and operations.
                Whether you're an <strong className="text-foreground">MBA/BBA student</strong> seeking an internship or an
                experienced professional looking for your next challenge — explore our transparent roles below.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── Open Positions ─── */}
        <section className="py-16 container mx-auto px-6">
          <div className="flex flex-col gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-foreground">Open Positions</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Filter by employment type or role category. Click to view full JD, download details, or apply online.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Employment Type Filter */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/50 overflow-x-auto">
                {(['all', 'Full Time', 'Remote', 'Part Time'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setEmpFilter(t)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      empFilter === t
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {t !== 'all' && (() => { const I = empIcon(t as EmploymentType); return <I className="w-3.5 h-3.5" />; })()}
                    {t === 'all' ? 'All Types' : t}
                  </button>
                ))}
              </div>

              {/* Role Category Filter */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/50 overflow-x-auto">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    roleFilter === 'all'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  All Roles
                </button>
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setRoleFilter(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      roleFilter === cat.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role Cards Grid or Stay Tuned State */}
          {filteredRoles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredRoles.map((role, idx) => {
                const EmpI = empIcon(role.employmentType);
                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group relative rounded-3xl border border-border/80 bg-card text-card-foreground shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between overflow-hidden p-8"
                  >
                    {/* Subtle glow accent */}
                    <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />

                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25">
                            {role.category}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${empColor(role.employmentType)}`}>
                            <EmpI className="w-3 h-3" /> {role.employmentType}
                          </span>
                        </div>
                        <span className="text-xs text-foreground/80 dark:text-muted-foreground font-semibold flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" /> {role.targetAudience}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 group-hover:text-primary transition-colors tracking-tight">
                        {role.title}
                      </h3>
                      <p className="text-sm font-medium text-foreground/80 dark:text-muted-foreground mb-5 leading-relaxed">
                        {role.tagline}
                      </p>

                      {/* Transparent Policy Pill Badges */}
                      <div className="flex flex-wrap gap-2.5 mb-6">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" /> Unpaid Internship
                        </span>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                          <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" /> Certificate on Completion
                        </span>
                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-900 dark:text-purple-200 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" /> LOR upon 2 Yrs Working
                        </span>
                      </div>

                      {/* Responsibilities preview */}
                      <div className="space-y-2.5 mb-6 pt-4 border-t border-border/70">
                        <div className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-primary" /> Key Responsibilities & Workflow
                        </div>
                        {role.keyResponsibilities.slice(0, 3).map((resp, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/85 dark:text-muted-foreground font-medium leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </div>
                        ))}
                      </div>

                      {/* Platform Workflow summary */}
                      <div className="p-4 rounded-2xl bg-muted/60 dark:bg-muted/30 border border-border/80 text-xs text-foreground/85 dark:text-muted-foreground space-y-1 mb-6 leading-relaxed">
                        <span className="text-foreground font-bold block">Platform Task Protocol:</span>
                        Tasks assigned with stipulated timelines. Extensions and client data requests submitted via portal and approved by CEO.
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-6 border-t border-border/70 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleOpenApply(role)}
                        className="flex-1 py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
                      >
                        Apply for Role <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedJdModal(role)}
                        className="py-3 px-4 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-primary" /> View Full JD
                      </button>

                      <button
                        onClick={() => handleDownloadJd(role)}
                        title="Download official JD as text file"
                        className="py-3 px-3.5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground/80 hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* ─── Stay Tuned State with Custom Animated Radar Illustration ─── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center py-16 max-w-lg mx-auto"
            >
              <StayTunedIllustration />
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Pipeline In Preparation
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-foreground mb-3 tracking-tight">
                Stay Tuned!
              </h3>
              <p className="text-sm text-foreground/80 dark:text-muted-foreground leading-relaxed mb-6 max-w-md">
                We currently do not have active openings under <strong className="text-foreground font-bold">{activeFilterName()}</strong>.
                We are actively architecting upcoming Full-Time, Engineering, and Operations positions as Siddhi Dynamics expands.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => { setEmpFilter('all'); setRoleFilter('all'); }}
                  className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold tracking-wide uppercase cursor-pointer hover:opacity-95 hover:shadow-lg transition-all"
                >
                  View Active Internships
                </button>
                <a
                  href="mailto:careers@siddhidynamics.in?subject=General Application / Future Openings"
                  className="px-6 py-3 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-extrabold tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Send Open Resume
                </a>
              </div>
            </motion.div>
          )}
        </section>

        {/* ─── Cross-Functional Collaboration Architecture ─── */}
        <section className="py-16 border-t border-border/30 bg-card/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                How We Work
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4">Cross-Functional Collaboration Engine</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                At Siddhi Dynamics, no one works in isolation. Whether you're in business development, marketing, engineering, or operations — our teams form an
                integrated growth loop. When a milestone is achieved, every contributor receives verified credit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-3xl bg-card border border-border/70 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-foreground text-base">Identify Opportunities</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Team members surface insights from their domain — whether it's a market gap spotted by BD, a trending content format flagged by marketing, or a technical improvement proposed by engineering. Signals flow instantly across teams.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border/70 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-foreground text-base">Execute Sprint Campaigns</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cross-functional squads rapidly deploy solutions — targeted outreach, content campaigns, product fixes, or client demos — within our sprint-based task board with real-time tracking and CEO approvals.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card border border-border/70 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-foreground text-base">Shared Attribution & Growth</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every successful outcome is attributed to all contributing team members. Our Point of Proof system ensures transparent, verifiable credit — building genuine career portfolios for everyone involved.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Full JD Modal (Crystal Clear & Honest Disclosure) ─── */}
      <AnimatePresence>
        {selectedJdModal && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-16 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-card text-card-foreground border border-border rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setSelectedJdModal(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">
                <FileText className="w-4 h-4" /> Official Job Description
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1">{selectedJdModal.title}</h2>
              <div className="flex items-center gap-2 flex-wrap mb-6">
                <span className="text-xs text-muted-foreground">Department: {selectedJdModal.category}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${empColor(selectedJdModal.employmentType)}`}>
                  {selectedJdModal.employmentType}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">Tenures: {selectedJdModal.durations.join(', ')}</span>
              </div>

              {/* Crucial Transparency Policy Box */}
              <div className="mb-6 p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 space-y-2.5">
                <div className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Mandatory Credential & Terms Disclosure
                </div>
                <div className="grid grid-cols-1 gap-2.5 text-xs text-foreground/85 dark:text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-foreground shrink-0">• Compensation:</span>
                    <span><strong>Unpaid Internship</strong> (Skill-learning & academic practical experience for MBA/BBA students).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-foreground shrink-0">• Certification:</span>
                    <span>Interns receive an <strong>Official Certificate of Internship Completion</strong> upon successfully completing their chosen tenure and deliverables.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-foreground shrink-0">• Letter of Recommendation:</span>
                    <span>A formal <strong>Letter of Recommendation (LOR) is provided strictly upon 2 years of active working / association</strong> with Siddhi Dynamics.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-foreground shrink-0">• Workflow:</span>
                    <span>Tasks are assigned with stipulated deadlines. Deadline extensions and proprietary data requests can be submitted via portal and approved by CEO.</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-xs text-foreground/80 dark:text-muted-foreground">
                <div>
                  <h4 className="font-bold text-foreground text-sm mb-1.5">Overview</h4>
                  <p className="leading-relaxed text-foreground/80 dark:text-muted-foreground">{selectedJdModal.overview}</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground text-sm mb-1.5">Key Responsibilities</h4>
                  <ul className="space-y-1.5 text-foreground/80 dark:text-muted-foreground">
                    {selectedJdModal.keyResponsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground text-sm mb-1.5">Cross-Functional Collaboration</h4>
                  <p className="leading-relaxed text-foreground/80 dark:text-muted-foreground">{selectedJdModal.interlinkingFeature}</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground text-sm mb-1.5">Learning Outcomes & Credentials</h4>
                  <ul className="space-y-1.5 text-foreground/80 dark:text-muted-foreground">
                    {selectedJdModal.learningOutcomes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground text-sm mb-1.5">Eligibility & Requirements</h4>
                  <ul className="space-y-1.5 text-foreground/80 dark:text-muted-foreground">
                    {selectedJdModal.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground text-sm mb-1.5">Selection & Evaluation Workflow</h4>
                  <ol className="space-y-1 text-foreground/80 dark:text-muted-foreground list-decimal list-inside">
                    <li>Submit online application with Statement of Purpose</li>
                    <li>Profile screening and CEO interview invitation</li>
                    <li>Digital Offer Letter issued and signed in internal portal</li>
                    <li>Portal task execution within stipulated timelines</li>
                    <li>Official Certificate of Internship Completion issuance on ledger</li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-end gap-3 flex-wrap">
                <button
                  onClick={() => handleDownloadJd(selectedJdModal)}
                  className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Download JD (.txt)
                </button>
                <button
                  onClick={() => {
                    handleOpenApply(selectedJdModal);
                    setSelectedJdModal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold tracking-wider uppercase flex items-center gap-2 cursor-pointer hover:opacity-95 transition-all shadow-md"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Application Modal (Dashboard UI Design) ─── */}
      <AnimatePresence>
        {applicationModal && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-16 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-2xl my-auto"
            >
              {/* Dashboard styled modal card */}
              <div className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-card text-card-foreground border border-border shadow-2xl overflow-hidden">
                {/* Subtle brand glow accent */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={() => { setApplicationModal(null); resetForm(); }}
                  className="absolute top-5 right-5 p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                    <Send className="w-3 h-3" /> Apply Now
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground mb-1">
                    {applicationModal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {applicationModal.category} • {applicationModal.employmentType} • Applications reviewed directly by Founder & CEO.
                  </p>

                  {/* Notice of unpaid & certification in dashboard theme style */}
                  <div className="mt-3.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong className="font-bold">Notice:</strong> This is an unpaid internship for practical skill growth. Interns receive an official Certificate of Completion upon finishing tenure. (Letter of Recommendation is provided strictly upon 2 years of active service).
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="relative z-10 space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Full Name *</label>
                      <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className={dashboardInput} placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Email Address *</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={dashboardInput} placeholder="your.email@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">WhatsApp / Phone *</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className={dashboardInput} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">College / University *</label>
                      <input type="text" required value={college} onChange={e => setCollege(e.target.value)} className={dashboardInput} placeholder="Institute / University name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Current Degree *</label>
                      <select value={degree} onChange={(e: any) => setDegree(e.target.value)} className={dashboardSelect}>
                        <option value="MBA">MBA</option>
                        <option value="BBA">BBA</option>
                        <option value="B.Tech">B.Tech / Engineering</option>
                        <option value="B.Com">B.Com</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Preferred Duration *</label>
                      <select value={duration} onChange={(e: any) => setDuration(e.target.value)} className={dashboardSelect}>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="9 Months">9 Months</option>
                        <option value="12 Months">12 Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">LinkedIn Profile</label>
                      <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} className={dashboardInput} placeholder="https://linkedin.com/in/username" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">Instagram / Portfolio</label>
                      <input type="text" value={portfolioOrSocial} onChange={e => setPortfolioOrSocial(e.target.value)} className={dashboardInput} placeholder="@handle or portfolio URL" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1.5">
                      Statement of Purpose & Career Objectives *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={statementOfPurpose}
                      onChange={e => setStatementOfPurpose(e.target.value)}
                      placeholder="Why do you want to join Siddhi Dynamics? Share your goals and what you hope to achieve during this internship."
                      className={`${dashboardInput} leading-relaxed resize-y`}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1.5">
                      Resume & Supporting Documents
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/25 hover:bg-muted/40 p-6 text-center cursor-pointer transition-all group"
                    >
                      <Upload className="w-7 h-7 mx-auto text-primary transition-transform group-hover:-translate-y-0.5 mb-2" />
                      <p className="text-xs text-foreground/80 font-medium">
                        <span className="text-primary font-bold">Click to upload</span>{' '}
                        or drag & drop — Resume, Cover Letter, Portfolio (multiple files allowed)
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">PDF, DOC, DOCX, PNG, JPG — up to 10 MB each</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-muted/40 border border-border text-xs">
                            <span className="text-foreground font-medium truncate flex-1 mr-2">{f.name}</span>
                            <span className="text-muted-foreground text-[11px] mr-3">{(f.size / 1024).toFixed(0)} KB</span>
                            <button type="button" onClick={() => removeFile(i)} className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Or paste link */}
                    <div className="mt-3">
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Or paste a Google Drive / portfolio link</label>
                      <input type="url" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} className={dashboardInput} placeholder="https://drive.google.com/... or https://yourportfolio.com" />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:opacity-95 transition-all shadow-lg hover:shadow-xl"
                    >
                      {submitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Application
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
                      By submitting, you acknowledge that this is an unpaid internship granting an official completion certificate (and LOR upon 2 years). Applications are delivered to{' '}
                      <strong className="text-foreground">careers@siddhidynamics.in</strong>.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
}
