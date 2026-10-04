import { Ban, Clock, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import { LegalContact, LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { Link } from "react-router-dom";

const RefundCancellationPolicy = () => (
  <LegalPageLayout
    title="Refund & Cancellation Policy"
    description="Official refund and cancellation terms for digital advertising packages, mandapam services, and software solutions purchased from Siddhi Dynamics LLP."
    icon={<Ban className="w-8 h-8 text-primary" />}
  >
    <div className="space-y-8 not-prose text-foreground text-sm leading-relaxed">
      {/* Overview Notice */}
      <section className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <span>Transparent Consumer Protection &amp; Cashfree Payment Policy</span>
        </div>
        <p className="text-xs sm:text-sm text-foreground/80">
          This Refund &amp; Cancellation Policy governs all digital services, festive advertising packages, and software products purchased through <strong>siddhidynamics.in</strong> and <strong>sharan-navratri.vercel.app</strong> operated by <strong>Siddhi Dynamics LLP</strong>. Online payments are processed securely via <strong>Cashfree Payment Gateway</strong>.
        </p>
      </section>

      {/* 1. Scope of Policy */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-foreground">1. Scope of Policy</h2>
        <p className="text-muted-foreground">
          This policy applies to all transactions made on our platforms, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-muted-foreground">
          <li><strong>Sharan Navaratri Hyper-Local Advertising Packages:</strong> 1-Day Daily Booster (₹49), 3-Days Weekend Rush (₹129), 9-Days Maha Utsav Pass (₹349), and custom banner sponsorships.</li>
          <li><strong>Mandapam Digital Passes &amp; Seva Bookings:</strong> Devotee priority tokens and pooja slot reservations where fee collection is enabled by mandapam committees.</li>
          <li><strong>Siddhi Dynamics Enterprise Services:</strong> Custom AI automations, web portal development, SaaS infrastructure, and technical consulting.</li>
        </ul>
      </section>

      {/* 2. Cancellation Terms */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-foreground">2. Cancellation Policy &amp; Timelines</h2>
        <div className="grid gap-3 sm:grid-cols-2 pt-1">
          <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
            <h4 className="font-bold text-foreground text-xs uppercase text-primary">Festive Advertising Packages</h4>
            <p className="text-xs text-muted-foreground">
              You may cancel an ad booking <strong>prior to ad review and activation</strong> (within 2 hours of submission). Once an advertisement is reviewed, approved, and live on the Sharan Navaratri portal, cancellations cannot be accepted for the active running days as server impressions and digital placements are consumed in real-time.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
            <h4 className="font-bold text-foreground text-xs uppercase text-primary">Custom Software &amp; Consulting</h4>
            <p className="text-xs text-muted-foreground">
              Clients may request cancellation by written email notice before sprint engineering begins. If work has begun, cancellation is subject to the signed Statement of Work (SOW), and the client is responsible only for completed milestone work and non-recoverable third-party infrastructure fees.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Refund Eligibility & Failed Payments */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-foreground">3. Refund Eligibility &amp; Failed Transactions</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <li><strong>Failed / Incomplete Transactions:</strong> If your bank account or card is debited but the transaction shows failed on the website, the amount is automatically reversed by Cashfree Payment Gateway to your source account within <strong>24 to 48 hours</strong>.</li>
          <li><strong>Duplicate Charges:</strong> In case of accidental duplicate payment for the same ad slot or service, the duplicate payment will be refunded in full upon verification.</li>
          <li><strong>Rejected Advertisements:</strong> If an ad submission violates our community guidelines or legal standards and cannot be published, 100% of the paid amount will be refunded immediately.</li>
          <li><strong>Delivered &amp; Completed Services:</strong> Digital advertising impressions that have already run on the website, completed software milestones, registered domain names, and third-party API usage fees are non-refundable.</li>
        </ul>
      </section>

      {/* 4. Refund Processing Timeline */}
      <section className="p-5 rounded-2xl border border-border bg-card space-y-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> 4. Refund Processing Timeline (5–7 Business Days)
        </h2>
        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
          Once an eligible refund request is verified and approved by our billing team:
        </p>
        <div className="grid gap-3 sm:grid-cols-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-1">
            <span className="font-bold text-primary block">Step 1: Verification</span>
            <p className="text-muted-foreground">Request reviewed within 24 business hours of receipt.</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-1">
            <span className="font-bold text-primary block">Step 2: Gateway Initiation</span>
            <p className="text-muted-foreground">Refund triggered via Cashfree Payment Gateway to original payment method.</p>
          </div>
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 space-y-1">
            <span className="font-bold text-primary block">Step 3: Bank Settlement</span>
            <p className="text-muted-foreground">Credited to customer bank/card/UPI within <strong>5–7 business days</strong>.</p>
          </div>
        </div>
      </section>

      {/* 5. How to Request a Refund */}
      <section className="space-y-2">
        <h2 className="text-lg font-bold text-foreground">5. How to Request a Cancellation or Refund</h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          To initiate a cancellation or refund request, please email our support team with:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-muted-foreground">
          <li>Your full name and registered phone number.</li>
          <li>Transaction Reference / Cashfree Order ID / UPI UTR Number.</li>
          <li>Name of the purchased advertising package or service.</li>
          <li>Reason for the cancellation or refund request.</li>
        </ul>
        <p className="text-xs text-muted-foreground pt-1">
          Send your email to <a href="mailto:hello@siddhidynamics.in" className="text-primary hover:underline font-bold">hello@siddhidynamics.in</a> or WhatsApp / Call our helpline at <a href="tel:+916303602743" className="text-primary hover:underline font-bold">+91 63036 02743</a>.
        </p>
      </section>

      <LegalContact />
    </div>
  </LegalPageLayout>
);

export default RefundCancellationPolicy;
