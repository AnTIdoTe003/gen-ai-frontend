"use client";

import { Message, HotelData, FlightData } from "@/types/chat";
import { Bot, User, Copy, Check, CreditCard, Download, Share } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HotelCard } from "./hotel-card";
import { FlightCard } from "./flight-card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/router";

interface ChatMessageProps {
  message: Message;
  onDataSelect?: (data: HotelData | FlightData, type: 'hotel' | 'flight') => void;
  selectedItems?: Array<{ data: HotelData | FlightData; type: 'hotel' | 'flight' }>;
  showPaymentButton?: boolean;
}

export function ChatMessage({ message, onDataSelect, selectedItems = [], showPaymentButton = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const isUser = message.role === "user";
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const generatePDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      setIsExporting(true);

      // Get the message content element
      const messageElement = document.querySelector(`[data-message-id="${message.id || 'message'}"]`);
      if (!messageElement) {
        throw new Error('Message element not found');
      }

      // Convert HTML to canvas
      const canvas = await html2canvas(messageElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: messageElement.scrollWidth,
        height: messageElement.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const pdf = await generatePDF();
      pdf.save(`trip-plan-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleSharePDF = async () => {
    try {
      setIsSharing(true);

      // Check if Web Share API is supported
      if (!navigator.share) {
        // Fallback to download
        await handleExportPDF();
        return;
      }

      const pdf = await generatePDF();
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `trip-plan-${new Date().toISOString().split('T')[0]}.pdf`, {
        type: 'application/pdf',
      });

      // Check if the browser can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Trip Plan',
          text: 'Here is your personalized trip plan!',
        });
      } else {
        // Fallback to download
        await handleExportPDF();
      }
    } catch (error) {
      console.error('Failed to share PDF:', error);
      // Fallback to download
      await handleExportPDF();
    } finally {
      setIsSharing(false);
    }
  };

  // Format time on client side only to avoid hydration issues
  useEffect(() => {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    setFormattedTime(formatTime(message.timestamp));
  }, [message.timestamp]);

  // Helper function to check if an item is selected
  const isItemSelected = (itemId: string | undefined, type: 'hotel' | 'flight') => {
    if (!itemId) return false;
    return selectedItems.some(selected => selected.data.id === itemId && selected.type === type);
  };
  return (
    <div
      className={`group flex gap-2 items-start space-x-2 sm:space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
      data-message-id={message.id || 'message'}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`rounded-lg px-3 py-2 sm:px-4 sm:py-3 ${isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
            }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
              {message.content}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert break-words text-sm sm:text-base leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Render data if available (hotels/flights) */}
        {message.data && !isUser && (
          <div className="mt-4 space-y-4">
            {message.data.hotels && message.data.hotels.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Available Hotels
                </h4>
                <div className="grid gap-3">
                  {message.data.hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onSelect={(hotelData) => onDataSelect?.(hotelData, 'hotel')}
                      isSelected={isItemSelected(hotel.id, 'hotel')}
                      showSelectButton={true}
                    />
                  ))}
                </div>
              </div>
            )}
            {message.data.flights && message.data.flights.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Available Flights
                </h4>
                <div className="grid gap-3">
                  {message.data.flights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={(flightData) => onDataSelect?.(flightData, 'flight')}
                      isSelected={isItemSelected(flight.id, 'flight')}
                      showSelectButton={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Button and Export/Share Options - shown when API response has done: true */}
        {showPaymentButton && !isUser && (
          <div className="mt-4 space-y-3">
            {/* Main Payment Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => router.push('/payment')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Payment
              </Button>
            </div>

            {/* Export and Share Options */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                variant="outline"
                className="px-4 py-2 text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </Button>

              <Button
                onClick={handleSharePDF}
                disabled={isSharing}
                variant="outline"
                className="px-4 py-2 text-sm"
              >
                <Share className="w-4 h-4 mr-2" />
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
            </div>
          </div>
        )}

        {/* Message Actions */}
        <div className={`flex items-center space-x-2 mt-1 sm:mt-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <span className="text-xs text-muted-foreground">
            {formattedTime || "..."}
          </span>

          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
