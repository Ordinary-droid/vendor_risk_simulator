import type { SimulationState } from './types';
import { maybeGenerateIncident, applyIncidentToVendor } from './incidentEngine';

export function simulateTick(state: SimulationState): SimulationState {
  const incident = maybeGenerateIncident(state.vendors);

  if (!incident) {
    return {
      ...state,
      time: state.time + 1
    };
  }

  return {
    time: state.time + 1,
    incidents: [...state.incidents, incident],
    vendors: state.vendors.map(v =>
      v.id === incident.vendorId
        ? applyIncidentToVendor(v, incident.severity)
        : v
    )
  };
}
