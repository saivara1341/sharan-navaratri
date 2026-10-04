import React from "react";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  Code2, 
  HelpCircle,
  Building,
  ArrowRight
} from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { motion } from "framer-motion";

export const Pricing: React.FC = () => {
  return (
    <LegalPageLayout
      title="Products, Services & Pricing (INR)"
      description="Comprehensive catalog of digital advertising packages, mandapam services, and custom software development solutions with transparent pricing in Indian Rupees (INR) by Siddhi Dynamics LLP."
      icon={<CreditCard className="w-8 h-8 text-primary" />}
    >
      <div className="space-y-10 not-prose">
        {/* Compliance Notice Banner */}
        <section className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Official Pricing &amp; Currency Policy — Cashfree Compliance</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
            All products, digital advertising packages, and software services offered on <strong>siddhidynamics.in</strong> and <strong>sharan-navratri.vercel.app</strong> are operated by <strong>Siddhi Dynamics LLP</strong>. All prices are explicitly denominated in <strong>Indian Rupees (INR / ₹)</strong>. Transactions are securely processed through our licensed payment partner <strong>Cashfree Payment Gateway</strong>.
          </p>
        </section>

        {/* SECTION 1: Sharan Navaratri Hyper-Local Advertising Packages */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Store className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">1. Sharan Navaratri Hyper-Local Advertising Packages</h2>
              <p className="text-xs text-muted-foreground">Digital banner and visiting-card ad placements for local businesses during the festive season.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 pt-2">
            {/* Package 1 */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  1-Day Flash Promo
                </span>
                <h3 className="text-lg font-bold text-foreground">1 Day Daily Booster</h3>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-black text-foreground">₹49</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ 1 day (INR)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ideal for flash festive discounts, sweet stall launches, or single auspicious pooja days (e.g., Kalasha Sthapana or Durgashtami).
                </p>
                <div className="pt-3 border-t border-border space-y-1.5 text-xs text-foreground/80">
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Up to ~1,500 devotee views</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Zone-targeted mandapam display</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 1-Tap Call &amp; WhatsApp CTA</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Instant activation upon approval</p>
                </div>
              </div>
              <Link 
                to="/navaratri/advertise"
                className="w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold text-center block transition-colors"
              >
                Book 1-Day Ad (₹49) →
              </Link>
            </motion.div>

            {/* Package 2 */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl border-2 border-primary bg-card shadow-md space-y-4 flex flex-col justify-between relative overflow-hidden"
            >
              <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-xs">
                MOST POPULAR
              </span>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  3-Day Peak Rush
                </span>
                <h3 className="text-lg font-bold text-foreground">3 Days Weekend Rush</h3>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-black text-primary">₹129</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ 3 days (INR)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Designed for weekend crowds, Moola Nakshatram, and peak evening devotee rush in prime mandapam zones.
                </p>
                <div className="pt-3 border-t border-border space-y-1.5 text-xs text-foreground/80">
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Up to ~5,000 devotee views</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Home &amp; Explore placement</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Visiting card / Bulletin format</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Zone priority rotation</p>
                </div>
              </div>
              <Link 
                to="/navaratri/advertise"
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold text-center block shadow transition-all"
              >
                Book 3-Day Ad (₹129) →
              </Link>
            </motion.div>

            {/* Package 3 */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  9-Day Full Festival
                </span>
                <h3 className="text-lg font-bold text-foreground">9 Days Maha Utsav Pass</h3>
                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-3xl font-black text-foreground">₹349</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ 9 days (INR)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete 9-day omnipresence throughout Navaratri and Vijaya Dashami across all city mandapams.
                </p>
                <div className="pt-3 border-t border-border space-y-1.5 text-xs text-foreground/80">
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Up to ~18,000 devotee views</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Top banner on all citizen pages</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Desktop flanking &amp; mobile banner</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> End-of-festival analytics summary</p>
                </div>
              </div>
              <Link 
                to="/navaratri/advertise"
                className="w-full py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold text-center block transition-colors"
              >
                Book 9-Day Ad (₹349) →
              </Link>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Mandapam Passes & Community Seva Services */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">2. Mandapam Devotee Passes &amp; Pooja Seva Offerings</h2>
              <p className="text-xs text-muted-foreground">Digital passes and seva tokens managed by registered Durga Mandapam committees.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-sm text-foreground">General Devotee Darshan</h4>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹0 <span className="text-xs text-muted-foreground font-normal">/ Free</span></p>
              <p className="text-xs text-muted-foreground">Free electronic queue pass and digital darshan timings for all devotees.</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-sm text-foreground">Special Pooja / Seva Token</h4>
              <p className="text-2xl font-black text-foreground">₹100 – ₹500 <span className="text-xs text-muted-foreground font-normal">INR</span></p>
              <p className="text-xs text-muted-foreground">Specific pooja slots (Kumkumarchana, Chandi Homam) designated by mandapam committees.</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-sm text-foreground">VIP / Quick Darshan Token</h4>
              <p className="text-2xl font-black text-foreground">₹150 – ₹300 <span className="text-xs text-muted-foreground font-normal">INR</span></p>
              <p className="text-xs text-muted-foreground">Expedited entry token during peak festival aarti hours where approved by committees.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Siddhi Dynamics Software & AI Development Services */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Code2 className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">3. Siddhi Dynamics Custom Software &amp; AI Services</h2>
              <p className="text-xs text-muted-foreground">Deep-tech AI automations, web applications, and enterprise digital infrastructure.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                AI Solutions
              </span>
              <h4 className="font-bold text-base text-foreground">Business AI &amp; Workflow Automations</h4>
              <p className="text-2xl font-black text-foreground">Starting ₹14,999 <span className="text-xs text-muted-foreground font-normal">INR</span></p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Autonomous LLM agents, document OCR parsers, multi-agent WhatsApp customer workflows, and automated pipeline integrations.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Custom Web Apps
              </span>
              <h4 className="font-bold text-base text-foreground">High-Performance Web &amp; Mobile Portals</h4>
              <p className="text-2xl font-black text-foreground">Starting ₹19,999 <span className="text-xs text-muted-foreground font-normal">INR</span></p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full-stack React / Vite / Node.js web applications, mobile responsiveness, fast edge performance, and complete 30-day hypercare warranty.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Enterprise Cloud
              </span>
              <h4 className="font-bold text-base text-foreground">Custom ERP &amp; SaaS Systems</h4>
              <p className="text-2xl font-black text-foreground">Starting ₹49,999 <span className="text-xs text-muted-foreground font-normal">INR</span></p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                End-to-end multi-tenant SaaS architecture, role-based governance, payment gateway integration, database clustering, and SLA maintenance.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Payment Terms, Currency & Cashfree Information */}
        <section className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Payment Processing &amp; Currency Disclosure
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 text-xs text-foreground/80 leading-relaxed">
            <div className="space-y-1.5">
              <p><strong>Currency:</strong> All payments on this site are billed strictly in <strong>Indian National Rupees (INR / ₹)</strong>.</p>
              <p><strong>Payment Partner:</strong> Online payments are securely routed via <strong>Cashfree Payment Gateway</strong> (Cashfree Payments India Private Limited), an RBI-authorized payment aggregator.</p>
              <p><strong>Supported Modes:</strong> UPI (Google Pay, PhonePe, Paytm, BHIM), Debit / Credit Cards (RuPay, Visa, MasterCard), Net Banking (50+ Indian banks), and Wallets.</p>
            </div>
            <div className="space-y-1.5">
              <p><strong>Taxes &amp; Invoicing:</strong> Rates are subject to statutory Goods and Services Tax (GST) wherever applicable. Tax invoices are automatically generated and emailed upon payment confirmation.</p>
              <p><strong>Refunds &amp; Cancellations:</strong> Governed by our official <Link to="/refund-cancellation-policy" className="text-primary hover:underline font-bold">Refund &amp; Cancellation Policy</Link>. Eligible refunds are credited within 5–7 business days to the source payment method.</p>
            </div>
          </div>
        </section>

        {/* Merchant Contact Footer */}
        <section className="pt-6 border-t border-border text-xs text-muted-foreground space-y-1">
          <p><strong>Merchant Legal Entity:</strong> Siddhi Dynamics LLP</p>
          <p><strong>Registered Office:</strong> 3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India</p>
          <p><strong>Billing &amp; Support Contact:</strong> Phone: <a href="tel:+916303602743" className="text-primary hover:underline font-bold">+91 63036 02743</a> • Email: <a href="mailto:hello@siddhidynamics.in" className="text-primary hover:underline font-bold">hello@siddhidynamics.in</a></p>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default Pricing;
