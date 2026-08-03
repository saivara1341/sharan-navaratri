import { Mail } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

const ContactInformation = () => (
  <LegalPageLayout
    title="Contact Information"
    description="Official contact information for Siddhi Dynamics LLP."
    icon={<Mail className="w-8 h-8" />}
  >
    <section>
      <h2 className="text-xl font-bold text-foreground">Siddhi Dynamics LLP</h2>
      <p className="text-muted-foreground leading-relaxed">For sales, support, billing, complaints, privacy requests, or legal notices, contact us using the details below. Please include your invoice or transaction ID for payment-related queries.</p>
    </section>
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-bold text-foreground">Registered contact office</h2>
        <address className="not-italic text-muted-foreground leading-relaxed">3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India</address>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-bold text-foreground">Hyderabad office</h2>
        <address className="not-italic text-muted-foreground leading-relaxed">HIVE, Anurag University, Hyderabad, Telangana 500049, India</address>
      </div>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">Email and phone</h2>
      <p className="text-muted-foreground leading-relaxed">
        Primary Email: <a className="text-primary hover:underline" href="mailto:saivaraprasad@siddhidynamics.in">saivaraprasad@siddhidynamics.in</a><br />
        Support / Admin Email: <a className="text-primary hover:underline" href="mailto:ssaivaraprasad51@gmail.com">ssaivaraprasad51@gmail.com</a><br />
        Phone / WhatsApp: <a className="text-primary hover:underline" href="tel:+916303602743">+91 63036 02743</a><br />
        Website: <a className="text-primary hover:underline" href="https://siddhidynamics.com">https://siddhidynamics.com</a>
      </p>
      <p className="text-muted-foreground leading-relaxed">Business enquiries are normally acknowledged within 2 business days. Payment, refund, or delivery requests are handled according to the applicable policy and project agreement.</p>
    </section>
  </LegalPageLayout>
);

export default ContactInformation;
