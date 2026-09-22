export interface ParsedSubmissionMessage {
  selectedServices: string[];
  budgetPreference: string | null;
  consentTimestamp: string | null;
  outreach: string | null;
  requestedStartDate: string | null;
  attachments: string[];
  cleanMessage: string;
}

/**
 * Parses raw bracket-encoded metadata in submission messages, e.g.:
 * [Selected Services: requirement, 🚀 SEO, GEO & AEO Programme] [Budget Preference: FLEXIBLE] [Consent: granted at ...]
 * and returns clean structured metadata along with the actual user message.
 */
export function parseSubmissionMessage(rawMessage: string | null | undefined): ParsedSubmissionMessage {
  if (!rawMessage) {
    return {
      selectedServices: [],
      budgetPreference: null,
      consentTimestamp: null,
      outreach: null,
      requestedStartDate: null,
      attachments: [],
      cleanMessage: ""
    };
  }

  let text = rawMessage.trim();
  const selectedServices: string[] = [];
  let budgetPreference: string | null = null;
  let consentTimestamp: string | null = null;
  let outreach: string | null = null;
  let requestedStartDate: string | null = null;
  const attachments: string[] = [];

  // 1. Extract Selected Services
  const servicesMatch = text.match(/\[(?:Selected Services|SERVICES REQUESTED):\s*([^\]]+)\]/i);
  if (servicesMatch) {
    const rawContent = servicesMatch[1];
    const rawList = rawContent.split(',').map(s => s.trim()).filter(Boolean);
    
    // Filter out internal marker strings like "requirement", "contact", "general", "lead"
    const cleaned = rawList.filter(s => !['requirement', 'contact', 'general', 'lead'].includes(s.toLowerCase()));

    // Normalize GBP aliases first so they aren't confused with SEO/GEO
    const normalizeGbp = (s: string) => {
      if (/google business profile/i.test(s) || /\bgbp\b/i.test(s) || /gbp optim/i.test(s)) {
        return "📍 GBP Optimization";
      }
      return s;
    };

    const normalizedCleaned = cleaned.map(normalizeGbp);

    // Recombine SEO, GEO, and AEO components into 1 single service if both/multiple are present
    const combined: string[] = [];
    let hasSeo = false;
    let hasGeoOrAeo = false;
    let seoItem = "";
    const otherItems: string[] = [];

    for (const item of normalizedCleaned) {
      const isPureSeo = /^(🚀\s*)?SEO$/i.test(item.trim()) || /^Search Engine Optimization$/i.test(item.trim());
      const isGeoOrAeo = /GEO/i.test(item) || /AEO/i.test(item);
      const isFullSeoGeoAeo = /SEO/i.test(item) && (/GEO/i.test(item) || /AEO/i.test(item));
      // Don't merge GBP into SEO group
      const isGbp = /📍|GBP Optim/i.test(item);

      if (isGbp) {
        otherItems.push(item);
      } else if (isFullSeoGeoAeo) {
        hasSeo = true;
        hasGeoOrAeo = true;
      } else if (isPureSeo) {
        hasSeo = true;
        seoItem = item;
      } else if (isGeoOrAeo) {
        hasGeoOrAeo = true;
      } else {
        otherItems.push(item);
      }
    }

    if (hasSeo && hasGeoOrAeo) {
      // SEO + (GEO or AEO) requested -> Combine into 1 single service
      combined.push("🚀 SEO, GEO & AEO Programme");
    } else if (hasSeo && !hasGeoOrAeo) {
      // Only SEO requested -> keep that as 1 service
      combined.push(seoItem || "🚀 SEO");
    } else if (!hasSeo && hasGeoOrAeo) {
      // Only GEO/AEO requested
      combined.push("GEO & AEO Programme");
    }

    combined.push(...otherItems);

    selectedServices.push(...(combined.length > 0 ? combined : (cleaned.length > 0 ? cleaned : rawList)));
  }

  // 2. Extract Budget Preference
  const budgetMatch = text.match(/\[Budget Preference:\s*([^\]]+)\]/i);
  if (budgetMatch) {
    budgetPreference = budgetMatch[1].trim();
  }

  // 3. Extract Consent
  const consentMatch = text.match(/\[Consent:\s*(?:granted at\s*)?([^\]]+)\]/i);
  if (consentMatch) {
    consentTimestamp = consentMatch[1].trim();
  }

  // 4. Extract Outreach
  const outreachMatch = text.match(/\[Outreach:\s*([^\]]+)\]/i);
  if (outreachMatch) {
    outreach = outreachMatch[1].trim();
  }

  // 5. Extract Requested Service Start
  const startMatch = text.match(/\[(?:Requested Service Start|Start Date):\s*([^\]]+)\]/i);
  if (startMatch) {
    requestedStartDate = startMatch[1].trim();
  }

  // 6. Extract Attachments
  const attachMatch = text.match(/\[Attachments?:\s*([^\]]+)\]/i);
  if (attachMatch) {
    attachments.push(...attachMatch[1].split(',').map(s => s.trim()).filter(Boolean));
  }

  // 7. Strip all bracket tags from text
  let clean = text
    .replace(/\[(?:Selected Services|SERVICES REQUESTED):[^\]]*\]/gi, '')
    .replace(/\[Budget Preference:[^\]]*\]/gi, '')
    .replace(/\[Consent:[^\]]*\]/gi, '')
    .replace(/\[Outreach:[^\]]*\]/gi, '')
    .replace(/\[(?:Requested Service Start|Start Date):[^\]]*\]/gi, '')
    .replace(/\[Attachments?:[^\]]*\]/gi, '')
    .replace(/\[[^\]]+:[^\]]+\]/g, '') // strip any remaining generic bracket pairs like [Key: Value]
    .trim();

  // Strip all variations of boilerplate consent sentences, even if repeated or truncated
  clean = clean
    .replace(/I consent to Siddhi Dynamics LLP[\s\S]*/gi, '')
    .replace(/I have read the privacy notice[\s\S]*/gi, '')
    .trim();

  const fallbackSummary = selectedServices.length > 0
    ? `Engagement requested for ${selectedServices.join(", ")}.`
    : "Initial project requirement and scope discovery.";

  return {
    selectedServices,
    budgetPreference,
    consentTimestamp,
    outreach,
    requestedStartDate,
    attachments,
    cleanMessage: clean || fallbackSummary
  };
}
