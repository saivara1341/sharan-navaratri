import React, { useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Download, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { Mandapam } from "../../types";
import siddhiLogoTransparent from "@/assets/siddhi-logo-transparent.png";

interface ShareQrModalProps {
  mandapam: Mandapam;
  isOpen: boolean;
  onClose: () => void;
}

const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const siddhiLogoAsset = new URL("../../../assets/siddhi-logo-transparent.png", import.meta.url).href;
type PosterTemplateId = "ROYAL_CLASSIC" | "LOTUS_GLOW" | "MODERN_DEVOTEE" | "TEMPLE_WHITE";
type PosterTone = "maroon" | "saffron" | "ink" | "white";

type PosterTemplate = {
  id: PosterTemplateId;
  label: string;
  tone: PosterTone;
  background: string;
  accent: string;
  text: string;
  muted: string;
  panel: string;
};

const posterTemplates: PosterTemplate[] = [
  {
    id: "ROYAL_CLASSIC",
    label: "Royal Classic",
    tone: "maroon",
    background: "linear-gradient(160deg, #fff8e7 0%, #ffe1aa 34%, #8b1e1e 35%, #4a0d0d 100%)",
    accent: "#f6b01e",
    text: "#7c1d1d",
    muted: "#78350f",
    panel: "rgba(255, 250, 240, 0.94)",
  },
  {
    id: "LOTUS_GLOW",
    label: "Lotus Glow",
    tone: "saffron",
    background: "radial-gradient(circle at 80% 12%, rgba(255, 183, 77, 0.8), transparent 28%), linear-gradient(180deg, #fff7ed 0%, #fed7aa 45%, #fb923c 100%)",
    accent: "#ea580c",
    text: "#9a3412",
    muted: "#7c2d12",
    panel: "rgba(255, 255, 255, 0.88)",
  },
  {
    id: "MODERN_DEVOTEE",
    label: "Modern Devotee",
    tone: "ink",
    background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 43%, #ffedd5 100%)",
    accent: "#dc2626",
    text: "#111827",
    muted: "#57534e",
    panel: "rgba(255, 255, 255, 0.94)",
  },
  {
    id: "TEMPLE_WHITE",
    label: "Temple White",
    tone: "white",
    background: "radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.34), transparent 30%), linear-gradient(180deg, #fffdf7 0%, #fff7ed 62%, #ffedd5 100%)",
    accent: "#b45309",
    text: "#8b1e1e",
    muted: "#7c2d12",
    panel: "rgba(255, 255, 255, 0.92)",
  },
];

const loadCanvasImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const fitFont = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxSize: number, minSize: number, family: string, weight = "900") => {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
};

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number, family: string, weight = "900", maxLines = 3) => {
  ctx.font = `${weight} ${fontSize}px ${family}`;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
};

const drawWrappedCenterText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  centerY: number,
  maxWidth: number,
  maxHeight: number,
  maxSize: number,
  minSize: number,
  color: string,
  family = "Georgia",
  weight = "900"
) => {
  for (let size = maxSize; size >= minSize; size -= 2) {
    const lines = wrapText(ctx, text, maxWidth, size, family, weight, 3);
    const lineHeight = size * 1.08;
    if (lines.length * lineHeight <= maxHeight) {
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => ctx.fillText(line, x, startY + index * lineHeight));
      return;
    }
  }
};

const fillRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lineWidth = 4) => {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.restore();
};

const drawCircularImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();
};

const drawPosterBackground = (ctx: CanvasRenderingContext2D, template: PosterTemplate) => {
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1536);
  if (template.tone === "maroon") {
    gradient.addColorStop(0, "#fff8e7");
    gradient.addColorStop(0.42, "#ffe8bd");
    gradient.addColorStop(0.43, "#8b1e1e");
    gradient.addColorStop(1, "#3a0909");
  } else if (template.tone === "saffron") {
    gradient.addColorStop(0, "#fff7ed");
    gradient.addColorStop(0.55, "#fed7aa");
    gradient.addColorStop(1, "#fb923c");
  } else if (template.tone === "ink") {
    gradient.addColorStop(0, "#fff7ed");
    gradient.addColorStop(0.5, "#ffffff");
    gradient.addColorStop(1, "#ffedd5");
  } else {
    gradient.addColorStop(0, "#fffdf7");
    gradient.addColorStop(0.7, "#fff7ed");
    gradient.addColorStop(1, "#ffedd5");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1536);

  ctx.save();
  ctx.globalAlpha = template.tone === "maroon" ? 0.2 : 0.12;
  ctx.fillStyle = template.accent;
  ctx.beginPath();
  ctx.arc(900, 140, 210, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, 1380, 240, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = template.accent;
  ctx.lineWidth = 8;
  ctx.globalAlpha = 0.8;
  ctx.strokeRect(34, 34, 956, 1468);
  ctx.restore();
};

const drawFeature = (ctx: CanvasRenderingContext2D, x: number, y: number, icon: string, title: string, subtitle: string, template: PosterTemplate) => {
  fillRoundRect(ctx, x, y, 205, 138, 26, "rgba(255,255,255,0.82)", "rgba(245, 158, 11, 0.32)", 3);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "42px Arial";
  ctx.fillText(icon, x + 102, y + 38);
  ctx.font = "900 25px Arial";
  ctx.fillStyle = template.text;
  ctx.fillText(title, x + 102, y + 82);
  ctx.font = "700 18px Arial";
  ctx.fillStyle = template.muted;
  ctx.fillText(subtitle, x + 102, y + 112);
};

const drawGeneratedPoster = async (
  ctx: CanvasRenderingContext2D,
  template: PosterTemplate,
  mandapam: Mandapam,
  mandapamLocation: string,
  publicUrl: string,
  qr: HTMLCanvasElement
) => {
  drawPosterBackground(ctx, template);

  try {
    const trishul = await loadCanvasImage(`${base}/navaratri/assets/trishula-head.png`);
    ctx.drawImage(trishul, 92, 92, 82, 82);
  } catch {
    ctx.font = "72px serif";
    ctx.fillText("🔱", 135, 130);
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = template.text;
  ctx.font = "900 56px Georgia";
  ctx.fillText("SHARAN NAVARATRI", 190, 134);
  ctx.font = "700 16px Arial";
  ctx.fillStyle = template.muted;
  ctx.fillText("ALL MANDAPAMS  |  ALL INFORMATION  |  FOR ALL DEVOTEES", 96, 226);

  fillRoundRect(ctx, 80, 300, 864, 250, 44, template.panel, template.accent, 5);
  fillRoundRect(ctx, 118, 340, 180, 180, 90, "rgba(255,255,255,0.92)", "rgba(245, 158, 11, 0.35)", 4);
  if (mandapam.logoUrl) {
    try {
      const logo = await loadCanvasImage(mandapam.logoUrl);
      drawCircularImage(ctx, logo, 140, 362, 136);
    } catch {
      ctx.fillStyle = template.muted;
      ctx.font = "900 22px Arial";
      ctx.textAlign = "center";
      ctx.fillText("MANDAPAM", 208, 424);
      ctx.fillText("LOGO", 208, 456);
    }
  }

  ctx.textAlign = "center";
  ctx.font = "700 24px Arial";
  ctx.fillStyle = template.muted;
  ctx.fillText("WELCOME TO", 620, 350);
  drawWrappedCenterText(ctx, mandapam.name.toUpperCase(), 620, 430, 510, 110, 48, 24, template.text);
  const locationFont = fitFont(ctx, mandapamLocation, 440, 23, 15, "Arial", "700");
  ctx.font = `700 ${locationFont}px Arial`;
  ctx.fillStyle = template.muted;
  ctx.fillText(mandapamLocation, 620, 520);

  fillRoundRect(ctx, 292, 590, 440, 440, 36, "rgba(255,255,255,0.96)", template.accent, 8);
  ctx.drawImage(qr, 342, 630, 340, 340);
  fillRoundRect(ctx, 300, 985, 424, 86, 28, template.tone === "ink" ? "#8b1e1e" : template.text, template.accent, 4);
  ctx.font = "900 42px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("SCAN HERE", 512, 1021);
  ctx.font = "700 17px Arial";
  ctx.fillText("TO VIEW TODAY'S DETAILS", 512, 1053);

  drawFeature(ctx, 70, 1122, "🌺", "Alankarana", "Today & Upcoming", template);
  drawFeature(ctx, 300, 1122, "🍚", "Naivedyam", "Today's Offerings", template);
  drawFeature(ctx, 530, 1122, "🍛", "Annadanam", "Timings & Details", template);
  drawFeature(ctx, 760, 1122, "🕘", "Puja Timings", "Daily Schedule", template);

  fillRoundRect(ctx, 80, 1348, 864, 110, 30, "rgba(255,255,255,0.82)", "rgba(245, 158, 11, 0.35)", 3);
  ctx.font = "900 30px Georgia";
  ctx.fillStyle = template.text;
  ctx.fillText("అమ్మవారి సేవలో", 270, 1404);
  try {
    const siddhiLogo = await loadCanvasImage(siddhiLogoAsset);
    ctx.drawImage(siddhiLogo, 520, 1368, 92, 72);
  } catch {
    ctx.font = "900 24px Arial";
    ctx.fillText("SIDDHI", 560, 1398);
  }
  ctx.font = "900 28px Arial";
  ctx.fillStyle = "#111827";
  ctx.fillText("SIDDHI DYNAMICS LLP", 744, 1398);
  ctx.font = "700 15px Arial";
  ctx.fillStyle = template.muted;
  ctx.fillText("TECHNOLOGY INITIATIVE", 744, 1430);
};

export const ShareQrModal: React.FC<ShareQrModalProps> = ({ mandapam, isOpen, onClose }) => {
  const [designMode, setDesignMode] = useState<"POSTER" | "QR">("POSTER");
  const [posterTemplateId, setPosterTemplateId] = useState<PosterTemplateId>("ROYAL_CLASSIC");
  const [isDownloading, setIsDownloading] = useState(false);
  if (!isOpen) return null;

  const mandapamPublicId = mandapam.slug || mandapam.id;
  const shareUrl = `${window.location.origin}${base}/navaratri/m/${encodeURIComponent(mandapamPublicId)}`;
  const publicUrl = `${shareUrl}?source=qr`;
  const activeTemplate = posterTemplates.find((template) => template.id === posterTemplateId) || posterTemplates[0];
  const mandapamLocation = [mandapam.area, mandapam.city].filter(Boolean).join(", ") || mandapam.address || "Your Mandapam Location";
  const hasLogo = Boolean(mandapam.logoUrl);

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
      canvas.width = 1024;
      canvas.height = 1536;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No canvas context");

      await drawGeneratedPoster(ctx, activeTemplate, mandapam, mandapamLocation, publicUrl, qr);

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsDownloading(false);
          return toast.error("Could not create poster.");
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${mandapam.slug}-qr-poster.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("QR poster downloaded.");
        setIsDownloading(false);
      }, "image/png");
    } catch {
      setIsDownloading(false);
      toast.error("Could not create poster. Please try again.");
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

  const posterPreview = (template: PosterTemplate, compact = false) => (
    <div className="relative h-full overflow-hidden rounded-[18px] border border-amber-300 bg-white shadow-xl" style={{ background: template.background }}>
      <div className="absolute -right-[18%] top-[2%] h-[25%] w-[45%] rounded-full opacity-25 blur-md" style={{ backgroundColor: template.accent }} />
      <div className="absolute -left-[18%] bottom-[2%] h-[28%] w-[48%] rounded-full opacity-20 blur-md" style={{ backgroundColor: template.accent }} />
      <div className="absolute inset-[3%] rounded-[20px] border-2 border-white/50" />
      {!compact && <button onClick={share} aria-label="Share Mandapam URL" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#7c1d1d] shadow-lg ring-1 ring-amber-300 hover:bg-amber-50 cursor-pointer"><Share2 className="h-4 w-4" /></button>}

      <div className="absolute left-[8%] top-[6.2%] flex items-center gap-[2.2%]">
        <img src={`${base}/navaratri/assets/trishula-head.png`} alt="" className="h-[7cqw] w-[7cqw] object-contain" />
        <p className="whitespace-nowrap font-serif text-[6.5cqw] font-black uppercase leading-none" style={{ color: template.text }}>Sharan Navaratri</p>
      </div>
      <p className="absolute left-[8%] top-[17%] text-[2cqw] font-bold uppercase tracking-[0.2em]" style={{ color: template.muted }}>All Mandapams • All Information • For All Devotees</p>

      <div className="absolute left-[8%] right-[8%] top-[23%] flex h-[17%] items-center gap-[5%] rounded-[6cqw] border border-amber-300/60 p-[4%] shadow-sm" style={{ background: template.panel }}>
        <div className="grid aspect-square h-[86%] shrink-0 place-items-center overflow-hidden rounded-full border border-amber-300/70 bg-white/85 p-[2%]">
          {hasLogo ? <img src={mandapam.logoUrl} alt={`${mandapam.name} logo`} className="h-full w-full rounded-full object-cover" /> : <span className="text-center text-[2cqw] font-black uppercase leading-tight text-stone-500">Mandapam<br />Logo</span>}
        </div>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[2cqw] font-bold uppercase tracking-[0.28em]" style={{ color: template.muted }}>Welcome to</p>
          <p className="line-clamp-3 font-serif text-[4.2cqw] font-black uppercase leading-[0.94]" style={{ color: template.text }}>{mandapam.name}</p>
          <p className="mt-[1.5%] truncate text-[2.15cqw] font-bold" style={{ color: template.muted }}>{mandapamLocation}</p>
        </div>
      </div>

      <div className="absolute left-1/2 top-[48%] w-[41%] -translate-x-1/2 -translate-y-1/2 rounded-[4cqw] border-[0.7cqw] bg-white p-[4%] shadow-xl" style={{ borderColor: template.accent }}>
        <QRCodeSVG value={publicUrl} size={560} level="H" includeMargin className="h-full w-full" />
      </div>
      <div className="absolute left-1/2 top-[61.5%] w-[50%] -translate-x-1/2 rounded-[3cqw] px-[2%] py-[2.2%] text-center text-white shadow-lg" style={{ background: template.tone === "ink" ? "#8b1e1e" : template.text }}>
        <p className="text-[4.1cqw] font-black uppercase leading-none">Scan Here</p>
        <p className="mt-[1%] text-[1.65cqw] font-bold uppercase tracking-[0.22em]">View today's details</p>
      </div>

      <div className="absolute left-[6%] right-[6%] top-[70.5%] grid grid-cols-4 gap-[2%]">
        {[
          ["🌺", "Alankarana"],
          ["🍚", "Naivedyam"],
          ["🍛", "Annadanam"],
          ["🕘", "Puja Timings"],
        ].map(([icon, label]) => (
          <div key={label} className="rounded-[3cqw] bg-white/92 px-[1%] py-[8%] text-center shadow-sm ring-1 ring-amber-300/80">
            <div className="text-[5cqw] leading-none drop-shadow-sm">{icon}</div>
            <p className="mt-[8%] text-[2.15cqw] font-black leading-tight text-stone-950">{label}</p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-[5%] left-[8%] right-[8%] flex items-center justify-between rounded-[3cqw] border border-amber-200/70 bg-white/82 px-[4%] py-[2.5%] shadow-sm">
        <p className="text-[3.2cqw] font-serif font-black" style={{ color: template.text }}>అమ్మవారి సేవలో</p>
        <div className="flex items-center gap-[2%]">
          <img src={siddhiLogoTransparent} alt="Siddhi Dynamics LLP" className="h-[8cqw] w-[8cqw] object-contain" />
          <div className="text-right leading-tight">
            <p className="text-[3cqw] font-black text-orange-600">SIDDHI</p>
            <p className="text-[2.4cqw] font-black text-stone-900">DYNAMICS LLP</p>
          </div>
        </div>
      </div>
    </div>
  );

  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/80 p-2 backdrop-blur-sm sm:p-4">
    <div className="relative flex h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-[#fffaf0] p-3 shadow-2xl sm:h-[calc(100dvh-2rem)] sm:p-4">
      <button onClick={onClose} aria-label="Close Mandapam QR" className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full border border-stone-300 bg-white text-stone-700 shadow-md hover:bg-stone-100"><X className="h-5 w-5" /></button>
      <div className="mb-2 shrink-0 pr-12"><h2 className="font-serif text-lg font-black text-[#7c1d1d]">Mandapam QR Code</h2><p className="mt-0.5 text-[11px] text-stone-600">This QR opens this Mandapam page directly for devotees.</p></div>
      <div className="mb-2 grid shrink-0 grid-cols-2 rounded-2xl border border-amber-200 bg-amber-50 p-1 text-xs font-bold">
        <button type="button" onClick={() => setDesignMode("POSTER")} className={`rounded-xl px-3 py-2 transition-colors cursor-pointer ${designMode === "POSTER" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>Poster design</button>
        <button type="button" onClick={() => setDesignMode("QR")} className={`rounded-xl px-3 py-2 transition-colors cursor-pointer ${designMode === "QR" ? "bg-[#7c1d1d] text-white shadow-sm" : "text-stone-700 hover:bg-white"}`}>QR only</button>
      </div>
      {designMode === "POSTER" && (
        <div className="mb-2 grid shrink-0 grid-cols-4 gap-1.5">
          {posterTemplates.map((template) => {
            const isSelected = posterTemplateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setPosterTemplateId(template.id)}
                className={`aspect-[2/3] overflow-hidden rounded-xl border bg-white p-0.5 transition-all cursor-pointer [container-type:inline-size] ${isSelected ? "border-[#7c1d1d] shadow-sm ring-2 ring-[#7c1d1d]/20" : "border-amber-200 hover:border-amber-400"}`}
                aria-label={`Use ${template.label} template`}
                title={template.label}
              >
                {posterPreview(template, true)}
              </button>
            );
          })}
        </div>
      )}
      <div className="hidden"><QRCodeCanvas id="mandapam-qr-canvas" value={publicUrl} size={1200} level="H" includeMargin /></div>
      <div className="min-h-0 flex flex-1 items-start justify-center overflow-y-auto pt-1 sm:items-center sm:pt-0">
        <div className="relative aspect-[2/3] h-[min(68dvh,680px)] max-h-full w-auto max-w-full [container-type:inline-size] sm:h-[min(72dvh,760px)]">
          {designMode === "POSTER" ? posterPreview(activeTemplate) : (
            <div className="flex h-full flex-col items-center justify-center rounded-[26px] border border-amber-300 bg-white p-5 shadow-xl">
              <p className="text-center text-[10px] font-black tracking-[0.16em] text-[#7c1d1d] sm:text-xs">{mandapam.name.toUpperCase()}</p>
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
