import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import {
  Shield,
  Lock,
  EyeOff,
  UserCheck,
  Building2,
  FileText,
  Mail,
  Phone,
  ChevronLeft,
  ArrowRight,
  Send,
  Database,
  CheckCircle2,
  AlertTriangle,
  Scale,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SECTIONS = [
  { id: "who-we-are", title: "1. Data Fiduciary & Identity", icon: Building2 },
  { id: "data-collected", title: "2. Data We Collect & Lawful Basis", icon: Database },
  { id: "consent", title: "3. Consent & One-Click Withdrawal", icon: RefreshCw },
  { id: "children", title: "4. Minors & Children's Data Protection", icon: UserCheck },
  { id: "processors", title: "5. Processors & Cloud Infrastructure", icon: EyeOff },
  { id: "security", title: "6. Security Safeguards & RLS", icon: Lock },
  { id: "retention", title: "7. Retention & Statutory Erasure", icon: FileText },
  { id: "rights", title: "8. Your Statutory Rights (DPDP Act)", icon: Scale },
  { id: "grievance", title: "9. Grievance Redressal Officer", icon: Shield },
  { id: "contact", title: "10. Official Notices & Contact", icon: Mail },
];

const TRUST_PILLARS = [
  {
    icon: EyeOff,
    title: "Zero Data Monetization",
    description: "We never sell, broker, or rent your personal information, client records, or project briefs to data brokers or third-party advertisers.",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Shield,
    title: "DPDP Act, 2023 Grounded",
    description: "Built in strict conformity with India's Digital Personal Data Protection Act 2023, ensuring plain language, purpose limitation, and lawful processing.",
    accent: "text-primary bg-primary/10 border-primary/20",
  },
  {
    icon: Lock,
    title: "Enterprise Row-Level Security",
    description: "All client databases and portal records are isolated with PostgreSQL Row Level Security (RLS) policies and TLS 1.3 transit encryption.",
    accent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: RefreshCw,
    title: "Instant Rights Exercise",
    description: "Review, download, or revoke your consent and request complete erasure at any time directly through our dedicated Data Rights hub.",
    accent: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
];

const DATA_TABLE_ROWS = [
  {
    category: "Identity & Contact",
    data: "Full name, business email, mobile number, organization, designation",
    purpose: "Responding to inquiries, project scoping, sending quotations, and portal authentication.",
    basis: "Your explicit consent (Section 6(1))",
  },
  {
    category: "Project Requirements & Files",
    data: "Requirement descriptions, technical briefs, workflow diagrams, architectural documents",
    purpose: "Evaluating engineering feasibility, executing agreed SOW deliverables, and delivery logs.",
    basis: "Performance of engagement / Contractual necessity",
  },
  {
    category: "Federated Authentication",
    data: "Google Account name, verified email, and profile avatar (when logging in with Google)",
    purpose: "Secure passwordless authentication and personalizing your Client / Agency portal dashboard.",
    basis: "Consent at OAuth authorization",
  },
  {
    category: "Agency & Client Submissions",
    data: "Domain details, Google Business Profile links, SEO targets, client review submissions",
    purpose: "Executing targeted optimization services, generating analytical reports, and campaign tracking.",
    basis: "Performance of client agreement",
  },
  {
    category: "Telemetry & Security Logs",
    data: "IP address, browser user-agent, operating system, security timestamps",
    purpose: "Protecting systems from DDoS, preventing unauthorized brute-force attacks, and firewall monitoring.",
    basis: "Legitimate enterprise security uses",
  },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<string>("who-we-are");

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
        <title>Privacy Policy &amp; Data Protection | Siddhi Dynamics LLP</title>
        <meta
          name="description"
          content="Official Privacy Policy and Data Principal rights notice of Siddhi Dynamics LLP in strict compliance with the Digital Personal Data Protection (DPDP) Act, 2023."
        />
        <link rel="canonical" href="https://siddhidynamics.in/privacy" />
      </Helmet>

      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/5 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none -z-10" />

      <main className="container relative z-10 mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-24 flex-grow max-w-7xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group py-1.5 px-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 w-fit"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/terms-of-service"
              className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link
              to="/data-rights"
              className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline flex items-center gap-1"
            >
              Your Data Rights <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <header className="mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection Act, 2023 Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-6">
            This Privacy Notice is issued under Section 5 of India's <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. It clearly and plainly explains what personal data <strong>Siddhi Dynamics LLP</strong> collects, why we collect it, how we safeguard it, and your full statutory rights as a <strong>Data Principal</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-4 border-t border-white/10">
            <div>
              <span className="text-white/40">Data Fiduciary:</span>{" "}
              <strong className="text-foreground">Siddhi Dynamics LLP</strong>
            </div>
            <div>
              <span className="text-white/40">Status:</span>{" "}
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active &amp; Up to Date
              </span>
            </div>
            <div>
              <span className="text-white/40">Last Updated:</span>{" "}
              <strong className="text-foreground">July 30, 2026</strong>
            </div>
            <div>
              <span className="text-white/40">Grievance Officer:</span>{" "}
              <span className="text-foreground">Sarugu Sai Vara Prasad</span>
            </div>
          </div>
        </header>

        {/* 4 Pillars Overview Grid */}
        <section className="mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Privacy Guarantees at a Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="glass-card rounded-2xl p-5 border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all relative overflow-hidden group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${pillar.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">
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

        {/* Content Layout: Sticky Table of Contents on Desktop + Detailed Clauses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="glass-card rounded-2xl p-5 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sections</span>
                <span className="text-[11px] text-primary font-mono">{SECTIONS.length} Topics</span>
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
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                <Link
                  to="/data-rights"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  <Scale className="w-3.5 h-3.5 text-primary" /> Exercise Data Rights
                </Link>
                <a
                  href="#grievance"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("grievance");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Contact Grievance Officer
                </a>
              </div>
            </div>
          </aside>

          {/* Detailed Clauses */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Who We Are */}
            <section id="who-we-are" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 01</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Who We Are (Data Fiduciary)</h2>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Siddhi Dynamics LLP</strong> ("we", "us", "our") is the designated <strong>Data Fiduciary</strong> for all personal data processed through <a href="https://siddhidynamics.in" className="text-primary hover:underline">https://siddhidynamics.in</a> and our associated client, partner, employee, and investor portals.
                </p>
                <p className="text-xs text-muted-foreground">
                  Under Section 5 of the Digital Personal Data Protection Act, 2023, this policy serves as a plain-language notice to inform you, the <strong>Data Principal</strong>, regarding what personal information is collected, the precise purpose for its processing, the rights you possess under Indian law, and the exact grievance redressal mechanism available.
                </p>
              </div>
            </section>

            {/* 2. Personal Data We Collect & Lawful Basis */}
            <section id="data-collected" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 02</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Personal Data Collected &amp; Lawful Basis</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p className="text-xs text-muted-foreground">
                  In compliance with Section 6(1) of the DPDP Act (Principle of Purpose Limitation and Data Minimization), we only collect data that is strictly necessary for specified, lawful business operations:
                </p>

                {/* Structured Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-white border-b border-white/10">
                        <th className="p-3 font-semibold">Data Category</th>
                        <th className="p-3 font-semibold">Data Items</th>
                        <th className="p-3 font-semibold">Specified Purpose</th>
                        <th className="p-3 font-semibold">Lawful Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {DATA_TABLE_ROWS.map((row) => (
                        <tr key={row.category} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3 font-medium text-primary whitespace-nowrap align-top">{row.category}</td>
                          <td className="p-3 text-slate-300 align-top">{row.data}</td>
                          <td className="p-3 text-muted-foreground align-top">{row.purpose}</td>
                          <td className="p-3 text-slate-400 text-[11px] align-top">{row.basis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-primary/90 flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>
                    We do not engage in unauthorized profiling, behavioral ad retargeting, or automated decision-making that produces legal effects against you.
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Consent Architecture & Instant Withdrawal */}
            <section id="consent" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 03</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Consent &amp; One-Click Withdrawal</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Where processing relies on consent, consent is obtained prior to data collection via explicit, unticked checkboxes accompanied by notice of specified purposes. Consent is free, specific, informed, unconditional, and unambiguous.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white text-sm mb-1">Right to Withdraw Consent Easily</h4>
                  <p className="text-muted-foreground">
                    Under Section 6(4) of the DPDP Act, withdrawing consent must be as effortless as giving it. You may withdraw your consent at any time through our <Link to="/data-rights" className="text-primary hover:underline font-semibold">Data Rights Portal</Link> or by emailing our Grievance Officer. Upon receiving withdrawal, we cease processing and permanently delete your non-statutory records within statutory limits.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Minors & Children's Data */}
            <section id="children" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 04</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Children &amp; Minors' Protection</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Siddhi Dynamics provides enterprise software and deep-tech B2B innovation. Our services are not targeted at individuals under the age of 18.
                </p>
                <p className="text-muted-foreground">
                  In strict alignment with Section 9 of the DPDP Act, we never knowingly process personal data belonging to children without verifiable parental or guardian authorization, and we never undertake behavioral tracking or targeted ads directed at minors. If you believe a minor has submitted personal information to our systems, alert our Grievance Officer and it will be immediately purged.
                </p>
              </div>
            </section>

            {/* 5. Processors & Cloud Infrastructure */}
            <section id="processors" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 05</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Data Processors &amp; Cloud Infrastructure</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  We contract with premier Data Processors under strict Data Processing Agreements (DPAs) bound by data isolation and security standards:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white text-xs block">Database &amp; Authentication</strong>
                    <span className="text-slate-400 text-[11px]">Supabase (PostgreSQL with Row-Level Security, role encryption)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white text-xs block">Global Edge &amp; DNS</strong>
                    <span className="text-slate-400 text-[11px]">Cloudflare (WAF protection, DDoS mitigation, SSL termination)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white text-xs block">Transactional Communications</strong>
                    <span className="text-slate-400 text-[11px]">Resend / Google Workspace (DKIM, SPF, DMARC-authenticated delivery)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white text-xs block">Cross-Border Data Transfer</strong>
                    <span className="text-slate-400 text-[11px]">Processed in jurisdictions not restricted by the Central Government of India under Section 16.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Technical Security Safeguards */}
            <section id="security" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 06</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Technical Security Safeguards</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Pursuant to Section 8(5) of the DPDP Act, Siddhi Dynamics implements appropriate technical and organizational measures to prevent personal data breaches:
                </p>
                <ul className="space-y-2 list-disc pl-4 text-muted-foreground">
                  <li><strong>PostgreSQL Row Level Security (RLS):</strong> Every database entity restricts read/write permissions directly to the authenticated user ID.</li>
                  <li><strong>Encryption in Transit &amp; At Rest:</strong> Enforced TLS 1.3 encryption across all client web sessions and AES-256 encrypted database volumes.</li>
                  <li><strong>Role-Based Access Control (RBAC):</strong> Admin privileges are strictly restricted to designated founding partners with audit logs.</li>
                  <li><strong>Breach Notification Protocol:</strong> In the unlikely event of a verified data breach, notice will be issued to the Data Protection Board of India and affected Data Principals without undue delay.</li>
                </ul>
              </div>
            </section>

            {/* 7. Retention Schedules & Erasure */}
            <section id="retention" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 07</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Retention &amp; Statutory Erasure</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="text-muted-foreground">
                  We retain personal data only for the period necessary to satisfy the purpose for which it was collected or to comply with statutory accounting, tax, and company audit regulations under Indian Law.
                </p>
                <p className="text-muted-foreground">
                  Unconverted inquiry leads and exploratory project submissions are automatically purged after twenty-four (24) months of dormancy. Invoices and formal client delivery contracts are retained for eight (8) years as mandated by the Companies Act, 2013 and Goods and Services Tax Rules.
                </p>
              </div>
            </section>

            {/* 8. Your Statutory Rights */}
            <section id="rights" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 08</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Your Statutory Rights (Data Principal)</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>As a Data Principal under the DPDP Act, 2023, you hold the following rights:</p>
                <div className="space-y-2 pt-1">
                  {[
                    { right: "Right to Access Information (Sec. 11)", desc: "Obtain a summary of personal data being processed and identities of processors with whom data is shared." },
                    { right: "Right to Correction & Erasure (Sec. 12)", desc: "Request correction of inaccurate data, completion of incomplete records, or permanent erasure." },
                    { right: "Right to Grievance Redressal (Sec. 13)", desc: "Access an expeditious internal grievance redressal mechanism with response within 30 calendar days." },
                    { right: "Right to Nominate (Sec. 14)", desc: "Nominate any individual to exercise your data rights in the event of death or incapacity." },
                  ].map((item) => (
                    <div key={item.right} className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-3 items-start">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white text-xs block">{item.right}</strong>
                        <span className="text-slate-400 text-[11px]">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Link
                    to="/data-rights"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-xs"
                  >
                    Open Data Rights Request Form <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>

            {/* 9. Grievance Redressal Officer */}
            <section id="grievance" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-primary/30 bg-primary/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 09</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Grievance Redressal Officer</h2>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono text-primary uppercase">Appointed Grievance Officer (Sec. 13)</span>
                    <h3 className="text-base font-bold text-white">Sarugu Sai Vara Prasad</h3>
                    <p className="text-slate-400 text-[11px]">Founder &amp; Designated Partner, Siddhi Dynamics LLP</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium w-fit">
                    30-Day Response SLA
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Direct Grievance Email:</span>
                    <a href="mailto:saivaraprasad@siddhidynamics.in" className="text-primary hover:underline font-medium flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5" /> saivaraprasad@siddhidynamics.in
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Direct Contact Phone:</span>
                    <a href="tel:+916303602743" className="text-slate-200 hover:text-white flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5" /> +91 63036 02743
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground pt-2 border-t border-white/5">
                  If your grievance is not resolved satisfactorily within 30 days, you have the right under Section 13(4) to appeal directly to the <strong>Data Protection Board of India</strong>.
                </p>
              </div>
            </section>

            {/* 10. Official Notices & Contact */}
            <section id="contact" className="scroll-mt-28 glass-card rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-semibold">SECTION 10</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Registered Office &amp; Legal Notices</h2>
                </div>
              </div>
              <div className="text-xs text-slate-300 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white text-xs block mb-1">Nizamabad Registered Office</strong>
                    <span className="text-slate-400 text-[11px] leading-relaxed block">
                      3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <strong className="text-white text-xs block mb-1">Hyderabad Innovation Hub</strong>
                    <span className="text-slate-400 text-[11px] leading-relaxed block">
                      HIVE Incubation Cell, Anurag University, Hyderabad, Telangana 500049, India
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10 mt-4">
                  <div>
                    <p className="text-xs text-white font-medium">Ready to submit a requirement under full privacy assurance?</p>
                    <p className="text-[11px] text-muted-foreground">All project details remain confidential and protected.</p>
                  </div>
                  <Link
                    to="/submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm"
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

export default PrivacyPolicy;
