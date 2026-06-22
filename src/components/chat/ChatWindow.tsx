"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatInput from "./ChatInput";
import ChatMessageView, { type ChatMessage } from "./ChatMessage";
import VoiceMode from "./VoiceMode";

type QuickAction = {
  label: string;
  icon: string;
  query: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Best Projects", icon: "🚀", query: "Tell me about Nandini's projects." },
  { label: "Resume", icon: "📄", query: "Show me her resume" },
  { label: "GitHub", icon: "💻", query: "What repositories are on her GitHub?" },
  { label: "Community Work", icon: "🎤", query: "What communities has she founded?" },
  { label: "Achievements", icon: "🏆", query: "What are her achievements?" },
  { label: "Contact", icon: "📬", query: "How can I contact her?" }
];

const generateMsgId = (role: string) => `${role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    // 1. Add user message
    const userMsg: ChatMessage = {
      id: generateMsgId("user"),
      role: "user",
      content: text
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // 2. Fetch response from API
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: generateMsgId("assistant"),
        role: "assistant",
        content: data.reply || "I couldn't generate a response. Please try again!"
      };
      setMessages((prev) => [...prev, assistantMsg]);
      return assistantMsg.content;
    } catch {
      const errorMsg: ChatMessage = {
        id: generateMsgId("error"),
        role: "assistant",
        content: "Sorry, I hit a slight connection glitch. Could you ask me that again?"
      };
      setMessages((prev) => [...prev, errorMsg]);
      return errorMsg.content;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-[385px] max-w-[90vw] h-[550px] max-h-[85dvh] rounded-3xl border border-white/10 bg-[#0a0a0a] text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Nandini AI Assistant"
    >
      {/* Subtle Grain Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03),_transparent_80%)]" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10">
            <span className="font-serif italic text-sm">N</span>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-white border border-[#0a0a0a]" />
          </div>
          <div>
            <h3 className="text-sm font-medium tracking-wide text-white leading-tight">Personal Assistant</h3>
            <span className="text-[10px] text-white/40 tracking-wider">ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Open voice mode"
          >
            🎙 Voice
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white/80 p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages / Welcome Panel */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center h-full space-y-6">
            <div className="space-y-2.5">
              <h4 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                Hello.
              </h4>
              <p className="text-sm text-white/60 leading-relaxed font-light">
                I'm an AI assistant. I can answer questions about Nandini's experience, projects, and work history. How can I help you today?
              </p>
            </div>

            {/* Quick Actions Cards */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleSendMessage(action.query)}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.08] hover:border-cyan-200/30 group cursor-pointer"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </span>
                  <span className="text-xs font-medium text-white/60 group-hover:text-white">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessageView key={m.id} role={m.role} content={m.content} />
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl bg-[#121212] border border-white/10 px-4 py-3 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-white/10 bg-white/[0.01]">
        <ChatInput onSend={handleSendMessage} />
      </div>

      {/* Voice Mode Overlay */}
      <AnimatePresence>
        {isVoiceOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <VoiceMode 
              onClose={() => setIsVoiceOpen(false)} 
              onVoiceInput={handleSendMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
