import React, { useRef } from "react";
import { Mandapam } from "../../types";
import { QRCodeSVG } from "qrcode.react";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { X, Download, Printer, Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

import { navaratriAsset } from "../../utils/navaratriAssets";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export const ShareQrModal: React.FC<ShareQrModalProps> = ({
  mandapam,
  isOpen,
  onClose
}) => {
  const { t } = useNavaratriLanguage();
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Build correct public URL matching the /navaratri/m/:slug route
  const publicUrl = `${window.location.origin}${base}/navaratri/m/${mandapam.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Permanent Mandapam URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${mandapam.name} - Navaratri Mandapam`,
        text: `Scan the QR code or visit the digital notice board of ${mandapam.name} for Today's Maa Darshan, Pooja timings, Prasadam, Annadanam and book services:`,
        url: publicUrl
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 border-[#D97706] relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Standee Card */}
        <div ref={printRef} className="text-center space-y-4 pt-2">
          {/* Sacred Maa Durga Avatar Badge */}
          <div className="flex justify-center -mb-1">
            <img
              src={navaratriAsset("/navaratri/assets/maa-durga-icon.png")}
              alt="Maa Durga"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-amber-500/20"
            />
          </div>

          {/* Top Temple Arch Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white text-xs font-bold shadow-sm">
            <span>🪔</span>
            <span>NAVARATRI MANDAPAM PLATFORM</span>
          </div>

          <div>
            <h3 className="font-serif font-black text-2xl text-[#8B1E1E]">
              {mandapam.name}
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              {mandapam.area}, {mandapam.city} • {t.verifiedMandapam}
            </p>
          </div>

          {/* QR Code Container with Kolam Border */}
          <div className="mx-auto w-64 p-5 rounded-3xl bg-white border-4 border-[#D97706]/70 shadow-xl flex flex-col items-center justify-center relative">
            <QRCodeSVG
              id="mandapam-qr-svg"
              value={publicUrl}
              size={190}
              level="H"
              includeMargin={false}
            />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#8B1E1E]">
              <span>📱</span>
              <span>Scan for Today's Darshan & Pooja</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-stone-700 space-y-1">
            <p className="font-serif font-bold text-[#8B1E1E]">
              “One QR. Every Mandapam. Everything a devotee needs.”
            </p>
            <p className="text-[11px] text-stone-500 font-mono break-all">
              {publicUrl}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share QR</span>
            </button>

            <button
              onClick={handlePrint}
              className="col-span-2 py-2.5 px-3 rounded-xl border-2 border-[#D97706] text-[#8B1E1E] text-xs font-bold hover:bg-amber-100/60 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Mandapam A4 Counter Poster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
