import PacientesListPage from "@/features/pacientes-pagador/PacientesListPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = {
  title: "Pacientes — OLGA",
};

export default function Pacientes() {
  return (
    <PagadorLayout>
      <PacientesListPage />
    </PagadorLayout>
  );
}
