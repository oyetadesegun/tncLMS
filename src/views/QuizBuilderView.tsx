import React, { useState } from "react";

interface QuizBuilderViewProps {
  onNavigate: (path: string) => void;
}

export const QuizBuilderView: React.FC<QuizBuilderViewProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<"questions" | "audience">("questions");

  return (
    <div className="admin-view-content">
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
              <label className="field-label">Question Stem</label>
              <textarea
                rows={3}
                defaultValue="When operating 330kV air-insulated disconnectors during wet weather, what personal protective equipment is mandatory?"
                className="form-text-input"
              />
            </div>

            <div className="form-field-group">
              <label className="field-label">Question Category & Tag</label>
              <input
                type="text"
                defaultValue="Power Operations • High-Voltage Safety"
                className="form-text-input"
              />
            </div>

            <div className="form-field-group">
              <label className="field-label">Explanation for Review Mode</label>
              <textarea
                rows={2}
                defaultValue="Class 4 insulating gloves (36kV rated) with leather protectors and arc flash face shield complying with NFPA 70E."
                className="form-text-input"
              />
            </div>

            <button
              onClick={() => alert("Question item saved to Central Question Bank!")}
              className="btn-primary-action self-start"
            >
              <span className="material-symbols-outlined icon-small">save</span>
              <span>Save Question to Bank</span>
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
              onClick={() => alert("Audience cohort successfully bound to examination schedule!")}
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
