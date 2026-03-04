<div align="center">

<br/>

# XIMCA · Frontend

### Sistema de Gestión Clínica para Medicina Estética

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Estado](https://img.shields.io/badge/estado-producción-brightgreen)]()

<br/>

> Proyecto colaborativo en producción activa con clientes reales en el sector de medicina estética colombiana.
> Este repositorio contiene el frontend en Next.js. El backend en Laravel se encuentra en un repositorio separado.

<br/>

</div>

---

## El problema que resuelve

Las clínicas de medicina estética con múltiples médicos coordinaban su operación con agendas físicas, hojas de Excel y registros en papel. Eso generaba:

- Citas duplicadas y conflictos entre médicos
- Historial clínico disperso sin trazabilidad real
- Riesgo legal por documentación incompleta o modificable
- Imposibilidad de analizar ingresos y procedimientos en tiempo real

XIMCA reemplaza todo eso con una plataforma digital centralizada, segura y diseñada específicamente para el contexto sanitario colombiano.

**Hoy en producción con 2 clínicas activas.**

---

## Funcionalidades

### Gestión clínica interna

- **Registro de pacientes** — formulario multi-paso con validación en tiempo real, cálculo automático de IMC y selector de procedimientos con precios en COP
- **Historial clínico** — visualización completa por paciente con todos sus registros, fechas, remitentes y estados
- **Principio de inmutabilidad** — los registros no pueden modificarse una vez creados; cualquier corrección genera un nuevo registro, preservando la trazabilidad de auditoría
- **Estados de registro** — `EN_ESPERA`, `CONFIRMADO` y `CANCELADO`; solo los confirmados se contabilizan en estadísticas financieras
- **Galería antes/después** — carga y gestión de imágenes clínicas comparativas por tratamiento

### Control de acceso por roles

| Rol | Acceso |
|---|---|
| `ADMIN` — Médico Líder | Gestión completa: pacientes, registros, estadísticas, imágenes, todos los remitentes |
| `REMITENTE` — Médico Colaborador | Solo sus propios pacientes y registros; sin acceso a estadísticas ni datos de otros colaboradores |

### Panel de estadísticas *(solo ADMIN)*

- Ingresos del periodo actual vs. mes anterior (variación porcentual)
- Nuevos pacientes, registros clínicos y procedimientos realizados
- Top procedimientos por ingresos generados
- Top procedimientos por demanda
- Desglose de ingresos y pacientes por remitente (histórico y periodo actual)

### Landing page pública

Sitio de presentación de la clínica integrado en el mismo proyecto: servicios, galería de resultados, testimonios, sección educativa y contacto por WhatsApp.

---

## Arquitectura y decisiones técnicas

Arquitectura **desacoplada**: el frontend se comunica con una API REST en Laravel 11 a través de `fetch` con autenticación por cookie (Laravel Sanctum + CSRF).

```
src/
├── app/                     # Next.js App Router — páginas y rutas
│   ├── patients/[id]/       # Historial y detalle de registros por paciente
│   ├── register-patient/    # Formulario de registro clínico
│   ├── stats/               # Dashboard de estadísticas
│   ├── control-images/      # Gestión de imágenes
│   └── login/               # Autenticación
│
├── components/              # Componentes globales reutilizables
│   ├── AuthGuard.tsx        # Protección de rutas por sesión
│   └── RoleGuard.tsx        # Protección de rutas por rol
│
├── features/                # Módulos organizados por dominio
│   ├── auth/                # AuthContext — estado global de sesión
│   ├── home/                # Secciones de la landing page
│   ├── patients/            # Lista, historial y detalle de registros
│   ├── post-login/          # Formulario multi-paso y componentes de registro
│   ├── control-images/      # CRUD de imágenes clínicas
│   └── stats/               # Componentes y servicios de estadísticas
│
├── layouts/                 # MainLayout (Header + Footer)
├── config/                  # Tokens de color y configuración global
└── utils/                   # Utilidades (generador de URLs WhatsApp, etc.)
```

### Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 con App Router |
| UI | React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Fetching y caché | SWR + `fetch` nativo |
| Autenticación | Laravel Sanctum (sesión por cookie) |
| Notificaciones | react-hot-toast |
| Íconos | Heroicons + Lucide React |

---

## Flujo del registro clínico

El formulario de alta de un paciente sigue un **wizard de 3 pasos** con indicador de progreso lateral:

```
Paso 1 — Datos del paciente
  Nombre, cédula, fecha de nacimiento, sexo biológico, celular
  Edad calculada automáticamente con validación de rango

Paso 2 — Evaluación clínica
  Peso y estatura → IMC calculado en tiempo real con clasificación OMS
  Antecedentes médicos relevantes

Paso 3 — Procedimientos
  Selector agrupado: Zonas / Láser / Post-operatorio / Otros
  Precio individual por procedimiento en COP (formato automático)
  Notas clínicas del registro
```

Una vez completado el wizard, se realizan 3 llamadas secuenciales a la API: creación del paciente → creación de la evaluación → creación de los procedimientos asociados.

---

## Autenticación y seguridad en el frontend

- **`AuthContext`** — estado global de sesión con verificación automática al cargar la aplicación (`/api/v1/me`)
- **`AuthGuard`** — bloquea el acceso a cualquier ruta protegida si no hay sesión activa
- **`RoleGuard`** — restringe rutas específicas según el rol del usuario autenticado (ej: estadísticas solo para `ADMIN`)
- **CSRF** — todas las peticiones mutables incluyen el token `XSRF-TOKEN` obtenido de la cookie de Sanctum
- **Logout** — cierra sesión en el backend y limpia el estado global antes de redirigir

---

## Cómo correr el proyecto

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/ximca-frontend.git
cd ximca-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local y agregar:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

> **Requisito:** el backend de XIMCA en Laravel debe estar corriendo antes de usar el frontend. Ver el [repositorio del backend](#) para instrucciones de instalación.

---

## Equipo

XIMCA es un proyecto construido en colaboración para clientes reales del sector de medicina estética en Colombia. Ambas participamos en frontend y backend; cada una lideró un área distinta.

| | Liderazgo | Participación |
|---|---|---|
| **[@ximenabaquero](https://github.com/ximenabaquero)** | Frontend — arquitectura, componentes, UI/UX, autenticación, formularios y estadísticas | Colaboración en backend |
| **[@karol-cc](https://github.com/karol-cc)** | Backend — API REST, base de datos, lógica de negocio, seguridad | Colaboración en frontend |

---

<div align="center">
<sub>Desarrollado con ❤️ para el sector de medicina estética en Colombia.</sub>
</div>
