import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type PortalRole = "client" | "partner" | "employee" | "investor" | "admin";

const VALID: PortalRole[] = ["client", "partner", "employee", "investor", "admin"];

/**
 * Resolves the portal role for a signed-in user.
 * Magic-link / OAuth sessions often carry no `role` in user_metadata, so we
 * fall back to the portal_users record and finally to "client" instead of
 * bouncing the user back to the gateway in a redirect loop.
 */
export const resolvePortalRole = async (session: Session): Promise<PortalRole> => {
  const metaRole = session.user.user_metadata?.role as PortalRole | undefined;
  if (metaRole && VALID.includes(metaRole)) return metaRole;

  const email = session.user.email?.trim().toLowerCase();
  if (email) {
    const { data } = await supabase
      .from("portal_users")
      .select("role")
      .eq("email", email)
      .maybeSingle();
    const dbRole = data?.role as PortalRole | undefined;
    if (dbRole && VALID.includes(dbRole)) return dbRole;
  }

  return "client";
};
