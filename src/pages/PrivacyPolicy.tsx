import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { Shield, Lock, Eye, FileText, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-inter">
      <Navbar />
      <Helmet>
        <title>Privacy Policy | Siddhi Dynamics</title>
      </Helmet>

      {/* Background patterns */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-6 pt-32 pb-20 flex-grow">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Matrix</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Privacy Policy</h1>
              <p className="text-muted-foreground">Last Updated: July 30, 2026</p>
            </div>
          </div>

          <div className="prose prose-invert prose-emerald max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" /> 1. Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At <strong>Siddhi Dynamics</strong> ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website (https://siddhidynamics.in) and our AI architectural services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> 2. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                When you interact with our platform, we may collect:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Identity Data:</strong> Full name and professional role.</li>
                <li><strong>Contact Data:</strong> Email address provided via Google OAuth.</li>
                <li><strong>Profile Data:</strong> We may receive your Google profile picture and name when you authenticate via Google OAuth to personalize your dashboard experience.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns.</li>
                <li><strong>Submission Data:</strong> Any architectural queries or project details you submit through our Neural Hub.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> 3. How We Use Your Data
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data is used to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide and maintain our AI services.</li>
                <li>Authenticate your identity via Google OAuth.</li>
                <li>Communicate with you regarding your project submissions.</li>
                <li>Improve our Neural Engine and user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> 4. Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement state-of-the-art security measures, including encryption and secure authentication through Supabase, to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way.
              </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> 5. Data Retention and Deletion
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. 
                </p>
                <p className="text-muted-foreground mt-2">
                  You have the right to request the deletion of your account and associated data at any time. To request data deletion, please contact us at <a href="mailto:saivaraprasad@siddhidynamics.in" className="text-primary hover:underline">saivaraprasad@siddhidynamics.in</a>. Upon verification of your request, we will remove your personal information from our active databases within 30 days.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-foreground">6. Your Legal Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                    Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, or erasure of your data.
                </p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-foreground">7. Contact Us</h2>
              <p className="text-muted-foreground">
                For any questions about this Privacy Policy, please contact our support team:
              </p>
              <a 
                href="mailto:saivaraprasad@siddhidynamics.in"
                className="text-primary hover:underline font-bold"
              >
                saivaraprasad@siddhidynamics.in
              </a>
            </section>
          </div>
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
};

export default PrivacyPolicy;
