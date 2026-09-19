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
  Gift, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Plus, 
  X, 
  Sparkles, 
  Instagram, 
  Users, 
  Layers, 
  HelpCircle,
  Copy,
  PenTool,
  Lock,
  Unlock,
  Building2,
  Phone,
  Mail,
  Star,
  ArrowUpRight,
  MessageSquareQuote,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  internshipService, 
  InternTask, 
  DeadlineExtensionRequest, 
  DataAssetRequest, 
  PointOfProof, 
  InterlinkAlert, 
  IncentiveReward,
  CertificateRecord,
  InternReview
} from '@/services/internshipService';
import { PendingCeoApprovalScreen } from '@/components/portal/PendingCeoApprovalScreen';

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function InternPortal() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [userRole, setUserRole] = useState<'Business Development Intern' | 'Digital Marketing Intern'>('Business Development Intern');
  const [duration, setDuration] = useState('6 Months');
  const [activeTab, setActiveTab] = useState<'tasks' | 'proofs' | 'interlink' | 'incentives' | 'documents' | 'review'>('tasks');

  // Data states
  const [tasks, setTasks] = useState<InternTask[]>([]);
  const [extensions, setExtensions] = useState<DeadlineExtensionRequest[]>([]);
  const [dataRequests, setDataRequests] = useState<DataAssetRequest[]>([]);
  const [proofs, setProofs] = useState<PointOfProof[]>([]);
  const [interlinks, setInterlinks] = useState<InterlinkAlert[]>([]);
  const [incentives, setIncentives] = useState<IncentiveReward[]>([]);
  const [scratchedIds, setScratchedIds] = useState<string[]>([]);
  const [myCertificate, setMyCertificate] = useState<CertificateRecord | null>(null);

  // Intern Feedback & Review states
  const [myReview, setMyReview] = useState<InternReview | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewCategory, setReviewCategory] = useState<InternReview['category']>('Overall Experience');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  // Modal states
  const [showExtensionModal, setShowExtensionModal] = useState<InternTask | null>(null);
  const [extReason, setExtReason] = useState('');
  const [extNewDate, setExtNewDate] = useState('');

  const [showDataReqModal, setShowDataReqModal] = useState(false);
  const [dataReqTitle, setDataReqTitle] = useState('');
  const [dataReqDesc, setDataReqDesc] = useState('');
  const [dataReqCategory, setDataReqCategory] = useState<any>('PrintFlow Assets');

  const [showProofModal, setShowProofModal] = useState(false);
  const [proofTitle, setProofTitle] = useState('');
  const [proofBefore, setProofBefore] = useState('');
  const [proofAfter, setProofAfter] = useState('');
  const [proofMetric, setProofMetric] = useState('');
  const [proofLink, setProofLink] = useState('');

  const [showInterlinkModal, setShowInterlinkModal] = useState(false);
  const [interlinkLoophole, setInterlinkLoophole] = useState('');
  const [interlinkProduct, setInterlinkProduct] = useState<any>('PrintFlow');
  const [interlinkAction, setInterlinkAction] = useState('');
  const [interlinkAudience, setInterlinkAudience] = useState('');

  // Digital Signing states
  const [offerSigned, setOfferSigned] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  // Onboarding Wizard modal
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardRulesAgreed, setOnboardRulesAgreed] = useState(false);
  const [onboardTermsAgreed, setOnboardTermsAgreed] = useState(false);
  const [onboardNdaAgreed, setOnboardNdaAgreed] = useState(false);
  const [onboardSignature, setOnboardSignature] = useState('');
  const [onboardGovtIdType, setOnboardGovtIdType] = useState<'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID'>('Aadhaar Card');
  const [onboardGovtIdNumber, setOnboardGovtIdNumber] = useState('');
  const [onboardCollegeIdNumber, setOnboardCollegeIdNumber] = useState('');
  const [onboardCollegeName, setOnboardCollegeName] = useState('');

  const loadData = (email?: string) => {
    setTasks(internshipService.getTasks());
    setExtensions(internshipService.getExtensionRequests());
    setDataRequests(internshipService.getDataRequests());
    setProofs(internshipService.getPointsOfProof());
    setInterlinks(internshipService.getInterlinks());
    setIncentives(internshipService.getIncentiveRewards());
    setScratchedIds(internshipService.getScratchedCodes());

    const targetEmail = email || userEmail;
    if (targetEmail) {
      const cert = internshipService.getCertificateByNo(targetEmail);
      setMyCertificate(cert);
      const rev = internshipService.getReviewByEmail(targetEmail);
      if (rev) {
        setMyReview(rev);
        setRating(rev.rating);
        setReviewCategory(rev.category);
        setReviewTitle(rev.review_title);
        setReviewText(rev.review_text);
        setWouldRecommend(rev.would_recommend);
      }
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewText.trim()) {
      toast.error('Please enter a review title and details.');
      return;
    }
    setSubmittingReview(true);
    try {
      const submitted = internshipService.submitInternReview({
        intern_email: userEmail,
        intern_name: userName || 'Siddhi Intern',
        role: userRole,
        rating,
        category: reviewCategory,
        review_title: reviewTitle.trim(),
        review_text: reviewText.trim(),
        would_recommend: wouldRecommend,
      });
      setMyReview(submitted);
      setIsEditingReview(false);
      if (rating >= 4) {
        toast.success('🌟 Thank you for your 5-star review! Please share it on Google Maps to help our ranking.');
      } else {
        toast.info('🙏 Feedback received. Your remarks have been sent privately to Founder & CEO Sai Vara Prasad.');
      }
    } catch {
      toast.error('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCopyReview = () => {
    if (!myReview) return;
    const text = `${myReview.review_title}\n\n${myReview.review_text}`;
    navigator.clipboard.writeText(text);
    setCopiedReview(true);
    toast.success('Review text copied! Ready to paste on Google.');
    setTimeout(() => setCopiedReview(false), 3000);
  };

  const handleOpenGoogle = () => {
    if (myReview) {
      internshipService.markReviewPostedToGoogle(myReview.id);
      setMyReview(prev => prev ? { ...prev, posted_to_google: true, status: 'Published to Google' } : null);
    }
    window.open('https://g.page/r/CQ8YjZSqkk-5EBM/review', '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!currentSession) {
        toast.error("Please sign in or select your role to access the workspace.");
        navigate('/portal');
        return;
      }
      setSession(currentSession);
      const email = currentSession.user.email || '';
      setUserEmail(email);
      const name = currentSession.user.user_metadata?.full_name || email.split('@')[0];
      setUserName(name);

      // Check authorization whitelist
      const approval = internshipService.isEmailApproved(email, 'intern');
      if (!approval.approved) {
        internshipService.submitRoleRequest(
          email,
          name,
          'intern',
          'Intern portal sign-in awaiting CEO approval'
        );
        setIsPendingApproval(true);
        return;
      }
      setIsPendingApproval(false);

      // Check if user has accepted onboarding
      const hasAccepted = internshipService.hasAcceptedOnboarding(email);
      if (!hasAccepted) {
        internshipService.checkOnboardingStatus(email).then(acceptedInDb => {
          if (!acceptedInDb) {
            setShowOnboarding(true);
          }
        });
      }

      // Check role based on metadata or email
      if (email.includes('dm') || currentSession.user.user_metadata?.role === 'digital_marketing') {
        setUserRole('Digital Marketing Intern');
      } else {
        setUserRole('Business Development Intern');
      }

      loadData();
    });
  }, [navigate]);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardRulesAgreed || !onboardTermsAgreed || !onboardNdaAgreed || !onboardSignature) {
      toast.error("Please read and accept all rules, regulations, and terms.");
      return;
    }

    if (!onboardGovtIdNumber.trim() || !onboardCollegeIdNumber.trim() || !onboardCollegeName.trim()) {
      toast.error("Government ID and College Student ID are mandatory for verification and certificate issuance.");
      return;
    }

    internshipService.recordOnboardingAcceptance(
      userEmail, 
      userName, 
      userRole, 
      onboardSignature,
      onboardGovtIdType,
      onboardGovtIdNumber.trim(),
      onboardCollegeIdNumber.trim(),
      onboardCollegeName.trim()
    );
    setShowOnboarding(false);
    toast.success("Welcome aboard! Government & College IDs verified and onboarding recorded.");
  };

  const handleRequestExtension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showExtensionModal || !extReason || !extNewDate) return;

    internshipService.requestDeadlineExtension({
      task_id: showExtensionModal.id,
      task_title: showExtensionModal.title,
      intern_email: userEmail,
      intern_name: userName,
      reason: extReason,
      requested_deadline: extNewDate,
      original_deadline: showExtensionModal.stipulated_deadline
    });

    toast.success("Extension request submitted to CEO. Awaiting review.");
    setShowExtensionModal(null);
    setExtReason('');
    setExtNewDate('');
    loadData();
  };

  const handleRequestData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataReqTitle || !dataReqDesc) return;

    internshipService.requestDataAsset({
      title: dataReqTitle,
      description: dataReqDesc,
      category: dataReqCategory,
      intern_email: userEmail,
      intern_name: userName
    });

    toast.success("Data & Asset request submitted to CEO. Awaiting approval.");
    setShowDataReqModal(false);
    setDataReqTitle('');
    setDataReqDesc('');
    loadData();
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle || !proofBefore || !proofAfter || !proofMetric) return;

    internshipService.submitPointOfProof({
      intern_email: userEmail,
      intern_name: userName,
      role: userRole,
      title: proofTitle,
      before_state: proofBefore,
      after_state: proofAfter,
      metric_summary: proofMetric,
      proof_link_or_notes: proofLink
    });

    toast.success("Point of Proof submitted to CEO for official verification!");
    setShowProofModal(false);
    setProofTitle('');
    setProofBefore('');
    setProofAfter('');
    setProofMetric('');
    setProofLink('');
    loadData();
  };

  const handleSubmitInterlink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interlinkLoophole || !interlinkAction) return;

    internshipService.createInterlinkAlert({
      created_by_email: userEmail,
      created_by_name: userName,
      role: 'Business Development Intern',
      loophole_identified: interlinkLoophole,
      product_or_client: interlinkProduct,
      action_requested_from_dm: interlinkAction,
      target_audience: interlinkAudience || 'Target Indian SMBs'
    });

    toast.success("Growth Loophole Alert published! Digital Marketing team has been alerted.");
    setShowInterlinkModal(false);
    setInterlinkLoophole('');
    setInterlinkAction('');
    setInterlinkAudience('');
    loadData();
  };

  const handleScratch = (rewardId: string) => {
    const updated = internshipService.scratchReward(rewardId);
    setScratchedIds(updated);
    toast.success("Congratulations! Scratch card revealed. Share this code with CEO to claim your goodies!");
  };

  const handleSignOffer = () => {
    if (!signatureName) {
      toast.error("Please enter your full legal name to e-sign.");
      return;
    }
    setOfferSigned(true);
    toast.success("Offer letter digitally signed and registered on ledger!");
  };

  const copyReferralCode = () => {
    const code = userRole === 'Business Development Intern' ? 'BD-SAI-GROWTH26' : 'DM-PRINTFLOW-VIRAL26';
    navigator.clipboard.writeText(code);
    toast.success(`Referral tracking code (${code}) copied to clipboard!`);
  };

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
            toast.success("Congratulations! Your account has been approved by the CEO.");
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
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Helmet>
        <title>Internship Growth & Management Workspace | Siddhi Dynamics</title>
      </Helmet>

      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header Banner */}
          <div className="p-6 md:p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-card/80 via-primary/5 to-card/80 backdrop-blur-xl shadow-2xl mb-8 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-wider">
                    {userRole}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-bold">
                    {duration} Tenure
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Approved Team Member
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-black text-foreground">
                  Welcome back, <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-2xl">
                  Supervised by Founder & CEO Sai Vara Prasad. Track stipulated tasks, record verifiable Points of Proof, and collaborate across BD and DM teams.
                </p>
              </div>

              {/* Referral Attribution Widget */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 shrink-0 md:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Your Attribution Referral Code
                </span>
                <div className="flex items-center gap-2 md:justify-end">
                  <code className="px-3 py-1.5 rounded-xl bg-black/60 border border-primary/30 text-primary font-mono text-sm font-bold">
                    {userRole === 'Business Development Intern' ? 'BD-SAI-GROWTH26' : 'DM-PRINTFLOW-VIRAL26'}
                  </code>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Dual Attribution: BD & DM share 50/50 milestone rewards for converted clients.
                </p>
              </div>
            </div>
          </div>

          {/* Rate Experience Prompt Banner (Gated Google Prompt) */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-emerald-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <span>{myReview ? `You rated us ${myReview.rating}★` : 'Intern Experience Feedback & Review'}</span>
                  {myReview && myReview.rating >= 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                      Eligible for Google Review
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-white/70">
                  {myReview 
                    ? myReview.rating >= 4 
                      ? 'Help other ambitious students find Siddhi Dynamics by posting your positive review on Google Maps.'
                      : 'Your concerns have been privately escalated to CEO Sai Vara Prasad for internal resolution.'
                    : 'Share your experience on mentorship, real tasks, and platform tools. Honest reviews help us improve.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('review')}
              className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-transform hover:scale-105 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-black" />
              {myReview ? (myReview.rating >= 4 ? 'Post on Google' : 'View Feedback') : 'Rate Experience'}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 no-scrollbar">
            {[
              { id: 'tasks', label: 'Tasks & Stipulated Deadlines', icon: Clock, count: tasks.length },
              { id: 'proofs', label: 'Point of Proof Ledger', icon: ShieldCheck, count: proofs.length },
              { id: 'interlink', label: 'BD ⇄ DM Growth Loop', icon: Users, count: interlinks.length },
              { id: 'incentives', label: 'Milestone Scratch Cards', icon: Gift, count: incentives.length },
              { id: 'documents', label: 'Offer & Certificates', icon: FileText, count: null },
              { id: 'review', label: 'Intern Feedback & Review', icon: Star, count: myReview ? `${myReview.rating}★` : 'New' },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-card/50 text-muted-foreground hover:text-foreground border border-white/5'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-muted-foreground'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Tasks & Stipulated Deadlines */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">Assigned Tasks & Stipulated Timelines</h2>
                  <p className="text-xs text-muted-foreground">Admin/CEO assigns deadlines. If you need more time or client assets, submit an official request below.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDataReqModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary" /> Request Data / Assets
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                  <div key={task.id} className="p-6 rounded-3xl border border-white/10 bg-card/60 backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-md">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${task.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                          {task.priority} Priority
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> Due: {task.stipulated_deadline}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-foreground mb-2 leading-tight">{task.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">{task.description}</p>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Assigned By: <strong className="text-foreground">{task.created_by}</strong></span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
                          const updated = internshipService.updateTaskStatus(task.id, newStatus);
                          setTasks(updated);
                          toast.success(`Task status updated to ${newStatus}`);
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-primary/20 hover:bg-primary/30 text-primary'}`}
                      >
                        {task.status === 'Completed' ? 'Mark In Progress' : 'Mark Completed'}
                      </button>

                      <button
                        onClick={() => setShowExtensionModal(task)}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                        title="Request extension from CEO"
                      >
                        Extend Deadline
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outstanding Extension & Data Requests Table */}
              {(extensions.length > 0 || dataRequests.length > 0) && (
                <div className="pt-8 border-t border-white/10 space-y-4">
                  <h3 className="text-base font-extrabold text-foreground">CEO Approvals & Requests Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Extensions */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" /> Deadline Extension Requests
                      </h4>
                      {extensions.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No extension requests submitted.</p>
                      ) : (
                        <div className="space-y-2">
                          {extensions.map(ext => (
                            <div key={ext.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-foreground block">{ext.task_title}</span>
                                <span className="text-[10px] text-muted-foreground">Requested: {ext.requested_deadline} • Reason: {ext.reason}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${ext.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : ext.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {ext.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Data Requests */}
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-primary" /> Data & Asset Requests
                      </h4>
                      {dataRequests.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No data requests submitted.</p>
                      ) : (
                        <div className="space-y-2">
                          {dataRequests.map(d => (
                            <div key={d.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-foreground block">{d.title} ({d.category})</span>
                                <span className="text-[10px] text-muted-foreground">{d.description}</span>
                                {d.admin_response_data && (
                                  <span className="text-[10px] text-primary block mt-1">Fulfillment: {d.admin_response_data}</span>
                                )}
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${d.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
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
            </div>
          )}

          {/* TAB 2: Point of Proof (PoP) Ledger */}
          {activeTab === 'proofs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">Point of Proof (PoP) Verification Ledger</h2>
                  <p className="text-xs text-muted-foreground">
                    Every step and result is documented here. For example: "Earlier 0 clients ➔ After outreach, closed 1 client and ₹40,000 contract". CEO verifies each proof.
                  </p>
                </div>

                <button
                  onClick={() => setShowProofModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold flex items-center gap-2 hover:scale-105 transition-transform shadow-md cursor-pointer self-start"
                >
                  <Plus className="w-4 h-4" /> Draft Point of Proof
                </button>
              </div>

              <div className="space-y-4">
                {proofs.map(p => (
                  <div key={p.id} className="p-6 rounded-3xl border border-white/10 bg-card/60 backdrop-blur-md space-y-4 shadow-lg hover:border-primary/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{p.role}</span>
                        <h3 className="text-base font-extrabold text-foreground">{p.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{p.created_at}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 ${p.status === 'Verified by CEO' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          <ShieldCheck className="w-3.5 h-3.5" /> {p.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Before State (Baseline)</span>
                        <p className="text-slate-300 leading-relaxed">{p.before_state}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">After State (Demonstrated Proof)</span>
                        <p className="text-slate-300 leading-relaxed">{p.after_state}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-extrabold text-foreground">Metrics: <span className="text-primary">{p.metric_summary}</span></span>
                      {p.proof_link_or_notes && (
                        <span className="text-slate-400 text-[11px]">Attachment/Ref: <strong className="text-slate-200">{p.proof_link_or_notes}</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BD ⇄ DM Interlink Growth Loop */}
          {activeTab === 'interlink' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">Cross-Functional Interlink Alerts</h2>
                  <p className="text-xs text-muted-foreground">
                    When BD detects low attraction or market loopholes, an alert is raised. DM responds with targeted Reels, carousels, and PrintFlow growth campaigns.
                  </p>
                </div>

                <button
                  onClick={() => setShowInterlinkModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-extrabold flex items-center gap-2 hover:scale-105 transition-transform shadow-md cursor-pointer self-start"
                >
                  <Plus className="w-4 h-4" /> Raise Loophole Alert
                </button>
              </div>

              <div className="space-y-4">
                {interlinks.map(alert => (
                  <div key={alert.id} className="p-6 rounded-3xl border border-white/10 bg-card/60 backdrop-blur-md space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Target: {alert.product_or_client}</span>
                        <h3 className="text-base font-extrabold text-foreground">Alert from {alert.created_by_name} ({alert.role})</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${alert.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {alert.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Identified Loophole / Customer Friction</span>
                        <p className="text-slate-300">{alert.loophole_identified}</p>
                      </div>

                      <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Requested Action for Digital Marketing Team</span>
                        <p className="text-slate-300">{alert.action_requested_from_dm}</p>
                        {alert.dm_response_notes && (
                          <div className="mt-2 pt-2 border-t border-purple-500/20 text-[11px] text-purple-300">
                            <strong>DM Status Note:</strong> {alert.dm_response_notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          const notes = prompt("Enter DM campaign link or update note:");
                          if (notes) {
                            const updated = internshipService.updateInterlinkStatus(alert.id, 'Campaign In Progress', notes);
                            setInterlinks(updated);
                            toast.success("Campaign response logged on alert!");
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Respond as DM Team
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Milestone Scratch Cards & Incentives */}
          {activeTab === 'incentives' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Milestone Scratch Cards & Goodies</h2>
                <p className="text-xs text-muted-foreground">
                  Hit your stipulated deadlines and verified Points of Proof to scratch and reveal secret incentive voucher codes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {incentives.map((reward, i) => {
                  const isScratched = scratchedIds.includes(reward.id);
                  return (
                    <div key={reward.id} className="p-6 rounded-3xl border border-white/10 bg-card/60 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden">
                      <div>
                        <div className="w-full h-36 rounded-2xl bg-muted/30 overflow-hidden mb-4 relative">
                          <img 
                            src={reward.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60'} 
                            alt={reward.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-amber-400 border border-amber-400/30">
                            Milestone Tier {i + 1}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-foreground text-base mb-1">{reward.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{reward.description}</p>
                        <ul className="space-y-1 text-xs text-slate-300 mb-4">
                          {reward.items_included.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Gift className="w-3 h-3 text-primary shrink-0" /> {item}
                            </li>
                          ))}
                        </ul>

                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
                          <strong>Criteria:</strong> {reward.required_milestone}
                        </div>
                      </div>

                      {/* Scratch Card Interactive Area */}
                      <div className="pt-3 border-t border-white/10">
                        {isScratched ? (
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-primary/20 to-amber-500/20 border border-amber-400/50 text-center space-y-1 animate-pulse">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                              Voucher Unlocked!
                            </span>
                            <code className="text-base font-mono font-black text-white block tracking-wider">
                              {reward.scratch_code || 'SD-REWARD-2026'}
                            </code>
                            <span className="text-[10px] text-slate-300 block">
                              Share code with admin to ship your goodies!
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleScratch(reward.id)}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-primary text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" /> Scratch to Reveal Code
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Offer Letter & Certificate Hub */}
          {activeTab === 'documents' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Digital Documents & Credentials</h2>
                <p className="text-xs text-muted-foreground">
                  Digitally e-sign your official Internship Offer Letter and generate your verified Completion Certificate upon finishing your tenure.
                </p>
              </div>

              {/* Offer Letter Box */}
              <div className="p-8 rounded-3xl border border-white/10 bg-card/70 backdrop-blur-xl space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Official Employment Record</span>
                    <h3 className="text-xl font-black text-foreground">Internship Offer Letter</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${offerSigned ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                    {offerSigned ? 'Digitally Signed' : 'Pending Signature'}
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 text-xs text-slate-300 leading-relaxed font-mono">
                  <p><strong>ENTITY:</strong> Siddhi Dynamics LLP</p>
                  <p><strong>CANDIDATE:</strong> {userName} ({userEmail})</p>
                  <p><strong>DESIGNATION:</strong> {userRole}</p>
                  <p><strong>TENURE:</strong> {duration} (Subject to stipulated task completion)</p>
                  <p><strong>REPORTING TO:</strong> Sarugu Sai Vara Prasad, Founder & Designated Partner</p>
                  <p className="pt-2 border-t border-white/5">
                    TERMS & CREDENTIALS: This is an unpaid internship for practical skill development and academic learning. Upon successful completion of your selected tenure and assigned deliverables, you will be awarded an official Certificate of Internship Completion. A formal Letter of Recommendation (LOR) is granted strictly upon completing 2 years of active service with Siddhi Dynamics LLP. All tasks are assigned with stipulated deadlines; extension requests and data resources are subject to Founder & CEO approval. All intellectual property, client pipelines, and campaign assets developed remain the sole property of Siddhi Dynamics LLP.
                  </p>
                </div>

                {!offerSigned ? (
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                    <label className="text-xs font-bold text-foreground block">
                      Type Full Legal Name for Digital E-Sign:
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:outline-none focus:border-primary font-mono"
                      />
                      <button
                        onClick={handleSignOffer}
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform cursor-pointer"
                      >
                        Sign & Accept
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Signed by: <strong>{signatureName || userName}</strong> (Timestamp: {new Date().toLocaleDateString()})
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Print Letter
                    </button>
                  </div>
                )}
              </div>

              {/* Completion Certificate Box */}
              <div className="p-8 rounded-3xl border border-white/10 bg-card/70 backdrop-blur-xl space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Credential Verification & Anti-Tamper Security</span>
                    <h3 className="text-xl font-black text-foreground">Official Internship Certificate</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${myCertificate ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                    {myCertificate ? 'Officially Issued & Verified' : 'Tenure In Progress'}
                  </span>
                </div>

                {myCertificate ? (
                  <div className="p-8 rounded-3xl bg-gradient-to-b from-black/90 via-card to-black/90 border-2 border-amber-400/40 text-center space-y-6 relative overflow-hidden shadow-2xl select-none">
                    {/* Security Hologram & Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <span className="text-7xl font-black tracking-widest text-white rotate-[-25deg]">
                        SIDDHI DYNAMICS LLP
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-4 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                          Certificate ID: {myCertificate.certificate_no}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 block">
                          Tamper-Proof Checksum: {myCertificate.verification_checksum}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
                        Grade: {myCertificate.grade}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/10 border-2 border-amber-400/40 flex items-center justify-center shadow-lg">
                        <Award className="w-8 h-8 text-amber-400" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs uppercase font-extrabold tracking-widest text-primary block">
                          Siddhi Dynamics LLP • Hyderabad & Nizamabad
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-serif font-black text-white">
                          CERTIFICATE OF INTERNSHIP COMPLETION
                        </h4>
                      </div>

                      <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                        This is to certify that <strong className="text-amber-400 text-sm">{myCertificate.recipient_name}</strong> from <strong className="text-white">{myCertificate.college_name}</strong> (Student ID: {myCertificate.college_id_number} • {myCertificate.govt_id_type}: {myCertificate.govt_id_masked}) has successfully completed the <strong className="text-primary">{myCertificate.duration}</strong> professional internship as <strong className="text-white">{myCertificate.role}</strong>.
                      </p>

                      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-md mx-auto text-left space-y-1.5 text-xs text-slate-300">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Verified Contributions:</span>
                        {myCertificate.key_achievements.map((ach, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                      <div className="text-left space-y-0.5">
                        <span className="text-slate-400 text-[11px] block">Issued On: <strong>{myCertificate.issue_date}</strong></span>
                        <span className="text-slate-400 text-[11px] block">Authorized Signatory: <strong>{myCertificate.issued_by}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/verify-certificate?no=${myCertificate.certificate_no}`}
                          target="_blank"
                          className="px-4 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Public Verification Link <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Print / PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-3xl bg-gradient-to-b from-black/80 to-card border border-white/10 text-center space-y-4 relative overflow-hidden">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-black text-white">Tenure Active & Under Evaluation</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your official Certificate of Completion will be generated, signed by CEO Sai Vara Prasad, and registered on the tamper-proof ledger upon concluding your {duration} stipulated tasks and Points of Proof.
                    </p>
                    <div className="pt-2 text-xs text-muted-foreground">
                      Admin will review milestone results and issue certificate directly to your portal.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Intern Experience Feedback & Gated Google Review */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    Intern Experience Feedback & Evaluation
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Your real feedback shapes our curriculum and executive mentorship at Siddhi Dynamics.
                  </p>
                </div>
                {myReview && !isEditingReview && (
                  <button
                    onClick={() => setIsEditingReview(true)}
                    className="self-start px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                  >
                    Edit / Update Feedback
                  </button>
                )}
              </div>

              {myReview && !isEditingReview ? (
                /* ─── REVIEW ALREADY SUBMITTED: GATED DISPLAY ─── */
                <div className="space-y-6">
                  {myReview.rating >= 4 ? (
                    /* ─── 4 OR 5 STARS: HIGH PRAISE -> PROMPT GOOGLE MAPS ─── */
                    <div className="p-8 rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-card/80 to-purple-500/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-400/15 rounded-full blur-[100px] pointer-events-none" />

                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {myReview.rating}/5 Stars — Exceptional
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {myReview.category}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Submitted on {myReview.submitted_at}
                        </span>
                      </div>

                      <div className="space-y-4 max-w-2xl">
                        <h3 className="text-2xl font-black text-white leading-tight">
                          🌟 Thank you for your {myReview.rating}-star review, {userName}!
                        </h3>
                        <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
                          We are thrilled that your experience at Siddhi Dynamics provided practical value and growth.
                          Because your experience was outstanding, sharing your genuine review on Google Maps directly helps other ambitious students find us and strengthens our company reputation!
                        </p>

                        {/* Review Quote Snippet */}
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-mono text-[11px] text-amber-300">Your Written Review:</span>
                            <button
                              onClick={handleCopyReview}
                              className="text-xs text-primary hover:underline flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              {copiedReview ? 'Copied!' : 'Copy Review Text'}
                            </button>
                          </div>
                          <h4 className="font-extrabold text-foreground text-sm">"{myReview.review_title}"</h4>
                          <p className="text-xs text-slate-300 italic leading-relaxed">
                            "{myReview.review_text}"
                          </p>
                        </div>

                        {/* Post on Google Maps CTA */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                          <button
                            onClick={handleOpenGoogle}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-400/20 hover:scale-105 transition-all cursor-pointer"
                          >
                            <GoogleLogo />
                            <span>Post Your Review on Google Maps</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          <span className="text-[11px] text-muted-foreground text-center sm:text-left">
                            Opens Siddhi Dynamics on Google in a new tab. Paste and rate!
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ─── 1, 2, OR 3 STARS: CRITICAL FEEDBACK -> KEEP STRICTLY INTERNAL (NO GOOGLE MAPS) ─── */
                    <div className="p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card/80 to-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" /> Private Feedback ({myReview.rating}/5)
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-300 border border-white/10">
                          {myReview.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                          Flagged for CEO Attention
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Submitted on {myReview.submitted_at}
                        </span>
                      </div>

                      <div className="space-y-4 max-w-2xl">
                        <h3 className="text-2xl font-black text-white leading-tight">
                          🙏 Thank you for your candid feedback, {userName}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          We hold our mentorship and operations to the highest standard. Because your rating was {myReview.rating}/5, your remarks have been routed confidentially to our leadership team and Founder & CEO Sai Vara Prasad for direct review.
                        </p>

                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Executive Resolution Protocol
                          </div>
                          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                            <li><strong>Confidential Internal Review:</strong> This critique is preserved exclusively for management and is <em>never</em> published externally or to Google.</li>
                            <li><strong>Mentorship Adjustment:</strong> We diagnose pain points in <strong>{myReview.category}</strong> to adjust task load, provide extra resources, or schedule 1-on-1 calls.</li>
                            <li><strong>Direct Channel:</strong> Feel free to write directly to <strong>saivaraprasad@siddhidynamics.in</strong> for immediate resolution.</li>
                          </ul>
                        </div>

                        {/* Submission details */}
                        <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-1">
                          <span className="text-[11px] text-muted-foreground block font-mono">Recorded Feedback:</span>
                          <p className="text-xs font-bold text-foreground">"{myReview.review_title}"</p>
                          <p className="text-xs text-slate-400 italic">"{myReview.review_text}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ─── FEEDBACK SUBMISSION FORM ─── */
                <div className="p-8 rounded-3xl border border-white/10 bg-card/70 backdrop-blur-xl shadow-2xl max-w-3xl">
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-foreground mb-1">
                      {isEditingReview ? 'Update Your Experience Review' : 'Rate Your Internship Experience'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Rate your learning, platform workflows, mentorship, and practical skill development.
                    </p>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    {/* 5-Star Interactive Rating */}
                    <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <label className="text-xs font-bold text-white/90 block">
                        Overall Rating (1 to 5 Stars) *
                      </label>
                      <div className="flex items-center gap-2 py-1">
                        {[1, 2, 3, 4, 5].map(star => {
                          const isFilled = (hoverRating || rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 hover:scale-125 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  isFilled
                                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                    : 'text-slate-600'
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className="text-xs font-bold text-amber-300 ml-3">
                          {rating === 5 && 'Outstanding & Transformative (5/5) 🚀'}
                          {rating === 4 && 'Very Good & Valuable (4/5) 😄'}
                          {rating === 3 && 'Average / Neutral (3/5) 🙂'}
                          {rating === 2 && 'Below Expectations (2/5) 😐'}
                          {rating === 1 && 'Needs Significant Improvement (1/5) 🙁'}
                        </span>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-white/80 block mb-1.5">
                          Feedback Focus Area *
                        </label>
                        <select
                          value={reviewCategory}
                          onChange={(e: any) => setReviewCategory(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                        >
                          <option value="Overall Experience">Overall Experience</option>
                          <option value="Mentorship & Guidance">Mentorship & Guidance</option>
                          <option value="Skill & Practical Learning">Skill & Practical Learning</option>
                          <option value="Platform & Task Clarity">Platform & Task Clarity</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-white/80 block mb-1.5">
                          Would you recommend to your college peers?
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <label className="flex items-center gap-1.5 text-xs text-white/80 cursor-pointer">
                            <input
                              type="radio"
                              name="recommend"
                              checked={wouldRecommend === true}
                              onChange={() => setWouldRecommend(true)}
                              className="accent-primary"
                            />
                            <span>Yes, absolutely</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-xs text-white/80 cursor-pointer">
                            <input
                              type="radio"
                              name="recommend"
                              checked={wouldRecommend === false}
                              onChange={() => setWouldRecommend(false)}
                              className="accent-primary"
                            />
                            <span>Needs improvements first</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Review Title */}
                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1.5">
                        Review Headline / Summary *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewTitle}
                        onChange={e => setReviewTitle(e.target.value)}
                        placeholder="e.g. Real-world sales exposure that built my career confidence"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                      />
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="text-xs font-bold text-white/80 block mb-1.5">
                        Detailed Thoughts & Impact *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="Tell us what worked well, key skills acquired (PrintFlow, sales pipelines, social growth), and your honest impressions..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      {isEditingReview && (
                        <button
                          type="button"
                          onClick={() => setIsEditingReview(false)}
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReview ? 'Submitting...' : 'Submit Intern Review'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Deadline Extension Modal */}
      <AnimatePresence>
        {showExtensionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-base">Request Deadline Extension</h3>
                <button onClick={() => setShowExtensionModal(null)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Task: <strong className="text-foreground">{showExtensionModal.title}</strong><br />
                Current Deadline: {showExtensionModal.stipulated_deadline}
              </p>

              <form onSubmit={handleRequestExtension} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Reason for Extension *</label>
                  <textarea
                    required
                    rows={3}
                    value={extReason}
                    onChange={(e) => setExtReason(e.target.value)}
                    placeholder="e.g. Awaiting client pricing sign-off; filming second take of reel..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Requested Revised Date *</label>
                  <input
                    type="date"
                    required
                    value={extNewDate}
                    onChange={(e) => setExtNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowExtensionModal(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Data / Asset Request Modal */}
      <AnimatePresence>
        {showDataReqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-base">Request Data / Assets from CEO</h3>
                <button onClick={() => setShowDataReqModal(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRequestData} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Asset Category *</label>
                  <select
                    value={dataReqCategory}
                    onChange={(e: any) => setDataReqCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="PrintFlow Assets">PrintFlow Media / Demo Assets</option>
                    <option value="Client Brief">Client Business Requirements & Scope</option>
                    <option value="Instagram Media Kit">Instagram Brand Assets & Graphics</option>
                    <option value="Market Research">Market Research & Competitor Pricing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Title of Request *</label>
                  <input
                    type="text"
                    required
                    value={dataReqTitle}
                    onChange={(e) => setDataReqTitle(e.target.value)}
                    placeholder="e.g. PrintFlow Packaging Case Study Deck"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Detailed Requirements *</label>
                  <textarea
                    required
                    rows={3}
                    value={dataReqDesc}
                    onChange={(e) => setDataReqDesc(e.target.value)}
                    placeholder="Describe what data, spreadsheets, or graphics you need to close tasks..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDataReqModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider"
                  >
                    Submit to CEO
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Point of Proof Modal */}
      <AnimatePresence>
        {showProofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-white/15 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-lg">Log Verified Point of Proof</h3>
                <button onClick={() => setShowProofModal(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Document concrete before-and-after results for your professional portfolio. CEO verifies each entry.
              </p>

              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Proof Title *</label>
                  <input
                    type="text"
                    required
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    placeholder="e.g. Converted Packaging Client / 20k Reach Reel"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-red-400 block mb-1">Before State *</label>
                    <textarea
                      required
                      rows={3}
                      value={proofBefore}
                      onChange={(e) => setProofBefore(e.target.value)}
                      placeholder="e.g. Earlier 0 clients, no automation pipeline..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-emerald-400 block mb-1">After State *</label>
                    <textarea
                      required
                      rows={3}
                      value={proofAfter}
                      onChange={(e) => setProofAfter(e.target.value)}
                      placeholder="e.g. Closed 1 client, generated contract & invoice..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Key Quantitative Metric *</label>
                  <input
                    type="text"
                    required
                    value={proofMetric}
                    onChange={(e) => setProofMetric(e.target.value)}
                    placeholder="e.g. 1 Client Closed • ₹50,000 Pipeline • 25k Reach"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Proof Link / Invoice / Reel URL</label>
                  <input
                    type="text"
                    value={proofLink}
                    onChange={(e) => setProofLink(e.target.value)}
                    placeholder="https://... or invoice reference number"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProofModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider"
                  >
                    Submit Proof
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interlink Loophole Modal */}
      <AnimatePresence>
        {showInterlinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-foreground text-base">Raise Growth Loophole Alert</h3>
                <button onClick={() => setShowInterlinkModal(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitInterlink} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Product / Client Focus *</label>
                  <select
                    value={interlinkProduct}
                    onChange={(e: any) => setInterlinkProduct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-card border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="PrintFlow">PrintFlow (Invoice & Packaging Automation)</option>
                    <option value="Nexus ERP">Nexus ERP Platform</option>
                    <option value="Siddhi Dynamics">Siddhi Dynamics Custom AI</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Friction / Loophole Detected *</label>
                  <textarea
                    required
                    rows={3}
                    value={interlinkLoophole}
                    onChange={(e) => setInterlinkLoophole(e.target.value)}
                    placeholder="e.g. Clients in printing sector say software looks complicated for non-tech accountants..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Action Needed from Digital Marketing Team *</label>
                  <textarea
                    required
                    rows={2}
                    value={interlinkAction}
                    onChange={(e) => setInterlinkAction(e.target.value)}
                    placeholder="e.g. Create 2 reels showing 3-click invoice generation with zero setup..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInterlinkModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-black uppercase tracking-wider"
                  >
                    Trigger DM Sprint
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mandatory Onboarding & Rules Acceptance Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-primary/30 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-black text-foreground">Siddhi Dynamics Team Onboarding</h2>
                <p className="text-xs text-muted-foreground">
                  Welcome to the team! Before accessing the workspace, please read and accept our Code of Conduct, Rules & Regulations, and Internship Terms.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs text-slate-300 max-h-56 overflow-y-auto leading-relaxed">
                <h4 className="font-bold text-white">1. Stipulated Timelines & Accountability</h4>
                <p>All tasks are assigned with specific deadlines. In case of genuine delays or client bottlenecks, you must submit an official Extension Request through the portal for CEO approval prior to the deadline.</p>

                <h4 className="font-bold text-white">2. Point of Proof Ledger</h4>
                <p>Every activity, outreach call, and marketing campaign must be recorded as verifiable Point of Proof. Transparent results are the basis for official certificate issuance and evaluation.</p>

                <h4 className="font-bold text-white">3. Nature of Internship & Credential Policy</h4>
                <p>This is an unpaid educational internship for practical skill growth. You receive an official Certificate of Internship Completion upon completing your tenure and assigned deliverables. A formal Letter of Recommendation (LOR) is issued strictly upon completing 2 years of active service with Siddhi Dynamics LLP.</p>

                <h4 className="font-bold text-white">4. Cross-Functional Synergy (BD ⇄ DM)</h4>
                <p>Interns actively collaborate across business development and marketing channels. BD interns guide market requirements, and DM interns produce high-hook content to drive conversions.</p>

                <h4 className="font-bold text-white">5. Confidentiality & Non-Disclosure (NDA)</h4>
                <p>All client identities, proprietary code, AI pipelines, PrintFlow architectures, and internal pricing remain strictly confidential.</p>
              </div>

              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={onboardRulesAgreed}
                      onChange={(e) => setOnboardRulesAgreed(e.target.checked)}
                      className="rounded border-white/20 text-primary focus:ring-0"
                    />
                    <span>I have read, understood, and agree to the <strong>Rules & Regulations</strong>.</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={onboardTermsAgreed}
                      onChange={(e) => setOnboardTermsAgreed(e.target.checked)}
                      className="rounded border-white/20 text-primary focus:ring-0"
                    />
                    <span>I accept the <strong>Terms & Conditions</strong> for my chosen internship tenure.</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={onboardNdaAgreed}
                      onChange={(e) => setOnboardNdaAgreed(e.target.checked)}
                      className="rounded border-white/20 text-primary focus:ring-0"
                    />
                    <span>I commit to maintaining strict client and intellectual property <strong>Confidentiality (NDA)</strong>.</span>
                  </label>
                </div>

                {/* Mandatory Verification IDs */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <p className="font-semibold mb-1">Mandatory Identity Records</p>
                  <p className="text-white/70">College and Government IDs are strictly verified for official record-keeping, anti-fraud compliance, and tamper-proof certificate generation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">College / University Name *</label>
                    <input
                      type="text"
                      required
                      value={onboardCollegeName}
                      onChange={(e) => setOnboardCollegeName(e.target.value)}
                      placeholder="e.g. IIM Ahmedabad / Delhi University"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">College Roll / Student ID No *</label>
                    <input
                      type="text"
                      required
                      value={onboardCollegeIdNumber}
                      onChange={(e) => setOnboardCollegeIdNumber(e.target.value)}
                      placeholder="e.g. 2024-MBA-089"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Government ID Type *</label>
                    <select
                      value={onboardGovtIdType}
                      onChange={(e) => setOnboardGovtIdType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="Aadhaar Card" className="bg-neutral-900 text-white">Aadhaar Card</option>
                      <option value="PAN Card" className="bg-neutral-900 text-white">PAN Card</option>
                      <option value="Passport" className="bg-neutral-900 text-white">Passport</option>
                      <option value="Voter ID" className="bg-neutral-900 text-white">Voter ID</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">Govt ID Number *</label>
                    <input
                      type="text"
                      required
                      value={onboardGovtIdNumber}
                      onChange={(e) => setOnboardGovtIdNumber(e.target.value)}
                      placeholder="e.g. 5489 XXXX 9123 or ABCDE1234F"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Digital Signature (Type Full Legal Name) *</label>
                  <input
                    type="text"
                    required
                    value={onboardSignature}
                    onChange={(e) => setOnboardSignature(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:scale-[1.01] transition-transform shadow-lg cursor-pointer"
                >
                  Accept Terms & Complete Onboarding
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
}
