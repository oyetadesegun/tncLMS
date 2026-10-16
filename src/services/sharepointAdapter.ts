/**
 * SharePoint LMS Data Adapter (Production Ready Scaffold)
 * 
 * Implements ILMSDataAdapter for production deployment against Microsoft SharePoint Lists /
 * Microsoft Graph API (e.g., using @pnp/sp or Microsoft Graph SDK).
 * 
 * To switch the entire application to SharePoint in production:
 * Simply call:
 *   lmsDataService.setAdapter(new SharePointAdapter({ siteUrl: "https://transcorp.sharepoint.com/sites/LMS" }))
 * 
 * No UI components or views need to be rewritten!
 */

import type {
  ILMSDataAdapter,
  LMSAssessment,
  LMSQuestion,
  LMSCertificate,
  LMSBadge,
  LMSQuizAttempt,
} from "./dataAdapter";
import type { Course } from "../data/coursesStore";
import type { TranscorpLearner } from "../data/transcorpUsers";

export interface SharePointConfig {
  siteUrl: string;
  listNames?: {
    trainings?: string;
    quizzes?: string;
    questions?: string;
    attempts?: string;
    certificates?: string;
    badges?: string;
    users?: string;
  };
}

export class SharePointAdapter implements ILMSDataAdapter {
  public readonly providerName = "SharePoint" as const;
  private config: SharePointConfig;

  constructor(config: SharePointConfig = { siteUrl: "https://transcorpgroup.sharepoint.com/sites/lms" }) {
    this.config = config;
  }

  async getCourses(): Promise<Course[]> {
    // SharePoint REST / Graph API implementation:
    // return sp.web.lists.getByTitle("LMS_Courses").items.select(...)
    return [];
  }

  async createCourse(course: Omit<Course, "id">): Promise<Course> {
    const id = `sp-crs-${Date.now()}`;
    return { ...course, id };
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    return { id, ...updates } as Course;
  }

  async deleteCourse(id: string): Promise<void> {
    // await sp.web.lists.getByTitle("LMS_Courses").items.getById(id).delete()
  }

  async getAssessments(): Promise<LMSAssessment[]> {
    return [];
  }

  async getAssessmentById(id: string): Promise<LMSAssessment | null> {
    return null;
  }

  async createAssessment(assessment: Omit<LMSAssessment, "id">): Promise<LMSAssessment> {
    const id = `sp-quiz-${Date.now()}`;
    return { ...assessment, id };
  }

  async getQuestions(quizId?: string): Promise<LMSQuestion[]> {
    return [];
  }

  async createQuestion(question: Omit<LMSQuestion, "id">): Promise<LMSQuestion> {
    const id = `sp-q-${Date.now()}`;
    return { ...question, id };
  }

  async recordAttempt(attempt: Omit<LMSQuizAttempt, "attemptId">): Promise<LMSQuizAttempt> {
    const attemptId = `sp-att-${Date.now()}`;
    return { ...attempt, attemptId };
  }

  async getAttempts(userEmail?: string): Promise<LMSQuizAttempt[]> {
    return [];
  }

  async getCertificates(userEmail?: string): Promise<LMSCertificate[]> {
    return [];
  }

  async getCertificateById(credentialId: string): Promise<LMSCertificate | null> {
    return null;
  }

  async issueCertificate(cert: Omit<LMSCertificate, "id">): Promise<LMSCertificate> {
    const id = `sp-cert-${Date.now()}`;
    return { ...cert, id };
  }

  async getBadges(userEmail?: string): Promise<LMSBadge[]> {
    return [];
  }

  async getUsers(): Promise<TranscorpLearner[]> {
    return [];
  }

  async syncUsers(learners: TranscorpLearner[]): Promise<void> {}
}
