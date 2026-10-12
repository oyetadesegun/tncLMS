import React from "react";

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenDirectory?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPath,
  onNavigate,
  onOpenDirectory,
}) => {
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Courses & Trainers", href: "/admin/courses", icon: "school" },
    { label: "Assessments", href: "/assessments", icon: "quiz" },
    { label: "Question Bank", href: "/question-bank", icon: "inventory_2" },
    { label: "Quiz Builder", href: "/quiz-builder", icon: "tune" },
    { label: "Audience & Groups", href: "/quiz-builder/audience", icon: "hub" },
    { label: "People & Roles", href: "/admin/people", icon: "group" },
    { label: "Certificates Registry", href: "/admin/certificates", icon: "workspace_premium" },
    { label: "Reports & Analytics", href: "/quiz/analytics", icon: "monitoring" },
    { label: "Executive Precision", href: "/executive", icon: "insights" },
    { label: "Settings & SSO", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-scroll-content">
        {/* Brand Header */}
        <div className="sidebar-brand-box">
          <button onClick={() => onNavigate("/admin")} className="sidebar-brand-btn">
            <div className="brand-logo-letter">T</div>
            <div className="brand-info-col">
              <span className="brand-name-light">TRANSCORP</span>
              <span className="brand-sub-light">Admin & Executive Hub</span>
            </div>
          </button>
        </div>

        {/* Global Badge */}
        <div className="sidebar-badge-container">
          <div className="sidebar-enterprise-badge">
            <div className="badge-text-group">
              <span className="material-symbols-outlined icon-small text-amber">verified</span>
              <span className="node-text">Enterprise Node</span>
            </div>
            <span className="pro-chip">PRO</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav-list">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <button
                key={item.href}
                onClick={() => onNavigate(item.href)}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Directory Trigger */}
        <div className="sidebar-directory-wrapper">
          <button onClick={onOpenDirectory} className="sidebar-directory-trigger">
            <span className="material-symbols-outlined icon-small">apps</span>
            <span>All 24 LMS Pages</span>
          </button>
        </div>
      </div>

      {/* Bottom Switcher & Profile */}
      <div className="sidebar-bottom-switcher">
        <button onClick={() => onNavigate("/")} className="switch-to-learner-btn">
          <span className="flex-center-gap">
            <span className="material-symbols-outlined icon-small">school</span>
            <span>Learner Portal</span>
          </span>
          <span className="material-symbols-outlined icon-small">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
};
