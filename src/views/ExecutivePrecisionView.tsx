import React from "react";

interface ExecutivePrecisionViewProps {
  onNavigate: (path: string) => void;
}

export const ExecutivePrecisionView: React.FC<ExecutivePrecisionViewProps> = ({ onNavigate }) => {
  return (
    <div className="admin-view-content">
      {/* Header */}
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Executive Precision Intelligence</span>
          </div>
          <h1 className="page-main-heading">Executive Precision Intelligence</h1>
          <p className="page-sub-heading">
            High-altitude compliance velocity, training ROI, statutory risk mitigation, and workforce accreditation health across Transcorp Group subsidiaries.
          </p>
        </div>

        <button
          onClick={() => alert("Printing Executive Briefing dossier for Board meeting...")}
          className="btn-primary-action"
        >
          <span className="material-symbols-outlined icon-small">print</span>
          <span>Print Board Dossier</span>
        </button>
      </div>

      {/* Strategic Big Numbers */}
      <div className="admin-kpis-grid">
        <div className="admin-kpi-card">
          <span className="kpi-title">Regulatory Risk Mitigated</span>
          <div className="kpi-val-number font-mono">$2.4M</div>
          <div className="kpi-sub-text text-emerald font-semibold flex-center-gap mt-2">
            <span className="material-symbols-outlined icon-small">shield</span>
            <span>Zero regulatory penalties</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <span className="kpi-title">Enterprise Compliance</span>
          <div className="kpi-val-number font-mono text-emerald">94.1%</div>
          <div className="kpi-sub-text text-secondary mt-2">Target threshold: 90.0%</div>
        </div>

        <div className="admin-kpi-card">
          <span className="kpi-title">Accredited Workforces</span>
          <div className="kpi-val-number font-mono">1,842</div>
          <div className="kpi-sub-text text-secondary mt-2">Out of 1,957 active personnel</div>
        </div>

        <div className="admin-kpi-card">
          <span className="kpi-title">Training Hours Invested</span>
          <div className="kpi-val-number font-mono text-primary">8,920 hrs</div>
          <div className="kpi-sub-text text-secondary mt-2">+12% learning velocity QoQ</div>
        </div>
      </div>

      {/* Subsidiary Performance Table */}
      <div className="admin-panel-card mt-6">
        <div className="panel-card-header">
          <div>
            <h3 className="panel-title">Subsidiary Accreditation & Compliance Status</h3>
            <p className="panel-sub">Verified against Nigerian Electricity Regulatory Commission (NERC) & ISO 27001 mandates</p>
          </div>
        </div>

        <div className="unit-compliance-list">
          <div className="unit-compliance-row">
            <div className="unit-info-left">
              <div className="unit-name font-bold">Transcorp Power Plc (Ughelli Power Plant)</div>
              <div className="text-secondary text-xs">620 Active Field Operators • 96.8% Certified</div>
            </div>
            <span className="status-badge-chip badge-emerald">Statutory Compliant</span>
          </div>

          <div className="unit-compliance-row">
            <div className="unit-info-left">
              <div className="unit-name font-bold">Transcorp Hotels Plc (Abuja & Calabar)</div>
              <div className="text-secondary text-xs">580 Staff • 89.4% Certified</div>
            </div>
            <span className="status-badge-chip badge-emerald">On Track</span>
          </div>

          <div className="unit-compliance-row">
            <div className="unit-info-left">
              <div className="unit-name font-bold">Transafam Power Ltd (Afam Hub)</div>
              <div className="text-secondary text-xs">332 Operations Specialists • 84.1% Certified</div>
            </div>
            <span className="status-badge-chip badge-amber">Action Plan Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
