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
  Clock
} from "lucide-react";
import { toast } from "sonner";

export const NavaratriAdvertise: React.FC = () => {
  const { adPackages, advertisements, createAdvertisement } = useNavaratriData();
  const { t } = useNavaratriLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [selectedPkgId, setSelectedPkgId] = useState(adPackages[0]?.id || "pkg-starter");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Sweets & Upvas Food");
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
          setImageUrl(reader.result);
          toast.success("Image uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (url: string) => {
    setImagePreview(url);
    setImageUrl(url);
    toast.info("Festive preset applied to your ad banner.");
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
    if (!businessName.trim() || !cleanPhone || !title.trim()) {
      toast.error("Please fill in business name, 10-digit contact phone, and advertisement title.");
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
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleCompletePayment = () => {
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      toast.error("Please enter a valid UPI Reference / UTR number (min 6 digits) after completing payment.");
      return;
    }
    setIsProcessingPayment(true);

    const effectiveZone = targetZone === "Custom" ? (customZone.trim() || "Local Mandapam Belt") : targetZone;

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
        title: title.trim(),
        description: description.trim() || "Navaratri festive discounts and special offers. Satvik preparations.",
        imageUrl: imagePreview,
        ctaText: "Contact Store",
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

  const effectiveDisplayZone = targetZone === "Custom" ? (customZone || "Custom Zone") : targetZone;

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-10 pb-20 font-sans">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#9A241C] via-[#8B1E1E] to-[#B45309] text-white p-6 sm:p-10 shadow-2xl border-4 border-amber-400/40">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none"
          style={{ backgroundImage: `url("${navaratriAsset("/navaratri/assets/terracotta-kolam-bg.jpg")}")` }}
        />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-300/40 backdrop-blur-sm">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>Hyper-Local Navaratri Advertising • Reach 15,000+ Devotees</span>
          </div>
          <h1 className="font-['Cinzel',serif] font-black text-2xl sm:text-4xl text-white drop-shadow">
            Promote Your Local Business Starting at ₹49/day
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl font-medium leading-relaxed">
            Showcase your sweet stall, flower garlands, pooja samagri store, handloom silks, or catering service directly to citizens discovering Mandapams in your chosen neighborhood zone.
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
              <h2 className="font-['Cinzel',serif] font-bold text-xl text-stone-900">
                Transparent & Affordable Daily Pricing
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: "pkg-starter",
                  name: "1 Day Daily Booster",
                  priceInr: 49,
                  durationDays: 1,
                  impressions: "1,500+",
                  desc: "Ideal for flash offers, special pooja day rush, or 1-day sweet stall promo."
                },
                {
                  id: "pkg-growth",
                  name: "3 Days Weekend Rush",
                  priceInr: 129,
                  popular: true,
                  durationDays: 3,
                  impressions: "5,000+",
                  desc: "Perfect for Moola Nakshatram, Durgashtami, and weekend devotee peaks."
                },
                {
                  id: "pkg-festival",
                  name: "9 Days Maha Utsav Pass",
                  priceInr: 349,
                  durationDays: 9,
                  impressions: "18,000+",
                  desc: "Complete 9-day coverage throughout Navaratri and Vijaya Dashami festival."
                }
              ].map((pkg) => {
                const isSelected = selectedPkgId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`cursor-pointer rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EC] border-[#8B1E1E] shadow-xl ring-2 ring-[#8B1E1E]/20 scale-[1.02]"
                        : "bg-white border-amber-200 hover:border-amber-400 shadow-sm"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#8B1E1E] text-white text-[9px] font-bold shadow">
                        POPULAR
                      </span>
                    )}

                    <div className="space-y-2">
                      <p className="font-bold text-xs uppercase tracking-wider text-amber-900 font-serif">
                        {pkg.name}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#8B1E1E]">₹{pkg.priceInr}</span>
                        <span className="text-xs text-stone-500 font-semibold">/ {pkg.durationDays} day(s)</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {pkg.desc}
                      </p>
                      <div className="pt-2 border-t border-amber-100 text-[11px] text-stone-600 space-y-1">
                        <p>✓ ~{pkg.impressions} Devotee Impressions</p>
                        <p>✓ Zone-targeted display</p>
                        <p>✓ Call & WhatsApp integration</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#8B1E1E] text-white shadow"
                          : "bg-amber-100 text-stone-800 hover:bg-amber-200"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Choose Package"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAIN FORM & LIVE PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <form onSubmit={handleProceedToPayment} className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#FFFDF9] border-2 border-amber-300 shadow-xl space-y-5">
              <div className="border-b border-amber-200 pb-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B1E1E]">
                  <Tag className="w-3.5 h-3.5" />
                  <span>STEP 2: BUSINESS DETAILS & ZONE TARGETING</span>
                </div>
                <h3 className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E] mt-0.5">
                  Advertisement Details
                </h3>
              </div>

              {/* Business Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold mb-1 text-stone-800">Business / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Your Business Name"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/30"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-800">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    <option value="Subhash Nagar">Subhash Nagar & Mandapam Belt</option>
                    <option value="Khaleelwadi">Khaleelwadi Commercial Area</option>
                    <option value="Gandhi Chowk">Gandhi Chowk & Temple Street</option>
                    <option value="Vinayak Nagar">Vinayak Nagar & Bypass</option>
                    <option value="Dilsukhnagar">Dilsukhnagar & Kothapet</option>
                    <option value="Ameerpet">Ameerpet & SR Nagar</option>
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
                      placeholder="Your 10-digit contact number"
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

              {/* Website or Maps URL */}
              <div className="text-xs">
                <label className="block font-bold mb-1 text-stone-800">Website or Google Maps Location URL (Optional)</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://your-website.com or Google Maps URL"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                />
              </div>

              {/* Shop Physical Address */}
              <div className="text-xs">
                <label className="block font-bold mb-1 text-stone-800">Physical Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Your Store Landmark / Street Address, Area, City"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                />
              </div>

              {/* Ad Headline & Description */}
              <div className="text-xs space-y-3 pt-1 border-t border-amber-200">
                <div>
                  <label className="block font-bold mb-1 text-stone-800">Ad Headline / Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Your Offer Headline / Title (e.g. Festive Special Offer)"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-semibold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-800">Promotional Description / Offer Details</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Get 20% off on Navaratri special sweets. Pure ghee, fresh daily. Available till stock lasts..."
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="text-xs space-y-3 pt-2 border-t border-amber-200">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-stone-800">Ad Banner Image Upload *</label>
                  <span className="text-[11px] text-stone-500">JPG, PNG (Max 5MB)</span>
                </div>

                {/* Upload Button & Drag Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-amber-400 rounded-2xl p-4 bg-amber-50/50 hover:bg-amber-100/50 transition-colors text-center space-y-2"
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
                  <p className="font-bold text-stone-800">Click to upload shop banner photo</p>
                  <p className="text-[11px] text-stone-500">Supports direct mobile photos of your storefront or products</p>
                </div>

                {/* Festive Preset Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-stone-600">Or pick a ready festive background preset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {festivePresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handlePresetSelect(preset.url)}
                        className="px-2.5 py-1 rounded-full bg-white border border-amber-300 text-[10px] font-semibold text-stone-700 hover:bg-amber-100 transition-colors shadow-sm"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Ad Button — appears after image is selected */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdPreview(true)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-[#8B1E1E] text-[#8B1E1E] text-xs font-bold hover:bg-[#8B1E1E]/5 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  Preview My Ad
                </button>
              </div>

              <div className="pt-3 border-t border-amber-200">
                {/* Payment Due — Premium font + style */}
                <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#8B1E1E]/8 to-amber-50 border border-amber-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600 font-sans">Payment Due</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-['Cinzel',serif] font-black text-2xl text-[#8B1E1E]">₹{selectedPkg.priceInr}</span>
                      <span className="text-[10px] text-stone-500 font-medium">/ {selectedPkg.durationDays} day{selectedPkg.durationDays > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">Includes up to {selectedPkg.impressionLimit?.toLocaleString()} devotee impressions</p>
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] via-[#9A241C] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Pay ₹{selectedPkg.priceInr} via UPI →</span>
                </button>
              </div>
            </form>

            {/* Live Preview & Payment Step Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* LIVE AD PREVIEW CARD */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-serif flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#8B1E1E]" />
                    <span>Live Devotee Preview</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Target: {effectiveDisplayZone}
                  </span>
                </div>

                {/* The Exact Preview Card as it will look on Home Page */}
                <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EEDC] border-2 border-amber-400 shadow-xl overflow-hidden p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-[#8B1E1E] text-[10px] font-bold border border-amber-200">
                      <Tag className="w-3 h-3 text-[#8B1E1E]" />
                      <span>{category}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-stone-700 text-[10px] font-semibold border border-amber-200 shadow-sm">
                      <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{effectiveDisplayZone}</span>
                    </span>
                  </div>

                  {/* Image Preview */}
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-amber-50 border border-amber-300 shadow-inner">
                    <img
                      src={imagePreview}
                      alt="Ad Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#8B1E1E]/90 text-white text-[9px] font-bold flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3 h-3 text-amber-300" />
                      <span>Sponsored Store</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-['Cinzel',serif] font-bold text-base text-[#8B1E1E]">
                      {businessName || "Your Business Name"}
                    </h3>
                    <p className="font-semibold text-xs text-stone-900 mt-0.5">
                      {title || "Your Festive Offer Title"}
                    </p>
                    <p className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {description || "Your store details, festive discounts, and offerings will be shown to devotees here."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-amber-200 space-y-2">
                    <p className="text-[10px] text-stone-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                      <span>{address || `${effectiveDisplayZone}, ${city}`}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex-1 py-2 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Business</span>
                      </button>
                      <button
                        type="button"
                        className="p-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      {website && (
                        <button
                          type="button"
                          className="p-2 rounded-xl bg-white text-stone-800 border border-amber-300 text-xs font-bold flex items-center justify-center shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4 text-amber-800" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: UPI PAYMENT & CONFIRMATION */}
              {paymentStep && (
                <div className="p-6 rounded-3xl bg-white border-2 border-amber-400 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Header */}
                  <div className="border-b border-amber-200 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">STEP 3: PAY & CONFIRM</span>
                      <h4 className="font-['Cinzel',serif] font-black text-lg text-[#8B1E1E]">
                        Total Due: ₹{selectedPkg.priceInr}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#8B1E1E] font-bold text-xs border border-amber-200">
                      {selectedPkg.name}
                    </span>
                  </div>

                  {/* QR Code */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">UPI QR Code</p>
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

                    {/* UPI ID 2 */}
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-white border border-amber-300 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-stone-500">Alternate UPI</span>
                        <span className="font-mono text-sm font-bold text-stone-900">6303602743@upi</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi2}
                        className="ml-2 px-2.5 py-1.5 rounded-lg bg-[#8B1E1E] hover:bg-[#781B1B] text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow"
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
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-sm bg-[#FFFDF9] rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">Live Devotee View</p>
                <h3 className="font-['Cinzel',serif] font-black text-base">Your Ad Preview</h3>
              </div>
              <button
                onClick={() => setShowAdPreview(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Home Page Context */}
            <div className="p-4 bg-stone-100 border-b border-stone-200">
              <div className="flex items-center gap-2 text-[10px] text-stone-500 font-semibold uppercase tracking-wider mb-2">
                <Store className="w-3.5 h-3.5" />
                <span>As it appears on Navaratri Home Page</span>
              </div>

              {/* Exact Ad Card replica */}
              <div className="rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EEDC] border-2 border-amber-400 shadow-xl overflow-hidden">
                {/* Banner Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Ad Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#8B1E1E]/90 text-white text-[9px] font-bold flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                    <span>Sponsored</span>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[9px] font-bold shadow">
                    {category}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-['Cinzel',serif] font-bold text-sm text-[#8B1E1E] leading-tight">
                        {businessName || "Your Business Name"}
                      </h4>
                      <p className="font-semibold text-xs text-stone-900 mt-0.5">
                        {title || "Your Festive Offer Headline"}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                    {description || "Your promotional details and festive offers will appear here for all devotees browsing this Mandapam zone."}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500">
                    <MapPin className="w-3 h-3 text-amber-700 shrink-0" />
                    <span className="truncate">{effectiveDisplayZone}, {city}</span>
                  </div>
                  {/* CTA Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 py-2 rounded-xl bg-[#8B1E1E] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow">
                      <Phone className="w-3 h-3" />
                      <span>Call Business</span>
                    </button>
                    <button className="p-2 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    {website && (
                      <button className="p-2 rounded-xl bg-white border border-amber-300 text-stone-800 flex items-center justify-center shadow-sm">
                        <ExternalLink className="w-4 h-4 text-amber-800" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Go-Live Timer */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-stone-800">Estimated Go-Live Time</p>
                  <p className="font-['Cinzel',serif] font-black text-[#8B1E1E] text-base">
                    {goLiveLabel} · {goLiveDate}
                  </p>
                  <p className="text-[10px] text-stone-500">~2 hrs after payment confirmation by our team</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAdPreview(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#781B1B] transition-colors"
                >
                  Looks Good — Continue
                </button>
                <button
                  onClick={() => setShowAdPreview(false)}
                  className="px-3 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold hover:bg-stone-200 transition-colors"
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
