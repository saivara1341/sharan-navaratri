import { supabase } from '@/integrations/supabase/client';
import { AgencyCommissionConfig, AgencyCommissionProject } from '@/types/projectLifecycle';

const STORAGE_KEYS = {
  COMMISSION_CONFIGS: 'siddhi_agency_commission_configs_v1',
  COMMISSION_PROJECTS: 'siddhi_agency_commission_projects_v1',
};

const DEFAULT_AGENCIES: AgencyCommissionConfig[] = [
  {
    id: 'agency-v-magnetic-minds',
    agency_name: 'The Magnetic Minds (M²)',
    agency_email: '23eg510a07@anurag.edu.in',
    model: 'commission',
    commission_rate: 15, // 15% standard commission
    status: 'active',
    agency_poc_name: 'Praneeth Rao',
    agency_phone: '+91 98490 12845',
    agency_address: 'Suite 402, Cyber Towers, Hitec City, Hyderabad, Telangana 500081',
    agency_id_type: 'LLPIN',
    agency_id_number: 'AAY-9021',
    notes: 'Primary executive agency partner for regional enterprise client acquisitions.',
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'agency-sample-non-comm',
    agency_name: 'Alpha Direct Digital',
    agency_email: 'partner@alphadigital.in',
    model: 'non_commission',
    commission_rate: 0,
    status: 'active',
    agency_poc_name: 'Vikram Mehta',
    agency_phone: '+91 91234 56789',
    agency_address: 'Plot 18, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
    agency_id_type: 'GSTIN',
    agency_id_number: '36AAHCA1298K1ZT',
    notes: 'Direct client execution tier. Fixed retainer billing model with Siddhi Dynamics.',
    created_at: '2026-02-01T00:00:00.000Z',
    updated_at: '2026-02-01T00:00:00.000Z',
  },
];

const DEFAULT_PROJECTS: AgencyCommissionProject[] = [
  {
    id: 'proj-comm-1',
    agency_email: '23eg510a07@anurag.edu.in',
    client_name: 'Sri Sai Enterprises',
    client_email: 'contact@srisaienterprises.com',
    client_phone: '+91 98480 33211',
    client_address: 'Industrial Development Area (IDA), Nacharam, Hyderabad, Telangana',
    project_name: 'Manufacturing ERP & Inventory Automation',
    service_scope: 'Cloud ERP Suite, GST Compliance, Production Workflow & Real-time Inventory Engine',
    project_value: 85000,
    inflow_status: 'verified_paid',
    inflow_utr: 'SBI-DEP-778102941',
    inflow_received_at: '2026-02-15T11:20:00.000Z',
    commission_rate: 15,
    commission_amount: 12750,
    payout_status: 'paid',
    payout_date: '2026-02-18',
    payout_reference: 'SBI-UTR-9821453210',
    invoice_no: 'SD-AGY-INV-2026-001',
    created_at: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'proj-comm-2',
    agency_email: '23eg510a07@anurag.edu.in',
    client_name: 'Global Tech Academy',
    client_email: 'admin@globaltechacademy.in',
    client_phone: '+91 80088 12345',
    client_address: 'Near Collectorate, Subhash Nagar, Nizamabad, Telangana 503002',
    project_name: 'Student Portal & Online Fee LMS',
    service_scope: 'Full-stack Student Admission & Fee Portal with Direct Banking Integration',
    project_value: 60000,
    inflow_status: 'verified_paid',
    inflow_utr: 'UPI-DEP-449102831',
    inflow_received_at: '2026-03-01T15:40:00.000Z',
    commission_rate: 15,
    commission_amount: 9000,
    payout_status: 'unpaid',
    invoice_no: 'SD-AGY-INV-2026-002',
    created_at: '2026-03-02T14:30:00.000Z',
  },
];

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Storage write failed', e);
  }
}

export const agencyCommissionService = {
  getAgencyConfigs(): AgencyCommissionConfig[] {
    return getStored<AgencyCommissionConfig[]>(STORAGE_KEYS.COMMISSION_CONFIGS, DEFAULT_AGENCIES);
  },

  getAgencyConfigByEmail(email?: string): AgencyCommissionConfig | undefined {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    const list = this.getAgencyConfigs();
    return list.find((a) => a.agency_email.toLowerCase() === clean);
  },

  saveAgencyConfig(config: Partial<AgencyCommissionConfig> & { agency_email: string }): AgencyCommissionConfig {
    const list = this.getAgencyConfigs();
    const cleanEmail = config.agency_email.trim().toLowerCase();
    const existingIndex = list.findIndex((a) => a.agency_email.toLowerCase() === cleanEmail);

    const now = new Date().toISOString();
    let saved: AgencyCommissionConfig;

    if (existingIndex >= 0) {
      saved = {
        ...list[existingIndex],
        ...config,
        agency_email: cleanEmail,
        updated_at: now,
      };
      list[existingIndex] = saved;
    } else {
      saved = {
        id: `agency-${Date.now()}`,
        agency_name: config.agency_name || cleanEmail.split('@')[0],
        agency_email: cleanEmail,
        model: config.model || 'commission',
        commission_rate: typeof config.commission_rate === 'number' ? config.commission_rate : 15,
        status: config.status || 'active',
        notes: config.notes || '',
        created_at: now,
        updated_at: now,
      };
      list.push(saved);
    }

    setStored(STORAGE_KEYS.COMMISSION_CONFIGS, list);
    return saved;
  },

  getAgencyProjects(agencyEmail?: string): AgencyCommissionProject[] {
    const all = getStored<AgencyCommissionProject[]>(STORAGE_KEYS.COMMISSION_PROJECTS, DEFAULT_PROJECTS);
    if (!agencyEmail) return all;
    const clean = agencyEmail.trim().toLowerCase();
    return all.filter((p) => p.agency_email.toLowerCase() === clean);
  },

  addAgencyProject(project: Omit<AgencyCommissionProject, 'id' | 'created_at' | 'commission_amount'>): AgencyCommissionProject {
    const all = this.getAgencyProjects();
    const commissionAmount = Math.round((project.project_value * project.commission_rate) / 100);
    const newProj: AgencyCommissionProject = {
      ...project,
      id: `comm-proj-${Date.now()}`,
      commission_amount: commissionAmount,
      created_at: new Date().toISOString(),
    };
    all.push(newProj);
    setStored(STORAGE_KEYS.COMMISSION_PROJECTS, all);
    return newProj;
  },

  markPayoutPaid(projectId: string, payoutReference: string): AgencyCommissionProject | null {
    const all = this.getAgencyProjects();
    const match = all.find((p) => p.id === projectId);
    if (!match) return null;

    match.payout_status = 'paid';
    match.payout_date = new Date().toISOString().split('T')[0];
    match.payout_reference = payoutReference;

    setStored(STORAGE_KEYS.COMMISSION_PROJECTS, all);
    return match;
  },

  calculateAgencyEarnings(agencyEmail: string) {
    const projects = this.getAgencyProjects(agencyEmail);
    const totalReferredValue = projects.reduce((sum, p) => sum + p.project_value, 0);
    const totalCommissionEarned = projects.reduce((sum, p) => sum + p.commission_amount, 0);
    const paidCommission = projects
      .filter((p) => p.payout_status === 'paid')
      .reduce((sum, p) => sum + p.commission_amount, 0);
    const pendingPayout = totalCommissionEarned - paidCommission;

    return {
      totalProjects: projects.length,
      totalReferredValue,
      totalCommissionEarned,
      paidCommission,
      pendingPayout,
    };
  },
};
