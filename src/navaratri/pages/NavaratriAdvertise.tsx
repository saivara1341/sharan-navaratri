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
  CheckCheck
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

  // Package & Format State
  const [selectedPkgId, setSelectedPkgId] = useState(adPackages[0]?.id || "pkg-starter");
  const [adFormat, setAdFormat] = useState<"BANNER" | "BUSINESS_CARD" | "TEXT_BULLETIN">("BANNER");

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

  // Digital Visiting Card State
  const [contactPerson, setContactPerson] = useState("");
  const [tagline, setTagline] = useState("");
  const [cardTheme, setCardTheme] = useState<"terracotta" | "maroon" | "gold" | "royal">("terracotta");

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

  // Curated festive image presets
  const festivePresets = [
    { label: "Pure Ghee Sweets", url: navaratriAsset("/navaratri/assets/ivory-lotus-kolam.jpg") },
    { label: "Pooja Samagri", url: navaratriAsset("/navaratri/assets/golden-lotus-bg.jpg") },
    { label: "Festive Silks", url: navaratriAsset("/navaratri/assets/sage-floral-bg.jpg") },
    { label: "Temple Arch Frame", url: navaratriAsset("/navaratri/assets/temple-arch-frame.jpg") },
    { label: "Terracotta Kolam", url: navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg") }
  ];

  // Selected package details
  const selectedPkg = adPackages.find(p => p.id === selectedPkgId) || {
    id: "pkg-starter",
    name: "1 Day Daily Booster",
    priceInr: 49,
    durationDays: 1,
    impressionLimit: 1500,
    description: "Ideal for daily festive offers and sweet stall promos."
  };

  const effectiveDisplayZone = targetZone === "Custom" ? (customZone || "Custom Zone") : targetZone;

  // Auto-generate canvas image when in Visiting Card or Text Bulletin format
  React.useEffect(() => {
    if (adFormat === "BUSINESS_CARD") {
      const card = generateVisitingCardCanvas({
        businessName: businessName.trim() || "Your Business Name",
        contactPerson: contactPerson.trim() || "Proprietor / Owner",
        tagline: tagline.trim() || "Quality Products & Festive Specials",
        category,
        phone: phone.trim() || "9848012345",
        whatsapp: whatsapp.trim() || phone.trim() || "9848012345",
        address: address.trim() || `${effectiveDisplayZone}, ${city}`,
        city,
        targetZone: effectiveDisplayZone,
        theme: cardTheme
      });
      if (card) {
        setImagePreview(card);
        setImageUrl(card);
      }
    } else if (adFormat === "TEXT_BULLETIN") {
      const bulletin = generateTextBulletinCanvas({
        businessName: businessName.trim() || "Your Business / Store",
        headline: title.trim() || "Festival Special Offers & Discounts",
        discountTag: discountTag.trim() || "SPECIAL FESTIVE OFFER",
        bulletPoints: [bulletPoint1, bulletPoint2, bulletPoint3].filter(Boolean),
        phone: phone.trim() || "9848012345",
        city,
        ctaText: ctaButton || "Order Now"
      });
      if (bulletin) {
        setImagePreview(bulletin);
        setImageUrl(bulletin);
      }
    }
  }, [adFormat, businessName, contactPerson, tagline, category, phone, whatsapp, address, city, effectiveDisplayZone, cardTheme, title, discountTag, bulletPoint1, bulletPoint2, bulletPoint3, ctaButton]);

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

  const handlePresetSelect = (url: string) => {
    setImagePreview(url);
    setImageUrl(url);
    setUploadedOrientation("landscape");
    setAspectRatioMode("raw");
    toast.info("Festive preset applied to your ad banner.");
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
      toast.error("Please fill in your business name and 10-digit contact phone.");
      return;
    }
    if (adFormat === "BANNER" && !title.trim()) {
      toast.error("Please enter an ad headline or title.");
      return;
    }
    if (adFormat === "TEXT_BULLETIN" && !title.trim()) {
      toast.error("Please enter your promotional offer headline.");
      return;
    }
    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number (e.g. 9848012345).");
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
    const effectiveTitle = title.trim() || (adFormat === "BUSINESS_CARD" ? (tagline.trim() || `${businessName.trim()} Digital Card`) : `${businessName.trim()} Festive Offer`);

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
        description: description.trim() || (adFormat === "BUSINESS_CARD" ? (tagline.trim() || "Verified local festival business & vendor.") : "Special Navaratri festive offers and discounts."),
        imageUrl: imagePreview,
        format: adFormat,
        contactPerson: contactPerson.trim() || undefined,
        tagline: tagline.trim() || undefined,
        bulletPoints: adFormat === "TEXT_BULLETIN" ? [bulletPoint1, bulletPoint2, bulletPoint3].filter(Boolean) : undefined,
        cardTheme: adFormat === "BUSINESS_CARD" ? cardTheme : undefined,
        ctaText: ctaButton.trim() || (adFormat === "BUSINESS_CARD" ? "Call Store" : getDefaultCtaForCategory(category)),
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
  const previewIsCard = adFormat === "BUSINESS_CARD";
  const previewName = businessName.trim() || "Your Business Name";
  const previewCta = ctaButton || "Order Now";

  const renderYourAdTag = (label: string) => (
    <div className="flex items-center gap-1 mb-1">
      <span className="px-1.5 py-[1px] rounded-full bg-emerald-600 text-white text-[7px] font-black uppercase tracking-wider shadow-sm">▼ Your Ad</span>
      <span className="text-[7px] font-bold text-emerald-800">{label}</span>
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
            <p className="text-[11px] text-stone-600">Package: {selectedPkg.name} (₹{selectedPkg.priceInr})</p>
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
          {/* STEP 1: SELECT PACKAGE */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E]">
                <Tag className="w-3.5 h-3.5" />
                <span>STEP 1: SELECT DURATION & PRICING</span>
              </div>
              <h2 className="font-['Cinzel',serif] font-bold text-lg sm:text-xl text-stone-900">
                Transparent & Affordable Daily Pricing
              </h2>
            </div>

            {/* Mobile: Horizontal scroll chips — Desktop: 3-col grid */}
            <div className="sm:hidden flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
              {adPackages.map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`cursor-pointer rounded-2xl p-3.5 border-2 transition-all flex-shrink-0 w-[72vw] max-w-[260px] snap-start relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] border-[#8B1E1E] shadow-lg ring-2 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#8B1E1E] text-white text-[9px] font-bold shadow">
                        POPULAR
                      </span>
                    )}
                    <p className="font-bold text-[10px] uppercase tracking-wider text-amber-900 font-serif mb-1.5">{pkg.name}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-black text-[#8B1E1E]">₹{pkg.priceInr}</span>
                      <span className="text-[10px] text-stone-500 font-semibold">/ {pkg.durationDays} day(s)</span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-snug mb-2">{pkg.description}</p>
                    <div className="text-[10px] text-stone-600 space-y-0.5 mb-3">
                      <p>✓ ~{pkg.impressionLimit?.toLocaleString()} Impressions</p>
                      <p>✓ Zone-targeted · Call & WhatsApp</p>
                    </div>
                    <div className={`w-full py-2 rounded-xl text-[11px] font-bold text-center ${
                      isSelected ? "bg-[#8B1E1E] text-white" : "bg-amber-100 text-stone-800"
                    }`}>
                      {isSelected ? "Selected ✓" : "Tap to Choose"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: 3-col grid */}
            <div className="hidden sm:grid grid-cols-3 gap-4">
              {adPackages.map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] border-[#8B1E1E] shadow-lg ring-2 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200 hover:border-amber-400 shadow-xs"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#8B1E1E] text-white text-[9px] font-bold shadow">
                        POPULAR
                      </span>
                    )}
                    <div className="space-y-2">
                      <p className="font-bold text-xs uppercase tracking-wider text-amber-900 font-serif">{pkg.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#8B1E1E]">₹{pkg.priceInr}</span>
                        <span className="text-xs text-stone-500 font-semibold">/ {pkg.durationDays} day(s)</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{pkg.description}</p>
                      <div className="pt-2 border-t border-amber-100 text-[11px] text-stone-600 space-y-1">
                        <p>✓ ~{pkg.impressionLimit?.toLocaleString()} Devotee Impressions</p>
                        <p>✓ Zone-targeted display</p>
                        <p>✓ Call & WhatsApp integration</p>
                      </div>
                    </div>
                    <button type="button" className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected ? "bg-[#8B1E1E] text-white shadow" : "bg-amber-100 text-stone-800 hover:bg-amber-200"
                    }`}>
                      {isSelected ? "Selected ✓" : "Choose Package"}
                    </button>
                  </div>
                );
              })}
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
                  Choose the format that works best for your business — photo banner, digital visiting card, or text offer bulletin.
                </p>
              </div>

              {/* 1. AD FORMAT SELECTOR TABS */}
              <div className="space-y-2">
                <label className="block font-bold text-xs text-stone-800 uppercase tracking-wider">
                  Choose Ad Format *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Photo / Banner */}
                  <div
                    onClick={() => setAdFormat("BANNER")}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-2 ${
                      adFormat === "BANNER"
                        ? "bg-amber-50/80 border-[#8B1E1E] shadow-sm ring-1 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200 hover:border-amber-300 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#8B1E1E] flex items-center justify-center font-bold">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      {adFormat === "BANNER" && (
                        <span className="text-[10px] font-bold text-[#8B1E1E] bg-amber-200/80 px-2 py-0.5 rounded-full">
                          Selected ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">Photo / Banner Ad</h4>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                        Upload shop photo or banner. Auto-fit to 16:9 landscape.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Digital Visiting Card */}
                  <div
                    onClick={() => setAdFormat("BUSINESS_CARD")}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-2 ${
                      adFormat === "BUSINESS_CARD"
                        ? "bg-amber-50/80 border-[#8B1E1E] shadow-sm ring-1 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200 hover:border-amber-300 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#8B1E1E] flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        No Image Needed
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">Digital Visiting Card</h4>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                        Gold-embossed card with owner name, phone, WhatsApp &amp; address.
                      </p>
                    </div>
                  </div>

                  {/* Option 3: Text & Offer Bulletin */}
                  <div
                    onClick={() => setAdFormat("TEXT_BULLETIN")}
                    className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-2 ${
                      adFormat === "TEXT_BULLETIN"
                        ? "bg-amber-50/80 border-[#8B1E1E] shadow-sm ring-1 ring-[#8B1E1E]/20"
                        : "bg-white border-amber-200 hover:border-amber-300 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#8B1E1E] flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        No Image Needed
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-900">Text &amp; Offer Bulletin</h4>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                        Catchy headline, special discount tag &amp; bullet points.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. STORE GENERAL DETAILS (Common to all formats) */}
              <div className="space-y-4 pt-2 border-t border-amber-200">
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
                      <option value="Sweets & Upvas Food">Sweets & Upvas Food</option>
                      <option value="Pooja Samagri">Pooja Items & Camphor</option>
                      <option value="Flowers & Garlands">Flowers & Garlands</option>
                      <option value="Clothing & Silks">Festive Silks & Sarees</option>
                      <option value="Catering & Prasadam">Catering & Prasadam</option>
                      <option value="Decorations & Sound">Decorations & Lighting</option>
                      <option value="Jewelry & Gold">Jewelry & Gold</option>
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
                      Phone for Devotees to Call (10 Digits) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="e.g. 9848012345"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-stone-400">
                        {phone.length}/10
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-stone-800">
                      WhatsApp Number (10 Digits, Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={10}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="WhatsApp number (if different)"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-stone-400">
                        {whatsapp.length}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shop Physical Address */}
                <div className="text-xs">
                  <label className="block font-bold mb-1 text-stone-800">Store Address / Landmark</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Near Durga Mandapam, Main Road, Subhash Nagar"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  />
                </div>
              </div>

              {/* 3A. FORMAT: PHOTO / BANNER AD FIELDS */}
              {adFormat === "BANNER" && (
                <div className="space-y-4 pt-3 border-t border-amber-200 text-xs">
                  {/* Recommended Ratio Guidance Callout */}
                  <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-amber-950">
                        Recommended Aspect Ratio: Landscape 16:9 (~1200×630 or 1376×768)
                      </p>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        Website ads on both mobile phones and desktop computers display in horizontal landscape banners. If you upload a mobile portrait photo (vertical), our system automatically wraps it with ambient festive wings so your photo is never cropped!
                      </p>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-stone-800">Upload Shop Photo or Banner *</label>
                      <span className="text-[11px] text-stone-500">JPG, PNG (Max 5MB)</span>
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed border-amber-400 rounded-2xl p-4 bg-amber-50/40 hover:bg-amber-100/40 transition-colors text-center space-y-2"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="w-10 h-10 mx-auto rounded-full bg-amber-200 text-[#8B1E1E] flex items-center justify-center shadow-sm">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-stone-800">Click or tap to upload photo from mobile/computer</p>
                      <p className="text-[11px] text-stone-500">Supports direct camera photos of your shop, products, or signboard</p>
                    </div>
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
                          <span className="block text-[10px] font-normal opacity-90 mt-0.5">Keep original vertical shape</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Or pick from festive presets */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-stone-700">Or Select a Ready-Made Festive Preset:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {festivePresets.map((preset) => (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => handlePresetSelect(preset.url)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-[11px] font-medium text-stone-800 transition-colors"
                        >
                          🎨 {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ad Headline & Description */}
                  <div className="space-y-3 pt-2 border-t border-amber-200">
                    <div>
                      <label className="block font-bold mb-1 text-stone-800">Ad Headline / Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Navaratri Special Pure Ghee Sweets &amp; Savories"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-semibold text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-stone-800">Promotional Description / Offer Details</label>
                      <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Get 20% off on all sweets. Fresh daily satvik preparations. Free home delivery in zone..."
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                      />
                    </div>

                    {/* CTA Button */}
                    <div>
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

              {/* 3B. FORMAT: DIGITAL VISITING CARD FIELDS */}
              {adFormat === "BUSINESS_CARD" && (
                <div className="space-y-4 pt-3 border-t border-amber-200 text-xs">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5">
                    <CreditCard className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Digital Visiting Card Generator (No Photo Required)</p>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        We generate a high-resolution, gold-embossed digital business card with your store details and clickable Call &amp; WhatsApp buttons for devotees.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold mb-1 text-stone-800">Proprietor / Owner Name</label>
                      <input
                        type="text"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="e.g. Sri Ramesh Sharma"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1 text-stone-800">Speciality / Tagline</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Pure Desi Ghee Sweets &amp; Savories"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium"
                      />
                    </div>
                  </div>

                  {/* Card Theme Picker */}
                  <div>
                    <label className="block font-bold mb-1 text-stone-800">Visiting Card Devotional Theme</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "terracotta" as const, label: "🏛️ Terracotta Gold", bg: "bg-[#6B1414] text-amber-200" },
                        { id: "maroon" as const, label: "👑 Royal Maroon", bg: "bg-[#450A0A] text-amber-300" },
                        { id: "gold" as const, label: "🌟 Sacred Amber", bg: "bg-[#78350F] text-yellow-200" },
                        { id: "royal" as const, label: "🌌 Royal Indigo", bg: "bg-[#1E1B4B] text-amber-200" }
                      ].map((t) => (
                        <button
                          type="button"
                          key={t.id}
                          onClick={() => setCardTheme(t.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            cardTheme === t.id
                              ? `${t.bg} border-amber-400 shadow-md ring-2 ring-amber-400/40`
                              : "bg-white text-stone-700 border-amber-200 hover:border-amber-300"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3C. FORMAT: TEXT & OFFER BULLETIN FIELDS */}
              {adFormat === "TEXT_BULLETIN" && (
                <div className="space-y-4 pt-3 border-t border-amber-200 text-xs">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Text &amp; Offer Bulletin (No Photo Required)</p>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Perfect for festive announcements, discounts, and puja bookings. We format it into a bold, eye-catching festive announcement bulletin card.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="e.g. SPECIAL FESTIVE OFFER, 25% OFF, LIMITED TIME"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-semibold text-amber-900"
                      />
                    </div>
                  </div>

                  {/* 3 Key Highlights */}
                  <div className="space-y-2">
                    <label className="block font-bold text-stone-800">Key Offer Highlights / Bullet Points (3 Points)</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                        <input
                          type="text"
                          value={bulletPoint1}
                          onChange={(e) => setBulletPoint1(e.target.value)}
                          placeholder="Point 1: e.g. 100% Satvik & Fresh Ingredients Daily"
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                        <input
                          type="text"
                          value={bulletPoint2}
                          onChange={(e) => setBulletPoint2(e.target.value)}
                          placeholder="Point 2: e.g. Fast Free Delivery to All Mandapams"
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                        <input
                          type="text"
                          value={bulletPoint3}
                          onChange={(e) => setBulletPoint3(e.target.value)}
                          placeholder="Point 3: e.g. Special Discounts for Durga Mandapam Bulk Orders"
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                        />
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
                    <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-amber-200 border border-amber-300/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>Sponsored • {businessName || "Your Business"}</span>
                    </div>
                    {/* CTA button */}
                    <div className="absolute bottom-2.5 right-2.5 z-20">
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1 border border-amber-300/60">
                        {ctaButton || "Order Now"} ↗
                      </span>
                    </div>
                  </div>

                  {/* Summary Bar below preview */}
                  <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-amber-200/90 font-medium">
                    <span className="truncate">
                      📍 Target: {effectiveDisplayZone}, {city} • {category}
                    </span>
                    <span className="text-emerald-300 font-bold shrink-0">
                      ✓ 100% In-Frame
                    </span>
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
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E]/8 via-amber-50 to-amber-100/50 border border-amber-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 font-sans block">Selected Plan</span>
                      <span className="text-xs sm:text-sm font-bold text-stone-800 font-serif">{selectedPkg.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-['Cinzel',serif] font-black text-2xl sm:text-3xl text-[#8B1E1E]">₹{selectedPkg.priceInr}</span>
                      <span className="text-[10px] sm:text-xs text-stone-600 font-semibold">/ {selectedPkg.durationDays} day{selectedPkg.durationDays > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-stone-600 mt-1">Includes ~{selectedPkg.impressionLimit?.toLocaleString()} devotee impressions across your zone</p>
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">STEP 3: PAY & CONFIRM</span>
                    <h4 className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E]">
                      Total Due: ₹{selectedPkg.priceInr}
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-[#8B1E1E] font-bold text-xs border border-amber-200">
                    {selectedPkg.name}
                  </span>
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
