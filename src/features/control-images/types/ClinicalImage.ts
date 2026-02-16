export interface ClinicalImage {
  id: number;
  title: string;
  description: string | null;
  before_image: string;
  after_image: string;
  created_at: string;
}

export interface ClinicalImageFormData {
  title: string;
  description?: string;
  before_image: File;
  after_image: File;
}

export interface ClinicalImageUpdateData {
  title?: string;
  description?: string;
  before_image?: File;
  after_image?: File;
}
