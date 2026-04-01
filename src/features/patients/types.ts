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
