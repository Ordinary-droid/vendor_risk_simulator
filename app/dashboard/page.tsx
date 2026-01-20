import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVendors } from "@/lib/actions/vendors";
import { getIncidents } from "@/lib/actions/incidents";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [vendorsResult, incidentsResult] = await Promise.all([getVendors(), getIncidents()]);

  const vendors = vendorsResult.data || [];
  const incidents = incidentsResult.data || [];

  return <DashboardClient initialVendors={vendors} initialIncidents={incidents} user={user} />;
}
