"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Obstacle = { id: number; x: number; width: number; height: number };
type Stage = "school" | "corona" | "community";

const stages: Record<Stage, { label: string; sky: string; ground: string; obstacle: string; badge: string }> = {
  school: {
    label: "SCHOOL",
    sky: "from-[#17233b] via-[#172b48] to-[#f0a36f]",
    ground: "bg-[#283f43]",
    obstacle: "border-yellow-200 bg-yellow-300/80",
    badge: "TOP 3",
  },
  corona: {
    label: "CORONA",
    sky: "from-[#111b34] via-[#1d2853] to-[#522c66]",
    ground: "bg-[#252c4d]",
    obstacle: "border-cyan-100 bg-cyan-300/80",
    badge: "STILL HERE",
  },
  community: {
    label: "COMMUNITY",
    sky: "from-[#08242d] via-[#07545b] to-[#e19b65]",
    ground: "bg-[#174746]",
    obstacle: "border-fuchsia-100 bg-fuchsia-300/80",
    badge: "FOUND MY PEOPLE",
  },
};

const GROUND = 64;
const PLAYER_LEFT = 92;
const PLAYER_SIZE = 36;

export default function JourneyGame() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const playerY = useRef(0);
  const velocity = useRef(0);
  const obstacles = useRef<Obstacle[]>([]);
  const lastTime = useRef(0);
  const spawnTimer = useRef(0);
  const obstacleId = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const playing = useRef(false);
  const frame = useRef<number | null>(null);
  const [playerPosition, setPlayerPosition] = useState(0);
  const [visibleObstacles, setVisibleObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [stage, setStage] = useState<Stage>("school");
  const [message, setMessage] = useState("OPEN THE BOOK");
  const [state, setState] = useState<"ready" | "playing" | "finished">("ready");
  const [badge, setBadge] = useState("");

  const reset = useCallback(() => {
    obstacles.current = [];
    playerY.current = 0;
    velocity.current = 0;
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    setStage("school");
    setBadge("");
    setMessage("OPEN THE BOOK");
    setVisibleObstacles([]);
    playing.current = false;
    setState("ready");
  }, []);

  const start = useCallback(() => {
    if (state === "finished") {
      reset();
      return;
    }
    playing.current = true;
    setState("playing");
    setMessage("");
  }, [reset, state]);

  const jump = useCallback(() => {
    if (state !== "playing") {
      start();
      return;
    }
    if (playerY.current === 0) velocity.current = 760;
  }, [start, state]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [jump]);

  useEffect(() => {
    const tick = (time: number) => {
      const delta = Math.min((time - lastTime.current) / 1000, 0.05);
      lastTime.current = time;

      if (playing.current && arenaRef.current) {
        const width = arenaRef.current.clientWidth;
        const speed = 300 + Math.min(scoreRef.current * 2, 100);
        playerY.current = Math.max(0, playerY.current + velocity.current * delta);
        velocity.current -= 1950 * delta;
        spawnTimer.current += delta;

        if (spawnTimer.current > 1.05) {
          spawnTimer.current = 0;
          obstacles.current.push({
            id: obstacleId.current++,
            x: width + 30,
            width: 25 + Math.random() * 18,
            height: 30 + Math.random() * 32,
          });
        }

        obstacles.current = obstacles.current
          .map((item) => ({ ...item, x: item.x - speed * delta }))
          .filter((item) => item.x > -70);

        const hitIndex = obstacles.current.findIndex((item) => (
          item.x < PLAYER_LEFT + PLAYER_SIZE &&
          item.x + item.width > PLAYER_LEFT &&
          playerY.current + GROUND < GROUND + item.height
        ));

        if (hitIndex !== -1) {
          obstacles.current.splice(hitIndex, 1);
          livesRef.current -= 1;
          setLives(livesRef.current);
          setMessage(livesRef.current ? "KEEP GOING" : "TRY AGAIN");
          if (!livesRef.current) {
            playing.current = false;
            setState("ready");
          }
        }

        scoreRef.current += Math.round(delta * 10);
        setScore(scoreRef.current);

        const nextStage = scoreRef.current >= 160 ? "community" : scoreRef.current >= 75 ? "corona" : "school";
        if (nextStage !== stage) {
          setStage(nextStage);
          setBadge(stages[nextStage].badge);
          setMessage("");
          window.setTimeout(() => setBadge(""), 1200);
        }

        if (scoreRef.current >= 240) {
          playing.current = false;
          setState("finished");
          setBadge("JOURNEY COMPLETE");
        }

        setPlayerPosition(playerY.current);
        setVisibleObstacles([...obstacles.current]);
      }

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [stage]);

  const scene = stages[stage];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-3 py-20 md:px-8">
      <div
        ref={arenaRef}
        role="application"
        aria-label="Nandini's journey game"
        onPointerDown={jump}
        className={`relative h-[min(72vh,560px)] w-full max-w-6xl cursor-pointer overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-b ${scene.sky} shadow-[0_30px_120px_rgba(0,0,0,.5)]`}
      >
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:45px_45px]" />
        <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
          {scene.label}
        </div>
        <div className="absolute right-5 top-5 flex gap-1 text-lg" aria-label={`${lives} lives remaining`}>
          {[0, 1, 2].map((heart) => <span key={heart} className={heart < lives ? "opacity-100" : "opacity-20"}>♥</span>)}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16">
          <div className={`absolute inset-0 ${scene.ground}`} />
          <div className="absolute -top-1 left-0 right-0 h-1 bg-white/40 shadow-[0_0_16px_rgba(255,255,255,.6)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(135deg,transparent_45%,rgba(255,255,255,.3)_46%,transparent_48%)] [background-size:28px_28px]" />
        </div>

        <div style={{ bottom: `${GROUND + playerPosition}px`, left: PLAYER_LEFT }} className="absolute z-10 h-12 w-9 transition-transform">
          <div className="absolute left-1 top-0 h-7 w-7 rounded-full border-2 border-[#251d2a] bg-[#c6866a] shadow-[0_0_14px_rgba(255,190,150,.35)]" />
          <div className="absolute left-0 top-6 h-7 w-9 rounded-t-xl border-2 border-[#241e45] bg-[#5546a2]" />
          <div className="absolute left-0 top-11 h-3 w-3 rounded-full bg-[#1a1730]" />
          <div className="absolute right-0 top-11 h-3 w-3 rounded-full bg-[#1a1730]" />
          <div className="absolute left-2 top-2 h-1 w-1 rounded-full bg-[#241b25]" />
          <div className="absolute right-2 top-2 h-1 w-1 rounded-full bg-[#241b25]" />
        </div>

        {visibleObstacles.map((obstacle) => (
          <div key={obstacle.id} style={{ left: obstacle.x, bottom: GROUND, width: obstacle.width, height: obstacle.height }} className={`absolute z-10 rounded-t-lg border-2 shadow-[0_0_18px_rgba(255,255,255,.25)] ${scene.obstacle}`}>
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs">✦</span>
          </div>
        ))}

        {stage === "school" && state === "ready" && (
          <button type="button" onPointerDown={(event) => { event.stopPropagation(); start(); }} className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-xl border-2 border-yellow-200 bg-yellow-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-[#31220a] shadow-[0_0_30px_rgba(250,204,21,.45)] transition hover:scale-105">
            📚 Study
          </button>
        )}

        {message && state !== "finished" && (
          <div className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/35 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-white/85 backdrop-blur-md">{message}</div>
        )}

        {badge && (
          <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
            <div className="animate-bounce rounded-2xl border border-white/30 bg-black/40 px-6 py-4 text-center font-mono text-sm font-bold uppercase tracking-[0.22em] text-yellow-200 backdrop-blur-md">{badge}</div>
          </div>
        )}

        {state === "finished" && (
          <button type="button" onPointerDown={(event) => { event.stopPropagation(); reset(); }} className="absolute inset-0 z-40 grid place-items-center bg-black/30 backdrop-blur-[2px]">
            <span className="rounded-full border border-white/30 bg-black/40 px-5 py-3 font-mono text-xs uppercase tracking-widest text-white">Play again</span>
          </button>
        )}

        <div className="absolute bottom-5 left-5 z-20 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">↑ / space / tap</div>
        <div className="absolute bottom-5 right-5 z-20 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{score}m</div>
      </div>
    </main>
  );
}
