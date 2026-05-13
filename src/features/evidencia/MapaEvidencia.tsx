"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";


// Icon Factory: Clean SVGs, no external assets needed
const createIcon = (svgPath: string, bgColor: string) => L.divIcon({
  html: `<div style="width:32px;height:32px;background:${bgColor};border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="16" fill="white" viewBox="0 0 24 24">${svgPath}</svg>
  </div>`,
  className: "", 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

const SVG_DESTINO = '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>';
const SVG_GPS = '<circle cx="12" cy="12" r="5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>';

const iconDestino = createIcon(SVG_DESTINO, "#059669"); 
const iconGPS = createIcon(SVG_GPS, "#3b82f6"); 

// Spatial bounding to force the camera to fit the exact data points
function AutoFitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [map, bounds]);
  return null;
}

export interface MapaEvidenciaProps {
  latDestino: number;
  lngDestino: number;
  latGPS: number;
  lngGPS: number;
  profesional: string;
  timestamp: string;
  distanciaMetros: number;
  esIrregular: boolean;
}

export default function MapaEvidencia(props: MapaEvidenciaProps) {
  const { latDestino, lngDestino, latGPS, lngGPS, profesional, timestamp, distanciaMetros, esIrregular } = props;

  // Defensive rendering against null vectors
  if (!latDestino || !lngDestino || !latGPS || !lngGPS) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-50 border border-dashed border-gray-300 text-sm text-gray-500 font-mono">
        ERR: COORDENADAS_INSUFICIENTES
      </div>
    );
  }

  // Memoize calculations to prevent unnecessary re-renders on the main thread
  const mapBounds = useMemo<L.LatLngBoundsExpression>(
    () => [
      [latDestino, lngDestino],
      [latGPS, lngGPS],
    ],
    [latDestino, lngDestino, latGPS, lngGPS]
  );

  const horaLlegada = useMemo(() => {
    return new Date(timestamp).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit", // Added seconds for better audit precision
    });
  }, [timestamp]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 isolate relative z-0">
      <MapContainer
        bounds={mapBounds}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoFitBounds bounds={mapBounds} />

        {/* Target Location Marker */}
        <Marker position={[latDestino, lngDestino]} icon={iconDestino}>
          <Popup>
            <div className="text-xs font-sans tracking-wide">
              <p className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                Domicilio Registrado
              </p>
              <p className="text-gray-500 mt-1">Ubicación objetivo del plan</p>
            </div>
          </Popup>
        </Marker>

        {/* Actual Telemetry Marker */}
        <Marker position={[latGPS, lngGPS]} icon={iconGPS}>
          <Popup>
            <div className="text-xs min-w-[200px] font-sans">
              <p className={`font-bold uppercase tracking-wider text-[10px] ${esIrregular ? "text-red-700" : "text-blue-700"}`}>
                {esIrregular ? "ESTADO: FUERA DE RANGO" : "ESTADO: VERIFICADO"}
              </p>
              
              <p className="text-gray-800 font-medium border-b border-gray-200 pb-2 mt-1 mb-2">
                {profesional}
              </p>
              
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 mt-2">
                <span className="text-gray-500 uppercase text-[9px] tracking-wider flex items-center">Llegada</span>
                <span className="font-mono text-right text-gray-700">{horaLlegada}</span>
                
                <span className="text-gray-500 uppercase text-[9px] tracking-wider flex items-center">Desviación</span>
                <span className={`font-mono font-bold text-right ${esIrregular ? "text-red-600" : "text-blue-600"}`}>
                  {distanciaMetros}m
                </span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Vector Line */}
          <Polyline
          positions={[[latDestino, lngDestino], [latGPS, lngGPS]]}
          color={esIrregular ? "#ef4444" : "#10b981"}
          weight={2}
          dashArray={esIrregular ? "6 6" : undefined}
          opacity={0.8}
        />
      </MapContainer>
    </div>
  );
}