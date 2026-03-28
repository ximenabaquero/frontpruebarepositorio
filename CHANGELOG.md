# Changelog · XIMCA Frontend

Formato: `[versión] YYYY-MM-DD — descripción`

---

## [1.0.0] 2026-03-14 — Versión inicial de producción

### Agregado
- Autenticación con Laravel Sanctum (cookies httpOnly, XSRF-TOKEN)
- `AuthContext` y `AuthGuard` / `RoleGuard` para protección de rutas
- Gestión de pacientes: listado, búsqueda por nombre/cédula, detalle con historial
- Registros clínicos: crear, editar, confirmar, cancelar (flujo EN_ESPERA → CONFIRMADO/CANCELADO)
- Procedimientos con ítems y cálculo automático de totales
- Facturación con generación de PDF
- Dashboard estadístico: 6+ gráficas, KPIs mes actual vs anterior, top procedimientos
- Control de imágenes clínicas antes/después
- Gestión de remitentes (ADMIN): crear, activar, inactivar, despedir
- Módulo de inventario: categorías, productos, compras y usos
- Paleta de colores centralizada en `config/colors.ts`
- Soporte de roles ADMIN y REMITENTE con vistas diferenciadas

---

<!-- Agregar nuevas entradas arriba de esta línea -->
<!-- Formato: ## [x.x.x] YYYY-MM-DD — título corto -->
<!-- Secciones: Agregado | Cambiado | Corregido | Eliminado -->
