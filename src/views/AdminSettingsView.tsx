import React, { useState, useEffect } from "react";
import {
  HRAdminStore,
  type HRAdmin,
} from "../data/hrAdminStore";
import {
  searchLearners,
  type TranscorpLearner,
} from "../data/transcorpUsers";

interface AdminSettingsViewProps {
  onNavigate: (path: string) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ onNavigate }) => {
  const [admins, setAdmins] = useState<HRAdmin[]>([]);
  const [addSearch, setAddSearch] = useState("");
  const [selectedLearner, setSelectedLearner] = useState<TranscorpLearner | null>(null);
  const [newRole, setNewRole] = useState<HRAdmin["role"]>("HR Learning Admin");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  useEffect(() => {
    const unsub = HRAdminStore.subscribe((updated) => setAdmins(updated));
    return unsub;
  }, []);

  const candidateLearners: TranscorpLearner[] = addSearch.trim()
    ? searchLearners(addSearch).slice(0, 8)
    : [];

  const handleAddAdmin = () => {
    if (!selectedLearner) {
      setAddError("Please search and select an employee first.");
      return;
    }
    const ok = HRAdminStore.addAdmin({
      id: selectedLearner.id,
      fullName: selectedLearner.fullName,
      email: selectedLearner.email,
      subsidiary: selectedLearner.subsidiary,
      role: newRole,
    });
    if (!ok) {
      setAddError(`${selectedLearner.fullName} is already an Admin.`);
    } else {
      setAddSuccess(`${selectedLearner.fullName} added as ${newRole}.`);
      setSelectedLearner(null);
      setAddSearch("");
      setAddError(null);
      setTimeout(() => setAddSuccess(null), 4000);
    }
  };

  const handleRemove = (email: string) => {
    try {
      HRAdminStore.removeAdmin(email);
      setConfirmRemove(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Cannot remove admin.");
    }
  };

  const ROLE_PERMISSIONS: Record<HRAdmin["role"], string[]> = {
    "HR Super Admin": [
      "Initiate courses",
      "Assign trainers",
      "Approve assessments",
      "Manage HR admins",
      "View all analytics",
      "Publish to learners",
    ],
    "HR Learning Admin": [
      "Initiate courses",
      "Assign trainers",
      "Approve assessments",
      "View all analytics",
    ],
    "HR Viewer": ["View analytics", "View courses (read-only)"],
  };

  return (
    <div className="admin-view-content">
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Settings & HR Roles</span>
          </div>
          <h1 className="page-main-heading">Platform Settings & HR/Admin Role Management</h1>
          <p className="page-sub-heading">
            Configure SSO, branding, and manage who has Admin/HR access to the Learning Assessment Hub.
          </p>
        </div>

        <button
          onClick={() => alert("Settings saved successfully!")}
          className="btn-primary-action"
        >
          <span className="material-symbols-outlined icon-small">save</span>
          <span>Save Configuration</span>
        </button>
      </div>

      {/* ── SECTION 1: Enterprise Config ───────────────────────────────────── */}
      <div className="create-assessment-form-card" style={{ marginBottom: "1.5rem" }}>
        <div className="section-label-chip" style={{ marginBottom: "1rem" }}>Enterprise & SSO Configuration</div>
        <div className="form-stack">
          <div className="form-field-group">
            <label className="field-label">Enterprise Tenant Domain</label>
            <input type="text" defaultValue="transcorpgroup.com" className="form-text-input font-mono" />
          </div>

          <div className="form-field-group">
            <label className="field-label">Single Sign-On Identity Provider</label>
            <select defaultValue="entra" className="form-text-input">
              <option value="entra">Microsoft Entra ID (Azure Active Directory OIDC)</option>
              <option value="saml">SAML 2.0 Federation</option>
              <option value="clerk">Clerk Enterprise Gateway</option>
            </select>
          </div>

          <div className="form-field-group">
            <label className="field-label">Primary Brand Display Name</label>
            <input type="text" defaultValue="TRANSCORP" className="form-text-input" />
          </div>

          <div className="rule-toggle-row">
            <div>
              <div className="font-bold">Zero-Trust Device Compliance Gating</div>
              <div className="text-secondary text-xs">Requires compliant Intune-managed endpoint for assessment submissions.</div>
            </div>
            <input type="checkbox" defaultChecked className="rule-checkbox" />
          </div>

          <div className="rule-toggle-row">
            <div>
              <div className="font-bold">Public Certificate Registry Lookup</div>
              <div className="text-secondary text-xs">Allows external parties to verify certificates via cryptographic lookup ID.</div>
            </div>
            <input type="checkbox" defaultChecked className="rule-checkbox" />
          </div>
        </div>
      </div>

      {/* ── SECTION 2: HR/Admin Role Management ──────────────────────────────── */}
      <div className="create-assessment-form-card">
        <div className="section-label-chip" style={{ marginBottom: "0.5rem" }}>
          HR / Admin Role Management
        </div>
        <p className="text-xs text-secondary" style={{ marginBottom: "1.25rem" }}>
          Only people listed here have Admin access to the Learning Assessment Hub.
          Everyone else is a <strong>Learner</strong>. The primary HR email for course notifications
          is always the <strong>HR Super Admin</strong>.
        </p>

        {/* Role Permission Matrix */}
        <div className="role-matrix-grid">
          {(Object.entries(ROLE_PERMISSIONS) as [HRAdmin["role"], string[]][]).map(([role, perms]) => (
            <div key={role} className="role-matrix-card">
              <div className={`role-matrix-badge ${role === "HR Super Admin" ? "super" : role === "HR Learning Admin" ? "learning" : "viewer"}`}>
                <span className="material-symbols-outlined icon-small">
                  {role === "HR Super Admin" ? "shield" : role === "HR Learning Admin" ? "school" : "visibility"}
                </span>
                {role}
              </div>
              <ul className="role-perm-list">
                {perms.map((p) => (
                  <li key={p}>
                    <span className="material-symbols-outlined icon-small text-amber" style={{ fontSize: "0.75rem" }}>check</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Current Admins List */}
        <div className="section-label-chip" style={{ margin: "1.5rem 0 0.75rem" }}>Current Admins ({admins.length})</div>
        <div className="hr-admins-list">
          {admins.map((admin) => (
            <div key={admin.email} className="hr-admin-row">
              <div className="trainer-avatar-bubble small">
                {admin.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="font-bold text-xs flex-center-gap">
                  {admin.fullName}
                  {admin.role === "HR Super Admin" && (
                    <span className="material-symbols-outlined icon-small text-amber" title="Super Admin — cannot be removed">verified</span>
                  )}
                </div>
                <div className="text-xs text-secondary">{admin.email} • {admin.subsidiary}</div>
              </div>

              <select
                value={admin.role}
                onChange={(e) => HRAdminStore.updateRole(admin.email, e.target.value as HRAdmin["role"])}
                className="form-text-input"
                style={{ width: "auto", fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
              >
                <option value="HR Super Admin">HR Super Admin</option>
                <option value="HR Learning Admin">HR Learning Admin</option>
                <option value="HR Viewer">HR Viewer</option>
              </select>

              <span className={`admin-added-date text-xs text-secondary`}>Since {admin.addedOn}</span>

              {confirmRemove === admin.email ? (
                <div className="flex-center-gap">
                  <button
                    className="btn-text-subtle"
                    onClick={() => setConfirmRemove(null)}
                    style={{ fontSize: "0.72rem" }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary-action"
                    style={{ background: "#dc2626", fontSize: "0.72rem", padding: "0.25rem 0.6rem" }}
                    onClick={() => handleRemove(admin.email)}
                  >
                    Confirm Remove
                  </button>
                </div>
              ) : (
                <button
                  className="btn-icon-subtle"
                  title="Remove admin access"
                  onClick={() => setConfirmRemove(admin.email)}
                  disabled={admin.role === "HR Super Admin" && admins.filter((a) => a.role === "HR Super Admin").length <= 1}
                >
                  <span className="material-symbols-outlined icon-small">person_remove</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Admin */}
        <div className="add-admin-panel">
          <div className="section-label-chip" style={{ marginBottom: "0.75rem" }}>Grant Admin/HR Access to a Transcorp Employee</div>

          <div className="form-row-duo" style={{ alignItems: "flex-start" }}>
            <div className="form-field-group" style={{ flex: 2 }}>
              <label className="field-label">Search Transcorp Employee (451 staff)</label>
              <div className="search-field-wrapper">
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  placeholder="Search by name, email, or subsidiary…"
                  value={addSearch}
                  onChange={(e) => { setAddSearch(e.target.value); setSelectedLearner(null); setAddError(null); }}
                  className="directory-search-input"
                />
              </div>
              {addSearch.trim() && (
                <div className="candidates-dropdown-list" style={{ marginTop: "0.25rem" }}>
                  {candidateLearners.length === 0 ? (
                    <div className="p-3 text-secondary text-xs">No employees found for &quot;{addSearch}&quot;</div>
                  ) : (
                    candidateLearners.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => { setSelectedLearner(l); setAddSearch(l.fullName); setAddError(null); }}
                        className={`candidate-picker-item ${selectedLearner?.id === l.id ? "selected" : ""}`}
                      >
                        <div className="trainer-avatar-bubble small">{l.avatar}</div>
                        <div className="candidate-info">
                          <span className="candidate-name">{l.fullName}</span>
                          <span className="candidate-email">{l.email} • {l.subsidiary}</span>
                        </div>
                        <button type="button" className="btn-select-chip">Select</button>
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedLearner && (
                <div className="selected-admin-preview">
                  <span className="material-symbols-outlined icon-small text-amber">person_add</span>
                  <span className="text-xs"><strong>{selectedLearner.fullName}</strong> — {selectedLearner.email}</span>
                </div>
              )}
            </div>

            <div className="form-field-group" style={{ flex: 1 }}>
              <label className="field-label">Assign Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as HRAdmin["role"])}
                className="form-text-input"
              >
                <option value="HR Learning Admin">HR Learning Admin</option>
                <option value="HR Super Admin">HR Super Admin</option>
                <option value="HR Viewer">HR Viewer (Read Only)</option>
              </select>
            </div>
          </div>

          {addError && (
            <div className="validation-warning-bar" style={{ marginTop: "0.5rem" }}>
              <span className="material-symbols-outlined icon-small">error</span>
              <span>{addError}</span>
            </div>
          )}
          {addSuccess && (
            <div className="validation-success-bar" style={{ marginTop: "0.5rem" }}>
              <span className="material-symbols-outlined icon-small">check_circle</span>
              <span>{addSuccess}</span>
            </div>
          )}

          <button
            type="button"
            className="btn-primary-action"
            style={{ marginTop: "1rem" }}
            onClick={handleAddAdmin}
            disabled={!selectedLearner}
          >
            <span className="material-symbols-outlined icon-small">person_add</span>
            <span>Grant Admin Access</span>
          </button>
        </div>
      </div>
    </div>
  );
};
