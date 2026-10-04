import React, { useRef, useState } from "react";
import { Mandapam } from "../../types";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { X, Download, Printer, Share2, Copy, Check, Palette } from "lucide-react";
import { toast } from "sonner";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { InstagramVerifiedBadge } from "../devotional/InstagramVerifiedBadge";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

type StandeeTemplateId = "temple-gold" | "sacred-saffron" | "vedic-maroon";

interface StandeeTemplate {
  id: StandeeTemplateId;
  name: string;
  badgeBg: string;
  cardBg: string;
  borderClass: string;
  accentColor: string;
  headerGrad: string;
}

const TEMPLATES: StandeeTemplate[] = [
  {
    id: "temple-gold",
    name: "Royal Mandir Gold",
    badgeBg: "bg-gradient-to-r from-[#8B1E1E] to-[#B45309]",
    cardBg: "bg-[#FFFDF9]",
    borderClass: "border-4 border-[#D97706]/80 ring-4 ring-amber-400/20",
    accentColor: "#8B1E1E",
    headerGrad: "from-[#8B1E1E] via-[#B45309] to-[#8B1E1E]"
  },
  {
    id: "sacred-saffron",
    name: "Sacred Saffron Utsav",
    badgeBg: "bg-gradient-to-r from-[#C2410C] to-[#EA580C]",
    cardBg: "bg-[#FFFBEB]",
    borderClass: "border-4 border-[#EA580C]/80 ring-4 ring-orange-400/20",
    accentColor: "#C2410C",
    headerGrad: "from-[#C2410C] via-[#EA580C] to-[#C2410C]"
  },
  {
    id: "vedic-maroon",
    name: "Vedic Kumkum Sanctum",
    badgeBg: "bg-gradient-to-r from-[#781B1B] to-[#991B1B]",
    cardBg: "bg-[#FDFBF7]",
    borderClass: "border-4 border-[#991B1B]/80 ring-4 ring-red-400/20",
    accentColor: "#781B1B",
    headerGrad: "from-[#781B1B] via-[#991B1B] to-[#781B1B]"
  }
];

export const ShareQrModal: React.FC<ShareQrModalProps> = ({
  mandapam,
  isOpen,
  onClose
}) => {
  const { t } = useNavaratriLanguage();
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<StandeeTemplateId>("temple-gold");
  const [isDownloading, setIsDownloading] = useState(false);

  const storedLogo = typeof window !== "undefined" ? localStorage.getItem(`mandapam_logo_${mandapam.id}`) : null;
  const storedCover = typeof window !== "undefined" ? localStorage.getItem(`mandapam_cover_${mandapam.id}`) : null;

  // Available Matha / Devi images & Committee branding
  const mathaImages = [
    {
      id: "maa-durga",
      name: "Maa Durga",
      subtitle: "Divine Mahishasuramardini",
      url: navaratriAsset("/navaratri/assets/maa-durga-icon.png")
    },
    {
      id: "maa-durga-darshan",
      name: "Maa Durga Darshan",
      subtitle: "Golden Simhavahana",
      url: navaratriAsset("/navaratri/assets/maa-durga-hero-darshan.png")
    },
    {
      id: "durga-devi-alankarana",
      name: "Sri Swarna Durga",
      subtitle: "Indrakeeladri Alankarana",
      url: navaratriAsset("/navaratri/assets/durga-devi-alankarana.jpg")
    },
    ...(mandapam.logoUrl || storedLogo
      ? [
          {
            id: "mandapam-logo",
            name: "Committee Logo",
            subtitle: mandapam.name,
            url: mandapam.logoUrl || storedLogo || ""
          }
        ]
      : []),
    ...(mandapam.coverImageUrl || mandapam.cardBgImageUrl || storedCover
      ? [
          {
            id: "mandapam-custom",
            name: "Mandapam Photo",
            subtitle: mandapam.name,
            url: mandapam.coverImageUrl || mandapam.cardBgImageUrl || storedCover || ""
          }
        ]
      : [])
  ];

  const [selectedImageId, setSelectedImageId] = useState<string>("maa-durga");
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Build correct public URL matching the /navaratri/m/:slug route
  const publicUrl = `${window.location.origin}${base}/navaratri/m/${mandapam.slug}`;

  const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
  const currentMatha = mathaImages.find((img) => img.id === selectedImageId) || mathaImages[0];

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
        text: `Scan the QR code or visit the digital notice board of ${mandapam.name} for Today's Darshan, Pooja timings, Prasadam, and book services:`,
        url: publicUrl
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // High-Resolution Standee PNG Generation & Download
  const handleDownloadStandee = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generating high-resolution A4 standee image...");

      const qrCanvas = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement;
      if (!qrCanvas) {
        toast.error("QR Code generator not ready. Please try again.");
        setIsDownloading(false);
        return;
      }

      // High-resolution canvas (A4 ratio: 1000 x 1450)
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1450;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Canvas context unavailable.");
        setIsDownloading(false);
        return;
      }

      // 1. Background Fill & Inner Border based on selected template
      const isGold = selectedTemplate === "temple-gold";
      const isSaffron = selectedTemplate === "sacred-saffron";

      // Card Background
      ctx.fillStyle = isGold ? "#FFFDF9" : isSaffron ? "#FFFBEB" : "#FDFBF7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer Decorative Double Border
      ctx.strokeStyle = isGold ? "#D97706" : isSaffron ? "#EA580C" : "#991B1B";
      ctx.lineWidth = 10;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.lineWidth = 3;
      ctx.strokeStyle = isGold ? "#F59E0B" : isSaffron ? "#F97316" : "#DC2626";
      ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

      // Corner Accents
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = isGold ? "#B45309" : isSaffron ? "#C2410C" : "#781B1B";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(42, 42);
      drawCorner(canvas.width - 42, 42);
      drawCorner(42, canvas.height - 42);
      drawCorner(canvas.width - 42, canvas.height - 42);

      // 2. Top Invocations
      ctx.fillStyle = isGold ? "#8B1E1E" : isSaffron ? "#9A3412" : "#781B1B";
      ctx.font = "bold 20px serif";
      ctx.textAlign = "center";
      ctx.fillText("॥ ॐ శ్రీ మాత్రే నమః ॥ • सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके", canvas.width / 2, 85);

      // 3. Sacred Diya & Platform Badge
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🪔", canvas.width / 2, 114);

      const badgeText = "NAVARATRI MANDAPAM PLATFORM";
      ctx.font = "bold 15px sans-serif";
      const badgeWidth = ctx.measureText(badgeText).width + 48;
      const badgeHeight = 34;
      const badgeX = (canvas.width - badgeWidth) / 2;
      const badgeY = 126;

      // Rounded Pill
      ctx.fillStyle = isGold ? "#8B1E1E" : isSaffron ? "#C2410C" : "#781B1B";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 17);
      ctx.fill();

      // Border for pill
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(badgeText, canvas.width / 2, badgeY + 23);

      // 4. Draw Matha Image in Ornate Circular Halo
      await new Promise<void>((resolve) => {
        const mathaImg = new Image();
        mathaImg.crossOrigin = "anonymous";
        mathaImg.onload = () => {
          const centerX = canvas.width / 2;
          const centerY = 245;
          const radius = 70;

          // Golden outer halo ring
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = "#FBBF24";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
          ctx.fillStyle = isGold ? "#8B1E1E" : isSaffron ? "#C2410C" : "#781B1B";
          ctx.fill();

          // Circular clip for image
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(mathaImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
          ctx.restore();

          // Subtitle tag below image
          ctx.fillStyle = isGold ? "#B45309" : isSaffron ? "#C2410C" : "#781B1B";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Maa Durga", centerX, centerY + radius + 22);

          resolve();
        };
        mathaImg.onerror = () => {
          // If image fails, continue drawing canvas
          resolve();
        };
        mathaImg.src = currentMatha.url;
      });

      // 5. Youth Name / Mandapam Name
      ctx.fillStyle = isGold ? "#8B1E1E" : isSaffron ? "#9A3412" : "#781B1B";
      ctx.font = "bold 38px serif";
      ctx.textAlign = "center";
      ctx.fillText(mandapam.name, canvas.width / 2, 400);

      // 6. Address & Location & Verified Badge
      ctx.fillStyle = "#44403C";
      ctx.font = "bold 20px sans-serif";
      const locationText = `${mandapam.address ? mandapam.address + ", " : ""}${mandapam.area}, ${mandapam.city}`;
      ctx.fillText(locationText, canvas.width / 2, 435);

      ctx.fillStyle = "#0369A1";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("✓ Official Verified Mandapam", canvas.width / 2, 465);

      // 7. QR Code Card Container
      const qrBoxWidth = 420;
      const qrBoxHeight = 440;
      const qrBoxX = (canvas.width - qrBoxWidth) / 2;
      const qrBoxY = 495;

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxWidth, qrBoxHeight, 32);
      ctx.fill();

      ctx.strokeStyle = isGold ? "#D97706" : isSaffron ? "#EA580C" : "#991B1B";
      ctx.lineWidth = 5;
      ctx.stroke();

      // Draw QR Code
      const qrSize = 310;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = qrBoxY + 30;
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Scan Call to Action
      ctx.fillStyle = isGold ? "#8B1E1E" : isSaffron ? "#C2410C" : "#781B1B";
      ctx.font = "bold 21px sans-serif";
      ctx.fillText("📱 Scan for Today's Darshan & Pooja", canvas.width / 2, qrBoxY + qrSize + 64);

      // 8. Platform Devotional Message Box
      const msgBoxY = 965;
      const msgBoxWidth = 860;
      const msgBoxHeight = 115;
      const msgBoxX = (canvas.width - msgBoxWidth) / 2;

      ctx.fillStyle = isGold ? "#FEF3C7" : isSaffron ? "#FFEDD5" : "#FEE2E2";
      ctx.beginPath();
      ctx.roundRect(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight, 20);
      ctx.fill();

      ctx.strokeStyle = isGold ? "#FDE68A" : isSaffron ? "#FED7AA" : "#FECACA";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isGold ? "#8B1E1E" : isSaffron ? "#9A3412" : "#781B1B";
      ctx.font = "bold 22px serif";
      ctx.fillText("“One QR. Every Mandapam. Everything a devotee needs.”", canvas.width / 2, msgBoxY + 42);

      ctx.fillStyle = "#57534E";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("Daily Alankaram • Pooja Timings • Devotee Seva • Devotee Bookings", canvas.width / 2, msgBoxY + 74);

      // 9. Public URL text
      ctx.fillStyle = "#78716C";
      ctx.font = "14px monospace";
      ctx.fillText(publicUrl, canvas.width / 2, 1115);

      // 10. Footer Attribution
      ctx.fillStyle = isGold ? "#8B1E1E" : isSaffron ? "#9A3412" : "#781B1B";
      ctx.font = "bold 15px serif";
      ctx.fillText("Sharan Navaratri 2026 • Siddhi Dynamics LLP", canvas.width / 2, 1395);

      // Export canvas to PNG Blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to generate image.");
          setIsDownloading(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${mandapam.slug}-navaratri-standee.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
        toast.success("Standee image downloaded successfully! Ready for printing or sharing.");
      }, "image/png");
    } catch (err) {
      console.error(err);
      setIsDownloading(false);
      toast.error("Could not download standee image. You can also click 'Print Mandapam A4 Counter Poster'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      {/* Hidden QRCodeCanvas for generating high-resolution PNG */}
      <div className="hidden">
        <QRCodeCanvas
          id="mandapam-qr-canvas"
          value={publicUrl}
          size={360}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Embedded print stylesheet so only the standee card prints cleanly on A4 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-standee, #printable-standee * {
            visibility: visible !important;
          }
          #printable-standee {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 2.5cm 2cm !important;
            background: white !important;
            border: 6px double #D97706 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-xl rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-[#D97706] relative my-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header (no-print) */}
        <div className="no-print space-y-3 pb-3 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-black text-lg sm:text-xl text-[#8B1E1E]">
              Mandapam Counter Standee & QR Poster
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Choose your standee theme, then download as high-res PNG or print directly on A4 paper for your mandapam counter.
          </p>

          {/* Standee Template Selector — aesthetic colour-swatch picker */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Standee Template Style</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`group relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-500 ring-2 ring-amber-400/50 shadow-md bg-amber-50"
                        : "border-stone-200 hover:border-amber-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    {/* Colour swatch */}
                    <div className={`w-full h-8 rounded-xl bg-gradient-to-r ${tmpl.headerGrad} shadow-sm`} />
                    {/* Name */}
                    <span className={`text-[10px] font-bold leading-tight text-center ${isSelected ? "text-amber-900" : "text-stone-600"}`}>
                      {tmpl.name}
                    </span>
                    {/* Selected tick */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow">
                        <svg viewBox="0 0 12 10" className="w-3 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1,5 4.5,8.5 11,1" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>


        {/* ----------------- PRINTABLE STANDEE CARD ----------------- */}
        <div
          id="printable-standee"
          ref={printRef}
          className={`text-center space-y-3.5 sm:space-y-4 p-5 sm:p-7 rounded-3xl mt-4 transition-all shadow-inner ${currentTemplate.cardBg} ${currentTemplate.borderClass}`}
        >
          {/* Top Sanskrit & Telugu Invocations */}
          <div className="text-[11px] sm:text-xs font-serif font-bold text-[#8B1E1E] tracking-wide">
            ॥ ॐ శ్రీ మాత్రే నమః ॥ • सर्वमङ्गलమాङ्गल्ये शिवे सर्वार्थसाधिके
          </div>

          {/* Sacred Maa Durga Avatar Badge */}
          <div className="flex flex-col items-center justify-center -mb-1">
            <div className="relative group">
              <img
                src={currentMatha.url}
                alt="Maa Durga"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-xl ring-4 ring-amber-500/30"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-400 text-[#8B1E1E] text-[10px] font-black uppercase tracking-wider shadow-sm whitespace-nowrap">
                Maa Durga
              </span>
            </div>
          </div>

          {/* Sacred Diya & Top Platform Arch Badge */}
          <div className="pt-2 flex flex-col items-center gap-1">
            <span className="text-xl sm:text-2xl leading-none select-none">🪔</span>
            <div
              className={`inline-flex items-center px-4 py-1.5 rounded-full ${currentTemplate.badgeBg} text-white text-xs font-bold shadow-md tracking-wider border border-amber-300/40`}
            >
              <span>NAVARATRI MANDAPAM PLATFORM</span>
            </div>
          </div>

          {/* Mandapam / Youth Name & Verified Status */}
          <div className="space-y-1">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#8B1E1E] flex items-center justify-center gap-1.5 leading-snug">
              <span>{mandapam.name}</span>
              <InstagramVerifiedBadge className="w-5 h-5 shrink-0 drop-shadow" title="Official Verified Mandapam" />
            </h2>
            <p className="text-xs text-stone-700 font-semibold">
              {mandapam.address ? `${mandapam.address}, ` : ""}
              {mandapam.area}, {mandapam.city} • <span className="text-emerald-700 font-bold">{t.verifiedMandapam}</span>
            </p>
          </div>

          {/* High-Contrast Scannable QR Code Container */}
          <div className="mx-auto w-64 sm:w-72 p-5 sm:p-6 rounded-3xl bg-white border-4 border-[#D97706]/80 shadow-2xl flex flex-col items-center justify-center relative">
            <QRCodeSVG
              id="mandapam-qr-svg"
              value={publicUrl}
              size={200}
              level="H"
              includeMargin={false}
            />
            <div className="mt-3.5 flex items-center gap-1.5 text-xs font-black text-[#8B1E1E]">
              <span>📱</span>
              <span>Scan for Today's Darshan & Pooja</span>
            </div>
          </div>

          {/* Devotional Slogan & Details */}
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-stone-700 space-y-1">
            <p className="font-serif font-bold text-sm sm:text-base text-[#8B1E1E]">
              “One QR. Every Mandapam. Everything a devotee needs.”
            </p>
            <p className="text-[11px] text-stone-600 font-medium">
              Daily Alankaram • Pooja Timings • Devotee Seva • Devotee Bookings
            </p>
            <p className="text-[11px] text-stone-500 font-mono break-all pt-0.5">
              {publicUrl}
            </p>
          </div>

          {/* Sacred Footer */}
          <div className="text-[10px] text-stone-500 font-medium pt-1">
            Sharan Navaratri 2026 • Siddhi Dynamics LLP
          </div>
        </div>

        {/* ----------------- ACTION BUTTONS (no-print) ----------------- */}
        <div className="no-print space-y-2 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Download Standee PNG Button */}
            <button
              onClick={handleDownloadStandee}
              disabled={isDownloading}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-stone-950 font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-900" />
              <span>{isDownloading ? "Generating Standee..." : "Download Standee Image (PNG)"}</span>
            </button>

            {/* Print Mandapam A4 Counter Poster Button */}
            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C] flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-200" />
              <span>Print Mandapam A4 Counter Poster</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs font-bold hover:bg-stone-50 flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-stone-700" />
              <span>Share QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
