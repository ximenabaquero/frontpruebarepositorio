import SalesPage from "@/features/home/SalesPage";
import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import PlatformSection from "./components/PlatformSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <PlatformSection  />
      <SalesPage />
    </>
  )
}
