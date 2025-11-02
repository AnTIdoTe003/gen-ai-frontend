"use client";

import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-2 sm:space-x-3 w-fit">
      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
      </div>
      <div className="flex-1 bg-muted rounded-lg p-3 sm:p-4 w-fit">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
