"use client";

import React from "react"

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle2,
  XCircle,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Cloud,
  CreditCard,
  Server,
  Mail,
  Shield,
  Database,
  Clock,
  ChevronRight,
} from "lucide-react";
import type { Vendor } from "@/lib/actions/vendors";
import { createVendor, updateVendor, deleteVendor } from "@/lib/actions/vendors";
import { cn } from "@/lib/utils";

interface VendorTableProps {
  vendors: Vendor[];
}

const categoryIcons: Record<string, React.ElementType> = {
  "Cloud Services": Cloud,
  Payments: CreditCard,
  Infrastructure: Server,
  Communications: Mail,
  Security: Shield,
  Analytics: Database,
};

export default function VendorTable({ vendors }: VendorTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-success/20 text-success border-success/30",
      inactive: "bg-muted text-muted-foreground border-muted",
      under_review: "bg-warning/20 text-warning border-warning/30",
    };
    const labels: Record<string, string> = {
      active: "Active",
      inactive: "Inactive",
      under_review: "Under Review",
    };
    return (
      <Badge variant="outline" className={cn("font-medium", styles[status])}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getSecurityRatingColor = (rating: number) => {
    if (rating >= 80) return "bg-success";
    if (rating >= 60) return "bg-warning";
    if (rating >= 40) return "bg-chart-4";
    return "bg-destructive";
  };

  const ComplianceBadge = ({ passed, label }: { passed: boolean; label: string }) => (
    <div className="flex items-center gap-1">
      {passed ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={cn("text-xs", passed ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );

  async function handleAddVendor(formData: FormData) {
    setIsLoading(true);
    await createVendor(formData);
    setIsLoading(false);
    setIsAddDialogOpen(false);
  }

  async function handleUpdateVendor(formData: FormData) {
    if (!editingVendor) return;
    setIsLoading(true);
    await updateVendor(editingVendor.id, formData);
    setIsLoading(false);
    setIsEditDialogOpen(false);
    setEditingVendor(null);
  }

  async function handleDeleteVendor(id: string) {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    await deleteVendor(id);
  }

  const VendorForm = ({
    vendor,
    onSubmit,
    submitLabel,
  }: {
    vendor?: Vendor | null;
    onSubmit: (formData: FormData) => void;
    submitLabel: string;
  }) => (
    <form action={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Vendor Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={vendor?.name || ""}
            placeholder="Acme Corp"
            required
            className="bg-input border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={vendor?.category || "Cloud Services"}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cloud Services">Cloud Services</SelectItem>
              <SelectItem value="Payments">Payments</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Communications">Communications</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={vendor?.status || "active"}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="security_rating">Security Rating (0-100)</Label>
          <Input
            id="security_rating"
            name="security_rating"
            type="number"
            min="0"
            max="100"
            defaultValue={vendor?.security_rating || 70}
            className="bg-input border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Compliance Certifications</Label>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="compliance_nist"
              name="compliance_nist"
              value="true"
              defaultChecked={vendor?.compliance_nist}
            />
            <Label htmlFor="compliance_nist" className="text-sm font-normal">
              NIST
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="compliance_iso27001"
              name="compliance_iso27001"
              value="true"
              defaultChecked={vendor?.compliance_iso27001}
            />
            <Label htmlFor="compliance_iso27001" className="text-sm font-normal">
              ISO 27001
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="compliance_soc2"
              name="compliance_soc2"
              value="true"
              defaultChecked={vendor?.compliance_soc2}
            />
            <Label htmlFor="compliance_soc2" className="text-sm font-normal">
              SOC 2
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="compliance_gdpr"
              name="compliance_gdpr"
              value="true"
              defaultChecked={vendor?.compliance_gdpr}
            />
            <Label htmlFor="compliance_gdpr" className="text-sm font-normal">
              GDPR
            </Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Vendors</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>Add a new third-party vendor to monitor.</DialogDescription>
            </DialogHeader>
            <VendorForm onSubmit={handleAddVendor} submitLabel="Add Vendor" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Vendor</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Security Score</TableHead>
              <TableHead className="text-muted-foreground font-medium">Compliance</TableHead>
              <TableHead className="text-muted-foreground font-medium">Last Assessment</TableHead>
              <TableHead className="text-muted-foreground font-medium w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No vendors found. Add your first vendor to get started.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => {
                const Icon = categoryIcons[vendor.category] || Database;
                return (
                  <TableRow
                    key={vendor.id}
                    className="border-border hover:bg-secondary/50 transition-colors cursor-pointer group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{vendor.name}</div>
                          <div className="text-xs text-muted-foreground">{vendor.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <Progress
                          value={vendor.security_rating}
                          className={cn(
                            "h-2 w-16 bg-secondary",
                            `[&>[data-slot=progress-indicator]]:${getSecurityRatingColor(vendor.security_rating)}`
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-mono font-medium",
                            vendor.security_rating >= 80
                              ? "text-success"
                              : vendor.security_rating >= 60
                                ? "text-warning"
                                : vendor.security_rating >= 40
                                  ? "text-chart-4"
                                  : "text-destructive"
                          )}
                        >
                          {vendor.security_rating}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <ComplianceBadge passed={vendor.compliance_nist} label="NIST" />
                        <ComplianceBadge passed={vendor.compliance_iso27001} label="ISO" />
                        <ComplianceBadge passed={vendor.compliance_soc2} label="SOC2" />
                        <ComplianceBadge passed={vendor.compliance_gdpr} label="GDPR" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-sm">
                          {vendor.last_assessment ? formatDate(vendor.last_assessment) : "Never"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingVendor(vendor);
                              setIsEditDialogOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteVendor(vendor.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>Update vendor information and compliance status.</DialogDescription>
          </DialogHeader>
          <VendorForm
            vendor={editingVendor}
            onSubmit={handleUpdateVendor}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
