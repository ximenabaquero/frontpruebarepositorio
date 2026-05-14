export type EstadoServicio = "cumplido" | "pendiente" | "no_cumplido";

export type ServicioTimeline = {
  id: number;
  fecha: string;
  servicio: string;
  profesional: string;
  entidad?: string;
  estado: EstadoServicio;
  nota?: string;
};

export type SignoVital = {
  fecha: string;
  pa_sistolica: number;
  pa_diastolica: number;
  fc: number;
  spo2: number;
  glucemia?: number;
};

export type DetallePaciente = {
  id: number;
  nombre: string;
  cedula: string;
  fecha_nacimiento: string;
  diagnostico: string;
  medico: string;
  eps: string;
  plan: string;
  fecha_alta: string;
  timeline: ServicioTimeline[];
  vitales: SignoVital[];
};

export const detallesPacientes: DetallePaciente[] = [
  {
    id: 1,
    nombre: "Carlos Mendoza Ruiz",
    cedula: "79.543.210",
    fecha_nacimiento: "1961-03-14",
    diagnostico: "ICC post-trasplante cardíaco",
    medico: "Dr. Andrés Ospina",
    eps: "EPS Sura",
    plan: "Enfermería diaria + cardiología 3x/sem + medicamentos IV",
    fecha_alta: "2026-05-03",
    timeline: [
      { id: 1, fecha: "2026-05-03", servicio: "Alta hospitalaria + entrega de plan", profesional: "Dr. Andrés Ospina", entidad: "Hospital Universitario Nacional", estado: "cumplido" },
      { id: 2, fecha: "2026-05-04", servicio: "Visita enfermería — signos vitales", profesional: "Sandra Muñoz", entidad: "IPS Norte", estado: "cumplido", nota: "PA 142/88, SpO₂ 96%" },
      { id: 3, fecha: "2026-05-05", servicio: "Visita enfermería + medicación IV", profesional: "Sandra Muñoz", entidad: "IPS Norte", estado: "cumplido" },
      { id: 4, fecha: "2026-05-06", servicio: "Cardiología domiciliaria", profesional: "Dr. Andrés Ospina", entidad: "IPS Norte", estado: "cumplido" },
      { id: 5, fecha: "2026-05-07", servicio: "Visita enfermería", profesional: "Sandra Muñoz", entidad: "IPS Norte", estado: "no_cumplido", nota: "GPS no verificado — visita fantasma reportada" },
      { id: 6, fecha: "2026-05-08", servicio: "Visita enfermería + curación", profesional: "Jorge Leal", entidad: "IPS Norte", estado: "cumplido" },
      { id: 7, fecha: "2026-05-09", servicio: "Cardiología domiciliaria", profesional: "Dr. Andrés Ospina", entidad: "IPS Norte", estado: "cumplido" },
      { id: 8, fecha: "2026-05-10", servicio: "Visita enfermería — signos vitales", profesional: "Sandra Muñoz", entidad: "IPS Norte", estado: "no_cumplido", nota: "Sin confirmar — PA 158/98 en último registro" },
      { id: 9, fecha: "2026-05-11", servicio: "Visita enfermería", profesional: "Sandra Muñoz", entidad: "IPS Norte", estado: "pendiente" },
      { id: 10, fecha: "2026-05-13", servicio: "Cardiología domiciliaria", profesional: "Dr. Andrés Ospina", entidad: "IPS Norte", estado: "pendiente" },
    ],
    vitales: [
      { fecha: "May 03", pa_sistolica: 145, pa_diastolica: 90, fc: 88, spo2: 95 },
      { fecha: "May 04", pa_sistolica: 142, pa_diastolica: 88, fc: 85, spo2: 96 },
      { fecha: "May 05", pa_sistolica: 148, pa_diastolica: 92, fc: 90, spo2: 94 },
      { fecha: "May 06", pa_sistolica: 140, pa_diastolica: 86, fc: 82, spo2: 97 },
      { fecha: "May 07", pa_sistolica: 155, pa_diastolica: 95, fc: 95, spo2: 93 },
      { fecha: "May 08", pa_sistolica: 150, pa_diastolica: 93, fc: 91, spo2: 94 },
      { fecha: "May 09", pa_sistolica: 146, pa_diastolica: 89, fc: 87, spo2: 95 },
      { fecha: "May 10", pa_sistolica: 158, pa_diastolica: 98, fc: 98, spo2: 92 },
    ],
  },
  {
    id: 2,
    nombre: "María Fernanda Gómez",
    cedula: "52.876.341",
    fecha_nacimiento: "1958-07-22",
    diagnostico: "EPOC severo + HTA",
    medico: "Dra. Claudia Restrepo",
    eps: "EPS Sura",
    plan: "Fisioterapia respiratoria 5x/sem + oxígeno domiciliario",
    fecha_alta: "2026-04-27",
    timeline: [
      { id: 1, fecha: "2026-04-27", servicio: "Alta hospitalaria + plan de cuidado", profesional: "Dra. Claudia Restrepo", entidad: "Clínica del Country", estado: "cumplido" },
      { id: 2, fecha: "2026-04-28", servicio: "Fisioterapia respiratoria", profesional: "Diana Roa", entidad: "IPS SurOccidente", estado: "cumplido", nota: "SpO₂ 91% al inicio, 95% al finalizar" },
      { id: 3, fecha: "2026-04-29", servicio: "Fisioterapia respiratoria + oxígeno", profesional: "Diana Roa", entidad: "IPS SurOccidente", estado: "cumplido" },
      { id: 4, fecha: "2026-04-30", servicio: "Valoración médica domiciliaria", profesional: "Dra. Claudia Restrepo", entidad: "IPS SurOccidente", estado: "cumplido" },
      { id: 5, fecha: "2026-05-01", servicio: "Fisioterapia respiratoria", profesional: "Diana Roa", entidad: "IPS SurOccidente", estado: "cumplido" },
      { id: 6, fecha: "2026-05-05", servicio: "Fisioterapia respiratoria", profesional: "Diana Roa", entidad: "IPS SurOccidente", estado: "cumplido" },
      { id: 7, fecha: "2026-05-07", servicio: "Fisioterapia respiratoria", profesional: "Diana Roa", entidad: "IPS SurOccidente", estado: "cumplido" },
      { id: 8, fecha: "2026-05-09", servicio: "Valoración neumología domiciliaria", profesional: "Dra. Claudia Restrepo", entidad: "IPS SurOccidente", estado: "cumplido", nota: "SpO₂ 88% en reposo — ajuste de plan" },
      { id: 9, fecha: "2026-05-11", servicio: "Fisioterapia respiratoria", profesional: "Diana Roa", entidad: "IPS SurOccidente", estado: "pendiente" },
      { id: 10, fecha: "2026-05-12", servicio: "Fisioterapia respiratoria", profesional: "Diana Roa", entidad: "IPS SurOccidente", estado: "pendiente" },
    ],
    vitales: [
      { fecha: "Abr 28", pa_sistolica: 148, pa_diastolica: 92, fc: 82, spo2: 91 },
      { fecha: "Abr 30", pa_sistolica: 145, pa_diastolica: 90, fc: 80, spo2: 92 },
      { fecha: "May 01", pa_sistolica: 143, pa_diastolica: 88, fc: 78, spo2: 93 },
      { fecha: "May 05", pa_sistolica: 140, pa_diastolica: 86, fc: 76, spo2: 94 },
      { fecha: "May 07", pa_sistolica: 142, pa_diastolica: 87, fc: 79, spo2: 93 },
      { fecha: "May 09", pa_sistolica: 147, pa_diastolica: 91, fc: 83, spo2: 88 },
    ],
  },
  {
    id: 3,
    nombre: "Jorge Andrés Palacio",
    cedula: "1.023.456.789",
    fecha_nacimiento: "1972-11-08",
    diagnostico: "Diabetes tipo 2 + neuropatía periférica",
    medico: "Dr. Ricardo Vargas",
    eps: "EPS Sura",
    plan: "Glucometría diaria + curación pie diabético 3x/sem",
    fecha_alta: "2026-04-20",
    timeline: [
      { id: 1, fecha: "2026-04-20", servicio: "Alta + entrega glucómetro + educación", profesional: "Dr. Ricardo Vargas", entidad: "Hospital El Tunal", estado: "cumplido" },
      { id: 2, fecha: "2026-04-21", servicio: "Curación pie diabético", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "cumplido" },
      { id: 3, fecha: "2026-04-23", servicio: "Curación pie diabético", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "cumplido" },
      { id: 4, fecha: "2026-04-25", servicio: "Curación pie diabético + valoración", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "cumplido", nota: "Herida con mejoría — reducción 30%" },
      { id: 5, fecha: "2026-04-28", servicio: "Curación pie diabético", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "cumplido" },
      { id: 6, fecha: "2026-04-30", servicio: "Curación pie diabético", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "cumplido" },
      { id: 7, fecha: "2026-05-02", servicio: "Valoración médica + glucometría", profesional: "Dr. Ricardo Vargas", entidad: "IPS Chapinero", estado: "cumplido", nota: "Glucemia en ayunas 195 mg/dL — ajuste insulina" },
      { id: 8, fecha: "2026-05-05", servicio: "Curación pie diabético", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "cumplido" },
      { id: 9, fecha: "2026-05-08", servicio: "Curación pie diabético", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "cumplido" },
      { id: 10, fecha: "2026-05-11", servicio: "Curación pie diabético", profesional: "Jorge Leal", entidad: "IPS Chapinero", estado: "pendiente" },
    ],
    vitales: [
      { fecha: "Abr 21", pa_sistolica: 138, pa_diastolica: 84, fc: 76, spo2: 97, glucemia: 210 },
      { fecha: "Abr 25", pa_sistolica: 135, pa_diastolica: 82, fc: 74, spo2: 97, glucemia: 195 },
      { fecha: "Abr 28", pa_sistolica: 132, pa_diastolica: 80, fc: 72, spo2: 98, glucemia: 180 },
      { fecha: "May 02", pa_sistolica: 136, pa_diastolica: 83, fc: 75, spo2: 97, glucemia: 195 },
      { fecha: "May 05", pa_sistolica: 130, pa_diastolica: 79, fc: 71, spo2: 98, glucemia: 165 },
      { fecha: "May 08", pa_sistolica: 128, pa_diastolica: 78, fc: 70, spo2: 98, glucemia: 152 },
    ],
  },
];
