"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, Search, X, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LogQueryParams, LogLevel } from "@/types/logs";

interface LogFiltersProps {
  filters: LogQueryParams;
  onFiltersChange: (filters: LogQueryParams) => void;
  onExport: () => void;
  isLoading?: boolean;
}

const LOG_LEVELS: { value: LogLevel; label: string }[] = [
  { value: "debug", label: "Debug" },
  { value: "info", label: "Info" },
  { value: "warn", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "fatal", label: "Fatal" },
];

const MODULES = [
  "User Service",
  "Payment Service",
  "Auth Service",
  "Notification Service",
  "Analytics Service",
  "Database Service",
];

export function LogFilters({ filters, onFiltersChange, onExport, isLoading }: LogFiltersProps) {
  const [fromDate, setFromDate] = useState<Date | undefined>(
    filters.from ? new Date(filters.from) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    filters.to ? new Date(filters.to) : undefined
  );

  const updateFilter = (key: keyof LogQueryParams, value: string | number | boolean | undefined) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 }); // Reset to first page when filtering
  };

  const clearFilters = () => {
    onFiltersChange({
      order: "desc",
      page: 1,
      limit: 50,
    });
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleDateChange = (type: "from" | "to", date: Date | undefined) => {
    if (type === "from") {
      setFromDate(date);
      updateFilter("from", date ? date.toISOString() : undefined);
    } else {
      setToDate(date);
      updateFilter("to", date ? date.toISOString() : undefined);
    }
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => key !== "page" && key !== "limit" && filters[key as keyof LogQueryParams] !== undefined
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Log Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Level Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Query</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search in logs..."
                value={filters.q || ""}
                onChange={(e) => updateFilter("q", e.target.value || undefined)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Log Level</Label>
            <Select
              value={filters.level || "all"}
              onValueChange={(value) => updateFilter("level", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {LOG_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Module and Has Error Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="module">Module</Label>
            <Select
              value={filters.module || "all"}
              onValueChange={(value) => updateFilter("module", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modules</SelectItem>
                {MODULES.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hasError">Has Error</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="hasError"
                checked={filters.hasError === true}
                onCheckedChange={(checked) => updateFilter("hasError", checked ? true : undefined)}
              />
              <Label htmlFor="hasError" className="text-sm text-muted-foreground">
                Show only logs with errors
              </Label>
            </div>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => handleDateChange("from", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => handleDateChange("to", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Sort and Order Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sortBy">Sort By</Label>
            <Select
              value={filters.sortBy || "timestamp"}
              onValueChange={(value) => updateFilter("sortBy", value as "timestamp" | "level" | "module" | "hasError")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Timestamp</SelectItem>
                <SelectItem value="level">Level</SelectItem>
                <SelectItem value="module">Module</SelectItem>
                <SelectItem value="hasError">Has Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Select
              value={filters.order || "desc"}
              onValueChange={(value) => updateFilter("order", value as "asc" | "desc")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
