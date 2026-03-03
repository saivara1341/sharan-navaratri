
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
    Construction,
    DraftingCompass,
    BrainCircuit,
    Calculator,
    ShoppingCart,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { WaitlistModal } from '@/components/WaitlistModal';

const ArchPlanLanding = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const features = [
        {
            icon: <DraftingCompass className="w-8 h-8 text-blue-400" />,
            title: t('archplan_landing.features.design.title'),
            desc: t('archplan_landing.features.design.desc'),
            border: "border-blue-500/30"
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-yellow-400" />,
            title: t('archplan_landing.features.vastu.title'),
            desc: t('archplan_landing.features.vastu.desc'),
            border: "border-yellow-500/30"
        },
        {
            icon: <Calculator className="w-8 h-8 text-green-400" />,
            title: t('archplan_landing.features.cost.title'),
            desc: t('archplan_landing.features.cost.desc'),
            border: "border-green-500/30"
        },
        {
            icon: <ShoppingCart className="w-8 h-8 text-orange-400" />,
            title: t('archplan_landing.features.market.title'),
            desc: t('archplan_landing.features.market.desc'),
            border: "border-orange-500/30"
        }
    ];

    const stats = [
        { value: "5000+", label: t('archplan_landing.stats.designs'), color: "text-blue-400" },
        { value: "99.8%", label: t('archplan_landing.stats.cost'), color: "text-green-400" },
        { value: "40%", label: t('archplan_landing.stats.time'), color: "text-yellow-400" },
    ];

    return (
        <div className="min-h-screen font-sans bg-[#0a0a0f] text-foreground selection:bg-blue-900 overflow-x-hidden">
            <Helmet>
                <title>ArchPlan | AI-Powered Construction & Architectural Planning</title>
                <meta name="description" content="Build smarter with ArchPlan AI. Professional architectural designs, Vastu compliance, and accurate cost estimation powered by intelligence." />
            </Helmet>
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => navigate('/')}
                            className="absolute top-0 left-4 md:left-0 flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('archplan_landing.hero.back')}
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto mt-12"
                        >
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <Construction className="w-8 h-8 text-yellow-500 animate-pulse" />
                                <span className="text-yellow-500 font-mono tracking-widest text-sm uppercase border border-yellow-500/30 px-3 py-1 rounded">
                                    Construction Intelligence ver 2.0
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 font-display tracking-tight text-white leading-tight">
                                {t('archplan_landing.hero.title')}
                            </h1>

                            <p className="text-xl md:text-2xl text-blue-200/80 mb-6 font-light">
                                {t('archplan_landing.hero.tagline')}
                            </p>

                            <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
                                {t('archplan_landing.hero.desc')}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsWaitlistOpen(true)}
                                className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-none border-2 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2 mx-auto"
                            >
                                {t('archplan_landing.hero.cta')}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Band */}
                <section className="border-y border-white/5 bg-white/5 backdrop-blur-sm py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    className="p-4"
                                >
                                    <div className={`text-5xl font-bold mb-2 font-display ${stat.color}`}>{stat.value}</div>
                                    <div className="text-muted-foreground uppercase tracking-wider text-sm">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                                {t('archplan_landing.features.title')}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-yellow-500 mx-auto" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`p-8 bg-[#111118] border ${feature.border} rounded-xl hover:bg-[#161620] transition-colors group relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Construction className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="mb-6 bg-white/5 w-16 h-16 rounded-lg flex items-center justify-center border border-white/10">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Steps */}
                <section className="py-24 bg-white/5 border-t border-white/5">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <h2 className="text-3xl font-bold mb-16 text-center font-display">
                            {t('archplan_landing.process.title')}
                        </h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((num) => (
                                <div key={num} className="relative text-center group">
                                    <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white mb-6 shadow-lg shadow-blue-900/50 group-hover:scale-110 transition-transform">
                                        0{num}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">
                                        {t(`archplan_landing.process.step${num}`)}
                                    </h3>
                                    {num < 4 && (
                                        <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-white/10 -z-10" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 text-center">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8">
                            Ready to build smarter?
                        </h2>
                        <button
                            onClick={() => setIsWaitlistOpen(true)}
                            className="px-10 py-5 bg-yellow-500 text-black font-bold text-xl rounded shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] hover:bg-yellow-400 transition-all hover:-translate-y-1"
                        >
                            {t('archplan_landing.hero.cta')}
                        </button>
                    </div>
                </section>
            </main>

            <FooterSection />
            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
                projectId="archplan"
                projectName="ArchPlan AI"
                accentColor="primary"
            />
        </div>
    );
};

export default ArchPlanLanding;
