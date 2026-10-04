/**
 * Navaratri Ad Creative Helpers
 * Supports:
 * 1. Automatic aspect-ratio conversion (Portrait -> 16:9 Landscape with ambient festive wings or center crop)
 * 2. Digital Visiting Card canvas generator
 * 3. Text & Festive Offer Bulletin canvas generator
 */

export interface ImageDimensions {
  width: number;
  height: number;
  isPortrait: boolean;
  ratio: number;
}

/**
 * Inspect image dimensions and orientation
 */
export function inspectImageAspectRatio(src: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const ratio = width / Math.max(height, 1);
      resolve({
        width,
        height,
        isPortrait: height > width * 1.05,
        ratio
      });
    };
    img.onerror = () => reject(new Error("Could not load image to inspect aspect ratio"));
    img.src = src;
  });
}

/**
 * Convert any portrait or square image into a 16:9 widescreen landscape banner.
 * - 'festive-wings': Places the sharp portrait photo in the center with atmospheric blurred backdrop & gold borders.
 * - 'crop-center': Crops the 16:9 center region.
 */
export function convertImageToLandscapeCanvas(
  src: string,
  mode: "festive-wings" | "crop-center" = "festive-wings",
  targetWidth = 1280,
  targetHeight = 720
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        if (mode === "crop-center") {
          const targetRatio = targetWidth / targetHeight;
          const imgRatio = img.naturalWidth / img.naturalHeight;
          let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
          if (imgRatio > targetRatio) {
            sw = img.naturalHeight * targetRatio;
            sx = (img.naturalWidth - sw) / 2;
          } else {
            sh = img.naturalWidth / targetRatio;
            sy = (img.naturalHeight - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
        } else {
          // Festive Wings: Full 16:9 widescreen banner with ambient backdrop
          // 1. Base deep maroon / terracotta background
          const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, 0);
          bgGrad.addColorStop(0, "#4A0E0E");
          bgGrad.addColorStop(0.5, "#7A1515");
          bgGrad.addColorStop(1, "#8A2A0E");
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // 2. Blurred ambient background from original image
          ctx.save();
          ctx.filter = "blur(32px) brightness(0.65)";
          ctx.drawImage(img, -40, -40, targetWidth + 80, targetHeight + 80);
          ctx.restore();

          // 3. Subtle dark vignette scrim
          const scrim = ctx.createLinearGradient(0, 0, 0, targetHeight);
          scrim.addColorStop(0, "rgba(0,0,0,0.45)");
          scrim.addColorStop(0.5, "rgba(0,0,0,0.15)");
          scrim.addColorStop(1, "rgba(0,0,0,0.55)");
          ctx.fillStyle = scrim;
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // 4. Center the original portrait image cleanly at full height
          const paddingY = 24;
          const maxH = targetHeight - (paddingY * 2);
          const drawW = img.naturalWidth * (maxH / img.naturalHeight);
          const drawX = (targetWidth - drawW) / 2;
          const drawY = paddingY;

          // Shadow behind centered photo
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 28;
          ctx.shadowOffsetY = 6;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(drawX, drawY, drawW, maxH);
          ctx.restore();

          // Draw the original photo
          ctx.drawImage(img, drawX, drawY, drawW, maxH);

          // Gold ornate frame around the photo
          ctx.strokeStyle = "#F59E0B";
          ctx.lineWidth = 4;
          ctx.strokeRect(drawX, drawY, drawW, maxH);

          // Subtle corner accents
          ctx.fillStyle = "#FDE68A";
          const cornerSize = 12;
          ctx.fillRect(drawX - 2, drawY - 2, cornerSize, cornerSize);
          ctx.fillRect(drawX + drawW - cornerSize + 2, drawY - 2, cornerSize, cornerSize);
          ctx.fillRect(drawX - 2, drawY + maxH - cornerSize + 2, cornerSize, cornerSize);
          ctx.fillRect(drawX + drawW - cornerSize + 2, drawY + maxH - cornerSize + 2, cornerSize, cornerSize);
        }

        resolve(canvas.toDataURL("image/jpeg", 0.92));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for landscape conversion"));
    img.src = src;
  });
}

/**
 * Generate a Digital Visiting Card image on HTML5 canvas
 */
export function generateVisitingCardCanvas(data: {
  businessName: string;
  contactPerson?: string;
  tagline?: string;
  category: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city: string;
  targetZone?: string;
  theme?: "terracotta" | "maroon" | "gold" | "royal";
}): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const themeColors = {
    terracotta: { bg1: "#6B1414", bg2: "#8F2418", accent: "#F59E0B", textMain: "#FFFFFF", textSub: "#FDE68A" },
    maroon: { bg1: "#450A0A", bg2: "#781B1B", accent: "#FBBF24", textMain: "#FFFFFF", textSub: "#FEF08A" },
    gold: { bg1: "#78350F", bg2: "#B45309", accent: "#FEF3C7", textMain: "#FFFFFF", textSub: "#FDE68A" },
    royal: { bg1: "#1E1B4B", bg2: "#3730A3", accent: "#FCD34D", textMain: "#FFFFFF", textSub: "#E0E7FF" }
  };
  const theme = themeColors[data.theme || "terracotta"];

  // 1. Background gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, theme.bg1);
  grad.addColorStop(1, theme.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Outer Ornate Double Border
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  // Corner decorative marks
  const corners = [
    [24, 24], [canvas.width - 24, 24],
    [24, canvas.height - 24], [canvas.width - 24, canvas.height - 24]
  ];
  ctx.fillStyle = theme.accent;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Header Auspicious Ribbon
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(40, 40, canvas.width - 80, 50);

  ctx.fillStyle = theme.accent;
  ctx.font = "bold 20px 'Cinzel', Georgia, serif";
  ctx.textAlign = "left";
  ctx.fillText("॥ SHARAN NAVARATRI 2026 FESTIVAL SPONSOR ॥", 60, 72);

  ctx.textAlign = "right";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText(`📍 ${data.targetZone || "Local Zone"}, ${data.city}`, canvas.width - 60, 72);

  // 4. Business Category Badge
  ctx.fillStyle = theme.accent;
  ctx.font = "bold 18px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`CATEGORY: ${data.category.toUpperCase()}`, 60, 140);

  // 5. Business Name (Large & Bold)
  ctx.fillStyle = theme.textMain;
  ctx.font = "bold 56px 'Cinzel', Georgia, serif";
  ctx.fillText(data.businessName || "Your Business Name", 60, 210);

  // 6. Tagline / Speciality
  ctx.fillStyle = theme.textSub;
  ctx.font = "italic 26px Georgia, serif";
  ctx.fillText(data.tagline || "Specialists in Quality & Traditional Service", 60, 260);

  // 7. Divider Line
  ctx.strokeStyle = "rgba(253, 230, 138, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 290);
  ctx.lineTo(canvas.width - 60, 290);
  ctx.stroke();

  // 8. Contact Details (Left side: Proprietor & Address, Right side: Phone & WhatsApp)
  if (data.contactPerson) {
    ctx.fillStyle = theme.textSub;
    ctx.font = "bold 22px sans-serif";
    ctx.fillText(`Proprietor: ${data.contactPerson}`, 60, 340);
  }

  if (data.address) {
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "20px sans-serif";
    ctx.fillText(`Store: ${data.address}`, 60, 390);
  }

  // Right side Call / WhatsApp action box
  const boxX = canvas.width - 480;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.roundRect ? ctx.roundRect(boxX, 330, 420, 210, 16) : ctx.fillRect(boxX, 330, 420, 210);
  ctx.fill();
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = theme.accent;
  ctx.font = "bold 22px sans-serif";
  ctx.fillText("FOR ORDERS & ENQUIRIES:", boxX + 24, 375);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 32px monospace";
  ctx.fillText(`📞 +91 ${data.phone || "9848012345"}`, boxX + 24, 430);

  if (data.whatsapp) {
    ctx.fillStyle = "#86EFAC";
    ctx.font = "bold 26px monospace";
    ctx.fillText(`💬 WhatsApp: ${data.whatsapp}`, boxX + 24, 485);
  }

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "16px sans-serif";
  ctx.fillText("Verified Local Business • Sharan Navaratri Nizamabad", 60, 560);

  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * Generate a Text & Festive Offer Bulletin canvas image
 */
export function generateTextBulletinCanvas(data: {
  businessName: string;
  headline: string;
  discountTag?: string;
  bulletPoints?: string[];
  phone: string;
  city: string;
  targetZone?: string;
  ctaText?: string;
  theme?: "maroon" | "crimson" | "gold" | "royal";
}): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const themeColors = {
    maroon: { bg1: "#450A0A", bg2: "#781B1B", bg3: "#B45309", border: "#FCD34D", badgeBg: "#F59E0B", badgeText: "#781B1B" },
    crimson: { bg1: "#7A1515", bg2: "#9A241C", bg3: "#B45309", border: "#FCD34D", badgeBg: "#F59E0B", badgeText: "#781B1B" },
    gold: { bg1: "#582806", bg2: "#853708", bg3: "#B45309", border: "#FEF08A", badgeBg: "#FBBF24", badgeText: "#451A03" },
    royal: { bg1: "#1E1B4B", bg2: "#312E81", bg3: "#4338CA", border: "#FCD34D", badgeBg: "#FCD34D", badgeText: "#1E1B4B" }
  };
  const currentTheme = themeColors[data.theme || "crimson"];

  // 1. Festive gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, currentTheme.bg1);
  grad.addColorStop(0.5, currentTheme.bg2);
  grad.addColorStop(1, currentTheme.bg3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Gold border frame
  ctx.strokeStyle = currentTheme.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // 3. Discount / Announcement Badge
  const tag = (data.discountTag || "FESTIVE SPECIAL OFFER").toUpperCase();
  ctx.fillStyle = currentTheme.badgeBg;
  ctx.roundRect ? ctx.roundRect(60, 50, 360, 44, 22) : ctx.fillRect(60, 50, 360, 44);
  ctx.fill();
  ctx.fillStyle = currentTheme.badgeText;
  ctx.font = "bold 20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`★ ${tag} ★`, 240, 80);

  // Top Right Business Name
  ctx.textAlign = "right";
  ctx.fillStyle = "#FEF3C7";
  ctx.font = "bold 26px 'Cinzel', Georgia, serif";
  ctx.fillText(data.businessName || "Local Business", canvas.width - 60, 80);

  // 4. Headline
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 44px 'Cinzel', Georgia, serif";
  ctx.fillText(data.headline || "Special Festive Offers & Discounts", 60, 175);

  // 5. Bullet Points
  const points = data.bulletPoints && data.bulletPoints.length > 0
    ? data.bulletPoints
    : [
        "100% Satvik & Authentic Traditional Preparation",
        "Free Delivery to All Mandapams Across the Zone",
        "Special Festive Discounts on Advance Bookings"
      ];

  let startY = 250;
  points.forEach((pt) => {
    // Check circle
    ctx.fillStyle = "#34D399";
    ctx.beginPath();
    ctx.arc(80, startY - 8, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#064E3B";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓", 80, startY - 2);

    // Text
    ctx.textAlign = "left";
    ctx.fillStyle = "#FEF9C3";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(pt, 115, startY);
    startY += 60;
  });

  // 6. Action Button Bar at bottom
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(40, canvas.height - 130, canvas.width - 80, 90);

  ctx.fillStyle = "#FBBF24";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(`📍 ${data.targetZone || "Local Zone"}, ${data.city} • 📞 ${data.phone}`, 60, canvas.height - 75);

  // CTA button
  const cta = (data.ctaText || "Order Now / Call").toUpperCase();
  const ctaW = 340;
  const ctaX = canvas.width - ctaW - 60;
  ctx.fillStyle = "#D97706";
  ctx.roundRect ? ctx.roundRect(ctaX, canvas.height - 115, ctaW, 60, 16) : ctx.fillRect(ctaX, canvas.height - 115, ctaW, 60);
  ctx.fill();
  ctx.strokeStyle = "#FEF08A";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${cta} ↗`, ctaX + ctaW / 2, canvas.height - 78);

  return canvas.toDataURL("image/jpeg", 0.92);
}
