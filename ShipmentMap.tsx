import { useState } from 'react';
import { MapPin, Package, Truck, Clock, Navigation } from 'lucide-react';

interface ShipmentData {
  origin: string;
  destination: string;
  status: 'in-transit' | 'delivered' | 'pending';
  progress: number; // 0-100
  estimatedDelivery: string;
  trackingNumber: string;
}

const ShipmentMap = ({ 
  shipment = defaultShipment 
}: { 
  shipment?: ShipmentData 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeView, setActiveView] = useState<'map' | 'route'>('map');

  // Clean embed URL (removed the malformed space)
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1552554.437341395!2d-76.0369!3d39.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1713330000000!5m2!1sen!2sus";

  return (
    <div className="w-full space-y-4">
      {/* Tracking Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Package className="w-4 h-4" />
              <span>Tracking Number</span>
            </div>
            <p className="text-lg font-mono font-semibold text-slate-900">
              {shipment.trackingNumber}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              shipment.status === 'in-transit' 
                ? 'bg-blue-100 text-blue-700' 
                : shipment.status === 'delivered'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {shipment.status === 'in-transit' ? 'In Transit' : 
               shipment.status === 'delivered' ? 'Delivered' : 'Pending'}
            </span>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>ETA: {shipment.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 relative">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${shipment.progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium text-slate-700">{shipment.origin}</span>
            </div>
            <div className="flex items-center gap-1">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-slate-700">{shipment.destination}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
            <div className="flex items-center gap-2 text-slate-500">
              <Truck className="w-5 h-5 animate-bounce" />
              <span>Loading route map...</span>
            </div>
          </div>
        )}
        
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          src={embedUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
          title="Shipment Route Map"
        />

        {/* Live Indicator Overlay */}
        {shipment.status === 'in-transit' && mapLoaded && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-slate-200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-700">Live Tracking</span>
            </div>
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Origin</p>
              <p className="font-semibold text-slate-900">{shipment.origin}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Destination</p>
              <p className="font-semibold text-slate-900">{shipment.destination}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const defaultShipment: ShipmentData = {
  origin: "Washington, DC",
  destination: "New Jersey",
  status: "in-transit",
  progress: 65,
  estimatedDelivery: "Today by 8:00 PM",
  trackingNumber: "CLD-8291-5734"
};

export default ShipmentMap;
