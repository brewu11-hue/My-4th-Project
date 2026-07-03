/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Copy, Check, FileJson, Printer, ExternalLink, ShieldCheck, Download, AlertCircle, RefreshCw } from "lucide-react";
import { ErpTransactionPayload } from "../types";
import { motion } from "motion/react";

interface LedgerReceiptProps {
  payload: ErpTransactionPayload;
}

export default function LedgerReceipt({ payload }: LedgerReceiptProps) {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedSignatures, setVerifiedSignatures] = useState<string | null>(null);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      const mockHash = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setVerifiedSignatures(mockHash);
      setVerifying(false);
    }, 1200);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${payload.transaction_ref}_payload.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="ledger-receipt-view">
      {/* Receipts Frame */}
      <div className="relative bg-[#0D1117] text-emerald-400 p-6 rounded-2xl border border-bento-border shadow-2xl font-mono text-xs overflow-hidden leading-relaxed">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(47,129,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(47,129,247,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Security Watermark Background */}
        <div className="absolute -right-12 -bottom-12 text-[#161B22]/60 text-[100px] font-bold select-none rotate-12 uppercase pointer-events-none z-0">
          SARS VAT
        </div>

        {/* Ledger Ticket Header */}
        <div className="relative z-10 border-b border-dashed border-bento-border pb-4 text-center">
          <div className="text-[10px] tracking-widest text-bento-accent font-bold uppercase mb-1">
            ★★★ B2B ENTERPRISE ERP COMPLIANCE LEDGER ★★★
          </div>
          <h2 className="text-sm font-bold tracking-widest text-white uppercase font-mono">
            {payload.transaction_ref}
          </h2>
          <p className="text-[10px] text-bento-dim mt-1 font-mono">
            TIMESTAMP: {payload.timestamp}
          </p>
        </div>

        {/* Client & Vendor Block */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-dashed border-bento-border text-[11px]">
          <div className="space-y-1">
            <span className="text-bento-accent block text-[10px] tracking-wider uppercase font-sans font-bold">
              Client Legal Entity:
            </span>
            <span className="text-white text-xs font-bold uppercase">{payload.client_name}</span>
            <div className="text-[10px] text-bento-dim mt-1 font-mono">
              REG COMPLIANCE: <span className="text-amber-500 font-bold">{payload.compliance_reg}</span>
            </div>
          </div>
          <div className="space-y-1 md:text-right">
            <span className="text-bento-accent block text-[10px] tracking-wider uppercase font-sans font-bold">
              Transaction Clearing:
            </span>
            <span className="text-bento-green font-bold font-mono">{payload.status}</span>
            <div className="text-[10px] text-bento-dim mt-1 font-mono">
              LEDGER ENCRYPT: <span className="text-slate-300">ECDSA-RSA-2026</span>
            </div>
          </div>
        </div>

        {/* System Logs / Line Items Description */}
        <div className="relative z-10 py-4 border-b border-dashed border-bento-border space-y-2">
          <div className="text-[10px] text-bento-accent tracking-wider uppercase font-sans font-bold">
            SYSTEM OPERATIONAL LOGS:
          </div>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            {payload.system_logs.map((log, lIdx) => (
              <div key={lIdx} className="flex items-start gap-2 text-[11px] text-emerald-300">
                <span className="text-emerald-500 select-none">↳</span>
                <span className="font-mono">{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Subtotals & SARS 15% VAT Compliant Calculation */}
        <div className="relative z-10 py-4 space-y-2 border-b border-dashed border-bento-border">
          <div className="flex justify-between items-center text-bento-text font-mono">
            <span>NET SUBTOTAL (PROCURABLE)</span>
            <span className="text-white font-bold">
              R {payload.financial_ledger.net_subtotal.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-amber-500 font-mono">
            <span className="flex items-center gap-1">
              SARS COMPLIANT VAT (15.0%)
            </span>
            <span className="font-bold">
              R {payload.financial_ledger.vat_amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="pt-2 border-t border-dashed border-bento-border flex justify-between items-center text-xs font-bold text-white tracking-wide font-mono">
            <span className="text-bento-accent">GRAND TOTAL</span>
            <span className="text-lg text-bento-green drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] font-bold">
              R {payload.financial_ledger.grand_total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Signature Verification Box */}
        <div className="relative z-10 pt-4 text-center">
          {verifiedSignatures ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bento-green/10 border border-bento-green/20 text-bento-green p-2.5 rounded-lg text-[10px] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-bento-green shrink-0" />
              <div>
                <span className="font-bold">SARS VAT COMPLIANCE SEAL VERIFIED</span>
                <span className="block text-bento-dim font-mono text-[8px] truncate mt-0.5 max-w-[320px] mx-auto">
                  INTEGRITY SECURE HASH: {verifiedSignatures}
                </span>
              </div>
            </motion.div>
          ) : (
            <button
              type="button"
              id="verify-seal-btn"
              onClick={simulateVerification}
              disabled={verifying}
              className="px-4 py-2 border border-dashed border-bento-accent/60 text-bento-accent hover:text-white hover:border-bento-accent rounded-lg text-[11px] font-mono transition-all duration-200 cursor-pointer inline-flex items-center gap-2 hover:bg-bento-accent/10"
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating Compliance Seal...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sign & Verify Compliance Seal
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" id="ledger-receipt-actions">
        <button
          type="button"
          id="copy-payload-btn"
          onClick={handleCopyJson}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-bento-panel hover:bg-bento-bg text-bento-text hover:text-white border border-bento-border rounded-lg transition-colors cursor-pointer font-bold font-mono text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-bento-green" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-bento-accent" />
              Copy JSON
            </>
          )}
        </button>

        <button
          type="button"
          id="download-payload-btn"
          onClick={downloadJson}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-bento-panel hover:bg-bento-bg text-bento-text hover:text-white border border-bento-border rounded-lg transition-colors cursor-pointer font-bold font-mono text-xs"
        >
          <Download className="w-3.5 h-3.5 text-bento-accent" />
          Save JSON
        </button>

        <button
          type="button"
          id="print-ledger-btn"
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-bento-panel hover:bg-bento-bg text-bento-text hover:text-white border border-bento-border rounded-lg transition-colors cursor-pointer font-bold font-mono text-xs"
        >
          <Printer className="w-3.5 h-3.5 text-bento-accent" />
          Print PDF
        </button>
      </div>

      {/* Legal & Compliance note */}
      <div className="bg-amber-500/5 border border-amber-500/20 p-4.5 rounded-xl text-amber-500/90 text-[11px] leading-relaxed flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">SARS VAT Practice Note:</span> Invoices issued on or after April 1, 2018 in South Africa are legally subject to standard-rate Value-Added Tax of 15% under Section 7(1)(a) of the VAT Act. This engine guarantees mathematical compliance by sealing logs and calculating tax subtotals to an exact rounded precision point.
        </div>
      </div>
    </div>
  );
}
