import React from 'react';

interface CertificateModalProps {
  certName: string;
  credentialId: string;
  issueDate: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certName,
  credentialId,
  issueDate,
  onClose
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Certificate of Achievement</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="certificate-frame">
            <h2>Certificate of Excellence</h2>
            <div className="certificate-subtitle">POWER APPS & DATAVERSE LEARNING ASSESSMENT HUB</div>

            <p style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '0.5rem' }}>This certifies that</p>
            <div className="recipient-name">Lead Assessment Practitioner</div>

            <div className="cert-reason">
              has successfully fulfilled all evaluation requirements and demonstrated certified mastery in
              <br />
              <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{certName}</strong>
            </div>

            <div className="cert-stamp-row">
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Credential ID</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  {credentialId}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                  Date of Issue: {issueDate}
                </div>
              </div>

              <div className="cert-gold-seal">
                VERIFIED
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Authorized Registrar</div>
                <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>
                  Learning Assessment Hub
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '0.3rem' }}>
                  ✓ Cryptographically Signed
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn-secondary" onClick={() => window.print()}>
              <span>🖨️</span> Print / Save PDF
            </button>
            <button className="btn-primary" onClick={onClose}>
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
