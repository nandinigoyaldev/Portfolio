"use client";

import * as React from "react";

export type DataShard = {
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

interface SolarSystem3DProps {
  shards: DataShard[];
  activeId: string | null;
  onSelectShard: (id: string) => void;
}

interface PlanetState {
  id: string;
  org: string;
  title: string;
  tag: string;
  color: string;
  orbitRadius: number;
  inclination: number; // orbital tilt in radians
  speed: number;
  angle: number;
  size: number;
  colorHex: string;
  glowHex: string;
}

const COLOR_MAP: Record<string, { hex: string; glow: string }> = {
  cyan: { hex: "#22d3ee", glow: "rgba(34, 211, 238, 0.45)" },
  emerald: { hex: "#34d399", glow: "rgba(52, 211, 153, 0.45)" },
  fuchsia: { hex: "#e879f9", glow: "rgba(232, 121, 249, 0.45)" },
  indigo: { hex: "#818cf8", glow: "rgba(129, 140, 248, 0.45)" },
};

export default function SolarSystem3D({ shards, activeId, onSelectShard }: SolarSystem3DProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Camera angles (Euler: yaw = rotation around Y, pitch = rotation around X)
  const cameraRef = React.useRef({
    yaw: 0.35,
    pitch: 0.55,
    targetYaw: 0.35,
    targetPitch: 0.55,
    zoom: 1.0,
    targetZoom: 1.0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastDragX: 0,
    lastDragY: 0,
    dragVelocityX: 0,
    dragVelocityY: 0,
    autoRotate: true,
  });

  const [hoveredShardId, setHoveredShardId] = React.useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{ x: number; y: number } | null>(null);
  const [isAutoRotate, setIsAutoRotate] = React.useState(true);
  const [speedMultiplier, setSpeedMultiplier] = React.useState<number>(1.0);
  const speedRef = React.useRef<number>(1.0);

  // Sync speedRef
  React.useEffect(() => {
    speedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Initializing 3D planet metadata
  const planetsRef = React.useRef<PlanetState[]>([]);

  React.useEffect(() => {
    // Generate realistic distances and gentle cosmic speeds (calm & cinematic)
    const baseDistances = [115, 155, 195, 235, 275, 315, 355, 395];
    const inclinations = [0.12, -0.18, 0.22, -0.14, 0.25, -0.2, 0.16, -0.24];
    const sizes = [7, 8, 9, 7.5, 9.5, 8, 7.5, 8.5];
    // Significantly reduced speeds (6x slower than before)
    const baseSpeeds = [0.0024, 0.0019, 0.0015, 0.0012, 0.00095, 0.00078, 0.00062, 0.00048];

    planetsRef.current = shards.map((s, i) => {
      const colorInfo = COLOR_MAP[s.color] || { hex: "#38bdf8", glow: "rgba(56, 189, 248, 0.4)" };
      return {
        id: s.id,
        org: s.org,
        title: s.title,
        tag: s.tag,
        color: s.color,
        orbitRadius: baseDistances[i % baseDistances.length],
        inclination: inclinations[i % inclinations.length],
        speed: baseSpeeds[i % baseSpeeds.length],
        angle: (i / shards.length) * Math.PI * 2,
        size: sizes[i % sizes.length],
        colorHex: colorInfo.hex,
        glowHex: colorInfo.glow,
      };
    });
  }, [shards]);

  // Handle Resize & Canvas Animation Loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Starfield points in 3D
    const starCount = 140;
    const stars: { x: number; y: number; z: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 1000,
        z: (Math.random() - 0.5) * 1400,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
      });
    }

    let sunPulseTime = 0;

    const render = () => {
      const cam = cameraRef.current;
      const currentSpeed = speedRef.current;

      // Camera auto-rotation and inertia dampening (gentle and smooth)
      if (cam.autoRotate && !cam.isDragging && currentSpeed > 0) {
        cam.targetYaw += 0.0006 * currentSpeed;
      }
      if (!cam.isDragging) {
        cam.targetYaw += cam.dragVelocityX;
        cam.targetPitch += cam.dragVelocityY;
        cam.dragVelocityX *= 0.92;
        cam.dragVelocityY *= 0.92;
      }

      // Smooth camera interpolation
      cam.yaw += (cam.targetYaw - cam.yaw) * 0.1;
      cam.pitch += (cam.targetPitch - cam.pitch) * 0.1;
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.1;

      // Clamp pitch to avoid gimbal flip
      cam.pitch = Math.max(-1.2, Math.min(1.2, cam.pitch));
      cam.targetPitch = Math.max(-1.2, Math.min(1.2, cam.targetPitch));

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 650 * cam.zoom;
      const viewDistance = 750;

      // 3D Rotation matrices
      const cosY = Math.cos(cam.yaw);
      const sinY = Math.sin(cam.yaw);
      const cosP = Math.cos(cam.pitch);
      const sinP = Math.sin(cam.pitch);

      // Helper: Project 3D (x, y, z) to 2D screen space
      const project3D = (x: number, y: number, z: number) => {
        // Yaw rotation (around Y axis)
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Pitch rotation (around X axis)
        const y2 = y * cosP - z1 * sinP;
        const z2 = z1 * cosP + y * sinP;

        // Perspective division
        const depth = viewDistance + z2;
        if (depth <= 20) return null; // Behind camera
        const scale = fov / depth;
        return {
          sx: centerX + x1 * scale,
          sy: centerY + y2 * scale,
          scale,
          depth: z2,
        };
      };

      // 1. Draw 3D Background Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const proj = project3D(star.x, star.y, star.z);
        if (proj) {
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, star.size * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * Math.min(1, proj.scale * 1.2)})`;
          ctx.fill();
        }
      }

      // 2. Draw 3D Orbital Rings
      const planets = planetsRef.current;
      for (let i = 0; i < planets.length; i++) {
        const p = planets[i];
        const segments = 64;
        ctx.beginPath();
        let firstPoint = true;

        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          // Apply orbital inclination tilt
          const lx = Math.cos(theta) * p.orbitRadius;
          const ly = Math.sin(theta) * p.orbitRadius * Math.sin(p.inclination);
          const lz = Math.sin(theta) * p.orbitRadius * Math.cos(p.inclination);

          const proj = project3D(lx, ly, lz);
          if (proj) {
            if (firstPoint) {
              ctx.moveTo(proj.sx, proj.sy);
              firstPoint = false;
            } else {
              ctx.lineTo(proj.sx, proj.sy);
            }
          }
        }

        const isCurrentActive = p.id === activeId;
        const isCurrentHovered = p.id === hoveredShardId;
        ctx.strokeStyle = isCurrentActive
          ? p.colorHex
          : isCurrentHovered
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = isCurrentActive ? 1.5 : 0.8;
        if (isCurrentActive) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([2, 6]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 3. Update planet positions in 3D
      type RenderableItem =
        | { type: "sun"; depth: number; proj: { sx: number; sy: number; scale: number; depth: number } }
        | {
            type: "planet";
            planet: PlanetState;
            depth: number;
            proj: { sx: number; sy: number; scale: number; depth: number };
          };

      const renderList: RenderableItem[] = [];

      // Add central sun
      const sunProj = project3D(0, 0, 0);
      if (sunProj) {
        renderList.push({ type: "sun", depth: sunProj.depth, proj: sunProj });
      }

      // Calculate planets
      for (let i = 0; i < planets.length; i++) {
        const p = planets[i];
        // Advance orbit angle based on speed control (dampened if hovered for easy inspection)
        if (currentSpeed > 0) {
          const hoverDampener = p.id === hoveredShardId ? 0.3 : 1.0;
          p.angle += p.speed * currentSpeed * hoverDampener;
        }

        const lx = Math.cos(p.angle) * p.orbitRadius;
        const ly = Math.sin(p.angle) * p.orbitRadius * Math.sin(p.inclination);
        const lz = Math.sin(p.angle) * p.orbitRadius * Math.cos(p.inclination);

        const proj = project3D(lx, ly, lz);
        if (proj) {
          renderList.push({ type: "planet", planet: p, depth: proj.depth, proj });
        }
      }

      // Sort by depth (Painter's algorithm: farthest first, closest last)
      renderList.sort((a, b) => b.depth - a.depth);

      // 4. Render Sorted 3D Items
      sunPulseTime += 0.03;

      for (let i = 0; i < renderList.length; i++) {
        const item = renderList[i];

        if (item.type === "sun") {
          const { sx, sy, scale } = item.proj;
          const sunRadius = 22 * scale;

          // Outer Solar Flare Halo
          const outerGlow = ctx.createRadialGradient(sx, sy, sunRadius * 0.2, sx, sy, sunRadius * 4.5);
          outerGlow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          outerGlow.addColorStop(0.2, "rgba(251, 191, 36, 0.7)");
          outerGlow.addColorStop(0.5, "rgba(249, 115, 22, 0.3)");
          outerGlow.addColorStop(1, "rgba(249, 115, 22, 0)");
          ctx.beginPath();
          ctx.arc(sx, sy, sunRadius * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = outerGlow;
          ctx.fill();

          // Rotating Solar Flare Corona Rays
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(sunPulseTime * 0.2);
          const rayCount = 12;
          for (let r = 0; r < rayCount; r++) {
            const rayAngle = (r / rayCount) * Math.PI * 2;
            const rayLen = sunRadius * (1.8 + Math.sin(sunPulseTime * 2 + r) * 0.4);
            ctx.beginPath();
            ctx.moveTo(Math.cos(rayAngle) * sunRadius * 0.8, Math.sin(rayAngle) * sunRadius * 0.8);
            ctx.lineTo(Math.cos(rayAngle) * rayLen, Math.sin(rayAngle) * rayLen);
            ctx.strokeStyle = "rgba(254, 240, 138, 0.25)";
            ctx.lineWidth = 1.2 * scale;
            ctx.stroke();
          }
          ctx.restore();

          // Core Sun Sphere
          const sunCore = ctx.createRadialGradient(sx - sunRadius * 0.25, sy - sunRadius * 0.25, 0, sx, sy, sunRadius);
          sunCore.addColorStop(0, "#ffffff");
          sunCore.addColorStop(0.4, "#fef08a");
          sunCore.addColorStop(0.8, "#f59e0b");
          sunCore.addColorStop(1, "#d97706");

          ctx.beginPath();
          ctx.arc(sx, sy, sunRadius, 0, Math.PI * 2);
          ctx.fillStyle = sunCore;
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 24 * scale;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Render Planet
          const { planet, proj } = item;
          const { sx, sy, scale } = proj;
          const planetRadius = planet.size * scale;
          const isSelected = planet.id === activeId;
          const isHovered = planet.id === hoveredShardId;

          // Planet Laser link to Sun if active or hovered
          if (isSelected || isHovered) {
            if (sunProj) {
              ctx.beginPath();
              ctx.moveTo(sunProj.sx, sunProj.sy);
              ctx.lineTo(sx, sy);
              ctx.strokeStyle = planet.colorHex;
              ctx.lineWidth = isSelected ? 1.5 : 1.0;
              ctx.setLineDash([3, 5]);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          // Outer Atmospheric Glow Halo
          const glowGrad = ctx.createRadialGradient(sx, sy, planetRadius * 0.8, sx, sy, planetRadius * 2.8);
          glowGrad.addColorStop(0, planet.colorHex);
          glowGrad.addColorStop(0.6, planet.glowHex);
          glowGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(sx, sy, planetRadius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // 3D Sphere Shading (light source from central sun)
          const angleToSun = Math.atan2(centerY - sy, centerX - sx);
          const lightOffsetX = Math.cos(angleToSun) * (planetRadius * 0.35);
          const lightOffsetY = Math.sin(angleToSun) * (planetRadius * 0.35);

          const sphereGrad = ctx.createRadialGradient(
            sx + lightOffsetX,
            sy + lightOffsetY,
            planetRadius * 0.1,
            sx,
            sy,
            planetRadius
          );
          sphereGrad.addColorStop(0, "#ffffff");
          sphereGrad.addColorStop(0.4, planet.colorHex);
          sphereGrad.addColorStop(0.9, "#090d16");
          sphereGrad.addColorStop(1, "#03060c");

          ctx.beginPath();
          ctx.arc(sx, sy, planetRadius, 0, Math.PI * 2);
          ctx.fillStyle = sphereGrad;
          ctx.fill();

          // Planet Orbital Atmosphere Ring
          ctx.beginPath();
          ctx.arc(sx, sy, planetRadius * 1.3, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected ? planet.colorHex : "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Selection / Hover Reticle
          if (isSelected || isHovered) {
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(sunPulseTime * 1.5);
            ctx.beginPath();
            ctx.arc(0, 0, planetRadius * 2.0, 0, Math.PI * 2);
            ctx.strokeStyle = planet.colorHex;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.restore();

            // Screen label for company
            ctx.font = `600 ${Math.max(10, Math.round(11 * scale))}px monospace`;
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 4;
            ctx.fillText(planet.org, sx, sy + planetRadius * 2.2 + 10);
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeId, hoveredShardId]);

  // Pointer Interaction Handlers for Drag, Orbit, and Click
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cam = cameraRef.current;
    cam.isDragging = true;
    cam.dragStartX = e.clientX;
    cam.dragStartY = e.clientY;
    cam.lastDragX = e.clientX;
    cam.lastDragY = e.clientY;
    cam.dragVelocityX = 0;
    cam.dragVelocityY = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cam = cameraRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (cam.isDragging) {
      const deltaX = e.clientX - cam.lastDragX;
      const deltaY = e.clientY - cam.lastDragY;

      cam.dragVelocityX = deltaX * 0.006;
      cam.dragVelocityY = -deltaY * 0.006;

      cam.targetYaw += cam.dragVelocityX;
      cam.targetPitch += cam.dragVelocityY;

      cam.lastDragX = e.clientX;
      cam.lastDragY = e.clientY;
    } else {
      // Raycast / Hit-test hover on planets
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let closestPlanet: PlanetState | null = null;
      let minDistance = 24; // Hover threshold px

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const fov = 650 * cam.zoom;
      const viewDistance = 750;

      const cosY = Math.cos(cam.yaw);
      const sinY = Math.sin(cam.yaw);
      const cosP = Math.cos(cam.pitch);
      const sinP = Math.sin(cam.pitch);

      for (const p of planetsRef.current) {
        const lx = Math.cos(p.angle) * p.orbitRadius;
        const ly = Math.sin(p.angle) * p.orbitRadius * Math.sin(p.inclination);
        const lz = Math.sin(p.angle) * p.orbitRadius * Math.cos(p.inclination);

        const x1 = lx * cosY - lz * sinY;
        const z1 = lz * cosY + lx * sinY;
        const y2 = ly * cosP - z1 * sinP;
        const z2 = z1 * cosP + ly * sinP;

        const depth = viewDistance + z2;
        if (depth > 20) {
          const scale = fov / depth;
          const sx = centerX + x1 * scale;
          const sy = centerY + y2 * scale;

          const dist = Math.hypot(mouseX - sx, mouseY - sy);
          if (dist < minDistance) {
            minDistance = dist;
            closestPlanet = p;
          }
        }
      }

      if (closestPlanet) {
        setHoveredShardId(closestPlanet.id);
        setTooltipPos({ x: mouseX, y: mouseY });
      } else {
        setHoveredShardId(null);
        setTooltipPos(null);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cam = cameraRef.current;
    const moveDist = Math.hypot(e.clientX - cam.dragStartX, e.clientY - cam.dragStartY);

    if (moveDist < 6) {
      // It was a click! If a planet is hovered, select it
      if (hoveredShardId) {
        onSelectShard(hoveredShardId);
      }
    }

    cam.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const cam = cameraRef.current;
    const zoomDelta = -e.deltaY * 0.0012;
    cam.targetZoom = Math.max(0.65, Math.min(1.65, cam.targetZoom + zoomDelta));
  };

  const resetCamera = () => {
    const cam = cameraRef.current;
    cam.targetYaw = 0.35;
    cam.targetPitch = 0.55;
    cam.targetZoom = 1.0;
  };

  const toggleAutoRotate = () => {
    const cam = cameraRef.current;
    cam.autoRotate = !cam.autoRotate;
    setIsAutoRotate(cam.autoRotate);
  };

  const hoveredShard = shards.find((s) => s.id === hoveredShardId);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* 3D Canvas Viewport Box */}
      <div
        ref={containerRef}
        className="relative h-[440px] md:h-[540px] w-full max-w-4xl border border-white/10 bg-[#060913]/90 rounded-2xl overflow-hidden shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] flex items-center justify-center select-none"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          className={`w-full h-full touch-none ${hoveredShardId ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
        />

        {/* 3D Viewport Controls & HUD Overlays */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 font-mono text-[10px] text-white/50 bg-[#080d1a]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>3D ORBIT ENGINE // KEPLER-3D</span>
        </div>

        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Speed Preset Cycle Button */}
          <button
            type="button"
            onClick={() => {
              if (speedMultiplier === 1.0) setSpeedMultiplier(0.5);
              else if (speedMultiplier === 0.5) setSpeedMultiplier(0);
              else setSpeedMultiplier(1.0);
            }}
            className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
              speedMultiplier === 1.0
                ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300"
                : speedMultiplier === 0.5
                ? "bg-amber-500/10 border-amber-400/40 text-amber-300"
                : "bg-red-500/10 border-red-400/40 text-red-300"
            }`}
            title="Toggle Orbital Speed"
          >
            {speedMultiplier === 1.0 ? "Speed: 1x" : speedMultiplier === 0.5 ? "Speed: 0.5x" : "Speed: Paused"}
          </button>
          <button
            type="button"
            onClick={toggleAutoRotate}
            className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
              isAutoRotate
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white"
            }`}
          >
            {isAutoRotate ? "Rotate: ON" : "Rotate: OFF"}
          </button>
          <button
            type="button"
            onClick={resetCamera}
            className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-white/50 hover:text-white backdrop-blur-md transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Floating Holographic Hover Tooltip */}
        {hoveredShard && tooltipPos && (
          <div
            className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 rounded-xl border border-cyan-400/50 bg-[#0a101f]/95 backdrop-blur-xl shadow-[0_0_25px_rgba(34,211,238,0.3)] min-w-[170px] text-left transition-all duration-75"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 12}px`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-cyan-300">
                {hoveredShard.tag}
              </span>
            </div>
            <div className="font-bold text-xs text-white leading-tight">{hoveredShard.org}</div>
            <div className="font-mono text-[10px] text-white/50 mt-0.5">{hoveredShard.title}</div>
            <div className="mt-2 pt-1.5 border-t border-white/10 font-mono text-[9px] text-cyan-400/80">
              [ Click planet to open record ]
            </div>
          </div>
        )}

        {/* Bottom Interactive Help Caption */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 font-mono text-[10px] text-white/40 bg-[#080d1a]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
          <span>Drag to rotate 3D orbit</span>
          <span>•</span>
          <span>Scroll to zoom</span>
          <span>•</span>
          <span className="text-cyan-300/80">Click node for transmission</span>
        </div>
      </div>

      {/* Quick Stellar Node Selector Ribbon */}
      <div className="mt-6 w-full max-w-4xl flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-white/30 mr-2">
          Stellar Nodes:
        </span>
        {shards.map((s) => {
          const isActive = s.id === activeId;
          const colorInfo = COLOR_MAP[s.color] || { hex: "#38bdf8", glow: "rgba(56,189,248,0.4)" };
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectShard(s.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[11px] transition-all cursor-pointer ${
                isActive
                  ? "border-cyan-400 bg-cyan-500/10 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorInfo.hex, boxShadow: `0 0 8px ${colorInfo.hex}` }}
              />
              <span>{s.org}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
