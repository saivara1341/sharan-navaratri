import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Building2,
  Clock3,
  Code2,
  Globe2,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Search,
  Smartphone,
  Workflow,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';

const address = '3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001';
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Siddhi Dynamics LLP, ${address}`)}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`Siddhi Dynamics LLP, ${address}`)}&output=embed`;

const services = [
  {
    name: 'Custom Software Development',
    description: 'Production-ready web applications and internal tools designed around your business workflows.',
    href: '/services/business-automation',
    icon: Code2,
  },
  {
    name: 'Websites & Web Applications',
    description: 'Fast, mobile-first websites and full-stack web applications built for performance, trust, and conversion.',
    href: '/services/website-development',
    icon: Globe2,
  },
  {
    name: 'Mobile App Development',
    description: 'Customer and business applications for Android, iOS, and cross-platform delivery with scalable backends.',
    href: '/about',
    icon: Smartphone,
  },
  {
    name: 'SaaS Platform Development',
    description: 'Secure, scalable SaaS products from product planning through launch and ongoing improvement.',
    href: '/services/saas',
    icon: Lightbulb,
  },
  {
    name: 'ERP & Business Automation',
    description: 'Connected systems that streamline operations, reporting, approvals, and repetitive work.',
    href: '/services/erp',
    icon: Workflow,
  },
  {
    name: 'AI Agents & Intelligent Systems',
    description: 'Production-ready AI agents, workflow copilots, data intelligence, and integrations built around real operations.',
    href: '/services/business-automation',
    icon: Bot,
  },
  {
    name: 'SEO, AEO & GEO',
    description: 'Search visibility for Google, answer engines, and generative AI platforms through technical SEO, structured data, and authoritative content.',
    href: '/services/website-development',
    icon: Search,
  },
  {
    name: 'IT Consulting & Product Strategy',
    description: 'Architecture, technology selection, product roadmaps, modernization planning, and embedded technical guidance.',
    href: '/about',
    icon: Building2,
  },
];

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': 'https://siddhidynamics.in/software-company-nizamabad#business',
  name: 'Siddhi Dynamics LLP',
  url: 'https://siddhidynamics.in/software-company-nizamabad',
  logo: 'https://siddhidynamics.in/favicon.jpg',
  image: 'https://siddhidynamics.in/favicon.jpg',
  description:
    'Siddhi Dynamics LLP is a software development company based in Telangana and serving clients across India with custom software, websites, SaaS platforms, ERP solutions, AI automation, and IT consulting.',
  telephone: '+91-6303602743',
  email: 'saivaraprasad@siddhidynamics.in',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3-5-260/2, Shivajinagar Road, Kotagally',
    addressLocality: 'Nizamabad',
    addressRegion: 'Telangana',
    postalCode: '503001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 18.6725,
    longitude: 78.0984,
  },
  areaServed: [
    { '@type': 'City', name: 'Nizamabad' },
    { '@type': 'State', name: 'Telangana' },
    { '@type': 'Country', name: 'India' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Software and IT services',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        url: `https://siddhidynamics.in${service.href}`,
      },
    })),
  },
  sameAs: [
    'https://www.linkedin.com/company/siddhi-dynamics-llp',
    'https://www.instagram.com/siddhidynamics/',
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://siddhidynamics.in/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Software Company in Nizamabad',
      item: 'https://siddhidynamics.in/software-company-nizamabad',
    },
  ],
};

export default function SoftwareCompanyNizamabad() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Software Development Company in India | Siddhi Dynamics LLP</title>
        <meta
          name="description"
          content="Siddhi Dynamics LLP is a Telangana-based software development company serving businesses across India with custom software, websites, SaaS, ERP, AI automation, and IT consulting."
        />
        <link rel="canonical" href="https://siddhidynamics.in/software-company-nizamabad" />
        <meta property="og:title" content="Software Development Company in India | Siddhi Dynamics LLP" />
        <meta
          property="og:description"
          content="Custom software development, websites, SaaS, ERP, and AI automation for businesses across Telangana and India."
        />
        <meta property="og:url" content="https://siddhidynamics.in/software-company-nizamabad" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="pt-24">
        <section className="relative overflow-hidden border-b border-border/60 py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative z-10 mx-auto px-6">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-foreground">Software Development</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl"
            >
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">
                From Telangana · Serving all of India
              </p>
              <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
                Building intelligent software for{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  businesses across India
                </span>
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                We help startups, institutions, and growing businesses turn operational problems into
                reliable software—covering web development, SaaS products, ERP systems, AI automation,
                and long-term technology consulting. Our team operates from Nizamabad and Hyderabad,
                with remote delivery available throughout India.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="tel:+916303602743"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
                >
                  <Phone className="h-4 w-4" /> Call +91 63036 02743
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 font-semibold hover:border-primary/50"
                >
                  <MapPin className="h-4 w-4" /> Get directions
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">What we build</p>
              <h2 className="mb-4 text-3xl font-black md:text-5xl">Software and IT services for Indian businesses</h2>
              <p className="text-lg text-muted-foreground">
                Choose a focused engagement or combine services into an end-to-end product build.
              </p>
            </div>
            <div className="relative space-y-6 pb-8 md:grid md:grid-cols-2 md:gap-5 md:space-y-0 md:pb-0">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  style={{
                    top: `calc(6.5rem + ${index * 0.45}rem)`,
                    zIndex: index + 1,
                  }}
                  className="sticky overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl transition hover:border-primary/30 md:!static md:!top-auto md:!z-auto md:bg-card/50 md:shadow-none md:hover:-translate-y-1 md:hover:shadow-lg"
                >
                  <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                  <Link to={service.href} className="group block min-h-[230px] p-8 md:min-h-0">
                    <service.icon className="mb-5 h-8 w-8 text-primary" aria-hidden="true" />
                    <h3 className="mb-3 text-2xl font-black transition group-hover:text-primary">{service.name}</h3>
                    <p className="mb-6 leading-relaxed text-muted-foreground">{service.description}</p>
                    <span className="inline-flex items-center gap-2 font-semibold text-primary">
                      Explore service <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/20 py-20">
          <div className="container mx-auto px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">Where we work</p>
              <h2 className="mb-4 text-3xl font-black md:text-5xl">Local presence. Nationwide delivery.</h2>
              <p className="text-lg text-muted-foreground">
                Work with us in person from Telangana or remotely from anywhere in India.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { icon: MapPin, title: 'Nizamabad', text: 'Our registered local office and primary Google Business location.' },
                { icon: Building2, title: 'Telangana', text: 'Serving Hyderabad and businesses across every district in Telangana.' },
                { icon: Globe2, title: 'Pan-India', text: 'Remote discovery, development, deployment, and support across India.' },
              ].map((region, index) => (
                <motion.article
                  key={region.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl border border-border/50 bg-card/50 p-8 text-center"
                >
                  <region.icon className="mx-auto mb-5 h-8 w-8 text-primary" />
                  <h3 className="mb-3 text-2xl font-black">{region.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{region.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto grid gap-8 px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">Our local office</p>
              <h2 className="mb-8 text-3xl font-black">Siddhi Dynamics LLP, Nizamabad</h2>
              <address className="space-y-5 not-italic text-muted-foreground">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{address}, India</span>
                </p>
                <p>
                  <a href="tel:+916303602743" className="flex items-center gap-3 hover:text-primary">
                    <Phone className="h-5 w-5 text-primary" /> +91 63036 02743
                  </a>
                </p>
                <p>
                  <a href="mailto:saivaraprasad@siddhidynamics.in" className="flex items-center gap-3 hover:text-primary">
                    <Mail className="h-5 w-5 text-primary" /> saivaraprasad@siddhidynamics.in
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-primary" /> Open 24 hours, 7 days a week
                </p>
              </address>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <iframe
                title="Siddhi Dynamics LLP office location in Nizamabad"
                src={mapEmbedUrl}
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-4 text-3xl font-black md:text-5xl">Planning a software project anywhere in India?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Tell us what your team needs to improve. We’ll help define a practical path from idea to production.
            </p>
            <a
              href="mailto:saivaraprasad@siddhidynamics.in?subject=Software%20project%20enquiry"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Discuss your project <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
