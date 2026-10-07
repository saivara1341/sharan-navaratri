import { Advertisement } from "../types";

export const isSiddhiDynamicsAd = (ad?: Advertisement | null) => {
  if (!ad) return false;
  const identity = `${ad.id || ""} ${ad.businessName || ""} ${ad.imageUrl || ""}`.toLowerCase();
  return identity.includes("siddhi-dynamics") || identity.includes("siddhi dynamics") || identity.includes("siddhi-");
};
