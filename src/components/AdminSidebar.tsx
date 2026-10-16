import React from "react";
import type { AuthUser } from "../context/AuthContext";

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenDirectory?: () => void;
  user?: AuthUser | null;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPath,
  onNavigate,
  onOpenDirectory,
  user,
}) => {
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const isHRViewer = user?.role === "HR Viewer";

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "dashboard", visible: true },
    { label: "Courses & Trainers", href: "/admin/courses", icon: "school", visible: true },
    { label: "Assessments", href: "/assessments", icon: "quiz", visible: true },
    { label: "Question Bank", href: "/question-bank", icon: "inventory_2", visible: !isHRViewer },
    { label: "Quiz Builder", href: "/quiz-builder", icon: "tune", visible: !isHRViewer },
    { label: "Audience & Groups", href: "/quiz-builder/audience", icon: "hub", visible: !isHRViewer },
    { label: "People & Roles", href: "/admin/people", icon: "group", visible: true },
    { label: "Certificates Registry", href: "/admin/certificates", icon: "workspace_premium", visible: true },
    { label: "Reports & Analytics", href: "/quiz/analytics", icon: "monitoring", visible: true },
    { label: "Executive Precision", href: "/executive", icon: "insights", visible: true },
    { label: "Settings & SSO", href: "/admin/settings", icon: "settings", visible: isSuperAdmin },
  ].filter((item) => item.visible);

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

        {/* Logged-in User Card */}
        {user && (
          <div className="sidebar-user-card">
            <div className="trainer-avatar-bubble small">{user.avatar}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.fullName}</div>
              <div
                className={`sidebar-role-chip ${
                  user.isSuperAdmin ? "super" : user.role === "HR Learning Admin" ? "learning" : "viewer"
                }`}
              >
                {user.role}
              </div>
            </div>
          </div>
        )}

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

      {/* Bottom Switcher */}
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
