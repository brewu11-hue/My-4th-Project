/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClientMetadata {
  companyName: string;
  vendorNumber: string;
  contactEmail?: string;
  region?: string;
  costCenter?: string;
}

export interface HardwareItem {
  id: string;
  model: string;
  quantity: number;
  unitPrice: number;
}

export interface LogisticsItem {
  id: string;
  assetDescription: string;
  durationMonths: number;
  monthlyRate: number;
}

export interface LedgerSummary {
  net_subtotal: number;
  vat_amount: number;
  grand_total: number;
}

export interface ErpTransactionPayload {
  transaction_ref: string;
  timestamp: string;
  client_name: string;
  compliance_reg: string;
  system_logs: string[];
  financial_ledger: LedgerSummary;
  status: string;
  hardware: HardwareItem[];
  logistics: LogisticsItem[];
}

export interface SavedInvoice {
  id: string;
  payload: ErpTransactionPayload;
  title: string;
}
