import React from "react";

interface QuizAnalyticsViewProps {
  onNavigate: (path: string) => void;
}

export const QuizAnalyticsView: React.FC<QuizAnalyticsViewProps> = ({ onNavigate }) => {
  return (
    <div className="admin-view-content">
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Quiz Performance Analytics</span>
          </div>
          <h1 className="page-main-heading">Cybersecurity Awareness: Performance Analytics</h1>
          <p className="page-sub-heading">Detailed cohort completion, score distribution, and question discrimination index.</p>
        </div>

        <button onClick={() => onNavigate("/assessments")} className="btn-secondary-flat">
          <span>Back to Assessments</span>
        </button>
      </div>

      <div className="admin-kpis-grid">
        <div className="admin-kpi-card">
          <span className="kpi-title">Total Enrolled</span>
          <div className="kpi-val-number">850</div>
          <div className="kpi-sub-text text-secondary mt-1">Across all subsidiaries</div>
        </div>
        <div className="admin-kpi-card">
          <span className="kpi-title">Pass Rate</span>
          <div className="kpi-val-number text-emerald">92.4%</div>
          <div className="kpi-sub-text text-secondary mt-1">785 passed first attempt</div>
        </div>
        <div className="admin-kpi-card">
          <span className="kpi-title">Average Score</span>
          <div className="kpi-val-number text-primary">88.2%</div>
          <div className="kpi-sub-text text-secondary mt-1">Passing threshold: 80%</div>
        </div>
        <div className="admin-kpi-card">
          <span className="kpi-title">Avg Time Spent</span>
          <div className="kpi-val-number">13m 42s</div>
          <div className="kpi-sub-text text-secondary mt-1">Allocated limit: 20 mins</div>
        </div>
      </div>

      <div className="admin-panel-card mt-6">
        <div className="panel-card-header">
          <h3 className="panel-title">Question Discrimination & Difficulty Index</h3>
        </div>

        <div className="unit-compliance-list">
          <div className="unit-compliance-row">
            <div className="unit-info-left">
              <div className="font-bold">Q1: Phishing Emergency MFA Token Reset Handling</div>
              <div className="text-secondary text-xs">Phishing Vector • 98% Accuracy</div>
            </div>
            <span className="status-badge-chip badge-emerald">High Mastery</span>
          </div>

          <div className="unit-compliance-row">
            <div className="unit-info-left">
              <div className="font-bold">Q2: SCADA Air-Gap USB Patch Deployment Policy</div>
              <div className="text-secondary text-xs">OT Security • 84% Accuracy</div>
            </div>
            <span className="status-badge-chip badge-emerald">Moderate</span>
          </div>

          <div className="unit-compliance-row">
            <div className="unit-info-left">
              <div className="font-bold">Q3: Unsanctioned Substation Lateral Movement (Sev 1)</div>
              <div className="text-secondary text-xs">Incident Escalation • 79% Accuracy</div>
            </div>
            <span className="status-badge-chip badge-amber">Needs Refresh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
