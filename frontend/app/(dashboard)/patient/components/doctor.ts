export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating?: number;
  consultation_fee?: number;
  profile_photo?: string;
  is_available?: boolean;
}