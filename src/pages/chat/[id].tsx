"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatHistoryPanel } from "@/components/chat/chat-history-panel";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { QuickActions } from "@/components/chat/quick-actions";
import { LoginModal } from "@/components/login-modal";
import { Message, ChatSession, HotelData, FlightData } from "@/types/chat";
import { chatApiService } from "@/lib/chat-api-service";
import { useClientOnly } from "@/hooks/use-client-only";
import { useChatHistory } from "@/hooks/use-chat-history";
import { useAuthProtection } from "@/hooks/use-auth-protection";
import { Bot } from "lucide-react";
import { useRouter } from "next/router";
import { SEO } from "@/components/seo";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface SelectedItem {
  data: HotelData | FlightData;
  type: "hotel" | "flight";
}

export default function ChatByIdPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [previousChatId, setPreviousChatId] = useState<string | null>(null);
  const [language, setLanguage] = useState("en-US");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isClient = useClientOnly();
  const router = useRouter();
  const isMobile = useIsMobile();

  // Sidebar is always open on desktop, closed on mobile by default
  useEffect(() => {
    if (isClient) {
      const handleResize = () => {
        // Always show on desktop
        setIsSidebarOpen(window.innerWidth >= 768);
      };

      handleResize(); // Initial check
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isClient]);

  // Authentication protection
  const {
    isAuthenticated,
    isLoading: authLoading,
    showLoginModal,
    handleLoginSuccess,
    handleCloseModal
  } = useAuthProtection();

  const {
    currentSession,
    loadSessions,
    createSession,
    selectSession,
    addMessageToCurrentSession,
  } = useChatHistory();

  const scrollToBottom = useCallback(() => {
    // Only scroll if the ref exists
    if (!messagesEndRef.current) return;

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  useEffect(() => {
    if (!isInitialized && isClient) {
      // Only load sessions if we don't have any yet
      if (currentSession === null) {
        loadSessions();
      }
      setIsInitialized(true);
    }
  }, [isInitialized, isClient, loadSessions, currentSession]);

  // If URL has an id, load that session and set messages
  useEffect(() => {
    const idParam = router.query.id;
    if (!isClient || !idParam) return;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    (async () => {
      try {
        // Show loading state when switching chats
        setIsLoadingSession(true);

        // Always fetch the session when URL changes to ensure we have the latest data
        console.log(`Loading chat session: ${id}`);

        // Force refresh when URL changes to ensure we get the latest chat data
        const shouldForceRefresh = previousChatId !== id;
        await selectSession(id, shouldForceRefresh);

        // Update previous chat ID
        setPreviousChatId(id);

        // After selection, messages are available via currentSession in hook, but we keep local state for rendering
        // Delay to next tick to allow hook state to propagate
        setTimeout(() => {
          if (currentSession?.id === id) {
            setMessages(currentSession.messages || []);
          }
          setIsLoadingSession(false);
        }, 0);
      } catch (error) {
        console.error('Error loading chat session:', error);
        setIsLoadingSession(false);
      }
    })();
  }, [
    router.query.id,
    isClient,
    selectSession,
    currentSession?.id,
    currentSession?.messages,
    previousChatId,
  ]);

  // Scroll to bottom only when loading changes to false (after new message arrives)
  const prevLoadingRef = useRef(isLoading);
  const prevLoadingSessionRef = useRef(isLoadingSession);

  useEffect(() => {
    // Only scroll when loading completes (was true, now false)
    const loadingCompleted = prevLoadingRef.current === true && isLoading === false;
    const sessionLoadingCompleted = prevLoadingSessionRef.current === true && isLoadingSession === false;

    if (loadingCompleted || sessionLoadingCompleted) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 200); // Give time for DOM to render

      prevLoadingRef.current = isLoading;
      prevLoadingSessionRef.current = isLoadingSession;
      return () => clearTimeout(timeoutId);
    }

    prevLoadingRef.current = isLoading;
    prevLoadingSessionRef.current = isLoadingSession;
  }, [isLoading, isLoadingSession, scrollToBottom]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    let sessionId = currentSession?.id;
    let shouldNavigate = false;

    // Add user message to local state immediately
    setMessages((prev) => [...prev, userMessage]);
    setSelectedItems([]); // Clear selected items after sending
    setIsLoading(true);

    // Handle session creation or message addition without disrupting current state
    if (!sessionId) {
      const newSession = await createSession(
        content.length > 50 ? content.substring(0, 50) + "..." : content,
        userMessage
      );
      sessionId = newSession.id;
      shouldNavigate = true;
    } else {
      // Add user message to current session without API call
      addMessageToCurrentSession(userMessage);
    }

    // Generate AI response using the chat API
    try {
      const apiResponse = await chatApiService.sendMessage(
        sessionId || "default",
        content
      );

      const assistantMessage: Message = {
        id: `assistant-${Math.random().toString(36).substr(2, 9)}`,
        content: apiResponse.reply,
        role: "assistant",
        timestamp: new Date(),
        data: apiResponse.data, // Include hotel/flight data if available
        done: apiResponse.done, // Include done flag for payment button
      };

      // Add assistant message to local state immediately
      setMessages((prev) => [...prev, assistantMessage]);

      // Update the current session in the hook without API calls
      // This prevents state disruption while maintaining session consistency
      addMessageToCurrentSession(assistantMessage);

      // The done flag is now handled directly on the message object
      // No need to track lastMessageId separately

      // Navigate after the response is processed and displayed
      if (shouldNavigate) {
        router.replace(`/chat/${sessionId}`);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Fallback response
      const fallbackMessage: Message = {
        id: `assistant-${Math.random().toString(36).substr(2, 9)}`,
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      };

      // Add fallback message to local state and current session
      setMessages((prev) => [...prev, fallbackMessage]);
      addMessageToCurrentSession(fallbackMessage);

      // Navigate even on error to maintain consistency
      if (shouldNavigate) {
        router.replace(`/chat/${sessionId}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        content:
          "Hi there. What should we dive into today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    router.push("/");
  };

  const handleChatSelect = async (session: ChatSession) => {
    await selectSession(session.id);
    setMessages(session.messages || []);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
    router.replace(`/chat/${session.id}`);
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleDataSelect = (
    data: HotelData | FlightData,
    type: "hotel" | "flight"
  ) => {
    const newItem: SelectedItem = { data, type };

    // If selecting a flight, only allow one flight at a time
    if (type === "flight") {
      setSelectedItems((prev) => {
        // Remove any existing flights and add the new one
        const withoutFlights = prev.filter(item => item.type !== "flight");
        return [...withoutFlights, newItem];
      });
    } else {
      // For hotels, just add to the list
      setSelectedItems((prev) => [...prev, newItem]);
    }
  };

  const handleRemoveSelectedItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  const handleLanguageSelect = (languageCode: string, languageLabel: string) => {
    // Send message to chat asking to change language
    const message = `change the language to ${languageLabel}`;
    handleSendMessage(message);
  };

  // Show loading state during hydration or authentication check
  if (!isClient || !isInitialized || authLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Navbar onLanguageChange={handleLanguageChange} onLanguageSelect={handleLanguageSelect} />
        <ChatHeader onNewChat={handleNewChat} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">
            {authLoading ? "Checking authentication..." : "Loading chat..."}
          </div>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Navbar onLanguageChange={handleLanguageChange} onLanguageSelect={handleLanguageSelect} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground mb-4">
              Please log in to access your chats
            </div>
          </div>
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseModal}
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  const chatId = router.query.id ? (Array.isArray(router.query.id) ? router.query.id[0] : router.query.id) : null;
  const chatTitle = currentSession?.title || "Chat Session";
  const canonicalUrl = chatId ? `https://tripcraft.debmalya.in/chat/${chatId}` : "https://tripcraft.debmalya.in/chat";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Conversation",
    "name": `Roxy AI Chat - ${chatTitle}`,
    "description": `Chat with Roxy AI - the best AI itinerary generator for travel planning. ${chatTitle}`,
    "url": canonicalUrl,
    "partOfSeries": {
      "@type": "WebApplication",
      "name": "Roxy AI",
      "url": "https://tripcraft.debmalya.in"
    }
  };

  return (
    <>
      <SEO
        title={`Roxy AI Chat - ${chatTitle} | Best AI Itinerary Generator`}
        description={`Chat with Roxy AI - the best AI itinerary generator for travel planning. ${chatTitle}. Create personalized travel itineraries with our online AI itinerary generator.`}
        keywords="Roxy AI, best ai for itinerary, online itinerary generator, best ai itinerary generator for travel, AI travel planner, intelligent travel assistant, automated itinerary planner, smart travel planner, AI trip planner, best itinerary planner, travel itinerary generator, AI travel agent, AI powered itinerary, intelligent trip planning, personalized travel planner, AI vacation planner, smart itinerary creator, automated travel planning, AI travel planning tool, best travel planner app, free itinerary generator, create travel itinerary, AI itinerary maker, trip planning AI, travel planning software, AI chat for travel, conversational travel planner"
        canonical={canonicalUrl}
        structuredData={structuredData}
        noindex={true}
      />
      <div className="flex h-screen bg-background">
        {/* Sidebar - Mobile as Sheet, Desktop always visible */}
        {isMobile ? (
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="w-[85vw] sm:w-80 p-0">
              <ChatHistoryPanel
                currentChatId={currentSession?.id}
                onChatSelect={handleChatSelect}
                onNewChat={handleNewChat}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={true}
                className="h-full"
              />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-80 border-r border-border hidden md:block">
            <ChatHistoryPanel
              currentChatId={currentSession?.id}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              className="h-full"
            />
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative min-w-0">
          <Navbar
            showSidebarToggle={true}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onLanguageChange={handleLanguageChange}
            onLanguageSelect={handleLanguageSelect}
          />


          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 pb-[140px] md:pb-6">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {isLoadingSession ? (
                // Loading skeleton
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Loading header */}
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 animate-pulse">
                      <Bot className="w-6 h-6 text-primary animate-spin" style={{ animationDuration: '2s' }} />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-muted/50 rounded-lg mx-auto animate-pulse" />
                      <div className="h-4 w-64 bg-muted/30 rounded-lg mx-auto animate-pulse" />
                    </div>
                  </div>

                  {/* Message skeletons */}
                  <div className="space-y-4">
                    {/* Assistant message skeleton */}
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-muted/50 animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* User message skeleton */}
                    <div className="flex gap-3 items-start justify-end">
                      <div className="flex-1 space-y-2 flex flex-col items-end">
                        <div className="h-4 w-2/3 bg-primary/20 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-primary/10 rounded animate-pulse" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/30 animate-pulse flex-shrink-0" />
                    </div>

                    {/* Another assistant message skeleton */}
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-muted/50 animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                        <div className="h-4 w-4/5 bg-muted/30 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.length === 0 && (
                    <ChatMessage
                      key="welcome"
                      message={{
                        id: "welcome",
                        content: "Hi there. What should we dive into today?",
                        role: "assistant",
                        timestamp: new Date(),
                      }}
                      onDataSelect={handleDataSelect}
                      selectedItems={selectedItems}
                      showPaymentButton={false}
                    />
                  )}
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onDataSelect={handleDataSelect}
                      selectedItems={selectedItems}
                      showPaymentButton={message.done === true}
                    />
                  ))}

                  {(messages.length === 1 || messages.length === 0) && !isLoading && (
                    <div className="mt-6">
                      <QuickActions
                        onActionClick={handleQuickAction}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  {isLoading && <TypingIndicator />}
                </>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-border bg-background/95 backdrop-blur-sm fixed md:sticky bottom-0 left-0 right-0 md:left-auto md:right-auto z-10">
            <div className="max-w-4xl mx-auto p-3 sm:p-4 pb-safe">
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isLoading || isLoadingSession}
                selectedItems={selectedItems}
                onRemoveSelectedItem={handleRemoveSelectedItem}
                language={language}
              />
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseModal}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </>
  );
}
