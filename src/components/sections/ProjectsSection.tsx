import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import doginLogo from '@/assets/dogin-logo.png';
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

const notePalettes = [
  { bg: '#FFF1B8', edge: '#D69E2E', ink: '#2B2112', icon: '#F9D56E', shadow: 'rgba(214, 158, 46, 0.26)' },
  { bg: '#DDEBFF', edge: '#4C78B8', ink: '#13233D', icon: '#AFCBFF', shadow: 'rgba(76, 120, 184, 0.26)' },
  { bg: '#DDF7EA', edge: '#2F9E74', ink: '#102C22', icon: '#A7E4C2', shadow: 'rgba(47, 158, 116, 0.26)' },
  { bg: '#FFE4BF', edge: '#C7792A', ink: '#321F0D', icon: '#FFC980', shadow: 'rgba(199, 121, 42, 0.25)' },
  { bg: '#E5E0FF', edge: '#705BC7', ink: '#201A3F', icon: '#C8BDFF', shadow: 'rgba(112, 91, 199, 0.25)' },
  { bg: '#FFDDE8', edge: '#C9567B', ink: '#3B1421', icon: '#FFB4CB', shadow: 'rgba(201, 86, 123, 0.24)' },
  { bg: '#D9F3F6', edge: '#278A96', ink: '#0E2A2E', icon: '#A8DFE6', shadow: 'rgba(39, 138, 150, 0.24)' },
  { bg: '#E9E3D2', edge: '#8F7651', ink: '#2F2619', icon: '#D5C49C', shadow: 'rgba(143, 118, 81, 0.24)' },
];

const modalPalettes: Record<string, {
  bg: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  panel: string;
  chip: string;
  button: string;
  buttonText: string;
  shadow: string;
}> = {
  archplan: {
    bg: 'linear-gradient(145deg, #fff4df 0%, #ffe0b5 45%, #f7b26b 100%)',
    border: '#d97824',
    text: '#2c1706',
    muted: '#68411f',
    accent: '#b45309',
    accentSoft: '#fff0d9',
    panel: 'rgba(255, 248, 236, 0.78)',
    chip: 'rgba(180, 83, 9, 0.12)',
    button: 'linear-gradient(135deg, #d97706, #f97316)',
    buttonText: '#fffaf1',
    shadow: 'rgba(217, 119, 6, 0.32)',
  },
  nexus: {
    bg: 'linear-gradient(145deg, #e8f0ff 0%, #c7ddff 48%, #779bd8 100%)',
    border: '#4f7ec7',
    text: '#10243f',
    muted: '#345175',
    accent: '#2563eb',
    accentSoft: '#edf5ff',
    panel: 'rgba(239, 246, 255, 0.78)',
    chip: 'rgba(37, 99, 235, 0.12)',
    button: 'linear-gradient(135deg, #2563eb, #22a6f2)',
    buttonText: '#ffffff',
    shadow: 'rgba(37, 99, 235, 0.3)',
  },
  nilayam: {
    bg: 'linear-gradient(145deg, #e5fff0 0%, #b8efd3 48%, #4fb47d 100%)',
    border: '#2f9e74',
    text: '#0d2b1e',
    muted: '#315f49',
    accent: '#047857',
    accentSoft: '#ecfff4',
    panel: 'rgba(238, 255, 245, 0.78)',
    chip: 'rgba(4, 120, 87, 0.12)',
    button: 'linear-gradient(135deg, #047857, #10b981)',
    buttonText: '#f6fffb',
    shadow: 'rgba(4, 120, 87, 0.28)',
  },
  indhur_farms: {
    bg: 'linear-gradient(145deg, #f1f7d8 0%, #d8e99c 45%, #789b38 100%)',
    border: '#6f8f2c',
    text: '#26320e',
    muted: '#56652d',
    accent: '#63851d',
    accentSoft: '#f7fde4',
    panel: 'rgba(249, 255, 232, 0.78)',
    chip: 'rgba(99, 133, 29, 0.14)',
    button: 'linear-gradient(135deg, #63851d, #98b83e)',
    buttonText: '#fbfff0',
    shadow: 'rgba(99, 133, 29, 0.28)',
  },
  print_flow: {
    bg: 'linear-gradient(145deg, #e7fbff 0%, #b7eaf4 48%, #27a7bc 100%)',
    border: '#16879b',
    text: '#082d35',
    muted: '#315e68',
    accent: '#0891b2',
    accentSoft: '#effcff',
    panel: 'rgba(236, 254, 255, 0.78)',
    chip: 'rgba(8, 145, 178, 0.13)',
    button: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    buttonText: '#f4feff',
    shadow: 'rgba(8, 145, 178, 0.28)',
  },
  wish0: {
    bg: 'linear-gradient(145deg, #fff0f5 0%, #ffd1df 48%, #d95f85 100%)',
    border: '#c9567b',
    text: '#3a1220',
    muted: '#754055',
    accent: '#be3f6c',
    accentSoft: '#fff5f8',
    panel: 'rgba(255, 245, 248, 0.8)',
    chip: 'rgba(190, 63, 108, 0.13)',
    button: 'linear-gradient(135deg, #be3f6c, #f06292)',
    buttonText: '#fff8fb',
    shadow: 'rgba(190, 63, 108, 0.3)',
  },
  letusknow: {
    bg: 'linear-gradient(145deg, #f0edff 0%, #d4cbff 48%, #7461ce 100%)',
    border: '#705bc7',
    text: '#201644',
    muted: '#4e4374',
    accent: '#5b4ab8',
    accentSoft: '#f6f4ff',
    panel: 'rgba(246, 244, 255, 0.8)',
    chip: 'rgba(91, 74, 184, 0.13)',
    button: 'linear-gradient(135deg, #5b4ab8, #8b5cf6)',
    buttonText: '#fbfaff',
    shadow: 'rgba(91, 74, 184, 0.28)',
  },
  dogin: {
    bg: 'linear-gradient(145deg, #fff0e9 0%, #ffc9b7 48%, #e15c43 100%)',
    border: '#c44935',
    text: '#3a150f',
    muted: '#744034',
    accent: '#c2412f',
    accentSoft: '#fff6f2',
    panel: 'rgba(255, 246, 242, 0.8)',
    chip: 'rgba(194, 65, 47, 0.13)',
    button: 'linear-gradient(135deg, #c2412f, #f97316)',
    buttonText: '#fffaf7',
    shadow: 'rgba(194, 65, 47, 0.3)',
  },
};

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
  const palette = notePalettes[index % notePalettes.length];
  // Randomize rotation slightly for sticky note effect
  const noteRotate = (index % 2 === 0 ? -1 : 1) * ((index % 3) + 1.5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="relative w-full max-w-xs mx-auto aspect-square p-3 sm:p-6 cursor-pointer group border hover:-translate-y-2 transition-all duration-300"
      style={{
        background: `linear-gradient(145deg, ${palette.bg} 0%, ${palette.bg} 58%, color-mix(in srgb, ${palette.bg} 78%, white 22%) 100%)`,
        borderColor: palette.edge,
        boxShadow: `0 18px 36px ${palette.shadow}`,
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
      
      <div
        className="h-full flex flex-col items-center text-center pt-1 sm:pt-2"
        style={{ color: palette.ink }}
      >
        <div
          className={`w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center ${project.iconBgClass || ''} ${project.iconColorClass || ''} mb-2 sm:mb-4 overflow-hidden shadow-inner shrink-0`}
          style={{ backgroundColor: project.iconBgClass ? undefined : palette.icon }}
        >
          {project.image ? (
            <img src={project.image} alt={`${project.name} logo`} className="w-full h-full object-cover" />
          ) : (
            IconComponent && <IconComponent className="w-5 h-5 sm:w-8 sm:h-8" />
          )}
        </div>
        <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2 font-display leading-tight line-clamp-2">
          {project.name}
        </h3>
        <p className="text-[10px] sm:text-sm font-medium mb-2 sm:mb-4 font-sans line-clamp-2 sm:line-clamp-3 opacity-75">
          {project.tagline}
        </p>
        
        <div className="mt-auto flex items-center gap-1 text-[9px] sm:text-xs font-bold opacity-70 group-hover:opacity-95 transition-opacity uppercase tracking-wider">
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
  const palette = modalPalettes[project.id] ?? modalPalettes.archplan;

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
      window.open('https://printflows.in/', '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.id === 'indhur_farms') {
      window.open('https://saivara1341.github.io/indhur-farms/', '_blank', 'noopener,noreferrer');
      return;
    }

    if (project.id === 'dogin') {
      window.open('https://dogin-chi.vercel.app/', '_blank', 'noopener,noreferrer');
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
        className="relative w-full max-w-2xl border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
        style={{
          background: palette.bg,
          borderColor: palette.border,
          boxShadow: `0 28px 80px ${palette.shadow}`,
          color: palette.text,
        }}
      >
        {/* Grid pattern background */}
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 18% 8%, ${palette.accentSoft} 0%, transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.32), transparent 60%)`,
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border transition-all cursor-pointer z-50"
          style={{
            backgroundColor: palette.accentSoft,
            borderColor: palette.border,
            color: palette.text,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left mt-2">
            <div
              className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden ${!project.image && project.iconColorClass ? project.iconColorClass : ''}`}
              style={{
                backgroundColor: project.image ? palette.accentSoft : palette.chip,
                border: `1px solid ${palette.border}`,
              }}
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
              <h3 className="text-3xl font-bold mb-1 font-display" style={{ color: palette.text }}>
                {project.name}
              </h3>
              <p className="text-base font-semibold" style={{ color: palette.accent }}>
                {project.tagline}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] mb-2" style={{ color: palette.muted }}>About Project</h4>
            <p className="text-sm leading-relaxed" style={{ color: palette.text }}>
              {project.description}
            </p>
          </div>

          {/* Development Roadmap */}
          <div
            className="mb-8 p-5 border rounded-2xl backdrop-blur"
            style={{
              backgroundColor: palette.panel,
              borderColor: palette.border,
            }}
          >
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: palette.muted }}>Development Roadmap</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                project.statusKey === 'rnd'
                  ? 'bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30'
                  : project.statusKey === 'lab'
                  ? 'bg-purple-500/5 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30'
                  : project.statusKey === 'alpha'
                  ? 'bg-rose-500/5 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30'
                  : project.statusKey === 'beta'
                  ? 'bg-blue-500/5 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30'
                  : 'bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30'
              }`}>
                {t(`projects.statuses.${project.statusKey}`)}
              </span>
            </div>

            <div className="relative pt-3 pb-2">
              <div className="flex justify-between items-center relative z-10">
                {[1, 2, 3, 4, 5].map((step) => {
                  const isCompleted = step <= project.phase;
                  const isCurrent = step === project.phase;
                  return (
                    <div key={step} className="relative flex flex-col items-center">
                      <div
                        className="w-6 h-6 rounded-full relative z-20 transition-all duration-500 flex items-center justify-center text-[10px] font-bold border"
                        style={{
                          backgroundColor: isCompleted ? palette.accent : palette.accentSoft,
                          borderColor: isCompleted ? palette.accent : palette.border,
                          color: isCompleted ? palette.buttonText : palette.muted,
                          boxShadow: isCompleted ? `0 0 12px ${palette.shadow}` : undefined,
                        }}
                      >
                        {step}
                        {isCurrent && (
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full -z-10"
                            style={{ backgroundColor: palette.accent }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connector Line */}
              <div className="absolute top-6 left-0 right-0 h-[2px] z-0 px-1" style={{ backgroundColor: palette.accentSoft }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${(project.phase - 1) * 25}%`, backgroundColor: palette.accent }}
                />
              </div>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-widest text-center mt-3" style={{ color: palette.text }}>
              {t(`projects.stages.${project.stageKey}`)}
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h4 className="text-xs uppercase font-bold tracking-[0.2em] mb-3" style={{ color: palette.muted }}>Key Features & Modules</h4>
            <div className="flex flex-wrap gap-2">
              {project.features.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                  style={{
                    backgroundColor: palette.chip,
                    borderColor: palette.border,
                    color: palette.text,
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-5 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: palette.border }}>
            <button
              onClick={handleActionClick}
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
              style={{
                background: palette.button,
                color: palette.buttonText,
                boxShadow: `0 14px 30px ${palette.shadow}`,
              }}
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
              className="px-6 py-3.5 rounded-xl font-bold text-sm border transition-all cursor-pointer"
              style={{
                backgroundColor: palette.accentSoft,
                borderColor: palette.border,
                color: palette.text,
              }}
            >
              Close
            </button>
          </div>
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
      url: 'https://saivara1341.github.io/indhur-farms/',
      stageKey: 'phase5',
      statusKey: 'production',
      phase: 5,
    },
    {
      id: 'print_flow',
      name: t('projects.items.printflow.name', 'Print Flow'),
      tagline: t('projects.items.printflow.tagline', 'Seamless Automated Order & Print Management'),
      description: t('projects.items.printflow.description', 'A comprehensive print-on-demand and print workflow automation platform designed to streamline order ingestion, layout preparation, print queue management, and shipping logistics.'),
      image: printflowLogo,
      features: Array.isArray(t('projects.items.printflow.features', { returnObjects: true }))
        ? (t('projects.items.printflow.features', { returnObjects: true }) as string[])
        : ["Order Ingestion", "Print Queue", "Automated Layouts", "Logistics Integration"],
      gradient: 'from-blue-500 to-cyan-500',
      accentColor: 'primary',
      url: 'https://printflows.in/',
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
    {
      id: 'dogin',
      name: t('projects.items.dogin.name', 'Dogin'),
      tagline: t('projects.items.dogin.tagline', "India's Premier Dog Care Platform"),
      description: t('projects.items.dogin.description', "Dogin is India's premier dog care platform. Features AI-powered health assistant, veterinary booking, pet matchmaking, grooming services, marketplace, lost & found, and community — all in one app."),
      image: doginLogo,
      features: Array.isArray(t('projects.items.dogin.features', { returnObjects: true }))
        ? (t('projects.items.dogin.features', { returnObjects: true }) as string[])
        : ["AI Health Assistant", "Veterinary Booking", "Pet Matchmaking", "Grooming Services", "Pet Marketplace", "Lost & Found", "Community Hub"],
      gradient: 'from-red-500 to-orange-600',
      accentColor: 'primary',
      url: 'https://dogin-chi.vercel.app/',
      stageKey: 'phase5',
      statusKey: 'production',
      phase: 5,
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
      <section id="projects" className="py-16 md:py-32 relative overflow-hidden">
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
        <div className="absolute inset-0 grid-pattern opacity-65 pointer-events-none" />

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
        <div className="relative w-full mt-12 md:mt-24 mb-8 md:mb-20 max-w-7xl mx-auto px-4 md:px-8">
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
