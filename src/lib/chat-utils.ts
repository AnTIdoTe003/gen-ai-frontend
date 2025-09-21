import { Message } from "@/types/chat";

// Trip planning specific responses
const tripPlanningResponses = {
  greeting: [
    "Hello! I'm your AI trip planning assistant. I can help you with destination recommendations, itinerary planning, budget considerations, and travel tips. What kind of trip are you planning?",
    "Hi there! Ready to plan an amazing adventure? I can assist with everything from choosing destinations to creating detailed itineraries. Where would you like to start?",
    "Welcome! I'm here to help you plan the perfect trip. Whether you're looking for a relaxing beach vacation, an adventurous mountain trek, or a cultural city tour, I've got you covered!",
  ],

  destination: [
    "Great choice! I'd love to help you explore that destination. What type of experiences are you most interested in? (e.g., cultural sites, outdoor activities, food tours, nightlife)",
    "Excellent! That's a wonderful place to visit. How many days are you planning to spend there, and what's your budget range?",
    "Perfect! I can help you create an amazing itinerary for that destination. Are you traveling solo, with family, or with friends?",
  ],

  budget: [
    "I understand you're working with a budget. Let me help you find the best value options! Are you looking for budget-friendly accommodations, free activities, or ways to save on transportation?",
    "Budget planning is crucial for a great trip! I can suggest cost-effective alternatives and help you prioritize your spending. What's most important to you - accommodation, food, or activities?",
    "Smart planning! I can help you stretch your budget further. Would you like suggestions for affordable dining, free attractions, or budget accommodation options?",
  ],

  itinerary: [
    "I'd be happy to create a detailed itinerary for you! What are your main interests - history, nature, food, shopping, or adventure activities?",
    "Perfect! Let me craft a personalized itinerary. How many days do you have, and do you prefer a packed schedule or a more relaxed pace?",
    "Great! I'll create a balanced itinerary that covers the must-see attractions and hidden gems. Any specific places you definitely want to visit or avoid?",
  ],

  general: [
    "That's an interesting question! Let me help you with that. Could you provide a bit more context so I can give you the most relevant advice?",
    "I'd be happy to assist with that! For the best recommendations, could you tell me more about your travel preferences and constraints?",
    "Great question! I can definitely help with that. What specific aspect would you like me to focus on first?",
  ],
};

export function generateAIResponse(
  userMessage: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _conversationHistory: Message[]
): string {
  const message = userMessage.toLowerCase();

  // Check for greeting patterns
  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return getRandomResponse(tripPlanningResponses.greeting);
  }

  // Check for destination-related queries
  if (
    message.includes("destination") ||
    message.includes("where") ||
    message.includes("place") ||
    message.includes("country") ||
    message.includes("city") ||
    message.includes("visit")
  ) {
    return getRandomResponse(tripPlanningResponses.destination);
  }

  // Check for budget-related queries
  if (
    message.includes("budget") ||
    message.includes("cost") ||
    message.includes("price") ||
    message.includes("expensive") ||
    message.includes("cheap") ||
    message.includes("money")
  ) {
    return getRandomResponse(tripPlanningResponses.budget);
  }

  // Check for itinerary-related queries
  if (
    message.includes("itinerary") ||
    message.includes("plan") ||
    message.includes("schedule") ||
    message.includes("day") ||
    message.includes("activities") ||
    message.includes("things to do")
  ) {
    return getRandomResponse(tripPlanningResponses.itinerary);
  }

  // Default response
  return getRandomResponse(tripPlanningResponses.general);
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

export function formatMessageContent(content: string): string {
  // Add some basic formatting for better readability
  return content
    .replace(/\n/g, "\n\n") // Add extra line breaks for paragraphs
    .trim();
}

export function shouldShowTypingIndicator(message: string): boolean {
  // Show typing indicator for longer responses
  return message.length > 100;
}
