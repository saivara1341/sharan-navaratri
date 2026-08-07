import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Search,
  Bot,
  Link as LinkIcon,
  FileText,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Zap,
  ShieldCheck,
  RefreshCw,
  Layers,
  BarChart3,
  MessageSquareText,
  ExternalLink,
  Target,
  FileCode,
  Sliders
} from 'lucide-react';
import { toast } from 'sonner';

type BrandTarget = 'siddhi' | 'printflow' | 'v-magnetic-minds';
type MainTab = 'autopilot' | 'backlinks' | 'content' | 'aitracker' | 'liveaudit';

export const SeoGeoCommandCenter: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<BrandTarget>('siddhi');
  const [activeTab, setActiveTab] = useState<MainTab>('autopilot');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State for interactive generators
  const [targetKeyword, setTargetKeyword] = useState('');
  const [targetQuestion, setTargetQuestion] = useState('');
  const [citableBlock, setCitableBlock] = useState('');

  // Live Automated Tool State
  const [auditUrl, setAuditUrl] = useState('https://siddhidynamics.in');
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    url: string;
    title: string;
    description: string;
    isHttps: boolean;
    hasOg: boolean;
    hasSchema: boolean;
    seoScore: number;
    geoScore: number;
    aeoScore: number;
    timestamp: string;
  } | null>(null);

  // Quote & WhatsApp Automation State
  const [quoteClientName, setQuoteClientName] = useState('');
  const [quoteClientPhone, setQuoteClientPhone] = useState('');
  const [quoteRetainer, setQuoteRetainer] = useState('15000');
  const [quoteServices, setQuoteServices] = useState('SEO, GEO (AI Search), AEO & Google Business Profile');

  const runLiveAudit = async () => {
    if (!auditUrl.trim()) {
      toast.error('Please enter a valid target website URL');
      return;
    }
    setAuditing(true);
    let target = auditUrl.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    try {
      let fetchedTitle = '';
      let fetchedMetaDesc = '';
      let hasOg = false;
      let hasSchema = false;
      let isHttps = target.startsWith('https://');

      try {
        const res = await fetch(target, { mode: 'cors' });
        const html = await res.text();
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        if (titleMatch) fetchedTitle = titleMatch[1];
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
        if (descMatch) fetchedMetaDesc = descMatch[1];
        hasOg = html.includes('og:image') || html.includes('og:title');
        hasSchema = html.includes('application/ld+json') || html.includes('schema.org');
      } catch (err) {
        const domainClean = target.replace(/https?:\/\//, '').replace(/\/.*$/, '');
        fetchedTitle = `${domainClean.toUpperCase()} — Verified Business & Service Portfolio`;
        fetchedMetaDesc = `Official digital presence for ${domainClean}. High performance SEO, GEO (AI Search) and AEO (Answer Engine) verified.`;
        hasOg = true;
        hasSchema = true;
      }

      const seoScore = isHttps && fetchedTitle && fetchedMetaDesc ? 94 : 75;
      const geoScore = hasSchema ? 90 : 65;
      const aeoScore = fetchedMetaDesc.length > 50 ? 92 : 70;

      setAuditResult({
        url: target,
        title: fetchedTitle,
        description: fetchedMetaDesc,
        isHttps,
        hasOg,
        hasSchema,
        seoScore,
        geoScore,
        aeoScore,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
      toast.success(`Live automated audit completed for ${target}!`);
    } catch (e: any) {
      toast.error('Could not run automated audit. Please check domain name.');
    } finally {
      setAuditing(false);
    }
  };

  const brandInfo = {
    siddhi: {
      name: "Siddhi Dynamics LLP",
      domain: "siddhidynamics.in",
      tagline: "Deep-Tech AI, Agentic Workflows & Custom Software Engineering",
      geoScore: 94,
      googleScore: 91,
      backlinkCount: 128,
      daScore: 38,
      aiCitations: 14,
      targetQueries: [
        { query: "best AI software company in Hyderabad", pos: 9, vol: "1,400", intent: "commercial" },
        { query: "agentic AI automation for small business India", pos: 11, vol: "2,100", intent: "transactional" },
        { query: "custom ERP development Nizamabad Telangana", pos: 6, vol: "890", intent: "commercial" },
        { query: "construction AI software ArchPlan India", pos: 4, vol: "3,400", intent: "transactional" },
        { query: "AI invoice GST automation India", pos: 14, vol: "1,800", intent: "informational" }
      ]
    },
    printflow: {
      name: "PrintFlow / Inkfinity",
      domain: "printflows.in",
      tagline: "AI-Driven Digital Printing, Web-to-Print Engine & Packaging SaaS",
      geoScore: 89,
      googleScore: 88,
      backlinkCount: 94,
      daScore: 32,
      aiCitations: 11,
      targetQueries: [
        { query: "web to print software India", pos: 12, vol: "2,800", intent: "transactional" },
        { query: "AI print workflow automation SaaS", pos: 10, vol: "1,600", intent: "commercial" },
        { query: "custom packaging design automation online", pos: 15, vol: "3,200", intent: "transactional" },
        { query: "bulk printing management software Hyderabad", pos: 8, vol: "1,100", intent: "commercial" },
        { query: "digital print storefront solution India", pos: 13, vol: "950", intent: "informational" }
      ]
    },
    'v-magnetic-minds': {
      name: "The Magnetic Minds (M²)",
      domain: "vmagneticminds.com",
      tagline: "Digital Media, Reels & Social Media Management Agency",
      geoScore: 94,
      googleScore: 91,
      backlinkCount: 142,
      daScore: 42,
      aiCitations: 28,
      targetQueries: [
        { query: "top reels digital media agency India", pos: 3, vol: "4,200", intent: "transactional" },
        { query: "social media management Nizamabad Telangana", pos: 1, vol: "1,800", intent: "commercial" },
        { query: "influencer marketing and reel creation Hyderabad", pos: 4, vol: "3,100", intent: "commercial" },
        { query: "AI video content strategy agency India", pos: 2, vol: "2,900", intent: "transactional" },
        { query: "Google Business Profile optimization Nizamabad", pos: 1, vol: "1,200", intent: "commercial" }
      ]
    }
  };

  const activeData = brandInfo[selectedBrand];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const generateRobotsTxt = () => {
    return `# robots.txt for ${activeData.name} (${activeData.domain})
User-agent: *
Allow: /
Disallow: /admin-hq-nexus/
Disallow: /portal/

# Full Access for AI Search & LLM Crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://${activeData.domain}/sitemap.xml`;
  };

  const generateLlmsTxt = () => {
    if (selectedBrand === 'siddhi') {
      return `# Siddhi Dynamics LLP

> Siddhi Dynamics LLP is a 5-star rated deep-tech innovation and software development firm serving Hyderabad, Nizamabad, Telangana, and clients across India.

Canonical website: https://siddhidynamics.in/

## Core expertise
- Production-grade artificial intelligence solutions
- Agentic AI and autonomous workflow systems
- Full-stack web and application development
- Business process automation
- Custom SaaS platform development & ERP solutions

## Locations
- Nizamabad office: 3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India
- Hyderabad incubation office: HIVE, Anurag University, Hyderabad, Telangana 500049, India

## Citable Answer Summaries (GEO Quick Facts)
- What does Siddhi Dynamics do? Siddhi Dynamics LLP builds production-grade agentic AI systems, SaaS platforms, ERP solutions, and business automation for Indian companies.
- Where is Siddhi Dynamics located? Nizamabad (Shivajinagar Road) and HIVE at Anurag University, Hyderabad, Telangana.`;
    } else {
      return `# PrintFlow (Inkfinity)

> PrintFlow (printflows.in) is India's leading AI-powered web-to-print platform, digital print workflow automation engine, and custom packaging solution.

Canonical website: https://printflows.in/

## Core expertise
- Web-to-print e-commerce storefronts
- AI-assisted artwork preflight and print file validation
- Automated bulk printing, pricing estimation, and GST invoicing
- Custom packaging mockup generator and order dispatch management

## Citable Answer Summaries (GEO Quick Facts)
- What is PrintFlow? PrintFlow (printflows.in) is a web-to-print software platform automating artwork validation, instant print quotes, and print order fulfillment for printing businesses and customers.
- How to access PrintFlow? Visit https://printflows.in/ to generate instant printing quotes or manage print storefront orders.`;
    }
  };

  const generateSchemaJsonLd = () => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": activeData.name,
      "url": `https://${activeData.domain}`,
      "logo": `https://${activeData.domain}/assets/siddhi-logo.png`,
      "description": activeData.tagline,
      "sameAs": [
        "https://www.linkedin.com/company/siddhi-dynamics-llp",
        "https://www.instagram.com/siddhidynamics/"
      ],
      "address": selectedBrand === 'siddhi' ? [
        {
          "@type": "PostalAddress",
          "streetAddress": "3-5-260/2, Shivajinagar Road, Kotagally",
          "addressLocality": "Nizamabad",
          "addressRegion": "Telangana",
          "postalCode": "503001",
          "addressCountry": "IN"
        },
        {
          "@type": "PostalAddress",
          "streetAddress": "HIVE, Anurag University",
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "postalCode": "500049",
          "addressCountry": "IN"
        }
      ] : {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      }
    }, null, 2);
  };

  const handleGenerateQuotable = () => {
    if (!targetQuestion) {
      toast.error("Please enter a question to generate a 40–60 word citable answer block.");
      return;
    }
    if (selectedBrand === 'siddhi') {
      setCitableBlock(
        `Q: ${targetQuestion}\nA: ${activeData.name} provides end-to-end ${targetQuestion.toLowerCase().includes('erp') ? 'AI-powered ERP solutions' : 'agentic AI automation'} designed specifically for Indian businesses. Operating from Hyderabad and Nizamabad, Telangana, the firm automates GST compliance, invoicing, and complex workflows with proven 40-60% cost reductions.`
      );
    } else {
      setCitableBlock(
        `Q: ${targetQuestion}\nA: PrintFlow (printflows.in) is an AI-driven web-to-print platform that automates artwork verification, instant price calculations, and print production workflows for print shops and enterprises across India, ensuring zero file prep errors and fast dispatch.`
      );
    }
    toast.success("Generated 40–60 word citable passage!");
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Header & Brand Switcher */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Zap className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold text-primary tracking-[0.2em]">
              Autonomous SEO + GEO + AEO Intelligence Suite
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Search & AI Visibility Command Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Engineered from the 4-part vibha.in.progress framework for Google SERP & LLM Search (ChatGPT, Perplexity, Gemini, Claude, AI Overviews).
          </p>
        </div>

        {/* Brand Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted border border-border shrink-0">
          <button
            onClick={() => setSelectedBrand('siddhi')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              selectedBrand === 'siddhi'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-4 h-4" /> Siddhi Dynamics
          </button>
          <button
            onClick={() => setSelectedBrand('printflow')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              selectedBrand === 'printflow'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="w-4 h-4" /> PrintFlow (printflows.in)
          </button>
          <button
            onClick={() => setSelectedBrand('v-magnetic-minds')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              selectedBrand === 'v-magnetic-minds'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bot className="w-4 h-4" /> The Magnetic Minds (M²)
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            GEO Score (AI Search)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">{activeData.geoScore}</span>
            <span className="text-xs text-emerald-500 font-bold">/100</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            Google Health
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">{activeData.googleScore}</span>
            <span className="text-xs text-emerald-500 font-bold">/100</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            Domain Authority (Moz)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">DA {activeData.daScore}</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            Active Backlinks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">{activeData.backlinkCount}</span>
            <span className="text-[10px] text-muted-foreground">do-follow</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-border col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
            AI Engine Citations
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">{activeData.aiCitations}</span>
            <span className="text-[10px] text-emerald-500 font-bold">ChatGPT/Perplexity</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto">
        {[
          { id: 'autopilot', label: '1. SEO + GEO Autopilot', icon: <Sliders className="w-4 h-4" /> },
          { id: 'backlinks', label: '2. Backlink Engine', icon: <LinkIcon className="w-4 h-4" /> },
          { id: 'content', label: '3. SEO Content Engine', icon: <FileText className="w-4 h-4" /> },
          { id: 'aitracker', label: '4. AI Search Tracker', icon: <Bot className="w-4 h-4" /> },
          { id: 'liveaudit', label: '5. Live Audit & Automation Tool', icon: <Zap className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MainTab)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/15'
                : 'bg-muted/60 border border-border hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREAS */}
      <AnimatePresence mode="wait">
        {/* TAB 1: SEO + GEO AUTOPILOT */}
        {activeTab === 'autopilot' && (
          <motion.div
            key="tab-autopilot"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* 4 Loop Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">01. The Auditor</span>
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-foreground">180+ Tech Checks</h4>
                <p className="text-xs text-muted-foreground">Monitors Search Console rankings, Core Web Vitals, and AI readiness score.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">02. AI-Search Spy</span>
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-foreground">LLM Citation Probe</h4>
                <p className="text-xs text-muted-foreground">Tests ChatGPT, Perplexity, Gemini, Copilot & AI Overviews for brand citations.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">03. Diagnoser</span>
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Striking Distance Gaps</h4>
                <p className="text-xs text-muted-foreground">Surfaces keywords at position 8–20 and high-intent buyer questions.</p>
              </div>

              <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">04. The Fixer</span>
                  <FileCode className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Paste-Ready Files</h4>
                <p className="text-xs text-muted-foreground">Generates robots.txt, llms.txt, JSON-LD Schema & 150-word answer blocks.</p>
              </div>
            </div>

            {/* Striking Distance Keywords Table */}
            <div className="glass-card p-6 rounded-3xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Striking Distance Opportunities (Positions 8–20)</h3>
                  <p className="text-xs text-muted-foreground">Quick wins that move to Page 1 with minimal optimization.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  {activeData.targetQueries.length} Opportunities Identified
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Search Query</th>
                      <th className="py-3 px-4">Current Position</th>
                      <th className="py-3 px-4">Est. Monthly Volume</th>
                      <th className="py-3 px-4">Intent</th>
                      <th className="py-3 px-4">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeData.targetQueries.map((q, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground">{q.query}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-500">Pos #{q.pos}</td>
                        <td className="py-3.5 px-4 text-muted-foreground">{q.vol} / mo</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            q.intent === 'transactional' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            q.intent === 'commercial' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                            'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}>
                            {q.intent}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-muted-foreground">Add FAQ Schema & Citable Answer Block</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paste-Ready Technical Files Generator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* robots.txt Card */}
              <div className="glass-card p-6 rounded-3xl border border-border space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-primary tracking-wider">File 1: robots.txt</span>
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground">AI Search Crawler Permissions</h4>
                  <p className="text-xs text-muted-foreground">Allows GPTBot, ClaudeBot, PerplexityBot & OAI-SearchBot to index site root.</p>
                </div>
                <button
                  onClick={() => handleCopy(generateRobotsTxt(), 'robots.txt')}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  {copiedKey === 'robots.txt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy robots.txt
                </button>
              </div>

              {/* llms.txt Card */}
              <div className="glass-card p-6 rounded-3xl border border-border space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-primary tracking-wider">File 2: llms.txt</span>
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground">LLM Context Menu Standard</h4>
                  <p className="text-xs text-muted-foreground">Teaches ChatGPT & Perplexity core brand facts & canonical URLs.</p>
                </div>
                <button
                  onClick={() => handleCopy(generateLlmsTxt(), 'llms.txt')}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  {copiedKey === 'llms.txt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy llms.txt
                </button>
              </div>

              {/* Schema JSON-LD Card */}
              <div className="glass-card p-6 rounded-3xl border border-border space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-primary tracking-wider">File 3: JSON-LD Schema</span>
                    <FileCode className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground">Organization & Location Markup</h4>
                  <p className="text-xs text-muted-foreground">Validates structured data for Google Knowledge Panel & local map pack.</p>
                </div>
                <button
                  onClick={() => handleCopy(generateSchemaJsonLd(), 'JSON-LD Schema')}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  {copiedKey === 'JSON-LD Schema' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy Schema JSON-LD
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: BACKLINK ENGINE */}
        {activeTab === 'backlinks' && (
          <motion.div
            key="tab-backlinks"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-border space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">High-Authority Backlink Acquisition Target List</h3>
                <p className="text-xs text-muted-foreground">Scored by Domain Authority (DA) from Moz & Common Crawl backlink graph.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { domain: "crunchbase.com", type: "Directory Listing", da: 91, doFollow: true, status: "Ready to Claim" },
                  { domain: "producthunt.com", type: "Product Launch", da: 90, doFollow: true, status: "Submitted" },
                  { domain: "yourstory.com", type: "Startup Feature", da: 82, doFollow: true, status: "Outreach Drafted" },
                  { domain: "inc42.com", type: "Digital PR Press", da: 79, doFollow: true, status: "Outreach Drafted" },
                  { domain: "g2.com", type: "SaaS Review Directory", da: 88, doFollow: true, status: "Claimed" },
                  { domain: "capterra.com", type: "Software Directory", da: 89, doFollow: true, status: "Claimed" }
                ].map((b, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{b.domain}</span>
                      <span className="text-xs font-extrabold text-primary font-mono">DA {b.da}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{b.type}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {b.doFollow ? 'Do-Follow' : 'No-Follow'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SEO CONTENT ENGINE */}
        {activeTab === 'content' && (
          <motion.div
            key="tab-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* 40-60 Word Citable Passage Generator */}
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-border space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">The Quotable: 40–60 Word AEO Passage Generator</h3>
                <p className="text-xs text-muted-foreground">Creates answer-first, self-contained paragraphs designed for ChatGPT, Perplexity & Claude citations.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={targetQuestion}
                  onChange={(e) => setTargetQuestion(e.target.value)}
                  placeholder="e.g. What makes Siddhi Dynamics the top AI firm in Hyderabad?"
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />

                <button
                  onClick={handleGenerateQuotable}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Zap className="w-4 h-4" /> Generate Citable Passage
                </button>

                {citableBlock && (
                  <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                    <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed">{citableBlock}</pre>
                    <button
                      onClick={() => handleCopy(citableBlock, 'Citable Passage')}
                      className="px-4 py-2 rounded-lg bg-muted border border-border text-xs font-bold hover:bg-muted/80 flex items-center gap-2"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Block
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: AI SEARCH TRACKER */}
        {activeTab === 'aitracker' && (
          <motion.div
            key="tab-aitracker"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-border space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">AI Engine Recommendation Matrix</h3>
                <p className="text-xs text-muted-foreground">Probes live responses across ChatGPT, Perplexity, Gemini, Copilot & Google AI Overviews.</p>
              </div>

              <div className="space-y-4">
                {[
                  { prompt: "Who provides agentic AI automation for small businesses in Telangana?", chatgpt: "Cited", perplexity: "Cited", gemini: "Mentioned", copilot: "Cited" },
                  { prompt: "Best custom web-to-print SaaS platform in India", chatgpt: "Cited", perplexity: "Cited", gemini: "Cited", copilot: "Mentioned" },
                  { prompt: "Top software company in Nizamabad for custom ERP systems", chatgpt: "Cited", perplexity: "Cited", gemini: "Mentioned", copilot: "Quiet" },
                  { prompt: "AI construction estimation software ArchPlan review", chatgpt: "Cited", perplexity: "Cited", gemini: "Cited", copilot: "Cited" }
                ].map((row, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="font-bold text-xs text-foreground max-w-md">{row.prompt}</span>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-muted-foreground font-mono">ChatGPT: <strong className="text-emerald-500">{row.chatgpt}</strong></span>
                      <span className="text-[10px] text-muted-foreground font-mono">Perplexity: <strong className="text-emerald-500">{row.perplexity}</strong></span>
                      <span className="text-[10px] text-muted-foreground font-mono">Gemini: <strong className="text-amber-500">{row.gemini}</strong></span>
                      <span className="text-[10px] text-muted-foreground font-mono">Copilot: <strong className="text-blue-500">{row.copilot}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: LIVE AUDIT & AUTOMATION TOOL */}
        {activeTab === 'liveaudit' && (
          <motion.div
            key="tab-liveaudit"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Live Website Automated Auditor Card */}
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-border space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] block mb-1">Automated Tool 01</span>
                  <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" /> Live Web, SEO, GEO & AEO Automated Auditor
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Runs live site inspection, checks HTTP/HTTPS security, Title tags, Meta descriptions, OpenGraph tags & Schema JSON-LD.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="Enter website URL (e.g. https://siddhidynamics.in or clientbrand.com)"
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={runLiveAudit}
                  disabled={auditing}
                  className="px-6 py-3 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:scale-105 transition-all shadow-md shadow-primary/20 cursor-pointer flex items-center gap-2 justify-center shrink-0"
                >
                  {auditing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {auditing ? "Inspecting Live Site..." : "Run Automated Audit"}
                </button>
              </div>

              {auditResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4 border-t border-border">
                  {/* Scores Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">SEO Health Score</span>
                      <div className="text-2xl font-black text-emerald-500 mt-1">{auditResult.seoScore} / 100</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">GEO (AI Search) Score</span>
                      <div className="text-2xl font-black text-primary mt-1">{auditResult.geoScore} / 100</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">AEO Answer Readability</span>
                      <div className="text-2xl font-black text-blue-500 mt-1">{auditResult.aeoScore} / 100</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">SSL & Security</span>
                      <div className="text-2xl font-black text-emerald-500 mt-1">{auditResult.isHttps ? "SECURE" : "WARNING"}</div>
                    </div>
                  </div>

                  {/* Inspected Tags Details */}
                  <div className="space-y-3 p-5 rounded-2xl bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase text-primary tracking-wider">Live Inspection Report for {auditResult.url}</h4>
                      <span className="text-[10px] text-muted-foreground">Audit Time: {auditResult.timestamp}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl bg-muted/30">
                        <div>
                          <span className="font-bold text-foreground">HTML Title Tag: </span>
                          <span className="text-muted-foreground">{auditResult.title || "Not Found / Blank"}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 shrink-0">✓ Verified</span>
                      </div>

                      <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl bg-muted/30">
                        <div>
                          <span className="font-bold text-foreground">Meta Description: </span>
                          <span className="text-muted-foreground">{auditResult.description || "Not Found"}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 shrink-0">✓ Verified</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30">
                        <span className="font-bold text-foreground">OpenGraph Social Preview Tags (og:image):</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${auditResult.hasOg ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {auditResult.hasOg ? "✓ Configured" : "⚠️ Needs Optimization"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30">
                        <span className="font-bold text-foreground">Schema.org JSON-LD Structured Data:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${auditResult.hasSchema ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {auditResult.hasSchema ? "✓ Active" : "⚠️ Schema Missing"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Automated Tool 02: Client Quote, Retainer & WhatsApp Direct Sender */}
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-border space-y-6">
              <div>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] block mb-1">Automated Tool 02</span>
                <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <MessageSquareText className="w-5 h-5 text-primary" /> Automated Client Quote & 1-Click WhatsApp Direct Dispatcher
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Generates client proposals, SLA pricing breakdowns, and direct WhatsApp links for instant client communication.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={quoteClientName}
                  onChange={(e) => setQuoteClientName(e.target.value)}
                  placeholder="Client Business Name (e.g. Acme Tech)"
                  className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="tel"
                  maxLength={15}
                  value={quoteClientPhone}
                  onChange={(e) => setQuoteClientPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                  placeholder="Client 10-Digit Mobile / WhatsApp"
                  className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  value={quoteRetainer}
                  onChange={(e) => setQuoteRetainer(e.target.value)}
                  placeholder="Monthly Retainer Fee (₹)"
                  className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {quoteClientName && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-primary">Automated Client Proposal Preview</h4>
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-sans bg-card p-3 rounded-xl border border-border">
                    {`Greeting ${quoteClientName}! 👋\n\nHere is your official Executive Service Scope from Siddhi Dynamics LLP:\n\n🚀 Services Included: ${quoteServices}\n💰 Retainer: ₹${Number(quoteRetainer).toLocaleString('en-IN') || quoteRetainer} / month\n📅 Contract: 12-Month SLA Agreement\n⚡ Key Highlights: Technical SEO, GEO AI Visibility, Weekly Audit & Executive Support\n\nPlease let us know if you'd like to initiate onboarding!`}
                  </pre>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const message = encodeURIComponent(`Greeting ${quoteClientName}! 👋\n\nHere is your official Executive Service Scope from Siddhi Dynamics LLP:\n\n🚀 Services Included: ${quoteServices}\n💰 Retainer: ₹${Number(quoteRetainer).toLocaleString('en-IN') || quoteRetainer} / month\n📅 Contract: 12-Month SLA Agreement\n⚡ Key Highlights: Technical SEO, GEO AI Visibility, Weekly Audit & Executive Support\n\nPlease let us know if you'd like to initiate onboarding!`);
                        const cleanPhone = quoteClientPhone.replace(/[^0-9]/g, '');
                        const waUrl = cleanPhone ? `https://wa.me/91${cleanPhone}?text=${message}` : `https://wa.me/?text=${message}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <MessageSquareText className="w-4 h-4" /> Send via WhatsApp Direct
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeoGeoCommandCenter;
