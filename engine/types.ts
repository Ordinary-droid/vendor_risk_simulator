export interface Vendor {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'at-risk' | 'under-review';
  securityRating: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  compliance: {
    NIST: boolean;
    ISO27001: boolean;
    SOC2: boolean;
    GDPR: boolean;
  };
  lastAssessment: string;
  category: string;
  contractValue: number;
  dataAccess: 'none' | 'limited' | 'moderate' | 'extensive';
}

export interface Incident {
  id: string;
  vendorId: string;
  type: 'breach' | 'compliance' | 'performance' | 'security' | 'operational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: number;
  resolved: boolean;
}

export interface SimulationState {
  time: number;
  vendors: Vendor[];
  incidents: Incident[];
}
