"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {

  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50" aria-label="Chat widget">
      {open ? (
        <ChatWindow onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-14 h-14 rounded-full bg-brand text-white shadow-xl hover:bg-brand-dark transition-colors"
          aria-label="Open chat"
        >
          💬
        </button>
      )}
    </div>
  );
}

