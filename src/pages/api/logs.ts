import type { NextApiRequest, NextApiResponse } from "next";
import { LogsResponse, LogDoc } from "@/types/logs";

// Mock data for testing
const mockLogs: LogDoc[] = [
  {
    timestamp: "2025-01-16T10:30:00.000Z",
    level: "error",
    module: "User Service",
    message: "Payment failed for user 12345",
    error: "Insufficient funds",
    hasError: true,
  },
  {
    timestamp: "2025-01-16T10:29:45.000Z",
    level: "info",
    module: "Auth Service",
    message: "User login successful",
    hasError: false,
  },
  {
    timestamp: "2025-01-16T10:28:30.000Z",
    level: "warn",
    module: "Payment Service",
    message: "Rate limit approaching for API key",
    hasError: false,
  },
  {
    timestamp: "2025-01-16T10:27:15.000Z",
    level: "fatal",
    module: "Database Service",
    message: "Database connection pool exhausted",
    error: "Connection pool timeout",
    hasError: true,
  },
  {
    timestamp: "2025-01-16T10:26:00.000Z",
    level: "debug",
    module: "Analytics Service",
    message: "Processing analytics batch",
    hasError: false,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "GET") {
    const {
      level,
      module,
      hasError,
      q,
      order = "desc",
      page = 1,
      limit = 50,
      sortBy = "timestamp",
    } = req.query;

    // Filter logs based on query parameters
    let filteredLogs = [...mockLogs];

    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level);
    }

    if (module) {
      filteredLogs = filteredLogs.filter((log) => log.module === module);
    }

    if (hasError === "true") {
      filteredLogs = filteredLogs.filter((log) => log.hasError === true);
    }

    if (q) {
      const query = (q as string).toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.message.toLowerCase().includes(query) ||
          log.error?.toLowerCase().includes(query) ||
          log.module.toLowerCase().includes(query)
      );
    }

    // Sort logs
    filteredLogs.sort((a, b) => {
      let aVal: string | number, bVal: string | number;

      switch (sortBy) {
        case "level":
          aVal = a.level;
          bVal = b.level;
          break;
        case "module":
          aVal = a.module;
          bVal = b.module;
          break;
        case "hasError":
          aVal = a.hasError ? 1 : 0;
          bVal = b.hasError ? 1 : 0;
          break;
        case "timestamp":
        default:
          aVal = new Date(a.timestamp).getTime();
          bVal = new Date(b.timestamp).getTime();
          break;
      }

      if (order === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    const response: LogsResponse = {
      error: false,
      data: {
        docs: paginatedLogs,
        totalDocs: filteredLogs.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredLogs.length / limitNum),
        hasNextPage: endIndex < filteredLogs.length,
        hasPrevPage: pageNum > 1,
      },
      message: "Logs retrieved successfully",
    };

    res.status(200).json(response);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
