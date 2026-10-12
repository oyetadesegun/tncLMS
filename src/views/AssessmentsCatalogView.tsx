import React, { useState } from "react";

interface AssessmentsCatalogViewProps {
  onNavigate: (path: string) => void;
}

export const AssessmentsCatalogView: React.FC<AssessmentsCatalogViewProps> = ({ onNavigate }) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const assessments = [
    {
      id: "cyber",
      title: "Cybersecurity & Critical Infrastructure Defense",
      unit: "Enterprise IT & OT",
      questions: 10,
      time: "20 mins",
      passMark: "80%",
      cohort: "850 Enrolled",
      status: "Active",
      statusBadge: "badge-emerald",
      liveSession: "Recorded Live Session Available",
      href: "/quiz/intro",
      adminHref: "/quiz/analytics",
    },
    {
      id: "grid-isolation",
      title: "Q3 Grid High-Voltage Isolation Protocols",
      unit: "Transcorp Power Operations",
      questions: 12,
      time: "15 mins",
      passMark: "85%",
      cohort: "340 Field Engs",
      status: "Active",
      statusBadge: "badge-emerald",
      liveSession: "Live Session Oct 28",
      href: "/quiz/take",
      adminHref: "/quiz/analytics",
    },
    {
      id: "governance",
      title: "Anti-Bribery & Executive Governance 2025",
      unit: "Executive & Legal",
      questions: 15,
      time: "25 mins",
      passMark: "90%",
      cohort: "210 Directors",
      status: "Active",
      statusBadge: "badge-emerald",
      liveSession: "Self-Paced Accreditation",
      href: "/quiz/intro",
      adminHref: "/quiz/analytics",
    },
    {
      id: "turbine-shutdown",
      title: "Turbine Emergency Pressure Shutdown & Hazard Control",
      unit: "Technical Operations",
      questions: 8,
      time: "10 mins",
      passMark: "80%",
      cohort: "180 Operators",
      status: "Scheduled",
      statusBadge: "badge-tertiary",
      liveSession: "Opens Nov 4, 2025",
      href: "/quiz/intro",
      adminHref: "/quiz/analytics",
    },
    {
      id: "spill-response",
      title: "Environmental Spill Response & Chemical Safety",
      unit: "Health & Safety (HSE)",
      questions: 14,
      time: "20 mins",
      passMark: "75%",
      cohort: "420 Staff",
      status: "Draft",
      statusBadge: "badge-secondary",
      liveSession: "Under Curriculum Review",
      href: "/quiz/intro",
      adminHref: "/quiz/analytics",
    },
  ];

  const filtered = assessments.filter((a) => {
    const matchesStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.unit.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-view-content">
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Assessments Catalog</span>
          </div>
          <h1 className="page-main-heading">Assessments & Quizzes Catalog</h1>
          <p className="page-sub-heading">Live, scheduled, and draft compliance examinations across Transcorp.</p>
        </div>

        <button onClick={() => onNavigate("/assessments/create")} className="btn-primary-action">
          <span className="material-symbols-outlined icon-small">add</span>
          <span>Create Assessment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-filters-bar">
        <div className="search-field-wrapper flex-1">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search assessments, units, or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="directory-search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-range-select"
        >
          <option value="all">All Statuses ({assessments.length})</option>
          <option value="active">Active Only</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div className="assessments-card-grid">
        {filtered.map((item) => (
          <div key={item.id} className="admin-assessment-card">
            <div className="assessment-card-top">
              <span className={`status-badge-chip ${item.statusBadge}`}>{item.status}</span>
              <span className="unit-name-badge">{item.unit}</span>
            </div>

            <h3 className="assessment-card-title">{item.title}</h3>
            <p className="assessment-card-live-session">{item.liveSession}</p>

            <div className="assessment-card-specs-row">
              <div className="spec-col">
                <span className="spec-k">Questions</span>
                <span className="spec-v font-bold">{item.questions}</span>
              </div>
              <div className="spec-col">
                <span className="spec-k">Time Limit</span>
                <span className="spec-v font-bold">{item.time}</span>
              </div>
              <div className="spec-col">
                <span className="spec-k">Pass Mark</span>
                <span className="spec-v font-bold text-emerald">{item.passMark}</span>
              </div>
              <div className="spec-col">
                <span className="spec-k">Cohort</span>
                <span className="spec-v font-bold">{item.cohort}</span>
              </div>
            </div>

            <div className="assessment-card-actions-row">
              <button onClick={() => onNavigate(item.href)} className="btn-primary-action flex-1">
                <span>Preview Quiz</span>
                <span className="material-symbols-outlined icon-small">arrow_forward</span>
              </button>
              <button onClick={() => onNavigate(item.adminHref)} className="btn-secondary-flat">
                <span className="material-symbols-outlined icon-small">analytics</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
