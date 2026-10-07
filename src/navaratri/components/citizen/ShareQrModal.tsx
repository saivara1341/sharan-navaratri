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

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 p-0 backdrop-blur-sm sm:p-4">
    <div className="relative flex h-[100dvh] w-full max-w-xl flex-col overflow-hidden bg-[#fffaf0] p-3 shadow-2xl sm:h-[calc(100dvh-2rem)] sm:rounded-3xl sm:p-4">
      <button onClick={onClose} aria-label="Close Mandapam QR" className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-md hover:bg-stone-100"><X className="h-5 w-5" /></button>
      <div className="mb-2 shrink-0 pr-12"><h2 className="font-serif text-lg font-black text-[#7c1d1d]">Mandapam QR Code</h2><p className="mt-0.5 text-[11px] text-stone-600">Download or share your Mandapam page.</p></div>
      <div className="mb-2 grid shrink-0 grid-cols-2 rounded-2xl border border-amber-200 bg-amber-50 p-1 text-xs font-bold">
        <button type="button" onClick={() => setDesignMode("POSTER")} className={`rounded-xl px-3 py-2 transition-colors cursor-pointer ${designMode === "POSTER" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>Poster design</button>
        <button type="button" onClick={() => setDesignMode("QR")} className={`rounded-xl px-3 py-2 transition-colors cursor-pointer ${designMode === "QR" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>QR only</button>
      </div>
      <div className="hidden"><QRCodeCanvas id="mandapam-qr-canvas" value={publicUrl} size={1200} level="H" includeMargin /></div>
      <div className="min-h-0 flex flex-1 items-center justify-center overflow-hidden py-1">
        <div className="relative h-[min(58dvh,520px)] max-h-full w-auto max-w-full aspect-[4/5]">
          <button onClick={share} aria-label="Share Mandapam URL" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#7c1d1d] shadow-lg ring-1 ring-amber-300 hover:bg-amber-50 cursor-pointer"><Share2 className="h-4 w-4" /></button>
          {designMode === "POSTER" ? (
            <div id="printable-standee" className="h-full overflow-hidden rounded-[26px] border border-amber-300 bg-[#7c1d1d] p-1.5 shadow-xl">
              <div className="flex h-full flex-col rounded-[20px] bg-[radial-gradient(circle_at_top,_#b45309_0%,_#7c1d1d_43%,_#3f0b0b_100%)] px-4 py-5 text-center text-white sm:px-6 sm:py-6">
                <div className="mx-auto inline-flex items-center gap-1 rounded-full border border-amber-200/50 bg-black/15 px-2.5 py-1 text-[8px] font-black tracking-[0.15em] text-amber-100 sm:text-[10px]"><Sparkles className="h-3 w-3" /> SHARAN NAVARATRI 2026</div>
                {mandapam.logoUrl && <img src={mandapam.logoUrl} alt="" className="mx-auto mt-2.5 h-9 w-9 rounded-xl border border-amber-200 object-cover shadow-lg sm:h-11 sm:w-11" />}
                <h3 className="mt-2 font-serif text-xl font-black leading-tight sm:text-3xl">{mandapam.name}</h3>
                <p className="mt-1 text-[9px] font-semibold text-amber-100 sm:text-xs">Darshan, poojas, Annadanam & live updates</p>
                <div className="mx-auto my-auto rounded-2xl bg-white p-2.5 shadow-2xl ring-2 ring-amber-300/40 sm:p-4"><QRCodeSVG value={publicUrl} size={224} level="H" includeMargin className="h-36 w-36 sm:h-48 sm:w-48" /><p className="mt-1 text-[8px] font-black tracking-[0.14em] text-[#7c1d1d] sm:text-[10px]">SCAN TO OPEN</p></div>
                <div className="mt-2.5 border-t border-amber-200/40 pt-2"><p className="text-[9px] font-bold text-amber-100 sm:text-[11px]">One QR. Every Mandapam. Every devotee.</p><p className="mt-0.5 text-[8px] text-amber-200/90 sm:text-[10px]">sharan-navratri.vercel.app</p></div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-[26px] border border-amber-300 bg-white p-5 shadow-xl">
              <p className="text-[10px] font-black tracking-[0.16em] text-[#7c1d1d] sm:text-xs">{mandapam.name.toUpperCase()}</p>
              <div className="mt-4 rounded-3xl border-4 border-amber-400 bg-white p-3 shadow-lg sm:p-5"><QRCodeSVG value={publicUrl} size={256} level="H" includeMargin className="h-44 w-44 sm:h-56 sm:w-56" /></div>
              <p className="mt-4 text-center text-xs font-bold text-stone-800 sm:text-sm">Scan to visit this Mandapam</p><p className="mt-1 text-center text-[10px] text-stone-500 sm:text-xs">Open live darshan, poojas and updates.</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 shrink-0 border-t border-amber-200 pt-2"><button onClick={downloadSelected} disabled={isDownloading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c1d1d] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#651717] disabled:opacity-70 cursor-pointer"><Download className="h-4 w-4" />{isDownloading ? "Creating download…" : designMode === "POSTER" ? "Download poster" : "Download QR code"}</button></div>
    </div>
  </div>;
};
