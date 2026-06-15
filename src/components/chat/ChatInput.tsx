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
        placeholder="Type a message..."
        className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder:text-white/30"
        aria-label="Message"
      />
      <button
        type="submit"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors cursor-pointer shrink-0"
        aria-label="Send message"
      >
        <span className="text-lg">↑</span>
      </button>
    </form>
  );
}
