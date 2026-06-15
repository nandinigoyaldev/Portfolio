"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Static pre-calculated animation details to guarantee React component purity
const WAVE_FACTORS = [
  { duration: 0.72, speakHeight: 48, listenHeight: 22 },
  { duration: 0.58, speakHeight: 54, listenHeight: 28 },
  { duration: 0.88, speakHeight: 60, listenHeight: 18 },
  { duration: 0.62, speakHeight: 45, listenHeight: 32 },
  { duration: 0.82, speakHeight: 56, listenHeight: 24 },
  { duration: 0.68, speakHeight: 50, listenHeight: 20 },
  { duration: 0.54, speakHeight: 62, listenHeight: 30 },
  { duration: 0.86, speakHeight: 48, listenHeight: 25 },
  { duration: 0.64, speakHeight: 58, listenHeight: 28 },
  { duration: 0.78, speakHeight: 52, listenHeight: 22 },
  { duration: 0.70, speakHeight: 46, listenHeight: 18 },
  { duration: 0.56, speakHeight: 54, listenHeight: 32 },
  { duration: 0.90, speakHeight: 50, listenHeight: 26 },
  { duration: 0.60, speakHeight: 44, listenHeight: 20 },
];

export default function VoiceMode({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<"connecting" | "listening" | "speaking" | "muted">("connecting");
  const [isMuted, setIsMuted] = useState(false);

  // Simulate connection flow
  useEffect(() => {
    const connTimer = setTimeout(() => {
      setState("listening");
    }, 1500);

    return () => clearTimeout(connTimer);
  }, []);

  // Simulate speaking and listening loop
  useEffect(() => {
    if (state === "connecting" || state === "muted") return;

    const interval = setInterval(() => {
      setState((prev) => (prev === "listening" ? "speaking" : "listening"));
    }, 4000);

    return () => clearInterval(interval);
  }, [state]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    setState(isMuted ? "listening" : "muted");
  };

  // Waveform bars count
  const bars = Array.from({ length: 14 });

  return (
    <div className="absolute inset-0 bg-[#070b14]/94 backdrop-blur-2xl flex flex-col items-center justify-between p-6 z-50 rounded-3xl border border-white/10 select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-white/50">Nandini AI Voice</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/40 hover:text-white/80 p-1.5 rounded-full hover:bg-white/5 transition-colors"
          aria-label="Exit voice mode"
        >
          ✕
        </button>
      </div>

      {/* Waveform / Visualizer */}
      <div className="flex flex-col items-center justify-center flex-1 my-6 gap-6">
        {/* Pulsing Outer Ring */}
        <div className="relative flex items-center justify-center h-36 w-36">
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-300/20 bg-cyan-300/[0.02]"
            animate={
              state === "speaking"
                ? { scale: [1, 1.35, 1], opacity: [0.3, 0.6, 0.3] }
                : state === "listening"
                ? { scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }
                : { scale: 1, opacity: 0.1 }
            }
            transition={{
              duration: state === "speaking" ? 2 : 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute h-28 w-28 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/[0.02]"
            animate={
              state === "speaking"
                ? { scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }
                : { scale: 1, opacity: 0.1 }
            }
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Central Orb */}
          <div className="relative z-10 h-20 w-20 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <span className="text-3xl text-white">🎙</span>
          </div>
        </div>

        {/* Dynamic Equalizer Wave */}
        <div className="flex items-center gap-1.5 h-16 w-60 justify-center">
          {bars.map((_, i) => {
            const factor = WAVE_FACTORS[i] || { duration: 0.7, speakHeight: 50, listenHeight: 25 };
            let heightRange = [8, 8];
            let duration = factor.duration;

            if (state === "speaking") {
              heightRange = [12, factor.speakHeight, 12];
            } else if (state === "listening") {
              heightRange = [8, factor.listenHeight, 8];
            } else if (state === "connecting") {
              heightRange = [8, 12, 8];
              duration = 1;
            }

            return (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-fuchsia-400"
                animate={{ height: heightRange }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05
                }}
                style={{ height: 8 }}
              />
            );
          })}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <h4 className="text-lg font-medium tracking-wide text-white capitalize">
            {state === "connecting"
              ? "Establishing neural channel..."
              : state === "listening"
              ? "Listening to you..."
              : state === "speaking"
              ? "Nandini AI speaking"
              : "Microphone muted"}
          </h4>
          <p className="text-xs text-white/40 mt-1 max-w-[200px] mx-auto leading-relaxed">
            {state === "connecting"
              ? "Connecting mock channels..."
              : state === "listening"
              ? "Speak clearly. Click Mic to mute."
              : state === "speaking"
              ? "Translating repository facts..."
              : "Click Mic to unmute."}
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="w-full border-t border-white/10 pt-4 flex items-center justify-center gap-6">
        {/* Mute Mic Button */}
        <button
          type="button"
          onClick={handleMuteToggle}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
            isMuted
              ? "bg-brand/20 border-brand text-brand hover:bg-brand/30 shadow-[0_0_15px_rgba(213,83,77,0.25)]"
              : "bg-white/5 border-white/10 text-white hover:bg-white/10"
          }`}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? "🔇" : "🎙"}
        </button>

        {/* End Call Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 px-5 items-center justify-center rounded-full bg-brand hover:bg-brand-dark text-white font-medium shadow-[0_0_20px_rgba(213,83,77,0.3)] hover:shadow-[0_0_25px_rgba(213,83,77,0.4)] transition-all"
        >
          Disconnect
        </button>
      </div>

      {/* Integration Architectural Notes */}
      {/* 
        Future implementation details:
        1. OpenAI Realtime: Hook up a WebSocket client to `wss://api.openai.com/v1/realtime`.
        2. ElevenLabs / Deepgram: Stream user audio to Deepgram (STT), send text prompt to AI, 
           and route AI text response to ElevenLabs API (TTS) to stream back audio buffers.
      */}
    </div>
  );
}
