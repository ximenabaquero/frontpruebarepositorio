import Cookies from "js-cookie";
import type {
  Distributor,
  InventoryCategory,
  InventoryProduct,
  InventoryPurchase,
  InventoryUsage,
  InventorySummaryData,
  PurchaseFormValues,
  UsageFormValues,
  UsageApiError,
  SpendByCategory,
  SpendByDistributor,
  PriceHistoryPoint,
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
  return {
    Accept: "application/json",
  };
}

// ── Categorías ────────────────────────────────────────────────
export async function getCategories(): Promise<InventoryCategory[]> {
  const res = await fetch(`${BASE}/categories`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar categorías");
  const json = await res.json();
  return json.data || [];
}

export async function createCategory(data: { name: string }): Promise<InventoryCategory> {
  const res = await fetch(`${BASE}/categories`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear categoría");
  const json = await res.json();
  return json.data;
}

export async function updateCategory(
  id: number,
  data: { name: string }
): Promise<InventoryCategory> {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar categoría");
  const json = await res.json();
  return json.data;
}

// ── Distribuidores ────────────────────────────────────────────
export async function getDistributors(): Promise<Distributor[]> {
  const res = await fetch(`${BASE}/distributors`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar distribuidores");
  const json = await res.json();
  return json.data || [];
}

export async function createDistributor(
  data: { name: string; cellphone?: string | null; email?: string | null }
): Promise<Distributor> {
  const res = await fetch(`${BASE}/distributors`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear distribuidor");
  return json.data;
}

export async function updateDistributor(
  id: number,
  data: { name: string; cellphone?: string | null; email?: string | null }
): Promise<Distributor> {
  const res = await fetch(`${BASE}/distributors/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al actualizar distribuidor");
  return json.data;
}

export async function deleteDistributor(id: number): Promise<void> {
  const res = await fetch(`${BASE}/distributors/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: xsrfHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al eliminar distribuidor");
}

// ── Compras ───────────────────────────────────────────────────
export async function getPurchases(params?: {
  month?: number;
  year?: number;
  search?: string;
  category_id?: number;
}): Promise<InventoryPurchase[]> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));
  if (params?.search) qs.set("search", params.search);
  if (params?.category_id) qs.set("category_id", String(params.category_id));

  const res = await fetch(`${BASE}/purchases?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar compras");
  const json = await res.json();
  return json.data || [];
}

export async function createPurchase(data: PurchaseFormValues): Promise<InventoryPurchase> {
  const res = await fetch(`${BASE}/purchases`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al registrar compra");
  const json = await res.json();
  return json.data;
}

export async function getLastPurchase(productId: number): Promise<{
  unit_price: number;
  distributor_id: number | null;
  purchase_date: string;
} | null> {
  const res = await fetch(`${BASE}/purchases/last/${productId}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

// ── Resumen ───────────────────────────────────────────────────
export async function getInventorySummary(): Promise<InventorySummaryData> {
  const res = await fetch(`${BASE}/summary`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar resumen");
  const json = await res.json();
  return json.data || {};
}

// ── Productos (catálogo, solo lectura) ────────────────────────
export async function getProducts(): Promise<InventoryProduct[]> {
  const res = await fetch(`${BASE}/products`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar productos");
  const json = await res.json();
  return json.data || [];
}

export async function createProduct(data: {
  name: string;
  category_id: number;
  type: "insumo" | "equipo";
  description?: string;
}): Promise<InventoryProduct> {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear producto");
  const json = await res.json();
  return json.data;
}

// ── Consumos ──────────────────────────────────────────────────
export async function getUsages(params?: {
  month?: number;
  year?: number;
  search?: string;
  category_id?: number;
}): Promise<InventoryUsage[]> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));
  if (params?.search) qs.set("search", params.search);
  if (params?.category_id) qs.set("category_id", String(params.category_id));

  const res = await fetch(`${BASE}/usages?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar consumos");
  const json = await res.json();
  return json.data || [];
}

export async function createUsage(data: UsageFormValues): Promise<InventoryUsage[]> {
  const res = await fetch(`${BASE}/usages`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 422 && err.error_code) {
      const apiError: UsageApiError = {
        message: err.message || "Error al registrar consumo",
        error_code: err.error_code,
        product_name: err.product_name,
      };
      throw apiError;
    }
    throw new Error(err.message || "Error al registrar consumo");
  }

  const json = await res.json();
  return json.data;
}

// ── Reportes ──────────────────────────────────────────────────
export async function getSpendByCategory(params?: {
  month?: number;
  year?: number;
}): Promise<SpendByCategory[]> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));

  const res = await fetch(`${BASE}/reports/spend-by-category?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar reporte por categoría");
  const json = await res.json();
  return json.data || [];
}

export async function getSpendByDistributor(params?: {
  month?: number;
  year?: number;
}): Promise<SpendByDistributor[]> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));

  const res = await fetch(`${BASE}/reports/spend-by-distributor?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar reporte por distribuidor");
  const json = await res.json();
  return json.data || [];
}

export async function getPriceHistory(productId: number): Promise<PriceHistoryPoint[]> {
  const res = await fetch(`${BASE}/reports/price-history/${productId}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar histórico de precios");
  const json = await res.json();
  return json.data || [];
}
