import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';

const POSTS = [
  {
    slug: 'how-to-automate-business-invoicing-ai',
    title: 'How to Automate Your Business Invoicing with AI',
    excerpt: 'Manual invoicing costs Indian SMBs 10–20 hours per month. Here\'s how AI invoice processing works, what it automates, and how to implement it without disrupting your accounting team.',
    category: 'Business Automation',
    readTime: '8 min read',
    date: '2026-06-10',
    tags: ['AI invoice processing', 'business automation India', 'GST automation'],
    body: `
## The Hidden Cost of Manual Invoicing

If your team is still generating invoices manually — typing vendor details, calculating GST, sending PDFs over email — you're paying for it in ways that don't show up on a balance sheet.

**A typical Indian SMB processing 100 invoices/month loses:**
- 15–25 hours of staff time
- 3–8% error rates (leading to reconciliation work)
- Compliance risk from missed GST fields
- Delayed payments from late dispatch

## What AI Invoice Processing Actually Does

AI invoice processing is not a scanner. It's an intelligent system that:

1. **Reads** incoming invoices from any format — PDF, email, photo, WhatsApp message
2. **Extracts** vendor name, GSTIN, line items, amounts, tax breakdowns
3. **Validates** the data against your vendor master and compliance rules
4. **Posts** the transaction to your accounting system (Tally, Zoho, custom ERP)
5. **Flags** exceptions — mismatches, missing fields, duplicate invoices

All of this happens in seconds, without human review for standard invoices.

## Is This Right for Your Business?

AI invoice automation is most impactful when you:
- Process 50+ invoices/month
- Have multiple vendors or multiple GSTINs
- Spend significant time on month-end reconciliation
- Have had GST filing errors in the past

## How Siddhi Dynamics Implements It

We build custom invoice automation pipelines — not off-the-shelf tools. Every system is designed around your specific vendors, formats, and accounting workflow.

**Implementation timeline:** 2–4 weeks for standard setups.

**ROI:** Most clients see full cost recovery within 90 days.

---

*Ready to stop spending hours on invoicing? [Contact Siddhi Dynamics](/about) to discuss your workflow.*
    `.trim(),
  },
  {
    slug: 'what-is-agentic-ai-guide-indian-smb',
    title: 'What is Agentic AI? A Plain-English Guide for Indian Business Owners',
    excerpt: 'Agentic AI goes far beyond chatbots. It\'s AI that plans, decides, and acts — without constant human direction. Here\'s what it means for your business and why Indian companies are adopting it now.',
    category: 'AI Education',
    readTime: '6 min read',
    date: '2026-06-03',
    tags: ['agentic AI India', 'what is agentic AI', 'AI for business India'],
    body: `
## Beyond the Chatbot

Most people's first contact with AI was a chatbot — a system that answers questions when asked. That's reactive AI.

**Agentic AI is different.** An agent is an AI system that:
- Receives a high-level goal (not step-by-step instructions)
- Breaks the goal into tasks
- Uses tools — web search, databases, APIs, email — to complete those tasks
- Makes decisions at each step
- Reports back when done (or when stuck)

## A Simple Example

**Old way:** You tell an employee, "Go to the supplier website, download today's price list, update our procurement spreadsheet, calculate the variance from last month, and email me a summary."

**Agentic AI way:** You say, "Monitor supplier prices daily and alert me if any item rises more than 5% week-over-week." The agent does the rest, autonomously, every day.

## Why This Matters for Indian Businesses

Indian businesses run on coordination — between vendors, logistics, government portals, banks, and customers. Each of these touchpoints requires someone to collect information, make a decision, and take an action.

Agentic AI can handle the routine version of all of these:
- Monitoring GST portal for notices
- Reconciling bank statements with purchase orders
- Following up with customers on overdue invoices
- Generating compliance reports for chartered accountants

## Agentic AI vs. Simple Automation

| Feature | Rule-Based Automation | Agentic AI |
|---|---|---|
| Handles exceptions | ❌ | ✅ |
| Adapts to new formats | ❌ | ✅ |
| Reasons through ambiguity | ❌ | ✅ |
| Requires constant rule updates | ✅ | ❌ |

## Siddhi Dynamics and Agentic AI

At Siddhi Dynamics, we build agentic systems purpose-built for Indian business workflows. Our systems connect to your existing tools, understand your business rules, and act — so your team focuses on decisions that genuinely require human judgment.

*Curious how this applies to your business? [Talk to us](/about).*
    `.trim(),
  },
  {
    slug: '5-signs-your-business-needs-erp',
    title: '5 Signs Your Business Needs ERP (And How AI Makes It Easier)',
    excerpt: 'Most Indian SMBs don\'t realize they need ERP until the chaos is already costing them clients. Here are the 5 clearest warning signs — and why AI-powered ERP is now within reach for smaller budgets.',
    category: 'ERP',
    readTime: '7 min read',
    date: '2026-05-27',
    tags: ['ERP for small business India', 'AI ERP India', 'business management software India'],
    body: `
## The Five Warning Signs

### 1. Your data lives in too many places

You have inventory in one spreadsheet, sales in another, vendor payments in Tally, and HR in WhatsApp. When leadership asks "how are we doing?", someone spends a day pulling it all together.

**ERP fix:** All data in one system. Reports generate in seconds, not days.

### 2. You're reconciling manually at month-end

Your finance team dreads the last week of every month — cross-referencing invoices, bank statements, and sales orders to make sure everything matches.

**ERP fix:** Continuous automated reconciliation. Month-end becomes a review, not a scramble.

### 3. You can't track inventory in real time

You don't know what's in stock at each location until someone physically counts it. Stockouts and over-ordering are regular problems.

**ERP fix:** Real-time inventory across all locations, with low-stock alerts and automated reorder triggers.

### 4. Your team can't work together without you

Every decision — even small ones — escalates to you because there's no system for approvals, workflows, or visibility.

**ERP fix:** Role-based access, automated approval workflows, and full audit trails mean your team can move independently.

### 5. GST and compliance is always a rush

Your CA is always chasing your team for records. GST filing is a stressful last-minute exercise every quarter.

**ERP fix:** All transactions are GST-tagged automatically. Filing becomes a one-click export.

## Why AI Makes ERP Different Now

Traditional ERP was passive — it stored what you put in. AI ERP is active:

- **Predicts** stock needs before you run out
- **Flags** anomalies (duplicate vendors, unusual expenses) automatically
- **Generates** management reports without manual templates
- **Learns** your seasonality patterns and adjusts recommendations

## ERP Is No Longer Enterprise-Only

SAP, Oracle, and Microsoft Dynamics were built for companies with ₹100Cr+ budgets. That's changed. Siddhi Dynamics builds AI ERP systems priced for Indian SMBs with 10–500 employees — without compromising on capability.

*[Learn more about our ERP solutions](/services/erp) or [contact us](/about) to discuss your situation.*
    `.trim(),
  },
];

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Siddhi Dynamics Blog — AI & Automation Insights for Indian Businesses",
  "description": "Practical guides on business automation, agentic AI, SaaS, and ERP for Indian businesses and SMBs.",
  "url": "https://siddhidynamics.in/blog",
  "publisher": { "@type": "Organization", "name": "Siddhi Dynamics LLP", "url": "https://siddhidynamics.in" },
  "blogPost": POSTS.map(p => ({
    "@type": "BlogPosting",
    "headline": p.title,
    "description": p.excerpt,
    "url": `https://siddhidynamics.in/blog/${p.slug}`,
    "datePublished": p.date,
    "author": { "@type": "Organization", "name": "Siddhi Dynamics" },
    "keywords": p.tags.join(', ')
  }))
};

function PostCard({ post }: { post: typeof POSTS[0] }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group border border-border/50 rounded-3xl overflow-hidden bg-card/50 hover:border-primary/30 transition-all hover:shadow-lg"
    >
      {/* Color accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary to-accent" />
      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" /> {post.readTime}
          </span>
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs text-muted-foreground/70 bg-muted/30 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span>Siddhi Dynamics</span>
            <span>·</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Blog | AI Automation & Business Insights for India — Siddhi Dynamics</title>
        <meta name="description" content="Practical guides on AI business automation, agentic AI, ERP, SaaS and workflow digitization for Indian businesses and SMBs. By Siddhi Dynamics, Hyderabad." />
        <meta name="keywords" content="AI automation blog India, business automation guide India, agentic AI India, ERP guide India, SaaS India, how to automate business India" />
        <link rel="canonical" href="https://siddhidynamics.in/blog" />
        <meta property="og:title" content="Blog | AI & Automation Insights — Siddhi Dynamics" />
        <meta property="og:description" content="Practical guides on AI automation, ERP, SaaS, and business digitization for Indian businesses." />
        <meta property="og:url" content="https://siddhidynamics.in/blog" />
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden border-b border-border/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container mx-auto px-6 relative z-10">
            <nav aria-label="breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li>/</li>
                <li className="text-foreground font-medium">Blog</li>
              </ol>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <span className="inline-block text-primary text-sm font-bold tracking-widest uppercase mb-4">
                Siddhi Insights
              </span>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                AI & Automation Guides for{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Indian Businesses
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Practical, no-fluff guides on automating your business, understanding AI,
                and choosing the right technology — written for Indian business owners and operators.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {POSTS.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* More Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-8 rounded-3xl border border-dashed border-primary/30 text-center bg-primary/5"
            >
              <h3 className="font-bold text-xl text-foreground mb-2">More Articles Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                We publish new guides on AI, automation, ERP, and SaaS for Indian businesses every week.
              </p>
              <Link
                to="/#submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:scale-105 transition-transform"
              >
                Get Notified <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Topics by keyword — visible to AI/search crawlers -->  */}
        <section className="py-16 border-t border-border/30 bg-card/20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-black mb-8 text-center">Topics We Cover</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { topic: 'Business Automation for Indian SMBs', desc: 'How to automate invoicing, bookkeeping, GST filing, and operational workflows using AI.', link: '/services/business-automation' },
                  { topic: 'Agentic AI for Business', desc: 'What agentic AI is, how it differs from chatbots, and real-world applications for Indian companies.', link: '/blog' },
                  { topic: 'ERP for Small Business India', desc: 'When you need ERP, how to choose the right system, and how AI is making ERP accessible for SMBs.', link: '/services/erp' },
                  { topic: 'SaaS Product Development', desc: 'How to turn your business idea into a SaaS product — architecture, timelines, and India-market pricing.', link: '/services/saas' },
                ].map(({ topic, desc, link }) => (
                  <Link
                    key={topic}
                    to={link}
                    className="p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all group"
                  >
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{topic}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}
