import React, { useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Download, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Mandapam } from "../../types";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
type PosterTemplate = "ROYAL" | "TEMPLE" | "SAFFRON";


const loadCanvasImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const drawTempleArch = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, stroke: string, fill?: string) => {
  const top = y + h * 0.08;
  const shoulder = y + h * 0.28;
  const bottom = y + h;
  ctx.beginPath();
  ctx.moveTo(x, bottom);
  ctx.lineTo(x, shoulder);
  ctx.quadraticCurveTo(x + w * 0.08, top, x + w * 0.5, top);
  ctx.quadraticCurveTo(x + w * 0.92, top, x + w, shoulder);
  ctx.lineTo(x + w, bottom);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 10;
  ctx.stroke();
};

const posterTemplates: Record<PosterTemplate, { label: string; swatch: string; frame: string; panel: string; canvas: [string, string, string]; asset: string }> = {
  ROYAL: {
    label: "Royal",
    swatch: "bg-[#7c1d1d]",
    frame: "border-amber-300 bg-[#7c1d1d]",
    panel: "bg-[radial-gradient(circle_at_top,_#b45309_0%,_#7c1d1d_43%,_#3f0b0b_100%)]",
    canvas: ["#7c1d1d", "#991b1b", "#3f0b0b"],
    asset: `${base}/navaratri/assets/royal-maroon-arch.jpg`,
  },
  TEMPLE: {
    label: "Temple",
    swatch: "bg-[#854d0e]",
    frame: "border-orange-200 bg-[#713f12]",
    panel: "bg-[radial-gradient(circle_at_top,_#f59e0b_0%,_#9a3412_42%,_#431407_100%)]",
    canvas: ["#854d0e", "#9a3412", "#431407"],
    asset: `${base}/navaratri/assets/temple-arch-frame.jpg`,
  },
  SAFFRON: {
    label: "Saffron",
    swatch: "bg-[#c2410c]",
    frame: "border-yellow-300 bg-[#c2410c]",
    panel: "bg-[radial-gradient(circle_at_top,_#f97316_0%,_#c2410c_42%,_#7c2d12_100%)]",
    canvas: ["#c2410c", "#ea580c", "#7c2d12"],
    asset: `${base}/navaratri/assets/saffron-gold-mandapam-frame.jpg`,
  },
};

export const ShareQrModal: React.FC<ShareQrModalProps> = ({ mandapam, isOpen, onClose }) => {
  const [designMode, setDesignMode] = useState<"POSTER" | "QR">("POSTER");
  const [posterTemplate, setPosterTemplate] = useState<PosterTemplate>("ROYAL");
  const [isDownloading, setIsDownloading] = useState(false);
  if (!isOpen) return null;

  const mandapamPublicId = mandapam.slug || mandapam.id;
  const shareUrl = `${window.location.origin}${base}/navaratri/m/${encodeURIComponent(mandapamPublicId)}`;
  const publicUrl = `${shareUrl}?source=qr`;
  const activeTemplate = posterTemplates[posterTemplate];

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
      background.addColorStop(0, activeTemplate.canvas[0]); background.addColorStop(0.46, activeTemplate.canvas[1]); background.addColorStop(1, activeTemplate.canvas[2]);
      ctx.fillStyle = background; ctx.fillRect(0, 0, canvas.width, canvas.height);
      try {
        const archImage = await loadCanvasImage(activeTemplate.asset);
        ctx.save();
        ctx.globalAlpha = 0.34;
        ctx.drawImage(archImage, 0, 0, 1600, 1120);
        ctx.scale(1, -1);
        ctx.globalAlpha = 0.18;
        ctx.drawImage(archImage, 0, -2000, 1600, 900);
        ctx.restore();
      } catch {
        // Keep the generated poster usable even if a decorative asset cannot load.
      }
      const veil = ctx.createLinearGradient(0, 0, 0, 2000);
      veil.addColorStop(0, "rgba(60, 10, 10, 0.24)");
      veil.addColorStop(0.44, "rgba(60, 10, 10, 0.46)");
      veil.addColorStop(1, "rgba(20, 5, 5, 0.62)");
      ctx.fillStyle = veil; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(251, 191, 36, 0.70)";
      ctx.lineWidth = 8;
      drawTempleArch(ctx, 205, 305, 1190, 520, "rgba(251, 191, 36, 0.55)");
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(100, 100, 1400, 10);
      ctx.fillStyle = "#fde68a"; ctx.fillRect(100, 132, 540, 4);
      ctx.fillStyle = "#fff7ed";
      ctx.textAlign = "center";
      ctx.font = "bold 42px Arial";
      ctx.fillText("SHARAN NAVARATRI", 800, 220);
      ctx.fillStyle = "#fde68a"; ctx.font = "bold 24px Arial";
      ctx.fillText("2026", 800, 258);
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
      drawTempleArch(ctx, 360, y + 205, 880, 840, "rgba(180, 83, 9, 0.28)");
      ctx.fillStyle = "rgba(251, 191, 36, 0.22)"; ctx.fillRect(350, y + 262, 900, 5);
      ctx.drawImage(qr, 475, y + 320, 650, 650);
      ctx.fillStyle = "#7c1d1d"; ctx.font = "bold 38px Arial";
      ctx.fillText("SCAN HERE", 800, y + 255);
      ctx.font = "28px Arial"; ctx.fillStyle = "#57534e";
      ctx.fillText("Open your Mandapam page instantly", 800, y + 1018);
      ctx.fillStyle = "#fbbf24"; ctx.fillRect(100, 1850, 1400, 8);
      ctx.fillStyle = "#fff7ed"; ctx.font = "bold 30px Arial";
      ctx.fillText("One QR. Every Mandapam. Every devotee.", 800, 1925);
      ctx.fillStyle = "#fde68a"; ctx.font = "bold 24px Arial";
      ctx.fillText("In service of Ammavari • Siddhi Dynamics LLP", 800, 1965);
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

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 p-2 backdrop-blur-sm sm:p-4">
    <div className="relative flex h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-[#fffaf0] p-3 shadow-2xl sm:h-[calc(100dvh-2rem)] sm:p-4">
      <button onClick={onClose} aria-label="Close Mandapam QR" className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-md hover:bg-stone-100"><X className="h-5 w-5" /></button>
      <div className="mb-2 shrink-0 pr-12"><h2 className="font-serif text-lg font-black text-[#7c1d1d]">Mandapam QR Code</h2><p className="mt-0.5 text-[11px] text-stone-600">This QR opens this Mandapam page directly for devotees.</p></div>
      <div className="mb-2 grid shrink-0 grid-cols-2 rounded-2xl border border-amber-200 bg-amber-50 p-1 text-xs font-bold">
        <button type="button" onClick={() => setDesignMode("POSTER")} className={`rounded-xl px-3 py-2 transition-colors cursor-pointer ${designMode === "POSTER" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>Poster design</button>
        <button type="button" onClick={() => setDesignMode("QR")} className={`rounded-xl px-3 py-2 transition-colors cursor-pointer ${designMode === "QR" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>QR only</button>
      </div>
      {designMode === "POSTER" && (
        <div className="mb-2 grid shrink-0 grid-cols-3 gap-1.5">
          {(Object.keys(posterTemplates) as PosterTemplate[]).map((templateKey) => {
            const template = posterTemplates[templateKey];
            const isSelected = posterTemplate === templateKey;
            return (
              <button
                key={templateKey}
                type="button"
                onClick={() => setPosterTemplate(templateKey)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-bold transition-colors cursor-pointer ${isSelected ? "border-[#7c1d1d] bg-white text-[#7c1d1d] shadow-sm" : "border-amber-200 bg-amber-50 text-stone-700 hover:bg-white"}`}
              >
                <span className={`h-3 w-3 rounded-full ${template.swatch}`} />
                {template.label}
              </button>
            );
          })}
        </div>
      )}
      <div className="hidden"><QRCodeCanvas id="mandapam-qr-canvas" value={publicUrl} size={1200} level="H" includeMargin /></div>
      <div className="min-h-0 flex flex-1 items-start justify-center overflow-y-auto pt-1 sm:items-center sm:pt-0">
        <div className="relative aspect-[4/5] h-[min(68dvh,680px)] max-h-full w-auto max-w-full sm:h-[min(72dvh,760px)]">
          <button onClick={share} aria-label="Share Mandapam URL" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#7c1d1d] shadow-lg ring-1 ring-amber-300 hover:bg-amber-50 cursor-pointer"><Share2 className="h-4 w-4" /></button>
          {designMode === "POSTER" ? (
            <div id="printable-standee" className={`h-full overflow-hidden rounded-[18px] border border-amber-300 shadow-xl ${activeTemplate.frame}`}>
              <div className={`relative flex h-full flex-col overflow-hidden px-[6%] py-[5%] text-center text-white ${activeTemplate.panel}`}>
                <img src={activeTemplate.asset} alt="" aria-hidden="true" className="absolute inset-x-0 top-0 h-[52%] w-full object-cover opacity-35 mix-blend-screen" />
                <img src={activeTemplate.asset} alt="" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[34%] w-full scale-y-[-1] object-cover opacity-20 mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/35 to-black/55" />
                <div className="pointer-events-none absolute left-[11%] right-[11%] top-[9%] h-[24%] rounded-t-full border-2 border-amber-300/50 border-b-0 bg-black/10" />
                <div className="pointer-events-none absolute left-[7%] top-[17%] h-[38%] w-3 rounded-full bg-amber-300/35 blur-[1px]" />
                <div className="pointer-events-none absolute right-[7%] top-[17%] h-[38%] w-3 rounded-full bg-amber-300/35 blur-[1px]" />
                <div className="relative h-1.5 w-full bg-amber-400" />
                <div className="relative mt-2 h-0.5 w-[39%] bg-amber-200" />

                <div className="relative mt-[7%] text-[11px] font-black uppercase tracking-wide text-white sm:text-base">
                  SHARAN NAVARATRI
                </div>
                <div className="relative mt-0.5 text-[8px] font-black text-amber-200 sm:text-xs">2026</div>

                <h3 className="relative mx-auto mt-[5%] max-w-[86%] font-serif text-[28px] font-black leading-tight text-amber-100 drop-shadow sm:text-5xl">
                  {mandapam.name}
                </h3>
                <p className="relative mt-[4%] text-[10px] font-black uppercase tracking-wide text-amber-100 sm:text-lg">
                  Scan for Darshan, Poojas & Mandapam Updates
                </p>

                <div className="relative mx-auto mt-[6%] flex w-[72%] flex-1 flex-col items-center justify-start overflow-hidden rounded-[22px] border-[5px] border-amber-400 bg-[#fffdf8] px-[5%] py-[6%] shadow-2xl sm:rounded-[34px] sm:border-[7px]">
                  <div className="pointer-events-none absolute left-[8%] right-[8%] top-[4%] h-[18%] rounded-t-full border-2 border-amber-300/60 border-b-0" />
                  <p className="text-[13px] font-black uppercase tracking-wide text-[#7c1d1d] sm:text-2xl">SCAN HERE</p>
                  <div className="mt-[7%] w-full bg-white p-[3%]">
                    <QRCodeSVG value={publicUrl} size={560} level="H" includeMargin className="h-auto w-full" />
                  </div>
                  <p className="mt-[7%] text-[10px] font-semibold text-stone-600 sm:text-base">
                    Open your Mandapam page instantly
                  </p>
                </div>

                <div className="relative mt-auto">
                  <div className="h-1.5 w-full bg-amber-400" />
                  <p className="mt-[4%] text-[10px] font-black text-white sm:text-lg">One QR. Every Mandapam. Every devotee.</p>
                  <p className="mt-1 text-[8px] font-bold text-amber-200 sm:text-sm">In service of Ammavari • Siddhi Dynamics LLP</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-[26px] border border-amber-300 bg-white p-5 shadow-xl">
              <p className="text-[10px] font-black tracking-[0.16em] text-[#7c1d1d] sm:text-xs">{mandapam.name.toUpperCase()}</p>
              <div className="mt-4 rounded-3xl border-4 border-amber-400 bg-white p-3 shadow-lg sm:p-5"><QRCodeSVG value={publicUrl} size={256} level="H" includeMargin className="h-44 w-44 sm:h-56 sm:w-56" /></div>
              <p className="mt-4 text-center text-xs font-bold text-stone-800 sm:text-sm">Scan to visit this Mandapam</p><p className="mt-1 text-center text-[10px] text-stone-500 sm:text-xs">Opens {mandapam.name} darshan, poojas and updates.</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 shrink-0 border-t border-amber-200 pt-2"><button onClick={downloadSelected} disabled={isDownloading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c1d1d] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#651717] disabled:opacity-70 cursor-pointer"><Download className="h-4 w-4" />{isDownloading ? "Creating download…" : designMode === "POSTER" ? "Download poster" : "Download QR code"}</button></div>
    </div>
  </div>;
};
