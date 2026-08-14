import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import KineticCenterBuild from '@/components/smoothui/kinetic-center-build';
import { 
  GraduationCap, 
  Heart, 
  Home, 
  Landmark, 
  LucideIcon, 
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
import { LikeButton } from '@/components/ui/LikeButton';

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
  { bg: '#FFF1B8', darkBg: '#3A2A08', edge: '#D69E2E', darkEdge: '#EAB54D', ink: '#2B2112', darkInk: '#FFF2C7', icon: '#F9D56E', darkIcon: '#6B4A0E', shadow: 'rgba(214, 158, 46, 0.26)', darkShadow: 'rgba(234, 181, 77, 0.22)' },
  { bg: '#DDEBFF', darkBg: '#102846', edge: '#4C78B8', darkEdge: '#78A7E8', ink: '#13233D', darkInk: '#DCEBFF', icon: '#AFCBFF', darkIcon: '#1F4B7C', shadow: 'rgba(76, 120, 184, 0.26)', darkShadow: 'rgba(120, 167, 232, 0.22)' },
  { bg: '#DDF7EA', darkBg: '#0E3124', edge: '#2F9E74', darkEdge: '#63D6A5', ink: '#102C22', darkInk: '#DDFCEF', icon: '#A7E4C2', darkIcon: '#15583D', shadow: 'rgba(47, 158, 116, 0.26)', darkShadow: 'rgba(99, 214, 165, 0.2)' },
  { bg: '#FFE4BF', darkBg: '#3A210B', edge: '#C7792A', darkEdge: '#E8A453', ink: '#321F0D', darkInk: '#FFE7C7', icon: '#FFC980', darkIcon: '#70400D', shadow: 'rgba(199, 121, 42, 0.25)', darkShadow: 'rgba(232, 164, 83, 0.2)' },
  { bg: '#E5E0FF', darkBg: '#211A42', edge: '#705BC7', darkEdge: '#A392F4', ink: '#201A3F', darkInk: '#E8E2FF', icon: '#C8BDFF', darkIcon: '#3A2D7A', shadow: 'rgba(112, 91, 199, 0.25)', darkShadow: 'rgba(163, 146, 244, 0.22)' },
  { bg: '#FFDDE8', darkBg: '#3A1423', edge: '#C9567B', darkEdge: '#F184A8', ink: '#3B1421', darkInk: '#FFE0EA', icon: '#FFB4CB', darkIcon: '#7A2845', shadow: 'rgba(201, 86, 123, 0.24)', darkShadow: 'rgba(241, 132, 168, 0.22)' },
  { bg: '#D9F3F6', darkBg: '#0E3035', edge: '#278A96', darkEdge: '#61C9D4', ink: '#0E2A2E', darkInk: '#DDFBFF', icon: '#A8DFE6', darkIcon: '#155866', shadow: 'rgba(39, 138, 150, 0.24)', darkShadow: 'rgba(97, 201, 212, 0.2)' },
  { bg: '#E9E3D2', darkBg: '#2C2619', edge: '#8F7651', darkEdge: '#C4A36F', ink: '#2F2619', darkInk: '#EFE4C9', icon: '#D5C49C', darkIcon: '#5C492B', shadow: 'rgba(143, 118, 81, 0.24)', darkShadow: 'rgba(196, 163, 111, 0.2)' },
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

const defaultProjectLikes: Record<string, number> = {
  archplan: 154,
  nexus: 198,
  nilayam: 126,
  indhur_farms: 84,
  print_flow: 72,
  wish0: 145,
  letusknow: 93,
  dogin: 167,
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
  // Natural paper tilt variation
  const noteRotate = (index % 2 === 0 ? -1.8 : 1.8) * ((index % 3) * 0.6 + 0.8);
  const tapeRotate = ((index % 4) - 1.5) * 1.8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{
        y: -10,
        scale: 1.03,
        rotate: noteRotate * 0.5,
        transition: { type: 'spring', stiffness: 300, damping: 18 },
      }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={onClick}
      className="relative w-full max-w-xs mx-auto min-h-[210px] sm:min-h-0 sm:aspect-square cursor-pointer group select-none flex flex-col"
      style={{
        transform: `rotate(${noteRotate}deg)`,
      }}
    >
      {/* Semi-Transparent Frosted Washi Tape Strip holding the slip */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 sm:w-28 h-5 sm:h-7 z-30 pointer-events-none transition-transform duration-300 group-hover:scale-105"
        style={{
          transform: `translateX(-50%) rotate(${tapeRotate}deg)`,
        }}
      >
        <div
          className="w-full h-full rounded-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.18)] opacity-85 backdrop-blur-sm"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(240,240,235,0.55) 100%)',
            borderLeft: '2px dotted rgba(0,0,0,0.2)',
            borderRight: '2px dotted rgba(0,0,0,0.2)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 5px rgba(0,0,0,0.15)',
          }}
        >
          {/* Subtle tape texture line */}
          <div className="w-full h-[1px] bg-white/40 mt-0.5 sm:mt-1" />
        </div>
      </div>

      {/* Realistic Paper Slip Body */}
      <div
        className="relative w-full h-full flex-1 p-3 sm:p-5 flex flex-col items-center text-center transition-all duration-300 overflow-hidden justify-between"
        style={{
          background: `linear-gradient(155deg, ${palette.bg} 0%, ${palette.bg} 60%, color-mix(in srgb, ${palette.bg} 82%, #e2d5ba 18%) 100%)`,
          boxShadow: `
            0 1px 2px rgba(0, 0, 0, 0.08),
            0 8px 18px -4px rgba(0, 0, 0, 0.16),
            0 24px 38px -8px ${palette.shadow}
          `,
          border: `1px solid ${palette.edge}`,
          borderRadius: '4px 4px 28px 4px',
        }}
      >
        {/* Subtle Horizontal Notebook Ruled Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 25px, rgba(0, 0, 0, 0.05) 26px)',
            backgroundPosition: '0 38px',
          }}
        />

        {/* Top Perforation Tear Line */}
        <div className="absolute top-2 left-3 right-3 sm:left-4 sm:right-4 h-[1px] border-b border-dashed border-black/15 pointer-events-none" />

        {/* Realistic 3D Dog-Ear Paper Corner Curl (Bottom-Right) */}
        <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-10 sm:h-10 pointer-events-none overflow-hidden z-20">
          {/* Fold Cast Shadow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, transparent 48%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.32) 100%)',
            }}
          />
          {/* Folded Paper Triangle Flap */}
          <div
            className="absolute bottom-0 right-0 w-full h-full"
            style={{
              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
              background: `linear-gradient(135deg, color-mix(in srgb, ${palette.bg} 85%, #fff 15%) 0%, color-mix(in srgb, ${palette.bg} 70%, #d5c8a8 30%) 100%)`,
              boxShadow: '-2px -2px 6px rgba(0,0,0,0.18)',
            }}
          />
        </div>

        {/* Project Stamp / Code Watermark */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[8px] sm:text-[9px] font-mono font-bold tracking-widest opacity-40 uppercase select-none">
          #SD-0{index + 1}
        </div>

        {/* Slip Content */}
        <div
          className="relative z-10 w-full flex flex-col items-center pt-1 sm:pt-2 flex-1"
          style={{ color: palette.ink }}
        >
          {/* Logo / Icon */}
          <div
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center ${project.iconBgClass || ''} ${project.iconColorClass || ''} mb-1.5 sm:mb-2.5 overflow-hidden shadow-sm shrink-0 border border-black/10`}
            style={{
              background: project.image ? '#ffffff' : palette.icon,
            }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} logo`}
                width="56"
                height="56"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              IconComponent && <IconComponent className="w-5 h-5 sm:w-7 sm:h-7" />
            )}
          </div>

          {/* Title — shrink-0 ensures title is never squeezed out */}
          <h3 className="shrink-0 text-sm sm:text-base md:text-lg font-black mb-0.5 sm:mb-1 font-display leading-tight line-clamp-1 sm:line-clamp-2">
            {project.name}
          </h3>

          {/* Tagline */}
          <p className="text-[10px] sm:text-xs font-semibold mb-2 font-sans line-clamp-2 sm:line-clamp-3 opacity-80 leading-tight">
            {project.tagline}
          </p>

          {/* Footer of Slip */}
          <div className="mt-auto w-full flex items-center justify-between pt-1 border-t border-black/10">
            <LikeButton projectId={project.id} initialCount={defaultProjectLikes[project.id] || 80} className="scale-75 sm:scale-85 origin-left" />
            <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-black opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-all uppercase tracking-wider">
              <span>View</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
          </div>
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
  const IconComponent = project.icon;
  const palette = modalPalettes[project.id] ?? modalPalettes.archplan;

  // Resolve display and target URL
  const projectUrls: Record<string, { url: string; displayUrl: string; isExternal: boolean }> = {
    archplan: { url: 'https://archplan.lovable.app', displayUrl: 'archplan.lovable.app', isExternal: true },
    nexus: { url: 'https://nexuscareers.in', displayUrl: 'nexuscareers.in', isExternal: true },
    nilayam: { url: '/project/nilayam', displayUrl: 'nilayam.siddhidynamics.in', isExternal: false },
    indhur_farms: { url: 'https://saivara1341.github.io/indhur-farms/', displayUrl: 'indhurfarms.com', isExternal: true },
    print_flow: { url: 'https://printflows.in/', displayUrl: 'printflows.in', isExternal: true },
    wish0: { url: '/project/wish-o', displayUrl: 'wish0.siddhidynamics.in', isExternal: false },
    letusknow: { url: '/project/letusknow', displayUrl: 'letusknow.siddhidynamics.in', isExternal: false },
    dogin: { url: 'https://dogin-chi.vercel.app/', displayUrl: 'dogin-chi.vercel.app', isExternal: true },
  };

  const currentProjectUrl = projectUrls[project.id] || {
    url: project.url || '#',
    displayUrl: project.url ? project.url.replace(/^https?:\/\//, '') : `${project.id}.siddhidynamics.in`,
    isExternal: Boolean(project.url),
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentProjectUrl.isExternal) {
      window.open(currentProjectUrl.url, '_blank', 'noopener,noreferrer');
    } else if (currentProjectUrl.url.startsWith('/')) {
      window.scrollTo(0, 0);
      navigate(currentProjectUrl.url);
      onClose();
    } else {
      onWaitlistClick(project.id, project.name, project.accentColor as 'primary' | 'accent');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4">
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
        className="relative w-full max-w-2xl border rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh] z-10"
        style={{
          background: palette.bg,
          borderColor: palette.border,
          boxShadow: `0 28px 80px ${palette.shadow}`,
          color: palette.text,
        }}
      >
        {/* Ambient Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 20% 10%, ${palette.accentSoft} 0%, transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.35), transparent 70%)`,
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border transition-all cursor-pointer z-50 hover:scale-105"
          style={{
            backgroundColor: palette.accentSoft,
            borderColor: palette.border,
            color: palette.text,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          {/* Header Section with right padding for Close Button */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-5 text-center sm:text-left mt-1 pr-10">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-md"
              style={{
                backgroundColor: '#ffffff',
                border: `1.5px solid ${palette.border}`,
              }}
            >
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.name} logo`}
                  width="80"
                  height="80"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                IconComponent && <IconComponent className="w-10 h-10" style={{ color: palette.accent }} strokeWidth={1.75} />
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight" style={{ color: palette.text }}>
                  {project.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-sm"
                  style={{
                    backgroundColor: palette.accentSoft,
                    borderColor: palette.border,
                    color: palette.accent,
                  }}
                >
                  {t(`projects.statuses.${project.statusKey}`)}
                </span>
              </div>
              <p className="text-sm font-semibold mb-2.5" style={{ color: palette.accent }}>
                {project.tagline}
              </p>
              <div className="flex items-center gap-2">
                <LikeButton projectId={project.id} initialCount={defaultProjectLikes[project.id] || 80} />
              </div>
            </div>
          </div>

          {/* Development Roadmap Trackline Pipe */}
          <div
            className="mb-5 p-4 border rounded-2xl backdrop-blur shadow-sm"
            style={{
              backgroundColor: palette.panel,
              borderColor: palette.border,
            }}
          >
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: palette.muted }}>
                Development Roadmap Pipeline
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: palette.accent }}>
                {t(`projects.stages.${project.stageKey}`)}
              </span>
            </div>

            <div className="relative pt-2 pb-2">
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
                          boxShadow: isCompleted ? `0 0 10px ${palette.shadow}` : undefined,
                        }}
                      >
                        {step}
                        {isCurrent && (
                          <motion.div
                            animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="absolute inset-0 rounded-full -z-10"
                            style={{ backgroundColor: palette.accent }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trackline Pipe */}
              <div className="absolute top-5 left-0 right-0 h-1.5 rounded-full z-0 px-2" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((project.phase - 1) / 4) * 100}%`,
                    backgroundColor: palette.accent,
                    boxShadow: `0 0 8px ${palette.accent}`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Aesthetic Embedded Website / Landing Page Box */}
          <div
            className="mb-5 border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group/box"
            style={{
              backgroundColor: '#0f172a',
              borderColor: palette.border,
            }}
          >
            {/* Browser / Portal Top Bar */}
            <div
              className="px-4 py-2.5 border-b flex items-center justify-between gap-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Traffic light dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              {/* URL Address Bar with click-to-open */}
              <div
                onClick={handleActionClick}
                className="flex-1 max-w-sm mx-auto px-3 py-1 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 border shadow-inner text-slate-800 bg-slate-50 cursor-pointer hover:bg-white transition-colors"
                style={{ borderColor: 'rgba(0, 0, 0, 0.15)' }}
                title="Click to open portal"
              >
                <span className="text-[10px] text-emerald-600">🔒</span>
                <span className="truncate font-semibold">{currentProjectUrl.displayUrl}</span>
                <ExternalLink className="w-3 h-3 text-slate-400 ml-1 shrink-0" />
              </div>

              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hidden sm:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Preview
              </span>
            </div>

            {/* Embedded Live Website Landing Page */}
            <div className="relative w-full h-[360px] sm:h-[430px] bg-slate-950 overflow-hidden">
              <iframe
                src={currentProjectUrl.url}
                title={`${project.name} live landing page preview`}
                className="w-full h-full border-0 bg-white"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />

              {/* Top-right quick access button */}
              <button
                onClick={handleActionClick}
                className="absolute top-3 right-3 px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md border border-white/30 text-white transition-transform hover:scale-105 cursor-pointer z-20"
                style={{
                  background: palette.button,
                  boxShadow: `0 4px 14px ${palette.shadow}`,
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Access Portal</span>
              </button>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t flex flex-col sm:flex-row gap-3" style={{ borderColor: palette.border }}>
            <button
              onClick={handleActionClick}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer hover:opacity-95"
              style={{
                background: palette.button,
                color: palette.buttonText,
                boxShadow: `0 10px 24px ${palette.shadow}`,
              }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Access Portal ({currentProjectUrl.displayUrl})</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer hover:bg-black/5"
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
      <section id="projects" className="py-10 md:py-32 relative overflow-hidden">
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
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-6 md:mb-16"
          >
            <motion.span
              className="inline-block text-accent font-medium text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 md:mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('projects.title')}
            </motion.span>

            <h2 className="mb-3 md:mb-6 font-display overflow-visible py-1">
              {isInView ? (
                <KineticCenterBuild
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight gradient-text-reverse glow-text-accent pb-1 pt-1 inline-block leading-tight md:leading-normal overflow-visible"
                  phrases={["Building the Future"]}
                />
              ) : (
                <span aria-hidden="true" className="invisible text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold pb-1 pt-1 inline-block leading-tight md:leading-normal">
                  Building the Future
                </span>
              )}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
              <Trans
                i18nKey="projects.description"
                components={[
                  <strong className="text-foreground font-semibold" key="0" />
                ]}
              />
            </p>
          </motion.div>

        {/* Sticky Notes Grid */}
        <div className="relative w-full mt-6 md:mt-16 mb-6 md:mb-16 max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
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
