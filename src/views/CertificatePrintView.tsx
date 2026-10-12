import React from "react";

interface CertificatePrintViewProps {
  onNavigate: (path: string) => void;
}

export const CertificatePrintView: React.FC<CertificatePrintViewProps> = ({ onNavigate }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-page-container">
      {/* Top Bar for certificate view (Hidden on print) */}
      <div className="cert-top-bar no-print">
        <div className="flex-center-gap">
          <button onClick={() => onNavigate("/certificates")} className="btn-back-wallet">
            <span className="material-symbols-outlined icon-small">arrow_back</span>
            <span>Back to Digital Wallet</span>
          </button>
        </div>

        <div className="cert-bar-actions">
          <button onClick={() => onNavigate("/verify?id=CERT-8F3K-92QX")} className="btn-verify-live">
            <span className="material-symbols-outlined icon-small text-emerald">verified</span>
            <span>Verify Live on Registry</span>
          </button>

          <button onClick={handlePrint} className="btn-print-pdf">
            <span className="material-symbols-outlined icon-small">print</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Certificate Viewport */}
      <div className="certificate-viewport">
        {/* Certificate Metadata Bar */}
        <div className="cert-meta-info-strip no-print">
          <div className="flex-center-gap">
            <span className="cryptographic-status-chip">
              <span className="live-dot-pulse" />
              <span>Cryptographically Verified</span>
            </span>
            <span className="format-note">Format: ISO/IEC 17024 A4 Landscape</span>
          </div>

          <div className="cert-ref-code font-mono">
            <span>REF: CERT-8F3K-92QX</span>
            <span>•</span>
            <span className="text-emerald font-bold">STATUS: VALID</span>
          </div>
        </div>

        {/* Certificate Canvas (A4 Landscape aspect ratio) */}
        <div className="certificate-canvas-a4">
          {/* Guilloche Rosette Watermark Background */}
          <div className="guilloche-watermark-overlay">
            <svg className="w-full h-full" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="guilloche-rosette" width="120" height="120" patternUnits="userSpaceOnUse">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.75" />
                  <circle cx="60" cy="60" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" />
                  <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" />
                  <path d="M 10 60 Q 60 10 110 60 Q 60 110 10 60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#guilloche-rosette)" opacity="0.04" />
            </svg>
          </div>

          {/* Outer Ornamental Border & Corner Chevrons */}
          <div className="ornamental-border-layer">
            <div className="border-outer-rect" />
            <div className="border-inner-rect" />

            {/* Corner chevrons */}
            <div className="corner-chevron top-left">
              <svg viewBox="0 0 32 32" fill="#ff8300"><polygon points="0,0 24,0 0,24" /></svg>
            </div>
            <div className="corner-chevron top-right">
              <svg viewBox="0 0 32 32" fill="#ff8300"><polygon points="32,0 8,0 32,24" /></svg>
            </div>
            <div className="corner-chevron bottom-left">
              <svg viewBox="0 0 32 32" fill="#ff8300"><polygon points="0,32 24,32 0,8" /></svg>
            </div>
            <div className="corner-chevron bottom-right">
              <svg viewBox="0 0 32 32" fill="#ff8300"><polygon points="32,32 8,32 32,8" /></svg>
            </div>
          </div>

          {/* Certificate Inner Layout */}
          <div className="cert-inner-content">
            {/* Header / Seal */}
            <div className="cert-header-area">
              <div className="cert-emblem-badge">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h1 className="cert-main-heading">CERTIFICATE OF ACCREDITATION</h1>
              <div className="cert-authority-title">TRANSCORP INSTITUTE OF INFORMATION SECURITY & GOVERNANCE</div>
            </div>

            {/* Recipient Block */}
            <div className="cert-recipient-block">
              <p className="cert-intro-text">THIS IS TO CERTIFY THAT</p>
              <div className="cert-recipient-name">Amaka Obi Okafor</div>
              <p className="cert-recipient-role">Senior Field Specialist • Transcorp Power Operations (Lagos Substation)</p>
            </div>

            {/* Achievement Paragraph */}
            <div className="cert-body-block">
              <p className="cert-achievement-text">
                has demonstrated validated technical competency and satisfied all statutory evaluation requirements in
              </p>
              <div className="cert-course-highlight">
                CYBERSECURITY & CRITICAL INFRASTRUCTURE DEFENSE
              </div>
              <p className="cert-accreditation-sub">
                ISO/IEC 27001 Security Management • SCADA Telemetry Defense • 92% Proficiency Score
              </p>
            </div>

            {/* Signatures & Seal Row */}
            <div className="cert-signatures-row">
              <div className="signature-col">
                <div className="sig-line" />
                <div className="sig-name">Dr. Funmi Adeleke</div>
                <div className="sig-title">Head of Information Security</div>
              </div>

              {/* Gold Hologram Seal */}
              <div className="cert-gold-hologram">
                <div className="hologram-outer-ring">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                  <span className="hologram-text">OFFICIAL SEAL</span>
                </div>
              </div>

              <div className="signature-col">
                <div className="sig-line" />
                <div className="sig-name">Engr. Marcus Adebayo</div>
                <div className="sig-title">Director of Power Operations</div>
              </div>
            </div>

            {/* Footer Cryptographic ID */}
            <div className="cert-footer-meta">
              <span>ISSUED: 06 OCTOBER 2025</span>
              <span>•</span>
              <span className="font-mono">VERIFICATION ID: CERT-8F3K-92QX</span>
              <span>•</span>
              <span>VALID UNTIL: 06 OCTOBER 2027</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
