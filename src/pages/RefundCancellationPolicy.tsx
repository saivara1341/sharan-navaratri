import { Ban } from "lucide-react";
import { LegalContact, LegalPageLayout } from "@/components/legal/LegalPageLayout";

const RefundCancellationPolicy = () => (
  <LegalPageLayout
    title="Refund & Cancellation Policy"
    description="Refund and cancellation terms for services purchased from Siddhi Dynamics LLP."
    icon={<Ban className="w-8 h-8" />}
  >
    <section>
      <h2 className="text-xl font-bold text-foreground">1. Scope</h2>
      <p className="text-muted-foreground leading-relaxed">This policy applies to software development, consulting, subscriptions, digital services, and other services purchased directly from Siddhi Dynamics LLP.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">2. Cancellations</h2>
      <p className="text-muted-foreground leading-relaxed">You may request cancellation by email before work begins. If work has started, cancellation is subject to the signed proposal, statement of work, or order terms, and you remain responsible for completed work and committed third-party costs. Subscription cancellations take effect at the end of the current paid billing period unless stated otherwise.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">3. Refund eligibility</h2>
      <p className="text-muted-foreground leading-relaxed">Approved refunds are limited to amounts paid for work not yet performed. Completed milestones, delivered digital products, domain or hosting charges, licenses, payment-gateway fees, and other non-recoverable third-party costs are non-refundable. Custom work is not refundable after written approval or delivery.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">4. Request and processing</h2>
      <p className="text-muted-foreground leading-relaxed">Send your request within 7 days of payment with your name, invoice or transaction ID, service, and reason. We will review it and normally respond within 5 business days. Approved refunds are returned to the original payment method within 7–10 business days; bank or payment-provider timelines may vary.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">5. Service issues</h2>
      <p className="text-muted-foreground leading-relaxed">If a deliverable materially differs from the agreed scope, notify us promptly. We will first make reasonable efforts to correct or re-perform the affected service before considering a refund.</p>
    </section>
    <LegalContact />
  </LegalPageLayout>
);

export default RefundCancellationPolicy;
