import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React
const originIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [30, 30],
});

const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png',
  iconSize: [35, 35],
});

const ShipmentMap = () => {
  const origin = [38.9072, -77.0369]; // Washington, D.C.
  const destination = [40.0583, -74.4057]; // New Jersey
  const truckPos = [39.45, -75.75]; // Somewhere in the middle (Delaware/Maryland area)

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-800">
      <MapContainer center={truckPos} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* The Route Line */}
        <Polyline 
          positions={[origin, destination]} 
          pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10, 10', opacity: 0.6 }} 
        />

        {/* Origin Marker */}
        <Marker position={origin} icon={originIcon}>
          <Popup>Origin: Washington, D.C.</Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={destination} icon={destinationIcon}>
          <Popup>Destination: New Jersey</Popup>
        </Marker>

        {/* Moving Truck Icon */}
        <Marker position={truckPos} icon={truckIcon}>
          <Popup>Shipment is currently In Transit</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ShipmentMap;
