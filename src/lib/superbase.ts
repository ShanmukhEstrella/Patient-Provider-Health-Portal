import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'patient' | 'provider';

export interface UserProfile {
  id: string;
  full_name: string;
  date_of_birth?: string;
  phone: string;
  address: string;
  emergency_contact: string;
  blood_type: string;
  allergies: string;
  medical_conditions: string;
  created_at: string;
  updated_at: string;
}

export interface HealthGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_value?: number;
  current_value: number;
  unit: string;
  target_date?: string;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  published_at: string;
}
