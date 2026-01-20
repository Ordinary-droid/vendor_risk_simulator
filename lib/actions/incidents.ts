"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Incident = {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  reported_at: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type IncidentWithVendor = Incident & {
  vendors: {
    id: string;
    name: string;
    category: string;
  };
};

export async function getIncidents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incidents")
    .select(
      `
      *,
      vendors (
        id,
        name,
        category
      )
    `
    )
    .order("reported_at", { ascending: false });

  if (error) {
    console.error("Error fetching incidents:", error);
    return { data: null, error: error.message };
  }

  return { data: data as IncidentWithVendor[], error: null };
}

export async function getIncident(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incidents")
    .select(
      `
      *,
      vendors (
        id,
        name,
        category
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching incident:", error);
    return { data: null, error: error.message };
  }

  return { data: data as IncidentWithVendor, error: null };
}

export async function createIncident(formData: FormData) {
  const supabase = await createClient();

  const incidentData = {
    vendor_id: formData.get("vendor_id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    severity: (formData.get("severity") as string) || "medium",
    status: (formData.get("status") as string) || "open",
    reported_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("incidents")
    .insert(incidentData)
    .select(
      `
      *,
      vendors (
        id,
        name,
        category
      )
    `
    )
    .single();

  if (error) {
    console.error("Error creating incident:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as IncidentWithVendor, error: null };
}

export async function updateIncident(id: string, formData: FormData) {
  const supabase = await createClient();

  const incidentData: Record<string, unknown> = {};

  const title = formData.get("title");
  if (title) incidentData.title = title;

  const description = formData.get("description");
  if (description) incidentData.description = description;

  const severity = formData.get("severity");
  if (severity) incidentData.severity = severity;

  const status = formData.get("status");
  if (status) {
    incidentData.status = status;
    if (status === "resolved" || status === "closed") {
      incidentData.resolved_at = new Date().toISOString();
    }
  }

  incidentData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("incidents")
    .update(incidentData)
    .eq("id", id)
    .select(
      `
      *,
      vendors (
        id,
        name,
        category
      )
    `
    )
    .single();

  if (error) {
    console.error("Error updating incident:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as IncidentWithVendor, error: null };
}

export async function resolveIncident(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incidents")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error resolving incident:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as Incident, error: null };
}

export async function deleteIncident(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("incidents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting incident:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
