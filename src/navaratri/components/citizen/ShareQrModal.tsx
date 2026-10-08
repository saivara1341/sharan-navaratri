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
type PosterTemplateId = "DEVOTION_GUIDE" | "DEVOTIONAL_POSTER" | "MODERN_QR" | "CLASSIC_QR";

type Box = { x: number; y: number; w: number; h: number };
type TemplateTextTone = "warm" | "red" | "ink";

interface PosterTemplate {
  id: PosterTemplateId;
  label: string;
  asset: string;
  nameBox: Box;
  qrBox: Box;
  logoBox?: Box;
  locationBox?: Box;
  tone: TemplateTextTone;
}

const posterTemplates: PosterTemplate[] = [
  {
    id: "DEVOTION_GUIDE",
    label: "Devotion Guide",
    asset: `${base}/navaratri/assets/qr-template-devotion-guide.png`,
    nameBox: { x: 72, y: 370, w: 430, h: 132 },
    locationBox: { x: 132, y: 536, w: 360, h: 44 },
    logoBox: { x: 570, y: 400, w: 150, h: 150 },
    qrBox: { x: 398, y: 640, w: 230, h: 230 },
    tone: "ink",
  },
  {
    id: "DEVOTIONAL_POSTER",
    label: "Devotional Poster",
    asset: `${base}/navaratri/assets/qr-template-devotional-poster.png`,
    nameBox: { x: 285, y: 465, w: 450, h: 116 },
    locationBox: { x: 394, y: 618, w: 330, h: 40 },
    logoBox: { x: 112, y: 50, w: 118, h: 118 },
    qrBox: { x: 398, y: 720, w: 230, h: 230 },
    tone: "ink",
  },
  {
    id: "MODERN_QR",
    label: "Modern QR",
    asset: `${base}/navaratri/assets/qr-template-modern-poster.png`,
    nameBox: { x: 72, y: 460, w: 420, h: 132 },
    locationBox: { x: 122, y: 645, w: 335, h: 38 },
    logoBox: { x: 548, y: 460, w: 150, h: 150 },
    qrBox: { x: 398, y: 785, w: 230, h: 230 },
    tone: "ink",
  },
  {
    id: "CLASSIC_QR",
    label: "Classic QR",
    asset: `${base}/navaratri/assets/qr-template-classic-poster.png`,
    nameBox: { x: 438, y: 420, w: 435, h: 132 },
    logoBox: { x: 142, y: 410, w: 160, h: 160 },
    qrBox: { x: 398, y: 685, w: 230, h: 230 },
    tone: "red",
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

const cssBox = (box: Box): React.CSSProperties => ({
  left: `${(box.x / 1024) * 100}%`,
  top: `${(box.y / 1536) * 100}%`,
  width: `${(box.w / 1024) * 100}%`,
  height: `${(box.h / 1536) * 100}%`,
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

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number, family: string, weight = "900") => {
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
  return lines.slice(0, 3);
};

const fitWrappedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  box: Box,
  maxSize: number,
  minSize: number,
  family: string,
  weight = "900"
) => {
  const maxWidth = box.w - 44;
  const maxHeight = box.h - 28;
  for (let size = maxSize; size >= minSize; size -= 2) {
    const lines = wrapText(ctx, text, maxWidth, size, family, weight);
    const lineHeight = size * 1.08;
    if (lines.length * lineHeight <= maxHeight && lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
      return { size, lines, lineHeight };
    }
  }
  return { size: minSize, lines: wrapText(ctx, text, maxWidth, minSize, family, weight), lineHeight: minSize * 1.08 };
};

const previewNameSize = (box: Box) => `clamp(10px, ${(box.w / 1024) * 5.8}cqw, 25px)`;

const drawRoundedImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, box: Box) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(box.x + box.w / 2, box.y + box.h / 2, Math.min(box.w, box.h) / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, box.x, box.y, box.w, box.h);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(box.x + box.w / 2, box.y + box.h / 2, Math.min(box.w, box.h) / 2, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.stroke();
};

export const ShareQrModal: React.FC<ShareQrModalProps> = ({ mandapam, isOpen, onClose }) => {
  const [designMode, setDesignMode] = useState<"POSTER" | "QR">("POSTER");
  const [posterTemplateId, setPosterTemplateId] = useState<PosterTemplateId>("DEVOTION_GUIDE");
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

      const templateImage = await loadCanvasImage(activeTemplate.asset);
      ctx.drawImage(templateImage, 0, 0, 1024, 1536);

      const { nameBox, locationBox, logoBox, qrBox, tone } = activeTemplate;
      ctx.save();
      ctx.fillStyle = tone === "red" ? "rgba(255, 252, 245, 0.92)" : "rgba(255, 250, 242, 0.88)";
      ctx.beginPath();
      ctx.roundRect(nameBox.x, nameBox.y, nameBox.w, nameBox.h, 24);
      ctx.fill();
      ctx.restore();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fittedName = fitWrappedText(ctx, mandapam.name.toUpperCase(), nameBox, tone === "red" ? 42 : 44, 20, "Georgia");
      ctx.font = `900 ${fittedName.size}px Georgia`;
      ctx.fillStyle = tone === "red" ? "#991b1b" : "#111827";
      const startY = nameBox.y + nameBox.h / 2 - ((fittedName.lines.length - 1) * fittedName.lineHeight) / 2;
      fittedName.lines.forEach((line, index) => ctx.fillText(line, nameBox.x + nameBox.w / 2, startY + index * fittedName.lineHeight));

      if (locationBox) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
        ctx.beginPath();
        ctx.roundRect(locationBox.x, locationBox.y, locationBox.w, locationBox.h, 18);
        ctx.fill();
        ctx.fillStyle = "#1f2937";
        const locationFont = fitFont(ctx, mandapamLocation, locationBox.w - 36, 24, 15, "Arial", "700");
        ctx.font = `700 ${locationFont}px Arial`;
        ctx.fillText(mandapamLocation, locationBox.x + locationBox.w / 2, locationBox.y + locationBox.h / 2 + 1);
        ctx.restore();
      }

      if (logoBox) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
        ctx.beginPath();
        ctx.arc(logoBox.x + logoBox.w / 2, logoBox.y + logoBox.h / 2, Math.min(logoBox.w, logoBox.h) / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (mandapam.logoUrl) {
          try {
            const logo = await loadCanvasImage(mandapam.logoUrl);
            drawRoundedImage(ctx, logo, logoBox);
          } catch {
            // Leave the clean logo holder if the uploaded logo cannot be loaded into canvas.
          }
        }
      }

      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(qrBox.x - 12, qrBox.y - 12, qrBox.w + 24, qrBox.h + 24, 18);
      ctx.fill();
      ctx.drawImage(qr, qrBox.x, qrBox.y, qrBox.w, qrBox.h);
      ctx.restore();

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
                className={`overflow-hidden rounded-xl border bg-white p-0.5 transition-all cursor-pointer ${isSelected ? "border-[#7c1d1d] shadow-sm ring-2 ring-[#7c1d1d]/20" : "border-amber-200 hover:border-amber-400"}`}
                aria-label={`Use ${template.label} template`}
                title={template.label}
              >
                <img src={template.asset} alt="" className="aspect-[4/5] w-full rounded-lg object-cover" />
              </button>
            );
          })}
        </div>
      )}
      <div className="hidden"><QRCodeCanvas id="mandapam-qr-canvas" value={publicUrl} size={1200} level="H" includeMargin /></div>
      <div className="min-h-0 flex flex-1 items-start justify-center overflow-y-auto pt-1 sm:items-center sm:pt-0">
        <div className="relative aspect-[2/3] h-[min(68dvh,680px)] max-h-full w-auto max-w-full [container-type:inline-size] sm:h-[min(72dvh,760px)]">
          <button onClick={share} aria-label="Share Mandapam URL" className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#7c1d1d] shadow-lg ring-1 ring-amber-300 hover:bg-amber-50 cursor-pointer"><Share2 className="h-4 w-4" /></button>
          {designMode === "POSTER" ? (
            <div id="printable-standee" className="relative h-full overflow-hidden rounded-[18px] border border-amber-300 bg-white shadow-xl">
              <img src={activeTemplate.asset} alt="Selected Navaratri QR poster template" className="absolute inset-0 h-full w-full object-cover" />
              <div className={`absolute flex items-center justify-center rounded-2xl px-[3%] text-center font-serif font-black leading-tight ${activeTemplate.tone === "red" ? "bg-white/90 text-[#991b1b]" : "bg-[#fffaf2]/90 text-stone-950"}`} style={cssBox(activeTemplate.nameBox)}>
                <span className="line-clamp-3 uppercase drop-shadow-sm" style={{ fontSize: previewNameSize(activeTemplate.nameBox) }}>{mandapam.name}</span>
              </div>
              {activeTemplate.locationBox && (
                <div className="absolute flex items-center justify-center rounded-full bg-white/90 px-[2%] text-center text-[clamp(8px,1.7vh,15px)] font-bold text-stone-800" style={cssBox(activeTemplate.locationBox)}>
                  <span className="truncate">{mandapamLocation}</span>
                </div>
              )}
              {activeTemplate.logoBox && (
                <div className="absolute overflow-hidden rounded-full bg-white/90 p-[1.2%] shadow-sm ring-2 ring-white/70" style={cssBox(activeTemplate.logoBox)}>
                  {hasLogo ? <img src={mandapam.logoUrl} alt={`${mandapam.name} logo`} className="h-full w-full rounded-full object-cover" /> : <div className="grid h-full w-full place-items-center rounded-full text-center text-[clamp(7px,1.6vh,13px)] font-black uppercase leading-tight text-stone-500">Mandapam<br />Logo</div>}
                </div>
              )}
              <div className="absolute rounded-xl bg-white p-[1.2%] shadow-sm" style={cssBox(activeTemplate.qrBox)}>
                <QRCodeSVG value={publicUrl} size={560} level="H" includeMargin className="h-full w-full" />
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
