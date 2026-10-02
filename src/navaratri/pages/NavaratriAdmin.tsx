import React, { useState } from "react";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../context/NavaratriLanguageContext";
import { STANDARD_NAVARATRI_DAYS } from "../data/standardNavaratriDays";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Users,
  Store,
  Layers,
  Archive,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

export const NavaratriAdmin: React.FC = () => {
  const {
    mandapams,
    verifyMandapam,
    season,
    advertisements,
    moderateAd,
    bookings,
    questions
  } = useNavaratriData();
  const { t } = useNavaratriLanguage();

  const [activeTab, setActiveTab] = useState<"overview" | "mandapams" | "ads" | "standard_data" | "seasons">("overview");

  const totalMandapams = mandapams.length;
  const verifiedMandapams = mandapams.filter(m => m.verificationStatus === "VERIFIED").length;
  const pendingMandapams = mandapams.filter(m => m.verificationStatus === "PENDING").length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-1">
            <span>⚙️ Platform Governance</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-white">
            Navaratri Mandapam • Admin HQ
          </h1>
          <p className="text-xs text-stone-300">
            Multi-tenant supervision, Mandapam verifications, festival standards, and ad moderation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-400 text-stone-900 font-bold">
            Season: {season.name} ({season.status})
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-amber-200/80 pb-2 text-xs">
        {[
          { id: "overview", label: "Overview & Analytics" },
          { id: "mandapams", label: `Mandapams (${totalMandapams})` },
          { id: "ads", label: `Local Ads (${advertisements.length})` },
          { id: "standard_data", label: "Standard 9-Day Data" },
          { id: "seasons", label: "Season Lifecycle & Archival" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#8B1E1E] text-white shadow-sm"
                : "bg-white text-stone-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Total Mandapams</span>
              <p className="text-3xl font-black text-[#8B1E1E]">{totalMandapams}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">{verifiedMandapams} Verified Active</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Devotee Bookings</span>
              <p className="text-3xl font-black text-amber-800">{bookings.length}</p>
              <p className="text-[11px] text-stone-600">Across All Pandals</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Community Q&A</span>
              <p className="text-3xl font-black text-blue-800">{questions.length}</p>
              <p className="text-[11px] text-stone-600">Citizen Queries</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Local Advertisements</span>
              <p className="text-3xl font-black text-purple-800">{advertisements.length}</p>
              <p className={`text-[11px] font-semibold ${advertisements.filter(a => a.status === 'PENDING_REVIEW').length > 0 ? 'text-orange-600' : 'text-emerald-700'}`}>
                {advertisements.filter(a => a.status === 'PENDING_REVIEW').length > 0
                  ? `⚠️ ${advertisements.filter(a => a.status === 'PENDING_REVIEW').length} Awaiting Payment Verification`
                  : 'All Ads Verified'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFDF9] border border-amber-200 space-y-3">
            <h3 className="font-serif font-bold text-base text-[#8B1E1E]">
              Platform Operational Summary
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Navaratri Mandapam platform is active across Nizamabad, Hyderabad, and Vijayawada districts. Real-time daily Alankarana darshan uploads and unified walk-in registers are serving devotees seamlessly without third-party dependencies.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MANDAPAMS VERIFICATION */}
      {activeTab === "mandapams" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6ED] text-stone-700 font-bold border-b border-amber-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Mandapam Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Organizer</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {mandapams.map((m) => (
                  <tr key={m.id} className="hover:bg-amber-50/50">
                    <td className="p-3">
                      <p className="font-bold text-[#8B1E1E]">{m.name}</p>
                      <p className="text-[10px] text-stone-500 font-mono">/m/{m.slug}</p>
                    </td>
                    <td className="p-3 text-stone-700">{m.area}, {m.city}</td>
                    <td className="p-3">
                      <p className="font-semibold text-stone-900">{m.organizerName}</p>
                      <p className="text-[10px] text-stone-500">{m.organizerMobile}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        m.verificationStatus === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {m.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {m.verificationStatus !== "VERIFIED" ? (
                        <button
                          onClick={() => {
                            verifyMandapam(m.id, "VERIFIED");
                            toast.success(`${m.name} verified!`);
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                        >
                          Approve ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            verifyMandapam(m.id, "SUSPENDED");
                            toast.error(`${m.name} suspended`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-stone-200 text-stone-700 text-xs hover:bg-stone-300"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LOCAL AD MODERATION */}
      {activeTab === "ads" && (
        <div className="space-y-6">

          {/* PENDING PAYMENT VERIFICATION QUEUE */}
          {advertisements.filter(a => a.status === 'PENDING_REVIEW').length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-orange-700 uppercase tracking-wider">⚠️ Pending Payment Verification ({advertisements.filter(a => a.status === 'PENDING_REVIEW').length})</span>
                <span className="text-[10px] text-stone-500">— Confirm UTR to activate ad</span>
              </div>
              {advertisements.filter(a => a.status === 'PENDING_REVIEW').map((ad) => (
                <div key={ad.id} className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-300 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-stone-900 text-sm">{ad.businessName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-200">
                          {ad.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                          PENDING VERIFICATION
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#8B1E1E]">{ad.title}</p>
                      <div className="flex flex-wrap gap-3 text-[11px] text-stone-600">
                        <span>📍 {ad.targetZone || ad.targetCity}</span>
                        <span>📞 {ad.phone}</span>
                        {ad.pricePaid && <span className="font-bold text-emerald-700">₹{ad.pricePaid} claimed paid</span>}
                      </div>
                      {/* UTR Number */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-stone-700">UTR Ref:</span>
                        <span className="font-mono text-sm text-stone-900 bg-white px-2 py-0.5 rounded-lg border border-orange-200 font-bold tracking-wider">
                          {ad.utrNumber || <span className="text-red-500 italic">Not provided</span>}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500">Submitted: {new Date(ad.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <button
                        onClick={() => {
                          moderateAd(ad.id, 'APPROVED');
                          toast.success(`✅ Payment confirmed! "${ad.businessName}" ad is now LIVE.`);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Payment & Activate
                      </button>
                      <button
                        onClick={() => {
                          moderateAd(ad.id, 'REJECTED', 'Payment not found or UTR mismatch');
                          toast.error(`Ad rejected — payment not verified.`);
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject (UTR Mismatch)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-700 font-semibold">
              ✅ No pending payment verifications — all ads are reviewed.
            </div>
          )}

          {/* ALL ADS TABLE */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">All Advertisements</h4>
            <div className="rounded-2xl border border-amber-200 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6ED] text-stone-700 font-bold border-b border-amber-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Business</th>
                    <th className="p-3">Ad Creative</th>
                    <th className="p-3">Target City</th>
                    <th className="p-3">UTR / Payment</th>
                    <th className="p-3 text-center">Metrics</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {advertisements.map((ad) => (
                    <tr key={ad.id} className={`hover:bg-amber-50/50 ${
                      ad.status === 'PENDING_REVIEW' ? 'bg-orange-50/40' : ''
                    }`}>
                      <td className="p-3">
                        <p className="font-bold text-stone-900">{ad.businessName}</p>
                        <p className="text-[10px] text-stone-500">{ad.category} • {ad.phone}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-[#8B1E1E]">{ad.title}</p>
                        <p className="text-[10px] text-stone-600 line-clamp-1">{ad.description}</p>
                      </td>
                      <td className="p-3 text-stone-700">{ad.targetCity}</td>
                      <td className="p-3">
                        {ad.utrNumber ? (
                          <span className="font-mono text-stone-900 font-bold">{ad.utrNumber}</span>
                        ) : (
                          <span className="text-stone-400 italic">—</span>
                        )}
                        {ad.pricePaid && <p className="text-[10px] text-emerald-700 font-semibold">₹{ad.pricePaid}</p>}
                      </td>
                      <td className="p-3 text-center">
                        <p className="font-bold text-stone-900">{ad.impressions} Views</p>
                        <p className="text-[10px] text-stone-500">{ad.clicks} Clicks</p>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ad.status === 'ACTIVE' || ad.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ad.status === 'PENDING_REVIEW'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {ad.status === 'PENDING_REVIEW' ? (
                          <button
                            onClick={() => {
                              moderateAd(ad.id, 'APPROVED');
                              toast.success('Ad approved & live!');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                          >
                            Activate ✓
                          </button>
                        ) : ad.status !== 'APPROVED' && ad.status !== 'ACTIVE' ? (
                          <button
                            onClick={() => {
                              moderateAd(ad.id, 'APPROVED');
                              toast.success('Ad approved for publication');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              moderateAd(ad.id, 'PAUSED', 'Temporarily paused by Admin');
                              toast.info('Ad paused');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold"
                          >
                            Pause
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STANDARD 9-DAY FESTIVAL DATA */}
      {activeTab === "standard_data" && (
        <div className="space-y-4">
          <p className="text-xs text-stone-600">
            Central repository of suggested Devi forms, auspicious colors, and Naivedhyam for Sharad Navaratri:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STANDARD_NAVARATRI_DAYS.map((d) => (
              <div key={d.dayNumber} className="p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8B1E1E]">Day {d.dayNumber}: {d.deviName}</span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.colorHex }} />
                </div>
                <p className="text-stone-700"><strong>Offerings:</strong> {d.suggestedOfferings}</p>
                <p className="text-stone-600"><strong>Items:</strong> {d.suggestedItems}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SEASON LIFECYCLE & ARCHIVAL */}
      {activeTab === "seasons" && (
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-amber-200 shadow-sm space-y-4">
          <h3 className="font-serif font-black text-xl text-[#8B1E1E]">
            Season Management & Annual Reactivation
          </h3>
          <p className="text-xs text-stone-700 leading-relaxed max-w-2xl">
            <strong>Rule:</strong> Mandapams are NEVER deleted after Navaratri. When the festival concludes, the season moves to "ARCHIVED". For the following year (e.g. 2027), organizers can reactivate their existing Mandapam with 1 click preserving historical Alankaranas, QR codes, and devotee followers.
          </p>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-stone-900">Current Season: {season.name}</p>
              <p className="text-[11px] text-stone-600">Status: {season.status} • {season.startDate} to {season.endDate}</p>
            </div>
            <button
              onClick={() => toast.info("Season archival is scheduled after Vijaya Dashami (Oct 21).")}
              className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900"
            >
              Archive Season
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
