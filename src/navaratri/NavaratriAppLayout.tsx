import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { NavaratriLanguageProvider } from "./context/NavaratriLanguageContext";
import { NavaratriDataProvider } from "./context/NavaratriDataContext";
import { NavaratriHeader } from "./components/layout/NavaratriHeader";
import { NavaratriTopAdBanner } from "./components/ads/NavaratriTopAdBanner";
import { NavaratriBottomAdBanner } from "./components/ads/NavaratriBottomAdBanner";
import { CitizenBottomNav } from "./components/layout/CitizenBottomNav";

import { AuspiciousRibbonBorder } from "./components/devotional/AuspiciousRibbonBorder";
import { NavaratriFooter } from "./components/layout/NavaratriFooter";
import { NavaratriQrScannerModal } from "./components/citizen/NavaratriQrScannerModal";
import { navaratriAsset } from "./utils/navaratriAssets";

interface NavaratriAppLayoutProps {
  children?: React.ReactNode;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
export const NavaratriAppLayout: React.FC<NavaratriAppLayoutProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Keep browser tab title strictly as "Sharan Navaratri" (no "Promote & Run Ads")
    document.title = "Sharan Navaratri";

    // 2. Set Browser Tab Favicon to the same Header Logo (Sacred Trishula)
    try {
      const iconUrl = navaratriAsset("/navaratri/assets/trishula-head.png");
      const existingIcons = document.querySelectorAll<HTMLLinkElement>(
        "link[rel*='icon'], link[rel='apple-touch-icon']"
      );

      if (existingIcons.length > 0) {
        existingIcons.forEach((el) => {
          el.href = iconUrl;
          el.type = "image/png";
        });
      } else {
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = iconUrl;
        document.head.appendChild(link);
      }
    } catch (e) {}
  }, [location.pathname]);

  const isLoginPage =
    location.pathname === "/navaratri/login" ||
    location.pathname === "/login";

  // Registration remains a focused onboarding view. Login uses the shared
  // festival header and footer so it stays connected to the main site.
  const isBarePage =
    location.pathname === "/navaratri/register" ||
    location.pathname === "/register";

  if (isBarePage) {
    return (
      <NavaratriLanguageProvider>
        <NavaratriDataProvider>
          {children || <Outlet />}
        </NavaratriDataProvider>
      </NavaratriLanguageProvider>
    );
  }

  if (isLoginPage) {
    return (
      <NavaratriLanguageProvider>
        <NavaratriDataProvider>
          <div className="min-h-screen bg-[#FAF7F2] text-[#221A14] flex flex-col font-sans selection:bg-[#9A241C] selection:text-white">
            <NavaratriHeader />
            <main className="flex-1 w-full">{children || <Outlet />}</main>
            <AuspiciousRibbonBorder variant="maroon-gold" heightClass="h-4 sm:h-5.5" />
            <NavaratriFooter />
          </div>
        </NavaratriDataProvider>
      </NavaratriLanguageProvider>
    );
  }

  return (
    <NavaratriLanguageProvider>
      <NavaratriDataProvider>
        <div className="min-h-screen bg-[#FAF7F2] text-[#221A14] flex flex-col font-sans selection:bg-[#9A241C] selection:text-white">
          {/* Authentic Devotional Header */}
          <NavaratriHeader />

          {/* Dedicated Ad Space */}
          <NavaratriTopAdBanner />

          {/* Main Body with In-Animation */}
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 w-full mx-auto pb-6"
          >
            {children || <Outlet />}
          </motion.main>

          {/* Bottom Ad Frame (Above Footer) — Visible on Desktop & Mobile */}
          <NavaratriBottomAdBanner />

          {/* Sacred Border Ribbon above Footer */}
          <AuspiciousRibbonBorder variant="maroon-gold" heightClass="h-4 sm:h-5.5" />

          {/* Devotional Footer with Copyrights & Siddhi Dynamics LLP Attribution */}
          <NavaratriFooter />

          {/* Floating Citizen Bottom Nav on Mobile */}
          <CitizenBottomNav />

          {/* Global Live Camera QR Scanner Modal */}
          <NavaratriQrScannerModal />
        </div>
      </NavaratriDataProvider>
    </NavaratriLanguageProvider>
  );
};
