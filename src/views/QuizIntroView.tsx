import React, { useState, useEffect } from "react";
import { CoursesStore, type Course } from "../data/coursesStore";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSAssessment } from "../services/dataAdapter";

interface QuizIntroViewProps {
  onNavigate: (path: string) => void;
}

export const QuizIntroView: React.FC<QuizIntroViewProps> = ({ onNavigate }) => {
  const [confirmed, setConfirmed] = useState(true);
  const [assessment, setAssessment] = useState<LMSAssessment | null>(null);
  const [leadCourse, setLeadCourse] = useState<Course | null>(null);

  useEffect(() => {
    async function loadAssessment() {
      const urlParams = new URLSearchParams(window.location.search);
      const quizId = urlParams.get("id");

      const courses = CoursesStore.getCourses();
      const course = courses.find((c) => c.courseCode.includes("CYBER")) || courses[0] || null;
      setLeadCourse(course);

      if (quizId) {
        const found = await lmsDataService.getAssessmentById(quizId);
        if (found) {
          setAssessment(found);
          return;
        }
      }

      // Default assessment
      const all = await lmsDataService.getAssessments();
      if (all && all.length > 0) {
        setAssessment(all[0]);
      }
    }
    loadAssessment();
  }, []);

  const title = assessment?.title || leadCourse?.linkedAssessmentTitle || "Cybersecurity Awareness & Zero-Trust Defense";
  const desc = assessment?.description || leadCourse?.description || "Verify your comprehension of credential hygiene, phishing response, and data protection.";
  const questionsCount = assessment?.questionsCount || 5;
  const timeLimit = assessment?.timeLimitMinutes || 20;
  const passMark = assessment?.passMarkPercent || 80;
  const trainerName = assessment?.trainerName || leadCourse?.trainer.fullName || "Segun Oyetade";
  const trainerEmail = assessment?.trainerEmail || leadCourse?.trainer.email || "segun.oyetade@transcorpgroup.com";
  const trainerAvatar = leadCourse?.trainer.avatar || "SO";
  const targetScope = leadCourse?.audienceScope === "ALL"
    ? "🌐 Scope: ALL Transcorp Group (All Subsidiaries)"
    : `🏢 Scope: ${leadCourse?.targetSubsidiary || "Transcorp Power Plc"}`;

  return (
    <div className="view-content-centered">
      {/* Breadcrumb */}
      <div className="breadcrumb-strip">
        <div className="breadcrumb-links">
          <button onClick={() => onNavigate("/")} className="crumb-btn">
            <span className="material-symbols-outlined icon-small">home</span>
            <span>Home</span>
          </button>
          <span>/</span>
          <button onClick={() => onNavigate("/assessments")} className="crumb-btn">Assessments & Quizzes</button>
          <span>/</span>
          <span className="crumb-current">{title}</span>
        </div>
        <button onClick={() => onNavigate("/")} className="crumb-back-btn">
          <span className="material-symbols-outlined icon-small">arrow_back</span>
          <span>Back</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="quiz-intro-grid">
        <div className="quiz-intro-main-col">
          <div className="intro-hero-box">
            <div className="intro-hero-glow" />

            <div className="intro-hero-content">
              <div className="badges-row">
                <span className="badge-pill badge-primary">
                  <span className="material-symbols-outlined icon-small">security</span>
                  <span>Mandatory Compliance • Cloud Assessment</span>
                </span>
                <span className="badge-pill badge-secondary">
                  <span className="material-symbols-outlined icon-tiny">verified_user</span>
                  <span>ISO 27001 Accredited</span>
                </span>
              </div>

              <div>
                <h1 className="intro-title">{title}</h1>
                <p className="intro-description">{desc}</p>
              </div>

              {/* Facilitator Info */}
              <div className="facilitator-banner">
                <div className="facilitator-info-group">
                  <div className="trainer-avatar-bubble" style={{ background: "var(--color-primary)" }}>
                    {trainerAvatar}
                  </div>
                  <div>
                    <div className="facilitator-title">{targetScope}</div>
                    <div className="facilitator-lead">
                      Lead Course Trainer: <strong>{trainerName}</strong> ({trainerEmail})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Launching recorded training session facilitated by ${trainerName}...`)}
                  className="btn-review-recording"
                >
                  <span className="material-symbols-outlined icon-small">play_circle</span>
                  <span>Review Recording</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-triplet">
            <div className="metric-box">
              <div className="metric-icon-wrap bg-surface-low text-primary">
                <span className="material-symbols-outlined">format_list_bulleted</span>
              </div>
              <div className="metric-value-text">{questionsCount} Questions</div>
              <div className="metric-sub-text">From Central Question Bank</div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap bg-surface-low text-primary">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div className="metric-value-text">{timeLimit} Minutes</div>
              <div className="metric-sub-text">Timed continuous run</div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap bg-surface-low text-primary">
                <span className="material-symbols-outlined">award_star</span>
              </div>
              <div className="metric-value-text">{passMark}% Pass Mark</div>
              <div className="metric-sub-text">Minimum threshold to pass</div>
            </div>
          </div>

          {/* Assessment Protocol Checklist */}
          <div className="protocol-checklist-card">
            <h3 className="checklist-heading">Assessment Protocol & Rules</h3>
            <div className="rules-stack">
              <div className="rule-item">
                <span className="material-symbols-outlined text-emerald">check_circle</span>
                <span><strong>Closed Book Examination:</strong> No browser tabs or external reference documentation permitted.</span>
              </div>
              <div className="rule-item">
                <span className="material-symbols-outlined text-emerald">check_circle</span>
                <span><strong>Instant Accreditation:</strong> Immediate certificate generation upon passing score of {passMark}%+.</span>
              </div>
              <div className="rule-item">
                <span className="material-symbols-outlined text-emerald">check_circle</span>
                <span><strong>Retake Policy:</strong> {assessment?.retakePolicy || "Limited Retakes (3 attempts permitted)"}.</span>
              </div>
            </div>

            <div className="confirmation-checkbox-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                <span>I confirm that I am taking this assessment independently in compliance with Transcorp Code of Conduct.</span>
              </label>
            </div>

            <div className="action-row">
              <button
                disabled={!confirmed}
                onClick={() => onNavigate(`/quiz/take${assessment ? `?id=${assessment.id}` : ""}`)}
                className="btn-start-quiz"
              >
                <span>Begin Assessment</span>
                <span className="material-symbols-outlined icon-small">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
