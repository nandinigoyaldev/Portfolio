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
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="relative group flex h-14 w-14 items-center justify-center rounded-full bg-[#070b14]/80 text-white shadow-[0_10px_35px_rgba(0,0,0,0.3),0_0_20px_rgba(213,83,77,0.25)] border border-white/10 backdrop-blur-xl hover:border-brand/40 transition-colors cursor-pointer"
          aria-label="Open chat assistant"
        >
          {/* Pulsing ring */}
          <span className="absolute -inset-0.5 rounded-full border border-brand/35 animate-ping opacity-45 group-hover:opacity-70 motion-reduce:animate-none" />
          
          {/* Notification Dot */}
          <span className="absolute top-0.5 right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-[#070b14]"></span>
          </span>

          <span className="text-xl group-hover:rotate-6 transition-transform duration-300">💬</span>
        </motion.button>
      )}
    </div>
  );
}
