import React, { useState } from "react";

interface LeaderboardTeamViewProps {
  onNavigate: (path: string) => void;
}

export const LeaderboardTeamView: React.FC<LeaderboardTeamViewProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<"departments" | "mvps">("departments");

  const departments = [
    {
      rank: 1,
      name: "Transcorp Power Operations",
      location: "Lagos Substation & Ughelli Power Plant",
      compliance: "96.8%",
      xp: "18,450 XP",
      members: "620 Staff",
      streak: "6 wks",
      isUserDept: true,
      badge: "👑 Division Champion",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      rank: 2,
      name: "Transcorp Capital & Treasury",
      location: "Victoria Island Corporate Headquarters",
      compliance: "94.2%",
      xp: "14,890 XP",
      members: "310 Staff",
      streak: "4 wks",
      badge: "🥈 Runner Up",
      badgeColor: "bg-slate-200 text-slate-800",
    },
    {
      rank: 3,
      name: "Transcorp Hospitality & Leisure",
      location: "Transcorp Hilton Abuja & Calabar",
      compliance: "89.4%",
      xp: "12,120 XP",
      members: "580 Staff",
      streak: "3 wks",
      badge: "🥉 Bronze",
      badgeColor: "bg-amber-700/15 text-amber-900",
    },
    {
      rank: 4,
      name: "Transcorp Energy & Upstream",
      location: "Afam IV Operations Hub",
      compliance: "82.1%",
      xp: "9,640 XP",
      members: "332 Staff",
      streak: "2 wks",
    },
  ];

  const mvps = [
    { rank: 1, name: "Marcus Adebayo", role: "Senior Operations Lead", dept: "Power Operations", xp: "2,450 XP", badges: 8 },
    { rank: 2, name: "Amaka Okafor", role: "Senior Field Specialist", dept: "Power Operations", xp: "1,420 XP", badges: 6, isUser: true },
    { rank: 3, name: "Chinedu Eze", role: "SCADA Infrastructure Eng", dept: "Power Operations", xp: "1,380 XP", badges: 5 },
    { rank: 4, name: "Fatima Aliyu", role: "Treasury Risk Analyst", dept: "Capital & Treasury", xp: "1,290 XP", badges: 5 },
    { rank: 5, name: "David Adeleke", role: "Security Architect", dept: "Corporate IT", xp: "1,150 XP", badges: 4 },
  ];

  return (
    <div className="view-content-centered">
      {/* Header Banner */}
      <div className="leaderboard-header-row">
        <div>
          <div className="breadcrumb-line">
            <span>Transcorp Accreditations</span>
            <span>/</span>
            <span className="text-primary font-bold">Velocity & Leaderboard</span>
          </div>
          <h1 className="page-main-heading">Corporate Velocity Rankings</h1>
          <p className="page-sub-heading">Departmental compliance velocity, learning streaks, and weekly MVP achievers.</p>
        </div>

        <div className="tab-pill-toggle">
          <button
            onClick={() => setTab("departments")}
            className={`toggle-option-btn ${tab === "departments" ? "active" : ""}`}
          >
            Subsidiaries
          </button>
          <button
            onClick={() => setTab("mvps")}
            className={`toggle-option-btn ${tab === "mvps" ? "active" : ""}`}
          >
            Individual MVPs
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      {tab === "departments" ? (
        <div className="leaderboard-table-card">
          <div className="table-header-row">
            <span className="th-cell th-rank">Rank</span>
            <span className="th-cell th-name">Department & Location</span>
            <span className="th-cell th-stat">Compliance</span>
            <span className="th-cell th-stat">Velocity</span>
            <span className="th-cell th-stat">Headcount</span>
          </div>

          <div className="table-body-rows">
            {departments.map((dept) => (
              <div key={dept.rank} className={`table-data-row ${dept.isUserDept ? "user-row-highlight" : ""}`}>
                <div className="td-cell td-rank">
                  <span className={`rank-bubble rank-${dept.rank}`}>#{dept.rank}</span>
                </div>
                <div className="td-cell td-name">
                  <div className="flex-center-gap">
                    <span className="font-bold text-on-surface">{dept.name}</span>
                    {dept.isUserDept && <span className="my-dept-chip">Your Team</span>}
                  </div>
                  <div className="location-sub">{dept.location}</div>
                </div>
                <div className="td-cell td-stat">
                  <span className="font-bold text-emerald">{dept.compliance}</span>
                </div>
                <div className="td-cell td-stat">
                  <span className="font-mono font-bold text-primary">{dept.xp}</span>
                </div>
                <div className="td-cell td-stat">
                  <span className="text-secondary">{dept.members}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="leaderboard-table-card">
          <div className="table-header-row">
            <span className="th-cell th-rank">Rank</span>
            <span className="th-cell th-name">Learner & Title</span>
            <span className="th-cell th-stat">Department</span>
            <span className="th-cell th-stat">Accreditation XP</span>
            <span className="th-cell th-stat">Badges</span>
          </div>

          <div className="table-body-rows">
            {mvps.map((p) => (
              <div key={p.rank} className={`table-data-row ${p.isUser ? "user-row-highlight" : ""}`}>
                <div className="td-cell td-rank">
                  <span className={`rank-bubble rank-${p.rank}`}>#{p.rank}</span>
                </div>
                <div className="td-cell td-name">
                  <div className="flex-center-gap">
                    <span className="font-bold text-on-surface">{p.name}</span>
                    {p.isUser && <span className="my-dept-chip">You</span>}
                  </div>
                  <div className="location-sub">{p.role}</div>
                </div>
                <div className="td-cell td-stat">
                  <span className="text-secondary">{p.dept}</span>
                </div>
                <div className="td-cell td-stat">
                  <span className="font-mono font-bold text-primary">{p.xp}</span>
                </div>
                <div className="td-cell td-stat">
                  <span className="badge-count-pill">🏅 {p.badges}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer shortcut to badges */}
      <div className="leaderboard-bottom-banner">
        <div className="flex-center-gap">
          <span className="material-symbols-outlined icon-large text-primary">military_tech</span>
          <div>
            <div className="font-bold text-on-surface">Explore Earned Skill Competency Badges</div>
            <div className="text-secondary text-xs">View individual milestone badges unlocked on your profile.</div>
          </div>
        </div>
        <button onClick={() => onNavigate("/leaderboard/badges")} className="btn-secondary-flat">
          <span>View Badges Catalog</span>
          <span className="material-symbols-outlined icon-small">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
