"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Logo } from "@/components/logo";

interface ChatHeaderProps {
  onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Logo size="sm" animated={false} />
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground font-space-grotesk">
                Roxy AI - EaseMyTrip AI
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
