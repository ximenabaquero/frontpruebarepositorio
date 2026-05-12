export type Riesgo = "alto" | "medio" | "bajo";
export type Tendencia = "mejorando" | "estable" | "deteriorando";

export type PacientePagador = {
  id: number;
  nombre: string;
  cedula: string;
  diagnostico: string;
  dias_post_alta: number;
  riesgo: Riesgo;
  riesgo_pct: number;
  adherencia: number;
  tendencia: Tendencia;
  eps: string;
  medico: string;
};

export const pacientesPagador: PacientePagador[] = [
  { id: 1, nombre: "Carlos Mendoza Ruiz", cedula: "79.543.210", diagnostico: "ICC post-trasplante cardíaco", dias_post_alta: 8, riesgo: "alto", riesgo_pct: 94, adherencia: 62, tendencia: "deteriorando", eps: "EPS Sura", medico: "Dr. Andrés Ospina" },
  { id: 2, nombre: "María Fernanda Gómez", cedula: "52.876.341", diagnostico: "EPOC severo + HTA", dias_post_alta: 14, riesgo: "alto", riesgo_pct: 78, adherencia: 71, tendencia: "estable", eps: "EPS Sura", medico: "Dra. Claudia Restrepo" },
  { id: 3, nombre: "Jorge Andrés Palacio", cedula: "1.023.456.789", diagnostico: "Diabetes tipo 2 + neuropatía", dias_post_alta: 21, riesgo: "alto", riesgo_pct: 61, adherencia: 74, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Ricardo Vargas" },
  { id: 4, nombre: "Ana Lucía Torres", cedula: "53.112.233", diagnostico: "ACV isquémico — rehabilitación", dias_post_alta: 5, riesgo: "alto", riesgo_pct: 88, adherencia: 55, tendencia: "deteriorando", eps: "EPS Sura", medico: "Dra. Marcela Quiroga" },
  { id: 5, nombre: "Roberto Silva Montoya", cedula: "17.234.567", diagnostico: "Insuficiencia renal crónica", dias_post_alta: 30, riesgo: "alto", riesgo_pct: 72, adherencia: 68, tendencia: "deteriorando", eps: "EPS Sura", medico: "Dr. Hernán Cárdenas" },
  { id: 6, nombre: "Claudia Peña Vásquez", cedula: "43.987.654", diagnostico: "Cáncer pulmón — quimioterapia", dias_post_alta: 12, riesgo: "alto", riesgo_pct: 81, adherencia: 85, tendencia: "estable", eps: "EPS Sura", medico: "Dra. Pilar Sánchez" },
  { id: 7, nombre: "Héctor Ramos Díaz", cedula: "11.345.678", diagnostico: "Cirrosis hepática compensada", dias_post_alta: 18, riesgo: "alto", riesgo_pct: 65, adherencia: 79, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Mauricio Lara" },
  { id: 8, nombre: "Sandra Gómez Herrera", cedula: "31.765.432", diagnostico: "HTA + cardiopatía isquémica", dias_post_alta: 25, riesgo: "alto", riesgo_pct: 69, adherencia: 91, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Andrés Ospina" },
  { id: 9, nombre: "Felipe Mora Jiménez", cedula: "1.012.345.678", diagnostico: "Leucemia linfocítica crónica", dias_post_alta: 9, riesgo: "alto", riesgo_pct: 77, adherencia: 88, tendencia: "estable", eps: "EPS Sura", medico: "Dra. Natalia Forero" },
  { id: 10, nombre: "Laura Pérez Castillo", cedula: "52.456.789", diagnostico: "Lupus eritematoso sistémico", dias_post_alta: 35, riesgo: "alto", riesgo_pct: 63, adherencia: 93, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Alejandra Cruz" },
  { id: 11, nombre: "Ramiro Suárez Bermúdez", cedula: "19.876.543", diagnostico: "Fractura cadera — post-quirúrgico", dias_post_alta: 7, riesgo: "alto", riesgo_pct: 58, adherencia: 95, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Juan Pablo Ríos" },
  { id: 12, nombre: "Inés Mora Álvarez", cedula: "41.234.567", diagnostico: "Demencia con parkinsonismo", dias_post_alta: 42, riesgo: "alto", riesgo_pct: 70, adherencia: 66, tendencia: "deteriorando", eps: "EPS Sura", medico: "Dr. Gabriel Parra" },
  { id: 13, nombre: "Luis Ángel Mora", cedula: "80.123.456", diagnostico: "Post-operatorio rodilla (prótesis)", dias_post_alta: 10, riesgo: "medio", riesgo_pct: 48, adherencia: 92, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Felipe Arango" },
  { id: 14, nombre: "Gloria Inés Castro", cedula: "41.567.890", diagnostico: "Herida quirúrgica abdominal", dias_post_alta: 6, riesgo: "medio", riesgo_pct: 42, adherencia: 97, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Camilo Torres" },
  { id: 15, nombre: "Patricia Vega Rodríguez", cedula: "52.234.567", diagnostico: "Infección urinaria complicada", dias_post_alta: 4, riesgo: "medio", riesgo_pct: 51, adherencia: 88, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Sofía Mendez" },
  { id: 16, nombre: "Andrés Gutiérrez Ríos", cedula: "79.654.321", diagnostico: "EPOC moderado + tabaquismo", dias_post_alta: 28, riesgo: "medio", riesgo_pct: 55, adherencia: 74, tendencia: "estable", eps: "EPS Sura", medico: "Dra. Claudia Restrepo" },
  { id: 17, nombre: "Esperanza López Torres", cedula: "30.123.456", diagnostico: "DM2 + retinopatía diabética", dias_post_alta: 20, riesgo: "medio", riesgo_pct: 47, adherencia: 80, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Ricardo Vargas" },
  { id: 18, nombre: "Camilo Herrera Vargas", cedula: "1.020.345.678", diagnostico: "Fractura vertebral L4", dias_post_alta: 15, riesgo: "medio", riesgo_pct: 44, adherencia: 86, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Juan Pablo Ríos" },
  { id: 19, nombre: "Nohora Bernal Salcedo", cedula: "40.987.654", diagnostico: "Post-parto complicado + anemia", dias_post_alta: 8, riesgo: "medio", riesgo_pct: 39, adherencia: 91, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Pilar Sánchez" },
  { id: 20, nombre: "Víctor Zárate Peña", cedula: "79.234.567", diagnostico: "Cardiopatía congénita adulto", dias_post_alta: 33, riesgo: "medio", riesgo_pct: 53, adherencia: 77, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Andrés Ospina" },
  { id: 21, nombre: "Liliana Castro Mejía", cedula: "52.345.678", diagnostico: "Fibromialgia severa", dias_post_alta: 22, riesgo: "medio", riesgo_pct: 41, adherencia: 69, tendencia: "deteriorando", eps: "EPS Sura", medico: "Dra. Alejandra Cruz" },
  { id: 22, nombre: "Jairo Medina Cárdenas", cedula: "79.876.543", diagnostico: "Hepatitis C crónica", dias_post_alta: 45, riesgo: "medio", riesgo_pct: 46, adherencia: 83, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Mauricio Lara" },
  { id: 23, nombre: "Diana Rojas Serrano", cedula: "53.456.789", diagnostico: "Artritis reumatoide activa", dias_post_alta: 17, riesgo: "medio", riesgo_pct: 50, adherencia: 89, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Natalia Forero" },
  { id: 24, nombre: "Guillermo Parra Ossa", cedula: "19.234.567", diagnostico: "Psoriasis severa + depresión", dias_post_alta: 11, riesgo: "medio", riesgo_pct: 43, adherencia: 75, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Gabriel Parra" },
  { id: 25, nombre: "Beatriz Ávila Torres", cedula: "41.876.543", diagnostico: "Osteoporosis + fractura muñeca", dias_post_alta: 19, riesgo: "medio", riesgo_pct: 38, adherencia: 94, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Felipe Arango" },
  { id: 26, nombre: "Sebastián López García", cedula: "1.014.567.890", diagnostico: "Asma severa persistente", dias_post_alta: 13, riesgo: "medio", riesgo_pct: 45, adherencia: 87, tendencia: "estable", eps: "EPS Sura", medico: "Dra. Claudia Restrepo" },
  { id: 27, nombre: "Paola Quintero Rueda", cedula: "52.567.890", diagnostico: "Endometriosis + anemia", dias_post_alta: 9, riesgo: "medio", riesgo_pct: 37, adherencia: 96, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Sofía Mendez" },
  { id: 28, nombre: "Rodrigo Acosta Niño", cedula: "80.456.789", diagnostico: "Hernia discal L5-S1", dias_post_alta: 16, riesgo: "medio", riesgo_pct: 40, adherencia: 82, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Ricardo Vargas" },
  { id: 29, nombre: "Marcela Vargas Duque", cedula: "43.234.567", diagnostico: "Hipotiroidismo + obesidad", dias_post_alta: 38, riesgo: "medio", riesgo_pct: 35, adherencia: 78, tendencia: "estable", eps: "EPS Sura", medico: "Dra. Pilar Sánchez" },
  { id: 30, nombre: "Ernesto Salcedo Mora", cedula: "17.456.789", diagnostico: "Arritmia cardíaca — monitoreo", dias_post_alta: 24, riesgo: "medio", riesgo_pct: 49, adherencia: 90, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Hernán Cárdenas" },
  { id: 31, nombre: "Alexandra Ríos Botero", cedula: "31.234.567", diagnostico: "Várices + insuficiencia venosa", dias_post_alta: 7, riesgo: "medio", riesgo_pct: 33, adherencia: 98, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Alejandra Cruz" },
  { id: 32, nombre: "Hernando Muñoz Ariza", cedula: "79.345.678", diagnostico: "Glaucoma avanzado bilateral", dias_post_alta: 29, riesgo: "medio", riesgo_pct: 42, adherencia: 84, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Gabriel Parra" },
  { id: 33, nombre: "Olga Patricia Sánchez", cedula: "40.345.678", diagnostico: "Menopausia + osteopenia", dias_post_alta: 40, riesgo: "medio", riesgo_pct: 31, adherencia: 92, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Marcela Quiroga" },
  { id: 34, nombre: "Darío Bermúdez Fula", cedula: "11.567.890", diagnostico: "EPOC leve — seguimiento", dias_post_alta: 50, riesgo: "bajo", riesgo_pct: 28, adherencia: 95, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Claudia Restrepo" },
  { id: 35, nombre: "Margarita Forero Aya", cedula: "41.123.456", diagnostico: "HTA controlada + dislipidemia", dias_post_alta: 55, riesgo: "bajo", riesgo_pct: 22, adherencia: 98, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Hernán Cárdenas" },
  { id: 36, nombre: "Tomás Castaño Ríos", cedula: "1.016.789.012", diagnostico: "Fractura clavícula — consolidada", dias_post_alta: 30, riesgo: "bajo", riesgo_pct: 18, adherencia: 100, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Felipe Arango" },
  { id: 37, nombre: "Isabel Cuervo López", cedula: "53.678.901", diagnostico: "Gastritis crónica + anemia leve", dias_post_alta: 45, riesgo: "bajo", riesgo_pct: 20, adherencia: 97, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Pilar Sánchez" },
  { id: 38, nombre: "Fernando Montoya Salazar", cedula: "71.345.678", diagnostico: "Post-cirugía hernia inguinal", dias_post_alta: 14, riesgo: "bajo", riesgo_pct: 15, adherencia: 99, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Camilo Torres" },
  { id: 39, nombre: "Constanza Mejía Patiño", cedula: "43.678.901", diagnostico: "Lumbalgia crónica — fisioterapia", dias_post_alta: 25, riesgo: "bajo", riesgo_pct: 24, adherencia: 88, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Juan Pablo Ríos" },
  { id: 40, nombre: "Santiago Reyes Morales", cedula: "1.018.901.234", diagnostico: "Rinitis alérgica + sinusitis", dias_post_alta: 18, riesgo: "bajo", riesgo_pct: 12, adherencia: 100, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Ricardo Vargas" },
  { id: 41, nombre: "Luz Marina Téllez García", cedula: "30.456.789", diagnostico: "Dermatitis atópica severa", dias_post_alta: 22, riesgo: "bajo", riesgo_pct: 19, adherencia: 91, tendencia: "estable", eps: "EPS Sura", medico: "Dra. Natalia Forero" },
  { id: 42, nombre: "Álvaro Montoya Nieto", cedula: "79.456.789", diagnostico: "Gota + hiperuricemia", dias_post_alta: 35, riesgo: "bajo", riesgo_pct: 17, adherencia: 95, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Alejandra Cruz" },
  { id: 43, nombre: "Elsa Patiño Cardona", cedula: "41.890.123", diagnostico: "Migraña crónica — profilaxis", dias_post_alta: 48, riesgo: "bajo", riesgo_pct: 21, adherencia: 93, tendencia: "estable", eps: "EPS Sura", medico: "Dr. Gabriel Parra" },
  { id: 44, nombre: "Ricardo Cano Estrada", cedula: "80.567.890", diagnostico: "Post-apendicectomía — control", dias_post_alta: 10, riesgo: "bajo", riesgo_pct: 10, adherencia: 100, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Camilo Torres" },
  { id: 45, nombre: "Viviana Galvis Roa", cedula: "53.789.012", diagnostico: "Ansiedad + trastorno del sueño", dias_post_alta: 32, riesgo: "bajo", riesgo_pct: 16, adherencia: 89, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Marcela Quiroga" },
  { id: 46, nombre: "Julián Ospina Restrepo", cedula: "1.022.123.456", diagnostico: "Esguince tobillo grado II", dias_post_alta: 12, riesgo: "bajo", riesgo_pct: 8, adherencia: 100, tendencia: "mejorando", eps: "EPS Sura", medico: "Dr. Felipe Arango" },
  { id: 47, nombre: "Adriana Bejarano Cano", cedula: "52.890.123", diagnostico: "Hipotiroidismo controlado", dias_post_alta: 60, riesgo: "bajo", riesgo_pct: 11, adherencia: 98, tendencia: "mejorando", eps: "EPS Sura", medico: "Dra. Sofía Mendez" },
];
