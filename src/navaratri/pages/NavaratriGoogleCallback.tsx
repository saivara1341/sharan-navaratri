import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useNavaratriData } from "../context/NavaratriDataContext";
import { navaratriAsset } from "../utils/navaratriAssets";

type Status = "loading" | "matched" | "not_found" | "error";

export const NavaratriGoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { mandapams, setActiveMandapamId, setRole } = useNavaratriData();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your Google account…");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      try {
        // Wait for Supabase to process the OAuth tokens from the URL hash/code
        const { data: sessionData, error: sessionErr } =
          await supabase.auth.getSession();

        if (sessionErr || !sessionData.session) {
          // Try exchanging the code if needed (PKCE flow)
          const { error: exchangeErr } =
            await supabase.auth.exchangeCodeForSession(window.location.href);
          if (exchangeErr) throw exchangeErr;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          throw new Error("No session found after OAuth.");
        }

        const googleEmail = session.user.email?.toLowerCase().trim() ?? "";
        const googleName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "";

        setMessage(`Signed in as ${googleEmail}. Looking for your mandapam…`);

        // Build pool: in-memory mandapams + localStorage
        const pool = [...mandapams];
        try {
          const stored = localStorage.getItem("navaratri_mandapams");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              for (const item of parsed) {
                if (item?.id && !pool.some((m) => m.id === item.id))
                  pool.push(item);
              }
            }
          }
        } catch { /* ignore */ }

        // Match Google email against organizerEmail
        const matched = pool.find(
          (m) =>
            m.organizerEmail &&
            m.organizerEmail.toLowerCase().trim() === googleEmail
        );

        if (matched) {
          // ── Existing organizer ──────────────────────────────────────────
          sessionStorage.setItem("navaratri_organizer_id", matched.id);
          localStorage.setItem("navaratri_organizer_id", matched.id);
          sessionStorage.setItem("navaratri_google_auth", "true");
          setActiveMandapamId(matched.id);
          setRole("organizer");
          setStatus("matched");
          setMessage(`Welcome back, ${matched.name}! Taking you to your portal…`);

          // Persist login audit
          const sessionId = crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36);
          sessionStorage.setItem("navaratri_session_id", sessionId);
          (supabase.from("navaratri_organizer_logins") as any)
            .insert({
              mandapam_id: matched.id,
              mandapam_name: matched.name,
              login_mode: "google",
              session_id: sessionId,
              user_agent:
                typeof navigator !== "undefined"
                  ? navigator.userAgent.slice(0, 255)
                  : null,
            })
            .then(() => { /* fire-and-forget */ });

          // Ensure database link between auth.users and navaratri_mandapams
          (supabase.from("navaratri_mandapams") as any)
            .update({
              owner_user_id: session.user.id,
              organizer_email: googleEmail,
              verification_status: "VERIFIED",
              last_login_at: new Date().toISOString()
            })
            .eq("id", matched.id)
            .then(() => { /* fire-and-forget */ });

          setTimeout(() => navigate("/navaratri/organizer"), 1200);
        } else {
          // ── New user — send to register with prefilled data ────────────
          setStatus("not_found");
          setMessage(
            "No mandapam found for this Google account. Redirecting to registration…"
          );
          const params = new URLSearchParams();
          if (googleEmail) params.set("email", googleEmail);
          if (googleName) params.set("name", googleName);
          params.set("via", "google");
          setTimeout(
            () => navigate(`/navaratri/register?${params.toString()}`),
            1500
          );
        }
      } catch (err: any) {
        console.error("[GoogleCallback]", err);
        setStatus("error");
        setMessage(
          err?.message || "Something went wrong. Redirecting to login…"
        );
        setTimeout(() => navigate("/navaratri/login"), 2000);
      }
    };

    run();
  }, [mandapams, navigate, setActiveMandapamId, setRole]);

  // ── UI ────────────────────────────────────────────────────────────────────
  const icons: Record<Status, React.ReactNode> = {
    loading: (
      <div className="w-12 h-12 rounded-full border-4 border-amber-300 border-t-[#8B1E1E] animate-spin" />
    ),
    matched: (
      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    not_found: (
      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
  };

  const bgColors: Record<Status, string> = {
    loading: "from-amber-50 to-white",
    matched: "from-emerald-50 to-white",
    not_found: "from-amber-50 to-white",
    error: "from-red-50 to-white",
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center px-4 py-8 bg-[#5d6f51] overflow-x-hidden">
      {/* Background */}
      <div
        className="md:hidden absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${navaratriAsset("/navaratri/assets/sage-floral-bg.jpg")})` }}
      />
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${navaratriAsset("/navaratri/assets/sage-floral-desktop-bg.jpg")})` }}
      />
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xs">
        <div className={`bg-gradient-to-br ${bgColors[status]} backdrop-blur-md p-8 rounded-3xl border-2 border-amber-300 shadow-2xl flex flex-col items-center gap-5 text-center`}>
          {/* Google logo */}
          <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center border border-stone-200">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>

          {icons[status]}

          <div>
            <p className="text-sm font-semibold text-stone-700 leading-snug">{message}</p>
            {status === "loading" && (
              <p className="text-xs text-stone-400 mt-1">Please wait…</p>
            )}
          </div>

          {/* Sharan branding */}
          <p className="text-[10px] text-stone-400 font-medium tracking-wide">
            SHARAN NAVARATRI 2026
          </p>
        </div>
      </div>
    </div>
  );
};
