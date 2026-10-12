import React, { useState } from "react";

interface AdminCertificatesViewProps {
  onNavigate: (path: string) => void;
}

export const AdminCertificatesView: React.FC<AdminCertificatesViewProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState("");

  const registry = [
    {
      id: "CERT-8F3K-92QX",
      name: "Amaka Obi Okafor",
      email: "amaka.okafor@transcorp.com",
      course: "Cybersecurity & Critical Infrastructure Defense",
      unit: "Power Operations",
      issued: "2025-10-06",
      expires: "2027-10-06",
      status: "Valid",
      statusBadge: "badge-emerald",
    },
    {
      id: "CERT-9X2L-44AP",
      name: "Marcus Adebayo",
      email: "marcus.adebayo@transcorp.com",
      course: "High-Voltage Grid Isolation & Substation Safety",
      unit: "Power Operations",
      issued: "2025-09-14",
      expires: "2026-09-14",
      status: "Valid",
      statusBadge: "badge-emerald",
    },
    {
      id: "CERT-4K9W-88PQ",
      name: "Chinedu Eze",
      email: "chinedu.eze@transcorp.com",
      course: "SCADA Industrial Telemetry Architecture",
      unit: "Power Operations",
      issued: "2025-08-20",
      expires: "2027-08-20",
      status: "Valid",
      statusBadge: "badge-emerald",
    },
    {
      id: "CERT-3P8W-11KD",
      name: "Fatima Aliyu",
      email: "fatima.aliyu@transcorp.com",
      course: "Anti-Bribery & Executive Corporate Governance",
      unit: "Capital & Treasury",
      issued: "2025-01-12",
      expires: "2026-01-12",
      status: "Expiring Soon",
      statusBadge: "badge-amber",
    },
  ];

  const filtered = registry.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.course.toLowerCase().includes(search.toLowerCase())
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
          <p className="page-sub-heading">Immutable central registry of all issued workforce credentials & verification keys.</p>
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

      <div className="admin-panel-card">
        <div className="table-header-row">
          <span className="th-cell th-name">Credential ID & Holder</span>
          <span className="th-cell th-stat">Accreditation Title</span>
          <span className="th-cell th-stat">Subsidiary Unit</span>
          <span className="th-cell th-stat">Issue / Expiry</span>
          <span className="th-cell th-stat">Status</span>
        </div>

        <div className="table-body-rows">
          {filtered.map((c) => (
            <div key={c.id} className="table-data-row">
              <div className="td-cell td-name">
                <div className="font-bold text-on-surface">{c.name}</div>
                <div className="location-sub font-mono text-primary font-semibold">{c.id}</div>
              </div>

              <div className="td-cell td-stat">
                <span className="font-semibold text-on-surface">{c.course}</span>
              </div>

              <div className="td-cell td-stat">
                <span className="text-secondary">{c.unit}</span>
              </div>

              <div className="td-cell td-stat">
                <span className="text-secondary text-xs">{c.issued} to {c.expires}</span>
              </div>

              <div className="td-cell td-stat">
                <button onClick={() => onNavigate("/certificates/view")} className="btn-table-action">
                  <span>View Doc</span>
                  <span className="material-symbols-outlined icon-small">visibility</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
