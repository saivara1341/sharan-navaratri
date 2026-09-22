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
    account_holder: "SIDDHI DYNAMICS PVT LTD",
    bank_name: "State Bank of India (SBI)",
    account_number: "45170121323",
    ifsc_code: "SBIN0020149",
    account_type: "Corporate / Current Account",
    is_selected: true
  },
  {
    id: "partner",
    account_holder: "Sarugu Sai Vara Prasad",
    bank_name: "State Bank of India (SBI)",
    account_number: "62495383611",
    ifsc_code: "SBIN0020149",
    account_type: "Personal / Designated Partner Account",
    is_selected: true
  }
];

export const DEFAULT_BANKING_DETAILS: BankingDetails = {
  account_holder: "SIDDHI DYNAMICS PVT LTD",
  bank_name: "State Bank of India (SBI)",
  account_number: "45170121323",
  ifsc_code: "SBIN0020149",
  upi_id: "siddhidynamics@sbi",
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
  // Enhanced requirements intake assets
  project_category?: 'Website' | 'SaaS Platform' | 'ERP Solution' | 'Business Automation' | 'Mobile App' | 'Other';
  complexity_tier?: 'Simple' | 'Standard' | 'Premium';
  logo_status?: 'have_logo' | 'need_design';
  brand_colors?: string;
  competitor_references?: string;
  tech_preferences?: string;
  custom_quote_notes?: string;
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
  // Direct Payment Verification fields
  verification_status?: "none" | "pending_verification" | "verified" | "rejected";
  transaction_id?: string;
  payment_mode?: "UPI" | "IMPS" | "NEFT" | "Net Banking" | "Bank Transfer";
  paid_by_name?: string;
  paid_by_phone?: string;
  submitted_at?: string;
  admin_verified_at?: string;
  admin_notes?: string;
  proof_url?: string;
}

export interface AgencyCommissionConfig {
  id: string;
  agency_name: string;
  agency_email: string;
  model: 'commission' | 'non_commission';
  commission_rate: number; // e.g. 15 for 15%
  status: 'active' | 'paused';
  // Agency Point of Contact & Corporate ID
  agency_poc_name?: string;
  agency_phone?: string;
  agency_address?: string;
  agency_id_type?: 'LLPIN' | 'CIN' | 'GSTIN' | 'Not Applicable';
  agency_id_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AgencyCommissionProject {
  id: string;
  agency_email: string;
  // Service Providing To: End-Client Details
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_address?: string;
  project_name: string;
  service_scope?: string;
  // Financial Inflow & Outflow Tracking
  project_value: number; // Inflow amount agreed with client (e.g. 85000)
  inflow_status?: 'pending' | 'verified_paid';
  inflow_utr?: string;
  inflow_received_at?: string;
  commission_rate: number; // e.g. 15%
  commission_amount: number; // Outflow amount (e.g. 12750)
  payout_status: 'unpaid' | 'paid';
  payout_date?: string;
  payout_reference?: string; // Outflow bank UTR
  invoice_no?: string; // e.g. SD-AGY-INV-2026-001
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  visible_to_client: boolean;
}

export interface ClientChangeRequest {
  id: string;
  title: string;
  category: 'UI / Design' | 'Content / Copy' | 'Feature / Logic' | 'Bug / Fix' | 'General Change';
  priority: 'Normal' | 'High' | 'Urgent';
  description: string;
  status: 'pending_review' | 'in_progress' | 'completed' | 'declined';
  submitted_at: string;
  admin_response?: string;
  asset_url?: string;
}

export interface MeetingScheduleRequest {
  id: string;
  meeting_mode: 'Virtual (Google Meet / Zoom)' | 'Direct / In-Person (Nizamabad / Hyderabad Office)';
  preferred_date: string;
  preferred_time: string;
  agenda: string;
  client_phone?: string;
  client_name?: string;
  status: 'requested' | 'confirmed' | 'rescheduled' | 'completed';
  meeting_link?: string;
  admin_notes?: string;
  created_at: string;
}

export interface ProjectLifecycleMeta {
  // Quoting & Agreement
  agreement?: string; // total price quote string (e.g. "₹25,000")
  total_amount?: number;
  payment_structure?: string; // "50% Advance + 50% on Delivery" | "100% Advance" | ...
  advance_percentage?: number; // 50, 100, etc.
  advance_amount?: string;
  scope_summary?: string;
  quote_assigned_at?: string;

  // Dates
  service_start_date?: string; // Set when advance is verified or manually set by admin
  deadline?: string; // Estimated completion date
  
  // Deliverables, Demos & Live Progress Reports
  website_url?: string; // Original Live Production Website / Portal URL
  demo_url?: string; // Demo / Staging / Preview URL
  seo_report_url?: string; // SEO & AEO Progress / Looker Studio / Audit Report URL
  gbp_url?: string; // Google Business Profile / Google Maps URL
  analytics_url?: string; // Search Console / GA4 / Live Performance Dashboard URL

  // Banking Details shared by admin (unlocked upon verification)
  banking_details?: BankingDetails;

  // Client-submitted Onboarding / Service Form
  service_form?: ClientServiceFormData;

  // Invoices & Updates
  invoices?: ProjectInvoice[];
  updates?: ProjectUpdate[];

  // Live Inspection & Change Requests (Portal-based collaboration instead of WhatsApp)
  change_requests?: ClientChangeRequest[];

  // Meeting & Consultation Bookings (Virtual & Direct)
  meeting_requests?: MeetingScheduleRequest[];
}


