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
      className="flex gap-2 items-center"
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
        className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-brand"
        aria-label="Message"
      />
      <button
        type="submit"
        className="rounded-xl bg-brand text-white px-4 py-3 text-sm font-medium hover:bg-brand-dark transition-colors"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}

