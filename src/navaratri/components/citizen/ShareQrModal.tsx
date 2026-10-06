import React, { useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Check, Copy, Download, Printer, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Mandapam } from "../../types";
import standeeBackground from "@/assets/mandapam-standee-background.jpeg";
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

  const publicUrl = `${window.location.origin}${base}/navaratri/m/${mandapam.slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Mandapam link copied.");
    window.setTimeout(() => setCopied(false), 1800);
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: mandapam.name, text: `Visit ${mandapam.name} on Sharan Navaratri`, url: publicUrl }).catch(() => {});
    } else copyLink();
  };

  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not load"));
    image.src = src;
  });

  const download = async () => {
    const qr = document.getElementById("mandapam-qr-canvas") as HTMLCanvasElement | null;
    if (!qr) return toast.error("QR code is still loading. Please try again.");
    try {
      setIsDownloading(true);
      const canvas = document.createElement("canvas");
      canvas.width = 2480;
      canvas.height = 3508;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");
      const bg = await loadImage(standeeBackground);
      const scale = Math.max(canvas.width / bg.width, canvas.height / bg.height);
      const w = bg.width * scale;
      const h = bg.height * scale;
      ctx.drawImage(bg, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      ctx.fillStyle = "rgba(255,250,240,0.94)";
      ctx.roundRect(190, 180, 2100, 580, 48); ctx.fill();
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
      ctx.drawImage(qr, 650, 1080, 1180, 1180);
      ctx.fillStyle = "#7c1d1d"; ctx.font = "bold 45px Arial";
      ctx.fillText("SCAN HERE", 1240, 1015);
      ctx.font = "30px Arial"; ctx.fillStyle = "#57534e";
      ctx.fillText("sharan-navratri.vercel.app", 1240, 2355);
      const startY = 2520;
      services.forEach((service, index) => {
        const col = index % 2; const row = Math.floor(index / 2); const x = 250 + col * 1010; const yy = startY + row * 270;
        ctx.fillStyle = "rgba(255,250,240,0.94)"; ctx.roundRect(x, yy, 970, 210, 28); ctx.fill();
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

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm">
    <style>{`@media print { @page { size:A4 portrait; margin:0 } body *{visibility:hidden!important} #printable-standee,#printable-standee *{visibility:visible!important} #printable-standee{position:fixed!important;inset:0!important;width:210mm!important;height:297mm!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;print-color-adjust:exact!important;-webkit-print-color-adjust:exact!important} .no-print{display:none!important} }`}</style>
    <div className="relative my-4 w-full max-w-2xl rounded-3xl bg-[#fffaf0] p-4 shadow-2xl sm:p-6">
      <button onClick={onClose} aria-label="Close" className="no-print absolute right-3 top-3 rounded-full bg-stone-200 p-2 text-stone-700"><X className="h-5 w-5" /></button>
      <div className="no-print mb-4 pr-10"><h2 className="font-serif text-xl font-black text-[#7c1d1d]">Mandapam QR Standee</h2><p className="text-xs text-stone-600">A clean A4 poster for devotees at your Mandapam.</p></div>
      <div className="hidden"><QRCodeCanvas id="mandapam-qr-canvas" value={publicUrl} size={1200} level="H" includeMargin /></div>
      <div id="printable-standee" className="overflow-hidden rounded-2xl bg-cover bg-center p-4 shadow-inner sm:p-7" style={{ aspectRatio: "210 / 297", backgroundImage: `url(${standeeBackground})` }}>
        <div className="flex h-full flex-col items-center text-center">
          <div className="w-full rounded-2xl bg-[#fffaf0]/95 px-4 py-3 text-[#7c1d1d] shadow-sm"><p className="text-[10px] font-bold tracking-[.24em] sm:text-xs">SHARAN NAVARATRI 2026</p><h3 className="mt-1 font-serif text-xl font-black leading-tight sm:text-3xl">{mandapam.name}</h3><p className="mt-1 text-[10px] font-semibold text-amber-800 sm:text-xs">Scan to visit your Mandapam digital notice board</p></div>
          <div className="my-auto rounded-3xl bg-white p-4 shadow-xl sm:p-7"><p className="mb-2 text-xs font-black tracking-widest text-[#7c1d1d]">SCAN HERE</p><QRCodeSVG value={publicUrl} size={210} level="H" includeMargin className="h-44 w-44 sm:h-56 sm:w-56" /><p className="mt-2 text-[10px] font-semibold text-stone-600">sharan-navratri.vercel.app</p></div>
          <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">{services.map(([icon, telugu, english]) => <div key={english} className="rounded-xl bg-[#fffaf0]/95 p-2 text-left shadow-sm sm:p-3"><div className="text-base">{icon}</div><p className="text-[10px] font-black leading-tight text-[#7c1d1d] sm:text-xs">{telugu}</p><p className="mt-0.5 text-[8px] font-medium leading-tight text-stone-700 sm:text-[10px]">{english}</p></div>)}</div>
          <img src={siddhiDynamicsLogo} alt="Siddhi Dynamics LLP" className="mt-3 h-7 w-auto object-contain sm:h-9" /></div>
      </div>
      <div className="no-print mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-center"><button onClick={download} disabled={isDownloading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7c1d1d] px-4 py-2.5 text-xs font-bold text-white"><Download className="h-4 w-4" />{isDownloading ? "Creating…" : "Download PNG"}</button><button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-white px-4 py-2.5 text-xs font-bold text-[#7c1d1d]"><Printer className="h-4 w-4" />Print A4</button><button onClick={copyLink} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-white px-4 py-2.5 text-xs font-bold text-[#7c1d1d]">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy link"}</button><button onClick={share} className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500 bg-white px-4 py-2.5 text-xs font-bold text-[#7c1d1d]"><Share2 className="h-4 w-4" />Share</button></div>
    </div>
  </div>;
};
