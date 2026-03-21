import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Heart, Home, Landmark, LucideIcon, Sparkles, ExternalLink, Bell, ArrowRight } from 'lucide-react';
import archplanLogo from '@/assets/archplan-logo.jpeg';
import nexusLogo from '@/assets/nexuscarrers-logo.jpeg';
import letusknowLogo from '@/assets/letusknow-logo.png';
import { WaitlistModal } from '@/components/WaitlistModal';

const cardVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.12,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

const featureVariants = {
  hidden: { opacity: 0, scale: 0.8, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.4 + i * 0.05,
      ease: "easeOut"
    }
  })
};

interface ProjectData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon?: LucideIcon;
  image?: string;
  features: string[];
  gradient: string;
  accentColor: string;
  url?: string;
  stageKey: string;
  statusKey: string;
  phase: number;
}

const ProjectCard = ({
  project,
  index,
  onWaitlistClick
}: {
  project: ProjectData;
  index: number;
  onWaitlistClick: (projectId: string, projectName: string, accentColor: 'primary' | 'accent') => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (project.id === 'nexus') {
      if (e.shiftKey) { // Secret shortcut or just open the landing page
        window.scrollTo(0, 0);
        navigate('/project/nexus');
      } else {
        window.open(project.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (project.id === 'nilayam') {
      window.scrollTo(0, 0);
      navigate('/project/nilayam');
      return;
    }

    if (project.id === 'nilayam') {
      window.scrollTo(0, 0);
      navigate('/project/nilayam');
      return;
    }

    if (project.id === 'archplan') {
      window.open('https://archplan.lovable.app', '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.id === 'letusknow') {
      window.scrollTo(0, 0);
      navigate('/project/letusknow');
      return;
    }

    if (project.id === 'wish0') {
      window.scrollTo(0, 0);
      navigate('/project/wish-o');
      return;
    }

    console.log('Action button clicked for:', project.name);
    if (project.url) {
      console.log('Opening URL:', project.url);
      window.open(project.url, '_blank', 'noopener,noreferrer');
    } else {
      console.log('Opening Waitlist Modal');
      onWaitlistClick(project.id, project.name, project.accentColor as 'primary' | 'accent');
    }
  };

  const isPrimary = project.accentColor === 'primary';
  const IconComponent = project.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group"
    >
      <motion.div
        className="glass-card !overflow-visible p-8 h-full relative"
      >
        {/* Electric border on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 rounded-2xl pointer-events-none electric-border"
          style={{
            padding: '2px',
            background: `linear-gradient(135deg, ${isPrimary ? 'hsl(25 85% 55%)' : 'hsl(85 70% 45%)'} 0%, ${isPrimary ? 'hsl(85 70% 45%)' : 'hsl(25 85% 55%)'} 100%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Glow effect */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: isPrimary
              ? 'radial-gradient(circle at 50% 0%, hsl(25 85% 55% / 0.25) 0%, transparent 60%)'
              : 'radial-gradient(circle at 50% 0%, hsl(85 70% 45% / 0.25) 0%, transparent 60%)',
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 shimmer pointer-events-none rounded-2xl"
        />

        {/* Content Wrapper for Z-Index Safety */}
        <div className="relative z-20 h-full flex flex-col pointer-events-none">
          {/* Clickable Area for Expansion - Now explicit only on content */}
          <div className="flex-grow pointer-events-auto">
            {/* Header with Icon and Title */}
            <div
              onClick={handleCardClick}
              className="flex items-start gap-5 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <motion.div
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 overflow-hidden ${!project.image && (isPrimary
                  ? 'bg-primary/15 text-primary'
                  : 'bg-accent/15 text-accent')
                  }`}
                style={{
                  boxShadow: isHovered
                    ? `0 0 40px ${isPrimary ? 'hsl(25 85% 55% / 0.5)' : 'hsl(85 70% 45% / 0.5)'}`
                    : 'none'
                }}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  IconComponent && <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold mb-1 text-foreground font-display">
                  {project.name}
                </h3>
                <p className={`text-sm font-semibold ${isPrimary ? 'text-primary' : 'text-accent'}`}>
                  {project.tagline}
                </p>
              </div>
            </div>

            {/* Description */}
            <motion.p
              onClick={handleCardClick}
              className="text-muted-foreground text-sm leading-relaxed mb-6 cursor-pointer hover:text-foreground transition-colors"
              animate={{
                height: isExpanded ? 'auto' : '4.5rem',
              }}
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: isExpanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {project.description}
            </motion.p>
          </div>
        </div>

        <div className="mt-auto relative !z-[9999] pointer-events-auto">

          {/* Read More Indicator */}
          <motion.button
            className={`text-xs font-medium mb-4 ${isPrimary ? 'text-primary' : 'text-accent'} hover:underline relative z-[60] cursor-pointer`}
            style={{ pointerEvents: 'auto' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? t('projects.showLess') : t('projects.readMore')}
          </motion.button>

          {/* Development Roadmap (Corporate Milestone Stream) */}
          <div className="mb-8 space-y-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60">{t('projects.progress')}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase tracking-wider ${isPrimary ? 'text-primary' : 'text-accent'}`}>
                {t(`projects.statuses.${project.statusKey}`)}
              </span>
            </div>

            <div className="relative pt-2">
              <div className="flex justify-between items-center relative z-10">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="relative flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: step <= project.phase ? 1 : 0.8,
                        backgroundColor: step < project.phase
                          ? (isPrimary ? 'hsl(25 85% 55%)' : 'hsl(85 70% 45%)')
                          : step === project.phase
                            ? (isPrimary ? 'hsl(25 85% 55%)' : 'hsl(85 70% 45%)')
                            : 'rgba(255,255,255,0.1)',
                        boxShadow: step === project.phase
                          ? `0 0 15px ${isPrimary ? 'hsl(25 85% 55%)' : 'hsl(85 70% 45%)'}`
                          : 'none'
                      }}
                      className={`w-2.5 h-2.5 rounded-full relative z-20 transition-colors duration-500`}
                    >
                      {step === project.phase && (
                        <motion.div
                          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute inset-0 rounded-full ${isPrimary ? 'bg-primary' : 'bg-accent'}`}
                        />
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Connector Line */}
              <div className="absolute top-[13px] left-0 right-0 h-[1px] bg-white/10 z-0 px-1">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(project.phase - 1) * 25}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className={`h-full ${isPrimary ? 'bg-primary' : 'bg-accent'}`}
                />
              </div>
            </div>

            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mt-2">
              {t(`projects.stages.${project.stageKey}`)}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {project.features.map((feature, featureIndex) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + featureIndex * 0.05 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${isPrimary
                  ? 'bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40'
                  : 'bg-accent/10 text-accent border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/40'
                  }`}
              >
                {feature}
              </motion.span>
            ))}
          </div>

          {/* Action Button Container */}
          <div
            className="mt-6 pt-4 border-t border-border/30 relative !z-[9999]"
            style={{ pointerEvents: 'auto' }}
          >
            <motion.button
              onClick={handleActionClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 relative cursor-pointer ${project.id === 'nexus' || project.id === 'nilayam' || project.id === 'archplan' || project.id === 'letusknow' || project.id === 'wish0'
                ? 'bg-gradient-to-r from-accent/90 to-lime-400 text-black shadow-[0_4px_15px_rgba(132,204,22,0.3)] hover:shadow-[0_0_25px_rgba(132,204,22,0.5)]'
                : project.url
                  ? 'bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-[0_4px_15px_rgba(251,146,60,0.3)] hover:shadow-[0_0_25px_hsl(25_85%_55%/0.5)]'
                  : isPrimary
                    ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50'
                    : 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 hover:border-accent/50'
                }`}
            >
              {project.id === 'nexus' || project.id === 'nilayam' || project.id === 'archplan' || project.id === 'letusknow' || project.id === 'wish0' ? (
                <>
                  Know More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : project.url ? (
                <>
                  <ExternalLink className="w-4 h-4" />
                  {t('projects.access')}
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  {t('projects.waitlist')}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [waitlistModal, setWaitlistModal] = useState<{
    isOpen: boolean;
    projectId: string;
    projectName: string;
    accentColor: 'primary' | 'accent';
  }>({
    isOpen: false,
    projectId: '',
    projectName: '',
    accentColor: 'primary',
  });

  const projects: ProjectData[] = [
    {
      id: 'archplan',
      name: t('projects.items.archplan.name'),
      tagline: t('projects.items.archplan.tagline'),
      description: t('projects.items.archplan.description'),
      image: archplanLogo,
      features: t('projects.items.archplan.features', { returnObjects: true }) as string[],
      gradient: 'from-primary to-orange-400',
      accentColor: 'primary',
      url: 'https://archplan.lovable.app',
      stageKey: 'phase5',
      statusKey: 'production',
      phase: 5,
    },
    {
      id: 'nexus',
      name: t('projects.items.nexus.name'),
      tagline: t('projects.items.nexus.tagline'),
      description: t('projects.items.nexus.description'),
      image: nexusLogo,
      features: t('projects.items.nexus.features', { returnObjects: true }) as string[],
      gradient: 'from-accent to-lime-400',
      accentColor: 'accent',
      url: 'https://github.com/saivara1341/siddhidynamics',
      stageKey: 'phase4',
      statusKey: 'beta',
      phase: 4,
    },
    {
      id: 'nilayam',
      name: t('projects.items.nilayam.name'),
      tagline: t('projects.items.nilayam.tagline'),
      description: t('projects.items.nilayam.description'),
      icon: Home,
      features: t('projects.items.nilayam.features', { returnObjects: true }) as string[],
      gradient: 'from-accent to-emerald-400',
      accentColor: 'accent',
      stageKey: 'phase3',
      statusKey: 'alpha',
      phase: 3,
    },
    {
      id: 'wish0',
      name: t('projects.items.wish0.name'),
      tagline: t('projects.items.wish0.tagline'),
      description: t('projects.items.wish0.description'),
      icon: Heart,
      features: t('projects.items.wish0.features', { returnObjects: true }) as string[],
      gradient: 'from-primary to-amber-500',
      accentColor: 'primary',
      stageKey: 'phase1',
      statusKey: 'rnd',
      phase: 1,
    },
    {
      id: 'letusknow',
      name: t('projects.items.letusknow.name'),
      tagline: t('projects.items.letusknow.tagline'),
      description: t('projects.items.letusknow.description'),
      image: letusknowLogo,
      features: t('projects.items.letusknow.features', { returnObjects: true }) as string[],
      gradient: 'from-cyan-500 to-blue-600',
      accentColor: 'accent',
      stageKey: 'phase2',
      statusKey: 'lab',
      phase: 2,
    },
  ];

  const handleWaitlistClick = (projectId: string, projectName: string, accentColor: 'primary' | 'accent') => {
    setWaitlistModal({
      isOpen: true,
      projectId,
      projectName,
      accentColor,
    });
  };

  const handleCloseModal = () => {
    setWaitlistModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <section id="projects" className="py-32 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-20"
          >
            <motion.span
              className="inline-block text-accent font-medium text-sm tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('projects.title')}
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-display">
              <Trans
                i18nKey="projects.subtitle"
                components={[
                  <span className="gradient-text-reverse glow-text-accent" />
                ]}
              />
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              {t('projects.description')}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                custom={index}
                variants={cardVariants}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative z-0 hover:z-50 transition-all duration-200"
              >
                {/* Spotlight effect on hover */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl -z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                <ProjectCard
                  project={project}
                  index={index}
                  onWaitlistClick={handleWaitlistClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={waitlistModal.isOpen}
        onClose={handleCloseModal}
        projectId={waitlistModal.projectId}
        projectName={waitlistModal.projectName}
        accentColor={waitlistModal.accentColor}
      />
    </>
  );
};
