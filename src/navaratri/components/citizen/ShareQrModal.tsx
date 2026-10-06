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
  Sparkles, 
  ChevronDown,
  MapPin,
  QrCode,
  Flame,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { navaratriAsset } from "../../utils/navaratriAssets";
import { InstagramVerifiedBadge } from "../devotional/InstagramVerifiedBadge";
import siddhiDynamicsLogo from "@/assets/siddhi-dynamics-header-logo.png";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

// Helper to clean and deduplicate repetitive address strings
function formatCleanLocation(mandapam: Mandapam): string {
  const parts: string[] = [];
  const addPart = (raw?: string) => {
    if (!raw) return;
    const trimmed = raw.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    // Check if this part is already covered by existing parts or vice versa
    const exists = parts.some(
      (p) => p.toLowerCase() === lower || p.toLowerCase().includes(lower) || lower.includes(p.toLowerCase())
    );
    if (!exists) {
      parts.push(trimmed);
    }
  };

  addPart(mandapam.address);
  addPart(mandapam.area);
  addPart(mandapam.city);

  if (parts.length === 0) return "Nizamabad, Telangana";
  return parts.join(", ");
}

export const ShareQrModal: React.FC<ShareQrModalProps> = ({
  mandapam,
  isOpen,
  onClose
}) => {
  const { t } = useNavaratriLanguage();
  const [copied, setCopied] = useState(false);
  const [selectedDeityId, setSelectedDeityId] = useState<string>("durga-simhavahana");
  const [isDownloading, setIsDownloading] = useState(false);

  const storedCover = typeof window !== "undefined" ? localStorage.getItem(`mandapam_cover_${mandapam.id}`) : null;
  const [customDeityUrl, setCustomDeityUrl] = useState<string>(
    mandapam.coverImageUrl || mandapam.cardBgImageUrl || storedCover || ""
  );

  const printRef = useRef<HTMLDivElement>(null);

  // Sacred Deity Presets from Navaratri assets
  const deityOptions = [
    {
      id: "durga-simhavahana",
      name: "శ్రీ దుర్గా దేవి",
      englishName: "Maa Durga",
      subtitle: "Simhavahana Swaroopam",
      teluguSubtitle: "సింహవాహన దివ్య స్వరూపం",
      url: navaratriAsset("/navaratri/assets/maa-durga-hero-darshan-nobg.png"),
      isTransparent: true
    },
    {
      id: "durga-temple-darshan",
      name: "శ్రీ కనక దుర్గా దర్శనం",
      englishName: "Sri Kanaka Durga",
      subtitle: "Sanctum Simhavahana",
      teluguSubtitle: "గర్భగుడి సింహవాహన దర్శనం",
      url: navaratriAsset("/navaratri/assets/maa-durga-temple-darshan.jpg"),
      isTransparent: false
    },
    {
      id: "durga-alankarana",
      name: "శ్రీ స్వర్ణ దుర్గా దేవి",
      englishName: "Sri Swarna Durga",
      subtitle: "Divine Gold Alankarana",
      teluguSubtitle: "దివ్య స్వర్ణాలంకరణ",
      url: navaratriAsset("/navaratri/assets/durga-devi-alankarana.jpg"),
      isTransparent: false
    },
    {
      id: "mahishasura-mardhini",
      name: "శ్రీ మహిషాసుర మర్దిని",
      englishName: "Mahishasura Mardhini",
      subtitle: "Maha Shakthi Vijayam",
      teluguSubtitle: "మహాశక్తి విజయ దర్శనం",
      url: navaratriAsset("/navaratri/assets/alankaranas/day-9-mahishasura-mardhini.jpg"),
      isTransparent: false
    },
    {
      id: "bala-tripura-sundari",
      name: "శ్రీ బాలా త్రిపుర సుందరి",
      englishName: "Bala Tripura Sundari",
      subtitle: "First Sacred Alankarana",
      teluguSubtitle: "ప్రథమ దివ్యాలంకరణ",
      url: navaratriAsset("/navaratri/assets/alankaranas/day-1-bala-tripura-sundari.jpg"),
      isTransparent: false
    },
    {
      id: "annapurna-devi",
      name: "శ్రీ అన్నపూర్ణా దేవి",
      englishName: "Annapurna Devi",
      subtitle: "Maha Annadanam Swaroopam",
      teluguSubtitle: "నిత్యాన్నదాత్రీ దేవి దర్శనం",
      url: navaratriAsset("/navaratri/assets/alankaranas/day-3-annapurna-devi.jpg"),
      isTransparent: false
    },
    {
      id: "lalitha-tripura-sundari",
      name: "శ్రీ లలితా త్రిపుర సుందరి",
      englishName: "Lalitha Tripura Sundari",
      subtitle: "Sri Chakra Rajarajeswari",
      teluguSubtitle: "శ్రీచక్రార్చిత దివ్య దర్శనం",
      url: navaratriAsset("/navaratri/assets/alankaranas/day-5-lalitha-tripura-sundari.jpg"),
      isTransparent: false
    },
    {
      id: "raja-rajeshwari",
      name: "శ్రీ రాజరాజేశ్వరి దేవి",
      englishName: "Raja Rajeshwari Devi",
      subtitle: "Vijaya Dasami Alankarana",
      teluguSubtitle: "విజయదశమి దివ్య దర్శనం",
      url: navaratriAsset("/navaratri/assets/alankaranas/day-10-raja-rajeshwari.jpg"),
      isTransparent: false
    },
    ...(customDeityUrl
      ? [
          {
            id: "mandapam-custom",
            name: `${mandapam.name} అమ్మవారు`,
            englishName: `${mandapam.name} Matha`,
            subtitle: "Mandapam Idol Photo",
            teluguSubtitle: "మండపం స్వంత విగ్రహ దర్శనం",
            url: customDeityUrl,
            isTransparent: false
          }
        ]
      : [])
  ];

  if (!isOpen) return null;

  const publicUrl = `${window.location.origin}${base}/navaratri/m/${mandapam.slug}`;
  const cleanLocation = formatCleanLocation(mandapam);
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
          const compressed = canvas.toDataURL("image/jpeg", 0.92);
          setCustomDeityUrl(compressed);
          setSelectedDeityId("mandapam-custom");
          toast.success("Mandapam idol photo loaded into standee!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Helper to load image for canvas
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  // High-resolution A4 PNG generation (2480 × 3508 px at 300 DPI).
  // Downloads deliberately use a plain white sheet for affordable, reliable printing.
  const handleDownloadStandee = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generating white-background A4 QR poster...");

      const qrCanvas = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement;
      if (!qrCanvas) {
        toast.error("QR Code generator not ready. Please try again.");
        setIsDownloading(false);
        return;
      }

      // Exact A4 portrait ratio, 300 DPI.
      const canvas = document.createElement("canvas");
      canvas.width = 2480;
      canvas.height = 3508;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Canvas context unavailable.");
        setIsDownloading(false);
        return;
      }

      const pageWidth = canvas.width;
      const margin = 150;
      const contentWidth = pageWidth - margin * 2;
      const centerX = pageWidth / 2;
      const shortCode = mandapam.slug?.split("-").pop() || "2026";
      const drawCenteredLines = (text: string, maxWidth: number, y: number, lineHeight: number) => {
        const words = text.split(" ");
        const lines: string[] = [];
        let line = "";
        words.forEach((word) => {
          const proposed = line ? `${line} ${word}` : word;
          if (ctx.measureText(proposed).width > maxWidth && line) {
            lines.push(line);
            line = word;
          } else line = proposed;
        });
        if (line) lines.push(line);
        lines.forEach((item, index) => ctx.fillText(item, centerX, y + index * lineHeight));
        return lines.length;
      };

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#8B1E1E";
      ctx.lineWidth = 12;
      ctx.strokeRect(margin, margin, contentWidth, canvas.height - margin * 2);
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 3;
      ctx.strokeRect(margin + 22, margin + 22, contentWidth - 44, canvas.height - margin * 2 - 44);

      ctx.textAlign = "center";
      try {
        const trishula = await loadImage(navaratriAsset("/navaratri/assets/trishula-head.png"));
        ctx.drawImage(trishula, margin + 75, 205, 88, 145);
      } catch {}
      ctx.fillStyle = "#781B1B";
      ctx.font = "bold 68px Georgia, serif";
      ctx.fillText("SHARAN NAVARATRI 2026", centerX + 40, 275);
      ctx.fillStyle = "#A16207";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillText("Official Mandapam Digital Notice Board", centerX + 40, 325);
      ctx.fillStyle = "#8B1E1E";
      ctx.fillRect(margin + 70, 382, contentWidth - 140, 6);

      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 37px Georgia, serif";
      ctx.fillText(mandapam.name, centerX, 470);
      ctx.fillStyle = "#44403C";
      ctx.font = "28px Arial, sans-serif";
      drawCenteredLines(cleanLocation, contentWidth - 260, 525, 38);
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 24px Arial, sans-serif";
      ctx.fillText(`OFFICIAL UTSAV ID  •  #${shortCode}`, centerX, 610);

      const deityBox = { x: centerX - 360, y: 675, w: 720, h: 760 };
      ctx.fillStyle = "#FFFDF8";
      ctx.fillRect(deityBox.x, deityBox.y, deityBox.w, deityBox.h);
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 5;
      ctx.strokeRect(deityBox.x, deityBox.y, deityBox.w, deityBox.h);
      try {
        const deity = await loadImage(activeDeity.url);
        const ratio = deity.width / deity.height;
        const height = deityBox.h - 60;
        const width = Math.min(deityBox.w - 60, height * ratio);
        ctx.drawImage(deity, centerX - width / 2, deityBox.y + 30, width, height);
      } catch {}
      ctx.fillStyle = "#781B1B";
      ctx.font = "bold 25px Georgia, serif";
      ctx.fillText(activeDeity.englishName, centerX, deityBox.y + deityBox.h + 48);

      const qrSize = 680;
      const qrX = centerX - qrSize / 2;
      const qrY = 1575;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(qrX - 38, qrY - 120, qrSize + 76, qrSize + 190);
      ctx.strokeStyle = "#8B1E1E";
      ctx.lineWidth = 7;
      ctx.strokeRect(qrX - 38, qrY - 120, qrSize + 76, qrSize + 190);
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 37px Arial, sans-serif";
      ctx.fillText("SCAN FOR MANDAPAM DARSHAN & SERVICES", centerX, qrY - 65);
      ctx.fillStyle = "#57534E";
      ctx.font = "26px Arial, sans-serif";
      ctx.fillText("Use your camera or Google Lens", centerX, qrY - 25);
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      ctx.fillStyle = "#781B1B";
      ctx.font = "bold 31px Arial, sans-serif";
      ctx.fillText("Today’s Darshan  •  Pooja Timings  •  Annadanam  •  Sevas", centerX, 2390);
      ctx.fillStyle = "#57534E";
      ctx.font = "24px Arial, sans-serif";
      drawCenteredLines(publicUrl, contentWidth - 260, 2460, 32);

      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(margin + 70, 2660);
      ctx.lineTo(pageWidth - margin - 70, 2660);
      ctx.stroke();
      try {
        const siddhiLogo = await loadImage(siddhiDynamicsLogo);
        ctx.drawImage(siddhiLogo, centerX - 230, 2710, 460, 258);
      } catch {}
      ctx.fillStyle = "#57534E";
      ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillText("Digital platform by Siddhi Dynamics LLP", centerX, 3035);
      ctx.font = "22px Georgia, serif";
      ctx.fillStyle = "#8B1E1E";
      ctx.fillText("॥ ॐ श्री मात्रे नमः ॥", centerX, 3160);

      // Export Canvas to PNG Blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Failed to generate image.");
          setIsDownloading(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${mandapam.slug}-a4-qr-poster.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
        toast.success("White-background A4 QR poster downloaded and ready to print.");
      }, "image/png");
    } catch (err) {
      console.error(err);
      setIsDownloading(false);
      toast.error("Could not download the poster. You can also click 'Print A4 QR Poster'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      {/* Hidden QRCodeCanvas for generating high-resolution PNG */}
      <div className="hidden">
        <QRCodeCanvas
          id="mandapam-qr-canvas"
          value={publicUrl}
          size={400}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Embedded print stylesheet so only the standee card prints cleanly on A4 */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
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
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 9mm !important;
            background: white !important;
            background-image: none !important;
            border: 1.5pt solid #8B1E1E !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            z-index: 999999 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          #printable-standee .standee-sheet {
            height: 100% !important;
            padding: 6mm !important;
            border: 1pt solid #D97706 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
            gap: 3mm !important;
          }
          #printable-standee .standee-deity {
            width: 39mm !important;
            height: 50mm !important;
          }
          #printable-standee .standee-title { font-size: 18pt !important; }
          #printable-standee .standee-qr { padding: 3mm !important; border-width: 1.5pt !important; }
          #printable-standee .standee-qr svg { width: 45mm !important; height: 45mm !important; }
          #printable-standee .standee-features { gap: 2mm !important; margin-top: 2mm !important; }
          #printable-standee .standee-features > div { padding: 1.5mm !important; }
          #printable-standee .standee-footer-logo { width: 42mm !important; }
          #printable-standee p { margin: 0 !important; }
          #printable-standee .standee-url { font-size: 7pt !important; }
          #printable-standee .standee-service-copy { font-size: 7.5pt !important; }
          #printable-standee .standee-compact { font-size: 7pt !important; }
          #printable-standee .standee-hide-print { display: none !important; }
          #printable-standee h2 { margin: 0 !important; }
          #printable-standee img { max-height: none !important; }
          #printable-standee * { box-sizing: border-box !important; }
          #printable-standee .standee-brand-line { padding-bottom: 2mm !important; }
          #printable-standee .standee-tagline { padding: 2mm !important; }
          #printable-standee .standee-id { padding: 1mm 3mm !important; }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-[#FFFDF7] text-[#221A14] w-full max-w-2xl rounded-3xl p-3 sm:p-6 shadow-2xl border-2 border-amber-500 relative my-4 max-h-[94vh] overflow-y-auto font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-3 right-3 p-2 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors z-20 cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header (no-print) */}
        <div className="no-print space-y-4 pb-4 border-b border-amber-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪔</span>
            <div>
              <h3 className="font-serif font-black text-lg sm:text-xl text-[#781B1B]">
                Mandapam A4 QR Poster
              </h3>
              <p className="text-xs text-stone-600">
                Choose an idol photo, then print or download a clean white A4 poster with a high-contrast QR code.
              </p>
            </div>
          </div>

          {/* SACRED DURGA MATHA IDOL SELECTOR */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Choose Mandapam Idol / Alankaram</span>
              </div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-[11px] font-bold cursor-pointer shadow-xs active:scale-95 transition-all shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Mandapam Idol Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Mobile Dropdown */}
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
                  className="w-full pl-11 pr-9 py-2.5 rounded-xl border-2 border-amber-300 bg-white text-xs font-bold text-stone-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#8B1E1E] appearance-none cursor-pointer"
                >
                  {deityOptions.map((deity) => (
                    <option key={deity.id} value={deity.id}>
                      {deity.name} ({deity.englishName}) • {deity.subtitle}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-500">
                  <ChevronDown className="w-4 h-4 text-[#8B1E1E]" />
                </div>
              </div>
            </div>

            {/* Desktop / Tablet Horizontal Gallery */}
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

        {/* One-page A4 standee preview. Decorative controls above never print. */}
        <div
          id="printable-standee"
          ref={printRef}
          className="relative text-center p-3 sm:p-6 rounded-3xl mt-4 shadow-xl border-4 border-[#8B1E1E] overflow-hidden bg-white"
        >
          <div className="standee-sheet relative z-10 bg-white p-4 sm:p-6 rounded-2xl border-2 border-amber-400 shadow-sm space-y-3 sm:space-y-4">
            
            <div className="standee-brand-line flex items-center justify-between gap-3 border-b-2 border-[#8B1E1E] pb-3">
              <div className="flex items-center gap-2 text-left">
                <img src={navaratriAsset("/navaratri/assets/trishula-head.png")} alt="Sharan Navaratri" className="h-10 w-7 object-contain" />
                <div>
                  <p className="font-serif font-black text-base sm:text-xl tracking-wide text-[#781B1B]">SHARAN NAVARATRI 2026</p>
                  <p className="standee-compact text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-amber-800">Official Mandapam Digital Notice Board</p>
                </div>
              </div>
              <img src={siddhiDynamicsLogo} alt="Siddhi Dynamics LLP" className="standee-footer-logo w-24 sm:w-32 rounded bg-[#17110d] object-contain" />
            </div>

            {/* DIVINE SANCTUM ARCH & DURGA MATHA IDOL */}
            <div className="relative flex flex-col items-center justify-center my-2 sm:my-3">
              <div className="relative max-w-[280px] sm:max-w-xs w-full mx-auto">
                {/* Radiant Golden Prabhavali Halo behind Idol */}
                <div className="absolute inset-0 rounded-full bg-radial from-amber-200/80 via-amber-100/40 to-transparent blur-md -z-10" />

                <div className="standee-deity w-48 h-56 sm:w-56 sm:h-68 mx-auto rounded-3xl overflow-hidden border-2 border-amber-500 shadow-lg bg-white flex items-center justify-center p-1">
                  <img
                    src={activeDeity.url}
                    alt={activeDeity.name}
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>

                <div className="mt-2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-amber-50 text-[#781B1B] text-[11px] sm:text-xs font-black tracking-wide border border-amber-400">
                  <span>{activeDeity.englishName}</span>
                </div>
              </div>
            </div>

            {/* MANDAPAM IDENTITY & VERIFIED LOCATION */}
            <div className="space-y-1 pt-1">
              <h2 className="standee-title font-serif font-black text-2xl sm:text-3xl text-[#781B1B] flex items-center justify-center gap-2 leading-tight">
                <span>{mandapam.name}</span>
                <InstagramVerifiedBadge className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow" title="Official Verified Mandapam" />
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-stone-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#8B1E1E] shrink-0" />
                <span>{cleanLocation}</span>
              </div>
              <div className="standee-id inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#8B1E1E] text-[10px] sm:text-[11px] font-bold border border-amber-400">
                <span>Official Utsav ID: #{mandapam.slug?.split("-").pop() || "2026"}</span>
              </div>
            </div>

            {/* DEVOTEE HIGH-CONTRAST SCANNABLE QR CODE SECTION */}
            <div className="standee-qr mx-auto max-w-md p-4 sm:p-5 rounded-3xl bg-white border-4 border-[#D97706] shadow-sm flex flex-col items-center justify-center relative">
              <div className="text-center space-y-0.5 mb-3">
                <div className="text-xs sm:text-sm font-black text-[#781B1B] flex items-center justify-center gap-1">
                  <span>SCAN FOR DARSHAN, POOJAS & SERVICES</span>
                </div>
                <div className="text-[10px] sm:text-xs text-stone-500 font-medium">
                  Use your mobile camera or Google Lens
                </div>
              </div>

              {/* QR Code */}
              <div className="p-3 rounded-2xl bg-white border-2 border-amber-300">
                <QRCodeSVG
                  id="mandapam-qr-svg"
                  value={publicUrl}
                  size={190}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* 4 Sacred Devotee Features Grid */}
              <div className="standee-features grid grid-cols-2 gap-2 w-full mt-3.5 text-left">
                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🌸</span>
                    <span>నేటి అలంకారం</span>
                  </div>
                  <div className="standee-service-copy text-[9px] text-stone-600">Today's Alankaram & Darshan</div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🪔</span>
                    <span>పూజ & హారతి</span>
                  </div>
                  <div className="standee-service-copy text-[9px] text-stone-600">Daily Aarti & Pooja Timings</div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🍲</span>
                    <span>మహా ప్రసాదం</span>
                  </div>
                  <div className="standee-service-copy text-[9px] text-stone-600">Prasadam & Annadanam</div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🎟️</span>
                    <span>సేవలు & టోకెన్లు</span>
                  </div>
                  <div className="standee-service-copy text-[9px] text-stone-600">Sevas & Devotee Tokens</div>
                </div>
              </div>
            </div>

            {/* POSTER FOOTNOTE */}
            <div className="standee-tagline p-3 rounded-2xl bg-amber-50/95 border border-amber-300 text-xs text-stone-800 space-y-1">
              <p className="font-serif font-bold text-xs sm:text-sm text-[#781B1B]">
                One QR. Every Mandapam. Everything a devotee needs.
              </p>
              <p className="standee-url text-[10px] sm:text-[11px] text-stone-500 font-mono break-all pt-0.5">
                {publicUrl}
              </p>
            </div>

            <div className="standee-compact text-[10px] text-stone-500 font-medium pt-0.5">
              Sharan Navaratri 2026 • Digital platform by Siddhi Dynamics LLP
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
              <span>{isDownloading ? "Generating A4 Poster..." : "Download A4 Poster PNG"}</span>
            </button>

            {/* Print Directly on A4 */}
            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-white hover:bg-amber-50 text-stone-900 border-2 border-amber-400 font-black text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>Print A4 QR Poster</span>
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
