import PacienteDetallePage from "@/features/pacientes-pagador/PacienteDetallePage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = {
  title: "Detalle de Paciente — OLGA",
};

export default async function PacienteDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PagadorLayout>
      <PacienteDetallePage id={Number(id)} />
    </PagadorLayout>
  );
}
