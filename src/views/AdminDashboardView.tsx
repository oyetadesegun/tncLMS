import React, { useState } from "react";

interface AdminDashboardViewProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  const kpis = [
    {
      title: "Active Quizzes",
      val: "14",
      sub: "Across 6 business units",
      badge: "+2 this week",
      badgeColor: "bg-primary-fixed text-primary",
      icon: "quiz",
    },
    {
      title: "Overall Pass Rate",
      val: "88.4%",
      sub: "Exceeds 85% benchmark",
      badge: "+4.2% MoM",
      badgeColor: "bg-emerald-50 text-emerald font-bold",
      icon: "analytics",
      featured: true,
    },
    {
      title: "Accredited Staff",
      val: "1,842",
      sub: "94.1% enterprise compliance",
      badge: "Target: 90%",
      badgeColor: "bg-secondary-fixed text-secondary",
      icon: "workspace_premium",
    },
    {
      title: "Avg Completion Time",
      val: "14.2m",
      sub: "Benchmark: 20 mins",
      badge: "-1.8m faster",
      badgeColor: "bg-surface-container text-tertiary",
      icon: "timer",
    },
  ];

  const businessUnits = [
    { name: "Transcorp Power Operations", rate: 96, staff: "620 / 645 staff", status: "Compliant" },
    { name: "Transcorp Capital & Treasury", rate: 91, staff: "310 / 340 staff", status: "Compliant" },
    { name: "Transcorp Hospitality & Leisure", rate: 88, staff: "580 / 660 staff", status: "On Track" },
    { name: "Transcorp Energy & Upstream", rate: 84, staff: "332 / 395 staff", status: "Review Needed" },
  ];

  const activeQuizzes = [
    {
      title: "Cybersecurity & Critical Infrastructure Defense",
      unit: "Enterprise IT & OT",
      cohort: "850 Learners",
      passRate: "92.4%",
      status: "Active",
      statusColor: "badge-emerald",
      avgScore: "88%",
      href: "/quiz/analytics",
    },
    {
      title: "Q3 Grid High-Voltage Isolation Protocols",
      unit: "Power Operations",
      cohort: "340 Field Engs",
      passRate: "86.1%",
      status: "Live Proctored",
      statusColor: "badge-primary",
      avgScore: "82%",
      href: "/quiz/analytics",
    },
    {
      title: "Anti-Bribery & Executive Governance 2025",
      unit: "Legal & Executive",
      cohort: "210 Directors",
      passRate: "98.0%",
      status: "Active",
      statusColor: "badge-emerald",
      avgScore: "95%",
      href: "/quiz/analytics",
    },
  ];

  return (
    <div className="admin-view-content">
      {/* Top Header */}
      <div className="admin-header-strip">
        <div className="admin-node-crumb">
          <span>Enterprise Node</span>
          <span>/</span>
          <span className="text-primary font-bold">Lagos Substation Gateway</span>
        </div>

        <div className="admin-controls-group">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="admin-range-select"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Q4 Statutory Cycle">Q4 Statutory Cycle</option>
            <option value="Annual Compliance 2025">Annual Compliance 2025</option>
          </select>

          <button onClick={() => onNavigate("/assessments/create")} className="btn-primary-action">
            <span className="material-symbols-outlined icon-small">add</span>
            <span>Create Assessment</span>
          </button>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="admin-kpis-grid">
        {kpis.map((k, i) => (
          <div key={i} className={`admin-kpi-card ${k.featured ? "featured-card" : ""}`}>
            <div className="kpi-top-row">
              <span className="kpi-title">{k.title}</span>
              <span className={`kpi-badge ${k.badgeColor}`}>{k.badge}</span>
            </div>
            <div className="kpi-val-number">{k.val}</div>
            <div className="kpi-sub-text">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Two Column Grid: Business Units & Live Quizzes */}
      <div className="admin-split-grid">
        {/* Business Units Compliance */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title">Business Units Compliance Standing</h3>
              <p className="panel-sub">Mandatory workforce certifications progress</p>
            </div>
            <button onClick={() => onNavigate("/executive")} className="btn-table-action">
              <span>View Executive Precision</span>
              <span className="material-symbols-outlined icon-small">arrow_forward</span>
            </button>
          </div>

          <div className="unit-compliance-list">
            {businessUnits.map((u, i) => (
              <div key={i} className="unit-compliance-row">
                <div className="unit-info-left">
                  <div className="unit-name font-bold">{u.name}</div>
                  <div className="unit-staff-count text-secondary text-xs">{u.staff}</div>
                </div>

                <div className="unit-progress-col">
                  <div className="unit-rate-row">
                    <span className="font-bold text-on-surface">{u.rate}%</span>
                    <span className={`unit-status-chip ${u.rate >= 90 ? "text-emerald" : "text-amber"}`}>{u.status}</span>
                  </div>
                  <div className="unit-bar-track">
                    <div
                      className={`unit-bar-fill ${u.rate >= 90 ? "bg-emerald" : "bg-primary"}`}
                      style={{ width: `${u.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Quizzes Registry */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title">Active Assessments Cohorts</h3>
              <p className="panel-sub">Real-time completion & pass performance</p>
            </div>
            <button onClick={() => onNavigate("/assessments")} className="btn-table-action">
              <span>View All</span>
              <span className="material-symbols-outlined icon-small">arrow_forward</span>
            </button>
          </div>

          <div className="active-cohorts-stack">
            {activeQuizzes.map((q, i) => (
              <div key={i} className="active-cohort-item">
                <div className="cohort-item-top">
                  <div>
                    <h4 className="cohort-item-title">{q.title}</h4>
                    <span className="cohort-unit-tag">{q.unit} • {q.cohort}</span>
                  </div>
                  <span className={`status-badge-chip ${q.statusColor}`}>{q.status}</span>
                </div>

                <div className="cohort-item-bottom">
                  <div className="cohort-stats-duo">
                    <span>Pass Rate: <strong className="text-emerald">{q.passRate}</strong></span>
                    <span>Avg Score: <strong>{q.avgScore}</strong></span>
                  </div>

                  <button onClick={() => onNavigate(q.href)} className="btn-analytics-link">
                    <span>Inspect Analytics</span>
                    <span className="material-symbols-outlined icon-tiny">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
