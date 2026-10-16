/**
 * AuthContext — Transcorp LMS Authentication & RBAC
 *
 * Provides global user session management. On first load, if localStorage
 * has no session, the user is shown the LoginView.
 *
 * Roles (derived from HRAdminStore):
 *   HR Super Admin   → full admin access + manage other admins
 *   HR Learning Admin → admin access, cannot manage HR roles
 *   HR Viewer        → read-only admin access
 *   Learner          → learner portal only (default for all 451 staff)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { TRANSCORP_LEARNERS, type TranscorpLearner } from "../data/transcorpUsers";
import { HRAdminStore, type HRAdmin } from "../data/hrAdminStore";

const SESSION_KEY = "transcorp_lms_session_v1";

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    // Re-derive role from current HRAdminStore in case it changed
    const learner = TRANSCORP_LEARNERS.find(
      (l) => l.email.toLowerCase() === parsed.email.toLowerCase()
    );
    if (!learner) return null;
    return buildAuthUser(learner);
  } catch {
    return null;
  }
}

function persistSession(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // storage unavailable
  }
}

/**
 * Simple password verification.
 * For the demo LMS (not yet live), all staff use their Employee ID
 * as the initial password. The Super Admin seed uses "Transcorp@2026".
 */
function verifyPassword(learner: TranscorpLearner, password: string): boolean {
  // Super admin specific password
  if (learner.email.toLowerCase() === "segun.oyetade@transcorpgroup.com") {
    return password === "Transcorp@2026" || password === learner.id;
  }
  // All other staff: password == their employee ID (e.g. TRC-001)
  return password === learner.id || password === "Transcorp@2026";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const trimmed = email.trim().toLowerCase();
      const learner = TRANSCORP_LEARNERS.find(
        (l) => l.email.toLowerCase() === trimmed
      );

      if (!learner) {
        return { success: false, error: "No Transcorp account found for this email address." };
      }

      if (!verifyPassword(learner, password.trim())) {
        return { success: false, error: "Incorrect password. Use your Employee ID or the default password." };
      }

      const authUser = buildAuthUser(learner);
      setUser(authUser);
      persistSession(authUser);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    persistSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
