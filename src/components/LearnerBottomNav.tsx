import React from "react";

interface LearnerBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const LearnerBottomNav: React.FC<LearnerBottomNavProps> = ({
  currentPath,
  onNavigate,
}) => {
  const links = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Quizzes", href: "/quiz/intro", icon: "quiz" },
    { label: "Leaderboard", href: "/leaderboard/team", icon: "leaderboard" },
    { label: "Certs", href: "/certificates", icon: "workspace_premium" },
    { label: "Profile", href: "/profile", icon: "person" },
  ];

  return (
    <nav className="learner-bottom-nav">
      {links.map((link) => {
        const isActive = currentPath === link.href;
        return (
          <button
            key={link.href}
            onClick={() => onNavigate(link.href)}
            className={`bottom-nav-btn ${isActive ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span className="bottom-nav-label">{link.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
