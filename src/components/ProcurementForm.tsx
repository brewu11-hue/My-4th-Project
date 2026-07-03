/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash2, RefreshCw, Briefcase, Truck, Shield, HelpCircle, Layers, FileText } from "lucide-react";
import { ClientMetadata, HardwareItem, LogisticsItem } from "../types";
import { SAMPLE_CLIENTS, SAMPLE_HARDWARE, SAMPLE_LOGISTICS } from "../engine";

interface ProcurementFormProps {
  client: ClientMetadata;
  setClient: (client: ClientMetadata) => void;
  hardware: HardwareItem[];
  setHardware: (hardware: HardwareItem[]) => void;
  logistics: LogisticsItem[];
  setLogistics: (logistics: LogisticsItem[]) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

const COMMON_HARDWARE_PRESETS = [
  { model: "MacBook Air M3 (16GB RAM / 512GB SSD)", unitPrice: 28500.00 },
  { model: "MacBook Air M2 (8GB RAM / 256GB SSD)", unitPrice: 19500.00 },
  { model: "Dell Precision 5680 Mobile Workstation", unitPrice: 42000.00 },
  { model: "HP ZBook Fury G10 Enterprise Core i9", unitPrice: 38000.00 },
  { model: "Ruggedized Field Tablet Pro LTE v4", unitPrice: 12500.00 },
  { model: "Custom Enterprise Server Node Rack 1U", unitPrice: 110000.00 }
];

const COMMON_LOGISTICS_PRESETS = [
  { assetDescription: "Heavy-Duty Reinforced Tool Container (6m)", monthlyRate: 3750.00 },
  { assetDescription: "Mobile Fleet Site Office Structure", monthlyRate: 5200.00 },
  { assetDescription: "Secure Mobile Comms Tower Trailer", monthlyRate: 14500.00 },
  { assetDescription: "Climate-Controlled Server Container Block", monthlyRate: 22000.00 },
  { assetDescription: "Rigid Base Accommodation Cabin (4 Bed)", monthlyRate: 9800.00 }
];

export default function ProcurementForm({
  client,
  setClient,
  hardware,
  setHardware,
  logistics,
  setLogistics,
  onCalculate,
  isLoading
}: ProcurementFormProps) {
  // Preset selector index
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);

  // States for adding a new hardware item
  const [newHwModel, setNewHwModel] = useState("");
  const [newHwQty, setNewHwQty] = useState(1);
  const [newHwPrice, setNewHwPrice] = useState(15000);
  const [showHwPresetSelect, setShowHwPresetSelect] = useState(false);

  // States for adding a new logistics item
  const [newLgDesc, setNewLgDesc] = useState("");
  const [newLgDuration, setNewLgDuration] = useState(12);
  const [newLgRate, setNewLgRate] = useState(4000);
  const [showLgPresetSelect, setShowLgPresetSelect] = useState(false);

  // Quick Preset Loader
  const loadPreset = (idx: number) => {
    setActivePresetIndex(idx);
    setClient({ ...SAMPLE_CLIENTS[idx] });
    setHardware([...SAMPLE_HARDWARE[idx]]);
    setLogistics([...SAMPLE_LOGISTICS[idx]]);
  };

  // Hardware Actions
  const addHardwareItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwModel.trim()) return;
    const newItem: HardwareItem = {
      id: "hw-" + Date.now(),
      model: newHwModel.trim(),
      quantity: Math.max(1, newHwQty),
      unitPrice: Math.max(0, newHwPrice)
    };
    setHardware([...hardware, newItem]);
    setNewHwModel("");
    setNewHwQty(1);
    setNewHwPrice(15000);
    setShowHwPresetSelect(false);
  };

  const removeHardwareItem = (id: string) => {
    setHardware(hardware.filter(item => item.id !== id));
  };

  const updateHardwareQty = (id: string, qty: number) => {
    setHardware(hardware.map(item => item.id === id ? { ...item, quantity: Math.max(1, qty) } : item));
  };

  const updateHardwarePrice = (id: string, price: number) => {
    setHardware(hardware.map(item => item.id === id ? { ...item, unitPrice: Math.max(0, price) } : item));
  };

  // Logistics Actions
  const addLogisticsItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLgDesc.trim()) return;
    const newItem: LogisticsItem = {
      id: "lg-" + Date.now(),
      assetDescription: newLgDesc.trim(),
      durationMonths: Math.max(1, newLgDuration),
      monthlyRate: Math.max(0, newLgRate)
    };
    setLogistics([...logistics, newItem]);
    setNewLgDesc("");
    setNewLgDuration(12);
    setNewLgRate(4000);
    setShowLgPresetSelect(false);
  };

  const removeLogisticsItem = (id: string) => {
    setLogistics(logistics.filter(item => item.id !== id));
  };

  const updateLogisticsDuration = (id: string, duration: number) => {
    setLogistics(logistics.map(item => item.id === id ? { ...item, durationMonths: Math.max(1, duration) } : item));
  };

  const updateLogisticsRate = (id: string, rate: number) => {
    setLogistics(logistics.map(item => item.id === id ? { ...item, monthlyRate: Math.max(0, rate) } : item));
  };

  return (
    <div className="space-y-6" id="procurement-form-panel">
      {/* 1. Quick Presets Selectors */}
      <div className="bg-bento-panel p-5 rounded-xl border border-bento-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-bento-dim flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-bento-accent" /> Core Enterprise Scenarios
          </h3>
          <span className="text-[10px] text-bento-accent bg-bento-bg px-2 py-0.5 rounded border border-bento-border font-mono">
            S.A. VAT: 15.0%
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SAMPLE_CLIENTS.map((c, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-btn-${idx}`}
              onClick={() => loadPreset(idx)}
              className={`text-left p-3.5 rounded-lg border text-xs transition-all duration-200 cursor-pointer ${
                activePresetIndex === idx
                  ? "border-bento-accent bg-bento-accent/10 text-white font-medium"
                  : "border-bento-border bg-bento-bg text-bento-text hover:bg-bento-panel hover:border-bento-dim/30"
              }`}
            >
              <div className="font-semibold truncate text-white">{c.companyName}</div>
              <div className="text-[10px] text-bento-dim font-mono mt-1 flex justify-between">
                <span>{c.vendorNumber}</span>
                <span className="text-bento-accent font-sans">{c.region?.split(",")[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Client Metadata Form */}
      <div className="bg-bento-panel p-6 rounded-xl border border-bento-border space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-bento-border pb-2.5 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-bento-accent" />
          I. Corporate Client & Compliance Metadata
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase">// Company Registered Legal Name</label>
            <input
              type="text"
              id="company-name-input"
              value={client.companyName}
              onChange={(e) => setClient({ ...client, companyName: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-bento-border rounded-md focus:outline-hidden focus:ring-1 focus:ring-bento-accent focus:border-bento-accent bg-bento-bg text-white"
              placeholder="e.g. Sefateng Mining Joint Venture"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase">// SARS Vendor Compliance Number (Reg)</label>
            <input
              type="text"
              id="vendor-number-input"
              value={client.vendorNumber}
              onChange={(e) => setClient({ ...client, vendorNumber: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-bento-border rounded-md focus:outline-hidden focus:ring-1 focus:ring-bento-accent focus:border-bento-accent bg-bento-bg text-white font-mono"
              placeholder="VND-XXXXX-XX"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase">// Procurement Contact Email</label>
            <input
              type="email"
              id="contact-email-input"
              value={client.contactEmail || ""}
              onChange={(e) => setClient({ ...client, contactEmail: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-bento-border rounded-md focus:outline-hidden focus:ring-1 focus:ring-bento-accent focus:border-bento-accent bg-bento-bg text-white"
              placeholder="procurement@corporation.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase">// Operational Region</label>
              <input
                type="text"
                id="region-input"
                value={client.region || ""}
                onChange={(e) => setClient({ ...client, region: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-bento-border rounded-md focus:outline-hidden focus:ring-1 focus:ring-bento-accent focus:border-bento-accent bg-bento-bg text-white"
                placeholder="Limpopo, S.A."
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-bento-dim mb-1 font-mono uppercase">// GL Cost Center Code</label>
              <input
                type="text"
                id="cost-center-input"
                value={client.costCenter || ""}
                onChange={(e) => setClient({ ...client, costCenter: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-bento-border rounded-md focus:outline-hidden focus:ring-1 focus:ring-bento-accent focus:border-bento-accent bg-bento-bg text-white font-mono"
                placeholder="LP-MIN-01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hardware Allocation Streams */}
      <div className="bg-bento-panel p-6 rounded-xl border border-bento-border space-y-4">
        <div className="flex items-center justify-between border-b border-bento-border pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-bento-accent" />
            II. Hardware Fleet Allocation Stream
          </h3>
          <span className="text-[10px] text-bento-accent bg-bento-bg border border-bento-border px-2.5 py-1 rounded font-mono font-bold">
            {hardware.length} Active Modules
          </span>
        </div>

        {/* Existing Hardware List */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {hardware.length === 0 ? (
            <div className="text-center py-6 text-bento-dim text-xs border border-dashed border-bento-border rounded-lg bg-bento-bg">
              No hardware fleet elements staged. Add items below.
            </div>
          ) : (
            hardware.map((item) => (
              <div
                key={item.id}
                id={`hw-item-${item.id}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-bento-bg rounded-lg border border-bento-border gap-2 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{item.model}</div>
                  <div className="text-[10px] text-bento-dim font-mono mt-0.5">
                    Unit: R{item.unitPrice.toLocaleString("en-ZA")} | Line Total: R{(item.quantity * item.unitPrice).toLocaleString("en-ZA")}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Quantity Edit */}
                  <div className="flex items-center gap-1.5 bg-bento-panel border border-bento-border rounded px-2 py-0.5">
                    <span className="text-[10px] text-bento-dim uppercase font-mono">Qty:</span>
                    <input
                      type="number"
                      id={`hw-qty-${item.id}`}
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateHardwareQty(item.id, parseInt(e.target.value) || 1)}
                      className="w-10 text-xs font-bold text-white text-center bg-transparent focus:outline-hidden"
                    />
                  </div>

                  {/* Price Edit */}
                  <div className="flex items-center gap-1 bg-bento-panel border border-bento-border rounded px-2 py-0.5">
                    <span className="text-[10px] text-bento-dim font-mono">R</span>
                    <input
                      type="number"
                      id={`hw-price-${item.id}`}
                      min="0"
                      step="100"
                      value={item.unitPrice}
                      onChange={(e) => updateHardwarePrice(item.id, parseFloat(e.target.value) || 0)}
                      className="w-20 text-xs font-mono text-white text-right bg-transparent focus:outline-hidden"
                    />
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    id={`hw-delete-${item.id}`}
                    onClick={() => removeHardwareItem(item.id)}
                    className="p-1 text-bento-dim hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form to Add Hardware */}
        <form onSubmit={addHardwareItem} className="bg-bento-bg p-3 rounded-lg border border-bento-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-bento-dim uppercase font-mono">// Add Fleet Procurement Item</span>
            <button
              type="button"
              id="hw-toggle-presets"
              onClick={() => setShowHwPresetSelect(!showHwPresetSelect)}
              className="text-[10px] text-bento-accent hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
            >
              {showHwPresetSelect ? "Manual Entry Mode" : "Select Enterprise Presets"}
            </button>
          </div>

          {showHwPresetSelect ? (
            <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto p-1 bg-bento-panel border border-bento-border rounded">
              {COMMON_HARDWARE_PRESETS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  id={`hw-preset-select-${pIdx}`}
                  onClick={() => {
                    setNewHwModel(preset.model);
                    setNewHwPrice(preset.unitPrice);
                    setShowHwPresetSelect(false);
                  }}
                  className="p-2 text-left rounded-sm border border-bento-border bg-bento-bg hover:bg-bento-panel text-[11px] text-bento-text truncate cursor-pointer transition-colors"
                >
                  <div className="font-semibold truncate text-white">{preset.model}</div>
                  <div className="text-[10px] text-bento-dim font-mono">R{preset.unitPrice.toLocaleString("en-ZA")}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-6">
                <input
                  type="text"
                  id="new-hw-model-input"
                  placeholder="MacBook / Workstation Model Name"
                  value={newHwModel}
                  onChange={(e) => setNewHwModel(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-bento-border bg-bento-panel rounded focus:outline-hidden focus:border-bento-accent text-white"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="number"
                  id="new-hw-qty-input"
                  placeholder="Qty"
                  min="1"
                  value={newHwQty}
                  onChange={(e) => setNewHwQty(parseInt(e.target.value) || 1)}
                  className="w-full text-xs px-2.5 py-1.5 border border-bento-border bg-bento-panel rounded text-center focus:outline-hidden focus:border-bento-accent text-white"
                />
              </div>
              <div className="md:col-span-3">
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs text-bento-dim font-mono">R</span>
                  <input
                    type="number"
                    id="new-hw-price-input"
                    placeholder="Unit Price"
                    min="0"
                    value={newHwPrice}
                    onChange={(e) => setNewHwPrice(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs pl-6 pr-2 py-1.5 border border-bento-border bg-bento-panel rounded text-right font-mono focus:outline-hidden focus:border-bento-accent text-white"
                  />
                </div>
              </div>
              <div className="md:col-span-1 flex items-stretch">
                <button
                  type="submit"
                  id="add-hw-btn"
                  className="w-full flex items-center justify-center bg-bento-accent hover:bg-bento-accent/80 text-white rounded p-1.5 transition-colors cursor-pointer"
                  title="Add Line Item"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 4. Logistics & Site Rentals */}
      <div className="bg-bento-panel p-6 rounded-xl border border-bento-border space-y-4">
        <div className="flex items-center justify-between border-b border-bento-border pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-500" />
            III. Logistics & Site Infrastructure Rentals
          </h3>
          <span className="text-[10px] text-amber-500 bg-bento-bg border border-bento-border px-2.5 py-1 rounded font-mono font-bold">
            {logistics.length} Active Staging Sites
          </span>
        </div>

        {/* Existing Logistics List */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {logistics.length === 0 ? (
            <div className="text-center py-6 text-bento-dim text-xs border border-dashed border-bento-border rounded-lg bg-bento-bg">
              No tactical staging logistics active. Add logistics lines below.
            </div>
          ) : (
            logistics.map((item) => (
              <div
                key={item.id}
                id={`lg-item-${item.id}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-bento-bg rounded-lg border border-bento-border gap-2 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{item.assetDescription}</div>
                  <div className="text-[10px] text-bento-dim font-mono mt-0.5">
                    Rate: R{item.monthlyRate.toLocaleString("en-ZA")}/mo | Total for {item.durationMonths} months: R{(item.durationMonths * item.monthlyRate).toLocaleString("en-ZA")}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Duration Edit */}
                  <div className="flex items-center gap-1.5 bg-bento-panel border border-bento-border rounded px-2 py-0.5">
                    <span className="text-[10px] text-bento-dim uppercase font-mono">Months:</span>
                    <input
                      type="number"
                      id={`lg-dur-${item.id}`}
                      min="1"
                      value={item.durationMonths}
                      onChange={(e) => updateLogisticsDuration(item.id, parseInt(e.target.value) || 1)}
                      className="w-10 text-xs font-bold text-white text-center bg-transparent focus:outline-hidden font-mono"
                    />
                  </div>

                  {/* Rate Edit */}
                  <div className="flex items-center gap-1 bg-bento-panel border border-bento-border rounded px-2 py-0.5">
                    <span className="text-[10px] text-bento-dim font-mono">R</span>
                    <input
                      type="number"
                      id={`lg-rate-${item.id}`}
                      min="0"
                      step="100"
                      value={item.monthlyRate}
                      onChange={(e) => updateLogisticsRate(item.id, parseFloat(e.target.value) || 0)}
                      className="w-20 text-xs font-mono text-white text-right bg-transparent focus:outline-hidden"
                    />
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    id={`lg-delete-${item.id}`}
                    onClick={() => removeLogisticsItem(item.id)}
                    className="p-1 text-bento-dim hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form to Add Logistics */}
        <form onSubmit={addLogisticsItem} className="bg-bento-bg p-3 rounded-lg border border-bento-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-bento-dim uppercase font-mono">// Add Infrastructure & Site Leasing</span>
            <button
              type="button"
              id="lg-toggle-presets"
              onClick={() => setShowLgPresetSelect(!showLgPresetSelect)}
              className="text-[10px] text-amber-500 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
            >
              {showLgPresetSelect ? "Manual Entry Mode" : "Select Infrastructure Presets"}
            </button>
          </div>

          {showLgPresetSelect ? (
            <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto p-1 bg-bento-panel border border-bento-border rounded">
              {COMMON_LOGISTICS_PRESETS.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  id={`lg-preset-select-${pIdx}`}
                  onClick={() => {
                    newLgDesc(preset.assetDescription);
                    newLgRate(preset.monthlyRate);
                    setShowLgPresetSelect(false);
                  }}
                  className="p-2 text-left rounded-sm border border-bento-border bg-bento-bg hover:bg-bento-panel text-[11px] text-bento-text truncate cursor-pointer transition-colors"
                >
                  <div className="font-semibold truncate text-white">{preset.assetDescription}</div>
                  <div className="text-[10px] text-bento-dim font-mono">R{preset.monthlyRate.toLocaleString("en-ZA")}/mo</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-6">
                <input
                  type="text"
                  id="new-lg-desc-input"
                  placeholder="Infrastructure Description (e.g. 6m Mobile Office)"
                  value={newLgDesc}
                  onChange={(e) => setNewLgDesc(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-bento-border bg-bento-panel rounded focus:outline-hidden focus:border-amber-400 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="number"
                  id="new-lg-dur-input"
                  placeholder="Months"
                  min="1"
                  value={newLgDuration}
                  onChange={(e) => setNewLgDuration(parseInt(e.target.value) || 12)}
                  className="w-full text-xs px-2.5 py-1.5 border border-bento-border bg-bento-panel rounded text-center focus:outline-hidden focus:border-amber-400 text-white font-mono"
                />
              </div>
              <div className="md:col-span-3">
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs text-bento-dim font-mono">R</span>
                  <input
                    type="number"
                    id="new-lg-rate-input"
                    placeholder="Rate / Mo"
                    min="0"
                    value={newLgRate}
                    onChange={(e) => setNewLgRate(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs pl-6 pr-2 py-1.5 border border-bento-border bg-bento-panel rounded text-right font-mono focus:outline-hidden focus:border-amber-400 text-white"
                  />
                </div>
              </div>
              <div className="md:col-span-1 flex items-stretch">
                <button
                  type="submit"
                  id="add-lg-btn"
                  className="w-full flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white rounded p-1.5 transition-colors cursor-pointer"
                  title="Add Logistics Lease"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 5. Trigger Calculation Button */}
      <div className="pt-2">
        <button
          type="button"
          id="recalculate-erp-btn"
          onClick={onCalculate}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-bento-accent hover:bg-bento-accent/90 disabled:bg-bento-dim/45 text-white font-bold rounded-xl text-xs transition-all cursor-pointer uppercase tracking-wider font-mono border-b-4 border-bento-accent/60"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              Re-Hashing Ledger & Compiling Logs...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Compute Compliant Ledger Block (15% S.A. VAT)
            </>
          )}
        </button>
        <p className="text-[10px] text-center text-bento-dim mt-2 font-mono">
          SEALED BY SECURE LEDGER SYSTEM ENGINE V3.4.0 • COMPLIANT UNDER INCOME TAX ACT 58 OF 1962 (RSA)
        </p>
      </div>
    </div>
  );
}
