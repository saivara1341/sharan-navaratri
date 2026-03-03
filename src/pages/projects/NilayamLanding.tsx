
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ScrollText,
    Store,
    User,
    CreditCard,
    Wrench,
    Home,
    CheckCircle2,
    UserCircle2,
    TrendingUp,
    Users,
    Sparkles,
    Globe,
    ArrowLeft
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { WaitlistModal } from '@/components/WaitlistModal';

// --- Local Helper Components for Landing Page ---

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: delay / 1000, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: string }> = ({ icon, title, description, color }) => (
    <div className="bg-white/5 dark:bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300 group h-full backdrop-blur-sm">
        <div className={`h-12 w-12 rounded-2xl ${color} shadow-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 text-white`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

const HeroModule: React.FC<{ icon: React.ReactNode, label: string, sublabel: string }> = ({ icon, label, sublabel }) => (
    <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg w-full">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/50 text-white shadow-xl">
            {icon}
        </div>
        <div className="text-left">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-base font-bold text-foreground">{sublabel}</p>
        </div>
    </div>
);

const NilayamLanding: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'owners' | 'tenants'>('owners');
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const { t } = useTranslation();

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const ownerFeatures = [
        { icon: <LayoutDashboard className="w-6 h-6" />, title: t('landing.feature.command.title'), description: t('landing.feature.command.desc'), color: "bg-blue-500" },
        { icon: <Users className="w-6 h-6" />, title: t('landing.feature.tracking.title'), description: t('landing.feature.tracking.desc'), color: "bg-indigo-500" },
        { icon: <TrendingUp className="w-6 h-6" />, title: t('landing.feature.finance.title'), description: t('landing.feature.finance.desc'), color: "bg-emerald-500" },
        { icon: <Sparkles className="w-6 h-6" />, title: t('landing.feature.predict.title'), description: t('landing.feature.predict.desc'), color: "bg-amber-500" },
    ];

    const tenantFeatures = [
        { icon: <User className="w-6 h-6" />, title: t('landing.feature.portal.title'), description: t('landing.feature.portal.desc'), color: "bg-blue-500" },
        { icon: <CreditCard className="w-6 h-6" />, title: t('landing.feature.payments.title'), description: t('landing.feature.payments.desc'), color: "bg-green-500" },
        { icon: <Wrench className="w-6 h-6" />, title: t('landing.feature.visual.title'), description: t('landing.feature.visual.desc'), color: "bg-amber-500" },
    ];

    const heroModules = [
        { icon: <CheckCircle2 className="w-6 h-6 text-green-400" />, label: t('landing.marquee.managed'), sublabel: t('landing.marquee.property') },
        { icon: <UserCircle2 className="w-6 h-6 text-blue-400" />, label: t('landing.marquee.tenant'), sublabel: t('landing.marquee.scorecard') },
        { icon: <ScrollText className="w-6 h-6 text-indigo-400" />, label: t('landing.marquee.lease'), sublabel: t('landing.marquee.document') },
        { icon: <CreditCard className="w-6 h-6 text-teal-400" />, label: t('landing.marquee.rent'), sublabel: t('landing.marquee.collection') },
        { icon: <TrendingUp className="w-6 h-6 text-rose-400" />, label: t('landing.marquee.contact'), sublabel: t('landing.marquee.analytics') },
        { icon: <Store className="w-6 h-6 text-amber-400" />, label: t('landing.marquee.market'), sublabel: t('landing.marquee.listings') },
    ];

    return (
        <div className="min-h-screen font-sans bg-background text-foreground selection:bg-blue-900 overflow-x-hidden">
            <Helmet>
                <title>Nilayam | AI-Powered Real Estate Solutions</title>
                <meta name="description" content="Transform real estate management with Nilayam's AI solutions. Automated property tracking, smart matching, and streamlined workflows." />
            </Helmet>
            <Navbar />

            <main className="">
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20">
                    <div className="absolute inset-0 -z-30">
                        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                            alt="Modern Luxury Property"
                            className="w-full h-full object-cover animate-scale-slow opacity-20"
                        />
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">

                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/')}
                            className="absolute -top-12 md:top-0 left-4 md:left-0 flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors z-20"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </motion.button>

                        <Reveal>
                            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                                <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">{t('landing.tagline')}</span>
                            </div>
                        </Reveal>

                        <Reveal delay={100}>
                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] mb-6 drop-shadow-sm font-display">
                                {t('landing.hero_title_1')}
                                <br className="hidden md:block" />
                                <span className="block mt-2 md:inline md:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 pb-2">
                                    {t('landing.hero_title_2')}
                                </span>
                            </h1>
                        </Reveal>

                        <Reveal delay={200}>
                            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed px-4 mt-6">
                                {t('landing.hero_desc')}
                            </p>
                        </Reveal>

                        <Reveal delay={300}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none px-4">
                                <button
                                    onClick={() => setIsWaitlistOpen(true)}
                                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 active:scale-95 transition-all"
                                >
                                    Join Waitlist
                                </button>
                            </div>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="mt-16 w-full max-w-6xl mx-auto [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] overflow-hidden">
                                <div className="flex w-max animate-marquee space-x-4 py-4">
                                    {[...heroModules, ...heroModules].map((mod, i) => (
                                        <div key={i} className="w-64 flex-shrink-0">
                                            <HeroModule icon={mod.icon} label={mod.label} sublabel={mod.sublabel} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                <section className="py-20 bg-black/20 relative">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <Reveal>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">{t('landing.features_title')}</h2>
                                <p className="text-muted-foreground text-lg">
                                    {t('landing.features_desc')}
                                </p>
                            </Reveal>
                            <Reveal delay={200}>
                                <div className="flex justify-center mt-8">
                                    <div className="bg-black/40 p-1.5 rounded-full border border-white/10 shadow-sm flex relative">
                                        <button
                                            onClick={() => setActiveTab('owners')}
                                            className={`relative px-6 sm:px-10 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 ${activeTab === 'owners'
                                                ? 'text-background bg-foreground shadow-md'
                                                : 'text-muted-foreground hover:text-white'
                                                }`}
                                        >
                                            {t('landing.tab_owners')}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('tenants')}
                                            className={`relative px-6 sm:px-10 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10 ${activeTab === 'tenants'
                                                ? 'text-background bg-foreground shadow-md'
                                                : 'text-muted-foreground hover:text-white'
                                                }`}
                                        >
                                            {t('landing.tab_tenants')}
                                        </button>
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                            {activeTab === 'owners'
                                ? ownerFeatures.map((f, i) => <Reveal key={i} delay={i * 100}><FeatureCard {...f} /></Reveal>)
                                : tenantFeatures.map((f, i) => <Reveal key={i} delay={i * 100}><FeatureCard {...f} /></Reveal>)
                            }
                        </div>
                    </div>
                </section>

                <Reveal>
                    <section className="py-20 border-t border-white/5">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                                <div className="p-6 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                                    <div className="text-4xl sm:text-5xl font-extrabold text-blue-500 mb-2">98%</div>
                                    <div className="text-muted-foreground font-medium">{t('landing.stat_occupancy')}</div>
                                </div>
                                <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                                    <div className="text-4xl sm:text-5xl font-extrabold text-indigo-500 mb-2">2.5x</div>
                                    <div className="text-muted-foreground font-medium">{t('landing.stat_leasing')}</div>
                                </div>
                                <div className="p-6 bg-purple-500/10 rounded-3xl border border-purple-500/20">
                                    <div className="text-4xl sm:text-5xl font-extrabold text-purple-500 mb-2">100%</div>
                                    <div className="text-muted-foreground font-medium">{t('landing.stat_paperless')}</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                <Reveal>
                    <section className="py-24 text-center">
                        <div className="container mx-auto px-6">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-display">
                                Ready to simplify property management?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                                Join the waitlist to get early access to the Nilayam platform.
                            </p>
                            <button
                                onClick={() => setIsWaitlistOpen(true)}
                                className="px-10 py-5 bg-blue-600 text-white font-bold text-xl rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 active:scale-95 transition-all"
                            >
                                Join Waitlist
                            </button>
                        </div>
                    </section>
                </Reveal>

                <style>{`
                    @keyframes scaleSlow {
                        0% { transform: scale(1); }
                        100% { transform: scale(1.05); }
                    }
                    .animate-scale-slow {
                        animation: scaleSlow 20s linear infinite alternate;
                    }
                    @keyframes marquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        animation: marquee 40s linear infinite;
                    }
                `}</style>
            </main>
            <FooterSection />
            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                projectId="nilayam"
                projectName="Nilayam"
                accentColor="primary"
            />
        </div>
    );
};

export default NilayamLanding;
