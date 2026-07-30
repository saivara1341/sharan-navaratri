import { Truck } from "lucide-react";
import { LegalContact, LegalPageLayout } from "@/components/legal/LegalPageLayout";

const ShippingDeliveryPolicy = () => (
  <LegalPageLayout
    title="Shipping & Delivery Policy"
    description="Delivery timelines and methods for Siddhi Dynamics LLP digital services and physical items."
    icon={<Truck className="w-8 h-8" />}
  >
    <section>
      <h2 className="text-xl font-bold text-foreground">1. Digital services</h2>
      <p className="text-muted-foreground leading-relaxed">Our services and deliverables are primarily digital. Delivery may be made by email, secure download, client portal, repository access, cloud deployment, or another method agreed in the proposal or statement of work.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">2. Delivery timelines</h2>
      <p className="text-muted-foreground leading-relaxed">Estimated dates are confirmed in the applicable order or project plan. Timelines begin after payment, required content, access, and approvals are received. Client-requested changes, delayed feedback, technical dependencies, or events outside our control may extend delivery dates, and we will communicate material delays.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">3. Physical items</h2>
      <p className="text-muted-foreground leading-relaxed">If an order includes a physical item, available shipping locations, fees, carrier, tracking, and estimated delivery will be communicated before dispatch. Unless otherwise agreed, risk passes to the customer upon confirmed delivery. Please report loss or visible damage within 48 hours.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">4. Acceptance</h2>
      <p className="text-muted-foreground leading-relaxed">Digital deliverables are considered delivered when sent to the contact email, made available through the agreed system, or deployed to the agreed environment. Review and acceptance periods, where applicable, follow the signed proposal or statement of work.</p>
    </section>
    <LegalContact />
  </LegalPageLayout>
);

export default ShippingDeliveryPolicy;
