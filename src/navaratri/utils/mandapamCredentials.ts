import { Mandapam } from "../types";
import { toast } from "sonner";

export const generatePasscode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const copyToClipboard = async (text: string, label: string = "Text") => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  } catch {
    toast.info(`Could not copy automatically. Value: ${text}`);
  }
};

// In-memory runtime cache for the active session - NEVER stored in browser frontend storage (localStorage/sessionStorage)
const inMemorySessionCredentials = new Map<string, string>();

// Clean up any legacy credentials from previous versions
const PRIVATE_CREDENTIALS_KEY = "navaratri_private_organizer_credentials";
try {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PRIVATE_CREDENTIALS_KEY);
  }
} catch {
  // ignore
}

export const savePrivateCredentials = (mandapamId: string, passcode: string) => {
  // Store only in volatile memory during the active session. Do NOT store doc/credentials in frontend storage.
  inMemorySessionCredentials.set(mandapamId, passcode);
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PRIVATE_CREDENTIALS_KEY);
    }
  } catch {
    // ignore
  }
};

export const getPrivatePasscode = (mandapamId: string, fallback?: string): string => {
  if (inMemorySessionCredentials.has(mandapamId)) {
    return inMemorySessionCredentials.get(mandapamId)!;
  }
  return fallback || "123456";
};

export const downloadMandapamCredentials = (mandapam: Mandapam, sessionPasscode?: string) => {
  // Security: The document is generated purely on-the-fly and downloaded directly.
  // It is NEVER saved to localStorage, sessionStorage, or frontend document storage.
  const passcode = sessionPasscode || getPrivatePasscode(mandapam.id, mandapam.passcode);
  const portalUrl = `${window.location.origin}${window.location.pathname.includes("/sharan-navaratri") ? "/sharan-navaratri" : ""}/navaratri/organizer`;
  const mandapamUrl = `${window.location.origin}${window.location.pathname.includes("/sharan-navaratri") ? "/sharan-navaratri" : ""}/navaratri/m/${mandapam.slug}`;

  const slipContent = `======================================================================
  SHARAN NAVARATRI 2026 - OFFICIAL MANDAPAM ACCESS SLIP
======================================================================

🕉️ MANDAPAM DETAILS:
----------------------------------------------------------------------
Mandapam Name       : ${mandapam.name}
Official Mandapam ID: ${mandapam.id}
Passcode / PIN      : ${passcode}
Devi Alankarana     : ${mandapam.deviName}
Location            : ${mandapam.area}, ${mandapam.city}, ${mandapam.state}
Address             : ${mandapam.address}

👤 COMMITTEE CONTACT:
----------------------------------------------------------------------
Organizer / Samithi : ${mandapam.organizerName}
Contact Mobile       : ${mandapam.organizerMobile}
Email                : ${mandapam.organizerEmail || "Not provided"}

🔐 HOW TO LOGIN TO ORGANIZER PORTAL:
----------------------------------------------------------------------
1. Open Portal URL:
   ${portalUrl}

2. Enter your Login Credentials:
   - Mandapam ID     : ${mandapam.id}   (or your mobile: ${mandapam.organizerMobile})
   - Passcode / PIN  : ${passcode}

3. Click "Login to Mandapam Dashboard" to:
   ✓ Update Daily Maa Darshan & Alankarana with photos
   ✓ Publish Live Announcements & Bhajan / Pallaki Seva updates
   ✓ Announce Maha Annadanam timings & venue
   ✓ Manage Citizen Pooja bookings & walk-in tokens
   ✓ Print Official QR Standee for your Mandapam stage

🌐 PUBLIC MANDAPAM PAGE (FOR DEVOTEES):
----------------------------------------------------------------------
${mandapamUrl}

⚠️ SECURITY NOTICE:
Keep this access slip safely with the Mandapam President, Secretary,
or Treasurer. Do not share your passcode with unauthorized persons.
Note: For maximum confidentiality, this access slip document is NOT stored
in frontend browser storage. It has been downloaded directly to your device.

Generated On: ${new Date().toLocaleString()}
Sharan Navaratri 2026 Devotional Platform
======================================================================`;

  // Create temporary in-memory blob for direct download; do not persist in browser storage
  const blob = new Blob([slipContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Mandapam-${mandapam.id}-Access-Slip.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke object URL immediately to ensure it does not linger in memory
  URL.revokeObjectURL(url);
  toast.success("Access Slip downloaded! (Zero copies stored in frontend storage)");
};
