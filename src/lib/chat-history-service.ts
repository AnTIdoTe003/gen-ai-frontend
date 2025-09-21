import {
  ChatSession,
  Message,
  ChatApiResponse,
  ChatsListApiResponse,
  ApiMessage,
} from "@/types/chat";
import { AuthService } from "./auth-service";

// Dummy data for development
const dummyChatSessions: ChatSession[] = [
  {
    id: "chat-1",
    title: "Planning a trip to Japan",
    messages: [
      {
        id: "msg-1",
        content: "I want to plan a trip to Japan for 2 weeks",
        role: "user",
        timestamp: new Date("2024-01-15T10:00:00Z"),
      },
      {
        id: "msg-2",
        content:
          "That sounds amazing! Japan is a fantastic destination with so much to offer. For a 2-week trip, I'd recommend focusing on 2-3 main areas. What type of experiences are you most interested in?",
        role: "assistant",
        timestamp: new Date("2024-01-15T10:01:00Z"),
      },
      {
        id: "msg-3",
        content: "I'm interested in both traditional culture and modern cities",
        role: "user",
        timestamp: new Date("2024-01-15T10:02:00Z"),
      },
      {
        id: "msg-4",
        content:
          "Perfect! I'd suggest starting with Tokyo for the modern experience, then Kyoto for traditional culture, and maybe Osaka for food. What's your budget range?",
        role: "assistant",
        timestamp: new Date("2024-01-15T10:03:00Z"),
      },
      {
        id: "msg-5",
        content: "My budget is around $3000 for accommodation",
        role: "user",
        timestamp: new Date("2024-01-15T10:04:00Z"),
      },
      {
        id: "msg-6",
        content: `Great budget! Here are some excellent hotel options I found for your Japan trip:

## **Hotel Recommendations**

I've found several fantastic hotels that offer great value within your budget. Each option provides excellent amenities and convenient locations.

**Click on any hotel below to select it for your booking!**`,
        role: "assistant",
        timestamp: new Date("2024-01-15T10:05:00Z"),
        data: {
          hotels: [
            {
              id: "HIBOTKYO",
              name: "Holiday Inn Tokyo Shibuya",
              price: "180.00",
              currency: "USD",
              checkIn: "2024-03-15",
              checkOut: "2024-03-18",
            },
            {
              id: "PARKHOTKYO",
              name: "Park Hyatt Tokyo",
              price: "450.00",
              currency: "USD",
              checkIn: "2024-03-15",
              checkOut: "2024-03-18",
            },
            {
              id: "RIZKYOTO",
              name: "The Ritz-Carlton Kyoto",
              price: "320.00",
              currency: "USD",
              checkIn: "2024-03-18",
              checkOut: "2024-03-21",
            },
          ],
        },
      },
    ],
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-01-15T10:03:00Z"),
  },
  {
    id: "chat-2",
    title: "European backpacking adventure",
    messages: [
      {
        id: "msg-5",
        content: "I want to go backpacking in Europe for a month",
        role: "user",
        timestamp: new Date("2024-01-14T14:30:00Z"),
      },
      {
        id: "msg-6",
        content:
          "A month-long European backpacking trip sounds incredible! That's enough time to really explore multiple countries. Which regions are you most excited about?",
        role: "assistant",
        timestamp: new Date("2024-01-14T14:31:00Z"),
      },
      {
        id: "msg-7",
        content:
          "I'm thinking Western Europe - France, Spain, Italy, and maybe Germany",
        role: "user",
        timestamp: new Date("2024-01-14T14:32:00Z"),
      },
      {
        id: "msg-8",
        content:
          "Excellent choices! Those countries offer incredible diversity. I'd recommend starting in Paris, then heading south through Spain, across to Italy, and finishing in Germany. What's your budget for the month?",
        role: "assistant",
        timestamp: new Date("2024-01-14T14:33:00Z"),
      },
      {
        id: "msg-9",
        content: "I have around $4000 for the whole trip including flights",
        role: "user",
        timestamp: new Date("2024-01-14T14:34:00Z"),
      },
      {
        id: "msg-10",
        content: `That's a solid budget! Here are some great flight options I found for your European adventure:

## **Flight Recommendations**

I've found several excellent flight deals that will help stretch your budget further. All options include good amenities and reliable service.

**Click on any flight below to select it for your booking!**`,
        role: "assistant",
        timestamp: new Date("2024-01-14T14:35:00Z"),
        data: {
          flights: [
            {
              id: "AF123",
              name: "Air France",
              price: "650.00",
              currency: "USD",
              checkIn: "2024-04-01",
              checkOut: "2024-05-01",
            },
            {
              id: "LH456",
              name: "Lufthansa",
              price: "720.00",
              currency: "USD",
              checkIn: "2024-04-01",
              checkOut: "2024-05-01",
            },
            {
              id: "BA789",
              name: "British Airways",
              price: "580.00",
              currency: "USD",
              checkIn: "2024-04-01",
              checkOut: "2024-05-01",
            },
          ],
        },
      },
    ],
    createdAt: new Date("2024-01-14T14:30:00Z"),
    updatedAt: new Date("2024-01-14T14:33:00Z"),
  },
  {
    id: "chat-3",
    title: "Southeast Asia budget travel",
    messages: [
      {
        id: "msg-9",
        content: "What's the best way to travel Southeast Asia on a budget?",
        role: "user",
        timestamp: new Date("2024-01-13T09:15:00Z"),
      },
      {
        id: "msg-10",
        content:
          "Southeast Asia is perfect for budget travel! You can easily travel for $30-50 per day. I'd recommend starting with Thailand, then Vietnam, Cambodia, and Laos. What's your total budget and how long are you planning to travel?",
        role: "assistant",
        timestamp: new Date("2024-01-13T09:16:00Z"),
      },
    ],
    createdAt: new Date("2024-01-13T09:15:00Z"),
    updatedAt: new Date("2024-01-13T09:16:00Z"),
  },
  {
    id: "chat-4",
    title: "Family vacation to Disney World",
    messages: [
      {
        id: "msg-11",
        content: "Planning a family trip to Disney World with 2 kids",
        role: "user",
        timestamp: new Date("2024-01-12T16:45:00Z"),
      },
      {
        id: "msg-12",
        content:
          "Disney World is magical for families! How old are your kids? This will help me suggest the best parks and attractions for your family.",
        role: "assistant",
        timestamp: new Date("2024-01-12T16:46:00Z"),
      },
      {
        id: "msg-13",
        content: "They're 6 and 9 years old",
        role: "user",
        timestamp: new Date("2024-01-12T16:47:00Z"),
      },
      {
        id: "msg-14",
        content:
          "Perfect ages for Disney! I'd recommend Magic Kingdom and Animal Kingdom as your must-visit parks. How many days are you planning to spend there?",
        role: "assistant",
        timestamp: new Date("2024-01-12T16:48:00Z"),
      },
    ],
    createdAt: new Date("2024-01-12T16:45:00Z"),
    updatedAt: new Date("2024-01-12T16:48:00Z"),
  },
  {
    id: "chat-5",
    title: "Solo travel safety tips",
    messages: [
      {
        id: "msg-15",
        content: "I'm planning my first solo trip. Any safety tips?",
        role: "user",
        timestamp: new Date("2024-01-11T11:20:00Z"),
      },
      {
        id: "msg-16",
        content:
          "Solo travel is incredibly rewarding! Here are some key safety tips: always share your itinerary with someone, keep copies of important documents, stay in well-reviewed accommodations, and trust your instincts. Where are you planning to go?",
        role: "assistant",
        timestamp: new Date("2024-01-11T11:21:00Z"),
      },
    ],
    createdAt: new Date("2024-01-11T11:20:00Z"),
    updatedAt: new Date("2024-01-11T11:21:00Z"),
  },
];

// In-memory storage for demo purposes
let chatSessions: ChatSession[] = [...dummyChatSessions];

// Cache for loaded chat sessions to avoid repeated API calls
const chatCache = new Map<string, ChatSession>();
const sessionsListCache = { data: null as ChatSession[] | null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// API abstraction layer - easy to replace with real API calls
export class ChatHistoryService {
  // Check if user is authenticated
  private static isAuthenticated(): boolean {
    const token = AuthService.getToken();
    return !!token;
  }

  // Public method to check authentication status
  public static checkAuthentication(): boolean {
    return this.isAuthenticated();
  }

  // Clear cache when user logs out
  public static clearCacheOnLogout(): void {
    this.clearCache();
  }

  // Cache management methods
  private static isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < CACHE_DURATION;
  }

  private static clearCache(): void {
    chatCache.clear();
    sessionsListCache.data = null;
    sessionsListCache.timestamp = 0;
  }

  private static addToCache(session: ChatSession): void {
    chatCache.set(session.id, { ...session });
  }

  private static getFromCache(sessionId: string): ChatSession | null {
    return chatCache.get(sessionId) || null;
  }

  // Helper method to parse last_message JSON and extract title
  private static parseLastMessageForTitle(lastMessage: string): string {
    if (!lastMessage) return "";

    try {
      const parsedLastMessage = JSON.parse(lastMessage);
      if (parsedLastMessage.reply) {
        // Use first 50 characters of the reply as title
        return parsedLastMessage.reply.length > 50
          ? parsedLastMessage.reply.substring(0, 50) + "..."
          : parsedLastMessage.reply;
      }
    } catch {
      // If parsing fails, use the raw last_message
      return lastMessage.length > 50
        ? lastMessage.substring(0, 50) + "..."
        : lastMessage;
    }

    return "";
  }

  // Transform API messages to our Message format
  private static transformApiMessages(apiMessages: ApiMessage[]): Message[] {
    return apiMessages.map((apiMsg: ApiMessage) => {
      let content = apiMsg.text;
      let data: Record<string, unknown> | undefined = undefined;

      // Parse JSON content if it's from the model
      let done = false;
      if (apiMsg.sender === "model" && apiMsg.text.startsWith("{")) {
        try {
          const parsedContent = JSON.parse(apiMsg.text);
          content = parsedContent.reply || apiMsg.text;

          // Extract data if available in the parsed content
          if (parsedContent.data) {
            data = parsedContent.data;
          }

          // Extract done flag for payment button display
          if (parsedContent.done !== undefined) {
            done = parsedContent.done;
          }
        } catch (e) {
          console.warn("Failed to parse model message JSON:", e);
          // If parsing fails, use the original text
          content = apiMsg.text;
        }
      }

      return {
        id: apiMsg.id,
        content: content,
        role: apiMsg.sender === "user" ? "user" : "assistant",
        timestamp: new Date(apiMsg.timestamp),
        data: data,
        done: done,
      };
    });
  }
  // Get all chat sessions with caching
  static async getChatSessions(forceRefresh = false): Promise<ChatSession[]> {
    // Check cache first
    if (
      !forceRefresh &&
      sessionsListCache.data &&
      this.isCacheValid(sessionsListCache.timestamp)
    ) {
      return [...sessionsListCache.data];
    }

    try {
      if (!this.isAuthenticated()) {
        console.log(
          "No authentication token found, returning empty sessions list"
        );
        return [];
      }

      const token = AuthService.getToken();

      const response = await fetch("https://gen-ai.bdbose.in/api/v1/chats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatsListApiResponse = await response.json();

      if (data.error) {
        throw new Error(data.message || "API returned an error");
      }

      // Transform API response to match our ChatSession interface
      const sessions: ChatSession[] = data.data.chats.map(
        (chat: ChatApiResponse) => {
          const parsedTitle = this.parseLastMessageForTitle(chat.last_message);
          const title = parsedTitle || `Chat ${chat.id.slice(-8)}`;

          return {
            id: chat.id,
            title: title,
            messages: chat.messages
              ? this.transformApiMessages(chat.messages)
              : [],
            createdAt: new Date(chat.timestamp),
            updatedAt: new Date(chat.timestamp),
          };
        }
      );

      const sortedSessions = sessions.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      // Update cache
      sessionsListCache.data = [...sortedSessions];
      sessionsListCache.timestamp = Date.now();

      // Also cache individual sessions
      sortedSessions.forEach((session) => this.addToCache(session));

      return sortedSessions;
    } catch (error) {
      console.error("Failed to fetch chat sessions:", error);
      // Fallback to dummy data if API fails
      return [...dummyChatSessions].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
  }

  // Get a specific chat session by ID with caching
  static async getChatSession(
    id: string,
    forceRefresh = false
  ): Promise<ChatSession | null> {
    console.log(
      `getChatSession called for ID: ${id}, forceRefresh: ${forceRefresh}`
    );

    // Check cache first
    if (!forceRefresh) {
      const cachedSession = this.getFromCache(id);
      if (
        cachedSession &&
        this.isCacheValid(cachedSession.updatedAt.getTime())
      ) {
        console.log(`Returning cached session for ID: ${id}`);
        return { ...cachedSession };
      }
    }

    console.log(`Making API call for chat ID: ${id}`);
    try {
      if (!this.isAuthenticated()) {
        console.log(
          "No authentication token found, returning null for chat session"
        );
        return null;
      }

      const token = AuthService.getToken();

      const response = await fetch(
        `https://gen-ai.bdbose.in/api/v1/chats/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.error) {
        throw new Error(responseData.message || "API returned an error");
      }

      const chat = responseData.data;

      // Transform API response to match our ChatSession interface
      const parsedTitle = this.parseLastMessageForTitle(chat.last_message);
      const title = parsedTitle || `Chat ${chat.id.slice(-8)}`;

      const session = {
        id: chat.id,
        title: title,
        messages: chat.messages ? this.transformApiMessages(chat.messages) : [],
        createdAt: new Date(chat.timestamp),
        updatedAt: new Date(chat.timestamp),
      };

      // Add to cache
      this.addToCache(session);

      return session;
    } catch (error) {
      console.error("Failed to fetch chat session:", error);
      // Fallback to local data
      const session = chatSessions.find((session) => session.id === id);
      return session ? { ...session } : null;
    }
  }

  // Create a new chat session
  static async createChatSession(
    title: string,
    initialMessage?: Message
  ): Promise<ChatSession> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newSession: ChatSession = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real implementation, this would be:
    // const response = await fetch('/api/chat-sessions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newSession)
    // });
    // return response.json();

    chatSessions.unshift(newSession);
    return { ...newSession };
  }

  // Update an existing chat session
  static async updateChatSession(
    id: string,
    updates: Partial<ChatSession>
  ): Promise<ChatSession | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const sessionIndex = chatSessions.findIndex((session) => session.id === id);
    if (sessionIndex === -1) return null;

    const updatedSession = {
      ...chatSessions[sessionIndex],
      ...updates,
      updatedAt: new Date(),
    };

    // In real implementation, this would be:
    // const response = await fetch(`/api/chat-sessions/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updates)
    // });
    // return response.json();

    chatSessions[sessionIndex] = updatedSession;
    return { ...updatedSession };
  }

  // Add a message to a chat session
  static async addMessageToSession(
    sessionId: string,
    message: Message
  ): Promise<ChatSession | null> {
    const session = await this.getChatSession(sessionId);
    if (!session) return null;

    const updatedMessages = [...session.messages, message];
    return this.updateChatSession(sessionId, {
      messages: updatedMessages,
      // Update title if this is the first user message
      title:
        session.messages.length === 0 && message.role === "user"
          ? this.generateTitleFromMessage(message.content)
          : session.title,
    });
  }

  // Delete a chat session
  static async deleteChatSession(id: string): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // In real implementation, this would be:
    // const response = await fetch(`/api/chat-sessions/${id}`, {
    //   method: 'DELETE'
    // });
    // return response.ok;

    const initialLength = chatSessions.length;
    chatSessions = chatSessions.filter((session) => session.id !== id);
    return chatSessions.length < initialLength;
  }

  // Generate a title from the first user message
  private static generateTitleFromMessage(content: string): string {
    // Simple title generation - in real implementation, this could use AI
    const words = content.split(" ").slice(0, 6);
    return words.join(" ") + (content.split(" ").length > 6 ? "..." : "");
  }

  // Search chat sessions
  static async searchChatSessions(query: string): Promise<ChatSession[]> {
    try {
      // For now, fetch all sessions and filter locally
      // In the future, this could be an API endpoint like /api/v1/chats/search?q=query
      const allSessions = await this.getChatSessions();

      const lowercaseQuery = query.toLowerCase();
      return allSessions
        .filter(
          (session) =>
            session.title.toLowerCase().includes(lowercaseQuery) ||
            session.messages.some((msg) =>
              msg.content.toLowerCase().includes(lowercaseQuery)
            )
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    } catch (error) {
      console.error("Failed to search chat sessions:", error);
      // Fallback to local search
      const lowercaseQuery = query.toLowerCase();
      return chatSessions
        .filter(
          (session) =>
            session.title.toLowerCase().includes(lowercaseQuery) ||
            session.messages.some((msg) =>
              msg.content.toLowerCase().includes(lowercaseQuery)
            )
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }
  }
}
