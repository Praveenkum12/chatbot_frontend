import { z } from "zod";

// Chat Request Schema (Input)
export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Helper to create chat request
export const createChatRequest = (message: string): ChatRequest => {
  return ChatRequestSchema.parse({ message });
};
