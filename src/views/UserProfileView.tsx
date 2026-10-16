import React from "react";
import type { AuthUser } from "../context/AuthContext";

interface UserProfileViewProps {
  onNavigate: (path: string) => void;
  user?: AuthUser | null;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onNavigate, user }) => {
  const displayName = user?.fullName || "—";
  const displayEmail = user?.email || "—";
  const displaySubsidiary = user?.subsidiary || "—";
  const displayDepartment = user?.department || "—";
  const displayId = user?.id || "—";
  const initials = user?.avatar || "?";

  return (
    <div className="view-content-centered">
      {/* User Card */}
      <div className="user-profile-master-card">
        <div className="profile-top-accent-bar" />

        <div className="profile-card-content">
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-initials">{initials}</div>
            <span className="profile-status-dot" title="Active">✓</span>
          </div>

          {/* User Bio */}
          <div className="profile-bio-col">
            <div className="profile-bio-header">
              <div>
                <h1 className="profile-user-fullname">{displayName}</h1>
                <p className="profile-user-title">
                  {user?.role || "Learner"} • {displaySubsidiary}
                </p>
              </div>

              <div className="profile-streak-badges">
                <span className="profile-badge-pill">
                  <span className="material-symbols-outlined text-amber icon-small">local_fire_department</span>
                  <span>4 Wk Streak</span>
                </span>
                <span className="profile-xp-pill font-mono">1,420 XP</span>
              </div>
            </div>

            <div className="profile-metadata-grid">
              <div className="profile-meta-item">
                <span className="material-symbols-outlined text-secondary icon-small">domain</span>
                <span>{displaySubsidiary} • {displayDepartment}</span>
              </div>
              <div className="profile-meta-item font-mono">
                <span className="material-symbols-outlined text-secondary icon-small">mail</span>
                <span>{displayEmail}</span>
              </div>
              <div className="profile-meta-item">
                <span className="material-symbols-outlined text-secondary icon-small">verified_user</span>
                <span>Microsoft Entra ID Zero-Trust Verified</span>
              </div>
              <div className="profile-meta-item">
                <span className="material-symbols-outlined text-secondary icon-small">badge</span>
                <span>Employee ID: {displayId}</span>
              </div>
              {user?.isAdmin && (
                <div className="profile-meta-item">
                  <span className="material-symbols-outlined text-amber icon-small">admin_panel_settings</span>
                  <span className="font-bold" style={{ color: "var(--color-amber)" }}>{user.role}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accreditations Summary */}
      <div className="profile-section-card">
        <div className="profile-section-header">
          <div>
            <h2 className="section-card-title">Verified Enterprise Accreditations</h2>
            <p className="section-card-sub">Active cryptographic credentials registered on corporate ledger</p>
          </div>
          <button onClick={() => onNavigate("/certificates")} className="btn-secondary-flat">
            <span>View All (3)</span>
            <span className="material-symbols-outlined icon-small">arrow_forward</span>
          </button>
        </div>

        <div className="profile-accreditation-list">
          <div className="profile-cert-row">
            <div className="flex-center-gap">
              <span className="material-symbols-outlined text-primary icon-medium">security</span>
              <div>
                <div className="font-bold text-on-surface">Cybersecurity & Critical Infrastructure Defense</div>
                <div className="text-secondary text-xs">ISO 27001 • Valid until Oct 2027 • Score: 92%</div>
              </div>
            </div>
            <button onClick={() => onNavigate("/certificates/view")} className="btn-table-action">
              <span>View Credential</span>
              <span className="material-symbols-outlined icon-small">arrow_forward</span>
            </button>
          </div>

          <div className="profile-cert-row">
            <div className="flex-center-gap">
              <span className="material-symbols-outlined text-primary icon-medium">bolt</span>
              <div>
                <div className="font-bold text-on-surface">Substation Arc Flash Safety & 330kV Isolation</div>
                <div className="text-secondary text-xs">OSHA & NERC-CIP • Valid until Sep 2026 • Score: 96%</div>
              </div>
            </div>
            <button onClick={() => onNavigate("/certificates/view")} className="btn-table-action">
              <span>View Credential</span>
              <span className="material-symbols-outlined icon-small">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin section — only visible to admins */}
      {user?.isAdmin && (
        <div className="profile-section-card">
          <div className="profile-section-header">
            <div>
              <h2 className="section-card-title">Admin & HR Privileges</h2>
              <p className="section-card-sub">Your current admin access level across the Transcorp LMS</p>
            </div>
            <button onClick={() => onNavigate("/admin")} className="btn-primary-action">
              <span className="material-symbols-outlined icon-small">admin_panel_settings</span>
              <span>Open Admin Hub</span>
            </button>
          </div>

          <div className="profile-admin-role-display">
            <div className={`role-matrix-badge ${user.isSuperAdmin ? "super" : user.role === "HR Learning Admin" ? "learning" : "viewer"}`} style={{ display: "inline-flex" }}>
              <span className="material-symbols-outlined icon-small">
                {user.isSuperAdmin ? "shield" : user.role === "HR Learning Admin" ? "school" : "visibility"}
              </span>
              {user.role}
            </div>
            <p className="text-secondary text-xs" style={{ marginTop: "0.5rem" }}>
              {user.isSuperAdmin
                ? "Full platform access including HR role management, SSO configuration, and all analytics."
                : user.role === "HR Learning Admin"
                ? "Can initiate courses, assign trainers, approve assessments, and view all analytics."
                : "Read-only access to analytics and courses."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
