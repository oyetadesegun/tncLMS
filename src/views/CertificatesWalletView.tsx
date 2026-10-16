import React, { useState, useEffect } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSCertificate } from "../services/dataAdapter";
import { useAuth } from "../context/AuthContext";

interface CertificatesWalletViewProps {
  onNavigate: (path: string) => void;
}

export const CertificatesWalletView: React.FC<CertificatesWalletViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<LMSCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await lmsDataService.getCertificates(user?.email);
      if (isMounted) {
        setCertificates(data);
        setIsLoading(false);
      }
    }
    loadData();
    const unsub = lmsDataService.subscribe(loadData);
    return () => {
      isMounted = false;
      unsub();
    };
  }, [user]);

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
          <p className="page-sub-heading">
            Official credentials fetched dynamically from Microsoft Dataverse and cryptographically signed.
          </p>
        </div>

        <button onClick={() => onNavigate("/verify")} className="btn-secondary-flat">
          <span className="material-symbols-outlined icon-small text-emerald">verified</span>
          <span>Public Verification Portal</span>
        </button>
      </div>

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--tnc-slate-500)" }}>
          <span className="material-symbols-outlined icon-spin" style={{ fontSize: "32px", color: "var(--tnc-orange)" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", fontWeight: 600 }}>Loading credentials from cloud...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="empty-state-box" style={{ padding: "48px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--tnc-slate-400)" }}>
            workspace_premium
          </span>
          <h3 style={{ margin: "16px 0 8px", color: "var(--tnc-slate-800)" }}>
            No certificates earned yet
          </h3>
          <p style={{ color: "var(--tnc-slate-500)", marginBottom: "20px" }}>
            Pass any accredited Transcorp assessment to earn your official certificate.
          </p>
          <button onClick={() => onNavigate("/quiz/intro")} className="btn-primary-action">
            Take Assessment
          </button>
        </div>
      ) : (
        <div className="certificates-wallet-grid">
          {certificates.map((cert) => {
            const statusBadge =
              cert.status === "Valid" ? "badge-emerald" : "badge-amber";

            return (
              <div key={cert.id} className="wallet-cert-card">
                <div className="wallet-cert-top-accent" />

                <div className="wallet-cert-content">
                  <div className="wallet-cert-header">
                    <span className={`status-badge-chip ${statusBadge}`}>{cert.status}</span>
                    <span className="score-chip font-bold text-emerald">{cert.scorePercent}% Score</span>
                  </div>

                  <h3 className="wallet-cert-title">{cert.courseTitle}</h3>
                  <p className="wallet-cert-issuer">{cert.issuer}</p>

                  <div className="wallet-cert-specs-box">
                    <div className="spec-row">
                      <span className="spec-k">Accreditation:</span>
                      <span className="spec-v font-semibold">{cert.standard}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-k">Credential ID:</span>
                      <span className="spec-v font-mono">{cert.credentialId}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-k">Validity Period:</span>
                      <span className="spec-v">{cert.issuedDate} — {cert.expiryDate}</span>
                    </div>
                  </div>

                  <div className="wallet-cert-actions">
                    <button
                      onClick={() => onNavigate(`/certificates/view?id=${cert.credentialId}`)}
                      className="btn-primary-action flex-1"
                    >
                      <span className="material-symbols-outlined icon-small">visibility</span>
                      <span>View Official Certificate</span>
                    </button>

                    <button
                      onClick={() => copyVerifyLink(cert.credentialId)}
                      className="btn-icon-copy"
                      title="Copy Verification Link"
                    >
                      <span className="material-symbols-outlined icon-small">
                        {copiedId === cert.credentialId ? "check" : "share"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
