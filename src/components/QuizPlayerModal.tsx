import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Jwell_quizs } from '../generated/models/Jwell_quizsModel';
import type { Jwell_questions } from '../generated/models/Jwell_questionsModel';
import type { Jwell_answeroptions } from '../generated/models/Jwell_answeroptionsModel';

interface QuizPlayerModalProps {
  quiz: Jwell_quizs;
  questions: Jwell_questions[];
  answerOptions: Jwell_answeroptions[];
  onClose: () => void;
  onRecordAttempt: (quizName: string, score: number, passed: boolean) => void;
  onViewCertificate?: (quizTitle: string) => void;
}

export const QuizPlayerModal: React.FC<QuizPlayerModalProps> = ({
  quiz,
  questions,
  answerOptions,
  onClose,
  onRecordAttempt,
  onViewCertificate
}) => {
  // Select questions for this quiz or pool
  const maxQ = quiz.jwell_questionsperattempt || 5;
  const quizQuestions = useMemo(() => {
    return questions.length > 0 ? questions.slice(0, maxQ) : [];
  }, [questions, maxQ]);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((quiz.jwell_timelimitminutes || 20) * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [scorePercent, setScorePercent] = useState<number | null>(null);
  const [isPassed, setIsPassed] = useState(false);

  const currentQ = quizQuestions[currentIdx];

  const handleSelectOption = (optionId: string) => {
    if (!currentQ || isFinished) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.jwell_questionid]: optionId
    }));
  };

  const handleFinishQuiz = useCallback(() => {
    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach(q => {
      const selectedOptId = selectedAnswers[q.jwell_questionid];
      const matchingOpt = answerOptions.find(o => o.jwell_answeroptionid === selectedOptId);
      if (matchingOpt && matchingOpt.jwell_iscorrect) {
        correctCount += 1;
      }
    });

    const percent = quizQuestions.length > 0 ? Math.round((correctCount / quizQuestions.length) * 100) : 100;
    const passThreshold = quiz.jwell_passmarkpercent || 75;
    const passed = percent >= passThreshold;

    setScorePercent(percent);
    setIsPassed(passed);
    setIsFinished(true);

    onRecordAttempt(quiz.jwell_title || 'Assessment', percent, passed);
  }, [answerOptions, onRecordAttempt, quiz.jwell_passmarkpercent, quiz.jwell_title, quizQuestions, selectedAnswers]);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, handleFinishQuiz]);

  const currentOptions = useMemo(() => {
    if (!currentQ) return [];
    return answerOptions.filter((opt) => {
      const qIdBind = (opt as { questionId?: string }).questionId;
      const qBind = opt['jwell_QuestionID@odata.bind'] || '';
      return qIdBind === currentQ.jwell_questionid || qBind.includes(currentQ.jwell_questionid);
    });
  }, [currentQ, answerOptions]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{quiz.jwell_title}</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Pass threshold: {quiz.jwell_passmarkpercent || 75}%
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {!isFinished ? (
            <div>
              {/* Timer & Progress */}
              <div className="quiz-timer-strip">
                <div className="quiz-timer">
                  <span>⏱️</span>
                  <span>{formatTime(timeLeftSeconds)}</span>
                </div>
                <div className="quiz-progress-text">
                  Question {currentIdx + 1} of {quizQuestions.length}
                </div>
              </div>

              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((currentIdx + 1) / (quizQuestions.length || 1)) * 100}%` }}
                />
              </div>

              {/* Active Question */}
              {currentQ ? (
                <div className="active-question-card">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge-status status-review">
                      {currentQ.jwell_difficultyname || 'Medium'}
                    </span>
                    <span className="badge-status status-draft">
                      {currentQ.jwell_questiontypename || 'Single Choice'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                    {currentQ.jwell_questiontext}
                  </h4>

                  <div className="question-options-list">
                    {currentOptions.map((opt) => {
                      const isSelected = selectedAnswers[currentQ.jwell_questionid] === opt.jwell_answeroptionid;
                      return (
                        <button
                          key={opt.jwell_answeroptionid}
                          className={`option-button ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectOption(opt.jwell_answeroptionid)}
                        >
                          <span className="option-indicator" />
                          <span>{opt.jwell_optiontext}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p>No questions found for this assessment.</p>
              )}

              {/* Navigation Footer */}
              <div className="quiz-nav-footer">
                <button
                  className="btn-secondary"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                  style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}
                >
                  &larr; Previous
                </button>

                {currentIdx < quizQuestions.length - 1 ? (
                  <button
                    className="btn-primary"
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                  >
                    Next Question &rarr;
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={handleFinishQuiz}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="quiz-result-box">
              <div className={`result-icon-circle ${isPassed ? 'result-passed' : 'result-failed'}`}>
                {isPassed ? '🏆' : '⚠️'}
              </div>

              <div className="result-score" style={{ color: isPassed ? '#34d399' : '#fb7185' }}>
                {scorePercent}%
              </div>

              <div className="result-verdict" style={{ color: isPassed ? '#34d399' : '#fb7185' }}>
                {isPassed ? 'Assessment Passed! Congratulations!' : 'Assessment Not Passed - Keep Practicing'}
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 1.75rem' }}>
                {isPassed
                  ? `You achieved the required passing mark of ${quiz.jwell_passmarkpercent || 75}%. Your attempt was logged in Dataverse and a completion record has been saved.`
                  : `You scored ${scorePercent}%, which is below the required ${quiz.jwell_passmarkpercent || 75}%. You can review the learning topics and retake the assessment.`}
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {isPassed && quiz.jwell_certificateenabled && onViewCertificate && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      onClose();
                      onViewCertificate(quiz.jwell_title || 'Certified Specialist');
                    }}
                  >
                    <span>🎖️</span> View Certificate
                  </button>
                )}
                <button className="btn-secondary" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
