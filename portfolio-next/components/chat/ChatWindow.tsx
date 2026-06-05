"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessageView, { type ChatMessage } from "./ChatMessage";

export default function ChatWindow({
  onClose,
}: {
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div
      className="w-[360px] max-w-[90vw] rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Chat window"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">🤖</span>
          <span className="text-sm font-semibold text-gray-900">Chat</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-900"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      <div className="h-[320px] overflow-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-sm text-gray-500">
            No messages yet. (AI logic placeholder)
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessageView key={m.id} role={m.role} content={m.content} />
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <ChatInput
          onSend={(text) => {
            // Placeholder behavior: append user message only.
            setMessages((prev) => [
              ...prev,
              {
                id: String(Date.now()),
                role: "user",
                content: text,
              },
            ]);
            // Future: call /api/chat and append assistant response.
          }}
        />
      </div>
    </div>
  );
}

