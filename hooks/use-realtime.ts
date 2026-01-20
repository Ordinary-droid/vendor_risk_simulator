"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Vendor } from "@/lib/actions/vendors";
import type { IncidentWithVendor } from "@/lib/actions/incidents";

export function useRealtimeVendors(initialVendors: Vendor[]) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const supabase = createClient();

  useEffect(() => {
    setVendors(initialVendors);
  }, [initialVendors]);

  useEffect(() => {
    const channel = supabase
      .channel("vendors-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "vendors",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setVendors((prev) => [payload.new as Vendor, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setVendors((prev) =>
              prev.map((v) =>
                v.id === payload.new.id ? (payload.new as Vendor) : v
              )
            );
          } else if (payload.eventType === "DELETE") {
            setVendors((prev) =>
              prev.filter((v) => v.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return vendors;
}

export function useRealtimeIncidents(initialIncidents: IncidentWithVendor[]) {
  const [incidents, setIncidents] = useState<IncidentWithVendor[]>(initialIncidents);
  const supabase = createClient();

  useEffect(() => {
    setIncidents(initialIncidents);
  }, [initialIncidents]);

  const fetchIncidentWithVendor = useCallback(async (incidentId: string) => {
    const { data } = await supabase
      .from("incidents")
      .select(`*, vendors (id, name, category)`)
      .eq("id", incidentId)
      .single();
    return data as IncidentWithVendor | null;
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
      .channel("incidents-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newIncident = await fetchIncidentWithVendor(payload.new.id);
            if (newIncident) {
              setIncidents((prev) => [newIncident, ...prev]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedIncident = await fetchIncidentWithVendor(payload.new.id);
            if (updatedIncident) {
              setIncidents((prev) =>
                prev.map((i) =>
                  i.id === payload.new.id ? updatedIncident : i
                )
              );
            }
          } else if (payload.eventType === "DELETE") {
            setIncidents((prev) =>
              prev.filter((i) => i.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchIncidentWithVendor]);

  return incidents;
}
