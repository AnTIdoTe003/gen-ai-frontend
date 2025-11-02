"use client";

import { Message, HotelData, FlightData } from "@/types/chat";
import { Bot, User, Copy, Check, CreditCard, Download, Share, ThumbsUp, ThumbsDown, RefreshCw, Edit, Volume2, VolumeX, Pause, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HotelCard } from "./hotel-card";
import { FlightCard } from "./flight-card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const isUser = message.role === "user";
  const router = useRouter();
  const { toast } = useToast();

  // Check if a flight has been selected
  const hasFlightSelected = selectedItems.some(item => item.type === "flight");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Get the best available voice for high-quality speech
  const getBestVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return null;
    }

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prefer high-quality neural/premium voices
    // Priority order: Neural voices, Google voices, high-quality English voices
    const neuralVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("neural") ||
        v.name.toLowerCase().includes("premium") ||
        v.name.toLowerCase().includes("enhanced")
    );

    if (neuralVoice) return neuralVoice;

    // Look for Google voices (usually high quality)
    const googleVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("google") &&
        (v.lang.startsWith("en") || v.lang.startsWith("en-US"))
    );

    if (googleVoice) return googleVoice;

    // Look for high-quality English voices
    const preferredNames = [
      "samantha", // macOS high-quality voice
      "karen", // macOS high-quality voice
      "alex", // macOS high-quality voice
      "samantha premium",
      "zira", // Windows high-quality voice
      "mark", // Windows high-quality voice
      "joanna", // AWS Polly-like quality names
      "matthew",
    ];

    for (const name of preferredNames) {
      const voice = voices.find(
        (v) =>
          v.name.toLowerCase().includes(name) &&
          (v.lang.startsWith("en") || v.lang.startsWith("en-US"))
      );
      if (voice) return voice;
    }

    // Fallback: find any English US voice
    const englishUSVoice = voices.find(
      (v) => v.lang.startsWith("en-US") && v.localService === false
    );

    if (englishUSVoice) return englishUSVoice;

    // Last resort: any English voice
    return voices.find((v) => v.lang.startsWith("en")) || voices[0];
  };

  // Initialize voice selection
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Wait for voices to be loaded
      const loadVoices = () => {
        const voice = getBestVoice();
        if (voice) {
          selectedVoiceRef.current = voice;
        }
      };

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Try loading immediately
      loadVoices();

      // Also try after a short delay
      setTimeout(loadVoices, 100);
    }
  }, []);

  // Text-to-speech functionality
  const speakMessage = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    // If already speaking, pause it
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    // If paused, resume it
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Extract plain text from markdown for better speech
    let textContent = message.content
      .replace(/#{1,6}\s+/g, "") // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links, keep text
      .replace(/`(.*?)`/g, "$1") // Remove code backticks
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/\*\s+/g, "") // Remove bullet points
      .replace(/\n{3,}/g, ". ") // Replace multiple newlines with periods
      .replace(/\n/g, ". ") // Replace single newlines with periods
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\.\s*\./g, ".") // Remove duplicate periods
      .trim();

    // Clean up common markdown artifacts
    textContent = textContent
      .replace(/\$\d+/g, "") // Remove currency symbols followed by numbers
      .replace(/→/g, " to ") // Replace arrows with "to"
      .replace(/–/g, " to ") // Replace en dash
      .replace(/—/g, " to ") // Replace em dash
      .replace(/\s+/g, " ") // Final whitespace normalization
      .trim();

    if (!textContent) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Ensure we have the best voice selected
    if (!selectedVoiceRef.current) {
      selectedVoiceRef.current = getBestVoice();
    }

    const utterance = new SpeechSynthesisUtterance(textContent);

    // Use the best available voice
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
      utterance.lang = selectedVoiceRef.current.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }

    // Optimize speech parameters for clearer sound
    utterance.rate = 0.95; // Slightly slower for better clarity
    utterance.pitch = 1.0; // Neutral pitch
    utterance.volume = 1.0; // Maximum volume

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      toast({
        title: "🔊 Speaking",
        description: "Tap the speaker icon to pause or stop.",
      });
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;

      // Only show error toast for non-cancelled errors
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        toast({
          title: "Speech Error",
          description: "An error occurred while speaking. Please try again.",
          variant: "destructive",
        });
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    const cleanup = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      }
    };

    return cleanup;
  }, []);

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
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      });
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
      className={`group flex gap-3 items-start mb-6 ${isUser ? 'flex-row-reverse' : ''}`}
      data-message-id={message.id || 'message'}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-600 text-white text-sm border-2 border-blue-700">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-easemytrip-secondary to-easemytrip-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`rounded-xl px-4 py-3 ${isUser
            ? 'bg-blue-600 text-white shadow-lg border-2 border-blue-700'
            : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
            }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap break-words text-base leading-relaxed font-medium">
              {message.content}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert break-words text-base leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Render data if available (hotels/flights) - Hide when flight is selected */}
        {message.data && !isUser && !hasFlightSelected && (
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
                  <span className="w-2 h-2 bg-gradient-to-r from-[#2F80ED] to-[#56CCF2] rounded-full"></span>
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

        {/* Show collapsed message when flight is selected */}
        {message.data && !isUser && hasFlightSelected && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Flight selected. You can view your selection at the bottom and proceed to send your choices.
            </p>
          </div>
        )}

        {/* Payment Button and Export/Share Options - shown when API response has done: true */}
        {showPaymentButton && !isUser && (
          <div className="mt-4 space-y-3">
            {/* Main Payment Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => router.push('/payment')}
                className="bg-[#2F80ED] hover:from-easemytrip-primary/90 hover:to-easemytrip-secondary/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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

        {/* Message Actions - Copilot Style */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={speakMessage}
              className={`h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 ${isSpeaking || isPaused
                ? "text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                : ""
                }`}
              title={
                isPaused
                  ? "Resume reading"
                  : isSpeaking
                    ? "Pause reading"
                    : "Read aloud"
              }
            >
              {isPaused ? (
                <Play className="w-4 h-4" />
              ) : isSpeaking ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
              )}
            </Button>
            {isSpeaking && (
              <Button
                variant="ghost"
                size="sm"
                onClick={stopSpeaking}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 hover:text-red-700 dark:hover:text-red-400"
                title="Stop reading"
              >
                <VolumeX className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
              )}
            </Button>

          </div>
        )}
      </div>
    </div>
  );
}
