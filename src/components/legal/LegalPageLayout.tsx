import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { FooterSection } from "@/components/sections/FooterSection";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
};

export const LegalPageLayout = ({ title, description, icon, children }: LegalPageLayoutProps) => (
  <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-inter">
    <Navbar />
    <Helmet>
      <title>{title} | Siddhi Dynamics</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`https://siddhidynamics.in/${window.location.pathname.replace(/^\//, "")}`} />
    </Helmet>
    <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

    <main className="container relative z-10 mx-auto px-6 pt-32 pb-20 flex-grow">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to home</span>
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto glass-card p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10"
      >
        <header className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">{icon}</div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">{title}</h1>
            <p className="text-muted-foreground">Last updated: July 30, 2026</p>
          </div>
        </header>
        <div className="prose prose-invert prose-emerald max-w-none space-y-8">{children}</div>
      </motion.article>
    </main>
    <FooterSection />
  </div>
);

export const LegalContact = () => (
  <section className="pt-8 border-t border-white/10">
    <h2 className="text-xl font-bold text-foreground">Contact us</h2>
    <p className="text-muted-foreground leading-relaxed">
      Siddhi Dynamics LLP<br />
      3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India<br />
      Email: <a className="text-primary hover:underline" href="mailto:saivaraprasad@siddhidynamics.in">saivaraprasad@siddhidynamics.in</a><br />
      Phone: <a className="text-primary hover:underline" href="tel:+916303602743">+91 63036 02743</a>
    </p>
  </section>
);
