import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusColorClass, statusLabel, ShipmentStatus } from "@/lib/shipment";
import { format } from "date-fns";
import BackButton from "@/components/BackButton";

interface RecentShipment {
  id: string;
  tracking_number: string;
  receiver_name: string;
  destination: string;
  status: ShipmentStatus;
  created_at: string;
}

const Overview = () => {
  const [counts, setCounts] = useState({ total: 0, in_transit: 0, delivered: 0, queued: 0 });
  const [recent, setRecent] = useState<RecentShipment[]>([]);

  useEffect(() => {
    const load = async () => {
      const [{ count: total }, { count: inTransit }, { count: delivered }, { count: queued }, { data: r }] = await Promise.all([
        supabase.from("shipments").select("*", { count: "exact", head: true }),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "in_transit"),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "delivered"),
        supabase.from("shipments").select("*", { count: "exact", head: true }).eq("status", "queued"),
        supabase.from("shipments").select("id, tracking_number, receiver_name, destination, status, created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      setCounts({ total: total ?? 0, in_transit: inTransit ?? 0, delivered: delivered ?? 0, queued: queued ?? 0 });
      setRecent((r ?? []) as RecentShipment[]);
    };
    load();
  }, []);

  const stats = [
    { label: "Total shipments", value: counts.total, icon: Package, color: "text-primary" },
    { label: "Queued", value: counts.queued, icon: Clock, color: "text-muted-foreground" },
    { label: "In transit", value: counts.in_transit, icon: Truck, color: "text-info" },
    { label: "Delivered", value: counts.delivered, icon: CheckCircle2, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold">Dashboard overview</h1>
        <p className="text-muted-foreground">Live snapshot of every shipment in the network.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-3xl font-bold">{s.value}</p>
              </div>
              <s.icon className={`h-8 w-8 ${s.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent shipments</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/shipments" className="gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No shipments yet. Create your first one.</p>
          ) : (
            <div className="divide-y divide-border">
              {recent.map((s) => (
                <Link key={s.id} to={`/admin/shipments/${s.id}`} className="flex items-center justify-between py-3 transition-colors hover:bg-muted/40">
                  <div>
                    <p className="font-medium">{s.tracking_number}</p>
                    <p className="text-sm text-muted-foreground">{s.receiver_name} · {s.destination}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColorClass(s.status) + " border-0"}>{statusLabel(s.status)}</Badge>
                    <span className="hidden text-xs text-muted-foreground sm:inline">{format(new Date(s.created_at), "MMM d")}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
