import { navaratriAsset } from "../utils/navaratriAssets";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import {
  Store,
  CheckCircle2,
  TrendingUp,
  Phone,
  MapPin,
  Eye,
  Upload,
  Image as ImageIcon,
  QrCode,
  Copy,
  ExternalLink,
  MessageCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Play,
  Clock,
  Utensils,
  CreditCard,
  FileText,
  Sparkles,
  Smartphone,
  Monitor,
  RefreshCw,
  Info,
  CheckCheck,
  Crown,
  Lock,
  Layers,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { getDefaultCtaForCategory } from "../utils/adButtonHelpers";
import {
  inspectImageAspectRatio,
  convertImageToLandscapeCanvas,
  generateVisitingCardCanvas,
  generateTextBulletinCanvas
} from "../utils/adCreativeHelper";

export const NavaratriAdvertise: React.FC = () => {
  const { adPackages, advertisements, createAdvertisement } = useNavaratriData();
  const { t } = useNavaratriLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  // Ad Space Ownership State: Combinational (Shared 6s Rotation) vs Exclusive 24/7 Solo (No other ads in frame)
  const [adSpaceType, setAdSpaceType] = useState<"ROTATING" | "EXCLUSIVE">("ROTATING");

  // Package & Format State
  const [selectedPkgId, setSelectedPkgId] = useState(adPackages[0]?.id || "pkg-starter");
  const [adFormat, setAdFormat] = useState<"BANNER" | "TEXT_BULLETIN">("BANNER");

  const handleSelectSpaceType = (newType: "ROTATING" | "EXCLUSIVE") => {
    setAdSpaceType(newType);
    const currentPkg = adPackages.find((p) => p.id === selectedPkgId);
    const currentDays = currentPkg?.durationDays || 1;
    // Map to equivalent duration in the chosen space type
    const matching = adPackages.find(
      (p) => (p.spaceType || "ROTATING") === newType && p.durationDays === currentDays
    );
    if (matching) {
      setSelectedPkgId(matching.id);
    } else {
      const fallback = adPackages.find((p) => (p.spaceType || "ROTATING") === newType);
      if (fallback) setSelectedPkgId(fallback.id);
    }
  };

  // General Business State
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Sweets & Upvas Food");
  const [ctaButton, setCtaButton] = useState("Order Now");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Nizamabad");
  const [targetZone, setTargetZone] = useState("Subhash Nagar");
  const [customZone, setCustomZone] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"));
  const [imagePreview, setImagePreview] = useState<string>(navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg"));

  // Inbuilt Text Bulletin Template Theme
  const [templateTheme, setTemplateTheme] = useState<"crimson" | "maroon" | "gold" | "royal">("crimson");

  // Text & Offer Bulletin State
  const [discountTag, setDiscountTag] = useState("Special Festive Offer");
  const [bulletPoint1, setBulletPoint1] = useState("100% Satvik & Fresh Ingredients Daily");
  const [bulletPoint2, setBulletPoint2] = useState("Fast Delivery to All Mandapams Across Zone");
  const [bulletPoint3, setBulletPoint3] = useState("Special Discounts for Bulk Mandapam Orders");

  // Aspect Ratio & Auto-Fit State for Banner Photos
  const [uploadedOrientation, setUploadedOrientation] = useState<"landscape" | "portrait" | "square" | null>(null);
  const [originalUploadUrl, setOriginalUploadUrl] = useState<string>("");
  const [aspectRatioMode, setAspectRatioMode] = useState<"festive-wings" | "crop-center" | "raw">("festive-wings");
  const [isConvertingImage, setIsConvertingImage] = useState(false);

  // In-Page Interactive Preview Tab
  const [inPagePreviewDevice, setInPagePreviewDevice] = useState<"mobile" | "desktop">("mobile");

  // Payment Step State
  const [paymentStep, setPaymentStep] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdAdId, setCreatedAdId] = useState<string | null>(null);

  // Ad Preview Modal
  const [showAdPreview, setShowAdPreview] = useState(false);
  const [showBigQr, setShowBigQr] = useState(false);
  const [previewTab, setPreviewTab] = useState<"mobile" | "desktop">("mobile");

  // Go-live countdown helper — estimates 2h from now
  const goLiveTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const goLiveLabel = goLiveTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const goLiveDate = goLiveTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });


  // Selected package details
  const selectedPkg =
    adPackages.find((p) => p.id === selectedPkgId) ||
    adPackages.find((p) => (p.spaceType || "ROTATING") === adSpaceType) || {
      id: "pkg-starter",
      name: "1 Day Daily Booster",
      priceInr: 49,
      durationDays: 1,
      impressionLimit: 1500,
      description: "Ideal for daily festive offers and sweet stall promos.",
      spaceType: "ROTATING" as const
    };

  const isExclusive = (selectedPkg.spaceType || adSpaceType) === "EXCLUSIVE";

  const effectiveDisplayZone = targetZone === "Custom" ? (customZone || "Custom Zone") : targetZone;

  // Auto-generate canvas image when in Text Bulletin format (with inbuilt templates)
  React.useEffect(() => {
    if (adFormat === "TEXT_BULLETIN") {
      const bulletin = generateTextBulletinCanvas({
        businessName: businessName.trim() || "Your Business / Store",
        headline: title.trim() || "Special Navaratri Festive Offers",
        discountTag: discountTag.trim() || "SPECIAL FESTIVE OFFER",
        bulletPoints: [bulletPoint1, bulletPoint2, bulletPoint3].filter(Boolean),
        phone: phone.trim() || "XXXXXXXXXX",
        city,
        targetZone: effectiveDisplayZone,
        theme: templateTheme,
        ctaText: ctaButton || "Order Now"
      });
      if (bulletin) {
        setImagePreview(bulletin);
        setImageUrl(bulletin);
      }
    } else if (adFormat === "BANNER") {
      if (originalUploadUrl) {
        setImagePreview(originalUploadUrl);
        setImageUrl(originalUploadUrl);
      }
    }
  }, [
    adFormat,
    businessName,
    phone,
    city,
    effectiveDisplayZone,
    templateTheme,
    title,
    discountTag,
    bulletPoint1,
    bulletPoint2,
    bulletPoint3,
    ctaButton,
    originalUploadUrl
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const rawUrl = reader.result;
          setOriginalUploadUrl(rawUrl);
          setIsConvertingImage(true);

          try {
            const dims = await inspectImageAspectRatio(rawUrl);
            if (dims.isPortrait) {
              setUploadedOrientation("portrait");
              setAspectRatioMode("festive-wings");
              const converted = await convertImageToLandscapeCanvas(rawUrl, "festive-wings");
              setImagePreview(converted);
              setImageUrl(converted);
              toast.info("Mobile portrait photo detected! Auto-formatted into a 16:9 widescreen festive banner.");
            } else {
              setUploadedOrientation("landscape");
              setAspectRatioMode("raw");
              setImagePreview(rawUrl);
              setImageUrl(rawUrl);
              toast.success("Landscape banner image uploaded! Perfect fit for website banners.");
            }
          } catch {
            setImagePreview(rawUrl);
            setImageUrl(rawUrl);
          } finally {
            setIsConvertingImage(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };



  const applyAspectRatioMode = async (mode: "festive-wings" | "crop-center" | "raw") => {
    if (!originalUploadUrl) return;
    setAspectRatioMode(mode);
    setIsConvertingImage(true);
    try {
      if (mode === "raw") {
        setImagePreview(originalUploadUrl);
        setImageUrl(originalUploadUrl);
        toast.info("Showing original raw image.");
      } else {
        const converted = await convertImageToLandscapeCanvas(originalUploadUrl, mode);
        setImagePreview(converted);
        setImageUrl(converted);
        toast.success(mode === "festive-wings" ? "Applied festive 16:9 wings." : "Cropped to 16:9 landscape.");
      }
    } catch {
      toast.error("Could not convert image");
    } finally {
      setIsConvertingImage(false);
    }
  };



  const handleCopyUpi2 = () => {
    navigator.clipboard.writeText("6303602743@upi");
    setIsCopied2(true);
    toast.success("UPI ID copied!");
    setTimeout(() => setIsCopied2(false), 2500);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);
    if (!businessName.trim() || !cleanPhone) {
      toast.error("Please enter your business name and 10-digit contact mobile number.");
      return;
    }
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (adFormat === "BANNER" && !originalUploadUrl && !imagePreview) {
      toast.error("Please upload your shop photo or banner poster.");
      return;
    }
    if (adFormat === "TEXT_BULLETIN" && !title.trim()) {
      toast.error("Please enter your promotional offer headline.");
      return;
    }
    if (whatsapp) {
      const cleanWa = whatsapp.replace(/\D/g, "").slice(0, 10);
      if (cleanWa.length > 0 && cleanWa.length !== 10) {
        toast.error("WhatsApp number must be 10 digits.");
        return;
      }
    }
    setPaymentStep(true);
    setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleCompletePayment = () => {
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      toast.error("Please enter a valid UPI Reference / UTR number (min 6 digits) after completing payment.");
      return;
    }
    setIsProcessingPayment(true);

    const effectiveZone = targetZone === "Custom" ? (customZone.trim() || "Local Mandapam Belt") : targetZone;
    const effectiveTitle = title.trim() || (adFormat === "BANNER" ? `${businessName.trim()} Banner Ad` : `${businessName.trim()} Festive Offer`);
    const effectiveDescription = description.trim() || (adFormat === "BANNER" ? `Festive advertisement from ${businessName.trim()}` : [bulletPoint1, bulletPoint2, bulletPoint3].filter(Boolean).join(" • ") || "Special Navaratri festival offers and discounts.");

    setTimeout(() => {
      const newAd = createAdvertisement({
        businessName: businessName.trim(),
        category,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        website: website.trim() || undefined,
        address: address.trim() || `${effectiveZone}, ${city}`,
        city,
        targetCity: city,
        targetArea: effectiveZone,
        targetZone: effectiveZone,
        packageId: selectedPkg.id,
        title: effectiveTitle,
        description: effectiveDescription,
        imageUrl: imagePreview,
        format: adFormat,
        bulletPoints: adFormat === "TEXT_BULLETIN" ? [bulletPoint1, bulletPoint2, bulletPoint3].filter(Boolean) : undefined,
        spaceType: selectedPkg.spaceType || adSpaceType,
        ctaText: ctaButton.trim() || getDefaultCtaForCategory(category),
        ctaUrl: website.trim() || `tel:${phone.trim()}`,
        startDate: "2026-10-11",
        endDate: "2026-10-21",
        utrNumber: utrNumber.trim(),
        pricePaid: selectedPkg.priceInr
      });

      setCreatedAdId(newAd.id);
      setIsProcessingPayment(false);
      toast.success(`Payment submitted! Your ad will go live after our team verifies your payment.`);
    }, 1200);
  };

  // ---- Live preview helpers: replicate exactly how ads render on the landing page ----
  const previewIsCard = false;
  const previewName = businessName.trim() || "Your Business Name";
  const previewCta = ctaButton || "Order Now";

  const renderYourAdTag = (label: string) => (
    <div className="flex items-center gap-1 mb-1">
      <span className={`px-1.5 py-[1px] rounded-full text-white text-[7px] font-black uppercase tracking-wider shadow-sm ${
        isExclusive ? "bg-amber-600" : "bg-emerald-600"
      }`}>
        {isExclusive ? "👑 24/7 Solo" : "🔄 Rotates 6s"}
      </span>
      <span className="text-[7px] font-bold text-stone-700">{label}</span>
    </div>
  );

  const renderPreviewFrame = (heightClass: string, rounded = "rounded-2xl") => (
    <div className={`relative w-full ${heightClass} ${rounded} overflow-hidden border-2 border-amber-400 shadow-md bg-[#1e130e] flex items-center justify-center ring-2 ring-emerald-500/70 ring-offset-1`}>
      {imagePreview ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center blur-lg opacity-30 scale-110 pointer-events-none"
            style={{ backgroundImage: `url("${imagePreview}")` }}
          />
          <img src={imagePreview} alt="Your ad" className="w-full h-full object-contain relative z-10 mx-auto" />
        </>
      ) : (
        <span className="text-[9px] text-amber-200/80 font-semibold">Your ad image appears here</span>
      )}
    </div>
  );

  const renderPreviewActions = (size: "xs" | "sm", fullWidth = false) =>
    previewIsCard ? (
      <div className={`flex items-center gap-1 ${fullWidth ? "w-full" : ""}`}>
        <span className={`${fullWidth ? "flex-1 justify-center" : ""} ${size === "xs" ? "px-1.5 py-0.5 text-[7px]" : "px-2.5 py-1 text-[9px]"} rounded-lg bg-white text-[#7A1F14] font-bold border border-amber-300 flex items-center gap-0.5 whitespace-nowrap`}>
          <Phone className="w-2.5 h-2.5" /> Call
        </span>
        <span className={`${fullWidth ? "flex-1 justify-center" : ""} ${size === "xs" ? "px-1.5 py-0.5 text-[7px]" : "px-2.5 py-1 text-[9px]"} rounded-lg bg-[#1FAF5A] text-white font-bold flex items-center gap-0.5 whitespace-nowrap`}>
          <MessageCircle className="w-2.5 h-2.5" /> WhatsApp
        </span>
      </div>
    ) : (
      <span className={`${fullWidth ? "w-full justify-center" : ""} ${size === "xs" ? "px-2 py-0.5 text-[7px]" : "px-3 py-1 text-[9px]"} rounded-lg bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white font-bold flex items-center gap-1 border border-amber-300/60 shadow-sm whitespace-nowrap`}>
        {previewCta} <ExternalLink className="w-2.5 h-2.5" />
      </span>
    );

  const renderMobileSponsorBar = () => (
    <div className="flex items-center justify-between gap-1.5 pt-1.5 px-0.5">
      <div className="flex items-center gap-1 min-w-0 flex-wrap">
        <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse shrink-0" />
        <span className="font-bold text-[7px] uppercase tracking-wider text-amber-800 shrink-0">Sponsored</span>
        <span className="text-stone-800 font-bold text-[8px] whitespace-normal">• {previewName}</span>
      </div>
      {renderPreviewActions("xs")}
    </div>
  );

  const renderCtaTiles = (tileClass: string, textClass: string) => (
    <div className="flex items-center justify-center gap-1.5">
      <div className={`${tileClass} rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-300 flex flex-col items-center justify-center text-center gap-0.5 shadow-sm`}>
        <QrCode className="w-3.5 h-3.5 text-[#1E3A8A]" />
        <span className={`font-serif font-black leading-tight text-[#1E3A8A] ${textClass}`}>Scan Mandapam<br />QR (Camera)</span>
      </div>
      <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-[9px] font-black text-[#8B1E1E]">卐</span>
      <div className={`${tileClass} rounded-2xl bg-gradient-to-b from-[#FFFDF5] to-amber-100 border-2 border-amber-300 flex flex-col items-center justify-center text-center gap-0.5 shadow-sm`}>
        <span className="text-sm leading-none">🏛</span>
        <span className={`font-serif font-black leading-tight text-[#8B1E1E] ${textClass}`}>Register Your<br />Durga Mandapam</span>
      </div>
    </div>
  );

  const renderLoginStrip = (textClass: string) => (
    <div className={`mx-auto w-fit flex items-center gap-1 px-2 py-1 rounded-xl bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-300 ${textClass} text-stone-700`}>
      <span>🚩 Already registered your Durga Mandapam?</span>
      <span className="font-bold text-[#8B1E1E] bg-amber-100 px-1.5 py-0.5 rounded-lg border border-amber-300">Login as Mandapam →</span>
    </div>
  );

  const renderHeroMini = (desktop: boolean) => (
    <div className={`bg-gradient-to-br from-[#5A0E0E] via-[#8B1E1E] to-[#6B1414] ${desktop ? "px-5 py-4 flex items-center gap-4" : "px-3 py-3"}`}>
      <div className="flex-1 space-y-1.5">
        <p className={`${desktop ? "text-[8px]" : "text-[6.5px]"} font-bold text-amber-300 tracking-wider`}>SHARAN NAVARATRI 2026 • 9 DAYS OF DIVINE BLISS</p>
        <p className={`font-['Cinzel',serif] font-black ${desktop ? "text-[15px]" : "text-[11px]"} text-[#FFFBEB] leading-snug`}>
          Celebrate Sharan Navaratri <span className="text-amber-300">2026</span> with Maa Durga's Divine Blessings
        </p>
        <div className="flex items-center gap-1 bg-[#FAF7F0] rounded-full p-1 border border-amber-400">
          <span className={`flex-1 ${desktop ? "text-[8px]" : "text-[7px]"} text-stone-400 px-1.5`}>Search Mandapam by name, colony or area...</span>
          <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white ${desktop ? "text-[8px]" : "text-[7px]"} font-bold`}>Find My Mandapam</span>
        </div>
      </div>
      {desktop && (
        <img
          src={navaratriAsset("/navaratri/assets/maa-durga-hero-darshan.png")}
          alt=""
          aria-hidden="true"
          className="h-24 w-auto object-contain drop-shadow-lg shrink-0"
        />
      )}
    </div>
  );

  const renderScheduleGhost = (desktop: boolean) => (
    <div className="space-y-1">
      <p className={`${desktop ? "text-[9px]" : "text-[8px]"} font-bold uppercase tracking-widest text-stone-400`}>9 Days • Sacred Alankaranas</p>
      <div className="flex gap-1.5 overflow-hidden">
        {Array.from({ length: desktop ? 6 : 3 }).map((_, i) => (
          <div key={i} className={`${desktop ? "w-20 h-14" : "w-20 h-14"} shrink-0 rounded-lg bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-200`} />
        ))}
      </div>
    </div>
  );

  const renderFlankBox = (label: string) => (
    <div className="h-full">
      {renderYourAdTag(label)}
      <div className="h-[170px] rounded-2xl overflow-hidden border-2 border-amber-400 bg-[#1e130e] p-2 relative flex flex-col justify-between ring-2 ring-emerald-500/70 ring-offset-1 shadow-md">
        {imagePreview && (
          <div
            className="absolute inset-0 bg-cover bg-center blur-lg opacity-30 scale-110 pointer-events-none"
            style={{ backgroundImage: `url("${imagePreview}")` }}
          />
        )}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="px-1.5 py-[1px] rounded-full bg-black/70 border border-amber-300/40 text-[7px] font-bold tracking-wider text-amber-200 uppercase flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-amber-400" /> Sponsored
          </span>
          <span className="text-[7px] font-semibold text-amber-100/90 truncate max-w-[60px] px-1 bg-black/40 rounded-full">{previewName}</span>
        </div>
        <div className="relative z-10 flex-1 flex items-center justify-center my-1.5 overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="Your ad" className="max-h-[90px] w-auto max-w-full object-contain rounded" />
          ) : (
            <span className="text-[8px] text-amber-200/70">Your ad</span>
          )}
        </div>
        <div className="relative z-10">{renderPreviewActions("xs", true)}</div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-5 sm:space-y-8 pb-24 font-sans">
      {/* Hero Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#7A1515] text-white p-5 sm:p-8 md:p-10 shadow-2xl border-2 sm:border-4 border-amber-400/60">
        {/* Full-bleed complete container background image */}
        <img
          src={navaratriAsset("/navaratri/assets/advertise-hero-banner-bg.jpg")}
          alt="Navaratri Festive Background"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right sm:object-center pointer-events-none select-none"
        />
        {/* Subtle dark gradient overlay to ensure perfect text contrast across all screen sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20 pointer-events-none" />

        <div className="relative z-10 space-y-2 sm:space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/25 text-amber-200 text-[10px] sm:text-xs font-bold border border-amber-300/50 backdrop-blur-md shadow-xs">
            <Store className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">Hyper-Local Advertising • 15,000+ Devotees</span>
          </div>
          <h1 className="font-['Cinzel',serif] font-black text-xl sm:text-3xl md:text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            Promote Your Business from ₹49/day
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-amber-100/95 font-medium leading-relaxed drop-shadow-sm">
            Reach devotees discovering Mandapams in your zone — sweet stalls, flowers, pooja items, silks &amp; more.
          </p>
        </div>
      </div>

      {/* SUCCESS SCREEN */}
      {createdAdId ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-amber-50 via-white to-orange-50 border-2 border-amber-400 shadow-2xl text-center space-y-6">
          {/* Pending clock icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-lg border-2 border-amber-300 text-3xl">
            ⏳
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-300">
              🔍 Pending Payment Verification
            </span>
            <h2 className="font-['Cinzel',serif] font-black text-2xl sm:text-3xl text-[#8B1E1E]">
              Ad Submitted — Awaiting Approval
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
              Our team will verify your payment (UTR: <strong className="font-mono">{utrNumber}</strong>) and activate your ad within <strong>2–4 hours</strong>. You'll reach devotees in <strong>{effectiveDisplayZone}</strong> once approved.
            </p>
          </div>

          {/* Summary Card */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-amber-300 shadow-md text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#8B1E1E]">{businessName}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] font-bold text-[10px]">{category}</span>
            </div>
            <p className="text-xs font-bold text-stone-900">{title}</p>
            <p className="text-[11px] text-stone-600">Target Zone: 📍 {effectiveDisplayZone}</p>
            <p className="text-[11px] text-stone-600">
              Package: {selectedPkg.name} (₹{selectedPkg.priceInr}) •{" "}
              <span className="font-semibold text-[#8B1E1E]">
                {isExclusive ? "👑 24/7 Exclusive Solo (No Other Ads)" : "🔄 Combinational (6s Rotation)"}
              </span>
            </p>
            <div className="pt-1 border-t border-amber-100 flex items-center gap-2 text-[11px]">
              <span className="font-bold text-stone-700">UTR Ref:</span>
              <span className="font-mono text-stone-900">{utrNumber}</span>
            </div>
          </div>

          {/* What happens next */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5">
            <p className="font-bold text-stone-800 mb-1">What happens next?</p>
            <p className="flex items-start gap-2 text-stone-700"><span className="text-amber-600 font-bold">1.</span> Our team checks your UTR against the UPI transaction.</p>
            <p className="flex items-start gap-2 text-stone-700"><span className="text-amber-600 font-bold">2.</span> On confirmation, your ad goes <strong>live automatically</strong> — no action needed from you.</p>
            <p className="flex items-start gap-2 text-stone-700"><span className="text-amber-600 font-bold">3.</span> For queries, WhatsApp us at <strong>+91 63036 02743</strong>.</p>
          </div>

          <button
            onClick={() => {
              setCreatedAdId(null);
              setPaymentStep(false);
              setBusinessName("");
              setTitle("");
              setDescription("");
              setUtrNumber("");
            }}
            className="px-5 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-800 text-xs sm:text-sm font-bold transition-colors"
          >
            Submit Another Advertisement
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* STEP 1: SELECT AD SPACE & DURATION */}
          <div className="space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E]">
                <Tag className="w-3.5 h-3.5" />
                <span>STEP 1: SELECT AD SPACE &amp; DURATION</span>
              </div>
              <h2 className="font-['Cinzel',serif] font-bold text-lg sm:text-xl text-stone-900">
                Choose Your Ad Space Visibility &amp; Duration
              </h2>
              <p className="text-xs text-stone-600">
                Select between budget-friendly combinational ads (shared frame rotating every 6s) or dedicated 24/7 exclusive solo banner space (your ad only, zero competing ads).
              </p>
            </div>

            {/* AD SPACE OWNERSHIP CHOICE (Combinational vs Exclusive 24/7 Solo) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#8B1E1E]" />
                <span>Choose Ad Space Visibility Type *</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Option 1: Combinational / Shared Ads */}
                <div
                  onClick={() => handleSelectSpaceType("ROTATING")}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                    adSpaceType === "ROTATING"
                      ? "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                      : "bg-white border-amber-200/90 hover:border-amber-300 hover:bg-stone-50/40 shadow-xs"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            adSpaceType === "ROTATING"
                              ? "bg-[#8B1E1E] text-white shadow-xs"
                              : "bg-amber-100 text-[#8B1E1E]"
                          }`}
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${
                              adSpaceType === "ROTATING" ? "animate-spin [animation-duration:8s]" : ""
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-serif font-black text-sm sm:text-base text-stone-900">
                            Combinational Ads
                          </h3>
                          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                            Shared Frame • Changes Every 6s
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          adSpaceType === "ROTATING" ? "bg-[#8B1E1E] text-white" : "border-2 border-stone-300"
                        }`}
                      >
                        {adSpaceType === "ROTATING" && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      Your ad shares the banner frame with other local business sponsors and{" "}
                      <span className="font-bold text-stone-800">
                        smoothly rotates / changes every 6 seconds
                      </span>{" "}
                      for continuous equal impressions.
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-amber-100 text-[11px]">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Rotates with other local business ads every 6s</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Maximum devotee impressions at our lowest budget rate</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                        Budget Pricing
                      </span>
                      <span className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E]">
                        From ₹49{" "}
                        <span className="text-xs font-sans font-medium text-stone-600">/ 1 day</span>
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        adSpaceType === "ROTATING"
                          ? "bg-[#8B1E1E] text-white shadow-xs"
                          : "bg-amber-100/90 text-stone-700 hover:bg-amber-200"
                      }`}
                    >
                      {adSpaceType === "ROTATING" ? "Selected ✓" : "Choose Shared"}
                    </span>
                  </div>
                </div>

                {/* Option 2: Exclusive 24/7 Solo Ad Space */}
                <div
                  onClick={() => handleSelectSpaceType("EXCLUSIVE")}
                  className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                    adSpaceType === "EXCLUSIVE"
                      ? "bg-gradient-to-br from-amber-100/70 via-amber-50 to-orange-50/50 border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                      : "bg-white border-amber-200/90 hover:border-amber-300 hover:bg-stone-50/40 shadow-xs"
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-600 to-[#8B1E1E] text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-xl tracking-wider shadow">
                    VIP 24/7 EXCLUSIVE
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between pr-24 sm:pr-28">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            adSpaceType === "EXCLUSIVE"
                              ? "bg-[#8B1E1E] text-white shadow-xs"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          <Crown className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <h3 className="font-serif font-black text-sm sm:text-base text-stone-900">
                            Exclusive 24/7 Solo Space
                          </h3>
                          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                            Your Ad ONLY • No Other Ads
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          adSpaceType === "EXCLUSIVE" ? "bg-[#8B1E1E] text-white" : "border-2 border-stone-300"
                        }`}
                      >
                        {adSpaceType === "EXCLUSIVE" && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      Run <span className="font-bold text-stone-900">your ad ONLY</span> without any other business ads in that frame. Continuous{" "}
                      <span className="font-bold text-[#8B1E1E]">24/7 non-stop solo presence</span> with zero competition.
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-amber-100 text-[11px]">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Dedicated 100% solo frame — zero other business ads</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Shows 24/7 continuously without 6-second rotation</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                        VIP Solo Pricing
                      </span>
                      <span className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E]">
                        From ₹149{" "}
                        <span className="text-xs font-sans font-medium text-stone-600">/ 1 day</span>
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        adSpaceType === "EXCLUSIVE"
                          ? "bg-[#8B1E1E] text-white shadow-xs"
                          : "bg-amber-100/90 text-stone-700 hover:bg-amber-200"
                      }`}
                    >
                      {adSpaceType === "EXCLUSIVE" ? "Selected ✓" : "Choose 24/7 Solo"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DURATION SELECTION (1 Day, 3 Days, 9 Days) */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  Select Duration for {adSpaceType === "ROTATING" ? "Combinational / Shared Ads" : "Exclusive 24/7 Solo Ad"}
                </span>
                <span className="text-[11px] font-bold text-amber-900">
                  {adSpaceType === "ROTATING" ? "🔄 Changes every 6s" : "👑 24/7 Solo Display"}
                </span>
              </div>

              {/* Responsive duration cards: stacked on mobile, 3-col on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
                {(adPackages.filter((p) => (p.spaceType || "ROTATING") === adSpaceType).length > 0
                  ? adPackages.filter((p) => (p.spaceType || "ROTATING") === adSpaceType)
                  : adPackages
                ).map((pkg) => {
                  const isSelected = selectedPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`cursor-pointer rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? "bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white border-[#8B1E1E] shadow-md ring-2 ring-[#8B1E1E]/20"
                          : "bg-white border-amber-200 hover:border-amber-300 hover:bg-stone-50/40 shadow-xs"
                      }`}
                    >
                      {/* Badges */}
                      {pkg.popular && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#8B1E1E] text-white text-[9px] font-black tracking-wider shadow">
                          POPULAR
                        </span>
                      )}
                      {(pkg.bestValue || pkg.durationDays === 9) && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[9px] font-black tracking-wider shadow">
                          BEST VALUE
                        </span>
                      )}

                      <div>
                        {/* Plan title & radio */}
                        <div className="flex items-center gap-2 mb-1.5 pr-14">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-[#8B1E1E] text-white" : "border-2 border-stone-300"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <h3 className="font-serif font-black text-xs sm:text-sm text-stone-900 tracking-wide">
                            {pkg.name}
                          </h3>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-1 my-1.5 pl-6">
                          <span className="font-['Cinzel',serif] text-2xl sm:text-3xl font-black text-[#8B1E1E]">
                            ₹{pkg.priceInr}
                          </span>
                          <span className="text-[11px] text-stone-500 font-semibold">
                            / {pkg.durationDays} day{pkg.durationDays > 1 ? "s" : ""}
                          </span>
                        </div>

                        {/* Benefit points */}
                        <p className="text-[11px] text-stone-600 leading-snug pl-6 mb-2">
                          {adSpaceType === "EXCLUSIVE" ? (
                            pkg.durationDays === 1
                              ? "Dedicated 24/7 frame for single-day rush with zero other ads"
                              : pkg.durationDays === 3
                              ? "Peak weekend devotee crowds with non-stop 24/7 solo attention"
                              : "Complete festival coverage with your ad running 24/7 in prime frame"
                          ) : (
                            pkg.durationDays === 1
                              ? "Ideal for flash offers & single-day pooja rush"
                              : pkg.durationDays === 3
                              ? "Peak Moola Nakshatram & weekend devotee crowds"
                              : "Complete festival coverage through Vijaya Dashami"
                          )}
                        </p>

                        <div className="text-[10px] sm:text-[11px] text-stone-600 space-y-0.5 pl-6 pt-1.5 border-t border-amber-100">
                          <p className="font-medium text-stone-700">
                            ✓ ~{pkg.impressionLimit?.toLocaleString()} Devotee Impressions
                          </p>
                          <p className="font-medium text-stone-700">✓ Zone-targeted • Call &amp; WhatsApp</p>
                          <p className={`font-semibold ${adSpaceType === 'EXCLUSIVE' ? 'text-amber-800' : 'text-stone-600'}`}>
                            {adSpaceType === "EXCLUSIVE"
                              ? "👑 24/7 Showing your ad only (No other ads)"
                              : "⏱️ Changes every 6s with other business ads"}
                          </p>
                        </div>
                      </div>

                      {/* Button footer */}
                      <div className="mt-3 pl-6">
                        <div
                          className={`w-full py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-center transition-all ${
                            isSelected
                              ? "bg-[#8B1E1E] text-white shadow-xs"
                              : "bg-amber-100/80 text-stone-700 group-hover:bg-amber-200"
                          }`}
                        >
                          {isSelected ? "Selected ✓" : "Tap to Choose"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN FORM & PAYMENT FLOW */}
          <div className="space-y-6">
            {/* Form Column */}
            <form onSubmit={handleProceedToPayment} className="p-4 sm:p-7 rounded-3xl bg-[#FFFDF9] border-2 border-amber-300/80 shadow-md space-y-6">
              <div className="border-b border-amber-200 pb-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E]">
                  <Tag className="w-3.5 h-3.5" />
                  <span>STEP 2: AD CREATIVE FORMAT & DETAILS</span>
                </div>
                <h3 className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E] mt-0.5">
                  Design Your Advertisement
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Choose the format that works best for your business — upload your own photo/poster, or create an instant banner with our inbuilt festive templates.
                </p>
              </div>

              {/* 1. AD FORMAT SELECTOR TABS (Only 2 Formats) */}
              <div className="space-y-2">
                <label className="block font-bold text-xs text-stone-800 uppercase tracking-wider">
                  Choose Ad Format *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Photo / Banner Ad */}
                  <div
                    onClick={() => setAdFormat("BANNER")}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                      adFormat === "BANNER"
                        ? "bg-amber-50/90 border-[#8B1E1E] shadow-sm ring-2 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200 hover:border-amber-300 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          adFormat === "BANNER" ? "bg-[#8B1E1E] text-white shadow-xs" : "bg-amber-100 text-[#8B1E1E]"
                        }`}
                      >
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900 truncate">Photo / Banner Ad</h4>
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                            Your Own Image
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                          Upload your shop photo, festive poster, or ready banner
                        </p>
                      </div>
                    </div>
                    {adFormat === "BANNER" && (
                      <span className="text-[10px] font-bold text-[#8B1E1E] bg-amber-200 px-2.5 py-1 rounded-full shrink-0 shadow-xs">
                        Selected ✓
                      </span>
                    )}
                  </div>

                  {/* Option 2: Text Offer Bulletin */}
                  <div
                    onClick={() => setAdFormat("TEXT_BULLETIN")}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3 ${
                      adFormat === "TEXT_BULLETIN"
                        ? "bg-amber-50/90 border-[#8B1E1E] shadow-sm ring-2 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200 hover:border-amber-300 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          adFormat === "TEXT_BULLETIN" ? "bg-[#8B1E1E] text-white shadow-xs" : "bg-amber-100 text-[#8B1E1E]"
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900 truncate">Text Offer Bulletin</h4>
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            No Photo Needed
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                          Only text with inbuilt professional festive templates
                        </p>
                      </div>
                    </div>
                    {adFormat === "TEXT_BULLETIN" ? (
                      <span className="text-[10px] font-bold text-[#8B1E1E] bg-amber-200 px-2.5 py-1 rounded-full shrink-0 shadow-xs">
                        Selected ✓
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full shrink-0">
                        Tap to Use
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* FORMAT 1: PHOTO / BANNER AD (Upload own photo then direct payment) */}
              {adFormat === "BANNER" && (
                <div className="space-y-5 pt-3 border-t border-amber-200">
                  {/* Photo Upload Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-xs text-stone-800 uppercase tracking-wider">
                        1. Upload Shop Photo or Poster *
                      </label>
                      <span className="text-[11px] text-stone-500">JPG, PNG, WebP (Max 5MB)</span>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed border-amber-400 hover:border-[#8B1E1E] rounded-2xl p-5 bg-amber-50/40 hover:bg-amber-100/50 transition-colors text-center space-y-2"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-200 text-[#8B1E1E] flex items-center justify-center shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-stone-800 text-sm">
                        Tap here to upload photo from your phone or computer
                      </p>
                      <p className="text-xs text-stone-500">
                        Shop front, festive sweets, pooja items, silks, or ready banner poster
                      </p>
                    </div>

                    {/* Aspect Ratio Detection & Converter Controls */}
                    {uploadedOrientation === "portrait" && (
                      <div className="p-3.5 rounded-2xl bg-amber-100/60 border border-amber-400/80 space-y-2 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#8B1E1E] flex items-center gap-1.5 text-xs">
                            <Smartphone className="w-4 h-4 text-amber-800" />
                            Mobile Portrait Photo Detected
                          </span>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                            Auto-Ratio Adapter
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-700">
                          Since website banners display horizontally, choose how you would like your photo formatted:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => applyAspectRatioMode("festive-wings")}
                            disabled={isConvertingImage}
                            className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                              aspectRatioMode === "festive-wings"
                                ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm ring-1 ring-amber-300"
                                : "bg-white text-stone-800 border-amber-300 hover:bg-amber-50"
                            }`}
                          >
                            <span className="flex items-center gap-1">✨ Auto-Fit (Festive Wings)</span>
                            <span className="block text-[10px] font-normal opacity-90 mt-0.5">100% in-frame, no cropping</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => applyAspectRatioMode("crop-center")}
                            disabled={isConvertingImage}
                            className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                              aspectRatioMode === "crop-center"
                                ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm ring-1 ring-amber-300"
                                : "bg-white text-stone-800 border-amber-300 hover:bg-amber-50"
                            }`}
                          >
                            <span className="flex items-center gap-1">✂️ 16:9 Center Crop</span>
                            <span className="block text-[10px] font-normal opacity-90 mt-0.5">Full widescreen fill</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => applyAspectRatioMode("raw")}
                            disabled={isConvertingImage}
                            className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                              aspectRatioMode === "raw"
                                ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm ring-1 ring-amber-300"
                                : "bg-white text-stone-800 border-amber-300 hover:bg-amber-50"
                            }`}
                          >
                            <span className="flex items-center gap-1">🖼️ Raw Centered</span>
                            <span className="block text-[10px] font-normal opacity-90 mt-0.5">Keep original shape</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Details & Action Button */}
                  <div className="space-y-4 pt-3 border-t border-amber-200">
                    <label className="block font-bold text-xs text-stone-800 uppercase tracking-wider">
                      2. Business Identity &amp; Contact Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Business / Store Name *</label>
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Sri Lakshmi Sweets &amp; Bakers"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/30 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Category *</label>
                        <select
                          value={category}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            setCategory(newCat);
                            setCtaButton(getDefaultCtaForCategory(newCat));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/30"
                        >
                          <option value="Sweets & Upvas Food">Sweets &amp; Upvas Food</option>
                          <option value="Pooja Samagri">Pooja Items &amp; Camphor</option>
                          <option value="Flowers & Garlands">Flowers &amp; Garlands</option>
                          <option value="Clothing & Silks">Festive Silks &amp; Sarees</option>
                          <option value="Catering & Prasadam">Catering &amp; Prasadam</option>
                          <option value="Decorations & Sound">Decorations &amp; Lighting</option>
                          <option value="Jewelry & Gold">Jewelry &amp; Gold</option>
                          <option value="Other Local Business">Other Local Business</option>
                        </select>
                      </div>
                    </div>

                    {/* City and Target Zone Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">City *</label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium"
                        >
                          <option value="Nizamabad">Nizamabad</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Karimnagar">Karimnagar</option>
                          <option value="Warangal">Warangal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Target Region / Zone *</label>
                        <select
                          value={targetZone}
                          onChange={(e) => setTargetZone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium text-stone-900"
                        >
                          <option value="All Zones">All Zones in {city} (Entire City)</option>
                          <option value="Subhash Nagar">Subhash Nagar &amp; Mandapam Belt</option>
                          <option value="Khaleelwadi">Khaleelwadi Commercial Area</option>
                          <option value="Gandhi Chowk">Gandhi Chowk &amp; Temple Street</option>
                          <option value="Vinayak Nagar">Vinayak Nagar &amp; Bypass</option>
                          <option value="Dilsukhnagar">Dilsukhnagar &amp; Kothapet</option>
                          <option value="Ameerpet">Ameerpet &amp; SR Nagar</option>
                          <option value="Custom">Custom Area / Street</option>
                        </select>
                      </div>
                    </div>

                    {targetZone === "Custom" && (
                      <div className="text-xs">
                        <label className="block font-bold mb-1 text-stone-800">Specify Custom Zone or Street Name *</label>
                        <input
                          type="text"
                          required
                          value={customZone}
                          onChange={(e) => setCustomZone(e.target.value)}
                          placeholder="e.g. Your Area or Street Name"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                        />
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">
                          Mobile No * (For Calls / Orders)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="10-digit mobile number"
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-stone-400">
                            {phone.length}/10
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-stone-800">
                          WhatsApp No (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            maxLength={10}
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="If different from mobile no"
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-stone-400">
                            {whatsapp.length}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-xs">
                      <label className="block font-bold mb-1 text-stone-800">Clickable Action Button (CTA) *</label>
                      <input
                        type="text"
                        value={ctaButton}
                        onChange={(e) => setCtaButton(e.target.value)}
                        placeholder="Order Now, Call Store, WhatsApp Us..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-semibold text-stone-900"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {["Order Now", "Call Store", "WhatsApp Us", "Shop Now", "Visit Store"].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => setCtaButton(preset)}
                            className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all border ${
                              ctaButton === preset
                                ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-xs"
                                : "bg-white text-stone-700 border-amber-300 hover:bg-amber-50"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FORMAT 2: TEXT OFFER BULLETIN (No photo needed • Inbuilt festive templates) */}
              {adFormat === "TEXT_BULLETIN" && (
                <div className="space-y-5 pt-3 border-t border-amber-200 text-xs">
                  {/* Inbuilt Festive Template Themes */}
                  <div className="space-y-2">
                    <label className="block font-bold text-stone-800 uppercase tracking-wider">
                      1. Choose Inbuilt Festive Template Theme *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "crimson" as const, label: "👑 Royal Crimson", desc: "Red & Gold gradient" },
                        { id: "maroon" as const, label: "🏛️ Classic Maroon", desc: "Traditional dark temple" },
                        { id: "gold" as const, label: "🌟 Sacred Amber", desc: "Warm gold & amber" },
                        { id: "royal" as const, label: "🌌 Midnight Indigo", desc: "Royal deep blue" }
                      ].map((tmpl) => (
                        <button
                          type="button"
                          key={tmpl.id}
                          onClick={() => setTemplateTheme(tmpl.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            templateTheme === tmpl.id
                              ? "bg-gradient-to-br from-[#8B1E1E] to-[#B45309] text-white border-amber-400 shadow-md ring-2 ring-[#8B1E1E]/30"
                              : "bg-white text-stone-800 border-amber-300 hover:bg-amber-50/60"
                          }`}
                        >
                          <span className="font-bold text-xs block">{tmpl.label}</span>
                          <span
                            className={`text-[10px] block mt-0.5 ${
                              templateTheme === tmpl.id ? "text-amber-200" : "text-stone-500"
                            }`}
                          >
                            {tmpl.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Business & Offer Text Details */}
                  <div className="space-y-4 pt-3 border-t border-amber-200">
                    <label className="block font-bold text-stone-800 uppercase tracking-wider">
                      2. Offer Headline &amp; Bullet Points
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Business / Store Name *</label>
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Sri Lakshmi Sweets &amp; Bakers"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Category *</label>
                        <select
                          value={category}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            setCategory(newCat);
                            setCtaButton(getDefaultCtaForCategory(newCat));
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium"
                        >
                          <option value="Sweets & Upvas Food">Sweets &amp; Upvas Food</option>
                          <option value="Pooja Samagri">Pooja Items &amp; Camphor</option>
                          <option value="Flowers & Garlands">Flowers &amp; Garlands</option>
                          <option value="Clothing & Silks">Festive Silks &amp; Sarees</option>
                          <option value="Catering & Prasadam">Catering &amp; Prasadam</option>
                          <option value="Decorations & Sound">Decorations &amp; Lighting</option>
                          <option value="Jewelry & Gold">Jewelry &amp; Gold</option>
                          <option value="Other Local Business">Other Local Business</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Offer Headline / Title *</label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Navaratri Maha Offer — Flat 25% Off on All Orders!"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Offer Badge / Tag</label>
                        <input
                          type="text"
                          value={discountTag}
                          onChange={(e) => setDiscountTag(e.target.value)}
                          placeholder="e.g. SPECIAL FESTIVE OFFER or 25% OFF"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-semibold text-amber-900"
                        />
                      </div>
                    </div>

                    {/* 3 Key Highlights */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-stone-800">
                        Key Offer Highlights / Bullet Points (3 Points)
                      </label>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                            1
                          </span>
                          <input
                            type="text"
                            value={bulletPoint1}
                            onChange={(e) => setBulletPoint1(e.target.value)}
                            placeholder="e.g. 100% Satvik &amp; Fresh Ingredients Daily"
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                            2
                          </span>
                          <input
                            type="text"
                            value={bulletPoint2}
                            onChange={(e) => setBulletPoint2(e.target.value)}
                            placeholder="e.g. Fast Free Delivery to All Mandapams Across Zone"
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                            3
                          </span>
                          <input
                            type="text"
                            value={bulletPoint3}
                            onChange={(e) => setBulletPoint3(e.target.value)}
                            placeholder="e.g. Special Discounts for Bulk Mandapam Orders"
                            className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* City and Target Zone Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">City *</label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium"
                        >
                          <option value="Nizamabad">Nizamabad</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Karimnagar">Karimnagar</option>
                          <option value="Warangal">Warangal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Target Region / Zone *</label>
                        <select
                          value={targetZone}
                          onChange={(e) => setTargetZone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium text-stone-900"
                        >
                          <option value="All Zones">All Zones in {city} (Entire City)</option>
                          <option value="Subhash Nagar">Subhash Nagar &amp; Mandapam Belt</option>
                          <option value="Khaleelwadi">Khaleelwadi Commercial Area</option>
                          <option value="Gandhi Chowk">Gandhi Chowk &amp; Temple Street</option>
                          <option value="Vinayak Nagar">Vinayak Nagar &amp; Bypass</option>
                          <option value="Dilsukhnagar">Dilsukhnagar &amp; Kothapet</option>
                          <option value="Ameerpet">Ameerpet &amp; SR Nagar</option>
                          <option value="Custom">Custom Area / Street</option>
                        </select>
                      </div>
                    </div>

                    {targetZone === "Custom" && (
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">Specify Custom Zone or Street Name *</label>
                        <input
                          type="text"
                          required
                          value={customZone}
                          onChange={(e) => setCustomZone(e.target.value)}
                          placeholder="e.g. Your Area or Street Name"
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                        />
                      </div>
                    )}

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold mb-1 text-stone-800">
                          Mobile No * (For Calls / Orders)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="10-digit mobile number"
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-stone-400">
                            {phone.length}/10
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold mb-1 text-stone-800">
                          WhatsApp No (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            maxLength={10}
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            placeholder="If different from mobile no"
                            className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-stone-400">
                            {whatsapp.length}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action CTA Button */}
                    <div>
                      <label className="block font-bold mb-1 text-stone-800">Call to Action Button Label</label>
                      <input
                        type="text"
                        value={ctaButton}
                        onChange={(e) => setCtaButton(e.target.value)}
                        placeholder="Order Now / Call Store"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-semibold"
                      />
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {["Order Now", "Call Store", "WhatsApp Us", "Book Pooja", "Visit Shop"].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => setCtaButton(preset)}
                            className={`text-[10px] px-2.5 py-0.5 rounded-lg font-semibold transition-all border ${
                              ctaButton === preset
                                ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-xs"
                                : "bg-white text-stone-700 border-amber-300 hover:bg-amber-50"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. IN-PAGE LIVE DEVOTEE PREVIEW WITH MOBILE/DESKTOP SWITCHER */}
              <div className="space-y-3 pt-3 border-t-2 border-amber-300/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E]">
                    <Eye className="w-4 h-4 text-amber-700" />
                    <span>LIVE IN-FRAME DEVOTEE PREVIEW</span>
                  </div>
                  {/* Mobile / Desktop view switcher */}
                  <div className="flex items-center bg-amber-100 p-0.5 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setInPagePreviewDevice("mobile")}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        inPagePreviewDevice === "mobile"
                          ? "bg-[#8B1E1E] text-white shadow-xs"
                          : "text-amber-900 hover:text-stone-900"
                      }`}
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Mobile View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInPagePreviewDevice("desktop")}
                      className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        inPagePreviewDevice === "desktop"
                          ? "bg-[#8B1E1E] text-white shadow-xs"
                          : "text-amber-900 hover:text-stone-900"
                      }`}
                    >
                      <Monitor className="w-3 h-3" />
                      <span>Desktop View</span>
                    </button>
                  </div>
                </div>

                {/* Preview Frame */}
                <div className="rounded-2xl border-2 border-amber-400/80 bg-[#1e130e] p-3 sm:p-4 shadow-inner">
                  {/* Widescreen Landscape Banner Display */}
                  <div className={`relative mx-auto overflow-hidden rounded-2xl border border-amber-400/60 bg-[#120a06] flex items-center justify-center shadow-lg transition-all ${
                    inPagePreviewDevice === "mobile" ? "w-full max-w-sm h-40 sm:h-44" : "w-full h-48 sm:h-56"
                  }`}>
                    {/* Background */}
                    <div
                      className="absolute inset-0 bg-cover bg-center blur-md opacity-30 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url("${imagePreview}")` }}
                    />
                    <img
                      src={imagePreview}
                      alt="Banner Preview"
                      className="w-full h-full object-contain relative z-10 mx-auto"
                    />
                    {/* Top sponsored tag */}
                    <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-amber-200 border border-amber-300/40 flex items-center gap-1.5 shadow">
                      <span className={`w-1.5 h-1.5 rounded-full ${isExclusive ? 'bg-amber-400 ring-2 ring-amber-300/60' : 'bg-emerald-400 animate-pulse'}`} />
                      <span>{isExclusive ? "👑 24/7 Solo Spotlight" : "🔄 6s Rotation"} • {businessName || "Your Business"}</span>
                    </div>
                    {/* CTA button */}
                    <div className="absolute bottom-2.5 right-2.5 z-20">
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1 border border-amber-300/60">
                        {ctaButton || "Order Now"} ↗
                      </span>
                    </div>
                  </div>

                  {/* Summary Bar below preview */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2 px-1 text-[11px] text-amber-200/90 font-medium">
                    <span className="truncate">
                      📍 Target: {effectiveDisplayZone}, {city} • {category}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isExclusive ? "bg-amber-500/20 text-amber-300 border border-amber-400/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                      }`}>
                        {isExclusive ? "👑 100% Solo (No Other Ads)" : "🔄 Changes Every 6s"}
                      </span>
                      <span className="text-emerald-300 font-bold">
                        ✓ 100% In-Frame
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdPreview(true)}
                  className="w-full py-2 rounded-xl border border-[#8B1E1E] text-[#8B1E1E] text-xs font-bold hover:bg-[#8B1E1E]/5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Open Full Phone &amp; Desktop Simulator</span>
                </button>
              </div>

              {/* 5. SUMMARY & PROCEED TO PAY */}
              <div className="pt-3 border-t border-amber-200 space-y-3">
                {/* Payment Due Summary */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#8B1E1E]/8 via-amber-50 to-amber-100/50 border border-amber-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 font-sans block">Selected Plan</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          isExclusive ? "bg-[#8B1E1E] text-white" : "bg-amber-200 text-amber-900"
                        }`}>
                          {isExclusive ? "👑 24/7 Solo Dedicated" : "🔄 Combinational (6s Rotation)"}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-stone-900 font-serif">{selectedPkg.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-['Cinzel',serif] font-black text-2xl sm:text-3xl text-[#8B1E1E]">₹{selectedPkg.priceInr}</span>
                      <span className="text-[10px] sm:text-xs text-stone-600 font-semibold">/ {selectedPkg.durationDays} day{selectedPkg.durationDays > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-stone-600">
                    {isExclusive
                      ? `Includes ~${selectedPkg.impressionLimit?.toLocaleString()} guaranteed devotee impressions • Non-stop 24/7 solo frame with zero other ads`
                      : `Includes ~${selectedPkg.impressionLimit?.toLocaleString()} devotee impressions • Rotates every 6s across your zone`}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#9A241C] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-sm sm:text-base font-bold shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Pay ₹{selectedPkg.priceInr} via UPI →</span>
                </button>
              </div>
            </form>

            {/* STEP 3: UPI PAYMENT & CONFIRMATION */}
            {paymentStep && (
              <div ref={paymentRef} className="p-5 sm:p-8 rounded-3xl bg-white border-2 border-amber-400 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Header */}
                <div className="border-b border-amber-200 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">STEP 3: PAY &amp; CONFIRM</span>
                    <h4 className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E]">
                      Total Due: ₹{selectedPkg.priceInr}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] font-bold text-xs border border-amber-200">
                      {selectedPkg.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      isExclusive ? "bg-[#8B1E1E] text-white" : "bg-stone-100 text-stone-700 border border-stone-200"
                    }`}>
                      {isExclusive ? "👑 24/7 Solo Dedicated" : "🔄 Combinational (6s Rotation)"}
                    </span>
                  </div>
                </div>

                {/* Direct 1-Tap Mobile UPI link */}
                <a
                  href={`upi://pay?pa=6303602743@upi&pn=NavaratriMandapamAds&am=${selectedPkg.priceInr}&cu=INR&tn=${encodeURIComponent((businessName || "FestivalAd").slice(0, 20))}`}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white text-sm font-bold shadow-md flex items-center justify-center gap-2.5 text-center active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-xl">📱</span>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-emerald-200 font-semibold">One-tap Payment</span>
                    <span>Pay ₹{selectedPkg.priceInr} via GPay / PhonePe / Paytm</span>
                  </div>
                </a>

                {/* QR Code */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Or Scan UPI QR Code</p>
                    <button
                      type="button"
                      onClick={() => setShowBigQr(!showBigQr)}
                      className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-[#8B1E1E] text-[11px] font-bold flex items-center gap-1 transition-colors border border-amber-300 shadow-xs cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{showBigQr ? "Standard Size QR" : "Show Big QR"}</span>
                    </button>
                  </div>
                  <div className={`mx-auto rounded-2xl bg-white p-3 border-2 border-amber-400 shadow-md flex items-center justify-center transition-all duration-200 ${showBigQr ? "w-64 h-64 sm:w-72 sm:h-72" : "w-44 h-44"}`}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=${showBigQr ? "280x280" : "180x180"}&data=${encodeURIComponent(
                        `upi://pay?pa=6303602743@upi&pn=NavaratriMandapamAds&am=${selectedPkg.priceInr}&cu=INR&tn=${encodeURIComponent(businessName || "LocalAd")}`
                      )}`}
                      alt="UPI Payment QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs font-bold text-stone-900">Scan via GPay / PhonePe / Paytm / BHIM</p>
                </div>

                {/* UPI ID */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">Or Pay to UPI ID directly:</p>

                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-white border border-amber-300 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-stone-500">Official UPI ID</span>
                      <span className="font-mono text-sm font-bold text-stone-900">6303602743@upi</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi2}
                      className="ml-2 px-3 py-1.5 rounded-lg bg-[#8B1E1E] hover:bg-[#781B1B] text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow cursor-pointer"
                    >
                      {isCopied2 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied2 ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* UTR Input — Required */}
                <div className="space-y-1.5 text-xs">
                  <label className="block font-bold text-stone-800">
                    UPI Reference / UTR Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 12-digit UTR after payment (e.g. 427819203819)"
                    maxLength={22}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-300 focus:border-[#8B1E1E] bg-white font-mono text-sm outline-none transition-colors"
                  />
                  <p className="text-stone-500 text-[11px]">Found in your UPI app under payment details / transaction history.</p>
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="button"
                    disabled={isProcessingPayment || utrNumber.trim().length < 6}
                    onClick={() => handleCompletePayment()}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isProcessingPayment ? (
                      <span>Submitting for Verification...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>I Have Paid ₹{selectedPkg.priceInr} — Submit for Approval</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-stone-500 mt-2">
                    🔒 Your ad will go <strong>live automatically</strong> once our team verifies payment (within 2–4 hours)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACTIVE CAMPAIGNS DASHBOARD */}
      <div className="space-y-4 pt-6 border-t-2 border-amber-300/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Cinzel',serif] font-bold text-xl text-[#8B1E1E]">
              Current Active Local Business Campaigns
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              Live ads running across Mandapam discovery and citizen feeds
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] font-bold text-xs border border-amber-300">
            {advertisements.length} Campaigns
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advertisements.map((ad) => (
            <div key={ad.id} className="p-4 rounded-2xl bg-white border border-amber-300 shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#8B1E1E] font-serif truncate">{ad.businessName}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {ad.status}
                </span>
              </div>
              <p className="text-stone-800 font-semibold truncate">{ad.title}</p>
              <p className="text-[11px] text-stone-500">📍 Zone: {ad.targetZone || ad.targetArea || ad.city}</p>

              <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-[11px]">
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  {ad.impressions} Views
                </span>
                <span className="flex items-center gap-1 font-semibold text-stone-800">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  {ad.clicks} Clicks
                </span>
                <span className="text-emerald-700 font-bold">
                  {ad.paymentStatus || "PAID"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* ===== AD PREVIEW MODAL ===== */}
      {showAdPreview && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center overflow-y-auto animate-in fade-in p-3 sm:p-6">
          <div className="w-full max-w-2xl my-4 sm:my-8 space-y-3">

            {/* Modal chrome header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#8B1E1E] to-[#B45309] rounded-2xl text-white shadow-xl">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">Live Devotee View</p>
                <h3 className="font-['Cinzel',serif] font-black text-base leading-tight">Your Ad Preview</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile / Desktop tab switcher */}
                <div className="flex items-center bg-black/30 rounded-xl p-0.5 text-[11px] font-bold">
                  <button
                    onClick={() => setPreviewTab("mobile")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${previewTab === "mobile" ? "bg-white text-[#8B1E1E] shadow" : "text-amber-200 hover:text-white"}`}
                  >📱 Mobile</button>
                  <button
                    onClick={() => setPreviewTab("desktop")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${previewTab === "desktop" ? "bg-white text-[#8B1E1E] shadow" : "text-amber-200 hover:text-white"}`}
                  >🖥 Desktop</button>
                </div>
                <button onClick={() => setShowAdPreview(false)} className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MOBILE PHONE FRAME */}
            {previewTab === "mobile" && (
              <div className="flex justify-center">
                <div className="relative w-[300px] sm:w-[320px] rounded-[2.5rem] bg-stone-900 p-[9px] shadow-2xl border-4 border-stone-700">
                  {/* Notch */}
                  <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-20 h-5 bg-stone-900 rounded-full z-10" />
                  {/* Screen */}
                  <div className="rounded-[2rem] overflow-hidden bg-[#FDFBF7] flex flex-col" style={{ height: 580 }}>

                    {/* Real Header — Mobile */}
                    <div className="shrink-0 bg-[#FDFBF7] border-b-2 border-amber-300/40 shadow-sm">
                      <div className="bg-gradient-to-r from-[#8B1E1E] via-[#9A241C] to-[#8B1E1E] text-white px-3 py-1 flex items-center justify-between">
                        <span className="font-serif text-amber-200 font-bold text-[9px]">॥ Om Sri Matre Namaha ॥</span>
                        <span className="text-[9px] text-amber-300 font-bold">🌐 English</span>
                      </div>
                      <div className="px-3 h-10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">🔱</span>
                          <span className="font-['Cinzel',serif] font-black text-[12px] text-[#8B1E1E]">Sharan Navaratri</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex flex-col items-center justify-center gap-[3px]">
                          <span className="w-3.5 h-[2px] bg-stone-600 rounded" />
                          <span className="w-3.5 h-[2px] bg-stone-600 rounded" />
                          <span className="w-3.5 h-[2px] bg-stone-600 rounded" />
                        </div>
                      </div>
                    </div>

                    {/* Scrollable page content — exact landing page order on mobile */}
                    <div className="flex-1 overflow-y-auto bg-[#FDFBF7]">
                      {/* 1. Top ad banner (shown right under the header on mobile) */}
                      <div className="px-2.5 pt-2 pb-1.5">
                        {renderYourAdTag("Top banner • below header")}
                        {renderPreviewFrame("h-[92px]")}
                        {renderMobileSponsorBar()}
                      </div>

                      {/* 2. Hero */}
                      {renderHeroMini(false)}

                      {/* 3. Scan QR + Register */}
                      <div className="px-2 pt-2.5 pb-1.5 space-y-1.5">
                        {renderCtaTiles("w-[104px] h-[84px]", "text-[7.5px]")}
                        {renderLoginStrip("text-[6.5px]")}
                      </div>

                      {/* 4. 9-day schedule */}
                      <div className="px-2.5 pt-2">{renderScheduleGhost(false)}</div>

                      {/* 5. Festival ads space (bottom of home page) */}
                      <div className="px-2.5 pt-3 pb-2.5">
                        {renderYourAdTag("Festival ads space • home page")}
                        {renderPreviewFrame("h-[120px]", "rounded-3xl")}
                        {renderMobileSponsorBar()}
                        <div className="flex justify-center pt-2">
                          <span className="px-6 py-1 rounded-full bg-[#C12535] text-white text-[8px] font-bold shadow">Run Your Ads</span>
                        </div>
                      </div>
                    </div>

                    {/* Real Bottom Nav Bar */}
                    <div className="shrink-0 bg-[#FDFBF7] border-t-2 border-amber-300/40 px-2 py-1 grid grid-cols-5 gap-0.5 shadow-inner items-center">
                      <div className="flex flex-col items-center gap-0.5 py-1 rounded-lg bg-[#8B1E1E]/10">
                        <span className="text-xs">🏛</span>
                        <span className="text-[8px] font-bold text-[#8B1E1E]">Home</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 py-1 rounded-lg">
                        <span className="text-xs">📖</span>
                        <span className="text-[8px] font-bold text-stone-400">Know</span>
                      </div>
                      {/* Center QR button */}
                      <div className="flex flex-col items-center -mt-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9A241C] to-[#D97706] text-white flex items-center justify-center text-[10px] shadow-sm">
                          📷
                        </div>
                        <span className="text-[7px] font-bold text-[#8B1E1E] mt-0.5 leading-none">Scan QR</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 py-1 rounded-lg">
                        <span className="text-xs">📍</span>
                        <span className="text-[8px] font-bold text-stone-400">Near Me</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 py-1 rounded-lg">
                        <span className="text-xs">❤️</span>
                        <span className="text-[8px] font-bold text-stone-400">Following</span>
                      </div>
                    </div>

                    {/* Real Footer with 2 lines sloka and 2 lines branding */}
                    <div className="shrink-0 bg-gradient-to-b from-[#2D0B0B] via-[#200606] to-[#120303] px-3 py-2 text-center space-y-0.5 border-t border-amber-500/20">
                      <p className="text-[8px] font-bold text-amber-300 tracking-wider font-serif">
                        ॥ Om Sri Matre Namaha ॥
                      </p>
                      <p className="text-[7px] font-semibold text-amber-300/80 font-serif">
                        Sarva Mangala Mangalye Shive Sarvartha Sadhike
                      </p>
                      <p className="font-['Cinzel',serif] font-bold text-[9px] text-amber-200 pt-0.5">
                        Sharan Navaratri 2026
                      </p>
                      <p className="font-serif font-bold text-[8px] text-amber-400/90">
                        Navaratri Mandapam 2026
                      </p>
                    </div>

                  </div>
                  {/* Home indicator */}
                  <div className="mt-2 mx-auto w-16 h-1 bg-stone-600 rounded-full" />
                </div>
              </div>
            )}

            {/* DESKTOP BROWSER FRAME */}
            {previewTab === "desktop" && (
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-stone-700 bg-stone-800">
                {/* Browser chrome */}
                <div className="bg-stone-700 px-3 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 bg-stone-600 rounded-md px-3 py-1 text-[10px] text-stone-300 font-mono truncate">
                    sharan-navratri.vercel.app/navaratri
                  </div>
                </div>

                {/* Page */}
                <div className="bg-[#FDFBF7]">
                  {/* Real Header — Desktop */}
                  <div className="bg-[#FDFBF7] border-b-2 border-amber-300/40 shadow-sm">
                    <div className="bg-gradient-to-r from-[#8B1E1E] via-[#9A241C] to-[#8B1E1E] text-white px-4 py-1 flex items-center justify-between">
                      <span className="font-serif text-amber-200 font-bold text-[10px]">॥ Om Sri Matre Namaha ॥</span>
                      <span className="text-[10px] text-amber-100 font-bold">🌐 English ▾</span>
                    </div>
                    <div className="px-4 h-12 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔱</span>
                        <span className="font-['Cinzel',serif] font-black text-sm text-[#8B1E1E]">Sharan Navaratri</span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-bold text-stone-600">
                        {["Home", "Know", "Near Me", "Following"].map((l, i) => (
                          <span key={l} className={i === 0 ? "text-[#8B1E1E] border-b border-[#8B1E1E]" : ""}>{l}</span>
                        ))}
                      </div>
                      <div className="flex items-center p-0.5 rounded-xl bg-white border border-amber-300 text-[9px] font-bold gap-0.5">
                        <span className="px-2 py-1 rounded-lg text-stone-700">Login as Mandapam</span>
                        <span className="w-px h-3 bg-amber-200" />
                        <span className="px-2 py-1 rounded-lg bg-[#8B1E1E] text-white">+ Register</span>
                        <span className="w-px h-3 bg-amber-200" />
                        <span className="px-2 py-1 rounded-lg text-amber-900">Run Ads</span>
                      </div>
                    </div>
                  </div>

                  {/* Page body — exact landing page order on desktop */}
                  {renderHeroMini(true)}

                  {/* Quick actions row flanked by LEFT & RIGHT ad boxes (desktop only) */}
                  <div className="px-4 pt-3 pb-2 flex items-stretch gap-3">
                    <div className="w-[150px] shrink-0">{renderFlankBox("Left side box")}</div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                      {renderCtaTiles("w-[120px] h-[100px]", "text-[9px]")}
                      <div className="pt-1.5">
                        {renderLoginStrip("text-[8px]")}
                      </div>
                    </div>
                    <div className="w-[150px] shrink-0">{renderFlankBox("Right side box")}</div>
                  </div>

                  <div className="px-4 pt-2">{renderScheduleGhost(true)}</div>

                  {/* Festival ads space — desktop: Sponsored pill + name top-left, CTA bottom-right ON the banner */}
                  <div className="px-4 pt-3 pb-3">
                    {renderYourAdTag("Festival ads space • home page")}
                    <div className="relative">
                      {renderPreviewFrame("h-48", "rounded-3xl")}
                      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/40 text-[8px] font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" /> Sponsored
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[8px] font-semibold text-white/90">{previewName}</span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 z-20">{renderPreviewActions("sm")}</div>
                    </div>
                    <div className="flex justify-center pt-2.5">
                      <span className="px-8 py-1.5 rounded-full bg-[#C12535] text-white text-[10px] font-bold shadow">Run Your Ads</span>
                    </div>
                  </div>

                  {/* Real Footer with 2 lines sloka and 2 lines branding */}
                  <div className="bg-gradient-to-b from-[#2D0B0B] via-[#200606] to-[#120303] px-4 py-3 text-center space-y-1 border-t border-amber-500/20">
                    <p className="text-[10px] font-bold text-amber-300 tracking-wider font-serif">
                      ॥ Om Sri Matre Namaha ॥
                    </p>
                    <p className="text-[9px] font-semibold text-amber-300/80 font-serif">
                      Sarva Mangala Mangalye Shive Sarvartha Sadhike
                    </p>
                    <p className="font-['Cinzel',serif] font-bold text-xs text-amber-200 pt-0.5">
                      Sharan Navaratri 2026
                    </p>
                    <p className="font-serif font-bold text-[11px] text-amber-400/90">
                      Navaratri Mandapam 2026
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Go-Live info + action buttons */}
            <div className="bg-white rounded-2xl border border-amber-300 shadow-md p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-300">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Estimated Go-Live Time</p>
                  <p className="font-['Cinzel',serif] font-black text-[#8B1E1E] text-base leading-tight">{goLiveLabel} · {goLiveDate}</p>
                  <p className="text-[10px] text-stone-500">~2 hrs after payment confirmation by our team</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdPreview(false)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white text-sm font-bold hover:from-[#781B1B] hover:to-[#92400E] transition-all shadow"
                >
                  Looks Good — Continue
                </button>
                <button
                  onClick={() => setShowAdPreview(false)}
                  className="px-4 py-3 rounded-xl bg-stone-100 text-stone-700 text-sm font-bold hover:bg-stone-200 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
