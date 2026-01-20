"use client";

import VendorTable from "@/components/VendorTable";
import IncidentTimeline from "@/components/IncidentTimeline";
import SimulationControls from "@/components/SimulationControls";
import { useSimulation } from "@/hooks/use-simulation";
import { useEffect } from "react";

// TEMP seed data – replace later if needed
import { mockVendors } from "@/lib/mock-data";

export default function SimulationPage() {
  const {
    vendors,
    incidents,
    running,
    startSimulation,
    stopSimulation,
    triggerIncident,
  } = useSimulation(mockVendors);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-1">Simulation Mode</h1>
      <p className="text-muted-foreground mb-6">
        This mode uses simulated data. No real vendors are affected.
      </p>

      <SimulationControls
        running={running}
        onStart={startSimulation}
        onStop={stopSimulation}
        onTriggerIncident={triggerIncident}
      />

      <div className="space-y-8">
        <VendorTable vendors={vendors} />
        <IncidentTimeline
          incidents={incidents}
          vendors={vendors}
          maxItems={20}
        />
      </div>
    </div>
  );
}
