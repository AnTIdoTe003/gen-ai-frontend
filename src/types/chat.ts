export interface HotelData {
  id: string;
  name: string;
  price: string;
  currency: string;
  checkIn: string;
  checkOut: string;
}

export interface FlightData {
  id?: string;
  price?: string;
  currency?: string;
  from?: string;
  to?: string;
  departure?: string;
  arrival?: string;
  duration?: string;
  airline?: string;
  flightNumber?: string;
  name?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface MessageData {
  hotels?: HotelData[];
  flights?: FlightData[];
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  data?: MessageData;
  done?: boolean; // Flag to indicate if this message should show payment button
}

export interface ChatApiRequest {
  sessionId: string;
  userMessage: string;
}

export interface ChatApiResponse {
  reply: string;
  done: boolean;
  data?: MessageData;
}

export interface ChatApiResponseWrapper {
  error: boolean;
  data: {
    id: string;
    user_id: string;
    last_message: string;
    timestamp: number;
    messages: ApiMessage[];
    reply: string;
    done: boolean;
    data?: MessageData;
  };
  message: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatHistoryState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatHistoryActions {
  loadSessions: () => Promise<void>;
  createSession: (
    title: string,
    initialMessage?: Message
  ) => Promise<ChatSession>;
  selectSession: (sessionId: string, forceRefresh?: boolean) => Promise<void>;
  updateSession: (
    sessionId: string,
    updates: Partial<ChatSession>
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  addMessage: (sessionId: string, message: Message) => Promise<void>;
  addMessageToCurrentSession: (message: Message) => void;
  searchSessions: (query: string) => Promise<ChatSession[]>;
}

// API Response types for chat endpoints
export interface ApiMessage {
  id: string;
  chat_id: string;
  timestamp: number;
  sender: "user" | "model";
  text: string;
  attachment: string;
  delivery_status: "sent" | "delivered" | "read";
}

export interface ChatApiResponse {
  id: string;
  user_id: string;
  last_message: string;
  timestamp: number;
  messages: ApiMessage[];
}

export interface ChatsApiResponse {
  error: boolean;
  data: ChatApiResponse;
  message: string;
}

export interface ChatsListApiResponse {
  error: boolean;
  data: {
    chats: ChatApiResponse[];
    total: number;
  };
  message: string;
}
