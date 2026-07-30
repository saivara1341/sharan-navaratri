import { Cookie } from "lucide-react";
import { LegalContact, LegalPageLayout } from "@/components/legal/LegalPageLayout";

const CookiePolicy = () => (
  <LegalPageLayout
    title="Cookie Policy"
    description="How Siddhi Dynamics LLP uses cookies and similar technologies."
    icon={<Cookie className="w-8 h-8" />}
  >
    <section>
      <h2 className="text-xl font-bold text-foreground">1. What cookies are</h2>
      <p className="text-muted-foreground leading-relaxed">Cookies are small text files stored on your device. Similar technologies, such as local storage, may also remember preferences or help features work correctly.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">2. How we use them</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-2">
        <li><strong>Strictly necessary:</strong> security, authentication, session management, and core site operation.</li>
        <li><strong>Preferences:</strong> language and interface settings you choose.</li>
        <li><strong>Analytics:</strong> aggregated information that helps us understand performance and improve the website, where enabled.</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">3. Third parties</h2>
      <p className="text-muted-foreground leading-relaxed">Service providers used for authentication, hosting, security, payments, embedded content, or analytics may set their own cookies subject to their policies. We do not use cookies to sell personal information.</p>
    </section>
    <section>
      <h2 className="text-xl font-bold text-foreground">4. Your choices</h2>
      <p className="text-muted-foreground leading-relaxed">You can block or delete cookies through your browser settings. Disabling strictly necessary storage may prevent sign-in, portals, saved preferences, or other site features from working. Where a consent control is displayed, you can change optional-cookie choices through that control.</p>
    </section>
    <LegalContact />
  </LegalPageLayout>
);

export default CookiePolicy;
