import {
  ChatApiRequest,
  ChatApiResponse,
  ChatApiResponseWrapper,
  HotelData,
  FlightData,
  MessageData,
} from "@/types/chat";
import { AuthService } from "./auth-service";

export class ChatApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "https://gen-ai.bdbose.in/api/v1") {
    this.baseUrl = baseUrl;
  }

  // Helper function to parse flight data from text
  private parseFlightsFromText(text: string): FlightData[] {
    const flights: FlightData[] = [];
    const lines = text.split("\n");

    for (const line of lines) {
      const flightMatch = line.match(
        /([^(]+)\s*\(Flight\s+(\w+)\):\s*Departs\s+([^,]+),\s*Arrives\s+([^(]+)\s*\([^)]+\)\.\s*Price:\s*([A-Z]{3})\s+([\d.]+)/
      );

      if (flightMatch) {
        const [, airline, flightNumber, departure, arrival, currency, price] =
          flightMatch;

        flights.push({
          id: flightNumber,
          name: `${airline.trim()} (${flightNumber})`,
          price: price,
          currency: currency,
          checkIn: this.parseDate(departure.trim()),
          checkOut: this.parseDate(arrival.trim()),
        });
      }
    }

    return flights;
  }

  // Helper function to parse hotel data from text
  private parseHotelsFromText(text: string): HotelData[] {
    const hotels: HotelData[] = [];
    const lines = text.split("\n");

    for (const line of lines) {
      // Match patterns like "INTERCONTINENTAL MARINE DRIVE: Check-in: 2025-10-06, Check-out: 2025-10-09, Price: INR 61937.02"
      const hotelMatch = line.match(
        /([^:]+):\s*Check-in:\s*([^,]+),\s*Check-out:\s*([^,]+),\s*Price:\s*([A-Z]{3})\s+([\d.]+)/
      );

      if (hotelMatch) {
        const [, hotelName, checkIn, checkOut, currency, price] = hotelMatch;

        hotels.push({
          id: this.generateId(hotelName.trim()),
          name: hotelName.trim(),
          price: price,
          currency: currency,
          checkIn: checkIn.trim(),
          checkOut: checkOut.trim(),
        });
      }
    }

    return hotels;
  }

  // Helper function to parse date from various formats
  private parseDate(dateStr: string): string {
    // Handle formats like "2025-10-06 17:30" or "2025-10-06"
    const cleanDate = dateStr.trim();

    // If it's just a date, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      return cleanDate;
    }

    // If it has time, extract just the date part
    const dateMatch = cleanDate.match(/^(\d{4}-\d{2}-\d{2})/);
    return dateMatch ? dateMatch[1] : cleanDate;
  }

  // Helper function to generate ID from name
  private generateId(name: string): string {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 8);
  }

  // Helper function to extract structured data from response text
  private extractStructuredData(text: string): MessageData | undefined {
    const flights = this.parseFlightsFromText(text);
    const hotels = this.parseHotelsFromText(text);

    if (flights.length > 0 || hotels.length > 0) {
      return {
        flights: flights.length > 0 ? flights : undefined,
        hotels: hotels.length > 0 ? hotels : undefined,
      };
    }

    return undefined;
  }

  // Helper function to determine if data array contains flights or hotels
  private categorizeDataArray(
    dataArray: FlightData[] | HotelData[]
  ): MessageData | undefined {
    if (!dataArray || dataArray.length === 0) {
      return undefined;
    }

    const firstItem = dataArray[0];
    if (
      "airline" in firstItem &&
      "flightNumber" in firstItem &&
      "from" in firstItem &&
      "to" in firstItem
    ) {
      return {
        flights: dataArray as FlightData[],
      };
    }

    // Check if it's hotel data (has name, checkIn, checkOut, etc.)
    if (
      firstItem.name &&
      "checkIn" in firstItem &&
      "checkOut" in firstItem &&
      !("airline" in firstItem)
    ) {
      return {
        hotels: dataArray as HotelData[],
      };
    }

    return undefined;
  }

  async sendMessage(
    sessionId: string,
    userMessage: string
  ): Promise<ChatApiResponse> {
    const request: ChatApiRequest = {
      sessionId,
      userMessage,
    };

    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error(
          "No authentication token found. Please log in to send messages."
        );
      }

      const response = await fetch(`${this.baseUrl}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const wrapper: ChatApiResponseWrapper = await response.json();

      if (wrapper.error) {
        throw new Error(wrapper.message || "API returned an error");
      }

      const result = wrapper.data;

      // Check if the API response contains structured data array
      let structuredData: MessageData | undefined;

      if (result.data && Array.isArray(result.data)) {
        // API returned structured data array
        structuredData = this.categorizeDataArray(result.data);
      } else {
        // Fallback: try to extract structured data from the response text
        structuredData = this.extractStructuredData(result.reply);
      }

      // Ensure all required ChatApiResponse fields are present in the return object
      return {
        ...result,
        data: structuredData,
      };
    } catch (error) {
      console.error("Chat API error:", error);
      // Return a fallback response with all required ChatApiResponse fields
      return {
        id: "",
        user_id: "",
        last_message: "",
        timestamp: Date.now(),
        reply:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        done: true,
        messages: [],
        data: undefined,
      };
    }
  }
}

// Export a default instance
export const chatApiService = new ChatApiService();
