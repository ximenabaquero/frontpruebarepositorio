import Hero from "@/features/home/components/Hero";
import Services from "@/features/home/components/Services";
import Benefits from "@/features/home/components/Benefits";
import Gallery from "@/features/home/components/Gallery";
import Contact from "@/features/home/components/Contact";
import Testimonials from "@/features/home/components/Testimonials";
import Education from "@/features/home/components/Education";
import MainLayout from "@/layouts/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <main className="min-h-screen">
        <Hero />
        <Services />
        <Benefits />
        <Education />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
    </MainLayout>
  );
}
