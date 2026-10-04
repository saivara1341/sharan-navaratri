import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavaratriLanguageProvider } from "./context/NavaratriLanguageContext";
import { NavaratriDataProvider } from "./context/NavaratriDataContext";
import { NavaratriHeader } from "./components/layout/NavaratriHeader";
import { NavaratriTopAdBanner } from "./components/ads/NavaratriTopAdBanner";
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
    // 1. Dynamic Browser Tab Title
    const path = location.pathname;
    if (path.includes("/know")) {
      document.title = "10 Sacred Alankaranas & Pooja Guide • Sharan Navaratri 2026";
    } else if (path.includes("/near-me")) {
      document.title = "Find Mandapams Near Me • Sharan Navaratri 2026";
    } else if (path.includes("/following")) {
      document.title = "Saved Mandapams • Sharan Navaratri 2026";
    } else if (path.includes("/register")) {
      document.title = "Register Mandapam • Sharan Navaratri 2026";
    } else if (path.includes("/login")) {
      document.title = "Mandapam Organizer Login • Sharan Navaratri 2026";
    } else if (path.includes("/advertise")) {
      document.title = "Promote & Run Ads • Sharan Navaratri 2026";
    } else if (path.includes("/organizer") || path.includes("/admin")) {
      document.title = "Mandapam Dashboard • Sharan Navaratri 2026";
    } else if (!path.includes("/m/")) {
      document.title = "Sharan Navaratri 2026 | 10 Sacred Devi Alankaranas & Mandapam Guide";
    }

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

  return (
    <NavaratriLanguageProvider>
      <NavaratriDataProvider>
        <div className="min-h-screen bg-[#FAF7F2] text-[#221A14] flex flex-col font-sans selection:bg-[#9A241C] selection:text-white">
          {/* Authentic Devotional Header */}
          <NavaratriHeader />

          {/* Dedicated Ad Space */}
          <NavaratriTopAdBanner />

          {/* Main Body */}
          <main className="flex-1 w-full mx-auto pb-10">
            {children || <Outlet />}
          </main>

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
