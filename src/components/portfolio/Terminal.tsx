"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMMANDS: Record<string, string> = {
  help: "Available commands: help, whoami, projects, contact, clear, exit",
  whoami: "Nandini Goyal - Software Developer, Mentor, & Content Creator.",
  projects: "1. Open Source Contribution Atelier\n2. Developer RPG Profile\n3. And more...",
  contact: "Email: connect with me via the contact section!\nGitHub: @nandinigoyaldev",
};

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{ command: string; output: string }[]>([
    { command: "", output: "Welcome to the hidden terminal. Type 'help' for commands." }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let keyBuffer = "";
    const onKeyDown = (e: KeyboardEvent) => {
      if (isOpen) return; // don't track when open
      keyBuffer += e.key;
      if (keyBuffer.length > 4) {
        keyBuffer = keyBuffer.slice(-4);
      }
      if (keyBuffer.toLowerCase() === "hack") {
        setIsOpen(true);
        keyBuffer = "";
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }
    if (cmd === "exit") {
      setIsOpen(false);
      setInput("");
      return;
    }
    
    let output = "Command not found. Type 'help'.";
    if (COMMANDS[cmd]) {
      output = COMMANDS[cmd];
    } else if (cmd === "") {
      output = "";
    }

    setHistory((prev) => [...prev, { command: input, output }]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-[999] bg-black/95 text-green-500 font-mono p-6 flex flex-col backdrop-blur-md"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="absolute top-4 right-4 text-green-500/50 text-sm">
            [SYS_OVERRIDE_ACTIVE]
          </div>
          
          <div className="flex-1 overflow-y-auto mb-4">
            {history.map((h, i) => (
              <div key={i} className="mb-4">
                {h.command && (
                  <div className="flex gap-2">
                    <span className="text-green-700">visitor@nandini:~$</span>
                    <span>{h.command}</span>
                  </div>
                )}
                {h.output && (
                  <div className="whitespace-pre-wrap mt-1 text-green-400">
                    {h.output}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <span className="text-green-700">visitor@nandini:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-green-500"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
