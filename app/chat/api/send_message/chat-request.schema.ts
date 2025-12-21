import { z } from "zod";

// Chat Request Schema (Input)
export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversation_id: z.string().nullable().optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Helper to create chat request
export const createChatRequest = (
  message: string,
  conversationId?: string | null
): ChatRequest => {
  return ChatRequestSchema.parse({
    message,
    conversation_id: conversationId,
  });
};
