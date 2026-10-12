export interface PageLink {
  title: string;
  path: string;
  category: "Admin & Executive" | "Learner & Quizzes" | "Certifications & Compliance" | "Assessments & Builder";
  badge?: string;
  desc: string;
}

export const PAGES_DIRECTORY: PageLink[] = [
  // Learner & Quizzes
  { title: "Learner Home", path: "/", category: "Learner & Quizzes", badge: "Primary", desc: "Streak, XP progress, level status, assigned quizzes" },
  { title: "Quiz Intro (Cybersecurity)", path: "/quiz/intro", category: "Learner & Quizzes", desc: "Rules, proctoring notice, time limit before starting" },
  { title: "Live Assessment in Progress", path: "/quiz/take", category: "Learner & Quizzes", badge: "Interactive", desc: "Active timed test-taking screen with questions & palette" },
  { title: "Quiz Result: Passed!", path: "/quiz/results/passed", category: "Learner & Quizzes", badge: "Success", desc: "Completion score, XP award, view certificate" },
  { title: "Quiz Result: Retake / Review", path: "/quiz/results/review", category: "Learner & Quizzes", desc: "Almost there score breakdown, study guidance" },
  { title: "Team Leaderboard", path: "/leaderboard/team", category: "Learner & Quizzes", desc: "Departmental velocity, rankings, weekly top performers" },
  { title: "Leaderboard & Badges", path: "/leaderboard/badges", category: "Learner & Quizzes", desc: "Earned achievement badges, skill competencies" },
  { title: "User Profile (Amaka Okafor)", path: "/profile", category: "Learner & Quizzes", desc: "Learner credentials, activity history, account info" },

  // Admin & Executive
  { title: "Executive Admin Dashboard", path: "/admin", category: "Admin & Executive", badge: "Enterprise", desc: "Compliance metrics, departmental velocity, pass rates" },
  { title: "Corporate Courses & Trainer Governance", path: "/admin/courses", category: "Admin & Executive", badge: "HR Core", desc: "Initiate courses, assign learners as lead trainers, and scope audience to ALL or subsidiary" },
  { title: "Executive Precision Overview", path: "/executive", category: "Admin & Executive", desc: "Strategic KPI intelligence and enterprise analytics" },
  { title: "Quiz Analytics (Cybersecurity)", path: "/quiz/analytics", category: "Admin & Executive", desc: "Cohort completion, question discrimination, score distribution" },
  { title: "People & Permissions", path: "/admin/people", category: "Admin & Executive", desc: "Staff directory, enterprise roles & access control" },
  { title: "SSO & Branding Settings", path: "/admin/settings", category: "Admin & Executive", desc: "Single sign-on, identity providers, custom brand themes" },

  // Assessments & Builder
  { title: "Assessments & Live Quizzes", path: "/assessments", category: "Assessments & Builder", desc: "Comprehensive catalog of live, scheduled & draft assessments" },
  { title: "Create Assessment (Step 1: Details)", path: "/assessments/create", category: "Assessments & Builder", desc: "Title, passing score, business unit assignment" },
  { title: "Create Quiz (Step 4: Rules)", path: "/assessments/create/rules", category: "Assessments & Builder", desc: "Proctoring, countdown timers, randomized questions" },
  { title: "Quiz Question Builder", path: "/quiz-builder", category: "Assessments & Builder", desc: "Interactive question authoring, multi-choice, explanations" },
  { title: "Quiz Audience & Targeting", path: "/quiz-builder/audience", category: "Assessments & Builder", desc: "Cohort assignment, department targeting, deadlines" },
  { title: "Question Bank Management", path: "/question-bank", category: "Assessments & Builder", desc: "Centralized question repository with tags & filters" },

  // Certifications & Compliance
  { title: "Verifiable Certifications (Wallet)", path: "/certificates", category: "Certifications & Compliance", desc: "Learner digital credential wallet and active certs" },
  { title: "Printable Landscape Certificate", path: "/certificates/view", category: "Certifications & Compliance", badge: "Official", desc: "High-fidelity Transcorp Certificate of Completion (Print/PDF ready)" },
  { title: "Issued Certificates Registry", path: "/admin/certificates", category: "Certifications & Compliance", desc: "Central registry of all issued credentials & validation records" },
  { title: "Public Verification Portal", path: "/verify", category: "Certifications & Compliance", badge: "Public", desc: "Third-party certificate credential verification portal" }
];
