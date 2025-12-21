import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Message, createMessage } from "../schemas/message.schema";
import { Model, AVAILABLE_MODELS } from "../schemas/model.schema";

interface ChatStore {
  messages: Message[];
  models: Model[];
  selectedModelKey: string;
  inputValue: string;
  turboMode: boolean;

  // Actions
  addMessage: (role: "human" | "ai", content: string) => void;
  setInputValue: (value: string) => void;
  setSelectedModelKey: (key: string) => void;
  setTurboMode: (enabled: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      models: AVAILABLE_MODELS,
      selectedModelKey: AVAILABLE_MODELS[0].key, // Default to first model (001)
      inputValue: "",
      turboMode: false,

      addMessage: (role, content) =>
        set((state) => ({
          messages: [...state.messages, createMessage(role, content)],
        })),

      setInputValue: (value) => set({ inputValue: value }),

      setSelectedModelKey: (key) => set({ selectedModelKey: key }),

      setTurboMode: (enabled) => set({ turboMode: enabled }),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          // Convert timestamp strings back to Date objects
          if (key === "timestamp" && typeof value === "string") {
            return new Date(value);
          }
          return value;
        },
      }),
      partialize: (state) => ({
        messages: state.messages,
        selectedModelKey: state.selectedModelKey,
        turboMode: state.turboMode,
      }),
    }
  )
);
