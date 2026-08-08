import { ArrowUpRight, MapPin, MessageSquareQuote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const GOOGLE_REVIEW_URL = 'https://g.page/r/CQ8YjZSqkk-5EBM/review';

type GoogleReviewCardProps = {
  audience?: 'client' | 'investor' | 'visitor';
  name?: string;
  compact?: boolean;
};

const copy = {
  client: {
    eyebrow: 'Your experience matters',
    title: 'Built something great with Siddhi?',
    description:
      'Whether you joined us as a client, investor, or partner, tell others about your genuine experience on Google.',
    prompts: ['software solutions', 'business collaboration', 'Siddhi Dynamics LLP'],
  },
  investor: {
    eyebrow: 'Shape the Siddhi story',
    title: 'Your words help great ideas find us.',
    description:
      'Whether you joined us as a client, investor, or partner, tell others about your genuine experience on Google.',
    prompts: ['software solutions', 'business collaboration', 'Siddhi Dynamics LLP'],
  },
  visitor: {
    eyebrow: 'Worked with Siddhi Dynamics?',
    title: 'Your words help great ideas find us.',
    description:
      'Whether you joined us as a client, investor, or partner, tell others about your genuine experience on Google.',
    prompts: ['software solutions', 'business collaboration', 'Siddhi Dynamics LLP'],
  },
};

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export function GoogleReviewCard({
  audience = 'visitor',
  name,
  compact = false,
}: GoogleReviewCardProps) {
  const content = copy[audience];

  if (compact) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        aria-label="Google review invitation"
        className="relative overflow-hidden rounded-2xl border border-amber-400/30 px-5 py-4 shadow-lg glass-card flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, #110e07 0%, #0d0d10 50%, #080a0d 100%)',
        }}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex items-center gap-1 shrink-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" />
            ))}
          </div>
          <div className="min-w-0 text-left">
            <h3 className="text-xs font-extrabold text-white truncate flex items-center gap-2">
              <span>Rate Your Experience with Siddhi Dynamics</span>
            </h3>
            <p className="text-[11px] text-amber-200/80 truncate">
              {name ? `Thank you, ${name} · Share your feedback on Google` : 'Share your genuine review on Google'}
            </p>
          </div>
        </div>

        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-black shadow-md shadow-amber-400/20 transition-all hover:scale-105 hover:bg-amber-300 active:scale-95"
          aria-label="Review us on Google"
        >
          <GoogleLogo />
          Review us on Google
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Google review invitation"
      className="relative overflow-hidden rounded-3xl border border-amber-400/30 px-6 py-9 md:px-10 shadow-[0_8px_60px_rgba(245,158,11,0.12)]"
      style={{
        background: 'linear-gradient(135deg, #110e07 0%, #0d0d10 50%, #080a0d 100%)',
      }}
    >
      {/* Glowing orbs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-amber-500/5 blur-2xl" />

      {/* 5-star row */}
      <div className="relative mb-5 flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
        ))}
        <span className="ml-2 text-xs font-bold text-amber-300 tracking-wide uppercase">Google Reviews</span>
      </div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
            <MessageSquareQuote className="h-4 w-4" />
            {name ? `Thank you, ${name}` : content.eyebrow}
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {content.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{content.description}</p>
        </div>

        {/* CTA Button */}
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-amber-400 px-6 py-3.5 text-sm font-extrabold text-black shadow-lg shadow-amber-400/30 transition-all hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-amber-400/50 active:scale-95"
          aria-label="Write an honest review for Siddhi Dynamics LLP on Google"
        >
          <GoogleLogo />
          Review us on Google
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Footer location */}
      <p className="relative mt-6 flex items-center gap-1.5 text-[11px] text-slate-500">
        <MapPin className="h-3.5 w-3.5 text-slate-600" />
        Siddhi Dynamics LLP · Nizamabad, Telangana
      </p>
    </motion.section>
  );
}
