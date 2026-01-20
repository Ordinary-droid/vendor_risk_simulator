import type { SimulationState, Vendor, Incident } from './types';

const incidentTypes = ['breach', 'compliance', 'performance', 'security', 'operational'] as const;
const severities = ['low', 'medium', 'high', 'critical'] as const;

const incidentTitles: Record<typeof incidentTypes[number], string[]> = {
  breach: ['Data Exposure Detected', 'Credential Leak Identified', 'Unauthorized Data Access'],
  compliance: ['Policy Violation', 'Certification Lapse', 'Audit Finding'],
  performance: ['Service Degradation', 'High Latency Detected', 'Availability Issue'],
  security: ['Vulnerability Discovered', 'Suspicious Activity', 'Access Anomaly'],
  operational: ['System Outage', 'Configuration Drift', 'Capacity Warning'],
};

function getRandomElement<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIncident(vendors: Vendor[], time: number): Incident | null {
  // 20% chance of generating an incident each tick
  if (Math.random() > 0.2) return null;

  const vendor = getRandomElement(vendors);
  const type = getRandomElement(incidentTypes);
  const severity = getRandomElement(severities);
  const titles = incidentTitles[type];
  const title = getRandomElement(titles);

  return {
    id: `i-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    vendorId: vendor.id,
    type,
    severity,
    title,
    description: `Automated detection: ${title} for vendor ${vendor.name}`,
    timestamp: Date.now(),
    resolved: false,
  };
}

function updateVendorRatings(vendors: Vendor[], incidents: Incident[]): Vendor[] {
  return vendors.map(vendor => {
    const vendorIncidents = incidents.filter(i => i.vendorId === vendor.id && !i.resolved);
    const severityPenalty = vendorIncidents.reduce((sum, i) => {
      const penalties = { critical: 15, high: 10, medium: 5, low: 2 };
      return sum + penalties[i.severity];
    }, 0);

    // Apply small random fluctuation
    const fluctuation = (Math.random() - 0.5) * 4;
    const newRating = Math.max(0, Math.min(100, vendor.securityRating - severityPenalty * 0.1 + fluctuation));
    
    // Update risk level based on rating
    let riskLevel: Vendor['riskLevel'] = 'low';
    if (newRating < 40) riskLevel = 'critical';
    else if (newRating < 60) riskLevel = 'high';
    else if (newRating < 80) riskLevel = 'medium';

    // Update status based on risk
    let status = vendor.status;
    if (riskLevel === 'critical' && vendor.status === 'active') {
      status = 'at-risk';
    } else if (riskLevel === 'low' && vendor.status === 'at-risk') {
      status = 'active';
    }

    return {
      ...vendor,
      securityRating: Math.round(newRating * 10) / 10,
      riskLevel,
      status,
    };
  });
}

export function simulateTick(state: SimulationState): SimulationState {
  const newTime = state.time + 1;
  
  // Maybe generate a new incident
  const newIncident = generateIncident(state.vendors, newTime);
  
  // Maybe resolve an old incident (10% chance per unresolved incident)
  const updatedIncidents = state.incidents.map(incident => {
    if (!incident.resolved && Math.random() < 0.05) {
      return { ...incident, resolved: true };
    }
    return incident;
  });

  // Add new incident if generated
  const allIncidents = newIncident 
    ? [...updatedIncidents, newIncident]
    : updatedIncidents;

  // Keep only last 50 incidents
  const trimmedIncidents = allIncidents.slice(-50);

  // Update vendor ratings based on incidents
  const updatedVendors = updateVendorRatings(state.vendors, trimmedIncidents);

  return {
    time: newTime,
    vendors: updatedVendors,
    incidents: trimmedIncidents,
  };
}
