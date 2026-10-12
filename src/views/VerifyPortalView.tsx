import React, { useState } from "react";

interface VerifyPortalViewProps {
  initialId?: string;
  onNavigate: (path: string) => void;
}

export const VerifyPortalView: React.FC<VerifyPortalViewProps> = ({
  initialId = "CERT-8F3K-92QX",
  onNavigate,
}) => {
  const [inputVal, setInputVal] = useState(initialId);
  const [searchedId, setSearchedId] = useState(initialId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(inputVal.trim());
  };

  const isKnown =
    searchedId.toUpperCase() === "CERT-8F3K-92QX" ||
    searchedId.toUpperCase() === "TRC-2025-9942" ||
    searchedId.toUpperCase() === "CERT-9X2L-44AP";

  return (
    <div className="view-content-centered">
      <div className="verify-hero-container">
        <div className="verify-shield-icon">
          <span className="material-symbols-outlined icon-extra-large text-emerald">verified_user</span>
        </div>
        <h1 className="verify-main-title">Transcorp Credential Verification</h1>
        <p className="verify-main-sub">
          Verify the cryptographic validity and official issuance of employee certificates, safety qualifications, and executive accreditations.
        </p>

        <form onSubmit={handleSearch} className="verify-search-form">
          <div className="verify-input-field-wrap">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Enter Credential Reference (e.g. CERT-8F3K-92QX)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="verify-search-input"
            />
          </div>
          <button type="submit" className="btn-verify-submit">
            <span>Verify Credential</span>
            <span className="material-symbols-outlined icon-small">arrow_forward</span>
          </button>
        </form>
      </div>

      {/* Verification Result Card */}
      {searchedId && (
        <div className="verify-result-card">
          {isKnown ? (
            <div>
              <div className="verify-card-top-status status-valid">
                <span className="material-symbols-outlined icon-small text-emerald">verified</span>
                <span>AUTHENTIC TRANSCORP CREDENTIAL CONFIRMED</span>
              </div>

              <div className="verify-card-body">
                <div className="verify-data-grid">
                  <div className="verify-field-slot">
                    <span className="slot-k">Recipient Name</span>
                    <span className="slot-v font-bold">Amaka Obi Okafor</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Credential ID</span>
                    <span className="slot-v font-mono font-bold text-primary">{searchedId.toUpperCase()}</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Certification Course</span>
                    <span className="slot-v font-semibold">Cybersecurity & Critical Infrastructure Defense</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Issuing Authority</span>
                    <span className="slot-v">Transcorp Institute of Information Security</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Date of Issuance</span>
                    <span className="slot-v">06 October 2025</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Accreditation Standing</span>
                    <span className="slot-v text-emerald font-bold">✓ Active & Valid (ISO 27001)</span>
                  </div>
                </div>

                <div className="verify-card-actions">
                  <button onClick={() => onNavigate("/certificates/view")} className="btn-primary-action">
                    <span className="material-symbols-outlined icon-small">visibility</span>
                    <span>View Official Certificate Document</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="verify-not-found-box">
              <span className="material-symbols-outlined icon-large text-error">error</span>
              <h3 className="not-found-title">Credential Record Not Found</h3>
              <p className="not-found-desc">
                No active certificate matching reference <strong>"{searchedId}"</strong> was located in the primary corporate registry. Please confirm the reference code with the certificate holder.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
