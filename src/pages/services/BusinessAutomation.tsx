import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  'Automated invoice generation & GST calculations',
  'End-to-end bookkeeping without manual data entry',
  'Real-time financial dashboards & P&L reports',
  'TDS, GST & compliance automation',
  'Multi-party workflow approvals',
  'WhatsApp & email notification triggers',
  'Integration with Tally, Zoho, and custom ERPs',
  'AI-powered expense categorization',
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Audit Your Current Workflow', desc: 'We map every manual step in your existing process — invoices, approvals, data entry, reports.' },
  { step: '02', title: 'Design the Automation Blueprint', desc: 'Our team designs an AI-powered replacement for each manual step, with zero disruption to your team.' },
  { step: '03', title: 'Build & Integrate', desc: 'We build the system and integrate it with your existing tools — Tally, WhatsApp, email, cloud storage.' },
  { step: '04', title: 'Deploy & Train', desc: 'We deploy to production and train your team. Most teams are fully onboarded in under 2 weeks.' },
  { step: '05', title: 'Measure & Optimize', desc: 'We monitor performance, flag issues, and keep improving the system as your business grows.' },
];

const FAQS = [
  {
    q: 'What is business automation for small businesses in India?',
    a: 'Business automation uses AI and software to replace repetitive manual tasks — like generating invoices, recording transactions, calculating GST, and sending reminders — so your team can focus on actual business growth. For Indian SMBs, this typically cuts operational costs by 40–60%.',
  },
  {
    q: 'How does AI invoice processing work?',
    a: 'AI invoice processing automatically reads incoming invoices (scanned PDFs, emails, or photos), extracts line items, validates amounts, applies GST rules, and posts them to your accounting system — all without human intervention. Siddhi Dynamics builds custom AI invoice processors tailored to your business.',
  },
  {
    q: 'Is business automation expensive for Indian SMBs?',
    a: 'Our automation solutions are priced for Indian market realities — not enterprise budgets. Most clients recover the investment within 3–6 months through time savings and error reduction.',
  },
  {
    q: 'Which businesses benefit most from automation?',
    a: 'Businesses that process 50+ invoices/month, manage multi-location inventory, handle complex payroll, or run manual approval chains benefit the most. Industries include construction, retail, professional services, and manufacturing.',
  },
  {
    q: 'Can you integrate automation with Tally or our existing software?',
    a: 'Yes. We integrate with Tally, Zoho Books, QuickBooks, and most cloud-based accounting tools. We also build custom connectors for proprietary systems.',
  },
  {
    q: 'How long does it take to implement business automation?',
    a: 'Simple automations (invoice processing, reminders) go live in 2–4 weeks. End-to-end workflow automation typically takes 6–12 weeks depending on complexity.',
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Business Automation Services for Indian SMBs",
  "serviceType": "AI Business Automation",
  "provider": {
    "@type": "Organization",
    "name": "Siddhi Dynamics LLP",
    "url": "https://siddhidynamics.in"
  },
  "areaServed": [
    { "@type": "Country", "name": "India" },
    { "@type": "City", "name": "Nizamabad" },
    { "@type": "City", "name": "Hyderabad" }
  ],
  "description": "End-to-end business automation including AI invoice processing, bookkeeping automation, GST compliance, workflow digitization, and financial reporting for Indian small and medium businesses.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
};

export default function BusinessAutomation() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Business Automation & AI Solutions in Nizamabad & Hyderabad | Siddhi Dynamics</title>
        <meta name="description" content="End-to-end business automation for Indian SMBs — AI invoice processing, bookkeeping automation, GST compliance, and workflow digitization. Siddhi Dynamics, Hyderabad & Nizamabad." />
        <meta name="keywords" content="business automation India, AI automation SMB India, invoice automation India, GST automation Hyderabad, workflow digitization India, business process automation Nizamabad" />
        <link rel="canonical" href="https://siddhidynamics.in/services/business-automation" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siddhidynamics.in/services/business-automation" />
        <meta property="og:title" content="Business Automation for Indian SMBs | Siddhi Dynamics" />
        <meta property="og:description" content="AI-powered invoice processing, bookkeeping, GST compliance and workflow automation for Indian businesses." />
        <meta property="og:image" content="https://siddhidynamics.in/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Automation for Indian SMBs | Siddhi Dynamics" />
        <meta name="twitter:description" content="AI-powered invoice processing, bookkeeping, GST compliance and workflow automation for Indian businesses." />
        <meta name="twitter:image" content="https://siddhidynamics.in/favicon.jpg" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background" />
          <div className="container mx-auto px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li><Link to="/about" className="hover:text-primary transition-colors">Services</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">Business Automation</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6"
              >
                Most Popular Service
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black mb-6 leading-tight"
              >
                Business Automation{' '}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  for Indian SMBs
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl"
              >
                Stop losing hours to manual invoicing, bookkeeping, and workflow approvals.
                We replace your manual processes with intelligent AI systems — end-to-end,
                GST-compliant, and built specifically for Indian businesses.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/#submit"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
                >
                  Get a Free Audit <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase border border-border hover:border-primary/50 transition-colors"
                >
                  How It Works
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y border-border/30 bg-card/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '40–60%', label: 'Cost Reduction' },
                { value: '2 Weeks', label: 'Avg. Onboarding' },
                { value: '100%', label: 'GST Compliant' },
                { value: '24/7', label: 'Autonomous Operation' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-black text-primary mb-1">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-b border-border/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl font-black mb-4">What Gets Automated</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  From the moment a transaction happens to the final audit report —
                  every step in between can run without human intervention.
                </p>
                <ul className="space-y-3">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
                  <h3 className="font-bold text-lg text-foreground mb-2">Who This Is For</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Indian businesses processing 50+ invoices/month, managing multi-vendor payments,
                    or dealing with complex GST filings across multiple GSTIN registrations.
                    Retail, construction, manufacturing, professional services.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                  <h3 className="font-bold text-lg text-foreground mb-2">What You Stop Doing</h3>
                  <ul className="text-muted-foreground text-sm space-y-2">
                    <li>❌ Manually typing invoices in Tally</li>
                    <li>❌ Chasing vendors for missing bills</li>
                    <li>❌ Reconciling bank statements by hand</li>
                    <li>❌ Preparing GST reports at month-end</li>
                    <li>❌ Building Excel dashboards for leadership</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 border-b border-border/30 bg-card/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                From discovery to live system — our process is transparent, collaborative, and fast.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {HOW_IT_WORKS.map(({ step, title, desc }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6 p-6 rounded-2xl border border-border/50 bg-card/50"
                >
                  <div className="text-4xl font-black text-primary/20 shrink-0">{step}</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 border-b border-border/30">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-border/50 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-card/50 transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Stop the Manual Work?</h2>
            <p className="text-muted-foreground text-xl mb-8 max-w-xl mx-auto">
              Book a free 30-minute workflow audit. We'll map your process and show exactly what can be automated.
            </p>
            <Link
              to="/#submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
            >
              Book a Free Audit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
