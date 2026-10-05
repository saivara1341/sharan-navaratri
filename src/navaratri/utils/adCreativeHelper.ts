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
  ctx.fillText(`📞 +91 ${data.phone || "9XXXXXXXXX"}`, boxX + 24, 430);

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
export type FestiveBulletinThemeId =
  | "swarna-gold"
  | "shakthi-crimson"
  | "peacock-sapphire"
  | "emerald-vrindavan"
  | "maroon"
  | "crimson"
  | "gold"
  | "royal";

export function generateTextBulletinCanvas(data: {
  businessName: string;
  headline: string;
  discountTag?: string;
  bulletPoints?: string[];
  phone: string;
  city: string;
  targetZone?: string;
  ctaText?: string;
  theme?: FestiveBulletinThemeId;
}): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Canonical theme map
  const themeMap: Record<string, {
    bg1: string;
    bg2: string;
    bg3: string;
    glow: string;
    borderGold: string;
    borderInner: string;
    badgeBg: string;
    badgeText: string;
    ctaBg1: string;
    ctaBg2: string;
    tagIcon: string;
  }> = {
    "swarna-gold": {
      bg1: "#381403",
      bg2: "#78350F",
      bg3: "#B45309",
      glow: "rgba(251, 191, 36, 0.22)",
      borderGold: "#F59E0B",
      borderInner: "#FEF08A",
      badgeBg: "#FEF3C7",
      badgeText: "#78350F",
      ctaBg1: "#D97706",
      ctaBg2: "#78350F",
      tagIcon: "🔱"
    },
    "shakthi-crimson": {
      bg1: "#3B0505",
      bg2: "#781B1B",
      bg3: "#991B1B",
      glow: "rgba(239, 68, 68, 0.20)",
      borderGold: "#FBBF24",
      borderInner: "#FDE68A",
      badgeBg: "#FDE68A",
      badgeText: "#781B1B",
      ctaBg1: "#DC2626",
      ctaBg2: "#781B1B",
      tagIcon: "🌺"
    },
    "peacock-sapphire": {
      bg1: "#050B1A",
      bg2: "#0F172A",
      bg3: "#164E63",
      glow: "rgba(56, 189, 248, 0.22)",
      borderGold: "#FACC15",
      borderInner: "#BAE6FD",
      badgeBg: "#FDE047",
      badgeText: "#0F172A",
      ctaBg1: "#0284C7",
      ctaBg2: "#0F172A",
      tagIcon: "🦚"
    },
    "emerald-vrindavan": {
      bg1: "#022013",
      bg2: "#064E3B",
      bg3: "#065F46",
      glow: "rgba(52, 211, 153, 0.20)",
      borderGold: "#FBBF24",
      borderInner: "#A7F3D0",
      badgeBg: "#FEF3C7",
      badgeText: "#064E3B",
      ctaBg1: "#059669",
      ctaBg2: "#064E3B",
      tagIcon: "🌿"
    }
  };

  // Map legacy IDs to new rich themes
  let rawTheme = data.theme || "swarna-gold";
  if (rawTheme === "gold") rawTheme = "swarna-gold";
  else if (rawTheme === "crimson" || rawTheme === "maroon") rawTheme = "shakthi-crimson";
  else if (rawTheme === "royal") rawTheme = "peacock-sapphire";

  const currentTheme = themeMap[rawTheme] || themeMap["swarna-gold"];

  // 1. Festive base gradient
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, currentTheme.bg1);
  grad.addColorStop(0.5, currentTheme.bg2);
  grad.addColorStop(1, currentTheme.bg3);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Radial ambient golden glow in center
  const radial = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 80, canvas.width / 2, canvas.height / 2, canvas.width / 1.5);
  radial.addColorStop(0, currentTheme.glow);
  radial.addColorStop(1, "transparent");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Ornate 24K Gold Outer & Inner Frame
  ctx.strokeStyle = currentTheme.borderGold;
  ctx.lineWidth = 5;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  ctx.strokeStyle = currentTheme.borderInner;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);

  // Decorative Corner Flourishes
  const corners = [
    [32, 32],
    [canvas.width - 32, 32],
    [32, canvas.height - 32],
    [canvas.width - 32, canvas.height - 32]
  ];
  ctx.fillStyle = currentTheme.borderGold;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top Auspicious Invocation Bar
  ctx.font = "bold 13px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "rgba(254, 243, 199, 0.75)";
  ctx.textAlign = "center";
  ctx.fillText("॥ ॐ శ్రీ మాత్రే నమః ॥ • SHARAN NAVARATRI 2026 UTSAV SPECIAL", canvas.width / 2, 45);

  // 3. Discount / Announcement Badge
  const tag = (data.discountTag || "FESTIVE SPECIAL OFFER").toUpperCase();
  ctx.fillStyle = currentTheme.badgeBg;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(56, 60, 380, 46, 23);
    ctx.fill();
    ctx.strokeStyle = currentTheme.borderGold;
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillRect(56, 60, 380, 46);
  }

  ctx.fillStyle = currentTheme.badgeText;
  ctx.font = "bold 19px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${currentTheme.tagIcon} ${tag} ${currentTheme.tagIcon}`, 246, 90);

  // Top Right Business Name with Gold Underline
  ctx.textAlign = "right";
  ctx.fillStyle = "#FFFBEB";
  ctx.font = "bold 28px 'Cinzel', Georgia, serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 8;
  ctx.fillText(data.businessName || "Local Business", canvas.width - 56, 92);
  ctx.shadowBlur = 0;

  // 4. Headline
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 44px 'Cinzel', Georgia, serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fillText(data.headline || "Special Festive Offers & Discounts", 56, 185);
  ctx.shadowBlur = 0;

  // 5. Bullet Points with Auspicious Check Marks
  const points = data.bulletPoints && data.bulletPoints.length > 0
    ? data.bulletPoints
    : [
        "100% Satvik & Authentic Traditional Preparation",
        "Free Delivery to All Mandapams Across the Zone",
        "Special Festive Discounts on Advance Bookings"
      ];

  let startY = 265;
  points.forEach((pt) => {
    // Check circle
    ctx.fillStyle = "#10B981";
    ctx.beginPath();
    ctx.arc(78, startY - 8, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FEF3C7";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✓", 78, startY - 3);

    // Text with slight shadow
    ctx.textAlign = "left";
    ctx.fillStyle = "#FEF9C3";
    ctx.font = "bold 23px sans-serif";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 6;
    ctx.fillText(pt, 110, startY);
    ctx.shadowBlur = 0;
    startY += 62;
  });

  // 6. Modern Glassmorphic Action Bar at bottom
  const barY = canvas.height - 128;
  const barH = 88;
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(42, barY, canvas.width - 84, barH, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(254, 243, 199, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    ctx.fillRect(42, barY, canvas.width - 84, barH);
  }

  // Location & Contact info
  ctx.fillStyle = "#FDE68A";
  ctx.font = "bold 21px sans-serif";
  ctx.fillText(`📍 ${data.targetZone || "Local Zone"}, ${data.city}   •   📞 ${data.phone}`, 68, barY + 52);

  // Modern CTA Button
  const cta = (data.ctaText || "Order Now / Call").toUpperCase();
  const ctaW = 320;
  const ctaH = 58;
  const ctaX = canvas.width - ctaW - 64;
  const ctaY = barY + 15;

  const ctaGrad = ctx.createLinearGradient(ctaX, 0, ctaX + ctaW, 0);
  ctaGrad.addColorStop(0, currentTheme.ctaBg1);
  ctaGrad.addColorStop(1, currentTheme.ctaBg2);
  ctx.fillStyle = ctaGrad;

  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(ctaX, ctaY, ctaW, ctaH, 16);
    ctx.fill();
    ctx.strokeStyle = currentTheme.borderInner;
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillRect(ctaX, ctaY, ctaW, ctaH);
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 21px sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 6;
  ctx.fillText(`${cta} ↗`, ctaX + ctaW / 2, ctaY + 36);
  ctx.shadowBlur = 0;

  return canvas.toDataURL("image/jpeg", 0.92);
}
