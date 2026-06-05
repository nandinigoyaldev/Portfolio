"use client";

import { useEffect } from "react";

export default function CursorAndEffects() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const cursorDot = document.getElementById("cursor-dot");

    const onMove = (e: MouseEvent) => {
      if (!cursorDot || !cursor) return;
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      cursor.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 500, fill: "forwards" }
      );
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{`
        body { cursor: none; }
        #cursor {
          width: 20px; height: 20px;
          border: 2px solid #D5534D;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.1s, width 0.3s, height 0.3s;
          transform: translate(-50%, -50%);
          left: -100px; top: -100px;
        }
        #cursor-dot {
          width: 4px; height: 4px;
          background: #D5534D;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          left: -100px; top: -100px;
        }
        a:hover ~ #cursor, button:hover ~ #cursor {
          transform: scale(2.5) translate(-20%, -20%);
          background-color: rgba(213, 83, 77, 0.1);
          border-color: transparent;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .grain-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='100%25'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="hidden md:block" id="cursor" aria-hidden="true" />
      <div className="hidden md:block" id="cursor-dot" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand opacity-10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-purple-300 opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-yellow-200 opacity-20 rounded-full blur-3xl animate-float animation-delay-4000" />
      </div>
    </>
  );
}

