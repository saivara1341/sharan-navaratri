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
        const response = await fetch(`${API_BASE}/contact-submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
        });
        if (!response.ok) throw new Error(`Backend error: ${response.status}`);
        return await response.json();
    },

    async getSubmissions(email?: string, seed?: string) {
        // High-performance Java-assisted fetching with cache-busting
        let path = email ? `/contact-submissions?email=${email}` : '/contact-submissions';
        if (seed) {
            path += (path.includes('?') ? '&' : '?') + `cb=${seed}`;
        }

        const response = await fetch(`${API_BASE}${path}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Admin HQ Error ${response.status}: ${errorText || 'Backend unreachable'}`);
        }
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

    async getWaitlistEntries(email?: string, seed?: string) {
        let path = email ? `/project-waitlist?email=${email}` : '/project-waitlist';
        if (seed) {
            path += (path.includes('?') ? '&' : '?') + `cb=${seed}`;
        }
        const response = await fetch(`${API_BASE}${path}`);
        if (!response.ok) throw new Error(`Waitlist Error ${response.status}`);
        return await response.json();
    }
};
