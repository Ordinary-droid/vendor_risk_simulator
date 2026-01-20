import type { Incident, Severity, Vendor } from './types';

const INCIDENT_CATALOG = [
  { category: 'API Abuse', severity: 'high' },
  { category: 'Credential Compromise', severity: 'critical' },
  { category: 'Data Exfiltration', severity: 'critical' },
  { category: 'Malware Injection', severity: 'high' },
  { category: 'Privilege Escalation', severity: 'high' },
  { category: 'DDoS Attack', severity: 'medium' }
] as const;

export function maybeGenerateIncident(
  vendors: Vendor[],
  probability = 0.15
): Incident | null {
  if (Math.random() > probability) return null;

  const vendor = vendors[Math.floor(Math.random() * vendors.length)];
  const template = INCIDENT_CATALOG[Math.floor(Math.random() * INCIDENT_CATALOG.length)];

  return {
    id: Date.now(),
    vendorId: vendor.id,
    category: template.category,
    severity: template.severity as Severity,
    detectedAt: Date.now()
  };
}

export function applyIncidentToVendor(vendor: Vendor, severity: Severity): Vendor {
  const ratingDrop = severity === 'critical' ? 5 : severity === 'high' ? 3 : 1;

  return {
    ...vendor,
    incidents: vendor.incidents + 1,
    securityRating: Math.max(40, vendor.securityRating - ratingDrop),
    status: 'incident'
  };
}