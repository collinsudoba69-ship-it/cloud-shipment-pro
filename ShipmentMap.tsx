import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Truck } from 'lucide-react';
import { renderToString } from 'react-dom/server';

interface ShipmentMapProps {
  shipment: {
    origin: string;
    destination: string;
    status: string;
    progress: number;
    estimatedDelivery: string;
    trackingNumber: string;
  };
}

// Helper to create custom div icons from Lucide icons
const createCustomIcon = (color: string, iconSvg: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      color: white;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

// Pulse animation for live tracking marker
const createPulseIcon = () => {
  return L.divIcon({
    className: 'pulse-marker',
    html: `<div style="position: relative; width: 20px; height: 20px;">
      <div style="
        position: absolute;
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border-radius: 50%;
        animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #1d4ed8;
        border-radius: 50%;
        border: 2px solid white;
      "></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Map bounds fitter
const MapBounds = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  }, [map, bounds]);
  return null;
};

// Simple geocoding dictionary for demo (replace with real geocoding API)
const getCoordinates = (location: string): [number, number] => {
  const coords: Record<string, [number, number]> = {
    'Washington, DC': [38.9072, -77.0369],
    'New Jersey': [40.0583, -74.4057],
    'New York, NY': [40.7128, -74.0060],
    'Los Angeles, CA': [34.0522, -118.2437],
    'Chicago, IL': [41.8781, -87.6298],
    'Miami, FL': [25.7617, -80.1918],
    'Seattle, WA': [47.6062, -122.3321],
  };
  
  const key = Object.keys(coords).find(k => 
    location.toLowerCase().includes(k.toLowerCase().split(',')[0])
  );
  return key ? coords[key] : [39.5, -76.0]; // Default fallback
};

// Interpolate position along line based on progress
const getPositionAlongLine = (
  start: [number, number], 
  end: [number, number], 
  progress: number
): [number, number] => {
  const lat = start[0] + (end[0] - start[0]) * (progress / 100);
  const lng = start[1] + (end[1] - start[1]) * (progress / 100);
  return [lat, lng];
};

const ShipmentMap = ({ shipment }: ShipmentMapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  const originCoords = useMemo(() => getCoordinates(shipment.origin), [shipment.origin]);
  const destCoords = useMemo(() => getCoordinates(shipment.destination), [shipment.destination]);
  const currentPos = useMemo(() => 
    getPositionAlongLine(originCoords, destCoords, shipment.progress),
  [originCoords, destCoords, shipment.progress]);

  const routeBounds = useMemo(() => 
    L.latLngBounds([originCoords, destCoords]),
  [originCoords, destCoords]);

  // Icons using Lucide SVG paths
  const originIcon = useMemo(() => createCustomIcon('#16a34a', 
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
  ), []);

  const destIcon = useMemo(() => createCustomIcon('#2563eb', 
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>'
  ), []);

  const liveIcon = useMemo(() => createPulseIcon(), []);

  const isLive = shipment.status === 'in-transit' || shipment.status === 'out-for-delivery';

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
      {/* Inject pulse animation styles */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.33); opacity: 1; }
          80%, 100% { transform: scale(2); opacity: 0; }
        }
        .leaflet-container { background: #0f172a; }
      `}</style>

      <MapContainer
        center={currentPos}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        ref={mapRef}
      >
        {/* Dark mode tiles - CartoDB Dark Matter */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        <MapBounds bounds={routeBounds} />

        {/* Route Line - dashed animated */}
        <Polyline
          positions={[originCoords, destCoords]}
          pathOptions={{
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10',
            lineCap: 'round',
            className: 'animate-dash', // You can add CSS animation for dash offset
          }}
        />

        {/* Origin Marker */}
        <Marker position={originCoords} icon={originIcon}>
          {/* Popup optional */}
        </Marker>

        {/* Destination Marker */}
        <Marker position={destCoords} icon={destIcon} />

        {/* Live Position Marker */}
        {isLive && (
          <Marker position={currentPos} icon={liveIcon} />
        )}

        {/* Progress label overlay */}
        <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-slate-700 shadow-xl">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">
              {shipment.progress}% complete
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {shipment.origin} → {shipment.destination}
          </div>
        </div>

        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-4 right-4 z-[400]">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 shadow-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-white">Live</span>
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default ShipmentMap;
