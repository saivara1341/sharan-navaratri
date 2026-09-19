import {
  ProjectLifecycleMeta,
  BankingDetails,
  DEFAULT_BANKING_DETAILS,
  DEFAULT_BANK_ACCOUNTS,
  ProjectInvoice,
  ProjectUpdate
} from "@/types/projectLifecycle";

export { DEFAULT_BANKING_DETAILS, DEFAULT_BANK_ACCOUNTS };

export function parseProjectMeta(raw: string | null | undefined): ProjectLifecycleMeta {
  if (!raw) {
    return {
      banking_details: { ...DEFAULT_BANKING_DETAILS },
      invoices: [],
      updates: []
    };
  }

  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) {
    // Legacy plain string agreement
    return {
      agreement: trimmed,
      banking_details: { ...DEFAULT_BANKING_DETAILS },
      invoices: [],
      updates: []
    };
  }

  try {
    const parsed = JSON.parse(trimmed);
    return {
      ...parsed,
      banking_details: parsed.banking_details || { ...DEFAULT_BANKING_DETAILS },
      invoices: Array.isArray(parsed.invoices) ? parsed.invoices : [],
      updates: Array.isArray(parsed.updates) ? parsed.updates : []
    };
  } catch {
    return {
      agreement: trimmed,
      banking_details: { ...DEFAULT_BANKING_DETAILS },
      invoices: [],
      updates: []
    };
  }
}

export function serializeProjectMeta(meta: ProjectLifecycleMeta): string {
  return JSON.stringify(meta);
}

export function generateInvoiceId(existingInvoices?: ProjectInvoice[]): string {
  const count = (existingInvoices?.length || 0) + 1;
  return `SD-INV-${String(count).padStart(3, "0")}`;
}
