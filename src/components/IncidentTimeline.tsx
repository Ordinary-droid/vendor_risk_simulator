import React from "react";
import type { Incident, Vendor } from "@/engine/types";

interface IncidentTimelineProps {
  incidents: Incident[];
  vendors: Vendor[]; // pass vendors so we can look up names
  maxItems?: number;
}

const severityColor = {
  critical: "bg-red-600",
  high: "bg-orange-600",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export default function IncidentTimeline({ incidents, vendors, maxItems = 20 }: IncidentTimelineProps) {
  const recent = incidents.slice(-maxItems).reverse();

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Incident Timeline (Last {maxItems})</h2>
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
        {recent.length === 0 && (
          <div className="text-gray-400 text-center py-4">
            No incidents yet. Start the simulation to see events.
          </div>
        )}

        {recent.map((incident) => {
          const vendor = vendors.find(v => v.id === incident.vendorId);
          const vendorName = vendor?.name ?? "Unknown";

          return (
            <div
              key={incident.id}
              className="flex items-center justify-between p-2 rounded border border-gray-600"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${severityColor[incident.severity]}`}
                  >
                    {incident.severity.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium">{incident.category}</span>
                </div>
                <span className="text-xs text-gray-400">{vendorName}</span>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(incident.detectedAt).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
