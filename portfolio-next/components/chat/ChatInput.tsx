"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      className="flex gap-2 items-center w-full"
      onSubmit={(e) => {
        e.preventDefault();
        const text = value.trim();
        if (!text) return;
        onSend(text);
        setValue("");
      }}
      aria-label="Chat input"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about my projects, communities..."
        className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-cyan-400/10 placeholder:text-white/30 transition-all"
        aria-label="Message"
      />
      <button
        type="submit"
        className="flex h-11 px-4 items-center justify-center rounded-2xl bg-brand hover:bg-brand-dark text-white text-sm font-semibold shadow-[0_4px_15px_rgba(213,83,77,0.25)] hover:shadow-[0_4px_20px_rgba(213,83,77,0.35)] transition-all cursor-pointer shrink-0"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}
