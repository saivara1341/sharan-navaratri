export interface BankAccount {
  id: string;
  account_holder: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_type?: string;
  is_selected: boolean;
}

export interface BankingDetails {
  account_holder: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  upi_id?: string;
  llpin?: string;
  pan?: string;
  poc_name?: string;
  poc_phone?: string;
  office_address?: string;
  share_banking_details: boolean;
  online_payment_enabled?: boolean;
  notes?: string;
  accounts?: BankAccount[];
}

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "llp",
    account_holder: "Siddhi Dynamics LLP",
    bank_name: "State Bank of India (SBI)",
    account_number: "45170121323",
    ifsc_code: "SBIN0021632",
    account_type: "Current / Firm Account",
    is_selected: true
  },
  {
    id: "partner",
    account_holder: "Sarugu Sai Vara Prasad",
    bank_name: "State Bank of India (SBI)",
    account_number: "62495383611",
    ifsc_code: "SBIN0021632",
    account_type: "Designated Partner / Savings Account",
    is_selected: true
  }
];

export const DEFAULT_BANKING_DETAILS: BankingDetails = {
  account_holder: "Siddhi Dynamics LLP",
  bank_name: "State Bank of India (SBI)",
  account_number: "45170121323",
  ifsc_code: "SBIN0021632",
  upi_id: "6303602743@sbi",
  llpin: "ACX-6222",
  pan: "AFXFS7312H",
  poc_name: "Sarugu Sai Vara Prasad",
  poc_phone: "+91 6303602743",
  office_address: "3-5-260/2, Shivaji Nagar Rd, Kotagally, near Veterinary Hospital, Nizamabad, Telangana 503001",
  share_banking_details: true,
  online_payment_enabled: true,
  notes: "Advance payment is non-refundable once work commences. Balance payment due before final handover.",
  accounts: DEFAULT_BANK_ACCOUNTS
};

export interface ClientServiceFormData {
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  preferred_contact_time: string;
  business_goal: string;
  target_audience: string;
  key_requirements: string;
  materials_provided: string[];
  pending_materials_date?: string;
  confirmed_at: string;
}

export interface ProjectInvoice {
  id: string;
  title: string;
  amount: string;
  numeric_amount: number;
  due_date: string;
  status: "pending" | "paid" | "cancelled";
  description?: string;
  paid_at?: string;
  cashfree_link_id?: string;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  visible_to_client: boolean;
}

export interface ProjectLifecycleMeta {
  // Quoting & Agreement
  agreement?: string; // total price quote string (e.g. "₹25,000")
  total_amount?: number;
  payment_structure?: string; // "50% Advance + 50% on Delivery" | "100% Advance" | ...
  advance_percentage?: number; // 50, 100, etc.
  advance_amount?: string;
  scope_summary?: string;

  // Dates
  service_start_date?: string; // Set when advance is paid or manually set by admin
  deadline?: string; // Estimated completion date
  website_url?: string;

  // Banking Details shared by admin (locked until advance payment)
  banking_details?: BankingDetails;

  // Client-submitted Onboarding / Service Form
  service_form?: ClientServiceFormData;

  // Invoices & Updates
  invoices?: ProjectInvoice[];
  updates?: ProjectUpdate[];
}
