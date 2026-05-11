import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthContext";

export const metadata: Metadata = {
  title: "Coldesthetic - Estética Médica Avanzada",
  description:
    "Lipólisis láser asistida. Procedimiento mínimamente invasivo para reducción de grasa localizada con tecnología médica certificada",
  icons: {
    icon: { url: "/coldestheticlogo.png", type: "image/png" },
    apple: "/coldestheticlogo.png",
    shortcut: "/coldestheticlogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* ¿TIENES HEADER Y FOOTER AQUÍ? */}
        {/* <Header /> */}
        <AuthProvider>
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
