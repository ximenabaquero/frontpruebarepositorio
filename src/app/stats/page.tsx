import { Suspense } from "react";
import StatsPage from "@/features/stats/StatsPage";

export default function Stats() {
  return (
    <Suspense fallback={null}>
      <StatsPage />
    </Suspense>
  );
}
