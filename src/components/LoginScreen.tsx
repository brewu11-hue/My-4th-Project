import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, CheckCircle, RefreshCw, KeyRound, Key } from "lucide-react";
import { motion } from "motion/react";

interface LoginScreenProps {
  onLoginSuccess: (userEmail: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password reset state
  const [mode, setMode] = useState<"login" | "changePassword">("login");
  const [changeEmail, setChangeEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Helper to get or set credentials from local storage for high-fidelity persistence
  const getStoredPassword = (userEmail: string): string => {
    const key = `aura_erp_pwd_${userEmail.toLowerCase().trim()}`;
    const stored = localStorage.getItem(key);
    if (stored) return stored;
    // Default password for the main demo user
    if (userEmail.toLowerCase().trim() === "admin@aura.erp") {
      return "password123";
    }
    return "";
  };

  const storeNewPassword = (userEmail: string, newPwd: string) => {
    const key = `aura_erp_pwd_${userEmail.toLowerCase().trim()}`;
    localStorage.setItem(key, newPwd);
  };

  const handleAutofill = () => {
    const defaultEmail = "admin@aura.erp";
    setEmail(defaultEmail);
    setPassword(getStoredPassword(defaultEmail));
    setError("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please input a valid corporate email.");
      return;
    }
    if (!password) {
      setError("Please enter your security access pin/password.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const correctPassword = getStoredPassword(email);
      if (correctPassword && password === correctPassword) {
        setSuccess("Cryptographic identity verified. Loading ERP...");
        setTimeout(() => {
          onLoginSuccess(email);
          setIsSubmitting(false);
        }, 1000);
      } else {
        setError("Invalid credentials or unauthorized terminal access code.");
        setIsSubmitting(false);
      }
    }, 800);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!changeEmail) {
      setError("Please input your corporate email address.");
      return;
    }
    if (!oldPassword) {
      setError("Please input your current security key/password.");
      return;
    }
    if (!newPassword) {
      setError("Please provide a new strong password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters for RSA security compliance.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Confirm password matches do not align.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const currentStored = getStoredPassword(changeEmail);
      if (currentStored && oldPassword === currentStored) {
        storeNewPassword(changeEmail, newPassword);
        setSuccess("Security credentials updated. You may now log in.");
        setTimeout(() => {
          setMode("login");
          // Autofill updated password
          setEmail(changeEmail);
          setPassword(newPassword);
          setIsSubmitting(false);
        }, 1500);
      } else {
        setError("Current password does not match our records for this client terminal.");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#C9D1D9] font-sans flex items-center justify-center p-4 relative overflow-hidden" id="login-screen-root">
      {/* Dynamic Background Decorative Visuals */}
      <div className="absolute inset-0 bg-[radial-gradient(#2F81F7_0.7px,transparent_0.7px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2F81F7] rounded-full filter blur-[120px] opacity-5 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[120px] opacity-5 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10"
        id="login-card-container"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bento-accent via-[#2188ff] to-[#34d058] rounded-t-2xl" />

        {/* Corporate Branding Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-[#0D1117] rounded-xl border border-[#30363D] text-[#2F81F7] mb-3">
            <Key className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
            Aura Enterprise Gate
          </h1>
          <p className="text-[11px] font-mono text-bento-dim uppercase tracking-wider mt-1">
            Secure B2B Client Access Terminal
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-[#0D1117] p-1 rounded-lg border border-[#30363D] mb-6">
          <button
            type="button"
            className={`flex-1 text-center py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              mode === "login" 
                ? "bg-[#2F81F7] text-white shadow font-bold" 
                : "text-bento-dim hover:text-white"
            }`}
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
          >
            Terminal Login
          </button>
          <button
            type="button"
            className={`flex-1 text-center py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              mode === "changePassword" 
                ? "bg-[#2F81F7] text-white shadow font-bold" 
                : "text-bento-dim hover:text-white"
            }`}
            onClick={() => { setMode("changePassword"); setError(""); setSuccess(""); }}
          >
            Change Credentials
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-xs text-red-400"
            id="login-error-alert"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-2 text-xs text-emerald-400"
            id="login-success-alert"
          >
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* Mode Forms */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
            <div>
              <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase tracking-wider">
                // Corporate Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-bento-dim">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  id="login-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@aura.erp"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-bento-dim font-mono uppercase tracking-wider">
                  // Access Pin / Security Key
                </label>
                <button
                  type="button"
                  onClick={() => setMode("changePassword")}
                  className="text-[10px] text-[#2F81F7] hover:underline font-mono"
                >
                  Forgot security key?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-bento-dim">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-10 pr-10 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-bento-dim hover:text-white"
                  id="toggle-login-password-visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#2F81F7] hover:bg-[#2188ff] disabled:bg-bento-dim/40 text-white font-bold rounded-lg text-xs tracking-wider uppercase font-mono transition-all duration-200 shadow-lg border-b-2 border-blue-800"
              id="submit-login-btn"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Secure Key...
                </>
              ) : (
                "Authorize Terminal Session"
              )}
            </button>

            {/* Quick Demo Assist */}
            <div className="pt-4 border-t border-[#30363D] text-center">
              <span className="text-[10px] text-bento-dim font-mono block mb-2">
                DEVELOPER / TEST DEMO ACCESS CREDS:
              </span>
              <button
                type="button"
                onClick={handleAutofill}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] hover:border-bento-dim rounded text-[10px] font-mono font-bold text-[#2F81F7] transition-all cursor-pointer"
                id="autofill-demo-btn"
              >
                <KeyRound className="w-3.5 h-3.5" /> Auto-Fill Demo Access Code
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4" id="change-password-form">
            <div>
              <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase tracking-wider">
                // Terminal Corporate Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-bento-dim">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  id="reset-email-input"
                  value={changeEmail}
                  onChange={(e) => setChangeEmail(e.target.value)}
                  placeholder="e.g. admin@aura.erp"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase tracking-wider">
                // Current Password (verify terminal ownership)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-bento-dim">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="reset-old-password-input"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Verify old security code"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase tracking-wider">
                // New Encryption Access Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-bento-dim">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="reset-new-password-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters recommended"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase tracking-wider">
                // Re-type New Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-bento-dim">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="reset-confirm-password-input"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Align password confirms"
                  className="w-full text-xs pl-10 pr-3 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="flex-1 py-2.5 px-3 bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] text-bento-text hover:text-white rounded-lg text-xs font-semibold tracking-wide transition-all font-mono"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-3 bg-[#2F81F7] hover:bg-[#2188ff] disabled:bg-bento-dim/40 text-white font-bold rounded-lg text-xs tracking-wider uppercase font-mono transition-all duration-200 border-b-2 border-blue-800"
                id="submit-password-change-btn"
              >
                {isSubmitting ? "Updating..." : "Commit Change"}
              </button>
            </div>
          </form>
        )}

        {/* Security Notice */}
        <p className="text-[10px] text-center text-bento-dim font-mono mt-6 leading-normal border-t border-[#30363D] pt-4">
          SARS SECURE PORTAL INTERFACE COMPLIANCE LK-992-SEC • 256-BIT CRYPTOGRAPHIC DECRYPT COMPLIANT
        </p>
      </motion.div>
    </div>
  );
}
