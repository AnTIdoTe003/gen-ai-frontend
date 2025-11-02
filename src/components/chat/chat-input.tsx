"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Plane, Mic, Square, Send, Loader2 } from "lucide-react";
import { HotelData, FlightData } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/router"; // TODO: Implement navigation functionality

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition | undefined;
    webkitSpeechRecognition: new () => SpeechRecognition | undefined;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SelectedItem {
  data: HotelData | FlightData;
  type: "hotel" | "flight";
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  selectedItems?: SelectedItem[];
  onRemoveSelectedItem?: (index: number) => void;
  language?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  selectedItems = [],
  onRemoveSelectedItem,
  language = "en-US",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [showRecordingStatus, setShowRecordingStatus] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recordingLevel, setRecordingLevel] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const levelAnimationRef = useRef<number | null>(null);
  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onSendMessageRef = useRef(onSendMessage);
  const isManuallyStoppedRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);
  const lastProcessedIndexRef = useRef<number>(0);
  const processedResultsRef = useRef<Set<string>>(new Set());
  const restartAttemptsRef = useRef<number>(0);
  const { toast } = useToast();
  // const router = useRouter(); // TODO: Implement navigation functionality

  // Keep onSendMessage ref up to date
  useEffect(() => {
    onSendMessageRef.current = onSendMessage;
  }, [onSendMessage]);

  // Haptic feedback helper for mobile devices
  const triggerHapticFeedback = useCallback((style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30
      };
      navigator.vibrate(patterns[style]);
    }
  }, []);

  // Animate recording level indicator
  useEffect(() => {
    if (isRecording && !isStarting) {
      const animate = () => {
        setRecordingLevel(prev => {
          const target = 0.3 + Math.random() * 0.7; // Random between 0.3 and 1.0
          return prev + (target - prev) * 0.1; // Smooth interpolation
        });
        levelAnimationRef.current = requestAnimationFrame(animate);
      };
      levelAnimationRef.current = requestAnimationFrame(animate);
    } else {
      if (levelAnimationRef.current) {
        cancelAnimationFrame(levelAnimationRef.current);
        levelAnimationRef.current = null;
      }
      setRecordingLevel(0);
    }
    return () => {
      if (levelAnimationRef.current) {
        cancelAnimationFrame(levelAnimationRef.current);
      }
    };
  }, [isRecording, isStarting]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      try {
        triggerHapticFeedback('light');
        isManuallyStoppedRef.current = true;
        isRecordingRef.current = false;
        recognitionRef.current.stop();
        setIsRecording(false);
        setIsStarting(false);
        setShowRecordingStatus(false);
        restartAttemptsRef.current = 0; // Reset restart attempts
        // Clear timeouts
        if (autoSubmitTimeoutRef.current) {
          clearTimeout(autoSubmitTimeoutRef.current);
          autoSubmitTimeoutRef.current = null;
        }
        if (recordingStatusTimeoutRef.current) {
          clearTimeout(recordingStatusTimeoutRef.current);
          recordingStatusTimeoutRef.current = null;
        }
        if (startTimeoutRef.current) {
          clearTimeout(startTimeoutRef.current);
          startTimeoutRef.current = null;
        }
        // Clear processed results tracking
        processedResultsRef.current.clear();
        lastProcessedIndexRef.current = 0;
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
        setIsRecording(false);
        setIsStarting(false);
        setShowRecordingStatus(false);
        isRecordingRef.current = false;
        isManuallyStoppedRef.current = false;
      }
    }
  }, [isRecording, triggerHapticFeedback]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition() as SpeechRecognition;

        // Enable continuous mode for both desktop and mobile
        // Mobile browsers support continuous mode but may require different handling
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          // Clear any existing timeouts
          if (autoSubmitTimeoutRef.current) {
            clearTimeout(autoSubmitTimeoutRef.current);
            autoSubmitTimeoutRef.current = null;
          }
          if (recordingStatusTimeoutRef.current) {
            clearTimeout(recordingStatusTimeoutRef.current);
            recordingStatusTimeoutRef.current = null;
          }

          // Show recording status when we get results
          setShowRecordingStatus(true);

          // SIMPLIFIED APPROACH: Just get the LAST result in the array
          // On mobile, each result contains the cumulative transcript, so we only need the latest
          if (event.results.length > 0) {
            const lastResult = event.results[event.results.length - 1];
            const transcript = lastResult[0]?.transcript || "";

            if (transcript.trim()) {
              // Simply use the last result directly - no accumulation
              setMessage(transcript.trim());

              // Set up auto-submit timeout (reduced to 2.5s for better UX)
              autoSubmitTimeoutRef.current = setTimeout(() => {
                const messageToSend = transcript.trim();
                if (messageToSend) {
                  stopRecording();
                  triggerHapticFeedback('medium');
                  // Trigger submit after a brief delay
                  setTimeout(() => {
                    onSendMessageRef.current(messageToSend);
                    setMessage("");
                    finalTranscriptRef.current = "";
                    processedResultsRef.current.clear();
                    lastProcessedIndexRef.current = 0;
                  }, 100);
                }
              }, 2500);

              // Hide recording status after 1.5 seconds of silence
              recordingStatusTimeoutRef.current = setTimeout(() => {
                setShowRecordingStatus(false);
              }, 1500);
            }
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          if (event.error === "no-speech" || event.error === "audio-capture") {
            // Don't show errors for these cases, just stop recording silently
            setIsRecording(false);
            setIsStarting(false);
            setShowRecordingStatus(false);
          } else if (event.error === "not-allowed" || event.error === "permission-denied") {
            // Permission denied - show user-friendly toast
            toast({
              title: "Microphone Access Required",
              description: "Please enable microphone access in your browser settings to use voice input.",
              variant: "destructive",
            });
            setIsRecording(false);
            setIsStarting(false);
            setShowRecordingStatus(false);
          } else if (event.error === "network") {
            // Network error
            toast({
              title: "Network Error",
              description: "Please check your internet connection and try again.",
              variant: "destructive",
            });
            setIsRecording(false);
            setIsStarting(false);
            setShowRecordingStatus(false);
          } else if (event.error === "aborted") {
            // Aborted - no need to show error
            setIsRecording(false);
            setIsStarting(false);
            setShowRecordingStatus(false);
          } else {
            // Other errors
            toast({
              title: "Voice Input Error",
              description: `An error occurred: ${event.error}. Please try again.`,
              variant: "destructive",
            });
            setIsRecording(false);
            setIsStarting(false);
            setShowRecordingStatus(false);
          }
        };

        recognition.onend = () => {
          setIsStarting(false); // Always clear starting state

          // Only stop if manually stopped, otherwise restart on mobile
          if (isManuallyStoppedRef.current) {
            setIsRecording(false);
            setShowRecordingStatus(false);
            isRecordingRef.current = false;
            isManuallyStoppedRef.current = false;
            restartAttemptsRef.current = 0;
          } else {
            // Recognition ended unexpectedly (e.g., silence timeout on mobile)
            // Restart it if we're still in recording state
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );

            if (isMobileDevice && isRecordingRef.current && restartAttemptsRef.current < 10) {
              // On mobile, recognition may stop after periods of silence
              // Restart it automatically to keep recording (with retry limit)
              restartAttemptsRef.current += 1;

              setTimeout(() => {
                try {
                  if (recognitionRef.current && isRecordingRef.current && !isManuallyStoppedRef.current) {
                    recognitionRef.current.start();
                  }
                } catch (e) {
                  // If restart fails, check if we should stop or retry
                  console.error("Failed to restart recognition:", e);

                  if (restartAttemptsRef.current >= 10) {
                    // Too many restarts, give up gracefully
                    toast({
                      title: "Voice Input Stopped",
                      description: "Voice recording has been stopped. Please try again if needed.",
                    });
                    setIsRecording(false);
                    setShowRecordingStatus(false);
                    isRecordingRef.current = false;
                    restartAttemptsRef.current = 0;
                  }
                }
              }, 100);
              return; // Don't clear timeouts if we're restarting
            } else {
              // Desktop or manual stop - fully stop
              setIsRecording(false);
              setShowRecordingStatus(false);
              isRecordingRef.current = false;
              restartAttemptsRef.current = 0;
            }
          }

          // Clear auto-submit timeout when recognition ends (only if not restarting)
          if (autoSubmitTimeoutRef.current) {
            clearTimeout(autoSubmitTimeoutRef.current);
            autoSubmitTimeoutRef.current = null;
          }
          if (recordingStatusTimeoutRef.current) {
            clearTimeout(recordingStatusTimeoutRef.current);
            recordingStatusTimeoutRef.current = null;
          }
        };

        recognition.onstart = () => {
          console.log('Speech recognition started successfully');

          // Clear the safety timeout since we started successfully
          if (startTimeoutRef.current) {
            clearTimeout(startTimeoutRef.current);
            startTimeoutRef.current = null;
          }

          setIsRecording(true);
          setIsStarting(false);
          isRecordingRef.current = true;
          setShowRecordingStatus(true);
          triggerHapticFeedback('medium');

          // Show a subtle toast to confirm recording started
          setTimeout(() => {
            toast({
              title: "🎤 Listening...",
              description: "Speak now. I'll auto-submit after 2.5s of silence.",
            });
          }, 50);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      // Clean up recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch {
          // Ignore errors during cleanup
        }
      }
      // Clean up timeouts
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
        autoSubmitTimeoutRef.current = null;
      }
      if (recordingStatusTimeoutRef.current) {
        clearTimeout(recordingStatusTimeoutRef.current);
        recordingStatusTimeoutRef.current = null;
      }
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }
    };
  }, [language, stopRecording]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording && !isStarting && !disabled) {
      console.log('startRecording called');

      // Set starting state immediately
      setIsStarting(true);
      triggerHapticFeedback('light');

      // Clear previous state
      isManuallyStoppedRef.current = false;
      finalTranscriptRef.current = "";
      lastProcessedIndexRef.current = 0;
      processedResultsRef.current.clear();
      restartAttemptsRef.current = 0;
      setMessage("");
      setShowRecordingStatus(false);

      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
        autoSubmitTimeoutRef.current = null;
      }
      if (recordingStatusTimeoutRef.current) {
        clearTimeout(recordingStatusTimeoutRef.current);
        recordingStatusTimeoutRef.current = null;
      }

      // Use requestAnimationFrame + setTimeout for better reliability
      // This ensures the browser has finished all pending renders
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            console.log('Attempting to start recognition...');
            if (recognitionRef.current && !isManuallyStoppedRef.current) {
              recognitionRef.current.start();
              console.log('Recognition.start() called successfully');

              // Safety timeout: If onstart doesn't fire within 3 seconds, reset state
              startTimeoutRef.current = setTimeout(() => {
                console.warn('Recognition onstart event did not fire within 3 seconds');
                if (isStarting) {
                  setIsStarting(false);
                  setIsRecording(false);
                  isRecordingRef.current = false;
                  toast({
                    title: "Voice Input Timeout",
                    description: "Recording failed to start. Please try again.",
                    variant: "destructive",
                  });
                }
              }, 3000);
            } else {
              console.log('Recognition cancelled or ref null');
              setIsStarting(false);
            }
          } catch (startError) {
            console.error("Error starting recognition:", startError);
            setIsStarting(false);
            setIsRecording(false);

            const errorObj = startError as Error;

            if (errorObj.message?.includes("already started")) {
              console.log('Recognition already started, ignoring');
              return;
            }

            if (errorObj.name === "NotAllowedError" || errorObj.name === "PermissionDeniedError") {
              toast({
                title: "Microphone Access Required",
                description: "Please allow microphone access in your browser settings.",
                variant: "destructive",
              });
            } else if (errorObj.name === "NotFoundError" || errorObj.name === "DevicesNotFoundError") {
              toast({
                title: "No Microphone Found",
                description: "Please connect a microphone and try again.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Failed to Start",
                description: "Failed to start voice recording. Please try again.",
                variant: "destructive",
              });
            }
          }
        }, 200); // Increased to 200ms for more reliability
      });
    }
  };

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear auto-submit timeout on manual submit
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
      autoSubmitTimeoutRef.current = null;
    }
    // Stop recording if active
    if (isRecording) {
      stopRecording();

    }
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

  // Keyboard shortcut for voice input (Ctrl/Cmd + M)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        if (isSupported && !disabled && !isStarting) {
          toggleRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSupported, disabled, isStarting, isRecording, toggleRecording]);

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
    <div className="space-y-4">
      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="space-y-2 mb-3">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            Selected Items ({selectedItems.length}):
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                  className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-border/50 max-w-full"
                >
                  {item.type === "hotel" ? (
                    <MapPin className="w-3 h-3 flex-shrink-0 text-[#2F80ED]" />
                  ) : (
                    <Plane className="w-3 h-3 flex-shrink-0 text-[#56CCF2]" />
                  )}
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-[11px] sm:text-xs font-medium truncate max-w-[120px] sm:max-w-[160px] md:max-w-[180px]">
                      {itemName}
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[160px] md:max-w-[180px]">
                      {price}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSelectedItem?.(index)}
                    className="h-4 w-4 sm:h-5 sm:w-5 p-0 ml-1 sm:ml-2 flex-shrink-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Minimal Frictionless Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-1.5 sm:gap-2 p-2.5 sm:p-3 md:p-4 bg-muted/30 dark:bg-muted/20 border border-border/50 rounded-2xl focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-border transition-all shadow-sm">
          {/* Text input */}
          <div className="flex-1 min-w-[120px] max-w-full overflow-hidden">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="min-h-[40px] sm:min-h-[44px] md:min-h-[52px] max-h-[200px] resize-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-[15px] sm:text-base md:text-lg bg-transparent placeholder:text-muted-foreground/60 w-full"
              disabled={disabled}
              rows={1}
            />
          </div>

          {/* Action buttons container */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Send button */}
            <Button
              type="submit"
              variant="default"
              size="sm"
              onClick={handleSubmit}
              disabled={disabled || (!message.trim() && selectedItems.length === 0)}
              className={`flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 rounded-lg transition-all ${disabled || (!message.trim() && selectedItems.length === 0)
                ? "opacity-50 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                }`}
              title={
                disabled
                  ? "Please wait for the agent to finish"
                  : !message.trim() && selectedItems.length === 0
                    ? "Enter a message to send"
                    : "Send message"
              }
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Button>

            {/* Microphone button */}
            {isSupported && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleRecording}
                className={`flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 p-0 rounded-lg transition-all ${disabled || isStarting
                  ? "opacity-50 cursor-not-allowed"
                  : isRecording
                    ? "text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-500/10 scale-110"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105"
                  }`}
                disabled={disabled || isStarting}
                title={
                  disabled
                    ? "Please wait for the agent to finish"
                    : isStarting
                      ? "Starting voice input..."
                      : isRecording
                        ? "Stop recording (Ctrl/Cmd + M)"
                        : "Start voice input (Ctrl/Cmd + M)"
                }
              >
                {isStarting ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : isRecording ? (
                  <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Recording status with visual waveform */}
        {showRecordingStatus && isRecording && !isStarting && (
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              {/* Animated waveform bars */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 sm:w-1 bg-red-500 rounded-full transition-all duration-150"
                  style={{
                    height: `${8 + recordingLevel * 16 * (1 + Math.sin(Date.now() / 200 + i) * 0.3)}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-medium text-red-600 dark:text-red-400 truncate">
                Recording...
              </span>
              <span className="text-[9px] sm:text-[10px] text-red-500/70 dark:text-red-400/70 truncate">
                Auto-submits after 2.5s silence
              </span>
            </div>
          </div>
        )}

        {/* Starting indicator */}
        {isStarting && (
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-muted/50 border border-border/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <Loader2 className="w-3 h-3 flex-shrink-0 animate-spin text-muted-foreground" />
            <span className="text-[11px] sm:text-xs text-muted-foreground truncate">Starting voice input...</span>
          </div>
        )}
      </form>
    </div>
  );
}
