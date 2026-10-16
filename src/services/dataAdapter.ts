/**
 * LMS Data Adapter Interface
 * 
 * Defines the contract for fetching and mutating LMS data.
 * Currently backed by Microsoft Dataverse (Power Apps).
 * Designed to easily switch to SharePoint Lists / Microsoft Graph in production
 * by simply swapping the active adapter implementation without altering any UI components.
 */

import type { TranscorpLearner } from "../data/transcorpUsers";
import type { Course } from "../data/coursesStore";
import type { Jwell_quizs } from "../generated/models/Jwell_quizsModel";
import type { Jwell_questions } from "../generated/models/Jwell_questionsModel";
import type { Jwell_answeroptions } from "../generated/models/Jwell_answeroptionsModel";
import type { Jwell_certificates } from "../generated/models/Jwell_certificatesModel";
import type { Jwell_badges } from "../generated/models/Jwell_badgesModel";

export interface LMSAssessment {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "Active" | "Scheduled" | "Draft" | "In Review" | "Closed";
  passMarkPercent: number;
  timeLimitMinutes: number;
  questionsCount: number;
  cohort: string;
  retakePolicy: string;
  maxAttempts: number;
  certificateEnabled: boolean;
  trainerName?: string;
  trainerEmail?: string;
  createdOn?: string;
}

export interface LMSQuestion {
  id: string;
  quizId?: string;
  questionText: string;
  scenario?: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  explanation?: string;
  timesUsed?: number;
  timesCorrect?: number;
  author?: string;
}

export interface LMSCertificate {
  id: string;
  credentialId: string;
  recipientName: string;
  recipientEmail: string;
  courseTitle: string;
  issuer: string;
  standard: string;
  scorePercent: number;
  issuedDate: string;
  expiryDate: string;
  status: "Valid" | "Expiring Soon" | "Expired";
}

export interface LMSBadge {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  earnedDate?: string;
  unlocked: boolean;
}

export interface LMSQuizAttempt {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  userEmail: string;
  userName: string;
  scorePercent: number;
  passed: boolean;
  dateCompleted: string;
  answers: Record<string, number>;
}

export interface ILMSDataAdapter {
  readonly providerName: "Dataverse" | "SharePoint";

  // Courses / Trainings
  getCourses(): Promise<Course[]>;
  createCourse(course: Omit<Course, "id">): Promise<Course>;
  updateCourse(id: string, updates: Partial<Course>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;

  // Assessments / Quizzes
  getAssessments(): Promise<LMSAssessment[]>;
  getAssessmentById(id: string): Promise<LMSAssessment | null>;
  createAssessment(assessment: Omit<LMSAssessment, "id">): Promise<LMSAssessment>;

  // Questions & Options
  getQuestions(quizId?: string): Promise<LMSQuestion[]>;
  createQuestion(question: Omit<LMSQuestion, "id">): Promise<LMSQuestion>;

  // Quiz Attempts
  recordAttempt(attempt: Omit<LMSQuizAttempt, "attemptId">): Promise<LMSQuizAttempt>;
  getAttempts(userEmail?: string): Promise<LMSQuizAttempt[]>;

  // Certificates
  getCertificates(userEmail?: string): Promise<LMSCertificate[]>;
  getCertificateById(credentialId: string): Promise<LMSCertificate | null>;
  issueCertificate(cert: Omit<LMSCertificate, "id">): Promise<LMSCertificate>;

  // Badges & Gamification
  getBadges(userEmail?: string): Promise<LMSBadge[]>;

  // Workforce & Users Sync
  getUsers(): Promise<TranscorpLearner[]>;
  syncUsers(learners: TranscorpLearner[]): Promise<void>;
}
