"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

const milestones = [
  { year: "2024", code: "IGNOU.BCA", title: "Build the foundation", copy: "Programming, algorithms, applications, and systems design.", color: "emerald" },
  { year: "2024—27", code: "IICS.MDCE", title: "Understand the machine", copy: "Computer software, hardware integration, and diagnostics.", color: "cyan" },
  { year: "2024", code: "IICS.AUTO", title: "Make work move", copy: "Business process automation, productivity, and structured data.", color: "yellow" },
  { year: "2027 →", code: "MCA.NEXT", title: "Next map loading", copy: "Advanced computer science and intelligent systems.", color: "fuchsia" },
] as const;

const colors = {
  cyan: { text: "text-cyan-300", line: "bg-cyan-300", border: "border-cyan-300/50", glow: "rgba(34,211,238,.3)" },
  emerald: { text: "text-emerald-300", line: "bg-emerald-300", border: "border-emerald-300/50", glow: "rgba(52,211,153,.3)" },
  yellow: { text: "text-yellow-300", line: "bg-yellow-300", border: "border-yellow-300/50", glow: "rgba(250,204,21,.25)" },
  fuchsia: { text: "text-fuchsia-300", line: "bg-fuchsia-300", border: "border-fuchsia-300/50", glow: "rgba(232,121,249,.3)" },
};

export default function Education() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = React.useState(0);

  return (
    <section id="education" className="relative bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8">
        <div className="mb-10">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300/70">Education // scroll sequence</p>
          <h2 className="text-5xl font-black uppercase tracking-[-0.06em] md:text-8xl">Build<span className="text-white/20"> mode</span></h2>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-2 top-0 h-full w-1 rounded-full bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div className="w-full origin-top bg-gradient-to-b from-emerald-300 via-cyan-300 to-fuchsia-300" animate={{ height: `${((active + 1) / milestones.length) * 100}%` }} transition={{ duration: reduceMotion ? 0 : 0.18 }} />
          </div>

          {milestones.map((item, index) => {
            const palette = colors[item.color];
            const isActive = index === active;
            return (
              <motion.article
                key={item.code}
                onMouseEnter={() => setActive(index)}
                onViewportEnter={() => setActive(index)}
                viewport={{ amount: 0.6, margin: "-20% 0px -20% 0px" }}
                className="relative flex min-h-[86vh] snap-start items-center pl-9 md:min-h-[78vh] md:pl-0"
              >
                <button type="button" onClick={() => setActive(index)} className={`group w-full max-w-xl rounded-[2rem] border bg-[#0a101b]/95 p-7 text-left backdrop-blur-xl transition-all duration-300 md:p-11 ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"} ${isActive ? `${palette.border} opacity-100 shadow-[0_0_80px_${palette.glow}]` : "border-white/10 opacity-25 hover:opacity-70"}`}>
                  <AnimatePresence mode="wait" initial={false}>
                    {isActive && (
                      <motion.div
                        key={item.code}
                        initial={reduceMotion ? false : { opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                        transition={{ duration: reduceMotion ? 0 : 0.28 }}
                      >
                        <div className="flex items-start justify-between gap-5">
                          <span className={`font-mono text-7xl font-black leading-none ${palette.text}`}>{String(index + 1).padStart(2, "0")}</span>
                          <span className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.18em] ${palette.border} ${palette.text}`}>{item.year}</span>
                        </div>
                        <p className={`mt-12 font-mono text-[10px] uppercase tracking-[0.28em] ${palette.text}`}>{item.code}</p>
                        <h3 className="mt-3 text-3xl font-bold md:text-5xl">{item.title}</h3>
                        <p className="mt-5 max-w-md text-sm leading-7 text-white/55">{item.copy}</p>
                        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                          <span className={`h-2 w-2 animate-pulse rounded-full ${palette.line}`} /> Current checkpoint
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                <span className={`absolute left-[-3px] z-10 h-7 w-7 rounded-full border-4 border-[#05070d] ${palette.line} transition-all duration-200 md:left-1/2 md:-translate-x-1/2 ${isActive ? "scale-125 shadow-[0_0_24px_currentColor]" : "opacity-30"}`} />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
