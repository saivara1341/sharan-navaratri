import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Lightbulb } from 'lucide-react';
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
            ArchPlan at HIVE
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Incubated at HIVE
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            ArchPlan AI, a project by Siddhi Dynamics LLP, was incubated at the HIVE Incubation Cell at Anurag University.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center"
        >
          <div className="relative w-full max-w-5xl">
            <div className="absolute -inset-3 rounded-[1.5rem] bg-[conic-gradient(from_120deg,rgba(221,73,95,0.24),rgba(43,112,214,0.22),rgba(158,190,72,0.18),rgba(221,73,95,0.24))] blur-xl opacity-70 pointer-events-none md:-inset-6 md:rounded-[2rem] md:blur-2xl md:opacity-80" />
            <div className="absolute -inset-[1px] rounded-[1.35rem] bg-gradient-to-br from-[#d94b67] via-[#3b6fb6] to-[#9cc24a] opacity-90 md:rounded-[1.75rem]" />

            <div className="relative overflow-hidden rounded-[1.3rem] bg-[#071526] p-5 text-white shadow-2xl sm:p-7 md:rounded-[1.7rem] md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(217,75,103,0.24),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(72,130,214,0.2),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_46%)] pointer-events-none" />
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

              <div className="relative z-10 grid gap-5 sm:gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <motion.div
                  className="relative mx-auto w-full max-w-[14rem] sm:max-w-[16rem] md:max-w-sm"
                  initial={{ opacity: 0, rotate: -3, y: 20 }}
                  animate={isInView ? { opacity: 1, rotate: 0, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.65 }}
                >
                  <div
                    className="absolute -inset-2 bg-white/10 blur-lg md:-inset-4 md:blur-xl"
                    style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 72%, 92% 100%, 0 100%, 0 28%)' }}
                  />
                  <div
                    className="relative border border-white/80 bg-white p-3 shadow-[0_20px_55px_rgba(0,0,0,0.24)] sm:p-4 md:p-6 md:shadow-[0_28px_70px_rgba(0,0,0,0.28)]"
                    style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 72%, 92% 100%, 0 100%, 0 28%)' }}
                  >
                    <img
                      src={hiveLogo}
                      alt="HIVE Logo"
                      width="384"
                      height="128"
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-full object-contain sm:h-20 md:h-32"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/15 bg-[#102642]/90 px-3 py-1.5 text-[10px] font-semibold text-white shadow-xl backdrop-blur sm:flex md:-bottom-4 md:gap-2 md:px-4 md:py-2 md:text-xs">
                    <Award className="h-3.5 w-3.5 text-[#f06b7f] md:h-4 md:w-4" />
                    ArchPlan Incubator
                  </div>
                </motion.div>

                <div className="text-center lg:text-left">
                  <motion.div
                    className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#bfe26d] sm:mb-4 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Lightbulb className="h-4 w-4" />
                    Incubated At
                  </motion.div>
                  <motion.h3
                    className="mb-2 text-2xl font-black leading-tight text-white sm:text-4xl md:mb-3 md:text-5xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.78 }}
                  >
                    {t('incubation.cell')}
                  </motion.h3>
                  <motion.p
                    className="mb-3 text-lg font-extrabold text-[#f06b7f] sm:text-2xl md:mb-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.86 }}
                  >
                    {t('incubation.university')}
                  </motion.p>
                  <motion.p
                    className="mx-auto max-w-sm text-sm font-medium leading-relaxed text-slate-200 sm:max-w-lg sm:text-lg lg:mx-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.94 }}
                  >
                    Incubation support for ArchPlan's product development, validation, and launch.
                  </motion.p>

                  <motion.div
                    className="mt-6 hidden flex-wrap justify-center gap-3 sm:flex lg:justify-start"
                    initial={{ opacity: 0, y: 18 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 1.02 }}
                  >
                    {['Mentorship', 'Validation', 'Launch support'].map((label) => (
                      <div key={label} className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur">
                        {label}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
