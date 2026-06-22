/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

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

export default function VoiceMode({ 
  onClose, 
  onVoiceInput 
}: { 
  onClose: () => void;
  onVoiceInput?: (text: string) => Promise<string>;
}) {
  const [state, setState] = useState<"connecting" | "listening" | "thinking" | "speaking" | "muted">("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [errorText, setErrorText] = useState("");
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setErrorText("Voice mode is not supported in this browser.");
      setState("muted");
      setIsMuted(true);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setState("listening");
      setErrorText("");
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setState("thinking");
      
      if (onVoiceInput) {
        try {
          const reply = await onVoiceInput(transcript);
          speakResponse(reply);
        } catch (e) {
          setErrorText("Failed to get response.");
          setState("listening");
        }
      } else {
        setState("listening");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "not-allowed") {
        setErrorText("Microphone permission denied.");
        setState("muted");
        setIsMuted(true);
      } else if (event.error !== "no-speech") {
        setErrorText(`Error: ${event.error}`);
        setState("muted");
        setIsMuted(true);
      }
    };

    recognition.onend = () => {
      // If we are still in listening state (no result), and not muted, restart
      if (state === "listening" && !isMuted) {
        try { recognition.start(); } catch {}
      }
    };

    recognitionRef.current = recognition;

    // Start connecting flow
    const connTimer = setTimeout(() => {
      if (!isMuted) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Mic start error", e);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(connTimer);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  function speakResponse(text: string) {
    if (!("speechSynthesis" in window)) {
      setState("listening");
      if (!isMuted) recognitionRef.current?.start();
      return;
    }

    setState("speaking");
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes("en") && v.name.includes("Female")) 
      || voices.find(v => v.lang.includes("en"));
      
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 1.05;
    utterance.pitch = 1.1;

    utterance.onend = () => {
      if (isMuted) {
        setState("muted");
      } else {
        setState("listening");
        try { recognitionRef.current?.start(); } catch {}
      }
    };
    
    utterance.onerror = () => {
      if (!isMuted) {
        setState("listening");
        try { recognitionRef.current?.start(); } catch {}
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    if (nextMuted) {
      setState("muted");
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    } else {
      setErrorText("");
      setState("listening");
      try { recognitionRef.current?.start(); } catch {}
    }
  };

  const bars = Array.from({ length: 14 });

  return (
    <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-6 z-50 rounded-3xl border border-white/10 select-none">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-xs font-medium tracking-wider uppercase text-white/50">Voice Mode</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/40 hover:text-white/80 p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Exit voice mode"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 my-6 gap-6 w-full">
        <div className="relative flex items-center justify-center h-36 w-36">
          <motion.div
            className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.02]"
            animate={
              state === "speaking"
                ? { scale: [1, 1.35, 1], opacity: [0.3, 0.6, 0.3] }
                : state === "listening"
                ? { scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }
                : state === "thinking"
                ? { scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }
                : { scale: 1, opacity: 0.1 }
            }
            transition={{
              duration: state === "speaking" ? 2 : state === "thinking" ? 1 : 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute h-28 w-28 rounded-full border border-white/10 bg-white/[0.02]"
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
          <div className="relative z-10 h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <span className="text-3xl text-black">🎙</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 h-16 w-60 justify-center">
          {bars.map((_, i) => {
            const factor = WAVE_FACTORS[i] || { duration: 0.7, speakHeight: 50, listenHeight: 25 };
            let heightRange = [8, 8];
            let duration = factor.duration;

            if (state === "speaking") {
              heightRange = [12, factor.speakHeight, 12];
            } else if (state === "listening") {
              heightRange = [8, factor.listenHeight, 8];
            } else if (state === "connecting" || state === "thinking") {
              heightRange = [8, 12, 8];
              duration = 1;
            }

            return (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-white"
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

        <div className="text-center">
          <h4 className="text-lg font-medium tracking-wide text-white capitalize">
            {errorText ? errorText : 
              state === "connecting" ? "Requesting microphone..." :
              state === "listening" ? "Listening..." :
              state === "thinking" ? "Thinking..." :
              state === "speaking" ? "Speaking..." :
              "Microphone muted"}
          </h4>
          <p className="text-xs text-white/40 mt-1 max-w-[200px] mx-auto leading-relaxed">
            {errorText ? "Click mic to try again." :
              state === "connecting" ? "Please allow microphone access." :
              state === "listening" ? "Speak clearly." :
              state === "thinking" ? "Processing your question..." :
              state === "speaking" ? "Reading response..." :
              "Click mic to unmute."}
          </p>
        </div>
      </div>

      <div className="w-full border-t border-white/10 pt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={handleMuteToggle}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all cursor-pointer ${
            isMuted
              ? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
              : "bg-white border-white text-black hover:bg-white/90"
          }`}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? "🔇" : "🎙"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 px-5 items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-white font-medium transition-all cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
