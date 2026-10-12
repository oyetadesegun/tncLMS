import React from "react";

interface LearnerHeaderProps {
  onOpenDirectory?: () => void;
  title?: string;
  currentPath?: string;
  onNavigate: (path: string) => void;
}

export const LearnerHeader: React.FC<LearnerHeaderProps> = ({
  onOpenDirectory,
  title = "TRANSCORP",
  currentPath = "/",
  onNavigate,
}) => {
  return (
    <header className="learner-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-group">
          <button onClick={() => onNavigate("/")} className="brand-button">
            <div className="brand-logo-letter">T</div>
            <div className="brand-text-column">
              <span className="brand-main-text">{title}</span>
              <span className="brand-sub-text">Learner Portal</span>
            </div>
          </button>

          {/* Desktop Nav links */}
          <nav className="desktop-nav-links">
            <button
              onClick={() => onNavigate("/")}
              className={`nav-link-btn ${currentPath === "/" ? "active" : ""}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate("/quiz/intro")}
              className={`nav-link-btn ${currentPath.startsWith("/quiz") ? "active" : ""}`}
            >
              Take Quiz
            </button>
            <button
              onClick={() => onNavigate("/leaderboard/team")}
              className={`nav-link-btn ${currentPath.startsWith("/leaderboard") ? "active" : ""}`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => onNavigate("/certificates")}
              className={`nav-link-btn ${currentPath.startsWith("/certificates") ? "active" : ""}`}
            >
              Certificates
            </button>
            <button
              onClick={() => onNavigate("/verify")}
              className={`nav-link-btn ${currentPath === "/verify" ? "active" : ""}`}
            >
              Verify Credential
            </button>
            <button
              onClick={() => onNavigate("/profile")}
              className={`nav-link-btn ${currentPath === "/profile" ? "active" : ""}`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="header-right-actions">
          {/* Quick Page Directory Button */}
          {onOpenDirectory && (
            <button onClick={onOpenDirectory} className="pages-directory-btn">
              <span className="material-symbols-outlined icon-small">apps</span>
              <span>24 Pages</span>
            </button>
          )}

          {/* Switch to Admin */}
          <button onClick={() => onNavigate("/admin")} className="admin-switch-btn">
            <span className="material-symbols-outlined icon-small text-secondary">admin_panel_settings</span>
            <span>Admin</span>
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            onClick={() => alert("Notification: Cybersecurity Awareness assessment due tomorrow")}
            className="notifications-btn"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="notification-dot" />
          </button>

          {/* User Button */}
          <button onClick={() => onNavigate("/profile")} className="user-avatar-btn">
            <span className="user-initials">AO</span>
          </button>
        </div>
      </div>
    </header>
  );
};
