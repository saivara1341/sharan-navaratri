import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import Portal from "./pages/Portal";
import NexusLanding from "./pages/projects/NexusLanding";
import NilayamLanding from "./pages/projects/NilayamLanding";
import ArchPlanLanding from "./pages/projects/ArchPlanLanding";
import LetUsKnowLanding from "./pages/projects/LetUsKnowLanding";
import WishOLanding from "./pages/projects/WishOLanding";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";
import PromoPopup from "./components/PromoPopup";
import WomensDayCelebration from "./components/WomensDayCelebration";
import RamzanCelebration from "./components/RamzanCelebration";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const AuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (session.user.email === "ssaivaraprasad51@gmail.com") {
          navigate("/admin-hq-nexus");
        } else {
          navigate("/portal");
        }
      }
    });

    // Listen for auth changes (like login success)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (session.user.email === "ssaivaraprasad51@gmail.com") {
          navigate("/admin-hq-nexus");
        } else {
          navigate("/portal");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

const App = () => {
  const [ramzanDone, setRamzanDone] = useState(false);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WomensDayCelebration />
          <RamzanCelebration onClose={() => setRamzanDone(true)} />
          <PromoPopup allowed={ramzanDone} />
          <Toaster />
          <Sonner />
          <HashRouter>
            <AuthRedirectHandler />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vision" element={<Index />} />
              <Route path="/projects" element={<Index />} />
              <Route path="/submit" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/project/nexus" element={<NexusLanding />} />
              <Route path="/project/nilayam" element={<NilayamLanding />} />
              <Route path="/project/archplan" element={<ArchPlanLanding />} />
              <Route path="/project/letusknow" element={<LetUsKnowLanding />} />
              <Route path="/project/wish-o" element={<WishOLanding />} />
              <Route path="/admin-hq-nexus" element={<AdminPortal />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
