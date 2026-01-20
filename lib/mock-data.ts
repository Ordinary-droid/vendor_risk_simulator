import type { Vendor } from "@/lib/types/vendor";

const now = new Date().toISOString();

export const mockVendors: Vendor[] = [
  {
    id: "sim-1",
    name: "Simulated Cloud Provider",
    category: "Cloud Services",
    status: "active",

    security_rating: 78,

    compliance_nist: true,
    compliance_iso27001: true,
    compliance_soc2: true,
    compliance_gdpr: true,

    last_assessment: now,
    created_at: now,
    updated_at: now,
  },
  {
    id: "sim-2",
    name: "Simulated Payments Vendor",
    category: "Payments",
    status: "under_review",

    security_rating: 62,

    compliance_nist: false,
    compliance_iso27001: true,
    compliance_soc2: false,
    compliance_gdpr: true,

    last_assessment: now,
    created_at: now,
    updated_at: now,
  },
];
