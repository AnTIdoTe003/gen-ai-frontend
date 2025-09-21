import { LogDoc, LogQueryParams, LogsResponse } from "@/types/logs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export class LogService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getLogs(params: LogQueryParams): Promise<LogsResponse> {
    const searchParams = new URLSearchParams();

    // Add all non-undefined parameters to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/logs?${queryString}` : "/logs";

    return this.makeRequest<LogsResponse>(endpoint);
  }

  static async getLogById(id: string): Promise<LogDoc> {
    return this.makeRequest<LogDoc>(`/logs/${id}`);
  }

  static async exportLogs(
    params: LogQueryParams,
    format: "csv" | "json" = "json"
  ): Promise<Blob> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    searchParams.append("format", format);
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/logs/export?${queryString}`
      : "/logs/export";

    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  static buildLogQueryUrl(params: LogQueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString
      ? `${API_BASE_URL}/logs?${queryString}`
      : `${API_BASE_URL}/logs`;
  }
}

// Helper function to format timestamps
export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

// Helper function to get log level color
export const getLogLevelColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case "debug":
      return "text-gray-500";
    case "info":
      return "text-blue-500";
    case "warn":
      return "text-yellow-500";
    case "error":
      return "text-red-500";
    case "fatal":
      return "text-red-700";
    default:
      return "text-gray-500";
  }
};

// Helper function to get log level badge variant
export const getLogLevelBadgeVariant = (
  level: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (level.toLowerCase()) {
    case "debug":
      return "secondary";
    case "info":
      return "default";
    case "warn":
      return "outline";
    case "error":
      return "destructive";
    case "fatal":
      return "destructive";
    default:
      return "secondary";
  }
};
