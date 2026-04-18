import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { geocode, lookupFallback, type LatLng } from "@/lib/geocode";

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

const interpolatePosition = (start: LatLng, end: LatLng, progress: number): LatLng => {
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
    map.fitBounds(bounds, { padding: [36, 36] });
  }, [map, bounds]);
  return null;
};

const ShipmentMap = ({ shipment }: ShipmentMapProps) => {
  const initialOrigin = useMemo<LatLng>(() => lookupFallback(shipment.origin) ?? [39.5, -76.0], [shipment.origin]);
  const initialDestination = useMemo<LatLng>(
    () => lookupFallback(shipment.destination) ?? [39.5, -76.0],
    [shipment.destination],
  );

  const [originCoords, setOriginCoords] = useState<LatLng>(initialOrigin);
  const [destinationCoords, setDestinationCoords] = useState<LatLng>(initialDestination);

  useEffect(() => {
    let cancelled = false;
    geocode(shipment.origin).then((c) => {
      if (!cancelled) setOriginCoords(c);
    });
    return () => {
      cancelled = true;
    };
  }, [shipment.origin]);

  useEffect(() => {
    let cancelled = false;
    geocode(shipment.destination).then((c) => {
      if (!cancelled) setDestinationCoords(c);
    });
    return () => {
      cancelled = true;
    };
  }, [shipment.destination]);

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

      <MapContainer center={currentCoords} zoom={3} scrollWheelZoom={false} worldCopyJump className="shipment-map-canvas">
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
