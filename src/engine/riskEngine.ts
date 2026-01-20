import type { Vendor } from "./types";

export function calculateResidualRisk(vendor: Vendor): number {
  const complianceFactor =
    (vendor.compliance.NIST ? 0.9 : 1) *
    (vendor.compliance.ISO27001 ? 0.9 : 1);

  const tierFactor = vendor.tier === 1 ? 1.3 : vendor.tier === 2 ? 1.1 : 0.9;
  const incidentFactor = 1 + vendor.incidents * 0.05;

  const residual =
    vendor.inherentRisk * tierFactor * incidentFactor * complianceFactor;

  return Math.min(100, Math.round(residual));
}