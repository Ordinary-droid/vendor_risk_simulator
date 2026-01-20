"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, AlertTriangle } from "lucide-react";

interface Props {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  onTriggerIncident: () => void;
}

export default function SimulationControls({
  running,
  onStart,
  onStop,
  onTriggerIncident,
}: Props) {
  return (
    <div className="flex gap-2 mb-6">
      {!running ? (
        <Button onClick={onStart} className="gap-2">
          <Play className="h-4 w-4" />
          Start Simulation
        </Button>
      ) : (
        <Button onClick={onStop} variant="secondary" className="gap-2">
          <Pause className="h-4 w-4" />
          Pause Simulation
        </Button>
      )}

      <Button
        variant="destructive"
        onClick={onTriggerIncident}
        className="gap-2"
      >
        <AlertTriangle className="h-4 w-4" />
        Trigger Breach
      </Button>
    </div>
  );
}
