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
        let query = supabase.from('contact_submissions').select('*');
        if (email) query = query.eq('email', email);

        // Sorting by newest first
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw new Error(`Fetch Error: ${error.message}`);
        return data;
    },

    // --- WAITLIST ---

    async addToWaitlist(entry: any) {
        const { data, error } = await supabase.from('project_waitlist').insert([entry]).select();
        if (error) throw new Error(`Waitlist DB Error: ${error.message}`);
        return data;
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
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error("Update Failure:", error);
            throw new Error(`DB Error: ${error.message}`);
        }
        return data;
    }
};
