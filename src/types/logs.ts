export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogDoc {
  level: string;
  message: string;
  module: string;
  timestamp: string;
  error?: string; // present only when level = "error"
  hasError?: boolean; // derived property indicating if error field exists
}

export interface LogsData {
  docs: LogDoc[];
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export interface LogsResponse {
  error: boolean;
  data: LogsData;
  message: string;
}

export interface LogFilters {
  level?: LogLevel;
  module?: string;
  hasError?: boolean;
  q?: string; // search query
  from?: string; // ISO date string
  to?: string; // ISO date string
  userId?: string;
  sessionId?: string;
  requestId?: string;
  tags?: string[];
}

export interface LogQueryParams extends LogFilters {
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  sortBy?: "timestamp" | "level" | "module" | "hasError";
}
