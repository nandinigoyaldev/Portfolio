"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import CursorAndEffects from "./CursorAndEffects";

export default function Hero() {
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
