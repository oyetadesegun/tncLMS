import React, { useState, useEffect } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSBadge } from "../services/dataAdapter";
import { useAuth } from "../context/AuthContext";

interface LeaderboardBadgesViewProps {
  onNavigate: (path: string) => void;
}

export const LeaderboardBadgesView: React.FC<LeaderboardBadgesViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<LMSBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await lmsDataService.getBadges(user?.email);
      if (isMounted) {
        setBadges(data);
        setIsLoading(false);
      }
    }
    loadData();
    const unsub = lmsDataService.subscribe(loadData);
    return () => {
      isMounted = false;
      unsub();
    };
  }, [user]);

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
          <p className="page-sub-heading">
            Official micro-credentials and competency milestones fetched from Microsoft Dataverse.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--tnc-slate-500)" }}>
          <span className="material-symbols-outlined icon-spin" style={{ fontSize: "32px", color: "var(--tnc-orange)" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", fontWeight: 600 }}>Loading badges from cloud...</p>
        </div>
      ) : badges.length === 0 ? (
        <div className="empty-state-box" style={{ padding: "48px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--tnc-slate-400)" }}>
            military_tech
          </span>
          <h3 style={{ margin: "16px 0 8px", color: "var(--tnc-slate-800)" }}>No badges earned yet</h3>
          <p style={{ color: "var(--tnc-slate-500)" }}>
            Complete assessments and maintain weekly streaks to unlock official badges.
          </p>
        </div>
      ) : (
        <div className="badges-catalog-grid">
          {badges.map((b) => (
            <div key={b.id} className={`badge-showcase-card ${b.unlocked ? "unlocked" : "locked"}`}>
              <div className="badge-card-icon-circle">
                <span className="material-symbols-outlined icon-extra-large">{b.icon}</span>
              </div>
              <div className="badge-card-info">
                <div className="badge-category-tag">{b.category}</div>
                <h3 className="badge-title-text">{b.name}</h3>
                <p className="badge-desc-text">{b.description}</p>
                <div className="badge-status-line">
                  <span className="material-symbols-outlined icon-small">
                    {b.unlocked ? "check_circle" : "lock"}
                  </span>
                  <span>{b.earnedDate || (b.unlocked ? "Unlocked" : "Locked")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
