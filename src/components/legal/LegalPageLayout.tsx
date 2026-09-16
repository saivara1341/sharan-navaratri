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
      <link rel="canonical" href={`https://siddhidynamics.in/${typeof window !== 'undefined' ? window.location.pathname.replace(/^\//, "") : ""}`} />
    </Helmet>
    <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

    <main className="container relative z-10 mx-auto px-6 pt-32 pb-20 flex-grow">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors mb-8 group font-semibold text-sm"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-primary" />
        <span>Back to home</span>
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto rounded-3xl bg-card border border-border/80 p-8 md:p-12 shadow-xl relative backdrop-blur-md"
      >
        <header className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-primary/15 text-primary border border-primary/25 shadow-sm">{icon}</div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">Last updated: July 30, 2026</p>
          </div>
        </header>
        <div className="prose dark:prose-invert prose-neutral max-w-none space-y-8 text-foreground prose-headings:text-foreground prose-p:text-foreground/85 prose-strong:text-foreground prose-a:text-primary">{children}</div>
      </motion.article>
    </main>
    <FooterSection />
  </div>
);

export const LegalContact = () => (
  <section className="pt-8 border-t border-border mt-8">
    <h2 className="text-xl font-bold text-foreground">Contact us</h2>
    <p className="text-foreground/85 leading-relaxed text-sm mt-2">
      Siddhi Dynamics LLP<br />
      3-5-260/2, Shivajinagar Road, Kotagally, Nizamabad, Telangana 503001, India<br />
      Email: <a className="text-primary hover:underline font-bold" href="mailto:hello@siddhidynamics.in">hello@siddhidynamics.in</a><br />
      Phone: <a className="text-primary hover:underline font-bold" href="tel:+916303602743">+91 63036 02743</a>
    </p>
  </section>
);
