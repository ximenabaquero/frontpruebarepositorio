import PatientRecordDetail from "@/features/patients/components/PatientRecordDetail";

interface Props {
  params: Promise<{
    id: string;
    evaluationId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id, evaluationId } = await params;
  const patientId = Number(id);
  const evaluationIdNum = Number(evaluationId);

  return (
    <PatientRecordDetail patientId={patientId} evaluationId={evaluationIdNum} />
  );
}
