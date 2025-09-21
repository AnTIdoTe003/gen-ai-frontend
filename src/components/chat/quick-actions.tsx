"use client";

import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar, Plane } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    id: "destination",
    label: "Find Destinations",
    icon: MapPin,
    prompt: "Help me find the best travel destinations for my next trip"
  },
  {
    id: "budget",
    label: "Budget Planning",
    icon: DollarSign,
    prompt: "Help me plan a budget-friendly trip"
  },
  {
    id: "itinerary",
    label: "Create Itinerary",
    icon: Calendar,
    prompt: "Help me create a detailed travel itinerary"
  },
  {
    id: "flights",
    label: "Flight Tips",
    icon: Plane,
    prompt: "Give me tips for finding cheap flights and booking travel"
  }
];

export function QuickActions({ onActionClick, disabled = false }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={() => onActionClick(action.prompt)}
            disabled={disabled}
            className="flex flex-col items-center space-y-1 h-auto py-3 px-2 text-xs sm:text-sm"
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-center leading-tight">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
