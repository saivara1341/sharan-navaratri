import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Home, Moon, Sun, Briefcase, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FloatingNav = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!navRef.current || !glareRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    glareRef.current.style.setProperty("--x", `${x}px`);
    glareRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleToggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', action: () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
    { id: 'projects', icon: Briefcase, label: 'Projects', action: () => {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }, 100);
    }},
    { id: 'connect', icon: MessageSquare, label: 'Connect Us', action: () => { navigate('/submit'); } },
    { id: 'theme', icon: isDark ? Sun : Moon, label: 'Toggle Theme', action: handleToggleTheme },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
      <motion.nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { if (glareRef.current) glareRef.current.style.opacity = "1"; }}
        onMouseLeave={() => { if (glareRef.current) glareRef.current.style.opacity = "0"; }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative flex items-center gap-2 px-4 py-2 rounded-[2rem] overflow-hidden group"
        style={{
          background: "rgba(10, 10, 10, 0.65)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
        }}
      >
        {/* Interactive Liquid Glare Effect */}
        <div 
          ref={glareRef}
          className="pointer-events-none absolute rounded-full transition-opacity duration-300 opacity-0"
          style={{
            width: "120px",
            height: "120px",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
            top: "var(--y, 50%)",
            left: "var(--x, 50%)",
            transform: "translate(-50%, -50%)",
            mixBlendMode: "screen",
            zIndex: 0
          }}
        />

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={item.action}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary transition-all"
              title={item.label}
            >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 hover:opacity-100 transition-opacity" />
              <Icon className="w-5 h-5 relative z-10" />
            </motion.button>
          )
        })}
      </motion.nav>
    </div>
  );
};
