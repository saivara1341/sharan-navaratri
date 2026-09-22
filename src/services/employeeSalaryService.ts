import { supabase } from "@/integrations/supabase/client";

export interface EmployeeBankingDetails {
  id: string;
  employee_email: string;
  employee_name: string;
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  upi_id?: string;
  pan_number?: string;
  branch_name?: string;
  status: 'Pending Admin Review' | 'Verified for Salary' | 'Incomplete';
  last_updated: string;
}

export interface SalaryPayoutRecord {
  id: string;
  employee_email: string;
  employee_name: string;
  amount: number;
  pay_period: string; // e.g. "September 2026"
  transaction_ref: string;
  payment_method: 'NEFT/RTGS' | 'IMPS' | 'UPI' | 'Direct Bank Transfer';
  disbursed_at: string;
  disbursed_by: string;
  status: 'Disbursed' | 'Processing';
  notes?: string;
}

const BANKING_KEY = 'sd_employee_banking_details';
const PAYOUTS_KEY = 'sd_employee_salary_payouts';

const DEFAULT_BANKING: EmployeeBankingDetails[] = [
  {
    id: 'bank-1',
    employee_email: 'employee@siddhidynamics.in',
    employee_name: 'Engineering Team Member',
    account_holder_name: 'Engineering Lead',
    account_number: '50100492817263',
    bank_name: 'HDFC Bank Ltd',
    ifsc_code: 'HDFC0001234',
    upi_id: 'engineer@hdfcbank',
    pan_number: 'ABCDE1234F',
    branch_name: 'Hyderabad Cyberabad Branch',
    status: 'Verified for Salary',
    last_updated: '2026-09-01'
  }
];

const DEFAULT_PAYOUTS: SalaryPayoutRecord[] = [
  {
    id: 'pay-1',
    employee_email: 'employee@siddhidynamics.in',
    employee_name: 'Engineering Team Member',
    amount: 45000,
    pay_period: 'August 2026',
    transaction_ref: 'NEFT-SD-20260831-9821',
    payment_method: 'NEFT/RTGS',
    disbursed_at: '2026-08-31',
    disbursed_by: 'Sarugu Sai Vara Prasad (CEO)',
    status: 'Disbursed',
    notes: 'Monthly engineering compensation'
  }
];

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw);
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage error in salary service:", e);
  }
}

export const employeeSalaryService = {
  getBankingDetails(email?: string): EmployeeBankingDetails | null {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    const all = getLocal<EmployeeBankingDetails[]>(BANKING_KEY, DEFAULT_BANKING);
    return all.find(b => b.employee_email.toLowerCase() === clean) || null;
  },

  getAllBankingDetails(): EmployeeBankingDetails[] {
    return getLocal<EmployeeBankingDetails[]>(BANKING_KEY, DEFAULT_BANKING);
  },

  saveBankingDetails(details: Omit<EmployeeBankingDetails, 'id' | 'last_updated'>): EmployeeBankingDetails {
    const cleanEmail = details.employee_email.trim().toLowerCase();
    const all = this.getAllBankingDetails();
    const existingIdx = all.findIndex(b => b.employee_email.toLowerCase() === cleanEmail);

    const record: EmployeeBankingDetails = {
      ...details,
      employee_email: cleanEmail,
      id: existingIdx >= 0 ? all[existingIdx].id : 'bank-' + Math.random().toString(36).substring(2, 9),
      last_updated: new Date().toISOString().split('T')[0],
      status: details.status || 'Pending Admin Review'
    };

    let updated: EmployeeBankingDetails[];
    if (existingIdx >= 0) {
      updated = [...all];
      updated[existingIdx] = record;
    } else {
      updated = [record, ...all];
    }

    setLocal(BANKING_KEY, updated);

    // Sync to Supabase in background
    try {
      (supabase as any)
        .from('portal_users')
        .update({
          banking_info: record,
          updated_at: new Date().toISOString()
        })
        .eq('email', cleanEmail)
        .then(() => {})
        .catch(() => {});
    } catch (_) {}

    return record;
  },

  updateBankingStatus(id: string, status: EmployeeBankingDetails['status']): EmployeeBankingDetails[] {
    const all = this.getAllBankingDetails();
    const updated = all.map(b => b.id === id ? { ...b, status } : b);
    setLocal(BANKING_KEY, updated);
    return updated;
  },

  getPayouts(email?: string): SalaryPayoutRecord[] {
    const all = getLocal<SalaryPayoutRecord[]>(PAYOUTS_KEY, DEFAULT_PAYOUTS);
    if (!email) return all;
    const clean = email.trim().toLowerCase();
    return all.filter(p => p.employee_email.toLowerCase() === clean);
  },

  recordPayout(payout: Omit<SalaryPayoutRecord, 'id' | 'disbursed_at'>): SalaryPayoutRecord {
    const record: SalaryPayoutRecord = {
      ...payout,
      id: 'payout-' + Math.random().toString(36).substring(2, 9),
      disbursed_at: new Date().toISOString().split('T')[0],
      status: 'Disbursed'
    };
    const all = this.getPayouts();
    const updated = [record, ...all];
    setLocal(PAYOUTS_KEY, updated);
    return record;
  }
};
