"use client";

import { useState, useEffect } from "react";
import { ChatSession } from "@/types/chat";
import { ChatHistoryService } from "@/lib/chat-history-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  MessageSquare,
  Calendar,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

interface ChatHistoryPanelProps {
  currentChatId?: string;
  onChatSelect: (chatSession: ChatSession) => void;
  onNewChat: () => void;
  className?: string;
  onClose?: () => void;
  onToggleSidebar?: () => void;
  isMobile?: boolean;
}

export function ChatHistoryPanel({
  currentChatId,
  onChatSelect,
  onNewChat,
  className,
  onClose,
  onToggleSidebar,
  isMobile = false,
}: ChatHistoryPanelProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Load chat sessions on mount
  useEffect(() => {
    loadChatSessions();
  }, []);

  // Search chat sessions when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchChatSessions(searchQuery);
    } else {
      loadChatSessions();
    }
  }, [searchQuery]);

  const loadChatSessions = async (forceRefresh = false) => {
    try {
      setIsLoading(true);

      // Check authentication before loading sessions
      if (!ChatHistoryService.checkAuthentication()) {
        console.log("User not authenticated, showing empty chat sessions");
        setChatSessions([]);
        return;
      }

      const sessions = await ChatHistoryService.getChatSessions(forceRefresh);
      setChatSessions(sessions);
    } catch (error) {
      console.error("Failed to load chat sessions:", error);
      // Show empty state on error - the service will fallback to dummy data
      setChatSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchChatSessions = async (query: string) => {
    try {
      setIsSearching(true);
      const sessions = await ChatHistoryService.searchChatSessions(query);
      setChatSessions(sessions);
    } catch (error) {
      console.error("Failed to search chat sessions:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteChat = async (chatId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (confirm("Are you sure you want to delete this chat?")) {
      try {
        await ChatHistoryService.deleteChatSession(chatId);
        setChatSessions((prev) =>
          prev.filter((session) => session.id !== chatId)
        );

        // If we deleted the current chat, trigger new chat
        if (currentChatId === chatId) {
          onNewChat();
        }
      } catch (error) {
        console.error("Failed to delete chat session:", error);
      }
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (typeof title !== "string") {
      return ``;
    }
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r border-border",
        className
      )}
    >
      {/* Header */}
      <div className="mt-2 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" animated={false} />
            <h2 className="text-lg font-semibold">Chat History</h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Close button only visible on mobile */}
            {/* {isMobile && onClose && (
              <Button
                onClick={onClose}
                size="sm"
                className="h-8 w-8 p-0"
                variant="ghost"
                title="Close sidebar"
              >
                <X className="h-4 w-4" />
              </Button>
            )} */}
            <Button
              onClick={() => loadChatSessions(true)}
              size="sm"
              className="h-8 w-8 p-0"
              variant="ghost"
              disabled={isLoading}
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              onClick={onNewChat}
              size="sm"
              className="h-8 w-8 p-0"
              variant="ghost"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="h-full overflow-y-auto">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={onNewChat}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Start a new chat
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    onChatSelect(session);
                    onClose?.();
                  }}
                  className={cn(
                    "group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    currentChatId === session.id && "bg-muted"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium truncate overflow-hidden">
                        {truncateTitle(session.title)}
                      </h3>
                      {currentChatId === session.id && (
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(session.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteChat(session.id, e)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          {isSearching ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Searching...
            </div>
          ) : (
            `${chatSessions.length} conversation${chatSessions.length !== 1 ? "s" : ""
            }`
          )}
        </div>
      </div>
    </div>
  );
}
