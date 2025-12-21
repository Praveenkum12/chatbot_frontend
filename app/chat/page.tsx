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
    history,
    isHistoryLoading,
    selectedConversationId,
    setInputValue, 
    setSelectedModelKey,
    setTurboMode,
    setHistory,
    setIsHistoryLoading,
    setSelectedConversationId,
    clearMessages
  } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-focus on load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Load conversation history on component mount
  useEffect(() => {
    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const historyData = await ChatController.getHistory();
        console.log("Conversation history:", historyData);
        setHistory(historyData);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadHistory();
  }, [setHistory, setIsHistoryLoading]);

  // Auto-disable turbo mode when switching away from GPT-4 Nano
  useEffect(() => {
    if (selectedModelKey !== "001" && turboMode) {
      setTurboMode(false);
    }
  }, [selectedModelKey, turboMode, setTurboMode]);

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
        // Use web search endpoint if turbo mode is enabled
        await ChatController.sendMessage(messageToSend, turboMode);
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

  const handleNewChat = () => {
    setSelectedConversationId(null);
    clearMessages();
    textareaRef.current?.focus();
  };

  const handleHistoryClick = async (conversationId: string) => {
    // Set the selected conversation
    setSelectedConversationId(conversationId);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Load the messages for this conversation
      await ChatController.getChatMessages(conversationId);
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-72" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full w-72">
          {/* Sidebar Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Chat History</h2>
            <div className="flex items-center gap-2">
              {/* New Chat Button */}
              <button
                onClick={handleNewChat}
                className="p-2 bg-blue-600/20 rounded-lg transition-colors group"
                aria-label="New chat"
                title="Start new conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400 group-hover:text-blue-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {/* Close Sidebar Button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isHistoryLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No chat history yet
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleHistoryClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    selectedConversationId === item.id
                      ? "bg-gradient-to-r from-blue-600/30 to-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
                      : "bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20"
                  }`}
                >
                  <p className={`text-sm font-medium truncate transition-colors ${
                    selectedConversationId === item.id
                      ? "text-blue-300"
                      : "text-white hover:text-blue-200"
                  }`}>
                    {item.title}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-0"}`}>
        {/* Top Bar */}
        <header className="fixed top-0 right-0 h-16 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-50"
          style={{ left: isSidebarOpen ? '18rem' : '0' }}
        >
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-bold text-white">AI Chat</h1>
          </div>
          
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
                  <div className={`rounded-2xl px-4 py-3 backdrop-blur-md ${
                    message.role === "human"
                      ? "bg-blue-600/90 text-white rounded-tr-sm shadow-lg shadow-blue-600/20"
                      : "bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm backdrop-blur-xl"
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
        <div className="fixed bottom-0 right-0 p-4 z-40"
          style={{ left: isSidebarOpen ? '18rem' : '0' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className={`backdrop-blur-xl border-2 rounded-xl px-4 py-3 flex gap-3 items-end transition-all shadow-2xl ${
              turboMode
                ? "bg-white/5 border-yellow-400/60 focus-within:border-yellow-400"
                : "bg-white/5 border-white/10 focus-within:border-blue-500/50"
            }`}>
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
                className={`px-6 font-medium flex-shrink-0 transition-all ${
                  turboMode
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black shadow-lg shadow-yellow-500/60"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
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
    </div>
  );
}
