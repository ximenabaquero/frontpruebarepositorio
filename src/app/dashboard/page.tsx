import DashboardPage from "@/features/dashboard/DashboardPage";
import PagadorLayout from "@/layouts/PagadorLayout";

export const metadata = {
  title: "Dashboard Ejecutivo — OLGA",
  description: "Dashboard del pagador — OLGA Healthtech",
};

export default function Dashboard() {
  return (
    <PagadorLayout>
      <DashboardPage />
    </PagadorLayout>
  );
}
