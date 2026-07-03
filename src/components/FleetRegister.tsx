/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ShieldCheck, HardDrive, Key, Cpu, Users, Layers, Zap, Info, Play, Pause } from "lucide-react";
import { HardwareItem, LogisticsItem } from "../types";

interface FleetRegisterProps {
  hardware: HardwareItem[];
  logistics: LogisticsItem[];
}

interface SimulatedLogEntry {
  timestamp: string;
  assetId: string;
  eventName: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
}

export default function FleetRegister({ hardware, logistics }: FleetRegisterProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [logs, setLogs] = useState<SimulatedLogEntry[]>([]);
  const [isLoggingActive, setIsLoggingActive] = useState<boolean>(true);

  // Compile combined registered assets
  const registeredAssets = [
    ...hardware.map((item, idx) => ({
      id: item.id,
      name: item.model,
      category: "IT Hardware",
      quantity: item.quantity,
      serialPrefix: `M3-MAC-${2000 + idx}`,
      healthIndex: 99 - (idx * 2) % 5,
      encryption: "AES-GCM-256",
      assignedUsers: `${item.quantity} Field Specialists`,
      telemetrySignal: "STRONG",
    })),
    ...logistics.map((item, idx) => ({
      id: item.id,
      name: item.assetDescription,
      category: "Site Logistics",
      quantity: 1,
      serialPrefix: `STG-INF-${700 + idx}`,
      healthIndex: 95 - (idx * 4) % 10,
      encryption: "TLS-1.3-IPSEC",
      assignedUsers: "Site Foreman Ops Team",
      telemetrySignal: "STABLE",
    })),
  ];

  // Initialize selected asset
  useEffect(() => {
    if (registeredAssets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(registeredAssets[0].id);
    }
  }, [hardware, logistics]);

  // Simulated real-time tracking logs stream
  useEffect(() => {
    if (registeredAssets.length === 0) return;

    // Generate initial logs
    const initialLogs: SimulatedLogEntry[] = [
      {
        timestamp: new Date(Date.now() - 60000 * 5).toISOString().replace("T", " ").slice(0, 19),
        assetId: registeredAssets[0]?.id || "system",
        eventName: "INITIALIZED_SECURE_ERP_COMPLIANCE_ENVELOPE",
        severity: "SUCCESS"
      },
      {
        timestamp: new Date(Date.now() - 60000 * 4).toISOString().replace("T", " ").slice(0, 19),
        assetId: registeredAssets[0]?.id || "system",
        eventName: "ESTABLISHED_SARS_E-FILING_CORRELATION_TUNNEL",
        severity: "INFO"
      }
    ];
    setLogs(initialLogs);

    if (!isLoggingActive) return;

    const interval = setInterval(() => {
      const randomAsset = registeredAssets[Math.floor(Math.random() * registeredAssets.length)];
      if (!randomAsset) return;

      const events = [
        { name: "TELEMETRY_PING_ACKNOWLEDGED", severity: "INFO" as const },
        { name: "GPS_COORDINATES_HEARTBEAT_SEALED", severity: "INFO" as const },
        { name: "HARDWARE_FLEET_STATE_HEALTH_VERIFIED", severity: "SUCCESS" as const },
        { name: "SECURE_TUNNEL_RSA_ROTATE_COMPLETED", severity: "SUCCESS" as const },
        { name: "CELLULAR_SIGNAL_BANDWIDTH_STABLE_4G", severity: "INFO" as const },
        { name: "INTEGRITY_INDEX_COMPLIANT", severity: "SUCCESS" as const }
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];

      const newLog: SimulatedLogEntry = {
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        assetId: randomAsset.id,
        eventName: `ASSET [${randomAsset.serialPrefix}]: ${randomEvent.name}`,
        severity: randomEvent.severity
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 15)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [hardware, logistics, isLoggingActive]);

  const activeAsset = registeredAssets.find((a) => a.id === selectedAssetId) || registeredAssets[0];

  return (
    <div className="space-y-6" id="fleet-register-panel">
      {/* Tabular Fleet Asset Register */}
      <div className="bg-bento-panel p-6 rounded-xl border border-bento-border">
        <div className="flex items-center justify-between border-b border-bento-border pb-3 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-bento-accent" />
              Corporate Asset Register & Telemetry Index
            </h3>
            <p className="text-[11px] text-bento-dim mt-0.5 font-mono">
              High-value procurement nodes tracked securely via ERP Core
            </p>
          </div>
          <span className="text-[10px] font-bold bg-bento-bg text-bento-text border border-bento-border px-2.5 py-1 rounded font-mono">
            {registeredAssets.length} Total Registered Nodes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-bento-text border-collapse font-mono">
            <thead>
              <tr className="bg-bento-bg border-b border-bento-border text-[9px] uppercase font-bold text-bento-dim tracking-wider">
                <th className="p-3">Asset Serial Code / Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Health Status</th>
                <th className="p-3">Security Protocol</th>
                <th className="p-3 text-right">Deployment Units</th>
              </tr>
            </thead>
            <tbody>
              {registeredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-bento-dim font-sans">
                    No active assets registered. Build items using the procurement form.
                  </td>
                </tr>
              ) : (
                registeredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    id={`asset-row-${asset.id}`}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`border-b border-bento-border hover:bg-bento-bg/40 cursor-pointer transition-colors ${
                      selectedAssetId === asset.id ? "bg-[#161B22]/60 text-white font-bold" : ""
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-semibold text-white font-sans">{asset.name}</div>
                      <div className="text-[10px] text-bento-dim font-mono mt-0.5 flex items-center gap-1">
                        <Key className="w-3 h-3 text-bento-accent" /> {asset.serialPrefix}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-bento-bg text-bento-text border border-bento-border text-[9px] uppercase font-bold rounded">
                        {asset.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-bento-green" />
                        <span>{asset.healthIndex}% Health</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-bento-dim">
                      {asset.encryption}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-bento-accent">
                      {asset.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Block & Simulated Telemetry Heartbeats */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Selected Asset Telemetry Metadata */}
        <div className="bg-bento-panel p-5 rounded-xl border border-bento-border md:col-span-5 space-y-4">
          <h4 className="text-[11px] font-bold text-bento-dim uppercase tracking-wider flex items-center gap-1.5 border-b border-bento-border pb-2 font-mono">
            <Cpu className="w-3.5 h-3.5 text-bento-accent" />
            Node Telemetry Detail Panel
          </h4>

          {activeAsset ? (
            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-bento-bg rounded-lg border border-bento-border">
                <div className="text-[9px] text-bento-dim font-mono uppercase tracking-wide">Currently Selected Node</div>
                <div className="font-semibold text-white mt-1 font-sans">{activeAsset.name}</div>
                <div className="text-[10px] font-mono text-bento-accent mt-0.5">{activeAsset.serialPrefix}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                <div className="bg-bento-bg/50 p-2.5 rounded border border-bento-border space-y-0.5">
                  <span className="text-bento-dim text-[8px] uppercase">Active Staff</span>
                  <div className="text-white font-bold truncate flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-bento-accent" />
                    {activeAsset.assignedUsers.split(" ")[0]} Unit
                  </div>
                </div>

                <div className="bg-bento-bg/50 p-2.5 rounded border border-bento-border space-y-0.5">
                  <span className="text-bento-dim text-[8px] uppercase">Telemetry Signal</span>
                  <div className="text-bento-green font-bold truncate flex items-center gap-1 uppercase font-mono">
                    <Zap className="w-3.5 h-3.5 text-bento-green animate-pulse" />
                    {activeAsset.telemetrySignal}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-bento-dim uppercase font-mono">
                  <span>Cryptographic Key Integrity</span>
                  <span className="text-bento-green font-bold">SECURE SHA-256</span>
                </div>
                <div className="bg-bento-bg p-2.5 rounded font-mono text-[10px] text-bento-accent overflow-x-auto whitespace-nowrap scrollbar-none select-all border border-bento-border">
                  SHA-HASH::{activeAsset.serialPrefix.toLowerCase()}-e2ee-910a9f81
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-bento-dim text-xs font-mono">
              <Info className="w-5 h-5 mx-auto mb-2 text-bento-dim" />
              Select an asset row to visualize encryption matrices.
            </div>
          )}
        </div>

        {/* Live Event Stream Logs */}
        <div className="bg-bento-panel p-5 rounded-xl border border-bento-border md:col-span-7 space-y-3">
          <div className="flex items-center justify-between border-b border-bento-border pb-2">
            <h4 className="text-[11px] font-bold text-bento-dim uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-bento-green" />
              Corporate ERP System Telemetry Feed
            </h4>
            
            <button
              type="button"
              id="toggle-logging-btn"
              onClick={() => setIsLoggingActive(!isLoggingActive)}
              className="text-[9px] flex items-center gap-1 px-2 py-1 bg-bento-bg hover:bg-bento-bg/75 text-bento-text border border-bento-border rounded font-mono cursor-pointer font-bold uppercase transition-colors"
            >
              {isLoggingActive ? (
                <>
                  <Pause className="w-2.5 h-2.5 text-amber-500" /> Pause Feed
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 text-bento-green" /> Resume Feed
                </>
              )}
            </button>
          </div>

          <div className="bg-[#010409] p-3 rounded-lg border border-bento-border font-mono text-[10px] space-y-1.5 h-[160px] overflow-y-auto scrollbar-thin">
            {logs.length === 0 ? (
              <div className="text-bento-dim text-center py-10 font-sans">
                Awaiting first transaction calculations...
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2 leading-relaxed min-w-0 w-full text-[10px]">
                  <span className="text-bento-dim shrink-0 select-none font-mono">[{log.timestamp.split(" ")[1] || log.timestamp}]</span>
                  <span
                    className={`font-semibold shrink-0 select-none font-mono ${
                      log.severity === "SUCCESS"
                        ? "text-bento-green"
                        : log.severity === "WARNING"
                        ? "text-amber-500"
                        : log.severity === "CRITICAL"
                        ? "text-red-500"
                        : "text-bento-accent"
                    }`}
                  >
                    {log.severity}
                  </span>
                  <span className="text-slate-300 flex-1 min-w-0 truncate block font-mono" title={log.eventName}>{log.eventName}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
