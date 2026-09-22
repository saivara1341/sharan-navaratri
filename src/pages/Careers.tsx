import { useState, useRef, useEffect } from 'react';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, ShadingType,
  convertInchesToTwip,
  Footer as DocFooter,
} from 'docx';
import { SeoHead, jobPostingSchema, orgSchema } from '@/components/seo/SeoHead';
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
  FileSignature,
  Mail,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  internshipService, 
  RoleJD, 
  RoleCategory, 
  EmploymentType, 
  DEFAULT_CAREER_ROLES 
} from '@/services/internshipService';

const ROLES: RoleJD[] = DEFAULT_CAREER_ROLES;

const ALL_CATEGORIES: { id: RoleCategory; label: string }[] = [
  { id: 'Product Management', label: 'Product Management' },
  { id: 'Business Development', label: 'Business Development' },
  { id: 'Digital Marketing', label: 'Digital Marketing' },
  { id: 'Software Engineering', label: 'Software Engineering' },
  { id: 'Operations & Strategy', label: 'Operations & Strategy' },
];

function CollabCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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

function StayTunedIllustration() {
  return (
    <div className="w-64 h-64 mx-auto mb-2 flex items-center justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className="w-8 h-8 text-primary" />
        </div>
      </div>
    </div>
  );
}

export default function Careers() {
  const [roles, setRoles] = useState<RoleJD[]>(DEFAULT_CAREER_ROLES);
  const [empFilter, setEmpFilter] = useState<'all' | EmploymentType>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleCategory>('all');
  const [selectedJdModal, setSelectedJdModal] = useState<RoleJD | null>(null);
  const [applicationModal, setApplicationModal] = useState<RoleJD | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    internshipService.getCareerRoles().then(liveRoles => {
      if (isMounted && liveRoles && liveRoles.length > 0) {
        setRoles(liveRoles);
      }
    }).catch(err => {
      console.warn('Could not load live career roles from database:', err);
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const MAX_RESUME_SIZE_MB = 5;
  const MAX_RESUME_SIZE_BYTES = MAX_RESUME_SIZE_MB * 1024 * 1024;
  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

  const filteredRoles = roles.filter(r => {
    if (empFilter !== 'all' && r.employmentType !== empFilter) return false;
    if (roleFilter !== 'all' && r.category !== roleFilter) return false;
    return true;
  });

  const activeFilterName = () => {
    if (empFilter !== 'all' && roleFilter !== 'all') {
      return `"${empFilter}" + "${roleFilter}"`;
    }
    if (empFilter !== 'all') return `"${empFilter}"`;
    if (roleFilter !== 'all') return `"${roleFilter}"`;
    return 'this category';
  };

  const handleOpenApply = (role: RoleJD) => {
    setApplicationModal(role);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const incomingFiles = Array.from(e.target.files);
    const validFiles: File[] = [];

    for (const file of incomingFiles) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        toast.error(`"${file.name}" is not supported. Please upload a PDF, DOC, or DOCX document.`);
        continue;
      }
      if (file.size > MAX_RESUME_SIZE_BYTES) {
        toast.error(`"${file.name}" exceeds the ${MAX_RESUME_SIZE_MB} MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDownloadJd = async (role: RoleJD) => {
    const jdText = `================================================================================
SIDDHI DYNAMICS LLP — OFFICIAL JOB DESCRIPTION & INTERNSHIP TERMS
Position: ${role.title}
Department: ${role.category}
Employment Type: ${role.employmentType} (Remote Task-Based Platform Workflow)
Compensation: ${role.compensation}
Target Candidates: ${role.targetAudience}
Available Durations: ${role.durations.join(', ')}
Location: Remote / Virtual (Offices in Hyderabad & Nizamabad)
Official Careers Email: careers@siddhidynamics.in
General Enquiries: hello@siddhidynamics.in
Website: https://siddhidynamics.in
================================================================================

1. ROLE OVERVIEW
--------------------------------------------------------------------------------
${role.overview}

2. KEY RESPONSIBILITIES
--------------------------------------------------------------------------------
${role.keyResponsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

3. LEARNING OUTCOMES & CREDENTIALS
--------------------------------------------------------------------------------
${role.learningOutcomes.map((o, i) => `${i + 1}. ${o}`).join('\n')}

4. CROSS-FUNCTIONAL COLLABORATION
--------------------------------------------------------------------------------
${role.interlinkingFeature}

5. ELIGIBILITY & REQUIREMENTS
--------------------------------------------------------------------------------
${role.requirements.map((req, i) => `• ${req}`).join('\n')}

6. TRANSPARENT TERMS & CREDENTIALING POLICY (CRUCIAL INFORMATION)
--------------------------------------------------------------------------------
• COMPENSATION: ${role.compensation}

• CERTIFICATE POLICY: ${role.certificatePolicy}
  Tamper-proof cryptographic checksum verifiable on:
  https://siddhidynamics.in/verify-certificate

• LETTER OF RECOMMENDATION (LOR) POLICY: ${role.lorPolicy}

• TASK WORKFLOW & TIMELINES: ${role.workflowDetails}
`;
    const blob = new Blob([jdText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${role.title.replace(/ /g, '_')}_JD.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !college || !statementOfPurpose) {
      toast.error('Please fill all mandatory fields.');
      return;
    }
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
    if (uploadedFiles.length === 0) {
      toast.error('Please upload your resume file (PDF, DOC, or DOCX up to 5 MB).');
      return;
    }

    setSubmitting(true);
    try {
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

      const uploadedUrls: string[] = [];
      for (const file of uploadedFiles) {
        const url = await internshipService.uploadResumeFile(file);
        if (url) uploadedUrls.push(url);
      }

      let finalResumeUrl = uploadedUrls.join(', ');
      if (!finalResumeUrl && uploadedFiles.length > 0) {
        finalResumeUrl = uploadedFiles.map(f => `${f.name} (${(f.size / 1024).toFixed(0)} KB)`).join(', ');
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
        resume_url: finalResumeUrl
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

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCollege('');
    setOtherDegree('');
    setLinkedin('');
    setPortfolioOrSocial('');
    setStatementOfPurpose('');
    setUploadedFiles([]);
  };

  const dashboardInput = "w-full px-3.5 py-2 sm:py-2.5 rounded-xl bg-background border border-border/80 text-foreground text-xs sm:text-[13px] placeholder:text-xs placeholder:text-muted-foreground/60 font-normal focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs";
  const dashboardSelect = "w-full px-3 py-2 sm:py-2.5 rounded-xl bg-background border border-border/80 text-foreground text-xs sm:text-[13px] font-normal focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-xs cursor-pointer";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <SeoHead
        title="Careers — Jobs & Internships at Siddhi Dynamics LLP"
        description="Explore open jobs and internships at Siddhi Dynamics LLP. Remote Product Management, Business Development, and Digital Marketing internships with official completion certificates, CEO mentorship, and verifiable credentials. Apply now — siddhidynamics.in/careers"
        canonical="/careers"
        keywords="Siddhi Dynamics careers, product manager intern, APM internship India, internship Hyderabad, business development intern India, digital marketing intern Nizamabad, AI company internship India, remote internship 2026, MBA internship Telangana"
        schema={[
          orgSchema,
          jobPostingSchema({
            title: 'Product Manager Intern',
            description: 'Bridge business strategy, user experience, and agile engineering at Siddhi Dynamics LLP. Architect PRDs, wireframes, and feature roadmaps for PrintFlow and AI SaaS automation tools. Unpaid internship with official completion certificate and CEO mentorship.',
            responsibilities: [
              'Collaborate with Business Development and Digital Marketing teams to gather real client pain points and workflow bottlenecks.',
              'Draft detailed Product Requirement Documents (PRDs), user journeys, system flowcharts, and wireframes for PrintFlow and internal enterprise tools.',
              'Break down strategic initiatives into actionable sprint tickets with clear acceptance criteria for engineering teams.',
              'Conduct usability reviews, user acceptance testing (UAT), and telemetry analysis to validate feature releases.',
              'Maintain product backlogs and sprint milestones within the internal task platform, adhering to stipulated deadlines.',
            ],
            skills: [
              'Currently enrolled in or graduate of B.Tech / BE, MBA, MCA, BBA, or related technical/management disciplines.',
              'Deep curiosity about SaaS architecture, user experience design, and AI automation tools.',
              'Strong written and verbal communication skills with the ability to articulate complex technical ideas simply.',
              'High ownership mindset and eagerness to build genuine career credentials.',
            ],
            employmentType: 'INTERN',
          }),
          jobPostingSchema({
            title: 'Business Development Intern',
            description: 'Drive client acquisition, identify market opportunities, and convert real-world enterprise pipeline across regional hubs at Siddhi Dynamics LLP. Unpaid internship with official completion certificate and CEO mentorship.',
            responsibilities: [
              'Research and identify target client segments across regional hubs (Hyderabad, Nizamabad, Bangalore, Mumbai) needing business automation & ERP solutions.',
              'Conduct exploratory client discovery calls and demonstrate product capabilities including PrintFlow, Nexus ERP, and Custom Automations.',
              'Execute structured business development tasks assigned through the internal platform within stipulated timelines.',
              'Log verified outreach milestones, client requirements, and stage transitions directly in the internal portal.',
              'Coordinate with the Digital Marketing team to align client outreach campaigns with tailored content assets.',
            ],
            skills: [
              'Currently enrolled in or graduate of MBA, BBA, B.Com, or related business and management programs.',
              'Strong communication and interpersonal skills in English and Hindi or Telugu.',
              'High ownership mindset and eagerness to build genuine career credentials.',
            ],
            employmentType: 'INTERN',
          }),
          jobPostingSchema({
            title: 'Digital Marketing Intern',
            description: 'Scale Instagram reach, craft viral content for PrintFlow & client brands, and engineer data-driven social conversion funnels at Siddhi Dynamics LLP. Unpaid internship with official completion certificate.',
            responsibilities: [
              'Drive organic growth and audience engagement on the official Instagram page (@siddhidynamics) and partner accounts.',
              'Create high-hook Reels, carousel infographics, and short-form video scripts highlighting PrintFlow and AI automation.',
              'Collaborate in real-time with the Business Development team to deploy targeted content based on real market questions.',
              'Execute content sprint tasks within stipulated platform deadlines.',
              'Track reach, hook retention rate, non-follower discovery, and profile conversion metrics as verifiable Points of Proof.',
            ],
            skills: [
              'Enrolled in or completed BBA, MBA (Marketing), Mass Communication, or passionate self-taught social media marketer.',
              'Familiarity with Instagram Reels, CapCut/Premiere/Canva, and current B2B social media trends.',
              'Creativity, prompt turnaround, and passion for AI and software automation.',
            ],
            employmentType: 'INTERN',
          }),
        ]}
      />

      <Navbar />

      <main className="pt-20 sm:pt-24 pb-12 sm:pb-20">
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
                across product management, business development, digital marketing, software engineering, and operations.
                Whether you're a <strong className="text-foreground">B.Tech/MBA/BBA student</strong> seeking an internship or an
                aspiring product leader looking for high-ownership impact — explore our transparent roles below.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 sm:py-16 lg:py-20 relative overflow-hidden border-b border-border/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2">Open Positions</h2>
                <p className="text-sm text-muted-foreground">Filter by employment type or professional category.</p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/50 min-w-0">
                  {(['all', 'Full Time', 'Remote', 'Part Time'] as const).map(t => {
                    const Icon = t !== 'all' ? empIcon(t as EmploymentType) : null;
                    return (
                      <button
                        key={t}
                        onClick={() => setEmpFilter(t)}
                        className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          empFilter === t
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" />}
                        {t === 'all' ? 'All Types' : t}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-card border border-border/50 min-w-0">
                  <button
                    onClick={() => setRoleFilter('all')}
                    className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      roleFilter === 'all'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    All Categories
                  </button>
                  {ALL_CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setRoleFilter(c.id)}
                      className={`px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        roleFilter === c.id
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.length > 0 ? (
                filteredRoles.map(role => (
                  <motion.div
                    key={role.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-3xl bg-card border border-border/70 space-y-4 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${empColor(role.employmentType)}`}>
                            {role.employmentType}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold">
                            {role.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
                          {role.title}
                        </h3>
                      </div>
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {role.overview}
                    </p>
                    <div className="pt-4 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedJdModal(role)}
                        className="flex-1 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-bold transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleOpenApply(role)}
                        className="flex-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold uppercase tracking-wider transition-all shadow-sm hover:opacity-90"
                      >
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-16 max-w-lg mx-auto"
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
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-16 lg:py-20 relative overflow-hidden border-b border-border/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">Our Collaborative Ecosystem</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                At Siddhi Dynamics, we don't follow traditional hierarchies. We operate as a high-velocity 
                cross-functional squad. Every member is empowered to spot gaps and drive solutions.
              </p>
            </div>
            <CollabCards />
          </div>
        </section>

        <section className="py-8 sm:py-16 lg:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-4">Ready to Join the Frontier?</h2>
              <p className="text-sm text-muted-foreground mb-8">
                Join a team of innovators building the future of business automation and AI.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wider uppercase hover:opacity-90 transition-all shadow-lg"
              >
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedJdModal && (
          <div className="fixed inset-0 z-[110] flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-2xl my-auto"
            >
              <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 bg-card text-card-foreground border border-border shadow-2xl overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSelectedJdModal(null)}
                  className="absolute z-30 top-3 right-3 sm:top-5 sm:right-5 p-3 rounded-xl bg-muted/60 text-muted-foreground hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="relative z-10 mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-3">
                    <Briefcase className="w-3 h-3" /> Job Specification
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground mb-1">
                    {selectedJdModal.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedJdModal.category} • {selectedJdModal.employmentType}
                  </p>
                  <div className="mt-3.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-[11px] sm:text-xs text-blue-800 dark:text-blue-300 leading-relaxed space-y-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span><strong className="font-semibold text-blue-900 dark:text-blue-200">Certification:</strong> Official Certificate of Internship Completion awarded upon successful tenure.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <FileSignature className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span><strong className="font-semibold text-purple-900 dark:text-purple-200">Letter of Recommendation:</strong> A formal LOR is provided strictly upon 2 years of active working / association.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span><strong className="font-semibold text-blue-900 dark:text-blue-200">Workflow:</strong> Tasks are assigned with stipulated deadlines. Deadline extensions and proprietary data requests can be submitted via portal and approved by CEO.</span>
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
                          <span className="text-foreground/80 dark:text-muted-foreground">{item}</span>
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {applicationModal && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-2xl my-auto"
            >
              <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 bg-card text-card-foreground border border-border shadow-2xl overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
                <button
                  type="button"
                  aria-label="Close application form"
                  onClick={() => { setApplicationModal(null); resetForm(); }}
                  className="absolute z-30 top-3 right-3 sm:top-5 sm:right-5 p-3 rounded-xl bg-muted/60 text-muted-foreground hover:text-white hover:bg-red-600 active:text-white active:bg-red-600 focus-visible:text-white focus-visible:bg-red-600 transition-colors cursor-pointer pointer-events-auto"
                >
                  <X className="w-5 h-5" />
                </button>

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

                  <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] sm:text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-0.5">
                    <div><strong className="font-semibold text-amber-900 dark:text-amber-200">Notice:</strong> This is an unpaid internship for practical skill growth. Interns receive an official Certificate of Completion upon finishing tenure.</div>
                    <div className="text-[10.5px] sm:text-[11px] text-amber-700 dark:text-amber-400 font-medium">(Letter of Recommendation is provided strictly upon 2 years of active service).</div>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="relative z-10 space-y-3.5 sm:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">Full Name <span className="text-primary">*</span></label>
                      <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className={dashboardInput} placeholder="Enter your full name" />
                    </div>
                    <div>
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">Email Address <span className="text-primary">*</span></label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={dashboardInput} placeholder="your.email@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">WhatsApp / Phone <span className="text-primary">*</span></label>
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
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">College / University <span className="text-primary">*</span></label>
                      <input type="text" required value={college} onChange={e => setCollege(e.target.value)} className={dashboardInput} placeholder="Enter your college or university" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">Current Degree <span className="text-primary">*</span></label>
                      <select value={degree} onChange={(e: any) => setDegree(e.target.value)} className={dashboardSelect}>
                        <option value="MBA">MBA</option>
                        <option value="BBA">BBA</option>
                        <option value="B.Tech">B.Tech / Engineering</option>
                        <option value="B.Com">B.Com</option>
                        <option value="Other">Other</option>
                      </select>
                      {degree === 'Other' && (
                        <div className="mt-2.5">
                          <label htmlFor="other-degree" className="text-[11.5px] font-semibold text-foreground/90 block mb-1">Please specify your degree <span className="text-primary">*</span></label>
                          <input id="other-degree" type="text" required value={otherDegree} onChange={e => setOtherDegree(e.target.value)} className={dashboardInput} placeholder="Enter your degree" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">Preferred Duration <span className="text-primary">*</span></label>
                      <select value={duration} onChange={(e: any) => setDuration(e.target.value)} className={dashboardSelect}>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="9 Months">9 Months</option>
                        <option value="12 Months">12 Months</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">LinkedIn Profile</label>
                      <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} className={dashboardInput} placeholder="https://linkedin.com/in/username" />
                    </div>
                    <div>
                      <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">Instagram / Portfolio</label>
                      <input type="text" value={portfolioOrSocial} onChange={e => setPortfolioOrSocial(e.target.value)} className={dashboardInput} placeholder="@handle or portfolio URL" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11.5px] font-semibold text-foreground/90 block mb-1">
                      Statement of Purpose & Career Objectives <span className="text-primary">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={statementOfPurpose}
                      onChange={e => setStatementOfPurpose(e.target.value)}
                      placeholder="Why do you want to join Siddhi Dynamics? Share your goals and what you hope to achieve during this internship."
                      className={`${dashboardInput} leading-relaxed resize-y`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11.5px] font-semibold text-foreground/90 flex items-center gap-1">
                        Resume / CV <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10.5px] text-muted-foreground font-medium">Max 5 MB (PDF, DOC, DOCX)</span>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center cursor-pointer transition-all group ${
                        uploadedFiles.length > 0
                          ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10'
                          : 'border-border hover:border-primary/50 bg-muted/25 hover:bg-muted/40'
                      }`}
                    >
                      <Upload className={`w-6 h-6 mx-auto mb-1.5 transition-transform group-hover:-translate-y-0.5 ${
                        uploadedFiles.length > 0 ? 'text-emerald-500' : 'text-primary'
                      }`} />
                      <p className="text-xs text-foreground/85 font-medium">
                        <span className="text-primary font-bold">Click to upload your resume</span> or drag & drop
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        PDF, DOC, or DOCX up to 5 MB • File upload only
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {uploadedFiles.length > 0 ? (
                      <div className="mt-2.5 space-y-1.5">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-muted/40 border border-emerald-500/30 text-xs">
                            <div className="flex items-center gap-2 truncate mr-2">
                              <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="text-foreground font-medium truncate">{f.name}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-muted-foreground text-[11px]">
                                {f.size >= 1024 * 1024
                                  ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
                                  : `${(f.size / 1024).toFixed(0)} KB`}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                                title="Remove file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10.5px] text-rose-500 dark:text-rose-400 mt-1.5 flex items-center gap-1">
                        * Resume file upload is mandatory. Links/URLs are not accepted.
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-all shadow-md hover:shadow-lg"
                    >
                      {submitting ? (
                        <span>Uploading Resume & Submitting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Application
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-muted-foreground text-center mt-2.5 leading-relaxed">
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
