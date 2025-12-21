import { API_CONFIG } from "../../config/api.config";
import {
  ChatsByIdResponse,
  parseChatsByIdResponse,
} from "./chats-by-id-response.schema";

/**
 * Get chat messages by conversation ID from the API
 * @param conversationId - The ID of the conversation to fetch
 * @returns Array of chat messages for the specified conversation
 * @throws Error if the request fails
 */
export const getChatsById = async (
  conversationId: string
): Promise<ChatsByIdResponse> => {
  try {
    // Make API call
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/openai/data/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse response JSON
    const data = await response.json();

    // Validate and return response
    return parseChatsByIdResponse(data);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};
