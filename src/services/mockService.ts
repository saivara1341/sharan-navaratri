/**
 * Mock Service to handle Auth and Data Persistence using localStorage.
 * This replaces the Supabase backend for a purely frontend experience.
 */

const STORAGE_KEYS = {
    USERS: "siddhi_mock_users",
    CURRENT_USER: "siddhi_mock_current_user",
    SUBMISSIONS: "siddhi_mock_submissions",
    WAITLIST: "siddhi_mock_waitlist",
};

// Initial state helpers
const getLocal = (key: string) => JSON.parse(localStorage.getItem(key) || "[]");
const setLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const mockService = {
    // --- AUTHENTICATION ---

    async signUp(email: string, password: string, fullName: string) {
        const users = getLocal(STORAGE_KEYS.USERS);
        if (users.find((u: any) => u.email === email)) {
            throw new Error("User already exists");
        }

        const newUser = { id: Math.random().toString(36).substr(2, 9), email, password, fullName };
        users.push(newUser);
        setLocal(STORAGE_KEYS.USERS, users);

        // Auto login
        setLocal(STORAGE_KEYS.CURRENT_USER, newUser);
        return { data: { user: newUser }, error: null };
    },

    async signIn(email: string, password: string) {
        const users = getLocal(STORAGE_KEYS.USERS);
        const user = users.find((u: any) => u.email === email && u.password === password);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        setLocal(STORAGE_KEYS.CURRENT_USER, user);
        return { data: { user }, error: null };
    },

    async signOut() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return { error: null };
    },

    async getCurrentUser() {
        const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "null");
        return { data: { user }, error: null };
    },

    // --- DATABASE OPERATIONS ---

    async submitContactForm(submission: any) {
        const submissions = getLocal(STORAGE_KEYS.SUBMISSIONS);
        const newSubmission = {
            ...submission,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString()
        };
        submissions.push(newSubmission);
        setLocal(STORAGE_KEYS.SUBMISSIONS, submissions);
        return newSubmission;
    },

    async addToWaitlist(entry: any) {
        const waitlist = getLocal(STORAGE_KEYS.WAITLIST);
        const exists = waitlist.find((w: any) => w.email === entry.email && w.project_id === entry.project_id);

        if (exists) {
            return { status: "already_exists", data: exists };
        }

        const newEntry = {
            ...entry,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString()
        };
        waitlist.push(newEntry);
        setLocal(STORAGE_KEYS.WAITLIST, waitlist);
        return { status: "success", data: newEntry };
    },

    async getSubmissions(email?: string) {
        const submissions = getLocal(STORAGE_KEYS.SUBMISSIONS);
        if (email) {
            return submissions.filter((s: any) => s.email === email);
        }
        return submissions.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },

    async getWaitlistEntries(email?: string) {
        const waitlist = getLocal(STORAGE_KEYS.WAITLIST);
        if (email) {
            return waitlist.filter((w: any) => w.email === email);
        }
        return waitlist.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
};
