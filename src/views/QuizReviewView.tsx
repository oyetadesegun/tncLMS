import React from "react";

interface QuizReviewViewProps {
  score?: string;
  correct?: string;
  total?: string;
  onNavigate: (path: string) => void;
}

export const QuizReviewView: React.FC<QuizReviewViewProps> = ({
  score = "60",
  correct = "3",
  total = "5",
  onNavigate,
}) => {
  return (
    <div className="view-content-centered results-passed-wrapper">
      <div className="trophy-glow-container">
        <div className="trophy-circle bg-amber-100 text-amber-700">
          <span className="material-symbols-outlined icon-extra-large">menu_book</span>
        </div>
      </div>

      <div className="status-pill-passed" style={{ background: "#fef3c7", color: "#92400e" }}>
        <span className="material-symbols-outlined icon-small">replay</span>
        <span>Review Recommended • Passing Threshold: 80%</span>
      </div>

      <h1 className="results-passed-title">
        Almost there! Keep practicing
      </h1>
      <p className="results-passed-sub">
        You scored <strong>{score}%</strong> ({correct}/{total} correct). Review the key topics below and take another attempt to earn your certification.
      </p>

      <div className="results-score-card">
        <div className="competencies-block">
          <div className="competencies-heading">Topic Readiness Review</div>

          <div className="competency-item">
            <div className="competency-labels">
              <span>Phishing & Credential Reset Handling</span>
              <span className="font-bold text-emerald">Passed</span>
            </div>
            <div className="competency-bar-track">
              <div className="competency-bar-fill bg-emerald" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="competency-item">
            <div className="competency-labels">
              <span>SCADA Air-Gap USB Protocols</span>
              <span className="font-bold text-amber">Review Needed</span>
            </div>
            <div className="competency-bar-track">
              <div className="competency-bar-fill bg-amber" style={{ width: "50%" }} />
            </div>
          </div>
        </div>

        <div className="results-actions-row">
          <button onClick={() => onNavigate("/quiz/take")} className="btn-primary-glow">
            <span className="material-symbols-outlined icon-small">replay</span>
            <span>Retake Assessment</span>
          </button>
          <button onClick={() => onNavigate("/")} className="btn-secondary-flat">
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
