import React from "react";
import { Outlet } from "react-router-dom";
import { NavaratriLanguageProvider } from "./context/NavaratriLanguageContext";
import { NavaratriDataProvider } from "./context/NavaratriDataContext";
import { NavaratriHeader } from "./components/layout/NavaratriHeader";
import { NavaratriTopAdBanner } from "./components/ads/NavaratriTopAdBanner";
import { CitizenBottomNav } from "./components/layout/CitizenBottomNav";

import { AuspiciousRibbonBorder } from "./components/devotional/AuspiciousRibbonBorder";
import { NavaratriFooter } from "./components/layout/NavaratriFooter";
import { NavaratriQrScannerModal } from "./components/citizen/NavaratriQrScannerModal";

interface NavaratriAppLayoutProps {
  children?: React.ReactNode;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export const NavaratriAppLayout: React.FC<NavaratriAppLayoutProps> = ({ children }) => {
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
