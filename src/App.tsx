import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";
import { NavaratriLoadingScreen } from "./navaratri/components/layout/NavaratriLoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { SiteIntro } from "@/components/SiteIntro";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { SiteWideTurnstileProtection } from "@/components/common/SiteWideTurnstileProtection";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

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
const Pricing = lazy(() => import("./pages/Pricing"));
const DataRights = lazy(() => import("./pages/DataRights"));
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
const AgencyClientIntake = lazy(() => import("./pages/AgencyClientIntake"));
const Careers = lazy(() => import("@/pages/Careers"));
const InternPortal = lazy(() => import("@/pages/InternPortal"));
const CertificateVerification = lazy(() => import("@/pages/CertificateVerification"));

// Navaratri Mandapam PWA
const NavaratriAppLayout = lazy(() => import("./navaratri/NavaratriAppLayout").then(m => ({ default: m.NavaratriAppLayout })));
const NavaratriHome = lazy(() => import("./navaratri/pages/NavaratriHome").then(m => ({ default: m.NavaratriHome })));
const NavaratriKnow = lazy(() => import("./navaratri/pages/NavaratriKnow").then(m => ({ default: m.NavaratriKnow })));
const NavaratriNearMe = lazy(() => import("./navaratri/pages/NavaratriNearMe").then(m => ({ default: m.NavaratriNearMe })));
const NavaratriMandapamDetail = lazy(() => import("./navaratri/pages/NavaratriMandapamDetail").then(m => ({ default: m.NavaratriMandapamDetail })));
const NavaratriFollowing = lazy(() => import("./navaratri/pages/NavaratriFollowing").then(m => ({ default: m.NavaratriFollowing })));
const NavaratriRegister = lazy(() => import("./navaratri/pages/NavaratriRegister").then(m => ({ default: m.NavaratriRegister })));
const NavaratriOrganizer = lazy(() => import("./navaratri/pages/NavaratriOrganizer").then(m => ({ default: m.NavaratriOrganizer })));
const NavaratriAdmin = lazy(() => import("./navaratri/pages/NavaratriAdmin").then(m => ({ default: m.NavaratriAdmin })));
const NavaratriAdvertise = lazy(() => import("./navaratri/pages/NavaratriAdvertise").then(m => ({ default: m.NavaratriAdvertise })));
const NavaratriLogin = lazy(() => import("./navaratri/pages/NavaratriLogin").then(m => ({ default: m.NavaratriLogin })));
const NavaratriGoogleCallback = lazy(() => import("./navaratri/pages/NavaratriGoogleCallback").then(m => ({ default: m.NavaratriGoogleCallback })));

const isNavaratriSubdomain = typeof window !== 'undefined' && (
  window.location.hostname.toLowerCase().includes('navaratri') ||
  window.location.hostname.toLowerCase().includes('navarathri') ||
  window.location.hostname.toLowerCase().includes('navratri') ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.search.includes('navaratri') ||
  window.location.search.includes('navarathri') ||
  window.location.search.includes('navratri')
);

import { resolveRoleForEmail, getPortalPathForRole } from "@/lib/roleResolver";

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserRoleAndRedirect = async (session: any) => {
      if (!session) return;
      const email = session.user.email?.trim().toLowerCase();

      // 1. Grasp assigned role directly by email
      const assignedRole = await resolveRoleForEmail(email);
      if (assignedRole) {
        navigate(getPortalPathForRole(assignedRole));
        return;
      }

      // 2. Fallback to user metadata
      const role = session.user.user_metadata?.role;
      if (role === 'intern') {
        navigate("/portal/intern");
        return;
      } else if (role === 'employee') {
        navigate("/portal/employee");
        return;
      } else if (role === 'client') {
        navigate("/portal/client");
        return;
      } else if (role === 'investor') {
        navigate("/portal/investor");
        return;
      } else if (role === 'partner') {
        navigate("/portal/agency");
        return;
      }

      // If user has no role set yet (e.g. Google OAuth), redirect to /portal for role selection
      navigate("/portal");
    };

    // Check initial session - redirect /auth directly to /portal or role workspace
    if (location.pathname === '/auth' || location.pathname === '/auth/') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          checkUserRoleAndRedirect(session);
        } else {
          navigate('/portal');
        }
      });
    }

    // Listen for auth changes - only redirect if on auth page
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthGate = location.pathname === '/auth' || location.pathname === '/auth/';
      if (event === 'SIGNED_IN' && session && isAuthGate) {
        checkUserRoleAndRedirect(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null;
};

const PageLoadingFallback = () => {
  const isNavaratriRoute = typeof window !== "undefined" && /^\/navaratri(?:\/|$)|^\/navarathri(?:\/|$)|^\/m\//.test(window.location.pathname);
  if (isNavaratriRoute) return <NavaratriLoadingScreen />;

  return (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" aria-busy="true" aria-label="Loading page">
    <div className="relative flex flex-col items-center justify-center space-y-5">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping" />
        <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#8B1E1E] border-r-amber-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-amber-600 border-l-[#8B1E1E] animate-spin [animation-duration:1.2s]" />
      </div>
      <div className="flex flex-col items-center space-y-1 text-center">
        <span className="text-sm font-semibold tracking-wider uppercase font-serif font-black text-[#8B1E1E]">
          {isNavaratriSubdomain ? "Sharan Navaratri 2026" : "Siddhi Dynamics"}
        </span>
        <span className="text-xs text-muted-foreground animate-pulse">
          {isNavaratriSubdomain ? "Loading sacred mandapams..." : "Loading interface..."}
        </span>
      </div>
    </div>
  </div>
  );
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const offsetPosition = Math.max(0, elementRect - bodyRect - offset);
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SiteWideTurnstileProtection>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AuthRedirectHandler />
              {!isNavaratriSubdomain && <SiteIntro />}
              {!isNavaratriSubdomain && <CookieConsentBanner />}
              <ErrorBoundary>
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    {isNavaratriSubdomain ? (
                      <>
                        <Route path="/" element={<NavaratriAppLayout><NavaratriHome /></NavaratriAppLayout>} />
                        <Route path="/explore" element={<Navigate to="/know" replace />} />
                        <Route path="/know" element={<NavaratriAppLayout><NavaratriKnow /></NavaratriAppLayout>} />
                        <Route path="/near-me" element={<NavaratriAppLayout><NavaratriNearMe /></NavaratriAppLayout>} />
                        <Route path="/following" element={<NavaratriAppLayout><NavaratriFollowing /></NavaratriAppLayout>} />
                        <Route path="/pallaki" element={<Navigate to="/" replace />} />
                        <Route path="/dheeksha" element={<Navigate to="/" replace />} />
                        <Route path="/nimarjanam" element={<Navigate to="/" replace />} />
                        <Route path="/register" element={<NavaratriAppLayout><NavaratriRegister /></NavaratriAppLayout>} />
                        <Route path="/organizer" element={<NavaratriAppLayout><NavaratriOrganizer /></NavaratriAppLayout>} />
                        <Route path="/organizer/:mandapamId" element={<NavaratriAppLayout><NavaratriOrganizer /></NavaratriAppLayout>} />
                        <Route path="/admin" element={<NavaratriAppLayout><NavaratriAdmin /></NavaratriAppLayout>} />
                        <Route path="/advertise" element={<NavaratriAppLayout><NavaratriAdvertise /></NavaratriAppLayout>} />
                      </>
                    ) : (
                      <>
                        <Route path="/" element={<Index />} />
                        <Route path="/vision" element={<Index />} />
                        <Route path="/services" element={<Index />} />
                        <Route path="/projects" element={<Index />} />
                      </>
                    )}
                    <Route path="/submit" element={<ProjectSubmitForm />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/portal" element={<PortalGateway />} />
                    <Route path="/portals" element={<PortalGateway />} />
                    <Route path="/portal/client" element={<ClientPortal />} />
                    <Route path="/portal/intern" element={<InternPortal />} />
                    <Route path="/portal/agency" element={<VMagneticMindsPortal />} />
                    <Route path="/agency-intake/:token" element={<AgencyClientIntake />} />
                    <Route path="/portal/v-magnetic-minds" element={<VMagneticMindsPortal />} />
                    <Route path="/portal/investor" element={<InvestorPortal />} />
                    <Route path="/portal/employee" element={<EmployeePortal />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/verify-certificate" element={<CertificateVerification />} />
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
                    <Route path="/data-rights" element={<DataRights />} />
                    <Route path="/grievance-redressal" element={<DataRights />} />
                    <Route path="/contact-information" element={<ContactInformation />} />
                    <Route path="/contact" element={<ContactInformation />} />
                    <Route path="/contact-us" element={<ContactInformation />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/products-services" element={<Pricing />} />
                    <Route path="/pricing-policy" element={<Pricing />} />
                    {/* SEO Pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/services/business-automation" element={<BusinessAutomation />} />
                    <Route path="/services/website-development" element={<WebsiteDevelopment />} />
                    <Route path="/services/saas" element={<SaaSPlatforms />} />
                    <Route path="/services/erp" element={<ERPSolutions />} />
                    <Route path="/software-company-nizamabad" element={<SoftwareCompanyNizamabad />} />

                    {/* NAVARATRI MANDAPAM PWA ROUTES */}
                    <Route path="/m/:slug" element={<NavaratriAppLayout><NavaratriMandapamDetail /></NavaratriAppLayout>} />

                    <Route path="/navaratri" element={<NavaratriAppLayout><NavaratriHome /></NavaratriAppLayout>} />
                    <Route path="/navaratri/explore" element={<Navigate to="/navaratri/know" replace />} />
                    <Route path="/navaratri/know" element={<NavaratriAppLayout><NavaratriKnow /></NavaratriAppLayout>} />
                    <Route path="/navaratri/near-me" element={<NavaratriAppLayout><NavaratriNearMe /></NavaratriAppLayout>} />
                    <Route path="/navaratri/following" element={<NavaratriAppLayout><NavaratriFollowing /></NavaratriAppLayout>} />
                    <Route path="/navaratri/pallaki" element={<Navigate to="/navaratri" replace />} />
                    <Route path="/navaratri/dheeksha" element={<Navigate to="/navaratri" replace />} />
                    <Route path="/navaratri/nimarjanam" element={<Navigate to="/navaratri" replace />} />
                    <Route path="/navaratri/register" element={<NavaratriAppLayout><NavaratriRegister /></NavaratriAppLayout>} />
                    <Route path="/navaratri/login" element={<NavaratriAppLayout><NavaratriLogin /></NavaratriAppLayout>} />
                    <Route path="/navaratri/auth/google-callback" element={<NavaratriGoogleCallback />} />
                    <Route path="/navaratri/auth" element={<Navigate to="/navaratri/login" replace />} />
                    <Route path="/navaratri/organizer" element={<NavaratriAppLayout><NavaratriOrganizer /></NavaratriAppLayout>} />
                    <Route path="/navaratri/organizer/:mandapamId" element={<NavaratriAppLayout><NavaratriOrganizer /></NavaratriAppLayout>} />
                    <Route path="/navaratri/admin" element={<NavaratriAppLayout><NavaratriAdmin /></NavaratriAppLayout>} />
                    <Route path="/navaratri/advertise" element={<NavaratriAppLayout><NavaratriAdvertise /></NavaratriAppLayout>} />
                    <Route path="/navaratri/m/:slug" element={<NavaratriAppLayout><NavaratriMandapamDetail /></NavaratriAppLayout>} />

                    {/* Navaratri Cashfree Compliance & Policy Aliases */}
                    <Route path="/navaratri/pricing" element={<Pricing />} />
                    <Route path="/navaratri/products-services" element={<Pricing />} />
                    <Route path="/navaratri/contact" element={<ContactInformation />} />
                    <Route path="/navaratri/contact-us" element={<ContactInformation />} />
                    <Route path="/navaratri/terms" element={<TermsOfService />} />
                    <Route path="/navaratri/terms-and-conditions" element={<TermsOfService />} />
                    <Route path="/navaratri/terms-of-service" element={<TermsOfService />} />
                    <Route path="/navaratri/refunds" element={<RefundCancellationPolicy />} />
                    <Route path="/navaratri/refund-cancellation-policy" element={<RefundCancellationPolicy />} />
                    <Route path="/navaratri/shipping-delivery-policy" element={<ShippingDeliveryPolicy />} />
                    <Route path="/navaratri/privacy" element={<PrivacyPolicy />} />

                    {/* Navarathri Alternate Spelling Aliases */}
                    <Route path="/navarathri" element={<NavaratriAppLayout><NavaratriHome /></NavaratriAppLayout>} />
                    <Route path="/navarathri/*" element={<NavaratriAppLayout><NavaratriHome /></NavaratriAppLayout>} />



                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </SiteWideTurnstileProtection>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
