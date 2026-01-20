export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Compliance {
  NIST: boolean;
  ISO27001: boolean;
}

export interface Vendor {
  id: number;
  name: string;
  tier: 1 | 2 | 3;
  accessLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  inherentRisk: number; // 0–100
  securityRating: number; // 0–100
  compliance: Compliance;
  incidents: number;
  status: 'active' | 'incident';
}

export interface Incident {
  id: number;
  vendorId: number;
  category: string;
  severity: Severity;
  detectedAt: number;
  resolvedAt?: number;
}

export interface SimulationState {
  vendors: Vendor[];
  incidents: Incident[];
  time: number;
}