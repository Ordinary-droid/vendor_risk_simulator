import { useState, useCallback } from "react";
import type { Vendor } from "@/lib/types/vendor";
import type { IncidentWithVendor } from "@/lib/actions/incidents";

export function useSimulation(initialVendors: Vendor[]) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [incidents, setIncidents] = useState<IncidentWithVendor[]>([]);
  const [running, setRunning] = useState(false);

  const startSimulation = () => setRunning(true);
  const stopSimulation = () => setRunning(false);

  const triggerIncident = useCallback(() => {
    if (vendors.length === 0) return;

    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const now = new Date().toISOString();

    const incident: IncidentWithVendor = {
      id: crypto.randomUUID(),
      vendor_id: vendor.id,

      // REQUIRED Incident fields
      title: "Simulated Security Incident",
      description: "This incident was generated in simulation mode.",
      severity: "high",
      status: "open",

      reported_at: now,
      created_at: now,
      updated_at: now,
      resolved_at: null,

      // Supabase relation
      vendors: vendor,
    };

    setIncidents((prev) => [incident, ...prev]);

    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendor.id
          ? { ...v, security_rating: Math.max(0, v.security_rating - 15) }
          : v
      )
    );
  }, [vendors]);

  const resolveIncident = (id: string) => {
    const now = new Date().toISOString();

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "resolved",
              resolved_at: now,
              updated_at: now,
            }
          : i
      )
    );
  };

  return {
    vendors,
    incidents,
    running,
    startSimulation,
    stopSimulation,
    triggerIncident,
    resolveIncident,
  };
}
