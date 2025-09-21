"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, X, MapPin, Plane } from "lucide-react";
import { HotelData, FlightData } from "@/types/chat";
// import { useRouter } from "next/router"; // TODO: Implement navigation functionality

interface SelectedItem {
  data: HotelData | FlightData;
  type: "hotel" | "flight";
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  selectedItems?: SelectedItem[];
  onRemoveSelectedItem?: (index: number) => void;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  selectedItems = [],
  onRemoveSelectedItem,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [language, setLanguage] = useState("en"); // default English
  // const router = useRouter(); // TODO: Implement navigation functionality

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "bn", label: "বাংলা" },
    { code: "ta", label: "தமிழ்" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedItems.length > 0) && !disabled) {
      let fullMessage = message.trim();
      if (selectedItems.length > 0) {
        const selectedInfo = selectedItems
          .map((item) => {
            const price = new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: item.data.currency ?? "INR",
            }).format(parseFloat(item.data.price ?? "0"));
            let itemName = "";
            if (item.type === "hotel") {
              itemName = item.data.name || "Hotel";
            } else {
              const flightData = item.data as FlightData;
              if (flightData.name) {
                itemName = flightData.name;
              } else if (flightData.airline && flightData.flightNumber) {
                itemName = `${flightData.airline} ${flightData.flightNumber}`;
              } else if (flightData.from && flightData.to) {
                itemName = `${flightData.from} → ${flightData.to}`;
              } else {
                itemName = "Flight";
              }
            }

            return `${item.type === "hotel" ? "Hotel" : "Flight"
              }: ${itemName} (${price})`;
          })
          .join(", ");

        if (fullMessage) {
          fullMessage += `\n\nSelected: ${selectedInfo}`;
        } else {
          fullMessage = `Selected: ${selectedInfo}`;
        }
      }
      onSendMessage(fullMessage);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  return (
    <div className="space-y-2">
      {/* 🔥 Multilingual bar on top */}
      <div className="flex gap-2 justify-start overflow-x-auto pb-1">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "outline"}
            size="sm"
            className="rounded-full px-3 py-1 text-sm"
            onClick={() => {
              setLanguage(lang.code);
              onSendMessage("Change language to " + lang.label);
            }}
          >
            {lang.label}
          </Button>
        ))}
      </div>

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Selected Items ({selectedItems.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item, index) => {
              const price = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: item.data.currency ?? "INR",
              }).format(parseFloat(item.data.price ?? "0"));

              let itemName = "";
              if (item.type === "hotel") {
                itemName = item.data.name || "Hotel";
              } else {
                const flightData = item.data as FlightData;
                if (flightData.name) {
                  itemName = flightData.name;
                } else if (flightData.airline && flightData.flightNumber) {
                  itemName = `${flightData.airline} ${flightData.flightNumber}`;
                } else if (flightData.from && flightData.to) {
                  itemName = `${flightData.from} → ${flightData.to}`;
                } else {
                  itemName = "Flight";
                }
              }

              return (
                <Badge
                  key={`${item.type}-${item.data.id || index}-${index}`}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-2 border border-border/50"
                >
                  {item.type === "hotel" ? (
                    <MapPin className="w-3 h-3 text-blue-500" />
                  ) : (
                    <Plane className="w-3 h-3 text-green-500" />
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium truncate max-w-[180px]">
                      {itemName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {price}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSelectedItem?.(index)}
                    className="h-5 w-5 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end space-x-1 sm:space-x-2 p-1 sm:p-2 border border-border rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
          {/* Attachment button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 p-0 text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>

          {/* Text input */}
          <div className="flex-1 min-w-0">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                language === "hi"
                  ? "अपनी यात्रा के बारे में कुछ भी पूछें..."
                  : language === "bn"
                    ? "আপনার ভ্রমণ পরিকল্পনা সম্পর্কে কিছু জিজ্ঞাসা করুন..."
                    : language === "ta"
                      ? "உங்கள் பயணம் பற்றி எதையும் கேளுங்கள்..."
                      : "Ask me anything about your trip planning..."
              }
              className="min-h-[36px] sm:min-h-[40px] max-h-[100px] sm:max-h-[120px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 sm:p-0 text-sm sm:text-base"
              disabled={disabled}
              rows={1}
            />
          </div>

          {/* Send button */}
          <Button
            type="submit"
            size="sm"
            disabled={
              (!message.trim() && selectedItems.length === 0) || disabled
            }
            className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Character count */}
        {message.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {message.length} characters
          </div>
        )}
      </form>
    </div>
  );
}
