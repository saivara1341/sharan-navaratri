import { supabase } from '@/integrations/supabase/client';
import { assignRoleToEmail, deleteAssignedRole } from '@/lib/roleResolver';
import { employeeSalaryService } from '@/services/employeeSalaryService';
import { payrollService } from '@/services/payrollService';

export type EmployeeType = 'Full-Time' | 'Part-Time' | 'Contract';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Probation' | 'Resigned';

export interface EmployeeApplicant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  applied_role: string;
  department: string;
  experience?: string;
  college?: string;
  degree?: string;
  expected_salary?: string;
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  statement_of_purpose?: string;
  status: 'Applied' | 'Screening' | 'Interview Scheduled' | 'Offered' | 'Hired' | 'Rejected';
  interview_details?: {
    date: string;
    time: string;
    meet_link: string;
  };
  created_at: string;
}

export interface EmployeeTask {
  id: string;
  title: string;
  description: string;
  assigned_to_email: string;
  assigned_to_name: string;
  department: string;
  priority: 'Critical' | 'High' | 'Medium';
  stipulated_deadline: string;
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Completed';
  created_at: string;
  created_by: string;
}

export interface ActiveEmployee {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  employee_type: EmployeeType;
  status: EmployeeStatus;
  joined_at: string;
  salary: number;
  pan_number?: string;
  govt_id_type?: string;
  govt_id_number?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  branch_name?: string;
  notes?: string;
}

const APPLICANTS_KEY = 'sd_employee_applicants_v1';
const EMPLOYEES_KEY = 'sd_active_employees_v1';
const TASKS_KEY = 'sd_employee_tasks_v1';

const DEFAULT_APPLICANTS: EmployeeApplicant[] = [
  {
    id: 'emp-app-1',
    full_name: 'Vikramaditya Rao',
    email: 'vikram.rao.eng@gmail.com',
    phone: '9848022334',
    applied_role: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    experience: '3.5 Years',
    college: 'BITS Pilani Hyderabad',
    degree: 'B.E. Computer Science',
    expected_salary: '₹65,000 / mo',
    resume_url: 'https://drive.google.com/file/d/sample-vikram-cv/view',
    portfolio_url: 'https://github.com/vikram-rao-dev',
    linkedin_url: 'https://linkedin.com/in/vikram-rao-dev',
    statement_of_purpose: 'Passionate about building scalable distributed systems, micro-frontends, and high-performance Web applications for regional enterprises.',
    status: 'Screening',
    created_at: '2026-09-22T10:15:00.000Z'
  },
  {
    id: 'emp-app-2',
    full_name: 'Priyanka Nambiar',
    email: 'priyanka.marketing@outlook.com',
    phone: '9989011223',
    applied_role: 'Performance Marketing & SEO Lead',
    department: 'Digital Marketing',
    experience: '4 Years',
    college: 'IIM Indore (Executive)',
    degree: 'BBA & Digital Strategies',
    expected_salary: '₹55,000 / mo',
    resume_url: 'https://drive.google.com/file/d/sample-priyanka-cv/view',
    portfolio_url: 'https://priyankanambiar.me',
    linkedin_url: 'https://linkedin.com/in/priyanka-nambiar',
    statement_of_purpose: 'Specialized in scaling high-converting B2B SEO funnels, AEO / AI search ranking protocols, and performance marketing campaigns.',
    status: 'Interview Scheduled',
    interview_details: {
      date: '2026-09-28',
      time: '04:00 PM IST',
      meet_link: 'https://meet.google.com/sdf-jkle-mno'
    },
    created_at: '2026-09-24T14:30:00.000Z'
  },
  {
    id: 'emp-app-3',
    full_name: 'Suresh Reddy',
    email: 'suresh.reddy.bd@gmail.com',
    phone: '9121045678',
    applied_role: 'B2B Enterprise Sales Lead',
    department: 'Business Dev',
    experience: '2 Years',
    college: 'Osmania University',
    degree: 'MBA (Marketing & Sales)',
    expected_salary: '₹40,000 / mo + Incentives',
    resume_url: 'https://drive.google.com/file/d/sample-suresh-cv/view',
    linkedin_url: 'https://linkedin.com/in/suresh-reddy-sales',
    statement_of_purpose: 'Proven track record conducting consultative sales with industrial MSMEs and print packaging manufacturers across Telangana & Andhra Pradesh.',
    status: 'Applied',
    created_at: '2026-09-25T09:00:00.000Z'
  }
];

const DEFAULT_EMPLOYEES: ActiveEmployee[] = [
  {
    id: 'emp-1',
    full_name: 'Aditya Varma',
    email: 'aditya.eng@siddhidynamics.in',
    phone: '9849012345',
    role: 'Lead Systems Architect',
    department: 'Engineering',
    employee_type: 'Full-Time',
    status: 'Active',
    joined_at: '2026-01-15',
    salary: 65000,
    pan_number: 'ABCPV9012K',
    govt_id_type: 'Aadhaar Card',
    govt_id_number: 'XXXX-XXXX-9021',
    bank_name: 'HDFC Bank Ltd',
    account_number: '50100492817263',
    ifsc_code: 'HDFC0001234',
    upi_id: 'aditya@hdfcbank',
    branch_name: 'Cyberabad Branch, Hyderabad',
    notes: 'Heading core infrastructure and multi-tenant portal backend pipelines.'
  },
  {
    id: 'emp-2',
    full_name: 'Kavya Sunder',
    email: 'kavya.ops@siddhidynamics.in',
    phone: '9876543210',
    role: 'Operations & Client Delivery Lead',
    department: 'Operations',
    employee_type: 'Full-Time',
    status: 'Active',
    joined_at: '2026-02-01',
    salary: 48000,
    pan_number: 'BNMPS4512Q',
    govt_id_type: 'Aadhaar Card',
    govt_id_number: 'XXXX-XXXX-4512',
    bank_name: 'State Bank of India',
    account_number: '30291827461',
    ifsc_code: 'SBIN0004567',
    upi_id: 'kavya@sbi',
    branch_name: 'Banjara Hills, Hyderabad',
    notes: 'Managing client SLAs, milestone reviews, and partner onboarding.'
  }
];

const DEFAULT_TASKS: EmployeeTask[] = [
  {
    id: 'emp-task-1',
    title: 'Deploy Multi-Tenant Database Optimization & Connection Pooling',
    description: 'Optimize Supabase RLS policies and configure PgBouncer pooling for 10,000 concurrent client portal interactions.',
    assigned_to_email: 'aditya.eng@siddhidynamics.in',
    assigned_to_name: 'Aditya Varma',
    department: 'Engineering',
    priority: 'Critical',
    stipulated_deadline: '2026-09-30',
    status: 'In Progress',
    created_at: '2026-09-20T10:00:00.000Z',
    created_by: 'CEO'
  },
  {
    id: 'emp-task-2',
    title: 'Client Service Delivery Review & SLA Report',
    description: 'Audit ongoing deliverables for VMM and regional MSME clients and prepare milestone completion certificates.',
    assigned_to_email: 'kavya.ops@siddhidynamics.in',
    assigned_to_name: 'Kavya Sunder',
    department: 'Operations',
    priority: 'High',
    stipulated_deadline: '2026-10-02',
    status: 'In Progress',
    created_at: '2026-09-22T11:30:00.000Z',
    created_by: 'CEO'
  }
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error for ' + key, e);
  }
}

export const employeeService = {
  getApplicants(): EmployeeApplicant[] {
    return getStored<EmployeeApplicant[]>(APPLICANTS_KEY, DEFAULT_APPLICANTS);
  },

  submitApplicant(data: Omit<EmployeeApplicant, 'id' | 'created_at' | 'status'>): EmployeeApplicant {
    const applicants = this.getApplicants();
    const newApplicant: EmployeeApplicant = {
      ...data,
      id: 'emp-app-' + Math.random().toString(36).substring(2, 9),
      status: 'Applied',
      created_at: new Date().toISOString()
    };
    const updated = [newApplicant, ...applicants];
    setStored(APPLICANTS_KEY, updated);
    return newApplicant;
  },

  updateApplicantStatus(id: string, status: EmployeeApplicant['status']): void {
    const applicants = this.getApplicants();
    const updated = applicants.map(a => a.id === id ? { ...a, status } : a);
    setStored(APPLICANTS_KEY, updated);
  },

  scheduleApplicantInterview(id: string, details: { date: string; time: string; meet_link: string }): void {
    const applicants = this.getApplicants();
    const updated = applicants.map(a => a.id === id ? {
      ...a,
      status: 'Interview Scheduled' as const,
      interview_details: details
    } : a);
    setStored(APPLICANTS_KEY, updated);
  },

  deleteApplicant(id: string): void {
    const applicants = this.getApplicants();
    const updated = applicants.filter(a => a.id !== id);
    setStored(APPLICANTS_KEY, updated);
  },

  getEmployees(): ActiveEmployee[] {
    return getStored<ActiveEmployee[]>(EMPLOYEES_KEY, DEFAULT_EMPLOYEES);
  },

  getEmployeeByEmail(email: string): ActiveEmployee | null {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    const employees = this.getEmployees();
    return employees.find(e => e.email.toLowerCase() === clean) || null;
  },

  addOrUpdateEmployee(emp: Partial<ActiveEmployee> & { email: string; full_name: string }): ActiveEmployee {
    const cleanEmail = emp.email.trim().toLowerCase();
    const current = this.getEmployees();
    const existingIdx = current.findIndex(e => e.email.toLowerCase() === cleanEmail);

    const saved: ActiveEmployee = {
      id: existingIdx >= 0 ? current[existingIdx].id : 'emp-' + Math.random().toString(36).substring(2, 9),
      full_name: emp.full_name.trim(),
      email: cleanEmail,
      phone: emp.phone || current[existingIdx]?.phone || '',
      role: emp.role || current[existingIdx]?.role || 'Team Member',
      department: emp.department || current[existingIdx]?.department || 'Engineering',
      employee_type: emp.employee_type || current[existingIdx]?.employee_type || 'Full-Time',
      status: emp.status || current[existingIdx]?.status || 'Active',
      joined_at: emp.joined_at || current[existingIdx]?.joined_at || new Date().toISOString().split('T')[0],
      salary: typeof emp.salary === 'number' ? emp.salary : (current[existingIdx]?.salary || 35000),
      pan_number: emp.pan_number || current[existingIdx]?.pan_number,
      govt_id_type: emp.govt_id_type || current[existingIdx]?.govt_id_type || 'Aadhaar Card',
      govt_id_number: emp.govt_id_number || current[existingIdx]?.govt_id_number,
      bank_name: emp.bank_name || current[existingIdx]?.bank_name,
      account_number: emp.account_number || current[existingIdx]?.account_number,
      ifsc_code: emp.ifsc_code || current[existingIdx]?.ifsc_code,
      upi_id: emp.upi_id || current[existingIdx]?.upi_id,
      branch_name: emp.branch_name || current[existingIdx]?.branch_name,
      notes: emp.notes !== undefined ? emp.notes : current[existingIdx]?.notes
    };

    let updatedList: ActiveEmployee[];
    if (existingIdx >= 0) {
      updatedList = [...current];
      updatedList[existingIdx] = saved;
    } else {
      updatedList = [saved, ...current];
    }
    setStored(EMPLOYEES_KEY, updatedList);

    assignRoleToEmail(cleanEmail, 'employee', saved.full_name, 'Employee Designation: ' + saved.role);

    if (saved.account_number && saved.ifsc_code) {
      employeeSalaryService.saveBankingDetails({
        employee_email: cleanEmail,
        employee_name: saved.full_name,
        account_holder_name: saved.full_name,
        account_number: saved.account_number,
        bank_name: saved.bank_name || 'Bank',
        ifsc_code: saved.ifsc_code,
        upi_id: saved.upi_id,
        pan_number: saved.pan_number,
        branch_name: saved.branch_name,
        status: 'Verified for Salary'
      });
    }

    return saved;
  },

  assignRoleToApplicant(
    applicantId: string,
    roleData: {
      role: string;
      department: string;
      salary: number;
      joined_at?: string;
      notes?: string;
    }
  ): ActiveEmployee | null {
    const applicants = this.getApplicants();
    const target = applicants.find(a => a.id === applicantId);
    if (!target) return null;

    this.updateApplicantStatus(applicantId, 'Hired');

    const newEmp = this.addOrUpdateEmployee({
      full_name: target.full_name,
      email: target.email,
      phone: target.phone,
      role: roleData.role,
      department: roleData.department,
      employee_type: 'Full-Time',
      status: 'Active',
      joined_at: roleData.joined_at || new Date().toISOString().split('T')[0],
      salary: roleData.salary,
      notes: roleData.notes || 'Promoted from application: ' + target.applied_role
    });

    return newEmp;
  },

  deleteEmployee(id: string, email: string): void {
    const employees = this.getEmployees();
    const updated = employees.filter(e => e.id !== id && e.email.toLowerCase() !== email.toLowerCase());
    setStored(EMPLOYEES_KEY, updated);
    deleteAssignedRole(id);
  },

  getTasks(employeeEmail?: string): EmployeeTask[] {
    const all = getStored<EmployeeTask[]>(TASKS_KEY, DEFAULT_TASKS);
    if (!employeeEmail) return all;
    const clean = employeeEmail.trim().toLowerCase();
    return all.filter(t => t.assigned_to_email.toLowerCase() === clean);
  },

  createTask(task: Omit<EmployeeTask, 'id' | 'created_at' | 'status'>): EmployeeTask {
    const tasks = this.getTasks();
    const newTask: EmployeeTask = {
      ...task,
      id: 'emp-task-' + Math.random().toString(36).substring(2, 9),
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    const updated = [newTask, ...tasks];
    setStored(TASKS_KEY, updated);
    return newTask;
  },

  updateTaskStatus(id: string, status: EmployeeTask['status']): void {
    const tasks = this.getTasks();
    const updated = tasks.map(t => t.id === id ? { ...t, status } : t);
    setStored(TASKS_KEY, updated);
  },

  extendTaskDeadline(id: string, newDeadline: string): void {
    const tasks = this.getTasks();
    const updated = tasks.map(t => t.id === id ? { ...t, stipulated_deadline: newDeadline } : t);
    setStored(TASKS_KEY, updated);
  },

  deleteTask(id: string): void {
    const tasks = this.getTasks();
    const updated = tasks.filter(t => t.id !== id);
    setStored(TASKS_KEY, updated);
  }
};
