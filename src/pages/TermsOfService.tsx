import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import {
  Scale,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Coins,
  Lock,
  Wrench,
  Award,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  Send,
  UserCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SECTIONS = [
  { id: "agreement", title: "1. Agreement & Acceptance", icon: Scale },
  { id: "services", title: "2. Scope of Services", icon: Zap },
  { id: "submissions", title: "3. Requirements & Scopes of Work", icon: Send },
  { id: "ip", title: "4. Intellectual Property & Ownership", icon: Award },
  { id: "client-duties", title: "5. Client Obligations & Approvals", icon: UserCheck },
  { id: "ai-systems", title: "6. Production AI & Third-Party APIs", icon: ShieldCheck },
  { id: "payments", title: "7. Fees, Milestones & Taxes", icon: Coins },
  { id: "confidentiality", title: "8. Confidentiality & Non-Disclosure", icon: Lock },
  { id: "warranty", title: "9. 30-Day Hypercare & Support", icon: Wrench },
  { id: "liability", title: "10. Limitation of Liability", icon: AlertCircle },
  { id: "termination", title: "11. Term & Termination", icon: FileText },
  { id: "governing-law", title: "12. Governing Law & Jurisdiction", icon: Building2 },
  { id: "contact", title: "13. Legal Notice & Grievance Contact", icon: Mail },
];

const KEY_PILLARS = [
  {
    icon: Award,
    title: "100% IP Ownership",
    description: "Custom code, software architectures, and production assets transfer fully to you upon final milestone settlement.",
    accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: Coins,
    title: "Milestone Transparency",
    description: "Work progresses through defined deliverables with client approval before each phase unlocks. No hidden fees.",
    accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Wrench,
    title: "30-Day Hypercare Warranty",
    description: "Every custom build includes 30 days of post-deployment bug fixing and performance stabilization at zero extra cost.",
    accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Lock,
    title: "Strict Confidentiality",
    description: "Your business models, proprietary data, customer records, and source repositories remain protected under mutual NDA.",
    accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState<string>("agreement");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col font-inter selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <Helmet>
        <title>Terms of Service | Siddhi Dynamics LLP</title>
        <meta
          name="description"
          content="Master Service Agreement, project engagement terms, intellectual property ownership, milestone payments, and hypercare warranty for Siddhi Dynamics LLP."
        />
        <link rel="canonical" href="https://siddhidynamics.in/terms-of-service" />
      </Helmet>

      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/5 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none -z-10" />

      <main className="container relative z-10 mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-24 flex-grow max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group py-1.5 px-3 rounded-full hover:bg-muted border border-border w-fit shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-primary" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-border">•</span>
            <Link
              to="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Pricing (INR)
            </Link>
            <span className="text-border">•</span>
            <Link
              to="/submit"
              className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline flex items-center gap-1"
            >
              Submit Requirement <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <header className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Master Service Agreement &amp; Terms of Engagement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
            Terms of <span className="gradient-text">Service</span>
          </h1>

          <p className="text-base sm:text-lg text-foreground/80 max-w-3xl leading-relaxed mb-6 font-normal">
            These terms govern the engagement between <strong className="text-foreground font-semibold">Siddhi Dynamics LLP</strong> and clients, partners, and users accessing our platforms, submitting project requirements, or utilizing our deep-tech AI and custom software solutions.
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-4 border-t border-border">
            <div>
              <span className="text-muted-foreground/80">Entity:</span>{" "}
              <strong className="text-foreground font-semibold">Siddhi Dynamics LLP</strong>
            </div>
            <div>
              <span className="text-muted-foreground/80">Effective Date:</span>{" "}
              <strong className="text-foreground font-semibold">Updated July 30, 2026</strong>
            </div>
            <div>
              <span className="text-muted-foreground/80">Registered:</span>{" "}
              <span className="text-foreground">Nizamabad &amp; Hyderabad, Telangana, India</span>
            </div>
            <div>
              <span className="text-muted-foreground/80">Estimated Read:</span>{" "}
              <span className="text-foreground">8 minutes</span>
            </div>
          </div>
        </header>

        {/* 4 Pillars Overview Grid */}
        <section className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
            Key Principles at a Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KEY_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl p-5 border border-border bg-card shadow-sm hover:border-primary/40 hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${pillar.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Content Layout: Sticky Table of Contents on Desktop + Detailed Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="rounded-2xl p-5 border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Table of Contents</span>
                <span className="text-[11px] text-primary font-mono font-bold">{SECTIONS.length} Sections</span>
              </div>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 text-xs">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollTo(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("contact");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground border border-border transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" /> Contact Legal &amp; Founders
                </a>
                <Link
                  to="/submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Submit a Requirement
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Legal Clauses */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Agreement & Acceptance */}
            <section id="agreement" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 01</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Agreement &amp; Acceptance</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client", "User", "You") and <strong className="text-foreground">Siddhi Dynamics LLP</strong> ("Siddhi Dynamics", "Company", "We", "Us", or "Our"), a Limited Liability Partnership registered in Telangana, India.
                </p>
                <p>
                  By accessing <a href="https://siddhidynamics.in" className="text-primary hover:underline font-semibold">https://siddhidynamics.in</a>, submitting a project requirement via our intake forms, creating an account, accessing any portal (Client, Agency, Investor, Employee), or signing a Scope of Work (SOW), you confirm that you have read, understood, and agreed to be bound by these Terms.
                </p>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground/90 flex gap-3 items-start">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>
                    If you represent an enterprise or organisation, you represent and warrant that you possess full corporate authority to bind that entity to these Terms.
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Scope of Services */}
            <section id="services" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 02</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Scope of Services</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
                <p>
                  Siddhi Dynamics provides deep-tech software engineering, artificial intelligence implementation, and digital growth services, including but not limited to:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                  {[
                    "Custom Web Applications & Modern Portals",
                    "Autonomous AI Agents & Intelligent Workflows",
                    "SaaS Platforms & Cloud Backend Infrastructure",
                    "Enterprise Resource Planning (ERP) Solutions",
                    "Business Process Automation & API Integrations",
                    "Search Engine Optimization (SEO & Technical Audits)",
                    "Generative Engine Optimization (GEO & AI Search)",
                    "Google Business Profile (GBP) Optimization & Analytics",
                  ].map((srv) => (
                    <li key={srv} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-foreground font-medium">{srv}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground pt-2">
                  Each custom engagement is governed by a dedicated Scope of Work (SOW), project brief, or proposal detailing specific features, timelines, milestones, and deliverable specifications.
                </p>
              </div>
            </section>

            {/* 3. Requirements & Scopes of Work */}
            <section id="submissions" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 03</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Requirements Submission &amp; SOWs</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
                <p>
                  When submitting a requirement via <a href="/submit" className="text-primary hover:underline font-semibold">siddhidynamics.in/submit</a> or during client onboarding:
                </p>
                <ul className="space-y-2 text-xs pl-4 list-disc text-muted-foreground">
                  <li>You warrant that all information, business descriptions, specifications, and files you provide are accurate and lawful.</li>
                  <li>Our technical architects review submissions, calculate required engineering effort, and issue a formal Scope of Work (SOW) or quotation via email and the Client Portal.</li>
                  <li>Any modifications or additions requested outside the agreed SOW will be scoped separately as a Change Request with commensurate timeline and cost adjustments.</li>
                </ul>
              </div>
            </section>

            {/* 4. Intellectual Property */}
            <section id="ip" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 04</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Intellectual Property &amp; Ownership</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                  <strong>Clear Ownership Principle:</strong> Upon full and final settlement of all agreed fees for a project milestone or deliverable, all custom source code, bespoke application designs, and deliverables created uniquely for the Client are assigned and transferred entirely to the Client.
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Pre-Existing &amp; Open-Source IP:</strong> Siddhi Dynamics and third-party licensors retain all ownership of pre-existing frameworks, proprietary core libraries, tools, and open-source packages (such as React, Vite, Tailwind CSS, PostgreSQL, etc.) used in the assembly of the solution. Siddhi Dynamics grants the Client a perpetual, worldwide, non-exclusive license to use, modify, and deploy any incorporated pre-existing tooling as part of their delivered system.
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Client Assets:</strong> All trademarks, logos, copy, images, and domain names provided by the Client remain the exclusive property of the Client.
                </p>
              </div>
            </section>

            {/* 5. Client Obligations & Approvals */}
            <section id="client-duties" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 05</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Client Obligations &amp; Approvals</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>To ensure high engineering velocity and adherence to project deadlines, the Client agrees to:</p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li><strong>Provide Necessary Access:</strong> Furnish credentials, API tokens, brand assets, copy, and server environments promptly.</li>
                  <li><strong>Designated Point of Contact:</strong> Appoint a designated Project Lead with authority to approve milestones and design deliverables.</li>
                  <li><strong>Timely Milestone Reviews:</strong> Review staging builds and feature deliverables within five (5) business days of submission. If no feedback is received within seven (7) days, deliverables are deemed approved.</li>
                </ul>
              </div>
            </section>

            {/* 6. Production AI & Third-Party APIs */}
            <section id="ai-systems" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 06</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Production AI &amp; Third-Party Services</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>
                  Where custom solutions incorporate Generative AI models, Large Language Models (LLMs), or third-party cloud infrastructure (e.g. OpenAI, Anthropic, Google Cloud, Cloudflare, Supabase, Vercel, Resend):
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li><strong>Probabilistic Nature of AI:</strong> While we build robust guardrails, validation pipelines, and automated fallbacks, AI-generated outputs are probabilistic. Clients must ensure human oversight for mission-critical legal, medical, or financial decisions.</li>
                  <li><strong>API Costs &amp; Service Quotas:</strong> Ongoing usage costs of third-party cloud services or LLM API tokens are billed directly to the Client's cloud billing account or reimbursed as specified in the SOW.</li>
                  <li><strong>Upstream Uptime:</strong> We are not liable for outages, rate limit reductions, or policy changes enacted by external third-party infrastructure providers.</li>
                </ul>
              </div>
            </section>

            {/* 7. Fees, Milestones & Taxes */}
            <section id="payments" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 07</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Fees, Invoicing &amp; Milestones</h2>
                </div>
              </div>
              <div className="space-y-4 text-xs text-foreground/85 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">Stage 1</span>
                    <h4 className="font-bold text-foreground text-sm mt-1">Kickoff Deposit</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">Mobilizes sprint kickoff, architecture specs, and environment setup.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">Stage 2</span>
                    <h4 className="font-bold text-foreground text-sm mt-1">Sprint Milestones</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">Released upon staging demo review and client verification of agreed features.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">Stage 3</span>
                    <h4 className="font-bold text-foreground text-sm mt-1">Production Go-Live</h4>
                    <p className="text-[11px] text-muted-foreground mt-1">Final balance settled upon production deployment and source code transfer.</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Invoices are payable within seven (7) days of issuance. All fees for domestic services and digital advertising packages are denominated and billed strictly in <strong>Indian Rupees (INR / ₹)</strong>, exclusive of applicable statutory Goods and Services Tax (GST) unless explicitly indicated.
                </p>
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground/90 space-y-1.5">
                  <h5 className="font-bold text-foreground text-xs">Payment Gateway &amp; Online Transactions:</h5>
                  <p className="text-muted-foreground leading-relaxed">
                    Online transactions on our platforms (including advertising bookings on <em>sharan-navratri.vercel.app</em> and software subscriptions) are processed through <strong>Cashfree Payment Gateway</strong> (Cashfree Payments India Private Limited). Users agree to comply with all banking and authentication rules stipulated by RBI and Cashfree. All transactions are governed by our <Link to="/refund-cancellation-policy" className="text-primary hover:underline font-bold">Refund &amp; Cancellation Policy</Link> and <Link to="/pricing" className="text-primary hover:underline font-bold">Products &amp; Pricing Schedule</Link>.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Confidentiality */}
            <section id="confidentiality" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 08</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Confidentiality &amp; Non-Disclosure</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>
                  "Confidential Information" encompasses all proprietary data, product architecture, client customer lists, financial figures, trade secrets, and non-public materials exchanged between parties.
                </p>
                <p className="text-muted-foreground">
                  Both parties agree to hold all Confidential Information in strictest confidence and use it solely for fulfilling the engagement. This obligation survives for three (3) years following project completion. Unless requested otherwise in writing, Siddhi Dynamics may identify the Client by name and logo in portfolio showcases.
                </p>
              </div>
            </section>

            {/* 9. Warranty & Hypercare */}
            <section id="warranty" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 09</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">30-Day Hypercare Warranty</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                  <span className="font-bold text-foreground text-xs block mb-1">Complimentary Post-Launch Stabilization</span>
                  <p className="text-muted-foreground">
                    Siddhi Dynamics provides a thirty (30) day hypercare warranty starting from the date of initial production deployment.
                  </p>
                </div>
                <p className="text-muted-foreground">
                  During this window, any defects, broken logic, or bugs arising from deviations from the agreed SOW will be resolved promptly at no additional charge. This warranty does not cover issues caused by third-party infrastructure outages, external API deprecations, or unauthorized modifications made by third parties.
                </p>
              </div>
            </section>

            {/* 10. Limitation of Liability */}
            <section id="liability" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 10</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Limitation of Liability</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p className="text-muted-foreground">
                  To the maximum extent permitted by applicable Indian Law, neither party shall be liable for indirect, incidental, special, exemplary, or consequential damages, including loss of profits, business interruption, or data corruption.
                </p>
                <p className="text-muted-foreground">
                  Siddhi Dynamics' total aggregate liability arising out of or related to an engagement shall not exceed the total fees actually paid by the Client to Siddhi Dynamics under the specific SOW during the three (3) months preceding the claim.
                </p>
              </div>
            </section>

            {/* 11. Term & Termination */}
            <section id="termination" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 11</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Term &amp; Termination</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p className="text-muted-foreground">
                  Either party may terminate an engagement upon fourteen (14) days written notice if the other party breaches any material term and fails to cure such breach within fourteen (14) days.
                </p>
                <p className="text-muted-foreground">
                  Upon termination, the Client shall pay Siddhi Dynamics for all work performed and milestone deliverables completed up to the effective date of termination, whereupon all completed deliverables will be transferred.
                </p>
              </div>
            </section>

            {/* 12. Governing Law */}
            <section id="governing-law" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 12</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Governing Law &amp; Jurisdiction</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p className="text-muted-foreground">
                  These Terms and any project dispute shall be governed by, interpreted, and construed in accordance with the laws of the Republic of India, without regard to conflict of law principles.
                </p>
                <p className="text-muted-foreground">
                  In the event of any dispute, the parties shall first attempt to resolve it through amicable negotiation for thirty (30) days. Failing amicable resolution, the courts of competent jurisdiction located in Nizamabad or Hyderabad, Telangana, India shall possess exclusive jurisdiction.
                </p>
              </div>
            </section>

            {/* 13. Contact & Grievance Details */}
            <section id="contact" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-primary/30 bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 13</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Legal &amp; Grievance Contact</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <span className="text-muted-foreground block mb-1">Company Registered Name</span>
                  <strong className="text-foreground text-sm block">Siddhi Dynamics LLP</strong>
                  <span className="text-muted-foreground mt-2 block leading-relaxed">
                    3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <span className="text-muted-foreground block mb-1">Designated Partners &amp; Counsel</span>
                  <strong className="text-foreground text-sm block">Sarugu Sai Vara Prasad</strong>
                  <span className="text-muted-foreground mt-1 block">
                    Founder &amp; Designated Partner
                  </span>
                  <div className="mt-3 space-y-1.5 pt-2 border-t border-border">
                    <a href="mailto:saivaraprasad@siddhidynamics.in" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                      <Mail className="w-3.5 h-3.5" /> saivaraprasad@siddhidynamics.in
                    </a>
                    <a href="tel:+916303602743" className="flex items-center gap-1.5 text-foreground/85 hover:text-primary font-medium">
                      <Phone className="w-3.5 h-3.5" /> +91 63036 02743
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div>
                  <p className="text-xs text-foreground font-semibold">Have a specific question about your project agreement?</p>
                  <p className="text-[11px] text-muted-foreground">Our founders review all custom requirements directly.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Requirement
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default TermsOfService;
