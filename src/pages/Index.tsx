import { useNavigate } from "react-router-dom";
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
          <h1 className="text-4xl font-bold md:text-6xl mb-6">Cloud Shipment</h1>
          <p className="text-lg mb-10">Fast, Reliable, Global Logistics</p>
          
          <form onSubmit={handleTrack} className="mx-auto flex max-w-xl gap-3 bg-white p-3 rounded-2xl shadow-lg">
            <Input 
              value={tracking} 
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Enter Tracking Number..." 
              className="text-black border-0 focus-visible:ring-0"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Track Now</Button>
          </form>
        </div>
      </section>

      {/* LIVE MAP SECTION - DIRECT EMBED */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            Live Global Transit Map
          </h2>
          <div className="rounded-2xl overflow-hidden border-4 border-slate-50 shadow-2xl h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3106547.073408546!2d-76.0369!3d39.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1713345600000!5m2!1sen!2sus" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Index;
