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

export const downloadMandapamCredentials = (mandapam: Mandapam) => {
  const passcode = mandapam.passcode || "123456";
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

Generated On: ${new Date().toLocaleString()}
Sharan Navaratri 2026 Devotional Platform
======================================================================`;

  const blob = new Blob([slipContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Mandapam-${mandapam.id}-Access-Credentials.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("Mandapam ID & Passcode downloaded successfully!");
};
