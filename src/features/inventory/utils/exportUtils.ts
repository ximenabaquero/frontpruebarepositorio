import type { InventoryProduct, InventoryCategory } from "../types";

/**
 * Export inventory data to CSV format
 */
export function exportToCSV(
  products: InventoryProduct[],
  categories: InventoryCategory[],
  filename: string = "inventario"
) {
  try {
    // Create a map for quick category lookup
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    // Define headers
    const headers = [
      "ID",
      "Nombre",
      "Categoría",
      "Tipo",
      "Precio Unitario",
      "Stock",
      "Estado",
      "Descripción",
      "Fecha Creación",
    ];

    // Map products to rows
    const rows = products.map((product) => {
      const state = getProductState(product);
      return [
        product.id,
        product.name,
        categoryMap.get(product.category_id) || "Sin categoría",
        product.type === "insumo" ? "Insumo" : "Equipo",
        product.unit_price,
        product.stock,
        state,
        product.description || "",
        new Date(product.created_at).toLocaleDateString("es-CO"),
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => {
          // Handle null/undefined
          if (cell === null || cell === undefined) return "";
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      ),
    ].join("\n");

    // Create blob with UTF-8 BOM for proper encoding in Excel
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

    // Trigger download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${getTimestamp()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return false;
  }
}

/**
 * Export inventory data to Excel format
 * Requires: npm install xlsx
 */
export async function exportToExcel(
  products: InventoryProduct[],
  categories: InventoryCategory[],
  filename: string = "inventario"
) {
  try {
    // Dynamic import to avoid bundling if not used
    const XLSX = await import("xlsx");

    // Create a map for quick category lookup
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    // Prepare data with headers
    const data = products.map((product) => ({
      ID: product.id,
      Nombre: product.name,
      Categoría: categoryMap.get(product.category_id) || "Sin categoría",
      Tipo: product.type === "insumo" ? "Insumo" : "Equipo",
      "Precio Unitario": product.unit_price,
      Stock: product.stock,
      Estado: getProductState(product),
      Descripción: product.description || "",
      "Fecha Creación": new Date(product.created_at).toLocaleDateString("es-CO"),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = [
      { wch: 6 },  // ID
      { wch: 30 }, // Nombre
      { wch: 20 }, // Categoría
      { wch: 10 }, // Tipo
      { wch: 15 }, // Precio Unitario
      { wch: 8 },  // Stock
      { wch: 12 }, // Estado
      { wch: 30 }, // Descripción
      { wch: 15 }, // Fecha Creación
    ];
    worksheet["!cols"] = colWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}_${getTimestamp()}.xlsx`);

    return true;
  } catch (error) {
    console.error("Error exporting Excel:", error);
    if (error instanceof Error && error.message.includes("Cannot find module")) {
      console.error("Please install xlsx: npm install xlsx");
    }
    return false;
  }
}

/**
 * Helper function to determine product state
 */
function getProductState(product: InventoryProduct): string {
  if (product.type === "equipo") return "Equipo";
  if (product.stock === 0) return "Crítico";
  if (product.stock < 5) return "Crítico";
  if (product.stock < 10) return "Bajo";
  return "OK";
}

/**
 * Helper function to generate timestamp for filename
 */
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}${month}${day}_${hours}${minutes}`;
}
