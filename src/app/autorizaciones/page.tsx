import AutorizacionesPage from "@/features/autorizaciones/AutorizacionesPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = {
  title: "Solicitudes de Autorización — OLGA",
};

export default function Autorizaciones() {
  return (
    <PagadorLayout>
      <AutorizacionesPage />
    </PagadorLayout>
  );
}
