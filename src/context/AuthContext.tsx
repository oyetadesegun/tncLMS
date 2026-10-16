/**
 * AuthContext — Transcorp LMS Power Apps Context RBAC
 *
 * In Power Apps, the logged-in user comes automatically from the platform
 * via `getContext()`. We resolve their email against the HRAdminStore to
 * determine their role:
 *
 *   HR Super Admin   → full admin access + manage other admins
 *   HR Learning Admin → admin access, cannot manage HR roles
 *   HR Viewer        → read-only admin access
 *   Learner          → learner portal only (all 451 staff default)
 *
 * For local development (when Power Apps context is unavailable) we fall
 * back to segun.oyetade@transcorpgroup.com as the active user so the
 * full admin experience is visible during development.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getContext } from "@microsoft/power-apps/app";
import { TRANSCORP_LEARNERS, type TranscorpLearner } from "../data/transcorpUsers";
import { HRAdminStore, type HRAdmin } from "../data/hrAdminStore";

export type LMSRole = HRAdmin["role"] | "Learner";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  subsidiary: string;
  department: string;
  avatar: string;
  role: LMSRole;
  /** True if this user has any admin/HR role */
  isAdmin: boolean;
  /** True if Super Admin — can manage other admin roles */
  isSuperAdmin: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Resolve a TranscorpLearner + HRAdminStore role into a full AuthUser */
function buildAuthUser(learner: TranscorpLearner): AuthUser {
  const admins = HRAdminStore.getAll();
  const adminRecord = admins.find(
    (a) => a.email.toLowerCase() === learner.email.toLowerCase()
  );
  const role: LMSRole = adminRecord?.role ?? "Learner";
  return {
    id: learner.id,
    fullName: learner.fullName,
    email: learner.email,
    subsidiary: learner.subsidiary,
    department: learner.department,
    avatar: learner.avatar,
    role,
    isAdmin: role !== "Learner",
    isSuperAdmin: role === "HR Super Admin",
  };
}

/**
 * Local-dev fallback: segun.oyetade@transcorpgroup.com
 * This user is the seeded HR Super Admin so all admin screens are visible
 * during Power Apps local preview.
 */
const DEV_FALLBACK_EMAIL = "segun.oyetade@transcorpgroup.com";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function resolveUser() {
      let email = "";
      let fullName = "";

      try {
        const ctx = await getContext();
        email = ctx.user.userPrincipalName ?? "";
        fullName = ctx.user.fullName ?? "";
      } catch {
        // Local preview — getContext() not available outside Power Apps
        email = DEV_FALLBACK_EMAIL;
        fullName = "Segun Oyetade";
      }

      if (!email) {
        email = DEV_FALLBACK_EMAIL;
        fullName = "Segun Oyetade";
      }

      // Find this user in the Transcorp directory
      const learner = TRANSCORP_LEARNERS.find(
        (l) => l.email.toLowerCase() === email.toLowerCase()
      );

      if (learner) {
        setUser(buildAuthUser(learner));
      } else {
        // User exists in Azure AD / Entra but not yet provisioned in the LMS directory
        // Treat as a basic learner with the identity from context
        const initials = fullName
          .split(" ")
          .filter(Boolean)
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        // Check if they're an admin anyway
        const admins = HRAdminStore.getAll();
        const adminRecord = admins.find(
          (a) => a.email.toLowerCase() === email.toLowerCase()
        );
        const role: LMSRole = adminRecord?.role ?? "Learner";

        setUser({
          id: "UNK",
          fullName: fullName || email.split("@")[0],
          email,
          subsidiary: "Transcorp Group",
          department: "—",
          avatar: initials || "?",
          role,
          isAdmin: role !== "Learner",
          isSuperAdmin: role === "HR Super Admin",
        });
      }

      setIsLoading(false);
    }

    resolveUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
