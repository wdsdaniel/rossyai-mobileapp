// src/api/auth.api.ts
import { AxiosError } from "axios";
import { apiClient } from "../client";
import {
  GetCallLogsParams,
  CallLogResponse,
  MarkFavorite,
} from "../types/Calllogs";

export async function getCallLogs(
  params: GetCallLogsParams
): Promise<CallLogResponse> {
  try {
    const {
      organizationId,
      assistantId = "All",
      limit = 10,
      page = 1,
      q = "",
      sort = "desc",
      sortColumn = "updatedAt",
    } = params;

    const res = await apiClient.get<CallLogResponse>("/api/ai/voice/calls/", {
      params: {
        organization_id: organizationId,
        assistantId,
        limit,
        page,
        q,
        sort,
        sortColumn,
      },
    });

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Unexpected response status");
  } catch (error) {
    const err = error as AxiosError<any>;

    return {
      success: false,
      error: true,
      message: err.response?.data?.message || "Failed to fetch call logs",
      data: {
        docs: [],
        total: 0,
        totalPages: 0,
      },
    };
  }
}

export async function markCallLogItemFavorites(
  isFav: boolean,
  orgId: string,
  callLogId: string
): Promise<MarkFavorite> {
  try {
    const url = `/api/ai/voice/calls/${callLogId}/star`;
    const payload = {
      starred: isFav,
      organizationId: orgId,
    };

    const res = await apiClient.patch(url, payload);

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Unexpected response status");
  } catch (error) {
    const err = error as AxiosError<any>;
    return {
      success: false,
      error: true,
      message: err.response?.data?.message || "Failed to fetch call logs",
      data: {
        starred: isFav,
      },
    };
  }
}
