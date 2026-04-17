import { useNavigate } from "react-router-dom";
{/* LIVE TRACKING MAP SECTION */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-slate-900">Live Global Network</h2>
          </div>
          
          {/* This is the magic line that calls your map code */}
          <div className="shadow-2xl rounded-2xl overflow-hidden bg-white p-2">
            <ShipmentMap />
          </div>
          
          <div className="mt-4 flex gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" /> In Transit
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300" /> Pending
            </div>
          </div>
        </div>
      </section>
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Plane, Ship, Zap, Warehouse, Search, ShieldCheck, Globe2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tracking, setTracking] = useState("");

  const services = [
    { icon: Plane, title: t("services.air"), desc: t("services.airDesc") },
    { icon: Ship, title: t("services.sea"), desc: t("services.seaDesc") },
    { icon: Zap, title: t("services.express"), desc: t("services.expressDesc") },
    { icon: Warehouse, title: t("services.warehousing"), desc: t("services.warehousingDesc") },
  ];

  const stats = [
    { value: "120+", label: t("stats.countries") },
    { value: "2.4M", label: t("stats.shipments") },
    { value: "99.4%", label: t("stats.onTime") },
    { value: "24/7", label: t("stats.support") },
  ];

  const trust = [
    { icon: ShieldCheck, title: t("trust.insured"), desc: t("trust.insuredDesc") },
    { icon: Globe2, title: t("trust.network"), desc: t("trust.networkDesc") },
    { icon: Clock, title: t("trust.realtime"), desc: t("trust.realtimeDesc") },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim()) navigate(`/track?n=${encodeURIComponent(tracking.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, hsl(217 91% 60% / 0.4), transparent 50%), radial-gradient(circle at 80% 70%, hsl(217 91% 50% / 0.3), transparent 50%)",
        }} />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {t("hero.title1")} <span className="bg-gradient-to-r from-primary-glow to-primary-foreground bg-clip-text text-transparent">{t("hero.title2")}</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
              {t("hero.subtitle")}
            </p>

            <form onSubmit={handleTrack} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 rounded-2xl bg-background/95 p-3 shadow-elegant backdrop-blur sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder={t("hero.placeholder")}
                  className="h-12 border-0 bg-transparent pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 gap-2">
                {t("hero.button")} <ArrowRight className="h-4 w-4" />
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

      {/* NEW: LIVE TRACKING DEMONSTRATION SECTION */}
      <section className="bg-background py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="text-2xl font-bold md:text-3xl">Live Global Network</h2>
            <p className="mt-3 text-muted-foreground">Monitor your shipments in real-time across our global transit corridors.</p>
          </div>
          {/* THE MAP COMPONENT */}
          <div className="rounded-2xl border-4 border-slate-100 shadow-2xl">
            <ShipmentMap />
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="bg-gradient-subtle py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">{t("services.heading")}</h2>
            <p className="mt-4 text-muted-foreground">{t("services.sub")}</p>
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
       {/* EMERGENCY DIRECT MAP SECTION */}
<section className="py-12 bg-slate-50 border-y border-slate-200">
  <div className="container mx-auto px-4">
    <div className="flex items-center gap-2 mb-6">
      <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
      <h2 className="text-2xl font-bold text-slate-900">Live Global Network</h2>
    </div>
    
    <div className="shadow-2xl rounded-2xl overflow-hidden bg-white p-2 h-[450px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1565555.748682054!2d-76.3243147854612!3d39.40775952046467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x89b7c6de5af66771%3A0x777bca565b0b67f2!2sWashington%2C%20DC!3m2!1d38.9071923!2d-77.0368707!4m5!1s0x89c0fb959e00409f%3A0x2eb27d0727db022!2sNew%20Jersey!3m2!1d40.0583238!2d-74.4056612!5e0!3m2!1sen!2sus!4v1713350000000!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Cloud Shipment Route"
      />
    </div>
  </div>
</section>   

      {/* TRUST SECTION */}
      <section className="border-t border-border/60 py-20">
        <div className="container grid gap-10 md:grid-cols-3">
          {trust.map((item) => (
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
