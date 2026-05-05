import type { InventoryProduct, InventoryCategory } from "../types";

/**
 * Export inventory data to CSV format
 */
export function exportToCSV(
  products: InventoryProduct[],
  categories: InventoryCategory[],
  filename: string = "inventario",
) {
  try {
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const headers = [
      "ID",
      "Nombre",
      "Categoría",
      "Tipo",
      "Cantidad/Stock", // Nombre unificado
      "Estado",
      "Descripción",
      "Fecha Creación",
    ];

    const rows = products.map((product) => {
      return [
        product.id,
        product.name,
        categoryMap.get(product.category_id) || "Sin categoría",
        product.type === "insumo" ? "Insumo" : "Equipo",
        product.cantidad, // Usamos el alias 'cantidad' definido en tu interface
        product.estado || "N/A", // Si es null (equipo), mostramos N/A
        product.description || "",
        new Date(product.created_at).toLocaleDateString("es-CO"),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            if (cell === null || cell === undefined) return "";
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(","),
      ),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

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
 */
export async function exportToExcel(
  products: InventoryProduct[],
  categories: InventoryCategory[],
  filename: string = "inventario",
) {
  try {
    const XLSX = await import("xlsx");
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const data = products.map((product) => ({
      ID: product.id,
      Nombre: product.name,
      Categoría: categoryMap.get(product.category_id) || "Sin categoría",
      Tipo: product.type === "insumo" ? "Insumo" : "Equipo",
      "Stock/Cantidad": product.cantidad, // Usamos la propiedad unificada
      Estado: product.estado || "N/A",
      Descripción: product.description || "",
      "Fecha Creación": new Date(product.created_at).toLocaleDateString(
        "es-CO",
      ),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const colWidths = [
      { wch: 6 }, // ID
      { wch: 30 }, // Nombre
      { wch: 20 }, // Categoría
      { wch: 10 }, // Tipo
      { wch: 15 }, // Cantidad
      { wch: 12 }, // Estado
      { wch: 30 }, // Descripción
      { wch: 15 }, // Fecha Creación
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");

    XLSX.writeFile(workbook, `${filename}_${getTimestamp()}.xlsx`);
    return true;
  } catch (error) {
    console.error("Error exporting Excel:", error);
    return false;
  }
}

function getTimestamp(): string {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}
