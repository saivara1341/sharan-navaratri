import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { SiteIntro } from "@/components/SiteIntro";

const queryClient = new QueryClient();
const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/Auth"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const VMagneticMindsPortal = lazy(() => import("./pages/VMagneticMindsPortal"));
const InvestorPortal = lazy(() => import("./pages/InvestorPortal"));
const EmployeePortal = lazy(() => import("./pages/EmployeePortal"));
const PortalGateway = lazy(() => import("./pages/PortalGateway"));
const NexusLanding = lazy(() => import("./pages/projects/NexusLanding"));
const NilayamLanding = lazy(() => import("./pages/projects/NilayamLanding"));
const ArchPlanLanding = lazy(() => import("./pages/projects/ArchPlanLanding"));
const LetUsKnowLanding = lazy(() => import("./pages/projects/LetUsKnowLanding"));
const WishOLanding = lazy(() => import("./pages/projects/WishOLanding"));
const AdminPortal = lazy(() => import("./pages/AdminPortal"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundCancellationPolicy = lazy(() => import("./pages/RefundCancellationPolicy"));
const ShippingDeliveryPolicy = lazy(() => import("./pages/ShippingDeliveryPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ContactInformation = lazy(() => import("./pages/ContactInformation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResourceHub = lazy(() => import("@/pages/services/ResourceHub"));
const ResumeBuilder = lazy(() => import("@/pages/services/ResumeBuilder"));
const StartupBlueprint = lazy(() => import("@/pages/services/StartupBlueprint"));
const About = lazy(() => import("@/pages/About"));
const Blog = lazy(() => import("@/pages/Blog"));
const BusinessAutomation = lazy(() => import("@/pages/services/BusinessAutomation"));
const WebsiteDevelopment = lazy(() => import("@/pages/services/WebsiteDevelopment"));
const SaaSPlatforms = lazy(() => import("@/pages/services/SaaSPlatforms"));
const ERPSolutions = lazy(() => import("@/pages/services/ERPSolutions"));
const SoftwareCompanyNizamabad = lazy(() => import("@/pages/SoftwareCompanyNizamabad"));
const ProjectSubmitForm = lazy(() => import("./pages/ProjectSubmitForm"));

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = (email?: string) => {
      if (!email) return false;
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com")
        .split(",")
        .map((e: string) => e.trim().toLowerCase());
      return adminEmails.includes(email.trim().toLowerCase());
    };

    const checkUserRoleAndRedirect = async (session: any) => {
      if (!session) return;
      const email = session.user.email?.trim().toLowerCase();
      if (checkAdmin(email)) {
        navigate("/admin-hq-nexus");
        return;
      }

      if (email === '23eg510a07@anurag.edu.in') {
        navigate("/portal/v-magnetic-minds");
        return;
      }

      const role = session.user.user_metadata?.role;
      if (role === 'employee') {
        navigate("/portal/employee");
        return;
      } else if (role === 'client') {
        navigate("/portal/client");
        return;
      } else if (role === 'investor') {
        navigate("/portal/investor");
        return;
      } else if (role === 'partner') {
        navigate("/portal/v-magnetic-minds");
        return;
      }

      // Check database to see if this email is registered
      if (email) {
        try {
          const { data, error } = await supabase
            .from('contact_submissions')
            .select('id')
            .eq('email', email.trim().toLowerCase())
            .limit(1);

          if (data && data.length > 0) {
            await supabase.auth.updateUser({
              data: { role: 'client' }
            });
            navigate("/portal/client");
            return;
          }
        } catch (err) {
          console.error("DB check failed for client email:", err);
        }
      }

      // If we are here, user has no role set yet. Redirect them to /portal to select role.
      if (location.pathname !== '/portal' && location.pathname !== '/portal/') {
        navigate("/portal");
      }
    };

    // Check initial session - ONLY redirect if user is on the auth or portal page
    if (location.pathname === '/auth' || location.pathname === '/auth/' || location.pathname === '/portal' || location.pathname === '/portal/') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          checkUserRoleAndRedirect(session);
        }
      });
    }

    // Listen for auth changes (like login success)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkUserRoleAndRedirect(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null;
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthRedirectHandler />
            <SiteIntro />
            <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading page" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vision" element={<Index />} />
              <Route path="/projects" element={<Index />} />
              <Route path="/submit" element={<ProjectSubmitForm />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/portal" element={<PortalGateway />} />
              <Route path="/portal/client" element={<ClientPortal />} />
              <Route path="/portal/v-magnetic-minds" element={<VMagneticMindsPortal />} />
              <Route path="/portal/investor" element={<InvestorPortal />} />
              <Route path="/portal/employee" element={<EmployeePortal />} />
              <Route path="/project/nexus" element={<NexusLanding />} />
              <Route path="/project/nilayam" element={<NilayamLanding />} />
              <Route path="/project/archplan" element={<ArchPlanLanding />} />
              <Route path="/project/letusknow" element={<LetUsKnowLanding />} />
              <Route path="/project/wish-o" element={<WishOLanding />} />
              <Route path="/admin-hq-nexus" element={<AdminPortal />} />
              <Route path="/nexus/resource-hub" element={<ResourceHub />} />
              <Route path="/nexus/market-research" element={<ResourceHub />} />
              <Route path="/nexus/resume-builder" element={<ResumeBuilder />} />
              <Route path="/nexus/startup-blueprint" element={<StartupBlueprint />} />
              <Route path="/nexus/skills-analysis" element={<ResourceHub />} />
              <Route path="/nexus/jobs" element={<ResourceHub />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/terms-and-conditions" element={<TermsOfService />} />
              <Route path="/refund-cancellation-policy" element={<RefundCancellationPolicy />} />
              <Route path="/shipping-delivery-policy" element={<ShippingDeliveryPolicy />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contact-information" element={<ContactInformation />} />
              {/* SEO Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/services/business-automation" element={<BusinessAutomation />} />
              <Route path="/services/website-development" element={<WebsiteDevelopment />} />
              <Route path="/services/saas" element={<SaaSPlatforms />} />
              <Route path="/services/erp" element={<ERPSolutions />} />
              <Route path="/software-company-nizamabad" element={<SoftwareCompanyNizamabad />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
