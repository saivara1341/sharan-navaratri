import React, { useState } from "react";
import { Service, ServiceSlot, Booking, Mandapam } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import {
  getTranslatedMandapamName,
  getTranslatedService,
  getTranslatedSlotUI
} from "../../utils/navaratriTranslations";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { X, CheckCircle2, Clock, Users, Calendar, Printer } from "lucide-react";
import { toast } from "sonner";

interface ServiceBookingModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  mandapam,
  isOpen,
  onClose,
  preselectedServiceId
}) => {
  const { services, slots, createBooking } = useNavaratriData();
  const { language, t } = useNavaratriLanguage();

  const mandapamServices = services.filter(s => s.mandapamId === mandapam.id && s.enabled && s.bookingEnabled);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (mandapamServices[0]?.id || "")
  );

  const availableSlots = slots.filter(
    s => s.mandapamId === mandapam.id && (!selectedServiceId || s.serviceId === selectedServiceId)
  );

  const [selectedSlotId, setSelectedSlotId] = useState<string>(availableSlots[0]?.id || "");
  const [name, setName] = useState("");
  const [gotram, setGotram] = useState("");
  const [mobile, setMobile] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "confirmed">("form");
  const [otp, setOtp] = useState("1088");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  React.useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
      const matchingSlot = slots.find(s => s.serviceId === preselectedServiceId && s.mandapamId === mandapam.id);
      if (matchingSlot) {
        setSelectedSlotId(matchingSlot.id);
      }
    }
  }, [preselectedServiceId, slots, mandapam.id]);

  if (!isOpen) return null;

  const currentSlot = slots.find(s => s.id === selectedSlotId);
  const currentService = services.find(s => s.id === selectedServiceId);
  const isCoupleService = currentService?.targetAudience === "COUPLES" || currentService?.name?.toLowerCase().includes("sahasranama") || currentService?.name?.toLowerCase().includes("homa");
  const isFemaleService = currentService?.targetAudience === "FEMALES_ONLY" || currentService?.name?.toLowerCase().includes("kumkum");

  const remainingCapacity = currentSlot
    ? Math.max(0, currentSlot.capacity - (currentSlot.bookedCount + currentSlot.walkinCount))
    : (currentService?.capacityPerSlot || 150);
  const isSlotFull = currentSlot ? (currentSlot.bookedCount + currentSlot.walkinCount) >= currentSlot.capacity : false;

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!name.trim() || !cleanMobile) {
      toast.error("Please enter Name and Mobile number.");
      return;
    }
    if (cleanMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }
    if (isSlotFull || remainingCapacity === 0) {
      toast.error("This slot has reached full capacity. No more bookings allowed.");
      return;
    }
    if (quantity > remainingCapacity) {
      toast.error(`Only ${remainingCapacity} slot(s) available. Please adjust devotee count.`);
      return;
    }

    setStep("otp");
    toast.info("Verification code sent to " + mobile + " (Use: 1088)");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== "1088" && enteredOtp.length !== 4) {
      toast.error("Please enter the 4-digit code (Hint: 1088)");
      return;
    }

    const devoteeType = isCoupleService ? "COUPLES" : isFemaleService ? "FEMALE" : "INDIVIDUAL";

    const res = createBooking({
      slotId: selectedSlotId || (availableSlots[0]?.id || `slot-${selectedServiceId || "default"}`),
      serviceId: selectedServiceId,
      mandapamId: mandapam.id,
      name,
      gotram: gotram.trim() || undefined,
      devoteeType,
      mobile,
      quantity,
      notes
    });

    if (res.success && res.booking) {
      setConfirmedBooking(res.booking);
      setStep("confirmed");
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Celebration animation is optional; the confirmed booking remains valid.
      }
      toast.success(t.bookingSuccess);
    } else {
      toast.error(res.error || "Booking failed. Slot may be full.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-lg rounded-3xl p-6 shadow-2xl border-2 border-[#D97706] relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: SERVICE & SLOT FORM */}
        {step === "form" && (
          <form onSubmit={handleProceedToOtp} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] text-xs font-bold mb-1">
                <span>🪔</span> {getTranslatedMandapamName(mandapam.name, language)}
              </div>
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                {t.bookService}
              </h3>
              <p className="text-xs text-stone-600">
                {language === "kn"
                  ? "ನಿಮ್ಮ ಭಕ್ತಿಪೂರ್ವಕ ಪೂಜಾ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ. ಉಚಿತ ಸಮುದಾಯ ಬುಕ್ಕಿಂಗ್ (ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲ)."
                  : language === "te"
                  ? "మీ భక్తిపూర్వక పూజా స్లాట్ నమోదు చేసుకోండి. ఉచిత కమ్యూనిటీ బుకింగ్ (ఎటువంటి రుసుము లేదు)."
                  : language === "hi"
                  ? "अपना भक्तिमय पूजा स्लॉट आरक्षित करें। निःशुल्क सामुदायिक बुकिंग (कोई शुल्क नहीं)।"
                  : language === "ta"
                  ? "உங்கள் பக்திப் பூஜா ஸ்லாட்டை முன்பதிவு செய்யுங்கள். இலவச சமுதாய முன்பதிவு."
                  : language === "ml"
                  ? "നിങ്ങളുടെ ഭക്തിപൂർവ്വമായ പൂജാ സ്ലോട്ട് ബുക്ക് ചെയ്യുക. സൗജന്യ കമ്മ്യൂണിറ്റി ബുക്കിംഗ്."
                  : "Reserve your devotional pooja slot. Free community booking (No payment required)."}
              </p>
            </div>

            {/* Select Service */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                {language === "kn" ? "ಪೂಜೆ / ಸೇವೆ ಆಯ್ಕೆಮಾಡಿ" : language === "te" ? "పూజ / సేవ ఎంచుకోండి" : language === "hi" ? "पूजा / सेवा चुनें" : "Select Pooja / Seva"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mandapamServices.map((srv) => {
                  const transSrv = getTranslatedService(srv, language);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        const matching = slots.find(s => s.serviceId === srv.id && s.mandapamId === mandapam.id);
                        if (matching) setSelectedSlotId(matching.id);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all text-xs ${
                        selectedServiceId === srv.id
                          ? "bg-amber-100 border-[#8B1E1E] font-bold text-[#8B1E1E] ring-1 ring-[#8B1E1E]"
                          : "bg-white border-amber-200/80 text-stone-700 hover:bg-amber-50"
                      }`}
                    >
                      <p className="truncate">{transSrv.name}</p>
                      <p className="text-[10px] text-stone-500 font-normal">{transSrv.type} • {srv.durationMinutes} {t.minsLabel}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Slot */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                {language === "kn" ? "ಲಭ್ಯವಿರುವ ಸಮಯ ಸ್ಲಾಟ್‌ಗಳು" : language === "te" ? "అందుబాటులో ఉన్న సమయ స్లాట్లు" : language === "hi" ? "उपलब्ध समय स्लॉट" : "Available Time Slots"}
              </label>
              <div className="space-y-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => {
                    const free = Math.max(0, slot.capacity - (slot.bookedCount + slot.walkinCount));
                    const isFull = free === 0;
                    const slotUI = getTranslatedSlotUI(language, free, slot.bookedCount + slot.walkinCount, slot.capacity);

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isFull}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between text-xs transition-all ${
                          isFull
                            ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                            : selectedSlotId === slot.id
                            ? "bg-emerald-50 border-emerald-600 font-bold text-emerald-950 ring-1 ring-emerald-600"
                            : "bg-white border-amber-200 text-stone-800 hover:bg-amber-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#8B1E1E]" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                          <span className="text-[11px] text-stone-500">({slot.date})</span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isFull ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {isFull ? t.slotFull : slotUI.leftText}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-500 italic p-3 bg-amber-50 rounded-xl">
                    {language === "kn" ? "ಈ ಸೇವೆಗೆ ಯಾವುದೇ ಸಕ್ರಿಯ ಸ್ಲಾಟ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ." : language === "te" ? "ఈ సేవకు క్రియాశీల స్లాట్లు అందుబాటులో లేవు." : "No active slots available for this service."}
                  </p>
                )}
              </div>
            </div>

            {/* Devotee Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isCoupleService
                    ? (language === "te" ? "దంపతుల పేర్లు (Couple Names) *" : "Couple Names (భార్యాభర్తల పేర్లు) *")
                    : isFemaleService
                    ? (language === "te" ? "మహిళ / సువాసిని పేరు (Female Devotee Name) *" : "Female / Suhasini Devotee Name *")
                    : (language === "te" ? "భక్తుని పేరు (Devotee Name) *" : "Devotee Name *")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    isCoupleService
                      ? "e.g. Your Names (Couple)"
                      : "e.g. Your Name"
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {isCoupleService && (
                  <p className="text-[10px] text-amber-800 font-medium mt-1">
                    * Pooja plate & sankalpam will be conducted for the couple together.
                  </p>
                )}
                {isFemaleService && (
                  <p className="text-[10px] text-amber-800 font-medium mt-1">
                    * Special Sri Lalitha Kumkumarchana reserved for women & suhasinis.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number (10 Digits Only) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="e.g. Your Number"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === "te" ? "గోత్రం (Gotram - ఐచ్ఛికం)" : "Gotram (గోత్రం - Optional)"}
                </label>
                <input
                  type="text"
                  value={gotram}
                  onChange={(e) => setGotram(e.target.value)}
                  placeholder="e.g. Kashyapa / Bharadwaja / Shiva"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Number of Devotees {remainingCapacity > 0 && <span className="text-stone-400 font-normal">(Max: {Math.min(6, remainingCapacity)})</span>}
                </label>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, Math.min(6, remainingCapacity))}
                  disabled={remainingCapacity <= 0}
                  value={quantity}
                  onChange={(e) => {
                    const maxAllowed = Math.max(1, Math.min(6, remainingCapacity));
                    setQuantity(Math.min(maxAllowed, Math.max(1, parseInt(e.target.value) || 1)));
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-stone-100 disabled:text-stone-400"
                />
              </div>
            </div>

            {remainingCapacity <= 0 && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-bold flex items-center gap-2">
                <span className="text-base">🔒</span>
                <div>
                  <p className="font-black">FILLED SLOTS / HOUSEFULL</p>
                  <p className="text-[11px] font-normal text-red-800">
                    All token quotas for this slot have been booked. Please choose another seva or check back later.
                  </p>
                </div>
              </div>
            )}

            {currentService?.itemsRequired && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                <strong>{t.itemsToBringLabel}</strong> {currentService.itemsRequired}
              </div>
            )}

            <button
              type="submit"
              disabled={remainingCapacity <= 0}
              className="w-full py-3 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {remainingCapacity <= 0
                ? (language === "kn" ? "🔒 ಸ್ಲಾಟ್‌ಗಳು ಭರ್ತಿಯಾಗಿವೆ" : language === "te" ? "🔒 స్లాట్‌లు నిండినవి" : language === "hi" ? "🔒 स्लॉट पूर्ण" : "🔒 Slots Filled - Housefull")
                : (language === "kn" ? "ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ & ಪಾಸ್ ಪಡೆಯಿರಿ →" : language === "te" ? "బుకింగ్ నిర్ధారించండి & పాస్ పొందండి →" : language === "hi" ? "बुकिंग पुष्टि करें व पास प्राप्त करें →" : "Confirm Booking & Generate Pass →")}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-[#8B1E1E] flex items-center justify-center text-2xl font-bold">
              📱
            </div>
            <div>
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                {language === "kn" ? "ದೃಢೀಕರಣ ಕೋಡ್ ನಮೂದಿಸಿ" : language === "te" ? "ధృవీకరణ కోడ్ నమోదు చేయండి" : language === "hi" ? "सत्यापन कोड दर्ज करें" : "Enter Verification Code"}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                {language === "kn"
                  ? `${mobile} ಸಂಖ್ಯೆಗೆ 4-ಅಂಕಿಯ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ.`
                  : language === "te"
                  ? `${mobile} నంబరుకు 4-అంకెల కోడ్ పంపబడింది.`
                  : `4-digit verification code sent to ${mobile}.`}
              </p>
              <p className="text-[11px] font-semibold text-amber-800 bg-amber-100 inline-block px-2.5 py-0.5 rounded-full mt-1.5">
                Demo OTP: 1088
              </p>
            </div>

            <div className="flex justify-center py-2">
              <input
                type="text"
                maxLength={4}
                autoFocus
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="1088"
                className="w-36 tracking-widest text-center text-xl font-bold px-4 py-2.5 rounded-xl border-2 border-amber-400 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                {language === "kn" ? "ಹಿಂದೆ" : language === "te" ? "వెనుకకు" : "Back"}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow hover:bg-[#9A241C]"
              >
                {language === "kn" ? "ಪರಿಶೀಲಿಸಿ & ಖಚಿತಪಡಿಸಿ" : language === "te" ? "ధృవీకరించి ఖరారు చేయండి" : "Verify & Confirm"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: BOOKING CONFIRMED & DIGITAL PASS */}
        {step === "confirmed" && confirmedBooking && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {language === "kn" ? "ಪೂಜಾ ಪಾಸ್ ದೃಢಪಟ್ಟಿದೆ" : language === "te" ? "భక్తిపూర్వక పూజా పాస్ ఖరారైనది" : language === "hi" ? "भक्ति पूजा पास स्वीकृत" : "Devotional Pooja Pass Confirmed"}
              </span>
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                {confirmedBooking.serviceName}
              </h3>
              <p className="text-xs text-stone-600">
                {getTranslatedMandapamName(mandapam.name, language)} • {mandapam.area}, {mandapam.city}
              </p>
            </div>

            {/* Auspicious Digital Pass Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FEF3C7] border-2 border-[#D97706] shadow-md text-left space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                    {language === "kn" ? "ಪಾಸ್ ಐಡಿ" : language === "te" ? "పాస్ ఐడీ" : "Pass ID"}
                  </span>
                  <p className="text-base font-black text-[#8B1E1E] font-mono">
                    {confirmedBooking.bookingCode}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">
                    {language === "kn" ? "ಸ್ಥಿತಿ" : language === "te" ? "స్థితి" : "Status"}
                  </span>
                  <p className="text-xs font-bold text-emerald-700">{t.confirmed}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500 text-[10px]">
                    {confirmedBooking.devoteeType === "COUPLES"
                      ? (language === "te" ? "దంపతులు:" : "Couples:")
                      : confirmedBooking.devoteeType === "FEMALE"
                      ? (language === "te" ? "మహిళా భక్తురాలు:" : "Female Devotee:")
                      : (language === "te" ? "భక్తుడు:" : "Devotee:")}
                  </span>
                  <p className="font-bold text-stone-800">{confirmedBooking.name}</p>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">
                    {language === "te" ? "గోత్రం:" : "Gotram:"}
                  </span>
                  <p className="font-semibold text-stone-800">{confirmedBooking.gotram || "Shiva Gotram (Default)"}</p>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">
                    {language === "kn" ? "ದಿನಾಂಕ & ಸಮಯ:" : language === "te" ? "తేదీ & సమయం:" : "Date & Time:"}
                  </span>
                  <p className="font-bold text-stone-800">{confirmedBooking.slotTime}</p>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">
                    {language === "te" ? "సంకల్ప పళ్ళెం / టోకెన్ #:" : "Plate / Token #:"}
                  </span>
                  <p className="font-black text-[#8B1E1E]">#{confirmedBooking.tokenNumber || 1}</p>
                </div>
              </div>

              {confirmedBooking.notes && (
                <div className="text-[11px] bg-white/70 p-2 rounded-lg border border-amber-200 text-stone-700">
                  <strong>Notes:</strong> {confirmedBooking.notes}
                </div>
              )}

              {/* QR Verification at Mandapam Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                <div className="text-[10px] text-stone-600 max-w-[200px] space-y-0.5">
                  <p className="font-bold text-amber-900">
                    {language === "te" ? "మండపం వద్ద స్కానింగ్ కొరకు:" : "Scan at Mandapam Counter:"}
                  </p>
                  <p>
                    {language === "te"
                      ? "నిర్వాహకులు ఈ QR కోడ్‌ను స్కాన్ చేసి పూజా ప్రవేశం మరియు సంకల్ప పళ్ళెం కేటాయిస్తారు."
                      : "The organizer will scan this QR code to verify your pass and allocate your pooja plate."}
                  </p>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-xs border-2 border-amber-300">
                  <QRCodeSVG
                    value={JSON.stringify({
                      passId: confirmedBooking.bookingCode,
                      mandapamId: mandapam.id,
                      name: confirmedBooking.name,
                      service: confirmedBooking.serviceName,
                      token: confirmedBooking.tokenNumber,
                      gotram: confirmedBooking.gotram
                    })}
                    size={76}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                {language === "kn" ? "ಪಾಸ್ ಮುದ್ರಿಸಿ / ಉಳಿಸಿ" : language === "te" ? "పాస్ ప్రింట్ / సేవ్ చేయండి" : "Print / Save Pass"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C]"
              >
                {t.doneBackBtn || "Done"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
