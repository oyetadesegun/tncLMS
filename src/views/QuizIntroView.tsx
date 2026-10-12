import React, { useState } from "react";
import { CoursesStore } from "../data/coursesStore";

interface QuizIntroViewProps {
  onNavigate: (path: string) => void;
}

export const QuizIntroView: React.FC<QuizIntroViewProps> = ({ onNavigate }) => {
  const [confirmed, setConfirmed] = useState(true);
  const courses = CoursesStore.getCourses();
  const leadCourse = courses.find((c) => c.courseCode.includes("CYBER")) || courses[0];

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
          <span className="crumb-current">Cybersecurity Awareness</span>
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
                  <span>Mandatory Compliance • Post-Live Assessment</span>
                </span>
                <span className="badge-pill badge-secondary">
                  <span className="material-symbols-outlined icon-tiny">verified_user</span>
                  <span>ISO 27001 Accredited</span>
                </span>
              </div>

              <div>
                <h1 className="intro-title">Cybersecurity Awareness: Quiz</h1>
                <p className="intro-description">
                  Verify your comprehension of modern phishing vectors, enterprise credential hygiene, and immediate incident reporting protocols following the Q4 corporate live webinar.
                </p>
              </div>

              {/* Facilitator Info */}
              <div className="facilitator-banner">
                <div className="facilitator-info-group">
                  <div className="trainer-avatar-bubble" style={{ background: "var(--color-primary)" }}>
                    {leadCourse?.trainer.avatar || "SO"}
                  </div>
                  <div>
                    <div className="facilitator-title">
                      {leadCourse?.audienceScope === "ALL" ? "🌐 Scope: ALL Transcorp Group (All Subsidiaries)" : `🏢 Scope: ${leadCourse?.targetSubsidiary}`}
                    </div>
                    <div className="facilitator-lead">
                      Lead Course Trainer: <strong>{leadCourse?.trainer.fullName || "Segun Oyetade"}</strong> ({leadCourse?.trainer.email || "segun.oyetade@transcorpgroup.com"})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Launching recorded training session facilitated by ${leadCourse?.trainer.fullName || "Segun Oyetade"}...`)}
                  className="btn-review-recording"
                >
                  <span className="material-symbols-outlined icon-small">play_circle</span>
                  <span>Review Recording (48m)</span>
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
              <div className="metric-value-text">10 Questions</div>
              <div className="metric-sub-text">Single & Scenario choice</div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap bg-surface-low text-primary">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div className="metric-value-text">15 Minutes</div>
              <div className="metric-sub-text">Timed continuous run</div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap bg-surface-low text-primary">
                <span className="material-symbols-outlined">award_star</span>
              </div>
              <div className="metric-value-text">80% Pass Mark</div>
              <div className="metric-sub-text">8/10 minimum to pass</div>
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
                <span><strong>Instant Accreditation:</strong> Immediate certificate generation upon passing score of 80%+.</span>
              </div>
              <div className="rule-item">
                <span className="material-symbols-outlined text-emerald">check_circle</span>
                <span><strong>Retake Policy:</strong> Maximum 2 retakes permitted within 14 calendar days.</span>
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
                onClick={() => onNavigate("/quiz/take")}
                className="btn-start-assessment-primary"
              >
                <span>Begin Assessment Now</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Info */}
        <div className="quiz-intro-sidebar-col">
          <div className="accreditation-perks-card">
            <h4 className="perks-heading">Accreditation Rewards</h4>
            <div className="perks-list">
              <div className="perk-row">
                <span className="material-symbols-outlined text-amber">military_tech</span>
                <div>
                  <div className="perk-name">+350 XP Level Award</div>
                  <div className="perk-desc">Contributes directly to Level 4 promotion</div>
                </div>
              </div>
              <div className="perk-row">
                <span className="material-symbols-outlined text-primary">workspace_premium</span>
                <div>
                  <div className="perk-name">Digital Wallet Badge</div>
                  <div className="perk-desc">ISO 27001 Cryptographic Certificate</div>
                </div>
              </div>
              <div className="perk-row">
                <span className="material-symbols-outlined text-secondary">domain</span>
                <div>
                  <div className="perk-name">Substation Compliance</div>
                  <div className="perk-desc">Satisfies statutory grid operator audit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
