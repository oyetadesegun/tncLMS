/**
 * LMS Data Service (Facade & State Manager)
 * 
 * Provides reactive access to all LMS data:
 * - Courses & Trainings
 * - Assessments & Quizzes
 * - Questions Bank & Options
 * - Attempts & Results
 * - Issued Certificates
 * - Badges & Velocity
 * - Workforce Directory (with Segun Oyetade as Super Admin)
 * 
 * Backed by DataverseAdapter today, with built-in pluggability for SharePointAdapter
 * tomorrow. If cloud storage is empty, it initializes the core Transcorp curriculum
 * so all features work immediately.
 */

import type {
  ILMSDataAdapter,
  LMSAssessment,
  LMSQuestion,
  LMSCertificate,
  LMSBadge,
  LMSQuizAttempt,
} from "./dataAdapter";
import { DataverseAdapter } from "./dataverseAdapter";
import type { Course } from "../data/coursesStore";
import { TRANSCORP_LEARNERS, type TranscorpLearner } from "../data/transcorpUsers";

// Initial seed data to populate cloud adapter if completely empty
const INITIAL_COURSES: Omit<Course, "id">[] = [
  {
    courseCode: "TRC-CYBER-2026",
    title: "Cybersecurity Awareness & Zero-Trust Defense",
    description: "Statutory mandatory corporate security compliance on credential hygiene, spear-phishing defense, and data protection.",
    category: "Information Security & Compliance",
    initiatedBy: {
      name: "Amaka Okafor",
      role: "HR Group Learning Lead",
      email: "amaka.okafor@transcorpgroup.com",
    },
    trainer: {
      id: "TRC-007",
      fullName: "Segun Oyetade",
      email: "segun.oyetade@transcorpgroup.com",
      subsidiary: "Transcorp Group HQ",
      avatar: "SO",
      assignedRole: "Lead Course Trainer",
    },
    audienceScope: "ALL",
    targetSubsidiary: "ALL Transcorp Group (All Subsidiaries)",
    deliveryMethod: "Virtual",
    meetingPlatform: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/cyber-security-transcorp",
    sessionDate: "2026-10-18T10:00:00Z",
    status: "Active",
    enrolledLearnersCount: 451,
    passMark: 80,
    durationMinutes: 20,
    linkedAssessmentTitle: "Cybersecurity & Critical Infrastructure Defense",
    createdOn: "2026-10-01",
  },
  {
    courseCode: "TRC-PWR-402",
    title: "High-Voltage Grid Synchronization & Turbine Safety",
    description: "Operational safety protocol, substation lockout/tagout procedures, and emergency tripping procedures at generation plants.",
    category: "Engineering & Plant Operations",
    initiatedBy: {
      name: "Amaka Okafor",
      role: "HR Group Learning Lead",
      email: "amaka.okafor@transcorpgroup.com",
    },
    trainer: {
      id: "TRC-028",
      fullName: "Abel Emegha",
      email: "Abel.Emegha@transcorppower.com",
      subsidiary: "Transcorp Power Plc",
      avatar: "AE",
      assignedRole: "Lead Course Trainer",
    },
    audienceScope: "SUBSIDIARY",
    targetSubsidiary: "Transcorp Power Plc",
    deliveryMethod: "Physical",
    sessionDate: "2026-10-22T09:00:00Z",
    status: "Active",
    enrolledLearnersCount: 406,
    passMark: 85,
    durationMinutes: 30,
    linkedAssessmentTitle: "Q3 Grid High-Voltage Isolation Protocols",
    createdOn: "2026-10-05",
  },
];

const INITIAL_ASSESSMENTS: Omit<LMSAssessment, "id">[] = [
  {
    title: "Cybersecurity & Critical Infrastructure Defense",
    description: "Statutory assessment evaluating credential defense, phishing response, and operational technology isolation.",
    category: "Information Security & Compliance",
    status: "Active",
    passMarkPercent: 80,
    timeLimitMinutes: 20,
    questionsCount: 5,
    cohort: "451 Transcorp Group Staff",
    retakePolicy: "Limited Retakes (3 attempts)",
    maxAttempts: 3,
    certificateEnabled: true,
    trainerName: "Segun Oyetade",
    trainerEmail: "segun.oyetade@transcorpgroup.com",
    createdOn: "2026-10-01",
  },
  {
    title: "Q3 Grid High-Voltage Isolation Protocols",
    description: "Assessment covering high-voltage substation switching sequences, lockout/tagout (LOTO), and arc flash safety.",
    category: "Power Operations",
    status: "Active",
    passMarkPercent: 85,
    timeLimitMinutes: 15,
    questionsCount: 5,
    cohort: "340 Field Engineers",
    retakePolicy: "Limited Retakes (2 attempts)",
    maxAttempts: 2,
    certificateEnabled: true,
    trainerName: "Abel Emegha",
    trainerEmail: "Abel.Emegha@transcorppower.com",
    createdOn: "2026-10-05",
  },
  {
    title: "Anti-Bribery & Executive Governance 2026",
    description: "Corporate governance evaluation covering statutory gift limits, regulatory declarations, and conflict of interest guidelines.",
    category: "Executive & Legal",
    status: "Active",
    passMarkPercent: 90,
    timeLimitMinutes: 25,
    questionsCount: 5,
    cohort: "210 Directors & Managers",
    retakePolicy: "Unlimited Retakes",
    maxAttempts: 99,
    certificateEnabled: true,
    trainerName: "Segun Oyetade",
    trainerEmail: "segun.oyetade@transcorpgroup.com",
    createdOn: "2026-10-08",
  },
];

const INITIAL_QUESTIONS: Omit<LMSQuestion, "id">[] = [
  {
    quizId: "quiz-cyber",
    questionText: "You receive an email from 'it-support@transcorpgroup-security.com' requesting an urgent MFA token reset. What is the correct protocol?",
    scenario: "Urgent email alert received during active shift requesting emergency credential input.",
    difficulty: "Medium",
    category: "Cybersecurity",
    explanation: "Flagging via the official Transcorp Outlook security add-in immediately alerts the Security Operations Center (SOC). Never share MFA codes or click suspicious links.",
    options: [
      { id: "opt-1", text: "Reply with the 6-digit authenticator code immediately to prevent account lock.", isCorrect: false },
      { id: "opt-2", text: "Click the link to verify if the certificate on the webpage is valid.", isCorrect: false },
      { id: "opt-3", text: "Flag as phishing via the Transcorp Outlook plugin and alert the SOC helpline.", isCorrect: true },
      { id: "opt-4", text: "Forward the email to team colleagues to verify if they received it too.", isCorrect: false },
    ],
  },
  {
    quizId: "quiz-cyber",
    questionText: "When connecting a portable USB drive into a SCADA substation control terminal, what policy applies?",
    scenario: "Field engineer needing to transfer firmware patch to high-voltage breaker unit.",
    difficulty: "Hard",
    category: "Power Operations",
    explanation: "Air-gapped telemetry networks prohibit unauthorized USB media. All transfer devices must be cryptographically vetted and scanned at the IT kiosk.",
    options: [
      { id: "opt-5", text: "Any enterprise-encrypted USB drive is authorized without prior scanning.", isCorrect: false },
      { id: "opt-6", text: "Air-gapped systems prohibit unauthorized external media; devices must be vetted via the IT kiosk.", isCorrect: true },
      { id: "opt-7", text: "External media is permitted if formatted with NTFS and password protected.", isCorrect: false },
      { id: "opt-8", text: "Only drives under 16GB capacity may be connected without supervisor approval.", isCorrect: false },
    ],
  },
  {
    quizId: "quiz-cyber",
    questionText: "Which of the following constitutes an immediate Severity 1 incident under Transcorp Information Security standard?",
    difficulty: "Medium",
    category: "Cybersecurity",
    explanation: "Unsanctioned lateral movement across industrial SCADA telemetry networks represents potential advanced threat penetration and requires immediate isolation.",
    options: [
      { id: "opt-9", text: "A failed login attempt on a non-production test laptop.", isCorrect: false },
      { id: "opt-10", text: "Scheduled reboot of an internal file repository server.", isCorrect: false },
      { id: "opt-11", text: "Unsanctioned lateral movement detected across substation telemetry networks.", isCorrect: true },
      { id: "opt-12", text: "Delayed delivery of external marketing newsletters.", isCorrect: false },
    ],
  },
  {
    quizId: "quiz-cyber",
    questionText: "What is the minimum recommended length and complexity for Transcorp privileged executive credentials?",
    difficulty: "Easy",
    category: "Cybersecurity",
    explanation: "Passphrase entropy with 16+ characters combined with mandatory FIDO2 hardware token MFA provides defense against brute force and credential stuffing.",
    options: [
      { id: "opt-13", text: "8 characters with numbers only.", isCorrect: false },
      { id: "opt-14", text: "10 characters with standard alphanumeric sequence.", isCorrect: false },
      { id: "opt-15", text: "16+ characters utilizing passphrase entropy and mandatory hardware token MFA.", isCorrect: true },
      { id: "opt-16", text: "12 characters changed once every 3 years.", isCorrect: false },
    ],
  },
  {
    quizId: "quiz-cyber",
    questionText: "If an unexpected browser prompt asks to accept an untrusted root SSL certificate when loading internal dashboards, you should:",
    difficulty: "Medium",
    category: "Cybersecurity",
    explanation: "Untrusted root SSL warnings indicate potential Man-in-the-Middle (MitM) interception or compromised proxy. Terminate session immediately.",
    options: [
      { id: "opt-17", text: "Accept the risk and proceed to bypass the warning.", isCorrect: false },
      { id: "opt-18", text: "Terminate the session immediately and submit an alert to enterprise security.", isCorrect: true },
      { id: "opt-19", text: "Disable the browser warning in developer settings.", isCorrect: false },
      { id: "opt-20", text: "Clear browser cookies and retry repeatedly.", isCorrect: false },
    ],
  },
];

const INITIAL_BADGES: LMSBadge[] = [
  { id: "b-1", name: "Zero-Trust Sentinel", category: "Cybersecurity", description: "Completed InfoSec simulation with 80%+ pass score.", icon: "security", unlocked: true, earnedDate: "Earned Oct 2026" },
  { id: "b-2", name: "330kV Grid Master", category: "Power Operations", description: "Demonstrated full compliance in high-voltage breaker protocols.", icon: "bolt", unlocked: true, earnedDate: "Earned Sep 2026" },
  { id: "b-3", name: "ISO 27001 Auditor", category: "Governance", description: "Participated in corporate compliance audit checklist verification.", icon: "verified_user", unlocked: true, earnedDate: "Earned Aug 2026" },
  { id: "b-4", name: "4-Week Velocity Streak", category: "Habits", description: "Maintained continuous weekly assessment completion for 4 weeks.", icon: "local_fire_department", unlocked: true, earnedDate: "Earned Yesterday" },
  { id: "b-5", name: "Turbine Emergency Lead", category: "Operations", description: "Complete turbine emergency pressure mitigation drill.", icon: "emergency", unlocked: false },
  { id: "b-6", name: "Executive Ethics Fellow", category: "Governance", description: "Score 95%+ in Anti-Bribery & Executive Compliance exam.", icon: "workspace_premium", unlocked: false },
];

class LMSDataService {
  private adapter: ILMSDataAdapter;
  private isInitialized = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.adapter = new DataverseAdapter();
    this.init();
  }

  /**
   * Set adapter dynamically (e.g. switch from Dataverse to SharePoint)
   */
  public setAdapter(newAdapter: ILMSDataAdapter) {
    this.adapter = newAdapter;
    this.notify();
  }

  public getAdapterProviderName(): string {
    return this.adapter.providerName;
  }

  private async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      const [courses, assessments, questions] = await Promise.all([
        this.adapter.getCourses(),
        this.adapter.getAssessments(),
        this.adapter.getQuestions(),
      ]);

      // If courses table is empty, seed initial courses
      if (!courses || courses.length === 0) {
        for (const c of INITIAL_COURSES) {
          await this.adapter.createCourse(c);
        }
      }

      // If assessments table is empty, seed initial assessments
      if (!assessments || assessments.length === 0) {
        for (const a of INITIAL_ASSESSMENTS) {
          await this.adapter.createAssessment(a);
        }
      }

      // If questions table is empty, seed initial questions
      if (!questions || questions.length === 0) {
        for (const q of INITIAL_QUESTIONS) {
          await this.adapter.createQuestion(q);
        }
      }

      // Sync initial workforce learners to Dataverse
      await this.adapter.syncUsers(TRANSCORP_LEARNERS.slice(0, 20)).catch(() => {});
    } catch (e) {
      console.warn("[LMSDataService] Initialization warning:", e);
    }

    this.notify();
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // ─── Courses API ──────────────────────────────────────────────────────────
  public async getCourses(): Promise<Course[]> {
    await this.init();
    return this.adapter.getCourses();
  }

  public async createCourse(course: Omit<Course, "id">): Promise<Course> {
    const res = await this.adapter.createCourse(course);
    this.notify();
    return res;
  }

  public async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const res = await this.adapter.updateCourse(id, updates);
    this.notify();
    return res;
  }

  public async deleteCourse(id: string): Promise<void> {
    await this.adapter.deleteCourse(id);
    this.notify();
  }

  // ─── Assessments API ──────────────────────────────────────────────────────
  public async getAssessments(): Promise<LMSAssessment[]> {
    await this.init();
    return this.adapter.getAssessments();
  }

  public async getAssessmentById(id: string): Promise<LMSAssessment | null> {
    await this.init();
    return this.adapter.getAssessmentById(id);
  }

  public async createAssessment(assessment: Omit<LMSAssessment, "id">): Promise<LMSAssessment> {
    const res = await this.adapter.createAssessment(assessment);
    this.notify();
    return res;
  }

  // ─── Questions API ────────────────────────────────────────────────────────
  public async getQuestions(quizId?: string): Promise<LMSQuestion[]> {
    await this.init();
    return this.adapter.getQuestions(quizId);
  }

  public async createQuestion(question: Omit<LMSQuestion, "id">): Promise<LMSQuestion> {
    const res = await this.adapter.createQuestion(question);
    this.notify();
    return res;
  }

  // ─── Quiz Attempts API ────────────────────────────────────────────────────
  public async recordAttempt(attempt: Omit<LMSQuizAttempt, "attemptId">): Promise<LMSQuizAttempt> {
    const res = await this.adapter.recordAttempt(attempt);
    this.notify();
    return res;
  }

  public async getAttempts(userEmail?: string): Promise<LMSQuizAttempt[]> {
    await this.init();
    return this.adapter.getAttempts(userEmail);
  }

  // ─── Certificates API ─────────────────────────────────────────────────────
  public async getCertificates(userEmail?: string): Promise<LMSCertificate[]> {
    await this.init();
    const certs = await this.adapter.getCertificates(userEmail);
    if (!certs || certs.length === 0) {
      // Provide default certified record for Segun Oyetade / current user
      return [
        {
          id: "cert-001",
          credentialId: "CERT-8F3K-92QX",
          recipientName: "Segun Oyetade",
          recipientEmail: userEmail || "segun.oyetade@transcorpgroup.com",
          courseTitle: "Cybersecurity & Critical Infrastructure Defense",
          issuer: "Transcorp Institute of Information Security",
          standard: "ISO/IEC 27001 Accredited",
          scorePercent: 92,
          issuedDate: "Oct 06, 2026",
          expiryDate: "Oct 06, 2028",
          status: "Valid",
        },
      ];
    }
    return certs;
  }

  public async getCertificateById(credentialId: string): Promise<LMSCertificate | null> {
    await this.init();
    return this.adapter.getCertificateById(credentialId);
  }

  // ─── Badges API ───────────────────────────────────────────────────────────
  public async getBadges(userEmail?: string): Promise<LMSBadge[]> {
    await this.init();
    const badges = await this.adapter.getBadges(userEmail);
    if (!badges || badges.length === 0) {
      return INITIAL_BADGES;
    }
    return badges;
  }

  // ─── Workforce Users API ──────────────────────────────────────────────────
  public async getUsers(): Promise<TranscorpLearner[]> {
    await this.init();
    return this.adapter.getUsers();
  }
}

export const lmsDataService = new LMSDataService();
