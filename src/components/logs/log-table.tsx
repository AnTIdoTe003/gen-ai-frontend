"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  AlertTriangle,
  Info,
  Bug,
  AlertCircle,
  XCircle
} from "lucide-react";
import { LogDoc, LogsData } from "@/types/logs";
import { formatTimestamp, getLogLevelColor, getLogLevelBadgeVariant } from "@/lib/log-service";

interface LogTableProps {
  logs: LogDoc[];
  response: LogsData;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const getLogLevelIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case "debug":
      return <Bug className="h-4 w-4" />;
    case "info":
      return <Info className="h-4 w-4" />;
    case "warn":
      return <AlertTriangle className="h-4 w-4" />;
    case "error":
      return <XCircle className="h-4 w-4" />;
    case "fatal":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

export function LogTable({ logs, response, onPageChange, isLoading }: LogTableProps) {

  const renderPagination = () => {
    const { page, totalPages, hasNextPage, hasPrevPage, limit, totalDocs } = response;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalDocs)} of {totalDocs} entries
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Timestamp</TableHead>
                  <TableHead className="w-[100px]">Level</TableHead>
                  <TableHead className="w-[150px]">Module</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-[80px]">Error</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading logs...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No logs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getLogLevelBadgeVariant(log.level)}
                          className={`flex items-center gap-1 ${getLogLevelColor(log.level)}`}
                        >
                          {getLogLevelIcon(log.level)}
                          {log.level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.module}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="truncate" title={log.message}>
                            {log.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.error ? (
                          <Badge variant="destructive">Error</Badge>
                        ) : (
                          <Badge variant="secondary">OK</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Badge
                                  variant={getLogLevelBadgeVariant(log.level)}
                                  className={`flex items-center gap-1 ${getLogLevelColor(log.level)}`}
                                >
                                  {getLogLevelIcon(log.level)}
                                  {log.level.toUpperCase()}
                                </Badge>
                                Log Details
                              </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh] pr-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Basic Information</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Timestamp:</span> {formatTimestamp(log.timestamp)}
                                    </div>
                                    <div>
                                      <span className="font-medium">Level:</span> {log.level}
                                    </div>
                                    <div>
                                      <span className="font-medium">Module:</span> {log.module}
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h4 className="font-medium mb-2">Message</h4>
                                  <div className="bg-muted p-3 rounded-md">
                                    <p className="text-sm font-mono whitespace-pre-wrap">{log.message}</p>
                                  </div>
                                </div>

                                {log.error && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h4 className="font-medium mb-2">Error</h4>
                                      <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                                        <p className="text-sm font-mono text-red-800 whitespace-pre-wrap">
                                          {log.error}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {renderPagination()}
        </CardContent>
      </Card>
    </>
  );
}
