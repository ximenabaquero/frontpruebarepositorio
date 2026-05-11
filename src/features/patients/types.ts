export type PhotoStage = 'antes' | 'despues' | 'mes1' | 'mes2' | 'mes3';

export type PatientPhoto = {
  id: number;
  stage: PhotoStage;
  image_url: string;
  notes: string | null;
  taken_at: string;
  created_at: string;
};

export type Appointment = {
  id: number;
  medical_evaluation_id: number;
  patient_id: number;
  appointment_datetime: string;
  duration_minutes: number;
  procedure_type: 'concejacion' | 'sincecion';
  doctor_name: string | null;
  fasting_required: boolean;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
};

export type ExamOrder = {
  id: number;
  medical_evaluation_id: number;
  exams: string[];
  status: 'pendiente' | 'apto' | 'no_apto';
  notes: string | null;
  received_at: string | null;
  result_file_path: string | null;
  result_file_url?: string | null;
  created_at: string;
};

export type ProcedureItem = {
  id?: number;
  item_name: string;
  price: string;
};

export type Procedure = {
  id: number;
  procedure_date?: string;
  notes?: string;
  items: ProcedureItem[];
  total_amount: number | string;
};

export type Patient = {
  first_name: string;
  last_name: string;
  cedula: string;
  date_of_birth: string;
  biological_sex: string;
  cellphone: string;
};

export type EvaluationData = {
  id: number;
  patient: Patient;
  patient_age_at_evaluation: number;
  weight: number;
  height: number;
  bmi: number;
  bmi_status: string;
  medical_background: string;
  procedures: Procedure[];
  patient_signature?: string;
  confirmed_at?: string;
  user?: { brand_name?: string };
  referrer_name?: string;
  created_at?: string;
  status?: string;
};
