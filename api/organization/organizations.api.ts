// src/api/auth.api.ts
import { apiClient } from "../client";
import { Organization, OrganizationResponse } from "../types/Organization";

export async function getOrganization(
  user_id: number
): Promise<Organization[]> {
  const url = `/api/organizations/list?user_id=${user_id}`;
  const res = await apiClient.get<OrganizationResponse>(url);
  return res.data?.organizations ?? [];
}

export async function getAgentListByOrganization(
  user_id: number
): Promise<Organization[]> {
  const url = `/api/organizations/list?user_id=${user_id}`;
  const res = await apiClient.get<OrganizationResponse>(url);
  return res.data?.organizations ?? [];
}
