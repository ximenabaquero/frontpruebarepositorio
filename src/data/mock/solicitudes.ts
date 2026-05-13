export type Complejidad = "alta" | "media" | "baja";
export type Urgencia = "urgente" | "programado";
export type EstadoSolicitud = "pendiente" | "aprobado" | "aprobado_condiciones" | "negado" | "mas_info";

export type Solicitud = {
  id: number;
  paciente: string;
  cedula: string;
  diagnostico: string;
  complejidad: Complejidad;
  plan_nombre: string;
  plan_propuesto: string;
  medico_solicitante: string;
  hospital: string;
  costo_estimado: number;
  tipo_servicio: string;
  urgencia: Urgencia;
  estado: EstadoSolicitud;
  fecha: string;
};

export const solicitudes: Solicitud[] = [
  {
    id: 1,
    paciente: "Carlos Mendoza Ruiz",
    cedula: "79.543.210",
    diagnostico: "ICC post-trasplante cardíaco",
    complejidad: "alta",
    plan_nombre: "PHD",
    plan_propuesto: "Enfermería diaria + cardiología 3x/sem + medicamentos IV",
    medico_solicitante: "Dr. Andrés Ospina",
    hospital: "Fundación Cardioinfantil",
    costo_estimado: 4800000,
    tipo_servicio: "Enfermería domiciliaria",
    urgencia: "urgente",
    estado: "pendiente",
    fecha: "2026-05-11",
  },
  {
    id: 2,
    paciente: "María Fernanda Gómez",
    cedula: "52.876.341",
    diagnostico: "EPOC severo + HTA",
    complejidad: "alta",
    plan_nombre: "PAD",
    plan_propuesto: "Fisioterapia respiratoria 5x/sem + oxígeno domiciliario",
    medico_solicitante: "Dra. Claudia Restrepo",
    hospital: "Hospital San Ignacio",
    costo_estimado: 3200000,
    tipo_servicio: "Fisioterapia respiratoria",
    urgencia: "urgente",
    estado: "pendiente",
    fecha: "2026-05-11",
  },
  {
    id: 3,
    paciente: "Jorge Andrés Palacio",
    cedula: "1.023.456.789",
    diagnostico: "Diabetes tipo 2 + neuropatía periférica",
    complejidad: "media",
    plan_nombre: "Curaciones en Casa",
    plan_propuesto: "Glucometría diaria + curación pie diabético 3x/sem",
    medico_solicitante: "Dr. Ricardo Vargas",
    hospital: "Clínica Palermo",
    costo_estimado: 1950000,
    tipo_servicio: "Curación herida",
    urgencia: "programado",
    estado: "pendiente",
    fecha: "2026-05-10",
  },
  {
    id: 4,
    paciente: "Luis Ángel Mora",
    cedula: "80.123.456",
    diagnostico: "Post-operatorio rodilla (prótesis)",
    complejidad: "media",
    plan_nombre: "PARD",
    plan_propuesto: "Fisioterapia 4x/sem durante 6 semanas",
    medico_solicitante: "Dr. Felipe Arango",
    hospital: "Clínica del Country",
    costo_estimado: 2400000,
    tipo_servicio: "Fisioterapia",
    urgencia: "programado",
    estado: "pendiente",
    fecha: "2026-05-10",
  },
  {
    id: 5,
    paciente: "Gloria Inés Castro",
    cedula: "41.567.890",
    diagnostico: "Herida quirúrgica abdominal",
    complejidad: "baja",
    plan_nombre: "Curaciones en Casa",
    plan_propuesto: "Curación y valoración de herida 3x/sem",
    medico_solicitante: "Dr. Camilo Torres",
    hospital: "Clínica Shaio",
    costo_estimado: 890000,
    tipo_servicio: "Curación herida",
    urgencia: "programado",
    estado: "pendiente",
    fecha: "2026-05-09",
  },
  {
    id: 6,
    paciente: "Patricia Vega Rodríguez",
    cedula: "52.234.567",
    diagnostico: "Infección urinaria complicada",
    complejidad: "alta",
    plan_nombre: "PAD",
    plan_propuesto: "Antibiótico IV domiciliario por 10 días",
    medico_solicitante: "Dra. Sofía Mendez",
    hospital: "Hospital Universitario Mayor",
    costo_estimado: 3600000,
    tipo_servicio: "Infusión IV",
    urgencia: "urgente",
    estado: "pendiente",
    fecha: "2026-05-09",
  },
  {
    id: 7,
    paciente: "Ramiro Suárez Bermúdez",
    cedula: "19.876.543",
    diagnostico: "Fractura cadera — post-quirúrgico",
    complejidad: "media",
    plan_nombre: "PARD",
    plan_propuesto: "Fisioterapia + enfermería 5x/sem por 8 semanas",
    medico_solicitante: "Dr. Juan Pablo Ríos",
    hospital: "Clínica Reina Sofía",
    costo_estimado: 2800000,
    tipo_servicio: "Fisioterapia",
    urgencia: "programado",
    estado: "pendiente",
    fecha: "2026-05-08",
  },
  {
    id: 8,
    paciente: "Ana Lucía Torres",
    cedula: "53.112.233",
    diagnostico: "ACV isquémico — rehabilitación",
    complejidad: "alta",
    plan_nombre: "PHD",
    plan_propuesto: "Fonoaudiología + terapia ocupacional 4x/sem",
    medico_solicitante: "Dra. Marcela Quiroga",
    hospital: "Fundación Santa Fe",
    costo_estimado: 5100000,
    tipo_servicio: "Rehabilitación neurológica",
    urgencia: "urgente",
    estado: "pendiente",
    fecha: "2026-05-08",
  },
];
