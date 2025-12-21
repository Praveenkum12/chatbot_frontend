import { chatApi } from "../api/send_message/chat.api";
import { getHistoryApi } from "../api/get_history/history.api";
import { HistoryResponse } from "../api/get_history/history-response.schema";
import { useChatStore } from "../store/chat.store";

/**
 * Chat Controller
 * Handles chat operations and integrates with the store and API
 */
export class ChatController {
  /**
   * Send a message and get AI response
   * Adds user message to store, calls API, and adds AI response to store
   * @param message - User's message
   * @param turboMode - Whether to use web search (turbo mode)
   */
  static async sendMessage(
    message: string,
    turboMode: boolean = false
  ): Promise<void> {
    const { addMessage } = useChatStore.getState();

    try {
      // Add user message to store
      addMessage("human", message);

      // Call the API and get AI response (with web search if turbo mode is on)
      const aiResponse = await chatApi(message, turboMode);

      // Add AI response to store (extract only the message content)
      addMessage("ai", aiResponse.message);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message to store
      addMessage("ai", "Sorry, I encountered an error. Please try again.");
      throw error;
    }
  }

  /**
   * Get conversation history
   * Fetches the list of previous conversations from the API
   * @returns Array of conversation history items with id and title
   */
  static async getHistory(): Promise<HistoryResponse> {
    try {
      // Call the history API
      const history = await getHistoryApi();
      return history;
    } catch (error) {
      console.error("Failed to fetch history:", error);
      throw error;
    }
  }
}
