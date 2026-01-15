import { Suspense } from "react";
import PatientsPage from "@/features/patients/PatientsPage";

export default function Patients() {
  return (
    <Suspense fallback={null}>
      <PatientsPage />
    </Suspense>
  );
}
