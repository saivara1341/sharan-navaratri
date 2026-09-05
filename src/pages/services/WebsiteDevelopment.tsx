import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  'Mobile-first, responsive design for all screen sizes',
  'Google PageSpeed score 90+ out of the box',
  'SEO-optimized structure and meta tags',
  'WhatsApp Business integration',
  'Online inquiry and lead capture forms',
  'Google Maps & business location integration',
  'GST invoice and catalog pages',
  'Social media profile linking',
  'Multilingual support (Telugu, Hindi, English)',
];

const FAQS = [
  {
    q: 'How much does a business website cost in India?',
    a: 'A professional business profile website from Siddhi Dynamics is priced for Indian market budgets. Basic sites start at affordable tiers; complex e-commerce or SaaS sites are priced based on scope. Contact us for a transparent quote within 24 hours.',
  },
  {
    q: 'How long does it take to build a business website?',
    a: 'A standard business profile website typically takes 2–4 weeks from brief to launch. E-commerce or feature-rich sites take 6–10 weeks.',
  },
  {
    q: 'Will my website rank on Google?',
    a: 'Every website we build is SEO-optimized from day one — with proper meta tags, structured data, semantic HTML, fast load times, and mobile responsiveness. We also advise on content strategy.',
  },
  {
    q: 'Can you build the website in Telugu or Hindi?',
    a: 'Yes. We build fully multilingual websites supporting Telugu, Hindi, and English, with language-switching built into the interface.',
  },
  {
    q: 'Do you help with hosting and domain?',
    a: 'Yes. We guide you through domain registration, hosting setup, SSL certificates, and can manage annual renewals on your behalf.',
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Business Website Development India",
  "serviceType": "Web Development",
  "provider": { "@type": "Organization", "name": "Siddhi Dynamics LLP", "url": "https://siddhidynamics.in" },
  "areaServed": [
    { "@type": "Country", "name": "India" },
    { "@type": "City", "name": "Nizamabad" },
    { "@type": "City", "name": "Hyderabad" }
  ],
  "description": "High-performance, mobile-first business profile websites for Indian businesses. SEO-optimized, WhatsApp-integrated, and built to convert visitors into leads."
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
};

export default function WebsiteDevelopment() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Website Development &amp; Design in Nizamabad &amp; Hyderabad | Siddhi Dynamics</title>
        <meta name="description" content="Professional business profile websites for Indian businesses. Mobile-first, SEO-optimized, WhatsApp-integrated. Fast turnaround. Siddhi Dynamics, Hyderabad &amp; Nizamabad." />
        <meta name="keywords" content="website development Nizamabad, website design Hyderabad, business website India, website development company Telangana, affordable website design India, SEO website India" />
        <link rel="canonical" href="https://siddhidynamics.in/services/website-development" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siddhidynamics.in/services/website-development" />
        <meta property="og:title" content="Business Website Development in India | Siddhi Dynamics" />
        <meta property="og:description" content="Mobile-first, SEO-optimized business websites for Indian businesses. WhatsApp-integrated. Built by Siddhi Dynamics, Hyderabad &amp; Nizamabad." />
        <meta property="og:image" content="https://siddhidynamics.in/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Website Development in India | Siddhi Dynamics" />
        <meta name="twitter:description" content="Mobile-first, SEO-optimized business websites for Indian businesses. WhatsApp-integrated. Built by Siddhi Dynamics." />
        <meta name="twitter:image" content="https://siddhidynamics.in/favicon.jpg" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="pt-24">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-background to-background" />
          <div className="container mx-auto px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">Website Development</li>
              </ol>
            </nav>
            <div className="max-w-4xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black mb-6 leading-tight"
              >
                Websites That{' '}
                <span className="bg-gradient-to-r from-blue-400 to-primary bg-clip-text text-transparent">
                  Work for Your Business
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl"
              >
                High-performance, mobile-first business websites built for Indian businesses.
                Not templates — custom-designed, SEO-ready, and integrated with WhatsApp and Google from day one.
              </motion.p>
              <Link
                to="/#submit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
              >
                Get a Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-border/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-4xl font-black mb-4">Everything Included</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  Every site we deliver is production-ready — no hidden extras, no post-launch surprises.
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
                {[
                  { title: 'Business Profile Sites', desc: 'For doctors, consultants, restaurants, salons, shops — any business needing a credible online presence.', time: '2–4 weeks' },
                  { title: 'E-Commerce Stores', desc: 'Full product catalog, cart, Razorpay/UPI payments, order management.', time: '6–10 weeks' },
                  { title: 'Portfolio & Landing Pages', desc: 'Targeted single-page sites for campaigns, products, or service launches.', time: '1–2 weeks' },
                ].map(({ title, desc, time }) => (
                  <div key={title} className="p-6 rounded-2xl border border-border/50 bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-foreground">{title}</h3>
                      <span className="text-xs text-primary font-medium">{time}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
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
            <h2 className="text-4xl font-black mb-4">Ready to Go Online the Right Way?</h2>
            <p className="text-muted-foreground text-xl mb-8 max-w-xl mx-auto">Share your business details and we'll design a site that represents you perfectly.</p>
            <Link to="/#submit" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
