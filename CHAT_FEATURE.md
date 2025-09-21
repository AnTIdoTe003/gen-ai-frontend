# Chat Feature Documentation

## Overview

The chat feature provides a ChatGPT-like interface for trip planning assistance. It's built with React, TypeScript, and Tailwind CSS, and is fully mobile responsive.

## Features

### Core Functionality

- **Real-time Chat Interface**: Clean, modern chat UI similar to ChatGPT
- **Mobile Responsive**: Optimized for all screen sizes
- **Message History**: Persistent conversation history during session
- **Typing Indicators**: Visual feedback when AI is "thinking"
- **Copy Messages**: Users can copy AI responses to clipboard

### Trip Planning Specific Features

- **Quick Actions**: Pre-defined buttons for common trip planning tasks
- **Smart Responses**: Context-aware AI responses based on user input
- **Trip Planning Categories**:
  - Destination recommendations
  - Budget planning
  - Itinerary creation
  - Flight and travel tips

### User Experience

- **Keyboard Shortcuts**: Cmd/Ctrl + K for new chat
- **Auto-scroll**: Automatically scrolls to latest messages
- **Message Timestamps**: Shows when each message was sent
- **Loading States**: Visual feedback during AI response generation

## File Structure

```
src/
├── pages/
│   └── chat.tsx                 # Main chat page
├── components/chat/
│   ├── chat-header.tsx          # Chat header with new chat button
│   ├── chat-input.tsx           # Message input with auto-resize
│   ├── chat-message.tsx         # Individual message component
│   ├── quick-actions.tsx        # Quick action buttons
│   └── typing-indicator.tsx     # Loading animation
├── types/
│   └── chat.ts                  # TypeScript interfaces
└── lib/
    └── chat-utils.ts            # AI response generation logic
```

## Components

### ChatPage

Main container component that manages:

- Message state
- Loading states
- Keyboard shortcuts
- Auto-scrolling

### ChatMessage

Individual message component with:

- User/AI message styling
- Copy functionality
- Timestamps
- Responsive design

### ChatInput

Message input component with:

- Auto-resizing textarea
- Send button
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Character count

### QuickActions

Pre-defined action buttons for:

- Finding destinations
- Budget planning
- Creating itineraries
- Flight tips

## Usage

1. Navigate to `/chat` route
2. Start typing your trip planning questions
3. Use quick action buttons for common tasks
4. Copy AI responses using the copy button
5. Start a new chat with the "New Chat" button or Cmd/Ctrl + K

## Customization

### Adding New Quick Actions

Edit `src/components/chat/quick-actions.tsx` to add new action buttons.

### Modifying AI Responses

Update `src/lib/chat-utils.ts` to customize the AI response logic and add new response categories.

### Styling Changes

All styling uses Tailwind CSS classes and can be customized in the component files.

## Future Enhancements

- Integration with real AI API (OpenAI, Claude, etc.)
- Chat history persistence
- File upload support
- Voice input/output
- Chat export functionality
- Multi-language support

