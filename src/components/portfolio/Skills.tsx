"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import TextScramble from "./TextScramble";
import SolarSystem3D from "./SolarSystem3D";

type NavigationNode = {
  id: string;
  name: string;
  icon: string;
  sys: string;
  accent: string;
  coords: { deskX: number; deskY: number; mobX: number; mobY: number };
};

const navigationNodes: NavigationNode[] = [
  { id: "react", name: "REACT", icon: "react", sys: "FRNT-END", accent: "cyan", coords: { deskX: 25, deskY: 15, mobX: 20, mobY: 5 } },
  { id: "next", name: "NEXT.JS", icon: "nextdotjs", sys: "FRNT-END", accent: "cyan", coords: { deskX: 12, deskY: 35, mobX: 65, mobY: 12 } },
  { id: "ts", name: "TYPESCRIPT", icon: "typescript", sys: "FRNT-END", accent: "cyan", coords: { deskX: 45, deskY: 22, mobX: 30, mobY: 18 } },
  { id: "js", name: "JAVASCRIPT", icon: "javascript", sys: "FRNT-END", accent: "cyan", coords: { deskX: 65, deskY: 28, mobX: 75, mobY: 25 } },
  { id: "tw", name: "TAILWIND", icon: "tailwindcss", sys: "FRNT-END", accent: "cyan", coords: { deskX: 32, deskY: 48, mobX: 15, mobY: 32 } },
  
  { id: "py", name: "PYTHON", icon: "python", sys: "BCK-END", accent: "emerald", coords: { deskX: 20, deskY: 65, mobX: 55, mobY: 39 } },
  { id: "flask", name: "FLASK", icon: "flask", sys: "BCK-END", accent: "emerald", coords: { deskX: 8, deskY: 82, mobX: 10, mobY: 46 } },
  { id: "node", name: "NODE.JS", icon: "nodedotjs", sys: "BCK-END", accent: "emerald", coords: { deskX: 42, deskY: 68, mobX: 65, mobY: 53 } },
  { id: "rest", name: "REST-API", icon: "fastapi", sys: "BCK-END", accent: "emerald", coords: { deskX: 30, deskY: 85, mobX: 25, mobY: 60 } },
  
  { id: "opencv", name: "OPENCV", icon: "opencv", sys: "VIS-SYS", accent: "fuchsia", coords: { deskX: 62, deskY: 60, mobX: 70, mobY: 67 } },
  { id: "media", name: "MEDIAPIPE", icon: "google", sys: "VIS-SYS", accent: "fuchsia", coords: { deskX: 80, deskY: 70, mobX: 20, mobY: 74 } },
  
  { id: "git", name: "GIT", icon: "git", sys: "OP-TOOLS", accent: "indigo", coords: { deskX: 55, deskY: 88, mobX: 60, mobY: 81 } },
  { id: "github", name: "GITHUB", icon: "github", sys: "OP-TOOLS", accent: "indigo", coords: { deskX: 72, deskY: 85, mobX: 25, mobY: 88 } },
  { id: "postman", name: "POSTMAN", icon: "postman", sys: "OP-TOOLS", accent: "indigo", coords: { deskX: 88, deskY: 45, mobX: 75, mobY: 94 } },
  { id: "sql", name: "SQL", icon: "postgresql", sys: "OP-TOOLS", accent: "indigo", coords: { deskX: 85, deskY: 20, mobX: 45, mobY: 98 } },
];

const accentClassesMap: Record<string, { ring: string; text: string; bg: string; border: string; glowBorder: string }> = {
  cyan: { ring: "border-cyan-400/40", text: "text-cyan-300", bg: "bg-cyan-400", border: "border-cyan-400", glowBorder: "border-cyan-500/50" },
  emerald: { ring: "border-emerald-400/40", text: "text-emerald-300", bg: "bg-emerald-400", border: "border-emerald-400", glowBorder: "border-emerald-500/50" },
  fuchsia: { ring: "border-fuchsia-400/40", text: "text-fuchsia-300", bg: "bg-fuchsia-400", border: "border-fuchsia-400", glowBorder: "border-fuchsia-500/50" },
  indigo: { ring: "border-indigo-400/40", text: "text-indigo-300", bg: "bg-indigo-400", border: "border-indigo-400", glowBorder: "border-indigo-500/50" },
};

type DataShard = {
  id: string;
  org: string;
  title: string;
  tag: string;
  signal: string;
  impact: string;
  width: string;
  align: "flex-start" | "flex-end" | "center";
  color: string;
};

const dataShards: DataShard[] = [
  { id: "algo", org: "algoacquisition", title: "Sales Development Representative", tag: "AI & B2B OUTBOUND", signal: "Building AI systems that agentically scrape the live web for buying signals (hiring velocity, job posts, expansion), map decision makers, and launch hyper-personalized outreach.", impact: "Achieved 3-4x response rates, generating predictable B2B sales pipelines.", width: "w-[85%] md:w-[65%]", align: "flex-end", color: "cyan" },
  { id: "w2h", org: "Work2Hire", title: "Campus Ambassador Program Manager Lead", tag: "LEADERSHIP", signal: "Driving student community engagement and scaling the Campus Ambassador Program across colleges & universities.", impact: "Recruited & managed ambassadors across diverse institutions, run outreach campaigns & webinars.", width: "w-[80%] md:w-[55%]", align: "flex-start", color: "emerald" },
  { id: "ssoc", org: "Social Summer of Code '26", title: "Open Source Project Admin", tag: "OPEN SOURCE", signal: "Project Admin for SSOC '26. Leading projects, reviewing pull requests, and mentoring multi-developer teams.", impact: "Guiding new open source developers from first issue to production code.", width: "w-[75%] md:w-[50%]", align: "flex-end", color: "fuchsia" },
  { id: "bob", org: "Self Taught Bob", title: "Content Creator & Mentor (YouTube)", tag: "MENTORSHIP", signal: "Sharing self-taught coding journey from 0, producing developer guides, roadmaps, and 1-on-1 mentorship.", impact: "Helped student developers build projects and navigate software paths.", width: "w-[65%] md:w-[45%]", align: "flex-start", color: "indigo" },
  { id: "cdn", org: "CDN IGNOU", title: "Founder & Technical Lead", tag: "COMMUNITY", signal: "Founded and lead CDN IGNOU community. Organizing tech events, workshops, and hackathons via Commudle.", impact: "Created a collaborative learning ecosystem for IGNOU tech students.", width: "w-[85%] md:w-[60%]", align: "center", color: "cyan" },
  { id: "apertre", org: "Apertre 3.0", title: "Open Source Developer (Top 25)", tag: "CONTRIBUTOR", signal: "Contributed to open-source codebases during Apertre 3.0 mentorship, resolving issues and building features.", impact: "Ranked in Top 25 contributors nationwide.", width: "w-[70%] md:w-[50%]", align: "flex-end", color: "emerald" },
  { id: "gfg", org: "GeeksforGeeks", title: "Campus Ambassador", tag: "CAMPUS", signal: "Represented GeeksforGeeks on campus, connecting students with programming challenges and resources.", impact: "Expanded coding awareness and technical event participation.", width: "w-[70%] md:w-[50%]", align: "flex-start", color: "indigo" },
  { id: "osc", org: "Open Source Connect", title: "Host & Management Lead", tag: "EVENTS", signal: "Hosted online meetups, delivered tech talks, and facilitated developer networking sessions.", impact: "Streamlined event flow and speaker logistics for high community engagement.", width: "w-[60%] md:w-[40%]", align: "flex-start", color: "fuchsia" }
];

type RecoveredRecord = {
  id: string;
  title: string;
  detail: string;
  dateStr: string;
  classification: string;
  position: { top: string; left: string; rotate: number; zIndex: number };
};

const recoveredRecords: RecoveredRecord[] = [
  {
    id: "rec-01",
    title: "Hackathon Winner: AutoBotX",
    detail: "Placed 2nd in National IoT Hackathon with AutoBotX. Blended hardware sensors with a Python orchestration backend.",
    dateStr: "AWARD-2026",
    classification: "WINNER",
    position: { top: "12%", left: "8%", rotate: -6, zIndex: 1 }
  },
  {
    id: "rec-02",
    title: "Open Source Connect Global 2026",
    detail: "Official Certificate of Participation awarded for contributions and leadership in Open Source Connect Global 2026.",
    dateStr: "CERT-2026",
    classification: "CERTIFIED",
    position: { top: "42%", left: "22%", rotate: 8, zIndex: 2 }
  },
  {
    id: "rec-03",
    title: "Top 25 Apertre 3.0 Contributor",
    detail: "Recognized among Top 25 national contributors in Apertre 3.0 open source mentorship program.",
    dateStr: "HONOR-2026",
    classification: "TOP 25",
    position: { top: "22%", left: "52%", rotate: -4, zIndex: 3 }
  },
  {
    id: "rec-04",
    title: "Angular Meets Generative AI",
    detail: "Certified in 'Beyond the Browser: Angular Meets Generative AI' - exploring AI integration with modern web architecture.",
    dateStr: "CERT-2026",
    classification: "GEN-AI",
    position: { top: "58%", left: "62%", rotate: 10, zIndex: 4 }
  },
  {
    id: "rec-05",
    title: "Office Automation Certificate",
    detail: "Certificate of Participation in Pre-Assessment round of Open Source Hackathon & Office Automation.",
    dateStr: "CERT-2026",
    classification: "AUTOMATION",
    position: { top: "72%", left: "14%", rotate: -8, zIndex: 5 }
  },
];

export default function Skills() {
  return (
    <>
      <TechStackSection />
      <ExperienceSection />
      <AchievementsSection />
    </>
  );
}

function TechStackSection() {
  const reduceMotion = useReducedMotion();
  const [activeNode, setActiveNode] = React.useState<string | null>(null);

  return (
    <section id="tech-stack" className="relative overflow-hidden bg-[#070b14] px-6 pt-32 pb-16 text-white flex flex-col justify-center">
      {/* Vibe-coded heading */}
      <div className="relative mx-auto max-w-4xl mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-400/80">
              Architecture
            </span>
          </div>
          <h2 className="font-mono text-3xl font-light tracking-tight text-white md:text-5xl uppercase">
            <TextScramble text="TECH STACK" />
          </h2>
        </div>
        <div className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-widest text-white/40 md:text-right">
          <p>Scanning local environment...</p>
          <p>Identifying active frameworks.</p>
          <p className="text-cyan-400/60 mt-1">STATUS: OPERATIONAL</p>
        </div>
      </div>

      <div className="relative mx-auto h-auto min-h-[480px] py-12 md:py-0 w-full max-w-4xl rounded-[2rem] border border-white/10 bg-[#050810] shadow-[0_24px_80px_rgba(0,0,0,0.4)] flex flex-wrap content-center justify-center gap-6 md:block">
        
        {/* Radar Background */}
        <div className="pointer-events-none absolute inset-0 opacity-40 overflow-hidden rounded-[2rem]">
          <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 bg-[radial-gradient(circle_at_center,_transparent_60%,_rgba(255,255,255,0.02)_100%)]" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
          <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Constellation Lines */}
        <svg className="hidden md:block pointer-events-none absolute inset-0 h-full w-full opacity-60">
          {/* Frontend Cluster */}
          <motion.path className="hidden md:block" stroke="rgba(34, 211, 238, 0.2)" d="M 25% 15% L 12% 35% L 32% 48% L 45% 22% L 65% 28% Z" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
          <motion.path className="md:hidden" stroke="rgba(34, 211, 238, 0.2)" d="M 20% 5% L 65% 12% L 30% 18% L 75% 25% L 15% 32%" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
          {/* Backend Cluster */}
          <motion.path className="hidden md:block" stroke="rgba(52, 211, 153, 0.2)" d="M 20% 65% L 8% 82% L 30% 85% L 42% 68% Z" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
          <motion.path className="md:hidden" stroke="rgba(52, 211, 153, 0.2)" d="M 55% 39% L 10% 46% L 65% 53% L 25% 60%" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
          {/* AI Cluster */}
          <motion.path className="hidden md:block" stroke="rgba(217, 70, 239, 0.2)" d="M 62% 60% L 80% 70%" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
          <motion.path className="md:hidden" stroke="rgba(217, 70, 239, 0.2)" d="M 70% 67% L 20% 74%" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
          {/* Tools Cluster */}
          <motion.path className="hidden md:block" stroke="rgba(129, 140, 248, 0.2)" d="M 55% 88% L 72% 85% L 88% 45% L 85% 20%" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
          <motion.path className="md:hidden" stroke="rgba(129, 140, 248, 0.2)" d="M 60% 81% L 25% 88% L 75% 94% L 45% 98%" fill="none" strokeWidth="1.5" strokeDasharray="4 4" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} transition={{ duration: 2 }} />
        </svg>

        {navigationNodes.map((node, i) => {
          const isActive = activeNode === node.id;
          return (
            <div
              key={node.id}
              className={`relative md:absolute group cursor-default z-30 tech-node-${node.id}`}
              style={{
                ...(typeof window !== 'undefined' && window.innerWidth >= 768 ? { transform: "translate(-50%, -50%)" } : {}),
                "--desk-x": `${node.coords.deskX}%`,
                "--desk-y": `${node.coords.deskY}%`,
              } as React.CSSProperties}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <style jsx>{`
                @media (min-width: 768px) { .tech-node-${node.id} { left: var(--desk-x); top: var(--desk-y); transform: translate(-50%, -50%); } }
              `}</style>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <motion.div
                  className="relative flex flex-col items-center justify-center"
                  animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* System tag (hidden until hover) */}
                  <div className={`absolute -top-7 whitespace-nowrap rounded bg-[#070b14] px-2 py-0.5 font-mono text-[9px] font-bold border z-40 transition-all duration-200 pointer-events-none ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} ${accentClassesMap[node.accent].text} ${accentClassesMap[node.accent].ring}`}>
                    [{node.sys}]
                  </div>

                  {/* Tech Icon Container */}
                  <div className={`relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/10 bg-[#070b14]/95 backdrop-blur-md transition-all duration-300 ${isActive ? 'scale-110 shadow-[0_0_25px_rgba(255,255,255,0.15)] ' + accentClassesMap[node.accent].ring : 'hover:border-white/40'}`}>
                    {isActive && (
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-25 ${accentClassesMap[node.accent].bg}`} />
                    )}
                    <div className={`absolute inset-0 rounded-full border ${accentClassesMap[node.accent].ring} ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={node.name}
                      className={`h-5 w-5 md:h-6 md:w-6 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                      src={`https://cdn.simpleicons.org/${node.icon}/ffffff`}
                    />
                  </div>

                  {/* Name & Coordinate Label Container (Stacked neatly below) */}
                  <div className="mt-1.5 flex flex-col items-center gap-0.5">
                    <div className={`font-mono text-[10px] tracking-[0.15em] font-bold transition-all duration-300 px-2 py-0.5 rounded backdrop-blur-md bg-[#070b14]/90 border ${isActive ? 'text-white border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.1)]' : 'text-white/50 border-transparent group-hover:text-white/80'}`}>
                      {node.name}
                    </div>
                    <div className={`font-mono text-[8px] tracking-widest transition-colors duration-300 ${isActive ? accentClassesMap[node.accent].text : 'text-white/30'}`}>
                      LAT:{node.coords.deskX}.{node.coords.deskY}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}

        {/* Scan Line Animation */}
        <motion.div
          className="pointer-events-none absolute inset-0 origin-center bg-[conic-gradient(from_0deg,_transparent_70%,_rgba(255,255,255,0.03)_100%)] mix-blend-screen"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Decorative Radar Overlays */}
        <div className="absolute bottom-4 right-4 flex gap-2 font-mono text-[10px] text-white/20">
          <span>SYS.ON</span>
          <span>{"//"}</span>
          <span>RADAR.TRK</span>
        </div>
        <div className="absolute top-4 left-4 font-mono text-[10px] text-white/20">
          SEC-7 ALPHA
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const activeShard = dataShards.find(s => s.id === activeId);

  return (
    <section id="experience" className="relative overflow-hidden px-6 pt-32 pb-16 text-white flex flex-col justify-center">
      {/* Background Ambience: None */}

      <div className="relative mx-auto w-full max-w-5xl z-10">
        <div className="mb-12 md:mb-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4 border border-white/10 px-4 py-1.5 rounded-full bg-white/[0.02] backdrop-blur-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-300">
              3D Orbital Galaxy // Experience
            </span>
          </div>
          <h2 className="font-mono text-3xl font-light tracking-widest text-white md:text-5xl uppercase">
            <TextScramble text="EXPERIENCE" />
          </h2>
          <p className="mt-4 font-mono text-xs text-white/50 tracking-widest uppercase">
            [ Drag to rotate 3D view • Scroll to zoom • Select stellar node for transmission ]
          </p>
        </div>

        {/* 3D Solar System Viewport */}
        <SolarSystem3D
          shards={dataShards}
          activeId={activeId}
          onSelectShard={(id) => setActiveId(id)}
        />

        {/* Data HUD Overlay (Rendered outside overflow-hidden) */}
        <AnimatePresence mode="wait">
          {activeShard && (
            <motion.div
              key={activeShard.id}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6"
              onClick={() => setActiveId(null)}
            >
              {/* Blur backdrop for the HUD specifically */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-none" />
              
              <div 
                className="relative w-full max-w-lg max-h-[85dvh] flex flex-col pointer-events-auto shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Holographic Frame Base */}
                <div className={`absolute inset-0 rounded-[1.5rem] bg-[#050810]/95 backdrop-blur-2xl border border-white/20 overflow-hidden`}>
                  <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-b from-transparent to-current ${accentClassesMap[activeShard.color].text}`} />
                </div>
                
                {/* Minimalist Accents */}
                <div className={`absolute top-0 left-8 w-16 h-[2px] ${accentClassesMap[activeShard.color].bg}`} />
                <div className={`absolute bottom-0 right-8 w-16 h-[2px] ${accentClassesMap[activeShard.color].bg}`} />

                {/* Fixed Close Button */}
                <button onClick={() => setActiveId(null)} className="absolute top-5 right-5 z-20 font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer">
                  [ CLOSE ]
                </button>

                {/* Scrollable Content Area */}
                <div className="relative p-8 pt-12 md:p-10 z-10 overflow-y-auto flex-1 custom-scrollbar min-h-0">
                  
                  <div className={`mb-6 flex items-center gap-3`}>
                    <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${accentClassesMap[activeShard.color].bg}`} />
                    <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${accentClassesMap[activeShard.color].text}`}>
                      Holographic Record
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-light uppercase tracking-tighter text-white mb-2">
                    {activeShard.org}
                  </h3>
                  
                  <div className="font-mono text-xs text-white/40 mb-8 pb-6 border-b border-white/10 relative">
                    {activeShard.title}
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">Transmission Log</div>
                      <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                        {activeShard.signal}
                      </p>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">Planetary Impact</div>
                      <div className={`text-sm md:text-base font-light leading-relaxed pl-4 border-l-2 ${accentClassesMap[activeShard.color].border} ${accentClassesMap[activeShard.color].text}`}>
                        {activeShard.impact}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

function AchievementsSection() {
  const [activeRecord, setActiveRecord] = React.useState<string | null>(null);

  return (
    <section id="achievements" className="relative overflow-hidden bg-[#050505] px-6 pt-32 pb-16 text-white flex flex-col justify-center">
      {/* Vault Header */}
      <div className="relative mx-auto max-w-6xl mb-6 md:mb-8 flex flex-col items-center text-center z-10">
        <div className="flex items-center gap-3 mb-4 border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow-500/90">
            Milestones
          </span>
        </div>
        <h2 className="font-mono text-3xl font-light tracking-widest text-white md:text-5xl uppercase">
          Achieve<span className="text-white/30">ments</span>
        </h2>
        <p className="mt-4 font-mono text-xs text-white/40 tracking-widest uppercase">
          [ Select file to decrypt contents ]
        </p>
      </div>

      {/* The Vault Desk Viewport */}
      <div className="relative mx-auto h-[400px] w-full max-w-4xl rounded-lg border border-white/5 bg-[#0a0a0a] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
        
        {/* Subtle grid on the desk */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_1px,_transparent_1px)] [background-size:20px_20px]" />
        </div>

        {/* The Scattered Files */}
        <AnimatePresence>
          {recoveredRecords.map((record) => {
            const isActive = activeRecord === record.id;
            const isDimmed = activeRecord !== null && !isActive;

            return (
              <motion.div
                key={record.id}
                onClick={() => setActiveRecord(isActive ? null : record.id)}
                layout
                initial={{ 
                  top: record.position.top, 
                  left: record.position.left, 
                  rotate: record.position.rotate,
                  opacity: 0,
                  scale: 0.8
                }}
                animate={{
                  top: isActive ? "50%" : record.position.top,
                  left: isActive ? "50%" : record.position.left,
                  x: isActive ? "-50%" : "0%",
                  y: isActive ? "-50%" : "0%",
                  rotate: isActive ? 0 : record.position.rotate,
                  scale: isActive ? 1.05 : 1,
                  opacity: isDimmed ? 0.2 : 1,
                  filter: isDimmed ? "blur(4px)" : "blur(0px)",
                  zIndex: isActive ? 50 : record.position.zIndex
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`absolute cursor-pointer border border-white/20 bg-[#121212] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors hover:border-white/50 ${isActive ? 'w-[90%] max-w-[450px] md:w-[450px]' : 'w-[200px] md:w-[280px]'}`}
              >
                {/* File Tab */}
                <div className="absolute -top-6 left-[-1px] bg-[#121212] border-t border-l border-r border-white/20 px-3 py-1 font-mono text-[9px] text-white/50 tracking-widest uppercase">
                  {record.id}
                </div>

                {/* File Header */}
                <div className="border-b border-white/10 pb-3 mb-4 flex justify-between items-start">
                  <div>
                    <div className="font-mono text-[8px] text-yellow-500/70 mb-1">{record.classification}</div>
                    <div className="font-mono text-[10px] text-white/40">{record.dateStr}</div>
                  </div>
                  <div className="h-6 w-6 border border-white/10 flex items-center justify-center">
                    <span className="block h-2 w-2 bg-white/20" />
                  </div>
                </div>

                {/* File Title */}
                <h3 className={`font-mono text-sm md:text-base font-bold uppercase tracking-tight text-white mb-4 ${isActive ? '' : 'line-clamp-2'}`}>
                  {record.title}
                </h3>

                {/* File Content / Redaction */}
                <div className="relative font-mono text-xs leading-relaxed text-white/70 bg-white/[0.02] p-3 border border-white/5 min-h-[80px]">
                  <p className={`${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-200`}>
                    {record.detail}
                  </p>
                  
                  {/* Redaction Blocks that slide away */}
                  {!isActive && (
                    <div className="absolute inset-0 flex flex-col gap-2 p-3 pointer-events-none">
                      <div className="h-3 w-3/4 bg-black/80" />
                      <div className="h-3 w-full bg-black/80" />
                      <div className="h-3 w-1/2 bg-black/80" />
                    </div>
                  )}
                </div>

                {/* Close instruction when active */}
                {isActive && (
                  <div className="mt-6 text-center border-t border-white/10 pt-4 font-mono text-[9px] text-white/30 uppercase tracking-widest">
                    [ CLICK TO CLOSE ]
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
