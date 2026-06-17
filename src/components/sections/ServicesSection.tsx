import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVICES = [
    {
        emoji: "⚡",
        title: "Business Automation",
        desc: "Automate bookkeeping, workflows, tax calculations & invoice processing end-to-end.",
        tag: "Most Popular",
        href: "/services/business-automation",
    },
    {
        emoji: "🌐",
        title: "Website Development",
        desc: "High-performance, responsive business profile websites tailored to your brand.",
        tag: "",
        href: "/services/website-development",
    },
    {
        emoji: "☁️",
        title: "SaaS Platforms",
        desc: "Custom cloud-based Software-as-a-Service solutions for scalable enterprise growth.",
        tag: "Premium",
        href: "/services/saas",
    },
    {
        emoji: "🏢",
        title: "ERP Solutions",
        desc: "Centralize your business operations with intelligent Enterprise Resource Planning systems.",
        tag: "",
        href: "/services/erp",
    },
    {
        emoji: "🛍️",
        title: "E-Commerce Stores",
        desc: "Fully functional digital storefronts with seamless payment gateways and inventory management.",
        tag: "",
        href: "/services/website-development",
    },
    {
        emoji: "⚙️",
        title: "Digital Workflow Solutions",
        desc: "Transform large manual processes into seamless, trackable digital workflows.",
        tag: "",
        href: "/services/business-automation",
    },
];

export function ServicesSection() {
    const navigate = useNavigate();
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isAutoScrolling) return;

        const interval = setInterval(() => {
            if (carouselRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                
                // If we've reached the end of the scroll container, loop back to the start
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isAutoScrolling]);

    const handleUserInteraction = () => {
        setIsAutoScrolling(false);
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }
        resumeTimeoutRef.current = setTimeout(() => {
            setIsAutoScrolling(true);
        }, 2000);
    };

    const scrollLeft = () => {
        handleUserInteraction();
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        handleUserInteraction();
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    return (
        <section
            id="services"
            className="py-24 md:py-32 relative border-t border-border/30 bg-background"
        >
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    
                    {/* Left Column: Header */}
                    <div className="lg:col-span-5 relative">
                        <div className="flex flex-col items-start">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="inline-flex items-center gap-2 mb-8"
                            >
                                <span className="text-xs font-bold tracking-widest uppercase text-primary">
                                    Our Capabilities
                                </span>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tight leading-[1.1] text-foreground"
                            >
                                Automate. Grow. Dominate. 🚀
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-lg leading-relaxed mb-10 max-w-md text-muted-foreground"
                            >
                                We help businesses replace manual work with intelligent digital systems — including Website Development, SaaS, ERP, E-Commerce, and more — so you focus on what matters.
                            </motion.p>

                            <motion.button
                                onClick={() => document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' })}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-transform hover:scale-105 bg-primary text-primary-foreground"
                            >
                                Explore Capabilities
                            </motion.button>
                        </div>
                    </div>

                    {/* Right Column: Carousel */}
                    <div className="lg:col-span-7 flex flex-col pt-12 lg:pt-0">
                        {/* Navigation Arrows */}
                        <div className="flex gap-4 justify-end mb-8">
                            <button 
                                onClick={scrollLeft}
                                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-black/5 transition-colors text-foreground"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={scrollRight}
                                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-black/5 transition-colors text-foreground"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cards Container */}
                        <div 
                            ref={carouselRef} 
                            onScroll={handleUserInteraction}
                            onTouchStart={handleUserInteraction}
                            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 custom-scrollbar"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <style dangerouslySetInnerHTML={{__html: `
                                .custom-scrollbar::-webkit-scrollbar { display: none; }
                            `}} />
                            
                            {SERVICES.map((s) => (
                                <div key={s.title} className="snap-start shrink-0 w-[85%] sm:w-[400px]">
                                    <div
                                        onClick={() => s.href ? navigate(s.href) : document.getElementById('submit')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="service-card h-full rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.05)] hover:shadow-md border border-border/50 bg-transparent backdrop-blur-md"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 h-full">
                                            {/* Content Wrap */}
                                            <div className="flex flex-col pr-8 flex-1">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-border/50 transition-colors duration-300 group-hover:border-primary/50 bg-black/5">
                                                        {s.emoji}
                                                    </div>
                                                    {s.tag && (
                                                        <span className="text-[10px] shrink-0 font-extrabold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm bg-primary text-primary-foreground">
                                                            {s.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight transition-all duration-300 text-foreground">
                                                    {s.title}
                                                </h3>
                                                <p className="text-lg leading-relaxed mt-auto text-muted-foreground">
                                                    {s.desc}
                                                </p>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="mt-4 sm:mt-0 shrink-0">
                                                <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center transition-all duration-300 overflow-hidden relative group-hover:border-transparent text-muted-foreground">
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary" />
                                                    <ArrowUpRight className="w-6 h-6 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10 group-hover:text-primary-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
