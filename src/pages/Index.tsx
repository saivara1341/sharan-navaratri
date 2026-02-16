import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { VisionSection } from '@/components/sections/VisionSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { IncubationSection } from '@/components/sections/IncubationSection';
import { SubmitSection } from '@/components/sections/SubmitSection';
import { FooterSection } from '@/components/sections/FooterSection';

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
      let lastScrollPos = window.scrollY;

      const startAutoscroll = () => {
        if (autoscrollActive) return;
        autoscrollActive = true;

        const scrollAmount = 1; // Pixels per frame
        const performScroll = () => {
          if (!autoscrollActive) return;

          window.scrollBy(0, scrollAmount);

          // Stop if reached bottom
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
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
        scrollTimer = setTimeout(startAutoscroll, 15000); // 15 seconds idle
      };

      const handleUserInteraction = () => {
        // Only reset if significant movement or direct interaction
        resetTimer();
      };

      window.addEventListener('scroll', handleUserInteraction);
      window.addEventListener('mousemove', handleUserInteraction);
      window.addEventListener('keydown', handleUserInteraction);
      window.addEventListener('mousedown', handleUserInteraction);
      window.addEventListener('touchstart', handleUserInteraction);

      resetTimer();

      return () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        autoscrollActive = false;
        window.removeEventListener('scroll', handleUserInteraction);
        window.removeEventListener('mousemove', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('mousedown', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
      };
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <VisionSection />
        <ProjectsSection />
        <IncubationSection />
        <SubmitSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
