import { useState, useEffect } from "react";
import "./App.css";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import { LearnerHeader } from "./components/LearnerHeader";
import { LearnerBottomNav } from "./components/LearnerBottomNav";
import { AdminSidebar } from "./components/AdminSidebar";
import { DirectoryModal } from "./components/DirectoryModal";

// Views
import { LoginView } from "./views/LoginView";
import { LearnerHomeView } from "./views/LearnerHomeView";
import { QuizIntroView } from "./views/QuizIntroView";
import { QuizTakeView } from "./views/QuizTakeView";
import { QuizPassedView } from "./views/QuizPassedView";
import { QuizReviewView } from "./views/QuizReviewView";
import { LeaderboardTeamView } from "./views/LeaderboardTeamView";
import { LeaderboardBadgesView } from "./views/LeaderboardBadgesView";
import { CertificatesWalletView } from "./views/CertificatesWalletView";
import { CertificatePrintView } from "./views/CertificatePrintView";
import { UserProfileView } from "./views/UserProfileView";
import { VerifyPortalView } from "./views/VerifyPortalView";
import { AdminDashboardView } from "./views/AdminDashboardView";
import { ExecutivePrecisionView } from "./views/ExecutivePrecisionView";
import { QuizAnalyticsView } from "./views/QuizAnalyticsView";
import { AssessmentsCatalogView } from "./views/AssessmentsCatalogView";
import { CreateAssessmentView } from "./views/CreateAssessmentView";
import { QuizBuilderView } from "./views/QuizBuilderView";
import { QuestionBankView } from "./views/QuestionBankView";
import { AdminPeopleView } from "./views/AdminPeopleView";
import { AdminCertificatesView } from "./views/AdminCertificatesView";
import { AdminSettingsView } from "./views/AdminSettingsView";
import { AdminCoursesView } from "./views/AdminCoursesView";

// Dataverse Services
import { Jwell_attemptsService } from "./generated/services/Jwell_attemptsService";
import { Jwell_quizsService } from "./generated/services/Jwell_quizsService";
import { Jwell_certificatesService } from "./generated/services/Jwell_certificatesService";

// ─── Admin-only routes ──────────────────────────────────────────────────────
const ADMIN_ROUTES = new Set([
  "/admin",
  "/admin/courses",
  "/executive",
  "/assessments",
  "/assessments/create",
  "/assessments/create/rules",
  "/quiz-builder",
  "/quiz-builder/audience",
  "/question-bank",
  "/quiz/analytics",
  "/admin/people",
  "/admin/certificates",
  "/admin/settings",
]);

// Super-Admin-only routes (HR Viewer and Learning Admin cannot access)
const SUPER_ADMIN_ONLY_ROUTES = new Set([
  "/admin/settings",
]);

// Public routes (no auth needed)
const PUBLIC_ROUTES = new Set(["/verify"]);

function AppInner() {
  const { user, isLoading, logout } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  const cleanPath = currentPath.split("?")[0];

  const handleNavigate = (path: string) => {
    // RBAC route guard
    if (ADMIN_ROUTES.has(path)) {
      if (!user) {
        // Not logged in → redirect to login
        setCurrentPath("/login");
        return;
      }
      if (user.role === "Learner") {
        // Learner trying to access admin → deny silently, keep them on home
        return;
      }
      if (SUPER_ADMIN_ONLY_ROUTES.has(path) && !user.isSuperAdmin) {
        // HR Viewer / HR Learning Admin trying to access super-admin-only page
        if (user.role === "HR Viewer") return; // deny
      }
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRecordAttempt = async (score: number, passed: boolean) => {
    setLastQuizResult({ score, passed });
    try {
      await Jwell_attemptsService.create({
        jwell_attemptname: `Cybersecurity Awareness Assessment (Score: ${score}% - ${passed ? "PASSED" : "REVIEW"})`,
        statecode: 0,
      });
    } catch {
      // Local preview fallback
    }
  };

  // Preload Dataverse tables to confirm connectivity
  useEffect(() => {
    async function initDataverse() {
      try {
        await Promise.allSettled([
          Jwell_quizsService.getAll(),
          Jwell_certificatesService.getAll(),
        ]);
      } catch {
        // Fallbacks active
      }
    }
    initDataverse();
  }, []);

  // Route guard effect — redirect unauthenticated users away from protected paths
  useEffect(() => {
    if (isLoading) return;
    if (!user && !PUBLIC_ROUTES.has(cleanPath) && cleanPath !== "/login") {
      setCurrentPath("/login");
    }
    // After login, redirect away from /login
    if (user && cleanPath === "/login") {
      setCurrentPath(user.isAdmin ? "/admin" : "/");
    }
    // Learner trying to land on admin route (e.g. from direct navigation or stale URL)
    if (user && user.role === "Learner" && ADMIN_ROUTES.has(cleanPath)) {
      setCurrentPath("/");
    }
  }, [isLoading, user, cleanPath]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--surface)",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div className="login-spinner" style={{ width: "2rem", height: "2rem", borderWidth: "3px" }} />
        <span className="text-secondary text-sm">Loading Transcorp LMS…</span>
      </div>
    );
  }

  // Show login page when unauthenticated
  if (!user || cleanPath === "/login") {
    return <LoginView onNavigate={handleNavigate} />;
  }

  // Public verify portal (accessible regardless of auth, but auth'd users stay logged in)
  if (cleanPath === "/verify") {
    return <VerifyPortalView onNavigate={handleNavigate} />;
  }

  const isAdminRoute = ADMIN_ROUTES.has(cleanPath);

  return (
    <div className="app-master-wrapper">
      {/* Admin Layout vs Learner Layout */}
      {isAdminRoute ? (
        <div className="admin-layout-wrapper">
          <AdminSidebar
            currentPath={cleanPath}
            onNavigate={handleNavigate}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
            user={user}
            onLogout={logout}
          />

          <main className="admin-main-viewport">
            {cleanPath === "/admin" && <AdminDashboardView onNavigate={handleNavigate} />}
            {cleanPath === "/admin/courses" && <AdminCoursesView onNavigate={handleNavigate} />}
            {cleanPath === "/executive" && <ExecutivePrecisionView onNavigate={handleNavigate} />}
            {cleanPath === "/quiz/analytics" && <QuizAnalyticsView onNavigate={handleNavigate} />}
            {cleanPath === "/assessments" && <AssessmentsCatalogView onNavigate={handleNavigate} />}
            {(cleanPath === "/assessments/create" || cleanPath === "/assessments/create/rules") && (
              <CreateAssessmentView onNavigate={handleNavigate} />
            )}
            {(cleanPath === "/quiz-builder" || cleanPath === "/quiz-builder/audience") && (
              <QuizBuilderView onNavigate={handleNavigate} />
            )}
            {cleanPath === "/question-bank" && <QuestionBankView onNavigate={handleNavigate} />}
            {cleanPath === "/admin/people" && <AdminPeopleView onNavigate={handleNavigate} />}
            {cleanPath === "/admin/certificates" && <AdminCertificatesView onNavigate={handleNavigate} />}
            {cleanPath === "/admin/settings" && user.isSuperAdmin && (
              <AdminSettingsView onNavigate={handleNavigate} />
            )}
            {cleanPath === "/admin/settings" && !user.isSuperAdmin && (
              <div className="admin-view-content">
                <div style={{ padding: "3rem", textAlign: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "var(--text-secondary)" }}>lock</span>
                  <h2 style={{ marginTop: "1rem" }}>Access Restricted</h2>
                  <p className="text-secondary">Only HR Super Admins can access Platform Settings & Role Management.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        <>
          {cleanPath !== "/certificates/view" && (
            <LearnerHeader
              currentPath={cleanPath}
              onNavigate={handleNavigate}
              onOpenDirectory={() => setIsDirectoryOpen(true)}
              title="TRANSCORP"
              user={user}
              onLogout={logout}
            />
          )}

          <main style={{ minHeight: "calc(100vh - 64px)" }}>
            {cleanPath === "/" && <LearnerHomeView onNavigate={handleNavigate} user={user} />}
            {cleanPath === "/quiz/intro" && <QuizIntroView onNavigate={handleNavigate} />}
            {cleanPath === "/quiz/take" && (
              <QuizTakeView onNavigate={handleNavigate} onRecordAttempt={handleRecordAttempt} />
            )}
            {cleanPath === "/quiz/results/passed" && (
              <QuizPassedView
                score={lastQuizResult ? String(lastQuizResult.score) : "92"}
                onNavigate={handleNavigate}
              />
            )}
            {cleanPath === "/quiz/results/review" && (
              <QuizReviewView
                score={lastQuizResult ? String(lastQuizResult.score) : "60"}
                onNavigate={handleNavigate}
              />
            )}
            {cleanPath === "/leaderboard/team" && <LeaderboardTeamView onNavigate={handleNavigate} />}
            {cleanPath === "/leaderboard/badges" && <LeaderboardBadgesView onNavigate={handleNavigate} />}
            {cleanPath === "/certificates" && <CertificatesWalletView onNavigate={handleNavigate} />}
            {cleanPath === "/certificates/view" && <CertificatePrintView onNavigate={handleNavigate} />}
            {cleanPath === "/profile" && <UserProfileView onNavigate={handleNavigate} user={user} />}
          </main>

          {cleanPath !== "/certificates/view" && (
            <LearnerBottomNav currentPath={cleanPath} onNavigate={handleNavigate} />
          )}
        </>
      )}

      {/* Global 24 Pages Directory Modal */}
      <DirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onNavigate={handleNavigate}
        user={user}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
