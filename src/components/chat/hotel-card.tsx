"use client";

import { HotelData } from "@/types/chat";
import { MapPin, Calendar, Star, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HotelCardProps {
  hotel: HotelData;
  onSelect?: (hotel: HotelData) => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
}

export function HotelCard({ hotel, onSelect, isSelected = false, showSelectButton = true }: HotelCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: string, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(hotel);
    }
  };

  return (
    <Card
      className={`
        relative transition-all duration-200 cursor-pointer group
        ${isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
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
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <CardHeader className="pb-3 px-4 sm:px-6 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold leading-tight truncate">
                {hotel.name}
              </CardTitle>
              <div className="flex items-center gap-0.5 sm:gap-1 mt-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <span className="text-xs sm:text-sm text-muted-foreground ml-1">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-4 sm:px-6 pb-4">
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-base sm:text-lg font-bold px-2 sm:px-3 py-1">
              {formatPrice(hotel.price, hotel.currency)}
            </Badge>
            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
              ID: {hotel.id}
            </Badge>
          </div>

          {/* Date information */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Check-in:</span>
              <span className="text-muted-foreground">{formatDate(hotel.checkIn)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Check-out:</span>
              <span className="text-muted-foreground">{formatDate(hotel.checkOut)}</span>
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
                  <MapPin className="w-4 h-4 mr-2" />
                  Select Hotel
                </>
              )}
            </Button>
          )}

          {/* Hover effect overlay */}
          {isHovered && !isSelected && (
            <div className="absolute inset-0 bg-blue-500/5 rounded-lg pointer-events-none" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
