export interface PayrollRecord {
  id: string;
  recipient_name: string;
  recipient_email: string;
  role: 'intern' | 'employee';
  type: 'salary' | 'stipend' | 'incentive' | 'bonus';
  disbursement_type?: string;
  amount: number;
  period: string; // e.g. "March 2026"
  status: 'paid' | 'pending';
  utr_reference?: string;
  transaction_utr?: string;
  certificate_id?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
}

export interface PayrollSummary {
  total_disbursed: number;
  total_pending: number;
  employee_salaries: number;
  intern_stipends: number;
  performance_incentives: number;
  bonuses: number;
  recordsCount: number;
  totalPaid: number;
  totalPending: number;
  employeeSalariesPaid: number;
  internStipendsPaid: number;
  incentivesDisbursed: number;
}

const STORAGE_KEY = 'siddhi_payroll_records_v1';

const DEFAULT_PAYROLL: PayrollRecord[] = [
  {
    id: 'PAY-2026-001',
    recipient_name: 'Aditya Varma',
    recipient_email: 'aditya.eng@siddhidynamics.in',
    role: 'employee',
    type: 'salary',
    amount: 45000,
    period: 'February 2026',
    status: 'paid',
    utr_reference: 'SBI-UTR-4491028371',
    paid_at: '2026-03-01T10:30:00.000Z',
    notes: 'Full-stack Systems Lead monthly compensation',
    created_at: '2026-02-28T00:00:00.000Z',
  },
  {
    id: 'PAY-2026-002',
    recipient_name: 'Pooja Reddy',
    recipient_email: 'pooja.intern@gmail.com',
    role: 'intern',
    type: 'stipend',
    amount: 15000,
    period: 'February 2026',
    status: 'paid',
    utr_reference: 'UPI-REF-9921448201',
    paid_at: '2026-03-02T14:15:00.000Z',
    notes: 'Business Development & Client Acquisition Internship Stipend',
    created_at: '2026-02-28T00:00:00.000Z',
  },
  {
    id: 'PAY-2026-003',
    recipient_name: 'Pooja Reddy',
    recipient_email: 'pooja.intern@gmail.com',
    role: 'intern',
    type: 'incentive',
    amount: 5000,
    period: 'February 2026',
    status: 'paid',
    utr_reference: 'UPI-REF-9921448202',
    paid_at: '2026-03-02T14:20:00.000Z',
    notes: 'Closed deal incentive on Manufacturing ERP client lead',
    created_at: '2026-02-28T00:00:00.000Z',
  },
  {
    id: 'PAY-2026-004',
    recipient_name: 'Rohan Sharma',
    recipient_email: 'rohan.dev@siddhidynamics.in',
    role: 'employee',
    type: 'salary',
    amount: 38000,
    period: 'February 2026',
    status: 'paid',
    utr_reference: 'SBI-UTR-4491028373',
    paid_at: '2026-03-01T10:45:00.000Z',
    notes: 'Cloud & Database Optimization Engineer monthly compensation',
    created_at: '2026-02-28T00:00:00.000Z',
  },
  {
    id: 'PAY-2026-005',
    recipient_name: 'Aditya Varma',
    recipient_email: 'aditya.eng@siddhidynamics.in',
    role: 'employee',
    type: 'incentive',
    amount: 10000,
    period: 'February 2026',
    status: 'paid',
    utr_reference: 'SBI-UTR-4491028374',
    paid_at: '2026-03-05T12:00:00.000Z',
    notes: 'Sprint bonus for zero-downtime multi-portal database migration',
    created_at: '2026-03-04T00:00:00.000Z',
  },
  {
    id: 'PAY-2026-006',
    recipient_name: 'Aditya Varma',
    recipient_email: 'aditya.eng@siddhidynamics.in',
    role: 'employee',
    type: 'salary',
    amount: 45000,
    period: 'March 2026',
    status: 'pending',
    notes: 'Scheduled end of month salary disbursement',
    created_at: '2026-03-15T00:00:00.000Z',
  },
  {
    id: 'PAY-2026-007',
    recipient_name: 'Pooja Reddy',
    recipient_email: 'pooja.intern@gmail.com',
    role: 'intern',
    type: 'stipend',
    amount: 15000,
    period: 'March 2026',
    status: 'pending',
    notes: 'Scheduled end of month internship stipend',
    created_at: '2026-03-15T00:00:00.000Z',
  },
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Payroll storage write error:', err);
  }
}

export const payrollService = {
  getPayrollRecords(): PayrollRecord[] {
    const raw = getStored<PayrollRecord[]>(STORAGE_KEY, DEFAULT_PAYROLL);
    return raw.map((r) => ({
      ...r,
      disbursement_type: r.disbursement_type || r.type || 'stipend',
      transaction_utr: r.transaction_utr || r.utr_reference || '',
      type: r.type || (r.disbursement_type as any) || 'stipend',
      amount: typeof r.amount === 'number' ? r.amount : Number(r.amount) || 0,
    }));
  },

  addPayrollRecord(record: Omit<PayrollRecord, 'id' | 'created_at'>): PayrollRecord {
    const current = this.getPayrollRecords();
    const newRecord: PayrollRecord = {
      ...record,
      type: (record.type || record.disbursement_type || 'stipend') as any,
      disbursement_type: record.disbursement_type || record.type || 'stipend',
      transaction_utr: record.transaction_utr || record.utr_reference || '',
      amount: typeof record.amount === 'number' ? record.amount : Number(record.amount) || 0,
      status: record.status || 'pending',
      id: `PAY-2026-${String(current.length + 1).padStart(3, '0')}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newRecord, ...current];
    setStored(STORAGE_KEY, updated);
    return newRecord;
  },

  markPayrollPaid(id: string, utr: string): boolean {
    const current = this.getPayrollRecords();
    const target = current.find((r) => r.id === id);
    if (!target) return false;

    target.status = 'paid';
    target.utr_reference = utr;
    target.paid_at = new Date().toISOString();
    setStored(STORAGE_KEY, current);
    return true;
  },

  getPayrollSummary(): PayrollSummary {
    const records = this.getPayrollRecords();
    const totalPaid = records
      .filter((r) => r.status === 'paid')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const totalPending = records
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const employeeSalariesPaid = records
      .filter((r) => r.role === 'employee' && r.type === 'salary' && r.status === 'paid')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const internStipendsPaid = records
      .filter((r) => r.role === 'intern' && r.type === 'stipend' && r.status === 'paid')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const performanceIncentives = records
      .filter((r) => r.type === 'incentive' && r.status === 'paid')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const bonuses = records
      .filter((r) => r.type === 'bonus' && r.status === 'paid')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    const incentivesDisbursed = performanceIncentives + bonuses;

    return {
      total_disbursed: totalPaid,
      total_pending: totalPending,
      employee_salaries: employeeSalariesPaid,
      intern_stipends: internStipendsPaid,
      performance_incentives: performanceIncentives,
      bonuses: bonuses,
      totalPaid,
      totalPending,
      employeeSalariesPaid,
      internStipendsPaid,
      incentivesDisbursed,
      recordsCount: records.length,
    };
  },
};
