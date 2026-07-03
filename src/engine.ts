/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientMetadata, HardwareItem, LogisticsItem, ErpTransactionPayload } from "./types";

/**
 * Calculates and seals a B2B transaction under South African VAT rule (15%).
 * Implements clinical financial calculation block.
 */
export function processB2BOrder(
  clientMetadata: ClientMetadata,
  hardwareAllocation: HardwareItem[],
  rentalLogistics: LogisticsItem[]
): ErpTransactionPayload {
  const SA_VAT_RATE = 0.15; // Statutory 15% South African VAT
  let rawSubtotal = 0;
  const validatedFleetLogs: string[] = [];

  // 1. Process Hardware Procurement Stream (e.g., M-Series MacBooks for Fleets)
  hardwareAllocation.forEach((item) => {
    const itemCost = item.quantity * item.unitPrice;
    rawSubtotal += itemCost;
    validatedFleetLogs.push(
      `PROVISIONED: ${item.quantity}x ${item.model} @ R${item.unitPrice.toLocaleString("en-ZA")} ea. [Secure Deployment]`
    );
  });

  // 2. Process Site Logistics & Rental Infrastructure Stream (e.g., Tool Containers)
  rentalLogistics.forEach((logistics) => {
    const logisticalCost = logistics.durationMonths * logistics.monthlyRate;
    rawSubtotal += logisticalCost;
    validatedFleetLogs.push(
      `STAGED LOGISTICS: ${logistics.assetDescription} for ${logistics.durationMonths} Months @ R${logistics.monthlyRate.toLocaleString("en-ZA")}/mo.`
    );
  });

  // 3. Clinical Financial Calculation Block
  const calculatedVat = rawSubtotal * SA_VAT_RATE;
  const certifiedGrandTotal = rawSubtotal + calculatedVat;

  // Generate Reference
  const randomRefId = Math.floor(100000 + Math.random() * 900000);
  const transactionRef = `B2B-ERP-${randomRefId}`;

  // 4. Encapsulate Output into an Immutable System Data Object
  const erpTransactionPayload: ErpTransactionPayload = {
    transaction_ref: transactionRef,
    timestamp: new Date().toISOString(),
    client_name: (clientMetadata.companyName || "UNKNOWN CORP").toUpperCase(),
    compliance_reg: clientMetadata.vendorNumber || "PENDING_ONBOARDING",
    system_logs: validatedFleetLogs,
    financial_ledger: {
      net_subtotal: parseFloat(rawSubtotal.toFixed(2)),
      vat_amount: parseFloat(calculatedVat.toFixed(2)),
      grand_total: parseFloat(certifiedGrandTotal.toFixed(2)),
    },
    status: "APPROVED_FOR_JV_ACCOUNT_CLEARANCE",
    hardware: hardwareAllocation,
    logistics: rentalLogistics
  };

  // 5. Formatted Universal Terminal Console Output simulation (also printed to console)
  console.log("\n==================================================");
  console.log(`   ENTERPRISE ERP PAYLOAD: ${erpTransactionPayload.transaction_ref}   `);
  console.log("==================================================");
  console.log(`Client Account  : ${erpTransactionPayload.client_name}`);
  console.log(`Vendor Status   : ${erpTransactionPayload.compliance_reg}`);
  console.log(`System Status   : ${erpTransactionPayload.status}`);
  console.log("--------------------------------------------------");
  console.log("SYSTEM OPERATIONAL LOGS:");
  erpTransactionPayload.system_logs.forEach((log) => console.log(` -> ${log}`));
  console.log("--------------------------------------------------");
  console.log(`NET SUBTOTAL    : R${erpTransactionPayload.financial_ledger.net_subtotal.toLocaleString("en-ZA")}`);
  console.log(`COMPLIANT VAT   : R${erpTransactionPayload.financial_ledger.vat_amount.toLocaleString("en-ZA")}`);
  console.log(`GRAND TOTAL     : R${erpTransactionPayload.financial_ledger.grand_total.toLocaleString("en-ZA")}`);
  console.log("==================================================\n");

  return erpTransactionPayload;
}

/**
 * Standard Sample Datasets for Demo/Initialization
 */
export const SAMPLE_CLIENTS: ClientMetadata[] = [
  {
    companyName: "Sefateng Mining Joint Venture Operations",
    vendorNumber: "VND-79402-MX",
    contactEmail: "procurement@sefatengmining.co.za",
    region: "Limpopo, South Africa",
    costCenter: "LP-MIN-CORE-01"
  },
  {
    companyName: "Sasol Secunda Synfuels Hub",
    vendorNumber: "VND-81320-SS",
    contactEmail: "logistics@sasol.com",
    region: "Mpumalanga, South Africa",
    costCenter: "MP-SYN-FUEL-99"
  },
  {
    companyName: "Coega Port IDZ Consortium",
    vendorNumber: "VND-49211-CG",
    contactEmail: "invoices@coegaidz.org.za",
    region: "Eastern Cape, South Africa",
    costCenter: "EC-PORT-OPS-04"
  }
];

export const SAMPLE_HARDWARE: HardwareItem[][] = [
  [
    { id: "h1", model: "MacBook Air M3 (16GB RAM / 512GB SSD)", quantity: 3, unitPrice: 28500.00 },
    { id: "h2", model: "MacBook Air M2 (8GB RAM / 256GB SSD)", quantity: 1, unitPrice: 19500.00 }
  ],
  [
    { id: "h3", model: "Dell Precision 5680 Mobile Workstation Core i9", quantity: 5, unitPrice: 42000.00 },
    { id: "h4", model: "Ruggedized Field Tablet Pro LTE v4", quantity: 12, unitPrice: 12500.00 }
  ],
  [
    { id: "h5", model: "Mac Studio M2 Ultra (128GB RAM / 2TB SSD)", quantity: 2, unitPrice: 95000.00 },
    { id: "h6", model: "HP ZBook Fury G10 Field Special", quantity: 4, unitPrice: 38000.00 }
  ]
];

export const SAMPLE_LOGISTICS: LogisticsItem[][] = [
  [
    { id: "l1", assetDescription: "Heavy-Duty Reinforced Tool Container (6m)", durationMonths: 12, monthlyRate: 3750.00 },
    { id: "l2", assetDescription: "Mobile Fleet Site Office Structure", durationMonths: 12, monthlyRate: 5200.00 }
  ],
  [
    { id: "l3", assetDescription: "Secure Mobile Comms Tower Trailer (Generator Integrated)", durationMonths: 6, monthlyRate: 14500.00 },
    { id: "l4", assetDescription: "Climate-Controlled Server Container Block", durationMonths: 18, monthlyRate: 22000.00 }
  ],
  [
    { id: "l5", assetDescription: "Rigid Base Accommodation Cabin (4 Bed)", durationMonths: 24, monthlyRate: 9800.00 }
  ]
];
