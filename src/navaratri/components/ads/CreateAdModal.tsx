import React, { useState, useRef, useEffect } from "react";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import {
  Store,
  Upload,
  X,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Eye,
  Smartphone,
  Monitor,
  QrCode
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  inspectImageAspectRatio,
  convertImageToLandscapeCanvas,
  generateVisitingCardCanvas,
  generateTextBulletinCanvas
} from "../../utils/adCreativeHelper";

type AdFormat = "BANNER" | "BUSINESS_CARD" | "TEXT_BULLETIN";
type FitMode = "festive-wings" | "crop-center" | "raw";

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultFrame?: "TOP" | "BOTTOM" | "BOTH";
}

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultFrame = "TOP"
}) => {
  const { createAdvertisement } = useNavaratriData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [preferredFrame, setPreferredFrame] = useState<"TOP" | "BOTTOM" | "BOTH">(defaultFrame);
  const [businessName, setBusinessName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Order Now");
  const [targetZone, setTargetZone] = useState("All Zones");
  const [selectedDays, setSelectedDays] = useState<1 | 3 | 9>(1);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"banner" | "card">("banner");
  const [transactionId, setTransactionId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isCopied2, setIsCopied2] = useState(false);
  const [showBigQr, setShowBigQr] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultFrame) {
      setPreferredFrame(defaultFrame);
    }
  }, [defaultFrame, isOpen]);

  // Multi-format support
  const [adFormat, setAdFormat] = useState<AdFormat>("BANNER");
  const [originalUpload, setOriginalUpload] = useState("");
  const [isPortraitUpload, setIsPortraitUpload] = useState(false);
  const [fitMode, setFitMode] = useState<FitMode>("festive-wings");
  const [contactPerson, setContactPerson] = useState("");
  const [tagline, setTagline] = useState("");
  const [address, setAddress] = useState("");
  const [cardTheme, setCardTheme] = useState<"terracotta" | "maroon" | "gold" | "royal">("maroon");
  const [discountTag, setDiscountTag] = useState("");
  const [bullets, setBullets] = useState<string[]>(["", "", ""]);

  const price = selectedDays === 1 ? 49 : selectedDays === 3 ? 129 : 349;
  const zoneLabel = targetZone === "All Zones" ? "Nizamabad" : targetZone;

  // Auto-generate creative for no-photo formats
  useEffect(() => {
    if (!isOpen) return;
    if (adFormat === "BUSINESS_CARD") {
      const card = generateVisitingCardCanvas({
        businessName: businessName.trim() || "Your Business Name",
        contactPerson: contactPerson.trim() || undefined,
        tagline: tagline.trim() || "Quality Products & Festive Specials",
        category: "Festive Store",
        phone: phone.trim() || "9XXXXXXXXX",
        whatsapp: phone.trim() || undefined,
        address: address.trim() || zoneLabel,
        city: "Nizamabad",
        targetZone: zoneLabel,
        theme: cardTheme
      });
      if (card) setUploadedImage(card);
    } else if (adFormat === "TEXT_BULLETIN") {
      const bulletin = generateTextBulletinCanvas({
        businessName: businessName.trim() || "Your Business / Store",
        headline: title.trim() || "Festival Special Offers",
        discountTag: discountTag.trim() || "SPECIAL FESTIVE OFFER",
        bulletPoints: bullets.map(b => b.trim()).filter(Boolean),
        phone: phone.trim() || "9XXXXXXXXX",
        city: "Nizamabad",
        ctaText: buttonLabel || "Order Now"
      });
      if (bulletin) setUploadedImage(bulletin);
    }
  }, [isOpen, adFormat, businessName, contactPerson, tagline, phone, address, zoneLabel, cardTheme, title, discountTag, bullets, buttonLabel]);

  const switchFormat = (f: AdFormat) => {
    setAdFormat(f);
    if (f === "BANNER") {
      setUploadedImage("");
      setOriginalUpload("");
      setIsPortraitUpload(false);
    }
  };

  const applyFit = async (mode: FitMode, src = originalUpload) => {
    if (!src) return;
    setFitMode(mode);
    if (mode === "raw") {
      setUploadedImage(src);
      return;
    }
    try {
      const converted = await convertImageToLandscapeCanvas(src, mode);
      setUploadedImage(converted || src);
    } catch {
      setUploadedImage(src);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result !== "string") return;
        const raw = reader.result;
        setOriginalUpload(raw);
        try {
          const dims = await inspectImageAspectRatio(raw);
          // Website banners are widescreen (~16:9). Anything narrower than ~4:3 needs fitting.
          const needsFit = dims.ratio < 1.3;
          setIsPortraitUpload(needsFit);
          if (needsFit) {
            await applyFit("festive-wings", raw);
            toast.info("Portrait/square photo detected — auto-fitted to landscape so nothing gets cut. You can change the fit below.");
          } else {
            setFitMode("raw");
            setUploadedImage(raw);
            toast.success("Perfect landscape image! Check the live preview below.");
          }
        } catch {
          setIsPortraitUpload(false);
          setUploadedImage(raw);
        }
      };
      reader.readAsDataURL(file);
    }
  };



  const handleCopyUpi2 = () => {
    navigator.clipboard.writeText("6303602743@upi");
    setIsCopied2(true);
    toast.success("UPI ID copied: 6303602743@upi");
    setTimeout(() => setIsCopied2(false), 2500);
  };

  const handleSubmitAd = () => {
    if (!businessName.trim()) {
      toast.error("Please enter your business or shop name");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter an ad headline");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!uploadedImage) {
      toast.error(
        adFormat === "BANNER"
          ? "Please upload a banner image — or choose Visiting Card / Text Offer if you don't have a photo"
          : "Preparing your ad creative, please try again"
      );
      return;
    }
    if (!transactionId.trim() || transactionId.trim().length < 6) {
      toast.error("Please enter the UPI / UTR 12-digit transaction reference number to confirm payment");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      createAdvertisement({
        businessName: businessName.trim(),
        title: title.trim(),
        description: description.trim() || `Special Navaratri festival offers from ${businessName.trim()}`,
        imageUrl: uploadedImage,
        category: "Festive Store",
        targetZone: targetZone,
        phone: phone.trim(),
        whatsapp: phone.trim(),
        pricePaid: price,
        paymentStatus: "PENDING_VERIFICATION",
        transactionId: transactionId.trim(),
        status: "PENDING",
        spaceType: "EXCLUSIVE",
        preferredFrame: preferredFrame,
        ctaText: buttonLabel.trim() || "Order Now",
        ctaUrl: actionUrl.trim() || `tel:${phone.trim()}`,
        startDate: "2026-10-11",
        endDate: "2026-10-21",
        format: adFormat,
        contactPerson: contactPerson.trim() || undefined,
        tagline: tagline.trim() || undefined,
        bulletPoints: adFormat === "TEXT_BULLETIN" ? bullets.map(b => b.trim()).filter(Boolean) : undefined,
        cardTheme: adFormat === "BUSINESS_CARD" ? cardTheme : undefined,
        address: address.trim() || undefined
      });

      setIsSubmitting(false);
      onClose();
      onSuccess?.();
      toast.success("Payment submitted for verification! Our team will verify and activate your ad shortly.");

      // Reset form
      setBusinessName("");
      setTitle("");
      setDescription("");
      setPhone("");
      setActionUrl("");
      setUploadedImage("");
      setOriginalUpload("");
      setIsPortraitUpload(false);
      setTransactionId("");
      setContactPerson("");
      setTagline("");
      setAddress("");
      setDiscountTag("");
      setBullets(["", "", ""]);
      setAdFormat("BANNER");
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl my-6 rounded-3xl bg-[#FFFDF9] border-2 border-amber-400 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 border-b border-amber-200 pb-3 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] text-[10px] font-bold">
                <Store className="w-3 h-3" />
                <span>Instant Self-Service Ad Creator</span>
              </div>
              <h3 className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E]">
                Run Your Navaratri Advertisement
              </h3>
              <p className="text-xs text-stone-600">
                Upload your ad image, check the live website preview, and launch live to 50,000+ devotees.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Duration Package Selector */}
              <div>
                <label className="block font-bold mb-1 text-stone-800">Select Campaign Duration *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 1 as const, label: "1 Day Booster", cost: 49 },
                    { days: 3 as const, label: "3 Days Rush", cost: 129 },
                    { days: 9 as const, label: "9 Days Pass", cost: 349 }
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setSelectedDays(p.days)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDays === p.days
                          ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-md font-bold"
                          : "bg-white text-stone-800 border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      <p className="text-[11px] leading-tight">{p.label}</p>
                      <p className="text-sm font-black mt-0.5">₹{p.cost}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choose Placement Frame (Top Below Header vs Bottom Above Footer vs Both) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-stone-800 text-xs">
                    Ad Placement Frame *
                  </label>
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                    Mobile &amp; Desktop
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredFrame("TOP")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      preferredFrame === "TOP"
                        ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm font-bold"
                        : "bg-white text-stone-700 border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    <p className="text-[11px] leading-tight font-bold">Top Frame</p>
                    <p className="text-[9px] opacity-90 mt-0.5">Below Header</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredFrame("BOTTOM")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      preferredFrame === "BOTTOM"
                        ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-sm font-bold"
                        : "bg-white text-stone-700 border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    <p className="text-[11px] leading-tight font-bold">Bottom Frame</p>
                    <p className="text-[9px] opacity-90 mt-0.5">Above Footer</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredFrame("BOTH")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      preferredFrame === "BOTH"
                        ? "bg-gradient-to-r from-[#8B1E1E] to-[#B45309] text-white border-[#8B1E1E] shadow-sm font-bold"
                        : "bg-white text-stone-700 border-amber-200 hover:bg-amber-50"
                    }`}
                  >
                    <p className="text-[11px] leading-tight font-bold">Both Frames</p>
                    <p className="text-[9px] opacity-90 mt-0.5">Top &amp; Bottom</p>
                  </button>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block font-bold mb-1 text-stone-800">Business / Shop Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Your Business / Brand Name"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/30 text-stone-900 font-medium"
                />
              </div>

              {/* Headline & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-stone-800">Ad Headline / Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Special Navaratri Festival Offers"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-800">Target Region / Zone *</label>
                  <select
                    value={targetZone}
                    onChange={(e) => setTargetZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-medium text-stone-900"
                  >
                    <option value="All Zones">All Zones (Entire City & State)</option>
                    <option value="Subhash Nagar">Subhash Nagar & Mandapam Belt</option>
                    <option value="Khaleelwadi">Khaleelwadi Commercial Area</option>
                    <option value="Gandhi Chowk">Gandhi Chowk & Temple Street</option>
                    <option value="Vinayak Nagar">Vinayak Nagar & Bypass</option>
                    <option value="Hyderabad Central">Hyderabad Central</option>
                  </select>
                </div>
              </div>

              {/* Offer description */}
              <div>
                <label className="block font-bold mb-1 text-stone-800">Offer Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Get 20% discount on all festival pooja sweets and pure ghee prasadam orders..."
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900"
                />
              </div>

              {/* Action Button Label & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-stone-800">Button Label (CTA) *</label>
                    <span className="text-[10px] text-stone-500 font-semibold">e.g. Order Now, Open</span>
                  </div>
                  <input
                    type="text"
                    value={buttonLabel}
                    onChange={(e) => setButtonLabel(e.target.value)}
                    placeholder="Order Now, Open, More Details..."
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-semibold text-xs"
                  />
                  {/* Preset quick selection pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {["Order Now", "Open / More Details", "Shop Now", "Call Store", "WhatsApp Us"].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setButtonLabel(preset)}
                        className={`text-[9px] px-2 py-0.5 rounded-md font-semibold transition-all border ${
                          buttonLabel === preset
                            ? "bg-[#8B1E1E] text-white border-[#8B1E1E]"
                            : "bg-white text-stone-700 border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-800">
                    Contact Phone / WhatsApp (10 Digits) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="e.g. 9XXXXXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-mono"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] font-bold text-stone-400">
                      {phone.length}/10
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-800">Website or Action URL (Optional)</label>
                <input
                  type="url"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="e.g. https://your-business.com or Google Maps location"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900"
                />
              </div>

              {/* Ad Creative: choose format */}
              <div className="space-y-3 pt-2 border-t border-amber-200">
                <div>
                  <label className="block font-bold text-stone-800">How do you want your ad to look? *</label>
                  <p className="text-[10px] text-stone-500 mt-0.5">No photo? No problem — pick Visiting Card or Text Offer and we design it for you.</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "BANNER", icon: "🖼️", label: "Photo Banner", sub: "I have an image" },
                    { id: "BUSINESS_CARD", icon: "📇", label: "Visiting Card", sub: "No photo needed" },
                    { id: "TEXT_BULLETIN", icon: "📝", label: "Text Offer", sub: "Only text" }
                  ] as const).map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => switchFormat(opt.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        adFormat === opt.id
                          ? "bg-[#8B1E1E] text-white border-[#8B1E1E] shadow-md"
                          : "bg-white text-stone-800 border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      <div className="text-lg leading-none">{opt.icon}</div>
                      <p className="text-[11px] font-bold mt-1 leading-tight">{opt.label}</p>
                      <p className={`text-[9px] mt-0.5 ${adFormat === opt.id ? "text-amber-100" : "text-stone-500"}`}>{opt.sub}</p>
                    </button>
                  ))}
                </div>

                {adFormat === "BANNER" && (
                  <>
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-stone-700">
                      <span className="text-base leading-none">📐</span>
                      <span>
                        <b>Best size: landscape 16:9</b> (e.g. 1280×720). Most devotees view on mobile where ads show as a wide banner.
                        Uploading a <b>portrait/vertical</b> photo? We'll auto-fit it so nothing gets cut.
                      </span>
                    </div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/40 hover:bg-amber-100/50 transition-all text-center flex flex-col items-center justify-center gap-2 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-[#8B1E1E] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-[#8B1E1E]" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#8B1E1E]">{originalUpload ? "Change Photo" : "Choose Photo / Upload Ad Image"}</span>
                        <p className="text-[10px] text-stone-500 mt-0.5">JPG or PNG, max 5MB</p>
                      </div>
                    </div>
                    {isPortraitUpload && originalUpload && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-amber-800">Portrait photo detected — choose how it fits the wide banner:</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {([
                            { id: "festive-wings", label: "✨ Auto-Fit", sub: "Full photo" },
                            { id: "crop-center", label: "✂️ Crop 16:9", sub: "Fill banner" },
                            { id: "raw", label: "🖼️ Original", sub: "As uploaded" }
                          ] as const).map(m => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => applyFit(m.id)}
                              className={`p-1.5 rounded-lg border text-center ${
                                fitMode === m.id
                                  ? "bg-amber-500 text-white border-amber-500"
                                  : "bg-white text-stone-700 border-amber-200 hover:bg-amber-50"
                              }`}
                            >
                              <p className="text-[10px] font-bold">{m.label}</p>
                              <p className="text-[9px] opacity-80">{m.sub}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {adFormat === "BUSINESS_CARD" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Owner / Proprietor name (optional)"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900"
                    />
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Tagline e.g. Pure Ghee Sweets since 1985"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900"
                    />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Shop address / landmark"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 sm:col-span-2"
                    />
                    <div className="sm:col-span-2 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-stone-700">Card colour:</span>
                      {([
                        { id: "maroon", c: "#7A1F14" },
                        { id: "terracotta", c: "#B4532A" },
                        { id: "gold", c: "#C99A2E" },
                        { id: "royal", c: "#2B2A6B" }
                      ] as const).map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setCardTheme(t.id)}
                          title={t.id}
                          aria-label={`${t.id} theme`}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${cardTheme === t.id ? "border-stone-900 scale-110" : "border-white shadow"}`}
                          style={{ backgroundColor: t.c }}
                        />
                      ))}
                    </div>
                    <p className="sm:col-span-2 text-[10px] text-stone-500">Devotees get 1-tap <b>Call</b> &amp; <b>WhatsApp</b> buttons on your card.</p>
                  </div>
                )}

                {adFormat === "TEXT_BULLETIN" && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={discountTag}
                      onChange={(e) => setDiscountTag(e.target.value)}
                      placeholder="Offer badge e.g. FLAT 20% OFF"
                      maxLength={28}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-semibold"
                    />
                    {bullets.map((b, i) => (
                      <input
                        key={i}
                        type="text"
                        value={b}
                        maxLength={60}
                        onChange={(e) => setBullets(prev => prev.map((x, j) => (j === i ? e.target.value : x)))}
                        placeholder={["e.g. Fresh flowers & garlands daily", "e.g. Free home delivery in 2 km", "e.g. Open 6 AM – 11 PM"][i]}
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900"
                      />
                    ))}
                    <p className="text-[10px] text-stone-500">Your headline above becomes the main title of the offer.</p>
                  </div>
                )}
              </div>

              {/* LIVE WEBSITE PREVIEW & ROTATION TIMING */}
              {uploadedImage && (
                <div className="p-4 rounded-2xl bg-[#FAF7F0] border-2 border-amber-400/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#8B1E1E]" />
                      <span className="font-bold text-stone-900 text-xs">Live Website Ad Preview</span>
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-amber-300">
                      <button
                        type="button"
                        onClick={() => setPreviewMode("banner")}
                        className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                          previewMode === "banner"
                            ? "bg-[#8B1E1E] text-white shadow-xs"
                            : "text-stone-600 hover:bg-amber-50"
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Top Banner</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode("card")}
                        className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                          previewMode === "card"
                            ? "bg-[#8B1E1E] text-white shadow-xs"
                            : "text-stone-600 hover:bg-amber-50"
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>Hero Side Card</span>
                      </button>
                    </div>
                  </div>

                  {/* Render simulated website ad — framed & never cropped or out of frame */}
                  {previewMode === "banner" ? (
                    <div className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-[#1e130e] flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-md opacity-30 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url("${uploadedImage}")` }}
                      />
                      <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-bold text-amber-200 border border-white/20">
                        Sponsored Banner
                      </div>
                      <img
                        src={uploadedImage}
                        alt="Ad Preview"
                        className="w-full h-full object-contain relative z-10 mx-auto"
                      />
                      <div className="absolute bottom-2 right-2 z-20">
                        <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white text-[10px] font-bold shadow-md flex items-center gap-1 border border-amber-300/60">
                          {buttonLabel || "Order Now"} ↗
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full max-w-sm mx-auto h-48 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-[#1e130e] flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-md opacity-30 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url("${uploadedImage}")` }}
                      />
                      <div className="absolute top-2 left-2 z-20 px-2.5 py-0.5 rounded-full bg-black/70 text-[9px] font-bold text-amber-200 border border-amber-300/40 uppercase">
                        Sponsored Spotlight
                      </div>
                      <img
                        src={uploadedImage}
                        alt="Ad Preview"
                        className="w-full h-full object-contain relative z-10 mx-auto"
                      />
                      <div className="absolute bottom-2.5 inset-x-3 z-20">
                        <span className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#9A241C] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1 border border-amber-300/60">
                          {buttonLabel || "Order Now"} ↗
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timing & Rotation info note */}
                  <div className="flex items-start gap-2 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/80 text-[11px] text-amber-950">
                    <Clock className="w-4 h-4 text-[#8B1E1E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">⏱️ Multi-Ad Rotation: 7 Seconds Timing</span>
                      <p className="text-[10.5px] text-stone-700 leading-snug mt-0.5">
                        When multiple sponsors run ads, the portal smoothly auto-rotates banners every 7 seconds, guaranteeing equal prime live impressions to every advertiser.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Gateway */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Payment Due</span>
                    <h4 className="font-['Cinzel',serif] font-black text-xl text-[#8B1E1E]">
                      Total: ₹{price}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#8B1E1E] border border-amber-200 font-bold text-[10px]">
                    ⏳ Verification on UTR Match
                  </span>
                </div>

                {/* Big QR with Button */}
                <div className="p-3.5 rounded-2xl bg-white border border-amber-200 text-center space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-xs font-bold text-stone-900">UPI QR</p>
                      <p className="text-[11px] text-stone-500">Scan via GPay / PhonePe / Paytm</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowBigQr(!showBigQr)}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-[#8B1E1E] text-[11px] font-bold flex items-center gap-1 transition-colors border border-amber-300 cursor-pointer shadow-xs"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{showBigQr ? "Standard QR" : "Show Big QR"}</span>
                    </button>
                  </div>

                  <div className={`mx-auto rounded-2xl bg-white p-2.5 border-2 border-amber-400 shadow-md flex items-center justify-center transition-all duration-200 ${showBigQr ? "w-60 h-60 sm:w-64 sm:h-64" : "w-44 h-44"}`}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=${showBigQr ? "260x260" : "180x180"}&data=${encodeURIComponent(
                        `upi://pay?pa=6303602743@upi&pn=NavaratriMandapamAds&am=${price}&cu=INR`
                      )}`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-[11px] font-bold text-[#8B1E1E]">
                    Scan QR or Pay directly to UPI IDs below:
                  </p>
                </div>

                {/* UPI IDs with Copy Buttons */}
                <div className="space-y-2">

                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-amber-200">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-semibold text-stone-400 uppercase">Alternate UPI</span>
                      <span className="font-mono text-xs font-bold text-stone-900">6303602743@upi</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi2}
                      className="px-2.5 py-1 rounded-lg bg-[#8B1E1E] hover:bg-[#781B1B] text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {isCopied2 ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied2 ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* UTR Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-800">
                    UTR / UPI Reference Number (12 Digits) *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 427812984501 (from your payment receipt)"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-stone-500">
                    Ad activates automatically once admin verifies the UTR in our bank feed.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isSubmitting || !transactionId.trim() || transactionId.trim().length < 6}
                onClick={handleSubmitAd}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B1E1E] to-[#B45309] hover:from-[#781B1B] hover:to-[#92400E] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>{isSubmitting ? "Submitting for Verification..." : `Confirm Payment & Submit Ad (₹${price})`}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
