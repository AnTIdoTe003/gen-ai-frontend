# Chat History API Integration Guide

This document explains how to replace the dummy data implementation with real API calls.

## Current Implementation

The chat history feature uses a service layer (`ChatHistoryService`) that currently works with dummy data stored in memory. This makes it easy to replace with real API calls without changing the UI components.

## Files to Modify

### 1. `/src/lib/chat-history-service.ts`

This is the main file you'll need to modify. Currently, all methods use dummy data and simulated delays. To integrate with a real API:

#### Replace these methods:

```typescript
// Current dummy implementation
static async getChatSessions(): Promise<ChatSession[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...chatSessions].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

// Replace with real API call
static async getChatSessions(): Promise<ChatSession[]> {
  const response = await fetch('/api/chat-sessions', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chat sessions');
  }

  return response.json();
}
```

#### Methods to update:

- `getChatSessions()` - GET `/api/chat-sessions`
- `getChatSession(id)` - GET `/api/chat-sessions/{id}`
- `createChatSession(title, initialMessage)` - POST `/api/chat-sessions`
- `updateChatSession(id, updates)` - PUT `/api/chat-sessions/{id}`
- `deleteChatSession(id)` - DELETE `/api/chat-sessions/{id}`
- `searchChatSessions(query)` - GET `/api/chat-sessions/search?q={query}`

### 2. API Endpoints to Create

You'll need to create these API endpoints in your backend:

```
GET    /api/chat-sessions           - List all chat sessions
GET    /api/chat-sessions/{id}      - Get specific chat session
POST   /api/chat-sessions           - Create new chat session
PUT    /api/chat-sessions/{id}      - Update chat session
DELETE /api/chat-sessions/{id}      - Delete chat session
GET    /api/chat-sessions/search    - Search chat sessions
```

### 3. Database Schema

Here's a suggested database schema for storing chat sessions:

```sql
-- Chat sessions table
CREATE TABLE chat_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_updated (user_id, updated_at)
);

-- Messages table
CREATE TABLE chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  role ENUM('user', 'assistant') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  INDEX idx_session_timestamp (session_id, timestamp)
);
```

## Authentication

The service layer doesn't handle authentication directly. You'll need to:

1. Add authentication headers to API calls
2. Handle authentication errors
3. Implement user-specific data filtering

Example:

```typescript
const getAuthToken = () => {
  // Get token from your auth system
  return localStorage.getItem("authToken");
};

const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Handle unauthorized
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  return response;
};
```

## Error Handling

The current implementation includes basic error handling. You may want to enhance it for production:

```typescript
static async getChatSessions(): Promise<ChatSession[]> {
  try {
    const response = await apiCall('/api/chat-sessions');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch chat sessions:', error);
    throw new Error('Failed to load chat history. Please try again.');
  }
}
```

## Testing

The current implementation includes dummy data that makes testing easy. When switching to real APIs:

1. Keep the dummy data as fallback for development
2. Add environment variables to switch between dummy and real data
3. Implement proper error boundaries in React components

```typescript
// Environment-based switching
const USE_DUMMY_DATA = process.env.NODE_ENV === 'development' &&
                      process.env.REACT_APP_USE_DUMMY_DATA === 'true';

static async getChatSessions(): Promise<ChatSession[]> {
  if (USE_DUMMY_DATA) {
    return this.getDummyChatSessions();
  }

  return this.getRealChatSessions();
}
```

## Migration Strategy

1. **Phase 1**: Keep dummy data, add real API methods alongside
2. **Phase 2**: Add feature flag to switch between implementations
3. **Phase 3**: Test with real API in development
4. **Phase 4**: Deploy with real API, keep dummy as fallback
5. **Phase 5**: Remove dummy data once stable

This approach ensures zero downtime and easy rollback if issues arise.


