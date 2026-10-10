import { Mandapam } from "../types";

export const getMandapamDirectionsUrl = (
  mandapam?: Partial<Mandapam> | null
): string | undefined => {
  if (!mandapam) return undefined;

  // 1. If explicit Google Maps URL was provided by organizer or admin
  if (mandapam.googleMapsUrl && mandapam.googleMapsUrl.trim()) {
    return mandapam.googleMapsUrl.trim();
  }

  // 2. Otherwise construct query from address components entered during onboarding
  const queryParts = [mandapam.address, mandapam.area, mandapam.city, mandapam.state]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter(Boolean);

  if (queryParts.length > 0) {
    // If name is also present and distinct, include name for specificity
    const fullParts = mandapam.name && mandapam.name.trim()
      ? [mandapam.name.trim(), ...queryParts]
      : queryParts;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullParts.join(", "))}`;
  }

  // 3. No maps URL and no address provided
  return undefined;
};
