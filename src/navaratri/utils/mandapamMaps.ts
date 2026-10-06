import { Mandapam } from "../types";

export const getMandapamDirectionsUrl = (mandapam: Pick<Mandapam, "googleMapsUrl" | "latitude" | "longitude">) => {
  if (mandapam.googleMapsUrl) return mandapam.googleMapsUrl;
  return `https://www.google.com/maps/dir/?api=1&destination=${mandapam.latitude},${mandapam.longitude}`;
};
