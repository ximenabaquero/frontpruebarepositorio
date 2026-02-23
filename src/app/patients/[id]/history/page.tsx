import PatientMedicalHistoryPage from "@/features/patients/PatientMedicalHistoryPage";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  return <PatientMedicalHistoryPage patientId={id} />;
}
