import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, X, Mail, Phone, Briefcase, ChevronRight,
  Edit3, Trash2, Check, Calendar, Globe, RefreshCw, Send,
  FileText, ShieldCheck, DollarSign, Landmark, CreditCard,
  CheckCircle2, Clock, ExternalLink, AlertCircle, Award, UserPlus, Search
} from 'lucide-react';
import { toast } from 'sonner';
import {
  employeeService,
  EmployeeApplicant,
  ActiveEmployee,
  EmployeeTask
} from '@/services/employeeService';
import { employeeSalaryService, EmployeeBankingDetails, SalaryPayoutRecord } from '@/services/employeeSalaryService';
import { payrollService, PayrollRecord } from '@/services/payrollService';
import { assignRoleToEmail, deleteAssignedRole } from '@/lib/roleResolver';

type ViewTab = 'data' | 'employees';

const DEPT_COLORS: Record<string, string> = {
  'Engineering':         'bg-sky-500/15 text-sky-400 border-sky-500/30',
  'Business Dev':        'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Digital Marketing':   'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'Operations':          'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'HR':                  'bg-rose-500/15 text-rose-400 border-rose-500/30',
  'Finance':             'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Design':              'bg-pink-500/15 text-pink-400 border-pink-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  'Active':    'bg-lime-500/15 text-lime-400 border-lime-500/30',
  'On Leave':  'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Resigned':  'bg-rose-500/15 text-rose-400 border-rose-500/30',
  'Probation': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

function avatar(name: string) {
  return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
}

export function AdminEmployeesConsole() {
  const [activeTab, setActiveTab] = useState<ViewTab>('data');
  const [applicants, setApplicants] = useState<EmployeeApplicant[]>([]);
  const [employees, setEmployees] = useState<ActiveEmployee[]>([]);
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Dossier
  const [selectedEmployee, setSelectedEmployee] = useState<ActiveEmployee | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<EmployeeApplicant | null>(null);
  const [assignRoleTarget, setAssignRoleTarget] = useState<EmployeeApplicant | null>(null);
  const [disburseSalaryTarget, setDisburseSalaryTarget] = useState<ActiveEmployee | null>(null);
  const [assignTaskTarget, setAssignTaskTarget] = useState<ActiveEmployee | null>(null);
  const [editBankingTarget, setEditBankingTarget] = useState<ActiveEmployee | null>(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const loadData = () => {
    setLoading(true);
    try {
      setApplicants(employeeService.getApplicants());
      setEmployees(employeeService.getEmployees());
      setTasks(employeeService.getTasks());
      setPayrollRecords(payrollService.getPayrollRecords());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Assign Role as Employee
  const handleConfirmAssignRole = (applicant: EmployeeApplicant, role: string, dept: string, salary: number, notes?: string) => {
    try {
      const created = employeeService.assignRoleToApplicant(applicant.id, {
        role,
        department: dept,
        salary,
        notes
      });
      if (created) {
        toast.success(`🎉 ${applicant.full_name} assigned role of Employee (${role})! They can now log in via Google to access the Employee Dashboard.`, {
          duration: 5000
        });
        setAssignRoleTarget(null);
        loadData();
        setActiveTab('employees');
        setSelectedEmployee(created);
      }
    } catch (_err: unknown) {
      toast.error('Failed to assign employee role: ' + (err.message || 'Unknown error'));
    }
  };

  // Disburse / Record Payout
  const handleDisbursePayment = (
    employee: ActiveEmployee,
    amount: number,
    payPeriod: string,
    utr: string,
    disbursementType: 'salary' | 'bonus' | 'incentive',
    paymentMethod: 'NEFT/RTGS' | 'IMPS' | 'UPI' | 'Direct Bank Transfer',
    notes?: string
  ) => {
    try {
      // 1. Record in payrollService
      payrollService.addPayrollRecord({
        recipient_name: employee.full_name,
        recipient_email: employee.email,
        role: 'employee',
        type: disbursementType,
        amount,
        period: payPeriod,
        status: 'paid',
        utr_reference: utr,
        transaction_utr: utr,
        notes: notes || `Direct salary disbursement via ${paymentMethod}`
      });

      // 2. Record in employeeSalaryService
      employeeSalaryService.recordPayout({
        employee_email: employee.email,
        employee_name: employee.full_name,
        amount,
        pay_period: payPeriod,
        transaction_ref: utr,
        payment_method: paymentMethod,
        disbursed_by: 'CEO Admin Console',
        status: 'Disbursed',
        notes
      });

      toast.success(`Disbursement of ₹${amount.toLocaleString('en-IN')} recorded for ${employee.full_name}!`);
      setDisburseSalaryTarget(null);
      loadData();
    } catch (_err: unknown) {
      toast.error('Failed to record payout: ' + (err.message || 'Unknown error'));
    }
  };

  // Save Government IDs & Banking Details
  const handleSaveBanking = (emp: ActiveEmployee, data: {
    pan_number?: string;
    govt_id_number?: string;
    bank_name?: string;
    account_number?: string;
    ifsc_code?: string;
    upi_id?: string;
    branch_name?: string;
  }) => {
    const updated = employeeService.addOrUpdateEmployee({
      ...emp,
      ...data
    });
    toast.success(`Government ID & Banking details updated for ${emp.full_name}!`);
    setEditBankingTarget(null);
    setSelectedEmployee(updated);
    loadData();
  };

  // Filtered applicants for DATA view
  const filteredApplicants = useMemo(() => {
    return applicants.filter(app => {
      if (deptFilter !== 'all' && app.department !== deptFilter) return false;
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          app.full_name.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          app.applied_role.toLowerCase().includes(q) ||
          (app.college || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applicants, deptFilter, statusFilter, search]);

  // Filtered employees for EMPLOYEES view
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      if (deptFilter !== 'all' && emp.department !== deptFilter) return false;
      if (statusFilter !== 'all' && emp.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          emp.full_name.toLowerCase().includes(q) ||
          emp.email.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [employees, deptFilter, statusFilter, search]);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & View Selector Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">Employee Operations Command</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Manage full-time hiring data, induct team members, disburse payroll, and monitor deliverables.</p>
            </div>
          </div>
        </div>

        {/* The Two Prominent Primary View Buttons: Data & Employees */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="p-1 rounded-2xl bg-muted/60 border border-border flex items-center gap-1 shadow-sm">
            <button
              onClick={() => { setActiveTab('data'); setSelectedEmployee(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Data (Hiring & Applications)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'data' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/15 text-muted-foreground'
              }`}>
                {applicants.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('employees')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'employees'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Employees (Active Team)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'employees' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/15 text-muted-foreground'
              }`}>
                {employees.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-primary" /> + Add Employee
          </button>

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: DATA (FULL-TIME APPLICANTS & HIRING CANDIDATES)                    */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'data' && (
        <div className="space-y-5">
          {/* Controls: Search, Department Filter, Status Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search candidate name, email, role, skills..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Business Dev">Business Dev</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Design">Design</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Stages</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offered">Offered</option>
                <option value="Hired">Hired / Inducted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Candidates Grid */}
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/50">
              <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="font-bold text-foreground">No candidate applications found</h4>
              <p className="text-xs text-muted-foreground mt-1">Full-time applicants registered from careers will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredApplicants.map(app => {
                const deptColor = DEPT_COLORS[app.department] || 'bg-white/10 text-foreground border-border';
                const isHired = app.status === 'Hired';

                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-4 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border ${deptColor}`}>
                            {avatar(app.full_name)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-foreground text-sm leading-tight hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedApplicant(app)}>
                              {app.full_name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{app.email}</p>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${deptColor}`}>
                          {app.status}
                        </span>
                      </div>

                      <div>
                        <span className="font-black text-xs text-foreground block">{app.applied_role}</span>
                        <span className="text-[11px] text-muted-foreground">{app.department} · Exp: {app.experience || 'Fresher/1yr'}</span>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between">
                          <span>College: <strong className="text-foreground">{app.college || 'University'}</strong></span>
                          <span>Expected: <strong className="text-emerald-500 font-bold">{app.expected_salary || 'Disclose'}</strong></span>
                        </div>
                        {app.phone && (
                          <div className="flex items-center gap-1.5 text-foreground font-medium">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span>{app.phone}</span>
                          </div>
                        )}
                      </div>

                      {app.statement_of_purpose && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                          "{app.statement_of_purpose}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="flex-1 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all"
                      >
                        Inspect Dossier
                      </button>

                      {isHired ? (
                        <span className="px-3 py-2 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/30 text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Hired
                        </span>
                      ) : (
                        <button
                          onClick={() => setAssignRoleTarget(app)}
                          className="px-3.5 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm shadow-primary/25 cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Assign Role
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: EMPLOYEES (ACTIVE TEAM, PAYROLL, GOVT IDS, TASKS & WORKLOAD)       */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'employees' && (
        <div className="space-y-6">
          {/* Quick Department Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {['all', 'Engineering', 'Business Dev', 'Digital Marketing', 'Operations', 'Finance', 'Design'].map(d => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  deptFilter === d
                    ? 'bg-foreground text-background border-foreground font-black'
                    : 'bg-card text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                {d === 'all' ? 'All Squads' : d}
              </button>
            ))}
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-border bg-card">
              <Users className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No active employees found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Induct candidate applications from the "Data (Hiring)" tab or click "+ Add Employee" to enroll team members.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredEmployees.map(emp => {
                const deptColor = DEPT_COLORS[emp.department] || 'bg-white/10 text-foreground border-border';
                const statusColor = STATUS_COLORS[emp.status] || 'bg-muted text-muted-foreground border-border';
                const empTasks = tasks.filter(t => t.assigned_to_email.toLowerCase() === emp.email.toLowerCase());
                const empPayouts = payrollRecords.filter(r => r.recipient_email?.toLowerCase() === emp.email.toLowerCase() && r.role === 'employee');

                return (
                  <div
                    key={emp.id}
                    className="p-6 rounded-3xl bg-card border border-border shadow-sm hover:border-primary/30 transition-all space-y-5"
                  >
                    {/* Top Row: Employee Profile & Quick Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black border ${deptColor}`}>
                          {avatar(emp.full_name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-black text-foreground">{emp.full_name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${deptColor}`}>
                              {emp.department}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusColor}`}>
                              {emp.status}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                              {emp.employee_type}
                            </span>
                          </div>
                          <p className="text-xs text-foreground font-bold mt-0.5">{emp.role}</p>
                          <p className="text-xs text-muted-foreground">{emp.email} · {emp.phone || 'No phone'}</p>
                        </div>
                      </div>

                      {/* Quick Contact & Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`mailto:${emp.email}`}
                          className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5 text-primary" /> Email
                        </a>

                        {emp.phone && (
                          <a
                            href={`tel:${emp.phone}`}
                            className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
                          </a>
                        )}

                        <button
                          onClick={() => setDisburseSalaryTarget(emp)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/25 transition-all cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5" /> Disburse Payment
                        </button>

                        <button
                          onClick={() => setAssignTaskTarget(emp)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center gap-1.5 shadow-sm shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Assign Work
                        </button>
                      </div>
                    </div>

                    {/* Middle: 3-Column Dossier Info (Compensation, Govt IDs, Tasks) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Column 1: Compensation & Payroll */}
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[10.5px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Monthly Compensation
                          </span>
                          <span className="font-black text-foreground text-sm">
                            ₹{emp.salary.toLocaleString('en-IN')}<span className="text-[10px] text-muted-foreground font-normal">/mo</span>
                          </span>
                        </div>
                        <div className="pt-2 border-t border-border/50 text-[11px] space-y-1">
                          <p className="text-muted-foreground">Disbursed Records: <strong className="text-foreground">{empPayouts.length}</strong></p>
                          {empPayouts.length > 0 && (
                            <p className="text-[10px] text-muted-foreground truncate">
                              Latest UTR: <strong className="text-foreground">{empPayouts[0].transaction_utr || empPayouts[0].utr_reference}</strong> ({empPayouts[0].period})
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Column 2: Government IDs & Banking */}
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[10.5px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-blue-500" /> Govt IDs & Banking
                          </span>
                          <button
                            onClick={() => setEditBankingTarget(emp)}
                            className="text-[10.5px] font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <p className="text-muted-foreground">PAN: <strong className="text-foreground">{emp.pan_number || 'Pending'}</strong></p>
                          <p className="text-muted-foreground">Govt ID: <strong className="text-foreground">{emp.govt_id_number || 'Aadhaar Pending'}</strong></p>
                          <p className="text-muted-foreground truncate">Bank: <strong className="text-foreground">{emp.bank_name ? `${emp.bank_name} (${emp.account_number?.slice(-4) ? '••••' + emp.account_number.slice(-4) : ''})` : 'Not provided'}</strong></p>
                        </div>
                      </div>

                      {/* Column 3: Workload & Active Tasks */}
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[10.5px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500" /> Workload & Deliverables
                          </span>
                          <span className="font-bold text-foreground">{empTasks.length} active</span>
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <p className="text-muted-foreground">Tenure: <strong className="text-foreground">Joined {emp.joined_at}</strong></p>
                          {empTasks.length > 0 ? (
                            <p className="text-[10.5px] text-foreground font-medium truncate">
                              Next: <strong>{empTasks[0].title}</strong> ({empTasks[0].stipulated_deadline})
                            </p>
                          ) : (
                            <p className="text-[10px] text-muted-foreground italic">No urgent tasks assigned.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Superpowers Bar */}
                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                      <span>Employee ID: <strong className="text-foreground font-mono">{emp.id}</strong></span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Change role or promote ${emp.full_name} to Admin?`)) {
                              assignRoleToEmail(emp.email, 'admin', emp.full_name, 'Promoted to Admin');
                              toast.success(`${emp.full_name} promoted to Admin!`);
                              loadData();
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold text-xs"
                        >
                          Promote to Admin
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to terminate/delete employee record for ${emp.full_name}?`)) {
                              employeeService.deleteEmployee(emp.id, emp.email);
                              deleteAssignedRole(emp.email);
                              toast.success(`Employee ${emp.full_name} removed from roster.`);
                              loadData();
                            }
                          }}
                          className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-500 transition-colors"
                          title="Remove Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 1: ASSIGN ROLE AS EMPLOYEE                                           */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {assignRoleTarget && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setAssignRoleTarget(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-base">Assign Full-Time Employee Role</h3>
                    <p className="text-xs text-muted-foreground">Authorize employee dashboard & register designation</p>
                  </div>
                </div>
                <button onClick={() => setAssignRoleTarget(null)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value || '';
                  handleConfirmAssignRole(
                    assignRoleTarget,
                    getVal('role'),
                    getVal('dept'),
                    Number(getVal('salary')) || 45000,
                    getVal('notes')
                  );
                }}
                className="space-y-3.5 text-xs"
              >
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <p className="font-bold text-foreground text-sm">{assignRoleTarget.full_name}</p>
                  <p className="text-muted-foreground">{assignRoleTarget.email} · Applied for: {assignRoleTarget.applied_role}</p>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Official Designation *</label>
                  <input
                    name="role"
                    required
                    defaultValue={assignRoleTarget.applied_role}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Department *</label>
                    <select
                      name="dept"
                      defaultValue={assignRoleTarget.department || 'Engineering'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Business Dev">Business Dev</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Monthly Salary (INR ₹) *</label>
                    <input
                      name="salary"
                      type="number"
                      required
                      defaultValue={50000}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Onboarding Notes</label>
                  <input
                    name="notes"
                    placeholder="Offer terms, reporting manager..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-foreground text-[11px] leading-relaxed">
                  ✓ <strong>Superpower:</strong> Confirming will whitelist this email as an <strong>Employee</strong>. When they sign in with Google, they will directly enter the full Employee Workspace.
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setAssignRoleTarget(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Confirm & Assign Role</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 2: DISBURSE SALARY / RECORD PAYOUT                                   */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {disburseSalaryTarget && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setDisburseSalaryTarget(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-base">Disburse Payment to Employee</h3>
                    <p className="text-xs text-muted-foreground">{disburseSalaryTarget.full_name} ({disburseSalaryTarget.role})</p>
                  </div>
                </div>
                <button onClick={() => setDisburseSalaryTarget(null)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value || '';
                  handleDisbursePayment(
                    disburseSalaryTarget,
                    Number(getVal('amount')) || disburseSalaryTarget.salary,
                    getVal('period'),
                    getVal('utr'),
                    getVal('disbType'),
                    getVal('method'),
                    getVal('notes')
                  );
                }}
                className="space-y-3.5 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Disbursement Amount (₹) *</label>
                    <input
                      name="amount"
                      type="number"
                      required
                      defaultValue={disburseSalaryTarget.salary}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-bold focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Pay Period *</label>
                    <input
                      name="period"
                      required
                      defaultValue="September 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Payment Category</label>
                    <select
                      name="disbType"
                      defaultValue="salary"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="salary">Monthly Salary</option>
                      <option value="bonus">Performance Bonus</option>
                      <option value="incentive">Commission / Incentive</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Disbursement Mode</label>
                    <select
                      name="method"
                      defaultValue="NEFT/RTGS"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="NEFT/RTGS">NEFT / RTGS</option>
                      <option value="IMPS">IMPS Immediate</option>
                      <option value="UPI">UPI Transfer</option>
                      <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Bank UTR / Transaction Reference *</label>
                  <input
                    name="utr"
                    required
                    defaultValue={`SBI-UTR-${Date.now().toString().slice(-8)}`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Payment Notes / Remark</label>
                  <input
                    name="notes"
                    placeholder="Regular monthly compensation disbursement"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setDisburseSalaryTarget(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md">Record & Disburse</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 3: EDIT GOVERNMENT IDS & BANKING DETAILS                             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editBankingTarget && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setEditBankingTarget(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-extrabold text-foreground text-base">Government IDs & Bank Details</h3>
                  <p className="text-xs text-muted-foreground">For: {editBankingTarget.full_name}</p>
                </div>
                <button onClick={() => setEditBankingTarget(null)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value || '';
                  handleSaveBanking(editBankingTarget, {
                    pan_number: getVal('pan'),
                    govt_id_number: getVal('govtId'),
                    bank_name: getVal('bankName'),
                    account_number: getVal('accNum'),
                    ifsc_code: getVal('ifsc'),
                    upi_id: getVal('upi'),
                    branch_name: getVal('branch')
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">PAN Card Number</label>
                    <input name="pan" defaultValue={editBankingTarget.pan_number || ''} placeholder="e.g. ABCDE1234F" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Aadhaar / Govt ID Number</label>
                    <input name="govtId" defaultValue={editBankingTarget.govt_id_number || ''} placeholder="XXXX-XXXX-XXXX" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Bank Name</label>
                    <input name="bankName" defaultValue={editBankingTarget.bank_name || ''} placeholder="e.g. HDFC Bank Ltd" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Account Number</label>
                    <input name="accNum" defaultValue={editBankingTarget.account_number || ''} placeholder="Account Number" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">IFSC Code</label>
                    <input name="ifsc" defaultValue={editBankingTarget.ifsc_code || ''} placeholder="e.g. HDFC0001234" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-mono uppercase" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">UPI ID (VPA)</label>
                    <input name="upi" defaultValue={editBankingTarget.upi_id || ''} placeholder="employee@bank" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Bank Branch Name</label>
                  <input name="branch" defaultValue={editBankingTarget.branch_name || ''} placeholder="e.g. Banjara Hills, Hyderabad" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground" />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setEditBankingTarget(null)} className="flex-1 py-2 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Save Records</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 4: ASSIGN WORK / PROJECT DELIVERABLE                                 */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {assignTaskTarget && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setAssignTaskTarget(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-extrabold text-foreground text-base">Assign Deliverable via Portal</h3>
                  <p className="text-xs text-muted-foreground">To: {assignTaskTarget.full_name} ({assignTaskTarget.role})</p>
                </div>
                <button onClick={() => setAssignTaskTarget(null)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value || '';
                  employeeService.createTask({
                    title: getVal('title'),
                    description: getVal('desc'),
                    assigned_to_email: assignTaskTarget.email,
                    assigned_to_name: assignTaskTarget.full_name,
                    department: assignTaskTarget.department,
                    priority: getVal('priority') as 'Low' | 'Medium' | 'High' | 'Urgent',
                    stipulated_deadline: getVal('deadline'),
                    created_by: 'CEO Admin'
                  });
                  toast.success(`Deliverable assigned to ${assignTaskTarget.full_name}!`);
                  setAssignTaskTarget(null);
                  loadData();
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="font-bold text-foreground block mb-1">Work / Deliverable Title *</label>
                  <input name="title" required placeholder="e.g. Deploy Redis caching layer for client portal endpoints" className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium" />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Description / Technical Requirements</label>
                  <textarea name="desc" rows={3} placeholder="Expected outcomes, API contract, PR review standards..." className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground font-medium resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Stipulated Deadline *</label>
                    <input name="deadline" type="date" required defaultValue={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]} className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Priority</label>
                    <select name="priority" defaultValue="High" className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium">
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setAssignTaskTarget(null)} className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Assign Deliverable</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 5: ADD DIRECT EMPLOYEE                                               */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddEmployeeModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddEmployeeModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-foreground text-base">Direct Employee Enrollment</h3>
                <button onClick={() => setShowAddEmployeeModal(false)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value || '';
                  const fullName = getVal('fullName');
                  employeeService.addOrUpdateEmployee({
                    full_name: fullName,
                    email: getVal('email').trim().toLowerCase(),
                    phone: getVal('phone'),
                    role: getVal('role'),
                    department: getVal('dept'),
                    employee_type: 'Full-Time',
                    status: 'Active',
                    salary: Number(getVal('salary')) || 45000,
                    notes: getVal('notes')
                  });
                  toast.success(`Employee ${fullName} registered & authorized!`);
                  setShowAddEmployeeModal(false);
                  loadData();
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-foreground block mb-1">Full Name *</label>
                  <input name="fullName" required placeholder="e.g. Vikramaditya Rao" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Email *</label>
                    <input name="email" type="email" required placeholder="vikram@siddhidynamics.in" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Phone</label>
                    <input name="phone" placeholder="10-digit number" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Designation *</label>
                    <input name="role" required placeholder="e.g. Senior Frontend Engineer" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Department</label>
                    <select name="dept" defaultValue="Engineering" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium">
                      <option value="Engineering">Engineering</option>
                      <option value="Business Dev">Business Dev</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Monthly Salary (INR ₹) *</label>
                  <input name="salary" type="number" required defaultValue={50000} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-bold" />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Notes</label>
                  <input name="notes" placeholder="Reporting notes..." className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="flex-1 py-2 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Enroll Employee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
