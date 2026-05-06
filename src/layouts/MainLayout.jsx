import Header from '@/components/Header';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}