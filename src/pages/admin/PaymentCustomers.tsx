import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, ExternalLink, Users as UsersIcon, Trash2, ArrowLeft } from "lucide-react";

type Customer = { id: string; name: string; slug: string; goal_amount: number; tracking_number: string; created_at: string };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `cust-${Date.now()}`;
}

const PaymentCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("100");
  const [tracking, setTracking] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: cs, error } = await (supabase as any).from("customers").select("*").order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }
    setCustomers((cs ?? []) as Customer[]);
    const { data: ps } = await (supabase as any).from("payments").select("customer_id, amount");
    const map: Record<string, number> = {};
    (ps ?? []).forEach((p: any) => { map[p.customer_id] = (map[p.customer_id] ?? 0) + Number(p.amount); });
    setStats(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = slugify(name);
    const payload: any = { name, slug, goal_amount: Number(goal) };
    if (tracking.trim()) payload.tracking_number = tracking.trim().toUpperCase();
    const { data, error } = await (supabase as any).from("customers").insert(payload).select().single();
    if (error) return toast.error(error.message);
    toast.success("Customer created");
    setOpen(false); setName(""); setGoal("100"); setTracking("");
    navigate(`/admin/payments/${data.id}`);
  };

  const deleteCustomer = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    // Delete related payments first to avoid FK constraint errors
    await (supabase as any).from("payments").delete().eq("customer_id", deleteTarget.id);
    const { error } = await (supabase as any).from("customers").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="space-y-6">
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget?.name}</strong> and all their payment records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCustomer}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"><ArrowLeft className="w-4 h-4" />Back</button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payment Tracker</h1>
          <p className="text-sm text-muted-foreground">Customer ledgers and goal progress</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New customer</DialogTitle></DialogHeader>
            <form onSubmit={create} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-2"><Label>Goal amount ($)</Label><Input required type="number" step="0.01" min="0" value={goal} onChange={(e) => setGoal(e.target.value)} /></div>
              <div className="space-y-2"><Label>Tracking number <span className="text-muted-foreground font-normal">(optional — auto if blank)</span></Label><Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. CS-ABC12345" /></div>
              <DialogFooter><Button type="submit">Create</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-border bg-card">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-sm">Loading…</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <UsersIcon className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No customers yet. Create your first one above.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tracking #</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Goal</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => {
                const paid = stats[c.id] ?? 0;
                const remaining = Math.max(0, Number(c.goal_amount) - paid);
                return (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => navigate(`/admin/payments/${c.id}`)}>
                    <TableCell>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">/{c.slug}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.tracking_number}</TableCell>
                    <TableCell className="text-right tabular-nums">${paid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right tabular-nums">${Number(c.goal_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">${remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <Link to={`/statement/${c.slug}`} target="_blank" className="inline-flex items-center text-xs text-primary hover:underline">
                          Statement <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PaymentCustomers;
