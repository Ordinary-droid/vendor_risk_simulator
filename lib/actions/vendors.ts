"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function getVendors() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vendors:", error);
    return { data: null, error: error.message };
  }

  return { data: data as Vendor[], error: null };
}

export async function getVendor(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching vendor:", error);
    return { data: null, error: error.message };
  }

  return { data: data as Vendor, error: null };
}

export async function createVendor(formData: FormData) {
  const supabase = await createClient();

  const vendorData = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    status: (formData.get("status") as string) || "active",
    security_rating: parseInt(formData.get("security_rating") as string) || 70,
    compliance_nist: formData.get("compliance_nist") === "true",
    compliance_iso27001: formData.get("compliance_iso27001") === "true",
    compliance_soc2: formData.get("compliance_soc2") === "true",
    compliance_gdpr: formData.get("compliance_gdpr") === "true",
  };

  const { data, error } = await supabase
    .from("vendors")
    .insert(vendorData)
    .select()
    .single();

  if (error) {
    console.error("Error creating vendor:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as Vendor, error: null };
}

export async function updateVendor(id: string, formData: FormData) {
  const supabase = await createClient();

  const vendorData: Record<string, unknown> = {};

  const name = formData.get("name");
  if (name) vendorData.name = name;

  const category = formData.get("category");
  if (category) vendorData.category = category;

  const status = formData.get("status");
  if (status) vendorData.status = status;

  const security_rating = formData.get("security_rating");
  if (security_rating) vendorData.security_rating = parseInt(security_rating as string);

  const compliance_nist = formData.get("compliance_nist");
  if (compliance_nist !== null) vendorData.compliance_nist = compliance_nist === "true";

  const compliance_iso27001 = formData.get("compliance_iso27001");
  if (compliance_iso27001 !== null) vendorData.compliance_iso27001 = compliance_iso27001 === "true";

  const compliance_soc2 = formData.get("compliance_soc2");
  if (compliance_soc2 !== null) vendorData.compliance_soc2 = compliance_soc2 === "true";

  const compliance_gdpr = formData.get("compliance_gdpr");
  if (compliance_gdpr !== null) vendorData.compliance_gdpr = compliance_gdpr === "true";

  vendorData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("vendors")
    .update(vendorData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating vendor:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/dashboard");
  return { data: data as Vendor, error: null };
}

export async function deleteVendor(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("vendors").delete().eq("id", id);

  if (error) {
    console.error("Error deleting vendor:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
