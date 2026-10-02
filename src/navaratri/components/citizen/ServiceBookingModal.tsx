import React, { useState } from "react";
import { Service, ServiceSlot, Booking, Mandapam } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import { X, CheckCircle2, Clock, Users, Calendar, Printer, Download } from "lucide-react";
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
  const { t } = useNavaratriLanguage();

  const mandapamServices = services.filter(s => s.mandapamId === mandapam.id && s.enabled && s.bookingEnabled);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (mandapamServices[0]?.id || "")
  );

  const availableSlots = slots.filter(
    s => s.mandapamId === mandapam.id && (!selectedServiceId || s.serviceId === selectedServiceId)
  );

  const [selectedSlotId, setSelectedSlotId] = useState<string>(availableSlots[0]?.id || "");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "confirmed">("form");
  const [otp, setOtp] = useState("1088");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const currentSlot = slots.find(s => s.id === selectedSlotId);
  const currentService = services.find(s => s.id === selectedServiceId);
  const remainingCapacity = currentSlot
    ? Math.max(0, currentSlot.capacity - (currentSlot.bookedCount + currentSlot.walkinCount))
    : 0;

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!name.trim() || !cleanMobile) {
      toast.error("Please enter your Name and Mobile number.");
      return;
    }
    if (cleanMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }
    if (!selectedSlotId) {
      toast.error("Please select a pooja time slot.");
      return;
    }
    if (quantity > remainingCapacity) {
      toast.error("Requested number of participants exceeds available slot capacity.");
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

    const res = createBooking({
      slotId: selectedSlotId,
      serviceId: selectedServiceId,
      mandapamId: mandapam.id,
      name,
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
                <span>🪔</span> {mandapam.name}
              </div>
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                {t.bookService}
              </h3>
              <p className="text-xs text-stone-600">
                Reserve your devotional pooja slot. Free community booking (No payment required).
              </p>
            </div>

            {/* Select Service */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                Select Pooja / Seva
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mandapamServices.map((srv) => (
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
                    <p className="truncate">{srv.name}</p>
                    <p className="text-[10px] text-stone-500 font-normal">{srv.type} • {srv.durationMinutes} mins</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Slot */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                Available Time Slots
              </label>
              <div className="space-y-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => {
                    const free = Math.max(0, slot.capacity - (slot.bookedCount + slot.walkinCount));
                    const isFull = free === 0;

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
                          {isFull ? t.slotFull : `${free} Slots Left`}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-stone-500 italic p-3 bg-amber-50 rounded-xl">
                    No active slots available for this service.
                  </p>
                )}
              </div>
            </div>

            {/* Devotee Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Devotee Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter devotee full name"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
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
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Number of Devotees
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(6, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Gotram / Family Names (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter family gotram (optional)"
                  className="w-full px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {currentService?.itemsRequired && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                <strong>Items Devotees should bring:</strong> {currentService.itemsRequired}
              </div>
            )}

            <button
              type="submit"
              disabled={remainingCapacity <= 0}
              className="w-full py-3 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow-lg transition-all disabled:opacity-50"
            >
              Confirm Booking & Generate Pass →
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
                Enter Verification Code
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                We sent a 4-digit verification code to <strong>{mobile}</strong>
              </p>
              <p className="text-[11px] text-amber-800 font-bold mt-1">
                Demo Testing OTP: 1088
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
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow hover:bg-[#9A241C]"
              >
                Verify & Confirm
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
                Devotional Pooja Pass Confirmed
              </span>
              <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
                {confirmedBooking.serviceName}
              </h3>
              <p className="text-xs text-stone-600">
                {mandapam.name} • {mandapam.area}, {mandapam.city}
              </p>
            </div>

            {/* Auspicious Digital Pass Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FEF3C7] border-2 border-[#D97706] shadow-md text-left space-y-3">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Pass ID</span>
                  <p className="text-base font-black text-[#8B1E1E] font-mono">
                    {confirmedBooking.bookingCode}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Status</span>
                  <p className="text-xs font-bold text-emerald-700">CONFIRMED</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500 text-[10px]">Devotee:</span>
                  <p className="font-bold text-stone-800">{confirmedBooking.name}</p>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">Mobile:</span>
                  <p className="font-semibold text-stone-800">{confirmedBooking.mobile}</p>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">Date & Time:</span>
                  <p className="font-bold text-stone-800">{confirmedBooking.slotTime}</p>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px]">Participants:</span>
                  <p className="font-bold text-stone-800">{confirmedBooking.quantity} Person(s)</p>
                </div>
              </div>

              {confirmedBooking.notes && (
                <div className="text-[11px] bg-white/70 p-2 rounded-lg border border-amber-200 text-stone-700">
                  <strong>Notes:</strong> {confirmedBooking.notes}
                </div>
              )}

              {/* QR Verification at Mandapam Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                <div className="text-[10px] text-stone-600 max-w-[190px]">
                  Show this digital pass QR at the Mandapam reception counter for quick check-in.
                </div>
                <div className="p-1 bg-white rounded-lg shadow-sm border border-amber-300">
                  <QRCodeSVG value={`NM-PASS:${confirmedBooking.bookingCode}`} size={64} />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print / Save Pass
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
