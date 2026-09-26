import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, DollarSign, Users, PieChart, ShieldCheck,
  Plus, X, Mail, Phone, ExternalLink, RefreshCw, Send,
  FileText, CheckCircle2, Award, Building, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import { assignRoleToEmail, deleteAssignedRole } from '@/lib/roleResolver';

interface InvestorRecord {
  id: string;
  name: string;
  firm: string;
  email: string;
  phone?: string;
  type: 'Angel Investor' | 'Venture Capital' | 'Family Office' | 'Syndicate';
  committed_inr: number;
  equity_pct: number;
  status: 'Whitelisted' | 'Under Review' | 'Term Sheet Issued' | 'Closed';
  nda_signed: boolean;
  added_at: string;
  notes?: string;
}

interface InvestorUpdatePost {
  id: string;
  quarter: string; // e.g. "Q3 FY26"
  headline: string;
  arr_metrics: string;
  highlights: string[];
  posted_at: string;
}

const STORAGE_INVESTORS = 'sd_admin_investors_v1';
const STORAGE_UPDATES = 'sd_investor_broadcasts_v1';

const DEFAULT_INVESTORS: InvestorRecord[] = [
  {
    id: 'inv-1',
    name: 'Srinivas Murthy',
    firm: 'Deccan Angel Network',
    email: 'srinivas.murthy@deccanangels.in',
    phone: '9849011223',
    type: 'Angel Investor',
    committed_inr: 2500000,
    equity_pct: 1.25,
    status: 'Whitelisted',
    nda_signed: true,
    added_at: '2026-02-10',
    notes: 'Strategic backing for PrintFlow regional distribution across Telangana & AP.'
  },
  {
    id: 'inv-2',
    name: 'Anirudh Singhania',
    firm: 'Singhania Family Office',
    email: 'anirudh@singhaniafo.com',
    phone: '9820011445',
    type: 'Family Office',
    committed_inr: 5000000,
    equity_pct: 2.5,
    status: 'Whitelisted',
    nda_signed: true,
    added_at: '2026-02-20',
    notes: 'Interested in AI automation tooling and SaaS ERP enterprise growth.'
  },
  {
    id: 'inv-3',
    name: 'Rajeshwari Chalasani',
    firm: 'Hyderabad Tech Angels',
    email: 'rajeshwari.c@hyderabadangels.org',
    phone: '9949012345',
    type: 'Angel Investor',
    committed_inr: 1500000,
    equity_pct: 0.75,
    status: 'Term Sheet Issued',
    nda_signed: true,
    added_at: '2026-03-01',
    notes: 'Following up after demo day showcase of Siddhi Dynamics engine.'
  }
];

const DEFAULT_UPDATES: InvestorUpdatePost[] = [
  {
    id: 'up-1',
    quarter: 'Q3 FY2026',
    headline: 'PrintFlow SaaS Beta Launch & MSME Pilot Milestone',
    arr_metrics: 'ARR Runway: ₹48.5L · 12 Commercial Printers Onboarded',
    highlights: [
      'PrintFlow ERP deployed to 12 printing press operators across Nizamabad & Hyderabad hubs.',
      'Achieved 100% automated QR & UTR invoice verification engine.',
      'Gross margins consistently maintaining >82% across AI automation deliverables.'
    ],
    posted_at: '2026-09-15'
  }
];

export function AdminInvestorsConsole() {
  const [investors, setInvestors] = useState<InvestorRecord[]>([]);
  const [updates, setUpdates] = useState<InvestorUpdatePost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPostUpdateModal, setShowPostUpdateModal] = useState(false);

  const loadData = () => {
    try {
      const rawInv = localStorage.getItem(STORAGE_INVESTORS);
      setInvestors(rawInv ? JSON.parse(rawInv) : DEFAULT_INVESTORS);
      const rawUp = localStorage.getItem(STORAGE_UPDATES);
      setUpdates(rawUp ? JSON.parse(rawUp) : DEFAULT_UPDATES);
    } catch {
      setInvestors(DEFAULT_INVESTORS);
      setUpdates(DEFAULT_UPDATES);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveInvestors = (list: InvestorRecord[]) => {
    setInvestors(list);
    localStorage.setItem(STORAGE_INVESTORS, JSON.stringify(list));
  };

  const saveUpdates = (list: InvestorUpdatePost[]) => {
    setUpdates(list);
    localStorage.setItem(STORAGE_UPDATES, JSON.stringify(list));
  };

  const handleAddInvestor = (data: Omit<InvestorRecord, 'id' | 'added_at'>) => {
    const newInv: InvestorRecord = {
      ...data,
      id: 'inv-' + Math.random().toString(36).substring(2, 9),
      added_at: new Date().toISOString().split('T')[0]
    };
    const updated = [newInv, ...investors];
    saveInvestors(updated);

    // Whitelist role in roleResolver
    assignRoleToEmail(newInv.email, 'investor', newInv.name, `Investor from ${newInv.firm}`);
    toast.success(`Investor ${newInv.name} enrolled & assigned Investor Portal role!`);
    setShowAddModal(false);
  };

  const handlePostUpdate = (quarter: string, headline: string, arr: string, points: string) => {
    const newUp: InvestorUpdatePost = {
      id: 'up-' + Math.random().toString(36).substring(2, 9),
      quarter,
      headline,
      arr_metrics: arr,
      highlights: points.split('\n').filter(p => p.trim()),
      posted_at: new Date().toISOString().split('T')[0]
    };
    const updated = [newUp, ...updates];
    saveUpdates(updated);
    toast.success(`Quarterly update broadcasted to Investor Portal!`);
    setShowPostUpdateModal(false);
  };

  const totalCommitted = investors.reduce((sum, inv) => sum + (inv.committed_inr || 0), 0);
  const totalEquityCommitted = investors.reduce((sum, inv) => sum + (inv.equity_pct || 0), 0);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">Investor Portal Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Cap Table governance, accredited investor whitelist, and quarterly financial broadcasts.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/portal/investor"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all shadow-xs"
          >
            <span>Preview Investor Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
          </a>

          <button
            onClick={() => setShowPostUpdateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-amber-500" /> Broadcast Update
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-md shadow-primary/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> + Whitelist Investor
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Round Stage</span>
          <p className="text-xl font-black text-foreground">Seed / Pre-Series A</p>
          <p className="text-[11px] text-primary font-bold">Target: ₹2.50 Cr</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Committed Capital</span>
          <p className="text-xl font-black text-emerald-500">₹{(totalCommitted / 100000).toFixed(1)} Lakhs</p>
          <p className="text-[11px] text-muted-foreground">{((totalCommitted / 25000000) * 100).toFixed(0)}% of Round Filled</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Equity Allocated</span>
          <p className="text-xl font-black text-foreground">{totalEquityCommitted.toFixed(2)}%</p>
          <p className="text-[11px] text-muted-foreground">Cap: 12.5% Maximum</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Whitelisted Investors</span>
          <p className="text-xl font-black text-foreground">{investors.length}</p>
          <p className="text-[11px] text-muted-foreground">Role Authorized for Portal</p>
        </div>
      </div>

      {/* Investors Roster */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
          <Building className="w-4 h-4 text-primary" /> Whitelisted Investors & Partners ({investors.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {investors.map(inv => (
            <div
              key={inv.id}
              className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{inv.name}</h4>
                    <p className="text-xs text-muted-foreground">{inv.firm}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                    {inv.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commitment:</span>
                    <strong className="text-emerald-500">₹{(inv.committed_inr / 100000).toFixed(1)} Lakhs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equity Allocation:</span>
                    <strong className="text-foreground">{inv.equity_pct}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NDA Status:</span>
                    <strong className={inv.nda_signed ? 'text-lime-500' : 'text-amber-500'}>
                      {inv.nda_signed ? '✓ Signed' : 'Pending'}
                    </strong>
                  </div>
                </div>

                {inv.notes && (
                  <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                    "{inv.notes}"
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">{inv.email}</span>
                </div>

                <div className="flex items-center gap-1">
                  <a href={`mailto:${inv.email}`} className="p-1.5 rounded-lg hover:bg-muted text-primary" title="Email Investor">
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  {inv.phone && (
                    <a href={`tel:${inv.phone}`} className="p-1.5 rounded-lg hover:bg-muted text-emerald-500" title="Call Investor">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcasted Quarterly Updates */}
      <div className="space-y-3 pt-2">
        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Investor Quarterly Reports & Milestone Broadcasts
        </h3>

        <div className="space-y-3">
          {updates.map(up => (
            <div key={up.id} className="p-4 rounded-2xl bg-card border border-border space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2">
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 mr-2">
                    {up.quarter}
                  </span>
                  <span className="font-bold text-foreground text-sm">{up.headline}</span>
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">{up.posted_at}</span>
              </div>
              <p className="text-xs font-semibold text-emerald-500">{up.arr_metrics}</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                {up.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Add Investor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-foreground text-base">Whitelist Accredited Investor</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement)?.value || '';
                  handleAddInvestor({
                    name: getVal('invName'),
                    firm: getVal('firm'),
                    email: getVal('email').trim().toLowerCase(),
                    phone: getVal('phone'),
                    type: getVal('invType') as 'Angel' | 'Institutional' | 'Family Office',
                    committed_inr: Number(getVal('committed')) || 1000000,
                    equity_pct: Number(getVal('equity')) || 1,
                    status: getVal('status') as 'Term Sheet Issued' | 'Committed' | 'Funds Received',
                    nda_signed: true,
                    notes: getVal('notes')
                  });
                }}
                className="space-y-3 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Investor Name *</label>
                    <input name="invName" required placeholder="e.g. Srinivas Murthy" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Firm / Syndicate</label>
                    <input name="firm" required placeholder="e.g. Hyderabad Angels" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Email *</label>
                    <input name="email" type="email" required placeholder="investor@example.com" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Phone</label>
                    <input name="phone" placeholder="10-digit number" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Committed Amount (INR ₹) *</label>
                    <input name="committed" type="number" required defaultValue={2500000} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-bold" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Equity Percentage (%) *</label>
                    <input name="equity" type="number" step="0.01" required defaultValue={1.25} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Investor Type</label>
                    <select name="invType" defaultValue="Angel Investor" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium">
                      <option value="Angel Investor">Angel Investor</option>
                      <option value="Venture Capital">Venture Capital</option>
                      <option value="Family Office">Family Office</option>
                      <option value="Syndicate">Syndicate</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Initial Status</label>
                    <select name="status" defaultValue="Whitelisted" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium">
                      <option value="Whitelisted">Whitelisted & Active</option>
                      <option value="Term Sheet Issued">Term Sheet Issued</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Notes</label>
                  <input name="notes" placeholder="Strategic focus, investment criteria..." className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Whitelist & Assign Role</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Broadcast Update Modal */}
      <AnimatePresence>
        {showPostUpdateModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowPostUpdateModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-extrabold text-foreground text-base">Broadcast Update to Investor Portal</h3>
                <button onClick={() => setShowPostUpdateModal(false)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement)?.value || '';
                  handlePostUpdate(getVal('quarter'), getVal('headline'), getVal('arr'), getVal('highlights'));
                }}
                className="space-y-3 text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Quarter / Period *</label>
                    <input name="quarter" required defaultValue="Q4 FY2026" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">Financial / Runway Metric *</label>
                    <input name="arr" required defaultValue="ARR: ₹52.4L · Runway: 18 Mos" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Update Headline *</label>
                  <input name="headline" required placeholder="e.g. Milestone Release: Multi-Tenant Architecture & Pilot Rollout" className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium" />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Bullet Points / Highlights (One per line) *</label>
                  <textarea name="highlights" rows={3} required defaultValue={`Deployed high-performance database indexing across all 5 portals.\nSigned 3 regional manufacturing enterprise pilots.\nExpanded product squad with active contributors.`} className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-medium resize-none" />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setShowPostUpdateModal(false)} className="flex-1 py-2 rounded-xl border border-border text-muted-foreground font-bold hover:bg-muted text-xs">Cancel</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-md">Broadcast Update</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
