import { Suspense } from "react";
import StatsPage from "@/features/stats/StatsPage";
import RoleGuard from "@/components/RoleGuard";

export default function Stats() {
  return (
    <RoleGuard allow={["ADMIN"]}>
      <Suspense fallback={null}>
        <StatsPage />
      </Suspense>
    </RoleGuard>
  );
}
