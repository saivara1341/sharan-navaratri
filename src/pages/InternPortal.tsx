import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Plus, 
  X, 
  Users, 
  Layers, 
  Star,
  Award,
  Lock,
  ChevronRight,
  Filter,
  Search,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  internshipService, 
  InternTask, 
  TaskSubmission,
  DeadlineExtensionRequest, 
  DataAssetRequest, 
  PointOfProof, 
  CertificateRecord,
  InternReview
} from '@/services/internshipService';
import { resolveRoleForEmail } from '@/lib/roleResolver';
import { PendingCeoApprovalScreen } from '@/components/portal/PendingCeoApprovalScreen';

export default function InternPortal() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [userRole, setUserRole] = useState<'Business Development Intern' | 'Digital Marketing Intern'>('Business Development Intern');
  const [duration, setDuration] = useState('6 Months');
  const [activeTab, setActiveTab] = useState<'tasks' | 'submissions' | 'documents' | 'requests' | 'review'>('tasks');

  // Data states
  const [tasks, setTasks] = useState<InternTask[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [extensions, setExtensions] = useState<DeadlineExtensionRequest[]>([]);
  const [dataRequests, setDataRequests] = useState<DataAssetRequest[]>([]);
  const [myCertificate, setMyCertificate] = useState<CertificateRecord | null>(null);

  // Review states
  const [myReview, setMyReview] = useState<InternReview | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Work Submission Modal
  const [selectedTaskForSubmission, setSelectedTaskForSubmission] = useState<InternTask | null>(null);
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitSummary, setSubmitSummary] = useState('');
  const [submitMetrics, setSubmitMetrics] = useState('');
  const [submittingWork, setSubmittingWork] = useState(false);

  // Extension Modal
  const [showExtensionModal, setShowExtensionModal] = useState<InternTask | null>(null);
  const [extReason, setExtReason] = useState('');
  const [extNewDate, setExtNewDate] = useState('');

  // Data Request Modal
  const [showDataReqModal, setShowDataReqModal] = useState(false);
  const [dataReqTitle, setDataReqTitle] = useState('');
  const [dataReqDesc, setDataReqDesc] = useState('');
  const [dataReqCategory, setDataReqCategory] = useState<any>('PrintFlow Assets');

  // Digital Signing
  const [offerSigned, setOfferSigned] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  const loadData = (email?: string) => {
    const targetEmail = email || userEmail;
    setTasks(internshipService.getTasks());
    setSubmissions(internshipService.getTaskSubmissions(targetEmail));
    setExtensions(internshipService.getExtensionRequests().filter(e => !targetEmail || e.intern_email.toLowerCase() === targetEmail.toLowerCase()));
    setDataRequests(internshipService.getDataRequests().filter(d => !targetEmail || d.intern_email.toLowerCase() === targetEmail.toLowerCase()));

    if (targetEmail) {
      const cert = internshipService.getCertificateByNo(targetEmail);
      setMyCertificate(cert);
      const rev = internshipService.getReviewByEmail(targetEmail);
      if (rev) {
        setMyReview(rev);
        setRating(rev.rating);
        setReviewTitle(rev.review_title);
        setReviewText(rev.review_text);
      }
    }
  };

  useEffect(() => {
    // Listen to custom events from Navbar mobile drawer
    const handleNavTab = (e: any) => {
      if (e.detail?.tab) setActiveTab(e.detail.tab);
    };
    const handleOpenModal = () => setShowDataReqModal(true);

    window.addEventListener('intern-nav-tab', handleNavTab);
    window.addEventListener('intern-open-request-modal', handleOpenModal);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const email = session?.user?.email || 'intern@siddhidynamics.in';
      const name = session?.user?.user_metadata?.full_name || email.split('@')[0] || 'Intern';
      setUserEmail(email);
      setUserName(name);

      // Check role resolution
      const assignedRole = await resolveRoleForEmail(email);
      if (assignedRole === 'intern' || assignedRole === 'admin') {
        setIsPendingApproval(false);
      } else {
        const check = internshipService.isEmailApproved(email, 'intern');
        setIsPendingApproval(!check.approved && !assignedRole);
      }

      loadData(email);
    });

    return () => {
      window.removeEventListener('intern-nav-tab', handleNavTab);
      window.removeEventListener('intern-open-request-modal', handleOpenModal);
    };
  }, []);

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForSubmission) return;
    if (!submitUrl.trim() || !submitSummary.trim()) {
      toast.error('Please provide a deliverable URL and summary of work done.');
      return;
    }

    setSubmittingWork(true);
    try {
      internshipService.submitTaskDeliverable({
        task_id: selectedTaskForSubmission.id,
        task_title: selectedTaskForSubmission.title,
        intern_email: userEmail,
        intern_name: userName,
        role: userRole,
        deliverable_url: submitUrl.trim(),
        summary_of_work: submitSummary.trim(),
        metrics_or_outcome: submitMetrics.trim() || undefined
      });

      toast.success('Deliverable submitted successfully! Admin will verify your work.');
      setSelectedTaskForSubmission(null);
      setSubmitUrl('');
      setSubmitSummary('');
      setSubmitMetrics('');
      loadData(userEmail);
      setActiveTab('submissions');
    } catch (err) {
      toast.error('Failed to submit deliverable.');
    } finally {
      setSubmittingWork(false);
    }
  };

  const handleRequestExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showExtensionModal || !extReason.trim() || !extNewDate) {
      toast.error('Please enter reason and requested date.');
      return;
    }

    internshipService.requestDeadlineExtension({
      task_id: showExtensionModal.id,
      task_title: showExtensionModal.title,
      intern_email: userEmail,
      intern_name: userName,
      reason: extReason.trim(),
      original_deadline: showExtensionModal.stipulated_deadline,
      requested_deadline: extNewDate
    });

    toast.success('Extension request sent to CEO Sai Vara Prasad.');
    setShowExtensionModal(null);
    setExtReason('');
    setExtNewDate('');
    loadData(userEmail);
  };

  const handleRequestData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataReqTitle.trim() || !dataReqDesc.trim()) {
      toast.error('Please enter title and description.');
      return;
    }

    internshipService.requestDataAsset({
      title: dataReqTitle.trim(),
      description: dataReqDesc.trim(),
      category: dataReqCategory,
      intern_email: userEmail,
      intern_name: userName
    });

    toast.success('Asset request submitted to Admin.');
    setShowDataReqModal(false);
    setDataReqTitle('');
    setDataReqDesc('');
    loadData(userEmail);
  };

  const handleSignOffer = () => {
    if (!signatureName.trim()) {
      toast.error('Please type your legal name to e-sign.');
      return;
    }
    setOfferSigned(true);
    toast.success('Offer Letter digitally signed and recorded.');
  };

  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;
  const verifiedSubmissionsCount = submissions.filter(s => s.status === 'Verified & Approved').length;

  if (isPendingApproval) {
    return (
      <PendingCeoApprovalScreen
        userEmail={userEmail}
        userName={userName}
        role="intern"
        onRefresh={() => {
          const check = internshipService.isEmailApproved(userEmail, 'intern');
          if (check.approved) {
            setIsPendingApproval(false);
            loadData(userEmail);
          }
        }}
        onLogout={async () => {
          await supabase.auth.signOut();
          navigate('/portal');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#29251d] font-sans flex flex-col">
      <Helmet>
        <title>Internship Portal | Siddhi Dynamics</title>
      </Helmet>

      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          
          {/* Top Header Card (Matching Client Portal Luxury Style) */}
          <div className="p-6 md:p-9 rounded-[28px] bg-[#292a22] text-white shadow-xl shadow-stone-900/10 mb-8 border border-stone-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30 text-xs font-bold uppercase tracking-wider">
                    {userRole}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-200 text-xs font-medium border border-white/10">
                    {duration} Tenure
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Workspace Active
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Welcome, <span className="text-lime-300">{userName || "Fellow"}</span>
                </h1>
                <p className="text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                  Founder & CEO Supervision: Sarugu Sai Vara Prasad. Your internship workspace is active and securely linked.
                </p>
              </div>

              {/* Quick Summary */}
              <div className="flex items-center gap-4 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 shrink-0">
                <div className="text-center px-2">
                  <span className="text-xs text-stone-400 block font-medium">Assigned Tasks</span>
                  <span className="text-xl font-black text-white">0</span>
                </div>
                <div className="h-8 w-px bg-stone-800" />
                <div className="text-center px-2">
                  <span className="text-xs text-stone-400 block font-medium">Status</span>
                  <span className="text-xs font-bold text-lime-300 block mt-1">
                    Awaiting Allocation
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty Workspace State */}
          <div className="rounded-2xl border border-stone-200 bg-white p-12 sm:p-16 text-center shadow-sm max-w-2xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-700 shadow-xs">
              <GraduationCap className="w-8 h-8 text-stone-700" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                Workspace is Empty
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                No active internship tasks, sprint deliverables, or documents are assigned to your account as of now. Sprints and milestones will appear here once allocated by your supervisor.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  toast.success("Workspace is up to date. No new assignments.");
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
              >
                Check for Updates
              </button>
              <button
                type="button"
                onClick={() => navigate('/portal')}
                className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-bold text-xs cursor-pointer transition-all"
              >
                Back to Portals
              </button>
            </div>
          </div>

          {false && (
            <div>

          {/* TAB 1: MILESTONES & TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Milestone Roadmap */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Tenure Milestone Roadmap
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { sprint: 'Sprint 1', title: 'Onboarding & Foundation', done: true },
                    { sprint: 'Sprint 2', title: 'Core Task Deliverables', done: completedTasksCount >= 1 },
                    { sprint: 'Sprint 3', title: 'Client / Campaign Scale', done: completedTasksCount >= 2 },
                    { sprint: 'Sprint 4', title: 'Final Verification & LOR', done: completedTasksCount >= 3 && !!myCertificate }
                  ].map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-xl border ${
                        m.done 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-stone-50 border-stone-200 text-stone-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1 font-bold">
                        <span>{m.sprint}</span>
                        {m.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <p className="text-xs text-stone-900 font-semibold">{m.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Assigned Stipulated Tasks</h2>
                  <p className="text-xs text-stone-500">Complete tasks before their stipulated deadlines and submit live proof for admin verification.</p>
                </div>
                <button
                  onClick={() => setShowDataReqModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-2 self-start cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-lime-300" /> Request Data/Assets
                </button>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tasks.map(task => (
                  <div key={task.id} className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between space-y-4 hover:border-stone-400 transition-all shadow-sm">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          task.priority === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {task.priority} Priority
                        </span>
                        <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" /> Due: {task.stipulated_deadline}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 mb-2 leading-snug">{task.title}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed mb-3">{task.description}</p>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-500">Supervised by: <strong className="text-stone-800">{task.created_by}</strong></span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          task.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : task.status === 'Under Review'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedTaskForSubmission(task)}
                        className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        <span>Submit Work / Proof</span>
                        <ArrowRight className="w-3.5 h-3.5 text-lime-300" />
                      </button>

                      <button
                        onClick={() => setShowExtensionModal(task)}
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer border border-stone-200"
                        title="Request extension from CEO"
                      >
                        Extend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WORK SUBMISSIONS & VERIFICATION */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Work Submissions & Proof Ledger</h2>
                  <p className="text-xs text-stone-500">All submitted work and live verification status by Admin/CEO Sai Vara Prasad.</p>
                </div>
              </div>

              {submissions.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-stone-200 text-stone-500 space-y-3 shadow-sm">
                  <Clock className="w-10 h-10 mx-auto text-primary" />
                  <p className="text-sm font-semibold text-stone-900">No deliverables submitted yet.</p>
                  <p className="text-xs">Go to Tasks & Deadlines tab and click "Submit Work / Proof" on any assigned task.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map(sub => (
                    <div key={sub.id} className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div>
                          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">{sub.role}</span>
                          <h3 className="text-base font-bold text-stone-900">{sub.task_title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-stone-500">Submitted: {sub.submitted_at}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            sub.status === 'Verified & Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : sub.status === 'Revision Requested'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <ShieldCheck className="w-3.5 h-3.5" /> {sub.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-700 leading-relaxed">
                        <strong className="text-stone-900 block mb-1">Work Accomplished:</strong>
                        <p className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-800">{sub.summary_of_work}</p>
                      </div>

                      {sub.metrics_or_outcome && (
                        <div className="text-xs text-stone-600">
                          <strong className="text-stone-900">Metrics / Result:</strong> {sub.metrics_or_outcome}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
                        <a 
                          href={sub.deliverable_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Deliverable Link ({sub.deliverable_url.slice(0, 40)}...)
                        </a>

                        {sub.admin_feedback && (
                          <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                            <strong>Admin Review:</strong> {sub.admin_feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OFFER LETTER & CERTIFICATES */}
          {activeTab === 'documents' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Digital Documents & Credentials</h2>
                <p className="text-xs text-stone-500">Digitally e-sign your Internship Offer Letter and access your verified Completion Certificate.</p>
              </div>

              {/* Offer Letter Box */}
              <div className="p-6 md:p-8 rounded-2xl bg-white border border-stone-200 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Employment Record</span>
                    <h3 className="text-lg font-extrabold text-stone-900">Internship Offer Letter</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    offerSigned ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {offerSigned ? 'Signed & Registered' : 'Pending Signature'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-800 leading-relaxed font-mono">
                  <p><strong>ENTITY:</strong> Siddhi Dynamics LLP</p>
                  <p><strong>CANDIDATE:</strong> {userName} ({userEmail})</p>
                  <p><strong>DESIGNATION:</strong> {userRole}</p>
                  <p><strong>TENURE:</strong> {duration} (Subject to stipulated task deliverables)</p>
                  <p><strong>REPORTING TO:</strong> Sarugu Sai Vara Prasad, Founder & Designated Partner</p>
                  <p className="pt-2 border-t border-stone-200 text-stone-600">
                    TERMS: Practical learning internship. Formal Certificate of Internship Completion is awarded upon verified deliverables. Letter of Recommendation (LOR) is issued for high-performance contributors. All assets developed remain property of Siddhi Dynamics LLP.
                  </p>
                </div>

                {!offerSigned ? (
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <label className="text-xs font-bold text-stone-900 block">
                      Type Your Full Legal Name to E-Sign:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:border-stone-900"
                      />
                      <button
                        onClick={handleSignOffer}
                        className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                      >
                        Sign & Accept
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Digitally Signed by: <strong>{signatureName || userName}</strong>
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>
                )}
              </div>

              {/* Completion Certificate Box */}
              <div className="p-6 md:p-8 rounded-2xl bg-white border border-stone-200 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Verified Credential</span>
                    <h3 className="text-lg font-extrabold text-stone-900">Internship Completion Certificate</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    myCertificate ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {myCertificate ? 'Officially Issued' : 'Tenure In Progress'}
                  </span>
                </div>

                {myCertificate ? (
                  <div className="p-6 rounded-2xl bg-stone-50 border-2 border-stone-300 text-center space-y-4 shadow-sm">
                    <Award className="w-12 h-12 text-primary mx-auto" />
                    <div>
                      <h4 className="text-base font-extrabold text-stone-900">Certificate of Internship Completion</h4>
                      <p className="text-xs text-stone-600 mt-1">Awarded to <strong className="text-stone-900">{myCertificate.recipient_name}</strong></p>
                      <p className="text-xs text-stone-500">Certificate ID: <span className="font-mono text-stone-900 font-bold">{myCertificate.certificate_no}</span></p>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-center gap-3">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Download className="w-4 h-4 text-lime-300" /> Download Official Certificate
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-2 text-xs text-stone-600">
                    <p className="font-bold text-stone-900">Tenure Active & Under Evaluation</p>
                    <p className="max-w-md mx-auto">
                      Your official Certificate of Completion signed by CEO Sai Vara Prasad will be issued upon completing your {duration} deliverables and verifying points of proof in the admin console.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REQUESTS & EXTENSIONS */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Deadline Extensions & Data Asset Requests</h2>
                  <p className="text-xs text-stone-500">Request deadline adjustments or client data assets directly from admin.</p>
                </div>
                <button
                  onClick={() => setShowDataReqModal(true)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-lime-300" /> New Asset Request
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Extensions */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-400" /> Deadline Extension Requests
                  </h3>
                  {extensions.length === 0 ? (
                    <p className="text-xs text-stone-500">No extension requests submitted.</p>
                  ) : (
                    <div className="space-y-2">
                      {extensions.map(ext => (
                        <div key={ext.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-stone-900 block">{ext.task_title}</span>
                            <span className="text-[11px] text-stone-500">Requested Date: {ext.requested_deadline}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ext.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {ext.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Data Requests */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-sm">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-stone-400" /> Data & Asset Requests
                  </h3>
                  {dataRequests.length === 0 ? (
                    <p className="text-xs text-stone-500">No data requests submitted.</p>
                  ) : (
                    <div className="space-y-2">
                      {dataRequests.map(d => (
                        <div key={d.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-stone-900 block">{d.title} ({d.category})</span>
                            <span className="text-[11px] text-stone-500">{d.description}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {d.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FEEDBACK & REVIEW */}
          {activeTab === 'review' && (
            <div className="max-w-xl mx-auto p-6 md:p-8 rounded-2xl bg-white border border-stone-200 space-y-5 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Intern Experience Feedback</h2>
                <p className="text-xs text-stone-500">Share your honest feedback on mentorship, tools, and real tasks to help us improve.</p>
              </div>

              {myReview ? (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    {[...Array(myReview.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-2 text-stone-900">{myReview.rating} / 5 Stars</span>
                  </div>
                  <h4 className="font-bold text-stone-900">{myReview.review_title}</h4>
                  <p className="text-stone-600 leading-relaxed">{myReview.review_text}</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!reviewTitle.trim() || !reviewText.trim()) {
                      toast.error('Please fill in title and review text.');
                      return;
                    }
                    setSubmittingReview(true);
                    const rev = internshipService.submitInternReview({
                      intern_email: userEmail,
                      intern_name: userName,
                      role: userRole,
                      rating,
                      category: 'Overall Experience',
                      review_title: reviewTitle.trim(),
                      review_text: reviewText.trim(),
                      would_recommend: true
                    });
                    setMyReview(rev);
                    setSubmittingReview(false);
                    toast.success('Thank you! Feedback received.');
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Headline</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Great practical sales & AI exposure"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Feedback Remarks</label>
                    <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Describe what you learned and any feedback for CEO Sai Vara Prasad..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase transition-colors cursor-pointer shadow-sm"
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          )}
          </div>
          )}

        </div>
      </main>

      {/* MODAL: SUBMIT DELIVERABLE / PROOF */}
      {selectedTaskForSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Deliverable Submission</span>
                <h3 className="text-base font-bold text-stone-900">{selectedTaskForSubmission.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedTaskForSubmission(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDeliverable} className="space-y-3.5 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  Deliverable Link (GitHub, Figma, Google Drive, Live URL) *
                </label>
                <input
                  type="url"
                  required
                  value={submitUrl}
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  placeholder="https://github.com/... or https://instagram.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  Summary of Work Completed *
                </label>
                <textarea
                  required
                  rows={3}
                  value={submitSummary}
                  onChange={(e) => setSubmitSummary(e.target.value)}
                  placeholder="Explain exactly what you produced, steps taken, and deliverables attached..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">
                  Key Metrics / Results (Optional)
                </label>
                <input
                  type="text"
                  value={submitMetrics}
                  onChange={(e) => setSubmitMetrics(e.target.value)}
                  placeholder="e.g. 5 reels published, +2000 views, 1 client call scheduled"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTaskForSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWork}
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  {submittingWork ? 'Submitting...' : 'Submit to Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXTEND DEADLINE */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Request Extension</span>
                <h3 className="text-sm font-bold text-stone-900">{showExtensionModal.title}</h3>
              </div>
              <button 
                onClick={() => setShowExtensionModal(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestExtension} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">New Requested Deadline *</label>
                <input
                  type="date"
                  required
                  value={extNewDate}
                  onChange={(e) => setExtNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Reason for Extension *</label>
                <textarea
                  required
                  rows={3}
                  value={extReason}
                  onChange={(e) => setExtReason(e.target.value)}
                  placeholder="Explain why you need additional time..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExtensionModal(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Send to CEO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DATA / ASSET REQUEST */}
      {showDataReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">Request Data / Marketing Assets</h3>
              <button 
                onClick={() => setShowDataReqModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestData} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">Asset Category</label>
                <select
                  value={dataReqCategory}
                  onChange={(e) => setDataReqCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  <option value="PrintFlow Assets">PrintFlow Assets</option>
                  <option value="Client Brief">Client Brief</option>
                  <option value="Instagram Media Kit">Instagram Media Kit</option>
                  <option value="Market Research">Market Research</option>
                  <option value="Competitor Data">Competitor Data</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Request Title *</label>
                <input
                  type="text"
                  required
                  value={dataReqTitle}
                  onChange={(e) => setDataReqTitle(e.target.value)}
                  placeholder="e.g. PrintFlow SVG Logos & Packaging Samples"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Description & Requirements *</label>
                <textarea
                  required
                  rows={3}
                  value={dataReqDesc}
                  onChange={(e) => setDataReqDesc(e.target.value)}
                  placeholder="Detail exactly what resources you need..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDataReqModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
