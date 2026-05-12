export type EstadoServicioEvidencia = "verificado" | "pendiente_auditoria" | "irregularidad";

export type ServicioEvidencia = {
  id: number;
  paciente: string;
  profesional: string;
  tipo: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  lat_destino: number;
  lng_destino: number;
  lat_gps: number;
  lng_gps: number;
  distancia_metros: number;
  nota_clinica: string;
  estado: EstadoServicioEvidencia;
  timestamp_llegada: string;
};

// Coordenadas reales de barrios de Bogotá
export const serviciosEvidencia: ServicioEvidencia[] = [
  {
    id: 1,
    paciente: "Carlos Mendoza Ruiz",
    profesional: "Sandra Muñoz",
    tipo: "Enfermería domiciliaria — signos vitales",
    fecha: "2026-05-08",
    hora_inicio: "09:02",
    hora_fin: "09:47",
    lat_destino: 4.6572,
    lng_destino: -74.0618,
    lat_gps: 4.6574,
    lng_gps: -74.0621,
    distancia_metros: 38,
    nota_clinica: "Paciente alerta y orientado. PA 150/93, FC 91, SpO₂ 94%. Herida esternal en proceso de cicatrización, sin signos de infección. Se administró Furosemida 40mg IV según orden médica. Paciente refiere mejoría del edema en MMII. Plan: continuar medicación, repetir control mañana.",
    estado: "verificado",
    timestamp_llegada: "2026-05-08T09:02:14",
  },
  {
    id: 7,
    paciente: "Carlos Mendoza Ruiz",
    profesional: "Sandra Muñoz",
    tipo: "Enfermería domiciliaria — visita fantasma",
    fecha: "2026-05-07",
    hora_inicio: "10:15",
    hora_fin: "10:52",
    lat_destino: 4.6572,
    lng_destino: -74.0618,
    lat_gps: 4.6901,
    lng_gps: -74.0312,
    distancia_metros: 4200,
    nota_clinica: "Se realiza valoración de paciente. PA 148/90, FC 88, SpO₂ 95%. Evolución estable.",
    estado: "irregularidad",
    timestamp_llegada: "2026-05-07T10:15:33",
  },
  {
    id: 2,
    paciente: "María Fernanda Gómez",
    profesional: "Diana Roa",
    tipo: "Fisioterapia respiratoria",
    fecha: "2026-05-09",
    hora_inicio: "08:30",
    hora_fin: "09:15",
    lat_destino: 4.6742,
    lng_destino: -74.0489,
    lat_gps: 4.6745,
    lng_gps: -74.0486,
    distancia_metros: 42,
    nota_clinica: "Se realiza sesión de fisioterapia respiratoria con técnicas de drenaje postural y respiración diafragmática. SpO₂ inicial 88%, al finalizar 92%. Paciente tolera bien el ejercicio. Se educa a cuidador sobre posiciones de drenaje. Se recomienda aumentar sesión a 60 min a partir de próxima visita.",
    estado: "verificado",
    timestamp_llegada: "2026-05-09T08:30:07",
  },
  {
    id: 3,
    paciente: "Jorge Andrés Palacio",
    profesional: "Jorge Leal",
    tipo: "Curación pie diabético",
    fecha: "2026-05-08",
    hora_inicio: "11:00",
    hora_fin: "11:35",
    lat_destino: 4.6398,
    lng_destino: -74.1102,
    lat_gps: 4.6401,
    lng_gps: -74.1099,
    distancia_metros: 45,
    nota_clinica: "Se realiza curación de úlcera plantar derecha. Herida con mejoría evidente, reducción aproximada del 40% respecto a primera valoración. No se observan signos de infección. Se aplica apósito hidrocoloide. Glucemia capilar: 152 mg/dL en ayunas. Se refuerza educación sobre cuidado del pie diabético e importancia de calzado adecuado.",
    estado: "verificado",
    timestamp_llegada: "2026-05-08T11:00:22",
  },
];
