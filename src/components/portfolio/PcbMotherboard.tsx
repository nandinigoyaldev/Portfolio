"use client";

import * as React from "react";

export interface ChipData {
  id: string;
  name: string;
  subtitle: string;
  degree: string;
  institution: string;
  year: string;
  status: "ONLINE" | "VERIFIED" | "QUEUED";
  colorHex: string;
  glowHex: string;
  pins: string[];
  summary: string;
  roleBadge: string;
  specs: { label: string; value: string }[];
}

interface PcbMotherboardProps {
  chips: ChipData[];
  activeId: string;
  onSelectChip: (id: string) => void;
}

export default function PcbMotherboard({ chips, activeId, onSelectChip }: PcbMotherboardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Electrical particle packets flowing on PCB traces (subtle & calm)
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    type Pulse = {
      pathIndex: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
      alpha: number;
    };

    // Refined, subtle pulses
    const pulseCount = 14;
    const pulses: Pulse[] = [];
    const colors = ["#10b981", "#38bdf8", "#f59e0b", "#c084fc"];

    for (let i = 0; i < pulseCount; i++) {
      pulses.push({
        pathIndex: i % 8,
        progress: Math.random(),
        speed: Math.random() * 0.003 + 0.002, // Gentle slow speed
        color: colors[i % colors.length],
        size: Math.random() * 1.5 + 1.2, // Subtle small size
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.015;

      const cx = width / 2;
      const cy = height / 2;
      const xLeft = width * 0.25;
      const xRight = width * 0.75;
      const yTop = height * 0.25;
      const yBottom = height * 0.75;

      // 1. Subtle Solder Via Grid (Very faint)
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      const spacing = 32;
      for (let gx = 16; gx < width; gx += spacing) {
        for (let gy = 16; gy < height; gy += spacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Refined Hairline Traces
      const paths = [
        // Path 0: Chip 0 to Center
        [
          { x: xLeft, y: yTop },
          { x: xLeft + 40, y: yTop },
          { x: cx - 35, y: cy - 20 },
          { x: cx, y: cy },
        ],
        // Path 1: Chip 1 to Center
        [
          { x: xRight, y: yTop },
          { x: xRight - 40, y: yTop },
          { x: cx + 35, y: cy - 20 },
          { x: cx, y: cy },
        ],
        // Path 2: Chip 2 to Center
        [
          { x: xLeft, y: yBottom },
          { x: xLeft + 40, y: yBottom },
          { x: cx - 35, y: cy + 20 },
          { x: cx, y: cy },
        ],
        // Path 3: Chip 3 to Center
        [
          { x: xRight, y: yBottom },
          { x: xRight - 40, y: yBottom },
          { x: cx + 35, y: cy + 20 },
          { x: cx, y: cy },
        ],
        // Path 4: Outer Bus Left (Chip 0 to Chip 2)
        [
          { x: xLeft - 35, y: yTop },
          { x: 20, y: yTop + 25 },
          { x: 20, y: yBottom - 25 },
          { x: xLeft - 35, y: yBottom },
        ],
        // Path 5: Outer Bus Right (Chip 1 to Chip 3)
        [
          { x: xRight + 35, y: yTop },
          { x: width - 20, y: yTop + 25 },
          { x: width - 20, y: yBottom - 25 },
          { x: xRight + 35, y: yBottom },
        ],
        // Path 6: Top Bus (Chip 0 to Chip 1)
        [
          { x: xLeft, y: yTop - 35 },
          { x: xLeft + 30, y: 22 },
          { x: xRight - 30, y: 22 },
          { x: xRight, y: yTop - 35 },
        ],
        // Path 7: Bottom Bus (Chip 2 to Chip 3)
        [
          { x: xLeft, y: yBottom + 35 },
          { x: xLeft + 30, y: height - 22 },
          { x: xRight - 30, y: height - 22 },
          { x: xRight, y: yBottom + 35 },
        ],
      ];

      // Draw all traces with subtle, muted lines
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 0; i < paths.length; i++) {
        const p = paths[i];
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (let j = 1; j < p.length; j++) {
          ctx.lineTo(p[j].x, p[j].y);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.stroke();

        // Tiny solder dots at joints
        for (let j = 0; j < p.length; j++) {
          ctx.beginPath();
          ctx.arc(p[j].x, p[j].y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(251, 191, 36, 0.25)";
          ctx.fill();
        }
      }

      // 3. Subtle Electrical Pulses
      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) {
          pulse.progress = 0;
          pulse.pathIndex = Math.floor(Math.random() * paths.length);
        }

        const path = paths[pulse.pathIndex];
        const totalSegments = path.length - 1;
        const segmentProgress = pulse.progress * totalSegments;
        const segIdx = Math.min(Math.floor(segmentProgress), totalSegments - 1);
        const subT = segmentProgress - segIdx;

        const p1 = path[segIdx];
        const p2 = path[segIdx + 1];

        const px = p1.x + (p2.x - p1.x) * subT;
        const py = p1.y + (p2.y - p1.y) * subT;

        // Draw soft gentle photon
        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = pulse.color;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Center Oscillator (Soft breathing glow)
      const crystalGlow = Math.sin(time * 2) * 0.15 + 0.35;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(8, 12, 22, 0.95)";
      ctx.strokeStyle = `rgba(56, 189, 248, ${crystalGlow})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fill();

      // Core oscillator
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] md:h-[500px] rounded-2xl border border-white/10 bg-[#060914] overflow-hidden select-none"
    >
      {/* Background Animated PCB Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Center Oscillator Beacon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center">
        <span className="font-mono text-[7px] uppercase tracking-widest text-cyan-300/80 font-semibold mt-13 bg-[#060914]/90 px-2 py-0.5 rounded border border-cyan-500/20">
          CDN IGNOU CLK
        </span>
      </div>

      {/* Surface-Mount IC Chips (Interactive Nodes with Hover & Click) */}
      <div className="relative w-full h-full z-10">
        {chips.map((chip, idx) => {
          const isActive = chip.id === activeId;

          // 4 Quadrant placement
          const posClasses = [
            "top-[6%] left-[4%]", // 0
            "top-[6%] right-[4%]", // 1
            "bottom-[6%] left-[4%]", // 2
            "bottom-[6%] right-[4%]", // 3
          ][idx];

          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelectChip(chip.id)}
              onMouseEnter={() => onSelectChip(chip.id)}
              className={`absolute ${posClasses} group w-[145px] sm:w-[160px] md:w-[175px] p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#0b1224] border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.08)] scale-[1.02]"
                  : "bg-[#080d1a]/80 border-white/10 hover:border-white/20 hover:bg-[#0a1020]"
              }`}
            >
              {/* Metallic IC Chip Side Pin markers */}
              <div className="absolute -left-1.5 top-2.5 bottom-2.5 flex flex-col justify-between pointer-events-none">
                {[...Array(4)].map((_, pi) => (
                  <span key={pi} className="h-1 w-1.5 rounded-l-xs bg-slate-500/50" />
                ))}
              </div>
              <div className="absolute -right-1.5 top-2.5 bottom-2.5 flex flex-col justify-between pointer-events-none">
                {[...Array(4)].map((_, pi) => (
                  <span key={pi} className="h-1 w-1.5 rounded-r-xs bg-slate-500/50" />
                ))}
              </div>

              {/* Silicon Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[8px] uppercase tracking-wider text-white/40">
                  DIE 0{idx + 1}
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: chip.colorHex,
                    boxShadow: isActive ? `0 0 6px ${chip.colorHex}` : "none",
                  }}
                />
              </div>

              {/* Chip Silkscreen Typography */}
              <div className="font-mono font-bold text-xs sm:text-sm text-white tracking-wide truncate">
                {chip.name}
              </div>
              <div className="font-mono text-[9px] text-white/50 truncate mb-2">
                {chip.subtitle}
              </div>

              {/* Bottom Voltage Indicator */}
              <div className="w-full h-0.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: isActive ? "100%" : "25%",
                    backgroundColor: chip.colorHex,
                  }}
                />
              </div>

              {/* Footnote */}
              <div className="flex items-center justify-between font-mono text-[8px] text-white/40 mt-1.5">
                <span>{chip.year.split("—")[0].trim()}</span>
                <span className={isActive ? "text-white/80 font-medium" : "text-white/25"}>
                  {isActive ? "ACTIVE" : "VIEW →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* PCB Silkscreen Subtle Markings */}
      <div className="absolute top-3 left-3 z-20 font-mono text-[8px] text-white/25 pointer-events-none">
        <span>PCB-REV // ARCHITECTURE</span>
      </div>
      <div className="absolute bottom-3 right-3 z-20 font-mono text-[8px] text-white/25 pointer-events-none">
        <span>[ HOVER / CLICK CHIP ]</span>
      </div>
    </div>
  );
}
