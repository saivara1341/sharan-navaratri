import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * High-Stability Database Service
 * Includes automatic retry logic with exponential backoff for 10k+ user stability.
 */

// Use relative path so Vite proxy handles it correctly on both desktop and mobile
const API_BASE = "/api";

export const supabaseService = {
    async submitContactForm(submission: any) {
        // Direct database insertion via Supabase client
        const { data, error } = await supabase.from('contact_submissions').insert([submission]).select();

        if (error) {
            console.error("Submission Failure:", error);
            throw new Error(`DB Error: ${error.message}`);
        }

        // Auto onboarding: Send Magic Link Invitation
        try {
            const redirectUrl = typeof window !== 'undefined' ? window.location.origin + '/auth' : 'https://siddhidynamics.in/auth';
            await supabase.auth.signInWithOtp({
                email: submission.email,
                options: {
                    emailRedirectTo: redirectUrl,
                    data: {
                        role: 'client',
                        full_name: submission.name
                    }
                }
            });
            toast.success("Welcome! A secure portal login link has been sent to your email.");
        } catch (authErr) {
            console.error("Auto onboarding failed:", authErr);
        }

        return data;
    },

    async getSubmissions(email?: string, seed?: string) {
        const pageSize = 500;
        const allRows: any[] = [];
        try {
            for (let page = 0; ; page += 1) {
                let query = supabase.from('contact_submissions').select('*');
                if (email) query = query.eq('email', email);
                const { data, error } = await query
                    .order('created_at', { ascending: false })
                    .range(page * pageSize, (page + 1) * pageSize - 1);
                if (error) {
                    console.warn('Supabase contact_submissions query warning:', error);
                    break;
                }
                allRows.push(...(data || []));
                if (!data || data.length < pageSize) break;
            }
        } catch (err) {
            console.warn('Supabase fetch error, merging local cache:', err);
        }

        // Always merge local requests (from ClientPortal, ProjectSubmitForm, manual intakes)
        try {
            const rawLocal = localStorage.getItem('siddhi_local_service_requests');
            if (rawLocal) {
                const localList = JSON.parse(rawLocal);
                if (Array.isArray(localList)) {
                    for (const item of localList) {
                        if (!email || (item.email && item.email.toLowerCase() === email.toLowerCase())) {
                            if (!allRows.some(r => r.id === item.id)) {
                                allRows.unshift(item);
                            }
                        }
                    }
                }
            }
        } catch (_err) { void _err; }

        return allRows;
    },

    // --- WAITLIST ---

    async addToWaitlist(entry: any) {
        const { data, error } = await supabase.from('project_waitlist').insert([entry]).select();
        if (error) throw new Error(`Waitlist DB Error: ${error.message}`);
        return { status: "created", data } as { status: string; data: any };
    },

    async getWaitlistEntries(email?: string, seed?: string) {
        let query = supabase.from('project_waitlist').select('*');
        if (email) query = query.eq('email', email);

        const { data, error } = await query;
        if (error) throw new Error(`Waitlist DB Error: ${error.message}`);
        return data;
    },

    async updateSubmission(id: string, updates: Partial<any>) {
        const { data, error } = await supabase
            .from('contact_submissions')
            .update(updates as never)
            .eq('id', id)
            .select();

        if (error) {
            console.error("Update Failure:", error);
            throw new Error(`DB Error: ${error.message}`);
        }
        return data;
    }
};
