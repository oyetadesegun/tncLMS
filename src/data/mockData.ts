import type { Jwell_quizs } from '../generated/models/Jwell_quizsModel';
import type { Jwell_questions } from '../generated/models/Jwell_questionsModel';
import type { Jwell_answeroptions } from '../generated/models/Jwell_answeroptionsModel';
import type { Jwell_certificates } from '../generated/models/Jwell_certificatesModel';
import type { Jwell_badges } from '../generated/models/Jwell_badgesModel';
import type { Jwell_trainings } from '../generated/models/Jwell_trainingsModel';
import type { Jwell_attempts } from '../generated/models/Jwell_attemptsModel';

export const fallbackQuizzes: Jwell_quizs[] = [
  {
    jwell_quizid: 'quiz-001',
    jwell_title: 'Cloud Architecture & Security Fundamentals',
    jwell_description: 'Test your understanding of multi-tier cloud infrastructure, zero-trust network principles, and data encryption protocols.',
    jwell_status: 911120003, // Published
    jwell_statusname: 'Published',
    jwell_passmarkpercent: 80,
    jwell_timelimitminutes: 25,
    jwell_questionsperattempt: 5,
    jwell_certificateenabled: true,
    jwell_retakepolicy: 911120001, // Limited Retakes
    jwell_retakepolicyname: 'Limited Retakes (3 attempts)',
    jwell_maxattempts: 3,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
  },
  {
    jwell_quizid: 'quiz-002',
    jwell_title: 'Power Platform & Dataverse Governance',
    jwell_description: 'Assessment evaluating enterprise ALM pipelines, security roles, environment routing, and Dataverse solution lifecycle management.',
    jwell_status: 911120003, // Published
    jwell_statusname: 'Published',
    jwell_passmarkpercent: 75,
    jwell_timelimitminutes: 30,
    jwell_questionsperattempt: 5,
    jwell_certificateenabled: true,
    jwell_retakepolicy: 911120002, // Unlimited
    jwell_retakepolicyname: 'Unlimited Retakes',
    jwell_maxattempts: 99,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
  },
  {
    jwell_quizid: 'quiz-003',
    jwell_title: 'Fullstack TypeScript & Modern Web Engineering',
    jwell_description: 'Deep-dive assessment covering strict type invariants, state modeling, asynchronous concurrent rendering, and performance profiling.',
    jwell_status: 911120003, // Published
    jwell_statusname: 'Published',
    jwell_passmarkpercent: 70,
    jwell_timelimitminutes: 20,
    jwell_questionsperattempt: 4,
    jwell_certificateenabled: true,
    jwell_retakepolicy: 911120000, // One Attempt
    jwell_retakepolicyname: 'One Attempt',
    jwell_maxattempts: 1,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
  },
  {
    jwell_quizid: 'quiz-004',
    jwell_title: 'AI Engineering & Copilot Extensibility',
    jwell_description: 'Evaluates Retrieval-Augmented Generation (RAG), Model Context Protocol (MCP), prompt engineering boundaries, and evaluation metrics.',
    jwell_status: 911120001, // In Review
    jwell_statusname: 'In Review',
    jwell_passmarkpercent: 85,
    jwell_timelimitminutes: 35,
    jwell_questionsperattempt: 5,
    jwell_certificateenabled: true,
    jwell_retakepolicy: 911120001,
    jwell_retakepolicyname: 'Limited Retakes (2 attempts)',
    jwell_maxattempts: 2,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
  }
];

export const fallbackQuestions: (Jwell_questions & { quizId?: string })[] = [
  {
    jwell_questionid: 'q-101',
    quizId: 'quiz-001',
    jwell_questiontext: 'Which architectural pattern ensures zero-trust validation across distributed microservices?',
    jwell_difficulty: 911120001, // Medium
    jwell_difficultyname: 'Medium',
    jwell_questiontype: 911120000, // Single Choice
    jwell_questiontypename: 'Single Choice',
    jwell_explanation: 'Mutual TLS (mTLS) with short-lived cryptographically signed identity tokens provides mutual identity verification and encryption at every boundary.',
    jwell_timesused: 142,
    jwell_timescorrect: 114,
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_questionid: 'q-102',
    quizId: 'quiz-001',
    jwell_questiontext: 'What is the primary benefit of deploying Cloud KMS with envelope encryption?',
    jwell_difficulty: 911120002, // Hard
    jwell_difficultyname: 'Hard',
    jwell_questiontype: 911120000,
    jwell_questiontypename: 'Single Choice',
    jwell_explanation: 'Envelope encryption protects data with a unique Data Encryption Key (DEK), while the DEK itself is encrypted using a Master Key (KEK) inside the HSM module.',
    jwell_timesused: 98,
    jwell_timescorrect: 68,
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_questionid: 'q-103',
    quizId: 'quiz-001',
    jwell_questiontext: 'Which protocol is mandatory for secure ephemeral communications between serverless workloads?',
    jwell_difficulty: 911120000, // Easy
    jwell_difficultyname: 'Easy',
    jwell_questiontype: 911120000,
    jwell_questiontypename: 'Single Choice',
    jwell_explanation: 'HTTPS with TLS 1.3 ensures encrypted end-to-end transport with perfect forward secrecy.',
    jwell_timesused: 210,
    jwell_timescorrect: 195,
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_questionid: 'q-201',
    quizId: 'quiz-002',
    jwell_questiontext: 'What type of Power Platform solution component should be exported for production deployment across environments?',
    jwell_difficulty: 911120000,
    jwell_difficultyname: 'Easy',
    jwell_questiontype: 911120000,
    jwell_questiontypename: 'Single Choice',
    jwell_explanation: 'Managed solutions protect target environment components from unintended drift and enable deterministic upgrades/deletions.',
    jwell_timesused: 320,
    jwell_timescorrect: 288,
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_questionid: 'q-202',
    quizId: 'quiz-002',
    jwell_questiontext: 'Which Dataverse mechanism should be configured to hold environment-specific connection settings without code modification?',
    jwell_difficulty: 911120001,
    jwell_difficultyname: 'Medium',
    jwell_questiontype: 911120000,
    jwell_questiontypename: 'Single Choice',
    jwell_explanation: 'Environment Variables allow configuration parameters to be overridden per target deployment stage in ALM pipelines.',
    jwell_timesused: 245,
    jwell_timescorrect: 215,
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_questionid: 'q-301',
    quizId: 'quiz-003',
    jwell_questiontext: 'Which TypeScript utility type constructs a type with all properties of T set to optional except specified keys?',
    jwell_difficulty: 911120001,
    jwell_difficultyname: 'Medium',
    jwell_questiontype: 911120000,
    jwell_questiontypename: 'Single Choice',
    jwell_explanation: 'Combining Partial<T> & Pick<T, K> or Omit<Partial<T>, K> & Required<Pick<T, K>> provides strict partiality with selective requirements.',
    jwell_timesused: 180,
    jwell_timescorrect: 142,
    statecode: 0,
    ownerid: 'system-admin'
  }
];

export const fallbackAnswerOptions: (Jwell_answeroptions & { questionId: string })[] = [
  // Options for q-101
  {
    jwell_answeroptionid: 'opt-101-1',
    questionId: 'q-101',
    jwell_optiontext: 'Mutual TLS (mTLS) with short-lived cryptographically signed tokens',
    jwell_iscorrect: true,
    jwell_sortorder: 1,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-101)'
  },
  {
    jwell_answeroptionid: 'opt-101-2',
    questionId: 'q-101',
    jwell_optiontext: 'Static shared API keys stored in environment variables',
    jwell_iscorrect: false,
    jwell_sortorder: 2,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-101)'
  },
  {
    jwell_answeroptionid: 'opt-101-3',
    questionId: 'q-101',
    jwell_optiontext: 'Perimeter firewalls relying solely on IP allowlisting',
    jwell_iscorrect: false,
    jwell_sortorder: 3,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-101)'
  },
  {
    jwell_answeroptionid: 'opt-101-4',
    questionId: 'q-101',
    jwell_optiontext: 'Unencrypted VPC peering with basic HTTP headers',
    jwell_iscorrect: false,
    jwell_sortorder: 4,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-101)'
  },

  // Options for q-102
  {
    jwell_answeroptionid: 'opt-102-1',
    questionId: 'q-102',
    jwell_optiontext: 'Data is protected by local DEK, while DEK is encrypted using KEK via hardware security modules (HSM)',
    jwell_iscorrect: true,
    jwell_sortorder: 1,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-102)'
  },
  {
    jwell_answeroptionid: 'opt-102-2',
    questionId: 'q-102',
    jwell_optiontext: 'Single master key is sent across all client devices directly',
    jwell_iscorrect: false,
    jwell_sortorder: 2,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-102)'
  },
  {
    jwell_answeroptionid: 'opt-102-3',
    questionId: 'q-102',
    jwell_optiontext: 'Encryption occurs purely in database triggers with plain text storage',
    jwell_iscorrect: false,
    jwell_sortorder: 3,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-102)'
  },

  // Options for q-103
  {
    jwell_answeroptionid: 'opt-103-1',
    questionId: 'q-103',
    jwell_optiontext: 'TLS 1.3 over HTTPS with forward secrecy',
    jwell_iscorrect: true,
    jwell_sortorder: 1,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-103)'
  },
  {
    jwell_answeroptionid: 'opt-103-2',
    questionId: 'q-103',
    jwell_optiontext: 'Raw TCP sockets on unprivileged ports',
    jwell_iscorrect: false,
    jwell_sortorder: 2,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-103)'
  },

  // Options for q-201
  {
    jwell_answeroptionid: 'opt-201-1',
    questionId: 'q-201',
    jwell_optiontext: 'Managed Solution',
    jwell_iscorrect: true,
    jwell_sortorder: 1,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-201)'
  },
  {
    jwell_answeroptionid: 'opt-201-2',
    questionId: 'q-201',
    jwell_optiontext: 'Unmanaged Solution',
    jwell_iscorrect: false,
    jwell_sortorder: 2,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-201)'
  },

  // Options for q-202
  {
    jwell_answeroptionid: 'opt-202-1',
    questionId: 'q-202',
    jwell_optiontext: 'Environment Variables (CDS / Dataverse)',
    jwell_iscorrect: true,
    jwell_sortorder: 1,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-202)'
  },
  {
    jwell_answeroptionid: 'opt-202-2',
    questionId: 'q-202',
    jwell_optiontext: 'Hardcoded JSON strings in client files',
    jwell_iscorrect: false,
    jwell_sortorder: 2,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-202)'
  },

  // Options for q-301
  {
    jwell_answeroptionid: 'opt-301-1',
    questionId: 'q-301',
    jwell_optiontext: 'Partial<Omit<T, K>> & Pick<T, K>',
    jwell_iscorrect: true,
    jwell_sortorder: 1,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-301)'
  },
  {
    jwell_answeroptionid: 'opt-301-2',
    questionId: 'q-301',
    jwell_optiontext: 'any & unknown',
    jwell_iscorrect: false,
    jwell_sortorder: 2,
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_OrganisationID@odata.bind": '/jwell_organisations(org-001)',
    "jwell_QuestionID@odata.bind": '/jwell_questions(q-301)'
  }
];

export const fallbackCertificates: Jwell_certificates[] = [
  {
    jwell_certificateid: 'cert-8801',
    jwell_certificate_name: 'Certified Cloud Solutions Specialist',
    jwell_credentialid: 'JWELL-CERT-2026-8801',
    jwell_issue_date: '2026-03-15',
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_Quiz@odata.bind": '/jwell_quizs(quiz-001)'
  },
  {
    jwell_certificateid: 'cert-8802',
    jwell_certificate_name: 'Power Platform Systems Architect',
    jwell_credentialid: 'JWELL-CERT-2026-8802',
    jwell_issue_date: '2026-04-02',
    statecode: 0,
    ownerid: 'system-admin',
    "jwell_Quiz@odata.bind": '/jwell_quizs(quiz-002)'
  }
];

export const fallbackBadges: Jwell_badges[] = [
  {
    jwell_badgeid: 'badge-01',
    jwell_badgename: 'Distinguished Architect',
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_badgeid: 'badge-02',
    jwell_badgename: 'First Time 100% Score',
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_badgeid: 'badge-03',
    jwell_badgename: 'Speed Master (<10m finish)',
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_badgeid: 'badge-04',
    jwell_badgename: 'Continuous Learning Streak',
    statecode: 0,
    ownerid: 'system-admin'
  }
];

export const fallbackTrainings: Jwell_trainings[] = [
  {
    jwell_trainingid: 'train-501',
    jwell_title: 'Zero-Trust Architecture Masterclass',
    jwell_description: 'Interactive session exploring identity providers, token validation, and secure cloud API gateways.',
    jwell_sessiondate: '2026-10-25T14:00:00Z',
    jwell_teamsmeetingname: 'Join Teams: Zero-Trust Engineering Cohort',
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_trainingid: 'train-502',
    jwell_title: 'Dataverse Advanced Querying & Performance Tuning',
    jwell_description: 'Deep dive into FetchXML optimization, batching techniques, and relationship lookups for high-throughput apps.',
    jwell_sessiondate: '2026-11-04T10:00:00Z',
    jwell_teamsmeetingname: 'Join Teams: Dataverse Performance Clinic',
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_trainingid: 'train-503',
    jwell_title: 'Building Resilient React & Vite Code Apps',
    jwell_description: 'Best practices for Power Apps Code Apps development, lifecycle state management, and enterprise bundling.',
    jwell_sessiondate: '2026-11-18T16:00:00Z',
    jwell_teamsmeetingname: 'Join Teams: Power Apps Code Apps Workshop',
    statecode: 0,
    ownerid: 'system-admin'
  }
];

export const fallbackAttempts: Jwell_attempts[] = [
  {
    jwell_attemptid: 'att-901',
    jwell_attemptname: 'Attempt #1 - Cloud Architecture (Score: 92%)',
    statecode: 0,
    ownerid: 'system-admin'
  },
  {
    jwell_attemptid: 'att-902',
    jwell_attemptname: 'Attempt #2 - Power Platform Governance (Score: 88%)',
    statecode: 0,
    ownerid: 'system-admin'
  }
];
