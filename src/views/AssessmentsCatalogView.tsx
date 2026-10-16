import React, { useState, useEffect } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSAssessment } from "../services/dataAdapter";

interface AssessmentsCatalogViewProps {
  onNavigate: (path: string) => void;
}

export const AssessmentsCatalogView: React.FC<AssessmentsCatalogViewProps> = ({ onNavigate }) => {
  const [assessments, setAssessments] = useState<LMSAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await lmsDataService.getAssessments();
      if (isMounted) {
        setAssessments(data);
        setIsLoading(false);
      }
    }
    loadData();
    const unsub = lmsDataService.subscribe(loadData);
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const filtered = assessments.filter((a) => {
    const matchesStatus =
      statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
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
          <p className="page-sub-heading">
            Live, scheduled, and draft compliance examinations fetched dynamically from Microsoft Dataverse.
          </p>
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

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--tnc-slate-500)" }}>
          <span className="material-symbols-outlined icon-spin" style={{ fontSize: "32px", color: "var(--tnc-orange)" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", fontWeight: 600 }}>Loading cloud assessments from Dataverse...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-box" style={{ padding: "48px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--tnc-slate-400)" }}>
            quiz
          </span>
          <h3 style={{ margin: "16px 0 8px", fontSize: "1.125rem", color: "var(--tnc-slate-800)" }}>
            No assessments found
          </h3>
          <p style={{ color: "var(--tnc-slate-500)", marginBottom: "20px" }}>
            {search ? "No matching assessments found for your query." : "There are currently no assessments in the cloud."}
          </p>
          <button onClick={() => onNavigate("/assessments/create")} className="btn-primary-action">
            <span className="material-symbols-outlined icon-small">add</span>
            <span>Create First Assessment</span>
          </button>
        </div>
      ) : (
        <div className="assessments-card-grid">
          {filtered.map((item) => {
            const statusBadge =
              item.status === "Active"
                ? "badge-emerald"
                : item.status === "Scheduled"
                ? "badge-tertiary"
                : "badge-secondary";

            return (
              <div key={item.id} className="admin-assessment-card">
                <div className="assessment-card-top">
                  <span className={`status-badge-chip ${statusBadge}`}>{item.status}</span>
                  <span className="unit-name-badge">{item.category}</span>
                </div>

                <h3 className="assessment-card-title">{item.title}</h3>
                <p className="assessment-card-live-session">
                  {item.trainerName ? `Lead Trainer: ${item.trainerName}` : item.description}
                </p>

                <div className="assessment-card-specs-row">
                  <div className="spec-col">
                    <span className="spec-k">Questions</span>
                    <span className="spec-v font-bold">{item.questionsCount}</span>
                  </div>
                  <div className="spec-col">
                    <span className="spec-k">Time Limit</span>
                    <span className="spec-v font-bold">{item.timeLimitMinutes} mins</span>
                  </div>
                  <div className="spec-col">
                    <span className="spec-k">Pass Mark</span>
                    <span className="spec-v font-bold text-emerald">{item.passMarkPercent}%</span>
                  </div>
                  <div className="spec-col">
                    <span className="spec-k">Cohort</span>
                    <span className="spec-v font-bold">{item.cohort}</span>
                  </div>
                </div>

                <div className="assessment-card-actions-row">
                  <button onClick={() => onNavigate(`/quiz/intro?id=${item.id}`)} className="btn-primary-action flex-1">
                    <span>Preview Quiz</span>
                    <span className="material-symbols-outlined icon-small">arrow_forward</span>
                  </button>
                  <button onClick={() => onNavigate("/quiz/analytics")} className="btn-secondary-flat" title="Analytics">
                    <span className="material-symbols-outlined icon-small">analytics</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
