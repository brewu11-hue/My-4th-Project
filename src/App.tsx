/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Building2,
  Coins,
  TrendingUp,
  Compass,
  Cpu,
  History,
  FileText,
  Layers,
  Lock,
  RefreshCw,
  Clock,
  Briefcase,
  User,
  LogOut,
  Settings,
  KeyRound,
  ShieldCheck
} from "lucide-react";
import { ClientMetadata, HardwareItem, LogisticsItem, ErpTransactionPayload, SavedInvoice } from "./types";
import { processB2BOrder, SAMPLE_CLIENTS, SAMPLE_HARDWARE, SAMPLE_LOGISTICS } from "./engine";
import ProcurementForm from "./components/ProcurementForm";
import LedgerReceipt from "./components/LedgerReceipt";
import LogisticsTracker from "./components/LogisticsTracker";
import FleetRegister from "./components/FleetRegister";
import LoginScreen from "./components/LoginScreen";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("aura_erp_auth") === "true";
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return sessionStorage.getItem("aura_erp_user") || "";
  });

  // Account Settings Modal state
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [oldPasswordInApp, setOldPasswordInApp] = useState("");
  const [newPasswordInApp, setNewPasswordInApp] = useState("");
  const [confirmPasswordInApp, setConfirmPasswordInApp] = useState("");
  const [appSettingsError, setAppSettingsError] = useState("");
  const [appSettingsSuccess, setAppSettingsSuccess] = useState("");

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    sessionStorage.setItem("aura_erp_auth", "true");
    sessionStorage.setItem("aura_erp_user", email);
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
    setUserEmail("");
    sessionStorage.removeItem("aura_erp_auth");
    sessionStorage.removeItem("aura_erp_user");
    setShowAccountSettings(false);
  };

  const handleInAppPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setAppSettingsError("");
    setAppSettingsSuccess("");

    if (!oldPasswordInApp || !newPasswordInApp || !confirmPasswordInApp) {
      setAppSettingsError("All security fields are required.");
      return;
    }
    if (newPasswordInApp.length < 6) {
      setAppSettingsError("Password must be at least 6 characters for compliance.");
      return;
    }
    if (newPasswordInApp !== confirmPasswordInApp) {
      setAppSettingsError("New passwords do not align.");
      return;
    }

    const key = `aura_erp_pwd_${userEmail.toLowerCase().trim()}`;
    const currentStored = localStorage.getItem(key) || (userEmail.toLowerCase().trim() === "admin@aura.erp" ? "password123" : "");

    if (oldPasswordInApp !== currentStored) {
      setAppSettingsError("Current password verification failed.");
      return;
    }

    localStorage.setItem(key, newPasswordInApp);
    setAppSettingsSuccess("Cryptographic access key updated successfully!");
    setOldPasswordInApp("");
    setNewPasswordInApp("");
    setConfirmPasswordInApp("");
    setTimeout(() => {
      setShowAccountSettings(false);
      setAppSettingsSuccess("");
    }, 1500);
  };

  // State for current client, hardware items, and logistics items
  const [client, setClient] = useState<ClientMetadata>({ ...SAMPLE_CLIENTS[0] });
  const [hardware, setHardware] = useState<HardwareItem[]>([...SAMPLE_HARDWARE[0]]);
  const [logistics, setLogistics] = useState<LogisticsItem[]>([...SAMPLE_LOGISTICS[0]]);

  // Calculated ledger payload state
  const [payload, setPayload] = useState<ErpTransactionPayload>(
    processB2BOrder(SAMPLE_CLIENTS[0], SAMPLE_HARDWARE[0], SAMPLE_LOGISTICS[0])
  );

  // Loading / Calculation feedback simulation
  const [isCompiling, setIsCompiling] = useState(false);

  // Tab controls: "procure" | "logistics" | "fleet"
  const [activeTab, setActiveTab] = useState<"procure" | "logistics" | "fleet">("procure");

  // Historical invoice list state
  const [invoiceHistory, setInvoiceHistory] = useState<SavedInvoice[]>([
    {
      id: "inv-1",
      title: "Sefateng Mining Core JV Run",
      payload: processB2BOrder(SAMPLE_CLIENTS[0], SAMPLE_HARDWARE[0], SAMPLE_LOGISTICS[0])
    },
    {
      id: "inv-2",
      title: "Sasol Secunda Synfuels Expansion Stream",
      payload: processB2BOrder(SAMPLE_CLIENTS[1], SAMPLE_HARDWARE[1], SAMPLE_LOGISTICS[1])
    }
  ]);

  // Real-time calculation helper
  const triggerCalculation = () => {
    setIsCompiling(true);
    // Simulate high-scale enterprise hashing latency
    setTimeout(() => {
      const freshPayload = processB2BOrder(client, hardware, logistics);
      setPayload(freshPayload);
      setIsCompiling(false);
    }, 800);
  };

  // Run calculation immediately on form items change for instant preview, with debouncing or when requested
  useEffect(() => {
    const freshPayload = processB2BOrder(client, hardware, logistics);
    setPayload(freshPayload);
  }, [client, hardware, logistics]);

  // Handle loading an invoice from history
  const handleLoadHistory = (saved: SavedInvoice) => {
    setClient({ ...saved.payload.hardware[0] ? {
      companyName: saved.payload.client_name,
      vendorNumber: saved.payload.compliance_reg,
      contactEmail: "procurement@clientcorp.za",
      region: "Limpopo, S.A.",
      costCenter: "LP-MIN-01"
    } : SAMPLE_CLIENTS[0] });
    
    // We update hardware and logistics
    if (saved.payload.hardware) {
      setHardware([...saved.payload.hardware]);
    }
    if (saved.payload.logistics) {
      setLogistics([...saved.payload.logistics]);
    }
    setPayload(saved.payload);
  };

  // Save current active invoice payload to history
  const handleSaveToHistory = () => {
    const newSaved: SavedInvoice = {
      id: "inv-" + Date.now(),
      title: `${client.companyName.split(" ")[0]} JV - ${payload.transaction_ref}`,
      payload: { ...payload }
    };
    setInvoiceHistory([newSaved, ...invoiceHistory]);
  };

  // Real-time time clock simulation
  const [currentTimeStr, setCurrentTimeStr] = useState("2026-07-03 01:16:30 UTC");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(now.toISOString().replace("T", " ").slice(0, 19) + " UTC");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-bento-bg text-bento-text antialiased font-sans flex flex-col" id="erp-root">
      
      {/* Platform Header */}
      <header className="bg-bento-panel text-white border-b border-bento-border relative overflow-hidden" id="erp-header">
        {/* Decorative thin accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-bento-accent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-bento-bg rounded-xl flex items-center justify-center border border-bento-border text-bento-accent">
              <Building2 className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-bento-green bg-bento-green/10 px-2 py-0.5 rounded border border-bento-green/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-bento-green inline-block animate-pulse" />
                  CORE ENGINE COMPLIANT
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-bento-dim bg-bento-bg px-2 py-0.5 rounded border border-bento-border">
                  PROD v3.4.0
                </span>
              </div>
              <h1 className="text-md sm:text-lg font-bold tracking-tight text-white mt-1">
                AURA B2B Enterprise ERP
                <span className="text-bento-dim font-mono font-normal text-xs block sm:inline sm:ml-2">
                  // PROCUREMENT ENGINE
                </span>
              </h1>
            </div>
          </div>

          {/* Technical Environment Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-bento-text bg-bento-bg px-3 py-1.5 rounded-lg border border-bento-border">
              <Clock className="w-3.5 h-3.5 text-bento-accent" />
              <span className="tracking-wide text-[11px]">{currentTimeStr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-bento-green bg-bento-green/10 px-3 py-1.5 rounded-lg border border-bento-green/20">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px]">S.A. VAT 15.0% COMPLIANT</span>
            </div>
            
            {/* User Session Profile and Logout Controls */}
            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-bento-border pt-2 sm:pt-0 sm:pl-3 sm:ml-1 w-full sm:w-auto">
              <button
                type="button"
                id="user-profile-btn"
                onClick={() => setShowAccountSettings(!showAccountSettings)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-bento-bg text-white hover:bg-bento-accent/10 border border-bento-border hover:border-bento-accent rounded-lg cursor-pointer transition-colors text-[11px] w-full sm:w-auto"
                title="Change security credentials / password"
              >
                <User className="w-3.5 h-3.5 text-bento-accent shrink-0" />
                <span className="max-w-[120px] truncate">{userEmail}</span>
              </button>
              <button
                type="button"
                id="header-logout-btn"
                onClick={handleLogOut}
                className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-600 rounded-lg cursor-pointer transition-colors shrink-0"
                title="End Security Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Metric Cards Grid (Dynamic Spend and Staging indicators) */}
      <section className="bg-bento-bg border-b border-bento-border py-6" id="metrics-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-5 rounded-xl border border-bento-border bg-bento-panel flex items-center justify-between transition-all hover:border-bento-accent/30">
              <div>
                <span className="text-[10px] font-mono text-bento-dim uppercase tracking-wider block">
                  Net Procurement Spend
                </span>
                <span className="text-lg font-bold text-white font-mono mt-1 block">
                  R {payload.financial_ledger.net_subtotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-2 bg-bento-bg rounded-lg text-bento-accent border border-bento-border">
                <Coins className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-xl border border-bento-border bg-bento-panel flex items-center justify-between transition-all hover:border-bento-accent/30">
              <div>
                <span className="text-[10px] font-mono text-bento-dim uppercase tracking-wider block">
                  Compliant SARS VAT (15%)
                </span>
                <span className="text-lg font-bold text-amber-500 font-mono mt-1 block">
                  R {payload.financial_ledger.vat_amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-2 bg-bento-bg rounded-lg text-amber-500 border border-bento-border">
                <FileText className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-xl border border-bento-border bg-bento-panel flex items-center justify-between transition-all hover:border-bento-accent/30">
              <div>
                <span className="text-[10px] font-mono text-bento-dim uppercase tracking-wider block">
                  Certified Grand Total
                </span>
                <span className="text-lg font-bold text-bento-green font-mono mt-1 block">
                  R {payload.financial_ledger.grand_total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="p-2 bg-bento-bg rounded-lg text-bento-green border border-bento-border">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-5 rounded-xl border border-bento-border bg-bento-panel flex items-center justify-between transition-all hover:border-bento-accent/30">
              <div>
                <span className="text-[10px] font-mono text-bento-dim uppercase tracking-wider block">
                  Active Asset Tracking
                </span>
                <span className="text-lg font-bold text-slate-200 font-mono mt-1 block">
                  {hardware.reduce((acc, curr) => acc + curr.quantity, 0)} Pcs / {logistics.length} Sites
                </span>
              </div>
              <div className="p-2 bg-bento-bg rounded-lg text-bento-dim border border-bento-border">
                <Compass className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Dual Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="main-content-grid">
        
        {/* Left Column: Interactive Tabbed Modules (8 cols) */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6" id="module-tabs-column">
          
          {/* Navigation Tab Rail */}
          <div className="bg-bento-panel p-1 rounded-xl border border-bento-border flex items-center justify-between gap-1 overflow-hidden" id="erp-tab-rail">
            <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none whitespace-nowrap">
              <button
                type="button"
                id="tab-btn-procure"
                onClick={() => setActiveTab("procure")}
                className={`flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === "procure"
                    ? "bg-bento-accent text-white shadow-md font-bold"
                    : "text-bento-dim hover:text-white hover:bg-bento-bg/50"
                }`}
              >
                <Briefcase className="w-4 h-4 text-inherit" />
                Procurement & Invoicing
              </button>
              
              <button
                type="button"
                id="tab-btn-logistics"
                onClick={() => setActiveTab("logistics")}
                className={`flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === "logistics"
                    ? "bg-bento-accent text-white shadow-md font-bold"
                    : "text-bento-dim hover:text-white hover:bg-bento-bg/50"
                }`}
              >
                <Compass className="w-4 h-4 text-inherit" />
                Staging & Logistics Map
              </button>

              <button
                type="button"
                id="tab-btn-fleet"
                onClick={() => setActiveTab("fleet")}
                className={`flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === "fleet"
                    ? "bg-bento-accent text-white shadow-md font-bold"
                    : "text-bento-dim hover:text-white hover:bg-bento-bg/50"
                }`}
              >
                <Cpu className="w-4 h-4 text-inherit" />
                Fleet Logs & Assets
              </button>
            </div>
          </div>

          {/* Module Screen Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "procure" && (
                  <ProcurementForm
                    client={client}
                    setClient={setClient}
                    hardware={hardware}
                    setHardware={setHardware}
                    logistics={logistics}
                    setLogistics={setLogistics}
                    onCalculate={triggerCalculation}
                    isLoading={isCompiling}
                  />
                )}
                {activeTab === "logistics" && (
                  <LogisticsTracker logistics={logistics} region={client.region || ""} />
                )}
                {activeTab === "fleet" && (
                  <FleetRegister hardware={hardware} logistics={logistics} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Transaction History & Save Module (Persistent Ledger Storage) */}
          <div className="bg-bento-panel p-5 rounded-xl border border-bento-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-bento-dim uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-bento-accent" />
                Audit Trail & Invoice Manifest History
              </h3>
              <button
                type="button"
                id="save-invoice-btn"
                onClick={handleSaveToHistory}
                className="text-xs text-bento-accent hover:underline font-bold cursor-pointer"
              >
                + Commit Current to History
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {invoiceHistory.map((hist) => (
                <div
                  key={hist.id}
                  className="p-3 bg-bento-bg hover:bg-bento-bg/80 rounded-lg border border-bento-border flex items-center justify-between text-xs transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate" title={hist.title}>
                      {hist.title}
                    </div>
                    <div className="text-[10px] text-bento-dim font-mono mt-1">
                      REF: {hist.payload.transaction_ref} | R{hist.payload.financial_ledger.grand_total.toLocaleString("en-ZA")}
                    </div>
                  </div>
                  <button
                    type="button"
                    id={`load-history-${hist.id}`}
                    onClick={() => handleLoadHistory(hist)}
                    className="ml-2.5 px-2.5 py-1 bg-bento-panel hover:bg-bento-border text-bento-accent border border-bento-border rounded font-mono text-[10px] cursor-pointer shrink-0 transition-all font-bold"
                  >
                    LOAD
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Dynamic SARS VAT Compliant Ledger receipt block (4 cols) */}
        <section className="lg:col-span-5 xl:col-span-4" id="ledger-receipt-column">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-bold text-bento-dim uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-bento-green" />
                Live Billing Compliant Ledger Block
              </h3>
              {isCompiling && (
                <span className="text-[10px] text-bento-accent font-mono flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> recalculating...
                </span>
              )}
            </div>
            
            <LedgerReceipt payload={payload} />
          </div>
        </section>
      </main>

      {/* Corporate Footer */}
      <footer className="bg-bento-panel text-bento-dim text-xs py-8 mt-12 border-t border-bento-border animate-none" id="erp-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3 font-mono text-bento-accent">
                // Aura ERP Security Suite
              </h4>
              <p className="leading-relaxed">
                Platform fully integrated with South African Revenue Service (SARS) compliant e-Filing interfaces under secure cryptographic container logs. Authorized JV operations clearing stream.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3 font-mono text-bento-accent">
                // System Telemetry Integrity
              </h4>
              <p className="leading-relaxed">
                All procurement lines, equipment assignments, and container logistics trackings utilize encrypted Beidou / Galileo satellite telemetries. Zero-trust token auth active.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3 font-mono text-bento-accent">
                // Income Tax Compliance Note
              </h4>
              <p className="leading-relaxed">
                Statutory Value-Added Tax calculated at 15.00% standard-rate in compliance with South African Income Tax Act guidelines. Ledger hashes archived automatically.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-bento-border text-center font-mono text-[10px] text-bento-dim flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © 2026 AURA ENTERPRISE ERP CO. ALL RIGHTS RESERVED. LIQUID LEDGER ENGINE v3.4.0.
            </div>
            <div className="flex gap-4 text-[10px]">
              <span>SECURE ACCESS KEY ID: <span className="text-bento-accent font-bold">LK-992-SEC</span></span>
              <span>•</span>
              <span>SARS RECOGNIZED SYSTEM</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Account Settings / Change Password Modal */}
      <AnimatePresence>
        {showAccountSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="in-app-password-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccountSettings(false)}
              className="absolute inset-0 bg-[#0A0C10]/85 backdrop-blur-xs"
            />

            {/* Content box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl p-6 overflow-hidden text-[#C9D1D9]"
            >
              {/* Branded Header Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F81F7]" />

              <div className="flex items-center justify-between border-b border-[#30363D] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#2F81F7]" />
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                    Security Key Management
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAccountSettings(false)}
                  className="text-bento-dim hover:text-white font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {appSettingsError && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 flex items-start gap-2">
                  <span>⚠️ {appSettingsError}</span>
                </div>
              )}

              {appSettingsSuccess && (
                <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-start gap-2">
                  <span>✓ {appSettingsSuccess}</span>
                </div>
              )}

              <form onSubmit={handleInAppPasswordChange} className="space-y-4 font-sans text-xs">
                <div>
                  <span className="block text-[10px] text-bento-dim uppercase font-mono mb-1">
                    Terminal User Account
                  </span>
                  <div className="p-2 px-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-white font-mono text-[11px]">
                    {userEmail}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-bento-dim uppercase font-mono mb-1">
                    Verify Current Password
                  </label>
                  <input
                    type="password"
                    id="modal-old-password"
                    value={oldPasswordInApp}
                    onChange={(e) => setOldPasswordInApp(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full text-xs p-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-bento-dim uppercase font-mono mb-1">
                    New Security Key / Password
                  </label>
                  <input
                    type="password"
                    id="modal-new-password"
                    value={newPasswordInApp}
                    onChange={(e) => setNewPasswordInApp(e.target.value)}
                    placeholder="Min 6 characters recommended"
                    className="w-full text-xs p-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-bento-dim uppercase font-mono mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="modal-confirm-password"
                    value={confirmPasswordInApp}
                    onChange={(e) => setConfirmPasswordInApp(e.target.value)}
                    placeholder="Verify new password input"
                    className="w-full text-xs p-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg focus:outline-hidden focus:border-[#2F81F7] text-white font-mono"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAccountSettings(false)}
                    className="flex-1 py-2 bg-[#0D1117] hover:bg-[#30363D] border border-[#30363D] text-bento-text hover:text-white rounded-lg transition-all font-mono uppercase tracking-wide text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="modal-submit-btn"
                    className="flex-1 py-2 bg-[#2F81F7] hover:bg-[#2188ff] text-white font-bold rounded-lg transition-all font-mono uppercase tracking-wide text-[11px] border-b-2 border-blue-800"
                  >
                    Commit Change
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
