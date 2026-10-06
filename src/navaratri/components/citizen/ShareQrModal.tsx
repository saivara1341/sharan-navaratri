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
  Layers, 
  ChevronDown,
  MapPin,
  QrCode,
  Flame,
  Award
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
    id: "royal-gold-sanctum",
    name: "Golden Temple Sanctum",
    subtitle: "Sanctum Pillars & Deepams",
    frameBgUrl: navaratriAsset("/navaratri/assets/royal-temple-gold-sanctum.jpg"),
    cardBg: "bg-[#FFFDF9]",
    borderClass: "border-4 border-amber-500/90 ring-4 ring-amber-400/40",
    badgeBg: "bg-gradient-to-r from-[#781B1B] via-[#B45309] to-[#781B1B]",
    accentColor: "#8B1E1E",
    sampleColor: "from-[#781B1B] via-[#D97706] to-[#781B1B]"
  },
  {
    id: "saffron-gold-mandapam",
    name: "Saffron Gold Mandapam",
    subtitle: "24K Filigree & Sacred Bells",
    frameBgUrl: navaratriAsset("/navaratri/assets/saffron-gold-mandapam-frame.jpg"),
    cardBg: "bg-[#FFF9F2]",
    borderClass: "border-4 border-amber-600/90 ring-4 ring-amber-500/40",
    badgeBg: "bg-gradient-to-r from-[#C2410C] via-[#B45309] to-[#781B1B]",
    accentColor: "#C2410C",
    sampleColor: "from-[#C2410C] via-[#EA580C] to-[#D97706]"
  },
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
  }
];

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
  const [selectedFrameId, setSelectedFrameId] = useState<string>("royal-gold-sanctum");
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

  // High-Resolution Standee PNG Generation & Download (1200 x 1800 px)
  const handleDownloadStandee = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generating high-resolution traditional temple standee (A4 Print Ready)...");

      const qrCanvas = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement;
      if (!qrCanvas) {
        toast.error("QR Code generator not ready. Please try again.");
        setIsDownloading(false);
        return;
      }

      // High-resolution canvas (A4 Golden Ratio: 1200 x 1800)
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Canvas context unavailable.");
        setIsDownloading(false);
        return;
      }

      // 1. Draw Outer Frame Background
      try {
        const frameImg = await loadImage(currentFrame.frameBgUrl);
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      } catch {
        // Fallback rich traditional maroon/gold gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGrad.addColorStop(0, "#4A0E0E");
        bgGrad.addColorStop(0.5, "#781B1B");
        bgGrad.addColorStop(1, "#360A0A");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Draw Ivory/Parchment Sacred Inner Card
      const cardMargin = 40;
      const cardX = cardMargin;
      const cardY = cardMargin;
      const cardW = canvas.width - (cardMargin * 2);
      const cardH = canvas.height - (cardMargin * 2);

      // Card Fill
      ctx.fillStyle = "rgba(255, 253, 248, 0.96)";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 36);
      ctx.fill();

      // Golden Double Border
      ctx.strokeStyle = "#B45309"; // Dark Gold
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.strokeStyle = "#F59E0B"; // Bright Gold inner line
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX + 12, cardY + 12, cardW - 24, cardH - 24);

      // Corner Sacred Ornaments (Golden Filigree Circles)
      const drawCorner = (cx: number, cy: number) => {
        ctx.save();
        ctx.strokeStyle = "#D97706";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#8B1E1E";
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawCorner(cardX + 32, cardY + 32);
      drawCorner(cardX + cardW - 32, cardY + 32);
      drawCorner(cardX + 32, cardY + cardH - 32);
      drawCorner(cardX + cardW - 32, cardY + cardH - 32);

      // 3. Top Festive Mango Toranam & Marigold Garlands
      try {
        const toranImg = await loadImage(navaratriAsset("/navaratri/assets/mamidi-thoranam.png"));
        ctx.drawImage(toranImg, cardX + 14, cardY + 14, cardW - 28, 48);
      } catch {}

      try {
        const garlandImg = await loadImage(navaratriAsset("/navaratri/assets/banthi-pulu-garland.png"));
        ctx.drawImage(garlandImg, cardX + 30, cardY + 44, cardW - 60, 32);
      } catch {}

      // 4. Sacred Slogans & Invocations
      ctx.textAlign = "center";

      // ॥ ॐ శ్రీ మాత్రే నమః ॥
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 30px 'Rozha One', 'Cinzel', serif";
      ctx.fillText("॥ ॐ శ్రీ మాత్రే నమః ॥", canvas.width / 2, cardY + 115);

      // Maha Mantra: सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके
      ctx.fillStyle = "#9A3412";
      ctx.font = "bold 17px 'Rozha One', serif";
      ctx.fillText("॥ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥", canvas.width / 2, cardY + 145);

      // 5. Official Platform Title Banner
      const bannerText = "శరణ్ నవరాత్రి 2026 • అధికారిక డిజిటల్ మండపం బోర్డు";
      ctx.font = "bold 16px sans-serif";
      const bannerW = ctx.measureText(bannerText).width + 60;
      const bannerH = 38;
      const bannerX = (canvas.width - bannerW) / 2;
      const bannerY = cardY + 165;

      // Gradient Banner Pill
      const pillGrad = ctx.createLinearGradient(bannerX, 0, bannerX + bannerW, 0);
      pillGrad.addColorStop(0, "#781B1B");
      pillGrad.addColorStop(0.5, "#B45309");
      pillGrad.addColorStop(1, "#781B1B");
      ctx.fillStyle = pillGrad;
      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 19);
      ctx.fill();

      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(bannerText, canvas.width / 2, bannerY + 25);

      // 6. Sanctum Archway (Prabhavali) Framing the Divine Deity
      const sanctumW = 460;
      const sanctumH = 460;
      const sanctumX = (canvas.width - sanctumW) / 2;
      const sanctumY = bannerY + bannerH + 20;

      // Radiant Warm Sanctum Halo
      const haloGrad = ctx.createRadialGradient(
        canvas.width / 2,
        sanctumY + sanctumH * 0.45,
        40,
        canvas.width / 2,
        sanctumY + sanctumH * 0.45,
        sanctumW * 0.55
      );
      haloGrad.addColorStop(0, "#FEF3C7");
      haloGrad.addColorStop(0.6, "#FDE68A");
      haloGrad.addColorStop(1, "rgba(253, 230, 138, 0)");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, sanctumY + sanctumH * 0.45, sanctumW * 0.52, 0, Math.PI * 2);
      ctx.fill();

      // Draw Deity Image
      try {
        const deityImg = await loadImage(activeDeity.url);

        if (activeDeity.isTransparent) {
          // Transparent idol: draw cleanly without clipping, let golden halo shine behind
          const imgH = sanctumH - 20;
          const aspect = deityImg.width / deityImg.height;
          const imgW = imgH * aspect;
          ctx.drawImage(deityImg, (canvas.width - imgW) / 2, sanctumY, imgW, imgH);
        } else {
          // Rectangular / photo idol: arched golden frame
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(sanctumX, sanctumY, sanctumW, sanctumH, 28);
          ctx.clip();
          ctx.drawImage(deityImg, sanctumX, sanctumY, sanctumW, sanctumH);
          ctx.restore();

          // Gold border for photo
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.roundRect(sanctumX, sanctumY, sanctumW, sanctumH, 28);
          ctx.stroke();
        }
      } catch {}

      // Deity Name Banner Pill
      const deityPillText = `✨ ${activeDeity.name} • ${activeDeity.teluguSubtitle} ✨`;
      ctx.font = "bold 18px 'Cinzel', serif";
      const deityPillW = ctx.measureText(deityPillText).width + 48;
      const deityPillH = 36;
      const deityPillX = (canvas.width - deityPillW) / 2;
      const deityPillY = sanctumY + sanctumH + 4;

      ctx.fillStyle = "#FEF3C7";
      ctx.beginPath();
      ctx.roundRect(deityPillX, deityPillY, deityPillW, deityPillH, 18);
      ctx.fill();
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = "#8B1E1E";
      ctx.fillText(deityPillText, canvas.width / 2, deityPillY + 24);

      // 7. Mandapam Identity & Verification
      const nameY = deityPillY + deityPillH + 44;

      // Sub-invocation
      ctx.fillStyle = "#B45309";
      ctx.font = "bold 15px serif";
      ctx.fillText("॥ దుర్గామాతా దివ్య కటాక్ష సిద్ధిరస్తు ॥", canvas.width / 2, nameY - 14);

      // Mandapam Name (Grand, Bold, Majestic)
      ctx.fillStyle = "#781B1B";
      ctx.font = "bold 44px 'Rozha One', 'Cinzel', serif";
      ctx.fillText(mandapam.name, canvas.width / 2, nameY + 28);

      // Clean Deduplicated Address
      ctx.fillStyle = "#44403C";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`📍 ${cleanLocation}`, canvas.width / 2, nameY + 62);

      // Verified Mandapam Badge
      const shortCode = mandapam.slug?.split("-").pop() || "2026";
      const verText = `🛡️ అధికారిక నమోదిత మండపం • Official Utsav ID: #${shortCode}`;
      ctx.font = "bold 15px sans-serif";
      const verW = ctx.measureText(verText).width + 36;
      const verH = 30;
      const verX = (canvas.width - verW) / 2;
      const verY = nameY + 76;

      ctx.fillStyle = "#E0F2FE";
      ctx.beginPath();
      ctx.roundRect(verX, verY, verW, verH, 15);
      ctx.fill();
      ctx.strokeStyle = "#0284C7";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#0369A1";
      ctx.fillText(verText, canvas.width / 2, verY + 20);

      // 8. Devotee QR Code Section (High-Contrast, Traditional Yantra Frame)
      const qrSectionY = verY + verH + 28;
      const qrCardW = 680;
      const qrCardH = 390;
      const qrCardX = (canvas.width - qrCardW) / 2;

      // White QR Box
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(qrCardX, qrSectionY, qrCardW, qrCardH, 28);
      ctx.fill();

      // Ornate Border
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.strokeRect(qrCardX + 8, qrSectionY + 8, qrCardW - 16, qrCardH - 16);

      // QR Instruction Header
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("📲 మీ మొబైల్ కెమెరా లేదా Google Lens తో స్కాన్ చేయండి", canvas.width / 2, qrSectionY + 36);

      ctx.fillStyle = "#78350F";
      ctx.font = "14px sans-serif";
      ctx.fillText("Scan with Camera / Google Lens / PhonePe / GPay / Paytm", canvas.width / 2, qrSectionY + 58);

      // Draw QR Code
      const qrSize = 210;
      const qrX = qrCardX + 40;
      const qrY = qrSectionY + 80;
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Right Column: 4 Devotee Service Highlight Chips
      const features = [
        { icon: "🌸", title: "నేటి అలంకారం & దర్శనం", desc: "Today's Devi Alankaram & Darshan" },
        { icon: "🪔", title: "పూజలు & హారతి సమయాలు", desc: "Daily Pooja & Aarti Timings" },
        { icon: "🍲", title: "మహా ప్రసాదం & అన్నదానం", desc: "Prasadam & Annadanam Schedule" },
        { icon: "🎟️", title: "సేవా బుకింగ్స్ & టోకెన్లు", desc: "Online Sevas & Devotee Tokens" }
      ];

      const featX = qrX + qrSize + 28;
      let featY = qrSectionY + 82;
      const featW = qrCardW - (qrSize + 96);

      features.forEach((feat) => {
        ctx.fillStyle = "#FEF3C7";
        ctx.beginPath();
        ctx.roundRect(featX, featY, featW, 46, 12);
        ctx.fill();

        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.font = "bold 15px sans-serif";
        ctx.fillStyle = "#781B1B";
        ctx.fillText(`${feat.icon} ${feat.title}`, featX + 12, featY + 22);

        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#57534E";
        ctx.fillText(feat.desc, featX + 32, featY + 38);

        featY += 54;
      });

      // Bottom of QR box: Scan prompt
      ctx.textAlign = "center";
      ctx.fillStyle = "#047857";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("⚡ వేగవంతమైన సమాచారం • నోటీసు బోర్డు • భక్తుల సౌలభ్యం", canvas.width / 2, qrSectionY + qrCardH - 18);

      // 9. Golden Devotional Slogan & URL Bar
      const sloganY = qrSectionY + qrCardH + 18;
      const sloganW = 900;
      const sloganH = 80;
      const sloganX = (canvas.width - sloganW) / 2;

      ctx.fillStyle = "#FEF3C7";
      ctx.beginPath();
      ctx.roundRect(sloganX, sloganY, sloganW, sloganH, 18);
      ctx.fill();

      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#781B1B";
      ctx.font = "bold 19px 'Rozha One', 'Cinzel', serif";
      ctx.fillText("“ఒక్క QR కోడ్ • సమస్త మండపం సేవలు భక్తుల వేలిముద్రల్లో”", canvas.width / 2, sloganY + 32);

      ctx.fillStyle = "#57534E";
      ctx.font = "bold 14px monospace";
      ctx.fillText(publicUrl, canvas.width / 2, sloganY + 58);

      // 10. Sacred Platform Footer
      ctx.fillStyle = "#8B1E1E";
      ctx.font = "bold 14px serif";
      ctx.fillText("శరణ్ నవరాత్రి మహోత్సవాలు 2026 • Siddhi Dynamics LLP", canvas.width / 2, cardY + cardH - 18);

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
        a.download = `${mandapam.slug}-traditional-navaratri-standee.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
        toast.success("Traditional Temple Standee PNG downloaded! Ready to print for your mandapam counter.");
      }, "image/png");
    } catch (err) {
      console.error(err);
      setIsDownloading(false);
      toast.error("Could not download standee image. You can also click 'Print Mandapam A4 Counter Poster'.");
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
            padding: 0.8cm 1cm !important;
            background: white !important;
            border: none !important;
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
                Traditional Mandapam Counter Standee & QR Poster
              </h3>
              <p className="text-xs text-stone-600">
                Auspicious Vedic temple design with sacred slokas, divine Durga Matha idols, clean location, and high-contrast devotee QR code.
              </p>
            </div>
          </div>

          {/* 1. FRAME DESIGNS SELECTOR */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Layers className="w-4 h-4 text-amber-700" />
              <span>1. Choose Auspicious Temple Frame</span>
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

          {/* 2. SACRED DURGA MATHA IDOL SELECTOR */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>2. Select Divine Durga Matha Idol / Alankaram</span>
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

        {/* ----------------- TRADITIONAL TEMPLE STANDEE PREVIEW & PRINT ----------------- */}
        <div
          id="printable-standee"
          ref={printRef}
          className="relative text-center p-3 sm:p-6 rounded-3xl mt-4 transition-all shadow-2xl border-4 border-amber-500 overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${currentFrame.frameBgUrl})` }}
        >
          {/* Inner Ivory Card with Golden Double Frame */}
          <div className="relative z-10 bg-[#FFFDF8]/96 backdrop-blur-[2px] p-4 sm:p-6 rounded-2xl border-2 border-amber-400 shadow-xl space-y-3 sm:space-y-4">
            
            {/* Top Mango Leaf Toranam & Marigold Garlands */}
            <div className="relative -mt-2 -mx-2 sm:-mx-4 overflow-hidden rounded-t-xl">
              <img
                src={navaratriAsset("/navaratri/assets/mamidi-thoranam.png")}
                alt="Mango Leaf Toranam"
                className="w-full h-8 sm:h-11 object-cover"
              />
              <img
                src={navaratriAsset("/navaratri/assets/banthi-pulu-garland.png")}
                alt="Marigold Garland"
                className="w-full h-5 sm:h-7 object-cover -mt-1 sm:-mt-2 opacity-95"
              />
            </div>

            {/* Sacred Invocations & Slogans in Elegant Vedic Typography */}
            <div className="space-y-0.5 pt-1">
              <div className="font-serif font-black text-sm sm:text-lg text-[#781B1B] tracking-wider drop-shadow-2xs">
                ॥ ॐ శ్రీ మాత్రే నమః ॥
              </div>
              <div className="text-[10px] sm:text-xs font-serif font-bold text-amber-900 leading-snug">
                ॥ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥
              </div>
            </div>

            {/* Platform Official Title Ribbon */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#781B1B] via-[#B45309] to-[#781B1B] text-white text-[11px] sm:text-xs font-bold shadow-md tracking-wider border border-amber-200">
                <span>శరణ్ నవరాత్రి 2026 • అధికారిక డిజిటల్ మండపం బోర్డు</span>
              </div>
            </div>

            {/* DIVINE SANCTUM ARCH & DURGA MATHA IDOL */}
            <div className="relative flex flex-col items-center justify-center my-2 sm:my-3">
              <div className="relative max-w-[280px] sm:max-w-xs w-full mx-auto">
                {/* Radiant Golden Prabhavali Halo behind Idol */}
                <div className="absolute inset-0 rounded-full bg-radial from-amber-200/80 via-amber-100/40 to-transparent blur-md -z-10" />

                <div className="w-48 h-56 sm:w-56 sm:h-68 mx-auto rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl ring-4 ring-amber-500/30 bg-gradient-to-b from-amber-100/90 to-amber-50 flex items-center justify-center p-1">
                  <img
                    src={activeDeity.url}
                    alt={activeDeity.name}
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>

                {/* Golden Swaroopam Banner Pill */}
                <div className="mt-2 inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 text-[#781B1B] text-[11px] sm:text-xs font-black tracking-wide shadow-sm border border-amber-400">
                  <span>✨</span>
                  <span>{activeDeity.name} • {activeDeity.teluguSubtitle}</span>
                  <span>✨</span>
                </div>
              </div>
            </div>

            {/* MANDAPAM IDENTITY & VERIFIED LOCATION */}
            <div className="space-y-1 pt-1">
              <div className="text-[11px] font-serif font-bold text-amber-800">
                ॥ దుర్గామాతా దివ్య కటాక్ష సిద్ధిరస్తు ॥
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#781B1B] flex items-center justify-center gap-2 leading-tight">
                <span>{mandapam.name}</span>
                <InstagramVerifiedBadge className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow" title="Official Verified Mandapam" />
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-stone-800 font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#8B1E1E] shrink-0" />
                <span>{cleanLocation}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[10px] sm:text-[11px] font-bold border border-sky-300">
                <span>🛡️</span>
                <span>అధికారిక నమోదిత మండపం • Utsav ID: #{mandapam.slug?.split("-").pop() || "2026"}</span>
              </div>
            </div>

            {/* DEVOTEE HIGH-CONTRAST SCANNABLE QR CODE SECTION */}
            <div className="mx-auto max-w-md p-4 sm:p-5 rounded-3xl bg-white border-4 border-[#D97706] shadow-xl flex flex-col items-center justify-center relative">
              <div className="text-center space-y-0.5 mb-3">
                <div className="text-xs sm:text-sm font-black text-[#781B1B] flex items-center justify-center gap-1">
                  <span>📲</span>
                  <span>మీ మొబైల్ కెమెరా లేదా Google Lens తో స్కాన్ చేయండి</span>
                </div>
                <div className="text-[10px] sm:text-xs text-stone-500 font-medium">
                  Scan with Camera / Google Lens / PhonePe / GPay / Paytm
                </div>
              </div>

              {/* QR Code */}
              <div className="p-3 rounded-2xl bg-white border-2 border-amber-300 shadow-inner">
                <QRCodeSVG
                  id="mandapam-qr-svg"
                  value={publicUrl}
                  size={190}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* 4 Sacred Devotee Features Grid */}
              <div className="grid grid-cols-2 gap-2 w-full mt-3.5 text-left">
                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🌸</span>
                    <span>నేటి అలంకారం</span>
                  </div>
                  <div className="text-[9px] text-stone-600">Today's Alankaram & Live Darshan</div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🪔</span>
                    <span>పూజ & హారతి</span>
                  </div>
                  <div className="text-[9px] text-stone-600">Daily Aarti & Pooja Timings</div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🍲</span>
                    <span>మహా ప్రసాదం</span>
                  </div>
                  <div className="text-[9px] text-stone-600">Prasadam & Annadanam Schedule</div>
                </div>

                <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200">
                  <div className="text-[11px] font-black text-[#781B1B] flex items-center gap-1">
                    <span>🎟️</span>
                    <span>సేవలు & టోకెన్లు</span>
                  </div>
                  <div className="text-[9px] text-stone-600">Online Sevas & Devotee Tokens</div>
                </div>
              </div>
            </div>

            {/* GOLDEN DEVOTIONAL SLOGAN & URL */}
            <div className="p-3 rounded-2xl bg-amber-50/95 border border-amber-300 text-xs text-stone-800 space-y-1">
              <p className="font-serif font-bold text-xs sm:text-sm text-[#781B1B]">
                “ఒక్క QR కోడ్ • సమస్త మండపం సేవలు భక్తుల వేలిముద్రల్లో”
              </p>
              <p className="text-[11px] text-stone-600 font-semibold">
                “One QR. Every Mandapam. Everything a devotee needs.”
              </p>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-mono break-all pt-0.5">
                {publicUrl}
              </p>
            </div>

            {/* Sacred Platform Footer */}
            <div className="text-[10px] text-stone-500 font-medium pt-0.5">
              శరణ్ నవరాత్రి మహోత్సవాలు 2026 • Siddhi Dynamics LLP
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

