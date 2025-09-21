"use client";

import { FlightData } from "@/types/chat";
import { Plane, Clock, Check, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FlightCardProps {
  flight: FlightData;
  onSelect?: (flight: FlightData) => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
}

export function FlightCard({ flight, onSelect, isSelected = false, showSelectButton = true }: FlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: string | undefined, currency: string | undefined) => {
    if (!price || !currency) return "";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(price));
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: string | undefined) => {
    if (!duration) return "";
    // Parse ISO 8601 duration format (PT26H10M)
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${minutes}m`;
      }
    }
    return duration;
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(flight);
    }
  };

  return (
    <Card
      className={`
        relative transition-all duration-200 cursor-pointer group
        ${isSelected
          ? 'ring-2 ring-green-500 bg-green-50/50 dark:bg-green-950/20'
          : 'hover:shadow-lg hover:scale-[1.02]'
        }
        ${isHovered ? 'shadow-lg' : 'shadow-sm'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Plane className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold leading-tight">
                {flight.airline} {flight.flightNumber}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  Economy
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(flight.duration)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
              {formatPrice(flight.price , flight.currency )}
            </Badge>
            <Badge variant="outline" className="text-xs">
              ID: {flight.id}
            </Badge>
          </div>

          {/* Route and timing information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-sm font-medium">{flight.from}</div>
                <div className="text-xs text-muted-foreground">Departure</div>
                <div className="text-sm">{formatDateTime(flight.departure)}</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full h-px bg-border relative">
                  <Plane className="w-4 h-4 absolute -top-1.5 left-1/2 transform -translate-x-1/2 bg-background text-muted-foreground" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{flight.to}</div>
                <div className="text-xs text-muted-foreground">Arrival</div>
                <div className="text-sm">{formatDateTime(flight.arrival)}</div>
              </div>
            </div>
          </div>

          {/* Select button */}
          {showSelectButton && (
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="w-full mt-3"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Selected
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4 mr-2" />
                  Select Flight
                </>
              )}
            </Button>
          )}

          {/* Hover effect overlay */}
          {isHovered && !isSelected && (
            <div className="absolute inset-0 bg-green-500/5 rounded-lg pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
