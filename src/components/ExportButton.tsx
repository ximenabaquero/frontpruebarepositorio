"use client";

import { useRef, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

interface Props {
  targetRef?: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export default function ExportButton({
  targetRef,
  filename = "historia-clinica.pdf",
}: Props) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = targetRef?.current;
    if (!element) {
      alert("No hay contenido para exportar.");
      return;
    }

    setIsExporting(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Capturar el elemento
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Páginas adicionales si el contenido se desborda
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al generar el PDF. Inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-lg hover:shadow-blue-300 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
      {isExporting ? "Exportando..." : "Exportar a PDF"}
    </button>
  );
}

