import { useEffect, useRef } from 'react';

const ShipmentMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // Only run if the map hasn't been initialized and the div exists
    if (mapRef.current && !mapInstance.current && (window as any).L) {
      const L = (window as any).L;

      // 1. Initialize the map
      mapInstance.current = L.map(mapRef.current).setView([39.50, -75.35], 7);

      // 2. Add the professional "Dark Mode" or Standard tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance.current);

      // 3. Define the Route
      const origin = [38.9072, -77.0369]; // DC
      const destination = [40.0583, -74.4057]; // NJ
      const truckPos = [39.45, -75.75]; // Mid-point

      // 4. Add the Dotted Line
      L.polyline([origin, destination], {
        color: '#3b82f6',
        weight: 3,
        dashArray: '10, 10',
        opacity: 0.6
      }).addTo(mapInstance.current);

      // 5. Add Custom Markers (Standard Leaflet style)
      L.marker(origin).addTo(mapInstance.current).bindPopup('Origin: Washington D.C.');
      L.marker(destination).addTo(mapInstance.current).bindPopup('Destination: New Jersey');
      
      // Truck Icon (Standard circle for maximum compatibility)
      L.circleMarker(truckPos, {
        color: '#2563eb',
        fillColor: '#60a5fa',
        fillOpacity: 1,
        radius: 8
      }).addTo(mapInstance.current).bindPopup('Shipment: In Transit');
    }

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="h-[400px] w-full rounded-xl shadow-inner border border-slate-200" 
      style={{ background: '#f8fafc' }}
    />
  );
};

export default ShipmentMap;
