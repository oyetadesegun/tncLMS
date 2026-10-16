import React, { useState, useEffect } from "react";
import { lmsDataService } from "../services/lmsDataService";
import type { LMSCertificate } from "../services/dataAdapter";

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
  const [certificate, setCertificate] = useState<LMSCertificate | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function lookup() {
      if (!searchedId) {
        setCertificate(null);
        return;
      }
      setIsSearching(true);
      const res = await lmsDataService.getCertificateById(searchedId.trim());
      if (isMounted) {
        setCertificate(res);
        setIsSearching(false);
      }
    }
    lookup();
    return () => {
      isMounted = false;
    };
  }, [searchedId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedId(inputVal.trim());
  };

  return (
    <div className="view-content-centered">
      <div className="verify-hero-container">
        <div className="verify-shield-icon">
          <span className="material-symbols-outlined icon-extra-large text-emerald">verified_user</span>
        </div>
        <h1 className="verify-main-title">Transcorp Credential Verification</h1>
        <p className="verify-main-sub">
          Verify the cryptographic validity and official issuance of employee certificates, safety qualifications, and executive accreditations in Microsoft Dataverse.
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
      {isSearching ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--tnc-slate-500)" }}>
          <span className="material-symbols-outlined icon-spin" style={{ fontSize: "32px", color: "var(--tnc-orange)" }}>
            sync
          </span>
          <p style={{ marginTop: "12px", fontWeight: 600 }}>Querying Dataverse ledger for {searchedId}...</p>
        </div>
      ) : searchedId && (
        <div className="verify-result-card">
          {certificate ? (
            <div>
              <div className="verify-card-top-status status-valid">
                <span className="material-symbols-outlined icon-small text-emerald">verified</span>
                <span>AUTHENTIC TRANSCORP CREDENTIAL CONFIRMED</span>
              </div>

              <div className="verify-card-body">
                <div className="verify-data-grid">
                  <div className="verify-field-slot">
                    <span className="slot-k">Recipient Name</span>
                    <span className="slot-v font-bold">{certificate.recipientName}</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Credential ID</span>
                    <span className="slot-v font-mono font-bold text-primary">{certificate.credentialId}</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Certification Course</span>
                    <span className="slot-v font-semibold">{certificate.courseTitle}</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Issuing Authority</span>
                    <span className="slot-v">{certificate.issuer}</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Date of Issuance</span>
                    <span className="slot-v">{certificate.issuedDate}</span>
                  </div>
                  <div className="verify-field-slot">
                    <span className="slot-k">Accreditation Standing</span>
                    <span className="slot-v text-emerald font-bold">✓ Active & Valid ({certificate.standard})</span>
                  </div>
                </div>

                <div className="verify-card-actions">
                  <button onClick={() => onNavigate(`/certificates/view?id=${certificate.credentialId}`)} className="btn-primary-action">
                    <span className="material-symbols-outlined icon-small">visibility</span>
                    <span>View Official Certificate Document</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="verify-card-invalid">
              <div className="verify-card-top-status status-invalid">
                <span className="material-symbols-outlined icon-small text-red">warning</span>
                <span>CREDENTIAL RECORD NOT FOUND IN LEDGER</span>
              </div>
              <div className="verify-card-body">
                <p className="invalid-explain-text">
                  The identifier <strong>{searchedId}</strong> does not match any accredited certification record issued in the Transcorp Dataverse directory. Please check for typographical errors or contact compliance at <strong>segun.oyetade@transcorpgroup.com</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
