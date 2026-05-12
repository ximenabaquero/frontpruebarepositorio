import AuditoriaPage from "@/features/auditoria/AuditoriaPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = {
  title: "Auditoría y Reportes — OLGA",
};

export default function Auditoria() {
  return (
    <PagadorLayout>
      <AuditoriaPage />
    </PagadorLayout>
  );
}
