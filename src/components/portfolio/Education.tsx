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

const colorMap = {
  cyan: { bg: "bg-cyan-500", text: "text-cyan-400", border: "border-cyan-500", glow: "shadow-[0_0_30px_rgba(6,182,212,0.15)]" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500", glow: "shadow-[0_0_30px_rgba(16,185,129,0.15)]" },
  fuchsia: { bg: "bg-fuchsia-500", text: "text-fuchsia-400", border: "border-fuchsia-500", glow: "shadow-[0_0_30px_rgba(217,70,239,0.15)]" },
};

export default function Education() {
  const [activeId, setActiveId] = React.useState<string | null>("bca");

  return (
    <section className="relative overflow-hidden bg-[#050505] px-6 py-24 text-white min-h-[90vh] flex flex-col justify-center items-center" id="education">
      
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl z-10">
        
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4 border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500/90">
              System Neural Spine
            </span>
          </div>
          <h2 className="font-mono text-4xl font-light tracking-widest text-white md:text-6xl uppercase">
            Edu<span className="text-white/30">cation</span>
          </h2>
          <p className="mt-4 font-mono text-xs text-white/40 tracking-widest uppercase">
            [ Accessing core memory banks ]
          </p>
        </div>
        
        {/* The Server Rack / Neural Spine */}
        <div className="relative w-full flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto pl-4 md:pl-0">
          
          {/* Neural Spine glowing line */}
          <div className="absolute left-[7px] md:left-[29px] top-4 bottom-4 w-[2px] bg-white/10">
            <div className="w-full h-1/3 bg-white/40 animate-[pulse_4s_infinite]" />
          </div>

          {milestones.map((m) => {
            const isActive = activeId === m.id;
            const styles = colorMap[m.color];

            return (
              <div key={m.id} className="relative flex gap-6 md:gap-10 group items-stretch">
                
                {/* Spine Connector Node */}
                <div className="flex flex-col items-center pt-8 z-10">
                  <div className={`h-4 w-4 md:h-5 md:w-5 rounded-full border-2 transition-colors duration-500 flex items-center justify-center bg-[#050505] ${isActive ? styles.border : 'border-white/20 group-hover:border-white/50'}`}>
                    {isActive && <div className={`absolute h-2 w-2 md:h-2.5 md:w-2.5 rounded-full animate-ping ${styles.bg}`} />}
                    {isActive && <div className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ${styles.bg}`} />}
                  </div>
                </div>

                {/* Server Blade */}
                <div 
                  className={`flex-1 rounded-r-2xl border-l-[6px] md:border-l-[8px] bg-[#0a0f1a] border border-white/10 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col ${isActive ? 'border-l-' + m.color + '-500 bg-white/[0.04] ' + styles.glow : 'border-l-white/20 hover:border-l-white/40 hover:bg-white/[0.02]'}`}
                  onClick={() => setActiveId(isActive ? null : m.id)}
                  style={{ borderLeftColor: isActive ? `var(--tw-colors-${m.color}-500)` : '' }}
                >
                  
                  {/* Blade Header / External Casing */}
                  <div className="p-5 md:p-8 flex justify-between items-center bg-black/40 border-b border-transparent transition-colors">
                    <div className="pr-4">
                       <span className="font-mono text-[9px] md:text-[10px] uppercase text-white/50 tracking-widest">{m.eyebrow}</span>
                       <h3 className="text-lg md:text-2xl font-bold mt-2 uppercase tracking-tight text-white">{m.title}</h3>
                    </div>
                    {/* Server LEDs */}
                    <div className="hidden sm:flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500/20" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                      <div className={`w-2 h-2 rounded-full ${isActive ? styles.bg + ' animate-pulse' : 'bg-white/20'}`} />
                    </div>
                  </div>

                  {/* Blade Internal Components (The Skill Tree / Data) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 bg-[#050505] overflow-hidden"
                      >
                        <div className="p-6 md:p-8 flex gap-6 md:gap-8">
                           
                           {/* Internal Skill Tree visual trace */}
                           <div className="hidden sm:flex flex-col items-center">
                             <div className="w-px h-full bg-white/10 relative mt-2">
                               <div className={`absolute top-2 left-[-3px] w-1.5 h-1.5 rounded-full ${styles.bg}`} />
                               <div className={`absolute top-1/2 left-[-3px] w-1.5 h-1.5 rounded-full ${styles.bg}`} />
                             </div>
                           </div>
                           
                           {/* Data Core */}
                           <div className="flex-1">
                             <div className={`inline-block px-3 py-1 md:px-4 md:py-1.5 border bg-white/[0.03] font-mono text-[9px] md:text-[10px] uppercase tracking-widest mb-6 ${styles.border} ${styles.text}`}>
                               SYS.STATUS: {m.status}
                             </div>
                             
                             <p className="font-mono text-xs md:text-sm leading-relaxed text-white/70 max-w-2xl border-l-2 border-white/10 pl-4 py-1">
                               &gt; {m.description}
                             </p>
                             
                             {m.details && (
                               <div className="mt-8 flex flex-wrap gap-3">
                                 {m.details.map(d => (
                                   <span key={d} className="px-3 py-1.5 md:px-4 md:py-2 rounded bg-[#0a0f1a] border border-white/10 font-mono text-[10px] md:text-xs text-white/50 tracking-wider">
                                     {d}
                                   </span>
                                 ))}
                               </div>
                             )}
                           </div>
                           
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
