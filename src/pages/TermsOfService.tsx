import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";
import { Gavel, Scale, FileText, ChevronLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-inter">
      <Navbar />
      <Helmet>
        <title>Terms of Service | Siddhi Dynamics</title>
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
          className="max-max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Gavel className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Terms of Service</h1>
              <p className="text-muted-foreground">Last Updated: March 21, 2026</p>
            </div>
          </div>

          <div className="prose prose-invert prose-emerald max-max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" /> 1. Agreement to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the <strong>Siddhi Dynamics</strong> platform (https://siddhidynamics.in), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> 2. Use of Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services provide AI-driven architectural insights and project management tools. You agree to use these services only for lawful purposes and in a way that does not infringe the rights of others.
              </p>
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3 items-start mt-4">
                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-primary/80 italic">
                    Note: Siddhi Dynamics provides AI-generated suggestions. All final architectural decisions should be verified by certified professionals.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account via Google OAuth, you are responsible for maintaining the security of your account and for all activities that occur under the account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, trademarks, and data provided on this platform are the property of Siddhi Dynamics. You may not reproduce or distribute any part of our service without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Siddhi Dynamics shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
              </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-foreground">6. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                    These terms are governed by and construed in accordance with the laws of India.
                </p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-foreground">7. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions regarding these Terms, please contact us at:
              </p>
              <a 
                href="mailto:ssaivaraprasad51@gmail.com" 
                className="text-primary hover:underline font-bold"
              >
                ssaivaraprasad51@gmail.com
              </a>
            </section>
          </div>
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
};

export default TermsOfService;
