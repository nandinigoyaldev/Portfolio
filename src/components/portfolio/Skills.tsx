"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

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
  { id: "cdn", org: "CDN IGNOU", title: "Founder & Technical Lead", tag: "COMMUNITY", signal: "Started and shaped a student community around support, technical learning, and shared opportunity.", impact: "Built spaces where IGNOU learners can ask, build, and grow together.", width: "w-[85%] md:w-[60%]", align: "center", color: "cyan" },
  { id: "ssoc", org: "SSOC / GSSOC / Apertre", title: "Open Source Project Admin", tag: "OPEN SOURCE", signal: "Helped contributors find direction, understand projects, and move from confusion to contribution.", impact: "Project guidance, contribution reviews, and community support.", width: "w-[75%] md:w-[50%]", align: "flex-start", color: "emerald" },
  { id: "bob", org: "Self Taught Bob", title: "Content Creator & Mentor", tag: "MENTORSHIP", signal: "Turned self-learning into public notes, guidance, and beginner-friendly technical content.", impact: "Mentoring through practical explanations and visible learning.", width: "w-[65%] md:w-[45%]", align: "flex-end", color: "fuchsia" },
  { id: "gfg", org: "GeeksforGeeks", title: "Campus Ambassador", tag: "CAMPUS", signal: "Connected students with coding culture, learning resources, and technical events.", impact: "Helped learning feel more reachable on campus.", width: "w-[70%] md:w-[50%]", align: "flex-start", color: "indigo" },
  { id: "w2h", org: "Work2Hire", title: "Program Manager Lead", tag: "LEADERSHIP", signal: "Managed student ambassador workflows, coordination, and outreach systems.", impact: "Led people, deadlines, and communication loops.", width: "w-[80%] md:w-[55%]", align: "flex-end", color: "emerald" },
  { id: "osc", org: "Open Source Connect", title: "Host & Management Lead", tag: "EVENTS", signal: "Hosted and managed sessions where developers, students, and contributors could meet and learn.", impact: "Event flow, speaker coordination, and community energy.", width: "w-[60%] md:w-[40%]", align: "flex-start", color: "cyan" },
  { id: "algo", org: "AlgoAcquisition", title: "Sales Dev Representative", tag: "BUSINESS", signal: "Worked on outreach, conversations, qualification, and the human side of growth.", impact: "Sharper communication and practical business context.", width: "w-[85%] md:w-[65%]", align: "flex-end", color: "fuchsia" }
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
    title: "2nd Place IoT Hackathon",
    detail: "AutoBotX placed second, a hands-on build that blended hardware thinking with software execution. Recovered logs indicate high sensor integration.",
    dateStr: "REC-2023",
    classification: "LEVEL 2",
    position: { top: "15%", left: "10%", rotate: -6, zIndex: 1 }
  },
  {
    id: "rec-02",
    title: "Top 25 Apertre Contributor",
    detail: "Recognized among the top contributors in Apertre 3.0. Significant code contributions documented in open networks.",
    dateStr: "REC-2024",
    classification: "UNRESTRICTED",
    position: { top: "45%", left: "25%", rotate: 8, zIndex: 2 }
  },
  {
    id: "rec-03",
    title: "AutoAlign Recognition",
    detail: "AutoAlign received recognition on Commudle. System optimization logs have been fully recovered and cataloged.",
    dateStr: "REC-2024",
    classification: "LEVEL 1",
    position: { top: "25%", left: "55%", rotate: -4, zIndex: 3 }
  },
  {
    id: "rec-04",
    title: "Technical Event Organization",
    detail: "Organized hackathons, workshops, and HackDay-style sessions for student builders. Comm chatter verified high attendance.",
    dateStr: "REC-2023",
    classification: "PUBLIC",
    position: { top: "60%", left: "65%", rotate: 12, zIndex: 4 }
  },
  {
    id: "rec-05",
    title: "Open Source Contributions",
    detail: "Contributed across multiple projects while learning in public. Distributed network patches traced back to core ID.",
    dateStr: "REC-2022",
    classification: "UNRESTRICTED",
    position: { top: "75%", left: "15%", rotate: -10, zIndex: 5 }
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
            Tech <span className="text-white/40">Stack</span>
          </h2>
        </div>
        <div className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-widest text-white/40 md:text-right">
          <p>Scanning local environment...</p>
          <p>Identifying active frameworks.</p>
          <p className="text-cyan-400/60 mt-1">STATUS: OPERATIONAL</p>
        </div>
      </div>

      <div className="relative mx-auto h-auto min-h-[400px] py-12 md:py-0 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#050810] shadow-[0_24px_80px_rgba(0,0,0,0.4)] flex flex-wrap content-center justify-center gap-6 md:block">
        
        {/* Radar Background */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
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
              className={`relative md:absolute group cursor-default tech-node-${node.id}`}
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
                  className="relative flex flex-col items-center justify-center gap-1"
                  animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Tech Icon Container */}
                  <div className={`relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/10 bg-[#070b14]/90 backdrop-blur-md transition-all duration-300 ${isActive ? 'scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)] ' + accentClassesMap[node.accent].ring : 'hover:border-white/30'}`}>
                    {isActive && (
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-25 ${accentClassesMap[node.accent].bg}`} />
                    )}
                    <div className={`absolute inset-0 rounded-full border ${accentClassesMap[node.accent].ring} ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                    <img
                      alt={node.name}
                      className={`h-5 w-5 md:h-6 md:w-6 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                      src={`https://cdn.simpleicons.org/${node.icon}/ffffff`}
                    />
                    {/* System tag (hidden until hover) */}
                    <div className={`absolute -top-8 md:-top-10 whitespace-nowrap rounded bg-[#070b14]/95 px-1.5 py-0.5 font-mono text-[9px] font-bold border transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'} ${accentClassesMap[node.accent].text} ${accentClassesMap[node.accent].ring}`}>
                      [{node.sys}]
                    </div>
                    {/* Coordinate tag */}
                    <div className={`absolute -bottom-5 whitespace-nowrap font-mono text-[8px] tracking-widest transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                      LAT:{node.coords.deskX}.{node.coords.deskY}
                    </div>
                  </div>
                  {/* Name Label */}
                  <div className={`mt-2 font-mono text-[10px] tracking-[0.2em] font-bold transition-colors duration-300 px-2 py-0.5 rounded backdrop-blur-md bg-[#070b14]/80 border ${isActive ? 'text-white border-white/20' : 'text-white/40 border-transparent'}`}>
                    {node.name}
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
    <section id="experience" className="relative overflow-hidden bg-[#020408] px-6 pt-32 pb-16 text-white flex flex-col justify-center">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl z-10">
        <div className="mb-6 md:mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4 border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-fuchsia-400/90">
              Orbital Command
            </span>
          </div>
          <h2 className="font-mono text-3xl font-light tracking-widest text-white md:text-5xl uppercase">
            Exper<span className="text-white/30">ience</span>
          </h2>
          <p className="mt-4 font-mono text-xs text-white/40 tracking-widest uppercase">
            [ Select a planetary node to extract data ]
          </p>
        </div>

        {/* Full-width Galaxy Map */}
        <div className="relative h-[350px] lg:h-[400px] w-full max-w-4xl mx-auto bg-black rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 flex items-center justify-center">
          
          {/* Deep Space Background / Nebula */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:40px_40px] opacity-10" style={{ backgroundPosition: '0 0' }} />
             <div className="absolute inset-0 bg-[radial-gradient(white_2px,transparent_2px)] [background-size:100px_100px] opacity-20" style={{ backgroundPosition: '50px 50px' }} />
             
             {/* Glowing Nebulas */}
             <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-fuchsia-900/20 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2" />
             <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
             {/* Faint orbital tracks */}
             <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="0.05" fill="none" />
             <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.05" fill="none" />
             <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="0.05" fill="none" />
          </svg>

          {/* The Central Star / Sun */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full flex items-center justify-center z-10 pointer-events-none">
            <div className="absolute w-20 h-20 rounded-full bg-yellow-100/10 blur-[20px]" />
            <div className="absolute w-8 h-8 rounded-full bg-yellow-200 shadow-[0_0_60px_rgba(253,224,71,0.8)] animate-pulse" />
          </div>

          {/* Orbital Planets */}
          {dataShards.map((shard, index) => {
             const isActive = activeId === shard.id;
             const styles = accentClassesMap[shard.color];
             const angle = (index / dataShards.length) * 360;
             const radiusPercent = 35; // Responsive percentage radius
             const left = 50 + Math.cos(angle * (Math.PI / 180)) * radiusPercent;
             const top = 50 + Math.sin(angle * (Math.PI / 180)) * radiusPercent;
             
             return (
               <div key={shard.id} className="absolute z-20 group cursor-pointer" style={{ top: `${top}%`, left: `${left}%`, transform: `translate(-50%, -50%)` }} onClick={() => setActiveId(shard.id)}>
                  
                  {/* Planet body */}
                  <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg ${isActive ? styles.bg + ' shadow-[0_0_30px_currentColor] scale-110' : 'bg-[#0a0f1a] border border-white/20 group-hover:border-white/50 group-hover:scale-105'}`}>
                    
                    {/* Inner texture / glow */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                    
                    {isActive && (
                      <>
                        <div className="absolute inset-0 rounded-full animate-ping opacity-40 bg-current" />
                        {/* Orbital ring around the active planet */}
                        <div className={`absolute -inset-3 rounded-full border border-current opacity-50 animate-[spin_4s_linear_infinite]`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
                      </>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 flex flex-col items-center transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                     <span className={`font-mono text-[9px] md:text-[10px] tracking-widest uppercase whitespace-nowrap bg-[#020305]/80 px-2 py-0.5 rounded border ${isActive ? 'border-current ' + styles.text : 'border-transparent text-white/50'}`}>
                       {shard.org}
                     </span>
                  </div>

                  {/* Laser Beam to Center when active */}
                  {isActive && (
                    <svg className="absolute top-1/2 left-1/2 w-[800px] h-[800px] pointer-events-none overflow-visible -translate-x-1/2 -translate-y-1/2 -z-10">
                      <line x1="50%" y1="50%" x2={`${left}%`} y2={`${top}%`} stroke="currentColor" strokeWidth="2" className={styles.text} strokeDasharray="4 8" />
                      {/* Pulse effect traveling along the line */}
                      <circle cx={`${left}%`} cy={`${top}%`} r="3" fill="currentColor" className={styles.text}>
                        <animate attributeName="cx" values={`${left}%; 50%`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${top}%; 50%`} dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  )}
               </div>
             )
          })}

          {/* Data HUD Overlay (Centered) */}
          <AnimatePresence mode="wait">
            {activeShard && (
              <motion.div
                key={activeShard.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                onClick={() => setActiveId(null)}
              >
                {/* Blur backdrop for the HUD specifically */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-none" />
              
              <div 
                className="relative w-full max-w-lg max-h-[90vh] flex flex-col pointer-events-auto shadow-[0_0_80px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Holographic Frame Base */}
                <div className={`absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden`}>
                  {/* Subtle color wash matching the planet */}
                  <div className={`absolute inset-0 opacity-10 bg-gradient-to-b from-transparent to-current ${accentClassesMap[activeShard.color].text}`} />
                </div>
                
                {/* Sci-Fi Corners */}
                <div className={`absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-[3px] border-l-[3px] rounded-tl-[1.5rem] md:rounded-tl-[2rem] ${accentClassesMap[activeShard.color].border}`} />
                <div className={`absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-[3px] border-r-[3px] rounded-tr-[1.5rem] md:rounded-tr-[2rem] ${accentClassesMap[activeShard.color].border}`} />
                <div className={`absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b-[3px] border-l-[3px] rounded-bl-[1.5rem] md:rounded-bl-[2rem] ${accentClassesMap[activeShard.color].border}`} />
                <div className={`absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b-[3px] border-r-[3px] rounded-br-[1.5rem] md:rounded-br-[2rem] ${accentClassesMap[activeShard.color].border}`} />

                {/* Fixed Close Button */}
                <button onClick={() => setActiveId(null)} className="absolute top-4 right-4 md:top-6 md:right-8 z-20 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors bg-black/80 backdrop-blur rounded px-2 py-1 md:p-0 md:bg-transparent border border-white/10 md:border-transparent">
                  [ Close ]
                </button>

                {/* Scrollable Content Area */}
                <div className="relative p-6 md:p-12 z-10 overflow-y-auto flex-1 custom-scrollbar">
                  
                  <div className={`mb-4 flex items-center gap-3`}>
                    <div className={`h-2 w-2 rounded-full animate-pulse ${accentClassesMap[activeShard.color].bg}`} />
                    <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${accentClassesMap[activeShard.color].text}`}>
                      Holographic Record
                    </span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-light uppercase tracking-tighter text-white mb-2">
                    {activeShard.org}
                  </h3>
                  
                  <div className="font-mono text-xs text-white/50 mb-8 pb-6 border-b border-white/10 relative">
                    {activeShard.title}
                    <div className={`absolute bottom-[-1px] left-0 w-1/4 h-[1px] ${accentClassesMap[activeShard.color].bg}`} />
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">Transmission Log</div>
                      <p className="text-sm md:text-base text-white/80 leading-relaxed pl-4 border-l-2 border-white/10">
                        {activeShard.signal}
                      </p>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mb-3">Planetary Impact</div>
                      <div className={`text-xs md:text-sm font-mono p-5 rounded-xl bg-white/[0.02] border border-white/5 leading-relaxed ${accentClassesMap[activeShard.color].text} ${accentClassesMap[activeShard.color].glowBorder}`}>
                        &gt; {activeShard.impact}
                      </div>
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
