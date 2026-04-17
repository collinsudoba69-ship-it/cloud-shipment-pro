import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Plane, Ship, Zap, Warehouse, Search, ShieldCheck, Globe2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const services = [
  { icon: Plane, title: "Air Freight", desc: "Fast cross-border air cargo with end-to-end visibility." },
  { icon: Ship, title: "Sea Freight", desc: "Reliable container shipping for FCL and LCL loads." },
  { icon: Zap, title: "Express Delivery", desc: "Time-critical door-to-door delivery in 1-3 days." },
  { icon: Warehouse, title: "Warehousing", desc: "Secure storage and fulfillment in 40+ hubs worldwide." },
];

const stats = [
  { value: "120+", label: "Countries served" },
  { value: "2.4M", label: "Shipments tracked" },
  { value: "99.4%", label: "On-time delivery" },
  { value: "24/7", label: "Live support" },
];

const Index = () => {
  const navigate = useNavigate();
  const [tracking, setTracking] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim()) navigate(`/track?n=${encodeURIComponent(tracking.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, hsl(217 91% 60% / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, hsl(217 91% 50% / 0.3), transparent 50%)",
        }} />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
              Global logistics platform
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Ship anywhere. <span className="bg-gradient-to-r from-primary-glow to-primary-foreground bg-clip-text text-transparent">Track everywhere.</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
              Real-time visibility across air, sea, and ground for businesses moving the world.
            </p>

            <form onSubmit={handleTrack} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl bg-background/95 p-3 shadow-elegant backdrop-blur sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="Enter tracking number (e.g. CS-2025-04-AB12CD)"
                  className="h-12 border-0 bg-transparent pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 gap-2">
                Track <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold md:text-4xl">{s.value}</div>
                <div className="mt-1 text-sm text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-gradient-subtle py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Built for modern logistics</h2>
            <p className="mt-4 text-muted-foreground">Four service lines, one platform — designed for speed, scale, and transparency.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Card key={s.title} className="group border-border/60 transition-all hover:-translate-y-1 hover:shadow-elegant" style={{ animationDelay: `${i * 80}ms` }}>
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-border/60 py-20">
        <div className="container grid gap-10 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Insured & secure", desc: "Every shipment covered by global cargo insurance up to $100K." },
            { icon: Globe2, title: "Worldwide network", desc: "Direct partnerships with carriers in 120+ countries and territories." },
            { icon: Clock, title: "Real-time tracking", desc: "Live status, ETA updates, and proof-of-delivery at every milestone." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
