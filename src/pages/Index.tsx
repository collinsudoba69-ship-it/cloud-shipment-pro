import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Plane, Ship, Zap, Warehouse, Search, ShieldCheck, Globe2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import ShipmentMap from "@/components/ShipmentMap";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tracking, setTracking] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (tracking.trim()) navigate(`/track?n=${encodeURIComponent(tracking.trim())}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-hero text-primary-foreground py-20">
        <div className="container relative text-center">
          <h1 className="text-4xl font-bold md:text-6xl mb-6">{t("home.heroTitle")}</h1>
          <p className="text-lg mb-10">{t("home.heroSubtitle")}</p>

          <form onSubmit={handleTrack} className="mx-auto flex max-w-xl gap-3 bg-white p-3 rounded-2xl shadow-lg">
            <Input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder={t("home.heroPlaceholder")}
              className="bg-white text-black placeholder:text-gray-500 border-0 focus-visible:ring-0"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">{t("home.heroButton")}</Button>
          </form>
        </div>
      </section>

      {/* LIVE MAP SECTION */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            {t("home.liveMap")}
          </h2>
          <ShipmentMap
            shipment={{
              origin: "Washington, DC",
              destination: "New Jersey",
              status: "in-transit",
              progress: 64,
              estimatedDelivery: "Today · 8:00 PM",
              trackingNumber: "CS-DEMO-ROUTE",
            }}
          />
        </div>
      </section>

      <Testimonials />

      <SiteFooter />
    </div>
  );
};

export default Index;
