"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  ShieldAlert,
  FileWarning,
  Activity,
  Settings,
  CheckCircle2,
  Plus,
  MoreHorizontal,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import type { IncidentWithVendor } from "@/lib/actions/incidents";
import type { Vendor } from "@/lib/actions/vendors";
import { createIncident, resolveIncident, deleteIncident } from "@/lib/actions/incidents";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface IncidentTimelineProps {
  incidents: IncidentWithVendor[];
  vendors: Vendor[];
  maxItems?: number;
}

export default function IncidentTimeline({
  incidents,
  vendors,
  maxItems = 20,
}: IncidentTimelineProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getSeverityStyles = (severity: string) => {
    const styles: Record<string, { badge: string; dot: string; line: string }> = {
      critical: {
        badge: "bg-destructive/20 text-destructive border-destructive/30",
        dot: "bg-destructive",
        line: "bg-destructive/30",
      },
      high: {
        badge: "bg-chart-4/20 text-chart-4 border-chart-4/30",
        dot: "bg-chart-4",
        line: "bg-chart-4/30",
      },
      medium: {
        badge: "bg-warning/20 text-warning border-warning/30",
        dot: "bg-warning",
        line: "bg-warning/30",
      },
      low: {
        badge: "bg-muted text-muted-foreground border-muted",
        dot: "bg-muted-foreground",
        line: "bg-muted",
      },
    };
    return styles[severity] || styles.low;
  };

  async function handleAddIncident(formData: FormData) {
    setIsLoading(true);
    await createIncident(formData);
    setIsLoading(false);
    setIsAddDialogOpen(false);
  }

  async function handleResolveIncident(id: string) {
    await resolveIncident(id);
  }

  async function handleDeleteIncident(id: string) {
    if (!confirm("Are you sure you want to delete this incident?")) return;
    await deleteIncident(id);
  }

  const displayedIncidents = incidents.slice(0, maxItems);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Incidents</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
              <DialogDescription>
                Log a security incident for tracking and resolution.
              </DialogDescription>
            </DialogHeader>
            <form action={handleAddIncident} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vendor_id">Affected Vendor</Label>
                <Select name="vendor_id" required>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief description of the incident"
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of what happened..."
                  rows={3}
                  className="bg-input border-border resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select name="severity" defaultValue="medium">
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="open">
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Report Incident
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden p-4">
        {displayedIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-3 text-success" />
            <p className="text-sm font-medium">No incidents to display</p>
            <p className="text-xs">All systems operating normally</p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayedIncidents.map((incident, index) => {
              const styles = getSeverityStyles(incident.severity);
              const isLast = index === displayedIncidents.length - 1;
              const isResolved = incident.status === "resolved" || incident.status === "closed";

              return (
                <div key={incident.id} className="relative flex gap-4 pb-4">
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute left-[11px] top-6 w-0.5 h-[calc(100%-8px)]",
                        styles.line
                      )}
                    />
                  )}

                  <div className="relative flex-shrink-0">
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center",
                        isResolved ? "bg-muted" : `${styles.dot}/20`
                      )}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <div className={cn("h-2 w-2 rounded-full", styles.dot)} />
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex-1 min-w-0 rounded-lg border p-3 transition-colors",
                      isResolved
                        ? "bg-muted/30 border-muted"
                        : "bg-card border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <AlertTriangle
                          className={cn(
                            "h-4 w-4",
                            isResolved ? "text-muted-foreground" : styles.badge.split(" ")[1]
                          )}
                        />
                        <h4
                          className={cn(
                            "font-medium truncate",
                            isResolved && "text-muted-foreground line-through"
                          )}
                        >
                          {incident.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={cn("capitalize text-xs", styles.badge)}>
                          {incident.severity}
                        </Badge>
                        {isResolved && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-success/20 text-success border-success/30"
                          >
                            Resolved
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            {!isResolved && (
                              <DropdownMenuItem
                                onClick={() => handleResolveIncident(incident.id)}
                                className="cursor-pointer"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Mark Resolved
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteIncident(incident.id)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <p
                      className={cn(
                        "text-sm mb-2",
                        isResolved ? "text-muted-foreground" : "text-muted-foreground"
                      )}
                    >
                      {incident.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-medium">
                        {incident.vendors?.name || "Unknown Vendor"}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(incident.reported_at), { addSuffix: true })}
                      </span>
                      {incident.resolved_at && (
                        <span className="text-success">
                          Resolved{" "}
                          {formatDistanceToNow(new Date(incident.resolved_at), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
