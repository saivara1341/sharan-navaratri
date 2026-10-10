import { Mandapam } from "../types";

export const getMandapamMapsUrl = (
  mandapam?: Partial<Mandapam> | null
): string | undefined => {
  if (!mandapam) return undefined;
  if (mandapam.googleMapsUrl && mandapam.googleMapsUrl.trim()) {
    return mandapam.googleMapsUrl.trim();
  }
  return undefined;
};

export const getMandapamFormattedAddress = (
  mandapam?: Partial<Mandapam> | null
): string => {
  if (!mandapam) return "";
  const parts = [mandapam.address, mandapam.area, mandapam.city, mandapam.state]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter(Boolean);
  return parts.join(", ");
};

export const getMandapamDirectionsUrl = (
  mandapam?: Partial<Mandapam> | null
): string | undefined => {
  return getMandapamMapsUrl(mandapam);
};
