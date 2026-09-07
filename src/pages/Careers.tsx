import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  GraduationCap, 
  Award, 
  Gift, 
  Download, 
  CheckCircle2, 
  Send, 
  FileText, 
  ArrowRight, 
  Layers, 
  Target, 
  Users, 
  Instagram, 
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { internshipService, InternshipApplication } from '@/services/internshipService';

interface RoleJD {
  id: 'bd' | 'dm';
  title: string;
  category: 'Business Development' | 'Digital Marketing';
  targetAudience: string;
  tagline: string;
  durations: string[];
  overview: string;
  keyResponsibilities: string[];
  learningOutcomes: string[];
  interlinkingFeature: string;
  milestoneIncentives: string[];
  requirements: string[];
}

const ROLES: RoleJD[] = [
  {
    id: 'bd',
    title: 'Business Development Intern',
    category: 'Business Development',
    targetAudience: 'MBA & BBA Students / Business Graduates',
    tagline: 'Drive client acquisition, identify market loopholes, and convert real-world enterprise pipeline.',
    durations: ['3 Months', '6 Months', '9 Months', '12 Months'],
    overview: 'As a Business Development Intern at Siddhi Dynamics, you will bridge the gap between classroom MBA/BBA theory and high-growth AI technology sales. You will directly engage enterprise SMBs, factory owners, and regional distributors to pitch custom business automation, SaaS, and ERP pipelines while earning verified milestone rewards.',
    keyResponsibilities: [
      'Identify target client segments across regional hubs (Hyderabad, Nizamabad, Bangalore, Mumbai) needing business automation & ERP.',
      'Conduct exploratory client discovery calls and demonstrate product capabilities (including PrintFlow, Nexus ERP, and Custom Automations).',
      'Detect market loopholes and low client conversion patterns: collaborate immediately with the Digital Marketing team to deploy targeted reels & case studies.',
      'Draft formal project requirement summaries and coordinate with Founder/CEO Sai Vara Prasad for pricing and SLA sign-offs.',
      'Maintain verifiable "Point of Proof" records for every client reached, proposal submitted, and contract closed.'
    ],
    learningOutcomes: [
      'Master the B2B consultative tech sales cycle from cold lead to contract execution.',
      'Apply Porter’s Five Forces, SWOT, and Sales Funnel metrics to live Indian SMB workflows.',
      'Executive mentorship directly under founders with verifiable institutional letter of recommendation.'
    ],
    interlinkingFeature: 'Cross-Team Loophole Trigger: Whenever you notice low interest in a specific sector (e.g. printing, pharmaceuticals), you log an Interlink Growth Alert in the portal, prompting the Digital Marketing team to create dedicated high-hook Instagram reels and carousel explainers.',
    milestoneIncentives: [
      'Level 1: Siddhi Dynamics Executive Laptop Bag + Laser Engraved Metal Pen',
      'Level 2: Ceramic Coffee Mug + Stainless Steel Insulated Sipper Bottle',
      'Level 3: Premium Noise-Cancelling Bluetooth Audio Headset + Performance Bonus'
    ],
    requirements: [
      'Currently pursuing or recent graduate of MBA, BBA, B.Com, or allied business/management degree.',
      'Strong communication skills in English and Hindi/Telugu.',
      'High ownership mindset, prompt responsiveness, and eagerness to build verifiable career credentials.'
    ]
  },
  {
    id: 'dm',
    title: 'Digital Marketing Intern',
    category: 'Digital Marketing',
    targetAudience: 'BBA / MBA Marketing, Media & Creative Innovators',
    tagline: 'Scale Instagram reach, ignite viral hooks for PrintFlow & client brands, and engineer social conversion.',
    durations: ['3 Months', '6 Months', '9 Months', '12 Months'],
    overview: 'Shape the visual and viral identity of Siddhi Dynamics and our flagship products (like PrintFlow and AI automation suites). You will oversee growth for @siddhidynamics, architect high-retention Instagram reels, create educational carousels, and respond to sales intelligence from the BD team to drive inbound client pipeline.',
    keyResponsibilities: [
      'Drive organic growth and engagement on the official Instagram page (@siddhidynamics) and partner accounts.',
      'Create high-hook Reels, carousel infographics, and short-form video scripts highlighting PrintFlow (AI invoice & packaging automation).',
      'Collaborate in real-time with Business Development interns: when BD reports low client traction in a sector, deploy targeted content campaigns.',
      'Track reach, hook retention rate, non-follower discovery, and profile conversion metrics as verifiable Points of Proof.',
      'Design graphics, thumbnails, and interactive polls to turn followers into active product trial users.'
    ],
    learningOutcomes: [
      'Hands-on expertise in algorithm-driven organic social growth, A/B video hook testing, and SaaS product marketing.',
      'Attribution tracking mastery: track customer journey from Instagram Reel view to demo booking.',
      'Verified campaign portfolio with documented view and lead counts signed by the CEO.'
    ],
    interlinkingFeature: 'Agile Content Sprints: You work hand-in-hand with Business Development interns using our unified referral and interlink tracker. When both BD and DM collaborate on an onboarded client, both interns receive equal attribution points and milestone scratch cards!',
    milestoneIncentives: [
      'Level 1: Siddhi Dynamics Executive Laptop Bag + Laser Engraved Metal Pen',
      'Level 2: Ceramic Coffee Mug + Stainless Steel Insulated Sipper Bottle',
      'Level 3: Premium Noise-Cancelling Bluetooth Audio Headset + Creative Bonus'
    ],
    requirements: [
      'Enrolled in or completed BBA, MBA, Mass Communication, or passionate self-taught social media marketer.',
      'Familiarity with Instagram Reels, CapCut/Premiere/Canva, and current B2B social media trends.',
      'Creativity, prompt turnaround, and passion for artificial intelligence and software automation.'
    ]
  }
];

export default function Careers() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'bd' | 'dm'>('all');
  const [selectedJdModal, setSelectedJdModal] = useState<RoleJD | null>(null);
  const [applicationModalRole, setApplicationModalRole] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Application Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState<'MBA' | 'BBA' | 'B.Tech' | 'Other'>('MBA');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [duration, setDuration] = useState<'3 Months' | '6 Months' | '9 Months' | '12 Months'>('6 Months');
  const [linkedin, setLinkedin] = useState('');
  const [portfolioOrSocial, setPortfolioOrSocial] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const filteredRoles = ROLES.filter(r => {
    if (activeCategory === 'all') return true;
    return r.id === activeCategory;
  });

  const handleOpenApply = (roleTitle: string) => {
    setApplicationModalRole(roleTitle);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDownloadJd = (role: RoleJD) => {
    // Generate clean text-based / printable JD document
    const jdText = `
================================================================================
SIDDHI DYNAMICS LLP — OFFICIAL INTERNSHIP JOB DESCRIPTION
Position: ${role.title}
Department: ${role.category}
Target Candidates: ${role.targetAudience}
Available Durations: ${role.durations.join(', ')}
Location: Remote / Hybrid (Hyderabad & Nizamabad Offices)
Official Careers Email: careers@siddhidynamics.in
Company Website: https://siddhidynamics.in
================================================================================

1. ROLE OVERVIEW
--------------------------------------------------------------------------------
${role.overview}

2. KEY RESPONSIBILITIES & DAILY IMPACT
--------------------------------------------------------------------------------
${role.keyResponsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

3. CROSS-FUNCTIONAL INTERLINKING (BD ⇄ DM SYNERGY)
--------------------------------------------------------------------------------
${role.interlinkingFeature}

4. LEARNING OUTCOMES & CAREER ADVANCEMENT
--------------------------------------------------------------------------------
${role.learningOutcomes.map((l, i) => `• ${l}`).join('\n')}

5. MILESTONE INCENTIVES & GOODIES (WITH SCRATCH CARDS)
--------------------------------------------------------------------------------
${role.milestoneIncentives.map((m) => `• ${m}`).join('\n')}

6. ELIGIBILITY & REQUIREMENTS
--------------------------------------------------------------------------------
${role.requirements.map((req) => `✓ ${req}`).join('\n')}

7. SELECTION PROCESS & WORKFLOW
--------------------------------------------------------------------------------
Step 1: Online Application via https://siddhidynamics.in/careers
Step 2: Profile Screening & Interview Invitation Email
Step 3: Founder / CEO Virtual Interview (Google Meet)
Step 4: Digital Offer Letter Issuance (Signable in Portal)
Step 5: Interactive Onboarding, Rules & Regulations Acceptance
Step 6: Stipulated Timeline Task Execution & Point of Proof Documentation
Step 7: Milestone Rewards Unlock & Final Digital Certificate

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
    toast.success(`Job Description for ${role.title} downloaded successfully!`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !college || !statementOfPurpose) {
      toast.error('Please fill all mandatory fields to submit your application.');
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
        graduation_year: graduationYear,
        role: (applicationModalRole || 'Business Development Intern') as any,
        duration,
        linkedin,
        portfolio_or_social: portfolioOrSocial,
        statement_of_purpose: statementOfPurpose,
        resume_url: resumeUrl
      });

      toast.success('Application submitted successfully! Check your email for interview scheduling.');
      setApplicationModalRole(null);
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setCollege('');
      setStatementOfPurpose('');
      setResumeUrl('');
      setLinkedin('');
      setPortfolioOrSocial('');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to submit application. Please try again or email careers@siddhidynamics.in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Helmet>
        <title>Careers & Internships | Siddhi Dynamics — High-Impact MBA & BBA Roles</title>
        <meta name="description" content="Launch your career at Siddhi Dynamics. Apply for Business Development and Digital Marketing internships (3, 6, 9, 12 months) with verifiable Point of Proof experience and tangible milestone incentives." />
        <link rel="canonical" href="https://siddhidynamics.in/careers" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">Careers & Internships</li>
              </ol>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" /> High-Impact Learning Opportunities
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                Apply Classroom Business to{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-purple-400 bg-clip-text text-transparent">
                  Real-World AI Scale
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                We are recruiting proactive <strong className="text-foreground">MBA and BBA students</strong> for high-ownership roles in Business Development and Digital Marketing. Get real clients, scale products like <strong className="text-primary">PrintFlow</strong>, record verifiable Points of Proof, and unlock tangible rewards.
              </p>

              {/* Quick Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-muted-foreground block font-medium">Tenure Options</span>
                  <span className="text-sm font-bold text-foreground">3, 6, 9 & 12 Months</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-muted-foreground block font-medium">Verification</span>
                  <span className="text-sm font-bold text-foreground">Point of Proof Ledger</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-muted-foreground block font-medium">Incentives</span>
                  <span className="text-sm font-bold text-foreground">Scratch Card Goodies</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-muted-foreground block font-medium">Certification</span>
                  <span className="text-sm font-bold text-foreground">Digitally Signed & QR</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-16 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-foreground">Open Internship Positions</h2>
              <p className="text-sm text-muted-foreground mt-1">Select a role to inspect the official Job Description, download the PDF, or apply online.</p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/50 self-start">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'all' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                All Roles (2)
              </button>
              <button
                onClick={() => setActiveCategory('bd')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'bd' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Business Development
              </button>
              <button
                onClick={() => setActiveCategory('dm')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'dm' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Digital Marketing
              </button>
            </div>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredRoles.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="group relative rounded-3xl border border-white/10 bg-card/60 backdrop-blur-md p-8 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between shadow-xl overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {role.category}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" /> {role.targetAudience}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-300 mb-4 leading-relaxed">
                    {role.tagline}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                    {role.overview}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2.5 mb-6 pt-4 border-t border-white/10">
                    <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-primary" /> Key Focus & Responsibilities
                    </div>
                    {role.keyResponsibilities.slice(0, 3).map((resp, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Durations Badges */}
                  <div className="mb-6">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Available Durations</span>
                    <div className="flex flex-wrap gap-2">
                      {role.durations.map(d => (
                        <span key={d} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleOpenApply(role.title)}
                    className="flex-1 py-3 px-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg cursor-pointer"
                  >
                    Apply for Role <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedJdModal(role)}
                    className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-foreground transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-primary" /> View Full JD
                  </button>

                  <button
                    onClick={() => handleDownloadJd(role)}
                    title="Download official JD as file"
                    className="py-3 px-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* The Siddhi Synergy Engine (BD ⇄ DM Interlink Explainer) */}
        <section className="py-16 border-t border-border/30 bg-card/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                Collaborative Architecture
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4">How BD and DM Interns Work Together</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Rather than working in isolation, our business development and marketing interns form an integrated growth loop. When a client converts, both interns receive verified credit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="p-6 rounded-3xl bg-card/50 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                  1
                </div>
                <h3 className="font-extrabold text-foreground text-base">BD Identifies Market Loophole</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  During client calls, the BD intern notices high hesitation or drop-off (e.g. SMBs worried about GST setup in PrintFlow). They file an instant Interlink Alert.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card/50 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                  2
                </div>
                <h3 className="font-extrabold text-foreground text-base">DM Launches Targeted Sprints</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The Digital Marketing intern accepts the alert and produces high-hook Reels and carousel breakdowns addressing the exact customer hesitation with clear proof.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-card/50 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  3
                </div>
                <h3 className="font-extrabold text-foreground text-base">Dual Attribution & Scratch Rewards</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inbound leads enter using the shared campaign referral code. Upon closing, both the BD and DM interns receive equal milestone points and scratch code goodies!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Milestone Rewards Showcase */}
        <section className="py-16 border-t border-border/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Tangible Incentives</span>
              <h2 className="text-3xl font-black mt-2 mb-3">Earn Verified Milestone Goodies</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                In addition to your verified certificate and recommendation letter, complete stipulated tasks and hit performance milestones to unlock branded items with instant digital scratch cards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {internshipService.getIncentiveRewards().map((inc, i) => (
                <div key={inc.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
                  <div>
                    <div className="w-full h-36 rounded-2xl bg-muted/30 overflow-hidden mb-4 relative">
                      <img 
                        src={inc.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60'} 
                        alt={inc.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-400 border border-amber-400/30">
                        Milestone Level {i + 1}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-foreground text-base mb-1">{inc.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{inc.description}</p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {inc.items_included.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Gift className="w-3 h-3 text-primary shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Requirement</span>
                    <span className="text-xs font-semibold text-primary">{inc.required_milestone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Embedded Application CTA Section */}
        <section id="apply-section" className="py-20 border-t border-border/30 bg-gradient-to-b from-card/30 to-background">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                Registration & Application Form
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-3">Begin Your Internship Journey</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Applications are reviewed directly by CEO Sai Vara Prasad. Shortlisted applicants will receive an official interview invite via email.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 rounded-3xl border border-white/10 bg-card/70 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@university.edu"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">College / University Name *</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Anurag University, Osmania, ISB, etc."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">Current Degree *</label>
                  <select
                    value={degree}
                    onChange={(e: any) => setDegree(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="MBA">MBA (Master of Business Admin)</option>
                    <option value="BBA">BBA (Bachelor of Business Admin)</option>
                    <option value="B.Tech">B.Tech / Engineering</option>
                    <option value="Other">Other Graduate Degree</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">Role Applied For *</label>
                  <select
                    value={applicationModalRole || 'Business Development Intern'}
                    onChange={(e) => setApplicationModalRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary font-bold text-primary"
                  >
                    <option value="Business Development Intern">Business Development Intern</option>
                    <option value="Digital Marketing Intern">Digital Marketing Intern</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">Internship Duration *</label>
                  <select
                    value={duration}
                    onChange={(e: any) => setDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-card border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="3 Months">3 Months Tenure</option>
                    <option value="6 Months">6 Months Tenure (Recommended)</option>
                    <option value="9 Months">9 Months Tenure</option>
                    <option value="12 Months">12 Months Tenure</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1.5">Instagram / Portfolio Handle</label>
                  <input
                    type="text"
                    value={portfolioOrSocial}
                    onChange={(e) => setPortfolioOrSocial(e.target.value)}
                    placeholder="@handle or portfolio link"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                  />
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
                  onChange={(e) => setStatementOfPurpose(e.target.value)}
                  placeholder="Tell us what you have studied about business development or marketing, what campaigns you have followed, and how you will help grow Siddhi Dynamics and products like PrintFlow..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Resume / Google Drive Link</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume-link (ensure view permission)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Internship Application
                    </>
                  )}
                </button>
                <p className="text-[11px] text-muted-foreground text-center mt-3">
                  By submitting, you agree to our Code of Conduct and internship evaluation standards. Applications are sent to <strong className="text-foreground">careers@siddhidynamics.in</strong>.
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Full JD Detail Modal */}
      <AnimatePresence>
        {selectedJdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedJdModal(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
                <FileText className="w-4 h-4" /> Official Job Description
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-2">{selectedJdModal.title}</h2>
              <p className="text-xs text-muted-foreground mb-6">Department: {selectedJdModal.category} • Tenures: {selectedJdModal.durations.join(', ')}</p>

              <div className="space-y-6 text-xs text-slate-300">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Overview</h4>
                  <p className="leading-relaxed text-slate-400">{selectedJdModal.overview}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Key Responsibilities</h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                    {selectedJdModal.keyResponsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Cross-Functional Interlinking (BD ⇄ DM)</h4>
                  <p className="leading-relaxed text-slate-400">{selectedJdModal.interlinkingFeature}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Learning Outcomes</h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                    {selectedJdModal.learningOutcomes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Milestones & Tangible Rewards</h4>
                  <ul className="space-y-1.5 text-amber-300">
                    {selectedJdModal.milestoneIncentives.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Gift className="w-3.5 h-3.5 text-amber-400" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Eligibility</h4>
                  <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                    {selectedJdModal.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleDownloadJd(selectedJdModal)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-400" /> Download JD (.txt)
                </button>
                <button
                  onClick={() => {
                    handleOpenApply(selectedJdModal.title);
                    setSelectedJdModal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-extrabold tracking-wider uppercase flex items-center gap-2"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
}
