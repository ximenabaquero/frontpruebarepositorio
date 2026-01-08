import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// ¿TIENES ESTAS IMPORTACIONES?
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coldesthetic - Estética Médica Avanzada',
  description: 'Lipólisis láser sin cirugía, resultados desde la primera sesión',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* ¿TIENES HEADER Y FOOTER AQUÍ? */}
        {/* <Header /> */}
        <main className="min-h-screen">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}