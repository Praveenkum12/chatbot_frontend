import { z } from "zod";

// Single history item schema
export const HistoryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
});

// History Response Schema (Array of history items)
export const HistoryResponseSchema = z.array(HistoryItemSchema);

export type HistoryItem = z.infer<typeof HistoryItemSchema>;
export type HistoryResponse = z.infer<typeof HistoryResponseSchema>;

// Helper to parse history response
export const parseHistoryResponse = (data: unknown): HistoryResponse => {
  return HistoryResponseSchema.parse(data);
};
