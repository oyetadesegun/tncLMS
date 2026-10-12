import React from 'react';

interface HeaderProps {
  dataverseStatus: 'connected' | 'mock' | 'loading';
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ dataverseStatus }) => {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="m9 10 2 2 4-4" />
          </svg>
        </div>
        <div>
          <h1 className="brand-title">Learning Assessment Hub</h1>
          <div className="brand-subtitle">Power Apps • Dataverse LMS Core</div>
        </div>
      </div>

      <div className="header-right">
        <div className="dataverse-badge" title="Dataverse jwell_* services active">
          <span className="status-dot"></span>
          <span>{dataverseStatus === 'connected' ? 'Dataverse Live' : 'Dataverse Active (jwell_*)'}</span>
        </div>

        <div className="user-profile-badge">
          <div className="avatar-circle">AL</div>
          <div className="user-info">
            <span className="user-name">Assessment Lead</span>
            <span className="user-role">Enterprise Learner</span>
          </div>
        </div>
      </div>
    </header>
  );
};
