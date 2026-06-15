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

const accentClassesMap: Record<string, { ring: string; text: string; bg: string }> = {
  cyan: { ring: "border-cyan-400/40", text: "text-cyan-300", bg: "bg-cyan-400" },
  emerald: { ring: "border-emerald-400/40", text: "text-emerald-300", bg: "bg-emerald-400" },
  fuchsia: { ring: "border-fuchsia-400/40", text: "text-fuchsia-300", bg: "bg-fuchsia-400" },
  indigo: { ring: "border-indigo-400/40", text: "text-indigo-300", bg: "bg-indigo-400" },
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

const accentClasses: Record<string, string> = {
  cyan: "border-cyan-200/25 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)]",
  emerald: "border-emerald-200/25 text-emerald-100 shadow-[0_0_28px_rgba(110,231,183,0.16)]",
  indigo: "border-indigo-200/25 text-indigo-100 shadow-[0_0_28px_rgba(129,140,248,0.16)]",
  fuchsia: "border-fuchsia-200/25 text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,0.16)]",
};

export default function Skills() {
  return (
    <>
      <TechStackSection />
      <ExperienceSection />
      <AchievementsSection />
    </>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#070b14] px-6 py-24 text-white" id={id}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.052)_1px,_transparent_1px)] [background-size:30px_30px] opacity-25" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 max-w-3xl">
          <span className="font-mono text-sm font-medium tracking-[0.35em] text-cyan-200/80">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">{title}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">{intro}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function TechStackSection() {
  const reduceMotion = useReducedMotion();
  const [activeNode, setActiveNode] = React.useState<string | null>(null);

  return (
    <section id="tech-stack" className="relative overflow-hidden bg-[#070b14] px-6 py-16 md:py-20 text-white min-h-[70vh] flex flex-col justify-center">
      {/* Vibe-coded heading */}
      <div className="relative mx-auto max-w-5xl mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-400/80">
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

      <div className="relative mx-auto h-auto min-h-[500px] md:h-[600px] py-16 md:py-0 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#050810] shadow-[0_24px_80px_rgba(0,0,0,0.4)] flex flex-wrap content-center justify-center gap-6 md:block">
        
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
          <span>//</span>
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
  const reduceMotion = useReducedMotion();
  const [activeShard, setActiveShard] = React.useState<DataShard | null>(null);

  return (
    <section id="experience" className="relative overflow-hidden bg-[#070b14] px-6 py-16 md:py-20 text-white min-h-[80vh] flex flex-col justify-center">
      {/* Dossier Header */}
      <div className="relative mx-auto max-w-6xl mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6 z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-2 w-2 rounded-sm bg-indigo-400" />
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-indigo-400/80">
              Professional
            </span>
          </div>
          <h2 className="font-mono text-3xl font-light tracking-tight text-white md:text-5xl uppercase">
            <span className="text-white/40">Exp</span>erience
          </h2>
        </div>
        <div className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-widest text-white/40 md:text-right">
          <p>Accessing historical modules...</p>
          <p>Hover to expand records.</p>
        </div>
      </div>

      <div className="relative mx-auto h-[70vh] min-h-[500px] max-h-[800px] w-full max-w-6xl overflow-hidden flex flex-col justify-center gap-3 md:gap-4 z-10">
        
        {dataShards.map((shard, i) => {
          const isActive = activeShard?.id === shard.id;
          
          return (
            <motion.div
              key={shard.id}
              className={`relative cursor-pointer h-12 md:h-16 rounded border transition-all duration-300 ${isActive ? 'bg-white/[0.08] border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]' : 'bg-[#0a0f1a] border-white/10 hover:border-white/20 hover:bg-[#111827]'} ${shard.width}`}
              style={{ alignSelf: shard.align }}
              onMouseEnter={() => setActiveShard(shard)}
              onMouseLeave={() => setActiveShard(null)}
              onClick={() => setActiveShard(shard)}
              initial={reduceMotion ? false : { opacity: 0, x: shard.align === 'flex-start' ? -20 : shard.align === 'flex-end' ? 20 : 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${isActive ? accentClassesMap[shard.color].bg : 'bg-white/20'}`} />
                  <span className={`font-mono text-xs md:text-sm tracking-widest transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {shard.org}
                  </span>
                </div>
                <div className={`hidden md:block font-mono text-[10px] transition-colors duration-300 ${isActive ? accentClassesMap[shard.color].text : 'text-white/30'}`}>
                  {shard.tag}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Hover Modal Overlay */}
        <AnimatePresence>
          {activeShard && (
            <motion.div
              key="mission-log"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="pointer-events-none absolute bottom-6 left-6 right-6 md:left-auto md:right-8 md:top-8 md:bottom-auto md:w-[350px] rounded-xl border border-white/10 bg-[#070b14]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-20"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${accentClassesMap[activeShard.color].text}`}>
                  {activeShard.org}
                </span>
                <span className={`flex h-1.5 w-1.5 rounded-full ${accentClassesMap[activeShard.color].bg}`} />
              </div>
              <h4 className="text-base font-semibold text-white">
                {activeShard.title}
              </h4>
              <p className="mt-4 font-mono text-xs leading-relaxed text-white/60">
                {activeShard.signal}
              </p>
              <div className={`mt-6 rounded border px-4 py-3 text-xs leading-5 bg-white/[0.03] ${accentClassesMap[activeShard.color].text} ${accentClassesMap[activeShard.color].ring}`}>
                {activeShard.impact}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Background Grid (Minimalist) */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.03)_1px,_transparent_1px),_linear-gradient(to_bottom,_rgba(255,255,255,0.03)_1px,_transparent_1px)] [background-size:60px_60px]" />
      </div>
    </section>
  );
}

function AchievementsSection() {
  const [activeRecord, setActiveRecord] = React.useState<string | null>(null);

  return (
    <section id="achievements" className="relative overflow-hidden bg-[#050505] px-6 py-16 md:py-20 text-white min-h-[60vh] flex flex-col justify-center">
      {/* Vault Header */}
      <div className="relative mx-auto max-w-6xl mb-12 flex flex-col items-center text-center z-10">
        <div className="flex items-center gap-3 mb-4 border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-yellow-500/90">
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
      <div className="relative mx-auto h-[65vh] min-h-[500px] max-h-[700px] w-full max-w-5xl rounded-lg border border-white/5 bg-[#0a0a0a] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">
        
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
