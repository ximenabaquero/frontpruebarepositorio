import Cookies from "js-cookie";
import type {
  InventoryCategory,
  InventoryProduct,
  InventoryPurchase,
  InventoryUsage,
  InventorySummaryData,
  ProductFormValues,
  PurchaseFormValues,
  UsageFormValues,
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

export async function createCategory(
  data: { name: string; color: string }
): Promise<InventoryCategory> {
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
  data: { name?: string; color?: string }
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

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: xsrfHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar categoría");
  }
}

// ── Compras ───────────────────────────────────────────────────
export async function getPurchases(params?: {
  month?: number;
  year?: number;
  category_id?: number;
}): Promise<InventoryPurchase[]> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));
  if (params?.category_id) qs.set("category_id", String(params.category_id));

  const res = await fetch(`${BASE}/purchases?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar compras");
  const json = await res.json();
  return json.data || [];
}

export async function createPurchase(
  data: PurchaseFormValues
): Promise<InventoryPurchase> {
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

export async function updatePurchase(
  id: number,
  data: Partial<PurchaseFormValues>
): Promise<InventoryPurchase> {
  const res = await fetch(`${BASE}/purchases/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar compra");
  const json = await res.json();
  return json.data;
}

export async function deletePurchase(id: number): Promise<void> {
  const res = await fetch(`${BASE}/purchases/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: xsrfHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar compra");
}

// ── Resumen ───────────────────────────────────────────────────
export async function getInventorySummary(
  month: number,
  year: number
): Promise<InventorySummaryData> {
  const res = await fetch(`${BASE}/summary?month=${month}&year=${year}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar resumen");
  const json = await res.json();
  return json.data || {};
}

// ── Productos (catálogo) ──────────────────────────────────────
export async function getProducts(): Promise<InventoryProduct[]> {
  const res = await fetch(`${BASE}/products`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar productos");
  const json = await res.json();
  return json.data || [];
}

export async function createProduct(
  data: ProductFormValues
): Promise<InventoryProduct> {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al crear producto");
  }
  const json = await res.json();
  return json.data;
}

export async function updateProduct(
  id: number,
  data: Partial<ProductFormValues>
): Promise<InventoryProduct> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al actualizar producto");
  }
  const json = await res.json();
  return json.data;
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: xsrfHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar producto");
  }
}

// ── Consumos ──────────────────────────────────────────────────
export async function getUsages(params?: {
  month?: number;
  year?: number;
  product_id?: number;
}): Promise<InventoryUsage[]> {
  const qs = new URLSearchParams();
  if (params?.month) qs.set("month", String(params.month));
  if (params?.year) qs.set("year", String(params.year));
  if (params?.product_id) qs.set("product_id", String(params.product_id));

  const res = await fetch(`${BASE}/usages?${qs}`, {
    credentials: "include",
    headers: readHeaders(),
  });
  if (!res.ok) throw new Error("Error al cargar consumos");
  const json = await res.json();
  return json.data || [];
}

export async function createUsage(
  data: UsageFormValues
): Promise<InventoryUsage> {
  const res = await fetch(`${BASE}/usages`, {
    method: "POST",
    credentials: "include",
    headers: xsrfHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al registrar consumo");
  }
  const json = await res.json();
  return json.data;
}

export async function deleteUsage(id: number): Promise<void> {
  const res = await fetch(`${BASE}/usages/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: xsrfHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al eliminar consumo");
  }
}
