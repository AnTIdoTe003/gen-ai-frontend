"use client";

import { useState, useEffect, useCallback } from "react";
import { SEO } from "@/components/seo";
import { Navbar } from "@/components/navbar";
import { LogFilters } from "@/components/logs/log-filters";
import { LogTable } from "@/components/logs/log-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle } from "lucide-react";
import { LogService } from "@/lib/log-service";
import { LogQueryParams, LogsData } from "@/types/logs";

export default function LogsPage() {
  const [logs, setLogs] = useState<LogsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LogQueryParams>({
    order: "desc",
    page: 1,
    limit: 50,
    sortBy: "timestamp",
  });

  const fetchLogs = useCallback(async (queryParams: LogQueryParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await LogService.getLogs(queryParams);
      setLogs(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
      console.error("Error fetching logs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleFiltersChange = useCallback((newFilters: LogQueryParams) => {
    setFilters(newFilters);
    fetchLogs(newFilters);
  }, [fetchLogs]);

  const handlePageChange = useCallback((page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchLogs(newFilters);
  }, [filters, fetchLogs]);

  const handleRefresh = useCallback(() => {
    fetchLogs(filters);
  }, [filters, fetchLogs]);

  const handleExport = useCallback(async () => {
    try {
      const blob = await LogService.exportLogs(filters, "json");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `logs-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export logs");
      console.error("Error exporting logs:", err);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchLogs(filters);
  }, [fetchLogs, filters]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [handleRefresh]);

  return (
    <>
      <SEO
        title="Log Console - Roxy AI"
        description="Monitor and analyze application logs in real-time. Track system performance, debug issues, and optimize your Roxy AI experience."
        canonical="https://tripcraft.debmalya.in/logs"
        noindex={true}
        nofollow={true}
      />
      <main className="min-h-screen bg-background">
        <Navbar />

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Log Console</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and analyze application logs in real-time
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Filters */}
          <LogFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            isLoading={isLoading}
          />

          {/* Log Table */}
          {logs && (
            <LogTable
              logs={logs.docs}
              response={logs}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* API URL Info */}
        <div className="text-sm text-muted-foreground text-center pt-8 border-t">
          <p>
            API Endpoint: {LogService.buildLogQueryUrl(filters)}
          </p>
        </div>
      </div>
      </main>
    </>
  );
}
