"use client";

import { motion } from "framer-motion";
import * as React from "react";

type FragmentKind = "<>" | "{}" | "[]" | "()" | "=>" | "const" | "===" | "java" | "<h1>" | "GC()";
const FRAGMENTS: FragmentKind[] = ["<>", "{}", "[]", "()", "=>", "const", "===", "java", "<h1>"];

type Point = { x: number; y: number };

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

const TILE_SIZE = 24;
const BASE_TICK_RATE = 120;
const MAX_LENGTH = 15;

function getRandomGridPoint() {
  if (typeof document === "undefined" || typeof window === "undefined") return { x: 0, y: 0 };
  
  const docW = document.documentElement.scrollWidth;
  const docH = document.documentElement.scrollHeight;
  const viewY = window.scrollY || 0;
  const viewH = window.innerHeight || docH;
  
  const cols = Math.max(1, Math.floor(docW / TILE_SIZE));
  
  const startRow = Math.max(0, Math.floor(viewY / TILE_SIZE));
  const endRow = Math.floor((viewY + viewH) / TILE_SIZE);
  const rowRange = Math.max(1, endRow - startRow);

  const col = Math.floor(Math.random() * cols);
  const row = startRow + Math.floor(Math.random() * (rowRange * 0.8)) + Math.floor(rowRange * 0.1);
  
  return { x: col * TILE_SIZE, y: row * TILE_SIZE };
}

export default function AmbientSnake() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  // We use a ref to hold the entire game state so the tick loop NEVER resets due to dependency changes (like scrolling)
  const gameState = React.useRef({
    snake: [] as Point[],
    dir: { x: 1, y: 0 },
    fragment: null as null | { kind: FragmentKind; x: number; y: number },
    gcQueue: 0,
    currentTickRate: BASE_TICK_RATE
  });

  const [, setTickNum] = React.useState(0);
  const [sparkle, setSparkle] = React.useState<Point | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
      const onResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, []);

  // Main game loop
  React.useEffect(() => {
    if (prefersReducedMotion) return;

    let timeoutId: number;

    const tick = () => {
      if (typeof document === "undefined" || typeof window === "undefined") return;

      const st = gameState.current;

      // Initialize game state if empty
      if (st.snake.length === 0) {
        const start = getRandomGridPoint();
        st.snake = [
          { x: start.x, y: start.y },
          { x: start.x - TILE_SIZE, y: start.y },
          { x: start.x - TILE_SIZE * 2, y: start.y }
        ];
        const target = getRandomGridPoint();
        st.fragment = { kind: FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)], x: target.x, y: target.y };
        st.dir = { x: 1, y: 0 };
      }

      const docW = document.documentElement.scrollWidth;
      const docH = document.documentElement.scrollHeight;
      const viewY = window.scrollY || 0;
      const viewH = window.innerHeight || docH;

      // SCROLL LOGIC: If the fragment is left behind because you scrolled, strictly relocate it to the current screen!
      if (st.fragment) {
        if (st.fragment.y < viewY || st.fragment.y > viewY + viewH) {
          const newTarget = getRandomGridPoint();
          const fragKind = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
          st.fragment = { kind: fragKind, x: newTarget.x, y: newTarget.y };
        }
      }

      // Pathfind towards fragment
      const head = st.snake[0];
      let nextDir = { ...st.dir };
      if (st.fragment) {
        const dx = st.fragment.x - head.x;
        const dy = st.fragment.y - head.y;

        const wantMoveX = Math.abs(dx) > Math.abs(dy);
        
        if (wantMoveX && dx !== 0) {
          const intendedX = dx > 0 ? 1 : -1;
          if (nextDir.x !== -intendedX) nextDir = { x: intendedX, y: 0 };
          else if (dy !== 0) nextDir = { x: 0, y: dy > 0 ? 1 : -1 };
        } else if (dy !== 0) {
          const intendedY = dy > 0 ? 1 : -1;
          if (nextDir.y !== -intendedY) nextDir = { x: 0, y: intendedY };
          else if (dx !== 0) nextDir = { x: dx > 0 ? 1 : -1, y: 0 };
        }
      }

      st.dir = nextDir;
      let newHeadX = head.x + nextDir.x * TILE_SIZE;
      let newHeadY = head.y + nextDir.y * TILE_SIZE;
      
      // Ensure snake wraps around document bounds safely
      if (newHeadX < 0) newHeadX = docW;
      if (newHeadX > docW) newHeadX = 0;
      if (newHeadY < 0) newHeadY = docH;
      if (newHeadY > docH) newHeadY = 0;

      const newHead = { x: newHeadX, y: newHeadY };
      const newSnake = [newHead, ...st.snake];
      let ate = false;

      // Eat logic
      if (st.fragment && Math.abs(newHead.x - st.fragment.x) < TILE_SIZE && Math.abs(newHead.y - st.fragment.y) < TILE_SIZE) {
        ate = true;
        setSparkle({ x: st.fragment.x, y: st.fragment.y });
        
        if (st.fragment.kind === "GC()") {
          // Shrink snake
          st.gcQueue += (st.snake.length - 3 + 1);
        }
        
        // Spawn new fragment on current screen
        const newTarget = getRandomGridPoint();
        const nextKind = newSnake.length >= MAX_LENGTH 
          ? "GC()" 
          : FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
          
        st.fragment = { kind: nextKind, x: newTarget.x, y: newTarget.y };

        setTimeout(() => setSparkle(null), 300);
      }

      // Maintain tail
      if (!ate) {
        newSnake.pop();
      } else if (st.fragment?.kind === "GC()") {
        newSnake.pop();
      }

      // Process shrinking (Garbage Collector)
      if (st.gcQueue > 0 && newSnake.length > 3) {
        newSnake.pop();
        st.gcQueue--;
      }

      st.snake = newSnake;

      // Force a React render with the new game state
      setTickNum((n) => n + 1);

      // Speed up drastically if the snake is left completely offscreen!
      let speed = BASE_TICK_RATE;
      
      // If you out-scroll the snake, it instantly teleports to the very edge of your new screen
      // and enters at absolute maximum velocity (2ms) so you can NEVER outrun it.
      if (newHead.y < viewY - 50) {
        speed = 2; 
        const shift = (viewY - 50) - newHead.y;
        st.snake = st.snake.map(s => ({ ...s, y: s.y + shift }));
      } else if (newHead.y > viewY + viewH + 50) {
        speed = 2;
        const shift = newHead.y - (viewY + viewH + 50);
        st.snake = st.snake.map(s => ({ ...s, y: s.y - shift }));
      }
      
      st.currentTickRate = speed;

      timeoutId = window.setTimeout(tick, speed);
    };

    timeoutId = window.setTimeout(tick, BASE_TICK_RATE);

    return () => window.clearTimeout(timeoutId);
  }, [prefersReducedMotion]); // Empty dependency array guarantees the loop NEVER resets!

  const { snake, fragment, dir, currentTickRate } = gameState.current;

  if (snake.length === 0) return null;

  const renderSize = isMobile ? 12 : 24; 
  const fontRenderSize = isMobile ? 10 : 18;

  let headRotation = 0;
  if (dir.x === 1) headRotation = 0;
  else if (dir.x === -1) headRotation = 180;
  else if (dir.y === 1) headRotation = 90;
  else if (dir.y === -1) headRotation = -90;

  return (
    <div
      className="hidden md:block pointer-events-none absolute left-0 top-0 w-full h-full z-0 opacity-60"
      style={{ overflow: "hidden" }}
    >
      {/* Snake Segments */}
      {snake.map((segment, index) => {
        const isHead = index === 0;
        const scale = isHead ? 1 : Math.max(0.6, 1 - (index * 0.03));
        const opacity = isHead ? 1 : Math.max(0.4, 1 - (index * 0.05));
        
        return (
          <div
            key={`${index}-${segment.x}-${segment.y}`}
            className="absolute flex items-center justify-center"
            style={{
              left: segment.x,
              top: segment.y,
              width: renderSize,
              height: renderSize,
              opacity: opacity,
              // Using dynamic transition so it correctly visually speeds up during hyper-speed mode!
              transition: `left ${currentTickRate}ms linear, top ${currentTickRate}ms linear`,
              zIndex: isHead ? 10 : 5,
            }}
          >
            <div 
              className="w-full h-full rounded-sm"
              style={{
                 backgroundColor: "#00FFCC",
                 boxShadow: "0 0 8px rgba(0,255,204,0.6)",
              }}
            />
            {isHead && (
              <div 
                className="absolute w-full h-full"
                style={{ transform: `rotate(${headRotation}deg)` }}
              >
                <div className="absolute bg-white rounded-full w-[20%] h-[20%] right-[15%] top-[20%]" style={{ boxShadow: "0 0 4px white" }} />
                <div className="absolute bg-white rounded-full w-[20%] h-[20%] right-[15%] bottom-[20%]" style={{ boxShadow: "0 0 4px white" }} />
              </div>
            )}
          </div>
        );
      })}

      {sparkle && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.5 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute"
          style={{ 
            left: sparkle.x, 
            top: sparkle.y, 
            transform: "translate(-50%, -50%)",
            color: "#FFCC00",
            textShadow: "0 0 10px #FFCC00"
          }}
        >
          ✨
        </motion.div>
      )}

      {fragment && (
        <div
          className="absolute font-bold flex items-center justify-center"
          style={{
            left: fragment.x,
            top: fragment.y,
            transform: "translate(-50%, -50%)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: fontRenderSize,
            color: fragment.kind === "GC()" ? "#FF0055" : "#FFCC00",
            filter: fragment.kind === "GC()" ? "drop-shadow(0 0 10px rgba(255, 0, 85, 0.9))" : "drop-shadow(0 0 8px rgba(255, 204, 0, 0.8))",
            zIndex: 1,
            animation: fragment.kind === "GC()" ? "pulse 1s infinite" : "none",
          }}
        >
          {fragment.kind}
        </div>
      )}
    </div>
  );
}
