import { Truck, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { LegalContact, LegalPageLayout } from "@/components/legal/LegalPageLayout";

const ShippingDeliveryPolicy = () => (
  <LegalPageLayout
    title="Shipping & Delivery Policy (Digital Deliveries)"
    description="Official delivery timelines and digital fulfillment policies for Siddhi Dynamics LLP and Sharan Navaratri platforms."
    icon={<Truck className="w-8 h-8 text-primary" />}
  >
    <div className="space-y-8 not-prose text-foreground text-sm leading-relaxed">
      {/* Digital Service Clarification */}
      <section className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <span>100% Digital Delivery Fulfillment — Cashfree Compliance</span>
        </div>
        <p className="text-xs sm:text-sm text-foreground/80">
          <strong>Siddhi Dynamics LLP</strong> provides technology software, cloud solutions, and digital advertising platforms (including <strong>sharan-navratri.vercel.app</strong>). All products, festive advertisement packages, and mandapam services sold on our websites are <strong>purely digital services delivered electronically</strong>. We do not manufacture or ship physical goods requiring postal or courier transit.
        </p>
      </section>

      {/* 1. Digital Deliverables */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-foreground">1. Nature of Digital Deliverables</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <li><strong>Sharan Navaratri Ad Placements:</strong> Digital banner spaces, visiting cards, and promotional bulletins displayed to devotees discovering mandapams across selected zones.</li>
          <li><strong>Mandapam Digital Passes &amp; QR Tokens:</strong> Electronic queue booking passes, confirmation SMS, and printable/downloadable QR passes.</li>
          <li><strong>Custom Software &amp; AI Automations:</strong> Cloud deployment, GitHub repository access, staging URLs, and production software modules.</li>
        </ul>
      </section>

      {/* 2. Fulfillment Timelines */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> 2. Delivery Timelines
        </h2>
        <div className="grid gap-4 sm:grid-cols-3 pt-1 text-xs">
          <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
            <span className="font-bold text-primary block uppercase text-[10px]">Festive Advertisements</span>
            <h4 className="font-bold text-foreground text-sm">2 to 4 Hours</h4>
            <p className="text-muted-foreground">
              Once payment is completed, ad creatives are reviewed and deployed live to the Sharan Navaratri platform within 2 to 4 hours.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
            <span className="font-bold text-primary block uppercase text-[10px]">Devotee Passes &amp; Tokens</span>
            <h4 className="font-bold text-foreground text-sm">Instant Delivery</h4>
            <p className="text-muted-foreground">
              Delivered immediately on-screen and sent via confirmation SMS / WhatsApp upon successful checkout.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
            <span className="font-bold text-primary block uppercase text-[10px]">Custom Software Engagements</span>
            <h4 className="font-bold text-foreground text-sm">Per Project SOW</h4>
            <p className="text-muted-foreground">
              Milestone builds delivered via secure staging links and cloud deployment in accordance with the signed project timeline.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Delivery Confirmation & Proof */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-foreground">3. Delivery Confirmation &amp; Support</h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          A digital invoice and confirmation email containing transaction reference numbers, order details, and active URL links are dispatched to your registered email address immediately upon transaction completion through <strong>Cashfree Payment Gateway</strong>.
        </p>
        <p className="text-muted-foreground text-xs sm:text-sm">
          If you experience any delay or difficulty accessing your purchased digital service or ad campaign, please contact our support desk at <a href="mailto:hello@siddhidynamics.in" className="text-primary hover:underline font-bold">hello@siddhidynamics.in</a> or call <a href="tel:+916303602743" className="text-primary hover:underline font-bold">+91 63036 02743</a>.
        </p>
      </section>

      <LegalContact />
    </div>
  </LegalPageLayout>
);

export default ShippingDeliveryPolicy;
