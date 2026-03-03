export type UserRole = 'talent' | 'tech_enterprise' | 'transform_enterprise' | 'park';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  status: string;
  created_at: string;
}

export interface Enterprise {
  id: string;
  user_id: string;
  name: string;
  credit_code?: string;
  basic_info?: Record<string, unknown>;
  operation_data?: Record<string, unknown>;
  certifications?: Record<string, unknown>;
  intellectual_property?: Record<string, unknown>;
  ai_compliance?: Record<string, unknown>;
  general_compliance?: Record<string, unknown>;
  opc_info?: Record<string, unknown>;
  completeness_score: number;
}

export interface Talent {
  id: string;
  user_id: string;
  name: string;
  basic_info?: Record<string, unknown>;
  education?: Record<string, unknown>;
  work_experience?: Record<string, unknown>;
  professional_skills?: Record<string, unknown>;
  achievements?: Record<string, unknown>;
  talent_titles?: Record<string, unknown>;
  social_insurance?: Record<string, unknown>;
  opc_info?: Record<string, unknown>;
  completeness_score: number;
}

export interface Park {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  basic_info?: Record<string, unknown>;
  industry_focus?: Record<string, unknown>;
  tenant_info?: Record<string, unknown>;
  investment_needs?: Record<string, unknown>;
  opc_community_info?: Record<string, unknown>;
  completeness_score: number;
}

export interface Policy {
  id: string;
  title: string;
  issuing_authority?: string;
  level?: string;
  policy_type?: string;
  status: string;
  is_opc_policy: boolean;
  region?: string;
  publish_date?: string;
  apply_end_date?: string;
  support_details?: Record<string, unknown>;
}

export interface MatchResult {
  id: string;
  entity_id: string;
  policy_id: string;
  match_score: number;
  match_status: string;
  estimated_amount?: number;
  gap_list?: Record<string, unknown>;
}

export interface Application {
  id: string;
  policy_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  msg_type: string;
  title: string;
  content?: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedData<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}
