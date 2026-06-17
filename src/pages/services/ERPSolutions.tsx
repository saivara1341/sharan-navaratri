import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const MODULES = [
  'Inventory & Supply Chain Management',
  'HR, Payroll & Attendance (with biometric sync)',
  'Purchase Orders & Vendor Management',
  'Sales & Customer Relationship Management',
  'Financial Accounting & GST Filing',
  'Project Tracking & Resource Planning',
  'Multi-branch / Multi-location support',
  'Real-time reporting dashboards',
  'Role-based user access control',
  'WhatsApp & email alerts for key events',
];

const FAQS = [
  {
    q: 'What is an ERP system and do small businesses need it?',
    a: 'ERP (Enterprise Resource Planning) is software that connects all your business departments — inventory, sales, HR, finance, and operations — into one system. Even businesses with 10–50 employees benefit significantly, eliminating data silos and manual reconciliation.',
  },
  {
    q: 'How is AI ERP different from traditional ERP?',
    a: 'Traditional ERP systems store and organize data. AI ERP systems also analyze that data — predicting demand, flagging anomalies, automating approvals, and generating reports without manual input. Siddhi Dynamics builds AI-augmented ERP that thinks alongside your team.',
  },
  {
    q: 'What does ERP implementation cost for small businesses in India?',
    a: 'Our ERP solutions are designed for Indian SMB budgets — significantly more affordable than SAP or Oracle, with no expensive license fees. We price on a project + optional SaaS subscription model.',
  },
  {
    q: 'How long does ERP implementation take?',
    a: 'A focused ERP covering 2–3 core modules (e.g., inventory + sales + accounting) takes 8–14 weeks to implement. Full enterprise ERPs covering all departments take 4–8 months.',
  },
  {
    q: 'Can your ERP integrate with Tally?',
    a: 'Yes. We build bidirectional Tally integration so your existing accounting data flows into the new ERP without re-entry. We also integrate with Zoho, QuickBooks, and most banking APIs.',
  },
  {
    q: 'Do you offer ERP training and support?',
    a: 'Yes. Every ERP deployment includes team training, documentation, and a support period. We offer ongoing maintenance packages for continued updates and issue resolution.',
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AI ERP Solutions for Small Business India",
  "serviceType": "ERP Implementation",
  "provider": { "@type": "Organization", "name": "Siddhi Dynamics LLP", "url": "https://siddhidynamics.in" },
  "areaServed": { "@type": "Country", "name": "India" },
  "description": "Intelligent ERP solutions for Indian small and medium businesses. Centralizes inventory, HR, sales, and finance with AI-powered automation and Tally integration."
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
};

export default function ERPSolutions() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>ERP Solutions for Small Business India | AI Enterprise Resource Planning — Siddhi Dynamics</title>
        <meta name="description" content="Intelligent ERP solutions for Indian small businesses. Inventory, HR, sales, finance and compliance — unified and AI-powered. Siddhi Dynamics, Hyderabad." />
        <meta name="keywords" content="ERP solutions India, ERP for small business India, AI ERP India, enterprise resource planning India, ERP implementation Hyderabad, Tally integration ERP India" />
        <link rel="canonical" href="https://siddhidynamics.in/services/erp" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="pt-24">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-background to-background" />
          <div className="container mx-auto px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">ERP Solutions</li>
              </ol>
            </nav>
            <div className="max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-6 leading-tight"
              >
                ERP That{' '}
                <span className="bg-gradient-to-r from-purple-400 to-primary bg-clip-text text-transparent">
                  Thinks for Your Business
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl"
              >
                Centralize your entire business — inventory, sales, HR, finance, and compliance —
                into one intelligent AI-powered system, designed and priced for Indian SMBs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/#submit"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
                >
                  Get a Free Assessment <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-border/30 bg-card/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '1 System', label: 'Replaces Disconnected Tools' },
                { value: 'Real-Time', label: 'Business Visibility' },
                { value: 'GST-Ready', label: 'Compliance Built-In' },
                { value: 'Tally', label: 'Integration Available' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-primary mb-1">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-border/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl font-black mb-4">ERP Modules We Deliver</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Start with the modules you need most — add more as you grow.
                </p>
                <ul className="space-y-3">
                  {MODULES.map((m) => (
                    <li key={m} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
                  <h3 className="font-bold text-lg mb-3">Why Not SAP or Odoo?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>💸 SAP and Oracle are priced for enterprises with crore budgets</li>
                    <li>⚙️ Odoo requires significant customization and technical teams to run</li>
                    <li>📋 Both need months of configuration before going live</li>
                    <li>✅ Siddhi ERP is built around your process — not the other way around</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl border border-border/50 bg-card/50">
                  <h3 className="font-bold text-lg mb-3">Best For</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Manufacturing businesses, construction firms, retail chains, distribution companies,
                    and service businesses managing 10–500 employees across multiple locations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-border/30 bg-card/20">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
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
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/30 pt-4">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Unify Your Business?</h2>
            <p className="text-muted-foreground text-xl mb-8 max-w-xl mx-auto">
              Tell us which departments feel most disconnected today. We'll show you how ERP ties them together.
            </p>
            <Link
              to="/#submit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
            >
              Get a Free Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
