import { Advertisement } from "../types";

export interface AdCtaInfo {
  label: string;
  type: "order" | "view" | "call" | "external";
  iconName: "utensils" | "external-link" | "shopping-bag" | "phone" | "globe" | "info";
}

/**
 * Computes context-aware dynamic CTA button for any advertisement based on:
 * - Specific CTA text configured by user (e.g., "Visit PrintFlow", "Order Now")
 * - Category of the ad (e.g. Food/Sweets -> "Order Now", Company/Tech -> "Open / More Details", Silks -> "Shop Now")
 */
export function getAdCtaDetails(
  ad?: Partial<Advertisement> | null,
  fallbackCategory?: string
): AdCtaInfo {
  const category = (ad?.category || fallbackCategory || "").toLowerCase();
  const rawCta = ad?.ctaText?.trim();

  // If a custom specific CTA is already provided (and not generic "Contact Store")
  if (rawCta && rawCta !== "Contact Store") {
    const lowerCta = rawCta.toLowerCase();
    if (lowerCta.includes("order") || lowerCta.includes("food") || lowerCta.includes("sweet")) {
      return { label: rawCta, type: "order", iconName: "utensils" };
    }
    if (lowerCta.includes("shop") || lowerCta.includes("buy")) {
      return { label: rawCta, type: "view", iconName: "shopping-bag" };
    }
    if (lowerCta.includes("call") || lowerCta.includes("phone")) {
      return { label: rawCta, type: "call", iconName: "phone" };
    }
    return { label: rawCta, type: "external", iconName: "external-link" };
  }

  // 1. Food, Sweets, Catering, Prasadam, Bakery
  if (
    category.includes("sweet") ||
    category.includes("food") ||
    category.includes("catering") ||
    category.includes("prasadam") ||
    category.includes("bakery") ||
    category.includes("restaurant")
  ) {
    return { label: "Order Now", type: "order", iconName: "utensils" };
  }

  // 2. Flowers & Pooja Items
  if (category.includes("pooja") || category.includes("flower") || category.includes("garland")) {
    return { label: "Order Now", type: "order", iconName: "shopping-bag" };
  }

  // 3. Clothing, Silks, Sarees, Jewellery
  if (
    category.includes("silk") ||
    category.includes("clothing") ||
    category.includes("saree") ||
    category.includes("jewel")
  ) {
    return { label: "View Collection", type: "view", iconName: "shopping-bag" };
  }

  // 4. Technology, IT, Corporate, Software, Agency
  if (
    category.includes("tech") ||
    category.includes("software") ||
    category.includes("company") ||
    category.includes("service")
  ) {
    return { label: "Open / More Details", type: "external", iconName: "external-link" };
  }

  // 5. General Local Business Fallback
  return { label: "More Details", type: "view", iconName: "external-link" };
}

/**
 * Returns suggested default CTA text when user switches categories in form
 */
export function getDefaultCtaForCategory(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes("sweet") || cat.includes("food") || cat.includes("catering") || cat.includes("prasadam")) {
    return "Order Now";
  }
  if (cat.includes("pooja") || cat.includes("flower")) {
    return "Order Now";
  }
  if (cat.includes("clothing") || cat.includes("silk") || cat.includes("jewel")) {
    return "Shop Now";
  }
  if (cat.includes("tech") || cat.includes("company") || cat.includes("service")) {
    return "Open / More Details";
  }
  return "More Details";
}
