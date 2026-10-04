import React, { useRef, useState } from "react";
import { Mandapam } from "../../types";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { 
  X, 
  Download, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  Upload, 
  Camera, 
  Sparkles, 
  Layers, 
  Image as ImageIcon,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { InstagramVerifiedBadge } from "../devotional/InstagramVerifiedBadge";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export interface StandeeFrame {
  id: string;
  name: string;
  subtitle: string;
  frameBgUrl: string;
  cardBg: string;
  borderClass: string;
  badgeBg: string;
  accentColor: string;
  sampleColor: string;
}

const STANDEE_FRAMES: StandeeFrame[] = [
  {
    id: "parchment-lotus",
    name: "Vedic Parchment",
    subtitle: "Ivory Lotus & Kolam",
    frameBgUrl: navaratriAsset("/navaratri/assets/parchment-lotus-frame.jpg"),
    cardBg: "bg-[#FDFBF7]",
    borderClass: "border-4 border-[#D97706]/80 ring-4 ring-amber-400/30",
    badgeBg: "bg-gradient-to-r from-[#8B1E1E] to-[#B45309]",
    accentColor: "#8B1E1E",
    sampleColor: "from-[#8B1E1E] via-[#D97706] to-[#8B1E1E]"
  },
  {
    id: "sage-lotus",
    name: "Sage Lotus Garden",
    subtitle: "Sacred Emerald & Gold",
    frameBgUrl: navaratriAsset("/navaratri/assets/sage-lotus-border.jpg"),
    cardBg: "bg-[#F4F7F4]",
    borderClass: "border-4 border-emerald-700/80 ring-4 ring-emerald-500/30",
    badgeBg: "bg-gradient-to-r from-emerald-800 to-amber-700",
    accentColor: "#1B4332",
    sampleColor: "from-[#1B4332] via-[#2D6A4F] to-[#D97706]"
  },
  {
    id: "royal-maroon-arch",
    name: "Royal Temple Arch",
    subtitle: "Sanctum Gold Filigree",
    frameBgUrl: navaratriAsset("/navaratri/assets/royal-maroon-arch.jpg"),
    cardBg: "bg-[#FFFDF9]",
    borderClass: "border-4 border-[#8B1E1E]/80 ring-4 ring-amber-500/30",
    badgeBg: "bg-gradient-to-r from-[#781B1B] to-[#B45309]",
    accentColor: "#8B1E1E",
    sampleColor: "from-[#781B1B] via-[#991B1B] to-[#B45309]"
  },
  {
    id: "terracotta-scalloped",
    name: "Terracotta Scalloped",
    subtitle: "Festive Crimson Arch",
    frameBgUrl: navaratriAsset("/navaratri/assets/terracotta-scalloped-card.png"),
    cardBg: "bg-[#FFF9F5]",
    borderClass: "border-4 border-[#C2410C]/80 ring-4 ring-orange-400/30",
    badgeBg: "bg-gradient-to-r from-[#9A3412] to-[#EA580C]",
    accentColor: "#9A3412",
    sampleColor: "from-[#9A3412] via-[#EA580C] to-[#F59E0B]"
  }
];

export const ShareQrModal: React.FC<ShareQrModalProps> = ({
  mandapam,
  isOpen,
  onClose
}) => {
  const { t } = useNavaratriLanguage();
  const [copied, setCopied] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState<string>("parchment-lotus");
  const [selectedDeityId, setSelectedDeityId] = useState<string>("durga-simhavahana");
  const [isDownloading, setIsDownloading] = useState(false);

  const storedCover = typeof window !== "undefined" ? localStorage.getItem(`mandapam_cover_${mandapam.id}`) : null;
  const [customDeityUrl, setCustomDeityUrl] = useState<string>(
    mandapam.coverImageUrl || mandapam.cardBgImageUrl || storedCover || ""
  );

  const printRef = useRef<HTMLDivElement>(null);

  // Sacred Deity Presets from our Navaratri assets
  const deityOptions = [
    {
      id: "durga-simhavahana",
      name: "Maa Durga",
      subtitle: "Simhavahana Swaroopam",
      url: navaratriAsset("/navaratri/assets/maa-durga-hero-darshan-nobg.png")
    },
    {
      id: "durga-temple-darshan",
      name: "Sri Durga Darshan",
      subtitle: "Sanctum Simhavahana",
      url: navaratriAsset("/navaratri/assets/maa-durga-temple-darshan.jpg")
    },
    {
      id: "durga-alankarana",
      name: "Sri Swarna Durga",
      subtitle: "Divine Alankarana",
      url: navaratriAsset("/navaratri/assets/durga-devi-alankarana.jpg")
    },
    {
      id: "mahishasura-mardhini",
      name: "Mahishasura Mardhini",
      subtitle: "Maha Shakthi Vijayam",
      url: navaratriAsset("/navaratri/assets/alankaranas/day-9-mahishasura-mardhini.jpg")
    },
    {
      id: "bala-tripura-sundari",
      name: "Bala Tripura Sundari",
      subtitle: "Sacred First Alankarana",
      url: navaratriAsset("/navaratri/assets/alankaranas/day-1-bala-tripura-sundari.jpg")
    },
    ...(customDeityUrl
      ? [
          {
            id: "mandapam-custom",
            name: `${mandapam.name} Matha`,
            subtitle: "Mandapam Idol Photo",
            url: customDeityUrl
          }
        ]
      : [])
  ];

  if (!isOpen) return null;

  // Build correct public URL matching the /navaratri/m/:slug route
  const publicUrl = `${window.location.origin}${base}/navaratri/m/${mandapam.slug}`;

  const currentFrame = STANDEE_FRAMES.find((f) => f.id === selectedFrameId) || STANDEE_FRAMES[0];
  const activeDeity = deityOptions.find((d) => d.id === selectedDeityId) || deityOptions[0];

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

  // Upload custom Mandapam / Matha photo with automatic canvas optimization
  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.9);
          setCustomDeityUrl(compressed);
          setSelectedDeityId("mandapam-custom");
          toast.success("Mandapam idol photo loaded into standee in big size!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // High-Resolution Standee PNG Generation & Download
  const handleDownloadStandee = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generating high-resolution A4 standee image with selected frame...");

      const qrCanvas = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement;
      if (!qrCanvas) {
        toast.error("QR Code generator not ready. Please try again.");
        setIsDownloading(false);
        return;
      }

      // High-resolution canvas (A4 ratio: 1000 x 1480)
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 1480;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Canvas context unavailable.");
        setIsDownloading(false);
        return;
      }

      // 1. Draw Selected Frame Background
      await new Promise<void>((resolve) => {
        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        frameImg.onerror = () => {
          ctx.fillStyle = "#FDFBF7";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          resolve();
        };
        frameImg.src = currentFrame.frameBgUrl;
      });

      // 2. Draw Translucent Inner Parchment Panel for Pristine Readability
      const cardMargin = 45;
      const cardX = cardMargin;
      const cardY = cardMargin;
      const cardW = canvas.width - (cardMargin * 2);
      const cardH = canvas.height - (cardMargin * 2);

      ctx.fillStyle = "rgba(255, 253, 249, 0.94)";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 32);
      ctx.fill();

      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cardX + 8, cardY + 8, cardW - 16, cardH - 16);

      // 3. Top Invocations
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 20px serif";
      ctx.textAlign = "center";
      ctx.fillText("॥ ॐ శ్రీ మాత్రే నమః ॥ • सर्वमङ्गलమాङ्गल्ये शिवे सर्वार्थसाधिके", canvas.width / 2, cardY + 45);

      // 4. Sacred Diya & Platform Badge
      ctx.font = "26px sans-serif";
      ctx.fillText("🪔", canvas.width / 2, cardY + 80);

      const badgeText = "NAVARATRI MANDAPAM PLATFORM";
      ctx.font = "bold 15px sans-serif";
      const badgeWidth = ctx.measureText(badgeText).width + 48;
      const badgeHeight = 34;
      const badgeX = (canvas.width - badgeWidth) / 2;
      const badgeY = cardY + 95;

      ctx.fillStyle = "#8B1E1E";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 17);
      ctx.fill();

      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(badgeText, canvas.width / 2, badgeY + 23);

      // 5. Draw BIG DEITY / MANDAPAM PHOTO
      const deityW = 340;
      const deityH = 400;
      const deityX = (canvas.width - deityW) / 2;
      const deityY = badgeY + badgeHeight + 25;

      await new Promise<void>((resolve) => {
        const deityImg = new Image();
        deityImg.crossOrigin = "anonymous";
        deityImg.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(deityX, deityY, deityW, deityH, 26);
          ctx.clip();
          ctx.drawImage(deityImg, deityX, deityY, deityW, deityH);
          ctx.restore();

          // Gold border for big deity portrait
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.roundRect(deityX, deityY, deityW, deityH, 26);
          ctx.stroke();

          // Deity name pill
          const tagText = activeDeity.name;
          ctx.font = "bold 15px sans-serif";
          const tagW = ctx.measureText(tagText).width + 36;
          const tagH = 30;
          const tagX = (canvas.width - tagW) / 2;
          const tagY = deityY + deityH - 15;

          ctx.fillStyle = "#F59E0B";
          ctx.beginPath();
          ctx.roundRect(tagX, tagY, tagW, tagH, 15);
          ctx.fill();

          ctx.fillStyle = "#8B1E1E";
          ctx.fillText(tagText, canvas.width / 2, tagY + 20);

          resolve();
        };
        deityImg.onerror = () => resolve();
        deityImg.src = activeDeity.url;
      });

      // 6. Mandapam / Youth Name & Address
      const nameY = deityY + deityH + 48;
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 34px serif";
      ctx.fillText(mandapam.name, canvas.width / 2, nameY);

      ctx.fillStyle = "#44403C";
      ctx.font = "15px sans-serif";
      const fullAddress = `${mandapam.address ? `${mandapam.address}, ` : ""}${mandapam.area}, ${mandapam.city}`;
      ctx.fillText(fullAddress, canvas.width / 2, nameY + 28);

      ctx.fillStyle = "#0369A1";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("✓ Official Verified Mandapam", canvas.width / 2, nameY + 50);

      // 7. High-Contrast Scannable QR Code Box
      const qrBoxWidth = 350;
      const qrBoxHeight = 360;
      const qrBoxX = (canvas.width - qrBoxWidth) / 2;
      const qrBoxY = nameY + 68;

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxWidth, qrBoxHeight, 26);
      ctx.fill();

      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 4;
      ctx.stroke();

      const qrSize = 250;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = qrBoxY + 24;
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("📱 Scan for Today's Darshan & Pooja", canvas.width / 2, qrBoxY + qrSize + 56);

      // 8. Slogan & Details Box
      const msgBoxY = qrBoxY + qrBoxHeight + 20;
      const msgBoxWidth = 820;
      const msgBoxHeight = 105;
      const msgBoxX = (canvas.width - msgBoxWidth) / 2;

      ctx.fillStyle = "#FEF3C7";
      ctx.beginPath();
      ctx.roundRect(msgBoxX, msgBoxY, msgBoxWidth, msgBoxHeight, 18);
      ctx.fill();

      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 20px serif";
      ctx.fillText("“One QR. Every Mandapam. Everything a devotee needs.”", canvas.width / 2, msgBoxY + 36);

      ctx.fillStyle = "#57534E";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("Daily Alankaram • Pooja Timings • Devotee Seva • Devotee Bookings", canvas.width / 2, msgBoxY + 64);

      ctx.fillStyle = "#78716C";
      ctx.font = "12px monospace";
      ctx.fillText(publicUrl, canvas.width / 2, msgBoxY + 88);

      // 9. Sacred Footer
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 14px serif";
      ctx.fillText("Sharan Navaratri 2026 • Siddhi Dynamics LLP", canvas.width / 2, canvas.height - 35);

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
        toast.success("High-resolution Standee PNG downloaded! Ready to print for your mandapam counter.");
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
            padding: 1.5cm 1.5cm !important;
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

      <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-2xl rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-[#D97706] relative my-6 max-h-[92vh] overflow-y-auto font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 p-2 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header (no-print) */}
        <div className="no-print space-y-4 pb-4 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif font-black text-lg sm:text-xl text-[#8B1E1E]">
              Mandapam Counter Standee & QR Poster
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Select an auspicious frame design, choose a sacred Maa Durga portrait or upload your mandapam idol photo in big size, then download or print directly.
          </p>

          {/* 1. FRAME DESIGNS SELECTOR */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Layers className="w-4 h-4 text-amber-700" />
              <span>1. Choose Frame Design</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STANDEE_FRAMES.map((frame) => {
                const isSelected = selectedFrameId === frame.id;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => setSelectedFrameId(frame.id)}
                    className={`relative p-2 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 text-center cursor-pointer ${
                      isSelected
                        ? "border-[#8B1E1E] bg-amber-50 shadow-md ring-2 ring-amber-400/50 scale-102"
                        : "border-stone-200 hover:border-amber-300 bg-white hover:shadow-xs"
                    }`}
                  >
                    <div className="w-full h-12 rounded-xl overflow-hidden border border-amber-300 shadow-2xs bg-stone-100">
                      <img
                        src={frame.frameBgUrl}
                        alt={frame.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[11px] font-black text-stone-800 leading-tight">
                      {frame.name}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#8B1E1E] text-white flex items-center justify-center text-[10px] font-bold shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. BIG DEITY / MANDAPAM PHOTO SELECTOR */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>2. Select Deity or Upload Mandapam Photo (Big Size)</span>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-[11px] font-bold cursor-pointer shadow-xs active:scale-95 transition-all shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Idol Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Mobile View Dropdown (block sm:hidden) */}
            <div className="block sm:hidden">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <img
                    src={activeDeity.url}
                    alt={activeDeity.name}
                    className="w-6 h-6 rounded-md object-cover border border-amber-300 shadow-2xs"
                  />
                </div>
                <select
                  value={selectedDeityId}
                  onChange={(e) => setSelectedDeityId(e.target.value)}
                  className="w-full pl-11 pr-9 py-2.5 rounded-xl border-2 border-amber-300 bg-white text-xs font-bold text-stone-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E1E] focus:border-[#8B1E1E] appearance-none cursor-pointer"
                >
                  {deityOptions.map((deity) => (
                    <option key={deity.id} value={deity.id}>
                      {deity.name} {deity.subtitle ? `• ${deity.subtitle}` : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-500">
                  <ChevronDown className="w-4 h-4 text-[#8B1E1E]" />
                </div>
              </div>
            </div>

            {/* Desktop / Tablet View Pills (hidden sm:flex) */}
            <div className="hidden sm:flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {deityOptions.map((deity) => {
                const isSelected = selectedDeityId === deity.id;
                return (
                  <button
                    key={deity.id}
                    type="button"
                    onClick={() => setSelectedDeityId(deity.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm"
                        : "bg-white text-stone-700 border-amber-300 hover:bg-amber-50"
                    }`}
                  >
                    <img
                      src={deity.url}
                      alt={deity.name}
                      className="w-5 h-5 rounded-md object-cover border border-white/50"
                    />
                    <span>{deity.name}</span>
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
          className="relative text-center p-5 sm:p-7 rounded-3xl mt-4 transition-all shadow-2xl border-4 border-amber-400 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${currentFrame.frameBgUrl})` }}
        >
          {/* Translucent Backdrop Veil for Crisp Devotional Contrast */}
          <div className="relative z-10 bg-white/92 backdrop-blur-[3px] p-5 sm:p-7 rounded-2xl border-2 border-amber-300/80 shadow-md space-y-4">
            {/* Top Sanskrit & Telugu Invocations */}
            <div className="text-[11px] sm:text-xs font-serif font-bold text-[#8B1E1E] tracking-wide">
              ॥ ॐ శ్రీ మాత్రే నమః ॥ • सर्वमङ्गलమాङ्गल्ये शिवे सर्वार्थसाधिके
            </div>

            {/* Sacred Diya & Top Platform Arch Badge */}
            <div className="pt-1 flex flex-col items-center gap-1">
              <span className="text-xl sm:text-2xl leading-none select-none">🪔</span>
              <div
                className={`inline-flex items-center px-4 py-1.5 rounded-full ${currentFrame.badgeBg} text-white text-xs font-bold shadow-md tracking-wider border border-amber-300/40`}
              >
                <span>NAVARATRI MANDAPAM PLATFORM</span>
              </div>
            </div>

            {/* BIG LORD DURGA MAA / MANDAPAM IDOL PHOTO */}
            <div className="flex flex-col items-center justify-center my-3">
              <div className="relative group max-w-xs sm:max-w-sm w-full mx-auto">
                <div className="w-52 h-64 sm:w-64 sm:h-76 mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl ring-4 ring-amber-500/30 bg-amber-50/70 flex items-center justify-center">
                  <img
                    src={activeDeity.url}
                    alt={activeDeity.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#8B1E1E] text-xs font-black uppercase tracking-wider shadow-md whitespace-nowrap border border-white/60">
                  {activeDeity.name}
                </span>
              </div>
            </div>

            {/* Mandapam / Youth Name & Verified Status */}
            <div className="space-y-1 pt-1">
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
                size={210}
                level="H"
                includeMargin={false}
              />
              <div className="mt-3.5 flex items-center gap-1.5 text-xs font-black text-[#8B1E1E]">
                <span>📱</span>
                <span>Scan for Today's Darshan & Pooja</span>
              </div>
            </div>

            {/* Devotional Slogan & Details */}
            <div className="p-3.5 rounded-2xl bg-amber-50/95 border border-amber-300 text-xs text-stone-700 space-y-1">
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
              <span>{isDownloading ? "Generating Standee..." : "Download High-Res Standee PNG"}</span>
            </button>

            {/* Print Directly on A4 */}
            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-white hover:bg-amber-50 text-stone-900 border-2 border-amber-400 font-black text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Print Mandapam A4 Counter Poster</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied!" : "Copy Page Link"}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Share Poster Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
