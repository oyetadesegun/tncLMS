import React, { useState } from "react";

interface QuestionBankViewProps {
  onNavigate: (path: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const questions = [
    {
      id: "QB-801",
      stem: "Which protocol must be initiated first upon detecting an unverified pressure differential in secondary power turbines?",
      category: "Power Operations",
      type: "Single Choice",
      difficulty: "Challenging",
      diffBadge: "badge-amber",
      usedIn: "3 Quizzes",
      author: "Dr. Arinze Okoye",
    },
    {
      id: "QB-802",
      stem: "Under ISO 27001 requirements, how frequently must privileged SCADA terminal credentials be rotated?",
      category: "Cybersecurity",
      type: "Single Choice",
      difficulty: "Moderate",
      diffBadge: "badge-secondary",
      usedIn: "5 Quizzes",
      author: "Dr. Funmi Adeleke",
    },
    {
      id: "QB-803",
      stem: "You receive an email from a spoofed vendor domain requesting urgent bank account details for turbine parts. What is the mandatory SOC protocol?",
      category: "Cybersecurity",
      type: "Scenario Analysis",
      difficulty: "Easy",
      diffBadge: "badge-emerald",
      usedIn: "4 Quizzes",
      author: "InfoSec Team",
    },
    {
      id: "QB-804",
      stem: "What is the minimum safe physical clearance distance when operating non-insulated measurement tools near 330kV busbars?",
      category: "HSE & Grid Safety",
      type: "Single Choice",
      difficulty: "Challenging",
      diffBadge: "badge-amber",
      usedIn: "2 Quizzes",
      author: "Engr. Tayo Balogun",
    },
    {
      id: "QB-805",
      stem: "Which enterprise gift value threshold triggers mandatory declaration to the Transcorp Group Compliance Secretariat?",
      category: "Corporate Governance",
      type: "Single Choice",
      difficulty: "Easy",
      diffBadge: "badge-emerald",
      usedIn: "6 Quizzes",
      author: "Legal & Ethics",
    },
  ];

  const filtered = questions.filter((q) => {
    const matchesCat = categoryFilter === "all" || q.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch = q.stem.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase());
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
          <p className="page-sub-heading">Vetted multi-choice items, telemetry scenarios, and difficulty calibration indexes.</p>
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
          <option value="Corporate Governance">Corporate Governance</option>
        </select>
      </div>

      <div className="questions-card-stack">
        {filtered.map((q) => (
          <div key={q.id} className="qb-item-card">
            <div className="qb-item-header">
              <div className="flex-center-gap">
                <span className="qb-id-pill font-mono">{q.id}</span>
                <span className="qb-cat-pill">{q.category}</span>
                <span className={`status-badge-chip ${q.diffBadge}`}>{q.difficulty}</span>
              </div>
              <span className="qb-author-text">Author: {q.author}</span>
            </div>

            <p className="qb-stem-text">{q.stem}</p>

            <div className="qb-item-footer">
              <span className="qb-meta-text">Type: {q.type} • Active in {q.usedIn}</span>
              <button
                onClick={() => alert(`Opening Question Editor for ${q.id}`)}
                className="btn-table-action"
              >
                <span>Edit Item</span>
                <span className="material-symbols-outlined icon-small">edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
