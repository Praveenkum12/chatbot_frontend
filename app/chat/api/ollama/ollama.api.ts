import { API_CONFIG } from "../../config/api.config";

/**
 * Send a message to Ollama API
 * @param message - The message to send as query parameter
 * @returns The AI response as a string
 * @throws Error if the request fails
 */
export const sendMessageToOllama = async (message: string): Promise<string> => {
  try {
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Make API call with message as query parameter
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/ollama/chat?message=${encodedMessage}`,
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

    // Get response as plain text
    const aiResponse = await response.text();

    return aiResponse;
  } catch (error) {
    console.error("Error sending message to Ollama:", error);
    throw error;
  }
};
