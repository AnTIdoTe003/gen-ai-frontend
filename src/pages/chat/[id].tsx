"use client";

import { useState, useRef, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRouter } from "next/router";

interface SelectedItem {
  data: HotelData | FlightData;
  type: "hotel" | "flight";
}

export default function ChatByIdPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [previousChatId, setPreviousChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isClient = useClientOnly();
  const router = useRouter();

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      }, 0);
    })();
  }, [
    router.query.id,
    isClient,
    selectSession,
    currentSession?.id,
    currentSession?.messages,
    previousChatId,
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          "Hello! I'm your AI trip planning assistant. I can help you with:\n\n• Destination recommendations\n• Budget planning and cost optimization\n• Creating detailed itineraries\n• Travel tips and local insights\n• Finding the best deals and accommodations\n\nHow can I help you plan your next adventure?",
        role: "assistant",
        timestamp: new Date(),
      },
    ]);
    router.push("/");
  };

  const handleChatSelect = async (session: ChatSession) => {
    await selectSession(session.id);
    setMessages(session.messages || []);
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
    setSelectedItems((prev) => [...prev, newItem]);
  };

  const handleRemoveSelectedItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Show loading state during hydration or authentication check
  if (!isClient || !isInitialized || authLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Navbar />
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
        <Navbar />
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

  return (
    <div className="flex h-screen bg-background">
      {isSidebarOpen && (
        <div className="w-80 border-r border-border">
          <ChatHistoryPanel
            currentChatId={currentSession?.id}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            className="h-full"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex items-center justify-between p-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-8 w-8 p-0"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* <ChatHeader onNewChat={handleNewChat} /> */}

        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {messages.length === 0 && (
              <ChatMessage
                key="welcome"
                message={{
                  id: "welcome",
                  content: "Hello! I'm your AI trip planning assistant. I can help you with:\n\n• Destination recommendations\n• Budget planning and cost optimization\n• Creating detailed itineraries\n• Travel tips and local insights\n• Finding the best deals and accommodations\n\nHow can I help you plan your next adventure?",
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

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-2 sm:p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              selectedItems={selectedItems}
              onRemoveSelectedItem={handleRemoveSelectedItem}
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
  );
}
