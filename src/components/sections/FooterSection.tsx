import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import siddhiLogo from '@/assets/siddhi-logo.png';

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
      duration: 0.4,
      delay: 0.2 + i * 0.1,
      ease: "easeOut"
    }
  })
};

export const FooterSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isMobile = useIsMobile();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
    window.scrollTo(0, 0);
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigate(href);
    window.scrollTo(0, 0);
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

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.a
            href="/"
            onClick={handleHomeClick}
            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={isMobile ? { duration: 0 } : { duration: 0.8 }}
            className="flex items-center gap-4 group cursor-pointer relative z-10"
          >
            <motion.div
              className="relative w-14 h-14 shrink-0"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
              <img
                src={siddhiLogo}
                alt="Siddhi Dynamics"
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
                className="relative w-full h-full object-contain"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-wide">
                Siddhi Dynamics LLP
              </span>
              <span className="text-sm text-slate-400 block mt-0.5">
                {t('hero.badge')}
              </span>
            </div>
          </motion.a>

          <motion.nav
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex flex-wrap items-center gap-6"
          >
            {[
              { name: 'About', href: '/about' },
              { name: t('nav.vision'), href: '/#vision' },
              { name: t('nav.projects'), href: '/#projects' },
              { name: 'Blog', href: '/blog' },
              { name: 'Services', href: '/services/business-automation' },
              { name: t('nav.submit'), href: '/#submit' },
            ].map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                custom={index}
                variants={linkVariants}
                className="relative text-sm text-slate-400 hover:text-white transition-colors group"
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
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-4"
          >
            <motion.a
              href="https://www.linkedin.com/company/siddhi-dynamics-llp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </motion.a>
            <motion.a
              href="https://www.instagram.com/siddhidynamics/?igsh=djB1eXhhaGNoc3M4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </motion.a>
            <motion.a
              href="https://wa.me/916303602743"
              target="_blank"
              rel="noopener noreferrer"
              title="Message Siddhi Dynamics on WhatsApp"
              aria-label="Message Siddhi Dynamics on WhatsApp"
              className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.904-6.99C16.457 1.875 13.99 .843 11.374.843 5.943.843 1.518 5.263 1.515 10.698c-.001 1.77.462 3.498 1.345 5.03l-.993 3.624 3.71-.973zm13.102-7.531c-.302-.15-1.787-.882-2.062-.982-.275-.1-.475-.15-.675.15-.2.3-.775.982-.95 1.182-.175.2-.35.225-.65.075-1.02-.513-1.86-.943-2.58-1.57-.72-.627-1.22-1.393-1.37-1.643-.15-.25-.015-.385.12-.52.121-.121.275-.32.412-.48.137-.16.183-.275.275-.458.092-.183.046-.347-.023-.497-.068-.15-.675-1.63-.925-2.23-.244-.597-.492-.516-.675-.526-.174-.01-.374-.012-.574-.012s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.521.714.309 1.272.493 1.706.63.718.228 1.37.195 1.886.118.574-.085 1.787-.73 2.037-1.435.25-.705.25-1.31.175-1.435-.075-.125-.275-.2-.575-.35z" />
              </svg>
            </motion.a>
            <motion.a
              href="https://chat.whatsapp.com/Cw6lE2vUYDhAL0tAMTv5op"
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Community"
              className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.114-2.904-6.99C16.457 1.875 13.99 .843 11.374.843 5.943.843 1.518 5.263 1.515 10.698c-.001 1.77.462 3.498 1.345 5.03l-.993 3.624 3.71-.973zm13.102-7.531c-.302-.15-1.787-.882-2.062-.982-.275-.1-.475-.15-.675.15-.2.3-.775.982-.95 1.182-.175.2-.35.225-.65.075-1.02-.513-1.86-.943-2.58-1.57-.72-.627-1.22-1.393-1.37-1.643-.15-.25-.015-.385.12-.52.121-.121.275-.32.412-.48.137-.16.183-.275.275-.458.092-.183.046-.347-.023-.497-.068-.15-.675-1.63-.925-2.23-.244-.597-.492-.516-.675-.526-.174-.01-.374-.012-.574-.012s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.521.714.309 1.272.493 1.706.63.718.228 1.37.195 1.886.118.574-.085 1.787-.73 2.037-1.435.25-.705.25-1.31.175-1.435-.075-.125-.275-.2-.575-.35z" />
              </svg>
            </motion.a>
            <motion.a
              href="mailto:saivaraprasad@siddhidynamics.in"
              className="w-11 h-11 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center gap-5"
        >
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between md:w-full">
            <motion.p
              className="text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </motion.p>
            <div className="flex items-center gap-4">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms-and-conditions' },
                { label: 'Refund & Cancellation', href: '/refund-cancellation-policy' },
                { label: 'Shipping & Delivery', href: '/shipping-delivery-policy' },
                { label: 'Cookie Policy', href: '/cookie-policy' },
                { label: 'Contact Information', href: '/contact-information' },
              ].map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="text-xs text-slate-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>
          <motion.address
            className="grid w-full max-w-3xl gap-3 not-italic text-left md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <span className="sr-only">Siddhi Dynamics LLP office locations: </span>
            <span className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <strong className="mb-1 block text-sm font-semibold text-white">Nizamabad office</strong>
              <span className="block text-xs leading-5 text-slate-400">
                3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001
              </span>
              <a
                href={nizamabadMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs font-semibold text-primary transition-colors hover:text-white"
              >
                Open in Google Maps ↗
              </a>
            </span>
            <span className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <strong className="mb-1 block text-sm font-semibold text-white">Hyderabad office</strong>
              <span className="block text-xs leading-5 text-slate-400">
                HIVE, Anurag University, Hyderabad, Telangana 500049
              </span>
              <a
                href={hyderabadMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-xs font-semibold text-primary transition-colors hover:text-white"
              >
                Open in Google Maps ↗
              </a>
            </span>
          </motion.address>
        </motion.div>
      </div>
    </footer>
  );
};
