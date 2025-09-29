import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Benefits from '@/components/Benefits';
import Gallery from '@/components/Gallery';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Benefits />
      <Gallery />
      <Contact />
    </main>
  );
}
