import React, { useState } from "react";
import { lmsDataService } from "../services/lmsDataService";

interface QuizBuilderViewProps {
  onNavigate: (path: string) => void;
}

export const QuizBuilderView: React.FC<QuizBuilderViewProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<"questions" | "audience">("questions");

  // Question authoring state
  const [stem, setStem] = useState("");
  const [category, setCategory] = useState("Cybersecurity");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState<string[]>([
    "Primary compliance protocol requirement",
    "Secondary alternative procedure",
    "Non-compliant security practice",
    "Third-party advisory option",
  ]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleSaveQuestion = async () => {
    if (!stem.trim()) {
      alert("Please provide the question stem.");
      return;
    }

    setIsSaving(true);
    try {
      await lmsDataService.createQuestion({
        questionText: stem.trim(),
        difficulty,
        category,
        explanation: explanation.trim() || undefined,
        options: options.map((optText, idx) => ({
          id: `opt-${Date.now()}-${idx}`,
          text: optText,
          isCorrect: idx === correctIdx,
        })),
      });

      setToastMsg("Question successfully saved to Microsoft Dataverse Question Bank!");
      setTimeout(() => {
        setToastMsg(null);
        onNavigate("/question-bank");
      }, 1500);
    } catch {
      alert("Failed to save question. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-view-content">
      {toastMsg && (
        <div className="admin-toast-banner" style={{ background: "rgba(16, 185, 129, 0.15)", borderColor: "#10b981", color: "#065f46" }}>
          <span className="material-symbols-outlined text-emerald">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Quiz Builder & Audience</span>
          </div>
          <h1 className="page-main-heading">Quiz Authoring & Targeting Engine</h1>
          <p className="page-sub-heading">Draft interactive items, set answer keys, and target cohorts by operational role.</p>
        </div>

        <div className="tab-pill-toggle">
          <button
            onClick={() => setTab("questions")}
            className={`toggle-option-btn ${tab === "questions" ? "active" : ""}`}
          >
            Question Authoring
          </button>
          <button
            onClick={() => setTab("audience")}
            className={`toggle-option-btn ${tab === "audience" ? "active" : ""}`}
          >
            Cohort Targeting
          </button>
        </div>
      </div>

      {tab === "questions" ? (
        <div className="create-assessment-form-card">
          <div className="form-stack">
            <div className="form-field-group">
              <label className="field-label">Question Stem *</label>
              <textarea
                rows={3}
                placeholder="Enter the question text or telemetry scenario..."
                value={stem}
                onChange={(e) => setStem(e.target.value)}
                className="form-text-input"
              />
            </div>

            <div className="form-row-duo">
              <div className="form-field-group">
                <label className="field-label">Question Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-text-input"
                >
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Power Operations">Power Operations</option>
                  <option value="HSE & Grid Safety">HSE & Grid Safety</option>
                  <option value="Corporate Governance">Corporate Governance</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="field-label">Difficulty Calibration</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="form-text-input"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Options & Answer Key (Select correct answer)</label>
              <div className="options-authoring-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isCorrect = correctIdx === idx;
                  return (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => setCorrectIdx(idx)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: isCorrect ? "2px solid var(--tnc-emerald, #10b981)" : "1px solid var(--tnc-slate-300)",
                          background: isCorrect ? "rgba(16, 185, 129, 0.15)" : "#fff",
                          color: isCorrect ? "#065f46" : "var(--tnc-slate-700)",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        title={isCorrect ? "Correct Option" : "Click to mark as correct"}
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="form-text-input flex-1"
                        placeholder={`Option ${letter}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Explanation for Review Mode</label>
              <textarea
                rows={2}
                placeholder="Provide rationale displayed to learners during post-quiz review..."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="form-text-input"
              />
            </div>

            <button
              onClick={handleSaveQuestion}
              disabled={isSaving}
              className="btn-primary-action self-start"
            >
              <span className="material-symbols-outlined icon-small">
                {isSaving ? "sync" : "save"}
              </span>
              <span>{isSaving ? "Saving to Cloud..." : "Save Question to Bank"}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="create-assessment-form-card">
          <div className="form-stack">
            <h3 className="checklist-heading">Targeted Cohorts & Groups</h3>
            <div className="rules-stack">
              <div className="rule-item">
                <span className="material-symbols-outlined text-emerald">groups</span>
                <span><strong>Ughelli Field Operators:</strong> 340 active technicians in Delta State.</span>
              </div>
              <div className="rule-item">
                <span className="material-symbols-outlined text-emerald">groups</span>
                <span><strong>Lagos Telemetry SCADA Team:</strong> 85 control center engineers.</span>
              </div>
              <div className="rule-item">
                <span className="material-symbols-outlined text-emerald">groups</span>
                <span><strong>Afam Power Plant Operations:</strong> 120 gas turbine operators.</span>
              </div>
            </div>

            <button
              onClick={() => alert("Audience cohort successfully bound to examination schedule in Dataverse!")}
              className="btn-primary-action self-start"
            >
              <span className="material-symbols-outlined icon-small">check</span>
              <span>Confirm Audience Assignment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
