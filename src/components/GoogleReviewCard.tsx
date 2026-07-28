import { ArrowUpRight, MapPin, MessageSquareQuote, Star } from 'lucide-react';

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
    description: 'Share an honest Google review about your project experience. Mentioning the service we delivered helps future clients find the right team.',
    prompts: ['software development', 'web application', 'project delivery'],
  },
  investor: {
    eyebrow: 'Shape the Siddhi story',
    title: 'Partnered or invested with us?',
    description: 'Share an honest Google review about your experience with our team. A few words about the collaboration or venture support are especially helpful.',
    prompts: ['investor relations', 'venture collaboration', 'innovation support'],
  },
  visitor: {
    eyebrow: 'Worked with Siddhi Dynamics?',
    title: 'Your words help great ideas find us.',
    description: 'Whether you joined us as a client, investor, or partner, tell others about your genuine experience on Google.',
    prompts: ['software solutions', 'business collaboration', 'Siddhi Dynamics LLP'],
  },
};

export function GoogleReviewCard({
  audience = 'visitor',
  name,
  compact = false,
}: GoogleReviewCardProps) {
  const content = copy[audience];

  return (
    <section
      aria-label="Google review invitation"
      className={`relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-br from-[#12100a] via-[#0d0d10] to-[#08080a] text-white shadow-[0_20px_70px_rgba(245,158,11,0.10)] ${
        compact ? 'px-6 py-7' : 'px-6 py-9 md:px-10'
      }`}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
            <MessageSquareQuote className="h-4 w-4" />
            {name ? `Thank you, ${name}` : content.eyebrow}
          </div>
          <h2 className={`${compact ? 'text-2xl' : 'text-2xl md:text-3xl'} font-black tracking-tight`}>
            {content.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">{content.description}</p>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Helpful topics to mention">
            {content.prompts.map((prompt) => (
              <span
                key={prompt}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-medium text-slate-300"
              >
                {prompt}
              </span>
            ))}
          </div>
        </div>

        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-black shadow-lg shadow-amber-400/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
          aria-label="Write an honest review for Siddhi Dynamics LLP on Google"
        >
          <span className="flex" aria-hidden="true">
            {[0, 1, 2].map((item) => (
              <Star key={item} className="h-4 w-4 fill-current" />
            ))}
          </span>
          Review us on Google
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
      <p className="relative mt-5 flex items-center gap-1.5 text-[10px] text-slate-500">
        <MapPin className="h-3 w-3" />
        Siddhi Dynamics LLP · Nizamabad, Telangana
      </p>
    </section>
  );
}
