# OLGA Healthtech — Flujo del Demo ICP (Pagador)
**Versión:** Post-reunión 12 mayo 2025  
**Deadline:** Viernes 15 de mayo  
**Actor objetivo:** Director / Coordinador / Gerente de EPS o Prepagada  
**Entregable:** URL pública navegable (Vercel o AWS Amplify) + demo en vivo ≤10 min

---

## Contexto general

El demo no es un producto ni un piloto real. Es un prototipo navegable con datos simulados que debe hacer que el pagador diga **"esto ya lo quiero usar"** en los primeros 10 minutos.

El sistema corre en **AWS** (autenticación por tokens, backups, separación de roles), desarrollado en **Next.js**, gestionado en la organización **GitHub de OLGA**. El desarrollador adapta una base preexistente con autenticación funcional.

### Usuarios del demo (2 roles para el viernes)
| Rol | Descripción |
|-----|-------------|
| **EPS** | Régimen contributivo o subsidiado — ve dashboard poblacional y autoriza servicios |
| **Prepagada / Régimen especial** | Lógica similar, población propia (ej. Ecopetrol) |

> Ambos roles ven las mismas 7 pantallas. La diferencia de estadísticas por perfil se define en fases posteriores.

---

## Flujo de 7 pantallas

```
Login → Dashboard → [Solicitudes de Autorización | Auditoría]
                         ↓
                  Lista de pacientes
                         ↓
                  Detalle de paciente
                         ↓
                  Evidencia de servicio → Auditoría y reportes
```

---

## Pantalla 1 — Login ✓ Sin cambios críticos

**Estado:** Base sólida. Ajuste menor recomendado.

### Qué tiene actualmente
- Selector de organización: EPS Sura · Compensar · Nueva EPS · Salud Total
- Campos: correo electrónico + contraseña
- Badge "Sistema de Acceso Privado"
- Aviso legal en footer

### Ajuste recomendado
Agregar subtítulo debajo del badge:

```
OLGA — Plataforma multi-pagador
EPS Contributiva · Subsidiada · Prepagada · Régimen Especial
```

### Notas técnicas
- Autenticación por tokens JWT (ya implementada por el dev)
- Cada rol recibe token diferente → acceso diferenciado por pantalla
- El logo central ("a" genérica) debería ser el wordmark "olga" para consistencia de marca

---

## Pantalla 2 — Dashboard ejecutivo

**Estado:** Existente — requiere reemplazo de los 4 tiles principales

### Tiles actuales → reemplazar por

| Tile actual | Reemplazar por |
|-------------|----------------|
| 47 Pacientes activos | **47 pacientes activos** — 12 alto · 23 medio · 12 bajo riesgo |
| 23 Verificados hoy | **5 alertas clínicas pendientes ⚠** (flag rojo prominente) |
| 8 Pendientes aprobación | **8 solicitudes por autorizar** (link clickeable → Pantalla 3) |
| $4.2M Listo a facturar | **Costo atención mes: $X / Presupuesto: $Y** (barra de progreso) |

### Sección adicional requerida
Franja inferior con **"Top 3 pacientes en riesgo de reingreso esta semana"**:
- Nombres clickeables → llevan directamente a Pantalla 5 (Detalle de paciente)
- Indicador de riesgo por color: 🔴 Alto / 🟡 Medio

### Mensaje que comunica
> El pagador no ve facturas — ve riesgo poblacional, alertas y presupuesto.

---

## Pantalla 3 — Solicitudes de Autorización ⭐ NUEVA

**Estado:** No existe. Es la pantalla más crítica para el ICP pagador.

### Por qué es crítica
En Colombia, ningún servicio domiciliario se presta sin autorización previa de la EPS (excepción: modalidad PGP). Esta es la pantalla donde el pagador toma decisiones de plata.

### Flujo real que representa
```
1. Hospital/médico solicita servicio domiciliario
2. EPS autoriza, niega o condiciona  ← ESTA PANTALLA
3. EPS asigna prestador              ← ESTA PANTALLA
4. Prestador presta el servicio
5. Servicio se verifica (GPS, firma, evidencia)
6. EPS audita y aprueba
7. Prestador factura y EPS paga
```

### Contenido de la pantalla

**Lista de solicitudes entrantes — columnas:**
| Campo | Descripción |
|-------|-------------|
| Paciente | Nombre + diagnóstico principal |
| Complejidad clínica | Alta / Media / Baja |
| Plan propuesto | Servicios solicitados (ej. "Enfermería 3x/semana + Fisioterapia 2x/semana") |
| Médico solicitante | Nombre + institución de origen |
| Hospital de origen | Clínica/hospital que da el alta |
| Costo estimado | Valor del plan completo |
| Soporte | Adjuntos: orden médica + historia clínica (PDF) |

**Botones de acción por solicitud:**
- ✅ **Aprobar**
- ⚙️ **Aprobar con condiciones** (modifica plan antes de aprobar)
- ❌ **Negar** (requiere justificación)
- 📋 **Solicitar más información**

**Filtros disponibles:**
- Por urgencia (Alta / Media / Baja)
- Por tipo de servicio (Enfermería, Fisioterapia, Terapia respiratoria…)
- Por complejidad clínica

### Datos simulados sugeridos (3 solicitudes de ejemplo)
1. **María García** — EPOC severo — Plan: Terapia resp. 5x/sem + Enfermería — $1.2M/mes — **Urgente**
2. **Carlos Ruiz** — Post-cirugía cadera — Plan: Fisioterapia 3x/sem — $780K/mes — **Media**
3. **Ana Pérez** — Falla cardíaca — Plan: Enfermería diaria + monitoreo — $2.1M/mes — **Alta**

---

## Pantalla 4 — Lista de pacientes

**Estado:** Existente — agregar 2 columnas nuevas

### Columnas actuales + nuevas

| Columna | Tipo | Detalle |
|---------|------|---------|
| Nombre | Texto | — |
| Diagnóstico | Texto | — |
| Días en programa | Número | — |
| Estado | Semáforo | Verde / Amarillo / Rojo |
| **Adherencia al plan** *(nueva)* | Badge color | 🟢 ≥90% · 🟡 70-89% · 🔴 <70% → alerta automática |
| **Tendencia clínica** *(nueva)* | Icono | ↑ mejorando · → estable · ↓ deteriorando |

### Filtros recomendados
- Por riesgo de reingreso
- Por adherencia al plan
- Por tipo de servicio activo

### Navegación
Click en cualquier paciente → **Pantalla 5 (Detalle de paciente)**

---

## Pantalla 5 — Detalle de paciente ⭐ NUEVA

**Estado:** No existe. Segunda pantalla más crítica.

### Por qué es crítica
Las EPS pagan planes integrales por patología, no servicios sueltos. Si el demo no muestra cumplimiento del plan ni evolución clínica, no habla el lenguaje del pagador.

> *"Pecamos por deficiencia o exceso porque no hay seguimiento de esta población."*  
> — Efraim Guerrero, Director Médico Ecopetrol

### Secciones de la pantalla

#### A. Datos básicos (header)
- Nombre completo · Edad · Diagnóstico principal · CIE-10
- EPS / Régimen · Días en programa · Estado actual (semáforo)
- Médico responsable · IPS prestadora asignada

#### B. Plan de manejo (timeline visual)
```
Servicios planeados vs. cumplidos vs. pendientes

[Semana 1] ████████████ Enfermería ✓  Fisio ✓  
[Semana 2] ████████░░░░ Enfermería ✓  Fisio ✗ (no cumplido)
[Semana 3] En curso...
```
- Barra de progreso total: **91% servicios completados**
- Alerta si adherencia < 70%

#### C. Evolución de signos vitales (gráfico simple)
Según diagnóstico, mostrar el vital más relevante:
| Diagnóstico | Vital a graficar |
|-------------|-----------------|
| Hipertensión / Falla cardíaca | Presión arterial (PA) |
| Diabetes | Glucemia |
| EPOC | Oxigenación (SpO2) |
| Desnutrición | Peso |

Gráfico de línea simple: últimas 4 semanas, con línea de referencia (rango normal).

#### D. Historial de servicios cronológico
Lista ordenada por fecha (más reciente primero):
- Fecha · Tipo de servicio · Profesional · Estado (✓ verificado / ✗ no cumplido) · Ver evidencia →

#### E. Acciones disponibles
- **Modificar plan** — ajustar frecuencia o tipo de servicios
- **Suspender programa** — con justificación obligatoria
- **Derivar** — referir a otro nivel de atención

---

## Pantalla 6 — Evidencia de servicio ✓ Sin cambios

**Estado:** Existente y está bien. No modificar.

### Qué tiene (mantener)
- Verificación GPS con radio tipo Uber/Rappi (código de confirmación)
- Firma digital del paciente con timestamp
- Nota clínica estructurada
- Registro de signos vitales capturados en visita
- Fotografía/evidencia clínica

### Navegación de entrada
- Desde historial de servicios en Pantalla 5 → "Ver evidencia"
- Desde lista de auditoría en Pantalla 7

---

## Pantalla 7 — Auditoría y reportes

**Estado:** Existente — renombrar y ajustar enfoque

### Cambio crítico de lenguaje
| Antes (lenguaje de prestador) | Después (lenguaje de pagador) |
|-------------------------------|-------------------------------|
| "Facturación sin glosa" | **"Auditoría de cuentas médicas"** |
| "23 servicios aprobados sin glosa" | "23 servicios auditados con evidencia" |
| "$0 glosa esperada" | "% Servicios verificados antes de pago" |
| "$4.2M listo a facturar" | "$4.2M en cuentas radicadas para auditar" |
| KPI: glosa $0 | KPIs: % verificación · siniestralidad · fraude detectado |

> La glosa es dolor del **prestador**, no del pagador. La EPS no sufre glosas — las **pone**.

### Secciones de la pantalla

#### A. KPIs principales
- % Servicios verificados antes de pago
- Fraude detectado este mes (N casos)
- Siniestralidad: costo real vs. presupuesto
- Tasa de reingreso a urgencias (30 días)

#### B. Lista de cuentas para auditar
| Campo | Descripción |
|-------|-------------|
| Prestador | IPS Domiciliaria |
| Período | Mes/quincena |
| Servicios radicados | N total |
| Verificados con GPS | N (%) |
| Con firma digital | N (%) |
| Estado | Aprobar pago / Observar / Rechazar |

#### C. Reportes regulatorios (mockup visual, sin función)
Menú lateral o sección con accesos visibles a:
- **RIPS** — Registro Individual de Prestación de Servicios
- **Indicadores Supersalud**
- **Reporte ADRES**
- **Scoring de prestadores** — ranking por calidad, compliance GPS, satisfacción

#### D. Detección de fraude automática
Alertas flaggeadas:
- GPS nunca llegó al domicilio
- Servicios simultáneos del mismo profesional
- Notas clínicas sin visita registrada
- Firmas duplicadas

---

## Los 3 casos de uso end-to-end (para el demo en vivo)

### Caso 1 — Autorización de servicio
```
Login (EPS Sura) → Dashboard (ver 8 solicitudes pendientes) 
→ Solicitudes → Seleccionar María García 
→ Revisar plan propuesto → Aprobar con condiciones 
→ Volver a Dashboard (solicitudes: 7 pendientes)
```
**Mensaje:** "Así reemplazamos el correo y el WhatsApp para autorizar."

### Caso 2 — Seguimiento de paciente en riesgo
```
Dashboard → Top 3 riesgo → Click en Carlos Ruiz 
→ Detalle paciente → Ver adherencia 68% (alerta) 
→ Ver evolución PA (tendencia ↑) → Modificar plan 
→ Ver historial → Click en última visita → Evidencia GPS + firma
```
**Mensaje:** "Así dejamos de pecar por deficiencia o exceso."

### Caso 3 — Auditoría de cuentas
```
Dashboard → Auditoría y reportes 
→ Ver cuenta IPS Domiciliaria Norte ($18.4M) 
→ 142 servicios — 100% verificados con GPS 
→ Aprobar pago → Ver 3 alertas de fraude flaggeadas
```
**Mensaje:** "Así auditamos antes de pagar, no después."

---

## Datos simulados recomendados

### Pacientes (mínimo 6 para que la lista se vea poblada)
| Nombre | Diagnóstico | Días | Estado | Adherencia | Tendencia |
|--------|-------------|------|--------|------------|-----------|
| María García | EPOC severo | 12 | 🟢 Estable | 94% | → |
| Carlos Ruiz | Post-cx cadera | 5 | 🟡 Vigilar | 68% | ↑ |
| Ana Pérez | Falla cardíaca | 21 | 🟢 Estable | 91% | ↑ |
| Luis Martínez | Diabetes tipo 2 | 3 | 🔴 Urgente | 45% | ↓ |
| Rosa Jiménez | ACV isquémico | 34 | 🟢 Estable | 88% | → |
| Pedro Salcedo | Ca. pulmón (pal.) | 8 | 🟡 Vigilar | 72% | → |

### KPIs del dashboard
- Pacientes activos: **47** (12 alto · 23 medio · 12 bajo riesgo)
- Alertas clínicas pendientes: **5**
- Solicitudes por autorizar: **8**
- Costo mes: **$142M COP** / Presupuesto: **$158M COP** (90%)
- Tasa reingreso 30d: **6.4%** vs. 28.9% promedio nacional

---

## Checklist del viernes

- [ ] Login funcional con selector de organización y token por rol
- [ ] Dashboard con 4 tiles correctos + franja top 3 riesgo
- [ ] Pantalla 3 — Solicitudes de autorización con 3 casos simulados y botones Aprobar/Negar
- [ ] Pantalla 4 — Lista de pacientes con columnas adherencia y tendencia
- [ ] Pantalla 5 — Detalle de paciente con plan de manejo, gráfico signos vitales e historial
- [ ] Pantalla 6 — Evidencia de servicio (sin cambios, verificar que funcione la navegación desde P5)
- [ ] Pantalla 7 — Auditoría con lenguaje de pagador y mockup reportes regulatorios
- [ ] URL pública desplegada (Vercel o AWS Amplify)
- [ ] 3 flujos end-to-end navegables sin errores
- [ ] Issues abiertos en GitHub org OLGA para cambios post-demo

---

## Notas de la reunión

- El dev tiene plantilla base con autenticación JWT ya implementada → adaptar a OLGA
- GitHub org creada bajo nombre OLGA (no personal del dev) → Sofía y Camilo deben crear cuenta y aceptar invitación
- Gestión de tareas via **Issues en GitHub** — el dev marca ✓ cuando completa, el equipo revisa
- La animación del "muñequito" (onboarding animado) es opcional para el viernes — riesgo de no terminar. Evaluar post-demo
- AWS como argumento de venta: backups, seguridad de datos del paciente, escalabilidad → mencionarlo en el pitch aunque no sea visible en el demo
- Si Alejo pide cambios en vivo ("no me gusta este login") → el demo está diseñado para ser modificable sin rehacer todo

---

*Documento generado para el equipo OLGA — uso interno*

---

<div align="center">
<sub>Desarrollado con ❤️ para Colesthetic.</sub>
</div>
