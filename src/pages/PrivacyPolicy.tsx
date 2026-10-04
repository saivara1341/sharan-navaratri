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
    accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
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
    accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: RefreshCw,
    title: "Instant Rights Exercise",
    description: "Review, download, or revoke your consent and request complete erasure at any time directly through our dedicated Data Rights hub.",
    accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
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
    data: "Project briefs, RFP documents, architectural schematics, budget estimates",
    purpose: "Engineering effort calculation, milestone roadmap formulation, and contract execution.",
    basis: "Performance of preliminary agreement",
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
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group py-1.5 px-3 rounded-full hover:bg-muted border border-border w-fit shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-primary" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/terms-of-service"
              className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
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
              to="/data-rights"
              className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline flex items-center gap-1"
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

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
            Privacy <span className="gradient-text">Policy</span>
          </h1>

          <p className="text-base sm:text-lg text-foreground/80 max-w-3xl leading-relaxed mb-6 font-normal">
            This Privacy Notice is issued under Section 5 of India's <strong className="text-foreground font-semibold">Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. It clearly and plainly explains what personal data <strong className="text-foreground font-semibold">Siddhi Dynamics LLP</strong> collects, why we collect it, how we safeguard it, and your full statutory rights as a <strong className="text-foreground font-semibold">Data Principal</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-4 border-t border-border">
            <div>
              <span className="text-muted-foreground/80">Data Fiduciary:</span>{" "}
              <strong className="text-foreground font-semibold">Siddhi Dynamics LLP</strong>
            </div>
            <div>
              <span className="text-muted-foreground/80">Status:</span>{" "}
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active &amp; Up to Date
              </span>
            </div>
            <div>
              <span className="text-muted-foreground/80">Last Updated:</span>{" "}
              <strong className="text-foreground font-semibold">July 30, 2026</strong>
            </div>
            <div>
              <span className="text-muted-foreground/80">Grievance Officer:</span>{" "}
              <span className="text-foreground font-semibold">Sarugu Sai Vara Prasad</span>
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

        {/* Content Layout: Sticky Table of Contents on Desktop + Detailed Clauses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
            <div className="rounded-2xl p-5 border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sections</span>
                <span className="text-[11px] text-primary font-mono font-bold">{SECTIONS.length} Topics</span>
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
                <Link
                  to="/data-rights"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-semibold text-foreground border border-border transition-colors shadow-2xs"
                >
                  <Scale className="w-3.5 h-3.5 text-primary" /> Exercise Data Rights
                </Link>
                <a
                  href="#grievance"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("grievance");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5" /> Grievance Officer Contact
                </a>
              </div>
            </div>
          </aside>

          {/* Detailed Clauses */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Who We Are */}
            <section id="who-we-are" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 01</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Who We Are (Data Fiduciary)</h2>
                </div>
              </div>
              <div className="space-y-3 text-sm text-foreground/85 leading-relaxed">
                <p>
                  <strong className="text-foreground">Siddhi Dynamics LLP</strong> ("we", "us", "our") is the designated <strong>Data Fiduciary</strong> for all personal data processed through <a href="https://siddhidynamics.in" className="text-primary hover:underline font-medium">https://siddhidynamics.in</a> and our associated client, partner, employee, and festival portals (including <em>sharan-navratri.vercel.app</em>).
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Under Section 5 of the Digital Personal Data Protection Act, 2023, this policy serves as a plain-language notice to inform you, the <strong>Data Principal</strong>, regarding what personal information is collected, the precise purpose for its processing, the rights you possess under Indian law, and the exact grievance redressal mechanism available.
                </p>
              </div>
            </section>

            {/* 2. Personal Data We Collect & Lawful Basis */}
            <section id="data-collected" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 02</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Personal Data Collected &amp; Lawful Basis</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground/85 leading-relaxed">
                <p className="text-xs text-muted-foreground">
                  In compliance with Section 6(1) of the DPDP Act (Principle of Purpose Limitation and Data Minimization), we only collect data that is strictly necessary for specified, lawful business operations:
                </p>

                {/* Structured Table */}
                <div className="overflow-x-auto rounded-xl border border-border bg-muted/20">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/60 text-foreground border-b border-border">
                        <th className="p-3 font-bold">Data Category</th>
                        <th className="p-3 font-bold">Data Items</th>
                        <th className="p-3 font-bold">Specified Purpose</th>
                        <th className="p-3 font-bold">Lawful Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-foreground/90">
                      {DATA_TABLE_ROWS.map((row) => (
                        <tr key={row.category} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-semibold text-primary whitespace-nowrap align-top">{row.category}</td>
                          <td className="p-3 text-foreground/90 align-top">{row.data}</td>
                          <td className="p-3 text-muted-foreground align-top">{row.purpose}</td>
                          <td className="p-3 text-muted-foreground font-mono text-[11px] align-top">{row.basis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground/90 flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span>
                    We do not engage in unauthorized profiling, behavioral ad retargeting, or automated decision-making that produces legal effects against you.
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Consent Architecture & Instant Withdrawal */}
            <section id="consent" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 03</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Consent &amp; One-Click Withdrawal</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>
                  In accordance with Section 6 of the DPDP Act, your consent is obtained through clear affirmative actions (such as opt-in checkboxes on form submissions and account creation).
                </p>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="font-bold text-foreground text-sm mb-1">Right to Withdraw Consent Easily</h4>
                  <p className="text-muted-foreground">
                    Section 6(4) guarantees your right to withdraw consent at any time, with comparable ease to how it was granted. You may revoke consent for non-essential communications or portal access instantly using our <Link to="/data-rights" className="text-primary hover:underline font-medium">Data Rights Hub</Link> or by emailing <a href="mailto:privacy@siddhidynamics.in" className="text-primary hover:underline font-medium">privacy@siddhidynamics.in</a>.
                  </p>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Withdrawal of consent does not affect the lawfulness of processing undertaken prior to the withdrawal, nor does it impede statutory retention required for taxation, invoice compliance, and legal audit trails.
                </p>
              </div>
            </section>

            {/* 4. Minors & Children's Data */}
            <section id="children" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 04</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Children &amp; Minors' Protection</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>
                  Siddhi Dynamics is an enterprise AI and B2B software engineering consultancy. Our services, portals, and requirement submission systems are not directed toward children under the age of 18.
                </p>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                  <strong>Strict Section 9 Compliance:</strong> We do not knowingly process personal data of children, undertake tracking or behavioral monitoring of minors, or serve targeted advertisements directed at children.
                </div>
              </div>
            </section>

            {/* 5. Processors & Cloud Infrastructure */}
            <section id="processors" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 05</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Data Processors &amp; Cloud Infrastructure</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>
                  Under Section 8(1), Siddhi Dynamics retains full accountability for any data handled by our vetted technical sub-processors. We engage only Tier-1 enterprise providers under binding data processing agreements:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <strong className="text-foreground text-xs block font-bold">Database &amp; Authentication</strong>
                    <span className="text-muted-foreground text-[11px]">Supabase Inc. (PostgreSQL with Row Level Security)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <strong className="text-foreground text-xs block font-bold">Global Edge &amp; DNS</strong>
                    <span className="text-muted-foreground text-[11px]">Cloudflare Inc. (TLS 1.3 encryption, DDoS mitigation)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <strong className="text-foreground text-xs block font-bold">Transactional Communications</strong>
                    <span className="text-muted-foreground text-[11px]">Resend Inc. (Encrypted SMTP notification relays)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border border-border">
                    <strong className="text-foreground text-xs block font-bold">Cross-Border Data Transfer</strong>
                    <span className="text-muted-foreground text-[11px]">Complies with Section 16 non-restricted country guidelines</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Security Safeguards & RLS */}
            <section id="security" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 06</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Technical Security Safeguards</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>
                  To fulfill our statutory duty under Section 8(5) to prevent personal data breaches, we implement strict technical and operational safeguards:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  <li><strong>PostgreSQL Row-Level Security (RLS):</strong> Every client record, requirement brief, and portal account is programmatically segregated at the database kernel level.</li>
                  <li><strong>Transit &amp; Rest Encryption:</strong> All data in transit is enforced through TLS 1.3 encryption with strict HTTPS redirection; stored database volumes are encrypted at rest with AES-256.</li>
                  <li><strong>Automated Breach Notification:</strong> In the unlikely event of a security incident impacting your data, we adhere strictly to Section 8(6) notifying both the Data Protection Board of India and affected Data Principals promptly.</li>
                </ul>
              </div>
            </section>

            {/* 7. Retention & Erasure */}
            <section id="retention" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 07</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Retention &amp; Statutory Erasure</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>
                  In accordance with Section 8(7), we do not retain personal data longer than necessary to fulfill the specified business purpose for which it was collected:
                </p>
                <div className="space-y-2 pt-1 text-muted-foreground">
                  <p>• <strong>General Inquiries &amp; Scoping Leads:</strong> Retained for 180 days following resolution, after which records are automatically anonymized or purged.</p>
                  <p>• <strong>Executed Client Accounts:</strong> Retained for the duration of the engagement plus statutory periods mandated by Indian tax and corporate law (7 years for GST &amp; financial invoicing records).</p>
                  <p>• <strong>Upon Account Closure or Erasure Request:</strong> Data is permanently deleted within thirty (30) days unless statutory retention is mandatory.</p>
                </div>
              </div>
            </section>

            {/* 8. Statutory Rights (Data Principal) */}
            <section id="rights" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 08</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Your Statutory Rights (Data Principal)</h2>
                </div>
              </div>
              <div className="space-y-3 text-xs text-foreground/85 leading-relaxed">
                <p>As a Data Principal under Chapter III of the DPDP Act, 2023, you hold the following non-negotiable statutory rights:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {[
                    { right: "Right to Access (Sec. 11)", desc: "Obtain a complete summary of all personal data held and identities of processors shared with." },
                    { right: "Right to Correction (Sec. 12)", desc: "Update inaccurate, misleading, or outdated personal information effortlessly." },
                    { right: "Right to Erasure (Sec. 12)", desc: "Request complete deletion of personal records where continuous retention is no longer necessary." },
                    { right: "Right to Grievance Redressal (Sec. 13)", desc: "Access a dedicated, readily reachable officer for addressing privacy concerns." },
                    { right: "Right to Nominate (Sec. 14)", desc: "Designate a representative to exercise rights in the event of death or incapacity." },
                  ].map((item) => (
                    <div key={item.right} className="p-3 rounded-xl bg-muted/50 border border-border">
                      <strong className="text-foreground text-xs block font-bold">{item.right}</strong>
                      <span className="text-muted-foreground text-[11px] mt-1 block leading-relaxed">{item.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    to="/data-rights"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-bold text-xs"
                  >
                    Open Data Rights Request Form <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </section>

            {/* 9. Grievance Redressal Officer */}
            <section id="grievance" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-primary/30 bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 09</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Grievance Redressal Officer</h2>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-muted/50 border border-border text-xs space-y-3 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                  <div>
                    <span className="text-[10px] font-mono text-primary uppercase font-bold">Appointed Grievance Officer (Sec. 13)</span>
                    <h3 className="text-base font-bold text-foreground">Sarugu Sai Vara Prasad</h3>
                    <p className="text-muted-foreground text-[11px]">Founder &amp; Designated Partner, Siddhi Dynamics LLP</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold w-fit">
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
                    <a href="tel:+916303602743" className="text-foreground/85 hover:text-primary flex items-center gap-1.5 mt-0.5 font-medium">
                      <Phone className="w-3.5 h-3.5" /> +91 63036 02743
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground pt-2 border-t border-border">
                  If your grievance is not resolved satisfactorily within 30 days, you have the right under Section 13(4) to appeal directly to the <strong>Data Protection Board of India</strong>.
                </p>
              </div>
            </section>

            {/* 10. Official Notices & Contact */}
            <section id="contact" className="scroll-mt-28 rounded-2xl p-6 md:p-8 border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-primary font-bold">SECTION 10</span>
                  <h2 className="text-xl md:text-2xl font-extrabold text-foreground">Registered Office &amp; Legal Notices</h2>
                </div>
              </div>
              <div className="text-xs text-foreground/85 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <strong className="text-foreground text-xs block mb-1 font-bold">Nizamabad Registered Office</strong>
                    <span className="text-muted-foreground text-[11px] leading-relaxed block">
                      3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <strong className="text-foreground text-xs block mb-1 font-bold">Hyderabad Innovation Hub</strong>
                    <span className="text-muted-foreground text-[11px] leading-relaxed block">
                      HIVE Incubation Cell, Anurag University, Hyderabad, Telangana 500049, India
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/50 border border-border mt-4">
                  <div>
                    <p className="text-xs text-foreground font-semibold">Ready to submit a requirement under full privacy assurance?</p>
                    <p className="text-[11px] text-muted-foreground">All project details remain confidential and protected.</p>
                  </div>
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

export default PrivacyPolicy;
