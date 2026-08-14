import { motion, useReducedMotion } from 'framer-motion';
import FadeThrough from '@/components/smoothui/fade-through';
import { CinematicIndianFlag } from '@/components/three/CinematicIndianFlag';

const FREEDOM_FIGHTERS = [
  { name: 'Netaji Subhash Chandra Bose', role: 'Leader of the Azad Hind Fauj' },
  { name: 'Bhagat Singh', role: 'Shaheed-e-Azam & Revolutionary' },
  { name: 'Sardar Vallabhbhai Patel', role: 'Iron Man of India & Architect of United India' },
  { name: 'Mahatma Gandhi', role: 'Father of the Nation' },
  { name: 'Dr. B. R. Ambedkar', role: 'Architect of the Constitution' },
  { name: 'Rani Lakshmibai', role: 'Queen of Jhansi & 1857 Pioneer' },
  { name: 'Chandrashekhar Azad', role: 'Fearless Revolutionary Leader' },
  { name: 'Alluri Sitarama Raju', role: 'Hero of the Jungle Uprising' },
  { name: 'Pingali Venkayya', role: 'Designer of the National Flag' },
  { name: 'Sarojini Naidu', role: 'Nightingale of India' },
  { name: 'Mangal Pandey', role: 'Hero of the 1857 Uprising' },
  { name: 'Bal Gangadhar Tilak', role: 'Lokmanya ("Swaraj is My Birthright")' },
  { name: 'Ashfaqulla Khan', role: 'Kakori Revolutionary & Martyr' },
  { name: 'Lala Lajpat Rai', role: 'Punjab Kesari' },
  { name: 'Veer Savarkar', role: 'Freedom Fighter & Reformer' },
  { name: 'Begum Hazrat Mahal', role: 'Leader of Awadh Resistance' },
  { name: 'Sukhdev & Rajguru', role: 'Revolutionary Comrades & Martyrs' },
  { name: 'Tanguturi Prakasam', role: 'Andhra Kesari' },
  { name: 'Kittur Chennamma', role: 'Warrior Queen of Kittur' },
  { name: 'Subramania Bharati', role: 'Mahakavi & Nationalist Poet' },
  { name: 'Udham Singh', role: 'Patriot & Revolutionary Martyr' },
  { name: 'Maulana Abul Kalam Azad', role: 'First Education Minister & Freedom Leader' },
];

export const IndependenceDayHero = () => {
  const reduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();
  const yearsCompleted = currentYear - 1947;
  const editionOrdinal = yearsCompleted + 1;

  // Duplicating for seamless infinite marquee loop
  const tickerItems = [...FREEDOM_FIGHTERS, ...FREEDOM_FIGHTERS];

  return (
    <section className="independence-hero" aria-labelledby="independence-title">
      {/* 3D Indian Flag occupying 100% full background */}
      <CinematicIndianFlag />

      {/* Subtle top & bottom lighting gradients for text contrast */}
      <div className="independence-overlay-vignette" aria-hidden="true" />

      {/* Center Celebration Content (Directly on Flag, No Container Box) */}
      <div className="independence-content-wrapper">
        <motion.div
          className="independence-direct-text-wrapper"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Milestone Badge with dynamically computed years and diamond/rhombus accents */}
          <motion.div
            className="independence-badge"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="badge-rhombus orange-rhombus" />
            <span>
              15th August · {yearsCompleted} Years of Freedom (1947–{currentYear})
            </span>
            <span className="badge-rhombus green-rhombus" />
          </motion.div>

          <div className="independence-copy-block">
            <p className="independence-eyebrow">
              Siddhi Dynamics · Proudly Indian
            </p>
            <h1 id="independence-title">
              Happy Independence Day
              <span className="independence-subtitle">
                Celebrating India&apos;s {editionOrdinal}th Independence Day
              </span>
            </h1>

            <div className="independence-rotating-copy" aria-label="Our promise to India">
              <span className="promise-prefix">We build to</span>
              <FadeThrough
                interval={2800}
                phrases={[
                  'empower Indian businesses.',
                  'innovate deep-tech in India.',
                  'build autonomous AI for India.',
                  'create a self-reliant India.',
                ]}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Freedom Fighters Scrolling Marquee Ticker with Rhombus & Highlighted Typography */}
      <div className="independence-tribute-ticker-container">
        <div className="independence-tribute-label">
          <span className="tribute-rhombus-accent">◆</span>
          <span className="tribute-flag-icon">🇮🇳</span>
          <span className="tribute-headline-text">TRIBUTE TO OUR FREEDOM FIGHTERS</span>
          <span className="tribute-rhombus-accent">◆</span>
        </div>
        <div className="independence-marquee-wrapper">
          <div className="independence-marquee-track">
            {tickerItems.map((fighter, idx) => (
              <div key={`${fighter.name}-${idx}`} className="tribute-pill">
                <span className="tribute-pill-rhombus">◆</span>
                <strong className="fighter-name">{fighter.name}</strong>
                <span className="fighter-role">({fighter.role})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

