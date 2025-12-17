import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Benefits from "@/components/Benefits";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Testimonials from "@/components/Testimonials";
import Education from "@/components/Education";
import MainLayout from "@/layouts/MainLayout";

export default function Home() {
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
