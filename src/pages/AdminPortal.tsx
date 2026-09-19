import { AdminClientsConsole } from "@/components/requirements/AdminClientsConsole";
import { AdminInternshipsConsole } from "@/components/admin/AdminInternshipsConsole";
import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseService } from "@/services/supabaseService";
import { emailService } from "@/services/emailService";
import { internshipService } from "@/services/internshipService";
import { agencyCommissionService } from "@/services/agencyCommissionService";
import { payrollService, PayrollRecord, PayrollSummary } from "@/services/payrollService";
import { DigitalInvoiceModal, InvoiceModalData } from "@/components/invoice/DigitalInvoiceModal";
import { KnowledgeHubManager } from "@/components/admin/KnowledgeHubManager";
import SeoGeoCommandCenter from "@/components/admin/SeoGeoCommandCenter";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { GoogleReviewCard } from "@/components/GoogleReviewCard";
import {
    Users,
    GraduationCap,
    MessageSquare,
    Target,
    ClipboardList,
    HelpCircle,
    Handshake,
    Filter,
    Search,
    LogOut,
    ChevronRight,
    ChevronLeft,
    Calendar,
    Mail,
    Briefcase,
    Building2,
    RefreshCw,
    ArrowUpDown,
    MessageCircle,
    Send,
    X,
    Edit,
    Edit3,
    ShieldCheck,
    Paperclip,
    FileText,
    Download,
    BarChart3,
    TrendingUp,
    Plus,
    CreditCard,
    Zap,
    Lock,
    CheckCircle2,
    Landmark,
    Check,
    Eye,
    EyeOff,
    Clock,
    ExternalLink,
    Globe,
    MapPin,
    Laptop,
    PanelsTopLeft,
    Receipt,
    Award,
    DollarSign,
    Coins,
    Printer,
    BadgeCheck,
    QrCode,
    Copy
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { parseSubmissionMessage } from "@/lib/parseSubmissionMessage";
import { parseProjectMeta, serializeProjectMeta, generateInvoiceId } from "@/lib/projectLifecycleHelper";
import {
    ProjectLifecycleMeta,
    BankingDetails,
    DEFAULT_BANKING_DETAILS,
    DEFAULT_BANK_ACCOUNTS,
    BankAccount,
    ProjectInvoice,
    ProjectUpdate
} from "@/types/projectLifecycle";

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
    is_public?: boolean;
    bounty_reward?: string;
}

const AdminPortal = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [chatOpen, setChatOpen] = useState<Submission | null>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [sendingMsg, setSendingMsg] = useState(false);
    const [viewMode, setViewMode] = useState<'submissions' | 'verifications' | 'users' | 'agency' | 'knowledge' | 'seo-geo' | 'clients' | 'internships'>('submissions');
    const [adminEmail, setAdminEmail] = useState('');
    const [registeredInternsCount, setRegisteredInternsCount] = useState<number>(0);

    // ── Payment Verifications (Direct QR & Bank Transfer) ────────────────────
    const pendingVerifications = useMemo(() => {
        const list: {
            submission: Submission;
            invoice: ProjectInvoice;
            meta: ProjectLifecycleMeta;
        }[] = [];

        submissions.forEach((s) => {
            const m = parseProjectMeta(s.bounty_reward);
            (m.invoices || []).forEach((inv) => {
                if (
                    inv.verification_status === 'pending_verification' ||
                    (inv.status !== 'paid' && inv.transaction_id)
                ) {
                    list.push({ submission: s, invoice: inv, meta: m });
                }
            });
        });
        return list;
    }, [submissions]);

    // ── Client Invoices & Inflow Ledger Memo ──────────────────────────────────
    const allClientInvoices = useMemo(() => {
        const list: {
            submission: Submission;
            invoice: ProjectInvoice;
            meta: ProjectLifecycleMeta;
        }[] = [];

        submissions.forEach((s) => {
            const m = parseProjectMeta(s.bounty_reward);
            (m.invoices || []).forEach((inv) => {
                list.push({ submission: s, invoice: inv, meta: m });
            });
        });
        return list;
    }, [submissions]);

    const clientInflowsSummary = useMemo(() => {
        let totalBilled = 0;
        let totalReceived = 0;
        let totalPending = 0;

        allClientInvoices.forEach(({ invoice }) => {
            const num = typeof invoice.amount === 'number'
                ? invoice.amount
                : Number(String(invoice.amount).replace(/[^0-9.]/g, '')) || 0;
            totalBilled += num;
            if (invoice.status === 'paid' || invoice.verification_status === 'verified') {
                totalReceived += num;
            } else {
                totalPending += num;
            }
        });

        return { totalBilled, totalReceived, totalPending };
    }, [allClientInvoices]);

    // ── Digital Invoice Modal State ──────────────────────────────────────────
    const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<InvoiceModalData | null>(null);
    const [clientSubTab, setClientSubTab] = useState<'invoices' | 'board'>('invoices');
    const [internshipTab, setInternshipTab] = useState<'payroll' | 'console'>('payroll');

    // ── Intern & Employee Compensation / Payroll Ledger ───────────────────────
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(payrollService.getPayrollRecords());
    const [payrollSummary, setPayrollSummary] = useState<PayrollSummary>(payrollService.getPayrollSummary());
    const [newDisbursementModalOpen, setNewDisbursementModalOpen] = useState(false);
    const [newDisbursementForm, setNewDisbursementForm] = useState({
        recipient_name: '',
        recipient_email: '',
        role: 'intern' as 'intern' | 'employee',
        disbursement_type: 'stipend' as 'salary' | 'stipend' | 'incentive' | 'bonus',
        amount: '',
        period: 'September 2026',
        notes: '',
        certificate_id: '',
    });

    const refreshPayroll = () => {
        setPayrollRecords(payrollService.getPayrollRecords());
        setPayrollSummary(payrollService.getPayrollSummary());
    };

    const handleMarkPayrollPaid = (id: string) => {
        const utr = prompt("Enter Bank UTR / Payment Reference for this payout:", "SBI-PAY-" + Math.floor(1000000000 + Math.random() * 9000000000));
        if (!utr) return;
        payrollService.markPayrollPaid(id, utr);
        toast.success(`Disbursement marked Paid! (UTR: ${utr})`);
        refreshPayroll();
    };

    const handleCreatePayrollRecord = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDisbursementForm.recipient_name || !newDisbursementForm.amount) {
            toast.error("Please enter recipient name and amount.");
            return;
        }
        payrollService.addPayrollRecord({
            recipient_name: newDisbursementForm.recipient_name,
            recipient_email: newDisbursementForm.recipient_email,
            role: newDisbursementForm.role,
            disbursement_type: newDisbursementForm.disbursement_type,
            amount: Number(newDisbursementForm.amount),
            period: newDisbursementForm.period,
            notes: newDisbursementForm.notes,
            certificate_id: newDisbursementForm.certificate_id || undefined,
        });
        toast.success("Compensation disbursement recorded in ledger!");
        setNewDisbursementModalOpen(false);
        setNewDisbursementForm({
            recipient_name: '',
            recipient_email: '',
            role: 'intern',
            disbursement_type: 'stipend',
            amount: '',
            period: 'September 2026',
            notes: '',
            certificate_id: '',
        });
        refreshPayroll();
    };

    // ── Invoice Modal Handlers (Client & Agency) ─────────────────────────────
    const handleViewClientInvoice = (sub: Submission, inv: ProjectInvoice) => {
        const meta = parseProjectMeta(sub.bounty_reward);
        const amountNum = typeof inv.amount === 'number'
            ? inv.amount
            : Number(String(inv.amount).replace(/[^0-9.]/g, '')) || 50000;

        const data: InvoiceModalData = {
            invoiceNumber: inv.id || `SD-INV-${sub.id.slice(0, 6).toUpperCase()}`,
            invoiceDate: inv.submitted_at || inv.admin_verified_at || new Date().toISOString(),
            dueDate: inv.due_date || 'Immediate',
            billingType: 'client',
            client: {
                name: sub.name,
                organization: sub.organization || undefined,
                email: sub.email,
                phone: (sub as any).phone || undefined,
                address: (sub as any).address || 'Client Registered Address on Record',
            },
            items: [
                {
                    description: `${inv.title} (${meta.package_type || 'Custom Deep-Tech / AI Scope'})`,
                    quantity: 1,
                    rate: amountNum,
                    amount: amountNum,
                }
            ],
            subtotal: amountNum,
            taxAmount: 0,
            totalAmount: amountNum,
            currency: 'INR',
            paymentStatus: inv.status === 'paid' ? 'paid' : (inv.verification_status === 'pending_verification' ? 'pending_verification' : 'unpaid'),
            paymentMethod: inv.payment_mode ? inv.payment_mode.replace('_', ' ').toUpperCase() : 'DIRECT SBI WIRE / UPI QR (GATEWAY BYPASS)',
            transactionId: inv.transaction_id,
            verifiedAt: inv.admin_verified_at,
            notes: inv.description || `Milestone payment for ${meta.package_type || 'Software & AI Development'}. Verified and received directly into Siddhi Dynamics SBI Current A/C 45170121323.`,
        };
        setSelectedInvoiceForModal(data);
    };

    const handleViewAgencyInvoice = (proj: any, agencyConfig?: any) => {
        const invNo = proj.invoice_no || `SD-AGY-INV-${proj.id.slice(0, 6).toUpperCase()}`;
        const data: InvoiceModalData = {
            invoiceNumber: invNo,
            invoiceDate: proj.created_at || new Date().toISOString(),
            dueDate: 'On Contract Signing',
            billingType: 'agency',
            agency: {
                name: agencyConfig?.agency_name || proj.agency_name || proj.agency_email.split('@')[0],
                pocName: agencyConfig?.agency_poc_name || 'Designated Agency Partner POC',
                email: proj.agency_email,
                phone: agencyConfig?.agency_phone || '+91 98765 43210',
                address: agencyConfig?.agency_address || 'Agency Corporate Headquarters on Record',
                idType: agencyConfig?.agency_id_type || 'LLPIN',
                idNumber: agencyConfig?.agency_id_number || 'LLPIN/CIN/GST-ON-RECORD',
            },
            serviceProvidingTo: {
                clientName: proj.client_name,
                clientAddress: proj.client_address || 'End Client Business Address on Record',
                projectTitle: proj.project_title,
                scope: proj.service_scope || 'Comprehensive Software, Cloud Infrastructure & AI Automation Scope',
            },
            items: [
                {
                    description: `${proj.project_title} (End-Client: ${proj.client_name}) - Architecture, Cloud & AI Execution`,
                    quantity: 1,
                    rate: proj.project_value,
                    amount: proj.project_value,
                }
            ],
            subtotal: proj.project_value,
            taxAmount: 0,
            totalAmount: proj.project_value,
            currency: 'INR',
            paymentStatus: proj.inflow_status === 'received' ? 'paid' : 'pending_verification',
            paymentMethod: 'Direct Bank Wire / RTGS / NEFT / UPI',
            transactionId: proj.inflow_utr || proj.payout_reference,
            verifiedAt: proj.inflow_received_at,
            notes: `Project executed under ${proj.model_applied === 'commission' ? `Commission Model (${proj.commission_rate}% partner commission)` : 'Non-Commission Direct Execution'}. Total Inflow: ₹${proj.project_value.toLocaleString('en-IN')} | Partner Commission Outflow: ₹${(proj.commission_amount || 0).toLocaleString('en-IN')} | Net Retained by Siddhi Dynamics: ₹${((proj.project_value || 0) - (proj.commission_amount || 0)).toLocaleString('en-IN')}.`,
        };
        setSelectedInvoiceForModal(data);
    };

    const handleVerifyPayment = async (
        submissionId: string,
        invoiceId: string,
        markAs: 'verified' | 'rejected'
    ) => {
        const sub = submissions.find((s) => s.id === submissionId);
        if (!sub) return;
        const m = parseProjectMeta(sub.bounty_reward);
        const invs = m.invoices || [];

        const updatedInvs = invs.map((inv) => {
            if (inv.id === invoiceId) {
                return {
                    ...inv,
                    status: markAs === 'verified' ? ('paid' as const) : ('pending' as const),
                    verification_status: markAs,
                    admin_verified_at: new Date().toISOString(),
                };
            }
            return inv;
        });

        const isAdvance = updatedInvs.find((i) => i.id === invoiceId)?.title.toLowerCase().includes('advance') || invoiceId === 'SD-INV-001';
        const updatedMeta: ProjectLifecycleMeta = {
            ...m,
            invoices: updatedInvs,
            service_start_date: (markAs === 'verified' && isAdvance) ? (m.service_start_date || new Date().toISOString().split('T')[0]) : m.service_start_date,
        };

        const newProgress = (markAs === 'verified' && isAdvance && (!sub.progress || sub.progress < 25)) ? 25 : sub.progress;
        const newStatus = (markAs === 'verified' && isAdvance && sub.status !== 'Completed') ? 'In Progress' : sub.status;

        try {
            const { error } = await supabase
                .from('contact_submissions')
                .update({
                    bounty_reward: serializeProjectMeta(updatedMeta),
                    progress: newProgress,
                    status: newStatus,
                })
                .eq('id', submissionId);

            if (error) throw error;

            await supabase.from('chat_messages').insert({
                submission_id: submissionId,
                sender_email: adminEmail || 'finance@siddhidynamics.in',
                message: markAs === 'verified'
                    ? `[PAYMENT VERIFIED & RECEIVED] Finance verified receipt of payment for invoice ${invoiceId}. Status updated to '${newStatus}'. Official digital invoice generated with Section 65B IT Act 2000 verification seal.`
                    : `[PAYMENT REJECTED / CLARIFICATION NEEDED] Payment details for ${invoiceId} could not be verified against the bank statement. Please resubmit your transaction reference.`,
                is_admin: true,
            });

            toast.success(markAs === 'verified' ? 'Payment marked verified & received! Official digital invoice generated.' : 'Payment marked rejected.');
            await fetchSubmissions();
        } catch (err: any) {
            toast.error('Failed to update verification: ' + err.message);
        }
    };

    // ── Agency Commission Models & Payouts ───────────────────────────────────
    const [agencySubTab, setAgencySubTab] = useState<'clients' | 'commissions'>('clients');
    const [agencyConfigs, setAgencyConfigs] = useState(agencyCommissionService.getAgencyConfigs());
    const [agencyProjects, setAgencyProjects] = useState(agencyCommissionService.getAgencyProjects());
    const [editingAgencyConfig, setEditingAgencyConfig] = useState<any | null>(null);
    const [agencyEditModalOpen, setAgencyEditModalOpen] = useState(false);
    const [fullAgencyForm, setFullAgencyForm] = useState({
        agency_email: '',
        agency_name: '',
        agency_poc_name: '',
        agency_phone: '',
        agency_address: '',
        agency_id_type: 'LLPIN' as 'LLPIN' | 'CIN' | 'GSTIN' | 'Not Applicable',
        agency_id_number: '',
        model: 'commission' as 'commission' | 'non_commission',
        commission_rate: 15,
        notes: '',
    });

    const refreshAgencyData = () => {
        setAgencyConfigs(agencyCommissionService.getAgencyConfigs());
        setAgencyProjects(agencyCommissionService.getAgencyProjects());
    };

    const handleSaveAgencyConfig = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAgencyConfig?.agency_email) return;
        agencyCommissionService.saveAgencyConfig({
            agency_email: editingAgencyConfig.agency_email,
            agency_name: editingAgencyConfig.agency_name,
            model: editingAgencyConfig.model,
            commission_rate: parseInt(String(editingAgencyConfig.commission_rate || '15'), 10),
            notes: editingAgencyConfig.notes || '',
        });
        toast.success(`Agency settings updated for ${editingAgencyConfig.agency_email}!`);
        setEditingAgencyConfig(null);
        refreshAgencyData();
    };

    const handleSaveFullAgency = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullAgencyForm.agency_email) {
            toast.error("Agency email is required.");
            return;
        }
        agencyCommissionService.saveAgencyConfig({
            agency_email: fullAgencyForm.agency_email,
            agency_name: fullAgencyForm.agency_name,
            agency_poc_name: fullAgencyForm.agency_poc_name,
            agency_phone: fullAgencyForm.agency_phone,
            agency_address: fullAgencyForm.agency_address,
            agency_id_type: fullAgencyForm.agency_id_type,
            agency_id_number: fullAgencyForm.agency_id_number,
            model: fullAgencyForm.model,
            commission_rate: Number(fullAgencyForm.commission_rate),
            notes: fullAgencyForm.notes,
        });
        toast.success(`Agency partner profile updated: ${fullAgencyForm.agency_name}`);
        setAgencyEditModalOpen(false);
        refreshAgencyData();
    };

    const openEditFullAgency = (cfg: any) => {
        setFullAgencyForm({
            agency_email: cfg.agency_email,
            agency_name: cfg.agency_name || '',
            agency_poc_name: cfg.agency_poc_name || '',
            agency_phone: cfg.agency_phone || '',
            agency_address: cfg.agency_address || '',
            agency_id_type: cfg.agency_id_type || 'LLPIN',
            agency_id_number: cfg.agency_id_number || '',
            model: cfg.model || 'commission',
            commission_rate: cfg.commission_rate || 15,
            notes: cfg.notes || '',
        });
        setAgencyEditModalOpen(true);
    };

    const handleMarkAgencyPayout = (projId: string) => {
        const ref = prompt("Enter bank UTR / payment reference for this payout:", "SBI-UTR-" + Math.floor(1000000000 + Math.random() * 9000000000));
        if (!ref) return;
        agencyCommissionService.markPayoutPaid(projId, ref);
        toast.success("Commission payout marked paid!");
        refreshAgencyData();
    };

    // ── Role Approvals Queue (Intern & Employee) ─────────────────────────────
    const [roleRequests, setRoleRequests] = useState(internshipService.getRoleRequests());

    const refreshRoleRequests = () => {
        setRoleRequests(internshipService.getRoleRequests());
    };

    const handleApproveRoleRequest = (reqId: string) => {
        const ok = internshipService.approveRoleRequest(reqId);
        if (ok) {
            toast.success("Role request approved! User is added to team whitelist.");
            refreshRoleRequests();
        }
    };

    const handleRejectRoleRequest = (reqId: string) => {
        const ok = internshipService.rejectRoleRequest(reqId);
        if (ok) {
            toast.info("Role request rejected.");
            refreshRoleRequests();
        }
    };

    // ── Agency Clients Management ────────────────────────────────────────────
    const [agencyClients, setAgencyClients] = useState<any[]>([]);
    const [agencyClientsLoading, setAgencyClientsLoading] = useState(false);
    const [agencySearchTerm, setAgencySearchTerm] = useState('');
    const [editAgencyClient, setEditAgencyClient] = useState<any | null>(null);
    // Edit fields for agency client
    const [acCategory, setAcCategory] = useState('');
    const [acTenureMonths, setAcTenureMonths] = useState('');
    const [acTenureStart, setAcTenureStart] = useState('');
    const [acRetainerFee, setAcRetainerFee] = useState('');
    const [acGeoScore, setAcGeoScore] = useState('');
    const [acSeoScore, setAcSeoScore] = useState('');
    const [acGbpScore, setAcGbpScore] = useState('');
    const [acAeoScore, setAcAeoScore] = useState('');
    const [acImpressions, setAcImpressions] = useState('');
    const [acClicks, setAcClicks] = useState('');
    const [acCtr, setAcCtr] = useState('');
    const [acCitations, setAcCitations] = useState('');
    const [acStatus, setAcStatus] = useState('');
    const [acProgress, setAcProgress] = useState(0);
    const [savingAc, setSavingAc] = useState(false);
    // Invoice creation
    const [acInvoiceMonth, setAcInvoiceMonth] = useState('');
    const [acInvoiceAmount, setAcInvoiceAmount] = useState('');
    const [acInvoiceDesc, setAcInvoiceDesc] = useState('');
    const [acInvoiceDue, setAcInvoiceDue] = useState('');
    const [creatingInvoice, setCreatingInvoice] = useState(false);

    const fetchAgencyClients = async () => {
        setAgencyClientsLoading(true);
        try {
            const { data, error } = await supabase
                .from('agency_clients')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setAgencyClients(data || []);
        } catch (err: any) {
            toast.error('Failed to load agency clients: ' + (err.message || 'Unknown'));
        } finally {
            setAgencyClientsLoading(false);
        }
    };

    const openEditAgencyClient = (client: any) => {
        setEditAgencyClient(client);
        setAcCategory(client.category || 'SEO, GEO & AEO Programme');
        setAcTenureMonths(client.tenure_months?.toString() || '');
        setAcTenureStart(client.tenure_start_date || '');
        setAcRetainerFee(client.retainer_fee || '');
        setAcGeoScore(client.geo_score?.toString() || '0');
        setAcSeoScore(client.seo_score?.toString() || '0');
        setAcGbpScore(client.gbp_score?.toString() || '0');
        setAcAeoScore(client.aeo_score?.toString() || '0');
        setAcImpressions(client.monthly_impressions || '');
        setAcClicks(client.monthly_clicks || '');
        setAcCtr(client.ctr || '');
        setAcCitations(client.ai_citations || '');
        setAcStatus(client.status || 'Onboarding & Audit');
        setAcProgress(client.progress || 0);
        setAcInvoiceMonth('');
        setAcInvoiceAmount('');
        setAcInvoiceDesc('');
        setAcInvoiceDue('');
    };

    const handleSaveAgencyClient = async () => {
        if (!editAgencyClient) return;
        setSavingAc(true);
        try {
            const updates: any = {
                category: acCategory,
                tenure_months: acTenureMonths ? parseInt(acTenureMonths) : null,
                tenure_start_date: acTenureStart || null,
                retainer_fee: acRetainerFee || null,
                geo_score: parseInt(acGeoScore) || 0,
                seo_score: parseInt(acSeoScore) || 0,
                gbp_score: parseInt(acGbpScore) || 0,
                aeo_score: parseInt(acAeoScore) || 0,
                monthly_impressions: acImpressions || null,
                monthly_clicks: acClicks || null,
                ctr: acCtr || null,
                ai_citations: acCitations || null,
                status: acStatus,
                progress: acProgress,
                updated_at: new Date().toISOString(),
            };
            // Only an explicit admin fee change publishes a quotation to the agency.
            if (!acRetainerFee.trim()) {
                updates.admin_quote_assigned = false;
                updates.admin_quote_assigned_at = null;
            } else if (acRetainerFee !== (editAgencyClient.retainer_fee || '')) {
                updates.admin_quote_assigned = true;
                updates.admin_quote_assigned_at = new Date().toISOString();
            }
            const { error } = await supabase
                .from('agency_clients')
                .update(updates)
                .eq('id', editAgencyClient.id);
            if (error) throw error;
            setAgencyClients(prev => prev.map(c =>
                c.id === editAgencyClient.id ? { ...c, ...updates } : c
            ));
            toast.success(`Updated ${editAgencyClient.business_name} — live in agency portal!`);
            setEditAgencyClient(null);
        } catch (err: any) {
            toast.error('Save failed: ' + (err.message || 'Unknown'));
        } finally {
            setSavingAc(false);
        }
    };

    const handleCreateInvoice = async () => {
        if (!editAgencyClient || !acInvoiceMonth || !acInvoiceAmount) {
            toast.error('Month and Amount are required for invoice.');
            return;
        }
        setCreatingInvoice(true);
        try {
            const invoiceId = `INV-${Date.now()}`;
            const { error } = await supabase
                .from('agency_invoices')
                .insert({
                    id: invoiceId,
                    agency_email: editAgencyClient.agency_email,
                    client_id: editAgencyClient.id,
                    month: acInvoiceMonth,
                    amount: `₹${acInvoiceAmount}`,
                    raw_amount: Number(acInvoiceAmount) || 0,
                    status: 'Pending',
                    due_date: acInvoiceDue || null,
                    description: acInvoiceDesc || `Monthly retainer — ${editAgencyClient.business_name}`,
                });
            if (error) throw error;
            toast.success(`Invoice ${invoiceId} created for ${editAgencyClient.business_name}!`);
            setAcInvoiceMonth('');
            setAcInvoiceAmount('');
            setAcInvoiceDesc('');
            setAcInvoiceDue('');
        } catch (err: any) {
            toast.error('Invoice creation failed: ' + (err.message || 'Unknown'));
        } finally {
            setCreatingInvoice(false);
        }
    };

    // ── All Portal Users ─────────────────────────────────────────────────────
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [contactUser, setContactUser] = useState<any | null>(null);
    const [userChatInput, setUserChatInput] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'client' | 'partner' | 'investor' | 'employee'>('all');

    // Edit User Modal State
    const [editUserModal, setEditUserModal] = useState<any | null>(null);
    const [editUserName, setEditUserName] = useState('');
    const [editUserEmail, setEditUserEmail] = useState('');
    const [editUserRole, setEditUserRole] = useState<'client' | 'partner' | 'investor' | 'employee' | 'admin'>('client');
    const [editUserOrg, setEditUserOrg] = useState('');
    const [editUserDesignation, setEditUserDesignation] = useState('');
    const [editUserPhone, setEditUserPhone] = useState('');
    const [editUserQuote, setEditUserQuote] = useState('');
    const [editUserNotes, setEditUserNotes] = useState('');
    const [editUserVerified, setEditUserVerified] = useState(true);

    const openEditUser = (user: any) => {
        setEditUserModal(user);
        setEditUserName(user.name || '');
        setEditUserEmail(user.email || '');
        setEditUserRole(user.role || 'client');
        setEditUserOrg(user.organization || '');
        setEditUserDesignation(user.designation || '');
        setEditUserPhone(user.phone || '');
        const quotes = JSON.parse(localStorage.getItem('siddhi_custom_quotes') || '{}');
        setEditUserQuote(user.quote || quotes[user.email?.toLowerCase()] || '');
        setEditUserNotes(user.notes || '');
        setEditUserVerified(user.confirmed !== false);
    };

    const handleSaveUserData = async () => {
        if (!editUserModal) return;
        const emailKey = editUserEmail.toLowerCase().trim();
        if (!emailKey) {
            toast.error('A valid email is required.');
            return;
        }
        const updatedUser = {
            name: editUserName,
            email: editUserEmail,
            role: editUserRole,
            organization: editUserOrg,
            designation: editUserDesignation,
            phone: editUserPhone,
            quote: editUserQuote,
            notes: editUserNotes,
            confirmed: editUserVerified,
            updated_at: new Date().toISOString()
        };
        try {
            const { error } = await supabase.functions.invoke('admin-user-management', {
                body: { ...updatedUser, id: editUserModal.id, previousEmail: editUserModal.email },
            });
            if (error) throw error;
            setAllUsers(prev => prev.map(u => u.id === editUserModal.id || u.email?.toLowerCase() === editUserModal.email?.toLowerCase() ? { ...u, ...updatedUser } : u));
            toast.success(`Saved ${editUserName || editUserEmail}. Their portal and quotation are now synchronized.`);
            setEditUserModal(null);
            fetchSubmissions();
        } catch (error: any) {
            toast.error(error.message || 'Could not save user details.');
        }
    };

    const fetchAllUsers = async () => {
        setUsersLoading(true);
        try {
            // Fetch all contact submissions (gracefully fallback if status column is not yet migrated in DB)
            let submissions: any[] = [];
            try {
                let { data: subData, error: submissionsError } = await supabase
                    .from('contact_submissions')
                    .select('id, name, email, organization, designation, inquiry_type, status, created_at')
                    .order('created_at', { ascending: false });

                if (submissionsError && (submissionsError.code === '42703' || submissionsError.message?.toLowerCase().includes('status'))) {
                    console.warn('[AdminPortal] contact_submissions.status column missing, falling back to base columns:', submissionsError.message);
                    const fallback = await supabase
                        .from('contact_submissions')
                        .select('id, name, email, organization, designation, inquiry_type, created_at')
                        .order('created_at', { ascending: false });
                    subData = (fallback.data as any[] | null)?.map((s: any) => ({ ...s, status: 'new' })) ?? null;
                    submissionsError = fallback.error;
                }
                if (!submissionsError && Array.isArray(subData)) {
                    submissions = subData;
                }
            } catch (subErr) {
                console.warn('[AdminPortal] contact_submissions fetch note:', subErr);
            }

            // Fetch waitlist entries safely
            let waitlist: any[] = [];
            try {
                const { data: waitlistData, error: waitlistError } = await supabase
                    .from('project_waitlist')
                    .select('id, name, email, project_name, created_at')
                    .order('created_at', { ascending: false });
                if (!waitlistError && Array.isArray(waitlistData)) {
                    waitlist = waitlistData;
                } else if (waitlistError) {
                    console.warn('[AdminPortal] Waitlist entries note:', waitlistError.message);
                }
            } catch (wErr) {
                console.warn('[AdminPortal] project_waitlist source error:', wErr);
            }

            // Fetch portal profiles safely
            let portalProfiles: any[] = [];
            try {
                const { data: portalData, error: portalProfilesError } = await (supabase as any)
                    .from('portal_users')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!portalProfilesError && Array.isArray(portalData)) {
                    portalProfiles = portalData;
                } else if (portalProfilesError) {
                    console.warn('[AdminPortal] portal_users fetch note:', portalProfilesError.message);
                }
            } catch (pErr) {
                console.warn('[AdminPortal] portal_users source error:', pErr);
            }

            const userMap = new Map<string, any>();
            // Auth users are an enrichment source. If the Edge Function is
            // unavailable (for example during a deployment), keep showing
            // users from the tables above instead of failing the whole view.
            try {
                const { data: authResponse, error: authError } = await supabase.functions.invoke('admin-user-management', { body: { action: 'list' } });
                if (authError) throw authError;
                (authResponse?.users || []).forEach((u: any) => {
                    if (!u.email) return;
                    userMap.set(u.email.toLowerCase().trim(), {
                        ...u,
                        name: u.name || u.email.split('@')[0],
                        inquiry_type: 'Auth Sign-In',
                        status: 'Active',
                    });
                });
            } catch (authError) {
                console.warn('[AdminPortal] Auth users unavailable; continuing with database users.', authError);
            }

            // 1. Add persisted portal users (not the browser-only cache).
            (portalProfiles || []).forEach((u: any) => {
                if (!u.email) return;
                const emailKey = u.email.toLowerCase().trim();
                userMap.set(emailKey, {
                    id: u.auth_user_id || u.id,
                    name: u.name || u.email.split('@')[0],
                    email: u.email,
                    organization: u.organization || null,
                    designation: u.designation || null,
                    inquiry_type: 'Auth Sign-In',
                    status: 'Active',
                    role: u.role || (u.email === '23eg510a07@anurag.edu.in' ? 'partner' : 'client'),
                    quote: u.quote,
                    notes: u.notes,
                    lastLogin: null,
                    confirmed: u.confirmed,
                    created_at: u.created_at
                });
            });

            // 2. Add Contact Submissions
            (submissions || []).forEach((sub: any) => {
                if (!sub.email) return;
                const emailKey = sub.email.toLowerCase().trim();
                const existing = userMap.get(emailKey);
                if (existing) {
                    userMap.set(emailKey, {
                        ...existing,
                        name: sub.name || existing.name,
                        organization: sub.organization || existing.organization,
                        designation: sub.designation || existing.designation,
                        inquiry_type: sub.inquiry_type || existing.inquiry_type,
                        status: sub.status || existing.status
                    });
                } else {
                    userMap.set(emailKey, {
                        id: sub.id,
                        name: sub.name || sub.email.split('@')[0],
                        email: sub.email,
                        organization: sub.organization || null,
                        designation: sub.designation || null,
                        inquiry_type: sub.inquiry_type || 'Inquiry',
                        status: sub.status || 'Active',
                        role: sub.email === '23eg510a07@anurag.edu.in' ? 'partner' : 'client',
                        lastLogin: null,
                        confirmed: true,
                        created_at: sub.created_at
                    });
                }
            });

            // 3. Add Waitlist users
            (waitlist || []).forEach((w: any) => {
                if (!w.email) return;
                const emailKey = w.email.toLowerCase().trim();
                if (!userMap.has(emailKey)) {
                    userMap.set(emailKey, {
                        id: w.id,
                        name: w.name || w.email.split('@')[0],
                        email: w.email,
                        organization: w.project_name || null,
                        designation: 'Waitlist',
                        inquiry_type: 'Waitlist',
                        status: 'Active',
                        role: 'client',
                        lastLogin: null,
                        confirmed: true,
                        created_at: w.created_at
                    });
                }
            });

            // 4. Add Career Applications (Intern Registrations)
            try {
                const careerApps = await internshipService.getApplications();
                setRegisteredInternsCount(careerApps.length);
                (careerApps || []).forEach((c: any) => {
                    if (!c.email) return;
                    const emailKey = c.email.toLowerCase().trim();
                    if (!userMap.has(emailKey)) {
                        userMap.set(emailKey, {
                            id: c.id,
                            name: c.full_name || c.email.split('@')[0],
                            email: c.email,
                            organization: c.college || null,
                            designation: c.role || 'Intern Applicant',
                            inquiry_type: 'Career Registration',
                            status: c.status || 'Applied',
                            role: 'intern',
                            lastLogin: null,
                            confirmed: true,
                            created_at: c.created_at
                        });
                    }
                });
            } catch (careerErr) {
                console.warn('[AdminPortal] Career applications could not be merged into users list:', careerErr);
            }

            const merged = Array.from(userMap.values())
                .filter(u => u.role !== 'admin' && u.email?.toLowerCase() !== 'ssaivaraprasad51@gmail.com')
                .sort(
                    (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
                );

            setAllUsers(merged);
        } catch (err: any) {
            toast.error('Failed to load users: ' + (err.message || 'Unknown error'));
        } finally {
            setUsersLoading(false);
        }
    };

    // Document attachments states & helper
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);

    const parseAttachment = (text: string) => {
        if (text && text.startsWith('[ATTACHMENT:')) {
            const match = text.match(/^\[ATTACHMENT:([^|]+)\|([^\]]+)\](.*)/s);
            if (match) {
                return {
                    isAttachment: true,
                    fileName: match[1],
                    fileUrl: match[2],
                    additionalText: match[3] ? match[3].trim() : ''
                };
            }
        }
        return { isAttachment: false, fileName: '', fileUrl: '', additionalText: text };
    };

    const handleAttachmentSelect = (fileName: string, fileUrl: string) => {
        setChatInput(`[ATTACHMENT:${fileName}|${fileUrl}] Here is the requested document for your project.`);
        setAttachmentDropdownOpen(false);
        toast.success(`Attached template: ${fileName}`);
    };

    const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const mockUrl = `https://siddhidynamics.com/uploads/${encodeURIComponent(file.name)}`;
        setChatInput(`[ATTACHMENT:${file.name}|${mockUrl}] Shared file: ${file.name}`);
        setAttachmentDropdownOpen(false);
        toast.success(`Custom file attached: ${file.name}`);
    };

    // Metadata Parsing & Serialization (lifecycle compatible)
    const parseProjectMetadata = (bountyReward: string | null | undefined): ProjectLifecycleMeta => {
        return parseProjectMeta(bountyReward);
    };

    const serializeProjectMetadata = (deadline: string, websiteUrl: string, agreement: string) => {
        return serializeProjectMeta({
            deadline,
            website_url: websiteUrl,
            agreement
        });
    };

    // Edit Modal states
    const [editOpen, setEditOpen] = useState<Submission | null>(null);
    const [viewDetailsSub, setViewDetailsSub] = useState<Submission | null>(null);
    const [editStatus, setEditStatus] = useState("");
    const [editProgress, setEditProgress] = useState(0);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editOrg, setEditOrg] = useState("");
    const [editMsg, setEditMsg] = useState("");
    const [editDeadline, setEditDeadline] = useState("");
    const [editUrl, setEditUrl] = useState("");
    const [editDemoUrl, setEditDemoUrl] = useState("");
    const [editSeoReportUrl, setEditSeoReportUrl] = useState("");
    const [editGbpUrl, setEditGbpUrl] = useState("");
    const [editAgreement, setEditAgreement] = useState("");

    // Lifecycle Quote & Service Order Modal states
    const [quoteModalSub, setQuoteModalSub] = useState<Submission | null>(null);
    const [quoteAmount, setQuoteAmount] = useState("");
    const [quotePaymentStructure, setQuotePaymentStructure] = useState("50% Advance + 50% on Delivery");
    const [quoteAdvanceAmount, setQuoteAdvanceAmount] = useState("");
    const [quoteDeadline, setQuoteDeadline] = useState("");
    const [quoteScope, setQuoteScope] = useState("");
    const [quoteShareBanking, setQuoteShareBanking] = useState(true);
    const [quoteBankDetails, setQuoteBankDetails] = useState<BankingDetails>({ ...DEFAULT_BANKING_DETAILS });
    const [savingQuote, setSavingQuote] = useState(false);

    // Invoices management states
    const [addInvoiceSub, setAddInvoiceSub] = useState<Submission | null>(null);
    const [invoiceTitle, setInvoiceTitle] = useState("Milestone Payment");
    const [invoiceAmount, setInvoiceAmount] = useState("");
    const [invoiceDue, setInvoiceDue] = useState("");
    const [invoiceDesc, setInvoiceDesc] = useState("");
    const [savingInvoice, setSavingInvoice] = useState(false);

    // Project updates modal states
    const [postUpdateSub, setPostUpdateSub] = useState<Submission | null>(null);
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateDesc, setUpdateDesc] = useState("");
    const [updateVisible, setUpdateVisible] = useState(true);
    const [savingUpdate, setSavingUpdate] = useState(false);

    // Create Modal states
    const [createOpen, setCreateOpen] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createEmail, setCreateEmail] = useState("");
    const [createOrg, setCreateOrg] = useState("");
    const [createMsg, setCreateMsg] = useState("");
    const [createStatus, setCreateStatus] = useState("In Progress");
    const [createProgress, setCreateProgress] = useState(0);
    const [createDeadline, setCreateDeadline] = useState("");
    const [createUrl, setCreateUrl] = useState("");
    const [createAgreement, setCreateAgreement] = useState("");
    const [creatingSub, setCreatingSub] = useState(false);
    const [updatingSub, setUpdatingSub] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error("Please login to access the Admin HQ.");
                navigate("/auth");
                return;
            }

            const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "ssaivaraprasad51@gmail.com")
                .split(",").map(email => email.trim().toLowerCase()).filter(Boolean);
            const normalizedUserEmail = user.email?.trim().toLowerCase();
            const hasAdminRole = user.app_metadata?.role === 'admin';
            if (!normalizedUserEmail || (!adminEmails.includes(normalizedUserEmail) && !hasAdminRole)) {
                toast.error("Access Refused: You do not have administrative privileges.");
                navigate("/");
                return;
            }

            setAdminEmail(normalizedUserEmail);
            fetchSubmissions();
            fetchAllUsers();
            fetchCareerApplicationsCount();
        };

        checkAdmin();
    }, [navigate]);

    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchCareerApplicationsCount = async () => {
        try {
            const apps = await internshipService.getApplications();
            setRegisteredInternsCount(apps.length);
        } catch (e) {
            console.warn('[AdminPortal] Could not fetch career applications count', e);
        }
    };

    const fetchSubmissions = async () => {
        setLoading(true);
        setFetchError(null);

        try {
            const data = await supabaseService.getSubmissions(undefined, Date.now().toString());
            setSubmissions(data || []);
        } catch (error: any) {
            console.error("Fetch Failure:", error);
            setFetchError(error.message || "Unknown error");
            toast.error("Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    };

    const filteredSubmissions = submissions
        .filter(s => {
            if ((s.status || '').toLowerCase() === 'archived') return false;
            const matchesFilter = filter === "all" || s.inquiry_type === filter;
            const matchesSearch =
                (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.message || '').toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    const getInquiryIcon = (type: string) => {
        switch (type) {
            case "problem": return <Target className="w-5 h-5 text-red-400" />;
            case "requirement": return <ClipboardList className="w-5 h-5 text-blue-400" />;
            case "inquiry": return <HelpCircle className="w-5 h-5 text-yellow-400" />;
            case "investor": return <Handshake className="w-5 h-5 text-green-400" />;
            default: return <MessageSquare className="w-5 h-5 text-gray-400" />;
        }
    };

    const getInquiryLabel = (type: string) => {
        switch (type) {
            case "problem": return "Real-World Problem";
            case "requirement": return "Client Project";
            case "inquiry": return "General Inquiry";
            case "investor": return "Investors & Supporters";
            default: return type;
        }
    };

    const openChat = async (sub: Submission) => {
        setChatOpen(sub);
        setChatLoading(true);
        try {
            const { data, error } = await (supabase as any)
                .from('chat_messages')
                .select('*')
                .eq('submission_id', sub.id)
                .order('created_at', { ascending: true });
            if (error) throw error;
            setChatMessages(data || []);
        } catch {
            toast.error("Could not load chat. Make sure the chat_messages table exists in Supabase.");
        } finally {
            setChatLoading(false);
        }
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim() || !chatOpen) return;
        setSendingMsg(true);
        try {
            const { data, error } = await (supabase as any)
                .from('chat_messages')
                .insert([{
                    submission_id: chatOpen.id,
                    sender_email: adminEmail,
                    message: chatInput.trim(),
                    is_admin: true
                }])
                .select();
            if (error) throw error;
            setChatMessages(prev => [...prev, ...(data || [])]);
            setChatInput("");
        } catch {
            toast.error("Failed to send message.");
        } finally {
            setSendingMsg(false);
        }
    };

    const openEdit = (sub: Submission) => {
        setEditOpen(sub);
        setEditStatus(sub.status || "Analyzing");
        setEditProgress(sub.progress || 0);
        setEditName(sub.name || "");
        setEditEmail(sub.email || "");
        setEditOrg(sub.organization || "");
        setEditMsg(sub.message || "");
        
        const meta = parseProjectMetadata(sub.bounty_reward);
        setEditDeadline(meta.deadline || "");
        setEditUrl(meta.website_url || "");
        setEditDemoUrl(meta.demo_url || "");
        setEditSeoReportUrl(meta.seo_report_url || "");
        setEditGbpUrl(meta.gbp_url || "");
        setEditAgreement(meta.agreement || "");
    };

    const handleUpdateSubmission = async () => {
        if (!editOpen) return;
        setUpdatingSub(true);
        try {
            const currentMeta = parseProjectMeta(editOpen.bounty_reward);
            const bountyStr = serializeProjectMeta({
                ...currentMeta,
                deadline: editDeadline,
                website_url: editUrl,
                demo_url: editDemoUrl,
                seo_report_url: editSeoReportUrl,
                gbp_url: editGbpUrl,
                agreement: editAgreement,
            });
            await supabaseService.updateSubmission(editOpen.id, {
                name: editName,
                email: editEmail,
                organization: editOrg,
                message: editMsg,
                status: editStatus,
                progress: editProgress,
                bounty_reward: bountyStr
            });
            toast.success("Project updated successfully");

            // Automated email triggers based on status
            if (editStatus === 'Completed' && editOpen.status !== 'Completed') {
                emailService.projectComplete(editEmail, editName, editOrg || 'Client Project');
            } else if ((editStatus === 'In Progress' || editStatus === 'Analysing') && editOpen.status === 'New') {
                emailService.projectStart(editEmail, editName, editOrg || 'Client Project', editDeadline || 'Per Roadmap');
            } else {
                emailService.statusUpdate(editEmail, editName, editOrg || 'Client Project', editStatus, editProgress);
            }

            setEditOpen(null);
            fetchSubmissions();
        } catch (error: any) {
            toast.error(`Update failed: ${error.message}`);
        } finally {
            setUpdatingSub(false);
        }
    };

    // Lifecycle Action Handlers
    const openQuoteModal = (sub: Submission) => {
        setQuoteModalSub(sub);
        const meta = parseProjectMeta(sub.bounty_reward);
        const parsed = parseSubmissionMessage(sub.message);
        setQuoteAmount(meta.agreement || "");
        setQuotePaymentStructure(meta.payment_structure || "50% Advance + 50% on Delivery");

        const rawNum = parseInt((meta.agreement || "").replace(/\D/g, '') || '0');
        const defaultAdv = rawNum > 0 ? `₹${Math.round(rawNum * 0.5).toLocaleString('en-IN')}` : "";
        setQuoteAdvanceAmount(meta.advance_amount || defaultAdv);

        setQuoteDeadline(meta.deadline || parsed.requestedStartDate || "");
        setQuoteScope(meta.scope_summary || (parsed.selectedServices.length > 0 ? `Services: ${parsed.selectedServices.join(", ")}` : "Services: 🚀 SEO, GEO & AEO Programme, 🌐 Website / Portal Development"));
        const incomingBank = meta.banking_details || { ...DEFAULT_BANKING_DETAILS };
        const initialAccounts: BankAccount[] = (incomingBank.accounts && incomingBank.accounts.length > 0)
            ? incomingBank.accounts
            : DEFAULT_BANK_ACCOUNTS;
        setQuoteShareBanking(incomingBank.share_banking_details ?? true);
        setQuoteBankDetails({
            ...incomingBank,
            accounts: initialAccounts,
            online_payment_enabled: incomingBank.online_payment_enabled ?? true
        });
    };

    const updateAccountField = (idx: number, field: keyof BankAccount, val: any) => {
        const currentAccounts = quoteBankDetails.accounts && quoteBankDetails.accounts.length > 0
            ? [...quoteBankDetails.accounts]
            : [...DEFAULT_BANK_ACCOUNTS];
        currentAccounts[idx] = { ...currentAccounts[idx], [field]: val };
        setQuoteBankDetails({ ...quoteBankDetails, accounts: currentAccounts });
    };

    const handleSaveQuote = async () => {
        if (!quoteModalSub) return;
        if (!quoteAmount.trim()) {
            toast.error("Please specify an assigned amount / price quote.");
            return;
        }
        setSavingQuote(true);
        try {
            const currentMeta = parseProjectMeta(quoteModalSub.bounty_reward);
            const advanceNum = parseInt(quoteAdvanceAmount.replace(/\D/g, '') || quoteAmount.replace(/\D/g, '') || '0');

            let existingInvoices = currentMeta.invoices || [];
            let updatedInvoices = [...existingInvoices];
            const hasAdvanceInv = updatedInvoices.some(inv => inv.title.toLowerCase().includes("advance"));
            if (!hasAdvanceInv) {
                const advId = generateInvoiceId(updatedInvoices);
                updatedInvoices.unshift({
                    id: advId,
                    title: `Advance Payment (${quotePaymentStructure.includes('100%') ? '100%' : '50%'})`,
                    amount: quoteAdvanceAmount || quoteAmount,
                    numeric_amount: advanceNum,
                    due_date: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    description: `Advance payment for ${quoteModalSub.organization || quoteModalSub.name} project services.`
                });
            }

            const activeAcc = quoteBankDetails.accounts?.find(a => a.is_selected) || quoteBankDetails.accounts?.[0];
            const updatedMeta: ProjectLifecycleMeta = {
                ...currentMeta,
                agreement: quoteAmount,
                payment_structure: quotePaymentStructure,
                advance_amount: quoteAdvanceAmount || quoteAmount,
                deadline: quoteDeadline,
                scope_summary: quoteScope,
                banking_details: {
                    ...quoteBankDetails,
                    account_holder: activeAcc?.account_holder || quoteBankDetails.account_holder,
                    bank_name: activeAcc?.bank_name || quoteBankDetails.bank_name,
                    account_number: activeAcc?.account_number || quoteBankDetails.account_number,
                    ifsc_code: activeAcc?.ifsc_code || quoteBankDetails.ifsc_code,
                    share_banking_details: quoteShareBanking
                },
                invoices: updatedInvoices
            };

            const newStatus = "Quote Sent (Pending Client Approval)";
            await supabaseService.updateSubmission(quoteModalSub.id, {
                status: newStatus,
                bounty_reward: serializeProjectMeta(updatedMeta)
            });

            toast.success("Quote & Service Order configured! Advance invoice generated.");
            setQuoteModalSub(null);
            if (viewDetailsSub?.id === quoteModalSub.id) {
                setViewDetailsSub(prev => prev ? { ...prev, status: newStatus, bounty_reward: serializeProjectMeta(updatedMeta) } : null);
            }
            fetchSubmissions();
        } catch (err: any) {
            toast.error("Failed to save quote: " + (err.message || "Unknown error"));
        } finally {
            setSavingQuote(false);
        }
    };

    const handleAcceptAndStartProject = async (sub: Submission) => {
        try {
            const currentMeta = parseProjectMeta(sub.bounty_reward);
            const startDate = new Date().toISOString().split('T')[0];
            const updatedMeta: ProjectLifecycleMeta = {
                ...currentMeta,
                service_start_date: currentMeta.service_start_date || startDate
            };
            const newStatus = "Quote Accepted (Project Started)";
            await supabaseService.updateSubmission(sub.id, {
                status: newStatus,
                progress: Math.max(sub.progress || 0, 25),
                bounty_reward: serializeProjectMeta(updatedMeta)
            });
            toast.success("Project accepted! Status updated to Project Started (25%).");
            if (viewDetailsSub?.id === sub.id) {
                setViewDetailsSub(prev => prev ? { ...prev, status: newStatus, progress: Math.max(sub.progress || 0, 25), bounty_reward: serializeProjectMeta(updatedMeta) } : null);
            }
            fetchSubmissions();
        } catch (err: any) {
            toast.error("Failed to accept project: " + err.message);
        }
    };

    const openAddInvoice = (sub: Submission) => {
        setAddInvoiceSub(sub);
        const meta = parseProjectMeta(sub.bounty_reward);
        setInvoiceTitle(`Milestone ${(meta.invoices?.length || 0) + 1}`);
        setInvoiceAmount("");
        setInvoiceDue(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
        setInvoiceDesc("");
    };

    const handleAddInvoice = async () => {
        if (!addInvoiceSub) return;
        if (!invoiceAmount.trim()) {
            toast.error("Invoice amount is required.");
            return;
        }
        setSavingInvoice(true);
        try {
            const currentMeta = parseProjectMeta(addInvoiceSub.bounty_reward);
            const existingInvoices = currentMeta.invoices || [];
            const newInvId = generateInvoiceId(existingInvoices);
            const numeric = parseInt(invoiceAmount.replace(/\D/g, '') || '0');
            const newInvoice: ProjectInvoice = {
                id: newInvId,
                title: invoiceTitle.trim() || `Invoice ${newInvId}`,
                amount: invoiceAmount.trim(),
                numeric_amount: numeric,
                due_date: invoiceDue || new Date().toISOString().split('T')[0],
                status: "pending",
                description: invoiceDesc.trim() || `Service milestone invoice for ${addInvoiceSub.name}`
            };
            const updatedInvoices = [...existingInvoices, newInvoice];
            const updatedMeta: ProjectLifecycleMeta = {
                ...currentMeta,
                invoices: updatedInvoices
            };
            await supabaseService.updateSubmission(addInvoiceSub.id, {
                bounty_reward: serializeProjectMeta(updatedMeta)
            });
            toast.success(`Invoice ${newInvId} added successfully.`);
            setAddInvoiceSub(null);
            if (viewDetailsSub?.id === addInvoiceSub.id) {
                setViewDetailsSub(prev => prev ? { ...prev, bounty_reward: serializeProjectMeta(updatedMeta) } : null);
            }
            fetchSubmissions();
        } catch (err: any) {
            toast.error("Failed to add invoice: " + err.message);
        } finally {
            setSavingInvoice(false);
        }
    };

    const handleMarkInvoicePaid = async (sub: Submission, invoiceId: string) => {
        try {
            const currentMeta = parseProjectMeta(sub.bounty_reward);
            const existingInvoices = currentMeta.invoices || [];
            const nowStr = new Date().toISOString();
            let isAdvance = false;
            const updatedInvoices = existingInvoices.map(inv => {
                if (inv.id === invoiceId) {
                    if (inv.title.toLowerCase().includes("advance") || inv.id === existingInvoices[0]?.id) {
                        isAdvance = true;
                    }
                    return { ...inv, status: "paid" as const, paid_at: nowStr };
                }
                return inv;
            });
            const startDate = currentMeta.service_start_date || (isAdvance ? nowStr.split('T')[0] : undefined);
            const updatedMeta: ProjectLifecycleMeta = {
                ...currentMeta,
                service_start_date: startDate,
                invoices: updatedInvoices
            };
            const updates: any = {
                bounty_reward: serializeProjectMeta(updatedMeta)
            };
            if (isAdvance && (!sub.status || sub.status.toLowerCase().includes('quote'))) {
                updates.status = "In Progress (Service Started)";
                updates.progress = Math.max(sub.progress || 0, 25);
            }
            await supabaseService.updateSubmission(sub.id, updates);
            toast.success(`Invoice ${invoiceId} marked as PAID. Status and banking details unlocked.`);
            if (viewDetailsSub?.id === sub.id) {
                setViewDetailsSub(prev => prev ? { ...prev, ...updates } : null);
            }
            fetchSubmissions();
        } catch (err: any) {
            toast.error("Failed to mark invoice paid: " + err.message);
        }
    };

    const openPostUpdate = (sub: Submission) => {
        setPostUpdateSub(sub);
        setUpdateTitle("");
        setUpdateDesc("");
        setUpdateVisible(true);
    };

    const handlePostUpdate = async () => {
        if (!postUpdateSub) return;
        if (!updateTitle.trim() || !updateDesc.trim()) {
            toast.error("Update title and description are required.");
            return;
        }
        setSavingUpdate(true);
        try {
            const currentMeta = parseProjectMeta(postUpdateSub.bounty_reward);
            const newUpd: ProjectUpdate = {
                id: `upd_${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                title: updateTitle.trim(),
                description: updateDesc.trim(),
                visible_to_client: updateVisible
            };
            const updatedUpdates = [newUpd, ...(currentMeta.updates || [])];
            const updatedMeta: ProjectLifecycleMeta = {
                ...currentMeta,
                updates: updatedUpdates
            };
            await supabaseService.updateSubmission(postUpdateSub.id, {
                bounty_reward: serializeProjectMeta(updatedMeta)
            });
            toast.success("Project update posted successfully.");
            setPostUpdateSub(null);
            if (viewDetailsSub?.id === postUpdateSub.id) {
                setViewDetailsSub(prev => prev ? { ...prev, bounty_reward: serializeProjectMeta(updatedMeta) } : null);
            }
            fetchSubmissions();
        } catch (err: any) {
            toast.error("Failed to post update: " + err.message);
        } finally {
            setSavingUpdate(false);
        }
    };

    const handleCreateSubmission = async () => {
        if (!createName.trim() || !createEmail.trim()) {
            toast.error("Name and Email are required.");
            return;
        }
        setCreatingSub(true);
        try {
            const bountyStr = serializeProjectMetadata(createDeadline, createUrl, createAgreement);
            await supabaseService.submitContactForm({
                name: createName.trim(),
                email: createEmail.trim().toLowerCase(),
                designation: "Client Representative",
                organization: createOrg.trim(),
                inquiry_type: "requirement",
                message: createMsg.trim() || "Client project requirements created by admin.",
                status: createStatus,
                progress: createProgress,
                bounty_reward: bountyStr
            });
            toast.success("Client project created successfully");

            // Automated email welcome & kickoff
            emailService.projectStart(
                createEmail.trim().toLowerCase(),
                createName.trim(),
                createOrg.trim() || "New Project",
                createDeadline || "As per agreed roadmap"
            );

            setCreateOpen(false);
            setCreateName("");
            setCreateEmail("");
            setCreateOrg("");
            setCreateMsg("");
            setCreateStatus("In Progress");
            setCreateProgress(0);
            setCreateDeadline("");
            setCreateUrl("");
            setCreateAgreement("");
            fetchSubmissions();
        } catch (error: any) {
            toast.error(`Creation failed: ${error.message}`);
        } finally {
            setCreatingSub(false);
        }
    };

    const handleDeleteSubmission = async (id: string) => {
        if (!window.confirm("Archive this project/submission? It will be hidden from active Admin Portal views and can be restored from the database.")) return;
        try {
            const { error } = await supabase
                .from('contact_submissions')
                .update({ status: 'Archived', is_public: false })
                .eq('id', id);
            if (error) throw error;
            toast.success("Project archived successfully");
            fetchSubmissions();
        } catch (error: any) {
            toast.error(`Delete failed: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />
            <Helmet>
                <title>Nexus Admin HQ | Siddhi Dynamics</title>
                <meta name="description" content="Administrative control center for Siddhi Dynamics. Monitor deep-tech innovations and manage project inquiries." />
            </Helmet>

            <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
                <button
                    onClick={() => navigate('/portal')}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group cursor-pointer text-left"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Back</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="text-left">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold gradient-text glow-text mb-2"
                        >
                            Nexus Admin HQ
                        </motion.h1>
                        <p className="text-muted-foreground">Monitoring deep-tech innovations and inquiries.</p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <button
                            onClick={() => setViewMode('submissions')}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                                viewMode === 'submissions'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-muted border border-border hover:bg-muted/80 text-foreground'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            <span>Submissions</span>
                            {submissions.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-inherit">
                                    {submissions.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setViewMode('verifications')}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                                viewMode === 'verifications'
                                    ? 'bg-emerald-500 text-stone-950 font-bold shadow-lg shadow-emerald-500/20'
                                    : 'bg-muted border border-border hover:bg-muted/80 text-foreground'
                            }`}
                        >
                            <CreditCard className="w-4 h-4 text-emerald-400" />
                            <span>Payment Verifications</span>
                            {pendingVerifications.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-stone-950 animate-pulse">
                                    {pendingVerifications.length} Pending
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setViewMode('clients')}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                                viewMode === 'clients'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-muted border border-border hover:bg-muted/80 text-foreground'
                            }`}
                        >
                            <Building2 className="w-4 h-4" /> Clients & Requirements
                        </button>
                        <button
                            onClick={() => { setViewMode('agency'); fetchAgencyClients(); refreshAgencyData(); }}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                                viewMode === 'agency'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-muted border border-border hover:bg-muted/80 text-foreground'
                            }`}
                        >
                            <Handshake className="w-4 h-4" />
                            <span>Agency & Commissions</span>
                        </button>
                        <button
                            onClick={() => { setViewMode('users'); fetchAllUsers(); refreshRoleRequests(); }}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                                viewMode === 'users'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-muted border border-border hover:bg-muted/80 text-foreground'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            <span>Users & Role Approvals</span>
                            {roleRequests.filter(r => r.status === 'pending').length > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-stone-950 animate-pulse">
                                    {roleRequests.filter(r => r.status === 'pending').length} Action
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setViewMode('internships')}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                                viewMode === 'internships'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'bg-muted border border-border hover:bg-muted/80 text-foreground'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span>Internships & Whitelist</span>
                            {registeredInternsCount > 0 && (
                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400">
                                    {registeredInternsCount}
                                </span>
                            )}
                        </button>

                        {(viewMode === 'submissions' || viewMode === 'agency') && (
                            <button
                                onClick={viewMode === 'agency' ? fetchAgencyClients : fetchSubmissions}
                                className="p-3 rounded-xl glass-card hover:bg-muted/50 transition-colors group"
                                title="Refresh Data"
                            >
                                <RefreshCw className={`w-5 h-5 ${(loading || agencyClientsLoading) ? 'animate-spin' : ''}`} />
                            </button>
                        )}
                    </div>
                </div>



                {/* Error Banner */}
                {fetchError && (
                    <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3">
                        <div className="shrink-0 mt-0.5">⚠️</div>
                        <div className="flex-1">
                            <p className="font-semibold text-red-300 mb-1">Data Fetch Failed</p>
                            <pre className="text-xs whitespace-pre-wrap text-red-400/80 font-mono">{fetchError}</pre>
                        </div>
                        <button
                            onClick={() => setFetchError(null)}
                            className="shrink-0 text-red-400 hover:text-red-200 transition-colors text-lg leading-none"
                        >×</button>
                    </div>
                )}

                {viewMode === 'submissions' ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
                    {[
                        { label: "Total Submissions", value: submissions.length, icon: <FileText className="w-6 h-6 text-primary" />, desc: "Inquiries & Leads" },
                        { label: "Registered Users", value: allUsers.length, icon: <Users className="w-6 h-6 text-emerald-400" />, desc: "Active Accounts" },
                        { label: "Intern Registered", value: registeredInternsCount, icon: <GraduationCap className="w-6 h-6 text-rose-400" />, desc: "Career Applicants" },
                        { label: "Client Projects", value: submissions.filter(s => s.inquiry_type === "requirement").length, icon: <ClipboardList className="w-6 h-6 text-blue-400" />, desc: "Scoped Work" },
                        { label: "Problems", value: submissions.filter(s => s.inquiry_type === "problem").length, icon: <Target className="w-6 h-6 text-amber-400" />, desc: "Troubleshoot" },
                        { label: "Investors", value: submissions.filter(s => s.inquiry_type === "investor").length, icon: <Handshake className="w-6 h-6 text-purple-400" />, desc: "Capital Partners" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-5 electric-border flex items-center justify-between"
                        >
                            <div className="text-left">
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{stat.label}</p>
                                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</h3>
                                {stat.desc && <span className="text-[10px] text-muted-foreground/70">{stat.desc}</span>}
                            </div>
                            <div className="p-2.5 rounded-xl bg-muted/80 shrink-0">
                                {stat.icon}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-card border border-border text-foreground rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                        <div className="relative group min-w-[140px]">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                className="w-full appearance-none bg-card border border-border text-foreground text-sm rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-muted"
                            >
                                <option value="newest" className="bg-popover text-popover-foreground">Sort: Newest</option>
                                <option value="oldest" className="bg-popover text-popover-foreground">Sort: Oldest</option>
                            </select>
                            <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
                        </div>
                        {[
                            { id: "all", label: "All types", icon: <Filter className="w-4 h-4" /> },
                            { id: "problem", label: "Problems", icon: <Target className="w-4 h-4" /> },
                            { id: "requirement", label: "Client Projects", icon: <ClipboardList className="w-4 h-4" /> },
                            { id: "inquiry", label: "Inquiries", icon: <HelpCircle className="w-4 h-4" /> },
                            { id: "investor", label: "Investors", icon: <Handshake className="w-4 h-4" /> },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === t.id
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border"
                                    }`}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filter === "requirement" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-6 glass-card border border-primary/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-left"
                    >
                        <div>
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary" />
                                Managed Client Projects
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Manage project descriptions, client credentials, SLAs, deadlines, and project URLs.</p>
                        </div>
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                            + Add Client Project
                        </button>
                    </motion.div>
                )}

                {/* Submissions List */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <RefreshCw className="w-10 h-10 animate-spin mb-4 text-primary" />
                                <p>Establishing link to deep-tech database...</p>
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-white/10">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-medium mb-2">No submissions found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            filteredSubmissions.map((sub, i) => (
                                <motion.div
                                    key={sub.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="glass-card overflow-hidden electric-border group hover:border-primary/50 transition-colors"
                                >
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                        {getInquiryIcon(sub.inquiry_type)}
                                                        {getInquiryLabel(sub.inquiry_type)}
                                                    </span>
                                                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {format(new Date(sub.created_at || ""), "MMM dd, yyyy • HH:mm")}
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-left">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{sub.name}</h3>
                                                        {sub.status && (
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${sub.status === 'Analyzing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                                                sub.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                                    'bg-green-500/10 text-green-500 border border-green-500/20'
                                                                }`}>
                                                                {sub.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
                                                        <a href={`mailto:${sub.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                                            <Mail className="w-4 h-4" />
                                                            {sub.email}
                                                        </a>
                                                        {sub.designation && (
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase className="w-4 h-4" />
                                                                {sub.designation}
                                                            </div>
                                                        )}
                                                        {sub.organization && (
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="w-4 h-4" />
                                                                {sub.organization}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {sub.progress !== undefined && (
                                                    <div className="space-y-3 py-2 text-left">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Development Phase</span>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                                                                PHASE {Math.ceil((sub.progress || 0) / 20) || 1}
                                                            </span>
                                                        </div>
                                                        <div className="relative h-6 flex items-center">
                                                            <div className="absolute left-0 right-0 h-[1px] bg-white/5 z-0" />
                                                            <div className="flex justify-between w-full relative z-10">
                                                                {[1, 2, 3, 4, 5].map((p) => {
                                                                    const isActive = p <= (sub.progress || 0) / 20;
                                                                    const isCurrent = p === Math.ceil((sub.progress || 0) / 20);
                                                                    return (
                                                                        <div key={p} className="flex flex-col items-center">
                                                                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-white/10'
                                                                                } ${isCurrent ? 'scale-125' : ''}`} />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${sub.progress}%` }}
                                                                className="absolute left-0 h-[1px] bg-primary/50 z-0"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="bg-muted/40 rounded-2xl p-6 border border-border group-hover:bg-muted/60 transition-colors relative text-left">
                                                    {(() => {
                                                        const meta = parseProjectMetadata(sub.bounty_reward);
                                                        const parsedMsg = parseSubmissionMessage(sub.message);
                                                        return (
                                                            <div className="space-y-4">
                                                                <div className="flex flex-wrap gap-2 text-xs font-semibold mb-2 border-b border-border pb-3 items-center">
                                                                    {meta.agreement && (
                                                                        <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl flex items-center gap-1.5 font-bold">
                                                                            <Landmark className="w-3.5 h-3.5" /> Quote: {meta.agreement}
                                                                        </span>
                                                                    )}
                                                                    {meta.deadline && (
                                                                        <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                                                            <Calendar className="w-3.5 h-3.5" /> Due: {meta.deadline}
                                                                        </span>
                                                                    )}
                                                                    {parsedMsg.requestedStartDate && (
                                                                        <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                                                            <Clock className="w-3.5 h-3.5" /> Desired Start: {parsedMsg.requestedStartDate}
                                                                        </span>
                                                                    )}
                                                                    {parsedMsg.budgetPreference && (
                                                                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-xl">
                                                                            Budget: {parsedMsg.budgetPreference}
                                                                        </span>
                                                                    )}
                                                                    {meta.demo_url && (
                                                                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-xl truncate max-w-xs flex items-center gap-1">
                                                                            <Laptop className="w-3 h-3 text-cyan-400" /> Demo: <a href={meta.demo_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-cyan-300 font-semibold">{meta.demo_url}</a>
                                                                        </span>
                                                                    )}
                                                                    {meta.website_url && (
                                                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-xl truncate max-w-xs flex items-center gap-1">
                                                                            <Globe className="w-3 h-3 text-emerald-400" /> Live: <a href={meta.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-emerald-300 font-semibold">{meta.website_url}</a>
                                                                        </span>
                                                                    )}
                                                                    {meta.seo_report_url && (
                                                                        <span className="bg-lime-500/10 text-lime-400 border border-lime-500/20 px-2.5 py-1 rounded-xl truncate max-w-xs flex items-center gap-1">
                                                                            <TrendingUp className="w-3 h-3 text-lime-400" /> SEO Report: <a href={meta.seo_report_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-lime-300 font-semibold">Open Report</a>
                                                                        </span>
                                                                    )}
                                                                    {meta.gbp_url && (
                                                                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl truncate max-w-xs flex items-center gap-1">
                                                                            <MapPin className="w-3 h-3 text-amber-400" /> GBP: <a href={meta.gbp_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-amber-300 font-semibold">Google Maps</a>
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Structured Service Chips */}
                                                                {parsedMsg.selectedServices.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {parsedMsg.selectedServices.map((srv, idx) => (
                                                                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
                                                                                {srv}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap relative z-10 text-sm">
                                                                    {parsedMsg.cleanMessage}
                                                                </p>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>

                                            <div className="shrink-0 flex md:flex-col gap-2.5">
                                                 <button
                                                     onClick={() => setViewDetailsSub(sub)}
                                                     className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-semibold flex items-center gap-2 transition-all text-xs"
                                                 >
                                                     <ClipboardList className="w-3.5 h-3.5" />
                                                     View Details
                                                 </button>
                                                 <button
                                                     onClick={() => openQuoteModal(sub)}
                                                     className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 font-bold flex items-center gap-2 transition-all text-xs"
                                                 >
                                                     <Landmark className="w-3.5 h-3.5" />
                                                     Accept & Quote
                                                 </button>
                                                 <button
                                                     onClick={() => openChat(sub)}
                                                     className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:scale-105 transition-transform text-xs"
                                                 >
                                                     <MessageCircle className="w-3.5 h-3.5" />
                                                     Chat
                                                 </button>
                                                 <button
                                                     onClick={() => openEdit(sub)}
                                                     className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 font-semibold flex items-center gap-2 transition-all text-xs border border-border"
                                                 >
                                                     <Edit3 className="w-3.5 h-3.5" />
                                                     Edit
                                                 </button>
                                                 <button
                                                     onClick={() => window.open(`mailto:${sub.email}?subject=Regarding your ${getInquiryLabel(sub.inquiry_type)} on Siddhi Dynamics`)}
                                                     className="px-5 py-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 font-semibold flex items-center gap-2 transition-all text-sm border border-border"
                                                 >
                                                     <Mail className="w-4 h-4" />
                                                     Gmail
                                                 </button>
                                                 <button
                                                     onClick={() => handleDeleteSubmission(sub.id)}
                                                     className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 font-semibold flex items-center gap-2 transition-all text-sm border border-red-500/20"
                                                 >
                                                     Delete
                                                 </button>
                                             </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
                    </>
                ) : viewMode === 'verifications' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                                    <QrCode className="w-6 h-6 text-emerald-400" /> Payment Verifications & Direct Bank Deposits
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Review and verify direct UPI QR payments (<span className="text-foreground font-semibold">6303602743@sbi</span>) and SBI bank wire deposits submitted by clients. Once verified, milestone deliverables unlock and invoices update to 'Paid'.
                                </p>
                            </div>
                            <button onClick={fetchSubmissions} className="p-3 rounded-xl glass-card hover:bg-muted/50 transition-colors self-start md:self-auto flex items-center gap-2 text-xs font-semibold" title="Refresh">
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
                                <span>Refresh Deposits</span>
                            </button>
                        </div>

                        {/* Info Banner */}
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-bold text-emerald-300">Direct Payment Gateway Bypass:</span> Clients pay directly to Siddhi Dynamics SBI Current A/C (45170121323) or UPI QR code. No third-party gateway deductions.
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                    {pendingVerifications.length} Awaiting Verification
                                </span>
                            </div>
                        </div>

                        {/* Verification Cards */}
                        {pendingVerifications.length === 0 ? (
                            <div className="glass-card rounded-2xl border border-dashed border-border p-16 text-center">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                                <h3 className="text-lg font-extrabold text-foreground mb-2">No Pending Payment Verifications</h3>
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    All client UPI deposits and bank transfers have been reviewed and verified. When a client submits a payment UTR, it will appear here instantly for admin approval.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {pendingVerifications.map(({ submission, invoice, meta }) => (
                                    <motion.div
                                        key={`${submission.id}-${invoice.id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-card rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-500/50 transition-all space-y-4"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-3">
                                            <div>
                                                <div className="flex items-center gap-2.5 flex-wrap">
                                                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
                                                        {invoice.id}
                                                    </span>
                                                    <h4 className="font-extrabold text-base text-foreground">{invoice.title}</h4>
                                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold text-[11px] border border-amber-500/30 animate-pulse">
                                                        Pending Admin Verification
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Client: <span className="text-foreground font-semibold">{submission.organization || submission.name}</span> ({submission.email})
                                                    {submission.phone && <span className="ml-2 font-mono text-[11px]">📞 {submission.phone}</span>}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-xs text-muted-foreground block">Invoice Amount</span>
                                                <span className="text-xl font-black text-emerald-400 tracking-tight">{invoice.amount}</span>
                                            </div>
                                        </div>

                                        {/* Payment Proof Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-muted/40 p-4 rounded-xl border border-border/70 text-xs">
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Bank UTR / Ref No</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="font-mono font-extrabold text-foreground text-sm select-all">
                                                        {invoice.transaction_id || 'Not provided'}
                                                    </span>
                                                    {invoice.transaction_id && (
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(invoice.transaction_id!);
                                                                toast.success("UTR copied to clipboard!");
                                                            }}
                                                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                                            title="Copy UTR"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Payment Channel</span>
                                                <span className="font-bold text-foreground capitalize mt-0.5 block">
                                                    {invoice.payment_mode ? invoice.payment_mode.replace('_', ' ') : 'UPI / Bank Transfer'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Depositor Name</span>
                                                <span className="font-bold text-foreground mt-0.5 block">
                                                    {invoice.paid_by_name || submission.name}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Submission Date</span>
                                                <span className="font-mono text-muted-foreground mt-0.5 block">
                                                    {invoice.submitted_at ? new Date(invoice.submitted_at).toLocaleString('en-IN') : 'Recently'}
                                                </span>
                                            </div>
                                        </div>

                                        {invoice.description && (
                                            <p className="text-xs text-muted-foreground italic">
                                                "{invoice.description}"
                                            </p>
                                        )}

                                        {/* Action buttons */}
                                        <div className="flex items-center justify-end gap-3 pt-2 flex-wrap">
                                            <button
                                                onClick={() => handleViewClientInvoice(submission, invoice)}
                                                className="px-4 py-2 rounded-xl bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-bold flex items-center gap-1.5 text-xs transition-colors"
                                                title="Preview legally valid digital invoice"
                                            >
                                                <Printer className="w-3.5 h-3.5" />
                                                View Digital Invoice
                                            </button>
                                            <button
                                                onClick={() => openChat(submission)}
                                                className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 font-semibold flex items-center gap-1.5 text-xs border border-border"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                Chat with Client
                                            </button>
                                            <button
                                                onClick={() => handleVerifyPayment(submission.id, invoice.id, 'rejected')}
                                                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 font-bold flex items-center gap-1.5 text-xs transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                                Reject / Ask Resubmission
                                            </button>
                                            <button
                                                onClick={() => handleVerifyPayment(submission.id, invoice.id, 'verified')}
                                                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center gap-2 text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Verify & Mark Received
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : viewMode === 'clients' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                        {/* Sub-tab Navigation */}
                        <div className="flex items-center gap-2 border-b border-border pb-3">
                            <button
                                onClick={() => setClientSubTab('invoices')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    clientSubTab === 'invoices'
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'glass-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Receipt className="w-4 h-4" /> Client Invoices & Inflow Ledger
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                                    {allClientInvoices.length} Invoices
                                </span>
                            </button>
                            <button
                                onClick={() => setClientSubTab('board')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    clientSubTab === 'board'
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'glass-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <ClipboardList className="w-4 h-4" /> Requirements & Intake Board
                            </button>
                        </div>

                        {clientSubTab === 'invoices' ? (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                                            <Receipt className="w-6 h-6 text-primary" /> Client Invoices & Payment Inflow Ledger
                                        </h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Self-authenticating digital invoices generated for client milestones. Direct gateway bypass to Siddhi Dynamics SBI Current A/C (45170121323) with Section 65B IT Act 2000 digital verification.
                                        </p>
                                    </div>
                                    <button
                                        onClick={fetchSubmissions}
                                        className="px-4 py-2 rounded-xl glass-card hover:bg-muted/50 text-foreground font-bold text-xs flex items-center gap-2 border border-border self-start sm:self-auto"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} /> Refresh Invoices
                                    </button>
                                </div>

                                {/* Summary KPIs */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="glass-card p-4 rounded-xl border border-border">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Total Invoices</span>
                                        <span className="text-2xl font-black text-foreground mt-1 block">{allClientInvoices.length}</span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                                        <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Confirmed Inflows (Paid)</span>
                                        <span className="text-2xl font-black text-emerald-400 mt-1 block">
                                            ₹{clientInflowsSummary.totalReceived.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                                        <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Pending Verification</span>
                                        <span className="text-2xl font-black text-amber-400 mt-1 block">
                                            ₹{clientInflowsSummary.totalPending.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl border border-primary/30 bg-primary/5">
                                        <span className="text-[10px] text-primary uppercase font-bold tracking-wider block">Total Billed Volume</span>
                                        <span className="text-2xl font-black text-primary mt-1 block">
                                            ₹{clientInflowsSummary.totalBilled.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Direct Banking Reference Banner */}
                                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Landmark className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-foreground">Official Corporate Inflow Account: </span>
                                            <span className="text-muted-foreground">SBI Current A/C </span>
                                            <span className="font-mono font-bold text-foreground">45170121323</span>
                                            <span className="text-muted-foreground"> · IFSC: </span>
                                            <span className="font-mono font-bold text-foreground">SBIN0021632</span>
                                            <span className="text-muted-foreground"> · UPI: </span>
                                            <span className="font-mono font-bold text-emerald-400">6303602743@sbi</span>
                                            <span className="text-muted-foreground ml-2">(LLPIN: ACX-6222)</span>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                        Zero Gateway Intermediary Fee
                                    </div>
                                </div>

                                {/* Invoices Table */}
                                {allClientInvoices.length === 0 ? (
                                    <div className="glass-card rounded-2xl border border-dashed border-border p-14 text-center">
                                        <Receipt className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                        <h4 className="font-extrabold text-foreground text-sm">No Client Invoices Recorded Yet</h4>
                                        <p className="text-xs text-muted-foreground mt-1">When clients submit milestone payments or advance retainers, they are logged here.</p>
                                    </div>
                                ) : (
                                    <div className="glass-card rounded-2xl border border-border overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                                                    <tr>
                                                        <th className="p-3.5">Invoice ID & Date</th>
                                                        <th className="p-3.5">Client & Organization</th>
                                                        <th className="p-3.5">Milestone / Scope</th>
                                                        <th className="p-3.5">Inflow Amount</th>
                                                        <th className="p-3.5">Payment Status</th>
                                                        <th className="p-3.5">Bank Reference / UTR</th>
                                                        <th className="p-3.5 text-right">Digital Invoice</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/60">
                                                    {allClientInvoices.map(({ submission, invoice, meta }) => {
                                                        const isPaid = invoice.status === 'paid' || invoice.verification_status === 'verified';
                                                        const isPending = invoice.verification_status === 'pending_verification';
                                                        const amountStr = typeof invoice.amount === 'number'
                                                            ? `₹${invoice.amount.toLocaleString('en-IN')}`
                                                            : String(invoice.amount).startsWith('₹')
                                                            ? invoice.amount
                                                            : `₹${Number(String(invoice.amount).replace(/[^0-9.]/g, '') || 0).toLocaleString('en-IN')}`;

                                                        return (
                                                            <tr key={`${submission.id}-${invoice.id}`} className="hover:bg-muted/20 transition-colors">
                                                                <td className="p-3.5">
                                                                    <div className="font-mono font-extrabold text-primary">{invoice.id}</div>
                                                                    <div className="text-[10px] text-muted-foreground">
                                                                        {invoice.submitted_at ? new Date(invoice.submitted_at).toLocaleDateString('en-IN') : 'Recent'}
                                                                    </div>
                                                                </td>
                                                                <td className="p-3.5">
                                                                    <div className="font-bold text-foreground">{submission.organization || submission.name}</div>
                                                                    <div className="text-muted-foreground text-[11px]">{submission.email}</div>
                                                                </td>
                                                                <td className="p-3.5">
                                                                    <div className="font-semibold text-foreground">{invoice.title}</div>
                                                                    <div className="text-muted-foreground text-[10px]">{meta.package_type || 'Custom Engineering'}</div>
                                                                </td>
                                                                <td className="p-3.5 font-black text-emerald-400 text-sm">
                                                                    {amountStr}
                                                                </td>
                                                                <td className="p-3.5">
                                                                    {isPaid ? (
                                                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1 w-fit">
                                                                            <CheckCircle2 className="w-3 h-3" /> Verified & Received
                                                                        </span>
                                                                    ) : isPending ? (
                                                                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 animate-pulse flex items-center gap-1 w-fit">
                                                                            <Clock className="w-3 h-3" /> Pending Verification
                                                                        </span>
                                                                    ) : (
                                                                        <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold text-[10px] border border-border flex items-center gap-1 w-fit">
                                                                            Awaiting Payment
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                                                                    {invoice.transaction_id || '—'}
                                                                </td>
                                                                <td className="p-3.5 text-right">
                                                                    <button
                                                                        onClick={() => handleViewClientInvoice(submission, invoice)}
                                                                        className="px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-bold text-[11px] transition-all hover:scale-105 inline-flex items-center gap-1.5"
                                                                        title="Generate self-authenticating digital invoice"
                                                                    >
                                                                        <Printer className="w-3.5 h-3.5" /> View / Print
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <AdminClientsConsole adminEmail="ssaivaraprasad51@gmail.com" />
                        )}
                    </motion.div>
                ) : viewMode === 'knowledge' ? (
                    <KnowledgeHubManager />
                ) : viewMode === 'seo-geo' ? (
                    <SeoGeoCommandCenter />
                ) : viewMode === 'users' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                        {/* Users Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                                    <Users className="w-6 h-6 text-primary" /> All Portal Users
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">All registered clients, partners, and users across every portal. You can email or chat with anyone.</p>
                            </div>
                            <button onClick={fetchAllUsers} className="p-3 rounded-xl glass-card hover:bg-muted/50 transition-colors" title="Refresh">
                                <RefreshCw className={`w-5 h-5 ${usersLoading ? 'animate-spin text-primary' : ''}`} />
                            </button>
                        </div>

                        {/* Role Approvals Queue: Strict Admin Permission Control for Intern & Employee Roles */}
                        <div className="p-5 rounded-2xl bg-card border border-rose-500/30 space-y-4 shadow-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-rose-400" />
                                        <h3 className="font-extrabold text-base text-foreground">Role Approval Queue (Intern & Employee Access)</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/30">
                                            Admin Approval Required
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Clients, Agency Partners, and Investors can freely onboard. However, only Admin has permission to grant Intern or Employee portal access.
                                    </p>
                                </div>
                                <button
                                    onClick={refreshRoleRequests}
                                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Queue
                                </button>
                            </div>

                            {roleRequests.filter(r => r.status === 'pending').length === 0 ? (
                                <div className="py-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60">
                                    No pending intern or employee access requests. All applications have been reviewed.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {roleRequests.filter(r => r.status === 'pending').map(req => (
                                        <div key={req.id} className="p-4 rounded-xl bg-muted/40 border border-border/80 flex flex-col justify-between gap-3 text-xs">
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-extrabold text-foreground text-sm">{req.name}</span>
                                                    <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase tracking-wider ${
                                                        req.requested_role === 'employee' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                    }`}>
                                                        Requesting: {req.requested_role}
                                                    </span>
                                                </div>
                                                <p className="text-muted-foreground font-mono text-[11px] mt-0.5">{req.email}</p>
                                                {req.notes && (
                                                    <p className="text-muted-foreground mt-2 italic bg-background/60 p-2 rounded-lg border border-border/40 text-[11px]">
                                                        "{req.notes}"
                                                    </p>
                                                )}
                                                <span className="text-[10px] text-muted-foreground mt-1 block">Requested: {req.requested_at}</span>
                                            </div>

                                            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                                                <button
                                                    onClick={() => handleRejectRoleRequest(req.id)}
                                                    className="flex-1 py-1.5 px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold border border-red-500/20 transition-colors text-center"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleApproveRoleRequest(req.id)}
                                                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 font-extrabold shadow-sm transition-all text-center"
                                                >
                                                    Approve Access
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Role Summary Pills (Interactive Filters) */}
                        <div className="flex flex-wrap gap-3">
                            {[
                                { id: 'all', label: 'All Users', count: allUsers.length, color: 'bg-muted text-foreground border-border' },
                                { id: 'client', label: 'Clients', count: allUsers.filter(u => u.role === 'client').length, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                                { id: 'partner', label: 'Partners', count: allUsers.filter(u => u.role === 'partner').length, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                                { id: 'investor', label: 'Investors', count: allUsers.filter(u => u.role === 'investor').length, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                                { id: 'intern', label: 'Interns / Applicants', count: allUsers.filter(u => u.role === 'intern').length, color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
                                { id: 'employee', label: 'Employees / Team', count: allUsers.filter(u => u.role === 'employee').length, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                            ].map(pill => (
                                <button
                                    key={pill.id}
                                    onClick={() => setUserRoleFilter(pill.id as any)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                        userRoleFilter === pill.id
                                            ? 'ring-2 ring-primary ring-offset-2 ring-offset-background font-extrabold shadow-md ' + pill.color
                                            : 'opacity-70 hover:opacity-100 ' + pill.color
                                    }`}
                                >
                                    {pill.label} <span className="opacity-70">({pill.count})</span>
                                </button>
                            ))}
                        </div>

                        {/* Users Table */}
                        {usersLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : allUsers.length === 0 ? (
                            <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-border">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-1">No users found</h3>
                                <p className="text-xs text-muted-foreground">Users will appear here once they submit a form or sign in.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(userRoleFilter === 'all' ? allUsers : allUsers.filter(u => u.role === userRoleFilter))
                                    .filter(u => u.role !== 'admin' && u.email?.toLowerCase() !== 'ssaivaraprasad51@gmail.com')
                                    .map((user, i) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="glass-card p-5 rounded-2xl border border-border hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Avatar */}
                                            <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-sm shrink-0">
                                                {(user.name || user.email || '?')[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-foreground text-sm truncate">{user.name || 'Unknown'}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                                                        user.role === 'partner' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        user.role === 'investor' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        user.role === 'employee' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>{user.role}</span>
                                                    {user.confirmed && <span className="text-[10px] text-emerald-400">✓ Verified</span>}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                <p className="text-[11px] text-muted-foreground/60">
                                                    {user.organization && <span>{user.organization} · </span>}
                                                    {user.designation && <span>{user.designation} · </span>}
                                                    Joined {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => window.open(`mailto:${user.email}?subject=Message from Siddhi Dynamics Admin`)}
                                                className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs font-bold flex items-center gap-1.5 transition-all"
                                            >
                                                <Mail className="w-3.5 h-3.5" /> Email
                                            </button>
                                            <button
                                                onClick={() => setContactUser(user)}
                                                className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-bold flex items-center gap-1.5 transition-all"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" /> Chat
                                            </button>
                                            <button
                                                onClick={() => navigate(
                                                    user.role === 'partner' ? '/portal/agency' :
                                                    user.role === 'investor' ? '/portal/investor' :
                                                    user.role === 'employee' ? '/portal/employee' :
                                                    '/portal/client'
                                                )}
                                                className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 border border-border text-xs font-bold flex items-center gap-1.5 transition-all"
                                                title="Open their portal"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5" /> Portal
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Quick Contact Slide-in Panel */}
                        <AnimatePresence>
                            {contactUser && (
                                <motion.div
                                    initial={{ x: '100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '100%' }}
                                    className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card border-l border-border z-50 flex flex-col shadow-2xl"
                                >
                                    <div className="p-5 border-b border-border flex items-center justify-between">
                                        <div>
                                            <h3 className="font-extrabold text-foreground">{contactUser.name || contactUser.email}</h3>
                                            <p className="text-xs text-muted-foreground">{contactUser.email} · <span className="capitalize">{contactUser.role}</span></p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => window.open(`mailto:${contactUser.email}?subject=Message from Siddhi Dynamics`)}
                                                className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all"
                                                title="Open Gmail"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setContactUser(null)} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-5 space-y-3 overflow-y-auto">
                                        <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs leading-relaxed">
                                            <div className="font-bold text-[10px] opacity-60 mb-1">Siddhi Admin</div>
                                            Hello {contactUser.name?.split(' ')[0] || 'there'}! This is an admin message from Siddhi Dynamics. How can we help you today?
                                        </div>
                                    </div>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!userChatInput.trim()) return;
                                            window.open(`mailto:${contactUser.email}?subject=Message from Siddhi Dynamics&body=${encodeURIComponent(userChatInput)}`);
                                            toast.success('Opening Gmail with your message...');
                                            setUserChatInput('');
                                        }}
                                        className="flex gap-3 p-4 bg-muted border-t border-border"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Type a message or note…"
                                            value={userChatInput}
                                            onChange={e => setUserChatInput(e.target.value)}
                                            className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <button type="submit" className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] transition-all flex items-center gap-1.5">
                                            <Send className="w-4 h-4" /> Send
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : viewMode === 'agency' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                        {/* Sub-tabs switcher */}
                        <div className="flex items-center gap-2 border-b border-border pb-3">
                            <button
                                onClick={() => setAgencySubTab('clients')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    agencySubTab === 'clients'
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'glass-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <Building2 className="w-4 h-4" /> Client Brands & Retainers
                            </button>
                            <button
                                onClick={() => setAgencySubTab('commissions')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    agencySubTab === 'commissions'
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'glass-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <TrendingUp className="w-4 h-4" /> Commission Models & Partner Payouts
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                                    {agencyConfigs.length} Partners
                                </span>
                            </button>
                        </div>

                        {agencySubTab === 'commissions' ? (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                                            <TrendingUp className="w-6 h-6 text-primary" /> Agency Commission Models & Payout Control
                                        </h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Admin assigns Commission vs Non-Commission models to agencies. Tracks agency POC, corporate IDs (LLPIN, CIN, GSTIN), end-client delivery scope, project inflows, commission outflows, and self-authenticating digital invoices.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFullAgencyForm({
                                                agency_email: '',
                                                agency_name: '',
                                                agency_poc_name: '',
                                                agency_phone: '',
                                                agency_address: '',
                                                agency_id_type: 'LLPIN',
                                                agency_id_number: '',
                                                model: 'commission',
                                                commission_rate: 15,
                                                notes: '',
                                            });
                                            setAgencyEditModalOpen(true);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all self-start sm:self-auto"
                                    >
                                        <Plus className="w-4 h-4" /> Add / Configure Agency
                                    </button>
                                </div>

                                {/* Financial Summary KPIs: Inflow vs Outflow Segregation */}
                                {(() => {
                                    const totalAgencyInflow = agencyProjects.reduce((acc, p) => acc + (p.project_value || 0), 0);
                                    const totalCommissionOutflow = agencyProjects.reduce((acc, p) => acc + (p.commission_amount || 0), 0);
                                    const netRetained = totalAgencyInflow - totalCommissionOutflow;

                                    return (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            <div className="glass-card p-4 rounded-xl border border-primary/30 bg-primary/5">
                                                <span className="text-[10px] text-primary uppercase font-bold tracking-wider block">Gross Inflow (Agency Projects)</span>
                                                <span className="text-2xl font-black text-primary mt-1 block">
                                                    ₹{totalAgencyInflow.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                                                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Commission Outflows</span>
                                                <span className="text-2xl font-black text-amber-400 mt-1 block">
                                                    ₹{totalCommissionOutflow.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                                                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Net Retained by Siddhi</span>
                                                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                                                    ₹{netRetained.toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                            <div className="glass-card p-4 rounded-xl border border-border">
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Active Partner Agencies</span>
                                                <span className="text-2xl font-black text-foreground mt-1 block">{agencyConfigs.length}</span>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Agency Config Cards with POC & Corporate ID */}
                                <div className="space-y-3">
                                    <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-primary" /> Agency Partner Profiles & POC Coordinates
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {agencyConfigs.map((cfg) => (
                                            <div key={cfg.agency_email} className="glass-card p-5 rounded-2xl border border-border space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h4 className="font-extrabold text-foreground text-base flex items-center gap-2">
                                                            {cfg.agency_name}
                                                            {cfg.agency_id_number && (
                                                                <span className="px-2 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground border border-border">
                                                                    {cfg.agency_id_type || 'ID'}: {cfg.agency_id_number}
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground font-mono">{cfg.agency_email}</p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                        cfg.model === 'commission'
                                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                            : 'bg-muted text-muted-foreground border-border'
                                                    }`}>
                                                        {cfg.model === 'commission' ? `Commission (${cfg.commission_rate}%)` : 'Non-Commission (Direct)'}
                                                    </span>
                                                </div>

                                                {/* POC & Location coordinates */}
                                                <div className="bg-muted/40 p-3 rounded-xl border border-border/60 text-xs space-y-1">
                                                    <div className="flex items-center justify-between text-muted-foreground">
                                                        <span><strong className="text-foreground">POC:</strong> {cfg.agency_poc_name || 'Designated Partner POC'}</span>
                                                        {cfg.agency_phone && <span className="font-mono text-[11px]">{cfg.agency_phone}</span>}
                                                    </div>
                                                    <div className="text-[11px] text-muted-foreground truncate">
                                                        <strong className="text-foreground">Address:</strong> {cfg.agency_address || 'Registered HQ on File'}
                                                    </div>
                                                </div>

                                                <p className="text-xs text-muted-foreground italic">
                                                    "{cfg.notes || 'Operating standard partnership terms.'}"
                                                </p>

                                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border flex-wrap">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const newModel = cfg.model === 'commission' ? 'non_commission' : 'commission';
                                                                agencyCommissionService.saveAgencyConfig({
                                                                    ...cfg,
                                                                    model: newModel,
                                                                });
                                                                refreshAgencyData();
                                                                toast.success(`Switched ${cfg.agency_name} to ${newModel === 'commission' ? 'Commission Model' : 'Non-Commission Model'}`);
                                                            }}
                                                            className="px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold text-[11px] transition-colors"
                                                        >
                                                            {cfg.model === 'commission' ? 'Make Non-Comm.' : 'Make Comm.'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const rate = prompt(`Enter commission % for ${cfg.agency_name}:`, String(cfg.commission_rate || 15));
                                                                if (!rate) return;
                                                                agencyCommissionService.saveAgencyConfig({
                                                                    ...cfg,
                                                                    commission_rate: parseInt(rate, 10) || 15,
                                                                });
                                                                refreshAgencyData();
                                                                toast.success("Updated commission rate!");
                                                            }}
                                                            className="px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-bold text-[11px] border border-primary/30 transition-colors"
                                                        >
                                                            Set Rate %
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => openEditFullAgency(cfg)}
                                                        className="px-3 py-1.5 rounded-lg bg-card hover:bg-muted text-foreground border border-border font-bold text-[11px] flex items-center gap-1.5"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" /> Edit Profile & POC
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Referred Projects Ledger */}
                                <div className="space-y-3 pt-4 border-t border-border">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-emerald-400" /> Agency Referred Projects, Inflows & Commission Outflows
                                        </h3>
                                        <button
                                            onClick={() => {
                                                const agencyEmail = prompt("Referring Agency Email:", agencyConfigs[0]?.agency_email || "partner@vmagneticminds.com");
                                                if (!agencyEmail) return;
                                                const projTitle = prompt("Project Title (e.g. Acme Website & SaaS):");
                                                if (!projTitle) return;
                                                const clientName = prompt("Client Business Name:");
                                                if (!clientName) return;
                                                const valStr = prompt("Total Project Value / Inflow (in ₹):", "50000");
                                                const val = parseInt(valStr || "50000", 10);
                                                agencyCommissionService.addProject({
                                                    agency_email: agencyEmail,
                                                    project_title: projTitle,
                                                    client_name: clientName,
                                                    project_value: val,
                                                    commission_payout_status: 'pending',
                                                    inflow_status: 'received',
                                                    inflow_utr: 'SBI-INFLOW-' + Math.floor(1000000000 + Math.random() * 9000000000),
                                                    invoice_no: 'SD-AGY-INV-' + Math.floor(100 + Math.random() * 900),
                                                });
                                                refreshAgencyData();
                                                toast.success("Referred project recorded in ledger!");
                                            }}
                                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" /> Record Client Project
                                        </button>
                                    </div>

                                    {agencyProjects.length === 0 ? (
                                        <div className="glass-card rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground text-xs">
                                            No referred client projects recorded yet. When agencies bring projects to Siddhi Dynamics, they appear here with calculated commissions.
                                        </div>
                                    ) : (
                                        <div className="glass-card rounded-2xl border border-border overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                                                        <tr>
                                                            <th className="p-3.5">Project & End-Client (Service To)</th>
                                                            <th className="p-3.5">Referring Partner & POC</th>
                                                            <th className="p-3.5">Gross Inflow (₹)</th>
                                                            <th className="p-3.5">Model & Rate</th>
                                                            <th className="p-3.5">Comm. Outflow (₹)</th>
                                                            <th className="p-3.5">Net Retained (₹)</th>
                                                            <th className="p-3.5">Payout Status</th>
                                                            <th className="p-3.5 text-right">Digital Invoice</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-border/60">
                                                        {agencyProjects.map((p) => {
                                                            const agencyCfg = agencyConfigs.find(a => a.agency_email.toLowerCase() === p.agency_email.toLowerCase());
                                                            const netRetained = (p.project_value || 0) - (p.commission_amount || 0);

                                                            return (
                                                                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                                                                    <td className="p-3.5 max-w-xs">
                                                                        <div className="font-extrabold text-foreground">{p.project_title}</div>
                                                                        <div className="text-emerald-400 font-semibold text-[11px]">
                                                                            Client: {p.client_name}
                                                                        </div>
                                                                        <div className="text-muted-foreground text-[10px] truncate">
                                                                            Scope: {p.service_scope || 'Cloud, AI & Development'}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-3.5">
                                                                        <div className="font-bold text-foreground">
                                                                            {agencyCfg?.agency_name || p.agency_email.split('@')[0]}
                                                                        </div>
                                                                        <div className="text-muted-foreground text-[10px]">
                                                                            POC: {agencyCfg?.agency_poc_name || 'Designated POC'}
                                                                        </div>
                                                                        {agencyCfg?.agency_id_number && (
                                                                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-muted text-[9px] font-mono text-muted-foreground">
                                                                                {agencyCfg.agency_id_type}: {agencyCfg.agency_id_number}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-3.5">
                                                                        <div className="font-black text-foreground">
                                                                            ₹{p.project_value.toLocaleString('en-IN')}
                                                                        </div>
                                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                                                                            Inflow Received
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-3.5">
                                                                        {p.model_applied === 'commission' ? (
                                                                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25">
                                                                                {p.commission_rate}% Comm.
                                                                            </span>
                                                                        ) : (
                                                                            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold">
                                                                                Non-Comm.
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-3.5 font-extrabold text-amber-400">
                                                                        ₹{p.commission_amount.toLocaleString('en-IN')}
                                                                    </td>
                                                                    <td className="p-3.5 font-black text-emerald-400">
                                                                        ₹{netRetained.toLocaleString('en-IN')}
                                                                    </td>
                                                                    <td className="p-3.5">
                                                                        {p.commission_payout_status === 'paid' ? (
                                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                                                                                Paid ({p.payout_reference || 'UTR Recorded'})
                                                                            </span>
                                                                        ) : (
                                                                            <div className="space-y-1">
                                                                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                                                                                    Pending Payout
                                                                                </span>
                                                                                {p.commission_amount > 0 && (
                                                                                    <button
                                                                                        onClick={() => handleMarkAgencyPayout(p.id)}
                                                                                        className="block mt-1 px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] transition-all"
                                                                                    >
                                                                                        Mark Payout Paid
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-3.5 text-right">
                                                                        <button
                                                                            onClick={() => handleViewAgencyInvoice(p, agencyCfg)}
                                                                            className="px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-bold text-[11px] transition-all hover:scale-105 inline-flex items-center gap-1.5"
                                                                            title="View self-authenticating agency invoice"
                                                                        >
                                                                            <Printer className="w-3.5 h-3.5" /> View / Print
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                                    <Building2 className="w-6 h-6 text-primary" /> Agency Client Management
                                </h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Set SLA tenure, retainer fee, SEO/GEO/GBP/AEO scores, GA analytics, and create invoices for each agency client.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    value={agencySearchTerm}
                                    onChange={e => setAgencySearchTerm(e.target.value)}
                                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-52"
                                />
                            </div>
                        </div>

                        {agencyClientsLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : agencyClients.length === 0 ? (
                            <div className="glass-card rounded-2xl border border-dashed border-border p-16 text-center">
                                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-extrabold text-foreground mb-2">No Agency Clients Found</h3>
                                <p className="text-sm text-muted-foreground">Agency clients will appear here once they are added by an agency partner.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {agencyClients
                                    .filter(c =>
                                        !agencySearchTerm ||
                                        c.business_name?.toLowerCase().includes(agencySearchTerm.toLowerCase()) ||
                                        c.agency_email?.toLowerCase().includes(agencySearchTerm.toLowerCase()) ||
                                        c.category?.toLowerCase().includes(agencySearchTerm.toLowerCase())
                                    )
                                    .map(client => (
                                        <div key={client.id} className="glass-card rounded-2xl border border-border p-5 space-y-4">
                                            {/* Client Header */}
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-extrabold text-base text-foreground">{client.business_name}</h3>
                                                    <p className="text-xs text-muted-foreground">{client.category || '—'} · {client.agency_email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${
                                                        client.status === 'Locked (Tenure Expired)' ? 'bg-red-600/20 text-red-400 border-red-500/30' :
                                                        client.status === 'Active Optimization' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' :
                                                        'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                    }`}>{client.status || 'Onboarding'}</span>
                                                </div>
                                            </div>

                                            {/* Score Summary */}
                                            <div className="grid grid-cols-4 gap-2 text-center bg-muted/60 rounded-xl p-3">
                                                {[['GEO', client.geo_score, 'text-violet-400'], ['SEO', client.seo_score, 'text-cyan-400'], ['GBP', client.gbp_score, 'text-rose-400'], ['AEO', client.aeo_score, 'text-amber-400']].map(([label, val, color]) => (
                                                    <div key={label as string}>
                                                        <div className={`text-[9px] font-extrabold uppercase ${color}`}>{label}</div>
                                                        <div className="text-sm font-extrabold text-foreground">{val || 0}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* SLA Info */}
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                <span>
                                                    {client.tenure_months ? `${client.tenure_months}-Month SLA` : '⏳ Tenure not set'}
                                                    {client.tenure_start_date && ` · From ${client.tenure_start_date}`}
                                                </span>
                                            </div>

                                            {/* Retainer */}
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <CreditCard className="w-3.5 h-3.5 text-primary" />
                                                <span>{client.retainer_fee ? `₹${client.retainer_fee}/month` : '⏳ Fee not set'}</span>
                                            </div>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => openEditAgencyClient(client)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-extrabold text-xs rounded-xl border border-primary/20 transition-all"
                                            >
                                                <Edit className="w-4 h-4" /> Edit Scores, SLA & Billing
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        )}
                        </>
                        )}
                    </motion.div>
                ) : viewMode === 'internships' ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
                        {/* Sub-tabs switcher */}
                        <div className="flex items-center gap-2 border-b border-border pb-3">
                            <button
                                onClick={() => setInternshipTab('payroll')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    internshipTab === 'payroll'
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'glass-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <DollarSign className="w-4 h-4" /> Salaries, Stipends & Incentives
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                                    ₹{payrollSummary.total_disbursed.toLocaleString('en-IN')}
                                </span>
                            </button>
                            <button
                                onClick={() => setInternshipTab('console')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                    internshipTab === 'console'
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'glass-card text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <GraduationCap className="w-4 h-4" /> Intern Tasks & Whitelist Console
                                {registeredInternsCount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono">
                                        {registeredInternsCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {internshipTab === 'payroll' ? (
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
                                            <DollarSign className="w-6 h-6 text-primary" /> Team Salaries, Stipends & Incentives Ledger
                                        </h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Manage employee salaries, intern stipends, performance incentives, bonuses, and verified digital internship completion certificates.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setNewDisbursementModalOpen(true)}
                                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all self-start sm:self-auto"
                                    >
                                        <Plus className="w-4 h-4" /> Record New Disbursement
                                    </button>
                                </div>

                                {/* Summary KPIs */}
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    <div className="glass-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                                        <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Total Disbursed</span>
                                        <span className="text-xl font-black text-emerald-400 mt-1 block">
                                            ₹{payrollSummary.total_disbursed.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                                        <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Pending Outflow</span>
                                        <span className="text-xl font-black text-amber-400 mt-1 block">
                                            ₹{payrollSummary.total_pending.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl border border-border">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Employee Salaries</span>
                                        <span className="text-xl font-black text-foreground mt-1 block">
                                            ₹{payrollSummary.employee_salaries.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl border border-primary/30 bg-primary/5">
                                        <span className="text-[10px] text-primary uppercase font-bold tracking-wider block">Intern Stipends</span>
                                        <span className="text-xl font-black text-primary mt-1 block">
                                            ₹{payrollSummary.intern_stipends.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl border border-violet-500/30 bg-violet-500/5">
                                        <span className="text-[10px] text-violet-400 uppercase font-bold tracking-wider block">Incentives & Bonus</span>
                                        <span className="text-xl font-black text-violet-400 mt-1 block">
                                            ₹{(payrollSummary.performance_incentives + payrollSummary.bonuses).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>

                                {/* Compensation Disbursements Table */}
                                <div className="space-y-3">
                                    <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-emerald-400" /> Outflow Disbursements & Bank Wire Records
                                    </h3>
                                    <div className="glass-card rounded-2xl border border-border overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                                                    <tr>
                                                        <th className="p-3.5">Recipient & Role</th>
                                                        <th className="p-3.5">Category</th>
                                                        <th className="p-3.5">Period</th>
                                                        <th className="p-3.5">Amount (₹)</th>
                                                        <th className="p-3.5">Disbursement Status</th>
                                                        <th className="p-3.5">Bank Reference / UTR</th>
                                                        <th className="p-3.5">Certificate Reference</th>
                                                        <th className="p-3.5 text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border/60">
                                                    {payrollRecords.map((r) => (
                                                        <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                                                            <td className="p-3.5">
                                                                <div className="font-extrabold text-foreground flex items-center gap-2">
                                                                    {r.recipient_name}
                                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                                        r.role === 'employee' 
                                                                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' 
                                                                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                                                    }`}>
                                                                        {r.role}
                                                                    </span>
                                                                </div>
                                                                <div className="text-muted-foreground text-[11px] font-mono">{r.recipient_email}</div>
                                                            </td>
                                                            <td className="p-3.5 font-semibold text-foreground capitalize">
                                                                {r.disbursement_type}
                                                            </td>
                                                            <td className="p-3.5 text-muted-foreground">
                                                                {r.period}
                                                            </td>
                                                            <td className="p-3.5 font-black text-emerald-400 text-sm">
                                                                ₹{r.amount.toLocaleString('en-IN')}
                                                            </td>
                                                            <td className="p-3.5">
                                                                {r.status === 'paid' ? (
                                                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1 w-fit">
                                                                        <CheckCircle2 className="w-3 h-3" /> Disbursed
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 animate-pulse flex items-center gap-1 w-fit">
                                                                        <Clock className="w-3 h-3" /> Pending Wire
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="p-3.5 font-mono text-[11px] text-muted-foreground">
                                                                {r.transaction_utr || '—'}
                                                            </td>
                                                            <td className="p-3.5">
                                                                {r.certificate_id ? (
                                                                    <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-mono font-bold border border-primary/30 flex items-center gap-1 w-fit">
                                                                        <Award className="w-3 h-3" /> {r.certificate_id}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted-foreground text-[11px]">—</span>
                                                                )}
                                                            </td>
                                                            <td className="p-3.5 text-right">
                                                                {r.status === 'pending' ? (
                                                                    <button
                                                                        onClick={() => handleMarkPayrollPaid(r.id)}
                                                                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] transition-all shadow-sm"
                                                                    >
                                                                        Mark Paid (Enter UTR)
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-muted-foreground text-[11px] font-semibold">Verified</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Verified Intern Completion Certificates Section */}
                                <div className="space-y-3 pt-4 border-t border-border">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                                <Award className="w-5 h-5 text-amber-400" /> Issued Internship Completion Certificates
                                            </h3>
                                            <p className="text-xs text-muted-foreground">
                                                Self-authenticating credentials verified under Siddhi Dynamics LLP registration ACX-6222.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            {
                                                name: "Rohan Verma",
                                                certId: "SD-CERT-2026-089",
                                                domain: "Full-Stack Web & Generative AI Systems",
                                                issuedAt: "September 15, 2026",
                                                status: "Verified & Digitally Sealed"
                                            },
                                            {
                                                name: "Ananya Deshmukh",
                                                certId: "SD-CERT-2026-104",
                                                domain: "Deep-Tech Cloud Infrastructure & LLM Tuning",
                                                issuedAt: "August 30, 2026",
                                                status: "Verified & Digitally Sealed"
                                            }
                                        ].map((cert) => (
                                            <div key={cert.certId} className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h4 className="font-extrabold text-foreground text-base flex items-center gap-2">
                                                            {cert.name}
                                                        </h4>
                                                        <p className="text-xs text-primary font-bold">{cert.domain}</p>
                                                    </div>
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                                                        <BadgeCheck className="w-3.5 h-3.5" /> {cert.status}
                                                    </span>
                                                </div>

                                                <div className="bg-muted/40 p-3 rounded-xl border border-border/60 text-xs flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Certificate Number</span>
                                                        <span className="font-mono font-extrabold text-foreground">{cert.certId}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Issue Date</span>
                                                        <span className="font-semibold text-foreground">{cert.issuedAt}</span>
                                                    </div>
                                                </div>

                                                <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                                                    <span>Issuer: Siddhi Dynamics LLP (LLPIN: ACX-6222)</span>
                                                    <span>IT Act 2000 Section 65B Compliant</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <AdminInternshipsConsole />
                        )}
                    </motion.div>
                ) : null}
                <div className="pt-8">
                    <GoogleReviewCard audience="visitor" name="Sai Vara Prasad" compact />
                </div>
            </main>

            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* ====== IN-APP CHAT PANEL ====== */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-6 overflow-y-auto"
                        onClick={() => setChatOpen(null)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-lg h-[75vh] bg-[#0a0a0f] border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-primary/10"
                        >
                            {/* Chat Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sm text-foreground">{chatOpen.name}</p>
                                        <p className="text-xs text-muted-foreground">{chatOpen.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setChatOpen(null)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0b141a]">
                                {chatLoading ? (
                                    <div className="flex items-center justify-center h-full text-[#8696a0]">
                                        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading chat...
                                    </div>
                                ) : chatMessages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-[#8696a0] text-center gap-2">
                                        <MessageCircle className="w-10 h-10 opacity-30 text-primary animate-pulse" />
                                        <p className="text-sm">No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    chatMessages.map((msg: any) => {
                                        const isSelf = msg.is_admin;
                                        const parsed = parseAttachment(msg.message);
                                        return (
                                            <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                                                {!isSelf && (
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20 text-[10px] font-bold text-primary mb-1">
                                                        {chatOpen.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className={`relative max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-md border-t text-left ${
                                                    isSelf 
                                                        ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none border-emerald-500/10' 
                                                        : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border-white/5'
                                                }`}>
                                                    {parsed.isAttachment ? (
                                                        <div className="space-y-2">
                                                            <a 
                                                                href={parsed.fileUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded-xl hover:bg-black/60 transition-colors cursor-pointer group text-left"
                                                            >
                                                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                                                    <FileText className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-xs text-slate-200 line-clamp-1 group-hover:text-primary transition-colors">{parsed.fileName}</p>
                                                                    <p className="text-[10px] text-muted-foreground">PDF Document • Click to Open</p>
                                                                </div>
                                                                <div className="text-muted-foreground hover:text-foreground">
                                                                    <Download className="w-4 h-4" />
                                                                </div>
                                                            </a>
                                                            {parsed.additionalText && (
                                                                <p className="leading-relaxed whitespace-pre-wrap">{parsed.additionalText}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                                    )}
                                                    <div className="flex items-center justify-end gap-1 text-[9px] text-[#8696a0] mt-1 text-right">
                                                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        {isSelf && (
                                                            <span className="text-emerald-400 font-bold ml-1">✓✓</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-white/10 bg-[#1f2c34]">
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setAttachmentDropdownOpen(!attachmentDropdownOpen)}
                                            className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                                            title="Share Quotation or Document Template"
                                        >
                                            <Paperclip className={`w-4 h-4 ${attachmentDropdownOpen ? 'text-primary rotate-45' : ''} transition-transform`} />
                                        </button>

                                        <AnimatePresence>
                                            {attachmentDropdownOpen && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setAttachmentDropdownOpen(false)} />
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 15 }}
                                                        className="absolute bottom-14 left-0 w-80 bg-[#111b21] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-40 space-y-1 text-left"
                                                    >
                                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-2 py-1">Share Document or Quotation</p>
                                                        
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('Project_Development_Proposal_Quotation.pdf', 'https://siddhidynamics.com/templates/Quotation_Template.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">Project Proposal & Quotation.pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('Siddhi_Dynamics_Service_Agreement.pdf', 'https://siddhidynamics.com/templates/Service_Agreement.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">Dynamics Service Agreement.pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('Non_Disclosure_Agreement_NDA.pdf', 'https://siddhidynamics.com/templates/NDA_Siddhi_Dynamics.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">NDA Template (Siddhi).pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleAttachmentSelect('System_Architecture_Blueprint.pdf', 'https://siddhidynamics.com/templates/Architecture_Blueprint.pdf')}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" />
                                                            <span className="truncate">System Architecture Blueprint.pdf</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-xl text-xs font-semibold text-slate-200 hover:text-primary transition-colors flex items-center gap-2 border-t border-white/5"
                                                        >
                                                            <Paperclip className="w-3.5 h-3.5 text-accent" />
                                                            <span>Upload Custom Document...</span>
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleCustomFileUpload} 
                                            className="hidden" 
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="Type your message or quote..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                                        className="flex-1 bg-[#2a3942] border-none text-[#e9edef] rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-muted-foreground/60 transition-all text-left"
                                    />
                                    <button
                                        onClick={sendChatMessage}
                                        disabled={!chatInput.trim() || sendingMsg}
                                        className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                    >
                                        {sendingMsg ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Send className="w-4 h-4 text-white" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ====== FULL INFORMATIVE DATA INSPECTOR MODAL ====== */}
            <AnimatePresence>
                {viewDetailsSub && (() => {
                    const meta = parseProjectMetadata(viewDetailsSub.bounty_reward);
                    const parsedMsg = parseSubmissionMessage(viewDetailsSub.message);
                    const hasPaidAdvance = meta.invoices?.some(inv => inv.status === 'paid') || meta.service_start_date;
                    return (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-20 pb-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                            onClick={() => setViewDetailsSub(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-border bg-muted/40 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                            <ClipboardList className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-extrabold text-lg text-foreground">{viewDetailsSub.name}</h3>
                                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 font-bold">
                                                    {viewDetailsSub.status || 'New Request'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {viewDetailsSub.organization || getInquiryLabel(viewDetailsSub.inquiry_type)} · Received {format(new Date(viewDetailsSub.created_at || ""), "PPP 'at' p")}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setViewDetailsSub(null)} className="p-2 rounded-xl hover:bg-muted text-foreground transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                                    {/* 1. Client & Contact */}
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Client & Contact Details
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div><span className="text-muted-foreground font-semibold">Name:</span> <strong className="text-foreground ml-1">{viewDetailsSub.name}</strong></div>
                                            <div><span className="text-muted-foreground font-semibold">Email:</span> <strong className="text-foreground ml-1">{viewDetailsSub.email}</strong></div>
                                            <div><span className="text-muted-foreground font-semibold">Role / Designation:</span> <strong className="text-foreground ml-1">{viewDetailsSub.designation || 'Not specified'}</strong></div>
                                            <div><span className="text-muted-foreground font-semibold">Organization:</span> <strong className="text-foreground ml-1">{viewDetailsSub.organization || 'Not specified'}</strong></div>
                                        </div>
                                    </div>

                                    {/* 2. Selected Services & Preferences */}
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                            <PanelsTopLeft className="w-4 h-4" /> Requested Services & Project Scope
                                        </h4>
                                        {parsedMsg.selectedServices.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {parsedMsg.selectedServices.map((srv, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs">
                                                        {srv}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">General service requirement ({getInquiryLabel(viewDetailsSub.inquiry_type)})</p>
                                        )}
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50 text-xs">
                                            {parsedMsg.budgetPreference && (
                                                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                                                    Budget: {parsedMsg.budgetPreference}
                                                </span>
                                            )}
                                            {parsedMsg.requestedStartDate && (
                                                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                                                    Requested Start Date: {parsedMsg.requestedStartDate}
                                                </span>
                                            )}
                                            {parsedMsg.consentTimestamp && (
                                                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                                                    Consent: Granted ({new Date(parsedMsg.consentTimestamp).toLocaleDateString()})
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 3. Clean Message */}
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
                                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" /> Project Requirements / Brief
                                        </h4>
                                        <div className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans p-4 bg-card rounded-xl border border-border">
                                            {parsedMsg.cleanMessage}
                                        </div>
                                    </div>

                                    {/* 4. Quoting, Agreement & Banking Details */}
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Landmark className="w-4 h-4" /> Assigned Quote & Service Agreement
                                            </h4>
                                            <button
                                                onClick={() => openQuoteModal(viewDetailsSub)}
                                                className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors"
                                            >
                                                {meta.agreement ? "Modify Quote / Agreement" : "Assign Quote & Agreement"}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="text-muted-foreground font-semibold">Agreed / Quoted Price:</span>
                                                <strong className="text-foreground ml-1 text-sm text-emerald-400">{meta.agreement || "Not assigned yet"}</strong>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground font-semibold">Payment Structure:</span>
                                                <span className="text-foreground ml-1 font-semibold">{meta.payment_structure || "50% Advance + 50% on Delivery"}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground font-semibold">Service Start Date:</span>
                                                <span className="text-foreground ml-1 font-bold">
                                                    {meta.service_start_date ? (
                                                        <span className="text-emerald-400 flex items-center gap-1 inline-flex"><CheckCircle2 className="w-3.5 h-3.5" /> {meta.service_start_date} (Started)</span>
                                                    ) : (
                                                        <span className="text-amber-400 flex items-center gap-1 inline-flex"><Clock className="w-3.5 h-3.5" /> Pending Cashfree Advance</span>
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground font-semibold">Estimated Delivery:</span>
                                                <strong className="text-foreground ml-1">{meta.deadline || "Per Roadmap"}</strong>
                                            </div>
                                            <div className="sm:col-span-2 pt-2 border-t border-border/50">
                                                <span className="text-muted-foreground font-semibold">Scope / Deliverables Summary:</span>
                                                <strong className="text-foreground ml-1">
                                                    {meta.scope_summary || (parsedMsg.selectedServices.length > 0 ? `Services: ${parsedMsg.selectedServices.join(", ")}` : "Services: 🚀 SEO, GEO & AEO Programme, 🌐 Website / Portal Development")}
                                                </strong>
                                            </div>
                                        </div>

                                        {/* Banking Details Sharing Status */}
                                        <div className="p-3 rounded-xl bg-card border border-border/80 text-xs space-y-1.5 mt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-foreground flex items-center gap-1.5">
                                                    <ShieldCheck className="w-4 h-4 text-primary" /> Banking Credentials & Service Form
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hasPaidAdvance ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                    {hasPaidAdvance ? '🔓 Unlocked to Client' : '🔒 Locked Until Cashfree Payment'}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground">
                                                Configured Bank: {meta.banking_details?.bank_name || DEFAULT_BANKING_DETAILS.bank_name} (A/C: {meta.banking_details?.account_number || DEFAULT_BANKING_DETAILS.account_number}, IFSC: {meta.banking_details?.ifsc_code || DEFAULT_BANKING_DETAILS.ifsc_code})
                                            </p>
                                        </div>
                                    </div>

                                    {/* 4b. Deliverables, Live Demos & SEO Progress Reports */}
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                                <Globe className="w-4 h-4" /> Deliverables, Live Previews & Progress Reports
                                            </h4>
                                            <button
                                                onClick={() => {
                                                    const subToEdit = viewDetailsSub;
                                                    setViewDetailsSub(null);
                                                    openEdit(subToEdit);
                                                }}
                                                className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors flex items-center gap-1"
                                            >
                                                <Edit className="w-3.5 h-3.5" /> Edit Deliverables / URLs
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            {/* Website Demo / Staging */}
                                            <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-foreground flex items-center gap-1.5">
                                                        <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Website Demo / Staging Preview
                                                    </span>
                                                    {meta.demo_url ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">Available</span>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground">Not set</span>
                                                    )}
                                                </div>
                                                {meta.demo_url ? (
                                                    <a
                                                        href={meta.demo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold break-all"
                                                    >
                                                        {meta.demo_url} <ExternalLink className="w-3 h-3 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <p className="text-[11px] text-muted-foreground">Demo preview URL not assigned yet.</p>
                                                )}
                                            </div>

                                            {/* Live Production Website */}
                                            <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-foreground flex items-center gap-1.5">
                                                        <Globe className="w-3.5 h-3.5 text-emerald-400" /> Live Production Website
                                                    </span>
                                                    {meta.website_url ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Live</span>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground">Not set</span>
                                                    )}
                                                </div>
                                                {meta.website_url ? (
                                                    <a
                                                        href={meta.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold break-all"
                                                    >
                                                        {meta.website_url} <ExternalLink className="w-3 h-3 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <p className="text-[11px] text-muted-foreground">Production domain not assigned yet.</p>
                                                )}
                                            </div>

                                            {/* SEO & AEO Progress Report */}
                                            <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-foreground flex items-center gap-1.5">
                                                        <TrendingUp className="w-3.5 h-3.5 text-lime-400" /> SEO & Growth Report
                                                    </span>
                                                    {meta.seo_report_url ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400">Linked</span>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground">Not set</span>
                                                    )}
                                                </div>
                                                {meta.seo_report_url ? (
                                                    <a
                                                        href={meta.seo_report_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-lime-400 hover:underline font-semibold break-all"
                                                    >
                                                        {meta.seo_report_url} <ExternalLink className="w-3 h-3 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <p className="text-[11px] text-muted-foreground">Looker Studio / audit report URL not linked yet.</p>
                                                )}
                                            </div>

                                            {/* Google Business Profile / Maps */}
                                            <div className="p-3 rounded-xl bg-card border border-border space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-foreground flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-amber-400" /> Google Business Profile
                                                    </span>
                                                    {meta.gbp_url ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Linked</span>
                                                    ) : (
                                                        <span className="text-[10px] text-muted-foreground">Not set</span>
                                                    )}
                                                </div>
                                                {meta.gbp_url ? (
                                                    <a
                                                        href={meta.gbp_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold break-all"
                                                    >
                                                        {meta.gbp_url} <ExternalLink className="w-3 h-3 shrink-0" />
                                                    </a>
                                                ) : (
                                                    <p className="text-[11px] text-muted-foreground">Google Maps profile URL not linked yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. Invoices & Cashfree Billing Ledger */}
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" /> Invoices & Payments Ledger
                                            </h4>
                                            <button
                                                onClick={() => openAddInvoice(viewDetailsSub)}
                                                className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors flex items-center gap-1"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Add Invoice
                                            </button>
                                        </div>

                                        {meta.invoices && meta.invoices.length > 0 ? (
                                            <div className="space-y-2">
                                                {meta.invoices.map((inv) => {
                                                    const isPaid = inv.status === 'paid';
                                                    return (
                                                        <div key={inv.id} className="p-3 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                                            <div className="space-y-0.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-foreground">{inv.id}: {inv.title}</span>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                                        {isPaid ? 'PAID' : 'PENDING'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-muted-foreground text-[11px]">{inv.description || "Project milestone invoice"} · Due: {inv.due_date}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold text-sm text-foreground">{inv.amount}</span>
                                                                {!isPaid && (
                                                                    <button
                                                                        onClick={() => handleMarkInvoicePaid(viewDetailsSub, inv.id)}
                                                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-bold transition-colors"
                                                                    >
                                                                        Mark Paid
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">No invoices issued yet. Click "Accept & Quote" to generate the advance invoice.</p>
                                        )}
                                    </div>

                                    {/* 6. Project Timeline Updates */}
                                    <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4" /> Project Progress Updates
                                            </h4>
                                            <button
                                                onClick={() => openPostUpdate(viewDetailsSub)}
                                                className="px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors flex items-center gap-1"
                                            >
                                                <Plus className="w-3.5 h-3.5" /> Post Update
                                            </button>
                                        </div>

                                        {meta.updates && meta.updates.length > 0 ? (
                                            <div className="space-y-2">
                                                {meta.updates.map((upd) => (
                                                    <div key={upd.id} className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <strong className="text-foreground">{upd.title}</strong>
                                                            <div className="flex items-center gap-2 text-[10px]">
                                                                <span className="text-muted-foreground">{upd.date}</span>
                                                                <span className={`px-2 py-0.5 rounded-full font-bold ${upd.visible_to_client ? 'bg-blue-500/20 text-blue-400' : 'bg-muted text-muted-foreground'}`}>
                                                                    {upd.visible_to_client ? 'Visible to Client' : 'Internal'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-muted-foreground leading-relaxed">{upd.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">No updates logged yet. Post an update to keep client informed.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-4 bg-muted border-t border-border flex flex-wrap gap-2 justify-end">
                                    <button
                                        onClick={() => {
                                            openQuoteModal(viewDetailsSub);
                                            setViewDetailsSub(null);
                                        }}
                                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                                    >
                                        <Landmark className="w-3.5 h-3.5" /> Accept & Quote
                                    </button>
                                    <button
                                        onClick={() => {
                                            openAddInvoice(viewDetailsSub);
                                            setViewDetailsSub(null);
                                        }}
                                        className="px-4 py-2 bg-card border border-border hover:bg-muted text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 text-foreground"
                                    >
                                        <CreditCard className="w-3.5 h-3.5" /> Add Invoice
                                    </button>
                                    <button
                                        onClick={() => {
                                            openPostUpdate(viewDetailsSub);
                                            setViewDetailsSub(null);
                                        }}
                                        className="px-4 py-2 bg-card border border-border hover:bg-muted text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 text-foreground"
                                    >
                                        <TrendingUp className="w-3.5 h-3.5" /> Post Update
                                    </button>
                                    <button
                                        onClick={() => {
                                            openEdit(viewDetailsSub);
                                            setViewDetailsSub(null);
                                        }}
                                        className="px-4 py-2 bg-card border border-border hover:bg-muted text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 text-foreground"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            openChat(viewDetailsSub);
                                            setViewDetailsSub(null);
                                        }}
                                        className="px-4 py-2 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-105 transition-all flex items-center gap-1.5"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" /> Open Chat
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* ====== EDIT SUBMISSION PANEL ====== */}
            <AnimatePresence>
                {editOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-6 overflow-y-auto"
                        onClick={() => setEditOpen(null)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-lg h-[85vh] bg-popover border border-border rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-primary/10"
                        >
                            {/* Edit Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Edit3 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-lg text-foreground">Update Client Project</p>
                                        <p className="text-xs text-muted-foreground">{editName} ({editEmail})</p>
                                    </div>
                                </div>
                                <button onClick={() => setEditOpen(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                    <X className="w-5 h-5 text-foreground" />
                                </button>
                            </div>

                            {/* Edit Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2">Client Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Client Name</label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Client Email</label>
                                            <input
                                                type="email"
                                                value={editEmail}
                                                onChange={e => setEditEmail(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Organization / Company Name</label>
                                            <input
                                                type="text"
                                                value={editOrg}
                                                onChange={e => setEditOrg(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Project Parameters */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2">Project & SLA Specifications</h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Project Requirements / Description</label>
                                            <textarea
                                                rows={3}
                                                value={editMsg}
                                                onChange={e => setEditMsg(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Project Deadline Date</label>
                                            <input
                                                type="date"
                                                value={editDeadline}
                                                onChange={e => setEditDeadline(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Deliverables, Live Previews & Progress Reports */}
                                        <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5" /> Deliverables, Live Previews & Progress Reports
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">Visible to client in their dashboard</span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {/* Demo Preview */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                        <Laptop className="w-3 h-3 text-cyan-400" /> Website Demo / Staging Preview URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://staging.clientdomain.com"
                                                        value={editDemoUrl}
                                                        onChange={e => setEditDemoUrl(e.target.value)}
                                                        className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                                    />
                                                    <p className="text-[9px] text-muted-foreground">Clients click this to test & review their demo website</p>
                                                </div>

                                                {/* Live Production Website */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                        <Globe className="w-3 h-3 text-emerald-400" /> Live Website / Production URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://clientdomain.com"
                                                        value={editUrl}
                                                        onChange={e => setEditUrl(e.target.value)}
                                                        className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                                    />
                                                    <p className="text-[9px] text-muted-foreground">Original production domain once live</p>
                                                </div>

                                                {/* SEO & AEO Progress Report */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3 text-lime-400" /> SEO & Growth Report URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://lookerstudio.google.com/... or Google Drive link"
                                                        value={editSeoReportUrl}
                                                        onChange={e => setEditSeoReportUrl(e.target.value)}
                                                        className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                                    />
                                                    <p className="text-[9px] text-muted-foreground">Live report dashboard, ranking audit, or analytics link</p>
                                                </div>

                                                {/* Google Business Profile / Maps */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 text-amber-400" /> Google Business Profile (GBP) URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://maps.app.goo.gl/..."
                                                        value={editGbpUrl}
                                                        onChange={e => setEditGbpUrl(e.target.value)}
                                                        className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                                    />
                                                    <p className="text-[9px] text-muted-foreground">Google Maps / GBP business page link</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Contractual Agreement & SLA Summary</label>
                                             <label className="text-[10px] uppercase font-bold text-primary">💰 Assigned Amount / Price Quote to Charge (₹ / $)</label>
                                             <input
                                                 type="text"
                                                 placeholder="e.g. ₹25,000 / $500 or ₹15,000 / mo"
                                                 value={editAgreement}
                                                 onChange={e => setEditAgreement(e.target.value)}
                                                 className="w-full bg-card border border-primary/40 text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-bold"
                                             />
                                             <p className="text-[10px] text-muted-foreground">This amount will be assigned & billed to the client once accepted.</p>
                                         </div>
                                    </div>
                                </div>

                                {/* Progress & Status */}
                                <div className="space-y-4">
                                     <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2">Status & Project Milestone</h4>
                                     <div className="space-y-2">
                                         <label className="text-[10px] uppercase font-bold text-muted-foreground">Current Stage / Status</label>
                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                             {[
                                                 'New Request',
                                                 'Quote Sent',
                                                 'Quote Accepted (Project Started)',
                                                 'In Progress',
                                                 'Completed',
                                                 'Locked (Tenure Expired)'
                                             ].map((s) => (
                                                 <button
                                                     key={s}
                                                     type="button"
                                                     onClick={() => {
                                                         setEditStatus(s);
                                                         if (s === 'Quote Accepted (Project Started)' && editProgress === 0) {
                                                             setEditProgress(25);
                                                             toast.success("Quote Accepted! Project marked as Started & Active (25% Initial Phase).");
                                                         }
                                                     }}
                                                     className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${editStatus === s
                                                         ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-2 ring-primary"
                                                         : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                                                         }`}
                                                 >
                                                     {s}
                                                 </button>
                                             ))}
                                         </div>
                                     </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Roadmap Phase</label>
                                            <span className="text-sm font-bold text-primary">Phase {Math.ceil(editProgress / 20) || 1} ({editProgress}%)</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2">
                                            {[1, 2, 3, 4, 5].map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setEditProgress(p * 20)}
                                                    className={`py-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${Math.ceil(editProgress / 20) === p
                                                            ? "bg-primary/10 border-primary text-primary"
                                                            : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                                                        }`}
                                                >
                                                    <span className="text-[9px] font-bold">P{p}</span>
                                                    <div className={`w-1 h-1 rounded-full ${Math.ceil(editProgress / 20) === p ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Actions */}
                            <div className="p-6 border-t border-border bg-muted/30 flex gap-3">
                                <button
                                    onClick={() => setEditOpen(null)}
                                    className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateSubmission}
                                    disabled={updatingSub}
                                    className="flex-[2] py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {updatingSub ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ====== CREATE CLIENT PROJECT PANEL ====== */}
            <AnimatePresence>
                {createOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] flex items-center justify-center p-4 pt-24 pb-6 overflow-y-auto"
                        onClick={() => setCreateOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-lg h-[85vh] bg-popover border border-border rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-primary/10"
                        >
                            {/* Create Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <ClipboardList className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-lg text-foreground">Create Client Project</p>
                                        <p className="text-xs text-muted-foreground">Add project parameters, SLA agreements & launch details.</p>
                                    </div>
                                </div>
                                <button onClick={() => setCreateOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                    <X className="w-5 h-5 text-foreground" />
                                </button>
                            </div>

                            {/* Create Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2">Client Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Client Name *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Enter client full name"
                                                value={createName}
                                                onChange={e => setCreateName(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Client Email *</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="Enter client email address"
                                                value={createEmail}
                                                onChange={e => setCreateEmail(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Organization / Company Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter organization or company name"
                                                value={createOrg}
                                                onChange={e => setCreateOrg(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Project Parameters */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2">Project & SLA Specifications</h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Project Requirements / Description</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Outline what needs to be built..."
                                                value={createMsg}
                                                onChange={e => setCreateMsg(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Project Deadline Date</label>
                                                <input
                                                    type="date"
                                                    value={createDeadline}
                                                    onChange={e => setCreateDeadline(e.target.value)}
                                                    className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase font-bold text-muted-foreground">Live Website / SaaS App URL</label>
                                                <input
                                                    type="url"
                                                    placeholder="https://client-app.siddhidynamics.in"
                                                    value={createUrl}
                                                    onChange={e => setCreateUrl(e.target.value)}
                                                    className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Contractual Agreement & SLA Summary</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., SLA signed v1.1 - 99.9% availability, 12 months maintenance support"
                                                value={createAgreement}
                                                onChange={e => setCreateAgreement(e.target.value)}
                                                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Progress & Status */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2">Status & Milestones</h4>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Current Stage</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {['Analyzing', 'Verifying', 'In Progress', 'Validated', 'Completed'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setCreateStatus(s)}
                                                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${createStatus === s
                                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                        : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground">Roadmap Phase</label>
                                            <span className="text-sm font-bold text-primary">Phase {Math.ceil(createProgress / 20) || 1} ({createProgress}%)</span>
                                        </div>
                                        <div className="grid grid-cols-5 gap-2">
                                            {[1, 2, 3, 4, 5].map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setCreateProgress(p * 20)}
                                                    className={`py-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 ${Math.ceil(createProgress / 20) === p
                                                            ? "bg-primary/10 border-primary text-primary"
                                                            : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                                                        }`}
                                                >
                                                    <span className="text-[9px] font-bold">P{p}</span>
                                                    <div className={`w-1 h-1 rounded-full ${Math.ceil(createProgress / 20) === p ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Create Actions */}
                            <div className="p-6 border-t border-border bg-muted/30 flex gap-3">
                                <button
                                    onClick={() => setCreateOpen(false)}
                                    className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateSubmission}
                                    disabled={creatingSub}
                                    className="flex-[2] py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {creatingSub ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Create Project"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* ══════════════════════════════════════════════════════════════════ */}
            {/* AGENCY CLIENT EDIT MODAL ══════════════════════════════════════════ */}
            {/* ══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
            {editAgencyClient && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto"
                    onClick={e => e.target === e.currentTarget && setEditAgencyClient(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card shrink-0 z-10">
                            <div>
                                <h3 className="text-lg font-extrabold text-foreground">{editAgencyClient.business_name}</h3>
                                <p className="text-xs text-muted-foreground">{editAgencyClient.agency_email} · {editAgencyClient.category}</p>
                            </div>
                            <button onClick={() => setEditAgencyClient(null)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 overflow-y-auto flex-1 overscroll-contain">
                            {/* ── Service Category, SLA & Fee ─── */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary border-b border-border pb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Service Category, SLA Tenure & Retainer Fee
                                </h4>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Service Category *</label>
                                    <select
                                        value={acCategory}
                                        onChange={e => setAcCategory(e.target.value)}
                                        className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    >
                                        <option value="SEO, GEO & AEO Programme">SEO, GEO & AEO Marketing Programme</option>
                                        <option value="GBP Optimization">📍 GBP Optimization (Google Business Profile)</option>
                                        <option value="Web & Mobile App Development">Web & Mobile App Development</option>
                                        <option value="Software & ERP Solutions">Software & ERP Solutions</option>
                                        <option value="AI & Machine Learning Engineering">AI & Machine Learning Engineering</option>
                                        <option value="Business Automation & DevOps">Business Automation & DevOps</option>
                                        <option value="UI/UX Design & Branding">UI/UX Design & Branding</option>
                                        <option value="Custom Executive SLA">Custom Executive SLA</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Tenure (Months) *</label>
                                        <select
                                            value={acTenureMonths}
                                            onChange={e => setAcTenureMonths(e.target.value)}
                                            className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        >
                                            <option value="">Select duration...</option>
                                            {[3, 6, 9, 12, 18, 24, 36].map(m => (
                                                <option key={m} value={m}>{m} Months{m === 12 ? ' (Standard)' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Start Date *</label>
                                        <input
                                            type="date"
                                            value={acTenureStart}
                                            onChange={e => setAcTenureStart(e.target.value)}
                                            className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Monthly Retainer Fee (₹) *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 3000 (no ₹ sign needed)"
                                        value={acRetainerFee}
                                        onChange={e => setAcRetainerFee(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    {acRetainerFee && <p className="text-xs text-emerald-400 mt-1 font-bold">₹{parseInt(acRetainerFee).toLocaleString('en-IN')}/month · ₹{(parseInt(acRetainerFee) * (parseInt(acTenureMonths) || 12)).toLocaleString('en-IN')} total for {acTenureMonths || 12} months</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Status</label>
                                        <select
                                            value={acStatus}
                                            onChange={e => setAcStatus(e.target.value)}
                                            className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        >
                                            {['Onboarding & Audit', 'Active Optimization', 'Review Phase', 'Locked (Tenure Expired)', 'Completed'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Progress ({acProgress}%)</label>
                                        <input
                                            type="range" min={0} max={100} step={5}
                                            value={acProgress}
                                            onChange={e => setAcProgress(parseInt(e.target.value))}
                                            className="w-full accent-primary mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── SEO/GEO/GBP/AEO Scores ─── */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary border-b border-border pb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Monthly Score Update (0–100)
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'GEO Score (AI Visibility)', val: acGeoScore, set: setAcGeoScore, color: 'text-violet-400' },
                                        { label: 'SEO Score (Search)', val: acSeoScore, set: setAcSeoScore, color: 'text-cyan-400' },
                                        { label: 'GBP Score (Maps)', val: acGbpScore, set: setAcGbpScore, color: 'text-rose-400' },
                                        { label: 'AEO Score (Answers)', val: acAeoScore, set: setAcAeoScore, color: 'text-amber-400' },
                                    ].map(({ label, val, set, color }) => (
                                        <div key={label}>
                                            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${color}`}>{label}</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number" min={0} max={100}
                                                    value={val}
                                                    onChange={e => set(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)).toString())}
                                                    className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                />
                                                <span className={`text-lg font-extrabold min-w-[40px] text-right ${parseInt(val) >= 75 ? 'text-emerald-400' : parseInt(val) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{val || 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── GA Monthly Analytics ─── */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary border-b border-border pb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> GA Monthly Analytics
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Organic Impressions', val: acImpressions, set: setAcImpressions, ph: 'e.g., 12,450' },
                                        { label: 'Organic Clicks', val: acClicks, set: setAcClicks, ph: 'e.g., 1,230' },
                                        { label: 'CTR %', val: acCtr, set: setAcCtr, ph: 'e.g., 9.8%' },
                                        { label: 'AI Citations (GEO)', val: acCitations, set: setAcCitations, ph: 'e.g., 34' },
                                    ].map(({ label, val, set, ph }) => (
                                        <div key={label}>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{label}</label>
                                            <input
                                                type="text"
                                                placeholder={ph}
                                                value={val}
                                                onChange={e => set(e.target.value)}
                                                className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Create Invoice ─── */}
                            <div className="space-y-4 bg-muted/30 rounded-2xl p-4 border border-border">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Create Invoice for this Client
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Month *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., August 2026"
                                            value={acInvoiceMonth}
                                            onChange={e => setAcInvoiceMonth(e.target.value)}
                                            className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Amount (₹) *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 3000"
                                            value={acInvoiceAmount}
                                            onChange={e => setAcInvoiceAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                            className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Due Date</label>
                                        <input
                                            type="date"
                                            value={acInvoiceDue}
                                            onChange={e => setAcInvoiceDue(e.target.value)}
                                            className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
                                        <input
                                            type="text"
                                            placeholder="Monthly SEO/GEO retainer"
                                            value={acInvoiceDesc}
                                            onChange={e => setAcInvoiceDesc(e.target.value)}
                                            className="w-full bg-muted border border-border text-foreground rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreateInvoice}
                                    disabled={creatingInvoice}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all disabled:opacity-50"
                                >
                                    {creatingInvoice ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Create & Send Invoice
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 px-6 py-4 border-t border-border bg-card shrink-0 shadow-lg z-10">
                            <button
                                onClick={() => setEditAgencyClient(null)}
                                className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors border border-border text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAgencyClient}
                                disabled={savingAc}
                                className="flex-[2] py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {savingAc ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                Save & Push to Agency Portal
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* ====== 1. QUOTE & SERVICE ORDER MODAL ====== */}
            <AnimatePresence>
                {quoteModalSub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[260] flex items-center justify-center p-4 pt-20 pb-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                        onClick={() => setQuoteModalSub(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-3xl flex flex-col overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-border bg-muted/40 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Landmark className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-extrabold text-lg text-foreground">Accept & Assign Price Quote</h3>
                                        <p className="text-xs text-muted-foreground">Configure quote, service order terms & banking details for {quoteModalSub.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setQuoteModalSub(null)} className="p-2 rounded-xl hover:bg-muted text-foreground transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-left text-xs">
                                {/* Client Submitted Requirements & Scope Breakdown */}
                                {(() => {
                                    const meta = parseProjectMeta(quoteModalSub.bounty_reward);
                                    const sForm = meta.service_form;
                                    return (
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-extrabold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                    <Sparkles className="w-3.5 h-3.5" /> Client Requirements & Scope Specifications
                                                </span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                                                    sForm?.complexity_tier === 'Premium' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                                                    sForm?.complexity_tier === 'Simple' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                                                    'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                                }`}>
                                                    Complexity: {sForm?.complexity_tier || 'Standard / Growth'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                                                <div className="p-2.5 rounded-xl bg-card border border-border">
                                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Category</span>
                                                    <span className="font-bold text-foreground truncate block">{sForm?.project_category || quoteModalSub.inquiry_type || 'Custom Software'}</span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-card border border-border">
                                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Logo Status</span>
                                                    <span className="font-bold text-foreground block">
                                                        {sForm?.logo_status === 'need_logo' ? '🎨 Needs Logo Designed' : sForm?.logo_status === 'have_logo' ? '✅ Has Existing Logo' : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-card border border-border">
                                                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Brand Colors</span>
                                                    <span className="font-bold text-foreground block">{sForm?.brand_colors || 'Standard Palette'}</span>
                                                </div>
                                            </div>

                                            {sForm?.reference_websites && (
                                                <div className="text-[11px] text-muted-foreground bg-card p-2.5 rounded-xl border border-border">
                                                    <span className="font-bold text-foreground">Reference / Competitor Links:</span> {sForm.reference_websites}
                                                </div>
                                            )}

                                            {quoteModalSub.message && (
                                                <div className="text-[11px] text-muted-foreground bg-card p-2.5 rounded-xl border border-border">
                                                    <span className="font-bold text-foreground">Client Note:</span> {quoteModalSub.message}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* Pricing & Structure */}
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-4">
                                    <h4 className="font-bold text-primary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                        <Landmark className="w-3.5 h-3.5" /> Pricing & Payment Milestones
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="font-bold text-foreground">Total Agreed Price (₹ / $)</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. ₹25,000"
                                                value={quoteAmount}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setQuoteAmount(val);
                                                    const num = parseInt(val.replace(/\D/g, '') || '0');
                                                    if (num > 0) {
                                                        const pct = quotePaymentStructure.includes('100%') ? 1 : 0.5;
                                                        setQuoteAdvanceAmount(`₹${Math.round(num * pct).toLocaleString('en-IN')}`);
                                                    }
                                                }}
                                                className="w-full bg-card border border-primary/40 rounded-xl px-3 py-2 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-foreground">Advance Amount Due First</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. ₹12,500"
                                                value={quoteAdvanceAmount}
                                                onChange={e => setQuoteAdvanceAmount(e.target.value)}
                                                className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm font-bold text-emerald-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-muted-foreground">Payment Structure</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {[
                                                "50% Advance + 50% on Delivery",
                                                "100% Advance",
                                                "50% Advance + 25% Midway + 25% on Delivery"
                                            ].map(st => (
                                                <button
                                                    key={st}
                                                    type="button"
                                                    onClick={() => {
                                                        setQuotePaymentStructure(st);
                                                        const num = parseInt(quoteAmount.replace(/\D/g, '') || '0');
                                                        if (num > 0) {
                                                            const pct = st.includes('100%') ? 1 : 0.5;
                                                            setQuoteAdvanceAmount(`₹${Math.round(num * pct).toLocaleString('en-IN')}`);
                                                        }
                                                    }}
                                                    className={`p-2.5 rounded-xl border text-left font-bold transition-all text-[11px] ${quotePaymentStructure === st ? 'bg-primary/15 border-primary text-primary shadow-sm' : 'bg-card border-border text-muted-foreground hover:bg-muted'}`}
                                                >
                                                    {st}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="font-bold text-foreground">Estimated Delivery / Completion Date</label>
                                            <input
                                                type="date"
                                                value={quoteDeadline}
                                                onChange={e => setQuoteDeadline(e.target.value)}
                                                className="w-full bg-card border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="font-bold text-foreground">Scope / Deliverables Summary</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Website development & SEO setup"
                                                value={quoteScope}
                                                onChange={e => setQuoteScope(e.target.value)}
                                                className="w-full bg-card border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Banking Details Configuration */}
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                                        <div>
                                            <h4 className="font-bold text-primary uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Official Banking & Payment Credentials
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">Select and verify the official account details to be shown in the Client Service Agreement.</p>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={quoteShareBanking}
                                                onChange={e => setQuoteShareBanking(e.target.checked)}
                                                className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-xs font-bold text-foreground">Share upon payment</span>
                                        </label>
                                    </div>

                                    {/* Online Payment Mode Option requested by user: ☐ Online (UPI / Bank Transfer / Payment Link) */}
                                    <label className="flex items-start sm:items-center gap-3 cursor-pointer p-3 rounded-xl bg-card border border-border hover:border-primary transition-all">
                                        <input
                                            type="checkbox"
                                            checked={quoteBankDetails.online_payment_enabled ?? true}
                                            onChange={e => setQuoteBankDetails({ ...quoteBankDetails, online_payment_enabled: e.target.checked })}
                                            className="rounded border-border w-4 h-4 text-primary focus:ring-primary mt-0.5 sm:mt-0 shrink-0"
                                        />
                                        <div className="flex-1">
                                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                                <CreditCard className="w-3.5 h-3.5 text-primary" /> Online (UPI / Bank Transfer / Payment Link)
                                            </span>
                                            <span className="text-[11px] text-muted-foreground block">
                                                Allow clients to pay online via Cashfree checkout, instant UPI, or direct NEFT/IMPS/RTGS bank transfer.
                                            </span>
                                        </div>
                                    </label>

                                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                                        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span><strong>Protected Data:</strong> Client will only see and be able to download these banking credentials after they make the advance payment in Cashfree (or when manually approved by you).</span>
                                    </div>

                                    {quoteShareBanking && (
                                        <div className="space-y-4 pt-1">
                                            {/* Both Bank Accounts Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {(quoteBankDetails.accounts && quoteBankDetails.accounts.length > 0 ? quoteBankDetails.accounts : DEFAULT_BANK_ACCOUNTS).map((acc, idx) => (
                                                    <div key={acc.id || idx} className="p-3.5 rounded-2xl bg-card border border-border space-y-2.5 shadow-sm">
                                                        <div className="flex items-center justify-between pb-1 border-b border-border/60">
                                                            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-foreground">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={acc.is_selected ?? true}
                                                                    onChange={e => updateAccountField(idx, "is_selected", e.target.checked)}
                                                                    className="rounded border-border w-3.5 h-3.5 text-primary focus:ring-primary"
                                                                />
                                                                <span>{acc.account_type || `Account ${idx + 1}`}</span>
                                                            </label>
                                                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                                                                {acc.id === "llp" ? "Corporate LLP" : "Designated Partner"}
                                                            </span>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Holder's Name</label>
                                                            <input
                                                                type="text"
                                                                value={acc.account_holder}
                                                                onChange={e => updateAccountField(idx, "account_holder", e.target.value)}
                                                                className="w-full bg-muted/40 border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground font-semibold"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Bank Name</label>
                                                            <input
                                                                type="text"
                                                                value={acc.bank_name}
                                                                onChange={e => updateAccountField(idx, "bank_name", e.target.value)}
                                                                className="w-full bg-muted/40 border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Account Number</label>
                                                                <input
                                                                    type="text"
                                                                    value={acc.account_number}
                                                                    onChange={e => updateAccountField(idx, "account_number", e.target.value)}
                                                                    className="w-full bg-muted/40 border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground font-mono font-bold"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-muted-foreground uppercase">IFSC Code</label>
                                                                <input
                                                                    type="text"
                                                                    value={acc.ifsc_code}
                                                                    onChange={e => updateAccountField(idx, "ifsc_code", e.target.value.toUpperCase())}
                                                                    className="w-full bg-muted/40 border border-border rounded-xl px-2.5 py-1.5 text-xs text-foreground font-mono uppercase font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* UPI & Statutory Identifiers */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                <div className="space-y-1">
                                                    <label className="font-bold text-muted-foreground text-[11px]">Official UPI ID</label>
                                                    <input
                                                        type="text"
                                                        value={quoteBankDetails.upi_id || ""}
                                                        onChange={e => setQuoteBankDetails({ ...quoteBankDetails, upi_id: e.target.value })}
                                                        placeholder="6303602743@sbi"
                                                        className="w-full bg-card border border-border rounded-xl px-3 py-2 text-foreground text-xs font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="font-bold text-muted-foreground text-[11px]">LLPIN & PAN (Statutory Identifiers)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="LLPIN"
                                                            value={quoteBankDetails.llpin || ""}
                                                            onChange={e => setQuoteBankDetails({ ...quoteBankDetails, llpin: e.target.value })}
                                                            className="w-1/2 bg-card border border-border rounded-xl px-3 py-2 text-foreground text-xs"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="PAN"
                                                            value={quoteBankDetails.pan || ""}
                                                            onChange={e => setQuoteBankDetails({ ...quoteBankDetails, pan: e.target.value })}
                                                            className="w-1/2 bg-card border border-border rounded-xl px-3 py-2 text-foreground text-xs uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 bg-muted border-t border-border flex justify-end gap-2">
                                <button
                                    onClick={() => setQuoteModalSub(null)}
                                    className="px-4 py-2.5 bg-card border border-border hover:bg-muted text-xs font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveQuote}
                                    disabled={savingQuote}
                                    className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-extrabold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                                >
                                    {savingQuote ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Assign Quote & Generate Advance Invoice
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ====== 2. ADD INVOICE MODAL ====== */}
            <AnimatePresence>
                {addInvoiceSub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[260] flex items-center justify-center p-4 pt-20 pb-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                        onClick={() => setAddInvoiceSub(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden shadow-2xl text-left text-xs"
                        >
                            <div className="p-5 border-b border-border bg-muted/40 flex items-center justify-between">
                                <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-primary" /> Create Project Invoice
                                </h3>
                                <button onClick={() => setAddInvoiceSub(null)} className="p-1.5 rounded-lg hover:bg-muted text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Invoice Title / Milestone</label>
                                    <input
                                        type="text"
                                        value={invoiceTitle}
                                        onChange={e => setInvoiceTitle(e.target.value)}
                                        placeholder="e.g. Milestone 2 (Delivery Handover)"
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Amount (₹)</label>
                                        <input
                                            type="text"
                                            value={invoiceAmount}
                                            onChange={e => setInvoiceAmount(e.target.value)}
                                            placeholder="e.g. ₹12,500"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-bold text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Due Date</label>
                                        <input
                                            type="date"
                                            value={invoiceDue}
                                            onChange={e => setInvoiceDue(e.target.value)}
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Description / Deliverable Note</label>
                                    <textarea
                                        rows={2}
                                        value={invoiceDesc}
                                        onChange={e => setInvoiceDesc(e.target.value)}
                                        placeholder="Note for client invoice receipt"
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-xs"
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-muted border-t border-border flex justify-end gap-2">
                                <button onClick={() => setAddInvoiceSub(null)} className="px-4 py-2 bg-card border border-border rounded-xl font-bold">Cancel</button>
                                <button
                                    onClick={handleAddInvoice}
                                    disabled={savingInvoice}
                                    className="px-4 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {savingInvoice ? "Creating..." : "Save Invoice"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ====== 3. POST PROJECT UPDATE MODAL ====== */}
            <AnimatePresence>
                {postUpdateSub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[260] flex items-center justify-center p-4 pt-20 pb-6 bg-black/80 backdrop-blur-md overflow-y-auto"
                        onClick={() => setPostUpdateSub(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-md bg-card border border-border rounded-3xl overflow-hidden shadow-2xl text-left text-xs"
                        >
                            <div className="p-5 border-b border-border bg-muted/40 flex items-center justify-between">
                                <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary" /> Post Project Update
                                </h3>
                                <button onClick={() => setPostUpdateSub(null)} className="p-1.5 rounded-lg hover:bg-muted text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Update Headline</label>
                                    <input
                                        type="text"
                                        value={updateTitle}
                                        onChange={e => setUpdateTitle(e.target.value)}
                                        placeholder="e.g. Discovery Complete, Design System Finalized"
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-xs font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Update Details</label>
                                    <textarea
                                        rows={4}
                                        value={updateDesc}
                                        onChange={e => setUpdateDesc(e.target.value)}
                                        placeholder="Details of progress made, files uploaded, or next steps..."
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-xs"
                                    />
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        checked={updateVisible}
                                        onChange={e => setUpdateVisible(e.target.checked)}
                                        className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    <span className="font-bold text-foreground">Visible to client in their portal feed</span>
                                </label>
                            </div>
                            <div className="p-4 bg-muted border-t border-border flex justify-end gap-2">
                                <button onClick={() => setPostUpdateSub(null)} className="px-4 py-2 bg-card border border-border rounded-xl font-bold">Cancel</button>
                                <button
                                    onClick={handlePostUpdate}
                                    disabled={savingUpdate}
                                    className="px-4 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {savingUpdate ? "Posting..." : "Post Update"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* ====== RECORD COMPENSATION / PAYROLL MODAL ====== */}
                {newDisbursementModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
                        onClick={() => setNewDisbursementModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8 text-left"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-border bg-muted/40 flex items-center justify-between">
                                <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-emerald-400" /> Record Compensation / Payout
                                </h3>
                                <button onClick={() => setNewDisbursementModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePayrollRecord} className="p-5 space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Recipient Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newDisbursementForm.recipient_name}
                                            onChange={e => setNewDisbursementForm({ ...newDisbursementForm, recipient_name: e.target.value })}
                                            placeholder="e.g. Rohan Verma"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Recipient Email</label>
                                        <input
                                            type="email"
                                            value={newDisbursementForm.recipient_email}
                                            onChange={e => setNewDisbursementForm({ ...newDisbursementForm, recipient_email: e.target.value })}
                                            placeholder="e.g. rohan@siddhidynamics.in"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Role *</label>
                                        <select
                                            value={newDisbursementForm.role}
                                            onChange={e => setNewDisbursementForm({ ...newDisbursementForm, role: e.target.value as any })}
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-bold"
                                        >
                                            <option value="intern">Intern</option>
                                            <option value="employee">Employee</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Disbursement Category *</label>
                                        <select
                                            value={newDisbursementForm.disbursement_type}
                                            onChange={e => setNewDisbursementForm({ ...newDisbursementForm, disbursement_type: e.target.value as any })}
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-bold"
                                        >
                                            <option value="stipend">Monthly Stipend</option>
                                            <option value="salary">Monthly Salary</option>
                                            <option value="incentive">Performance Incentive</option>
                                            <option value="bonus">Discretionary Bonus</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Amount (₹) *</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={newDisbursementForm.amount}
                                            onChange={e => setNewDisbursementForm({ ...newDisbursementForm, amount: e.target.value })}
                                            placeholder="e.g. 15000"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-mono font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Period / Cycle</label>
                                        <input
                                            type="text"
                                            value={newDisbursementForm.period}
                                            onChange={e => setNewDisbursementForm({ ...newDisbursementForm, period: e.target.value })}
                                            placeholder="e.g. September 2026"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Certificate Reference ID (Optional)</label>
                                    <input
                                        type="text"
                                        value={newDisbursementForm.certificate_id}
                                        onChange={e => setNewDisbursementForm({ ...newDisbursementForm, certificate_id: e.target.value })}
                                        placeholder="e.g. SD-CERT-2026-089"
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-mono"
                                    />
                                    <p className="text-[10px] text-muted-foreground">If linked to an internship completion or milestone certification.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Operational Notes</label>
                                    <input
                                        type="text"
                                        value={newDisbursementForm.notes}
                                        onChange={e => setNewDisbursementForm({ ...newDisbursementForm, notes: e.target.value })}
                                        placeholder="Milestone achievements, performance notes, or bank account..."
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground"
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-2 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => setNewDisbursementModalOpen(false)}
                                        className="px-4 py-2 bg-muted border border-border rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-500/20"
                                    >
                                        Save in Compensation Ledger
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {/* ====== EDIT FULL AGENCY PROFILE & POC MODAL ====== */}
                {agencyEditModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
                        onClick={() => setAgencyEditModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8 text-left"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-border bg-muted/40 flex items-center justify-between">
                                <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary" /> Configure Agency Partner & POC Details
                                </h3>
                                <button onClick={() => setAgencyEditModalOpen(false)} className="p-1.5 rounded-lg hover:bg-muted text-foreground">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveFullAgency} className="p-5 space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Agency Business Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullAgencyForm.agency_name}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, agency_name: e.target.value })}
                                            placeholder="e.g. M² Magnetic Minds Technologies"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Agency Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={fullAgencyForm.agency_email}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, agency_email: e.target.value })}
                                            placeholder="e.g. partner@vmagneticminds.com"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Point of Contact (POC) Name</label>
                                        <input
                                            type="text"
                                            value={fullAgencyForm.agency_poc_name}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, agency_poc_name: e.target.value })}
                                            placeholder="e.g. Vikramaditya Rao"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">POC Phone Number</label>
                                        <input
                                            type="text"
                                            value={fullAgencyForm.agency_phone}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, agency_phone: e.target.value })}
                                            placeholder="e.g. +91 98490 11223"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Corporate Registered Address</label>
                                    <input
                                        type="text"
                                        value={fullAgencyForm.agency_address}
                                        onChange={e => setFullAgencyForm({ ...fullAgencyForm, agency_address: e.target.value })}
                                        placeholder="e.g. Suite 402, Cyber Towers, Hitec City, Hyderabad 500081"
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Corporate ID Type</label>
                                        <select
                                            value={fullAgencyForm.agency_id_type}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, agency_id_type: e.target.value as any })}
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-bold"
                                        >
                                            <option value="LLPIN">LLPIN</option>
                                            <option value="CIN">CIN</option>
                                            <option value="GSTIN">GSTIN</option>
                                            <option value="Not Applicable">Not Applicable</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">ID Number</label>
                                        <input
                                            type="text"
                                            value={fullAgencyForm.agency_id_number}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, agency_id_number: e.target.value })}
                                            placeholder="e.g. AAY-9021 or 36AAHCA1298K1ZT"
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Operational Model</label>
                                        <select
                                            value={fullAgencyForm.model}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, model: e.target.value as any })}
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-bold"
                                        >
                                            <option value="commission">Commission Model</option>
                                            <option value="non_commission">Non-Commission (Direct Execution)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="font-bold text-foreground">Commission Rate (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            disabled={fullAgencyForm.model !== 'commission'}
                                            value={fullAgencyForm.commission_rate}
                                            onChange={e => setFullAgencyForm({ ...fullAgencyForm, commission_rate: Number(e.target.value) })}
                                            className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground font-bold disabled:opacity-40"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-bold text-foreground">Partnership Notes</label>
                                    <input
                                        type="text"
                                        value={fullAgencyForm.notes}
                                        onChange={e => setFullAgencyForm({ ...fullAgencyForm, notes: e.target.value })}
                                        placeholder="Terms, referral arrangements, or preferred domains..."
                                        className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground"
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-2 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={() => setAgencyEditModalOpen(false)}
                                        className="px-4 py-2 bg-muted border border-border rounded-xl font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl transition-all shadow-md shadow-primary/20"
                                    >
                                        Save Agency Profile
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ====== DIGITALLY AUTHENTICATED ONLINE INVOICE MODAL ====== */}
            <DigitalInvoiceModal
                isOpen={!!selectedInvoiceForModal}
                onClose={() => setSelectedInvoiceForModal(null)}
                data={selectedInvoiceForModal}
            />
        </div>
    );
};

export default AdminPortal;
