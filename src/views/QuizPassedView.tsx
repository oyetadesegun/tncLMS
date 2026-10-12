import React from "react";

interface QuizPassedViewProps {
  score?: string;
  correct?: string;
  total?: string;
  onNavigate: (path: string) => void;
}

export const QuizPassedView: React.FC<QuizPassedViewProps> = ({
  score = "92",
  correct = "9",
  total = "10",
  onNavigate,
}) => {
  return (
    <div className="view-content-centered results-passed-wrapper">
      {/* Celebration Trophy & Glow */}
      <div className="trophy-glow-container">
        <div className="trophy-circle bg-emerald-100 text-emerald-600">
          <span className="material-symbols-outlined icon-extra-large">military_tech</span>
        </div>
        <div className="glow-emerald-bloom" />
      </div>

      {/* Status Pill */}
      <div className="status-pill-passed">
        <span className="material-symbols-outlined icon-small">verified</span>
        <span>Assessment Passed • Official Accreditation</span>
      </div>

      <h1 className="results-passed-title">
        Outstanding work, Amaka!
      </h1>
      <p className="results-passed-sub">
        You have successfully completed the <strong>Cybersecurity & Critical Infrastructure Defense</strong> assessment.
      </p>

      {/* Big Score Card */}
      <div className="results-score-card">
        <div className="score-stats-triplet">
          <div className="stat-slot">
            <span className="stat-slot-label">Final Score</span>
            <div className="stat-slot-val text-emerald">{score}%</div>
            <span className="stat-slot-sub">Passing mark: 80%</span>
          </div>
          <div className="stat-slot">
            <span className="stat-slot-label">Correct</span>
            <div className="stat-slot-val">{correct}/{total}</div>
            <span className="stat-slot-sub">Questions</span>
          </div>
          <div className="stat-slot">
            <span className="stat-slot-label">XP Awarded</span>
            <div className="stat-slot-val text-primary">+350</div>
            <span className="stat-slot-sub">Level progress</span>
          </div>
        </div>

        {/* Competency Mastery Breakdown */}
        <div className="competencies-block">
          <div className="competencies-heading">Competency Breakdown</div>

          <div className="competency-item">
            <div className="competency-labels">
              <span>Phishing & Social Engineering Vectors</span>
              <span className="font-bold text-emerald">100% (Mastered)</span>
            </div>
            <div className="competency-bar-track">
              <div className="competency-bar-fill bg-emerald" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="competency-item">
            <div className="competency-labels">
              <span>SCADA & Telemetry Air-Gap Security</span>
              <span className="font-bold text-emerald">90% (Proficient)</span>
            </div>
            <div className="competency-bar-track">
              <div className="competency-bar-fill bg-emerald" style={{ width: "90%" }} />
            </div>
          </div>

          <div className="competency-item">
            <div className="competency-labels">
              <span>Incident Response Escalation Protocols</span>
              <span className="font-bold text-emerald">85% (Competent)</span>
            </div>
            <div className="competency-bar-track">
              <div className="competency-bar-fill bg-emerald" style={{ width: "85%" }} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions-row">
          <button onClick={() => onNavigate("/certificates/view")} className="btn-primary-glow">
            <span className="material-symbols-outlined icon-small">workspace_premium</span>
            <span>View & Print Official Certificate</span>
          </button>
          <button onClick={() => onNavigate("/certificates")} className="btn-secondary-flat">
            <span>Go to Digital Wallet</span>
          </button>
          <button onClick={() => onNavigate("/")} className="btn-tertiary-outline">
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
