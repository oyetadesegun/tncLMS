import React, { useState } from 'react';
import type { Jwell_certificates } from '../generated/models/Jwell_certificatesModel';
import type { Jwell_badges } from '../generated/models/Jwell_badgesModel';
import { CertificateModal } from './CertificateModal';

interface CertificatesViewProps {
  certificates: Jwell_certificates[];
  badges: Jwell_badges[];
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  certificates,
  badges
}) => {
  const [selectedCert, setSelectedCert] = useState<Jwell_certificates | null>(null);

  return (
    <div>
      {/* Certificates Section */}
      <div className="section-header-bar">
        <div className="section-title-group">
          <h2>Earned Certifications</h2>
          <p>Verified digital credentials issued via Dataverse jwell_certificates</p>
        </div>
      </div>

      <div className="cards-grid" style={{ marginBottom: '3rem' }}>
        {certificates.map((cert) => (
          <div key={cert.jwell_certificateid} className="certificate-card">
            <div className="cert-icon-seal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <h3 className="cert-name">{cert.jwell_certificate_name || 'Technical Specialist'}</h3>
            <div className="cert-id">Credential ID: {cert.jwell_credentialid || 'JWELL-VERIFIED'}</div>
            <div className="cert-date">Issued on: {cert.jwell_issue_date || '2026-04-12'}</div>

            <button className="btn-secondary" onClick={() => setSelectedCert(cert)} style={{ width: '100%', justifyContent: 'center' }}>
              <span>📜</span> View & Print Certificate
            </button>
          </div>
        ))}
      </div>

      {/* Badges Section */}
      <div className="section-header-bar">
        <div className="section-title-group">
          <h2>Skill Badges & Achievements</h2>
          <p>Recognitions recorded in Dataverse jwell_badges & jwell_memberbadges</p>
        </div>
      </div>

      <div className="badges-container">
        {badges.map((badge, idx) => {
          const icons = ['🌟', '⚡', '🏆', '🎯', '🚀', '🔥'];
          const icon = icons[idx % icons.length];
          return (
            <div key={badge.jwell_badgeid} className="badge-item-card">
              <div className="badge-emblem">{icon}</div>
              <div>
                <div className="badge-name">{badge.jwell_badgename}</div>
                <div className="badge-sub">Status: Unlocked</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal
          certName={selectedCert.jwell_certificate_name || 'Certified Specialist'}
          credentialId={selectedCert.jwell_credentialid || 'JWELL-CRED-001'}
          issueDate={selectedCert.jwell_issue_date || '2026-04-12'}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
};
