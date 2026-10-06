import React, { useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Check, Copy, Download, Printer, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Mandapam } from "../../types";
import siddhiDynamicsLogo from "@/assets/siddhi-dynamics-header-logo.png";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const services = [
  ["🌸", "నేటి అలంకారం", "Today's Alankaram & Darshan"],
  ["🪔", "పూజ & హారతి", "Daily Aarti & Pooja Timings"],
  ["🍲", "మహా ప్రసాదం", "Prasadam & Annadanam"],
  ["🎟️", "సేవలు & టోకెన్లు", "Sevas & Devotee Tokens"],
];

export const ShareQrModal: React.FC<ShareQrModalProps> = ({ mandapam, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}${base}/navaratri/m/${encodeURIComponent(mandapam.slug)}`;
  const publicUrl = `${shareUrl}?source=qr`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Mandapam link copied.");
    window.setTimeout(() => setCopied(false), 1800);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: mandapam.name, text: `Visit ${mandapam.name} on Sharan Navaratri`, url: shareUrl }).catch(() => {});
    } else copyLink();
  };

  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not load"));
    image.src = src;
  });

  const downloadPoster = async () => {
    const qr = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement | null;
    if (!qr) return toast.error("QR code is still loading. Please try again.");
    try {
      setIsDownloading(true);
      const canvas = document.createElement("canvas");
      canvas.width = 2480;
      canvas.height = 3508;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");
      ctx.fillStyle = "#fffdf8"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#8b1e1e"; ctx.fillRect(150, 145, 2180, 18);
      ctx.fillStyle = "#d97706"; ctx.fillRect(150, 180, 2180, 6);
      ctx.fillStyle = "#7c1d1d";
      ctx.textAlign = "center";
      ctx.font = "bold 54px Georgia";
      ctx.fillText("SHARAN NAVARATRI 2026", 1240, 330);
      ctx.font = "bold 84px Georgia";
      const words = mandapam.name.split(" ");
      let line = ""; let y = 475;
      for (const word of words) {
        const trial = line ? `${line} ${word}` : word;
        if (ctx.measureText(trial).width > 1750 && line) { ctx.fillText(line, 1240, y); y += 100; line = word; } else line = trial;
      }
      if (line) ctx.fillText(line, 1240, y);
      ctx.fillStyle = "#92400e"; ctx.font = "bold 33px Arial";
      ctx.fillText("Scan to visit your Mandapam digital notice board", 1240, 680);
      ctx.fillStyle = "#fff"; ctx.roundRect(450, 900, 1580, 1390, 55); ctx.fill();
      ctx.strokeStyle = "#d97706"; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(450, 900, 1580, 1390, 55); ctx.stroke();
      ctx.drawImage(qr, 650, 1080, 1180, 1180);
      ctx.fillStyle = "#7c1d1d"; ctx.font = "bold 45px Arial";
      ctx.fillText("SCAN HERE", 1240, 1015);
      ctx.font = "30px Arial"; ctx.fillStyle = "#57534e";
      ctx.fillText("sharan-navratri.vercel.app", 1240, 2355);
      const startY = 2520;
      services.forEach((service, index) => {
        const col = index % 2; const row = Math.floor(index / 2); const x = 250 + col * 1010; const yy = startY + row * 270;
        ctx.fillStyle = "#fff7e7"; ctx.roundRect(x, yy, 970, 210, 28); ctx.fill();
        ctx.fillStyle = "#7c1d1d"; ctx.textAlign = "left"; ctx.font = "bold 33px Arial"; ctx.fillText(service[2], x + 42, yy + 85);
        ctx.font = "28px Arial"; ctx.fillStyle = "#92400e"; ctx.fillText(service[1], x + 42, yy + 142);
      });
      ctx.textAlign = "center";
      try { const logo = await loadImage(siddhiDynamicsLogo); ctx.drawImage(logo, 960, 3180, 560, 185); } catch {}
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

  return <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
    <style>{`@media print { @page { size:A4 portrait; margin:0 } body *{visibility:hidden!important} #printable-standee,#printable-standee *{visibility:visible!important} #printable-standee{position:fixed!important;inset:0!important;width:210mm!important;height:297mm!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;print-color-adjust:exact!important;-webkit-print-color-adjust:exact!important} .no-print{display:none!important} }`}</style>
    <div className="relative flex min-h-[100dvh] w-full max-w-2xl flex-col bg-[#fffaf0] p-3 shadow-2xl sm:min-h-0 sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:p-6">
      <button onClick={onClose} aria-label="Close QR poster" className="no-print absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-md hover:bg-stone-100"><X className="h-5 w-5" /></button>
      <div className="no-print mb-3 shrink-0 pr-12"><h2 className="font-serif text-xl font-black text-[#7c1d1d]">Mandapam QR</h2><p className="text-xs text-stone-600">Print the A4 poster or download only the QR code.</p></div>
      <div className="hidden"><QRCodeCanvas id="mandapam-qr-canvas" value={publicUrl} size={1200} level="H" includeMargin /></div>
      <div className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1"><div id="printable-standee" className="mx-auto w-full max-w-[430px] overflow-hidden rounded-2xl border border-amber-300 bg-[#fffdf8] p-4 shadow-inner sm:p-7" style={{ aspectRatio: "210 / 297" }}>
        <div className="flex h-full flex-col items-center text-center">
          <div className="w-full border-y-4 border-[#8b1e1e] px-3 py-3 text-[#7c1d1d]"><p className="text-[10px] font-bold tracking-[.24em] sm:text-xs">SHARAN NAVARATRI 2026</p><h3 className="mt-1 font-serif text-xl font-black leading-tight sm:text-3xl">{mandapam.name}</h3><p className="mt-1 text-[10px] font-semibold text-amber-800 sm:text-xs">Scan for Mandapam details</p></div>
          <div className="my-auto rounded-3xl border-2 border-amber-500 bg-white p-4 shadow-lg sm:p-7"><p className="mb-2 text-xs font-black tracking-widest text-[#7c1d1d]">SCAN HERE</p><QRCodeSVG value={publicUrl} size={210} level="H" includeMargin className="h-44 w-44 sm:h-56 sm:w-56" /><p className="mt-2 text-[10px] font-semibold text-stone-600">sharan-navratri.vercel.app</p></div>
          <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">{services.map(([icon, telugu, english]) => <div key={english} className="rounded-xl border border-amber-200 bg-[#fff7e7] p-2 text-left sm:p-3"><div className="text-base">{icon}</div><p className="text-[10px] font-black leading-tight text-[#7c1d1d] sm:text-xs">{telugu}</p><p className="mt-0.5 text-[8px] font-medium leading-tight text-stone-700 sm:text-[10px]">{english}</p></div>)}</div>
          <img src={siddhiDynamicsLogo} alt="Siddhi Dynamics LLP" className="mt-3 h-7 w-auto object-contain sm:h-9" /></div>
      </div></div>
      <div className="no-print mt-2 grid shrink-0 grid-cols-2 gap-2 border-t border-amber-200 pt-3 sm:flex sm:flex-wrap sm:justify-center"><button onClick={downloadPoster} disabled={isDownloading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c1d1d] px-4 py-2.5 text-xs font-bold text-white"><Download className="h-4 w-4" />{isDownloading ? "Creating…" : "Download design"}</button><button onClick={downloadQr} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-white px-4 py-2.5 text-xs font-bold text-[#7c1d1d]"><Download className="h-4 w-4" />QR code only</button><button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-white px-4 py-2.5 text-xs font-bold text-[#7c1d1d]"><Printer className="h-4 w-4" />Print A4</button><button onClick={copyLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-white px-4 py-2.5 text-xs font-bold text-[#7c1d1d]">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy link"}</button><button onClick={share} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-white px-4 py-2.5 text-xs font-bold text-[#7c1d1d] sm:col-span-1"><Share2 className="h-4 w-4" />Share</button></div>
    </div>
  </div>;
};
