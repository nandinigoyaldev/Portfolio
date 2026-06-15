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
    } catch {
      const errorMsg: ChatMessage = {
        id: generateMsgId("error"),
        role: "assistant",
        content: "Sorry, I hit a slight connection glitch. Could you ask me that again?"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative w-[385px] max-w-[90vw] h-[550px] max-h-[85dvh] rounded-3xl border border-white/10 bg-[#070b14]/85 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-2xl flex flex-col overflow-hidden select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Nandini AI Assistant"
    >
      {/* Background Neural Gradients */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-48 h-48 rounded-full bg-cyan-400/10 blur-2xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 rounded-full bg-fuchsia-500/10 blur-2xl" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {/* Neural Ring / Active Indicator */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="text-sm">🤖</span>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-[#070b14]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white leading-tight">Nandini AI</h3>
            <span className="text-[10px] text-white/50 font-mono tracking-wider">DIGITAL TWIN v1.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsVoiceOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-200/20 bg-cyan-300/10 text-xs text-cyan-200 hover:bg-cyan-300/20 hover:border-cyan-200/40 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.1)] cursor-pointer"
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center h-full space-y-6">
            <div className="space-y-2.5">
              <span className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-300 font-mono tracking-wider">
                ACTIVE COGNITION NODE
              </span>
              <h4 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Explore Nandini&apos;s Journey
              </h4>
              <p className="text-sm text-white/60 leading-relaxed">
                I can tell you about Nandini&apos;s projects, communities, open-source work, and technical journey. Let me know what you want to learn!
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
                  <span className="text-xs font-semibold text-white/80 group-hover:text-white">
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
            <div className="max-w-[85%] rounded-2xl bg-white/[0.05] border border-white/5 px-4 py-3 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
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
            <VoiceMode onClose={() => setIsVoiceOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
