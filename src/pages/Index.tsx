import { useEffect } from 'react';
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


const Index = () => {
  const { pathname } = useLocation();

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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
          "description": "Deep-tech innovation firm transforming real-world challenges into scalable, production-ready AI solutions.",
          "brand": {
            "@type": "Brand",
            "name": "Siddhi"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          },
          "sameAs": [
            "https://www.linkedin.com/company/siddhi-dynamics-llp",
            "https://www.instagram.com/siddhidynamics/"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-6303602743",
            "contactType": "customer service"
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
              "name": "What is Siddhi?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Siddhi is a deep-tech AI innovation firm (Siddhi Dynamics) that provides professional resource hubs and automated workflow solutions."
              }
            },
            {
              "@type": "Question",
              "name": "What services does Siddhi Dynamics provide?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We provide business automation, financial reporting, digital NFC cards, and specialized toolkits for Architects, Investors, and Founders."
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
    </div>
  );
};

export default Index;
