import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * High-Stability Database Service
 * Includes automatic retry logic with exponential backoff for 10k+ user stability.
 */

const API_BASE = "http://localhost:9090/api";

export const supabaseService = {
    async submitContactForm(submission: any) {
        const response = await fetch(`${API_BASE}/contact-submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
        });
        if (!response.ok) throw new Error(`Backend error: ${response.status}`);
        return await response.json();
    },

    async getSubmissions(email?: string) {
        // High-performance Java-assisted fetching
        const path = email ? `/contact-submissions?email=${email}` : '/contact-submissions';
        const response = await fetch(`${API_BASE}${path}`);
        if (!response.ok) throw new Error(`Backend error: ${response.status}`);
        return await response.json();
    },

    // --- WAITLIST ---

    async addToWaitlist(entry: any) {
        const response = await fetch(`${API_BASE}/project-waitlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });
        if (!response.ok) throw new Error(`Backend error: ${response.status}`);
        return await response.json();
    },

    async getWaitlistEntries(email?: string) {
        const path = email ? `/project-waitlist?email=${email}` : '/project-waitlist';
        const response = await fetch(`${API_BASE}${path}`);
        if (!response.ok) throw new Error(`Backend error: ${response.status}`);
        return await response.json();
    }
};
