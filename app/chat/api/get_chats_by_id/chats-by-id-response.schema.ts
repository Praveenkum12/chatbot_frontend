import { z } from "zod";

// Single chat message schema
export const ChatMessageSchema = z.object({
  conversationId: z.string(),
  timestamp: z.string(),
  content: z.string(),
  type: z.enum(["USER", "ASSISTANT"]),
});

// Array of chat messages
export const ChatsByIdResponseSchema = z.array(ChatMessageSchema);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatsByIdResponse = z.infer<typeof ChatsByIdResponseSchema>;

// Helper to parse response
export const parseChatsByIdResponse = (data: unknown): ChatsByIdResponse => {
  return ChatsByIdResponseSchema.parse(data);
};
