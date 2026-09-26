import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Search, ChevronRight, X, Mail,
  Phone, Globe, Calendar, Clock, Briefcase,
  Plus, FileText, BarChart3, Tag, BookOpen, Check, RefreshCw,
  Send, ExternalLink, Linkedin, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutGrid, Table as TableIcon, UserPlus, ShieldCheck, CheckCircle2,
  CalendarCheck, Award, AlertCircle, Edit3, Trash2, Video
} from 'lucide-react';
import { toast } from 'sonner';
import {
  internshipService,
  InternshipApplication,
  InternTask,
  TaskSubmission,
  DeadlineExtensionRequest,
  CertificateRecord
} from '@/services/internshipService';
import { assignRoleToEmail, deleteAssignedRole } from '@/lib/roleResolver';

type SortOption = 'role-asc' | 'role-desc' | 'date-desc' | 'date-asc' | 'name-asc' | 'status';
type ViewTab = 'data' | 'interns';

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  'Business Development Intern': {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    pill: 'bg-blue-500 text-white'
  },
  'Digital Marketing Intern': {
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    pill: 'bg-purple-500 text-white'
  },
  'Product Manager Intern': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    pill: 'bg-emerald-500 text-white'
  },
};

function getRoleMeta(role: string) {
  if (role.toLowerCase().includes('product')) return ROLE_COLORS['Product Manager Intern'];
  if (role.toLowerCase().includes('business') || role.toLowerCase().includes('bd')) return ROLE_COLORS['Business Development Intern'];
  if (role.toLowerCase().includes('marketing') || role.toLowerCase().includes('digital')) return ROLE_COLORS['Digital Marketing Intern'];
  return {
    bg: 'bg-sky-500/10 dark:bg-sky-500/15',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
    pill: 'bg-sky-500 text-white'
  };
}

const STATUS_META: Record<string, { bg: string; text: string; border: string; label: string }> = {
  'Received': { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', label: 'Applied' },
  'Interview Scheduled': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Interview Scheduled' },
  'Offered': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Offer Sent' },
  'Active': { bg: 'bg-lime-500/15', text: 'text-lime-400', border: 'border-lime-500/30', label: 'Active Intern' },
  'Completed': { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Completed' },
  'Rejected': { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Rejected' },
};

function avatar(name: string) {
  return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
}

export function AdminInternRegistry() {
  const [activeTab, setActiveTab] = useState<ViewTab>('data');
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [tasks, setTasks] = useState<InternTask[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [extensions, setExtensions] = useState<DeadlineExtensionRequest[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Sorting for DATA View
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('role-asc');
  const [search, setSearch] = useState('');

  // Modals & Drawers
  const [selectedApplicant, setSelectedApplicant] = useState<InternshipApplication | null>(null);
  const [assignRoleTarget, setAssignRoleTarget] = useState<InternshipApplication | null>(null);
  const [assignTaskTarget, setAssignTaskTarget] = useState<InternshipApplication | null>(null);
  const [extendDeadlineTarget, setExtendDeadlineTarget] = useState<InternTask | null>(null);
  const [scheduleInterviewTarget, setScheduleInterviewTarget] = useState<InternshipApplication | null>(null);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);

  // Load all internship data
  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await internshipService.getApplications();
      setApplications(apps);
      setTasks(internshipService.getTasks());
      setSubmissions(internshipService.getTaskSubmissions());
      setExtensions(internshipService.getExtensionRequests());
      setCertificates(internshipService.getCertificates());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update status of applicant
  const handleStatusChange = async (id: string, status: InternshipApplication['status']) => {
    await internshipService.updateApplicationStatus(id, status);
    toast.success(`Candidate status updated to "${status}"`);
    await loadData();
    setSelectedApplicant(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  // Assign Role as Intern: updates application to Active & saves to roleResolver so Google Login works!
  const handleConfirmAssignRole = async (applicant: InternshipApplication, duration = '6 Months') => {
    try {
      // 1. Assign role in roleResolver (local & Supabase)
      assignRoleToEmail(applicant.email, 'intern', applicant.full_name, `Intern Role: ${applicant.role} (${duration})`);
      // 2. Mark application as Active
      await internshipService.updateApplicationStatus(applicant.id, 'Active');
      toast.success(`🎉 ${applicant.full_name} assigned role of Intern! They can now log in via Google to access their Intern Dashboard.`, {
        duration: 5000
      });
      setAssignRoleTarget(null);
      await loadData();
      setActiveTab('interns');
    } catch (err: unknown) {
      toast.error('Failed to assign intern role: ' + (err.message || 'Unknown error'));
    }
  };

  // Schedule interview handler
  const handleScheduleInterview = async (applicantId: string, date: string, time: string, meetLink: string) => {
    await internshipService.scheduleInterview(applicantId, date, time, meetLink);
    toast.success('Interview scheduled and invite details recorded.');
    setScheduleInterviewTarget(null);
    await loadData();
  };

  // Assign task handler
  const handleCreateTask = (title: string, description: string, deadline: string, priority: 'High' | 'Medium' | 'Critical', email: string, role: string) => {
    const roleBase = (role.replace(' Intern', '') || 'Business Development') as 'Digital Marketing' | 'Product Management' | 'Business Development';
    internshipService.createTask({
      title,
      description,
      assigned_to_role: roleBase,
      assigned_to_email: email,
      stipulated_deadline: deadline,
      priority
    });
    toast.success(`Task "${title}" assigned successfully!`);
    setAssignTaskTarget(null);
    setTasks(internshipService.getTasks());
  };

  // Extend task deadline handler
  const handleExtendDeadline = (taskId: string, newDate: string, remarks: string) => {
    internshipService.extendDeadline(taskId, newDate, remarks);
    toast.success('Deadline extended successfully!');
    setExtendDeadlineTarget(null);
    setTasks(internshipService.getTasks());
  };

  // Approve extension request submitted by intern
  const handleApproveExtensionReq = (extId: string, revisedDate: string) => {
    internshipService.reviewExtension(extId, 'Approved', 'Approved by Admin Console', revisedDate);
    toast.success('Extension request approved!');
    setExtensions(internshipService.getExtensionRequests());
    setTasks(internshipService.getTasks());
  };

  // Filtered & Sorted Applications for DATA view
  const filteredApplicants = useMemo(() => {
    let list = applications.filter(app => {
      // Role filter
      if (roleFilter !== 'all') {
        const r = (app.role || '').toLowerCase();
        if (roleFilter === 'pm' && !r.includes('product')) return false;
        if (roleFilter === 'bd' && !r.includes('business') && !r.includes('bd')) return false;
        if (roleFilter === 'dm' && !r.includes('marketing') && !r.includes('digital')) return false;
      }
      // Status filter
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          app.full_name.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          (app.college || '').toLowerCase().includes(q) ||
          (app.role || '').toLowerCase().includes(q) ||
          (app.phone || '').includes(q)
        );
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'role-asc') return (a.role || '').localeCompare(b.role || '') || a.full_name.localeCompare(b.full_name);
      if (sortBy === 'role-desc') return (b.role || '').localeCompare(a.role || '') || a.full_name.localeCompare(b.full_name);
      if (sortBy === 'date-desc') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      if (sortBy === 'date-asc') return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      if (sortBy === 'name-asc') return a.full_name.localeCompare(b.full_name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

    return list;
  }, [applications, roleFilter, statusFilter, search, sortBy]);

  // Active / Selected Interns for INTERNS view
  const activeInterns = useMemo(() => {
    return applications.filter(a => a.status === 'Active' || a.status === 'Offered' || a.status === 'Completed');
  }, [applications]);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & View Selector Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">Internship Command Center</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Manage candidate registrations, induct interns, allocate milestones, and track deadlines.</p>
            </div>
          </div>
        </div>

        {/* The Two Prominent Primary View Buttons: Data & Interns */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="p-1 rounded-2xl bg-muted/60 border border-border flex items-center gap-1 shadow-sm">
            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Data (Registrations)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'data' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/15 text-muted-foreground'
              }`}>
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('interns')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'interns'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Interns (Active Squad)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'interns' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/15 text-muted-foreground'
              }`}>
                {activeInterns.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => setShowAddCandidateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-primary" /> + Register Candidate
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
      {/* TAB 1: DATA (CANDIDATE APPLICATIONS REGISTRY)                             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'data' && (
        <div className="space-y-5">
          {/* Controls: Search, Sorting by Role, Filter by Status */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search applicant name, email, college, phone..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Role Filter & Sort Options */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
                className="px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="role-asc">Sort by Role (A → Z)</option>
                <option value="role-desc">Sort by Role (Z → A)</option>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Sort by Name</option>
                <option value="status">Sort by Status</option>
              </select>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="bd">Business Development</option>
                <option value="dm">Digital Marketing</option>
                <option value="pm">Product Manager</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-card border border-border text-xs text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Received">Applied (Received)</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offered">Offer Sent</option>
                <option value="Active">Active Intern</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* List of Applications */}
          {filteredApplicants.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/50">
              <GraduationCap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <h4 className="font-bold text-foreground">No candidate applications found</h4>
              <p className="text-xs text-muted-foreground mt-1">Applications submitted on the careers page will appear here instantly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredApplicants.map(app => {
                const roleMeta = getRoleMeta(app.role || '');
                const statusMeta = STATUS_META[app.status] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border', label: app.status };
                const isAssigned = app.status === 'Active' || app.status === 'Offered';

                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex flex-col justify-between gap-4 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border ${roleMeta.bg} ${roleMeta.text} ${roleMeta.border}`}>
                            {avatar(app.full_name)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-foreground text-sm leading-tight hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedApplicant(app)}>
                              {app.full_name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[180px]">{app.email}</p>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                          {statusMeta.label}
                        </span>
                      </div>

                      {/* Role Pill & Details */}
                      <div>
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${roleMeta.bg} ${roleMeta.text} ${roleMeta.border}`}>
                          {app.role}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate font-medium text-foreground">{app.college || 'Academic Institution'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Degree: <strong className="text-foreground">{app.degree || 'B.Tech/MBA'}</strong></span>
                          <span>Duration: <strong className="text-foreground">{app.duration || '6 Mos'}</strong></span>
                        </div>
                        {app.phone && (
                          <div className="flex items-center gap-1.5">
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

                    {/* Bottom Actions: View Details & Assign Role */}
                    <div className="pt-2 border-t border-border flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApplicant(app)}
                        className="flex-1 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-all text-center"
                      >
                        Inspect Details
                      </button>

                      {isAssigned ? (
                        <span className="px-3 py-2 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/30 text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Assigned
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
      {/* TAB 2: INTERNS (ACTIVE SQUAD, TASKS, MILESTONES, DEADLINE EXTENSIONS)     */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'interns' && (
        <div className="space-y-6">
          {activeInterns.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-border bg-card">
              <GraduationCap className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">No active interns enrolled yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Go to the "Data (Registrations)" tab, review incoming applications, and click "Assign Role" to induct candidates into the active squad.
              </p>
              <button
                onClick={() => setActiveTab('data')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs"
              >
                Go to Candidate Applications
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {activeInterns.map(intern => {
                const roleMeta = getRoleMeta(intern.role);
                const internTasks = tasks.filter(t => t.assigned_to_email === intern.email || t.assigned_to_role === 'All');
                const internSubs = submissions.filter(s => s.intern_email === intern.email);
                const internExts = extensions.filter(e => e.intern_email === intern.email);
                const cert = certificates.find(c => c.recipient_email?.toLowerCase() === intern.email.toLowerCase());

                return (
                  <div
                    key={intern.id}
                    className="p-6 rounded-3xl bg-card border border-border shadow-sm hover:border-primary/30 transition-all space-y-5"
                  >
                    {/* Top Row: Intern Info & Quick Contact Buttons */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/80 pb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black border ${roleMeta.bg} ${roleMeta.text} ${roleMeta.border}`}>
                          {avatar(intern.full_name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-black text-foreground">{intern.full_name}</h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${roleMeta.bg} ${roleMeta.text} ${roleMeta.border}`}>
                              {intern.role}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-lime-500/10 text-lime-600 dark:text-lime-400 border border-lime-500/30">
                              Active Intern
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{intern.email} · {intern.college || 'University'}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                            <span>Duration: <strong className="text-foreground">{intern.duration || '6 Months'}</strong></span>
                            <span>Applied: <strong className="text-foreground">{intern.created_at ? intern.created_at.split('T')[0] : '2026'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Contact & Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`mailto:${intern.email}`}
                          className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Mail className="w-3.5 h-3.5 text-primary" /> Email
                        </a>

                        {intern.phone && (
                          <a
                            href={`tel:${intern.phone}`}
                            className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
                          </a>
                        )}

                        <button
                          onClick={() => setAssignTaskTarget(intern)}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center gap-1.5 shadow-sm shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Assign Work / Task
                        </button>
                      </div>
                    </div>

                    {/* Middle Section: Assigned Tasks & Milestones */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-primary" /> Stipulated Tasks & Deliverables ({internTasks.length})
                        </h4>
                        <span className="text-[11px] text-muted-foreground">
                          Submissions Reviewed: <strong>{internSubs.length}</strong>
                        </span>
                      </div>

                      {internTasks.length === 0 ? (
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs text-muted-foreground italic flex items-center justify-between">
                          <span>No tasks assigned to this intern yet.</span>
                          <button
                            onClick={() => setAssignTaskTarget(intern)}
                            className="text-primary font-bold hover:underline"
                          >
                            + Assign first task
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {internTasks.map(task => {
                            const isOverdue = new Date(task.stipulated_deadline).getTime() < Date.now();
                            const sub = internSubs.find(s => s.task_id === task.id);

                            return (
                              <div
                                key={task.id}
                                className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2.5 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <h5 className="font-bold text-foreground text-xs">{task.title}</h5>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                                      task.priority === 'Critical'
                                        ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                                        : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                                    }`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  {task.description && (
                                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2 text-[11px]">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className={`font-semibold ${isOverdue ? 'text-rose-500 font-bold' : 'text-foreground'}`}>
                                      {task.stipulated_deadline} {isOverdue ? '(Overdue)' : ''}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => setExtendDeadlineTarget(task)}
                                      className="px-2.5 py-1 rounded-lg bg-card hover:bg-card/80 border border-border text-[10.5px] font-bold text-foreground transition-all flex items-center gap-1"
                                      title="Extend deadline for this task"
                                    >
                                      <Clock className="w-3 h-3 text-primary" /> Extend Deadline
                                    </button>
                                  </div>
                                </div>

                                {sub && (
                                  <div className="mt-1 p-2 rounded-xl bg-primary/10 border border-primary/20 text-[10.5px] space-y-1">
                                    <div className="flex items-center justify-between text-primary font-bold">
                                      <span>Deliverable Submitted</span>
                                      <span>{sub.status}</span>
                                    </div>
                                    {sub.deliverable_url && (
                                      <a href={sub.deliverable_url} target="_blank" rel="noreferrer" className="text-foreground hover:underline block truncate">
                                        🔗 {sub.deliverable_url}
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Pending Extension Requests for this intern */}
                    {internExts.filter(e => e.status === 'Pending').length > 0 && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                          <AlertCircle className="w-4 h-4" />
                          <span>Extension Request Pending Review</span>
                        </div>
                        {internExts.filter(e => e.status === 'Pending').map(ext => (
                          <div key={ext.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-foreground bg-card/60 p-3 rounded-xl border border-amber-500/20">
                            <div>
                              <p className="font-semibold">{ext.task_title}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">Reason: "{ext.reason}" · Requested: <strong>{ext.requested_deadline}</strong></p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleApproveExtensionReq(ext.id, ext.requested_deadline)}
                                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
                              >
                                Approve Extension
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer: Credentials, LOR & Superpowers */}
                    <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-primary" />
                          <span>Certificate: <strong>{cert ? cert.certificate_no : 'Pending Completion'}</strong></span>
                        </div>
                        <span>·</span>
                        <span>LOR: <strong>Eligible at 2 Years Active</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Promote ${intern.full_name} to full-time Employee?`)) {
                              assignRoleToEmail(intern.email, 'employee', intern.full_name, 'Promoted from Intern');
                              toast.success(`${intern.full_name} promoted to Employee!`);
                              loadData();
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all"
                        >
                          Promote to Employee
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
      {/* MODAL 1: ASSIGN ROLE AS INTERN                                             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {assignRoleTarget && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setAssignRoleTarget(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl text-left"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-lg">Assign Intern Role</h3>
                    <p className="text-xs text-muted-foreground">Authorize candidate login & enable Intern Dashboard access</p>
                  </div>
                </div>
                <button onClick={() => setAssignRoleTarget(null)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                  <p className="text-foreground font-bold text-sm">{assignRoleTarget.full_name}</p>
                  <p className="text-muted-foreground">{assignRoleTarget.email} · {assignRoleTarget.phone || 'No phone'}</p>
                  <p className="text-muted-foreground">College: <strong className="text-foreground">{assignRoleTarget.college}</strong> ({assignRoleTarget.degree})</p>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Assigned Track / Role</label>
                  <input
                    type="text"
                    defaultValue={assignRoleTarget.role}
                    id="assign-role-input"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Duration</label>
                    <select
                      id="assign-duration-select"
                      defaultValue={assignRoleTarget.duration || '6 Months'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="9 Months">9 Months</option>
                      <option value="12 Months">12 Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Starting Date</label>
                    <input
                      type="date"
                      id="assign-start-date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-[11px] leading-relaxed">
                  ✓ <strong>Instant Superpower:</strong> Once confirmed, this user's Google OAuth email will automatically be recognized as an authorized intern. They can tap "Sign in with Google" and will be directed directly into the Intern Dashboard.
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignRoleTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const dur = (document.getElementById('assign-duration-select') as HTMLSelectElement)?.value || '6 Months';
                    handleConfirmAssignRole(assignRoleTarget, dur);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md shadow-primary/25 hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Confirm & Grant Access
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 2: ASSIGN TASK / WORK TO INTERN                                      */}
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
                  <h3 className="font-extrabold text-foreground text-base">Assign Work via Platform</h3>
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
                  handleCreateTask(
                    getVal('taskTitle'),
                    getVal('taskDesc'),
                    getVal('taskDeadline'),
                    getVal('taskPriority') as 'Low' | 'Medium' | 'High' | 'Urgent',
                    assignTaskTarget.email,
                    assignTaskTarget.role
                  );
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="font-bold text-foreground block mb-1">Task Title *</label>
                  <input
                    name="taskTitle"
                    required
                    placeholder="e.g. Conduct discovery calls with 10 commercial offset printers in Nizamabad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Deliverable Requirements / Description</label>
                  <textarea
                    name="taskDesc"
                    rows={3}
                    placeholder="Specific criteria, questionnaire format, Google Drive submission link expectation..."
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Stipulated Deadline *</label>
                    <input
                      name="taskDeadline"
                      type="date"
                      required
                      defaultValue={new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">Priority</label>
                    <select
                      name="taskPriority"
                      defaultValue="High"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAssignTaskTarget(null)}
                    className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md shadow-primary/25 hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Dispatch Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 3: EXTEND DEADLINE                                                   */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {extendDeadlineTarget && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setExtendDeadlineTarget(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-extrabold text-foreground text-sm">Extend Task Deadline</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[260px]">{extendDeadlineTarget.title}</p>
                </div>
                <button onClick={() => setExtendDeadlineTarget(null)} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement)?.value || '';
                  handleExtendDeadline(extendDeadlineTarget.id, getVal('newDate'), getVal('remarks'));
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-foreground block mb-1">Current Deadline</label>
                  <input disabled value={extendDeadlineTarget.stipulated_deadline} className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-muted-foreground" />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">New Extended Deadline *</label>
                  <input
                    name="newDate"
                    type="date"
                    required
                    defaultValue={new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Reason / Remarks</label>
                  <input
                    name="remarks"
                    placeholder="Extension granted for thorough market research validation..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setExtendDeadlineTarget(null)} className="flex-1 py-2 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Confirm Extension</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* DRAWER: APPLICANT FULL DETAILS                                             */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedApplicant && (
          <div className="fixed inset-0 z-[300] flex items-start justify-end" onClick={() => setSelectedApplicant(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative h-full w-full max-w-xl bg-card border-l border-border flex flex-col overflow-hidden shadow-2xl text-left"
            >
              <div className="flex items-start justify-between p-6 border-b border-border bg-muted/20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-base">
                    {avatar(selectedApplicant.full_name)}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-foreground">{selectedApplicant.full_name}</h2>
                    <p className="text-xs text-muted-foreground">{selectedApplicant.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                      {selectedApplicant.role}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedApplicant(null)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* Status selector */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
                  <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Candidate Stage</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Received', 'Interview Scheduled', 'Offered', 'Active', 'Completed', 'Rejected'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedApplicant.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          selectedApplicant.status === st
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border hover:text-foreground'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">College / University</span>
                    <p className="font-bold text-foreground truncate">{selectedApplicant.college || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Degree</span>
                    <p className="font-bold text-foreground truncate">{selectedApplicant.degree || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Phone Number</span>
                    <p className="font-bold text-foreground">{selectedApplicant.phone || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Duration</span>
                    <p className="font-bold text-foreground">{selectedApplicant.duration || '6 Months'}</p>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.resume_url && (
                    <a
                      href={selectedApplicant.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 hover:bg-emerald-500/25"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Resume <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                  {selectedApplicant.linkedin && (
                    <a
                      href={selectedApplicant.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5 hover:bg-blue-500/25"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                    </a>
                  )}
                </div>

                {/* Statement of purpose */}
                {selectedApplicant.statement_of_purpose && (
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                    <h4 className="font-bold text-foreground text-xs">Statement of Purpose / Cover Note</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedApplicant.statement_of_purpose}</p>
                  </div>
                )}
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-border bg-muted/20 flex gap-2.5">
                <button
                  onClick={() => {
                    const target = selectedApplicant;
                    setSelectedApplicant(null);
                    setAssignRoleTarget(target);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/25 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> Assign Role as Intern
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────── */}
      {/* MODAL 4: MANUAL CANDIDATE REGISTRATION                                     */}
      {/* ────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddCandidateModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddCandidateModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-foreground text-base">Direct Intern Registration</h3>
                <button onClick={() => setShowAddCandidateModal(false)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value || '';
                  try {
                    await internshipService.submitApplication({
                      full_name: getVal('fullName'),
                      email: getVal('email').trim().toLowerCase(),
                      phone: getVal('phone'),
                      college: getVal('college'),
                      degree: getVal('degree'),
                      graduation_year: '2026',
                      role: getVal('role') as 'Business Development Intern' | 'Digital Marketing Intern' | 'Product Manager Intern',
                      duration: getVal('duration'),
                      statement_of_purpose: getVal('sop') || 'Direct Admin Intake',
                      resume_url: getVal('resume') || ''
                    });
                    toast.success('Candidate registered!');
                    setShowAddCandidateModal(false);
                    loadData();
                  } catch (_err: unknown) {
                    toast.error('Failed to register candidate');
                  }
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-foreground block mb-1">Full Name *</label>
                  <input name="fullName" required placeholder="e.g. Rohith Sen" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Email *</label>
                    <input name="email" type="email" required placeholder="rohith@example.com" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Phone Number</label>
                    <input name="phone" placeholder="10-digit number" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">College</label>
                    <input name="college" placeholder="e.g. Anurag University" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Degree</label>
                    <input name="degree" defaultValue="B.Tech" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Intern Track / Role</label>
                    <select name="role" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium">
                      <option value="Business Development Intern">Business Development Intern</option>
                      <option value="Digital Marketing Intern">Digital Marketing Intern</option>
                      <option value="Product Manager Intern">Product Manager Intern</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Duration</label>
                    <select name="duration" defaultValue="6 Months" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium">
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="9 Months">9 Months</option>
                      <option value="12 Months">12 Months</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Resume Link</label>
                  <input name="resume" placeholder="https://drive.google.com/..." className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">Notes / Statement</label>
                  <textarea name="sop" rows={2} placeholder="Background, interview notes..." className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium resize-none" />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setShowAddCandidateModal(false)} className="flex-1 py-2 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Save Candidate</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
