import React, { useState, useRef } from "react";
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
  Sparkles,
  Smartphone,
  Monitor,
  QrCode
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { createAdvertisement } = useNavaratriData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
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

  const price = selectedDays === 1 ? 49 : selectedDays === 3 ? 129 : 349;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedImage(reader.result);
          toast.success("Image selected! Check the live website preview below.");
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
      toast.error("Please upload a banner image for your advertisement");
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
        ctaText: buttonLabel.trim() || "Order Now",
        ctaUrl: actionUrl.trim() || `tel:${phone.trim()}`,
        startDate: "2026-10-11",
        endDate: "2026-10-21"
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
      setTransactionId("");
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
                  <label className="block font-bold mb-1 text-stone-800">Button Label *</label>
                  <input
                    type="text"
                    value={buttonLabel}
                    onChange={(e) => setButtonLabel(e.target.value)}
                    placeholder="Order Now, Call Shop, Visit Store..."
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-semibold"
                  />
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

              {/* Banner Image Upload */}
              <div className="space-y-2 pt-2 border-t border-amber-200">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-stone-800">Upload Banner Image *</label>
                  <span className="text-[10px] text-stone-500 font-medium">Max 5MB (JPG, PNG)</span>
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
                    <span className="text-xs font-bold text-[#8B1E1E]">Choose Photo / Upload Ad Image</span>
                    <p className="text-[10px] text-stone-500 mt-0.5">Click to browse JPG or PNG image from your device</p>
                  </div>
                </div>
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

                  {/* Render simulated website ad */}
                  {previewMode === "banner" ? (
                    <div className="w-full h-24 sm:h-28 rounded-2xl overflow-hidden border border-amber-400 shadow-md bg-stone-900 relative">
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 text-[9px] font-bold text-amber-200 border border-white/20">
                        Sponsored Banner Preview
                      </div>
                      <img
                        src={uploadedImage}
                        alt="Ad Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-sm mx-auto h-44 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md bg-stone-900 relative">
                      <div className="absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded-full bg-black/70 text-[9px] font-bold text-amber-200 border border-amber-300/40 uppercase">
                        Sponsored Hero Spotlight
                      </div>
                      <img
                        src={uploadedImage}
                        alt="Ad Preview"
                        className="w-full h-full object-cover"
                      />
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
