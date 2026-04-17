import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, X, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { generateTrackingNumber, progressForStatus, ShipmentStatus, SHIPMENT_STATUSES, statusLabel } from "@/lib/shipment";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const MAX_IMAGES = 5;
const MAX_SIZE_BYTES = 1024 * 1024;

interface FormState {
  tracking_number: string;
  courier: string;
  sender_name: string; sender_email: string; sender_phone: string;
  receiver_name: string; receiver_email: string; receiver_phone: string;
  origin: string; destination: string; shipment_type: string;
  quantity: number; weight: string;
  is_fragile: boolean; is_express: boolean;
  status: ShipmentStatus; progress: number;
  estimated_delivery_date: string; description: string;
  shipped_at: string;
  payment_status: "pending" | "paid"; amount_to_pay: string; payment_method: string; payment_reason: string;
  images: string[];
  send_email: boolean;
}

const toLocalInput = (iso?: string | null) => {
  const d = iso ? new Date(iso) : new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 16);
};

const empty: FormState = {
  tracking_number: "", courier: "Cloud Shipment Express",
  sender_name: "", sender_email: "", sender_phone: "",
  receiver_name: "", receiver_email: "", receiver_phone: "",
  origin: "", destination: "", shipment_type: "Parcel",
  quantity: 1, weight: "",
  is_fragile: false, is_express: false,
  status: "queued", progress: 10,
  estimated_delivery_date: "", description: "",
  shipped_at: toLocalInput(),
  payment_status: "pending", amount_to_pay: "", payment_method: "", payment_reason: "",
  images: [],
  send_email: false,
};

interface TimelineEvent {
  id: string;
  status: ShipmentStatus | null;
  location: string | null;
  note: string | null;
  event_at: string;
}

const ShipmentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [newEvent, setNewEvent] = useState({ status: "" as ShipmentStatus | "", location: "", note: "", event_at: toLocalInput() });

  useEffect(() => {
    if (!isEdit) {
      setForm({ ...empty, tracking_number: generateTrackingNumber() });
      return;
    }
    (async () => {
      const { data } = await supabase.from("shipments").select("*").eq("id", id!).maybeSingle();
      if (!data) { toast.error("Shipment not found"); navigate("/admin/shipments"); return; }
      setForm({
        tracking_number: data.tracking_number, courier: data.courier ?? "",
        sender_name: data.sender_name, sender_email: data.sender_email ?? "", sender_phone: data.sender_phone ?? "",
        receiver_name: data.receiver_name, receiver_email: data.receiver_email ?? "", receiver_phone: data.receiver_phone ?? "",
        origin: data.origin, destination: data.destination, shipment_type: data.shipment_type,
        quantity: data.quantity, weight: data.weight?.toString() ?? "",
        is_fragile: data.is_fragile, is_express: data.is_express,
        status: data.status, progress: data.progress,
        estimated_delivery_date: data.estimated_delivery_date ?? "", description: data.description ?? "",
        shipped_at: toLocalInput((data as { shipped_at?: string }).shipped_at ?? data.created_at),
        payment_status: data.payment_status, amount_to_pay: data.amount_to_pay?.toString() ?? "",
        payment_method: data.payment_method ?? "", payment_reason: data.payment_reason ?? "",
        images: data.images ?? [], send_email: false,
      });
      const { data: evs } = await supabase.from("shipment_events").select("*").eq("shipment_id", id!).order("event_at", { ascending: false });
      setEvents((evs ?? []) as TimelineEvent[]);
    })();
  }, [id, isEdit, navigate]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleStatusChange = (s: ShipmentStatus) => {
    setForm((p) => ({ ...p, status: s, progress: progressForStatus(s) }));
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    if (form.images.length + files.length > MAX_IMAGES) {
      return toast.error(`Maximum ${MAX_IMAGES} images allowed.`);
    }
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`${file.name} exceeds 1MB limit.`);
        continue;
      }
      const ext = file.name.split(".").pop();
      const path = `${form.tracking_number || "draft"}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("shipment-images").upload(path, file, { upsert: false });
      if (error) { toast.error(error.message); continue; }
      const { data: pub } = supabase.storage.from("shipment-images").getPublicUrl(path);
      uploaded.push(pub.publicUrl);
    }
    setForm((p) => ({ ...p, images: [...p.images, ...uploaded] }));
    setUploading(false);
  };

  const removeImage = (url: string) => setForm((p) => ({ ...p, images: p.images.filter((u) => u !== url) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tracking_number.trim()) return toast.error("Tracking number is required");
    if (!form.sender_name.trim() || !form.receiver_name.trim()) return toast.error("Sender and receiver names are required");
    if (!form.origin.trim() || !form.destination.trim()) return toast.error("Origin and destination are required");

    setLoading(true);
    const payload = {
      tracking_number: form.tracking_number.trim(),
      courier: form.courier || null,
      sender_name: form.sender_name, sender_email: form.sender_email || null, sender_phone: form.sender_phone || null,
      receiver_name: form.receiver_name, receiver_email: form.receiver_email || null, receiver_phone: form.receiver_phone || null,
      origin: form.origin, destination: form.destination, shipment_type: form.shipment_type,
      quantity: form.quantity, weight: form.weight ? Number(form.weight) : null,
      is_fragile: form.is_fragile, is_express: form.is_express,
      status: form.status, progress: form.progress,
      estimated_delivery_date: form.estimated_delivery_date || null,
      description: form.description || null,
      shipped_at: form.shipped_at ? new Date(form.shipped_at).toISOString() : new Date().toISOString(),
      payment_status: form.payment_status,
      amount_to_pay: form.amount_to_pay ? Number(form.amount_to_pay) : null,
      payment_method: form.payment_method || null, payment_reason: form.payment_reason || null,
      images: form.images,
      created_by: user?.id ?? null,
    };

    let shipmentId = id;
    if (isEdit) {
      const { error } = await supabase.from("shipments").update(payload).eq("id", id!);
      if (error) { setLoading(false); return toast.error(error.message); }
    } else {
      const { data, error } = await supabase.from("shipments").insert(payload).select("id").single();
      if (error) { setLoading(false); return toast.error(error.message); }
      shipmentId = data.id;
      // Initial timeline event uses the chosen registration date
      await supabase.from("shipment_events").insert({
        shipment_id: shipmentId, status: form.status, location: form.origin,
        note: "Shipment registered", created_by: user?.id ?? null,
        event_at: payload.shipped_at,
      });
    }

    // Activity log
    if (user) {
      await supabase.from("activity_logs").insert({
        actor_id: user.id, actor_email: user.email,
        action: isEdit ? "update_shipment" : "create_shipment",
        entity_type: "shipment", entity_id: shipmentId,
        details: { tracking_number: form.tracking_number },
      });
    }

    // Optional email notification
    if (form.send_email && form.receiver_email && shipmentId) {
      // Placeholder: a Lovable transactional email function can be wired in phase 2.
      toast.message("Email notification queued (configure in phase 2).");
    }

    setLoading(false);
    toast.success(isEdit ? "Shipment updated" : "Shipment created");
    navigate(`/admin/shipments/${shipmentId}`);
  };

  const handleAddEvent = async () => {
    if (!id) return;
    if (!newEvent.status) return toast.error("Pick a status");
    const { error } = await supabase.from("shipment_events").insert({
      shipment_id: id, status: newEvent.status, location: newEvent.location || null,
      note: newEvent.note || null, created_by: user?.id ?? null,
      event_at: newEvent.event_at ? new Date(newEvent.event_at).toISOString() : new Date().toISOString(),
    });
    if (error) return toast.error(error.message);
    // Sync shipment status to latest event
    await supabase.from("shipments").update({ status: newEvent.status, progress: progressForStatus(newEvent.status) }).eq("id", id);
    toast.success("Timeline event added");
    setNewEvent({ status: "", location: "", note: "", event_at: toLocalInput() });
    const { data: evs } = await supabase.from("shipment_events").select("*").eq("shipment_id", id).order("event_at", { ascending: false });
    setEvents((evs ?? []) as TimelineEvent[]);
    setForm((p) => ({ ...p, status: newEvent.status as ShipmentStatus, progress: progressForStatus(newEvent.status as ShipmentStatus) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/shipments")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? "Edit shipment" : "Create shipment"}</h1>
          <p className="text-muted-foreground">{isEdit ? form.tracking_number : "Fill in the package and party details."}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Tracking</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Tracking number *</Label>
                <div className="flex gap-2">
                  <Input value={form.tracking_number} onChange={(e) => set("tracking_number", e.target.value)} required />
                  {!isEdit && (
                    <Button type="button" variant="outline" onClick={() => set("tracking_number", generateTrackingNumber())}>Regenerate</Button>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Format: CS-YYYY-MM-XXXXXX</p>
              </div>
              <div>
                <Label>Courier</Label>
                <Input value={form.courier} onChange={(e) => set("courier", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Sender & Receiver</CardTitle></CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground">Sender</h4>
                <div><Label>Name *</Label><Input value={form.sender_name} onChange={(e) => set("sender_name", e.target.value)} required /></div>
                <div><Label>Email</Label><Input type="email" value={form.sender_email} onChange={(e) => set("sender_email", e.target.value)} /></div>
                <div><Label>Phone</Label><Input value={form.sender_phone} onChange={(e) => set("sender_phone", e.target.value)} /></div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground">Receiver</h4>
                <div><Label>Name *</Label><Input value={form.receiver_name} onChange={(e) => set("receiver_name", e.target.value)} required /></div>
                <div><Label>Email</Label><Input type="email" value={form.receiver_email} onChange={(e) => set("receiver_email", e.target.value)} /></div>
                <div><Label>Phone</Label><Input value={form.receiver_phone} onChange={(e) => set("receiver_phone", e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Package details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div><Label>Origin *</Label><Input value={form.origin} onChange={(e) => set("origin", e.target.value)} required /></div>
              <div><Label>Destination *</Label><Input value={form.destination} onChange={(e) => set("destination", e.target.value)} required /></div>
              <div>
                <Label>Shipment type *</Label>
                <Select value={form.shipment_type} onValueChange={(v) => set("shipment_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parcel">Parcel</SelectItem>
                    <SelectItem value="Document">Document</SelectItem>
                    <SelectItem value="Air Freight">Air Freight</SelectItem>
                    <SelectItem value="Sea Freight">Sea Freight</SelectItem>
                    <SelectItem value="Container">Container</SelectItem>
                    <SelectItem value="Pallet">Pallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Quantity</Label><Input type="number" min={1} value={form.quantity} onChange={(e) => set("quantity", Number(e.target.value))} /></div>
                <div><Label>Weight (kg)</Label><Input type="number" min={0} step="0.1" value={form.weight} onChange={(e) => set("weight", e.target.value)} /></div>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label htmlFor="fragile" className="cursor-pointer">Fragile</Label>
                <Switch id="fragile" checked={form.is_fragile} onCheckedChange={(v) => set("is_fragile", v)} />
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <Label htmlFor="express" className="cursor-pointer">Express</Label>
                <Switch id="express" checked={form.is_express} onCheckedChange={(v) => set("is_express", v)} />
              </div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={1000} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => handleStatusChange(v as ShipmentStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SHIPMENT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Progress (%)</Label><Input type="number" min={0} max={100} value={form.progress} onChange={(e) => set("progress", Number(e.target.value))} /></div>
              <div><Label>Estimated delivery</Label><Input type="date" value={form.estimated_delivery_date} onChange={(e) => set("estimated_delivery_date", e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Payment (display only)</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Payment status</Label>
                <Select value={form.payment_status} onValueChange={(v) => set("payment_status", v as "pending" | "paid")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Amount to pay</Label><Input type="number" min={0} step="0.01" value={form.amount_to_pay} onChange={(e) => set("amount_to_pay", e.target.value)} /></div>
              <div><Label>Payment method</Label><Input value={form.payment_method} onChange={(e) => set("payment_method", e.target.value)} placeholder="e.g. Bank Transfer" /></div>
              <div><Label>Reason for payment</Label><Input value={form.payment_reason} onChange={(e) => set("payment_reason", e.target.value)} /></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Shipment / Proof images</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((url) => (
                  <div key={url} className="group relative aspect-square overflow-hidden rounded-md border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(url)} className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {form.images.length < MAX_IMAGES && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border text-muted-foreground hover:bg-muted/40">
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                    <span className="text-xs">Add</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Max 5 images, 1MB each.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notify receiver</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <Label htmlFor="send-email" className="cursor-pointer">Send email notification</Label>
                  <p className="text-xs text-muted-foreground">Sends tracking link to receiver email.</p>
                </div>
                <Switch id="send-email" checked={form.send_email} onCheckedChange={(v) => set("send_email", v)} />
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-4 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/admin/shipments")}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? "Save changes" : "Create"}
            </Button>
          </div>
        </div>

        {isEdit && (
          <Card className="lg:col-span-3">
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-[200px_1fr_1fr_auto]">
                <Select value={newEvent.status} onValueChange={(v) => setNewEvent({ ...newEvent, status: v as ShipmentStatus })}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {SHIPMENT_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
                <Input placeholder="Note (optional)" value={newEvent.note} onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })} />
                <Button type="button" onClick={handleAddEvent} className="gap-1"><Plus className="h-4 w-4" />Add event</Button>
              </div>

              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events yet.</p>
              ) : (
                <ol className="space-y-3">
                  {events.map((ev) => (
                    <li key={ev.id} className="rounded-md border border-border p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{ev.status ? statusLabel(ev.status) : "Update"}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(ev.event_at), "PPp")}</span>
                      </div>
                      {ev.location && <p className="text-muted-foreground">{ev.location}</p>}
                      {ev.note && <p>{ev.note}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default ShipmentForm;
