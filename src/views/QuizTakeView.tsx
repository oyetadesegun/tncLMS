import React, { useState, useEffect, useCallback } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSQuestion } from "../services/dataAdapter";
import { useAuth } from "../context/AuthContext";

interface QuizTakeViewProps {
  onNavigate: (path: string) => void;
  onRecordAttempt?: (score: number, passed: boolean) => void;
}

export const QuizTakeView: React.FC<QuizTakeViewProps> = ({ onNavigate, onRecordAttempt }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<LMSQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      setIsLoading(true);
      const data = await lmsDataService.getQuestions();
      if (isMounted) {
        setQuestions(data);
        setIsLoading(false);
      }
    }
    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q) => {
      const selectedOptIdx = answers[q.id];
      if (selectedOptIdx !== undefined && q.options[selectedOptIdx]?.isCorrect) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 80;

    // Record attempt to cloud Dataverse
    await lmsDataService.recordAttempt({
      quizId: "quiz-cyber",
      quizTitle: "Cybersecurity & Critical Infrastructure Defense",
      userEmail: user?.email || "segun.oyetade@transcorpgroup.com",
      userName: user?.fullName || "Segun Oyetade",
      scorePercent: score,
      passed,
      dateCompleted: new Date().toISOString(),
      answers,
    }).catch(() => {});

    if (onRecordAttempt) {
      onRecordAttempt(score, passed);
    }

    if (passed) {
      onNavigate(`/quiz/results/passed?score=${score}&correct=${correctCount}&total=${questions.length}`);
    } else {
      onNavigate(`/quiz/results/review?score=${score}&correct=${correctCount}&total=${questions.length}`);
    }
  }, [answers, questions, user, onNavigate, onRecordAttempt]);

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

  if (isLoading) {
    return (
      <div className="view-content-centered" style={{ padding: "60px", textAlign: "center" }}>
        <span className="material-symbols-outlined icon-spin" style={{ fontSize: "36px", color: "var(--tnc-orange)" }}>
          sync
        </span>
        <p style={{ marginTop: "16px", fontWeight: 600 }}>Loading assessment questions from cloud...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="view-content-centered" style={{ padding: "60px", textAlign: "center" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--tnc-slate-400)" }}>
          quiz
        </span>
        <h3 style={{ margin: "16px 0 8px" }}>No questions available</h3>
        <p style={{ color: "var(--tnc-slate-500)", marginBottom: "20px" }}>
          This assessment currently has no questions configured in the question bank.
        </p>
        <button onClick={() => onNavigate("/")} className="btn-primary-action">
          Return Home
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx] || questions[0];

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
              <span className="question-seq-text">Question {currentIdx + 1} of {questions.length}</span>
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

            <h2 className="live-question-stem">{currentQ.questionText}</h2>

            {/* Answer Options */}
            <div className="live-options-stack">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                return (
                  <button
                    key={opt.id || optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`live-option-btn ${isSelected ? "selected" : ""}`}
                  >
                    <div className="option-letter-badge">{letter}</div>
                    <span className="option-text-label">{opt.text}</span>
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

              {currentIdx < questions.length - 1 ? (
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
              {questions.map((q, idx) => {
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
                <span>Remaining ({questions.length - Object.keys(answers).length})</span>
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
