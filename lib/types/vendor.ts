export type Vendor = {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive" | "under_review";
  security_rating: number;
  compliance_nist: boolean;
  compliance_iso27001: boolean;
  compliance_soc2: boolean;
  compliance_gdpr: boolean;
  last_assessment: string;
  created_at: string;
  updated_at: string;
};
