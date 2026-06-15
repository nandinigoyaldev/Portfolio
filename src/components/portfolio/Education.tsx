"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

type Milestone = {
  id: string;
  title: string;
  status: "Completed" | "Active" | "Planned";
  eyebrow: string;
  description: string;
  details?: string[];
  color: "cyan" | "emerald" | "fuchsia";
};

const milestones: Milestone[] = [
  {
    id: "diploma",
    title: "Master Diploma in Computer Engineering",
    status: "Completed",
    eyebrow: "Foundation Signal",
    description: "Completed a technical diploma path focused on computer engineering fundamentals, practical systems thinking, and applied development skills.",
    color: "cyan",
  },
  {
    id: "bca",
    title: "Bachelor of Computer Applications (BCA)",
    status: "Active",
    eyebrow: "Current Academic Core",
    description: "Currently building the academic backbone for software engineering, computer applications, and structured problem solving.",
    color: "emerald",
  },
  {
    id: "mca",
    title: "Master of Computer Applications (MCA)",
    status: "Planned",
    eyebrow: "Destination Node",
    description: "The next academic jump: a focused postgraduate path designed to deepen computer science, engineering, and product-building depth.",
    details: ["Target Admission: 2027", "Through NIMCET / CUET PG"],
    color: "fuchsia",
  },
];

const colorStyles = {
  cyan: { bg: "bg-cyan-400", text: "text-cyan-300", border: "border-cyan-400/50", shadow: "shadow-[0_0_15px_rgba(34,211,238,0.5)]" },
  emerald: { bg: "bg-emerald-400", text: "text-emerald-300", border: "border-emerald-400/50", shadow: "shadow-[0_0_15px_rgba(52,211,153,0.5)]" },
  fuchsia: { bg: "bg-fuchsia-400", text: "text-fuchsia-300", border: "border-fuchsia-400/50", shadow: "shadow-[0_0_15px_rgba(232,121,249,0.5)]" },
};

export default function Education() {
  const [activeId, setActiveId] = React.useState<string>("bca");

  const activeMilestone = milestones.find((m) => m.id === activeId) || milestones[1];
  const activeStyles = colorStyles[activeMilestone.color];

  return (
    <section
      className="relative overflow-hidden bg-[#070b14] px-6 py-16 md:py-20 text-white min-h-[50vh] flex flex-col justify-center"
      id="education"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl z-10">
        {/* Header */}
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase mb-2">
            Academic Trajectory
          </span>
          <h2 className="font-mono text-[clamp(1.5rem,5vw,2.25rem)] font-light tracking-widest text-white uppercase">
            NAV.<span className="text-white/40">ROUTE</span>
          </h2>
        </div>

        {/* The Route (Horizontal on desktop, vertical-ish on mobile) */}
        <div className="relative mb-12">
          {/* Base Line */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-px -translate-y-1/2 bg-white/10 hidden md:block" />
          <div className="absolute left-[28px] top-[10%] bottom-[10%] w-px -translate-x-1/2 bg-white/10 md:hidden" />

          {/* Waypoints */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-0 px-4 md:px-[10%]">
            {milestones.map((milestone) => {
              const isActive = activeId === milestone.id;
              const styles = colorStyles[milestone.color];

              return (
                <div 
                  key={milestone.id}
                  className="group relative flex md:flex-col items-center gap-4 cursor-pointer"
                  onClick={() => setActiveId(milestone.id)}
                >
                  {/* Node */}
                  <div className="relative flex items-center justify-center">
                    <div className={`h-8 w-8 rounded-full border transition-all duration-300 ${isActive ? styles.border + ' bg-[#070b14] ' + styles.shadow : 'border-white/20 bg-[#0a0f1a] group-hover:border-white/40'} flex items-center justify-center`}>
                      <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${isActive ? styles.bg : 'bg-white/30'}`} />
                    </div>
                    {/* Ping effect for active */}
                    {isActive && (
                      <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${styles.bg}`} />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="flex flex-col md:items-center md:absolute md:top-12 md:left-1/2 md:-translate-x-1/2 md:w-40 md:text-center">
                    <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${isActive ? styles.text : 'text-white/40 group-hover:text-white/60'}`}>
                      {milestone.status}
                    </span>
                    <span className={`text-xs font-semibold mt-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white/90'}`}>
                      {milestone.title.split(' (')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Single Info HUD */}
        <div className="mx-auto max-w-2xl mt-8 md:mt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-xl border border-white/10 bg-[#0a0f1a] p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-md"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className={`absolute top-0 left-1/2 w-1/3 h-[2px] -translate-x-1/2 ${activeStyles.bg} shadow-[0_0_10px_currentColor] opacity-50`} />
              
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className={`font-mono text-[10px] tracking-widest uppercase ${activeStyles.text}`}>
                    {activeMilestone.eyebrow}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                    {activeMilestone.title}
                  </h3>
                </div>
                <div className={`hidden md:flex px-3 py-1 rounded-full border border-white/10 font-mono text-[9px] uppercase tracking-widest bg-white/5`}>
                  STATUS: {activeMilestone.status}
                </div>
              </div>
              
              <p className="font-mono text-sm leading-relaxed text-white/70">
                &gt; {activeMilestone.description}
              </p>

              {activeMilestone.details && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {activeMilestone.details.map((detail) => (
                    <span key={detail} className="px-3 py-1.5 rounded border border-white/10 bg-[#070b14] font-mono text-xs text-white/50">
                      {detail}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
