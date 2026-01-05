export interface LoginResponse {
  accessToken: string;
  userData: UserData;
  role: Role[];
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_no: string | null;
  designation: string | null;
  phone_country_code: string | null;
  phone_number: string | null;
  phone_extension: string | null;
  image: string | null;
  status: string;
  user_type: string | null;
  role_id: number;
  reset_password_token: string | null;
  registration_password_token: string | null;
  portal: string;
  created_by: string | null;
  updated_by: string | null;
  organization_id: number | null;
  is_completed_onboarding: boolean;
  parent_organization_id: number | null;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  role_name: string;
  portal: string;
  user_id: number;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
}

export interface Permission {
  permission: string;
  RolePermissions: RolePermissions;
}

export interface RolePermissions {
  role_id: number;
  perm_id: number;
  createdAt: string;
  updatedAt: string;
}
