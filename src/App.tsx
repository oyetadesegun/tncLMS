import { useState, useEffect } from "react";
import "./App.css";

// Components
import { LearnerHeader } from "./components/LearnerHeader";
import { LearnerBottomNav } from "./components/LearnerBottomNav";
import { AdminSidebar } from "./components/AdminSidebar";
import { DirectoryModal } from "./components/DirectoryModal";

// Views
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

function App() {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [lastQuizResult, setLastQuizResult] = useState<{ score: number; passed: boolean } | null>(null);

  // Parse path & params
  const cleanPath = currentPath.split("?")[0];

  const handleNavigate = (path: string) => {
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

  const isAdminRoute =
    cleanPath.startsWith("/admin") ||
    cleanPath === "/executive" ||
    cleanPath === "/assessments" ||
    cleanPath === "/assessments/create" ||
    cleanPath === "/assessments/create/rules" ||
    cleanPath === "/quiz-builder" ||
    cleanPath === "/quiz-builder/audience" ||
    cleanPath === "/question-bank" ||
    cleanPath === "/quiz/analytics";

  return (
    <div className="app-master-wrapper">
      {/* Admin Layout vs Learner Layout */}
      {isAdminRoute ? (
        <div className="admin-layout-wrapper">
          <AdminSidebar
            currentPath={cleanPath}
            onNavigate={handleNavigate}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
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
            {cleanPath === "/admin/settings" && <AdminSettingsView onNavigate={handleNavigate} />}
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
            />
          )}

          <main style={{ minHeight: "calc(100vh - 64px)" }}>
            {cleanPath === "/" && <LearnerHomeView onNavigate={handleNavigate} />}
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
            {cleanPath === "/profile" && <UserProfileView onNavigate={handleNavigate} />}
            {cleanPath === "/verify" && <VerifyPortalView onNavigate={handleNavigate} />}
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
      />
    </div>
  );
}

export default App;
