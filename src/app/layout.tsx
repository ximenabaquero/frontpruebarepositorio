import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 
import { AuthProvider } from "@/features/auth/AuthContext";

export const metadata: Metadata = {
  title: "Olga",
  description: "Olga es una plataforma de coordinación de cuidados...",
  icons: {
    icon: "/a-Olga.png",
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
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}