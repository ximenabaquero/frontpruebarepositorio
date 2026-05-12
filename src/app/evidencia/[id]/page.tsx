import EvidenciaPage from "@/features/evidencia/EvidenciaPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = {
  title: "Evidencia de Servicio — OLGA",
};

export default async function Evidencia({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PagadorLayout>
      <EvidenciaPage id={Number(id)} />
    </PagadorLayout>
  );
}
