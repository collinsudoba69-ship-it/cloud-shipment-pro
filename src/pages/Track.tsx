import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, MapPin, Calendar, Search, AlertCircle, CheckCircle2, Truck, Box } from "lucide-react";
import { progressForStatus, statusColorClass, statusLabel, ShipmentStatus } from "@/lib/shipment";
import { format } from "date-fns";

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  progress: number;
  estimated_delivery_date: string | null;
  shipment_type: string;
  description: string | null;
  is_express: boolean;
  is_fragile: boolean;
  images: string[];
}

interface Event {
  id: string;
  status: ShipmentStatus | null;
  location: string | null;
  note: string | null;
  event_at: string;
}

const Track = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get("n") ?? "";
  const [input, setInput] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const lookup = useCallback(async (number: string) => {
    if (!number.trim()) return;
    setLoading(true);
    setError(null);
    setShipment(null);
    setEvents([]);
    setSearched(true);

    const { data: ship, error: shipErr } = await supabase
      .from("shipments")
      .select("*")
      .ilike("tracking_number", number.trim())
      .maybeSingle();

    if (shipErr || !ship) {
      setError("No shipment found with that tracking number.");
      setLoading(false);
      return;
    }

    const { data: evs } = await supabase
      .from("shipment_events")
      .select("*")
      .eq("shipment_id", ship.id)
      .order("event_at", { ascending: false });

    setShipment(ship as Shipment);
    setEvents((evs ?? []) as Event[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initial) lookup(initial);
  }, [initial, lookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams({ n: input.trim() });
    lookup(input);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="bg-hero py-16 text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Track your shipment</h1>
            <p className="mt-3 text-primary-foreground/80">Enter your tracking number to see live status.</p>
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl gap-2 rounded-xl bg-background/95 p-2 shadow-elegant">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="CS-2025-04-XXXXXX"
                  className="h-11 border-0 bg-transparent pl-9 text-foreground focus-visible:ring-0"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="container flex-1 py-12">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p>Looking up your shipment…</p>
          </div>
        )}

        {error && !loading && (
          <Card className="mx-auto max-w-xl border-destructive/40 bg-destructive/5">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div>
                <p className="font-medium">Tracking number not found</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && !searched && (
          <div className="mx-auto max-w-xl text-center text-muted-foreground">
            <Package className="mx-auto h-12 w-12 opacity-40" />
            <p className="mt-3">Enter a tracking number above to begin.</p>
          </div>
        )}

        {shipment && !loading && (
          <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
            {/* Summary */}
            <Card className="overflow-hidden shadow-elegant">
              <div className="bg-gradient-primary p-6 text-primary-foreground">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-primary-foreground/70">Tracking #</p>
                    <p className="text-2xl font-bold tracking-tight">{shipment.tracking_number}</p>
                  </div>
                  <Badge className={statusColorClass(shipment.status) + " border-0 px-3 py-1 text-sm"}>
                    {statusLabel(shipment.status)}
                  </Badge>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{shipment.progress || progressForStatus(shipment.status)}%</span>
                  </div>
                  <Progress value={shipment.progress || progressForStatus(shipment.status)} className="h-2 bg-primary-foreground/20" />
                </div>
              </div>
              <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">From</p>
                    <p className="font-medium">{shipment.origin}</p>
                    <p className="mt-2 text-xs uppercase text-muted-foreground">To</p>
                    <p className="font-medium">{shipment.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Estimated delivery</p>
                    <p className="font-medium">
                      {shipment.estimated_delivery_date
                        ? format(new Date(shipment.estimated_delivery_date), "PPP")
                        : "To be confirmed"}
                    </p>
                    <p className="mt-2 text-xs uppercase text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">
                      {shipment.shipment_type}
                      {shipment.is_express && <span className="ml-2 rounded bg-warning/15 px-1.5 py-0.5 text-xs text-warning">Express</span>}
                      {shipment.is_fragile && <span className="ml-2 rounded bg-destructive/10 px-1.5 py-0.5 text-xs text-destructive">Fragile</span>}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Shipment timeline</h3>
                {events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No timeline events yet.</p>
                ) : (
                  <ol className="space-y-5">
                    {events.map((ev, idx) => (
                      <li key={ev.id} className="relative flex gap-4 pl-8">
                        <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {ev.status === "delivered" ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                           ev.status === "out_for_delivery" ? <Truck className="h-3.5 w-3.5" /> :
                           <Box className="h-3.5 w-3.5" />}
                        </span>
                        {idx < events.length - 1 && <span className="absolute left-3 top-7 h-full w-px bg-border" />}
                        <div className="flex-1 pb-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <p className="font-medium">{ev.status ? statusLabel(ev.status) : "Update"}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(ev.event_at), "PPp")}</p>
                          </div>
                          {ev.location && <p className="text-sm text-muted-foreground">{ev.location}</p>}
                          {ev.note && <p className="mt-1 text-sm">{ev.note}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            {shipment.images?.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">Shipment / Proof images</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {shipment.images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg border border-border">
                        <img src={url} alt={`Shipment image ${i + 1}`} className="h-28 w-full object-cover transition-transform hover:scale-105" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
};

export default Track;
