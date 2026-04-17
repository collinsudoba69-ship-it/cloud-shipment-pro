import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Package, Truck, CheckCircle2 } from "lucide-react";

const Tracking = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="container py-12">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Shipment Details</h1>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipment Status Card */}
          <Card className="lg:col-span-1 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tracking Number</p>
                  <p className="font-bold text-lg">CS-992384-US</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Origin</p>
                    <p className="text-slate-600">Washington, D.C., USA</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Truck className="text-blue-600" />
                  <div>
                    <p className="font-semibold text-sm">Destination</p>
                    <p className="text-slate-600">Jersey City, New Jersey, USA</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="text-green-600" />
                  <div>
                    <p className="font-semibold text-sm">Status</p>
                    <p className="text-green-600 font-bold">In Transit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Large Map View */}
          <Card className="lg:col-span-2 shadow-md overflow-hidden h-[500px]">
            <iframe 
               src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1553556.703!2d-76.3!3d39.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x89b7c6de5af6677b%3A0x21e57162f53a4d!2sWashington%2C%20DC!3m2!1d38.9071923!2d-77.0368707!4m5!1s0x89c24fa5d3310e41%3A0x405f42a1bc7e100!2sNew%20Jersey!3m2!1d40.0583238!2d-74.4056612!5e0!3m2!1sen!2sus!4v1713346000000"
               width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
            />
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Tracking;
