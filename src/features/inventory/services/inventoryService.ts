import Cookies from "js-cookie";
import type {
  Distributor,
  InventoryCategory,
  InventoryProduct,
  InventoryPurchase,
  InventoryUsage,
  InventorySummaryData,
  LastPurchaseInfo,
  PurchaseFormValues,
  StockNotificationSummary,
  UsageFormValues,
  UsageApiError,
  SpendByCategory,
  SpendByDistributor,
  PriceHistoryPoint,
  SpendReport,
} from "../types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");
const BASE = `${apiBaseUrl}/api/v1/inventory`;

function xsrfHeaders() {
  const token = Cookies.get("XSRF-TOKEN") ?? "";
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-XSRF-TOKEN": token,
  };
}

function readHeaders() {
  return { Accept: "application/json" };
}

// ── Categorías ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<InventoryCategory[]> {
  const res = await fetch(`${BASE}/categories`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar categorías");
  const json = await res.json();
  return json.data ?? [];
}

export async function createCategory(data: {
  name: string;
}): Promise<InventoryCategory> {
  const res = await fetch(`${BASE}/categories`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    const validationMsg = json.errors?.name?.[0];
    throw new Error(
      validationMsg ?? json.message ?? "Error al crear categoría",
    );
  }
  return json.data;
}

export async function updateCategory(
  id: number,
  data: { name: string },
): Promise<InventoryCategory> {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    const validationMsg = json.errors?.name?.[0];
    throw new Error(
      validationMsg ?? json.message ?? "Error al actualizar categoría",
    );
  }
  return json.data;
}

// ── Productos ─────────────────────────────────────────────────────────────────
// Los productos se crean únicamente a través de POST /purchases (flujo integrado).
export async function getProducts(params?: {
  search?: string;
  category_id?: number;
}): Promise<InventoryProduct[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.category_id) qs.set("category_id", String(params.category_id));

  const res = await fetch(`${BASE}/products?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar productos");
  const json = await res.json();
  return json.data ?? [];
}

/**
 * Alertas de stock bajo — solo insumos con stock_actual <= stock_minimo.
 * Usado por la campana de notificaciones.
 */
export async function getProductNotifications(): Promise<StockNotificationSummary> {
  const res = await fetch(`${BASE}/products/notifications`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar alertas de stock");
  const json = await res.json();
  return json.data;
}

// ── Distribuidores ────────────────────────────────────────────────────────────
// DELETE /distributors está comentado en el backend — deleteDistributor eliminado.

export async function getDistributors(params?: {
  search?: string;
}): Promise<Distributor[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);

  const res = await fetch(`${BASE}/distributors?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar distribuidores");
  const json = await res.json();
  return json.data ?? [];
}

export async function createDistributor(data: {
  name: string;
  cellphone?: string | null;
  email?: string | null;
}): Promise<Distributor> {
  const res = await fetch(`${BASE}/distributors`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    const validationMsg =
      json.errors?.name?.[0] ??
      json.errors?.email?.[0] ??
      json.errors?.cellphone?.[0];
    throw new Error(
      validationMsg ?? json.message ?? "Error al crear distribuidor",
    );
  }
  return json.data;
}

export async function updateDistributor(
  id: number,
  data: { name: string; cellphone?: string | null; email?: string | null },
): Promise<Distributor> {
  const res = await fetch(`${BASE}/distributors/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) {
    const validationMsg =
      json.errors?.name?.[0] ??
      json.errors?.email?.[0] ??
      json.errors?.cellphone?.[0];
    throw new Error(
      validationMsg ?? json.message ?? "Error al actualizar distribuidor",
    );
  }
  return json.data;
}

// ── Compras ───────────────────────────────────────────────────────────────────
// El backend solo filtra por search y category_id — month/year no existen en purchasesIndex.

export async function getPurchases(params?: {
  search?: string;
  category_id?: number;
}): Promise<InventoryPurchase[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.category_id) qs.set("category_id", String(params.category_id));

  const res = await fetch(`${BASE}/purchases?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar compras");
  const json = await res.json();
  return json.data ?? [];
}

/**
 * Registra una compra. Puede crear el producto y/o el distribuidor
 * en la misma transacción según los campos enviados.
 *
 * El backend espera exactamente los campos de PurchaseFormValues —
 * campos vacíos ("") deben enviarse como null para evitar errores de validación.
 */
export async function createPurchase(
  data: PurchaseFormValues,
): Promise<InventoryPurchase> {
  // Normalizar campos opcionales: "" → null antes de enviar
  const payload = {
    ...data,
    category_id: data.category_id || null,
    type: data.type || null,
    stock_minimo: data.stock_minimo !== "" ? data.stock_minimo : null,
    distributor_id: data.distributor_id ?? null,
    distributor_name: data.distributor_name || null,
    distributor_cellphone: data.distributor_cellphone || null,
    distributor_email: data.distributor_email || null,
    quantity: data.quantity !== "" ? data.quantity : null,
    unit_price: data.unit_price !== "" ? data.unit_price : null,
    notes: data.notes || null,
    description: data.description || null,
  };

  const res = await fetch(`${BASE}/purchases`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const validationMsg = json.errors?.name?.[0];
    throw new Error(
      validationMsg ?? json.message ?? "Error al registar compra.",
    );
  }
  return json.data;
}

/**
 * Última compra de un producto — útil para autocompletar precio y distribuidor.
 * Retorna null si el producto nunca fue comprado antes.
 */
export async function getLastPurchase(
  productId: number,
): Promise<LastPurchaseInfo | null> {
  const res = await fetch(`${BASE}/purchases/last/${productId}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

// ── Consumos ──────────────────────────────────────────────────────────────────
// El backend solo filtra por search y category_id — month/year no existen en usagesIndex.

export async function getUsages(params?: {
  search?: string;
  category_id?: number;
}): Promise<InventoryUsage[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.category_id) qs.set("category_id", String(params.category_id));

  const res = await fetch(`${BASE}/usages?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar consumos");
  const json = await res.json();
  return json.data ?? [];
}

export async function createUsage(
  data: UsageFormValues,
): Promise<InventoryUsage[]> {
  const res = await fetch(`${BASE}/usages`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    // Stock insuficiente en insumo — único error 422 del service
    if (res.status === 422 && err.error_code) {
      const apiError: UsageApiError = {
        message: err.message ?? "Error al registrar consumo",
        error_code: err.error_code,
        product_name: err.product_name,
      };
      throw apiError;
    }

    throw new Error(err.message ?? "Error al registrar consumo");
  }

  const json = await res.json();
  return json.data;
}

// ── Resumen financiero ────────────────────────────────────────────────────────

export async function getInventorySummary(): Promise<InventorySummaryData> {
  const res = await fetch(`${BASE}/summary`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar resumen");
  const json = await res.json();
  return json.data;
}

// ── Reportes ──────────────────────────────────────────────────────────────────
export async function getSpendByCategory(params?: {
  month?: number;
  year?: number;
}): Promise<SpendReport<SpendByCategory>> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));

  const res = await fetch(`${BASE}/reports/spend-by-category?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar reporte por categoría");
  const json = await res.json();
  return json.data;
}

export async function getSpendByDistributor(params?: {
  month?: number;
  year?: number;
}): Promise<SpendReport<SpendByDistributor>> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));

  const res = await fetch(`${BASE}/reports/spend-by-distributor?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar reporte por distribuidor");
  const json = await res.json();
  return json.data;
}

export async function getPriceHistory(
  productId: number,
): Promise<PriceHistoryPoint[]> {
  const res = await fetch(`${BASE}/reports/price-history/${productId}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar histórico de precios");
  const json = await res.json();
  return json.data ?? [];
}
