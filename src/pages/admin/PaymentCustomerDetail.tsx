import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, CalendarIcon, ExternalLink, Trash2, Pencil, Check, X } from "lucide-react";

type Customer = { id: string; name: string; slug: string; goal_amount: number; tracking_number: string };
type Payment = { id: string; amount: number; reason: string; paid_at: string };

const PaymentCustomerDetail = () => {
  const { id = "" } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingDraft, setTrackingDraft] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), "HH:mm"));
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<Date>(new Date());
  const [editTime, setEditTime] = useState<string>("00:00");
  const [editAmount, setEditAmount] = useState("");
  const [editReason, setEditReason] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: c, error: ce }, { data: ps, error: pe }] = await Promise.all([
      (supabase as any).from("customers").select("*").eq("id", id).single(),
      (supabase as any).from("payments").select("*").eq("customer_id", id).order("paid_at", { ascending: false }),
    ]);
    if (ce) toast.error(ce.message);
    if (pe) toast.error(pe.message);
    setCustomer(c as Customer | null);
    if (c) setTrackingDraft((c as Customer).tracking_number ?? "");
    setPayments((ps ?? []) as Payment[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const addPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const [hh, mm] = time.split(":").map(Number);
    const paidAt = new Date(date);
    paidAt.setHours(hh || 0, mm || 0, 0, 0);
    const { error } = await (supabase as any).from("payments").insert({
      customer_id: id,
      amount: Number(amount),
      reason,
      paid_at: paidAt.toISOString(),
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Payment recorded");
    setAmount(""); setReason(""); setDate(new Date()); setTime(format(new Date(), "HH:mm"));
    load();
  };

  const removePayment = async (pid: string) => {
    if (!confirm("Delete this payment?")) return;
    const { error } = await (supabase as any).from("payments").delete().eq("id", pid);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const startEdit = (p: Payment) => {
    const d = new Date(p.paid_at);
    setEditingId(p.id);
    setEditDate(d);
    setEditTime(format(d, "HH:mm"));
    setEditAmount(String(p.amount));
    setEditReason(p.reason);
  };

  const saveEdit = async (pid: string) => {
    const [hh, mm] = editTime.split(":").map(Number);
    const paidAt = new Date(editDate);
    paidAt.setHours(hh || 0, mm || 0, 0, 0);
    const { error } = await (supabase as any).from("payments").update({
      amount: Number(editAmount),
      reason: editReason,
      paid_at: paidAt.toISOString(),
    }).eq("id", pid);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setEditingId(null);
    load();
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (!customer) return <div>Not found.</div>;

  const saveTracking = async () => {
    const val = trackingDraft.trim().toUpperCase();
    if (!val) return toast.error("Tracking number required");
    setSavingTracking(true);
    const { error } = await (supabase as any).from("customers").update({ tracking_number: val }).eq("id", customer.id);
    setSavingTracking(false);
    if (error) return toast.error(error.message);
    toast.success("Tracking number updated");
    load();
  };

  const paid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const remaining = Math.max(0, Number(customer.goal_amount) - paid);
  const pct = Math.min(100, (paid / Number(customer.goal_amount)) * 100);

  return (
    <div className="space-y-6">
      <Link to="/admin/payments" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to customers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{customer.name}</h1>
          <p className="text-sm text-muted-foreground">Customer ledger · <span className="font-mono">{customer.tracking_number}</span></p>
        </div>
        <Link to={`/statement/${customer.slug}`} target="_blank">
          <Button variant="outline" size="sm">View public statement <ExternalLink className="w-3 h-3 ml-2" /></Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Tracking number</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-md">
            <Input value={trackingDraft} onChange={(e) => setTrackingDraft(e.target.value)} className="font-mono" />
            <Button onClick={saveTracking} disabled={savingTracking || trackingDraft === customer.tracking_number}>{savingTracking ? "Saving…" : "Save"}</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Auto-generated on creation. Edit to use your own reference.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Paid</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold tabular-nums">${paid.toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Goal</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold tabular-nums">${Number(customer.goal_amount).toFixed(2)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Remaining</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold tabular-nums text-primary">${remaining.toFixed(2)}</div><div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Add new payment</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addPayment} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className={cn("w-full justify-start font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {date ? format(date, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" required value={time} onChange={(e) => setTime(e.target.value)} /></div>
            <div className="space-y-2"><Label>Amount ($)</Label><Input type="number" step="0.01" min="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div className="space-y-2 md:col-span-4"><Label>Reason</Label><Textarea rows={1} required value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Delivery payment" /></div>
            <div className="md:col-span-4"><Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Add Payment"}</Button></div>
          </form>
        </CardContent>
      </Card>

      <div className="rounded-md border border-border bg-card">
        <div className="px-4 py-3 border-b border-border"><h2 className="text-sm font-medium">Transaction history</h2></div>
        {payments.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No payments yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => {
                const d = new Date(p.paid_at);
                if (editingId === p.id) {
                  return (
                    <TableRow key={p.id} className="bg-muted/40">
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button type="button" variant="outline" size="sm" className="font-normal">
                              <CalendarIcon className="w-3 h-3 mr-2" />{format(editDate, "PP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={editDate} onSelect={(d) => d && setEditDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell><Input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="h-8 w-28" /></TableCell>
                      <TableCell><Input value={editReason} onChange={(e) => setEditReason(e.target.value)} className="h-8" /></TableCell>
                      <TableCell className="text-right"><Input type="number" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="h-8 w-24 ml-auto text-right" /></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => saveEdit(p.id)}><Check className="w-4 h-4 text-primary" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X className="w-4 h-4 text-muted-foreground" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={p.id}>
                    <TableCell>{format(d, "PP")}</TableCell>
                    <TableCell className="text-muted-foreground">{format(d, "p")}</TableCell>
                    <TableCell>{p.reason}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">${Number(p.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removePayment(p.id)}>
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
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

export default PaymentCustomerDetail;
