import { Suspense } from "react";
import RegisterPatientPage from "@/features/post-login/RegisterPatientPage";

export default function RegisterPatient() {
  return (
    <Suspense fallback={null}>
      <RegisterPatientPage />
    </Suspense>
  );
}

