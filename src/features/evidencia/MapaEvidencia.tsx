"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icons de Leaflet en Next.js
const iconDestino = L.divIcon({
  html: `<div style="width:32px;height:32px;background:#059669;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
  </div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

const iconGPS = L.divIcon({
  html: `<div style="width:32px;height:32px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
  </div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

type Props = {
  latDestino: number;
  lngDestino: number;
  latGPS: number;
  lngGPS: number;
  profesional: string;
  timestamp: string;
  distanciaMetros: number;
  esIrregular: boolean;
};

export default function MapaEvidencia({ latDestino, lngDestino, latGPS, lngGPS, profesional, timestamp, distanciaMetros, esIrregular }: Props) {
  const center: [number, number] = [
    (latDestino + latGPS) / 2,
    (lngDestino + lngGPS) / 2,
  ];

  const horaLlegada = new Date(timestamp).toLocaleTimeString("es-CO", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%", borderRadius: "12px" }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcador de destino */}
      <Marker position={[latDestino, lngDestino]} icon={iconDestino}>
        <Popup>
          <div className="text-xs">
            <p className="font-bold text-emerald-700">📍 Domicilio del paciente</p>
            <p className="text-gray-500 mt-1">Ubicación registrada en el plan</p>
          </div>
        </Popup>
      </Marker>

      {/* Marcador GPS real */}
      <Marker position={[latGPS, lngGPS]} icon={iconGPS}>
        <Popup>
          <div className="text-xs">
            <p className={`font-bold ${esIrregular ? "text-red-700" : "text-blue-700"}`}>
              {esIrregular ? "⚠️ GPS registrado (fuera de rango)" : "✅ GPS verificado"}
            </p>
            <p className="text-gray-600 mt-1">{profesional}</p>
            <p className="text-gray-500">Llegada: {horaLlegada}</p>
            <p className={`mt-1 font-semibold ${esIrregular ? "text-red-600" : "text-blue-600"}`}>
              Distancia al destino: {distanciaMetros}m
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Línea entre los dos puntos */}
      <Polyline
        positions={[[latDestino, lngDestino], [latGPS, lngGPS]]}
        color={esIrregular ? "#ef4444" : "#10b981"}
        weight={3}
        dashArray={esIrregular ? "8 4" : undefined}
        opacity={0.7}
      />
    </MapContainer>
  );
}
