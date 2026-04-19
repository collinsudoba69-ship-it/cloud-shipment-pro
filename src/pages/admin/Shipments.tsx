import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import { ShipmentStatus, statusColorClass, statusLabel } from "@/lib/shipment";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ShipmentInvoiceDialog from "@/components/admin/ShipmentInvoiceDialog";
import BackButton from "@/components/BackButton";

interface Row {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  created_at: string;
}

const Shipments = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("shipments")
      .select("id, tracking_number, sender_name, receiver_name, origin, destination, status, created_at")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      r.tracking_number.toLowerCase().includes(s) ||
      r.receiver_name.toLowerCase().includes(s) ||
      r.sender_name.toLowerCase().includes(s) ||
      r.destination.toLowerCase().includes(s) ||
      r.origin.toLowerCase().includes(s)
    );
  });

  const handleDelete = async (id: string, tracking: string) => {
    const { error } = await supabase.from("shipments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (user) {
      await supabase.from("activity_logs").insert({
        actor_id: user.id, actor_email: user.email, action: "delete_shipment",
        entity_type: "shipment", entity_id: id, details: { tracking_number: tracking },
      });
    }
    toast.success("Shipment deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <BackButton />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Shipments</h1>
          <p className="text-muted-foreground">Manage every shipment in the system.</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/admin/shipments/new"><Plus className="h-4 w-4" />New shipment</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tracking #, name, city…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No shipments found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Tracking #</th>
                    <th className="px-4 py-3">Receiver</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        <Link to={`/admin/shipments/${r.id}`} className="hover:text-primary">{r.tracking_number}</Link>
                      </td>
                      <td className="px-4 py-3">{r.receiver_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.origin} → {r.destination}</td>
                      <td className="px-4 py-3"><Badge className={statusColorClass(r.status) + " border-0"}>{statusLabel(r.status)}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <ShipmentInvoiceDialog
                            shipment={{
                              trackingNumber: r.tracking_number,
                              shipmentName: `${r.receiver_name} Delivery`,
                              senderName: r.sender_name,
                              receiverName: r.receiver_name,
                              origin: r.origin,
                              destination: r.destination,
                              shipmentType: statusLabel(r.status),
                              quantity: 1,
                              registeredAt: r.created_at,
                            }}
                            triggerLabel="Invoice"
                            className="hidden sm:inline-flex"
                          />
                          <Button asChild size="icon" variant="ghost"><Link to={`/admin/shipments/${r.id}`}><Pencil className="h-4 w-4" /></Link></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete shipment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This permanently removes shipment <strong>{r.tracking_number}</strong> and its timeline.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(r.id, r.tracking_number)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Shipments;
