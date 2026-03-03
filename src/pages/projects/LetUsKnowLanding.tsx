
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    MessageSquare,
    MapPin,
    FileText,
    AlertTriangle,
    Mic,
    Users,
    Building2,
    BookOpen,
    Palmtree,
    ArrowLeft,
    Search,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { WaitlistModal } from '@/components/WaitlistModal';

const LetUsKnowLanding = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <MessageSquare className="w-8 h-8 text-cyan-400" />,
            title: t('letusknow_landing.features.chatbot.title'),
            desc: t('letusknow_landing.features.chatbot.desc'),
            border: "border-cyan-500/30",
            bg: "bg-cyan-500/5"
        },
        {
            icon: <MapPin className="w-8 h-8 text-rose-400" />,
            title: t('letusknow_landing.features.local.title'),
            desc: t('letusknow_landing.features.local.desc'),
            border: "border-rose-500/30",
            bg: "bg-rose-500/5"
        },
        {
            icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
            title: t('letusknow_landing.features.report.title'),
            desc: t('letusknow_landing.features.report.desc'),
            border: "border-amber-500/30",
            bg: "bg-amber-500/5"
        },
        {
            icon: <FileText className="w-8 h-8 text-emerald-400" />,
            title: t('letusknow_landing.features.parser.title'),
            desc: t('letusknow_landing.features.parser.desc'),
            border: "border-emerald-500/30",
            bg: "bg-emerald-500/5"
        },
        {
            icon: <Mic className="w-8 h-8 text-purple-400" />,
            title: t('letusknow_landing.features.voice.title'),
            desc: t('letusknow_landing.features.voice.desc'),
            border: "border-purple-500/30",
            bg: "bg-purple-500/5"
        },
        {
            icon: <Search className="w-8 h-8 text-blue-400" />,
            title: t('letusknow_landing.features.track.title'),
            desc: t('letusknow_landing.features.track.desc'),
            border: "border-blue-500/30",
            bg: "bg-blue-500/5"
        }
    ];

    const directories = [
        { icon: <Users className="w-5 h-5" />, label: t('letusknow_landing.directories.reps') },
        { icon: <Building2 className="w-5 h-5" />, label: t('letusknow_landing.directories.depts') },
        { icon: <BookOpen className="w-5 h-5" />, label: t('letusknow_landing.directories.guides') },
        { icon: <Palmtree className="w-5 h-5" />, label: t('letusknow_landing.directories.tourism') },
    ];

    return (
        <div className="min-h-screen font-sans bg-slate-950 text-foreground selection:bg-cyan-900 overflow-x-hidden">
            <Helmet>
                <title>Let Us Know | AI-Powered Civic & Governance Assistant</title>
                <meta name="description" content="Your personal guide to local governance. Verify projects, report issues, and access verified government contacts with our AI civic assistant." />
            </Helmet>
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950 z-0" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/50 to-slate-950 z-0" />

                    <div className="container mx-auto px-6 relative z-10">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/')}
                            className="absolute -top-20 left-4 md:left-0 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('letusknow_landing.hero.back')}
                        </motion.button>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold mb-6 mt-16 lg:mt-0">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                    </span>
                                    AI For Governance
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display tracking-tight text-white leading-tight">
                                    {t('letusknow_landing.hero.title')}
                                </h1>
                                <p className="text-2xl md:text-3xl text-cyan-200/80 mb-6 font-light">
                                    {t('letusknow_landing.hero.tagline')}
                                </p>
                                <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
                                    {t('letusknow_landing.hero.desc')}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => setIsWaitlistOpen(true)}
                                        className="px-8 py-4 bg-cyan-600 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_40px_rgba(8,145,178,0.5)] hover:bg-cyan-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        <MapPin className="w-5 h-5" />
                                        {t('letusknow_landing.hero.cta')}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                {/* Chat Interface Mockup */}
                                <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl max-w-md mx-auto">
                                    <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                                        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">Civic Assistant</div>
                                            <div className="text-xs text-green-400 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                Online
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-none text-slate-300 text-sm">
                                            Hello! I'm your AI guide. How can I verify a project or help you today?
                                        </div>
                                        <div className="bg-cyan-900/30 border border-cyan-800/50 rounded-2xl p-4 rounded-tr-none text-cyan-100 text-sm ml-auto max-w-[85%]">
                                            How do I apply for a birth certificate in Hyderabad?
                                        </div>
                                        <div className="bg-slate-800 rounded-2xl p-4 rounded-tl-none text-slate-300 text-sm">
                                            Here is the step-by-step process verified from official sources:
                                            <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-slate-400">
                                                <li>Visit the <span className="text-cyan-400 font-medium">MeeSeva Portal</span>.</li>
                                                <li>Select "Revenue Department".</li>
                                                <li>Fill Form No. 201.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled
                                            placeholder="Ask anything..."
                                            className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-sm text-slate-400 focus:ring-0 cursor-not-allowed"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-600 rounded-lg">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Blobs */}
                                <div className="absolute -top-10 -right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
                                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-slate-950 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-white">
                                {t('letusknow_landing.features.title')}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-8 rounded-2xl border ${feature.border} ${feature.bg} backdrop-blur-sm hover:-translate-y-1 transition-transform group`}
                                >
                                    <div className="mb-6 bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center border border-slate-800 shadow-lg">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Directories Section */}
                <section className="py-20 border-t border-slate-800 bg-slate-900/50">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 p-10 rounded-3xl border border-white/5">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{t('letusknow_landing.directories.title')}</h3>
                                <p className="text-slate-400">Instant access to verified government contacts and guides.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                {directories.map((dir, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors cursor-default">
                                        {dir.icon}
                                        <span className="font-medium text-sm">{dir.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 text-center bg-slate-950">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
                            Your personal guide to local governance.
                        </h2>
                        <button
                            onClick={() => setIsWaitlistOpen(true)}
                            className="px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-cyan-500/25 transition-all hover:-translate-y-1"
                        >
                            Get Early Access
                        </button>
                    </div>
                </section>
            </main>

            <FooterSection />
            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                projectId="letusknow"
                projectName="Let Us Know"
                accentColor="accent"
            />
        </div>
    );
};

export default LetUsKnowLanding;
