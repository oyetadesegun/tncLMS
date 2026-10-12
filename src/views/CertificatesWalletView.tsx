import React, { useState } from "react";

interface CertificatesWalletViewProps {
  onNavigate: (path: string) => void;
}

export const CertificatesWalletView: React.FC<CertificatesWalletViewProps> = ({ onNavigate }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const certificates = [
    {
      id: "CERT-8F3K-92QX",
      title: "Cybersecurity & Critical Infrastructure Defense",
      issuer: "Transcorp Institute of Information Security",
      standard: "ISO/IEC 27001 Accredited",
      issued: "Oct 06, 2025",
      expires: "Oct 06, 2027",
      status: "Active & Valid",
      statusBadge: "badge-emerald",
      score: "92%",
      viewHref: "/certificates/view",
    },
    {
      id: "CERT-9X2L-44AP",
      title: "Substation Arc Flash Safety & 330kV Isolation",
      issuer: "Transcorp Power Operations Safety Board",
      standard: "OSHA & NERC-CIP Compliant",
      issued: "Sep 14, 2025",
      expires: "Sep 14, 2026",
      status: "Active & Valid",
      statusBadge: "badge-emerald",
      score: "96%",
      viewHref: "/certificates/view",
    },
    {
      id: "CERT-3P8W-11KD",
      title: "Environmental Spill Response & Chemical Safety",
      issuer: "Transcorp HSE Directorate",
      standard: "ISO 14001 Environmental Standard",
      issued: "Jan 12, 2025",
      expires: "Jan 12, 2026",
      status: "Expiring Soon",
      statusBadge: "badge-amber",
      score: "88%",
      viewHref: "/certificates/view",
    },
  ];

  const copyVerifyLink = (id: string) => {
    navigator.clipboard?.writeText?.(`${window.location.origin}/verify?id=${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="view-content-centered">
      <div className="leaderboard-header-row">
        <div>
          <div className="breadcrumb-line">
            <span>Transcorp Accreditation</span>
            <span>/</span>
            <span className="text-primary font-bold">Verifiable Credentials</span>
          </div>
          <h1 className="page-main-heading">Verifiable Certifications Vault</h1>
          <p className="page-sub-heading">Cryptographically signed corporate credentials, digital badges, and compliance verification keys.</p>
        </div>

        <button onClick={() => onNavigate("/verify")} className="btn-secondary-flat">
          <span className="material-symbols-outlined icon-small text-emerald">verified</span>
          <span>Public Verification Portal</span>
        </button>
      </div>

      <div className="certificates-wallet-grid">
        {certificates.map((cert) => (
          <div key={cert.id} className="wallet-cert-card">
            <div className="wallet-cert-top-accent" />

            <div className="wallet-cert-content">
              <div className="wallet-cert-header">
                <span className={`status-badge-chip ${cert.statusBadge}`}>{cert.status}</span>
                <span className="score-chip font-bold text-emerald">{cert.score} Score</span>
              </div>

              <h3 className="wallet-cert-title">{cert.title}</h3>
              <p className="wallet-cert-issuer">{cert.issuer}</p>

              <div className="wallet-cert-specs-box">
                <div className="spec-row">
                  <span className="spec-k">Accreditation:</span>
                  <span className="spec-v font-semibold">{cert.standard}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-k">Credential ID:</span>
                  <span className="spec-v font-mono">{cert.id}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-k">Validity Period:</span>
                  <span className="spec-v">{cert.issued} — {cert.expires}</span>
                </div>
              </div>

              <div className="wallet-cert-actions">
                <button
                  onClick={() => onNavigate(cert.viewHref)}
                  className="btn-primary-action flex-1"
                >
                  <span className="material-symbols-outlined icon-small">visibility</span>
                  <span>View Official Certificate</span>
                </button>

                <button
                  onClick={() => copyVerifyLink(cert.id)}
                  className="btn-icon-copy"
                  title="Copy Verification Link"
                >
                  <span className="material-symbols-outlined icon-small">
                    {copiedId === cert.id ? "check" : "share"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
