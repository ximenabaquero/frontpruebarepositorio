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
  unit_price: number;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  category?: InventoryCategory;
}

export interface Distributor {
  id: number;
  name: string;
}

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
  product?: InventoryProduct & { category?: InventoryCategory };
  user?: { id: number; name: string };
  distributor?: Distributor | null;
}

export interface InventoryUsage {
  id: number;
  product_id: number;
  user_id: number;
  medical_evaluation_id: number | null;
  quantity: number;
  status: "con_paciente" | "sin_paciente" | null;
  reason: string | null;
  usage_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: InventoryProduct & { category?: InventoryCategory };
  user?: { id: number; name: string };
  medical_evaluation?: { id: number };
}

export interface InventorySummaryData {
  total_income: number;
  total_expenses: number;
  net_profit: number;
}

export interface PurchaseFormValues {
  product_id: number | null;
  // Campos para nuevo producto (solo cuando product_id es null)
  name: string;
  category_id: number | "";
  type: "insumo" | "equipo" | "";
  description: string;
  // Campos de compra
  distributor_id: number | null;
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
  usage_date: string;
  status: "con_paciente" | "sin_paciente" | "";
  reason: string;
  medical_evaluation_id: number | null;
  notes: string;
}

export interface UsageApiError {
  message: string;
  error_code: "insufficient_stock" | "equipo_no_consumible";
  product_name?: string;
}

// Reports types
export interface SpendByCategory {
  category_id: number;
  category_name: string;
  amount: number;
  count: number;
}

export interface SpendByDistributor {
  distributor_id: number;
  distributor_name: string;
  amount: number;
  count: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  purchase_id: number;
}
