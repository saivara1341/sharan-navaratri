import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, Star } from 'lucide-react';
import siddhiLogo from '@/assets/siddhi-logo.png';
import { GoogleReviewNotificationBanner } from '@/components/GoogleReviewNotificationBanner';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

const nizamabadAddress = '3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India';
const nizamabadMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Siddhi Dynamics LLP, ${nizamabadAddress}`)}`;
const hyderabadAddress = 'HIVE, Anurag University, Hyderabad, Telangana 500049, India';
const hyderabadMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hyderabadAddress)}`;

const linkVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export const FooterSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === '/' || href === '#/') {
      if (window.location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (href.startsWith('/#')) {
      const anchorId = href.replace('/#', '');
      if (window.location.pathname === '/') {
        const el = document.getElementById(anchorId);
        if (el) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const offsetPosition = Math.max(0, elementRect - bodyRect - offset);
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          return;
        }
      }
      navigate(href);
      return;
    }

    // If already on homepage and clicking Submit Problem, smooth scroll to #submit section
    if (href.startsWith('/submit') && window.location.pathname === '/') {
      const el = document.getElementById('submit');
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const offsetPosition = Math.max(0, elementRect - bodyRect - offset);
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return;
      }
    }

    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={ref} className="py-20 border-t border-white/10 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent" />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <GoogleReviewNotificationBanner />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Desktop Line 1: Logo + Siddhi Dynamics LLP on left, Nav links on right */}
          {/* Desktop Line 2: Next-Generation AI Solutions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-start text-left w-full md:w-auto">
              <motion.a
                href="/"
                onClick={handleHomeClick}
                initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={isMobile ? { duration: 0 } : { duration: 0.8 }}
                className="flex items-center gap-3.5 group cursor-pointer relative z-10"
              >
                <motion.div
                  className="relative w-12 h-12 shrink-0"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
                  <img
                    src={siddhiLogo}
                    alt="Siddhi Dynamics"
                    width="48"
                    height="48"
                    loading="lazy"
                    decoding="async"
                    className="relative w-full h-full object-contain"
                  />
                </motion.div>
                <span className="font-extrabold text-xl md:text-2xl text-white tracking-wide whitespace-nowrap">
                  Siddhi Dynamics LLP
                </span>
              </motion.a>

              {/* Line 2: Next-Generation AI Solutions */}
              <span className="text-xs md:text-sm text-primary font-semibold tracking-wider mt-1 ml-[60px] block">
                {t('hero.badge', 'Next-Generation AI Solutions')}
              </span>
            </div>

            {/* Nav Links in Line 1 (Right Side) */}
            <motion.nav
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2.5 md:gap-x-6"
            >
              {[
                { name: t('nav.home', 'Home'), href: '/' },
                { name: t('nav.about', 'About'), href: '/about' },
                { name: t('nav.vision', 'Vision'), href: '/#vision' },
                { name: t('nav.projects', 'Projects'), href: '/#projects' },
                { name: t('nav.blog', 'Blog'), href: '/blog' },
                { name: t('nav.services', 'Services'), href: '/#services' },
                { name: t('nav.careers', 'Careers'), href: '/careers' },
                { name: t('nav.submit', 'Submit Problem'), href: '/submit?type=problem' },
                { name: t('nav.contactUs', 'Contact Us'), href: '/contact' },
              ].map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  custom={index}
                  variants={linkVariants}
                  className="relative text-sm font-semibold text-slate-300 hover:text-white transition-colors group whitespace-nowrap cursor-pointer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
              <div className="inline-flex items-center ml-1">
                <LanguageSwitcher />
              </div>
            </motion.nav>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center w-full max-w-full pb-2 px-1"
          >
            {/* Small Compact Google Review Badge */}
            <motion.a
              href="https://g.page/r/CQ8YjZSqkk-5EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-amber-400/30 hover:border-amber-400/60 hover:bg-white/[0.08] transition-all text-xs font-sans text-slate-300 shrink-0"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-slate-200 text-[11px] whitespace-nowrap">{t('footer.reviewUs', 'Review Us')}</span>
            </motion.a>

            {/* Social & Contact Icons: Single guaranteed row on all screens */}
            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap shrink-0">
              <motion.a
                href="https://www.linkedin.com/company/siddhi-dynamics-llp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300 shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://www.instagram.com/siddhidynamics/?igsh=djB1eXhhaGNoc3M4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300 shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://wa.me/916303602743"
                target="_blank"
                rel="noopener noreferrer"
                title="Message Siddhi Dynamics on WhatsApp"
                aria-label="Message Siddhi Dynamics on WhatsApp"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all duration-300 shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.904-6.99C16.457 1.875 13.99 .843 11.374.843 5.943.843 1.518 5.263 1.515 10.698c-.001 1.77.462 3.498 1.345 5.03l-.993 3.624 3.71-.973zm13.102-7.531c-.302-.15-1.787-.882-2.062-.982-.275-.1-.475-.15-.675.15-.2.3-.775.982-.95 1.182-.175.2-.35.225-.65.075-1.02-.513-1.86-.943-2.58-1.57-.72-.627-1.22-1.393-1.37-1.643-.15-.25-.015-.385.12-.52.121-.121.275-.32.412-.48.137-.16.183-.275.275-.458.092-.183.046-.347-.023-.497-.068-.15-.675-1.63-.925-2.23-.244-.597-.492-.516-.675-.526-.174-.01-.374-.012-.574-.012s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.521.714.309 1.272.493 1.706.63.718.228 1.37.195 1.886.118.574-.085 1.787-.73 2.037-1.435.25-.705.25-1.31.175-1.435-.075-.125-.275-.2-.575-.35z" />
                </svg>
              </motion.a>
              <motion.a
                href="https://chat.whatsapp.com/Cw6lE2vUYDhAL0tAMTv5op"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Community"
                aria-label="Join Siddhi Dynamics WhatsApp Community"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all duration-300 shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
              <motion.a
                href="mailto:hello@siddhidynamics.in"
                title="Email Siddhi Dynamics (hello@siddhidynamics.in)"
                aria-label="Email Siddhi Dynamics"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300 shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative mt-16 pt-8 pb-8 px-6 md:px-8 border-t border-white/10 flex flex-col items-center gap-6 w-full rounded-3xl bg-white/[0.02] overflow-hidden"
        >
          {/* Checkered Grid Background Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-5 md:flex-row md:justify-between md:w-full">
            <motion.p
              className="text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </motion.p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-full pb-1 px-1">
              {[
                { label: t('footer.legal.privacy', 'Privacy Policy'), href: '/privacy' },
                { label: t('footer.legal.terms', 'Terms & Conditions'), href: '/terms-and-conditions' },
                { label: t('footer.legal.cookies', 'Cookie Policy'), href: '/cookie-policy' },
                { label: t('footer.legal.dataRights', 'Your Data Rights'), href: '/data-rights' },
                { label: t('footer.legal.contactInfo', 'Contact Information'), href: '/contact-information' },
              ].map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="text-xs text-slate-400 hover:text-primary transition-colors whitespace-nowrap"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
          <motion.address
            className="relative z-10 grid w-full max-w-3xl gap-3 not-italic text-left md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <span className="sr-only">{t('footer.locations.title', 'Siddhi Dynamics LLP office locations:')} </span>
            <span className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-sm group hover:border-primary/40 transition-all">
              <div 
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(245, 158, 11, 0.25) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(245, 158, 11, 0.25) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="relative z-10">
                <strong className="mb-1 block text-sm font-semibold text-white">{t('footer.locations.nizamabad', 'Nizamabad office')}</strong>
                <span className="block text-xs leading-5 text-slate-400">
                  3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001
                </span>
                <a
                  href={nizamabadMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-xs font-semibold text-primary transition-colors hover:text-white"
                >
                  {t('footer.locations.openMaps', 'Open in Google Maps ↗')}
                </a>
              </div>
            </span>
            <span className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-sm group hover:border-primary/40 transition-all">
              <div 
                className="absolute inset-0 pointer-events-none opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(245, 158, 11, 0.25) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(245, 158, 11, 0.25) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="relative z-10">
                <strong className="mb-1 block text-sm font-semibold text-white">{t('footer.locations.hyderabad', 'Hyderabad office')}</strong>
                <span className="block text-xs leading-5 text-slate-400">
                  HIVE, Anurag University, Hyderabad, Telangana 500049
                </span>
                <a
                  href={hyderabadMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-xs font-semibold text-primary transition-colors hover:text-white"
                >
                  {t('footer.locations.openMaps', 'Open in Google Maps ↗')}
                </a>
              </div>
            </span>
          </motion.address>
        </motion.div>
      </div>
    </footer>
  );
};
