import { supabase } from '@/integrations/supabase/client';

interface DynamicQuery {
  upsert: (values: Record<string, unknown>, options?: Record<string, unknown>) => Promise<unknown>;
  delete: () => { eq: (col: string, val: string) => Promise<unknown> };
  select: (cols: string) => {
    eq: (col: string, val: string) => {
      limit: (n: number) => {
        maybeSingle: () => Promise<{ data?: { role?: string } | null; error?: unknown }>;
      };
    };
  };
}
const dynamicDb = supabase as unknown as { from: (tbl: string) => DynamicQuery };

export type PortalRole = 'admin' | 'intern' | 'employee' | 'agency' | 'client' | 'investor';

export interface PreassignedRoleEntry {
  id: string;
  email: string;
  role: PortalRole;
  name?: string;
  notes?: string;
  assigned_at: string;
  status: 'active' | 'revoked';
}

const STORAGE_KEY = 'sd_assigned_email_roles';
const LEGACY_STORAGE_KEY = 'siddhi_pre_assigned_roles';

const DEFAULT_ASSIGNED_ROLES: PreassignedRoleEntry[] = [
  {
    id: 'role-admin-1',
    email: 'ssaivaraprasad51@gmail.com',
    role: 'admin',
    name: 'Sai Vara Prasad (CEO)',
    assigned_at: '2026-01-01',
    status: 'active'
  },
  {
    id: 'role-admin-2',
    email: 'saivaraprasad@siddhidynamics.in',
    role: 'admin',
    name: 'Sai Vara Prasad',
    assigned_at: '2026-01-01',
    status: 'active'
  },
  {
    id: 'role-agency-1',
    email: '23eg510a07@anurag.edu.in',
    role: 'agency',
    name: 'V Magnetic Minds Partner',
    assigned_at: '2026-01-01',
    status: 'active'
  },
  {
    id: 'role-intern-1',
    email: 'intern@siddhidynamics.in',
    role: 'intern',
    name: 'Business Development Intern',
    assigned_at: '2026-02-01',
    status: 'active'
  },
  {
    id: 'role-intern-2',
    email: 'intern.bd@siddhidynamics.in',
    role: 'intern',
    name: 'Rohan Sharma',
    assigned_at: '2026-02-01',
    status: 'active'
  },
  {
    id: 'role-intern-3',
    email: 'intern.dm@siddhidynamics.in',
    role: 'intern',
    name: 'Ananya Verma',
    assigned_at: '2026-02-01',
    status: 'active'
  },
  {
    id: 'role-emp-1',
    email: 'employee@siddhidynamics.in',
    role: 'employee',
    name: 'Engineering Team Member',
    assigned_at: '2026-02-01',
    status: 'active'
  },
  {
    id: 'role-emp-2',
    email: 'aditya.eng@siddhidynamics.in',
    role: 'employee',
    name: 'Aditya Varma',
    assigned_at: '2026-02-01',
    status: 'active'
  }
];

export function getAssignedRoles(): PreassignedRoleEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNED_ROLES));
      return DEFAULT_ASSIGNED_ROLES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ASSIGNED_ROLES;
  }
}

export function saveAssignedRoles(entries: PreassignedRoleEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    // Also keep legacy map in sync
    const map: Record<string, string> = {};
    entries.forEach(e => {
      if (e.status === 'active') {
        map[e.email.toLowerCase()] = e.role;
      }
    });
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save assigned roles:', err);
  }
}

export function assignRoleToEmail(
  email: string,
  role: PortalRole | string,
  name?: string,
  notes?: string
): PreassignedRoleEntry {
  const cleanEmail = email.trim().toLowerCase();
  // Normalize role string
  let normalizedRole: PortalRole = 'client';
  const r = role.toLowerCase();
  if (r === 'admin') normalizedRole = 'admin';
  else if (r === 'intern') normalizedRole = 'intern';
  else if (r === 'employee') normalizedRole = 'employee';
  else if (r === 'agency' || r === 'partner') normalizedRole = 'agency';
  else if (r === 'investor') normalizedRole = 'investor';
  else normalizedRole = 'client';

  const current = getAssignedRoles();
  const existingIdx = current.findIndex(e => e.email.toLowerCase() === cleanEmail);

  const entry: PreassignedRoleEntry = {
    id: existingIdx >= 0 ? current[existingIdx].id : 'role-' + Math.random().toString(36).substring(2, 9),
    email: cleanEmail,
    role: normalizedRole,
    name: name?.trim() || cleanEmail.split('@')[0],
    notes: notes?.trim(),
    assigned_at: new Date().toISOString().split('T')[0],
    status: 'active'
  };

  let updated: PreassignedRoleEntry[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = entry;
  } else {
    updated = [entry, ...current];
  }

  saveAssignedRoles(updated);

  // Background sync to Supabase admin_preassigned_roles & portal_users
  try {
    dynamicDb
      .from('admin_preassigned_roles')
      .upsert({
        email: cleanEmail,
        role: normalizedRole,
        notes: notes || null,
        added_by: 'admin',
        added_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .then(() => {})
      .catch(() => {});

    dynamicDb
      .from('portal_users')
      .upsert({
        email: cleanEmail,
        role: normalizedRole,
        name: entry.name,
        confirmed: true
      }, { onConflict: 'email' })
      .then(() => {})
      .catch(() => {});
  } catch (_err) { void _err; }

  return entry;
}

export function deleteAssignedRole(idOrEmail: string): void {
  const current = getAssignedRoles();
  const target = idOrEmail.trim().toLowerCase();
  const updated = current.filter(r => r.id !== idOrEmail && r.email.toLowerCase() !== target);
  saveAssignedRoles(updated);

  // Background sync deletion to Supabase
  try {
    dynamicDb
      .from('admin_preassigned_roles')
      .delete()
      .eq('email', target)
      .then(() => {})
      .catch(() => {});
  } catch (_err) { void _err; }
}

export function deleteAssignedRoleByEmail(email: string): void {
  deleteAssignedRole(email);
}

/**
 * Grasp the role for any given email (e.g. from Google OAuth session or manual login)
 */
export async function resolveRoleForEmail(email?: string): Promise<PortalRole | null> {
  if (!email) return null;
  const clean = email.trim().toLowerCase();

  // 1. God mode admin emails
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'ssaivaraprasad51@gmail.com,saivaraprasad@siddhidynamics.in,careers@siddhidynamics.in,hello@siddhidynamics.in')
    .split(',')
    .map((e: string) => e.trim().toLowerCase());

  if (adminEmails.includes(clean)) {
    return 'admin';
  }

  // 2. Check local assigned roles
  const assigned = getAssignedRoles();
  const match = assigned.find(r => r.email.toLowerCase() === clean && r.status === 'active');
  if (match) {
    return match.role;
  }

  // 2b. Check legacy map
  try {
    const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawLegacy) {
      const map = JSON.parse(rawLegacy);
      if (map[clean]) {
        const mappedRole = map[clean] === 'partner' ? 'agency' : map[clean];
        assignRoleToEmail(clean, mappedRole as PortalRole);
        return mappedRole as PortalRole;
      }
    }
  } catch (_err) { void _err; }

  // 3. Fallback: check Supabase admin_preassigned_roles & portal_users
  try {
    const { data } = await dynamicDb
      .from('admin_preassigned_roles')
      .select('role')
      .eq('email', clean)
      .limit(1)
      .maybeSingle();

    if (data?.role) {
      const r = data.role.toLowerCase() === 'partner' ? 'agency' : data.role.toLowerCase();
      if (['intern', 'employee', 'agency', 'client', 'investor', 'admin'].includes(r)) {
        assignRoleToEmail(clean, r as PortalRole);
        return r as PortalRole;
      }
    }

    const { data: pUser } = await dynamicDb
      .from('portal_users')
      .select('role')
      .eq('email', clean)
      .limit(1)
      .maybeSingle();

    if (pUser?.role) {
      const r = pUser.role.toLowerCase() === 'partner' ? 'agency' : pUser.role.toLowerCase();
      if (['intern', 'employee', 'agency', 'client', 'investor', 'admin'].includes(r)) {
        assignRoleToEmail(clean, r as PortalRole);
        return r as PortalRole;
      }
    }
  } catch (_err) { void _err; }

  return null;
}

/**
 * Returns portal path for a given role
 */
export function getPortalPathForRole(role: PortalRole): string {
  switch (role) {
    case 'admin':
      return '/admin-hq-nexus';
    case 'intern':
      return '/portal/intern';
    case 'employee':
      return '/portal/employee';
    case 'agency':
      return '/portal/agency';
    case 'investor':
      return '/portal/investor';
    case 'client':
    default:
      return '/portal/client';
  }
}
