import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Message, createMessage } from "../schemas/message.schema";

interface ChatStore {
  messages: Message[];
  selectedModel: string;
  inputValue: string;

  // Actions
  addMessage: (role: "human" | "ai", content: string) => void;
  setInputValue: (value: string) => void;
  setSelectedModel: (model: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      selectedModel: "gpt-4 nano",
      inputValue: "",

      addMessage: (role, content) =>
        set((state) => ({
          messages: [...state.messages, createMessage(role, content)],
        })),

      setInputValue: (value) => set({ inputValue: value }),

      setSelectedModel: (model) => set({ selectedModel: model }),

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
        selectedModel: state.selectedModel,
      }),
    }
  )
);
