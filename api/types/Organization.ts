export type Organization = {
  id: string;
  business_name: string;
  email: string;
  category: string;
  minutes: number;
  role_id: number
};

export type OrganizationResponse = {
  success: boolean;
  organizations: Organization[];
};
