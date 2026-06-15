import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { 
  GraduationCap, 
  Heart, 
  Home, 
  Landmark, 
  LucideIcon, 
  Sparkles, 
  ExternalLink, 
  Bell, 
  ArrowRight, 
  Leaf, 
  Printer, 
  X 
} from 'lucide-react';
import archplanLogo from '@/assets/archplan-logo.jpeg';
import nexusLogo from '@/assets/nexuscarrers-logo.jpeg';
import letusknowLogo from '@/assets/letusknow-logo.png';
import printflowLogo from '@/assets/printflow-logo.png';
import indhurFarmsLogo from '@/assets/indhur-farms-logo.png';
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

interface ProjectData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon?: LucideIcon;
  iconBgClass?: string;
  iconColorClass?: string;
  image?: string;
  features: string[];
  gradient: string;
  accentColor: string;
  url?: string;
  stageKey: string;
  statusKey: string;
  phase: number;
}

const flexokiColors = ['#FFF7D1', '#FFD1D1', '#D1E8FF', '#D1FFD6', '#FFE4D1', '#E8D1FF', '#FFF7D1'];

const ProjectCard = ({
  project,
  index,
  onClick
}: {
  project: ProjectData;
  index: number;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  const IconComponent = project.icon;
  const noteColor = flexokiColors[index % flexokiColors.length];
  // Randomize rotation slightly for sticky note effect
  const noteRotate = (index % 2 === 0 ? -1 : 1) * ((index % 3) + 1.5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="relative w-full max-w-xs mx-auto aspect-square p-3 sm:p-6 cursor-pointer group shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
      style={{
        backgroundColor: noteColor,
        transform: `rotate(${noteRotate}deg)`,
        borderBottomRightRadius: '3rem 2.5rem',
        borderBottomLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem',
        borderTopLeftRadius: '0.5rem',
      }}
    >
      {/* Corner shadow fold effect */}
      <div 
        className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.15) 100%)',
          borderBottomRightRadius: '3rem 2.5rem',
        }}
      />
      
      <div className="h-full flex flex-col items-center text-center pt-1 sm:pt-2">
        <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center ${project.iconBgClass || 'bg-black/10'} ${project.iconColorClass || 'text-black/80'} mb-2 sm:mb-4 overflow-hidden shadow-inner shrink-0`}>
          {project.image ? (
            <img src={project.image} alt={`${project.name} logo`} className="w-full h-full object-cover" />
          ) : (
            IconComponent && <IconComponent className="w-5 h-5 sm:w-8 sm:h-8" />
          )}
        </div>
        <h3 className="text-sm sm:text-xl font-bold text-black/90 mb-1 sm:mb-2 font-display leading-tight line-clamp-2">
          {project.name}
        </h3>
        <p className="text-[10px] sm:text-sm font-medium text-black/70 mb-2 sm:mb-4 font-sans line-clamp-2 sm:line-clamp-3">
          {project.tagline}
        </p>
        
        <div className="mt-auto flex items-center gap-1 text-[9px] sm:text-xs font-bold text-black/60 group-hover:text-black/90 transition-colors uppercase tracking-wider">
          <span>Know more</span>
          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetailsModal = ({
  project,
  onClose,
  onWaitlistClick
}: {
  project: ProjectData;
  onClose: () => void;
  onWaitlistClick: (projectId: string, projectName: string, accentColor: 'primary' | 'accent') => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isPrimary = project.accentColor === 'primary';
  const IconComponent = project.icon;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (project.id === 'nexus') {
      window.open(project.url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.id === 'nilayam') {
      window.scrollTo(0, 0);
      navigate('/project/nilayam');
      onClose();
      return;
    }

    if (project.id === 'archplan') {
      window.open('https://archplan.lovable.app', '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.id === 'letusknow') {
      window.scrollTo(0, 0);
      navigate('/project/letusknow');
      onClose();
      return;
    }

    if (project.id === 'wish0') {
      window.scrollTo(0, 0);
      navigate('/project/wish-o');
      onClose();
      return;
    }

    if (project.id === 'print_flow') {
      window.open('https://saivara1341.github.io/inkfinity/', '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.id === 'indhur_farms') {
      window.open('https://saivara1341.github.io/indhur-farms/', '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    } else {
      onWaitlistClick(project.id, project.name, project.accentColor as 'primary' | 'accent');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-2xl bg-card border border-border/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left mt-2">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden ${!project.image && (project.iconBgClass ? `${project.iconBgClass} ${project.iconColorClass}` : (isPrimary
              ? 'bg-primary/15 text-primary'
              : 'bg-accent/15 text-accent'))
              }`}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              IconComponent && <IconComponent className="w-10 h-10" strokeWidth={1.5} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-3xl font-bold mb-1 text-foreground font-display">
              {project.name}
            </h3>
            <p className={`text-base font-semibold ${isPrimary ? 'text-primary' : 'text-accent'}`}>
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground/60 mb-2">About Project</h4>
          <p className="text-foreground/80 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Development Roadmap */}
        <div className="mb-8 p-5 bg-muted/30 border border-border rounded-2xl">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60">Development Roadmap</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-muted/50 border border-border uppercase tracking-wider ${isPrimary ? 'text-primary' : 'text-accent'}`}>
              {t(`projects.statuses.${project.statusKey}`)}
            </span>
          </div>

          <div className="relative pt-2 pb-1">
            <div className="flex justify-between items-center relative z-10">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="relative flex flex-col items-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full relative z-20 transition-all duration-500 ${step <= project.phase
                      ? (isPrimary ? 'bg-primary shadow-[0_0_12px_rgba(251,146,60,0.85)]' : 'bg-accent shadow-[0_0_12px_rgba(132,204,22,0.85)]')
                      : 'bg-border'
                    }`}
                  >
                    {step === project.phase && (
                      <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 rounded-full ${isPrimary ? 'bg-primary' : 'bg-accent'}`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Connector Line */}
            <div className="absolute top-[14px] left-0 right-0 h-[2px] bg-border z-0 px-1">
              <div
                className={`h-full ${isPrimary ? 'bg-primary' : 'bg-accent'}`}
                style={{ width: `${(project.phase - 1) * 25}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mt-3">
            {t(`projects.stages.${project.stageKey}`)}
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h4 className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground/60 mb-3">Key Features & Modules</h4>
          <div className="flex flex-wrap gap-2">
            {project.features.map((feature) => (
              <span
                key={feature}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${isPrimary
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-accent/10 text-accent border-accent/20'
                  }`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-5 border-t border-border flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleActionClick}
            className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${project.id === 'nexus' || project.id === 'nilayam' || project.id === 'archplan' || project.id === 'letusknow' || project.id === 'wish0' || project.url
              ? 'bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-[0_4px_15px_rgba(251,146,60,0.3)] hover:shadow-[0_0_25px_hsl(25_85%_55%/0.5)]'
              : isPrimary
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-accent text-accent-foreground hover:bg-accent/90'
              }`}
          >
            {project.id === 'nexus' || project.id === 'nilayam' || project.id === 'archplan' || project.id === 'letusknow' || project.id === 'wish0' || project.url ? (
              <>
                <ExternalLink className="w-4 h-4" />
                Access Platform
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Join Waitlist
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3.5 rounded-xl font-bold text-sm bg-muted/30 border border-border hover:bg-muted/60 text-muted-foreground transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};



export const ProjectsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
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
      name: t('projects.items.archplan.name', 'ArchPlan AI'),
      tagline: t('projects.items.archplan.tagline', 'AI-Powered Construction Intelligence Platform'),
      description: t('projects.items.archplan.description', 'A comprehensive, AI-driven platform designed to digitize and streamline the entire construction lifecycle in India. By connecting homeowners, civil engineers, architects, suppliers, and service providers within a single intelligent workflow, ArchPlan AI reduces project delays and optimizes resource allocation with precision.'),
      image: archplanLogo,
      features: Array.isArray(t('projects.items.archplan.features', { returnObjects: true }))
        ? (t('projects.items.archplan.features', { returnObjects: true }) as string[])
        : ["AI 2D/3D Plans", "Vastu Compliance", "BOQ Generation", "Cost Estimation", "Material Marketplace", "Project Management"],
      gradient: 'from-primary to-orange-400',
      accentColor: 'primary',
      url: 'https://archplan.lovable.app',
      stageKey: 'phase5',
      statusKey: 'production',
      phase: 5,
    },
    {
      id: 'nexus',
      name: t('projects.items.nexus.name', 'Nexus Careers'),
      tagline: t('projects.items.nexus.tagline', 'AI-Powered Student Career & Learning Platform'),
      description: t('projects.items.nexus.description', 'Our flagship AI ecosystem helping students transition from education to employment. Build precision AI resumes, discover targeted job opportunities, and access personalized study materials to bridge skill gaps.'),
      image: nexusLogo,
      features: Array.isArray(t('projects.items.nexus.features', { returnObjects: true }))
        ? (t('projects.items.nexus.features', { returnObjects: true }) as string[])
        : ["AI Mock Interviews", "Skill-Gap Detection", "Institutional ERP", "Recruiter Portal", "Gamified Learning", "Career Analytics"],
      gradient: 'from-accent to-lime-400',
      accentColor: 'accent',
      url: 'https://github.com/saivara1341/siddhidynamics',
      stageKey: 'phase4',
      statusKey: 'beta',
      phase: 4,
    },
    {
      id: 'nilayam',
      name: t('projects.items.nilayam.name', 'Nilayam'),
      tagline: t('projects.items.nilayam.tagline', 'AI-Driven Property & Smart Living Platform'),
      description: t('projects.items.nilayam.description', 'A modern SaaS platform designed to simplify and automate the entire rental and property management lifecycle. Property owners access a centralized command center to manage properties, generate legally compliant leases instantly, and automate rent collection, ensuring a frictionless experience for both landlords and tenants.'),
      icon: Home,
      iconBgClass: 'bg-blue-500',
      iconColorClass: 'text-white',
      features: Array.isArray(t('projects.items.nilayam.features', { returnObjects: true }))
        ? (t('projects.items.nilayam.features', { returnObjects: true }) as string[])
        : ["AI Lease Generation", "Financial Analytics", "Tenant Portal", "Maintenance AI", "Marketing Automation", "Community Hub"],
      gradient: 'from-accent to-emerald-400',
      accentColor: 'accent',
      stageKey: 'phase3',
      statusKey: 'alpha',
      phase: 3,
    },
    {
      id: 'indhur_farms',
      name: t('projects.items.indhur.name', 'Indhur Farms'),
      tagline: t('projects.items.indhur.tagline', 'Premium Organic Produce & Farm Stays'),
      description: t('projects.items.indhur.description', 'A premium farm-to-home platform connecting consumers directly with fresh organic produce and providing bookings for scenic farm stays and educational agri-tourism tours.'),
      image: indhurFarmsLogo,
      features: Array.isArray(t('projects.items.indhur.features', { returnObjects: true }))
        ? (t('projects.items.indhur.features', { returnObjects: true }) as string[])
        : ["Organic Marketplace", "Scenic Bookings", "Agri-Tourism", "Direct Sourcing", "Payment Gateway"],
      gradient: 'from-emerald-500 to-green-600',
      accentColor: 'accent',
      url: 'https://indhurfarms.in/',
      stageKey: 'phase5',
      statusKey: 'production',
      phase: 5,
    },
    {
      id: 'print_flow',
      name: t('projects.items.printflow.name', 'Print Flow (Inkfinity)'),
      tagline: t('projects.items.printflow.tagline', 'Seamless Automated Order & Print Management'),
      description: t('projects.items.printflow.description', 'A comprehensive print-on-demand and print workflow automation platform designed to streamline order ingestion, layout preparation, print queue management, and shipping logistics.'),
      image: printflowLogo,
      features: Array.isArray(t('projects.items.printflow.features', { returnObjects: true }))
        ? (t('projects.items.printflow.features', { returnObjects: true }) as string[])
        : ["Order Ingestion", "Print Queue", "Automated Layouts", "Logistics Integration"],
      gradient: 'from-blue-500 to-cyan-500',
      accentColor: 'primary',
      url: 'https://saivara1341.github.io/inkfinity/',
      stageKey: 'phase5',
      statusKey: 'production',
      phase: 5,
    },
    {
      id: 'wish0',
      name: t('projects.items.wish0.name', 'Wish-0'),
      tagline: t('projects.items.wish0.tagline', 'Automated Occasion & Celebration Intelligence'),
      description: t('projects.items.wish0.description', 'An AI-powered automation system designed to deliver personalized wishes for birthdays and all major life occasions without manual intervention. Wish-0 learns relationship dynamics to craft contextually relevant messages, ensuring you never miss a moment to connect with your loved ones.'),
      icon: Heart,
      features: Array.isArray(t('projects.items.wish0.features', { returnObjects: true }))
        ? (t('projects.items.wish0.features', { returnObjects: true }) as string[])
        : ["Auto Scheduling", "Personalized Messages", "Multi-Channel Delivery", "Relationship Learning", "Emotional Intelligence", "Zero-Friction UX"],
      gradient: 'from-primary to-amber-500',
      accentColor: 'primary',
      stageKey: 'phase1',
      statusKey: 'rnd',
      phase: 1,
    },
    {
      id: 'letusknow',
      name: t('projects.items.letusknow.name', 'Letusknow'),
      tagline: t('projects.items.letusknow.tagline', 'Citizen-Centric Digital Governance Platform'),
      description: t('projects.items.letusknow.description', 'A revolutionary citizen-centric digital governance platform designed to simplify how people access government services, understand procedures, and resolve public and personal issues. Letusknow bridges the gap between the administration and the public, fostering transparency and efficient grievance redressal.'),
      image: letusknowLogo,
      features: Array.isArray(t('projects.items.letusknow.features', { returnObjects: true }))
        ? (t('projects.items.letusknow.features', { returnObjects: true }) as string[])
        : ["GPS-Based Location", "Political Representatives Info", "Government Services Guide", "Department Directory", "Development Projects", "Tourism Promotion"],
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

  useEffect(() => {
    // GSAP logic removed for sticky note grid
  }, []);

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
              <Trans
                i18nKey="projects.description"
                components={[
                  <strong className="text-foreground font-semibold" key="0" />
                ]}
              />
            </p>
          </motion.div>

        {/* Sticky Notes Grid */}
        <div className="relative w-full mt-24 mb-20 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-12">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailsModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onWaitlistClick={handleWaitlistClick}
          />
        )}
      </AnimatePresence>

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
