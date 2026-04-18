import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Truck } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

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

const makeIcon = (className: string, node: React.ReactNode) =>
  L.divIcon({
    className,
    html: renderToStaticMarkup(node),
    iconSize: [44, 44],
    iconAnchor: [22, 22],
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
        <div className="shipment-map-marker shipment-map-marker--origin">
          <MapPin size={18} strokeWidth={2.2} />
        </div>,
      ),
    [],
  );

  const destinationIcon = useMemo(
    () =>
      makeIcon(
        "shipment-map-icon",
        <div className="shipment-map-marker shipment-map-marker--destination">
          <MapPin size={18} strokeWidth={2.2} />
        </div>,
      ),
    [],
  );

  const liveIcon = useMemo(
    () =>
      makeIcon(
        "shipment-map-icon shipment-map-icon--live",
        <div className="shipment-map-live-marker">
          <div className="shipment-map-live-ping" />
          <div className="shipment-map-live-core">
            <Truck size={16} strokeWidth={2.4} />
          </div>
        </div>,
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

        <Marker position={originCoords} icon={originIcon}>
          <Tooltip>{shipment.origin}</Tooltip>
        </Marker>

        <Marker position={destinationCoords} icon={destinationIcon}>
          <Tooltip>{shipment.destination}</Tooltip>
        </Marker>

        {showLiveMarker && (
          <Marker position={currentCoords} icon={liveIcon}>
            <Tooltip>Shipment in motion</Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ShipmentMap;