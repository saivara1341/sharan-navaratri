/**
 * DPDP Act, 2023 — consent utilities.
 * Consent is free, specific, informed, unconditional, unambiguous and
 * as easy to withdraw as it is to give (Sec. 6).
 */

export type ConsentCategory = "necessary" | "preferences" | "analytics";

export type ConsentRecord = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  /** ISO timestamp of when the choice was recorded */
  timestamp: string;
  /** Version of the notice the person agreed to */
  noticeVersion: string;
};

export const CONSENT_NOTICE_VERSION = "2026-08-dpdp-v1";
const STORAGE_KEY = "sd_dpdp_consent";

export const readConsent = (): ConsentRecord | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.noticeVersion !== CONSENT_NOTICE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveConsent = (choice: { preferences: boolean; analytics: boolean }): ConsentRecord => {
  const record: ConsentRecord = {
    necessary: true,
    preferences: choice.preferences,
    analytics: choice.analytics,
    timestamp: new Date().toISOString(),
    noticeVersion: CONSENT_NOTICE_VERSION,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent("sd-consent-changed", { detail: record }));
  } catch {
    /* storage unavailable — treat as session-only consent */
  }
  return record;
};

export const withdrawConsent = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("sd-consent-changed", { detail: null }));
  } catch {
    /* noop */
  }
};

export const hasConsent = (category: ConsentCategory) => {
  if (category === "necessary") return true;
  const record = readConsent();
  return Boolean(record?.[category]);
};
