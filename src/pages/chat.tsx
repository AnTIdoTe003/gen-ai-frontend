"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { ChatMessage } from "../components/chat/chat-message";
import { ChatInput } from "../components/chat/chat-input";
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
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";
import { useRouter } from "next/router";
import { SEO } from "@/components/seo";

interface SelectedItem {
  data: HotelData | FlightData;
  type: "hotel" | "flight";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [language, setLanguage] = useState("en-US");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isClient = useClientOnly();
  const router = useRouter();

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

  // Chat history management
  const {
    currentSession,
    loadSessions,
    createSession,
    selectSession,
    addMessage: addMessageToHistory,
  } = useChatHistory();

  const scrollToBottom = useCallback(() => {
    // Only scroll if the ref exists
    if (!messagesEndRef.current) return;

    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  // Load chat sessions and initialize on client side only
  useEffect(() => {
    if (!isInitialized && isClient) {
      loadSessions();
      initializeWelcomeMessage();
      setIsInitialized(true);
    }
  }, [isInitialized, isClient, loadSessions]);

  const initializeWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: "1",
      content:
        "Hi there. What should we dive into today?",
      role: "assistant",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  // Scroll to bottom only when loading changes to false (after new message arrives)
  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    // Only scroll when loading completes (was true, now false)
    if (prevLoadingRef.current === true && isLoading === false) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 200); // Give time for DOM to render
      prevLoadingRef.current = isLoading;
      return () => clearTimeout(timeoutId);
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, scrollToBottom]);

  const handleNewChat = useCallback(() => {
    initializeWelcomeMessage();
    setSelectedItems([]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for new chat
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleNewChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewChat]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // If no current session, create a new one
    let sessionId = currentSession?.id;
    let shouldNavigate = false;
    if (!sessionId) {
      const newSession = await createSession(
        content.length > 50 ? content.substring(0, 50) + "..." : content,
        userMessage
      );
      sessionId = newSession.id;
      shouldNavigate = true;
    } else {
      // Add user message to existing session
      await addMessageToHistory(sessionId, userMessage);
    }

    setMessages((prev) => [...prev, userMessage]);
    setSelectedItems([]); // Clear selected items after sending
    setIsLoading(true);

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
      };

      // Add assistant message to session
      if (sessionId) {
        await addMessageToHistory(sessionId, assistantMessage);
      }

      setMessages((prev) => [...prev, assistantMessage]);

      // Check if API response indicates completion
      if (apiResponse.done) {
        // Message completed successfully
        console.log('Message completed:', assistantMessage.id);
      }

      // Navigate after the response is processed and displayed
      if (shouldNavigate) {
        router.push(`/chat/${sessionId}`);
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

      if (sessionId) {
        await addMessageToHistory(sessionId, fallbackMessage);
      }

      setMessages((prev) => [...prev, fallbackMessage]);

      // Navigate even on error to maintain consistency
      if (shouldNavigate) {
        router.push(`/chat/${sessionId}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSelect = async (session: ChatSession) => {
    await selectSession(session.id);
    setMessages(session.messages);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
    router.push(`/chat/${session.id}`);
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
    const message = `change the language to  ${languageLabel}`;
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

  // Check if this is a new chat (no session ID and only welcome message)
  const isNewChat = !currentSession?.id && messages.length === 1 && !isLoading;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Roxy AI - Online Itinerary Generator",
      "alternateName": "Roxy AI Chat",
      "description": "Chat with Roxy AI - the best AI itinerary generator for travel planning. Create personalized travel itineraries with our online AI itinerary generator. Best AI for itinerary planning.",
      "url": "https://tripcraft.debmalya.in/chat",
      "applicationCategory": "TravelApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Best AI for itinerary creation",
        "Online itinerary generator",
        "AI-powered travel planning",
        "Personalized travel itineraries",
        "Intelligent travel assistant",
        "Real-time recommendations"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Roxy AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Roxy AI is the best AI itinerary generator for travel planning. It's an online AI itinerary generator that helps you create personalized travel itineraries with intelligent AI assistance."
          }
        },
        {
          "@type": "Question",
          "name": "Is Roxy AI the best AI for itinerary planning?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Roxy AI is considered one of the best AI itinerary generators for travel planning. It provides intelligent, personalized travel planning with real-time recommendations."
          }
        },
        {
          "@type": "Question",
          "name": "How do I use the online itinerary generator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply chat with Roxy AI and describe your travel preferences. The AI itinerary generator will create a personalized travel itinerary based on your requirements."
          }
        }
      ]
    }
  ];

  return (
    <>
      <SEO
        title="Roxy AI Chat - Best AI Itinerary Generator | Online Itinerary Planner"
        description="Chat with Roxy AI - the best AI itinerary generator for travel planning. Create personalized travel itineraries with our online AI itinerary generator. Best AI for itinerary planning - start planning your perfect trip today!"
        keywords="Roxy AI, best ai for itinerary, online itinerary generator, best ai itinerary generator for travel, AI travel planner, intelligent travel assistant, automated itinerary planner, smart travel planner, AI trip planner, best itinerary planner, travel itinerary generator, AI travel agent, AI powered itinerary, intelligent trip planning, personalized travel planner, AI vacation planner, smart itinerary creator, automated travel planning, AI travel planning tool, best travel planner app, free itinerary generator, create travel itinerary, AI itinerary maker, trip planning AI, travel planning software, AI chat for travel, conversational travel planner"
        canonical="https://tripcraft.debmalya.in/chat"
        structuredData={structuredData}
      />
      <div className="flex h-screen bg-background">
        {/* Sidebar - Always visible on desktop, toggleable on mobile */}
        {isSidebarOpen && (
          <div className="w-full md:w-80 border-r border-border fixed md:relative inset-0 md:inset-auto z-10 bg-background">
            <ChatHistoryPanel
              currentChatId={currentSession?.id}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              onClose={() => setIsSidebarOpen(false)}
              className="h-full"
            />
          </div>
        )}

        {/* Main Chat Area - Center Aligned */}
        <div className="flex-1 flex flex-col relative">
          {/* Navbar */}
          <Navbar
            showSidebarToggle={true}
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onLanguageChange={handleLanguageChange}
            onLanguageSelect={handleLanguageSelect}
          />

          {/* Chat Messages - Center Aligned */}
          <div className={`flex-1 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] pb-[140px] md:pb-0 ${isNewChat ? '' : ''
            }`}>
            <div className={`flex flex-col items-center min-h-full px-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isNewChat ? 'py-8 md:py-12' : 'py-4'
              }`}>
              {/* Center container for messages */}
              <div className="w-full max-w-3xl mx-auto space-y-6">
                {/* Welcome Message - Centered */}
                {messages.length === 1 && !isLoading && (
                  <div className={`text-center mb-8 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isNewChat ? 'mt-12 md:mt-20 opacity-100 scale-100 translate-y-0' : 'mt-4 opacity-90 scale-95 translate-y-2'
                    }`}>
                    <div className="text-2xl md:text-3xl font-medium text-foreground mb-2">
                      {messages[0]?.role === "assistant" && messages[0]?.content}
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                {messages.length > 1 || (messages.length === 1 && isLoading) ? (
                  <div className="space-y-6 animate-slide-up">
                    {messages.map((message, index) => (
                      <div
                        key={message.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <ChatMessage
                          message={message}
                          onDataSelect={handleDataSelect}
                          selectedItems={selectedItems}
                          showPaymentButton={message.done === true}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Show quick actions only when there's just the initial message */}
                {messages.length === 1 && !isLoading && (
                  <div className={`flex justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isNewChat ? 'mt-12 opacity-100 translate-y-0 scale-100' : 'mt-8 opacity-0 translate-y-4 scale-95 pointer-events-none'
                    }`}>
                    <QuickActions
                      onActionClick={handleQuickAction}
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Loading indicator */}
                {isLoading && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Chat Input - Smooth Transition between Centered and Bottom */}
          <div className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isNewChat
              ? 'absolute top-1/3 md:top-2 inset-0 flex items-center justify-center pointer-events-none'
              : 'fixed md:sticky bottom-0 left-0 right-0 md:left-auto md:right-auto border-t border-border bg-background/95 backdrop-blur-sm z-10 pointer-events-auto'
            }`}>
            <div className={`w-full max-w-3xl mx-auto px-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isNewChat ? 'py-0 pointer-events-auto' : 'py-3 md:py-4 lg:py-6 pb-safe'
              }`}>
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isNewChat ? 'transform scale-100 opacity-100' : 'opacity-100'
                }`}>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isLoading}
                  selectedItems={selectedItems}
                  onRemoveSelectedItem={handleRemoveSelectedItem}
                  language={language}
                />
              </div>
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
