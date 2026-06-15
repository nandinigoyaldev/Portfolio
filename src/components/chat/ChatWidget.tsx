"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" aria-label="Chat widget">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="origin-bottom-right"
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex h-12 items-center gap-3 px-5 rounded-full bg-[#0a0a0a] text-white shadow-[0_10px_35px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl hover:border-white/30 hover:bg-[#121212] transition-colors cursor-pointer"
          aria-label="Open chat assistant"
        >
          {/* Notification Dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>

          <span className="font-serif italic text-sm font-medium tracking-wide">Ask AI</span>
        </motion.button>
      )}
    </div>
  );
}
