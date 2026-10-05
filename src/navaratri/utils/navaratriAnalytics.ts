import { supabase } from "@/integrations/supabase/client";

export type NavaratriAnalyticsEventType = "QR_SCAN" | "AD_CLICK" | "AD_IMPRESSION";

const getVisitorId = () => {
  const key = "navaratri_analytics_visitor_id";
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID ? crypto.randomUUID() : `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export const recordNavaratriAnalyticsEvent = (
  eventType: NavaratriAnalyticsEventType,
  details: { mandapamId?: string | null; adId?: string | null; placement?: string | null } = {}
) => {
  try {
    void (supabase.from("navaratri_analytics_events") as any).insert({
      event_type: eventType,
      mandapam_id: details.mandapamId || null,
      ad_id: details.adId || null,
      visitor_id: getVisitorId(),
      metadata: details.placement ? { placement: details.placement } : {},
    });
  } catch {
    // Analytics must never interrupt the devotee experience.
  }
};
