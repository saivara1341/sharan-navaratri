
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    Heart,
    Calendar,
    Mic,
    PenTool,
    Send,
    Search,
    Star,
    Gift,
    PartyPopper,
    ArrowLeft,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { WaitlistModal } from '@/components/WaitlistModal';
import { LikeButton } from '@/components/ui/LikeButton';

const WishOLanding = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <Calendar className="w-8 h-8 text-pink-400" />,
            title: t('wisho_landing.features.collect.title'),
            desc: t('wisho_landing.features.collect.desc'),
            bg: "bg-pink-500/10",
            border: "border-pink-500/20"
        },
        {
            icon: <Mic className="w-8 h-8 text-purple-400" />,
            title: t('wisho_landing.features.voice.title'),
            desc: t('wisho_landing.features.voice.desc'),
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            icon: <Star className="w-8 h-8 text-amber-400" />,
            title: t('wisho_landing.features.generate.title'),
            desc: t('wisho_landing.features.generate.desc'),
            bg: "bg-amber-500/10",
            border: "border-amber-500/20"
        },
        {
            icon: <PenTool className="w-8 h-8 text-cyan-400" />,
            title: t('wisho_landing.features.design.title'),
            desc: t('wisho_landing.features.design.desc'),
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20"
        },
        {
            icon: <Send className="w-8 h-8 text-green-400" />,
            title: t('wisho_landing.features.send.title'),
            desc: t('wisho_landing.features.send.desc'),
            bg: "bg-green-500/10",
            border: "border-green-500/20"
        },
        {
            icon: <Search className="w-8 h-8 text-blue-400" />,
            title: t('wisho_landing.features.agent.title'),
            desc: t('wisho_landing.features.agent.desc'),
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        }
    ];

    const steps = [
        { icon: <Calendar className="w-6 h-6" />, label: t('wisho_landing.process.step1') },
        { icon: <Search className="w-6 h-6" />, label: t('wisho_landing.process.step2') },
        { icon: <Star className="w-6 h-6" />, label: t('wisho_landing.process.step3') },
        { icon: <Send className="w-6 h-6" />, label: t('wisho_landing.process.step4') },
    ];

    return (
        <div className="min-h-screen font-sans bg-[#0f0a14] text-foreground selection:bg-pink-900 overflow-x-hidden">
            <Helmet>
                <title>Wish-O | AI-Powered Celebration & Gifting Engine</title>
                <meta name="description" content="Celebrate smarter with Wish-O. AI-driven gift recommendations, automated wishes, and seamless celebration planning for every occasion." />
            </Helmet>
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/20 via-[#0f0a14] to-[#0f0a14] z-0" />
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px] animate-pulse delay-700" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/')}
                            className="absolute -top-16 left-4 md:left-0 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('wisho_landing.hero.back')}
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 font-bold">
                                    <Heart className="w-4 h-4 fill-current" />
                                    <span className="tracking-wide text-sm uppercase">The AI Celebration Engine</span>
                                </div>
                                <LikeButton projectId="wish0" initialCount={145} />
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 font-display tracking-tight leading-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-200 to-purple-400">
                                    {t('wisho_landing.hero.title')}
                                </span>
                            </h1>

                            <p className="text-2xl md:text-3xl text-pink-200/80 mb-8 font-light">
                                {t('wisho_landing.hero.tagline')}
                            </p>

                            <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                                {t('wisho_landing.hero.desc')}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button
                                    onClick={() => setIsWaitlistOpen(true)}
                                    className="px-10 py-5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] transition-all hover:-translate-y-1 flex items-center gap-3"
                                >
                                    <PartyPopper className="w-5 h-5" />
                                    {t('wisho_landing.hero.cta')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Core Idea Section */}
                <section className="py-24 relative bg-white/5 border-y border-white/5 backdrop-blur-sm">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold mb-6 font-display">{t('wisho_landing.core.title')}</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {t('wisho_landing.core.desc')}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-10 max-w-3xl mx-auto">
                                {['Google Contacts', 'Calendar', 'Canva', 'WhatsApp', 'AI Writer'].map((item, i) => (
                                    <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-200">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                                {t('wisho_landing.features.title')}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-8 rounded-3xl border ${feature.border} ${feature.bg} backdrop-blur-md hover:-translate-y-2 transition-transform duration-300 group`}
                                >
                                    <div className="mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Steps */}
                <section className="py-24 bg-gradient-to-b from-[#0f0a14] to-[#1a1025]">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-16 text-center font-display">
                            {t('wisho_landing.process.title')}
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-5xl mx-auto">
                            {steps.map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-center relative group">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-900/50 mb-6 group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold text-lg text-white">{step.label}</h3>

                                    {i < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-white/20 to-transparent" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-900/20 to-transparent pointer-events-none" />
                    <div className="container mx-auto px-6 relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            Start Celebrating Smarter
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                            Join the waitlist and let AI handle your special occasions perfectly.
                        </p>
                        <button
                            onClick={() => setIsWaitlistOpen(true)}
                            className="px-10 py-5 bg-white text-black font-bold text-xl rounded-full shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:bg-pink-50 transition-all hover:-translate-y-1"
                        >
                            Join Waitlist
                        </button>
                    </div>
                </section>
            </main>

            <FooterSection />
            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                projectId="wisho"
                projectName="Wish-O"
                accentColor="primary"
            />
        </div>
    );
};

export default WishOLanding;
