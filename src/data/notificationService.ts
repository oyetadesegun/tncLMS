/**
 * Notification Service
 *
 * In production this would call a Power Automate flow or Azure Communication Services.
 * In local preview it shows a professional in-app toast and logs to console,
 * and stores notifications in localStorage so they persist between sessions.
 */

import type { Course } from "./coursesStore";
import { HRAdminStore } from "./hrAdminStore";

const NOTIF_STORAGE_KEY = "transcorp_lms_notifications_v1";

export interface AppNotification {
  id: string;
  type:
    | "COURSE_INITIATED"
    | "TRAINER_SUBMISSION"
    | "COURSE_APPROVED"
    | "COURSE_PUBLISHED";
  subject: string;
  body: string;
  to: string[];
  sentAt: string;
  read: boolean;
  courseId?: string;
  actionUrl?: string;
}

function loadNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

let inMemoryNotifs: AppNotification[] = loadNotifications();
const notifListeners: Array<(n: AppNotification[]) => void> = [];

function persistNotifsAndNotify() {
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(inMemoryNotifs));
  } catch {
    // fallback
  }
  notifListeners.forEach((fn) => fn([...inMemoryNotifs]));
}

function addNotification(notif: Omit<AppNotification, "id" | "sentAt" | "read">) {
  const full: AppNotification = {
    ...notif,
    id: `NOTIF-${Date.now()}`,
    sentAt: new Date().toISOString(),
    read: false,
  };
  inMemoryNotifs = [full, ...inMemoryNotifs];
  persistNotifsAndNotify();
  return full;
}

/**
 * Generates a shareable Assessment Builder URL for a course.
 * In production this would be a signed deep-link; in preview it's a path with token.
 */
export function generateAssessmentBuilderLink(course: Course): string {
  const token = btoa(`${course.id}:${course.courseCode}:hr-build`);
  return `${window.location.origin}/quiz-builder?courseId=${course.id}&token=${token}`;
}

export const NotificationService = {
  subscribe(callback: (n: AppNotification[]) => void): () => void {
    notifListeners.push(callback);
    callback([...inMemoryNotifs]);
    return () => {
      const idx = notifListeners.indexOf(callback);
      if (idx !== -1) notifListeners.splice(idx, 1);
    };
  },

  getAll(): AppNotification[] {
    return [...inMemoryNotifs];
  },

  getUnreadCount(): number {
    return inMemoryNotifs.filter((n) => !n.read).length;
  },

  markRead(id: string) {
    inMemoryNotifs = inMemoryNotifs.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    persistNotifsAndNotify();
  },

  markAllRead() {
    inMemoryNotifs = inMemoryNotifs.map((n) => ({ ...n, read: true }));
    persistNotifsAndNotify();
  },

  /**
   * STEP 1 — Called when Admin initiates a course.
   * → Email to Trainer: "You have been assigned as Trainer"
   * → Email to HR: "Course initiated, here is the Assessment Builder link"
   */
  async notifyCourseInitiated(course: Course): Promise<void> {
    const hrEmail = HRAdminStore.getPrimaryHREmail();
    const builderLink = generateAssessmentBuilderLink(course);
    const sessionDateStr = course.sessionDate
      ? new Date(course.sessionDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "TBD";

    // Email to Trainer
    const trainerNotif = addNotification({
      type: "COURSE_INITIATED",
      subject: `[ACTION REQUIRED] You've been designated as Lead Trainer — "${course.title}"`,
      body: `Dear ${course.trainer.fullName},

You have been elevated from Learner to Lead Course Trainer for the following course:

  Course: ${course.title}
  Code: ${course.courseCode}
  Category: ${course.category}
  Session Date: ${sessionDateStr}
  Delivery: ${course.deliveryMethod}${course.meetingPlatform ? ` (${course.meetingPlatform})` : ""}
  Audience: ${course.targetSubsidiary}

Your responsibilities:
  1. Set up your assessment questions (link from HR)
  2. Review course materials
  3. Submit your assessment to HR for approval

Questions? Contact HR at ${hrEmail}

Regards,
Transcorp Group HR – Learning & Development`,
      to: [course.trainer.email],
      courseId: course.id,
    });

    // Email to HR with shareable builder link
    const hrNotif = addNotification({
      type: "COURSE_INITIATED",
      subject: `[HR COPY] New Course Initiated — "${course.title}" | Trainer: ${course.trainer.fullName}`,
      body: `Dear HR Team,

A new corporate course has been initiated:

  Course: ${course.title}
  Code: ${course.courseCode}
  Category: ${course.category}
  Trainer: ${course.trainer.fullName} (${course.trainer.email})
  Audience: ${course.targetSubsidiary}
  Session Date: ${sessionDateStr}

ASSESSMENT BUILDER LINK (share with trainer or use to build questions):
  ${builderLink}

Anyone with this link can create assessment questions for this course.
This link is valid until the course is published.

Next steps:
  1. Forward the builder link to ${course.trainer.fullName}
  2. Review and approve their submitted assessment
  3. Publish the course to learners

Regards,
Transcorp Group LMS – Automated Notification`,
      to: [hrEmail],
      courseId: course.id,
      actionUrl: builderLink,
    });

    // In local preview: log emails to console
    console.group(`📧 EMAIL: Course Initiated — ${course.title}`);
    console.log("TO TRAINER:", course.trainer.email, trainerNotif.body);
    console.log("TO HR:", hrEmail, hrNotif.body);
    console.log("🔗 ASSESSMENT BUILDER LINK:", builderLink);
    console.groupEnd();
  },

  /**
   * STEP 2 — Called when Trainer submits their assessment for HR review.
   * → Email to HR: "Trainer has submitted assessment, please approve"
   */
  async notifyTrainerSubmission(course: Course, questionCount: number): Promise<void> {
    const hrEmail = HRAdminStore.getPrimaryHREmail();

    addNotification({
      type: "TRAINER_SUBMISSION",
      subject: `[APPROVAL REQUIRED] Assessment Submitted by ${course.trainer.fullName} — "${course.title}"`,
      body: `Dear HR,

${course.trainer.fullName} has submitted the assessment for your review and approval.

  Course: ${course.title}
  Code: ${course.courseCode}
  Trainer: ${course.trainer.fullName} (${course.trainer.email})
  Questions Submitted: ${questionCount}
  Audience: ${course.targetSubsidiary}

Please log into the LMS Admin Portal to review and approve this assessment before it is published to learners.

Review in Admin → Assessments → ${course.title}

Regards,
Transcorp Group LMS – Automated Notification`,
      to: [hrEmail],
      courseId: course.id,
      actionUrl: `/assessments`,
    });

    console.group(`📧 EMAIL: Trainer Submission — ${course.title}`);
    console.log(`TO HR: ${hrEmail} — ${course.trainer.fullName} submitted ${questionCount} questions.`);
    console.groupEnd();
  },

  /**
   * STEP 3 — Called when HR approves a course.
   * → Email to Trainer: "Your course is approved and published"
   */
  async notifyCourseApproved(course: Course): Promise<void> {
    addNotification({
      type: "COURSE_APPROVED",
      subject: `[APPROVED] Your course "${course.title}" is now live`,
      body: `Dear ${course.trainer.fullName},

Great news! Your assessment for the following course has been approved by HR and is now live for learners:

  Course: ${course.title}
  Code: ${course.courseCode}
  Audience: ${course.targetSubsidiary}

Learners will now be able to access the course and take the assessment.
Thank you for your contribution to Transcorp Group Learning & Development.

Regards,
Transcorp Group HR – Learning & Development`,
      to: [course.trainer.email],
      courseId: course.id,
    });

    console.log(`📧 EMAIL: Course Approved → ${course.trainer.email}`);
  },
};
