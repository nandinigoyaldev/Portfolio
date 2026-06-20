"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

const projects = [
  {
    id: "autobotx",
    name: "AutoBotX",
    type: "HARDWARE-SYS",
    label: "Award-winning IoT build",
    description:
      "Autonomous IoT system blending hardware control and software execution. It placed 2nd in a National IoT Hackathon and shows deep hardware-software problem solving and real-time data processing.",
    stack: ["C++", "Python", "HTML", "IoT"],
    live: "https://github.com/goyaljiiiiii/AutoBotX",
    code: "https://github.com/goyaljiiiiii/AutoBotX",
    cpu: "0x0A2",
    color: "emerald"
  },
  {
    id: "autoalign",
    name: "AutoAlign",
    type: "DEV-UTILITY",
    label: "Recognized utility tool",
    description:
      "A developer utility for automated alignment and visual component mapping, recognized on Commudle for its practical approach. Dramatically reduces CSS alignment boilerplate.",
    stack: ["TypeScript", "React", "CSS"],
    live: "https://github.com/goyaljiiiiii/AutoAlign",
    code: "https://github.com/goyaljiiiiii/AutoAlign",
    cpu: "0x0B5",
    color: "cyan"
  },
  {
    id: "portfolio",
    name: "AI Portfolio",
    type: "WEB-APP",
    label: "AI-powered portfolio",
    description:
      "This portfolio pairs a responsive Next.js experience with a dynamic assistant that can answer questions about projects, education, communities, and resume details in real-time.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    live: "https://nandini-goyal.netlify.app/",
    code: "https://github.com/goyaljiiiiii/portfolio",
    cpu: "0x0C8",
    color: "fuchsia"
  },
];

const colorMap = {
  emerald: { text: "text-emerald-400", border: "border-emerald-500", bg: "bg-emerald-500", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]" },
  cyan: { text: "text-cyan-400", border: "border-cyan-500", bg: "bg-cyan-500", shadow: "shadow-[0_0_20px_rgba(6,182,212,0.5)]" },
  fuchsia: { text: "text-fuchsia-400", border: "border-fuchsia-500", bg: "bg-fuchsia-500", shadow: "shadow-[0_0_20px_rgba(217,70,239,0.5)]" },
};

export default function Projects() {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const activeProject = projects.find(p => p.id === activeId);

  return (
    <section className="relative bg-[#050505] px-6 py-24 text-white min-h-[90vh] flex flex-col items-center justify-center overflow-hidden" id="projects">
      
      {/* Deep Circuit Grid Background */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:30px_30px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#050505_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4 border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-sm bg-cyan-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400/90">
              Motherboard
            </span>
          </div>
          <h2 className="font-mono text-4xl font-light tracking-widest text-white md:text-6xl uppercase">
            Data<span className="text-white/30">Cores</span>
          </h2>
          <p className="mt-4 font-mono text-xs text-white/40 tracking-widest uppercase">
            [ Select Microchip to extract data ]
          </p>
        </div>

        {/* The Circuit Board Area */}
        <div className="relative w-full h-[500px] md:h-[600px] border border-white/10 bg-[#070b14]/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          
          {/* Main Bus Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-[6px] bg-white/5 -translate-y-1/2 opacity-30" />
          
          {/* Central Processor Node (Optional visual) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full animate-[spin_30s_linear_infinite_reverse]" />

          {/* Render SVG Traces connecting chips to the center bus */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <motion.path 
              d="M 20% 30% L 20% 50%" 
              stroke="rgba(16,185,129,0.3)" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }}
            />
            <motion.path 
              d="M 50% 70% L 50% 50%" 
              stroke="rgba(6,182,212,0.3)" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.path 
              d="M 80% 30% L 80% 50%" 
              stroke="rgba(217,70,239,0.3)" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }}
            />
          </svg>

          {/* Chip 1 */}
          <Microchip 
            project={projects[0]} 
            position={{ left: "20%", top: "30%" }} 
            isActive={activeId === projects[0].id}
            onClick={() => setActiveId(projects[0].id)}
          />

          {/* Chip 2 */}
          <Microchip 
            project={projects[1]} 
            position={{ left: "50%", top: "70%" }} 
            isActive={activeId === projects[1].id}
            onClick={() => setActiveId(projects[1].id)}
          />

          {/* Chip 3 */}
          <Microchip 
            project={projects[2]} 
            position={{ left: "80%", top: "30%" }} 
            isActive={activeId === projects[2].id}
            onClick={() => setActiveId(projects[2].id)}
          />

          {/* Massive Expanding Tooltip (Data Core) */}
          <AnimatePresence>
            {activeProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                onClick={() => setActiveId(null)} // Click outside to close
              >
                <div 
                  className={`relative w-full max-w-4xl bg-[#0a0f1a]/95 border border-white/20 p-8 md:p-12 shadow-2xl rounded-sm ${colorMap[activeProject.color as keyof typeof colorMap].shadow}`}
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${colorMap[activeProject.color as keyof typeof colorMap].bg}`} />
                  
                  {/* Close button */}
                  <button 
                    onClick={() => setActiveId(null)}
                    className="absolute top-4 right-4 font-mono text-[10px] text-white/50 hover:text-white uppercase tracking-widest"
                  >
                    [ Close ]
                  </button>

                  <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    
                    {/* Data Pane */}
                    <div className="flex-1">
                      <div className={`mb-2 font-mono text-[10px] tracking-[0.3em] uppercase ${colorMap[activeProject.color as keyof typeof colorMap].text}`}>
                        {activeProject.label}
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-6">
                        {activeProject.name}
                      </h3>
                      
                      <p className="text-sm md:text-base text-white/70 leading-relaxed mb-8">
                        {activeProject.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {activeProject.stack.map(s => (
                          <span key={s} className="border border-white/10 bg-white/[0.05] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-6 font-mono text-[11px] uppercase tracking-widest mt-auto">
                        <a href={activeProject.live} target="_blank" rel="noopener noreferrer" className={`transition-colors hover:text-white ${colorMap[activeProject.color as keyof typeof colorMap].text}`}>
                          Execute Live ↗
                        </a>
                        <a href={activeProject.code} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                          Source Code ↗
                        </a>
                      </div>
                    </div>

                    {/* Hardware Schema Diagram */}
                    <div className="w-full md:w-1/3 border border-white/10 bg-[#050505] p-6 flex flex-col justify-between font-mono">
                      <div>
                        <div className="text-[9px] text-white/40 tracking-[0.3em] uppercase border-b border-white/10 pb-2 mb-4">
                          Hardware Specs
                        </div>
                        <div className="text-xs text-white/60 space-y-3">
                          <div className="flex justify-between"><span>CPU_ID</span> <span className="text-white">{activeProject.cpu}</span></div>
                          <div className="flex justify-between"><span>TYPE</span> <span className="text-white">{activeProject.type}</span></div>
                          <div className="flex justify-between"><span>STATUS</span> <span className="text-green-400">ONLINE</span></div>
                          <div className="flex justify-between"><span>MEM</span> <span className="text-white">OPTIMIZED</span></div>
                        </div>
                      </div>

                      {/* Cool animated diagram */}
                      <div className="mt-8 relative h-24 border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:10px_10px]">
                        <motion.div 
                          className={`absolute top-1/2 left-1/4 h-8 w-8 -translate-y-1/2 ${colorMap[activeProject.color as keyof typeof colorMap].bg} opacity-20 blur-md`}
                          animate={{ opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className={`absolute top-1/2 left-1/4 h-2 w-2 -translate-y-1/2 ${colorMap[activeProject.color as keyof typeof colorMap].bg}`} />
                        <div className={`absolute top-1/2 left-1/4 w-1/2 h-px -translate-y-1/2 ${colorMap[activeProject.color as keyof typeof colorMap].bg} opacity-50`} />
                        <div className={`absolute top-1/2 right-1/4 h-4 w-4 -translate-y-1/2 border border-white/40`} />
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}

function Microchip({ 
  project, 
  position, 
  isActive, 
  onClick 
}: { 
  project: typeof projects[0], 
  position: { left: string, top: string },
  isActive: boolean,
  onClick: () => void
}) {
  const styles = colorMap[project.color as keyof typeof colorMap];

  // Generate little pins for the microchip
  const pins = Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className={`w-1.5 h-3 ${isActive ? styles.bg : 'bg-white/20'} transition-colors duration-500`} />
  ));

  return (
    <div 
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
      style={position}
    >
      {/* Glow aura */}
      <div className={`absolute inset-0 ${styles.bg} blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
      {isActive && <div className={`absolute inset-0 ${styles.bg} blur-2xl opacity-50`} />}

      {/* Pins Top */}
      <div className="absolute -top-2 left-4 right-4 flex justify-between z-0">
        {pins}
      </div>
      {/* Pins Bottom */}
      <div className="absolute -bottom-2 left-4 right-4 flex justify-between z-0">
        {pins}
      </div>

      {/* The Chip Body */}
      <div className={`relative w-32 h-24 md:w-40 md:h-28 bg-[#0a0f1a] border-2 transition-colors duration-300 ${isActive ? styles.border : 'border-white/20 group-hover:border-white/40'} flex flex-col items-center justify-center shadow-2xl z-10`}>
        {/* Core indentation */}
        <div className={`absolute inset-2 bg-[#050505] border transition-colors duration-300 flex items-center justify-center ${isActive ? styles.border : 'border-white/5 group-hover:border-white/10'}`}>
          <div className="text-center">
            <div className={`font-mono text-[8px] uppercase tracking-widest transition-colors duration-300 ${isActive ? styles.text : 'text-white/30'}`}>
              {project.cpu}
            </div>
            <div className={`font-mono text-xs md:text-sm font-bold uppercase tracking-tight transition-colors duration-300 mt-1 ${isActive ? 'text-white' : 'text-white/70'}`}>
              {project.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
