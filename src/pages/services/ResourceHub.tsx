import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { 
  Search, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Scale, 
  Building2, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  Rocket,
  CheckCircle2,
  FileText,
  Cpu,
  GraduationCap,
  Target,
  Briefcase,
  Zap,
  Star,
  Users,
  Handshake
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";

const ResourceHub = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Persist tab selection in localStorage
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("nexus_resource_tab");
    return searchParams.get("category") || saved || "founder";
  });

  useEffect(() => {
    localStorage.setItem("nexus_resource_tab", activeTab);
  }, [activeTab]);

  const categories: Record<string, any> = {
    founder: {
      title: "Visionary Founder",
      icon: Rocket,
      color: "orange",
      subtitle: "Blueprint for Startup Success",
      sections: [
        {
          name: "Government & Grants",
          items: [
            { name: "Startup India Hub", desc: "Digital platform for all startup ecosystem stakeholders.", link: "https://www.startupindia.gov.in" },
            { name: "DPIIT Recognition", desc: "Recognition for tax benefits and compliance easing.", link: "https://www.startupindia.gov.in/content/sih/en/startupgov/startup-recognition-page.html" },
            { name: "Startup Sahayak (Razorpay)", desc: "Market research and legal tools for early stage.", link: "https://startupsahayak.razorpay.com" }
          ]
        },
        {
          name: "Growth & Capital",
          items: [
            { name: "YC Startup Library", desc: "Best-in-class resources for building a startup.", link: "https://www.ycombinator.com/library" },
            { name: "Crunchbase", desc: "Market research and competitor tracking.", link: "https://www.crunchbase.com" },
            { name: "Stripe Atlas", desc: "Powerful platform to start a global company.", link: "https://stripe.com/atlas" }
          ]
        }
      ]
    },
    student: {
      title: "Student / Researcher",
      icon: GraduationCap,
      color: "emerald",
      subtitle: "Career & Academic Excellence",
      sections: [
        {
          name: "Career Toolkit",
          items: [
            { name: "AI Resume Builder", desc: "Nexus-powered high-impact CV builder.", link: "/nexus/resume-builder" },
            { name: "Internshala", desc: "Find internships and vocational training.", link: "https://internshala.com" },
            { name: "LeetCode", desc: "Technical interview and algorithmic practice.", link: "https://leetcode.com" }
          ]
        },
        {
          name: "Academic Research",
          items: [
            { name: "Semantic Scholar", desc: "AI-powered research discovery tool.", link: "https://www.semanticscholar.org" },
            { name: "ArXiv", desc: "Open-access archive for 2M+ scholarly articles.", link: "https://arxiv.org" },
            { name: "Google Scholar", desc: "Broad search engine for scholarly literature.", link: "https://scholar.google.com" }
          ]
        }
      ]
    },
    architect: {
      title: "Tech Architect",
      icon: Cpu,
      color: "blue",
      subtitle: "High-Scale Infrastructure",
      sections: [
        {
          name: "Architectural Patterns",
          items: [
            { name: "ByteByteGo", desc: "Visual exploration of system design.", link: "https://bytebytego.com" },
            { name: "System Design Primer", desc: "GitHub's leading roadmap for scaling.", link: "https://github.com/donnemartin/system-design-primer" },
            { name: "Engineering Blogs", desc: "Insights from Netflix, Meta, and Google.", link: "https://github.com/donnemartin/system-design-primer#engineering-blogs" }
          ]
        },
        {
          name: "Cloud Ecosystem",
          items: [
            { name: "AWS Architecture Center", desc: "Reference architectures for cloud scale.", link: "https://aws.amazon.com/architecture/" },
            { name: "GCP Solutions", desc: "Google Cloud architecture and patterns.", link: "https://cloud.google.com/solutions" },
            { name: "Postman API", desc: "API development and documentation tools.", link: "https://www.postman.com" }
          ]
        }
      ]
    },
    investor: {
      title: "Venture Investor",
      icon: Star,
      color: "yellow",
      subtitle: "Deal Flow & Due Diligence",
      sections: [
        {
          name: "Market Intelligence",
          items: [
            { name: "AngelList", desc: "Global hub for startup investing.", link: "https://www.angellist.com" },
            { name: "Affinity CRM", desc: "Relationship intelligence for deal flow.", link: "https://www.affinity.co" },
            { name: "Carta", desc: "Equity management and portfolio tracking.", link: "https://www.carta.com" }
          ]
        },
        {
          name: "Data & Risk",
          items: [
            { name: "Standard Metrics", desc: "Automated portfolio monitoring and reporting.", link: "https://www.standardmetrics.io" },
            { name: "CB Insights", desc: "High-level market analysis and intelligence.", link: "https://www.cbinsights.com" },
            { name: "Due Diligence AI", desc: "Automated technical risk assessment (Coming Soon).", link: "#" }
          ]
        }
      ]
    },
    partner: {
      title: "Strategic Partner",
      icon: Handshake,
      color: "purple",
      subtitle: "Ecosystem & Growth",
      sections: [
        {
          name: "Business Growth",
          items: [
            { name: "HubSpot Academy", desc: "Free online courses for business and marketing.", link: "https://academy.hubspot.com" },
            { name: "LinkedIn Sales", desc: "Advanced relationship management and networking.", link: "https://business.linkedin.com/sales-solutions" },
            { name: "Zendesk Marketplace", desc: "Apps and integrations to grow your business.", link: "https://www.zendesk.com/marketplace" }
          ]
        },
        {
          name: "Collaborative Tools",
          items: [
            { name: "Slack for Ecosystems", desc: "Build a community and collaborate in real-time.", link: "https://slack.com" },
            { name: "Notion for Teams", desc: "Connected workspace for docs and projects.", link: "https://www.notion.so/product" }
          ]
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-32">
      <Navbar />
      <Helmet>
        <title>Nexus Resource Hub | Siddhi Dynamics</title>
        <meta name="description" content="A specialized multi-profile resource hub for Architects, Founders, Investors, and Students." />
      </Helmet>

      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 mb-20">
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <Link to="/portal" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              Dashboard /
            </Link>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold gradient-text mb-4"
          >
            Nexus Resource Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Curated "best-in-class" toolkits and portals for every professional identity.
          </motion.p>
        </div>

        {/* Tab Selection & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 w-fit">
            {Object.entries(categories).map(([key, cat]) => (
                <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 md:px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeTab === key 
                    ? `bg-${cat.color}-500/20 text-${cat.color}-500 shadow-inner border border-${cat.color}-500/30` 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                >
                <cat.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cat.title}</span>
                </button>
            ))}
            </div>

            <div className="relative w-full lg:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                    type="text"
                    placeholder={`Search ${categories[activeTab].title} tools...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.07] transition-all overflow-hidden text-sm"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-${categories[activeTab].color}-500/10`}>
                            {(() => { const Icon = categories[activeTab].icon; return <Icon className={`w-8 h-8 text-${categories[activeTab].color}-500`} />; })()}
                        </div>
                        {categories[activeTab].title} Hub
                    </h2>
                    <p className="text-muted-foreground italic">{categories[activeTab].subtitle}</p>
                </div>
                {activeTab === 'founder' && (
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                        <Sparkles className="w-4 h-4" />
                        Featured: Startup Sahayak
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories[activeTab].sections.map((section: any) => {
                    const filteredItems = section.items.filter((item: any) => 
                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    if (filteredItems.length === 0 && searchQuery) return null;

                    return (
                        <div key={section.name} className="space-y-6">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] pl-2">{section.name}</h3>
                            <div className="space-y-4">
                                {filteredItems.map((item: any) => (
                                    <a 
                                        key={item.name}
                                        href={item.link}
                                        target={item.link.startsWith('http') ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        className="group block p-6 rounded-2xl glass-card bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/8"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold group-hover:text-primary transition-colors">{item.name}</h4>
                                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item.desc}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {searchQuery && !categories[activeTab].sections.some((s: any) => s.items.some((i: any) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))) && (
                <div className="text-center py-20 bg-white/5 rounded-[32px] border border-dashed border-white/10">
                    <p className="text-muted-foreground">No resources found matching "{searchQuery}" in this category.</p>
                </div>
            )}

            {activeTab === 'founder' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="glass-card p-10 rounded-[32px] bg-primary/5 border border-primary/20 relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl text-center lg:text-left">
                            <h3 className="text-2xl font-bold mb-4">Official Startup Support</h3>
                            <p className="text-muted-foreground mb-8">
                                Leverage our partnership resources with **DPIIT** and **Razorpay** to access market intelligence, grants, and legal infrastructure.
                            </p>
                            <a 
                                href="https://startupsahayak.razorpay.com" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all group"
                            >
                                <span>Go to Startup Sahayak</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                            {[
                                { title: "DPIIT", icon: Building2 },
                                { title: "Sahayak", icon: Target },
                                { title: "MAARG", icon: Users },
                                { title: "Grants", icon: Sparkles }
                            ].map((badge) => (
                                <div key={badge.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                                    <badge.icon className="w-6 h-6 text-primary mb-2" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{badge.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <FooterSection />
    </div>
  );
};

export default ResourceHub;
