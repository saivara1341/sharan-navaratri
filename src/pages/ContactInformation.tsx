import { Mail, MapPin, Phone, MessageSquare, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { motion } from "framer-motion";

const nizamabadAddress = '3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India';
const nizamabadMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Siddhi Dynamics LLP, ${nizamabadAddress}`)}`;
const hyderabadAddress = 'HIVE, Anurag University, Hyderabad, Telangana 500049, India';
const hyderabadMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hyderabadAddress)}`;

const ContactInformation = () => (
  <LegalPageLayout
    title="Contact Information"
    description="Official contact details, office locations, and communication channels for Siddhi Dynamics LLP."
    icon={<Mail className="w-8 h-8 text-primary" />}
  >
    <div className="space-y-8">
      {/* Intro Box */}
      <section className="p-6 rounded-2xl bg-primary/10 border border-primary/20 space-y-3">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Siddhi Dynamics LLP Official Contact
        </h2>
        <p className="text-muted-foreground leading-relaxed text-sm">
          For business inquiries, project requirement submissions, technical support, billing queries, partner collaborations, or legal notices, please reach out to us through any of the verified contact channels below.
        </p>
      </section>

      {/* Office Locations */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> Registered Office Locations
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Nizamabad Office */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-white">Nizamabad Office</h4>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">Headquarters</span>
            </div>
            <address className="not-italic text-sm text-slate-300 leading-relaxed">
              3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India
            </address>
            <a
              href={nizamabadMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white transition-colors pt-1"
            >
              Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Hyderabad Office */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-white">Hyderabad Office</h4>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-primary/20 text-primary rounded-full border border-primary/30">Incubation Hub</span>
            </div>
            <address className="not-italic text-sm text-slate-300 leading-relaxed">
              HIVE, Anurag University, Hyderabad, Telangana 500049, India
            </address>
            <a
              href={hyderabadMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white transition-colors pt-1"
            >
              Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Direct Contact Channels */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" /> Direct Communication Channels
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Phone */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Phone className="w-4 h-4" /> Phone Support
            </div>
            <a href="tel:+916303602743" className="text-base font-extrabold text-white hover:text-primary transition-colors block">
              +91 63036 02743
            </a>
            <p className="text-xs text-muted-foreground">Mon – Sat, 9:00 AM – 7:00 PM IST</p>
          </div>

          {/* Email */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 overflow-hidden">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Mail className="w-4 h-4" /> Email Enquiries
            </div>
            <a href="mailto:saivaraprasad@siddhidynamics.in" className="text-xs font-extrabold text-white hover:text-primary transition-colors block truncate">
              saivaraprasad@siddhidynamics.in
            </a>
            <p className="text-xs text-muted-foreground">Responses within 24 business hours</p>
          </div>

          {/* WhatsApp */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <MessageSquare className="w-4 h-4" /> WhatsApp Direct Chat
            </div>
            <a 
              href="https://wa.me/916303602743" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-extrabold text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Start Chat ↗
            </a>
            <p className="text-xs text-muted-foreground">Instant messaging & query tracking</p>
          </div>
        </div>
      </section>

      {/* Response Timeline & Notice */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Expected Response Times
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Business enquiries are acknowledged within 24-48 business hours. For project submissions, you will receive a customized roadmap, timeline, and quote directly from founder Sai Vara Prasad.
        </p>
      </section>
    </div>
  </LegalPageLayout>
);

export default ContactInformation;
