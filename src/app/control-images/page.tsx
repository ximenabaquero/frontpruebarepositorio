import { Suspense } from "react";
import ControlImagesPage from "@/features/control-images/ControlImagesPage";

export default function ControlImages() {
  return (
    <Suspense fallback={null}>
      <ControlImagesPage />
    </Suspense>
  );
}
