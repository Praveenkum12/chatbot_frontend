import { API_CONFIG } from "../../config/api.config";
import { ChatRequest, createChatRequest } from "./chat-request.schema";
import { ChatResponse, parseChatResponse } from "./chat-response.schema";

/**
 * Send a message to the OpenAI chat API
 * @param message - The message to send
 * @param turboMode - Whether to use web search endpoint (turbo mode)
 * @returns The AI response as a string
 * @throws Error if the request fails
 */
export const chatApi = async (
  message: string,
  turboMode: boolean = false
): Promise<ChatResponse> => {
  try {
    // Validate and create request
    const request: ChatRequest = createChatRequest(message);

    // Choose endpoint based on turbo mode
    const endpoint = turboMode ? "/openai/web-search" : "/openai/chat";

    // Make API call
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
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

    // Parse response JSON
    const data = await response.json();

    // Validate and return response
    return parseChatResponse(data);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
