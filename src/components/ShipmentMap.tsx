import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

type ShipmentMapStatus = "pending" | "in-transit" | "out-for-delivery" | "delivered" | "exception";

interface ShipmentMapProps {
  shipment: {
    origin: string;
    destination: string;
    status: ShipmentMapStatus;
    progress: number;
    estimatedDelivery: string;
    trackingNumber: string;
  };
}

const COORDINATES: Record<string, [number, number]> = {
  "Washington, DC": [38.9072, -77.0369],
  "New Jersey": [40.0583, -74.4057],
  "New York, NY": [40.7128, -74.006],
  "Los Angeles, CA": [34.0522, -118.2437],
  "Chicago, IL": [41.8781, -87.6298],
  "Miami, FL": [25.7617, -80.1918],
  "Seattle, WA": [47.6062, -122.3321],
  London: [51.5072, -0.1276],
  Paris: [48.8566, 2.3522],
  Dubai: [25.2048, 55.2708],
  Lagos: [6.5244, 3.3792],
  Shanghai: [31.2304, 121.4737],
};

const getCoordinates = (location: string): [number, number] => {
  const normalized = location.trim().toLowerCase();
  const exact = Object.entries(COORDINATES).find(([key]) => key.toLowerCase() === normalized);
  if (exact) return exact[1];

  const partial = Object.entries(COORDINATES).find(([key]) => normalized.includes(key.toLowerCase().split(",")[0]));
  return partial?.[1] ?? [39.5, -76.0];
};

const interpolatePosition = (start: [number, number], end: [number, number], progress: number): [number, number] => {
  const safe = Math.max(0, Math.min(progress, 100)) / 100;
  return [start[0] + (end[0] - start[0]) * safe, start[1] + (end[1] - start[1]) * safe];
};

const makeIcon = (className: string, html: string, size: [number, number] = [44, 44]) =>
  L.divIcon({
    className,
    html,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
  });

const FitBounds = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 7 });
  }, [map, bounds]);
  return null;
};

const ShipmentMap = ({ shipment }: ShipmentMapProps) => {
  const originCoords = useMemo(() => getCoordinates(shipment.origin), [shipment.origin]);
  const destinationCoords = useMemo(() => getCoordinates(shipment.destination), [shipment.destination]);
  const currentCoords = useMemo(
    () => interpolatePosition(originCoords, destinationCoords, shipment.progress),
    [destinationCoords, originCoords, shipment.progress],
  );

  const bounds = useMemo(() => L.latLngBounds([originCoords, destinationCoords]), [originCoords, destinationCoords]);
  const liveStatuses: ShipmentMapStatus[] = ["in-transit", "out-for-delivery"];
  const showLiveMarker = liveStatuses.includes(shipment.status);

  const originIcon = useMemo(
    () =>
      makeIcon(
        "shipment-map-icon",
        `<div class="shipment-map-marker shipment-map-marker--origin"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      ),
    [],
  );

  const destinationIcon = useMemo(
    () =>
      makeIcon(
        "shipment-map-icon",
        `<div class="shipment-map-marker shipment-map-marker--destination"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      ),
    [],
  );

  const liveIcon = useMemo(
    () =>
      makeIcon(
        "shipment-map-icon shipment-map-icon--live",
        `<div class="shipment-map-live-marker"><div class="shipment-map-live-ping"></div><div class="shipment-map-live-core"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></div></div>`,
        [52, 52],
      ),
    [],
  );

  return (
    <div className="shipment-map-shell">
      <div className="shipment-map-overlay shipment-map-overlay--left">
        <span className="shipment-map-kicker">Route overview</span>
        <strong>{shipment.trackingNumber}</strong>
        <span>
          {shipment.origin} → {shipment.destination}
        </span>
      </div>
      <div className="shipment-map-overlay shipment-map-overlay--right">
        <span className="shipment-map-live-dot" />
        ETA {shipment.estimatedDelivery}
      </div>

      <MapContainer center={currentCoords} zoom={5} scrollWheelZoom={false} className="shipment-map-canvas">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        <FitBounds bounds={bounds} />

        <Polyline
          positions={[originCoords, destinationCoords]}
          pathOptions={{ className: "shipment-map-route", color: "hsl(208 100% 58%)", weight: 5, opacity: 0.95, dashArray: "12 14" }}
        />

        <Marker position={originCoords} icon={originIcon} title={shipment.origin} />
        <Marker position={destinationCoords} icon={destinationIcon} title={shipment.destination} />
        {showLiveMarker && <Marker position={currentCoords} icon={liveIcon} title="Shipment in motion" />}
      </MapContainer>
    </div>
  );
};

export default ShipmentMap;