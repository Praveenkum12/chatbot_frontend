import { z } from "zod";

// Message role enum
export const MessageRole = z.enum(["human", "ai"]);
export type MessageRole = z.infer<typeof MessageRole>;

// Message schema
export const MessageSchema = z.object({
  id: z.string(),
  role: MessageRole,
  content: z.string(),
  timestamp: z.date(),
});

export type Message = z.infer<typeof MessageSchema>;

// Helper to create a new message
export const createMessage = (role: MessageRole, content: string): Message => {
  return MessageSchema.parse({
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  });
};
