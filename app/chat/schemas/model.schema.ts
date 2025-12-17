import { z } from "zod";

// Model schema
export const ModelSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export type Model = z.infer<typeof ModelSchema>;

// Available models
export const AVAILABLE_MODELS: Model[] = [
  { key: "001", label: "GPT-4 Nano", description: "Fast and efficient" },
  { key: "002", label: "GPT-3.5 Turbo", description: "Balanced performance" },
  { key: "003", label: "Claude 3", description: "Advanced reasoning" },
];
