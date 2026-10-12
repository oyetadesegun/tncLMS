import React from "react";

interface UserProfileViewProps {
  onNavigate: (path: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onNavigate }) => {
  return (
    <div className="view-content-centered">
      {/* User Card */}
      <div className="user-profile-master-card">
        <div className="profile-top-accent-bar" />

        <div className="profile-card-content">
          {/* Avatar */}
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-initials">AO</div>
            <span className="profile-status-dot" title="Active">✓</span>
          </div>

          {/* User Bio */}
          <div className="profile-bio-col">
            <div className="profile-bio-header">
              <div>
                <h1 className="profile-user-fullname">Amaka Obi Okafor</h1>
                <p className="profile-user-title">Senior Field Specialist • Level 3 Operator</p>
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
                <span>Transcorp Power Operations • Lagos Substation</span>
              </div>
              <div className="profile-meta-item font-mono">
                <span className="material-symbols-outlined text-secondary icon-small">mail</span>
                <span>amaka.okafor@transcorp.com</span>
              </div>
              <div className="profile-meta-item">
                <span className="material-symbols-outlined text-secondary icon-small">verified_user</span>
                <span>Microsoft Entra ID Zero-Trust Verified</span>
              </div>
              <div className="profile-meta-item">
                <span className="material-symbols-outlined text-secondary icon-small">badge</span>
                <span>Employee ID: TRC-ENG-0419</span>
              </div>
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
    </div>
  );
};
