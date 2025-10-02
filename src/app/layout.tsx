import type { Metadata } from "next";
import "./globals.css";
import { colors } from "@/config/colors";

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
      <body 
        className="antialiased"
        style={{ 
          backgroundColor: colors.background, 
          color: colors.foreground,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
        }}
      >
        {children}
      </body>
    </html>
  );
}
