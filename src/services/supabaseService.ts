import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Insert"];
export type WaitlistEntry = Database["public"]["Tables"]["project_waitlist"]["Insert"];

/**
 * Service to handle all Supabase database operations.
 */
export const supabaseService = {
    /**
     * Submits a contact form entry to the database.
     */
    async submitContactForm(submission: ContactSubmission) {
        const { data, error } = await supabase
            .from("contact_submissions")
            .insert([submission])
            .select()
            .single();

        if (error) {
            console.error("Error submitting contact form:", error);
            throw error;
        }

        return data;
    },

    /**
     * Adds a user to a project waitlist.
     */
    async addToWaitlist(entry: WaitlistEntry) {
        // First check if the user is already on the waitlist for this project
        const { data: existingEntry, error: checkError } = await supabase
            .from("project_waitlist")
            .select("id")
            .eq("email", entry.email)
            .eq("project_id", entry.project_id)
            .maybeSingle();

        if (checkError) {
            console.error("Error checking waitlist status:", checkError);
            throw checkError;
        }

        if (existingEntry) {
            return { status: "already_exists", data: existingEntry };
        }

        // If not, add them
        const { data, error } = await supabase
            .from("project_waitlist")
            .insert([entry])
            .select()
            .single();

        if (error) {
            console.error("Error adding to waitlist:", error);
            throw error;
        }

        return { status: "success", data };
    },

    /**
   * Fetches contact submissions, optionally filtered by email.
   */
    async getSubmissions(email?: string) {
        let query = supabase
            .from("contact_submissions")
            .select("*")
            .order("created_at", { ascending: false });

        if (email) {
            query = query.eq("email", email);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching submissions:", error);
            throw error;
        }
        return data;
    },

    /**
     * Fetches waitlist entries, optionally filtered by email.
     */
    async getWaitlistEntries(email?: string) {
        let query = supabase
            .from("project_waitlist")
            .select("*")
            .order("created_at", { ascending: false });

        if (email) {
            query = query.eq("email", email);
        }

        const { data, error } = await query;
        if (error) {
            console.error("Error fetching waitlist entries:", error);
            throw error;
        }
        return data;
    },

    /**
     * Helper to get effective Supabase BASE URL (for custom proxy handling if needed)
     */
    getEffectiveUrl() {
        return import.meta.env.DEV
            ? "/supabase-api"
            : import.meta.env.VITE_SUPABASE_URL;
    }
};
