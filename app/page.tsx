import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle, Activity, Database, Lock } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">Vendor Risk Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance">
              Monitor and manage third-party vendor risk in real-time
            </h1>
            <p className="mt-6 text-lg text-muted-foreground text-pretty">
              Track security ratings, compliance certifications, and incidents across all your
              vendors. Get instant alerts when risks emerge and maintain a strong security posture.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Monitoring
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="h-10 w-10 rounded-lg bg-info/20 flex items-center justify-center mb-4">
                <Database className="h-5 w-5 text-info" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Vendor Registry</h3>
              <p className="text-sm text-muted-foreground">
                Centralized database of all your third-party vendors with detailed security
                profiles.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="h-10 w-10 rounded-lg bg-success/20 flex items-center justify-center mb-4">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Compliance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor NIST, ISO 27001, SOC 2, and GDPR compliance across your vendor ecosystem.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center mb-4">
                <Activity className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Incident Management</h3>
              <p className="text-sm text-muted-foreground">
                Track and resolve security incidents with severity levels and status updates.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Updates</h3>
              <p className="text-sm text-muted-foreground">
                Live synchronization keeps your team informed of changes as they happen.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Vendor Risk Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure your supply chain with confidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
