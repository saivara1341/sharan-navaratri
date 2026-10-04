import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  FileText, 
  Send, 
  ExternalLink, 
  Gift, 
  TrendingUp, 
  Layers, 
  Search, 
  Filter,
  Check,
  X,
  RefreshCw,
  Award,
  BadgeCheck,
  FileText as FileCert,
  ShieldAlert,
  Eye,
  Star,
  ArrowUpRight,
  Lock,
  Loader2,
  Copy,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  internshipService, 
  InternshipApplication, 
  WhitelistedUser, 
  InternTask, 
  DeadlineExtensionRequest, 
  DataAssetRequest, 
  PointOfProof, 
  IncentiveReward,
  InterlinkAlert,
  CertificateRecord,
  InternReview,
  TaskSubmission
} from '@/services/internshipService';
import { emailService } from '@/services/emailService';

export function AdminInternshipsConsole() {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'whitelist' | 'tasks' | 'submissions' | 'approvals' | 'incentives' | 'proofs' | 'certificates' | 'reviews'>('applications');
  
  // Data states
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistedUser[]>([]);
  const [tasks, setTasks] = useState<InternTask[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [extensions, setExtensions] = useState<DeadlineExtensionRequest[]>([]);
  const [dataRequests, setDataRequests] = useState<DataAssetRequest[]>([]);
  const [incentives, setIncentives] = useState<IncentiveReward[]>([]);
  const [proofs, setProofs] = useState<PointOfProof[]>([]);
  const [interlinks, setInterlinks] = useState<InterlinkAlert[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [reviews, setReviews] = useState<InternReview[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal: Issue Certificate
  const [showIssueCert, setShowIssueCert] = useState(false);
  const [certRecipientName, setCertRecipientName] = useState('');
  const [certRecipientEmail, setCertRecipientEmail] = useState('');
  const [certRole, setCertRole] = useState('Business Development Intern');
  const [certCollege, setCertCollege] = useState('');
  const [certCollegeId, setCertCollegeId] = useState('');
  const [certGovtType, setCertGovtType] = useState('Aadhaar Card');
  const [certGovtMasked, setCertGovtMasked] = useState('');
  const [certDuration, setCertDuration] = useState('6 Months');
  const [certStartDate, setCertStartDate] = useState('');
  const [certCompletionDate, setCertCompletionDate] = useState('');
  const [certGrade, setCertGrade] = useState<'Outstanding' | 'Exemplary' | 'Distinction' | 'Merit'>('Outstanding');
  const [certAchievements, setCertAchievements] = useState('');
  const [certProofCount, setCertProofCount] = useState(0);

  // Search & Filters
  const [appSearch, setAppSearch] = useState('');
  const [appRoleFilter, setAppRoleFilter] = useState('all');

  // Modal: View Candidate Application Details
  const [selectedViewApp, setSelectedViewApp] = useState<InternshipApplication | null>(null);
  const [openingResumeUrl, setOpeningResumeUrl] = useState<string | null>(null);
  const [storageBucketErrorModal, setStorageBucketErrorModal] = useState<boolean>(false);

  const handleOpenResume = async (url: string, candidateName?: string) => {
    if (!url) {
      toast.error('No resume document attached.');
      return;
    }
    setOpeningResumeUrl(url);
    try {
      const result = await internshipService.openResumeDocument(url, candidateName);
      if (!result.success) {
        if (result.code === 'NoSuchBucket' || result.error?.includes('NoSuchBucket') || result.error?.includes('Bucket not found')) {
          setStorageBucketErrorModal(true);
          toast.error('Supabase storage bucket not found. Please apply the SQL setup script.');
        } else {
          toast.error(result.error || 'Failed to open resume document.');
        }
      }
    } catch (err: any) {
      toast.error('Could not open candidate resume: ' + (err?.message || 'Error'));
    } finally {
      setOpeningResumeUrl(null);
    }
  };

  // Modal: Schedule Interview
  const [scheduleModalApp, setScheduleModalApp] = useState<InternshipApplication | null>(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [sendingInvite, setSendingInvite] = useState(false);

  // Modal: Add Whitelist User
  const [showAddWhitelist, setShowAddWhitelist] = useState(false);
  const [wlEmail, setWlEmail] = useState('');
  const [wlName, setWlName] = useState('');
  const [wlRole, setWlRole] = useState<'intern' | 'employee'>('intern');
  const [wlNotes, setWlNotes] = useState('');

  // Modal: Create Task
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskRole, setTaskRole] = useState<'Business Development' | 'Digital Marketing' | 'All'>('All');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Critical'>('High');

  // Modal: Add Incentive Reward
  const [showAddIncentive, setShowAddIncentive] = useState(false);
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incItems, setIncItems] = useState('');
  const [incMilestone, setIncMilestone] = useState('');
  const [incImage, setIncImage] = useState('');
  const [incRole, setIncRole] = useState<'All' | 'Business Development' | 'Digital Marketing'>('All');

  const refreshData = async () => {
    setLoading(true);
    try {
      const apps = await internshipService.getApplications();
      setApplications(apps);
      setWhitelist(internshipService.getWhitelist());
      setTasks(internshipService.getTasks());
      setSubmissions(internshipService.getTaskSubmissions());
      setExtensions(internshipService.getExtensionRequests());
      setDataRequests(internshipService.getDataRequests());
      setIncentives(internshipService.getIncentiveRewards());
      setProofs(internshipService.getPointsOfProof());
      setInterlinks(internshipService.getInterlinks());
      setCertificates(internshipService.getCertificates());
      setReviews(internshipService.getInternReviews());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSendInterviewInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalApp || !interviewDate || !interviewTime) return;

    setSendingInvite(true);
    try {
      // Send official email
      await emailService.internInterviewInvite(
        scheduleModalApp.email,
        scheduleModalApp.full_name,
        scheduleModalApp.role,
        interviewDate,
        interviewTime,
        meetingLink
      );

      // Update application status
      await internshipService.updateApplicationStatus(scheduleModalApp.id, 'Interview Scheduled', {
        date: interviewDate,
        time: interviewTime,
        meet_link: meetingLink
      });

      // Also automatically ensure candidate is whitelisted for interview / intern access if needed
      internshipService.addWhitelistedEmail(
        scheduleModalApp.email,
        scheduleModalApp.full_name,
        'intern',
        `Interview scheduled for ${scheduleModalApp.role} on ${interviewDate}`
      );

      toast.success(`Interview invitation email dispatched to ${scheduleModalApp.email}!`);
      setScheduleModalApp(null);
      refreshData();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to send interview invitation email.');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleIssueOffer = async (app: InternshipApplication) => {
    try {
      await emailService.internOfferLetter(
        app.email,
        app.full_name,
        app.role,
        app.duration,
        new Date().toLocaleDateString('en-IN')
      );

      await internshipService.updateApplicationStatus(app.id, 'Offered');

      internshipService.addWhitelistedEmail(
        app.email,
        app.full_name,
        'intern',
        `Official offer issued for ${app.role} (${app.duration})`
      );

      toast.success(`Official Offer Letter sent to ${app.email} and email whitelisted for portal access!`);
      refreshData();
    } catch (err) {
      toast.error('Failed to issue offer letter.');
    }
  };

  const handleDeleteApp = async (app: InternshipApplication) => {
    if (!window.confirm(`Permanently delete application for "${app.full_name}" (${app.email}) from Supabase and local cache?`)) {
      return;
    }
    const ok = await internshipService.deleteApplication(app.id, app.email);
    if (ok) {
      setApplications(prev => prev.filter(a => a.id !== app.id && a.email.toLowerCase() !== app.email.toLowerCase()));
      toast.success(`Application for ${app.full_name} permanently deleted.`);
      if (selectedViewApp?.id === app.id) {
        setSelectedViewApp(null);
      }
    } else {
      toast.error('Failed to delete application from database.');
    }
  };

  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlEmail || !wlName) return;

    internshipService.addWhitelistedEmail(wlEmail, wlName, wlRole, wlNotes);
    toast.success(`${wlEmail} whitelisted for ${wlRole} role!`);
    setShowAddWhitelist(false);
    setWlEmail('');
    setWlName('');
    setWlNotes('');
    refreshData();
  };

  const handleRemoveWhitelist = (id: string, email: string) => {
    if (confirm(`Remove ${email} from authorized whitelist? They will no longer be able to log in to internal hub.`)) {
      internshipService.removeWhitelistedEmail(id);
      toast.success(`${email} removed from whitelist.`);
      refreshData();
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDesc || !taskDeadline) return;

    internshipService.createTask({
      title: taskTitle,
      description: taskDesc,
      assigned_to_role: taskRole,
      stipulated_deadline: taskDeadline,
      priority: taskPriority,
      status: 'In Progress',
      created_by: 'CEO Sai Vara Prasad'
    });

    toast.success('New task assigned with stipulated deadline!');
    setShowCreateTask(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskDeadline('');
    refreshData();
  };

  const handleAddIncentive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc || !incMilestone) return;

    const items = incItems ? incItems.split(',').map(s => s.trim()) : ['Branded Goodies'];
    internshipService.createIncentiveReward({
      title: incTitle,
      description: incDesc,
      items_included: items,
      required_milestone: incMilestone,
      role_target: incRole,
      image_url: incImage || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
      scratch_code: 'SD-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      is_active: true
    });

    toast.success('New incentive reward created with scratch code!');
    setShowAddIncentive(false);
    setIncTitle('');
    setIncDesc('');
    setIncItems('');
    setIncMilestone('');
    setIncImage('');
    refreshData();
  };

  const handleDeleteIncentive = (id: string) => {
    if (confirm('Delete this milestone reward?')) {
      internshipService.deleteIncentiveReward(id);
      toast.success('Incentive reward deleted.');
      refreshData();
    }
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certRecipientName || !certRecipientEmail || !certStartDate || !certCompletionDate) {
      toast.error('Recipient name, email, and dates are required.');
      return;
    }
    const achievements = certAchievements.split('\n').map(a => a.trim()).filter(Boolean);
    internshipService.issueCertificate({
      recipient_name: certRecipientName,
      recipient_email: certRecipientEmail,
      role: certRole,
      college_name: certCollege,
      college_id_number: certCollegeId,
      govt_id_type: certGovtType,
      govt_id_masked: certGovtMasked || 'XXXX-XXXX-XXXX',
      duration: certDuration,
      start_date: certStartDate,
      completion_date: certCompletionDate,
      grade: certGrade,
      issued_by: 'Sarugu Sai Vara Prasad, Founder & Designated Partner',
      key_achievements: achievements,
      points_of_proof_count: certProofCount
    });
    toast.success(`Official certificate issued for ${certRecipientName}!`);
    setShowIssueCert(false);
    setCertRecipientName('');
    setCertRecipientEmail('');
    setCertCollege('');
    setCertCollegeId('');
    setCertGovtMasked('');
    setCertAchievements('');
    setCertProofCount(0);
    refreshData();
  };

  const handleRevokeCertificate = (id: string, name: string) => {
    if (confirm(`Revoke certificate for ${name}? This action is permanent.`)) {
      internshipService.revokeCertificate(id);
      toast.success(`Certificate revoked for ${name}.`);
      refreshData();
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.email.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.college.toLowerCase().includes(appSearch.toLowerCase());

    if (appRoleFilter === 'bd') return matchesSearch && app.role.includes('Business Development');
    if (appRoleFilter === 'dm') return matchesSearch && app.role.includes('Digital Marketing');
    if (appRoleFilter === 'pm') return matchesSearch && app.role.includes('Product Manager');
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Sub Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'applications', label: 'Intern Applications', icon: GraduationCap, count: applications.length },
            { id: 'whitelist', label: 'Authorized Whitelist', icon: ShieldCheck, count: whitelist.length },
            { id: 'tasks', label: 'Task Stipulations', icon: Clock, count: tasks.length },
            { id: 'submissions', label: 'Intern Submissions', icon: CheckCircle2, count: submissions.filter(s => s.status === 'Under Review').length },
            { id: 'approvals', label: 'CEO Approvals', icon: CheckCircle2, count: extensions.filter(e => e.status === 'Pending').length + dataRequests.filter(d => d.status === 'Pending').length },
            { id: 'incentives', label: 'Milestone Goodies (CRUD)', icon: Gift, count: incentives.length },
            { id: 'proofs', label: 'Points of Proof & Interlinks', icon: Award, count: proofs.length },
            { id: 'certificates', label: 'Certificates & Records', icon: BadgeCheck, count: certificates.length },
            { id: 'reviews', label: 'Intern Reviews (Google Gated)', icon: Star, count: reviews.length },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${activeSubTab === tab.id ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'bg-muted/50 text-muted-foreground hover:text-foreground border border-border/50'}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-foreground/80 border border-border'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={refreshData}
          disabled={loading}
          className="p-2 rounded-xl bg-muted/60 hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Refresh All Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* SUB-TAB 1: Applications */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-foreground">Internship Applicants Registry</h3>
              <p className="text-xs text-muted-foreground">Review incoming MBA & BBA submissions, inspect SOPs, and send 1-click Google Meet interview invites.</p>
            </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Registered</p>
                <h4 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">{applications.length}</h4>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Mgmt</p>
                <h4 className="text-xl sm:text-2xl font-black text-emerald-500 mt-0.5">
                  {applications.filter(a => a.role.includes('Product Manager')).length}
                </h4>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Business Dev</p>
                <h4 className="text-xl sm:text-2xl font-black text-blue-500 mt-0.5">
                  {applications.filter(a => a.role.includes('Business Development')).length}
                </h4>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">Digital Mktg</p>
                <h4 className="text-xl sm:text-2xl font-black text-purple-500 mt-0.5">
                  {applications.filter(a => a.role.includes('Digital Marketing')).length}
                </h4>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                  placeholder="Search name, email, college..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border/50 text-xs text-foreground focus:outline-none focus:border-primary w-48 sm:w-64"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'all', label: 'All Roles', count: applications.length, color: 'bg-primary text-primary-foreground', inactive: 'bg-muted/60 text-muted-foreground border border-border/50 hover:text-foreground' },
                  { key: 'pm', label: '🟢 Product Mgmt', count: applications.filter(a => a.role.includes('Product Manager')).length, color: 'bg-emerald-500 text-white', inactive: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' },
                  { key: 'bd', label: '🔵 Biz Dev', count: applications.filter(a => a.role.includes('Business Development')).length, color: 'bg-blue-500 text-white', inactive: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/20' },
                  { key: 'dm', label: '🟣 Digital Mktg', count: applications.filter(a => a.role.includes('Digital Marketing')).length, color: 'bg-purple-500 text-white', inactive: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 hover:bg-purple-500/20' },
                ].map(pill => (
                  <button
                    key={pill.key}
                    onClick={() => setAppRoleFilter(pill.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      appRoleFilter === pill.key ? pill.color + ' shadow-sm' : pill.inactive
                    }`}
                  >
                    {pill.label}
                    <span className={`px-1.5 py-0 rounded-full text-[10px] font-black ${
                      appRoleFilter === pill.key ? 'bg-white/25' : 'bg-black/10 dark:bg-white/10'
                    }`}>{pill.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Role & Duration</th>
                    <th className="py-3.5 px-4">College & Degree</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Resume / CV</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-muted-foreground">
                        No internship applications found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          <div className="font-extrabold text-foreground text-xs sm:text-sm">{app.full_name}</div>
                          <div className="text-[10.5px] text-muted-foreground font-medium">{app.created_at.split('T')[0]}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold block w-fit mb-1 ${
                            app.role.includes('Product Manager')
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : app.role.includes('Business')
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                              : 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                          }`}>
                            {app.role}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-semibold">{app.duration}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-foreground">{app.college}</div>
                          <div className="text-[11px] text-primary font-bold">{app.degree} ({app.graduation_year})</div>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/90">
                          <div className="font-medium text-foreground">{app.email}</div>
                          <div className="text-[11px] text-muted-foreground font-mono">{app.phone}</div>
                          {app.linkedin && (
                            <div className="mt-0.5">
                              <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-[10.5px] text-primary hover:underline inline-flex items-center gap-0.5 font-semibold">
                                LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {app.resume_url ? (
                            <div className="flex flex-col gap-1">
                              {app.resume_url.split(/\s*\|\s*|\s*,\s*/).filter(Boolean).map((url, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleOpenResume(url, app.full_name)}
                                  disabled={openingResumeUrl === url}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all w-fit shadow-xs group cursor-pointer disabled:opacity-60"
                                  title="Open candidate resume"
                                >
                                  {openingResumeUrl === url ? (
                                    <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin shrink-0" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                                  )}
                                  <span>{openingResumeUrl === url ? 'Opening...' : 'View Resume ↗'}</span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center text-[11px] text-muted-foreground italic px-2.5 py-1 rounded-md bg-muted/40 border border-border/50">
                              Not attached
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                            app.status === 'Interview Scheduled'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                              : app.status === 'Offered'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-muted text-foreground/80 border border-border'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedViewApp(app)}
                              className="px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-[11px] font-bold transition-colors cursor-pointer border border-border flex items-center gap-1"
                              title="View full candidate application & SOP"
                            >
                              <Eye className="w-3 h-3 text-muted-foreground" /> Details
                            </button>
                            <button
                              onClick={() => {
                                setScheduleModalApp(app);
                                setInterviewDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-colors cursor-pointer border border-primary/25"
                            >
                              Schedule Interview
                            </button>
                            <button
                              onClick={() => handleIssueOffer(app)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold transition-colors cursor-pointer border border-emerald-500/25"
                            >
                              Issue Offer
                            </button>
                            <button
                              onClick={() => handleDeleteApp(app)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 hover:text-rose-600 transition-colors cursor-pointer border border-rose-500/25"
                              title="Permanently delete application from database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Whitelist Access Control */}
      {activeSubTab === 'whitelist' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-foreground">Authorized Email Whitelist (Access Control)</h3>
              <p className="text-xs text-muted-foreground">
                Only users whose emails are listed here can enter Employee or Intern workspaces. Any other sign-in attempt is automatically rejected.
              </p>
            </div>

            <button
              onClick={() => setShowAddWhitelist(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" /> Add Authorized Email
            </button>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Authorized User</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Permitted Role</th>
                  <th className="py-3 px-4">Added Date</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {whitelist.map(wl => (
                  <tr key={wl.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{wl.name}</td>
                    <td className="py-3.5 px-4 font-mono text-foreground">{wl.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${wl.role === 'employee' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30' : 'bg-primary/15 text-primary border border-primary/30'}`}>
                        {wl.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{wl.added_at}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{wl.notes || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRemoveWhitelist(wl.id, wl.email)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Revoke access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Task Stipulations */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-foreground">Task Assignments & Deadlines</h3>
              <p className="text-xs text-muted-foreground">Assign tasks to Business Development or Digital Marketing interns with strict completion deadlines.</p>
            </div>

            <button
              onClick={() => setShowCreateTask(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" /> Assign New Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <div key={task.id} className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-3 shadow-sm">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10">
                      {task.assigned_to_role}
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">Due: {task.stipulated_deadline}</span>
                  </div>
                  <h4 className="font-extrabold text-foreground text-sm mb-1">{task.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                </div>
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Priority: <strong className="text-foreground">{task.priority}</strong></span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: Intern Work Submissions & Verification */}
      {activeSubTab === 'submissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-foreground">Intern Work Submissions & Verification</h3>
              <p className="text-xs text-muted-foreground">Inspect submitted deliverables, review work quality, and verify points of proof for completion certificates.</p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-card border border-border text-muted-foreground">
              <CheckCircle2 className="w-10 h-10 mx-auto text-primary mb-2 opacity-50" />
              <p className="font-bold text-foreground text-sm">No intern deliverables submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map(sub => (
                <div key={sub.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10">
                          {sub.role}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {sub.intern_name} ({sub.intern_email})
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-foreground">{sub.task_title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Submitted: {sub.submitted_at}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        sub.status === 'Verified & Approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : sub.status === 'Revision Requested'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground block mb-1">Summary of Work Accomplished:</strong>
                    <p className="bg-muted/40 p-3 rounded-xl border border-border/50 text-foreground">{sub.summary_of_work}</p>
                  </div>

                  {sub.metrics_or_outcome && (
                    <div className="text-xs">
                      <strong className="text-primary">Key Metrics / Outcome: </strong>
                      <span className="text-foreground">{sub.metrics_or_outcome}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs">
                    <a
                      href={sub.deliverable_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline flex items-center gap-1.5 font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Deliverable Link ({sub.deliverable_url.slice(0, 50)}...)
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const note = prompt('Enter revision feedback for intern:');
                          if (note) {
                            internshipService.reviewTaskSubmission(sub.id, 'Revision Requested', note);
                            toast.success(`Revision request logged for ${sub.intern_name}.`);
                            refreshData();
                          }
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-colors cursor-pointer border border-rose-500/20"
                      >
                        Request Revision
                      </button>

                      <button
                        onClick={() => {
                          internshipService.reviewTaskSubmission(sub.id, 'Verified & Approved', 'Deliverable verified & approved by Founder & CEO.');
                          toast.success(`Task verified and approved for ${sub.intern_name}!`);
                          refreshData();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        Verify & Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: CEO Approvals */}
      {activeSubTab === 'approvals' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-foreground">CEO Approvals Desk</h3>
            <p className="text-xs text-muted-foreground">Review intern deadline extension requests and client data/asset requests.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extensions */}
            <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Deadline Extension Requests ({extensions.filter(e => e.status === 'Pending').length} Pending)
              </h4>
              {extensions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No pending extension requests.</p>
              ) : (
                <div className="space-y-3">
                  {extensions.map(ext => (
                    <div key={ext.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-foreground">{ext.intern_name}</strong>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">{ext.status}</span>
                      </div>
                      <p className="text-foreground/90 font-medium">Task: {ext.task_title}</p>
                      <p className="text-muted-foreground">Reason: {ext.reason}</p>
                      <p className="text-[11px] text-primary font-bold">Requested Date: {ext.requested_deadline}</p>
                      {ext.status === 'Pending' && (
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              internshipService.reviewExtension(ext.id, 'Approved', 'Approved by CEO', ext.requested_deadline);
                              toast.success('Deadline extension approved!');
                              refreshData();
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-bold cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              internshipService.reviewExtension(ext.id, 'Rejected', 'Please stick to current milestone deadline.');
                              toast.error('Extension rejected.');
                              refreshData();
                            }}
                            className="px-3 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 font-bold cursor-pointer transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data Requests */}
            <div className="p-6 rounded-3xl border border-border bg-card space-y-4">
              <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> Data & Asset Requests ({dataRequests.filter(d => d.status === 'Pending').length} Pending)
              </h4>
              {dataRequests.length === 0 ? (
                <p className="text-xs text-muted-foreground">No pending data requests.</p>
              ) : (
                <div className="space-y-3">
                  {dataRequests.map(d => (
                    <div key={d.id} className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-foreground">{d.intern_name}</strong>
                        <span className="text-primary font-bold">{d.category}</span>
                      </div>
                      <p className="text-foreground font-semibold">{d.title}</p>
                      <p className="text-muted-foreground">{d.description}</p>
                      {d.status === 'Pending' && (
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              const responseText = prompt('Enter fulfill note, Google Drive link, or asset instructions:');
                              if (responseText) {
                                internshipService.reviewDataRequest(d.id, 'Approved', responseText);
                                toast.success('Asset request fulfilled & approved!');
                                refreshData();
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-bold cursor-pointer"
                          >
                            Fulfill & Approve
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Milestone Goodies & Scratch Cards (CRUD) */}
      {activeSubTab === 'incentives' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-foreground">Milestone Incentive Rewards Manager</h3>
              <p className="text-xs text-muted-foreground">Add, edit, and delete physical goodies (office bags, pens, mugs, sipper bottles, headsets) with scratch code generation.</p>
            </div>

            <button
              onClick={() => setShowAddIncentive(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" /> Add Incentive Reward
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {incentives.map(inc => (
              <div key={inc.id} className="p-6 rounded-3xl border border-border bg-card flex flex-col justify-between space-y-4 shadow-md">
                <div>
                  <div className="w-full h-32 rounded-2xl bg-muted overflow-hidden mb-3">
                    <img src={inc.image_url} alt={inc.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-extrabold text-foreground text-base mb-1">{inc.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{inc.description}</p>
                  <div className="space-y-1 text-xs text-foreground/90">
                    {inc.items_included.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-primary" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50 space-y-2">
                  <div className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Milestone:</strong> {inc.required_milestone}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <code className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {inc.scratch_code || 'SD-REWARD'}
                    </code>
                    <button
                      onClick={() => handleDeleteIncentive(inc.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Reward"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: Points of Proof & Interlinks */}
      {activeSubTab === 'proofs' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-black text-foreground">Verified Point of Proof (PoP) Submissions</h3>
            <p className="text-xs text-muted-foreground">Verify intern performance evidence to approve recommendation letters and milestone goodies.</p>
          </div>

          <div className="space-y-4">
            {proofs.map(p => (
              <div key={p.id} className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-foreground text-sm">{p.intern_name}</strong>
                    <span className="text-xs text-muted-foreground ml-2">({p.role})</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${p.status === 'Verified by CEO' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'}`}>
                    {p.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-foreground text-xs">{p.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-foreground/90">
                    <strong className="text-rose-500 block text-[10px]">BEFORE:</strong> {p.before_state}
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-foreground/90">
                    <strong className="text-emerald-600 dark:text-emerald-400 block text-[10px]">AFTER:</strong> {p.after_state}
                  </div>
                </div>
                <div className="text-xs text-primary font-bold">Metric: {p.metric_summary}</div>
                {p.status !== 'Verified by CEO' && (
                  <button
                    onClick={() => {
                      internshipService.verifyPointOfProof(p.id, 'Verified by CEO');
                      toast.success('Point of Proof verified!');
                      refreshData();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-bold cursor-pointer transition-colors border border-emerald-500/25"
                  >
                    Verify Proof as CEO
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: Certificates & Records */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-foreground">Issued Certificates & Permanent Records</h3>
              <p className="text-xs text-muted-foreground">Immutable, tamper-proof credential ledger for all interns and employees. Every entry has a unique Certificate No and anti-tamper cryptographic checksum.</p>
            </div>
            <button
              onClick={() => setShowIssueCert(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex-shrink-0"
            >
              <BadgeCheck className="w-4 h-4" />
              Issue Official Certificate
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/50">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Certificate No</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Recipient</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Role</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">College & Student ID</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Duration</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Issue Date</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Grade</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.length === 0 && (
                  <tr><td colSpan={9} className="text-center text-muted-foreground py-8 text-xs">No certificates issued yet. Issue the first official certificate above.</td></tr>
                )}
                {certificates.map((cert) => (
                  <tr key={cert.id} className="border-b border-border/30 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-primary font-bold">{cert.certificate_no}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{cert.recipient_name}</div>
                      <div className="text-muted-foreground text-[11px]">{cert.recipient_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                        {cert.role.replace(' Intern', '')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{cert.college_name || '—'}</div>
                      <div className="text-muted-foreground font-mono text-[11px]">ID: {cert.college_id_number || '—'}</div>
                      <div className="text-muted-foreground font-mono text-[11px]">{cert.govt_id_type}: {cert.govt_id_masked}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{cert.duration}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{cert.issue_date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        cert.grade === 'Outstanding' ? 'bg-amber-500/20 text-amber-400' :
                        cert.grade === 'Exemplary' ? 'bg-emerald-500/20 text-emerald-400' :
                        cert.grade === 'Distinction' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>{cert.grade}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        cert.status === 'Valid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>{cert.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/verify-certificate?no=${cert.certificate_no}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                          title="View & Verify Certificate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {cert.status === 'Valid' && (
                          <button
                            onClick={() => handleRevokeCertificate(cert.id, cert.recipient_name)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Revoke Certificate"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200">
            <p className="font-semibold mb-1">Security Note — Anti-Tamper Certificates</p>
            <p className="text-white/70">All certificates are non-editable, non-copyable, and rendered with cryptographic checksums. Recipients and third parties can verify authenticity at <strong className="text-white">siddhidynamics.in/verify-certificate</strong>. Revoking a certificate is irreversible.</p>
          </div>
        </div>
      )}

      {/* ─── TAB 8: Intern Reviews (Gated Google Reputation) ─── */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                Intern Reviews & Google Rating Gating
              </h3>
              <p className="text-xs text-muted-foreground">
                Automated reputation firewall: Positive reviews (4-5★) are prompted to post on Google Maps to boost ranking. Critical reviews (1-3★) are retained internally for CEO resolution.
              </p>
            </div>
            <a
              href="https://g.page/r/CQ8YjZSqkk-5EBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Google Reviews Listing</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Total Reviews</span>
              <div className="text-2xl font-black text-foreground">{reviews.length}</div>
              <p className="text-[10.5px] text-muted-foreground">All submitted intern ratings</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider block">Average Intern Score</span>
              <div className="text-2xl font-black text-amber-500 dark:text-amber-300 flex items-center gap-1">
                <span>{(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}</span>
                <span className="text-sm font-normal text-muted-foreground">/ 5.0</span>
              </div>
              <p className="text-[10.5px] text-muted-foreground">Overall platform satisfaction</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-emerald-500/20 bg-emerald-500/5 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Google Maps Candidates</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {reviews.filter(r => r.rating >= 4).length}
              </div>
              <p className="text-[10.5px] text-emerald-600/80 dark:text-emerald-300/70">4★ & 5★ reviews prompted for Google</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-indigo-500/20 bg-indigo-500/5 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Private CEO Escalations</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300">
                {reviews.filter(r => r.rating <= 3).length}
              </div>
              <p className="text-[10.5px] text-indigo-600/80 dark:text-indigo-300/70">≤3★ blocked from Google (Private)</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
              <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                Intern Feedback Ledger & Gating Status
              </h4>
              <span className="text-xs text-muted-foreground font-semibold">{reviews.length} entries</span>
            </div>

            <div className="divide-y divide-border/40">
              {reviews.map(rev => (
                <div key={rev.id} className="p-5 space-y-3 hover:bg-muted/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <span className="font-extrabold text-foreground text-sm">{rev.intern_name}</span>
                      <span className="text-xs text-muted-foreground">({rev.intern_email})</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        {rev.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rev.rating >= 4 ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                          <span>🟢 Google Maps Candidate</span>
                          {rev.posted_to_google && <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-extrabold">• Shared ✓</span>}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>🔒 Blocked from Google (Private Escalation)</span>
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground">{rev.submitted_at}</span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-foreground">"{rev.review_title}"</span>
                      <span className="text-[11px] text-primary font-bold">{rev.category}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed italic">
                      "{rev.review_text}"
                    </p>
                  </div>

                  {/* Recommendation badge & Admin Action */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-muted-foreground text-[11px]">
                      Peer Recommendation: <strong className={rev.would_recommend ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{rev.would_recommend ? 'Yes, Recommended' : 'Suggested Improvements'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {rev.rating <= 3 && rev.status !== 'Resolved Internally' && (
                        <button
                          onClick={() => {
                            internshipService.updateReviewStatus(rev.id, 'Resolved Internally', 'Addressed by CEO directly');
                            setReviews(internshipService.getInternReviews());
                            toast.success(`Marked feedback from ${rev.intern_name} as Resolved Internally.`);
                          }}
                          className="px-3 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          Mark Resolved Internally
                        </button>
                      )}
                      {rev.status === 'Resolved Internally' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          ✓ Resolved Internally
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground leading-relaxed">
            <p className="font-bold text-foreground mb-1">Reputation Engine Guarantee</p>
            <p>
              Only interns who rate <strong className="text-foreground">4 or 5 stars</strong> see the Google Maps review button and copy-paste prompt. Any intern rating <strong className="text-foreground">1, 2, or 3 stars</strong> is automatically blocked from the Google Maps prompt and routed strictly to this private leadership dashboard, completely insulating your Google Maps rating and local SEO rankings.
            </p>
          </div>
        </div>
      )}

      {/* Modal: View Candidate Application Details & Resume */}
      <AnimatePresence>
        {selectedViewApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-left"
            >
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-foreground text-lg sm:text-xl">{selectedViewApp.full_name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedViewApp.status === 'Interview Scheduled'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        : selectedViewApp.status === 'Offered'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-muted text-foreground/80 border border-border'
                    }`}>
                      {selectedViewApp.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Applied on {selectedViewApp.created_at.split('T')[0]} • ID: <span className="font-mono text-[11px]">{selectedViewApp.id.slice(0, 8)}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedViewApp(null)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of Key Candidate Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-[10.5px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Role & Tenure</p>
                  <p className="font-extrabold text-foreground">{selectedViewApp.role}</p>
                  <p className="text-muted-foreground mt-0.5 font-medium">Duration: <strong className="text-foreground">{selectedViewApp.duration}</strong></p>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-[10.5px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Academic Credentials</p>
                  <p className="font-extrabold text-foreground">{selectedViewApp.college}</p>
                  <p className="text-primary font-bold mt-0.5">{selectedViewApp.degree} (Class of {selectedViewApp.graduation_year})</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-[10.5px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Contact Details</p>
                  <p className="font-medium text-foreground">
                    <a href={`mailto:${selectedViewApp.email}`} className="hover:text-primary hover:underline">{selectedViewApp.email}</a>
                  </p>
                  <p className="font-mono text-muted-foreground mt-0.5">
                    <a href={`tel:${selectedViewApp.phone}`} className="hover:text-primary">{selectedViewApp.phone}</a>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60">
                  <p className="text-[10.5px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Profiles & Links</p>
                  <div className="space-y-1">
                    {selectedViewApp.linkedin ? (
                      <a href={selectedViewApp.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 font-semibold">
                        LinkedIn Profile <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">No LinkedIn provided</span>
                    )}
                    {selectedViewApp.portfolio_or_social && (
                      <p className="text-muted-foreground text-[11px] truncate">
                        Other: {selectedViewApp.portfolio_or_social}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume Document Card */}
              <div className="p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-foreground text-xs sm:text-sm">Candidate Resume / CV</h4>
                      <p className="text-[11px] text-muted-foreground">Uploaded document stored in Supabase Storage</p>
                    </div>
                  </div>
                  {selectedViewApp.resume_url ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedViewApp.resume_url.split(/\s*\|\s*|\s*,\s*/).filter(Boolean).map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleOpenResume(url, selectedViewApp.full_name)}
                          disabled={openingResumeUrl === url}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                          title="Open candidate resume document"
                        >
                          {openingResumeUrl === url ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Opening Resume...</span>
                            </>
                          ) : (
                            <>
                              <span>Open Resume Document</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic font-medium px-3 py-1.5 rounded-lg bg-muted/60 border border-border">
                      No resume uploaded
                    </span>
                  )}
                </div>
                {selectedViewApp.resume_url && (
                  <p className="text-[11px] text-muted-foreground break-all font-mono">
                    URL: {selectedViewApp.resume_url}
                  </p>
                )}
              </div>

              {/* Statement of Purpose */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wider">
                  Statement of Purpose & Career Objectives
                </label>
                <div className="p-4 rounded-2xl bg-muted/30 border border-border text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto font-sans">
                  {selectedViewApp.statement_of_purpose || 'No statement of purpose provided.'}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setSelectedViewApp(null)}
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground border border-border transition-colors cursor-pointer"
                >
                  Close
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const app = selectedViewApp;
                      setSelectedViewApp(null);
                      setScheduleModalApp(app);
                      setInterviewDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors cursor-pointer border border-primary/20"
                  >
                    Schedule Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const app = selectedViewApp;
                      handleDeleteApp(app);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer border border-rose-500/20 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Application
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const app = selectedViewApp;
                      setSelectedViewApp(null);
                      handleIssueOffer(app);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold transition-colors cursor-pointer border border-emerald-500/20"
                  >
                    Issue Offer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Storage Bucket Setup & Fix Instructions */}
      <AnimatePresence>
        {storageBucketErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border-2 border-amber-500/40 w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-amber-500">
                  <Database className="w-5 h-5" />
                  <h3 className="font-black text-lg text-foreground">Storage Bucket Setup Required</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setStorageBucketErrorModal(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 leading-relaxed font-medium">
                The storage bucket <code className="font-mono font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">career-resumes</code> has not yet been registered in your Supabase project, causing Supabase to return <span className="font-mono font-bold">404 (NoSuchBucket)</span> when opening resumes.
              </div>

              <div className="space-y-2">
                <p className="text-xs text-foreground font-bold">How to fix in 30 seconds:</p>
                <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Open your <strong>Supabase Dashboard</strong> (<a href="https://supabase.com/dashboard/project/xoqpxckowwubeqdtazks/sql" target="_blank" rel="noreferrer" className="text-primary underline font-medium">project/xoqpxckowwubeqdtazks/sql</a>).</li>
                  <li>Click <strong>SQL Editor</strong> in the left sidebar.</li>
                  <li>Click <strong>New Query</strong>, paste the script below, and click <strong>Run</strong>.</li>
                  <li>Done! All candidate resumes will open instantly.</li>
                </ol>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">SQL Fix Script</span>
                  <button
                    type="button"
                    onClick={() => {
                      const sql = `-- 1. Create 'career-resumes' public storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('career-resumes', 'career-resumes', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Make 'project-attachments' bucket public for existing uploaded resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-attachments', 'project-attachments', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Allow uploads and reading
DROP POLICY IF EXISTS "Public candidate resume uploads" ON storage.objects;
CREATE POLICY "Public candidate resume uploads" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'career-resumes');

DROP POLICY IF EXISTS "Allow reading candidate resumes" ON storage.objects;
CREATE POLICY "Allow reading candidate resumes" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'career-resumes');

DROP POLICY IF EXISTS "Allow reading project attachments" ON storage.objects;
CREATE POLICY "Allow reading project attachments" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'project-attachments');`;
                      navigator.clipboard.writeText(sql);
                      toast.success('SQL fix script copied to clipboard!');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy SQL Script
                  </button>
                </div>
                <div className="p-3 bg-muted/60 border border-border rounded-xl font-mono text-[11px] text-foreground/80 max-h-36 overflow-y-auto whitespace-pre">
{`INSERT INTO storage.buckets (id, name, public) VALUES ('career-resumes', 'career-resumes', true) ON CONFLICT (id) DO UPDATE SET public = true;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-attachments', 'project-attachments', true) ON CONFLICT (id) DO UPDATE SET public = true;`}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setStorageBucketErrorModal(false)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  I Understand / Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Schedule Interview */}
      <AnimatePresence>
        {scheduleModalApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-base">Schedule Interview & Send Invite</h3>
                <button onClick={() => setScheduleModalApp(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                To: <strong className="text-foreground">{scheduleModalApp.full_name}</strong> ({scheduleModalApp.email})<br />
                Role: {scheduleModalApp.role}
              </p>

              <form onSubmit={handleSendInterviewInvite} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Interview Time *</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 11:30 AM IST"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Video Meeting Link (Google Meet) *</label>
                  <input
                    type="url"
                    required
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setScheduleModalApp(null)}
                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground border border-border cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingInvite}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider disabled:opacity-50"
                  >
                    {sendingInvite ? 'Sending Email...' : 'Send Official Invite'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add Whitelist User */}
      <AnimatePresence>
        {showAddWhitelist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-base">Add Email to Whitelist</h3>
                <button onClick={() => setShowAddWhitelist(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddWhitelist} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={wlName}
                    onChange={(e) => setWlName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={wlEmail}
                    onChange={(e) => setWlEmail(e.target.value)}
                    placeholder="e.g. priya@siddhidynamics.in"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Permitted Workspace Role *</label>
                  <select
                    value={wlRole}
                    onChange={(e: any) => setWlRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="intern">Intern (Intern Workspace & Onboarding)</option>
                    <option value="employee">Employee / Builder Hub</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Admin Notes</label>
                  <input
                    type="text"
                    value={wlNotes}
                    onChange={(e) => setWlNotes(e.target.value)}
                    placeholder="e.g. MBA Business Development Intern - 6 Months"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddWhitelist(false)}
                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground border border-border cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider"
                  >
                    Authorize Access
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Create Task */}
      <AnimatePresence>
        {showCreateTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-base">Assign Stipulated Task</h3>
                <button onClick={() => setShowCreateTask(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Target Department *</label>
                  <select
                    value={taskRole}
                    onChange={(e: any) => setTaskRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="All">All Interns</option>
                    <option value="Business Development">Business Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Outreach 20 Printing Distributors for PrintFlow"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Description & Requirements *</label>
                  <textarea
                    required
                    rows={3}
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Instructions, expected point-of-proof, targets..."
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Stipulated Deadline *</label>
                    <input
                      type="date"
                      required
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e: any) => setTaskPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateTask(false)}
                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground border border-border cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Add Incentive Reward */}
      <AnimatePresence>
        {showAddIncentive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-base">Add Milestone Incentive Reward</h3>
                <button onClick={() => setShowAddIncentive(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddIncentive} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Reward Title *</label>
                  <input
                    type="text"
                    required
                    value={incTitle}
                    onChange={(e) => setIncTitle(e.target.value)}
                    placeholder="e.g. Office Bag with Pen / Mug & Sipper"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={incDesc}
                    onChange={(e) => setIncDesc(e.target.value)}
                    placeholder="e.g. Executive bundle for achieving target milestones"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Items Included (comma-separated) *</label>
                  <input
                    type="text"
                    required
                    value={incItems}
                    onChange={(e) => setIncItems(e.target.value)}
                    placeholder="e.g. Office Bag, Metal Pen, Notebook"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Required Milestone *</label>
                  <input
                    type="text"
                    required
                    value={incMilestone}
                    onChange={(e) => setIncMilestone(e.target.value)}
                    placeholder="e.g. 3 Closed Clients or 25k Organic Reach"
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={incImage}
                    onChange={(e) => setIncImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddIncentive(false)}
                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground border border-border cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider"
                  >
                    Save Reward
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Issue Official Certificate */}
      <AnimatePresence>
        {showIssueCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-foreground text-base flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-amber-400" />
                    Issue Official Internship Certificate
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">A unique Certificate No and cryptographic checksum are auto-generated on submission.</p>
                </div>
                <button onClick={() => setShowIssueCert(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleIssueCertificate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Recipient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={certRecipientName}
                      onChange={(e) => setCertRecipientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Recipient Email *</label>
                    <input
                      type="email"
                      required
                      value={certRecipientEmail}
                      onChange={(e) => setCertRecipientEmail(e.target.value)}
                      placeholder="e.g. intern.bd@siddhidynamics.in"
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Role / Designation *</label>
                    <select
                      value={certRole}
                      onChange={(e) => setCertRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="Product Manager Intern">Product Manager Intern</option>
                      <option value="Business Development Intern">Business Development Intern</option>
                      <option value="Digital Marketing Intern">Digital Marketing Intern</option>
                      <option value="Software Developer">Software Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Operations Manager">Operations Manager</option>
                      <option value="Project Manager">Project Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Internship Duration *</label>
                    <select
                      value={certDuration}
                      onChange={(e) => setCertDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="9 Months">9 Months</option>
                      <option value="12 Months">12 Months</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={certStartDate}
                      onChange={(e) => setCertStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Completion Date *</label>
                    <input
                      type="date"
                      required
                      value={certCompletionDate}
                      onChange={(e) => setCertCompletionDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">College / University Name</label>
                    <input
                      type="text"
                      value={certCollege}
                      onChange={(e) => setCertCollege(e.target.value)}
                      placeholder="e.g. IIM Ahmedabad"
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">College Roll / Student ID</label>
                    <input
                      type="text"
                      value={certCollegeId}
                      onChange={(e) => setCertCollegeId(e.target.value)}
                      placeholder="e.g. 2024-MBA-089"
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Govt ID Type</label>
                    <select
                      value={certGovtType}
                      onChange={(e) => setCertGovtType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter ID">Voter ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Govt ID (Masked for display)</label>
                    <input
                      type="text"
                      value={certGovtMasked}
                      onChange={(e) => setCertGovtMasked(e.target.value)}
                      placeholder="e.g. XXXX-XXXX-9123 or ABCDE****F"
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Performance Grade *</label>
                    <select
                      value={certGrade}
                      onChange={(e) => setCertGrade(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="Outstanding">Outstanding</option>
                      <option value="Exemplary">Exemplary</option>
                      <option value="Distinction">Distinction</option>
                      <option value="Merit">Merit</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Points of Proof (Verified Count)</label>
                    <input
                      type="number"
                      min={0}
                      value={certProofCount}
                      onChange={(e) => setCertProofCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Key Achievements / Contributions (one per line) *</label>
                  <textarea
                    required
                    rows={4}
                    value={certAchievements}
                    onChange={(e) => setCertAchievements(e.target.value)}
                    placeholder={`e.g.\nSuccessfully acquired 4 regional distribution clients for custom ERP automations.\nGenerated ₹1,80,000 in enterprise software contract pipeline.\nCollaborated on 6 cross-functional BD-DM loophole sprints.`}
                    className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground/90">
                  <p className="font-bold text-amber-600 dark:text-amber-400 mb-0.5">Auto-generated on Issue:</p>
                  <p className="text-muted-foreground">• Unique Certificate No (e.g. <span className="font-mono text-foreground font-semibold">SD-CERT-2026-BD-F7A3</span>) • Cryptographic Verification Checksum • Issue Date (today) • Permanent Registry Entry</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowIssueCert(false)}
                    className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold text-foreground border border-border cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    Issue Official Certificate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
