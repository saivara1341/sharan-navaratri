import { useEffect, useState } from "react";
import { FooterSection } from "@/components/sections/FooterSection";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { supabaseService } from "@/services/supabaseService";
import { 
  Users, 
  LogOut, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  Save, 
  User, 
  Briefcase, 
  Layers, 
  Sliders, 
  Search, 
  RefreshCw, 
  ChevronRight, 
  Activity, 
  Check, 
  X, 
  ExternalLink,
  CalendarCheck,
  Landmark,
  CreditCard,
  Receipt,
  FileCheck,
  Building2,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { parseProjectMeta, serializeProjectMeta } from "@/lib/projectLifecycleHelper";
import { employeeSalaryService, EmployeeBankingDetails, SalaryPayoutRecord } from "@/services/employeeSalaryService";
import { resolveRoleForEmail } from "@/lib/roleResolver";

interface Submission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  designation: string | null;
  organization: string | null;
  inquiry_type: string;
  message: string;
  status?: string;
  progress?: number;
  bounty_reward?: string;
}

export default function EmployeePortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  
  // Tab states: 'workloads' | 'tasks' | 'attendance' | 'salary' | 'support'
  const [activeTab, setActiveTab] = useState<'workloads' | 'tasks' | 'attendance' | 'salary' | 'support'>('workloads');
  
  // Data states
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncing, setSyncing] = useState(false);

  // Attendance states
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [attendanceNote, setAttendanceNote] = useState("");

  // Banking & Salary states
  const [banking, setBanking] = useState<EmployeeBankingDetails | null>(null);
  const [accHolderName, setAccHolderName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [savingBanking, setSavingBanking] = useState(false);
  const [payouts, setPayouts] = useState<SalaryPayoutRecord[]>([]);

  // Roadmap Editor Modal states
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [editStatus, setEditStatus] = useState("Analyzing");
  const [editProgress, setEditProgress] = useState(0);
  const [editDeadline, setEditDeadline] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDemoUrl, setEditDemoUrl] = useState("");
  const [savingRoadmap, setSavingRoadmap] = useState(false);

  // Chat Console states
  const [activeChatSub, setActiveChatSub] = useState<Submission | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);

  const fetchSubmissionsData = async () => {
    try {
      const data = await supabaseService.getSubmissions();
      setSubmissions(data || []);
      if (activeChatSub) {
        const updated = (data || []).find(s => s.id === activeChatSub.id);
        if (updated) setActiveChatSub(updated);
      }
    } catch (err: any) {
      console.error("Employee fetch error:", err);
    }
  };

  const loadBankingAndPayouts = (email: string) => {
    const b = employeeSalaryService.getBankingDetails(email);
    if (b) {
      setBanking(b);
      setAccHolderName(b.account_holder_name || "");
      setAccNumber(b.account_number || "");
      setBankName(b.bank_name || "");
      setIfscCode(b.ifsc_code || "");
      setUpiId(b.upi_id || "");
      setPanNumber(b.pan_number || "");
      setBranchName(b.branch_name || "");
    }
    setPayouts(employeeSalaryService.getPayouts(email));
  };

  useEffect(() => {
    // Listen to mobile nav event from Navbar
    const handleNav = (e: any) => {
      if (e.detail?.tab) setActiveTab(e.detail.tab);
    };
    window.addEventListener('employee-nav-tab', handleNav);

    // Check attendance in local storage
    const today = new Date().toISOString().split('T')[0];
    const savedAtt = localStorage.getItem(`sd_attendance_${today}`);
    if (savedAtt) {
      const parsed = JSON.parse(savedAtt);
      setCheckedInToday(true);
      setCheckInTime(parsed.time);
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const email = session?.user?.email || "employee@siddhidynamics.in";
      setEmployeeEmail(email);
      const nameVal = session?.user?.user_metadata?.full_name || (email.includes('@') ? email.split('@')[0] : "Employee Builder");
      setEmployeeName(nameVal);

      loadBankingAndPayouts(email);
      await fetchSubmissionsData();
      setLoading(false);
    });

    return () => {
      window.removeEventListener('employee-nav-tab', handleNav);
    };
  }, []);

  const handleSaveBanking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accNumber.trim() || !ifscCode.trim() || !bankName.trim()) {
      toast.error("Please fill in Account Number, Bank Name, and IFSC Code.");
      return;
    }

    setSavingBanking(true);
    try {
      const updated = employeeSalaryService.saveBankingDetails({
        employee_email: employeeEmail,
        employee_name: employeeName,
        account_holder_name: accHolderName.trim() || employeeName,
        account_number: accNumber.trim(),
        bank_name: bankName.trim(),
        ifsc_code: ifscCode.trim().toUpperCase(),
        upi_id: upiId.trim() || undefined,
        pan_number: panNumber.trim().toUpperCase() || undefined,
        branch_name: branchName.trim() || undefined,
        status: 'Pending Admin Review'
      });

      setBanking(updated);
      toast.success("Banking & Salary details saved! Admin will disburse payroll to this account.");
    } catch {
      toast.error("Failed to save banking details.");
    } finally {
      setSavingBanking(false);
    }
  };

  const handleCheckInToggle = () => {
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (!checkedInToday) {
      localStorage.setItem(`sd_attendance_${today}`, JSON.stringify({
        email: employeeEmail,
        name: employeeName,
        date: today,
        time: timeStr,
        status: 'Present'
      }));
      setCheckedInToday(true);
      setCheckInTime(timeStr);
      toast.success(`Check-in logged successfully at ${timeStr}`);
    } else {
      setCheckedInToday(false);
      localStorage.removeItem(`sd_attendance_${today}`);
      toast.info("Checked out for the day.");
    }
  };

  const handleSaveRoadmap = async () => {
    if (!selectedSub) return;
    setSavingRoadmap(true);
    try {
      const currentMeta = parseProjectMeta(selectedSub.bounty_reward);
      const metaStr = serializeProjectMeta({
        ...currentMeta,
        deadline: editDeadline.trim(),
        website_url: editUrl.trim(),
        demo_url: editDemoUrl.trim()
      });
      await supabaseService.updateSubmission(selectedSub.id, {
        status: editStatus,
        progress: editProgress,
        bounty_reward: metaStr
      });
      toast.success("Project status and deliverables updated.");
      setSelectedSub(null);
      await fetchSubmissionsData();
    } catch {
      toast.error("Failed to update project status.");
    } finally {
      setSavingRoadmap(false);
    }
  };

  const loadChatMessages = async (subId: string) => {
    setChatLoading(true);
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('submission_id', subId)
        .order('created_at', { ascending: true });
      setChatMessages(data || []);
    } catch {
      // ignore
    } finally {
      setChatLoading(false);
    }
  };

  const sendSupportReply = async () => {
    if (!chatInput.trim() || !activeChatSub) return;
    const msg = chatInput.trim();
    setChatInput("");
    setSendingMsg(true);

    try {
      await supabase
        .from('chat_messages')
        .insert({
          submission_id: activeChatSub.id,
          sender_email: employeeEmail,
          message: msg,
          is_admin: true
        });

      loadChatMessages(activeChatSub.id);
      toast.success("Message sent to client.");
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setSendingMsg(false);
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.organization && s.organization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#29251d] font-sans flex flex-col">
      <Helmet>
        <title>Employee & Builder Command Center | Siddhi Dynamics</title>
      </Helmet>

      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          
          {/* Top Header Card */}
          <div className="rounded-[28px] bg-[#292a22] text-white p-6 md:p-8 shadow-xl shadow-stone-900/10 border border-stone-800 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-stone-800/80 text-lime-300 border border-lime-400/20 text-xs font-bold uppercase">
                    Engineering Team Member
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-xs font-medium">
                    Builder Hub
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Workspace Active
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Welcome, <span className="text-lime-300">{employeeName || "Builder"}</span>
                </h1>
                <p className="text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                  Internal Builder Command Center. Your engineering profile is active and securely linked to Siddhi Dynamics.
                </p>
              </div>

              {/* Quick Summary */}
              <div className="flex items-center gap-4 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 shrink-0">
                <div className="text-center px-2">
                  <span className="text-xs text-stone-400 block font-medium">Assigned Workloads</span>
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
              <Users className="w-8 h-8 text-stone-700" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                Workspace is Empty
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                No active client roadmaps, sprint tasks, or engineering workloads are assigned to your account as of now. Operations HQ will configure your workload pipeline and project assignments here.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  toast.success("Workspace is up to date. No new workloads allocated.");
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

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {[
              { id: 'workloads', label: 'Client Projects & Roadmaps', icon: Briefcase, count: filteredSubmissions.length },
              { id: 'tasks', label: 'Tasks & Sprints', icon: CheckCircle, count: null },
              { id: 'attendance', label: 'Daily Attendance', icon: CalendarCheck, count: null },
              { id: 'salary', label: 'Salary & Banking Details', icon: Landmark, count: banking?.status === 'Verified for Salary' ? 'Verified' : 'Action' },
              { id: 'support', label: 'Client Support Chat', icon: MessageSquare, count: null }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-md font-extrabold'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-lime-300' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-stone-800 text-lime-300' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: CLIENT PROJECTS & ROADMAPS */}
          {activeTab === 'workloads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Assigned Client Project Sprints</h2>
                  <p className="text-xs text-stone-600">Update project milestones, demo links, and status visible on client workspaces.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search client accounts..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSubmissions.map(sub => {
                  const meta = parseProjectMeta(sub.bounty_reward);
                  return (
                    <div key={sub.id} className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between space-y-4 shadow-sm hover:border-stone-400 transition-colors">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-200">
                            {sub.inquiry_type}
                          </span>
                          <span className="text-xs font-semibold text-stone-600">
                            {sub.status || 'Active'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-stone-900 mb-1">{sub.name}</h3>
                        {sub.organization && (
                          <span className="text-xs text-stone-700 block font-semibold mb-2">{sub.organization}</span>
                        )}
                        <p className="text-xs text-stone-600 line-clamp-2 mb-3">{sub.message}</p>

                        {/* Progress */}
                        <div className="space-y-1.5 pt-2 border-t border-stone-100">
                          <div className="flex justify-between text-xs text-stone-600 font-medium">
                            <span>Roadmap Progress</span>
                            <span className="text-stone-900 font-bold">{sub.progress || 0}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                            <div 
                              className="h-full bg-stone-900 rounded-full"
                              style={{ width: `${sub.progress || 0}%` }}
                            />
                          </div>
                        </div>

                        {meta.deadline && (
                          <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-2">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Deadline: {meta.deadline}
                          </span>
                        )}
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSub(sub);
                            setEditStatus(sub.status || "Analyzing");
                            setEditProgress(sub.progress || 0);
                            setEditDeadline(meta.deadline || "");
                            setEditUrl(meta.website_url || "");
                            setEditDemoUrl(meta.demo_url || "");
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer text-center shadow-xs"
                        >
                          Update Status
                        </button>
                        <button
                          onClick={() => {
                            setActiveChatSub(sub);
                            loadChatMessages(sub.id);
                            setActiveTab('support');
                          }}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 cursor-pointer"
                          title="Open Client Chat"
                        >
                          <MessageSquare className="w-4 h-4 text-stone-700" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TASKS & SPRINTS */}
          {activeTab === 'tasks' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Active Engineering Sprints</h2>
                <p className="text-xs text-stone-600">Track and complete core software engineering deliverables.</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'eng-1', title: 'Connect Supabase Auth & Google OAuth Role Redirection', priority: 'Critical', deadline: 'Today', status: 'Completed' },
                  { id: 'eng-2', title: 'Implement Mobile Role-Specific Navigation Drawers', priority: 'Critical', deadline: 'Today', status: 'Completed' },
                  { id: 'eng-3', title: 'Integrate Employee Salary & Banking Details Submission', priority: 'High', deadline: 'Today', status: 'Completed' },
                  { id: 'eng-4', title: 'Automated Intern Deliverable Verification in Admin Portal', priority: 'High', deadline: 'Tomorrow', status: 'In Progress' }
                ].map((task, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${task.status === 'Completed' ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <div>
                        <span className="font-bold text-stone-900 block text-sm">{task.title}</span>
                        <span className="text-stone-500">Due: {task.deadline}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DAILY ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="max-w-xl mx-auto p-6 md:p-8 rounded-2xl bg-white border border-stone-200 space-y-5 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#292a22] text-lime-300 mx-auto flex items-center justify-center shadow-md">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">Daily Builder Attendance</h2>
                <p className="text-xs text-stone-600 mt-1">Clock in your daily sprint hours to calculate accurate monthly payroll compensation.</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <span className="text-stone-500 block mb-1">Today's Date:</span>
                <span className="text-stone-900 font-bold text-base block">{new Date().toDateString()}</span>
                <span className={`text-xs font-semibold block mt-1 ${checkedInToday ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {checkedInToday ? `Status: Present (Clocked at ${checkInTime})` : 'Status: Awaiting Check-In'}
                </span>
              </div>

              <button
                onClick={handleCheckInToggle}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs ${
                  checkedInToday
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {checkedInToday ? 'Clock Out / End Shift' : 'Clock In Now'}
              </button>
            </div>
          )}

          {/* TAB 4: SALARY & BANKING DETAILS */}
          {activeTab === 'salary' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Salary & Banking Details</h2>
                <p className="text-xs text-stone-600">Provide your verified bank account details for monthly salary disbursement by Siddhi Dynamics LLP.</p>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                banking?.status === 'Verified for Salary'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-current" />
                  <div>
                    <strong className="block font-bold">Banking Verification Status: {banking?.status || 'Action Required'}</strong>
                    <span className="text-[11px] opacity-90">
                      {banking?.status === 'Verified for Salary'
                        ? 'Your account is verified. Monthly salary will be directly disbursed via NEFT/IMPS.'
                        : 'Please enter or update your bank information below to receive upcoming salary payouts.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Banking Form */}
              <div className="p-6 md:p-8 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
                  <Landmark className="w-4 h-4 text-stone-700" /> Bank Account Information
                </h3>

                <form onSubmit={handleSaveBanking} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Account Holder Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={accHolderName}
                      onChange={(e) => setAccHolderName(e.target.value)}
                      placeholder="e.g. Sarugu Sai Vara Prasad"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Bank Name *</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank / State Bank of India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 font-bold block mb-1">Account Number *</label>
                    <input
                      type="text"
                      required
                      value={accNumber}
                      onChange={(e) => setAccNumber(e.target.value)}
                      placeholder="e.g. 50100492817263"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 font-mono focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 font-bold block mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      required
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 font-mono uppercase focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 font-bold block mb-1">UPI ID (Optional)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. engineer@upi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 font-bold block mb-1">PAN Card Number (For TDS / Tax)</label>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 font-mono uppercase focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingBanking}
                      className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      {savingBanking ? 'Saving...' : 'Save Banking Credentials'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Salary Payout History */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" /> Disbursed Salary Payouts & Payslips
                </h3>

                {payouts.length === 0 ? (
                  <p className="text-xs text-stone-500">No salary payouts recorded yet for this financial cycle.</p>
                ) : (
                  <div className="space-y-3">
                    {payouts.map(p => (
                      <div key={p.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-sm font-bold text-stone-900 block">₹{p.amount.toLocaleString()}</span>
                          <span className="text-stone-500">Period: {p.pay_period} • Ref: <span className="font-mono text-stone-700">{p.transaction_ref}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-500">Disbursed on {p.disbursed_at}</span>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CLIENT SUPPORT CHAT */}
          {activeTab === 'support' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Client Project Support Console</h2>
                  <p className="text-xs text-stone-600">
                    {activeChatSub ? `Chatting with ${activeChatSub.name} (${activeChatSub.organization || 'Client'})` : 'Select a project from the Roadmaps tab to initiate chat.'}
                  </p>
                </div>
              </div>

              {activeChatSub ? (
                <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-sm">
                  {/* Messages */}
                  <div className="h-64 overflow-y-auto space-y-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    {chatMessages.length === 0 ? (
                      <p className="text-stone-400 text-center pt-24">No messages yet. Send an update to the client below.</p>
                    ) : (
                      chatMessages.map(m => (
                        <div key={m.id} className={`p-3 rounded-xl max-w-sm ${
                          m.is_admin ? 'ml-auto bg-stone-900 text-white shadow-xs' : 'mr-auto bg-white border border-stone-200 text-stone-800 shadow-xs'
                        }`}>
                          <p className="leading-relaxed">{m.message}</p>
                          <span className="text-[10px] opacity-70 block text-right mt-1">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendSupportReply()}
                      placeholder="Type message to client..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-stone-900"
                    />
                    <button
                      onClick={sendSupportReply}
                      disabled={sendingMsg}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-white border border-stone-200 text-stone-500 space-y-2 shadow-sm">
                  <MessageSquare className="w-8 h-8 mx-auto text-stone-400" />
                  <p className="text-sm font-semibold text-stone-900">No Client Chat Selected</p>
                  <p className="text-xs">Go to "Client Projects & Roadmaps" tab and click the chat icon on any client card.</p>
                </div>
              )}
            </div>
          )}
          </div>
          )}

        </div>
      </main>

      {/* MODAL: UPDATE ROADMAP MILESTONES */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">Update Roadmap: {selectedSub.name}</h3>
              <button 
                onClick={() => setSelectedSub(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-stone-700 font-bold block mb-1">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  <option value="Analyzing">Analyzing</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Progress Percentage: {editProgress}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full cursor-pointer accent-stone-900"
                />
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Stipulated Deadline</label>
                <input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                >
                </input>
              </div>

              <div>
                <label className="text-stone-700 font-bold block mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={editDemoUrl}
                  onChange={(e) => setEditDemoUrl(e.target.value)}
                  placeholder="https://demo.siddhidynamics.in/client"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRoadmap}
                  disabled={savingRoadmap}
                  className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  {savingRoadmap ? 'Saving...' : 'Save Roadmap'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
