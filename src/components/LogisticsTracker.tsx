/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Truck, MapPin, Calendar, Compass, ShieldAlert, ArrowRight, Activity, Clock } from "lucide-react";
import { LogisticsItem } from "../types";

interface LogisticsTrackerProps {
  logistics: LogisticsItem[];
  region: string;
}

interface OperationalSite {
  id: string;
  name: string;
  coordinates: string;
  deploymentKey: string;
  status: "STAGED" | "TRANSIT" | "DEPLOYED" | "MAINTENANCE";
  tempSensor: number; // in Celsius
  gpsLock: boolean;
}

export default function LogisticsTracker({ logistics, region }: LogisticsTrackerProps) {
  // Let's create a dynamic list of active physical site assets based on our logistics lines
  const [siteDetails, setSiteDetails] = useState<OperationalSite[]>([
    {
      id: "site-1",
      name: "Gauteng Distribution Hub (Depot-A)",
      coordinates: "26.2041° S, 28.0473° E",
      deploymentKey: "DEP-JHB-928",
      status: "DEPLOYED",
      tempSensor: 19.8,
      gpsLock: true
    },
    {
      id: "site-2",
      name: "Sefateng Logistics Staging Ground",
      coordinates: "24.3980° S, 30.1347° E",
      deploymentKey: "STG-SEF-710",
      status: "STAGED",
      tempSensor: 28.4,
      gpsLock: true
    },
    {
      id: "site-3",
      name: "Coega Port IDZ Storage Vault",
      coordinates: "33.7917° S, 25.6833° E",
      deploymentKey: "SEC-CGH-114",
      status: "TRANSIT",
      tempSensor: 16.2,
      gpsLock: false
    }
  ]);

  const toggleStatus = (id: string) => {
    setSiteDetails(
      siteDetails.map((s) => {
        if (s.id === id) {
          const statusCycle: Array<"STAGED" | "TRANSIT" | "DEPLOYED" | "MAINTENANCE"> = [
            "STAGED",
            "TRANSIT",
            "DEPLOYED",
            "MAINTENANCE"
          ];
          const nextIdx = (statusCycle.indexOf(s.status) + 1) % statusCycle.length;
          return { ...s, status: statusCycle[nextIdx] };
        }
        return s;
      })
    );
  };

  const statusColors = {
    STAGED: "bg-blue-500/10 text-bento-accent border-blue-500/30 hover:bg-blue-500/20",
    TRANSIT: "bg-amber-500/10 text-amber-500 border-amber-500/30 animate-pulse hover:bg-amber-500/20",
    DEPLOYED: "bg-bento-green/10 text-bento-green border-bento-green/30 hover:bg-bento-green/20",
    MAINTENANCE: "bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
  };

  return (
    <div className="space-y-6" id="logistics-tracker-panel">
      {/* Overview Map Simulation */}
      <div className="bg-bento-panel p-6 rounded-xl border border-bento-border">
        <div className="flex items-center justify-between border-b border-bento-border pb-3 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-bento-accent" />
              Tactical Fleet Staging & Logistics Mapping
            </h3>
            <p className="text-[11px] text-bento-dim mt-0.5 font-mono">
              Active zone // {region || "Republic of South Africa"}
            </p>
          </div>
          <span className="text-[10px] font-mono bg-bento-bg text-bento-text border border-bento-border px-2.5 py-1 rounded-sm flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 bg-bento-green rounded-full animate-ping" />
            TELEMETRY ONLINE
          </span>
        </div>

        {/* Visual Simulated Map Grid */}
        <div className="relative h-44 bg-bento-bg rounded-lg overflow-hidden border border-bento-border flex flex-col justify-between p-4 text-white">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2F81F7_1px,transparent_1px)] bg-[size:10px_10px]" />
          <div className="absolute top-0 right-0 p-3 text-[9px] text-bento-dim font-mono text-right leading-relaxed">
            GPS RESOLUTION: ± 2.4 METERS<br />
            BEIDOU / GALILEO INTEGRATED
          </div>

          {/* Map Nodes Pins */}
          <div className="relative flex-1 flex justify-around items-center">
            {siteDetails.map((site, index) => (
              <div key={site.id} className="flex flex-col items-center group relative cursor-pointer">
                {/* Visual Connector Line */}
                {index < siteDetails.length - 1 && (
                  <div className="absolute left-[50%] right-[-150%] top-3.5 h-[1px] border-t border-dashed border-bento-accent/20 pointer-events-none" />
                )}

                {/* Pin Node Icon */}
                <div
                  id={`node-pin-${site.id}`}
                  onClick={() => toggleStatus(site.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border shadow-[0_0_12px_rgba(47,129,247,0.15)] ${
                    site.status === "DEPLOYED"
                      ? "bg-bento-green/10 border-bento-green text-bento-green hover:scale-110"
                      : site.status === "TRANSIT"
                      ? "bg-amber-500/10 border-amber-500 text-amber-500 hover:scale-110"
                      : site.status === "MAINTENANCE"
                      ? "bg-red-500/10 border-red-500 text-red-500 hover:scale-110"
                      : "bg-bento-panel border-bento-border text-bento-text hover:scale-110"
                  }`}
                  title="Click to cycle status"
                >
                  <MapPin className="w-4.5 h-4.5" />
                </div>

                <div className="text-[10px] mt-2 font-mono text-white bg-bento-panel px-1.5 py-0.5 rounded border border-bento-border max-w-[110px] truncate text-center">
                  {site.name.split(" ")[0]}
                </div>
                <div className="text-[8px] text-bento-dim font-mono mt-0.5 uppercase tracking-wide">
                  {site.status}
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-bento-accent pt-2 border-t border-bento-border/50">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" /> COORD: LIMPOPO JV CORE GRID
            </span>
            <span className="text-bento-green font-bold">SYSTEM ENVELOPE: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Logistics Lease Durations and Operational Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Site Register Table */}
        <div className="bg-bento-panel p-5 rounded-xl border border-bento-border space-y-3">
          <h4 className="text-[11px] font-bold text-bento-dim uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Activity className="w-3.5 h-3.5 text-bento-accent" />
            // Live Deployment Status Board
          </h4>

          <div className="space-y-3">
            {siteDetails.map((site) => (
              <div
                key={site.id}
                className="p-3 bg-bento-bg rounded-lg border border-bento-border flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{site.name}</div>
                  <div className="text-[10px] text-bento-dim font-mono mt-0.5 flex items-center gap-2">
                    <span>Key: {site.deploymentKey}</span>
                    <span>•</span>
                    <span>GPS: {site.gpsLock ? "SECURE LOCK" : "SEARCHING"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  id={`status-toggle-${site.id}`}
                  onClick={() => toggleStatus(site.id)}
                  className={`px-2.5 py-1 rounded border text-[9px] font-bold font-mono transition-colors cursor-pointer uppercase ${
                    statusColors[site.status]
                  }`}
                  title="Cycle Logistics State"
                >
                  {site.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics Cost Allocations Curve */}
        <div className="bg-bento-panel p-5 rounded-xl border border-bento-border space-y-3">
          <h4 className="text-[11px] font-bold text-bento-dim uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            // Active Rental Infrastructure Staging
          </h4>

          <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
            {logistics.length === 0 ? (
              <div className="text-center py-6 text-bento-dim text-xs border border-dashed border-bento-border rounded-lg bg-bento-bg">
                No rental items. Add items in procurement panel.
              </div>
            ) : (
              logistics.map((item) => {
                const totalCost = item.durationMonths * item.monthlyRate;
                return (
                  <div key={item.id} className="p-3 bg-bento-bg rounded-lg border border-bento-border text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-white truncate max-w-[170px]" title={item.assetDescription}>
                        {item.assetDescription}
                      </div>
                      <span className="font-mono text-white font-bold">R{totalCost.toLocaleString("en-ZA")}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-bento-dim font-mono">
                        <span>Lease: {item.durationMonths} Months</span>
                        <span>R{item.monthlyRate.toLocaleString("en-ZA")}/mo</span>
                      </div>
                      {/* Interactive Staging Bar */}
                      <div className="w-full bg-bento-panel h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-bento-accent h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (item.durationMonths / 24) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
