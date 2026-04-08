export interface InventoryCategory {
  id: number;
  user_id: number;
  name: string;
  color: string;
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

export interface InventoryPurchase {
  id: number;
  user_id: number;
  category_id: number;
  product_id: number | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchase_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  category?: InventoryCategory;
  product?: InventoryProduct | null;
  user?: { id: number; first_name: string; last_name: string; name: string };
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
  user?: { id: number; first_name: string; last_name: string; name: string };
  medical_evaluation?: {
    patient?: { id: number; first_name: string; last_name: string };
  };
}

export interface InventorySummaryData {
  month: number;
  year: number;
  total_expenses: number;
  expenses_variation?: number | null;
  by_category: { category: string; color: string; total: number }[];
  // solo admin:
  total_income?: number;
  income_variation?: number | null;
  net_profit?: number;
  profit_variation?: number | null;
}

export interface PurchaseFormValues {
  category_id: number | "";
  product_id: number | null;
  item_name: string;
  quantity: number | "";
  unit_price: number | "";
  purchase_date: string;
  notes: string;
}

export interface ProductFormValues {
  category_id: number | "";
  name: string;
  description: string;
  unit_price: number | "";
  stock: number | "";
}

export interface UsageFormValues {
  product_id: number | "";
  quantity: number | "";
  usage_date: string;
  status: "con_paciente" | "sin_paciente" | "";
  reason: string;
  medical_evaluation_id: number | null;
  notes: string;
}
