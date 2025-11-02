"use client";

import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Calendar, Plane, Palmtree, Mountain, Building2, Sparkles } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    id: "beach",
    label: "Beach Vacation",
    icon: Palmtree,
    prompt: "Plan a 5-day beach vacation in Goa with hotels and activities",
    gradient: "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20"
  },
  {
    id: "mountain",
    label: "Mountain Escape",
    icon: Mountain,
    prompt: "Plan a weekend trip to Manali with adventure activities",
    gradient: "from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20"
  },
  {
    id: "city",
    label: "City Explorer",
    icon: Building2,
    prompt: "Plan a 3-day city tour of Jaipur with cultural experiences",
    gradient: "from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
  },
  {
    id: "budget",
    label: "Budget Trip",
    icon: DollarSign,
    prompt: "Plan an affordable 4-day trip to Kerala under ₹20,000",
    gradient: "from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20"
  },
  {
    id: "luxury",
    label: "Luxury Getaway",
    icon: Sparkles,
    prompt: "Plan a luxury 7-day trip to Dubai with premium hotels",
    gradient: "from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20"
  },
  {
    id: "weekend",
    label: "Quick Weekend",
    icon: Calendar,
    prompt: "Suggest weekend destinations near Mumbai within 200km",
    gradient: "from-indigo-500/10 to-blue-500/10 hover:from-indigo-500/20 hover:to-blue-500/20"
  },
  {
    id: "international",
    label: "International",
    icon: Plane,
    prompt: "Plan a 10-day international trip to Thailand with flights",
    gradient: "from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20"
  },
  {
    id: "family",
    label: "Family Trip",
    icon: MapPin,
    prompt: "Plan a family-friendly 5-day trip to Singapore",
    gradient: "from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20"
  }
];

export function QuickActions({ onActionClick, disabled = false }: QuickActionsProps) {
  return (
    <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          ✨ Get Started with These Ideas
        </h3>
        <p className="text-sm text-muted-foreground">
          Click any suggestion below or type your own request
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              size="lg"
              onClick={() => onActionClick(action.prompt)}
              disabled={disabled}
              className={`
                rounded-full flex  items-center justify-center gap-2.5 h-auto py-2 px-2
                text-sm font-medium transition-all duration-300
                border-border/50 bg-gradient-to-br ${action.gradient}
                hover:scale-105 hover:shadow-md hover:border-border
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                group relative overflow-hidden
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Icon with gradient background */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                <Icon className="w-6 h-6 text-primary relative z-10 group-hover:scale-110 transition-transform" />
              </div>

              {/* Label */}
              <span className="text-foreground/90 group-hover:text-foreground transition-colors text-center leading-tight">
                {action.label}
              </span>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300 pointer-events-none" />
            </Button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground/70">
          💡 Tip: You can also use voice input by clicking the microphone icon or pressing Ctrl/Cmd + M
        </p>
      </div>
    </div>
  );
}
