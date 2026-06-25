import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import hiveLogo from '@/assets/hive-logo.jpg';

const floatingParticles = [
  { size: 4, left: '10%', top: '20%', delay: 0 },
  { size: 6, left: '85%', top: '30%', delay: 0.5 },
  { size: 3, left: '70%', top: '60%', delay: 1 },
  { size: 5, left: '20%', top: '70%', delay: 1.5 },
  { size: 4, left: '50%', top: '15%', delay: 2 },
];

export const IncubationSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-10 md:py-20 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"
        animate={{
          background: [
            "linear-gradient(to bottom, hsl(var(--background)), hsl(25 85% 55% / 0.05), hsl(var(--background)))",
            "linear-gradient(to bottom, hsl(var(--background)), hsl(85 70% 45% / 0.05), hsl(var(--background)))",
            "linear-gradient(to bottom, hsl(var(--background)), hsl(25 85% 55% / 0.05), hsl(var(--background)))"
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      {floatingParticles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/40"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(25 85% 55% / 0.3)" }}
          >
            {t('incubation.badge')}
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t('incubation.title')}
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('incubation.description')}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center"
        >
          {/* Card container */}
          <div className="relative w-full max-w-4xl">
            {/* Static glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 via-blue-900/10 to-red-500/10 rounded-3xl blur-2xl opacity-80 pointer-events-none" />

            {/* Red & Navy Blue Static Gradient Border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-red-600 via-blue-900 to-red-600 opacity-60" />

            {/* Main card */}
            <div className="relative bg-[#091020] dark:bg-[#050b16] rounded-2xl p-8 md:p-12 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* HIVE Logo */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-red-500/10 rounded-xl blur-xl" />
                  <img
                    src={hiveLogo}
                    alt="HIVE Logo"
                    className="h-20 md:h-24 w-auto object-contain relative z-10 rounded-xl"
                  />
                </div>

                {/* Info with staggered animations */}
                <div className="text-center md:text-left">
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    {t('incubation.cell')}
                  </motion.h3>
                  <motion.p
                    className="text-xl text-red-500 dark:text-red-400 font-bold mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    {t('incubation.university')}
                  </motion.p>
                  <motion.p
                    className="text-slate-300 max-w-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    {t('incubation.cellDescription')}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
