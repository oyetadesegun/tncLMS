import React, { useState, useEffect } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSCertificate } from "../services/dataAdapter";

interface AdminCertificatesViewProps {
  onNavigate: (path: string) => void;
}

export const AdminCertificatesView: React.FC<AdminCertificatesViewProps> = ({ onNavigate }) => {
  const [certificates, setCertificates] = useState<LMSCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const data = await lmsDataService.getCertificates();
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
  }, []);

  const filtered = certificates.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(search.toLowerCase()) ||
      c.credentialId.toLowerCase().includes(search.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-view-content">
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Issued Certificates Registry</span>
          </div>
          <h1 className="page-main-heading">Corporate Certificates Master Ledger</h1>
          <p className="page-sub-heading">
            Live central registry of all issued workforce credentials fetched from Microsoft Dataverse.
          </p>
        </div>

        <button onClick={() => onNavigate("/verify")} className="btn-secondary-flat">
          <span className="material-symbols-outlined icon-small text-emerald">verified</span>
          <span>Public Verification Tool</span>
        </button>
      </div>

      <div className="catalog-filters-bar">
        <div className="search-field-wrapper flex-1">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search certificate reference, holder name, or qualification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="directory-search-input"
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--tnc-slate-500)" }}>
          <span className="material-symbols-outlined icon-spin" style={{ fontSize: "32px", color: "var(--tnc-orange)" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", fontWeight: 600 }}>Loading issued certificates from Dataverse...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state-box" style={{ padding: "48px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--tnc-slate-400)" }}>
            workspace_premium
          </span>
          <h3 style={{ margin: "16px 0 8px", color: "var(--tnc-slate-800)" }}>No certificates found</h3>
          <p style={{ color: "var(--tnc-slate-500)" }}>
            {search ? "No matching records found." : "No certificates have been issued yet."}
          </p>
        </div>
      ) : (
        <div className="admin-panel-card">
          <div className="table-header-row">
            <span className="th-cell th-name">Credential ID & Holder</span>
            <span className="th-cell th-stat">Accreditation Title</span>
            <span className="th-cell th-stat">Standard</span>
            <span className="th-cell th-stat">Issue / Expiry</span>
            <span className="th-cell th-stat">Action</span>
          </div>

          <div className="table-body-rows">
            {filtered.map((c) => (
              <div key={c.id} className="table-data-row">
                <div className="td-cell td-name">
                  <div className="font-bold text-on-surface">{c.recipientName}</div>
                  <div className="location-sub font-mono text-primary font-semibold">{c.credentialId}</div>
                </div>

                <div className="td-cell td-stat">
                  <span className="font-semibold text-on-surface">{c.courseTitle}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="text-secondary">{c.standard}</span>
                </div>

                <div className="td-cell td-stat">
                  <span className="text-secondary text-xs">{c.issuedDate} to {c.expiryDate}</span>
                </div>

                <div className="td-cell td-stat">
                  <button onClick={() => onNavigate(`/certificates/view?id=${c.credentialId}`)} className="btn-table-action">
                    <span>View Doc</span>
                    <span className="material-symbols-outlined icon-small">visibility</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
