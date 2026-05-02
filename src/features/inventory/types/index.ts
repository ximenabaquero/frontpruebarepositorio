// ─────────────────────────────────────────────────────────────────────────────
// Entidades base
// ─────────────────────────────────────────────────────────────────────────────

export interface InventoryCategory {
  id: number;
  user_id: number;
  name: string;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryProduct {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  type: "insumo" | "equipo";
  created_at: string;
  updated_at: string;

  // Accessors del modelo — siempre presentes en la respuesta
  estado: "Disponible" | "Crítico" | "Agotado" | null; // null si es equipo
  label_stock: "Stock" | "Cantidad"; // "Cantidad" si es equipo
  cantidad: number; // alias de stock_actual

  // Relación eager
  category?: InventoryCategory;
}

export interface Distributor {
  id: number;
  name: string;
  cellphone: string | null;
  email: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Notificaciones de stock bajo
// ─────────────────────────────────────────────────────────────────────────────

export interface StockAlertProduct {
  id: number;
  name: string;
  stock_actual: number; // visible en el dropdown de alertas
  estado: "Crítico" | "Agotado";
}

export interface StockNotificationSummary {
  total_alertas: number;
  productos: StockAlertProduct[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Compras
// ─────────────────────────────────────────────────────────────────────────────

export interface InventoryPurchase {
  id: number;
  user_id: number;
  product_id: number;
  distributor_id: number | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchase_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Relaciones eager (siempre presentes en listAll y register)
  product?: InventoryProduct & { category?: InventoryCategory };
  user?: { id: number; name: string };
  distributor?: Distributor | null;
}

export interface LastPurchaseInfo {
  unit_price: number;
  distributor_id: number | null;
  purchase_date: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Consumos
// ─────────────────────────────────────────────────────────────────────────────

export interface InventoryUsage {
  id: number;
  product_id: number;
  user_id: number;
  medical_evaluation_id: number | null;
  quantity: number;
  status: "con_paciente" | "sin_paciente";
  reason: string | null;
  usage_date: string;
  created_at: string;
  updated_at: string;

  // Relaciones eager
  product?: InventoryProduct & { category?: InventoryCategory };
  user?: { id: number; name: string };
  medical_evaluation?: { id: number } | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Formularios
// ─────────────────────────────────────────────────────────────────────────────

export interface PurchaseFormValues {
  // ── Producto ──────────────────────────────────────────────────────────────
  // Si product_id tiene valor → producto existente, ignorar campos de nuevo producto
  // Si product_id es null     → producto nuevo, los campos de abajo son requeridos
  product_id: number | null;
  name: string;
  category_id: number | "";
  type: "insumo" | "equipo" | "";
  description: string;
  stock_minimo: number | ""; // requerido solo si type === "insumo" y product_id === null

  // ── Distribuidor ──────────────────────────────────────────────────────────
  // Caso 1: distributor_id !== null  → existente
  // Caso 2: distributor_name !== ""  → nuevo (se crea en el backend)
  // Caso 3: ambos vacíos/null        → compra sin distribuidor
  distributor_id: number | null;
  distributor_name: string;
  distributor_cellphone: string;
  distributor_email: string;

  // ── Compra ────────────────────────────────────────────────────────────────
  quantity: number | "";
  unit_price: number | "";
  notes: string;
}

export type UsageItem = {
  product_id: number;
  quantity: number | "";
};

export interface UsageFormValues {
  items: UsageItem[];
  status: "con_paciente" | "sin_paciente";
  reason: string;
  medical_evaluation_id: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Errores de API
// ─────────────────────────────────────────────────────────────────────────────

export interface UsageApiError {
  message: string;
  error_code: "insufficient_stock";
  product_name?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reportes
// ─────────────────────────────────────────────────────────────────────────────

export interface InventorySummaryData {
  total_income: number;
  total_expenses: number;
  net_profit: number;
}

export interface SpendByCategory {
  category_id: number;
  category_name: string;
  amount: number;
  count: number;
}

export interface SpendByDistributor {
  distributor_id: number | null;
  distributor_name: string;
  amount: number;
  count: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  purchase_id: number;
}
