import React from "react";

interface LeaderboardBadgesViewProps {
  onNavigate: (path: string) => void;
}

export const LeaderboardBadgesView: React.FC<LeaderboardBadgesViewProps> = ({ onNavigate }) => {
  const badges = [
    { id: 1, name: "Zero-Trust Sentinel", cat: "Cybersecurity", desc: "Completed all Q4 InfoSec simulations with 90%+ pass score.", earned: "Earned Oct 2025", icon: "security", unlocked: true },
    { id: 2, name: "330kV Grid Master", cat: "Power Operations", desc: "Demonstrated full compliance in high-voltage breaker protocols.", earned: "Earned Sep 2025", icon: "bolt", unlocked: true },
    { id: 3, name: "ISO 27001 Auditor", cat: "Governance", desc: "Participated in corporate compliance audit checklist verification.", earned: "Earned Aug 2025", icon: "verified_user", unlocked: true },
    { id: 4, name: "4-Week Velocity Streak", cat: "Habits", desc: "Maintained continuous weekly assessment completion for 4 weeks.", earned: "Earned Yesterday", icon: "local_fire_department", unlocked: true },
    { id: 5, name: "Turbine Emergency Lead", cat: "Operations", desc: "Complete turbine emergency pressure mitigation drill.", earned: "In Progress (60%)", icon: "emergency", unlocked: false },
    { id: 6, name: "Executive Ethics Fellow", cat: "Governance", desc: "Score 95%+ in Anti-Bribery & Executive Compliance exam.", earned: "Locked", icon: "workspace_premium", unlocked: false },
  ];

  return (
    <div className="view-content-centered">
      <div className="leaderboard-header-row">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/leaderboard/team")} className="crumb-btn">Leaderboard</button>
            <span>/</span>
            <span className="text-primary font-bold">Badges & Competencies</span>
          </div>
          <h1 className="page-main-heading">Earned Skill Badges & Competencies</h1>
          <p className="page-sub-heading">Official micro-credentials awarded across Transcorp subsidiaries.</p>
        </div>
      </div>

      <div className="badges-catalog-grid">
        {badges.map((b) => (
          <div key={b.id} className={`badge-showcase-card ${b.unlocked ? "unlocked" : "locked"}`}>
            <div className="badge-card-icon-circle">
              <span className="material-symbols-outlined icon-extra-large">{b.icon}</span>
            </div>
            <div className="badge-card-info">
              <div className="badge-category-tag">{b.cat}</div>
              <h3 className="badge-title-text">{b.name}</h3>
              <p className="badge-desc-text">{b.desc}</p>
              <div className="badge-status-line">
                <span className="material-symbols-outlined icon-small">
                  {b.unlocked ? "check_circle" : "lock"}
                </span>
                <span>{b.earned}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
