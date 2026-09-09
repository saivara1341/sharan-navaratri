import { useState, useRef, useEffect } from 'react';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType,
  convertInchesToTwip,
  Footer as DocFooter,
} from 'docx';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { internshipService } from '@/services/internshipService';
import { CloudflareTurnstile } from '@/components/common/CloudflareTurnstile';

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

// ─── Collaboration Cards with Scroll-Triggered Slide Animation ────────────────
function CollabCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* Left card — slides in from right (toward left) */}
      <motion.div
        initial={{ opacity: 0, x: 120 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 120 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="p-6 rounded-3xl bg-card border border-border/70 space-y-3 shadow-sm"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-foreground text-base">Identify Opportunities</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Team members surface insights from their domain — whether it's a market gap spotted by BD, a trending content format flagged by marketing, or a technical improvement proposed by engineering. Signals flow instantly across teams.
        </p>
      </motion.div>

      {/* Middle card — fades up */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.65, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="p-6 rounded-3xl bg-card border border-border/70 space-y-3 shadow-sm"
      >
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
          <Layers className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-foreground text-base">Execute Sprint Campaigns</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Cross-functional squads rapidly deploy solutions — targeted outreach, content campaigns, product fixes, or client demos — within our sprint-based task board with real-time tracking and CEO approvals.
        </p>
      </motion.div>

      {/* Right card — slides in from left (toward right) */}
      <motion.div
        initial={{ opacity: 0, x: -120 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -120 }}
        transition={{ duration: 0.65, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="p-6 rounded-3xl bg-card border border-border/70 space-y-3 shadow-sm"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-foreground text-base">Shared Attribution & Growth</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Every successful outcome is attributed to all contributing team members. Our Point of Proof system ensures transparent, verifiable credit — building genuine career portfolios for everyone involved.
        </p>
      </motion.div>
    </div>
  );
}

// ─── Employment type icon & styling helpers ──────────────────────────────────
function empIcon(t: EmploymentType) {
  if (t === 'Full Time') return Building2;
  if (t === 'Remote') return Globe;
  return Coffee;
}

function empColor(t: EmploymentType) {
  if (t === 'Full Time') return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
  if (t === 'Remote') return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';
  return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
}

function getCategoryIcon(cat: RoleCategory) {
  if (cat === 'Business Development') return TrendingUp;
  if (cat === 'Digital Marketing') return Rocket;
  if (cat === 'Software Engineering') return Layers;
  return Building2;
}

// ─── Stay Tuned Dynamic Animated Illustration Component ─────────────────────
function StayTunedIllustration() {
  return (
    <div className="w-64 h-64 mx-auto mb-2">
      <iframe
        src="https://lottie.host/embed/3fdf63fb-1c60-4c33-8a09-a90a02838991/qrbmYjKuFH.lottie"
        className="w-full h-full border-0"
        title="Stay Tuned animation"
        allow="autoplay"
      />
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
  const [otherDegree, setOtherDegree] = useState('');
  const [duration, setDuration] = useState<'3 Months' | '6 Months' | '9 Months' | '12 Months'>('6 Months');
  const [linkedin, setLinkedin] = useState('');
  const [portfolioOrSocial, setPortfolioOrSocial] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

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
    setTurnstileToken(null);
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
  const handleDownloadJd = async (role: RoleJD) => {
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

    // ── Helper builders ──────────────────────────────────────────────────────
    const BRAND_BLUE = '2563EB';
    const BRAND_DARK = '0F172A';
    const MUTED      = '64748B';
    const AMBER_BG   = 'FFFBEB';
    const AMBER_BD   = 'FCD34D';
    const INFO_BG    = 'EFF6FF';
    const INFO_BD    = 'BFDBFE';

    const gap = (pts = 6) => new Paragraph({ spacing: { before: pts * 20 } });

    const sectionHeading = (text: string) => new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND_BLUE, space: 4 } },
      run: { color: BRAND_BLUE, bold: true, size: 26 },
    });

    const bodyPara = (text: string, opts: { bold?: boolean; color?: string; size?: number } = {}) =>
      new Paragraph({
        spacing: { before: 60, after: 60, line: 320 },
        children: [new TextRun({ text, font: 'Calibri', size: opts.size ?? 22, bold: opts.bold, color: opts.color ?? BRAND_DARK })],
      });

    const labelValue = (label: string, value: string) =>
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({ text: `${label}: `, font: 'Calibri', size: 22, bold: true, color: BRAND_DARK }),
          new TextRun({ text: value, font: 'Calibri', size: 22, color: MUTED }),
        ],
      });

    const bulletItem = (text: string, color = BRAND_DARK) =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 60, after: 60, line: 300 },
        children: [new TextRun({ text, font: 'Calibri', size: 22, color })],
      });

    const numberedItem = (text: string, num: number) =>
      new Paragraph({
        spacing: { before: 60, after: 60, line: 300 },
        children: [
          new TextRun({ text: `${num}.  `, font: 'Calibri', size: 22, bold: true, color: BRAND_BLUE }),
          new TextRun({ text, font: 'Calibri', size: 22, color: BRAND_DARK }),
        ],
      });

    const shadedBox = (children: Paragraph[], bgHex: string, borderHex: string) =>
      children.map(p => {
        (p as any).properties = { ...(p as any).properties };
        return new Paragraph({
          ...p,
          shading: { type: ShadingType.SOLID, color: bgHex, fill: bgHex },
          border: {
            top:    { style: BorderStyle.SINGLE, size: 4, color: borderHex, space: 4 },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: borderHex, space: 4 },
            left:   { style: BorderStyle.SINGLE, size: 12, color: borderHex, space: 6 },
            right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          },
        });
      });

    // ── Document sections ────────────────────────────────────────────────────
    const doc = new Document({
      styles: {
        default: {
          document: { run: { font: 'Calibri', size: 22, color: BRAND_DARK } },
        },
      },
      sections: [{
        properties: {
          page: {
            margin: {
              top:    convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left:   convertInchesToTwip(1.25),
              right:  convertInchesToTwip(1.25),
            },
          },
        },
        footers: {
          default: new DocFooter({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Siddhi Dynamics LLP  •  careers@siddhidynamics.in  •  https://siddhidynamics.in', font: 'Calibri', size: 18, color: MUTED }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ── Cover / Title block ───────────────────────────────────────────
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 40 },
            children: [
              new TextRun({ text: 'SIDDHI DYNAMICS LLP', font: 'Calibri', size: 20, bold: true, color: MUTED, allCaps: true }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 40, after: 120 },
            children: [
              new TextRun({ text: role.title, font: 'Calibri', size: 52, bold: true, color: BRAND_DARK }),
            ],
          }),

          // Info box (shaded blue)
          ...shadedBox([
            labelValue('Department', role.category),
            labelValue('Employment Type', `${role.employmentType} — Remote / Platform-Based`),
            labelValue('Target Candidates', role.targetAudience),
            labelValue('Available Durations', role.durations.join(', ')),
            labelValue('Location', 'Remote · Offices: Hyderabad & Nizamabad, Telangana'),
            labelValue('Careers Email', 'careers@siddhidynamics.in'),
            labelValue('Website', 'https://siddhidynamics.in'),
          ], INFO_BG, INFO_BD),

          gap(12),

          // ── Disclosure Notice (amber) ─────────────────────────────────────
          ...shadedBox([
            new Paragraph({
              spacing: { before: 80, after: 80 },
              children: [
                new TextRun({ text: '⚠  Mandatory Disclosure & Terms', font: 'Calibri', size: 24, bold: true, color: '92400E' }),
              ],
            }),
            bulletItem('Compensation: UNPAID INTERNSHIP — Skill-learning & academic practical track. No stipend or salary.', '92400E'),
            bulletItem('Certificate: Official Certificate of Internship Completion awarded upon successful tenure and task completion.', '92400E'),
            bulletItem('LOR Policy: Letter of Recommendation provided strictly upon 2 years of continuous active working with Siddhi Dynamics LLP.', '92400E'),
            bulletItem('Workflow: Tasks assigned via internal platform with stipulated deadlines. Extensions require CEO portal approval.', '92400E'),
            bulletItem('Zero Scam: No registration fees, no hidden costs. All deliverables logged in Point of Proof ledger.', '92400E'),
            gap(4),
          ], AMBER_BG, AMBER_BD),

          gap(12),

          // ── 1. Overview ───────────────────────────────────────────────────
          sectionHeading('1.  Role Overview'),
          bodyPara(role.overview),

          gap(8),

          // ── 2. Responsibilities ───────────────────────────────────────────
          sectionHeading('2.  Key Responsibilities & Daily Impact'),
          ...role.keyResponsibilities.map((r, i) => numberedItem(r, i + 1)),

          gap(8),

          // ── 3. Collaboration ──────────────────────────────────────────────
          sectionHeading('3.  Cross-Functional Collaboration'),
          bodyPara(role.interlinkingFeature),

          gap(8),

          // ── 4. Outcomes ───────────────────────────────────────────────────
          sectionHeading('4.  Learning Outcomes & Career Advancement'),
          ...role.learningOutcomes.map(l => bulletItem(l)),

          gap(8),

          // ── 5. Requirements ───────────────────────────────────────────────
          sectionHeading('5.  Eligibility & Requirements'),
          ...role.requirements.map(r => bulletItem(r)),

          gap(8),

          // ── 6. Selection Process ──────────────────────────────────────────
          sectionHeading('6.  Selection & Onboarding Workflow'),
          ...[
            'Online Application via https://siddhidynamics.in/careers',
            'Profile Screening & Interview Scheduling by Careers Team',
            'Virtual Interview with Founder & CEO (Google Meet)',
            'Digital Offer Letter Issuance (Signed securely inside portal)',
            'Portal Onboarding, Rules & Code of Conduct Acceptance',
            'Stipulated Timeline Task Execution & Point of Proof Documentation',
            'Official Certificate of Internship Completion Generation',
          ].map((s, i) => numberedItem(s, i + 1)),

          gap(16),

          // ── Closing line ──────────────────────────────────────────────────
          new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0', space: 8 } },
            spacing: { before: 200 },
            children: [
              new TextRun({ text: 'Authorized by: Founder & Designated Partner, Siddhi Dynamics LLP', font: 'Calibri', size: 18, color: MUTED, italics: true }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Siddhi_Dynamics_JD_${role.title.replace(/\s+/g, '_')}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Job Description for ${role.title} downloaded as Word document!`);
  };

  const resetForm = () => {
    setFullName(''); setEmail(''); setPhone(''); setCollege('');
    setDegree('MBA'); setOtherDegree('');
    setStatementOfPurpose(''); setResumeUrl(''); setLinkedin('');
    setPortfolioOrSocial(''); setUploadedFiles([]);
    setTurnstileToken(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !college || !statementOfPurpose) {
      toast.error('Please fill all mandatory fields.');
      return;
    }
    // Phone validation — digits only, exactly 10 digits
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }
    const selectedDegree = degree === 'Other' ? otherDegree.trim() : degree;
    if (!selectedDegree) {
      toast.error('Please enter your degree.');
      return;
    }
    // Cloudflare Turnstile verification check
    if (!turnstileToken) {
      toast.error('Please complete the Cloudflare security verification to confirm you are human.');
      return;
    }
    setSubmitting(true);
    try {
      // Duplicate guard — check email and phone before submitting
      const dup = await internshipService.checkDuplicate(email, phone);
      if (dup.isDuplicate) {
        toast.error(
          dup.field === 'email'
            ? 'An application with this email already exists. We will get back to you.'
            : 'An application with this phone number already exists. We will get back to you.'
        );
        setSubmitting(false);
        return;
      }
      await internshipService.submitApplication({
        full_name: fullName,
        email,
        phone: digitsOnly,
        college,
        degree: selectedDegree,
        graduation_year: '2026',
        role: (applicationModal?.title || 'Business Development Intern') as any,
        duration,
        linkedin,
        portfolio_or_social: portfolioOrSocial,
        statement_of_purpose: statementOfPurpose,
        resume_url: resumeUrl
      });
      toast.success('Application submitted! We will get back to you shortly through email once shortlisted.');
      setApplicationModal(null);
      resetForm();
    } catch {
      toast.error('Failed to submit. Please try again or email careers@siddhidynamics.in');
    } finally {
      setSubmitting(false);
    }
  };

  // Dashboard UI input & select styling
  const dashboardInput = "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-base sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm";
  const dashboardSelect = "w-full px-3 py-3 rounded-xl bg-background border border-border text-foreground text-base sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Helmet>
        <title>Careers — Jobs & Internships | Siddhi Dynamics LLP</title>
        <meta name="description" content="Explore transparent careers and internships at Siddhi Dynamics. Remote business development and digital marketing roles with verifiable certification and CEO mentorship." />
        <link rel="canonical" href="https://siddhidynamics.in/careers" />
      </Helmet>

      <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-20">
        {/* ─── Hero Section ─── */}
        <section className="py-8 sm:py-16 lg:py-20 relative overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-purple-500/8 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-5 sm:mb-8">
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
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight">
                Build Your Career at the{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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
        <section className="py-10 sm:py-16 container mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4 mb-6 sm:mb-10">
            <div>
              <h2 className="text-3xl font-black text-foreground">Open Positions</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Filter by employment type or role category. Click to view full JD, download details, or apply online.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col xl:flex-row gap-3 min-w-0">
              {/* Employment Type Filter */}
              <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/50 min-w-0">
                {(['all', 'Full Time', 'Remote', 'Part Time'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setEmpFilter(t)}
                    className={`px-3 py-3 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
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
              <select
                aria-label="Filter by role"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as 'all' | RoleCategory)}
                className={`${dashboardSelect} sm:hidden`}
              >
                <option value="all">All Roles</option>
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <div className="hidden sm:flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/50 min-w-0">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`px-3 py-3 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
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
                    className={`px-3 py-3 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
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
            <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:gap-8">
              {filteredRoles.map((role, idx) => {
                const EmpI = empIcon(role.employmentType);
                const CatIcon = getCategoryIcon(role.category);
                return (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    onClick={() => setSelectedJdModal(role)}
                    className="group relative rounded-2xl sm:rounded-3xl border border-border/80 bg-gradient-to-b from-card via-card to-card/95 text-card-foreground shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col justify-between min-w-0 overflow-hidden p-3.5 sm:p-6 lg:p-8 cursor-pointer sm:cursor-default min-h-[320px] sm:min-h-0"
                  >
                    {/* Top Accent Gradient Bar */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-rose-500 pointer-events-none" />

                    {/* Subtle glow accent */}
                    <div className="absolute -right-16 -top-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />

                    {/* ────── Mobile View (Role, Remote, 3 Policy Badges, Apply button) ────── */}
                    <div className="sm:hidden flex flex-col justify-between h-full pt-1">
                      <div>
                        {/* Top Row: Remote Badge + Category Icon */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 shadow-xs">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Remote
                          </span>

                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-xs">
                            <CatIcon className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Role Title */}
                        <h3 className="text-[15px] font-black text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
                          {role.title}
                        </h3>

                        {/* The 3 Policy Badges */}
                        <div className="flex flex-col gap-1.5 mb-3">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold shadow-xs">
                            <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Unpaid</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-900 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold shadow-xs">
                            <Award className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Certificate</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/15 text-purple-900 dark:text-purple-300 border border-purple-500/30 text-[10px] font-bold shadow-xs">
                            <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                            <span>LOR (2 Yrs)</span>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button & Tap Hint */}
                      <div className="pt-2.5 border-t border-border/60 mt-auto">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenApply(role);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary via-primary/95 to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-black text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <span>Apply</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-center text-[9px] text-muted-foreground/75 font-medium mt-1.5 flex items-center justify-center gap-1">
                          <span>Tap card to view details</span>
                        </div>
                      </div>
                    </div>

                    {/* ────── Desktop View (Spacious, Comprehensive) ────── */}
                    <div className="hidden sm:flex flex-col justify-between h-full">
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25">
                              {role.category}
                            </span>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${empColor(role.employmentType)}`}>
                              <EmpI className="w-3 h-3" /> {role.employmentType}
                            </span>
                          </div>
                          <span className="text-xs text-foreground/80 dark:text-muted-foreground font-semibold flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="line-clamp-1">{role.targetAudience}</span>
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 group-hover:text-primary transition-colors tracking-tight leading-snug">
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

                      {/* Desktop Card Actions */}
                      <div className="pt-6 border-t border-border/70 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenApply(role);
                          }}
                          className="flex-1 py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
                        >
                          Apply for Role <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJdModal(role);
                          }}
                          className="py-3 px-4 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-primary" /> View Full JD
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadJd(role);
                          }}
                          title="Download job description"
                          aria-label="Download job description"
                          className="py-3 px-3.5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-bold text-foreground/80 hover:text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                        >
                          <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                      </div>
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
        <section className="py-10 sm:py-16 border-t border-border/30 bg-card/20">
          <div className="container mx-auto px-4 sm:px-6">
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

            <CollabCards />
          </div>
        </section>
      </main>

      {/* ─── Full JD Modal (Crystal Clear & Honest Disclosure) ─── */}
      <AnimatePresence>
        {selectedJdModal && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-card text-card-foreground border border-border rounded-3xl max-w-2xl w-full p-5 sm:p-6 md:p-8 shadow-2xl relative my-auto"
            >
              <button
                type="button"
                aria-label="Close job description"
                onClick={() => setSelectedJdModal(null)}
                className="absolute z-30 top-3 right-3 sm:top-5 sm:right-5 p-3 rounded-xl bg-muted/60 text-muted-foreground hover:text-white hover:bg-red-600 active:text-white active:bg-red-600 focus-visible:text-white focus-visible:bg-red-600 transition-colors cursor-pointer pointer-events-auto"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 pr-12 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">
                <FileText className="w-4 h-4" /> Official Job Description
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 pr-10">{selectedJdModal.title}</h2>
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
                  <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                    <span className="font-bold text-foreground shrink-0">• Compensation:</span>
                    <span><strong>Unpaid Internship</strong> (Skill-learning & academic practical experience for MBA/BBA students).</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                    <span className="font-bold text-foreground shrink-0">• Certification:</span>
                    <span>Interns receive an <strong>Official Certificate of Internship Completion</strong> upon successfully completing their chosen tenure and deliverables.</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
                    <span className="font-bold text-foreground shrink-0">• Letter of Recommendation:</span>
                    <span>A formal <strong>Letter of Recommendation (LOR) is provided strictly upon 2 years of active working / association</strong> with Siddhi Dynamics.</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2">
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
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Download JD (.doc)
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
          <div className="fixed inset-0 z-[120] flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-2xl my-auto"
            >
              {/* Dashboard styled modal card */}
              <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 bg-card text-card-foreground border border-border shadow-2xl overflow-hidden">
                {/* Subtle brand glow accent */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />

                {/* Close Button */}
                <button
                  type="button"
                  aria-label="Close application form"
                  onClick={() => { setApplicationModal(null); resetForm(); }}
                  className="absolute z-30 top-3 right-3 sm:top-5 sm:right-5 p-3 rounded-xl bg-muted/60 text-muted-foreground hover:text-white hover:bg-red-600 active:text-white active:bg-red-600 focus-visible:text-white focus-visible:bg-red-600 transition-colors cursor-pointer pointer-events-auto"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3 mr-14 min-h-8">
                    <Send className="w-3 h-3" /> Apply Now
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground mb-1 pr-10">
                    {applicationModal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {applicationModal.category} • {applicationModal.employmentType} • Applications reviewed directly by Founder & CEO.
                  </p>

                  {/* Notice of unpaid & certification in dashboard theme style */}
                  <div className="mt-3.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
                    <div><strong className="font-bold">Notice:</strong> This is an unpaid internship for practical skill growth. Interns receive an official Certificate of Completion upon finishing tenure.</div>
                    <div>(Letter of Recommendation is provided strictly upon 2 years of active service).</div>
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
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(digits);
                        }}
                        className={dashboardInput}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">College / University *</label>
                      <input type="text" required value={college} onChange={e => setCollege(e.target.value)} className={dashboardInput} placeholder="Enter your college or university" />
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
                      {degree === 'Other' && (
                        <div className="mt-3">
                          <label htmlFor="other-degree" className="text-xs font-bold text-foreground block mb-1.5">Please specify your degree *</label>
                          <input id="other-degree" type="text" required value={otherDegree} onChange={e => setOtherDegree(e.target.value)} className={dashboardInput} placeholder="Enter your degree" />
                        </div>
                      )}
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

                  {/* Cloudflare Turnstile Bot Verification */}
                  <div className="pt-2">
                    <CloudflareTurnstile
                      action="career_application"
                      onVerify={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken(null)}
                      onError={() => setTurnstileToken(null)}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || !turnstileToken}
                      className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-all shadow-lg hover:shadow-xl"
                    >
                      {submitting ? (
                        <span>Submitting Application...</span>
                      ) : !turnstileToken ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-primary-foreground/80" /> Verify Security to Submit
                        </>
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
