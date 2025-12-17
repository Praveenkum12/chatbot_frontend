"use client";

import { useRef, useEffect } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { useChatStore } from "./store/chat.store";

const models = [
  { key: "gpt-4 nano", label: "GPT-4 nano" },
  { key: "gpt-3.5", label: "GPT-3.5 Turbo" },
  { key: "claude", label: "Claude 3" },
];

export default function ChatPage() {
  const { messages, selectedModel, inputValue, addMessage, setInputValue, setSelectedModel } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (inputValue.trim()) {
      addMessage("human", inputValue);
      setInputValue("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Top Bar */}
      <header className="h-16 bg-[#111111] border-b border-[#222222] flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-white">AI Chat</h1>
        
        <Select
          size="sm"
          placeholder="Select model"
          className="w-48"
          defaultSelectedKeys={[selectedModel]}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModel(e.target.value)}
        >
          {models.map((model) => (
            <SelectItem key={model.key} value={model.key}>
              {model.label}
            </SelectItem>
          ))}
        </Select>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "human" ? "justify-end" : "justify-start"}`}>
              {message.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  AI
                </div>
              )}
              
              <div className={`max-w-[70%] ${message.role === "human" ? "flex flex-col items-end" : ""}`}>
                {message.role === "human" && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 text-xs">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === "human"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-[#1a1a1a] text-gray-200 border border-[#222222] rounded-tl-sm"
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>

              {message.role === "human" && (
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  U
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Input Area */}
      <div className="border-t border-[#222222] bg-[#111111] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a1a] border-2 border-[#333333] rounded-xl px-4 py-3 flex gap-3 items-end focus-within:border-blue-600 transition-colors">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Message AI..."
              className="flex-1 bg-transparent text-white text-[15px] placeholder-gray-500 outline-none resize-none overflow-y-auto leading-6"
              rows={1}
              style={{ 
                height: 'auto',
                minHeight: '24px',
                maxHeight: '200px'
              }}
            />
            <Button 
              onClick={handleSend}
              color="primary" 
              className="px-6 bg-blue-600 hover:bg-blue-700 font-medium flex-shrink-0"
              size="md"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
