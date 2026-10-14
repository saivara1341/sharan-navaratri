import { StandardFestivalDay } from "../types";
import { toast } from "sonner";

export interface ShareOptions {
  mandapamName?: string;
  language?: string;
  customDeviName?: string;
}

/**
 * Formats a catchy devotional message for Day 1 to Day 10 festival days,
 * formatted specially for WhatsApp Status and social sharing.
 */
export function formatDayWhatsAppMessage(
  day: StandardFestivalDay,
  options?: ShareOptions
): string {
  const lang = options?.language || "en";
  const customDevi = options?.customDeviName;

  const deviTitle = customDevi || (
    lang === "te"
      ? `${day.teluguDeviName} (${day.deviName})`
      : lang === "hi"
      ? `${day.hindiDeviName} (${day.deviName})`
      : `${day.deviName} • ${day.teluguDeviName}`
  );

  // Formulate absolute image URL for WhatsApp preview card
  let fullImageUrl = "";
  if (day.imageUrl) {
    if (day.imageUrl.startsWith("http://") || day.imageUrl.startsWith("https://")) {
      fullImageUrl = day.imageUrl;
    } else {
      const origin = typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://sharan-navratri.vercel.app";
      const cleanPath = day.imageUrl.startsWith("/") ? day.imageUrl : `/${day.imageUrl}`;
      fullImageUrl = `${origin}${cleanPath}`;
    }
  }

  const appUrl = typeof window !== "undefined" && window.location?.origin
    ? `${window.location.origin}/navaratri/know`
    : "https://sharan-navratri.vercel.app/navaratri/know";

  const lines: string[] = [
    `🚩 *SHARAD NAVARATRI • DAY ${day.dayNumber}* 🌸`,
    `✨ *${deviTitle}*`,
    options?.mandapamName ? `🏛️ *Mandapam:* ${options.mandapamName}` : "",
    `📅 *Date:* ${day.date} (${day.tithi})`,
    `🎨 *Auspicious Color:* ${day.colorName}`,
    "",
    `🕉️ *Moola Mantra / మూల మంత్రం:*`,
    `"${day.sacredChanting.moolaMantra}"`,
    "",
    `📖 *Sacred Slokam / శ్లోకం:*`,
    `"${day.sacredChanting.sloka}"`,
    "",
    `🪔 *Suggested Offering / నైవేద్యం:*`,
    `${day.suggestedOfferings}`,
    "",
    `🖼️ *Divine Lord Darshan Image:*`,
    fullImageUrl,
    "",
    `🙏 *May Maa ${day.deviName} bless you & your family with divine grace, peace, health & prosperity!*`,
    `🌐 View 10-Day Festival Schedule: ${appUrl}`,
    `#Navaratri2026 #SharanNavaratri #MaaDurga #NavaratriStatus #Devotional`
  ];

  return lines.filter((line) => line !== null && line !== undefined && line !== false).join("\n");
}

/**
 * Shares the day's devotional details directly to WhatsApp (opens WhatsApp Status / Chat selector).
 */
export function shareDayToWhatsApp(
  day: StandardFestivalDay,
  options?: ShareOptions
): void {
  try {
    const text = formatDayWhatsAppMessage(day, options);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  } catch (err) {
    console.error("Failed to share on WhatsApp:", err);
    toast.error("Could not open WhatsApp. Please try again.");
  }
}

/**
 * Copies the formatted devotional status text to clipboard for manual posting.
 */
export async function copyDayStatusText(
  day: StandardFestivalDay,
  options?: ShareOptions
): Promise<void> {
  try {
    const text = formatDayWhatsAppMessage(day, options);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      toast.success("Devotional WhatsApp status copied to clipboard! 📋");
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Devotional status text copied! 📋");
    }
  } catch (err) {
    console.error("Failed to copy status text:", err);
    toast.error("Failed to copy text.");
  }
}
