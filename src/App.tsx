import { useState, useEffect } from "react";
import "./App.css";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import { LearnerHeader } from "./components/LearnerHeader";
import { LearnerBottomNav } from "./components/LearnerBottomNav";
import { AdminSidebar } from "./components/AdminSidebar";
import { DirectoryModal } from "./components/DirectoryModal";

// Views — Learner
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

// Views — Admin
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

// ─── Route sets ───────────────────────────────────────────────────────────────
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

// ─── App inner (has access to AuthContext) ────────────────────────────────────
function AppInner() {
  const { user, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  const cleanPath = currentPath.split("?")[0];

  const handleNavigate = (path: string) => {
    // RBAC guard — Learners cannot navigate to admin routes
    if (ADMIN_ROUTES.has(path)) {
      if (!user || user.role === "Learner") return;
      // HR Viewer: read-only, block destructive/creator routes
      if (user.role === "HR Viewer") {
        const viewerBlocked = new Set([
          "/assessments/create", "/assessments/create/rules",
          "/quiz-builder", "/quiz-builder/audience",
          "/question-bank", "/admin/settings",
        ]);
        if (viewerBlocked.has(path)) return;
      }
      // Settings only for Super Admin
      if (path === "/admin/settings" && !user.isSuperAdmin) return;
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If user changes (admin role updated), re-evaluate current path
  useEffect(() => {
    if (isLoading || !user) return;
    if (user.role === "Learner" && ADMIN_ROUTES.has(cleanPath)) {
      setCurrentPath("/");
    }
  }, [user, isLoading]);

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

  // Preload Dataverse tables
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

  // Loading splash while resolving Power Apps context
  if (isLoading) {
    return (
      <div className="app-loading-splash">
        <div className="app-loading-brand">
          <div className="brand-logo-letter">T</div>
          <div>
            <div className="brand-main-text">TRANSCORP</div>
            <div className="brand-sub-text">Learning Assessment Hub</div>
          </div>
        </div>
        <div className="app-loading-spinner" />
        <p className="app-loading-label">Loading your learning environment…</p>
      </div>
    );
  }

  const isAdminRoute = ADMIN_ROUTES.has(cleanPath);

  // Access denied — learner tried to reach admin
  const showAccessDenied = isAdminRoute && (!user || user.role === "Learner");

  return (
    <div className="app-master-wrapper">
      {isAdminRoute && !showAccessDenied ? (
        /* ── Admin Layout ────────────────────────────────────────────────────── */
        <div className="admin-layout-wrapper">
          <AdminSidebar
            currentPath={cleanPath}
            onNavigate={handleNavigate}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
            user={user}
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
            {cleanPath === "/admin/settings" && user?.isSuperAdmin && (
              <AdminSettingsView onNavigate={handleNavigate} />
            )}
            {cleanPath === "/admin/settings" && user && !user.isSuperAdmin && (
              <div className="admin-view-content">
                <div className="access-denied-panel">
                  <span className="material-symbols-outlined access-denied-icon">lock</span>
                  <h2>Access Restricted</h2>
                  <p className="text-secondary">Only HR Super Admins can access Platform Settings & Role Management.</p>
                  <button onClick={() => handleNavigate("/admin")} className="btn-primary-action" style={{ marginTop: "1.5rem" }}>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* ── Learner Layout ──────────────────────────────────────────────────── */
        <>
          {cleanPath !== "/certificates/view" && (
            <LearnerHeader
              currentPath={cleanPath}
              onNavigate={handleNavigate}
              onOpenDirectory={() => setIsDirectoryOpen(true)}
              title="TRANSCORP"
              user={user}
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
            {cleanPath === "/verify" && <VerifyPortalView onNavigate={handleNavigate} />}
          </main>

          {cleanPath !== "/certificates/view" && (
            <LearnerBottomNav currentPath={cleanPath} onNavigate={handleNavigate} />
          )}
        </>
      )}

      {/* Global Page Directory Modal */}
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
