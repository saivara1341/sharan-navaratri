import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { LegalContact, LegalPageLayout } from "@/components/legal/LegalPageLayout";

const PrivacyPolicy = () => (
  <LegalPageLayout
    title="Privacy Notice"
    description="How Siddhi Dynamics LLP collects, uses and protects your personal data under India's Digital Personal Data Protection Act, 2023."
    icon={<Shield className="w-8 h-8" />}
  >
    <section>
      <h2 className="text-xl font-bold text-foreground">1. Who we are</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong>Siddhi Dynamics LLP</strong> ("we", "us") is the <strong>Data Fiduciary</strong> for the personal data
        processed through https://siddhidynamics.in and our client, partner, employee and investor portals. This notice
        is issued under Section 5 of the Digital Personal Data Protection Act, 2023 ("DPDP Act") and describes, in
        clear and plain language, what personal data we process, why, and the rights you have as a{" "}
        <strong>Data Principal</strong>.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">2. Personal data we collect and why</h2>
      <div className="overflow-x-auto not-prose mt-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-foreground">
              <th className="p-3 border-b border-white/10">Data</th>
              <th className="p-3 border-b border-white/10">Purpose (specified use)</th>
              <th className="p-3 border-b border-white/10">Lawful basis</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr>
              <td className="p-3 border-b border-white/5">Name, email, phone, organisation, designation</td>
              <td className="p-3 border-b border-white/5">Responding to enquiries, project quotes, onboarding you to a portal</td>
              <td className="p-3 border-b border-white/5">Your consent</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-white/5">Requirement descriptions, project files, messages</td>
              <td className="p-3 border-b border-white/5">Delivering the services you requested and keeping a delivery record</td>
              <td className="p-3 border-b border-white/5">Consent / performance of our engagement</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-white/5">Google account name, email and profile picture (if you sign in with Google)</td>
              <td className="p-3 border-b border-white/5">Authenticating you and personalising your portal</td>
              <td className="p-3 border-b border-white/5">Your consent</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-white/5">Waitlist name, email, product rating</td>
              <td className="p-3 border-b border-white/5">Notifying you about the product you asked to be notified about</td>
              <td className="p-3 border-b border-white/5">Your consent</td>
            </tr>
            <tr>
              <td className="p-3 border-b border-white/5">Device, browser and usage data</td>
              <td className="p-3 border-b border-white/5">Site security and, where you allow it, aggregated analytics</td>
              <td className="p-3 border-b border-white/5">Legitimate uses (security) / your consent (analytics)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground leading-relaxed mt-3">
        We collect only the data necessary for these purposes (Section 6(1)). We do not sell personal data and we do
        not use it for automated decisions that produce legal effects.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">3. Consent and withdrawal</h2>
      <p className="text-muted-foreground leading-relaxed">
        Where we rely on consent, we ask for it at the point of collection with an unticked checkbox alongside this
        notice. Consent is free, specific, informed, unconditional and unambiguous. You may withdraw it at any time —
        withdrawal is as easy as giving it — from the{" "}
        <Link to="/data-rights" className="text-primary hover:underline">Data Rights</Link> page. Withdrawal does not
        affect processing carried out before withdrawal, and we will stop processing and erase the data unless a law
        requires us to retain it.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">4. Children and persons with disability</h2>
      <p className="text-muted-foreground leading-relaxed">
        Our services are not directed at children under 18. In line with Section 9 of the DPDP Act, we do not knowingly
        process a child's personal data without verifiable parental consent, and we never undertake tracking,
        behavioural monitoring or targeted advertising directed at children. If you believe a child has provided us
        data, contact our Grievance Officer and we will erase it.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">5. Data Processors and sharing</h2>
      <p className="text-muted-foreground leading-relaxed">
        We engage Data Processors under contract to operate the platform — cloud hosting and database/authentication
        infrastructure, transactional email delivery, and AI processing for assistant features. They act only on our
        instructions. We also share data where disclosure is required by law or a court order. Any transfer outside
        India is made only to countries not restricted by the Central Government under Section 16.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">6. Security safeguards</h2>
      <p className="text-muted-foreground leading-relaxed">
        As required by Section 8(5), we maintain reasonable security safeguards: encryption in transit, row-level
        access control on every database table, role-based portal access, server-side handling of API keys and secrets,
        input validation and rate limiting, and least-privilege access for our team. In the event of a personal data
        breach we will notify the Data Protection Board of India and every affected Data Principal without delay.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">7. Retention and erasure</h2>
      <p className="text-muted-foreground leading-relaxed">
        We keep personal data only while the purpose is being served or while a legal, accounting or contractual
        obligation requires retention. Enquiry and waitlist data is erased within 24 months of your last interaction;
        engagement records are retained for the statutory period applicable to our books of account. When you withdraw
        consent or the purpose is no longer served, we erase the data and instruct our Processors to do the same.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">8. Your rights</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
        <li><strong>Right to information</strong> — a summary of your data and the processing we carry out (Sec. 11).</li>
        <li><strong>Right to correction and erasure</strong> — correct, complete, update or erase your data (Sec. 12).</li>
        <li><strong>Right to grievance redressal</strong> — a readily available means of complaint (Sec. 13).</li>
        <li><strong>Right to nominate</strong> — nominate a person to exercise your rights on death or incapacity (Sec. 14).</li>
        <li><strong>Right to withdraw consent</strong> at any time (Sec. 6(4)–(6)).</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Exercise any of these on the{" "}
        <Link to="/data-rights" className="text-primary hover:underline">Data Rights</Link> page. We respond within 30
        days. You also have a duty under Section 15 not to furnish false particulars or file frivolous complaints.
      </p>
    </section>

    <section>
      <h2 className="text-xl font-bold text-foreground">9. Grievance Officer</h2>
      <p className="text-muted-foreground leading-relaxed">
        Sarugu Sai Vara Prasad — Founder &amp; Designated Partner, and Grievance Officer under Section 13 of the DPDP
        Act, 2023.<br />
        Email: <a className="text-primary hover:underline" href="mailto:saivaraprasad@siddhidynamics.in">saivaraprasad@siddhidynamics.in</a><br />
        Phone: <a className="text-primary hover:underline" href="tel:+916303602743">+91 63036 02743</a><br />
        If unsatisfied with our response, you may complain to the Data Protection Board of India.
      </p>
    </section>

    <LegalContact />
  </LegalPageLayout>
);

export default PrivacyPolicy;
