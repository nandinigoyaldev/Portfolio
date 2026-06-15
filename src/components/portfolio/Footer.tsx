"use client";

import { motion } from "framer-motion";
import * as React from "react";

function Icon({ name }: { name: "github" | "linkedin" | "youtube" | "resume" | "x" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M9 19c-4 1.5-4-2-5-2m10 4v-3.5c0-1 .1-1.4-.5-2 2-.2 4-.9 4-4.5 0-1-.3-2-1-2.7.1-.3.4-1.3-.1-2.7 0 0-1-.3-3 .9-.9-.2-1.9-.2-2.8 0-2-1.2-3-.9-3-.9-.5 1.4-.2 2.4-.1 2.7-.7.7-1 1.7-1 2.7 0 3.6 2 4.3 4 4.5-.3.3-.5.7-.5 1.5V21"
            {...common}
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V9h4v2" {...common} />
          <path d="M2 9h4v12H2z" {...common} />
          <path d="M4 4a2 2 0 1 0 0.01 0" {...common} />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
            {...common}
          />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" {...common} />
        </svg>
      );
    case "resume":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...common} />
          <path d="M14 2v6h6" {...common} />
          <path d="M8 13h8" {...common} />
          <path d="M8 17h6" {...common} />
        </svg>
      );
    case "x":
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M4 4l16 16" {...common} />
          <path d="M20 4L4 20" {...common} />
        </svg>
      );
  }
}

const socials = [
  {
    key: "github" as const,
    label: "GitHub",
    href: "https://github.com/goyaljiiiiii",
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    href: "https://linkedin.com/in/goyaljiiiiii",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    href: "https://youtube.com/@self_taught_bob",
  },
  {
    key: "resume" as const,
    label: "Resume",
    href: "/assets/Nandini.pdf",
  },
  {
    key: "x" as const,
    label: "X",
    href: "https://x.com/goyaljiiiiii",
  },
];

export default function Footer() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});

  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const [line, setLine] = React.useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const setRef = (key: string) => (el: HTMLAnchorElement | null) => {
    itemRefs.current[key] = el;
  };

  const computeLine = React.useCallback(
    (key: string | null) => {
      const container = containerRef.current;
      if (!container || !key) {
        setLine(null);
        return;
      }
      const target = itemRefs.current[key];
      if (!target) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const cx = containerRect.left + containerRect.width / 2;
      const cy = containerRect.top + containerRect.height / 2;

      const tx = targetRect.left + targetRect.width / 2;
      const ty = targetRect.top + targetRect.height / 2;

      setLine({ x1: cx - containerRect.left, y1: cy - containerRect.top, x2: tx - containerRect.left, y2: ty - containerRect.top });
    },
    [setLine]
  );

  React.useEffect(() => {
    if (!activeKey) return;
    computeLine(activeKey);

    const onResize = () => computeLine(activeKey);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeKey, computeLine]);

  return (
    <footer className="py-16 px-6" aria-label="Footer">
      <div className="mx-auto max-w-6xl">
        <div
          ref={containerRef}
          className={
            "relative mx-auto h-[360px] w-full max-w-full sm:max-w-[520px] select-none overflow-hidden sm:overflow-visible rounded-3xl " +
            "bg-[radial-gradient(circle_at_top,_rgba(64,255,198,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(99,102,241,0.16),_transparent_55%)] " +
            "backdrop-blur-md border border-white/10"
          }
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl">
            <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-xl" />
          </div>

          {/* Orbit */}
          {/* Single real orbit container with pause via state */}
          <Orbit setActiveKey={setActiveKey} setRef={setRef} computeLine={computeLine} />

          {/* Central name */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative grid place-items-center h-[118px] w-[118px] rounded-full"
              initial={{ scale: 0.98, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/25 via-transparent to-indigo-500/25 blur-[1px]" />
              <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-md border border-white/10" />
              <div className="relative text-center px-4">
                <div className="text-[12px] tracking-[0.34em] uppercase text-cyan-200/80">Nandini</div>
                <div className="mt-1 text-xl font-semibold text-white drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                  Nandini
                </div>
              </div>
            </motion.div>
          </div>

          {/* Connection line */}
          <svg className="pointer-events-none absolute inset-0" aria-hidden="true">
            {line ? (
              <>
                <defs>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(34,211,238,0.95)" />
                    <stop offset="1" stopColor="rgba(99,102,241,0.95)" />
                  </linearGradient>
                </defs>
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="url(#lineGlow)"
                  strokeWidth={2}
                  opacity={0.95}
                />
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="rgba(34,211,238,0.35)"
                  strokeWidth={6}
                  opacity={0.35}
                  strokeLinecap="round"
                />
              </>
            ) : null}
          </svg>
        </div>

        
      </div>
    </footer>
  );
}

function Orbit({
  setActiveKey,
  setRef,
  computeLine,
}: {
  setActiveKey: React.Dispatch<React.SetStateAction<string | null>>;
  setRef: (key: string) => (el: HTMLAnchorElement | null) => void;
  computeLine: (key: string | null) => void;
}) {
  const [paused, setPaused] = React.useState(false);
  const ORBIT_RADIUS = 132;

  const activate = (key: string) => {
    setPaused(true);
    setActiveKey(key);
    computeLine(key);
    requestAnimationFrame(() => computeLine(key));
  };

  const clearActive = () => {
    setPaused(false);
    setActiveKey(null);
    computeLine(null);
  };

  return (
    <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 scale-[0.55] min-[400px]:scale-75 sm:scale-100">
      <div
        className="footer-orbit absolute inset-0"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {/* Each icon positioned around circle, counter-rotated so it stays upright */}
        {socials.map((s, idx) => {
          const angle = (idx / socials.length) * 360;
          return (
            <a
              key={s.key}
              ref={setRef(s.key)}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="absolute left-1/2 top-1/2 -ml-6 -mt-6 block h-12 w-12 rounded-full outline-none"
              style={{
                transform: `rotate(${angle}deg) translateX(${ORBIT_RADIUS}px) rotate(${-angle}deg)`,
                color: "rgba(255,255,255,0.92)",
              }}
              onMouseEnter={() => activate(s.key)}
              onMouseLeave={clearActive}
              onMouseMove={() => computeLine(s.key)}
              onFocus={() => activate(s.key)}
              onBlur={clearActive}
              onClick={() => activate(s.key)}
            >
              <div
                className={
                  "grid h-12 w-12 place-items-center rounded-full border backdrop-blur-md transition duration-200 " +
                  "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.18)] " +
                  "hover:scale-110 hover:border-cyan-300/30 focus-visible:scale-110 focus-visible:border-cyan-300/30 " +
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200/70"
                }
              >
                <div className="text-cyan-100/90">
                  <Icon name={s.key} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <style jsx>{`
        .footer-orbit {
          animation: footer-orbit-spin 34s linear infinite;
          transform-origin: 50% 50%;
          will-change: transform;
        }

        @keyframes footer-orbit-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
