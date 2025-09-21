# Chat API Structure

This document describes the chat API structure implemented for the Gen-AI Trip Planner.

## API Endpoint

**POST** `https://gen-ai.bdbose.in/api/v1/chat`

## Request Structure

```typescript
{
  "sessionId": "string",      // Chat session ID (same as chat ID)
  "userMessage": "string"     // User's message
}
```

### Example Request

```json
{
  "sessionId": "21321",
  "userMessage": "I need hotel recommendations for Mumbai"
}
```

## Response Structure

```typescript
{
  "error": false,             // Whether the request was successful
  "data": {
    "reply": "string",        // AI response in markdown format
    "done": true/false,       // Whether the response is complete
    "data": {                 // Optional: Hotel/flight data
      "hotels": [...],        // Optional: Array of hotel objects
      "flights": [...]        // Optional: Array of flight objects
    }
  },
  "message": "string"         // Status message
}
```

### Example Response with Hotels

```json
{
  "error": false,
  "data": {
    "reply": "Here are some great hotel options:\n\n## **Hotel Recommendations**\n\n**Click on any hotel below to select it!**",
    "done": true,
    "data": {
      "hotels": [
        {
          "id": "HIBOMD98",
          "name": "HOLIDAY INN MUMBAI INTL ARPT",
          "price": "10433.56",
          "currency": "INR",
          "checkIn": "2025-11-01",
          "checkOut": "2025-11-02"
        }
      ]
    }
  },
  "message": "Message processed successfully"
}
```

### Example Response with Flights

```json
{
  "error": false,
  "data": {
    "reply": "I found excellent flight options:\n\n## **Flight Recommendations**\n\n**Click on any flight below to select it!**",
    "done": true,
    "data": {
      "flights": [
        {
          "id": "AI123",
          "name": "Air India Express",
          "price": "8500.00",
          "currency": "INR",
          "checkIn": "2025-11-01",
          "checkOut": "2025-11-02"
        }
      ]
    }
  },
  "message": "Message processed successfully"
}
```

## Data Objects

### Hotel Data

```typescript
{
  "id": "string",           // Unique hotel identifier
  "name": "string",         // Hotel name
  "price": "string",        // Price as string (for precision)
  "currency": "string",     // Currency code (e.g., "INR", "USD")
  "checkIn": "string",      // Check-in date (YYYY-MM-DD)
  "checkOut": "string"      // Check-out date (YYYY-MM-DD)
}
```

### Flight Data

```typescript
{
  "id": "string",           // Unique flight identifier
  "name": "string",         // Airline/flight name
  "price": "string",        // Price as string (for precision)
  "currency": "string",     // Currency code (e.g., "INR", "USD")
  "checkIn": "string",      // Departure date (YYYY-MM-DD)
  "checkOut": "string"      // Return date (YYYY-MM-DD)
}
```

## Features

### 1. Markdown Support

- The `reply` field supports full markdown formatting
- Headers, lists, bold text, and links are rendered properly
- Tables and code blocks are supported

### 2. Data Selection

- Users can click on hotel/flight cards to select them
- Selected items appear as badges in the chat input
- Users can remove selected items before sending
- Selected items are appended to the user message when sent

### 3. Session Management

- Each chat session has a unique ID
- Messages are stored per session
- Session ID is used to maintain conversation context

### 4. Loading States

- Shows typing indicator while API is processing
- Disables input during API calls
- Provides visual feedback for better UX

## Implementation Details

### Frontend Components

- `ChatMessage`: Renders markdown and displays selectable data cards
- `ChatInput`: Shows selected items and handles user input
- `ChatApiService`: Handles API communication

### Backend API

- Uses external API: `https://gen-ai.bdbose.in/api/v1/chat`
- Chat history uses dummy data until you create the get all messages API
- Returns structured responses with optional data

## Usage Examples

### Requesting Hotels

```
User: "I need hotel recommendations for Mumbai"
API Response: Returns hotels data with selectable cards
User: Selects a hotel and sends "Book this hotel"
```

### Requesting Flights

```
User: "Find flights from Delhi to Mumbai"
API Response: Returns flights data with selectable cards
User: Selects a flight and asks "What about return flights?"
```

## Integration Notes

1. **External API**: The implementation uses your external API at `https://gen-ai.bdbose.in/api/v1/chat`.

2. **Chat History**: Currently uses dummy data in `src/lib/chat-history-service.ts` until you create the get all messages API.

3. **Customize Data Structure**: Modify the hotel/flight data structure in `src/types/chat.ts` to match your data sources.

4. **Styling**: The UI components use Tailwind CSS and can be customized in the respective component files.

5. **Error Handling**: The system includes fallback responses for API errors and connection issues.

## Dummy Data

The chat history service includes sample conversations with hotels and flights data to demonstrate the functionality:

- Japan trip planning with hotel recommendations
- European backpacking with flight options
- Other sample conversations for testing
