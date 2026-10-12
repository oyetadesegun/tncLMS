import React, { useState, useEffect } from "react";
import { CoursesStore, type Course } from "../data/coursesStore";
import { NotificationService } from "../data/notificationService";
import { generateAssessmentBuilderLink } from "../data/notificationService";

interface CreateAssessmentViewProps {
  onNavigate: (path: string) => void;
}

interface QuizQuestion {
  id: string;
  stem: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

function generateId() {
  return `Q-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

const BLANK_QUESTION = (): QuizQuestion => ({
  id: generateId(),
  stem: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: "",
});

export const CreateAssessmentView: React.FC<CreateAssessmentViewProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  // Step tracker: 1 = Course/Audience, 2 = Question Builder, 3 = Rules, 4 = Trainer Submit
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 fields
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [audienceScope, setAudienceScope] = useState<"ALL" | "SUBSIDIARY">("ALL");
  const [unit, setUnit] = useState("Transcorp Power Plc");
  const [passMark, setPassMark] = useState("80");
  const [timeLimit, setTimeLimit] = useState("20");

  // Step 2: Question Builder
  const [questions, setQuestions] = useState<QuizQuestion[]>([BLANK_QUESTION()]);
  const [activeQIdx, setActiveQIdx] = useState(0);

  // Step 3: Rules
  const [isProctored, setIsProctored] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [attemptsAllowed, setAttemptsAllowed] = useState("3");

  // Step 4: Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  useEffect(() => {
    const unsub = CoursesStore.subscribe((updated) => {
      setCourses(updated);
      if (!selectedCourseId && updated.length > 0) {
        setSelectedCourseId(updated[0].id);
        setTitle(`${updated[0].title} Assessment`);
        setAudienceScope(updated[0].audienceScope);
        setUnit(updated[0].targetSubsidiary);
      }
    });
    return unsub;
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const found = courses.find((c) => c.id === courseId);
    if (found) {
      setTitle(`${found.title} Assessment`);
      setAudienceScope(found.audienceScope);
      setUnit(found.targetSubsidiary);
    }
  };

  // ── Question Builder helpers ──────────────────────────────────────────────

  const updateQuestion = (idx: number, patch: Partial<QuizQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...patch } : q))
    );
  };

  const updateOption = (qIdx: number, optIdx: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const opts = [...q.options] as [string, string, string, string];
        opts[optIdx] = value;
        return { ...q, options: opts };
      })
    );
  };

  const addQuestion = () => {
    const newQ = BLANK_QUESTION();
    setQuestions((prev) => [...prev, newQ]);
    setActiveQIdx(questions.length); // focus new question
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
    setActiveQIdx(Math.max(0, idx - 1));
  };

  // ── Step 1 → 2 validation ─────────────────────────────────────────────────
  const canProceedStep1 = title.trim().length > 0;

  // ── Step 2 → 3 validation ─────────────────────────────────────────────────
  const canProceedStep2 = questions.every(
    (q) =>
      q.stem.trim().length > 0 &&
      q.options.every((o) => o.trim().length > 0)
  );

  // ── Step 4: Trainer submits to HR ─────────────────────────────────────────
  const handleTrainerSubmit = async () => {
    if (!selectedCourse) return;
    setIsSubmitting(true);
    try {
      await NotificationService.notifyTrainerSubmission(selectedCourse, questions.length);
      setSubmittedSuccessfully(true);
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const STEP_LABELS = [
    "Course & Audience",
    "Question Builder",
    "Exam Rules",
    "Submit to HR",
  ];

  // ── Builder link display ──────────────────────────────────────────────────
  const builderLink = selectedCourse
    ? generateAssessmentBuilderLink(selectedCourse)
    : "";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="admin-view-content">
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/assessments")} className="crumb-btn">
              Assessments
            </button>
            <span>/</span>
            <span className="text-primary font-bold">Create Assessment</span>
          </div>
          <h1 className="page-main-heading">
            Step {step}: {STEP_LABELS[step - 1]}
          </h1>
          <p className="page-sub-heading">
            {step === 1 && "Bind this assessment to an initiated course and set audience rules."}
            {step === 2 && "Author exam questions, options, and answer keys. Add as many as needed."}
            {step === 3 && "Configure proctoring, shuffle, and attempt rules."}
            {step === 4 && "Review everything and submit to HR for approval before going live."}
          </p>
        </div>

        {/* Step progress bar */}
        <div className="assessment-step-progress">
          {STEP_LABELS.map((label, i) => (
            <div
              key={label}
              className={`step-progress-dot ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "current" : ""}`}
              title={`Step ${i + 1}: ${label}`}
            >
              {step > i + 1 ? (
                <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>check</span>
              ) : (
                <span>{i + 1}</span>
              )}
              <span className="step-dot-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="create-assessment-form-card">

        {/* ── STEP 1: Course Binding & Audience ──────────────────────────────── */}
        {step === 1 && (
          <div className="form-stack">
            <div className="form-field-group">
              <label className="field-label">Associated Initiated Course *</label>
              <select
                value={selectedCourseId}
                onChange={(e) => handleSelectCourse(e.target.value)}
                className="form-text-input"
              >
                <option value="">-- Select an Initiated Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.courseCode}] {c.title} — Trainer: {c.trainer.fullName}
                  </option>
                ))}
              </select>
              {selectedCourse && (
                <div className="course-bound-preview">
                  <div className="flex-center-gap">
                    <span className="material-symbols-outlined icon-small text-amber">school</span>
                    <span className="font-bold">{selectedCourse.title}</span>
                    <span className="status-pill active">{selectedCourse.status}</span>
                  </div>
                  <div className="text-xs text-secondary" style={{ marginTop: "0.25rem" }}>
                    Trainer: <strong>{selectedCourse.trainer.fullName}</strong>
                    {" "}&bull;{" "}
                    Audience: <strong>{selectedCourse.targetSubsidiary}</strong>
                    {" "}&bull;{" "}
                    {selectedCourse.deliveryMethod === "Virtual"
                      ? `${selectedCourse.meetingPlatform || "Virtual"}`
                      : "Physical Session"}
                  </div>
                </div>
              )}
            </div>

            <div className="form-field-group">
              <label className="field-label">Assessment Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-text-input"
                placeholder="e.g. Q4 Cybersecurity Awareness Exam 2026"
              />
            </div>

            {/* Audience Scope */}
            <div className="form-section-group highlighted-section">
              <div className="section-label-chip">Audience Scope (HR Decision Gate)</div>
              <div className="audience-decision-grid">
                <label
                  className={`audience-decision-card ${audienceScope === "ALL" ? "active" : ""}`}
                  onClick={() => setAudienceScope("ALL")}
                >
                  <div className="decision-radio-row">
                    <input type="radio" name="scopeChoice" checked={audienceScope === "ALL"} onChange={() => setAudienceScope("ALL")} />
                    <span className="material-symbols-outlined icon-medium text-amber">public</span>
                    <span className="decision-title">ALL Transcorp Group</span>
                  </div>
                  <p className="decision-desc">Open to all 451 corporate learners across all subsidiaries.</p>
                  <div className="decision-stat-chip">Groupwide Broadcast</div>
                </label>
                <label
                  className={`audience-decision-card ${audienceScope === "SUBSIDIARY" ? "active" : ""}`}
                  onClick={() => setAudienceScope("SUBSIDIARY")}
                >
                  <div className="decision-radio-row">
                    <input type="radio" name="scopeChoice" checked={audienceScope === "SUBSIDIARY"} onChange={() => setAudienceScope("SUBSIDIARY")} />
                    <span className="material-symbols-outlined icon-medium text-amber">domain</span>
                    <span className="decision-title">Specific Subsidiary</span>
                  </div>
                  <p className="decision-desc">Restrict access to a single operating company only.</p>
                  <div className="decision-stat-chip">Subsidiary Restricted</div>
                </label>
              </div>
              {audienceScope === "SUBSIDIARY" && (
                <div className="subsidiary-picker-panel">
                  <label className="field-label">Target Transcorp Subsidiary *</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} className="form-text-input">
                    <option value="Transcorp Power Plc">Transcorp Power Plc (Ughelli)</option>
                    <option value="Transcorp Hotels Plc">Transcorp Hotels Plc (Abuja & Calabar)</option>
                    <option value="Transcorp Group HQ">Transcorp Group HQ (Corporate Centre)</option>
                    <option value="Transafam Power Limited">Transafam Power Limited (Afam)</option>
                    <option value="Ughelli Power Plc">Ughelli Power Plc</option>
                  </select>
                  <div className="text-xs text-amber" style={{ marginTop: "6px" }}>
                    ✓ Only learners in <strong>{unit}</strong> will be permitted to take this assessment.
                  </div>
                </div>
              )}
            </div>

            <div className="form-row-duo">
              <div className="form-field-group">
                <label className="field-label">Passing Threshold (%)</label>
                <input type="number" value={passMark} onChange={(e) => setPassMark(e.target.value)} className="form-text-input" />
              </div>
              <div className="form-field-group">
                <label className="field-label">Time Limit (Minutes)</label>
                <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="form-text-input" />
              </div>
            </div>

            {/* HR Assessment Builder Link */}
            {selectedCourse && (
              <div className="builder-link-panel">
                <div className="builder-link-header">
                  <span className="material-symbols-outlined icon-small text-amber">link</span>
                  <span className="font-bold">HR Assessment Builder Link</span>
                  <span className="text-xs text-secondary">— anyone with this link can create questions for this course</span>
                </div>
                <div className="builder-link-url-row">
                  <input
                    type="text"
                    readOnly
                    value={builderLink}
                    className="form-text-input font-mono"
                    style={{ fontSize: "0.72rem" }}
                  />
                  <button
                    type="button"
                    className="btn-primary-action"
                    style={{ flexShrink: 0 }}
                    onClick={() => {
                      navigator.clipboard.writeText(builderLink);
                      alert("Assessment builder link copied to clipboard! Share with the trainer or HR team.");
                    }}
                  >
                    <span className="material-symbols-outlined icon-small">content_copy</span>
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            )}

            <div className="form-actions-footer">
              <button onClick={() => onNavigate("/assessments")} className="btn-secondary-flat">Cancel</button>
              <button
                onClick={() => setStep(2)}
                className="btn-primary-action"
                disabled={!canProceedStep1}
              >
                <span>Step 2: Build Questions</span>
                <span className="material-symbols-outlined icon-small">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Question Builder ────────────────────────────────────────── */}
        {step === 2 && (
          <div className="form-stack">
            <div className="question-builder-layout">
              {/* Question List Sidebar */}
              <div className="question-list-sidebar">
                <div className="sidebar-header">
                  <span className="font-bold text-xs">Questions ({questions.length})</span>
                  <button type="button" className="btn-add-question" onClick={addQuestion} title="Add question">
                    <span className="material-symbols-outlined icon-small">add</span>
                  </button>
                </div>
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    type="button"
                    className={`question-list-item ${i === activeQIdx ? "active" : ""} ${q.stem.trim() ? "has-content" : "empty"}`}
                    onClick={() => setActiveQIdx(i)}
                  >
                    <span className="q-number">Q{i + 1}</span>
                    <span className="q-preview">{q.stem.trim() ? q.stem.slice(0, 40) + (q.stem.length > 40 ? "…" : "") : "Empty question"}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="btn-add-question-bottom"
                  onClick={addQuestion}
                >
                  <span className="material-symbols-outlined icon-small">add_circle</span>
                  <span>Add Question</span>
                </button>
              </div>

              {/* Active Question Editor */}
              <div className="question-editor-panel">
                {questions[activeQIdx] && (
                  <>
                    <div className="question-editor-header">
                      <span className="font-bold">Question {activeQIdx + 1} of {questions.length}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-question"
                          onClick={() => removeQuestion(activeQIdx)}
                          title="Remove this question"
                        >
                          <span className="material-symbols-outlined icon-small">delete</span>
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Question Stem *</label>
                      <textarea
                        rows={3}
                        placeholder="Write your question here…"
                        value={questions[activeQIdx].stem}
                        onChange={(e) => updateQuestion(activeQIdx, { stem: e.target.value })}
                        className="form-text-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Answer Options * — click the circle to mark the correct answer</label>
                      {questions[activeQIdx].options.map((opt, oi) => (
                        <div key={oi} className={`answer-option-row ${questions[activeQIdx].correctIndex === oi ? "correct" : ""}`}>
                          <button
                            type="button"
                            className={`answer-radio-btn ${questions[activeQIdx].correctIndex === oi ? "selected" : ""}`}
                            onClick={() => updateQuestion(activeQIdx, { correctIndex: oi })}
                            title="Mark as correct answer"
                          >
                            {questions[activeQIdx].correctIndex === oi ? (
                              <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--color-success, #16a34a)" }}>check_circle</span>
                            ) : (
                              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>radio_button_unchecked</span>
                            )}
                          </button>
                          <input
                            type="text"
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            value={opt}
                            onChange={(e) => updateOption(activeQIdx, oi, e.target.value)}
                            className="form-text-input"
                            style={{ flex: 1 }}
                          />
                          <span className={`option-label-chip ${questions[activeQIdx].correctIndex === oi ? "correct" : ""}`}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">
                        Explanation / Rationale <span className="field-optional-hint">(shown after submission)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Explain why the correct answer is right…"
                        value={questions[activeQIdx].explanation}
                        onChange={(e) => updateQuestion(activeQIdx, { explanation: e.target.value })}
                        className="form-text-input"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {!canProceedStep2 && (
              <div className="validation-warning-bar">
                <span className="material-symbols-outlined icon-small">warning</span>
                <span>All questions must have a stem and 4 filled options before proceeding.</span>
              </div>
            )}

            <div className="form-actions-footer">
              <button onClick={() => setStep(1)} className="btn-secondary-flat">
                <span className="material-symbols-outlined icon-small">arrow_back</span>
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary-action"
                disabled={!canProceedStep2}
              >
                <span>Step 3: Exam Rules</span>
                <span className="material-symbols-outlined icon-small">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Exam Rules ──────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="form-stack">
            <div className="rule-toggle-row">
              <div>
                <div className="font-bold">Strict Browser Tab Lockdown (Proctoring)</div>
                <div className="text-secondary text-xs">Terminates test attempt if unauthorized window switching is detected.</div>
              </div>
              <input type="checkbox" checked={isProctored} onChange={(e) => setIsProctored(e.target.checked)} className="rule-checkbox" />
            </div>

            <div className="rule-toggle-row">
              <div>
                <div className="font-bold">Shuffle Questions & Options</div>
                <div className="text-secondary text-xs">Randomizes question and answer order from pool — prevents sharing.</div>
              </div>
              <input type="checkbox" checked={shuffleQuestions} onChange={(e) => setShuffleQuestions(e.target.checked)} className="rule-checkbox" />
            </div>

            <div className="form-field-group" style={{ maxWidth: "240px" }}>
              <label className="field-label">Maximum Attempts Allowed</label>
              <select value={attemptsAllowed} onChange={(e) => setAttemptsAllowed(e.target.value)} className="form-text-input">
                <option value="1">1 — Single Attempt Only</option>
                <option value="2">2 — Two Attempts</option>
                <option value="3">3 — Three Attempts (Recommended)</option>
                <option value="99">Unlimited</option>
              </select>
            </div>

            <div className="form-actions-footer">
              <button onClick={() => setStep(2)} className="btn-secondary-flat">
                <span className="material-symbols-outlined icon-small">arrow_back</span>
                Back
              </button>
              <button onClick={() => setStep(4)} className="btn-primary-action">
                <span>Step 4: Review & Submit</span>
                <span className="material-symbols-outlined icon-small">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Trainer Review & Submit to HR ──────────────────────────── */}
        {step === 4 && (
          <div className="form-stack">
            {submittedSuccessfully ? (
              <div className="submission-success-panel">
                <span className="material-symbols-outlined success-icon-large">mark_email_read</span>
                <h2 className="font-bold" style={{ fontSize: "1.25rem", marginTop: "0.75rem" }}>Assessment Submitted to HR!</h2>
                <p className="text-secondary text-xs" style={{ maxWidth: "380px", textAlign: "center", marginTop: "0.5rem" }}>
                  HR has been notified by email and will review your {questions.length} questions.
                  You'll be notified once it's approved and published to learners.
                </p>
                <div className="submission-meta-grid">
                  <div><span className="field-label">Course</span><span>{selectedCourse?.title}</span></div>
                  <div><span className="field-label">Questions</span><span>{questions.length}</span></div>
                  <div><span className="field-label">Pass Mark</span><span>{passMark}%</span></div>
                  <div><span className="field-label">Proctoring</span><span>{isProctored ? "Enabled" : "Disabled"}</span></div>
                  <div><span className="field-label">HR Notified</span><span className="text-amber">segun.oyetade@transcorpgroup.com</span></div>
                </div>
                <button onClick={() => onNavigate("/assessments")} className="btn-primary-action" style={{ marginTop: "1.5rem" }}>
                  <span className="material-symbols-outlined icon-small">arrow_back</span>
                  Back to Assessments
                </button>
              </div>
            ) : (
              <>
                {/* Summary Review */}
                <div className="review-summary-grid">
                  <div className="review-summary-section">
                    <div className="section-label-chip">Assessment Details</div>
                    <div className="review-item"><span className="review-label">Title</span><span>{title}</span></div>
                    <div className="review-item"><span className="review-label">Course</span><span>{selectedCourse?.title ?? "—"}</span></div>
                    <div className="review-item"><span className="review-label">Audience</span><span>{audienceScope === "ALL" ? "ALL Transcorp Group" : unit}</span></div>
                    <div className="review-item"><span className="review-label">Pass Mark</span><span>{passMark}%</span></div>
                    <div className="review-item"><span className="review-label">Time Limit</span><span>{timeLimit} minutes</span></div>
                  </div>
                  <div className="review-summary-section">
                    <div className="section-label-chip">Questions & Rules</div>
                    <div className="review-item"><span className="review-label">Questions</span><span className="text-amber font-bold">{questions.length} authored</span></div>
                    <div className="review-item"><span className="review-label">Proctoring</span><span>{isProctored ? "✓ Enabled" : "✗ Disabled"}</span></div>
                    <div className="review-item"><span className="review-label">Shuffle</span><span>{shuffleQuestions ? "✓ Enabled" : "✗ Disabled"}</span></div>
                    <div className="review-item"><span className="review-label">Max Attempts</span><span>{attemptsAllowed === "99" ? "Unlimited" : attemptsAllowed}</span></div>
                    <div className="review-item"><span className="review-label">Notify HR at</span><span className="text-amber text-xs">segun.oyetade@transcorpgroup.com</span></div>
                  </div>
                </div>

                {/* Questions preview */}
                <div className="questions-review-list">
                  <div className="section-label-chip" style={{ marginBottom: "0.75rem" }}>Question Preview</div>
                  {questions.map((q, i) => (
                    <div key={q.id} className="question-review-card">
                      <div className="question-review-number">Q{i + 1}</div>
                      <div className="question-review-content">
                        <div className="font-bold text-xs">{q.stem || <em className="text-secondary">No stem entered</em>}</div>
                        <div className="options-mini-list">
                          {q.options.map((opt, oi) => (
                            <span
                              key={oi}
                              className={`option-mini ${q.correctIndex === oi ? "correct" : ""}`}
                            >
                              {String.fromCharCode(65 + oi)}. {opt || "—"}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-icon-subtle"
                        onClick={() => { setActiveQIdx(i); setStep(2); }}
                        title="Edit this question"
                      >
                        <span className="material-symbols-outlined icon-small">edit</span>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="submission-notice-box">
                  <span className="material-symbols-outlined icon-small text-amber">info</span>
                  <span className="text-xs">
                    Clicking <strong>Submit to HR</strong> will notify{" "}
                    <strong>segun.oyetade@transcorpgroup.com</strong> to review and approve this assessment before it goes live.
                    The assessment will NOT be visible to learners until HR approves it.
                  </span>
                </div>

                <div className="form-actions-footer">
                  <button onClick={() => setStep(3)} className="btn-secondary-flat">
                    <span className="material-symbols-outlined icon-small">arrow_back</span>
                    Back
                  </button>
                  <button
                    onClick={handleTrainerSubmit}
                    className="btn-primary-action btn-amber"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined icon-small spin">sync</span>
                        <span>Notifying HR…</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined icon-small">send</span>
                        <span>Submit to HR for Approval</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
