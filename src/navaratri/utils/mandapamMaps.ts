import { Mandapam } from "../types";

export const getMandapamDirectionsUrl = (
  mandapam: Partial<Mandapam> & Pick<Mandapam, "googleMapsUrl">
) => {
  if (mandapam.googleMapsUrl && mandapam.googleMapsUrl.trim()) {
    return mandapam.googleMapsUrl.trim();
  }

  const queryParts = [mandapam.name, mandapam.address, mandapam.area, mandapam.city]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter(Boolean);

  if (queryParts.length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryParts.join(", "))}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Nizamabad")}`;
};
