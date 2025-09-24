import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perfestetic - Lipolisis Láser",
  description: "Centro de estética especializado en lipolisis láser. Reducción de grasa, recuperación rápida y resultados visibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
