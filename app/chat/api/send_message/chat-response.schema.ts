import { z } from "zod";

// Chat Response Schema (Output)
export const ChatResponseSchema = z.string();

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Helper to parse chat response
export const parseChatResponse = (data: unknown): ChatResponse => {
  return ChatResponseSchema.parse(data);
};
