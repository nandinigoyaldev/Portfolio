/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { motion } from "framer-motion";
import * as React from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export default function CometShower() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [comets, setComets] = React.useState<{ id: number; delay: number; left: number; duration: number }[]>([]);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    // Generate a fixed number of comets with random properties
    const newComets = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      left: Math.random() * 100, // Random starting X position (%)
      duration: 3 + Math.random() * 4, // 3-7s duration
    }));

    setComets(newComets);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || comets.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-transparent">
      {comets.map((comet) => (
        <motion.div
          key={comet.id}
          className="absolute top-0 w-[2px] h-[40px] bg-gradient-to-b from-transparent via-cyan-400 to-white rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          style={{ left: `${comet.left}%`, opacity: 0 }}
          animate={{
            top: ["-5%", "110%"],
            left: [`${comet.left}%`, `${comet.left - 15}%`], // Slight angle
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: comet.duration,
            delay: comet.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
