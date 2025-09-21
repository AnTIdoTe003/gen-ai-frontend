"use client";

import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";

interface ChatHeaderProps {
  onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground font-space-grotesk">
                Roxy AI
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Your personal travel planning assistant
              </p>
            </div>
          </div>

          <Button
            onClick={onNewChat}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
            title="New Chat (⌘K)"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">New Chat</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
