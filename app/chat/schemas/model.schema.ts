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
  { key: "002", label: "Llama", description: "Open-source AI model" },
];
