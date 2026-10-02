import React, { useState } from "react";
import { Mandapam, Booking, Service, ServiceSlot } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import {
  X,
  Search,
  UserPlus,
  Printer,
  CheckCircle2,
  Clock,
  Users,
  Filter,
  Check,
  Ban
} from "lucide-react";
import { toast } from "sonner";

interface WalkInRegisterModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

export const WalkInRegisterModal: React.FC<WalkInRegisterModalProps> = ({
  mandapam,
  isOpen,
  onClose
}) => {
  const { bookings, services, slots, addWalkIn, updateBookingStatus } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "ONLINE" | "WALK_IN">("ALL");
  const [filterService, setFilterService] = useState<string>("ALL");
  const [isAddingWalkin, setIsAddingWalkin] = useState(false);

  // New Walkin form fields
  const [walkinName, setWalkinName] = useState("");
  const [walkinMobile, setWalkinMobile] = useState("");
  const [walkinQuantity, setWalkinQuantity] = useState(1);
  const [walkinServiceId, setWalkinServiceId] = useState(services[0]?.id || "");
  const [walkinSlotId, setWalkinSlotId] = useState(slots[0]?.id || "");
  const [walkinNotes, setWalkinNotes] = useState("");

  if (!isOpen) return null;

  const mandapamBookings = bookings.filter(b => b.mandapamId === mandapam.id);

  const filteredBookings = mandapamBookings.filter(b => {
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobile.includes(searchTerm) ||
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "ALL" || b.bookingType === filterType;
    const matchService = filterService === "ALL" || b.serviceId === filterService;
    return matchSearch && matchType && matchService;
  });

  const handleAddWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = walkinMobile.replace(/\D/g, "");
    if (!walkinName.trim() || !cleanMobile) {
      toast.error("Please provide devotee name and mobile.");
      return;
    }
    if (cleanMobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    const res = addWalkIn({
      slotId: walkinSlotId,
      serviceId: walkinServiceId,
      mandapamId: mandapam.id,
      name: walkinName,
      mobile: cleanMobile,
      quantity: walkinQuantity,
      notes: walkinNotes
    });

    if (res.success && res.booking) {
      toast.success(`Walk-In registered successfully! Pass Code: ${res.booking.bookingCode}`);
      setIsAddingWalkin(false);
      setWalkinName("");
      setWalkinMobile("");
      setWalkinNotes("");
    } else {
      toast.error(res.error || "Failed to add walk-in. Slot may be full.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FDFBF7] text-[#221A14] w-full max-w-4xl rounded-3xl p-6 shadow-2xl border-2 border-[#D97706] relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-[#8B1E1E] text-xs font-bold mb-1">
              <span>📋 Combined Operational Register</span>
            </div>
            <h3 className="font-serif font-black text-2xl text-[#8B1E1E]">
              {mandapam.name} • Devotee Register
            </h3>
            <p className="text-xs text-stone-600">
              Unified real-time log of Online Bookings + Counter Walk-Ins
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingWalkin(!isAddingWalkin)}
              className="px-3.5 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Walk-In</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4 Register</span>
            </button>
          </div>
        </div>

        {/* ADD WALK-IN FORM DRAWER */}
        {isAddingWalkin && (
          <form onSubmit={handleAddWalkinSubmit} className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-3 animate-in slide-in-from-top-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#8B1E1E] flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" />
              <span>Record Counter Walk-In Devotee</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Devotee Name *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="Enter devotee name"
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mobile Number (10 Digits Only) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  value={walkinMobile}
                  onChange={(e) => setWalkinMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Number of People</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={walkinQuantity}
                  onChange={(e) => setWalkinQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Service</label>
                <select
                  value={walkinServiceId}
                  onChange={(e) => setWalkinServiceId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                >
                  {services.filter(s => s.mandapamId === mandapam.id).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Select Time Slot</label>
                <select
                  value={walkinSlotId}
                  onChange={(e) => setWalkinSlotId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                >
                  {slots.filter(s => s.mandapamId === mandapam.id).map(s => (
                    <option key={s.id} value={s.id}>{s.startTime} - {s.endTime} ({s.date})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Counter Notes (Optional)</label>
                <input
                  type="text"
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  placeholder="Enter counter notes or remarks (optional)"
                  className="w-full px-3 py-1.5 rounded-xl border border-amber-300 bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingWalkin(false)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-700 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#8B1E1E] text-white text-xs font-bold shadow hover:bg-[#9A241C]"
              >
                Save Walk-In Entry
              </button>
            </div>
          </form>
        )}

        {/* SEARCH & FILTERS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Devotee, Mobile, or Code..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-2 text-xs">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "ALL" | "ONLINE" | "WALK_IN")}
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
            >
              <option value="ALL">All Types (Online + Walk-In)</option>
              <option value="ONLINE">Online Bookings Only</option>
              <option value="WALK_IN">Walk-In Counter Only</option>
            </select>
          </div>

          <div className="flex gap-2 text-xs">
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white"
            >
              <option value="ALL">All Services</option>
              {services.filter(s => s.mandapamId === mandapam.id).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* REGISTER TABLE */}
        <div className="rounded-2xl border border-amber-200 overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6ED] text-stone-700 font-bold border-b border-amber-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Pass ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Devotee</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Service & Slot</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#8B1E1E]">
                        {b.bookingCode}
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.bookingType === "ONLINE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {b.bookingType}
                        </span>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-stone-900">{b.name}</p>
                        {b.notes && <p className="text-[10px] text-stone-500">{b.notes}</p>}
                      </td>
                      <td className="p-3 text-stone-700 font-medium">{b.mobile}</td>
                      <td className="p-3">
                        <p className="font-semibold text-stone-800">{b.serviceName}</p>
                        <p className="text-[10px] text-stone-500">{b.slotTime}</p>
                      </td>
                      <td className="p-3 text-center font-bold">{b.quantity}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === "CHECKED_IN"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.status === "CONFIRMED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {b.status !== "CHECKED_IN" && (
                            <button
                              onClick={() => {
                                updateBookingStatus(b.id, "CHECKED_IN");
                                toast.success(`${b.name} checked in!`);
                              }}
                              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              title="Mark Checked In"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {b.status !== "CANCELLED" && (
                            <button
                              onClick={() => {
                                updateBookingStatus(b.id, "CANCELLED");
                                toast.error(`Booking cancelled`);
                              }}
                              className="p-1.5 rounded-lg bg-red-100 text-red-800 hover:bg-red-200"
                              title="Cancel"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-xs text-stone-500 italic">
                      No matching records found in register.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
