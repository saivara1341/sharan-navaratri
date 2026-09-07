import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Rocket, Award, Brain, Zap, Globe, Heart, Mail, Phone } from 'lucide-react';
import founderSai from '@/assets/founder-sarugu-sai-vara-prasad.jpeg';
import cofounderDevi from '@/assets/cofounder-sarugu-devi-vara-prasad.jpeg';

const MILESTONES = [
  { year: '2024', event: 'Siddhi Dynamics LLP founded in Hyderabad, India' },
  { year: '2024', event: 'ArchPlan AI accepted into HIVE — Anurag University Incubation Cell' },
  { year: '2024', event: 'Launched ArchPlan AI, India\'s first AI-driven construction lifecycle platform' },
  { year: '2024', event: 'Nexus Careers platform enters beta — empowering student-to-employment transitions' },
  { year: '2025', event: 'Expanded service portfolio: Business Automation, SaaS, ERP for Indian SMBs' },
  { year: '2025', event: 'Live client deployments across Hyderabad-based businesses' },
  { year: '2026', event: 'Scaling across South India — helping 50+ businesses automate workflows' },
];

const VALUES = [
  {
    icon: Brain,
    title: 'Deep Intelligence',
    desc: 'We don\'t build chatbots. We build agentic systems that reason, plan, and act — solving problems that previously required entire teams.',
  },
  {
    icon: Zap,
    title: 'Production-First',
    desc: 'Every solution we ship is production-ready from day one. No MVP theatre — real systems for real businesses.',
  },
  {
    icon: Globe,
    title: 'India-Centric Design',
    desc: 'Built for Indian businesses, Indian compliance norms, Indian infrastructure costs, and the Indian pace of digital adoption.',
  },
  {
    icon: Heart,
    title: 'Long-Term Partnership',
    desc: 'We work as embedded tech partners, not vendors. Your growth is our roadmap.',
  },
];

const FOUNDERS = [
  {
    name: 'Sarugu Sai Vara Prasad',
    role: 'Founder & Designated Partner',
    email: 'saivaraprasad@siddhidynamics.in',
    phone: '+91 6303602743',
    phoneHref: '+916303602743',
    image: founderSai,
    imagePosition: 'object-top',
  },
  {
    name: 'Sarugu Devi Vara Prasad',
    role: 'Co-Founder & Designated Partner',
    email: 'sarugudevivaraprasad@gmail.com',
    phone: '+91 6309891760',
    phoneHref: '+916309891760',
    image: cofounderDevi,
    imagePosition: 'object-center',
  },
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Siddhi Dynamics LLP",
  "alternateName": ["Siddhi Dynamics", "Siddhi AI"],
  "url": "https://siddhidynamics.in",
  "logo": "https://siddhidynamics.in/favicon.jpg",
  "foundingDate": "2024",
  "foundingLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    }
  },
  "description": "Siddhi Dynamics LLP is a deep-tech AI innovation firm specializing in agentic AI, generative AI, business automation, SaaS, and ERP solutions for Indian businesses.",
  "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 5, "maxValue": 20 },
  "founder": [
    {
      "@type": "Person",
      "name": "Sarugu Sai Vara Prasad",
      "jobTitle": "Founder & Designated Partner",
      "email": "saivaraprasad@siddhidynamics.in",
      "telephone": "+91-6303602743"
    },
    {
      "@type": "Person",
      "name": "Sarugu Devi Vara Prasad",
      "jobTitle": "Co-Founder & Designated Partner",
      "email": "sarugudevivaraprasad@gmail.com",
      "telephone": "+91-6309891760"
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/siddhi-dynamics-llp",
    "https://www.instagram.com/siddhidynamics/"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-6303602743",
    "email": "saivaraprasad@siddhidynamics.in",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["English", "Telugu", "Hindi"]
  }
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Siddhi Dynamics — Deep-Tech AI Firm, Hyderabad & Nizamabad India",
  "url": "https://siddhidynamics.in/about",
  "description": "Learn about Siddhi Dynamics LLP — headquartered in Hyderabad & Nizamabad and building AI automation, SaaS, and ERP solutions for Indian businesses.",
  "mainEntity": { "@type": "Organization", "name": "Siddhi Dynamics LLP" }
};

const nizamabadSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Siddhi Dynamics LLP — Software Company in Nizamabad",
  "alternateName": "Siddhi Dynamics Nizamabad Office",
  "description": "Siddhi Dynamics LLP is a top-rated software company in Nizamabad, Telangana, offering custom software, web development, Agentic AI automation, custom SaaS platforms, and AI-powered ERP solutions.",
  "url": "https://siddhidynamics.in",
  "logo": "https://siddhidynamics.in/favicon.jpg",
  "image": "https://siddhidynamics.in/favicon.jpg",
  "telephone": "+91-6303602743",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3-5-260/2, Shivajinagar Road, Kotagally",
    "addressLocality": "Nizamabad",
    "addressRegion": "Telangana",
    "postalCode": "503001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "18.6725",
    "longitude": "78.0984"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "parentOrganization": {
    "@type": "Organization",
    "name": "Siddhi Dynamics LLP",
    "url": "https://siddhidynamics.in",
    "logo": "https://siddhidynamics.in/favicon.jpg"
  },
  "sameAs": [
    "https://www.linkedin.com/company/siddhi-dynamics-llp",
    "https://www.instagram.com/siddhidynamics/"
  ]
};

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>About Siddhi Dynamics | Best Software Company in Nizamabad &amp; Hyderabad</title>
        <meta name="description" content="Siddhi Dynamics LLP is a premier software company and deep-tech AI firm in Nizamabad &amp; Hyderabad. We build agentic AI, business automation, web development, SaaS, and ERP solutions." />
        <meta name="keywords" content="Siddhi Dynamics, best software company in Nizamabad, top IT company in Nizamabad, software development Nizamabad, AI company Hyderabad, deep tech startup India, ArchPlan AI, HIVE incubation" />
        <link rel="canonical" href="https://siddhidynamics.in/about" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siddhidynamics.in/about" />
        <meta property="og:title" content="About Siddhi Dynamics | Best Software Company in Nizamabad &amp; Hyderabad" />
        <meta property="og:description" content="Nizamabad &amp; Hyderabad-based deep-tech AI firm building production-ready AI automation, SaaS, and ERP solutions." />
        <meta property="og:image" content="https://siddhidynamics.in/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Siddhi Dynamics | Software Company Nizamabad &amp; Hyderabad" />
        <meta name="twitter:description" content="Deep-tech AI firm in Nizamabad &amp; Hyderabad building AI automation, SaaS, ERP &amp; web solutions for Indian businesses." />
        <meta name="twitter:image" content="https://siddhidynamics.in/favicon.jpg" />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(aboutPageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(nizamabadSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="py-10 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-5 sm:mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">About</li>
              </ol>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <span className="inline-block text-primary text-sm font-bold tracking-widest uppercase mb-4">
                Our Story
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                We Turn Complex Problems Into{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Intelligent Systems
                </span>
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                Siddhi Dynamics is a deep-tech AI innovation firm based in Hyderabad, India.
                We build agentic AI, generative AI, and automation systems that transform how
                Indian businesses operate. Our construction platform, ArchPlan AI, was incubated
                at <strong className="text-foreground"> HIVE — Anurag University's Incubation Cell</strong>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-10 sm:py-20 border-t border-border/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">
                  The Origin
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 sm:mb-6 leading-tight">
                  Built From a Simple Observation
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
                  <p>
                    India's businesses — from family-run enterprises to fast-growing startups —
                    are drowning in manual work. Invoices typed by hand. Bookkeeping done in
                    spreadsheets. Hiring managed over WhatsApp. Construction planned on paper.
                  </p>
                  <p>
                    The technology to fix all of this exists. It just wasn't being built for
                    <strong className="text-foreground"> Indian contexts, Indian prices, and Indian realities</strong>.
                    That's the gap Siddhi Dynamics was created to close.
                  </p>
                  <p>
                    Founded in Hyderabad, we combine focused research with production-grade
                    engineering to deliver AI systems that actually work. ArchPlan AI, our
                    construction platform, was incubated at <strong className="text-foreground">HIVE,
                    Anurag University's innovation cell</strong>.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                {[
                  { icon: Building2, label: 'ArchPlan AI incubated at', value: 'HIVE — Anurag University' },
                  { icon: Globe, label: 'Headquartered in', value: 'Hyderabad & Nizamabad, Telangana, India' },
                  { icon: Rocket, label: 'Founded', value: '2024' },
                  { icon: Users, label: 'Focus Area', value: 'Indian SMBs & Deep-Tech AI' },
                  { icon: Award, label: 'Core Expertise', value: 'Agentic AI, GenAI, Automation, SaaS, ERP' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/50">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                      <div className="font-semibold text-foreground">{value}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="py-10 sm:py-20 border-t border-border/30 bg-card/20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="text-primary text-sm font-bold tracking-widest uppercase mb-4 block">
                Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Meet Our Founders</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The people building Siddhi Dynamics and shaping its long-term vision.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {FOUNDERS.map((founder, index) => (
                <motion.article
                  key={founder.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.12 }}
                  className="group overflow-hidden rounded-3xl border border-border/50 bg-card shadow-[0_18px_60px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_75px_rgba(15,23,42,0.13)]"
                >
                  <div className="relative aspect-[4/4.25] overflow-hidden bg-muted">
                    <img
                      src={founder.image}
                      alt={`${founder.name}, ${founder.role} at Siddhi Dynamics`}
                      className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${founder.imagePosition}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" />
                  </div>

                  <div className="p-6 sm:p-8">
                    <h3 className="text-2xl font-black tracking-tight text-foreground mb-1">{founder.name}</h3>
                    <p className="text-primary font-semibold mb-6">{founder.role}</p>

                    <div className="space-y-3">
                      <a
                        href={`mailto:${founder.email}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary break-all"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Mail className="h-4 w-4 text-primary" />
                        </span>
                        {founder.email}
                      </a>
                      <a
                        href={`tel:${founder.phoneHref}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <Phone className="h-4 w-4 text-primary" />
                        </span>
                        {founder.phone}
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-20 border-t border-border/30 bg-card/20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">What We Build</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We don't just consult — we design, build, and deploy.
                Every product leaves our lab production-ready.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Business Automation', desc: 'End-to-end workflow automation — invoicing, bookkeeping, tax, reporting.', href: '/services/business-automation', tag: 'Most Popular' },
                { name: 'SaaS Platforms', desc: 'Custom cloud software built for Indian market needs and scale.', href: '/services/saas', tag: 'Premium' },
                { name: 'ERP Solutions', desc: 'Intelligent enterprise resource planning for growing businesses.', href: '/services/erp', tag: '' },
                { name: 'Website Development', desc: 'High-performance, SEO-optimized business websites that convert.', href: '/services/website-development', tag: '' },
                { name: 'ArchPlan AI', desc: 'AI-driven construction planning, BOQ generation, and project management.', href: '/project/archplan', tag: 'Live' },
                { name: 'Nexus Careers', desc: 'AI platform helping students build careers — resume to offer letter.', href: '/project/nexus', tag: 'Beta' },
              ].map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-foreground">{item.name}</h3>
                    {item.tag && (
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 border-t border-border/30">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">How We Think</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our principles shape everything — from how we write code to how we talk to clients.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VALUES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 p-8 rounded-2xl border border-border/50 bg-card/50"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 border-t border-border/30 bg-card/20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-black mb-4">Our Journey</h2>
            </motion.div>
            <div className="max-w-2xl mx-auto">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-bold">{m.year.slice(2)}</span>
                    </div>
                    {i < MILESTONES.length - 1 && <div className="w-0.5 h-full bg-border/50 mt-2" />}
                  </div>
                  <div className="pb-8">
                    <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{m.year}</div>
                    <p className="text-foreground font-medium leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border/30">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Ready to Automate Your Business?
              </h2>
              <p className="text-muted-foreground text-xl mb-8 max-w-xl mx-auto">
                Tell us your biggest operational headache. We'll show you exactly how AI can solve it.
              </p>
              <Link
                to="/#submit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
              >
                Start a Conversation <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
