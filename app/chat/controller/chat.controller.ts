import { chatApi } from "../api/send_message/chat.api";
import { getHistoryApi } from "../api/get_history/history.api";
import { getChatsById } from "../api/get_chats_by_id/chats-by-id.api";
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
    const {
      addMessage,
      selectedConversationId,
      setSelectedConversationId,
      setHistory,
    } = useChatStore.getState();

    try {
      // Add user message to store
      addMessage("human", message);

      // Call the API with conversation ID (null for new conversation)
      const aiResponse = await chatApi(
        message,
        turboMode,
        selectedConversationId
      );

      // Add AI response to store (extract only the message content)
      addMessage("ai", aiResponse.message);

      // Debug logging
      console.log("=== New Conversation Check ===");
      console.log("selectedConversationId:", selectedConversationId);
      console.log("aiResponse.conversation_id:", aiResponse.conversation_id);
      console.log(
        "Should refresh history:",
        !selectedConversationId && aiResponse.conversation_id
      );

      // If this was a new conversation, store the conversation ID and refresh history
      if (!selectedConversationId && aiResponse.conversation_id) {
        console.log("✅ Creating new conversation, refreshing history...");
        setSelectedConversationId(aiResponse.conversation_id);

        // Refresh history to show the new conversation in the sidebar
        try {
          const updatedHistory = await this.getHistory();
          setHistory(updatedHistory);
          console.log("✅ History refreshed successfully");
        } catch (error) {
          console.error("Failed to refresh history:", error);
          // Don't throw - conversation was created successfully
        }
      }
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

  /**
   * Get chat messages by conversation ID
   * Fetches all messages for a specific conversation and loads them into the store
   * @param conversationId - The ID of the conversation to load
   */
  static async getChatMessages(conversationId: string): Promise<void> {
    const { clearMessages, addMessage } = useChatStore.getState();

    try {
      // Clear existing messages before loading new ones
      clearMessages();

      // Fetch messages from API
      const messages = await getChatsById(conversationId);

      // Add messages to store in order
      messages.forEach((msg) => {
        const role = msg.type === "USER" ? "human" : "ai";
        addMessage(role, msg.content);
      });
    } catch (error) {
      console.error("Failed to load chat messages:", error);
      throw error;
    }
  }
}
