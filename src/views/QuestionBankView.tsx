import React, { useState, useEffect } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSQuestion } from "../services/dataAdapter";

interface QuestionBankViewProps {
  onNavigate: (path: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onNavigate }) => {
  const [questions, setQuestions] = useState<LMSQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await lmsDataService.getQuestions();
      if (isMounted) {
        setQuestions(data);
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

  const filtered = questions.filter((q) => {
    const matchesCat =
      categoryFilter === "all" ||
      q.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch =
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="admin-view-content">
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Central Question Bank</span>
          </div>
          <h1 className="page-main-heading">Central Question Bank Repository</h1>
          <p className="page-sub-heading">
            Vetted multi-choice items and scenarios fetched from Microsoft Dataverse.
          </p>
        </div>

        <button onClick={() => onNavigate("/quiz-builder")} className="btn-primary-action">
          <span className="material-symbols-outlined icon-small">add</span>
          <span>New Question</span>
        </button>
      </div>

      <div className="catalog-filters-bar">
        <div className="search-field-wrapper flex-1">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search stems, tags, reference ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="directory-search-input"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="admin-range-select"
        >
          <option value="all">All Categories ({questions.length})</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Power Operations">Power Operations</option>
          <option value="HSE & Grid Safety">HSE & Grid Safety</option>
          <option value="General Compliance">General Compliance</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--tnc-slate-500)" }}>
          <span className="material-symbols-outlined icon-spin" style={{ fontSize: "32px", color: "var(--tnc-orange)" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", fontWeight: 600 }}>Loading cloud question bank...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-box" style={{ padding: "48px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--tnc-slate-400)" }}>
            help_outline
          </span>
          <h3 style={{ margin: "16px 0 8px", color: "var(--tnc-slate-800)" }}>
            No questions found
          </h3>
          <p style={{ color: "var(--tnc-slate-500)", marginBottom: "20px" }}>
            {search ? "No matching questions in the repository." : "The central question bank is empty."}
          </p>
          <button onClick={() => onNavigate("/quiz-builder")} className="btn-primary-action">
            <span className="material-symbols-outlined icon-small">add</span>
            <span>Create First Question</span>
          </button>
        </div>
      ) : (
        <div className="questions-card-stack">
          {filtered.map((q) => {
            const diffBadge =
              q.difficulty === "Easy"
                ? "badge-emerald"
                : q.difficulty === "Hard"
                ? "badge-amber"
                : "badge-secondary";

            return (
              <div key={q.id} className="qb-item-card">
                <div className="qb-item-header">
                  <div className="flex-center-gap">
                    <span className="qb-id-pill font-mono">{q.id.slice(0, 10)}</span>
                    <span className="qb-cat-pill">{q.category}</span>
                    <span className={`status-badge-chip ${diffBadge}`}>{q.difficulty}</span>
                  </div>
                  <span className="qb-author-text">
                    {q.options?.length ? `${q.options.length} options` : "Options configured"}
                  </span>
                </div>

                <p className="qb-stem-text">{q.questionText}</p>

                {q.explanation && (
                  <p style={{ fontSize: "0.8125rem", color: "var(--tnc-slate-500)", marginTop: "4px" }}>
                    <strong>Key insight:</strong> {q.explanation}
                  </p>
                )}

                <div className="qb-item-footer">
                  <span className="qb-meta-text">
                    Used: {q.timesUsed || 0} times • Correct: {q.timesCorrect || 0}
                  </span>
                  <button
                    onClick={() => onNavigate("/quiz-builder")}
                    className="btn-table-action"
                  >
                    <span>Edit Item</span>
                    <span className="material-symbols-outlined icon-small">edit</span>
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
