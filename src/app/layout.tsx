import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthContext";

export const metadata: Metadata = {
  title: "Olga - Estética Médica Avanzada",
  description:
    "Lipólisis láser asistida. Procedimiento mínimamente invasivo para reducción de grasa localizada con tecnología médica certificada",
  icons: {
    icon: { url: "/a-Olga.png", type: "image/png" },
    apple: "/a-Olga.png",
    shortcut: "/a-Olga.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/jaq6hps.css" />
      </head>
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
