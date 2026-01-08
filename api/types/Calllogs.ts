export type CallLogResponse = {
  success: boolean;
  message: string;
  error: boolean;
  data: CallLogsData;
};

export type CallLogsData = {
  docs: CallLog[];
  total: number;
  totalPages: number;
};

export type CallLog = {
  id: string;
  status: string;
  duration: number;
  cost: number;
  summary: string;
  transcript: CallTranscript[];
  endedReason: string;
  recordingUrl: string;
  startedAt: string; // ISO date
  endedAt: string; // ISO date
  starred: boolean;
  assistantId: string;
  organizationId: string;
  assistantName: string;
  phoneNumber: string;
  structuredOutputs: any | null;
};

export type CallTranscript = {
  role: string;
  content: string;
};

export type GetCallLogsParams = {
  organizationId: string;
  assistantId?: string;   // "All" | specific id
  limit?: number;
  page?: number;
  q?: string;
  sort?: "asc" | "desc";
  sortColumn?: string;
};

export type MarkFavorite = {
  success: boolean;
  message: string;
  error: boolean;
  data: StarredStatusData;
}

export type StarredStatusData = {
  starred: boolean;
};