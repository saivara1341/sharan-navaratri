import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import siddhiHeaderLogo from '@/assets/siddhi-dynamics-header-logo.png';
import { LogOut, Home, X, LayoutDashboard, User, Bot } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // True when user is on the main landing/home page
  const isOnLandingPage = 
    location.pathname === '/' || 
    location.pathname === '' || 
    location.pathname === '/vision' || 
    location.pathname === '/projects' || 
    location.pathname === '/submit' ||
    location.pathname === '/about' ||
    location.pathname === '/blog' ||
    location.pathname.startsWith('/services/');
  const isPortal = location.pathname.includes('/portal');

  const navLinks = [
    { name: t('nav.submitChallenge', 'Submit Your Challenge'), href: isPortal ? '#/portal?tab=contact&type=problem' : '#/submit?type=problem' },
    { name: t('nav.buildProject', 'Build Your Project'), href: isPortal ? '#/portal?tab=contact&type=requirement' : '#/submit?type=requirement' },
    { name: t('nav.exploreProjects', 'Explore Projects'), href: isPortal ? '#/portal?tab=contact&type=inquiry' : '#/submit?type=inquiry' },
    { name: t('nav.contactUs', 'Contact Us'), href: '/contact' },
  ];

  const headerOpacity = useTransform(scrollY, [0, 30], [0, 1]);
  const headerPadding = useTransform(scrollY, [0, 100], ['24px', '14px']);
  const headerBlur = useTransform(scrollY, [0, 100], ['0px', '40px']);

  const checkAdmin = (emailToCheck?: string) => {
    if (!emailToCheck) return false;
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com")
      .split(",")
      .map((e: string) => e.trim().toLowerCase());
    return adminEmails.includes(emailToCheck.trim().toLowerCase());
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Basic auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsAdmin(session?.user?.email ? checkAdmin(session.user.email) : false);
      setUserRole(session?.user?.user_metadata?.role || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setIsAdmin(session?.user?.email ? checkAdmin(session.user.email) : false);
      setUserRole(session?.user?.user_metadata?.role || null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      navigate("/admin-hq-nexus");
    } else if (userRole === 'partner') {
      navigate("/portal/v-magnetic-minds");
    } else if (userRole === 'employee') {
      navigate("/portal/employee");
    } else if (userRole === 'client') {
      navigate("/portal/client");
    } else if (userRole === 'investor') {
      navigate("/portal/investor");
    } else {
      navigate("/portal");
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate("/");
    window.scrollTo(0, 0);
  };

  const handleAnchorClick = (anchorId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(`/#${anchorId}`);
    }
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] pt-[env(safe-area-inset-top,0px)]"
      >
        {/* Robust Glass Background */}
        <motion.div
          className="absolute inset-0 border-b border-border bg-background/95 dark:bg-[#2d2d2d]/95 transition-colors duration-300"
          style={{
            backdropFilter: 'blur(45px) saturate(180%)',
            WebkitBackdropFilter: 'blur(45px) saturate(180%)'
          }}
        />

        <motion.div
          style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
          className="relative container mx-auto px-6"
        >
          <div className="flex items-center justify-between">
            <motion.a
              href="#/"
              onClick={handleHomeClick}
              className="group relative z-[110] block cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={siddhiHeaderLogo}
                alt="Siddhi Dynamics LLP"
                width="176"
                height="56"
                decoding="async"
                className="h-12 w-36 rounded-lg object-cover object-center shadow-sm transition-transform sm:h-14 sm:w-44 group-hover:scale-[1.02]"
              />
            </motion.a>

            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 whitespace-nowrap">
              <motion.a
                href="/about"
                onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                whileHover={{ scale: 1.02 }}
              >
                About
              </motion.a>
              <motion.a
                href="/#vision"
                onClick={handleAnchorClick('vision')}
                className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                whileHover={{ scale: 1.02 }}
              >
                Vision
              </motion.a>
              <motion.a
                href="/#projects"
                onClick={handleAnchorClick('projects')}
                className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                whileHover={{ scale: 1.02 }}
              >
                Projects
              </motion.a>
              <motion.a
                href="/blog"
                onClick={(e) => { e.preventDefault(); navigate('/blog'); }}
                className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                whileHover={{ scale: 1.02 }}
              >
                Blog
              </motion.a>
              <motion.a
                href="/#services"
                onClick={handleAnchorClick('services')}
                className="px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                whileHover={{ scale: 1.02 }}
              >
                Services
              </motion.a>
              <motion.a
                href={isPortal ? '#/portal?tab=contact&type=problem' : '/submit?type=problem'}
                onClick={(e) => {
                  e.preventDefault();
                  if (isPortal) window.location.hash = '#/portal?tab=contact&type=problem';
                  else navigate('/submit?type=problem');
                }}
                className="px-3.5 py-2 rounded-xl text-xs lg:text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Problem
              </motion.a>

              {!isLoggedIn ? (
                <motion.button
                  onClick={() => navigate('/portal')}
                  className="relative ml-2 px-5 py-2 rounded-xl font-semibold text-xs lg:text-sm overflow-hidden group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                  <span className="relative text-primary-foreground">
                    {t('nav.getStarted')}
                  </span>
                </motion.button>
              ) : isOnLandingPage ? (
                <div className="flex items-center gap-2 ml-2">
                  <motion.a
                    href={isAdmin ? "/admin-hq-nexus" : `/portal/${userRole || ''}`}
                    onClick={handleDashboardClick}
                    className="relative px-5 py-2 rounded-xl font-semibold text-xs lg:text-sm overflow-hidden group shadow-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    <span className="relative text-primary-foreground flex items-center gap-2 font-bold">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </span>
                  </motion.a>
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs lg:text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center ml-2 gap-2">
                  <motion.a
                    href={isAdmin ? "/admin-hq-nexus" : `/portal/${userRole || ''}`}
                    onClick={handleDashboardClick}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs lg:text-sm bg-primary/10 hover:bg-primary/20 text-primary transition-colors border border-primary/20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </motion.a>
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs lg:text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </div>
              )}
            </nav>

            {/* Mobile Actions: Hamburger Toggle */}
            <div className="flex items-center gap-2 md:hidden z-[110]">
              <motion.button
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-muted/60 border border-border cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle Mobile Navigation Menu"
              >
                <div className="flex flex-col gap-1.5">
                  <motion.span
                    className="w-5 h-0.5 bg-foreground rounded-full"
                    animate={{
                      rotate: mobileMenuOpen ? 45 : 0,
                      y: mobileMenuOpen ? 7 : 0
                    }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-foreground rounded-full"
                    animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-foreground rounded-full"
                    animate={{
                      rotate: mobileMenuOpen ? -45 : 0,
                      y: mobileMenuOpen ? -7 : 0
                    }}
                  />
                </div>
              </motion.button>
            </div>
            </div>
          </motion.div>
        </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[105] md:hidden bg-background"
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-3xl"
              onClick={() => setMobileMenuOpen(false)}
            />
              <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative flex flex-col items-center justify-center min-h-[100dvh] pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[calc(3rem+env(safe-area-inset-bottom,0px))] gap-8 px-6 overflow-y-auto"
              >
                {/* Mobile Menu Content starts with Home */}

                {/* Home Link */}
                <motion.a
                  href="#/"
                  onClick={handleHomeClick}
                  className="text-3xl font-display font-bold text-primary hover:text-foreground transition-colors flex items-center gap-3 relative z-[120] cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Home className="w-8 h-8" />
                  Home
                </motion.a>
                <motion.a
                  href="/about"
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/about'); }}
                  className="text-xl font-bold text-foreground hover:text-primary transition-colors relative z-[120]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  About
                </motion.a>
                <motion.a
                  href="/#vision"
                  onClick={handleAnchorClick('vision')}
                  className="text-xl font-bold text-foreground hover:text-primary transition-colors relative z-[120]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.10 }}
                >
                  Vision
                </motion.a>
                <motion.a
                  href="/#projects"
                  onClick={handleAnchorClick('projects')}
                  className="text-xl font-bold text-foreground hover:text-primary transition-colors relative z-[120]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  Projects
                </motion.a>
                <motion.a
                  href="/blog"
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigate('/blog'); }}
                  className="text-xl font-bold text-foreground hover:text-primary transition-colors relative z-[120]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 }}
                >
                  Blog
                </motion.a>
                <motion.a
                  href="/#services"
                  onClick={handleAnchorClick('services')}
                  className="text-xl font-bold text-foreground hover:text-primary transition-colors relative z-[120]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  Services
                </motion.a>
                <motion.a
                  href={isPortal ? '#/portal?tab=contact&type=problem' : '/submit?type=problem'}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    if (isPortal) window.location.hash = '#/portal?tab=contact&type=problem';
                    else navigate('/submit?type=problem');
                  }}
                  className="text-xl font-extrabold text-primary hover:text-primary/80 transition-colors relative z-[120]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  Submit Problem
                </motion.a>
              {/* Close Button */}
              <motion.button
                className="absolute top-[calc(1.5rem+env(safe-area-inset-top,0px))] right-[calc(1.5rem+env(safe-area-inset-right,0px))] w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border text-foreground hover:text-primary hover:border-primary/30 transition-all z-[120]"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
              {/* Removed portal mobile nav links */}

              {!isLoggedIn ? (
                <motion.button
                  onClick={() => { setMobileMenuOpen(false); navigate('/portal'); }}
                  className="w-full max-w-xs text-center px-10 py-5 rounded-2xl font-bold text-xl overflow-hidden relative group shadow-2xl shadow-primary/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * navLinks.length }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90" />
                  <span className="relative text-primary-foreground">
                    {t('nav.getStarted')}
                  </span>
                </motion.button>
              ) : isOnLandingPage ? (
                // On landing page: show gradient Dashboard button and Logout
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <motion.a
                    href={isAdmin ? "/admin-hq-nexus" : `/portal/${userRole || ''}`}
                    onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); handleDashboardClick(e); }}
                    className="w-full text-center px-10 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-primary-foreground flex items-center justify-center gap-2 shadow-2xl shadow-primary/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </motion.a>
                  <motion.button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-10 py-4 rounded-2xl font-bold text-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              ) : (
                // On portal/admin pages: show Home + Logout
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  {!isAdmin && (
                    <>
                      <motion.a
                        href="#/"
                        onClick={handleHomeClick}
                        className="w-full text-center px-10 py-4 rounded-2xl font-bold text-lg bg-muted/60 border border-border text-foreground hover:text-primary transition-all flex items-center justify-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * navLinks.length + 0.05 }}
                      >
                        <Home className="w-5 h-5" />
                        Home
                      </motion.a>
                      <motion.a
                        href="#/portal?tab=contact"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center px-10 py-4 rounded-2xl font-bold text-lg bg-muted/60 border border-border text-foreground hover:text-primary transition-all flex items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * navLinks.length + 0.08 }}
                      >
                        Contact Us
                      </motion.a>
                    </>
                  )}
                  <motion.button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-10 py-4 rounded-2xl font-bold text-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * navLinks.length + 0.1 }}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </div>
              )}

              <motion.div
                className="flex items-center gap-8 mt-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * navLinks.length + 0.1 }}
              >
                <motion.a
                  href="https://www.linkedin.com/company/siddhi-dynamics-llp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl glass-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/siddhidynamics/?igsh=djB1eXhhaGNoc3M4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-2xl glass-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
