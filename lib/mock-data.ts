import type { Vendor } from "@/lib/types/vendor";


const now = new Date().toISOString();

export const mockVendors: Vendor[] = [
  {
    id: "sim-1",
    name: "Simulated Cloud Provider",
    status: "active",

    access_level: "high",
    connection_type: "api",

    security_rating: 78,
    incidents_count: 1,

    compliance_nist: true,
    compliance_iso27001: true,

    last_audit: now,
    created_at: now,
    updated_at: now,
  },
  {
    id: "sim-2",
    name: "Simulated Payments Vendor",
    status: "active",

    access_level: "medium",
    connection_type: "vpn",

    security_rating: 62,
    incidents_count: 0,

    compliance_nist: false,
    compliance_iso27001: true,

    last_audit: now,
    created_at: now,
    updated_at: now,
  },
];
