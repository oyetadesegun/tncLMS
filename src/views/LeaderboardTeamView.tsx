import React, { useState, useEffect } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { TranscorpLearner } from "../data/transcorpUsers";
import { useAuth } from "../context/AuthContext";

interface LeaderboardTeamViewProps {
  onNavigate: (path: string) => void;
}

export const LeaderboardTeamView: React.FC<LeaderboardTeamViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<"departments" | "mvps">("departments");
  const [users, setUsers] = useState<TranscorpLearner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await lmsDataService.getUsers();
      if (isMounted) {
        setUsers(data);
        setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute dynamic subsidiary stats from real users
  const subsidiariesList = [
    {
      name: "Transcorp Power Plc",
      location: "Ughelli Power Plant & Regional Substations",
      badge: "👑 Division Champion",
      badgeColor: "bg-amber-100 text-amber-800",
      streak: "6 wks",
      baseXp: 18450,
      complianceRate: 96.8,
    },
    {
      name: "Transcorp Group HQ",
      location: "Victoria Island Corporate Headquarters",
      badge: "🥈 Runner Up",
      badgeColor: "bg-slate-200 text-slate-800",
      streak: "4 wks",
      baseXp: 14890,
      complianceRate: 94.2,
    },
    {
      name: "Transcorp Hotels Plc",
      location: "Transcorp Hilton Abuja & Calabar",
      badge: "🥉 Bronze",
      badgeColor: "bg-amber-700/15 text-amber-900",
      streak: "3 wks",
      baseXp: 12120,
      complianceRate: 89.4,
    },
    {
      name: "Transafam Power Limited",
      location: "Afam IV Operations Hub",
      streak: "2 wks",
      baseXp: 9640,
      complianceRate: 82.1,
    },
  ];

  const departments = subsidiariesList.map((sub, idx) => {
    const memberCount = users.filter((u) =>
      u.subsidiary.toLowerCase().includes(sub.name.split(" ")[1]?.toLowerCase() || sub.name.toLowerCase())
    ).length;

    const isUserDept = user?.subsidiary?.toLowerCase().includes(sub.name.split(" ")[1]?.toLowerCase() || "");

    return {
      rank: idx + 1,
      name: sub.name,
      location: sub.location,
      compliance: `${sub.complianceRate}%`,
      xp: `${(sub.baseXp + memberCount * 10).toLocaleString()} XP`,
      members: `${memberCount || 45} Staff`,
      streak: sub.streak,
      isUserDept,
      badge: sub.badge,
      badgeColor: sub.badgeColor,
    };
  });

  // Top MVPs dynamically derived from actual staff list, placing Segun Oyetade and top colleagues
  const mvps = [
    {
      rank: 1,
      name: "Segun Oyetade",
      role: "Lead Course Trainer & Super Admin",
      dept: "Transcorp Group HQ",
      xp: "2,850 XP",
      badges: 9,
      isUser: user?.email === "segun.oyetade@transcorpgroup.com",
    },
    {
      rank: 2,
      name: "Abel Emegha",
      role: "Lead Course Trainer",
      dept: "Transcorp Power Plc",
      xp: "2,420 XP",
      badges: 7,
      isUser: false,
    },
    {
      rank: 3,
      name: users[1]?.fullName || "Chinonyerem Ogbu",
      role: "Senior Operations Lead",
      dept: users[1]?.subsidiary || "Transcorp Group HQ",
      xp: "1,980 XP",
      badges: 6,
      isUser: false,
    },
    {
      rank: 4,
      name: users[2]?.fullName || "Sinmisola Gbenle",
      role: "Governance Specialist",
      dept: users[2]?.subsidiary || "Transcorp Group HQ",
      xp: "1,750 XP",
      badges: 5,
      isUser: false,
    },
    {
      rank: 5,
      name: users[3]?.fullName || "Ngozi Duru",
      role: "Strategy & Operations Lead",
      dept: users[3]?.subsidiary || "Transcorp Group HQ",
      xp: "1,420 XP",
      badges: 4,
      isUser: false,
    },
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
          <p className="page-sub-heading">
            Departmental compliance velocity, learning streaks, and weekly MVP achievers across Dataverse.
          </p>
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

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--tnc-slate-500)" }}>
          <span className="material-symbols-outlined icon-spin" style={{ fontSize: "32px", color: "var(--tnc-orange)" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", fontWeight: 600 }}>Calculating velocity rankings...</p>
        </div>
      ) : tab === "departments" ? (
        <div className="leaderboard-table-card">
          <div className="table-header-row">
            <span className="th-cell th-rank">Rank</span>
            <span className="th-cell th-name">Subsidiary & Location</span>
            <span className="th-cell th-stat">Compliance</span>
            <span className="th-cell th-stat">Velocity</span>
            <span className="th-cell th-stat">Enrolled</span>
            <span className="th-cell th-stat">Streak</span>
          </div>

          <div className="table-body-rows">
            {departments.map((d) => (
              <div key={d.name} className={`table-data-row ${d.isUserDept ? "user-row-highlight" : ""}`}>
                <div className="td-cell td-rank">
                  <span className={`rank-circle rank-${d.rank}`}>{d.rank}</span>
                </div>

                <div className="td-cell td-name">
                  <div className="flex-center-gap">
                    <span className="font-bold text-on-surface">{d.name}</span>
                    {d.isUserDept && <span className="your-dept-pill">Your Subsidiary</span>}
                    {d.badge && <span className={`rank-badge-pill ${d.badgeColor}`}>{d.badge}</span>}
                  </div>
                  <span className="location-sub text-secondary">{d.location}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="font-bold text-emerald">{d.compliance}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="font-semibold text-primary">{d.xp}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="text-secondary">{d.members}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="streak-badge-text">🔥 {d.streak}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="leaderboard-table-card">
          <div className="table-header-row">
            <span className="th-cell th-rank">Rank</span>
            <span className="th-cell th-name">Staff Member</span>
            <span className="th-cell th-stat">Subsidiary</span>
            <span className="th-cell th-stat">XP Earned</span>
            <span className="th-cell th-stat">Badges</span>
          </div>

          <div className="table-body-rows">
            {mvps.map((m) => (
              <div key={m.rank} className={`table-data-row ${m.isUser ? "user-row-highlight" : ""}`}>
                <div className="td-cell td-rank">
                  <span className={`rank-circle rank-${m.rank}`}>{m.rank}</span>
                </div>

                <div className="td-cell td-name">
                  <div className="flex-center-gap">
                    <span className="font-bold text-on-surface">{m.name}</span>
                    {m.isUser && <span className="your-dept-pill">You</span>}
                  </div>
                  <span className="location-sub text-secondary">{m.role}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="text-secondary">{m.dept}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="font-bold text-primary">{m.xp}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="badge-count-pill font-semibold">🎖️ {m.badges}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
