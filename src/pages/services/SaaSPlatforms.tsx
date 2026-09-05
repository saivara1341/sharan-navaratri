import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  'Multi-tenant architecture from day one',
  'Role-based access control (RBAC)',
  'Razorpay / UPI payment gateway integration',
  'GST invoice generation built-in',
  'Real-time dashboards and analytics',
  'Email & WhatsApp notification engine',
  'Mobile apps (iOS/Android) on premium plans',
  'API-first design for future integrations',
  'SOC2-aligned data security practices',
];

const FAQS = [
  {
    q: 'What is a custom SaaS platform?',
    a: 'A custom SaaS (Software-as-a-Service) platform is cloud-hosted software built specifically for your business, accessible from any device. Unlike off-the-shelf tools, it\'s designed exactly around your workflows, pricing model, and customer base.',
  },
  {
    q: 'How is a custom SaaS different from buying existing software?',
    a: 'Existing software forces you to adapt your business to fit their workflows. A custom SaaS is built to fit your exact process, can be monetized as a product, and gives you 100% control over features, data, and pricing.',
  },
  {
    q: 'How much does custom SaaS development cost in India?',
    a: 'Custom SaaS development is priced based on feature scope. Siddhi Dynamics builds for Indian market budgets — significantly more affordable than Western agencies while delivering the same engineering quality. Contact us for a scoped estimate.',
  },
  {
    q: 'How long does SaaS development take?',
    a: 'An MVP (minimum viable product) with core features typically takes 8–16 weeks. Full-featured platforms take 4–9 months depending on complexity.',
  },
  {
    q: 'Can you build a SaaS for my specific industry?',
    a: 'Yes. We have built SaaS platforms for construction (ArchPlan AI), career development (Nexus Careers), property management (Nilayam), and print services. We approach each new vertical with domain research before writing a single line of code.',
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom SaaS Platform Development India",
  "serviceType": "SaaS Development",
  "provider": { "@type": "Organization", "name": "Siddhi Dynamics LLP", "url": "https://siddhidynamics.in" },
  "areaServed": [
    { "@type": "Country", "name": "India" },
    { "@type": "City", "name": "Nizamabad" },
    { "@type": "City", "name": "Hyderabad" }
  ],
  "description": "Custom cloud-based SaaS platform development for Indian businesses and startups. Multi-tenant, API-first, with Razorpay payments and GST compliance built-in."
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
};

export default function SaaSPlatforms() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Custom SaaS Platform Development in Nizamabad &amp; Hyderabad | Siddhi Dynamics</title>
        <meta name="description" content="Custom SaaS platform development for Indian businesses and startups. Multi-tenant, Razorpay-integrated, GST-compliant. Built by Siddhi Dynamics, Hyderabad &amp; Nizamabad." />
        <meta name="keywords" content="custom SaaS development India, SaaS platform India, cloud software development India, SaaS startup India, SaaS for Indian businesses, software as a service Hyderabad, software as a service Nizamabad, SaaS developer Nizamabad" />
        <link rel="canonical" href="https://siddhidynamics.in/services/saas" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siddhidynamics.in/services/saas" />
        <meta property="og:title" content="Custom SaaS Platform Development India | Siddhi Dynamics" />
        <meta property="og:description" content="Custom SaaS platforms for Indian businesses — multi-tenant, Razorpay-integrated, GST-compliant. Built by Siddhi Dynamics, Hyderabad." />
        <meta property="og:image" content="https://siddhidynamics.in/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom SaaS Platform Development India | Siddhi Dynamics" />
        <meta name="twitter:description" content="Custom SaaS platforms for Indian startups and businesses. Built by Siddhi Dynamics, Hyderabad." />
        <meta name="twitter:image" content="https://siddhidynamics.in/favicon.jpg" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="pt-24">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-background" />
          <div className="container mx-auto px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">SaaS Platforms</li>
              </ol>
            </nav>
            <div className="max-w-4xl">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mb-6"
              >
                Premium Service
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-6 leading-tight"
              >
                Custom SaaS{' '}
                <span className="bg-gradient-to-r from-accent to-lime-400 bg-clip-text text-transparent">
                  Built for India
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl"
              >
                We design and build cloud-based SaaS platforms from scratch — multi-tenant, scalable,
                with Razorpay payments and GST compliance built in. Turn your business idea into a product.
              </motion.p>
              <Link
                to="/#submit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
              >
                Discuss Your Idea <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl font-black mb-4">What We Build Into Every Platform</h2>
                <ul className="space-y-3 mt-8">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl border border-accent/20 bg-accent/5">
                  <h3 className="font-bold text-lg mb-2">Our Live SaaS Products</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'ArchPlan AI', desc: 'AI construction planning SaaS — live across India' },
                      { name: 'Nexus Careers', desc: 'Student-to-employment AI platform — in beta' },
                      { name: 'Nilayam', desc: 'Property management SaaS — in alpha' },
                    ].map(({ name, desc }) => (
                      <div key={name} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-foreground">{name}</span>
                          <span className="text-muted-foreground text-sm"> — {desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/30 bg-card/20">
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
            <h2 className="text-4xl font-black mb-4">Have a SaaS Idea?</h2>
            <p className="text-muted-foreground text-xl mb-8 max-w-xl mx-auto">Let's scope it together. We'll tell you what's feasible, how long it takes, and what it costs — in one call.</p>
            <Link to="/#submit" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform">
              Book a Discovery Call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
