"use client";

import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";
import TextScramble from "./TextScramble";

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language: string;
  languages: string[];
  stars: number;
  forks: number;
  updated_at: string;
  fork?: boolean;
}

interface GitHubProject {
  id: string;
  name: string;
  type: string;
  label: string;
  description: string;
  stack: string[];
  live: string;
  code: string;
  stars: number;
  forks: number;
  cpu: string;
  color: string;
}

const colorMap: Record<string, { text: string; border: string; bg: string; shadow: string; hex: string }> = {
  violet: { text: "text-violet-400", border: "border-violet-500", bg: "bg-violet-500", shadow: "shadow-[0_0_20px_rgba(139,92,246,0.5)]", hex: "#8b5cf6" },
  emerald: { text: "text-emerald-400", border: "border-emerald-500", bg: "bg-emerald-500", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]", hex: "#10b981" },
  amber: { text: "text-amber-400", border: "border-amber-500", bg: "bg-amber-500", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]", hex: "#f59e0b" },
  cyan: { text: "text-cyan-400", border: "border-cyan-500", bg: "bg-cyan-500", shadow: "shadow-[0_0_20px_rgba(6,182,212,0.5)]", hex: "#06b6d4" },
  sky: { text: "text-sky-400", border: "border-sky-500", bg: "bg-sky-500", shadow: "shadow-[0_0_20px_rgba(14,165,233,0.5)]", hex: "#0ea5e9" },
  rose: { text: "text-rose-400", border: "border-rose-500", bg: "bg-rose-500", shadow: "shadow-[0_0_20px_rgba(244,63,94,0.5)]", hex: "#f43f5e" },
  fuchsia: { text: "text-fuchsia-400", border: "border-fuchsia-500", bg: "bg-fuchsia-500", shadow: "shadow-[0_0_20px_rgba(217,70,239,0.5)]", hex: "#d946ef" },
};

const DEFAULT_COLOR = { text: "text-white/40", border: "border-white/20", bg: "bg-white/10", shadow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]", hex: "#ffffff" };

function getColor(key: string) {
  return colorMap[key] ?? DEFAULT_COLOR;
}

function normalizeHomepage(homepage?: string): string {
  if (!homepage) return "";
  const trimmed = homepage.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function mapRepoToProject(repo: GitHubRepo): GitHubProject {
  const colorKeys = Object.keys(colorMap);
  const color = colorKeys[repo.name.length % colorKeys.length];
  const live = normalizeHomepage(repo.homepage);
  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name: repo.name,
    type: repo.language ? `${repo.language.toUpperCase()}-PROJECT` : "PROJECT",
    label: repo.description ? repo.description.slice(0, 40) : "GitHub Project",
    description: repo.description || "No description available.",
    stack: repo.languages.length > 0 ? repo.languages : [repo.language || "Other"],
    live,
    code: repo.html_url,
    stars: repo.stars,
    forks: repo.forks,
    cpu: `0x${(repo.name.charCodeAt(0) % 256).toString(16).toUpperCase().padStart(2, "0")}${((repo.name.length * 17) % 256).toString(16).toUpperCase().padStart(2, "0")}`,
    color,
  };
}

const CARD_WIDTH = 220;
const AUTO_ROTATE_MS = 2800;

export default function Projects() {
  const [projects, setProjects] = React.useState<GitHubProject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [frontIndex, setFrontIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.repositories)) {
          const filtered = data.repositories.filter(
            (r: GitHubRepo) => !r.fork && r.name.toLowerCase() !== "nandinigoyaldev"
          );
          setProjects(filtered.map(mapRepoToProject));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
  }, []);

  // Step the cylinder so each project rotates to the front
  React.useEffect(() => {
    if (projects.length < 2 || paused || activeId) return;
    const id = window.setInterval(() => {
      setFrontIndex((prev) => (prev + 1) % projects.length);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [projects.length, paused, activeId]);

  const activeProject = projects.find((p) => p.id === activeId);
  const count = projects.length || 1;
  const angleStep = 360 / count;
  const radius = Math.max(
    180,
    Math.round((CARD_WIDTH / 2) / Math.tan(Math.PI / Math.max(count, 3)))
  );
  const frontProject = projects[frontIndex] ?? null;

  if (loading) {
    return (
      <section className="relative bg-[#050505] px-6 pt-32 pb-16 text-white flex flex-col items-center justify-center overflow-hidden" id="projects">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin h-12 w-12 border-4 border-white/20 border-t-white rounded-full mb-4" />
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
            Loading data cores from GitHub...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#050505] px-6 pt-32 pb-16 text-white flex flex-col items-center justify-center overflow-hidden" id="projects">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:30px_30px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_#050505_100%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl z-10">
        <div className="mb-6 md:mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4 border border-white/20 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-sm bg-cyan-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/90">
              Motherboard
            </span>
          </div>
          <h2 className="font-mono text-3xl font-light tracking-widest text-white md:text-5xl uppercase">
            <TextScramble text="DATA CORES" />
          </h2>
          <p className="mt-4 font-mono text-xs text-white/40 tracking-widest uppercase">
            [ Cylinder rotate — select front core ]
          </p>
        </div>

        {/* 3D Project Cylinder */}
        <div
          className="relative w-full h-[380px] md:h-[460px] border border-white/10 bg-[#070b14]/50 rounded-xl overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.9)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050505]/80 to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505]/80 to-transparent pointer-events-none z-20" />

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1100px" }}
          >
            <motion.div
              className="relative"
              style={{
                width: CARD_WIDTH,
                height: 150,
                transformStyle: "preserve-3d",
              }}
              animate={{ rotateY: -frontIndex * angleStep }}
              transition={{ type: "spring", stiffness: 70, damping: 18 }}
            >
              {projects.map((project, idx) => {
                const isFront = idx === frontIndex;
                const styles = getColor(project.color);
                return (
                  <div
                    key={project.id}
                    className="absolute left-0 top-0"
                    style={{
                      width: CARD_WIDTH,
                      height: 150,
                      transform: `rotateY(${idx * angleStep}deg) translateZ(${radius}px)`,
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isFront) {
                          setActiveId(project.id);
                        } else {
                          setFrontIndex(idx);
                        }
                      }}
                      className={`group relative h-full w-full cursor-pointer border-2 bg-[#0a0f1a]/95 text-left transition-all duration-300 ${
                        isFront
                          ? `${styles.border} ${styles.shadow} scale-105`
                          : "border-white/15 opacity-55 scale-95"
                      }`}
                    >
                      <div className="absolute -top-2 left-4 right-4 flex justify-between">
                        {Array.from({ length: 6 }).map((_, pin) => (
                          <div
                            key={pin}
                            className={`h-3 w-1.5 ${isFront ? styles.bg : "bg-white/25"}`}
                          />
                        ))}
                      </div>
                      <div className="absolute -bottom-2 left-4 right-4 flex justify-between">
                        {Array.from({ length: 6 }).map((_, pin) => (
                          <div
                            key={pin}
                            className={`h-3 w-1.5 ${isFront ? styles.bg : "bg-white/25"}`}
                          />
                        ))}
                      </div>

                      <div className={`absolute inset-3 border ${isFront ? styles.border : "border-white/10"} bg-[#050505] flex flex-col items-center justify-center px-3`}>
                        <div className={`font-mono text-[9px] uppercase tracking-[0.25em] ${isFront ? styles.text : "text-white/30"}`}>
                          {project.cpu}
                        </div>
                        <div className={`mt-2 font-mono text-sm md:text-base font-bold uppercase tracking-tight text-center leading-tight ${isFront ? "text-white" : "text-white/55"}`}>
                          {project.name}
                        </div>
                        <div className="mt-2 font-mono text-[8px] uppercase tracking-widest text-white/35 truncate max-w-full">
                          {project.type}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Front project readout + controls */}
          <div className="absolute bottom-4 left-0 right-0 z-30 flex flex-col items-center gap-3 px-4">
            <AnimatePresence mode="wait">
              {frontProject && (
                <motion.div
                  key={frontProject.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-center"
                >
                  <div className={`font-mono text-[10px] uppercase tracking-[0.3em] ${getColor(frontProject.color).text}`}>
                    Core {String(frontIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </div>
                  <div className="mt-1 font-mono text-sm md:text-base text-white/90 uppercase tracking-widest">
                    {frontProject.name}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Previous project"
                onClick={() => setFrontIndex((prev) => (prev - 1 + count) % count)}
                className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white border border-white/15 px-3 py-1.5 transition-colors"
              >
                ◂ Prev
              </button>
              <div className="flex gap-1.5">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={`Show ${p.name}`}
                    onClick={() => setFrontIndex(i)}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      i === frontIndex ? `${getColor(p.color).bg} w-4` : "bg-white/25"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next project"
                onClick={() => setFrontIndex((prev) => (prev + 1) % count)}
                className="font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white border border-white/15 px-3 py-1.5 transition-colors"
              >
                Next ▸
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-6"
              onClick={() => setActiveId(null)}
            >
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-none" />

              <div
                className="relative w-full max-w-4xl max-h-[60vh] md:max-h-[85vh] bg-[#0a0f1a] border border-white/20 p-4 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-xl flex flex-col overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${getColor(activeProject.color).bg}`} />

                <button
                  onClick={() => setActiveId(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 z-20 font-mono text-[10px] text-white/50 hover:text-white uppercase tracking-widest bg-black/80 backdrop-blur px-2 py-1 rounded border border-white/10 md:bg-transparent md:border-transparent cursor-pointer"
                >
                  [ Close ]
                </button>

                <div className="overflow-y-auto custom-scrollbar flex-1 min-h-0 -mx-2 px-2 mt-8 md:mt-0">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="flex-1">
                      <div className={`mb-2 font-mono text-[9px] md:text-[10px] tracking-[0.3em] uppercase ${getColor(activeProject.color).text}`}>
                        {activeProject.label}
                      </div>
                      <h3 className="text-xl md:text-5xl font-bold uppercase tracking-tight text-white mb-3 md:mb-6">
                        {activeProject.name}
                      </h3>

                      <p className="text-xs md:text-base text-white/70 leading-relaxed mb-4 md:mb-8">
                        {activeProject.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                        {activeProject.stack.map((s) => (
                          <span key={s} className="border border-white/10 bg-white/[0.05] px-2 md:px-3 py-1 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-white/60">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-6 font-mono text-[11px] uppercase tracking-widest mt-auto">
                        {activeProject.live && (
                          <a href={activeProject.live} target="_blank" rel="noopener noreferrer" className={`transition-colors hover:text-white ${getColor(activeProject.color).text}`}>
                            Execute Live ↗
                          </a>
                        )}
                        <a href={activeProject.code} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                          Source Code ↗
                        </a>
                      </div>
                    </div>

                    <div className="hidden md:flex w-full md:w-1/3 border border-white/10 bg-[#050505] p-6 flex-col justify-between font-mono">
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

                      <div className="mt-8 relative h-24 border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:10px_10px]">
                        <motion.div
                          className={`absolute top-1/2 left-1/4 h-8 w-8 -translate-y-1/2 ${getColor(activeProject.color).bg} opacity-20 blur-md`}
                          animate={{ opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className={`absolute top-1/2 left-1/4 h-2 w-2 -translate-y-1/2 ${getColor(activeProject.color).bg}`} />
                        <div className={`absolute top-1/2 left-1/4 w-1/2 h-px -translate-y-1/2 ${getColor(activeProject.color).bg} opacity-50`} />
                        <div className="absolute top-1/2 right-1/4 h-4 w-4 -translate-y-1/2 border border-white/40" />
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
