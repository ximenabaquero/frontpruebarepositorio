import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import PlatformSection from "./components/PlatformSection";
import FeaturesSection from "./components/FeacturesSection";
import PhaseTwo from "./components/PhaseTwo";
import CallToAction from "./components/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <PlatformSection  />
      <FeaturesSection />
      <PhaseTwo />
      <CallToAction />
    </>
  )
}
