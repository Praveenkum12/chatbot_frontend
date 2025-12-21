import { API_CONFIG } from "../../config/api.config";
import {
  HistoryResponse,
  parseHistoryResponse,
} from "./history-response.schema";

/**
 * Get chat history from the API
 * @returns Array of conversation history items
 * @throws Error if the request fails
 */
export const getHistoryApi = async (): Promise<HistoryResponse> => {
  try {
    // Make API call
    const response = await fetch(`${API_CONFIG.BASE_URL}/openai/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    return parseHistoryResponse(data);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};
