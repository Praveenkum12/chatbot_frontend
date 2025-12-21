import { z } from "zod";

// Chat Request Schema (Input)
export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversation_id: z.string().nullable(), // Required field, but can be null
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Helper to create chat request
export const createChatRequest = (
  message: string,
  conversationId?: string | null
): ChatRequest => {
  return ChatRequestSchema.parse({
    message,
    // Always include conversation_id, use null if not provided
    conversation_id: conversationId ?? null,
  });
};
