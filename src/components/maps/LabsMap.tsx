import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Clock } from "lucide-react";

// --- FIX PARA ÍCONOS DE LEAFLET EN REACT ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// -------------------------------------------

// Definimos la interfaz localmente o importamos la tuya
interface Laboratory {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  horario?: string;
}

interface LabsMapProps {
  labs: Laboratory[];
}

export const LabsMap = ({ labs }: LabsMapProps) => {
  // Centro por defecto (Santa Fe, Rafaela aprox).
  // Puedes cambiarlo a donde quieras que arranque el mapa.
  const defaultCenter: [number, number] = [-31.2526, -61.4916];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-700 shadow-lg relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={9}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false} // Para que no haga zoom al bajar con el scroll de la página
      >
        {/* Capa del Mapa (Estilo OpenStreetMap Clásico) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores */}
        {labs.map((lab) => {
          // Solo dibujamos si tiene coordenadas válidas
          if (!lab.latitude || !lab.longitude) return null;

          return (
            <Marker
              key={lab.id}
              position={[Number(lab.latitude), Number(lab.longitude)]}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 border-b border-gray-200 pb-1">
                    {lab.name}
                  </h3>

                  <div className="flex items-start gap-2 text-gray-600 text-xs mb-1">
                    <MapPin
                      size={12}
                      className="mt-0.5 text-blue-500 shrink-0"
                    />
                    <span>{lab.address}</span>
                  </div>

                  {lab.phone && (
                    <div className="flex items-center gap-2 text-gray-600 text-xs mb-1">
                      <Phone size={12} className="text-green-500 shrink-0" />
                      <span>{lab.phone}</span>
                    </div>
                  )}

                  {lab.horario && (
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <Clock size={12} className="text-orange-500 shrink-0" />
                      <span>{lab.horario}</span>
                    </div>
                  )}

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lab.latitude},${lab.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-2 text-center bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Cómo llegar
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
