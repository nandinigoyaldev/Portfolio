"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState } from "react";
import CursorAndEffects from "./CursorAndEffects";

export default function Hero() {
  const [latestEvent, setLatestEvent] = useState<{ type: string; repo: string; time: string } | null>(null);

  useEffect(() => {
    async function fetchGitHub() {
      try {
        const res = await fetch("https://api.github.com/users/nandinigoyaldev/events/public?per_page=5");
        const events = await res.json();
        if (events && events.length > 0) {
          const pushEvent = events.find((e: any) => e.type === "PushEvent" || e.type === "CreateEvent" || e.type === "PullRequestEvent");
          if (pushEvent) {
            const date = new Date(pushEvent.created_at);
            const timeAgo = Math.floor((Date.now() - date.getTime()) / 60000); // minutes
            let timeStr = timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo/60)}h ago`;
            setLatestEvent({
              type: pushEvent.type === "PushEvent" ? "Pushed to" : (pushEvent.type === "PullRequestEvent" ? "PR on" : "Created"),
              repo: pushEvent.repo.name.split("/")[1] || pushEvent.repo.name,
              time: timeStr
            });
          }
        }
      } catch (err) {}
    }
    fetchGitHub();
  }, []);

  return (
    <>
      <CursorAndEffects />

      <section
        id="hero"
        className="relative min-h-[85vh] overflow-hidden bg-[#050505] px-6 py-16 md:py-20 text-white flex flex-col items-center justify-center"
        aria-label="Hero"
      >
        <div className="relative mx-auto w-full max-w-6xl z-10 flex flex-col items-center justify-center min-h-[500px] mt-16 md:mt-0">
          
          {/* Main Title Background Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-[-60px] md:top-[-40px] left-0 right-0 flex justify-between items-start z-20 pointer-events-none"
          >
            <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-bold tracking-tighter uppercase text-white/5 leading-none">
              Nandini
            </h1>
            <div className="hidden md:block text-right font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mt-8">
              [ 01 ] Portfolio <br/> Architecture
            </div>
          </motion.div>

          {/* Developer Heartbeat Widget (GitHub Theme) */}
          {latestEvent && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#0d1117] border border-[#30363d] px-3 py-1.5 rounded-md shadow-sm"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" className="text-white">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.46-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              <div className="font-sans text-[11px] text-[#c9d1d9] flex items-center gap-1">
                {latestEvent.type} <span className="font-semibold text-white">{latestEvent.repo}</span> {latestEvent.time}
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#2da44e] ml-1 animate-pulse"></div>
            </motion.div>
          )}

          {/* Central Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative w-[280px] h-[380px] md:w-[450px] md:h-[580px] rounded-sm overflow-hidden z-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 group"
          >
            <Image
              src="/assets/picture.jpeg"
              alt="Nandini Profile"
              fill
              className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
              priority
            />
            
            {/* Inner frame subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/90 pointer-events-none" />
            
            {/* Lower minimal links embedded in the photo frame */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end border-t border-white/20 pt-4 z-20">
              <a href="#connect" className="text-white hover:text-white/70 transition-colors font-serif italic text-base md:text-xl relative z-30">
                Say Hello ↘
              </a>
              <a href="/assets/Nandini.pdf" target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] uppercase tracking-widest text-white/50 hover:text-white transition-colors relative z-30">
                Decrypt Dossier ↗
              </a>
            </div>
          </motion.div>

          {/* Terminal Access Hint & Mobile Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute top-[85%] md:top-[88%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 w-full text-center"
          >
            <button 
              className="px-6 py-2.5 bg-black/80 border border-green-500/50 text-green-500 font-mono text-[10px] md:text-xs rounded-full shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:bg-green-500/10 hover:shadow-[0_0_25px_rgba(0,255,0,0.4)] uppercase tracking-widest active:scale-95 transition-all"
              onClick={() => window.dispatchEvent(new Event('open-terminal'))}
            >
              [ Open Terminal ]
            </button>
            <div className="text-[9px] md:text-[10px] font-mono text-green-500/50 uppercase tracking-[0.2em] animate-pulse">
              // Or just type &apos;hack&apos; anywhere
            </div>
          </motion.div>

          {/* Floating Impact Blocks */}
          
          {/* 1. Software Development */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-[8%] md:top-[18%] left-0 md:left-[5%] z-20 md:max-w-[220px]"
          >
            <div className="font-mono text-[9px] text-white/40 mb-1 md:mb-2 tracking-widest uppercase flex items-center gap-2">
              <span className="w-4 h-px bg-white/40"></span> Action 01
            </div>
            <h2 className="text-[clamp(1.1rem,3vw,1.875rem)] font-bold uppercase tracking-tight leading-none mix-blend-difference text-white">
              Software<br/>Development
            </h2>
          </motion.div>

          {/* 2. Community Building */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-[28%] md:top-[15%] right-0 md:right-[5%] text-right z-20 md:max-w-[220px]"
          >
            <div className="font-mono text-[9px] text-white/40 mb-1 md:mb-2 tracking-widest uppercase flex items-center justify-end gap-2">
              Action 02 <span className="w-4 h-px bg-white/40"></span>
            </div>
            <h2 className="text-[clamp(1.1rem,3vw,1.875rem)] font-bold uppercase tracking-tight leading-none mix-blend-difference text-white">
              Community<br/>Building
            </h2>
            <div className="text-white/60 text-[9px] md:text-[10px] mt-2 md:mt-3 font-mono uppercase tracking-[0.2em]">Founder @ CDN IGNOU</div>
          </motion.div>

          {/* 3. Open Source */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-[22%] md:bottom-[25%] left-0 md:left-[2%] z-20 md:max-w-[250px]"
          >
            <div className="font-mono text-[9px] text-white/40 mb-1 md:mb-2 tracking-widest uppercase flex items-center gap-2">
              <span className="w-4 h-px bg-white/40"></span> Action 03
            </div>
            <h2 className="text-[clamp(1.1rem,3vw,1.875rem)] font-bold uppercase tracking-tight leading-none mix-blend-difference text-white">
              Open Source<br/>Contributions
            </h2>
            <div className="text-white/60 text-[9px] md:text-[10px] mt-2 md:mt-3 font-mono uppercase tracking-[0.2em]">Top 25 @ Apertre</div>
          </motion.div>

          {/* 4. Mentoring & Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="absolute bottom-[8%] md:bottom-[15%] right-0 md:right-[8%] text-right z-20 md:max-w-[220px]"
          >
            <div className="font-mono text-[9px] text-white/40 mb-1 md:mb-2 tracking-widest uppercase flex items-center justify-end gap-2">
              Action 04 <span className="w-4 h-px bg-white/40"></span>
            </div>
            <h2 className="text-[clamp(1.1rem,3vw,1.875rem)] font-bold uppercase tracking-tight leading-none mix-blend-difference text-white">
              Mentoring &<br/>Content
            </h2>
            <div className="text-white/60 text-[9px] md:text-[10px] mt-2 md:mt-3 font-mono uppercase tracking-[0.2em]">Creator @ Self Taught Bob</div>
          </motion.div>

        </div>
      </section>
    </>
  );
}
