import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// --- ARREGLO DE ÍCONOS LEAFLET ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// ----------------------------------

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
  // Ya no usamos addressToSearch aquí porque es manual
}

// 1. COMPONENTE QUE MUEVE LA CÁMARA CUANDO CAMBIAN LAS PROPS
const MapController = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng && (lat !== 0 || lng !== 0)) {
      map.flyTo([lat, lng], 15, { duration: 1.5 }); // Zoom 15 y animación suave
    }
  }, [lat, lng, map]);

  return null;
};

// 2. COMPONENTE PARA DETECTAR CLICS EN EL MAPA
const LocationMarker = ({ position, setPosition, onLocationChange }: any) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onLocationChange(lat, lng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
};

export const LocationPicker = ({
  initialLat,
  initialLng,
  onLocationChange,
}: LocationPickerProps) => {
  const defaultCenter = { lat: -31.61, lng: -60.7 }; // Santa Fe por defecto
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // Sincronizar estado local si cambian las props (ej: escribiste en el input)
  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: Number(initialLat), lng: Number(initialLng) });
    }
  }, [initialLat, initialLng]);

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-600 mt-2 z-0 relative">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador Clickeable */}
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationChange={onLocationChange}
        />

        {/* Controlador de Vuelo (Nuevo) */}
        <MapController lat={Number(initialLat)} lng={Number(initialLng)} />
      </MapContainer>

      <div className="absolute bottom-2 left-2 bg-white/90 text-black px-2 py-1 text-xs rounded z-[1000] shadow">
        Clic en el mapa o escribe coordenadas arriba
      </div>
    </div>
  );
};
