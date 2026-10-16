import { Jwell_trainingsService } from "../generated/services/Jwell_trainingsService";
import { TRANSCORP_LEARNERS, type TranscorpLearner } from "./transcorpUsers";
import { NotificationService } from "./notificationService";
import { lmsDataService } from "../services/lmsDataService";

export interface CourseTrainer {
  id: string;
  fullName: string;
  email: string;
  subsidiary: string;
  avatar: string;
  assignedRole: "Lead Course Trainer";
}

export interface Course {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  category: string;
  initiatedBy: {
    name: string;
    role: string;
    email: string;
  };
  trainer: CourseTrainer;
  audienceScope: "ALL" | "SUBSIDIARY";
  targetSubsidiary: string;
  deliveryMethod: "Virtual" | "Physical";
  meetingPlatform?: "Microsoft Teams" | "Zoom";
  meetingLink?: string;
  sessionDate: string;
  /** @deprecated use meetingLink instead */
  status: "Active" | "Upcoming" | "Draft" | "Completed";
  enrolledLearnersCount: number;
  passMark: number;
  durationMinutes: number;
  linkedAssessmentTitle: string;
  createdOn: string;
}

const STORAGE_KEY = "transcorp_lms_courses_v1";

const DEFAULT_COURSES: Course[] = [
  {
    id: "CRS-TRC-001",
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
    durationMinutes: 25,
    linkedAssessmentTitle: "Cybersecurity Awareness Assessment 2026",
    createdOn: "2026-10-01",
  },
  {
    id: "CRS-TRC-002",
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
    linkedAssessmentTitle: "Turbine Emergency Pressure Shutdown & Hazard Control",
    createdOn: "2026-10-04",
  },
  {
    id: "CRS-TRC-003",
    courseCode: "TRC-HTL-105",
    title: "Luxury Hospitality Service Quality & Guest Data Privacy",
    description: "Standards of guest experience, VIP protocol, and strict NDPR compliance in handling premium hospitality guest data.",
    category: "Hospitality & Guest Experience",
    initiatedBy: {
      name: "Amaka Okafor",
      role: "HR Group Learning Lead",
      email: "amaka.okafor@transcorpgroup.com",
    },
    trainer: {
      id: "TRC-002",
      fullName: "Chinonyerem Ogbu",
      email: "chinonyerem.ogbu@transcorpgroup.com",
      subsidiary: "Transcorp Group HQ",
      avatar: "CO",
      assignedRole: "Lead Course Trainer",
    },
    audienceScope: "SUBSIDIARY",
    targetSubsidiary: "Transcorp Hotels Plc",
    deliveryMethod: "Virtual",
    meetingPlatform: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/hilton-abuja-hospitality",
    sessionDate: "2026-10-25T11:00:00Z",
    status: "Upcoming",
    enrolledLearnersCount: 17,
    passMark: 75,
    durationMinutes: 20,
    linkedAssessmentTitle: "Five-Star Guest Data Privacy & Hospitality Protocol",
    createdOn: "2026-10-06",
  },
  {
    id: "CRS-TRC-004",
    courseCode: "TRC-GOV-901",
    title: "Anti-Bribery, Anti-Corruption (ABC) & Statutory Governance",
    description: "Mandatory corporate governance certification governing anti-financial crime, gifts policy, and conflict of interest declarations.",
    category: "Corporate Governance & Ethics",
    initiatedBy: {
      name: "Amaka Okafor",
      role: "HR Group Learning Lead",
      email: "amaka.okafor@transcorpgroup.com",
    },
    trainer: {
      id: "TRC-001",
      fullName: "Christopher Ezeafulukwe",
      email: "christopher.ezeafulukwe@transcorpgroup.com",
      subsidiary: "Transcorp Group HQ",
      avatar: "CE",
      assignedRole: "Lead Course Trainer",
    },
    audienceScope: "ALL",
    targetSubsidiary: "ALL Transcorp Group (All Subsidiaries)",
    deliveryMethod: "Virtual",
    meetingPlatform: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/abc-ethics-transcorp",
    sessionDate: "2026-11-02T14:00:00Z",
    status: "Active",
    enrolledLearnersCount: 451,
    passMark: 90,
    durationMinutes: 15,
    linkedAssessmentTitle: "Code of Conduct & Whistleblowing Examination 2026",
    createdOn: "2026-10-08",
  },
];

let inMemoryCourses: Course[] = loadInitialCourses();
const listeners: Array<(courses: Course[]) => void> = [];

function loadInitialCourses(): Course[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_COURSES;
}

// Background sync from cloud Dataverse
lmsDataService.getCourses().then((cloudCourses) => {
  if (cloudCourses && cloudCourses.length > 0) {
    inMemoryCourses = cloudCourses;
    persistAndNotify();
  }
}).catch(() => {});

function persistAndNotify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryCourses));
  } catch {
    // storage fallback
  }
  listeners.forEach((listener) => listener([...inMemoryCourses]));
}

export const CoursesStore = {
  getCourses(): Course[] {
    return [...inMemoryCourses];
  },

  getCourseById(id: string): Course | undefined {
    return inMemoryCourses.find((c) => c.id === id);
  },

  subscribe(callback: (courses: Course[]) => void): () => void {
    listeners.push(callback);
    callback([...inMemoryCourses]);
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  /**
   * HR (Admin) initiates a new course and assigns a Learner as the Trainer,
   * setting the target audience to ALL or a specific subsidiary.
   */
  async initiateCourse(params: {
    title: string;
    description: string;
    category: string;
    courseCode?: string;
    trainerLearner: TranscorpLearner;
    audienceScope: "ALL" | "SUBSIDIARY";
    targetSubsidiary?: string;
    deliveryMethod?: Course["deliveryMethod"];
    meetingPlatform?: Course["meetingPlatform"];
    meetingLink?: string;
    sessionDate?: string;
    passMark?: number;
    durationMinutes?: number;
    linkedAssessmentTitle?: string;
  }): Promise<Course> {
    const id = `CRS-TRC-${Date.now().toString().slice(-4)}`;
    const courseCode = params.courseCode || `TRC-${params.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const targetSubsidiary =
      params.audienceScope === "ALL"
        ? "ALL Transcorp Group (All Subsidiaries)"
        : params.targetSubsidiary || "Transcorp Power Plc";

    // Compute enrolled count based on audience scope
    const eligibleCount =
      params.audienceScope === "ALL"
        ? TRANSCORP_LEARNERS.length
        : TRANSCORP_LEARNERS.filter((l) =>
            l.subsidiary.toLowerCase().includes(targetSubsidiary.toLowerCase().replace(" (all subsidiaries)", ""))
          ).length || 45;

    const newCourse: Course = {
      id,
      courseCode,
      title: params.title,
      description: params.description,
      category: params.category,
      initiatedBy: {
        name: "Amaka Okafor",
        role: "HR Group Learning Lead",
        email: "amaka.okafor@transcorpgroup.com",
      },
      trainer: {
        id: params.trainerLearner.id,
        fullName: params.trainerLearner.fullName,
        email: params.trainerLearner.email,
        subsidiary: params.trainerLearner.subsidiary,
        avatar: params.trainerLearner.avatar,
        assignedRole: "Lead Course Trainer",
      },
      audienceScope: params.audienceScope,
      targetSubsidiary,
      deliveryMethod: params.deliveryMethod || "Virtual",
      meetingPlatform: params.meetingPlatform,
      meetingLink: params.meetingLink || undefined,
      sessionDate: params.sessionDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: "Active",
      enrolledLearnersCount: eligibleCount,
      passMark: params.passMark || 80,
      durationMinutes: params.durationMinutes || 25,
      linkedAssessmentTitle: params.linkedAssessmentTitle || `${params.title} Assessment`,
      createdOn: new Date().toISOString().slice(0, 10),
    };

    inMemoryCourses.unshift(newCourse);
    persistAndNotify();

    // Persist to Dataverse jwell_trainings table
    try {
      await Jwell_trainingsService.create({
        jwell_title: newCourse.title,
        jwell_description: `${newCourse.description} | Trainer: ${newCourse.trainer.fullName} (${newCourse.trainer.email}) | Audience: ${newCourse.targetSubsidiary}`,
        jwell_sessiondate: newCourse.sessionDate,
        jwell_teamsmeetingname: newCourse.meetingLink,
        statecode: 0,
      });
    } catch {
      // Local preview fallback continues smoothly
    }

    // Fire-and-forget: email trainer + HR with assessment builder link
    NotificationService.notifyCourseInitiated(newCourse).catch(() => {});

    return newCourse;
  },

  /**
   * Reassign a Learner to be the Trainer of a course
   */
  async reassignTrainer(courseId: string, learner: TranscorpLearner): Promise<Course | undefined> {
    const course = inMemoryCourses.find((c) => c.id === courseId);
    if (!course) return undefined;

    course.trainer = {
      id: learner.id,
      fullName: learner.fullName,
      email: learner.email,
      subsidiary: learner.subsidiary,
      avatar: learner.avatar,
      assignedRole: "Lead Course Trainer",
    };

    persistAndNotify();

    try {
      await Jwell_trainingsService.update(course.id, {
        jwell_description: `${course.description} | Trainer: ${course.trainer.fullName} (${course.trainer.email}) | Audience: ${course.targetSubsidiary}`,
      });
    } catch {
      // fallback
    }

    return course;
  },

  /**
   * Update Audience Scope (ALL vs Subsidiary)
   */
  async setAudienceScope(
    courseId: string,
    audienceScope: "ALL" | "SUBSIDIARY",
    targetSubsidiary?: string
  ): Promise<Course | undefined> {
    const course = inMemoryCourses.find((c) => c.id === courseId);
    if (!course) return undefined;

    course.audienceScope = audienceScope;
    course.targetSubsidiary =
      audienceScope === "ALL"
        ? "ALL Transcorp Group (All Subsidiaries)"
        : targetSubsidiary || "Transcorp Power Plc";

    course.enrolledLearnersCount =
      audienceScope === "ALL"
        ? TRANSCORP_LEARNERS.length
        : TRANSCORP_LEARNERS.filter((l) =>
            l.subsidiary.toLowerCase().includes(course.targetSubsidiary.toLowerCase().replace(" (all subsidiaries)", ""))
          ).length || 50;

    persistAndNotify();
    return course;
  },

  /**
   * Delete or archive a course
   */
  deleteCourse(courseId: string): void {
    inMemoryCourses = inMemoryCourses.filter((c) => c.id !== courseId);
    persistAndNotify();
  },
};
