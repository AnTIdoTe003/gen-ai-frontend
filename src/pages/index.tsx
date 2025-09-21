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
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRouter } from "next/router";

interface SelectedItem {
  data: HotelData | FlightData;
  type: "hotel" | "flight";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  // const [lastMessageId, setLastMessageId] = useState<string | null>(null); // TODO: Implement message tracking
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

  // Chat history management
  const {
    currentSession,
    loadSessions,
    createSession,
    selectSession,
    addMessage: addMessageToHistory,
  } = useChatHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        "Hello! I'm your AI trip planning assistant. I can help you with:\n\n• Destination recommendations\n• Budget planning and cost optimization\n• Creating detailed itineraries\n• Travel tips and local insights\n• Finding the best deals and accommodations\n\nHow can I help you plan your next adventure?",
      role: "assistant",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      // Check if API response indicates completion and track the message ID
      if (apiResponse.done) {
        setLastMessageId(assistantMessage.id);
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
      {/* Sidebar */}
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Sidebar Toggle Button */}
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

        {/* Chat Header */}
        {/* <ChatHeader onNewChat={handleNewChat} /> */}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onDataSelect={handleDataSelect}
                selectedItems={selectedItems}
                showPaymentButton={message.done === true}
              />
            ))}

            {/* Show quick actions only when there's just the initial message */}
            {messages.length === 1 && !isLoading && (
              <div className="mt-6">
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

        {/* Chat Input */}
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

function setLastMessageId(id: string) {
  throw new Error("Function not implemented.");
}
