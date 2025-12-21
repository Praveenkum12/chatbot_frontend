"use client";

import { useRef, useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { useChatStore } from "./store/chat.store";
import { ChatController } from "./controller/chat.controller";

export default function ChatPage() {
  const { 
    messages, 
    models, 
    selectedModelKey, 
    inputValue, 
    turboMode,
    setInputValue, 
    setSelectedModelKey,
    setTurboMode
  } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-focus on load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const messageToSend = inputValue;
      setInputValue("");
      setIsLoading(true);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      try {
        // Call the controller which handles both store updates and API call
        await ChatController.sendMessage(messageToSend);
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
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
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#111111] border-b border-[#222222] flex items-center justify-between px-6 z-50">
        <h1 className="text-xl font-bold text-white">AI Chat</h1>
        
        <div className="flex items-center gap-5">

    {/* Turbo Mode Toggle - Shows when GPT-4 Nano is selected */}
          {selectedModelKey === "001" && (
            <div className="flex items-center gap-3">
              {/* Toggle Switch */}
              <button
                onClick={() => setTurboMode(!turboMode)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 ${
                  turboMode
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/50"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                role="switch"
                aria-checked={turboMode}
              >
                {/* Sliding Knob */}
                <span
                  className={`h-6 w-6 transform rounded-full bg-white transition-transform duration-300 flex items-center justify-center ${
                    turboMode ? "translate-x-9" : "translate-x-1"
                  }`}
                >
                  {/* Lightning icon inside knob */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transition-all duration-300 ${
                      turboMode ? "text-amber-500" : "text-gray-400"
                    }`}
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
              </button>
              
              {/* TURBO Label */}
              {/* <span className={`font-bold text-sm transition-colors duration-300 ${
                turboMode ? "text-yellow-400" : "text-gray-400"
              }`}>
                TURBO
              </span> */}
            </div>
          )}

          <Select
            size="sm"
            placeholder="Select model"
            className="w-48"
            selectedKeys={[selectedModelKey]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModelKey(e.target.value)}
          >
            {models.map((model) => (
              <SelectItem key={model.key} >
                {model.label}
              </SelectItem>
            ))}
          </Select>
          
      
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-6 pt-20 pb-32">
        <div className="w-full mx-auto space-y-4">
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
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
        <div className="max-w-6xl mx-auto">
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
              isLoading={isLoading}
              isDisabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
