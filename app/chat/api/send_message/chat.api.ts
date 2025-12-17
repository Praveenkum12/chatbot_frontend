import { API_CONFIG } from "../../config/api.config";
import { ChatRequest, createChatRequest } from "./chat-request.schema";
import { ChatResponse, parseChatResponse } from "./chat-response.schema";

/**
 * Send a message to the OpenAI chat API
 * @param message - The message to send
 * @returns The AI response as a string
 * @throws Error if the request fails
 */
export const chatApi = async (message: string): Promise<ChatResponse> => {
  try {
    // Validate and create request
    const request: ChatRequest = createChatRequest(message);

    // Make API call
    const response = await fetch(`${API_CONFIG.BASE_URL}/openai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse response text
    const data = await response.text();

    // Validate and return response
    return parseChatResponse(data);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
