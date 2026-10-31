"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

type Chip = {
  id: string;
  name: string;
  abbr: string;
  subtitle: string;
  degree: string;
  institution: string;
  year: string;
  status: "ONLINE" | "VERIFIED" | "QUEUED";
  colorHex: string;
  pins: string[];
  summary: string;
  roleBadge: string;
  specs: { label: string; value: string }[];
};

const chips: Chip[] = [
  {
    id: "bca",
    name: "IGNOU • BCA",
    abbr: "BCA",
    subtitle: "ALGO-CORE // 64-BIT",
    degree: "Bachelor of Computer Applications",
    institution: "Indira Gandhi National Open University (IGNOU)",
    year: "2024 — 2027",
    status: "ONLINE",
    colorHex: "#10b981",
    roleBadge: "Founder & Lead — CDN IGNOU on Commudle",
    summary:
      "Core computer science and mathematical foundations. Covers formal algorithmic complexity, OOP design, relational database systems, and distributed networking.",
    pins: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming (C++/Java)",
      "Relational Databases (PostgreSQL)",
      "Operating Systems & Architecture",
      "Computer Networks & Protocols",
      "Discrete Computational Logic",
    ],
    specs: [
      { label: "Accreditation", value: "UGC-DEB Approved" },
      { label: "Duration", value: "3 Years · 6 Semesters" },
      { label: "Leadership", value: "Founder @ CDN IGNOU" },
      { label: "Track", value: "Computer Science Core" },
    ],
  },
  {
    id: "mdce",
    name: "IICS • MDCE",
    abbr: "MDCE",
    subtitle: "SYS-ENG // ARCH-32",
    degree: "Master Diploma in Computer Engineering",
    institution: "Indian Institute of Computer Science (IICS)",
    year: "2024 — 2027",
    status: "ONLINE",
    colorHex: "#38bdf8",
    roleBadge: "Advanced Systems & Lab Engineering Track",
    summary:
      "Parallel professional engineering conduit. Covers the full software engineering lifecycle, hardware-software interfacing, full-stack development, and system performance diagnostics.",
    pins: [
      "Software Engineering Lifecycle",
      "Hardware-Software Interfacing",
      "Full-Stack Web Architectures",
      "System Diagnostics & Performance",
      "Modern Toolchains & Git",
      "Applied Programming Paradigms",
    ],
    specs: [
      { label: "Institute", value: "IICS Technical" },
      { label: "Execution", value: "Concurrent Track" },
      { label: "Lab Focus", value: "Applied Diagnostics" },
      { label: "Portfolio", value: "Full Stack Prototypes" },
    ],
  },
  {
    id: "auto",
    name: "IICS • AUTO",
    abbr: "AUTO",
    subtitle: "I/O-BUS // DATA-16",
    degree: "Diploma in Business & Office Automation",
    institution: "Indian Institute of Computer Science (IICS)",
    year: "2024",
    status: "VERIFIED",
    colorHex: "#f59e0b",
    roleBadge: "Certificate — Open Source Hackathon (Pre-Assessment)",
    summary:
      "Specialized in automated administrative and data pipelines. Covers business process automation, spreadsheet computation models, enterprise office systems, and structured reporting.",
    pins: [
      "Process Automation Pipelines",
      "Spreadsheet Modeling & Calculation",
      "Enterprise Office Infrastructure",
      "Database Reporting & Feeds",
      "Workflow Modernization",
    ],
    specs: [
      { label: "Credential", value: "Verified Certificate" },
      { label: "Assessment", value: "Hackathon Qualifier" },
      { label: "Specialty", value: "Data Automation" },
      { label: "Outcome", value: "Streamlined Workflows" },
    ],
  },
  {
    id: "mca",
    name: "MCA • 2027",
    abbr: "MCA",
    subtitle: "NEURAL // AI-DISTRIB",
    degree: "Master of Computer Applications (MCA)",
    institution: "Premier Institutes via NIMCET / CUET PG",
    year: "Target 2027",
    status: "QUEUED",
    colorHex: "#c084fc",
    roleBadge: "NIMCET / CUET PG Postgraduate Target",
    summary:
      "Future postgraduate milestone. Rigorous preparation for national entrance exams targeting advanced research in distributed AI systems, cloud architectures, and computational complexity.",
    pins: [
      "Distributed AI & Agent Systems",
      "High-Concurrency Cloud Systems",
      "Computational Complexity Theory",
      "Scalable Database Architectures",
      "Advanced Algorithm Design",
    ],
    specs: [
      { label: "Gateways", value: "NIMCET & CUET PG 2027" },
      { label: "Degree Level", value: "Master of Computer Apps" },
      { label: "Target Domain", value: "Distributed AI" },
      { label: "Trajectory", value: "Post BCA/MDCE" },
    ],
  },
];

// Simple animated PCB traces drawn with CSS — no canvas, no scroll issues
function PcbTracesSvg({ activeIndex, activeColor }: { activeIndex: number; activeColor: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grid via-dots */}
      {[...Array(6)].map((_, row) =>
        [...Array(7)].map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={15 + col * 28}
            cy={18 + row * 38}
            r="1"
            fill="rgba(255,255,255,0.05)"
          />
        ))
      )}

      {/* Trace lines from chips to center */}
      {/* Center is ~100, 110 */}
      {[
        { x1: 35, y1: 42, x2: 100, y2: 110, active: activeIndex === 0 },   // BCA top-left
        { x1: 165, y1: 42, x2: 100, y2: 110, active: activeIndex === 1 },  // MDCE top-right
        { x1: 35, y1: 178, x2: 100, y2: 110, active: activeIndex === 2 },  // AUTO bottom-left
        { x1: 165, y1: 178, x2: 100, y2: 110, active: activeIndex === 3 }, // MCA bottom-right
      ].map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.active ? activeColor : "rgba(255,255,255,0.08)"}
          strokeWidth={line.active ? "1.5" : "0.8"}
          strokeDasharray={line.active ? "none" : "3 4"}
        />
      ))}

      {/* Solder vias along traces */}
      {[
        { cx: 58, cy: 66 }, { cx: 78, cy: 86 },
        { cx: 142, cy: 66 }, { cx: 122, cy: 86 },
        { cx: 58, cy: 154 }, { cx: 78, cy: 134 },
        { cx: 142, cy: 154 }, { cx: 122, cy: 134 },
      ].map((pt, i) => (
        <circle key={i} cx={pt.cx} cy={pt.cy} r="2" fill="rgba(251,191,36,0.2)" />
      ))}

      {/* Outer bus ring (perimeter traces) */}
      <rect x="12" y="12" width="176" height="196" rx="8" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

      {/* Cross bus lines */}
      <line x1="12" y1="110" x2="80" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <line x1="120" y1="110" x2="188" y2="110" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />

      {/* Center Oscillator */}
      <circle cx="100" cy="110" r="16" fill="#060c1c" stroke={activeColor} strokeWidth="1.2" strokeOpacity="0.6" />
      <circle cx="100" cy="110" r="7" fill={activeColor} opacity="0.75" />

      {/* Animated pulse along active trace */}
      {activeIndex >= 0 && (
        <circle r="3" fill={activeColor} opacity="0.9">
          <animateMotion
            dur="1.8s"
            repeatCount="indefinite"
            path={[
              "M35,42 L100,110",
              "M165,42 L100,110",
              "M35,178 L100,110",
              "M165,178 L100,110",
            ][activeIndex]}
          />
        </circle>
      )}
    </svg>
  );
}

export default function Education() {
  const [activeId, setActiveId] = React.useState("bca");
  const [prevId, setPrevId] = React.useState("bca");

  const activeChip = chips.find((c) => c.id === activeId)!;
  const activeIndex = chips.findIndex((c) => c.id === activeId);

  const handleSelect = (id: string) => {
    setPrevId(activeId);
    setActiveId(id);
  };

  const direction = chips.findIndex((c) => c.id === activeId) > chips.findIndex((c) => c.id === prevId) ? 1 : -1;

  return (
    <section
      id="education"
      className="relative bg-[#040711] text-white py-20 md:py-24 px-4 sm:px-6 md:px-8 overflow-hidden"
    >
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] blur-[130px] rounded-full" style={{ backgroundColor: `${activeChip.colorHex}10` }} />

      <div className="relative mx-auto max-w-6xl z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/10 bg-white/[0.03] mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
              Education // Circuit Matrix
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-light uppercase tracking-tight text-white mb-2">
            Academic <span style={{ color: activeChip.colorHex }} className="font-normal transition-colors duration-500">Credentials</span>
          </h2>
          <p className="text-xs text-white/40 font-mono max-w-lg">
            Click a chip to instantly switch credential view — no scrolling.
          </p>
        </div>

        {/* ── SPLIT-SCREEN COCKPIT ── */}
        {/* Fixed height, two columns, always visible on md+ */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5 md:h-[480px]">

          {/* ── LEFT: PCB Board + Chip Selectors ── */}
          <div className="md:w-[300px] lg:w-[340px] flex flex-col gap-3 shrink-0">
            {/* PCB Canvas Panel */}
            <div className="relative flex-1 rounded-2xl border border-white/10 bg-[#060b18] overflow-hidden min-h-[200px] md:min-h-0">
              <PcbTracesSvg activeIndex={activeIndex} activeColor={activeChip.colorHex} />

              {/* Corner Chip Labels on the PCB */}
              {chips.map((chip, idx) => {
                const isActive = chip.id === activeId;
                const corners = [
                  "top-3 left-3",
                  "top-3 right-3",
                  "bottom-3 left-3",
                  "bottom-3 right-3",
                ];
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleSelect(chip.id)}
                    className={`absolute ${corners[idx]} font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "text-white border-white/40 bg-white/10"
                        : "text-white/40 border-white/10 hover:text-white/70 hover:border-white/20"
                    }`}
                    style={{ color: isActive ? chip.colorHex : undefined }}
                  >
                    {chip.abbr}
                  </button>
                );
              })}

              {/* Center Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center mt-5">
                <div className="font-mono text-[8px] text-white/40 uppercase tracking-widest mt-1">
                  CLK
                </div>
              </div>

              {/* Silkscreen label */}
              <div className="absolute bottom-2 left-3 font-mono text-[8px] text-white/20 pointer-events-none">
                PCB-EDU // REV 2027
              </div>
            </div>

            {/* Chip Selector Tab Strip */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-1.5">
              {chips.map((chip) => {
                const isActive = chip.id === activeId;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleSelect(chip.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white/[0.08] border-white/20"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: chip.colorHex, opacity: isActive ? 1 : 0.4 }}
                      />
                      <span className="font-mono text-[9px] text-white/50 uppercase">{chip.status}</span>
                    </div>
                    <div className="font-mono font-bold text-xs text-white truncate">
                      {chip.abbr}
                    </div>
                    <div className="font-mono text-[9px] text-white/40 truncate">
                      {chip.year.split("—")[0].trim()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Animated Info Panel (always at eye level, same height as left) ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeId}
                custom={direction}
                initial={{ opacity: 0, x: direction * 30, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: direction * -30, filter: "blur(4px)" }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-2xl border border-white/10 bg-[#060c1c]/90 backdrop-blur-xl p-5 md:p-6 lg:p-8 flex flex-col justify-between"
                style={{
                  borderColor: `${activeChip.colorHex}30`,
                  boxShadow: `0 0 40px ${activeChip.colorHex}10`,
                }}
              >
                {/* TOP: Title & Badge */}
                <div>
                  {/* Status + Year row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: activeChip.colorHex }}
                      />
                      <span className="font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: activeChip.colorHex }}>
                        {activeChip.status}
                      </span>
                      <span className="text-white/20 font-mono text-[10px]">·</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                        {activeChip.subtitle}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-white/50 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.02]">
                      {activeChip.year}
                    </span>
                  </div>

                  {/* Degree & Institution */}
                  <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug mb-1">
                    {activeChip.degree}
                  </h3>
                  <p className="text-sm font-medium mb-4" style={{ color: activeChip.colorHex }}>
                    {activeChip.institution}
                  </p>

                  {/* Role Badge */}
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] mb-4">
                    <span
                      className="shrink-0 font-mono text-xs px-2 py-1 rounded-lg border"
                      style={{ color: activeChip.colorHex, borderColor: `${activeChip.colorHex}30`, backgroundColor: `${activeChip.colorHex}10` }}
                    >
                      ★
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-white">{activeChip.roleBadge}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed font-light mb-4">
                    {activeChip.summary}
                  </p>

                  {/* Coursework Chips */}
                  <div className="mb-1">
                    <div className="font-mono text-[9px] uppercase tracking-wider text-white/30 mb-2">
                      Coursework &amp; Competencies
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeChip.pins.map((pin, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] font-mono text-[10px] text-white/75 hover:text-white hover:border-white/20 transition-colors"
                        >
                          {pin}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM: Spec Grid always at base of panel */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono mt-4">
                  {activeChip.specs.map((sp, i) => (
                    <div key={i}>
                      <div className="text-[8px] uppercase tracking-wider text-white/30 mb-0.5">{sp.label}</div>
                      <div className="text-[11px] font-semibold text-white/80">{sp.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
