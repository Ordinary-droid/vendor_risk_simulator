"use client";
import Link from "next/link";
import { Play } from "lucide-react";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Activity,
  Database,
  CheckCircle,
  AlertTriangle,
  Bell,
  User as UserIcon,
  LogOut,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import VendorTable from "@/components/VendorTable";
import IncidentTimeline from "@/components/IncidentTimeline";
import { useRealtimeVendors, useRealtimeIncidents } from "@/hooks/use-realtime";
import type { Vendor } from "@/lib/types/vendor";
import type { IncidentWithVendor } from "@/lib/actions/incidents";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface DashboardClientProps {
  initialVendors: Vendor[];
  initialIncidents: IncidentWithVendor[];
  user: User;
}

export default function DashboardClient({
  initialVendors,
  initialIncidents,
  user,
}: DashboardClientProps) {
  const vendors = useRealtimeVendors(initialVendors);
  const incidents = useRealtimeIncidents(initialIncidents);
  const [activeTab, setActiveTab] = useState("vendors");

  // Calculate stats
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "active").length;
  const unresolvedIncidents = incidents.filter(
    (i) => i.status === "open" || i.status === "investigating"
  ).length;
  const complianceRate =
    totalVendors > 0
      ? Math.round(
          (vendors.filter((v) => v.compliance_nist && v.compliance_iso27001).length /
            totalVendors) *
            100
        )
      : 0;

  const avgSecurityScore =
    totalVendors > 0
      ? Math.round(vendors.reduce((sum, v) => sum + v.security_rating, 0) / totalVendors)
      : 0;

  const riskScore = 100 - avgSecurityScore;

  const getRiskLevel = (score: number) => {
    if (score < 25) return { label: "Low", color: "text-success" };
    if (score < 50) return { label: "Medium", color: "text-warning" };
    if (score < 75) return { label: "High", color: "text-chart-4" };
    return { label: "Critical", color: "text-destructive" };
  };

  const riskLevel = getRiskLevel(riskScore);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Vendor Risk Platform</h1>
                <p className="text-xs text-muted-foreground">Real-time security monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/simulation">
              <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-4 w-4" />
                  Simulation Mode
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-muted-foreground">Live</span>
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unresolvedIncidents > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {unresolvedIncidents}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Logged in</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOut}>
                      <button type="submit" className="flex w-full items-center cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className={cn("text-3xl font-bold mt-1", riskLevel.color)}>{riskScore}</p>
                <div className="flex items-center gap-1 mt-1">
                  {riskScore > 50 ? (
                    <TrendingUp className="h-3 w-3 text-destructive" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-success" />
                  )}
                  <span className="text-xs text-muted-foreground">{riskLevel.label} Risk</span>
                </div>
              </div>
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  riskScore >= 50 ? "bg-destructive/20" : "bg-success/20"
                )}
              >
                <AlertTriangle
                  className={cn("h-5 w-5", riskScore >= 50 ? "text-destructive" : "text-success")}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-3xl font-bold mt-1 text-foreground">{totalVendors}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-success">{activeVendors} healthy</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-info/20 flex items-center justify-center">
                <Database className="h-5 w-5 text-info" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Incidents</p>
                <p className="text-3xl font-bold mt-1 text-destructive">{unresolvedIncidents}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {incidents.length} total reported
                  </span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-3xl font-bold mt-1 text-success">{complianceRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-muted-foreground">NIST & ISO 27001</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="vendors" className="data-[state=active]:bg-card">
              Vendors
            </TabsTrigger>
            <TabsTrigger value="incidents" className="data-[state=active]:bg-card">
              Incidents
              {unresolvedIncidents > 0 && (
                <span className="ml-2 h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {unresolvedIncidents}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="mt-6">
            <VendorTable vendors={vendors} />
          </TabsContent>

          <TabsContent value="incidents" className="mt-6">
            <IncidentTimeline incidents={incidents} vendors={vendors} maxItems={20} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
