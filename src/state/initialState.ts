import type { SimulationState } from '@/engine/types';

export const initialSimulationState: SimulationState = {
  time: 0,
  incidents: [],
  vendors: [
    {
      id: 1,
      name: 'CloudStore Inc',
      tier: 1,
      accessLevel: 'High',
      inherentRisk: 65,
      securityRating: 85,
      compliance: { NIST: true, ISO27001: true },
      incidents: 0,
      status: 'active'
    }
  ]
};
