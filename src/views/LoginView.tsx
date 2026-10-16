import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginViewProps {
  onNavigate: (path: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validate = (): boolean => {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!email.includes("@")) errs.email = "Enter a valid email address.";
    if (!password.trim()) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setIsLoading(true);
    const result = await login(email.trim(), password.trim());
    setIsLoading(false);
    if (!result.success) {
      setError(result.error ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Background ambient layers */}
      <div className="login-bg-orb orb-1" />
      <div className="login-bg-orb orb-2" />
      <div className="login-bg-grid" />

      <div className="login-card-container">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-brand-logo-ring">
            <span className="login-brand-letter">T</span>
          </div>
          <div className="login-brand-text-col">
            <span className="login-brand-name">TRANSCORP</span>
            <span className="login-brand-sub">Learning Assessment Hub</span>
          </div>
        </div>

        {/* Heading */}
        <div className="login-heading-block">
          <h1 className="login-main-title">Welcome back</h1>
          <p className="login-main-sub">Sign in with your Transcorp corporate account</p>
        </div>

        {/* Form */}
        <form className="login-form-body" onSubmit={handleSubmit} noValidate>
          {/* Global error */}
          {error && (
            <div className="login-error-alert" role="alert">
              <span className="material-symbols-outlined icon-small">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="login-field-group">
            <label className="login-field-label" htmlFor="login-email">
              Corporate Email Address
            </label>
            <div className="login-input-wrapper">
              <span className="material-symbols-outlined login-input-icon">mail</span>
              <input
                id="login-email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                placeholder="firstname.lastname@transcorpgroup.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  setError(null);
                }}
                className={`login-text-input ${fieldErrors.email ? "input-error" : ""}`}
                disabled={isLoading}
              />
            </div>
            {fieldErrors.email && (
              <span className="login-field-error">{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="login-field-group">
            <div className="login-label-row">
              <label className="login-field-label" htmlFor="login-password">
                Password
              </label>
              <span className="login-hint-text">Employee ID or default password</span>
            </div>
            <div className="login-input-wrapper">
              <span className="material-symbols-outlined login-input-icon">lock</span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Employee ID (e.g. TRC-007)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                  setError(null);
                }}
                className={`login-text-input ${fieldErrors.password ? "input-error" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-show-password-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined icon-small">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {fieldErrors.password && (
              <span className="login-field-error">{fieldErrors.password}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="login-submit-btn"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="login-spinner" />
                <span>Authenticating…</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined icon-small">login</span>
                <span>Sign In to LMS</span>
              </>
            )}
          </button>
        </form>

        {/* Demo hint panel */}
        <div className="login-demo-hint-box">
          <div className="login-demo-hint-header">
            <span className="material-symbols-outlined icon-small text-amber">info</span>
            <span className="font-bold text-xs">Pre-Launch Demo Credentials</span>
          </div>
          <div className="login-demo-creds-grid">
            <div className="login-demo-cred-item">
              <div className="demo-role-badge super">HR Super Admin</div>
              <div className="font-mono text-xs" style={{ marginTop: "0.3rem" }}>
                segun.oyetade@transcorpgroup.com
              </div>
              <div className="text-secondary text-xs font-mono">Password: Transcorp@2026</div>
            </div>
            <div className="login-demo-cred-item">
              <div className="demo-role-badge learning">HR Learning Admin</div>
              <div className="font-mono text-xs" style={{ marginTop: "0.3rem" }}>
                amaka.okafor@transcorpgroup.com
              </div>
              <div className="text-secondary text-xs font-mono">Password: TRC-AMAKA</div>
            </div>
            <div className="login-demo-cred-item" style={{ gridColumn: "1 / -1" }}>
              <div className="demo-role-badge learner">Any Staff Learner</div>
              <div className="text-xs text-secondary" style={{ marginTop: "0.3rem" }}>
                Email: any @transcorpgroup.com or @transcorppower.com staff email
                <br />
                Password: their Employee ID (e.g. TRC-001)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-card-footer">
          <span className="material-symbols-outlined icon-tiny text-secondary">lock</span>
          <span className="text-secondary text-xs">
            Secured by Microsoft Entra ID Zero-Trust SSO • Transcorp Group
          </span>
        </div>
      </div>
    </div>
  );
};
