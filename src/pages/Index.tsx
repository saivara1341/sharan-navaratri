import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { VisionSection } from '@/components/sections/VisionSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { IncubationSection } from '@/components/sections/IncubationSection';
import { SubmitSection } from '@/components/sections/SubmitSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { AIOContent } from '@/components/seo/AIOContent';
import { LiquidMetalUpButton } from "@/components/ui/LiquidMetalUpButton";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll to top by default
    if (pathname === '/') {
      window.scrollTo(0, 0);
    } else {
      // Scroll to specific section if path matches
      const sectionId = pathname.replace('/', '');
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Navbar height offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    // Autoscroll logic for landing page
    if (pathname === '/') {
      let scrollTimer: NodeJS.Timeout;
      let autoscrollActive = false;

      const startAutoscroll = () => {
        if (autoscrollActive) return;
        autoscrollActive = true;

        const scrollAmount = 1; // Pixels per frame
        const performScroll = () => {
          if (!autoscrollActive) return;

          window.scrollBy(0, scrollAmount);

          // Stop if reached bottom
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
            autoscrollActive = false;
            return;
          }

          requestAnimationFrame(performScroll);
        };

        performScroll();
      };

      const resetTimer = () => {
        autoscrollActive = false;
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(startAutoscroll, 10000); // 10 seconds idle
      };

      const handleUserInteraction = () => {
        resetTimer();
      };

      // Use 'wheel' instead of 'scroll' to detect purposeful user scrolling
      window.addEventListener('wheel', handleUserInteraction, { passive: true });
      window.addEventListener('mousemove', handleUserInteraction, { passive: true });
      window.addEventListener('keydown', handleUserInteraction, { passive: true });
      window.addEventListener('mousedown', handleUserInteraction, { passive: true });
      window.addEventListener('touchstart', handleUserInteraction, { passive: true });

      resetTimer();

      return () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        autoscrollActive = false;
        window.removeEventListener('wheel', handleUserInteraction);
        window.removeEventListener('mousemove', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('mousedown', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [pathname]);
  const getPageMeta = () => {
    switch (pathname) {
      case '/vision':
        return {
          title: "Siddhi Vision | AI-Driven Digital Transformation",
          description: "Explore our vision of transforming world-class manual processes into intelligent digital workflows using Agentic AI."
        };
      case '/projects':
        return {
          title: "Siddhi Projects | Deep-Tech AI Portfolio",
          description: "Discover our portfolio of deep-tech AI projects, from talent pipelines to automated construction planning."
        };
      case '/submit':
        return {
          title: "Siddhi Collaboration | Discuss Your AI Project",
          description: "Connect with our innovation team to discuss your business challenges and explore AI-driven automation."
        };
      default:
        return {
          title: "Siddhi | Deep-Tech AI Innovation & Agentic Systems",
          description: "Siddhi (Siddhi Dynamics) is a premier deep-tech firm in India. We transform complex challenges into scalable AI solutions. Experts in Agentic Intelligence, GenAI, and Professional Resource Hubs."
        };
    }
  };

  const { title, description } = getPageMeta();
  const keywords = "Siddhi, Siddhi Dynamics, Deep-Tech AI, GenAI, Agentic AI, Business Automation, Startup Sahayak, AI Architecture, India AI Startup, Siddhi AI";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siddhidynamics.in/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://siddhidynamics.in/favicon.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://siddhidynamics.in/" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="https://siddhidynamics.in/favicon.jpg" />

        <link rel="canonical" href={`https://siddhidynamics.in/#${pathname}`} />
      </Helmet>
      <Navbar />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Siddhi Dynamics",
          "alternateName": ["Siddhi", "Siddhi AI", "Siddhi Dynamics LLP"],
          "url": "https://siddhidynamics.in/",
          "logo": "https://siddhidynamics.in/favicon.jpg",
          "description": "Siddhi Dynamics LLP is a deep-tech AI innovation firm based in Hyderabad, India, incubated at HIVE, Anurag University. We specialize in agentic AI, business automation, SaaS, and ERP for Indian businesses.",
          "foundingDate": "2024",
          "brand": {
            "@type": "Brand",
            "name": "Siddhi"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Hyderabad",
            "addressRegion": "Telangana",
            "addressCountry": "IN"
          },
          "memberOf": {
            "@type": "Organization",
            "name": "HIVE — Anurag University Innovation and Incubation Cell"
          },
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
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Siddhi Dynamics Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Business Automation", "url": "https://siddhidynamics.in/services/business-automation" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SaaS Platform Development", "url": "https://siddhidynamics.in/services/saas" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ERP Solutions", "url": "https://siddhidynamics.in/services/erp" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development", "url": "https://siddhidynamics.in/services/website-development" } }
            ]
          }
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Siddhi Dynamics LLP — Software Company in Nizamabad",
          "alternateName": "Siddhi Dynamics Nizamabad Office",
          "description": "Siddhi Dynamics LLP is a top-rated software company in Nizamabad, Telangana, offering custom software, web development, Agentic AI automation, custom SaaS platforms, and AI-powered ERP solutions.",
          "url": "https://siddhidynamics.in/",
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
              "Saturday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          },
          "parentOrganization": {
            "@type": "Organization",
            "name": "Siddhi Dynamics LLP",
            "url": "https://siddhidynamics.in/",
            "logo": "https://siddhidynamics.in/favicon.jpg"
          },
          "sameAs": [
            "https://www.linkedin.com/company/siddhi-dynamics-llp",
            "https://www.instagram.com/siddhidynamics/"
          ]
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Siddhi Dynamics — AI & Business Automation for India",
          "url": "https://siddhidynamics.in/",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2", ".hero-description", "#ai-indexing-core"]
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://siddhidynamics.in/" }]
          }
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Siddhi Dynamics?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Siddhi Dynamics LLP is a deep-tech AI innovation firm based in Hyderabad, India. Founded in 2024 and incubated at HIVE (Anurag University), we build agentic AI systems, business automation, SaaS platforms, and ERP solutions for Indian businesses."
              }
            },
            {
              "@type": "Question",
              "name": "What services does Siddhi Dynamics provide?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Siddhi Dynamics provides: (1) Business Automation — AI invoice processing, bookkeeping, GST compliance, workflow digitization; (2) SaaS Platform Development — custom cloud software for Indian startups; (3) ERP Solutions — AI-powered enterprise resource planning for SMBs; (4) Website Development — mobile-first, SEO-optimized business websites; (5) Digital Workflow Solutions — replacing large manual processes with intelligent digital workflows."
              }
            },
            {
              "@type": "Question",
              "name": "Which companies does Siddhi Dynamics serve?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Siddhi Dynamics primarily serves Indian small and medium businesses (SMBs) — including businesses in construction, retail, manufacturing, professional services, and property management. We also work with startups building SaaS products for Indian markets."
              }
            },
            {
              "@type": "Question",
              "name": "Is Siddhi Dynamics an AI agentic automation company in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Siddhi Dynamics is one of India's emerging agentic AI automation companies, specifically focused on the SMB market. We build agentic systems that autonomously handle business workflows — without constant human supervision. This includes automated invoice processing, compliance monitoring, financial reporting, and supply chain management."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between Siddhi and large AI companies like iOPEX or IBM India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Large AI companies like iOPEX, Prodapt, IBM India, and Concentrix serve enterprise clients with large budgets and complex IT ecosystems. Siddhi Dynamics is specifically designed for India's 80 million SMBs — businesses that need the same AI power but at Indian market pricing, with faster deployment and more direct service."
              }
            },
            {
              "@type": "Question",
              "name": "Where is Siddhi Dynamics located?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Siddhi Dynamics is headquartered in Hyderabad & Nizamabad, Telangana, India. The company is incubated at HIVE — the Innovation and Incubation Cell of Anurag University, Hyderabad."
              }
            },
            {
              "@type": "Question",
              "name": "What products has Siddhi Dynamics built?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Siddhi Dynamics has built: ArchPlan AI (AI-driven construction planning platform), Nexus Careers (AI student-to-employment platform), Nilayam (AI property management SaaS), Indhur Farms (organic farm-to-home marketplace), Print Flow (print workflow automation), Wish-0 (AI occasion automation), and Letusknow (digital governance platform)."
              }
            },
            {
              "@type": "Question",
              "name": "How can I contact Siddhi Dynamics or start a project?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can reach Siddhi Dynamics at saivaraprasad@siddhidynamics.in or by phone at +91-6303602743. Use the contact form on siddhidynamics.in to submit your project requirement or business challenge."
              }
            }
          ]
        })}
      </script>
      <main>
        <HeroSection />
        <VisionSection />
        <ProjectsSection />
        <IncubationSection />
        <ServicesSection />
        <SubmitSection />
        <AIOContent />
      </main>
      <FooterSection />
      <FloatingNav />

      <AnimatePresence>
        {showScrollTop && (
          <LiquidMetalUpButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
