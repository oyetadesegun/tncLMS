import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  question: string;
  scenario?: string;
  options: string[];
  correct: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "You receive an email from 'it-support@transcorpgroup-security.com' requesting an urgent MFA token reset. What is the correct protocol?",
    scenario: "Urgent email alert received during active shifts requesting emergency credential input.",
    options: [
      "Reply with the 6-digit authenticator code immediately to prevent account lock.",
      "Click the link to verify if the certificate on the webpage is valid.",
      "Flag as phishing via the Transcorp Outlook plugin and alert the SOC helpline.",
      "Forward the email to team colleagues to verify if they received it too."
    ],
    correct: 2,
  },
  {
    id: 2,
    question: "When connecting a portable USB drive into a SCADA substation control terminal, what policy applies?",
    scenario: "Field engineer needing to transfer firmware patch to high-voltage breaker unit.",
    options: [
      "Any enterprise-encrypted USB drive is authorized without prior scanning.",
      "Air-gapped systems prohibit unauthorized external media; devices must be vetted via the IT kiosk.",
      "External media is permitted if formatted with NTFS and password protected.",
      "Only drives under 16GB capacity may be connected without supervisor approval."
    ],
    correct: 1,
  },
  {
    id: 3,
    question: "Which of the following constitutes an immediate Severity 1 incident under Transcorp Information Security standard?",
    options: [
      "A failed login attempt on a non-production test laptop.",
      "Scheduled reboot of an internal file repository server.",
      "Unsanctioned lateral movement detected across substation telemetry networks.",
      "Delayed delivery of external marketing newsletters."
    ],
    correct: 2,
  },
  {
    id: 4,
    question: "What is the minimum recommended length and complexity for Transcorp privileged executive credentials?",
    options: [
      "8 characters with numbers only.",
      "10 characters with standard alphanumeric sequence.",
      "16+ characters utilizing passphrase entropy and mandatory hardware token MFA.",
      "12 characters changed once every 3 years."
    ],
    correct: 2,
  },
  {
    id: 5,
    question: "If an unexpected browser prompt asks to accept an untrusted root SSL certificate when loading internal dashboards, you should:",
    options: [
      "Accept the risk and proceed to bypass the warning.",
      "Terminate the session immediately and submit an alert to enterprise security.",
      "Disable the browser warning in developer settings.",
      "Clear browser cookies and retry repeatedly."
    ],
    correct: 1,
  },
];

interface QuizTakeViewProps {
  onNavigate: (path: string) => void;
  onRecordAttempt?: (score: number, passed: boolean) => void;
}

export const QuizTakeView: React.FC<QuizTakeViewProps> = ({ onNavigate, onRecordAttempt }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 45); // 14m 45s

  const handleSubmit = React.useCallback(() => {
    let correctCount = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / QUESTIONS.length) * 100);
    const passed = score >= 80;

    if (onRecordAttempt) {
      onRecordAttempt(score, passed);
    }

    if (passed) {
      onNavigate(`/quiz/results/passed?score=${score}&correct=${correctCount}&total=${QUESTIONS.length}`);
    } else {
      onNavigate(`/quiz/results/review?score=${score}&correct=${correctCount}&total=${QUESTIONS.length}`);
    }
  }, [answers, onNavigate, onRecordAttempt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit]);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="view-content-centered">
      {/* Top Test-Taking HUD */}
      <div className="test-hud-bar">
        <div className="hud-quiz-info">
          <span className="badge-pill badge-primary">
            <span className="live-indicator-dot" />
            <span>Live Assessment</span>
          </span>
          <span className="hud-title">Cybersecurity & Infrastructure Defense</span>
        </div>

        <div className="hud-timer-badge">
          <span className="material-symbols-outlined icon-small text-amber">timer</span>
          <span className="timer-digits font-mono">{formatTimer(secondsLeft)}</span>
        </div>
      </div>

      <div className="quiz-take-layout">
        {/* Main Question Column */}
        <div className="quiz-take-question-col">
          <div className="question-display-card">
            <div className="question-card-top-bar">
              <span className="question-seq-text">Question {currentIdx + 1} of {QUESTIONS.length}</span>
              <button onClick={toggleFlag} className={`btn-flag-question ${flagged[currentQ.id] ? "is-flagged" : ""}`}>
                <span className="material-symbols-outlined icon-small">
                  {flagged[currentQ.id] ? "flag" : "outlined_flag"}
                </span>
                <span>{flagged[currentQ.id] ? "Flagged for Review" : "Flag Question"}</span>
              </button>
            </div>

            {currentQ.scenario && (
              <div className="scenario-highlight-box">
                <span className="material-symbols-outlined icon-small text-secondary">info</span>
                <span>{currentQ.scenario}</span>
              </div>
            )}

            <h2 className="live-question-stem">{currentQ.question}</h2>

            {/* Answer Options */}
            <div className="live-options-stack">
              {currentQ.options.map((optText, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`live-option-btn ${isSelected ? "selected" : ""}`}
                  >
                    <div className="option-letter-badge">{letter}</div>
                    <span className="option-text-label">{optText}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="question-nav-row">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                className="btn-quiz-prev"
              >
                <span className="material-symbols-outlined icon-small">arrow_back</span>
                <span>Previous</span>
              </button>

              {currentIdx < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => prev + 1)}
                  className="btn-quiz-next"
                >
                  <span>Next Question</span>
                  <span className="material-symbols-outlined icon-small">arrow_forward</span>
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn-quiz-submit">
                  <span className="material-symbols-outlined icon-small">check_circle</span>
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Palette Column */}
        <div className="quiz-take-palette-col">
          <div className="palette-card">
            <h4 className="palette-title">Question Palette</h4>
            <div className="palette-grid">
              {QUESTIONS.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentIdx === idx;
                const isFlag = flagged[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`palette-num-btn ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""} ${isFlag ? "flagged" : ""}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlag && <span className="flag-dot" />}
                  </button>
                );
              })}
            </div>

            <div className="palette-legend">
              <div className="legend-item">
                <span className="legend-box answered" />
                <span>Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="legend-item">
                <span className="legend-box unattempted" />
                <span>Remaining ({QUESTIONS.length - Object.keys(answers).length})</span>
              </div>
              <div className="legend-item">
                <span className="legend-box flagged" />
                <span>Flagged ({Object.values(flagged).filter(Boolean).length})</span>
              </div>
            </div>

            <button onClick={handleSubmit} className="btn-sidebar-submit">
              Submit & Finalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
