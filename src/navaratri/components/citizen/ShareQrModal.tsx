import React, { useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Download, Share2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Mandapam } from "../../types";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
export const ShareQrModal: React.FC<ShareQrModalProps> = ({ mandapam, isOpen, onClose }) => {
  const [designMode, setDesignMode] = useState<"POSTER" | "QR">("POSTER");
  const [isDownloading, setIsDownloading] = useState(false);
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}${base}/navaratri/m/${encodeURIComponent(mandapam.slug)}`;
  const publicUrl = `${shareUrl}?source=qr`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Mandapam link copied.");
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: mandapam.name, text: `Visit ${mandapam.name} on Sharan Navaratri`, url: shareUrl }).catch(() => {});
    } else copyLink();
  };

  const downloadPoster = async () => {
    const qr = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement | null;
    if (!qr) return toast.error("QR code is still loading. Please try again.");
    try {
      setIsDownloading(true);
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 2000;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");
      const background = ctx.createLinearGradient(0, 0, 1600, 2000);
      background.addColorStop(0, "#7c1d1d"); background.addColorStop(0.46, "#991b1b"); background.addColorStop(1, "#3f0b0b");
      ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(100, 100, 1400, 10);
      ctx.fillStyle = "#fde68a"; ctx.fillRect(100, 132, 540, 4);
      ctx.fillStyle = "#fff7ed";
      ctx.textAlign = "center";
      ctx.font = "bold 42px Arial";
      ctx.fillText("SHARAN NAVARATRI 2026", 800, 240);
      ctx.font = "bold 80px Georgia";
      const words = mandapam.name.split(" ");
      let line = ""; let y = 365;
      for (const word of words) {
        const trial = line ? `${line} ${word}` : word;
        if (ctx.measureText(trial).width > 1200 && line) { ctx.fillText(line, 800, y); y += 95; line = word; } else line = trial;
      }
      if (line) ctx.fillText(line, 800, y);
      ctx.fillStyle = "#fde68a"; ctx.font = "bold 29px Arial";
      ctx.fillText("SCAN FOR DARSHAN, POOJAS & MANDAPAM UPDATES", 800, y + 82);
      ctx.fillStyle = "#fffdf8"; ctx.roundRect(310, y + 150, 980, 1040, 56); ctx.fill();
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(310, y + 150, 980, 1040, 56); ctx.stroke();
      ctx.drawImage(qr, 475, y + 300, 650, 650);
      ctx.fillStyle = "#7c1d1d"; ctx.font = "bold 38px Arial";
      ctx.fillText("SCAN HERE", 800, y + 255);
      ctx.font = "28px Arial"; ctx.fillStyle = "#57534e";
      ctx.fillText("Open your Mandapam page instantly", 800, y + 1018);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(100, 1850, 1400, 8);
      ctx.fillStyle = "#fff7ed"; ctx.font = "bold 30px Arial";
      ctx.fillText("One QR. Every Mandapam. Every devotee.", 800, 1925);
      canvas.toBlob((blob) => {
        if (!blob) return toast.error("Could not create standee.");
        const url = URL.createObjectURL(blob); const a = document.createElement("a");
        a.href = url; a.download = `${mandapam.slug}-qr-standee.png`; a.click(); URL.revokeObjectURL(url);
        toast.success("QR standee downloaded."); setIsDownloading(false);
      }, "image/png");
    } catch {
      setIsDownloading(false); toast.error("Could not create standee. Please try again.");
    }
  };

  const downloadQr = () => {
    const qr = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement | null;
    if (!qr) return toast.error("QR code is still loading. Please try again.");
    qr.toBlob((blob) => {
      if (!blob) return toast.error("Could not create QR image.");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${mandapam.slug}-qr-code.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded.");
    }, "image/png");
  };

  const downloadSelected = designMode === "POSTER" ? downloadPoster : downloadQr;

  return <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
    <div className="relative flex min-h-[100dvh] w-full max-w-xl flex-col bg-[#fffaf0] p-4 shadow-2xl sm:min-h-0 sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:p-5">
      <button onClick={onClose} aria-label="Close Mandapam QR" className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-md hover:bg-stone-100"><X className="h-5 w-5" /></button>
      <div className="mb-4 shrink-0 pr-12"><h2 className="font-serif text-xl font-black text-[#7c1d1d]">Mandapam QR Code</h2><p className="mt-0.5 text-xs text-stone-600">Choose a design, download it, or share your Mandapam page.</p></div>
      <div className="mb-3 grid grid-cols-2 rounded-2xl border border-amber-200 bg-amber-50 p-1.5 text-xs font-bold">
        <button type="button" onClick={() => setDesignMode("POSTER")} className={`rounded-xl px-3 py-2.5 transition-colors cursor-pointer ${designMode === "POSTER" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>Poster design</button>
        <button type="button" onClick={() => setDesignMode("QR")} className={`rounded-xl px-3 py-2.5 transition-colors cursor-pointer ${designMode === "QR" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>QR only</button>
      </div>
      <div className="hidden"><QRCodeCanvas id="mandapam-qr-canvas" value={publicUrl} size={1200} level="H" includeMargin /></div>
      <div className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1">
        <div className="relative mx-auto w-full max-w-[420px]">
          <button onClick={share} aria-label="Share Mandapam URL" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#7c1d1d] shadow-lg ring-1 ring-amber-300 hover:bg-amber-50 cursor-pointer"><Share2 className="h-4 w-4" /></button>
          {designMode === "POSTER" ? (
            <div id="printable-standee" className="overflow-hidden rounded-[28px] border border-amber-300 bg-[#7c1d1d] p-2 shadow-xl">
              <div className="flex min-h-[510px] flex-col rounded-[21px] bg-[radial-gradient(circle_at_top,_#b45309_0%,_#7c1d1d_43%,_#3f0b0b_100%)] px-5 py-7 text-center text-white sm:min-h-[560px] sm:px-8">
                <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-black/15 px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-amber-100"><Sparkles className="h-3.5 w-3.5" /> SHARAN NAVARATRI 2026</div>
                {mandapam.logoUrl && <img src={mandapam.logoUrl} alt="" className="mx-auto mt-4 h-12 w-12 rounded-2xl border-2 border-amber-200 object-cover shadow-lg" />}
                <h3 className="mt-3 font-serif text-3xl font-black leading-tight sm:text-4xl">{mandapam.name}</h3>
                <p className="mt-2 text-xs font-semibold text-amber-100">Darshan, poojas, Annadanam & live Mandapam updates</p>
                <div className="mx-auto my-auto rounded-[28px] bg-white p-4 shadow-2xl ring-4 ring-amber-300/40 sm:p-5"><QRCodeSVG value={publicUrl} size={224} level="H" includeMargin className="h-48 w-48 sm:h-56 sm:w-56" /><p className="mt-2 text-[10px] font-black tracking-[0.16em] text-[#7c1d1d]">SCAN TO OPEN</p></div>
                <div className="mt-5 border-t border-amber-200/40 pt-4"><p className="text-[11px] font-bold text-amber-100">One QR. Every Mandapam. Every devotee.</p><p className="mt-1 text-[10px] text-amber-200/90">sharan-navratri.vercel.app</p></div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[510px] flex-col items-center justify-center rounded-[28px] border border-amber-300 bg-white p-6 shadow-xl sm:min-h-[560px]">
              <p className="text-xs font-black tracking-[0.2em] text-[#7c1d1d]">{mandapam.name.toUpperCase()}</p>
              <div className="mt-5 rounded-3xl border-4 border-amber-400 bg-white p-4 shadow-lg sm:p-6"><QRCodeSVG value={publicUrl} size={256} level="H" includeMargin className="h-56 w-56 sm:h-64 sm:w-64" /></div>
              <p className="mt-5 text-center text-sm font-bold text-stone-800">Scan to visit this Mandapam</p><p className="mt-1 text-xs text-stone-500">Open live darshan, poojas and festival updates.</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 shrink-0 border-t border-amber-200 pt-3"><button onClick={downloadSelected} disabled={isDownloading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c1d1d] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#651717] disabled:opacity-70 cursor-pointer"><Download className="h-4 w-4" />{isDownloading ? "Creating download…" : designMode === "POSTER" ? "Download poster" : "Download QR code"}</button></div>
    </div>
  </div>;
};
