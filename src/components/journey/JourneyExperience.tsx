"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { journeyAudio, SurfaceType, AudioState } from "./audioManager";
import {
  renderChildhoodScene,
  renderCovidScene,
  renderCatchingUpScene,
  renderGrade11CorridorScene,
  renderGrade12RecoveryScene,
  renderCollegeCampusScene,
  renderProgrammingScene,
  renderDevFestScene,
  renderCommunityScene,
  renderPresentStudioScene,
} from "./art/sceneRenderers";
import { drawInteractiveObject } from "./art/objectRenderers";
import { drawPlayer, PlayerState } from "./art/characterRenderers";

export type ChapterId =
  | "childhood"
  | "covid"
  | "catching-up"
  | "grade-11"
  | "grade-12"
  | "after-school"
  | "programming"
  | "devfest"
  | "community"
  | "present";

export type SceneObject = {
  id: string;
  label: string;
  x: number;
  kind: "desk" | "book" | "laptop" | "document" | "terminal" | "booth" | "npc" | "door" | "microphone" | "plant" | "bench" | "window" | "noticeboard" | "stage" | "doorway";
  dialogue: string[];
  required?: boolean;
  trigger?: "proximity" | "pass";
  avoidable?: boolean;
};

export type Chapter = {
  id: ChapterId;
  title: string;
  subtitle: string;
  objective: string;
  palette: { sky: string; back: string; mid: string; floor: string; accent: string };
  objects: SceneObject[];
  exitX: number;
  surface: SurfaceType;
  audioAmbienceDesc: string;
  audioMusicDesc: string;
};

const chapters: Chapter[] = [
  {
    id: "childhood",
    title: "Childhood",
    subtitle: "Before everything changed",
    objective: "Inspect three school memories.",
    palette: { sky: "#c9baa2", back: "#877360", mid: "#5a4332", floor: "#855836", accent: "#f6ca52" },
    exitX: 1160,
    surface: "wood",
    audioAmbienceDesc: "Classroom ceiling fan hum, outside sparrow whistles, faint bell",
    audioMusicDesc: "Soothing felt-piano pentatonic melody in C major",
    objects: [
      {
        id: "blackboard",
        label: "teacher's desk & blackboard",
        x: 580,
        kind: "desk",
        required: true,
        dialogue: [
          "I was usually in the top three at school. I loved when a proof clicked on the board.",
          "We solved equations like (X² + B²) = C² and x² + y² = r² before the bell rang: it made me feel like any problem could be broken down.",
        ],
      },
      {
        id: "book",
        label: "open notebook",
        x: 340,
        kind: "book",
        required: true,
        dialogue: [
          "This is what confidence looked like back then: pages of formulas, neat step-by-step solutions, and big plans.",
        ],
      },
      {
        id: "trophy",
        label: "honor trophy",
        x: 890,
        kind: "book",
        required: true,
        dialogue: [
          "Not a perfect story, but a quiet reminder that consistency and showing up always mattered.",
        ],
      },
    ],
  },
  {
    id: "covid",
    title: "COVID",
    subtitle: "Learning from a quiet room",
    objective: "Start the online class and finish the first lesson.",
    palette: { sky: "#182333", back: "#213e4a", mid: "#475c75", floor: "#3b2820", accent: "#72d9e8" },
    exitX: 1040,
    surface: "carpet",
    audioAmbienceDesc: "Quiet room tone, ticking clock, outside breeze & sweet sparrows",
    audioMusicDesc: "Gentle, reflective electric piano chords in A minor",
    objects: [
      {
        id: "laptop",
        label: "online class laptop",
        x: 590,
        kind: "laptop",
        required: true,
        dialogue: [
          "At first, my parents did not want online classes for 9th.",
          "Eventually we realised waiting would cost me a year. I began studying online by myself.",
        ],
      },
      {
        id: "lesson",
        label: "lesson notes",
        x: 350,
        kind: "book",
        required: true,
        dialogue: [
          "Ten days before the result, I finally joined school online.",
          "I crossed 80%. It was the first proof that I could learn without the old routine.",
        ],
      },
    ],
  },
  {
    id: "catching-up",
    title: "Catching Up",
    subtitle: "Starting from behind",
    objective: "Arrange the missed timetable pages.",
    palette: { sky: "#101626", back: "#1c253b", mid: "#593d22", floor: "#1c1410", accent: "#f0abfc" },
    exitX: 1080,
    surface: "wood",
    audioAmbienceDesc: "Late-night clock ticking, paper rustles, quiet night wind",
    audioMusicDesc: "Quiet, determined study cadence in D minor",
    objects: [
      {
        id: "timetable",
        label: "revision timetable",
        x: 380,
        kind: "document",
        dialogue: [
          "I entered 10th after half the year was gone. The syllabus felt like a wall: quadratic equations x = (-b ± √(b² - 4ac)) / 2a, science modules, and grammar.",
          "I had to build a route through it day by day.",
        ],
      },
      {
        id: "papers",
        label: "exam papers",
        x: 760,
        kind: "book",
        dialogue: [
          "I finished with 71%. It was difficult, but it proved I could catch up from behind under immense pressure.",
        ],
      },
    ],
  },
  {
    id: "grade-11",
    title: "11th Grade",
    subtitle: "A new school, a difficult corridor",
    objective: "Find a quiet place to breathe.",
    palette: { sky: "#44344d", back: "#543d60", mid: "#36263f", floor: "#6d5875", accent: "#d69bf1" },
    exitX: 1360,
    surface: "tile",
    audioAmbienceDesc: "Cavernous corridor echo, distant locker clatter, subtle hallway hum",
    audioMusicDesc: "Moody, tense atmospheric minor chords reflecting social tension",
    objects: [
      {
        id: "loud-group",
        label: "crowded clique by the lockers",
        x: 380,
        kind: "npc",
        required: false,
        avoidable: true,
        dialogue: [
          "A loud group filled the corridor. I took the longer, quieter route past the benches instead.",
        ],
      },
      {
        id: "shoulder-check",
        label: "passing student",
        x: 670,
        kind: "npc",
        required: true,
        trigger: "pass",
        dialogue: [
          "Some encounters were not avoidable. A shoulder caught mine as I passed.",
          "I kept walking. I did not have words for what was happening yet.",
        ],
      },
      {
        id: "quiet-bench",
        label: "quiet alcove bench",
        x: 940,
        kind: "bench",
        required: true,
        dialogue: [
          "I found a quiet bench between classes. No friends, no conversation—just a minute to breathe.",
        ],
      },
      {
        id: "classroom-door",
        label: "classroom door",
        x: 1180,
        kind: "doorway",
        required: true,
        dialogue: ["The bell rang. Getting through the next room was the only goal."],
      },
    ],
  },
  {
    id: "grade-12",
    title: "12th Grade",
    subtitle: "The hardest stretch & recovery",
    objective: "Open the window and check the recovery progress.",
    palette: { sky: "#2d2633", back: "#594348", mid: "#7ebbe6", floor: "#423235", accent: "#ed9a9a" },
    exitX: 1080,
    surface: "wood",
    audioAmbienceDesc: "Morning breeze through sheer curtains, outside sparrows, soothing silence",
    audioMusicDesc: "Tender, healing acoustic ambient progression in D major",
    objects: [
      {
        id: "window",
        label: "morning window",
        x: 350,
        kind: "door",
        dialogue: [
          "Typhoid, dengue, stress, and the fear of returning to the same environment.",
          "I lost weight and my health suffered. Recovery did not happen overnight, but each sunrise brought a little more strength.",
        ],
      },
      {
        id: "calendar",
        label: "recovery calendar",
        x: 780,
        kind: "document",
        dialogue: [
          "It took around two and a half years to feel like I was finding myself again. Healing is a quiet, continuous journey.",
        ],
      },
    ],
  },
  {
    id: "after-school",
    title: "After School",
    subtitle: "College admissions & campus pathways",
    objective: "Choose the next application.",
    palette: { sky: "#2b6399", back: "#6d3935", mid: "#3c7536", floor: "#8f99a3", accent: "#8fe2c0" },
    exitX: 1180,
    surface: "grass",
    audioAmbienceDesc: "Outdoor park breeze, rustling leaves, sparrows singing across campus",
    audioMusicDesc: "Uplifting, expansive outdoor acoustic arpeggios in E major",
    objects: [
      {
        id: "ignou",
        label: "IGNOU application folder",
        x: 420,
        kind: "document",
        dialogue: [
          "I did not really understand what college was supposed to look like.",
          "I only knew I wanted to continue. An IGNOU form from a cyber café became part of the route.",
        ],
      },
      {
        id: "iics",
        label: "IICS admission desk",
        x: 820,
        kind: "document",
        dialogue: [
          "I ended up in IICS and IGNOU together. It was not a conventional plan, but it was an authentic beginning.",
        ],
      },
    ],
  },
  {
    id: "programming",
    title: "Learning Programming",
    subtitle: "Digital workspace & logic lab",
    objective: "Inspect the terminal and complete the logic circuit.",
    palette: { sky: "#090d16", back: "#1e1e1e", mid: "#00ffcc", floor: "#0e131d", accent: "#67e8f9" },
    exitX: 1140,
    surface: "tile",
    audioAmbienceDesc: "Mechanical keyboard typing clicks, quiet cooling fan hum, circuit beep",
    audioMusicDesc: "Mellow retro synthwave arpeggiated chords in F minor",
    objects: [
      {
        id: "terminal",
        label: "development terminal",
        x: 430,
        kind: "terminal",
        dialogue: [
          "For a long time I studied random tutorials because I did not know what real software engineering was.",
          "It took time and patience to learn how to learn properly.",
        ],
      },
      {
        id: "logic",
        label: "interactive logic circuit",
        x: 820,
        kind: "terminal",
        dialogue: [
          "Building the skill one small problem at a time: understand the requirements, make, break, and iterate.",
        ],
      },
    ],
  },
  {
    id: "devfest",
    title: "DevFest 2025",
    subtitle: "The map gets bigger — Grand Conference",
    objective: "Talk to the organiser and visit the main stage.",
    palette: { sky: "#0f0c1a", back: "#2b1c45", mid: "#9333ea", floor: "#181329", accent: "#f0abfc" },
    exitX: 1280,
    surface: "carpet",
    audioAmbienceDesc: "Subtle convention hall atmosphere, distant murmurs, periodic warm applause",
    audioMusicDesc: "Inspiring, warm festival synth progression in G major",
    objects: [
      {
        id: "organiser",
        label: "GDG organiser",
        x: 380,
        kind: "npc",
        dialogue: [
          "An online friend guided me to GDG Noida DevFest in 2025.",
          "That first event showed me an inspiring world of people building, mentoring, and learning together.",
        ],
      },
      {
        id: "stage",
        label: "main keynote stage",
        x: 820,
        kind: "microphone",
        dialogue: [
          "I did not know yet how much hosting, volunteering, mentoring, and community organizing would become central to my journey.",
        ],
      },
    ],
  },
  {
    id: "community",
    title: "Community",
    subtitle: "Open collaboration makerspace & hackathon hub",
    objective: "Help three community stations.",
    palette: { sky: "#263f3c", back: "#142523", mid: "#45b39d", floor: "#182a28", accent: "#75e0bd" },
    exitX: 1260,
    surface: "tile",
    audioAmbienceDesc: "Gentle workshop activity, keyboard taps, collaborative chatter",
    audioMusicDesc: "Warm, collaborative electric piano melody in A major",
    objects: [
      {
        id: "mentor",
        label: "mentor station",
        x: 340,
        kind: "npc",
        dialogue: [
          "I started mentoring and sharing what I knew, even while I was still learning myself.",
        ],
      },
      {
        id: "host",
        label: "host podium",
        x: 620,
        kind: "microphone",
        dialogue: [
          "Hosting and organizing taught me that making technical spaces welcoming and empathetic is an essential skill.",
        ],
      },
      {
        id: "hackathon",
        label: "hackathon team table",
        x: 920,
        kind: "booth",
        dialogue: [
          "Hackathons, open-source projects, and new friends made the tech journey feel collaborative and inspiring.",
        ],
      },
    ],
  },
  {
    id: "present",
    title: "Present",
    subtitle: "Nandini's studio — Still becoming",
    objective: "Sit at the desk and save the next chapter.",
    palette: { sky: "#0c1524", back: "#2b1c47", mid: "#c86846", floor: "#1a1820", accent: "#8ee7bb" },
    exitX: 1140,
    surface: "wood",
    audioAmbienceDesc: "Gentle rain against twilight window, warm lo-fi tape hum, vinyl warmth",
    audioMusicDesc: "Soothing lo-fi chillhop soul chords in Fmaj7 with mellow Rhodes voicing",
    objects: [
      {
        id: "workspace",
        label: "developer battle station",
        x: 520,
        kind: "terminal",
        dialogue: [
          "Right now I am balancing university studies, programming, open source projects, tech content, and community leadership.",
          "I still do not know exactly where it all leads. I am learning to appreciate the process.",
        ],
      },
      {
        id: "plant",
        label: "ceramic monstera plant",
        x: 860,
        kind: "plant",
        dialogue: [
          "The journey is not finished. This is the save point, not the ending.",
        ],
      },
    ],
  },
];

// Helper: Formats mathematical formulas or equations with dedicated overflow-safe badge styling
function formatDialogueContent(text: string) {
  const mathRegex = /(\([A-Za-z0-9²\+\-\*\/\s\.]+\)\s*=\s*[A-Za-z0-9²\+\-\*\/\s\.]+|[A-Za-z0-9\(\)]*[²³\^][A-Za-z0-9\+\-\*\/\s\(\)]*|\b[xyzabcXYZABC]²\s*[\+\-\*\/]\s*[xyzabcXYZABC]²(?:\s*=\s*[xyzabcXYZABC]²)?|\([Xx]²\s*[\+]\s*[Bb]²\)\s*=\s*[Cc]²|\([Xx]²\s*[\+]\s*[Bb]²\)|x\s*=\s*\([^\)]+\)\s*\/\s*2a)/g;

  const parts = text.split(mathRegex);

  return (
    <span className="inline leading-relaxed break-words [overflow-wrap:anywhere]">
      {parts.map((part, index) => {
        if (!part) return null;
        if (
          part.includes("²") ||
          part.includes("³") ||
          part.includes("√") ||
          part.match(/\([Xx]²\s*[\+]\s*[Bb]²\)/) ||
          part.match(/[A-Za-z0-9]+²/)
        ) {
          return (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 my-0.5 mx-1 rounded-md bg-white/10 border border-cyan-400/30 font-mono text-cyan-300 font-bold max-w-full overflow-x-auto whitespace-nowrap text-sm sm:text-base align-middle shadow-sm"
              title="Mathematical expression"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

// Architectural scene-specific exits
function drawChapterExit(
  ctx: CanvasRenderingContext2D,
  chapterId: ChapterId,
  exitX: number,
  cameraX: number,
  horizon: number,
  accent: string
) {
  const sx = exitX - cameraX;
  if (sx < -140 || sx > 1200) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(sx, horizon + 2, 35, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  switch (chapterId) {
    case "childhood": {
      ctx.fillStyle = "#4a3322";
      ctx.fillRect(sx - 35, horizon - 120, 70, 120);
      ctx.fillStyle = "#6d4c33";
      ctx.fillRect(sx - 30, horizon - 115, 60, 115);
      ctx.fillStyle = "#a8d8ea";
      ctx.fillRect(sx - 22, horizon - 105, 44, 45);
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(sx + 16, horizon - 58, 6, 12);
      ctx.fillStyle = accent;
      ctx.font = "bold 9px monospace";
      ctx.fillText("CORRIDOR ➜", sx - 28, horizon - 130);
      break;
    }
    case "devfest": {
      ctx.fillStyle = "#1e1338";
      ctx.fillRect(sx - 45, horizon - 130, 90, 130);
      ctx.fillStyle = "#2d1f4f";
      ctx.fillRect(sx - 40, horizon - 125, 80, 125);
      ctx.fillStyle = "#ff007f";
      ctx.fillRect(sx - 1, horizon - 125, 2, 125);
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(sx - 32, horizon - 62, 28, 6);
      ctx.fillRect(sx + 4, horizon - 62, 28, 6);
      ctx.fillStyle = "#022c22";
      ctx.fillRect(sx - 24, horizon - 150, 48, 16);
      ctx.fillStyle = "#00ff66";
      ctx.font = "bold 9px monospace";
      ctx.fillText("EXIT ➜", sx - 16, horizon - 138);
      break;
    }
    case "after-school": {
      ctx.fillStyle = "#5c6b73";
      ctx.fillRect(sx - 45, horizon - 140, 90, 140);
      ctx.fillStyle = "#25537d";
      ctx.fillRect(sx - 32, horizon - 130, 64, 130);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px monospace";
      ctx.fillText("CAMPUS GATE", sx - 32, horizon - 148);
      break;
    }
    case "programming": {
      ctx.fillStyle = "#051824";
      ctx.fillRect(sx - 38, horizon - 135, 76, 135);
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 3;
      ctx.strokeRect(sx - 38, horizon - 135, 76, 135);
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 9px monospace";
      ctx.fillText("PORTAL // NEXT", sx - 35, horizon - 145);
      break;
    }
    default: {
      ctx.fillStyle = "#182033";
      ctx.fillRect(sx - 40, horizon - 130, 80, 130);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(sx - 40, horizon - 130, 80, 130);
      ctx.fillStyle = accent;
      ctx.font = "bold 9px monospace";
      ctx.fillText("CONTINUE ➜", sx - 28, horizon - 140);
      break;
    }
  }
}

export default function JourneyExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef(new Set<string>());
  const player = useRef<PlayerState>({ x: 180, y: 0, walking: false, facing: "right", stepFrame: 0 });
  const playerVelY = useRef(0);
  const camera = useRef(0);
  const tickRef = useRef(0);
  const animation = useRef<number | null>(null);

  const completedRef = useRef<string[]>([]);
  const dialogueRef = useRef<{ speaker: string; lines: string[] } | null>(null);
  const encounteredRef = useRef(new Set<string>());
  const reachedExitRef = useRef(false);
  const justCompletedRef = useRef(false);
  const transitionRef = useRef(false);
  const lastFootstepTime = useRef(0);

  const [chapter, setChapter] = useState(0);
  const [near, setNear] = useState<SceneObject | null>(null);
  const [dialogue, setDialogue] = useState<{ speaker: string; lines: string[] } | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [chapterMenu, setChapterMenu] = useState(false);
  const [audioMenu, setAudioMenu] = useState(false);
  const [reachedExit, setReachedExit] = useState(false);

  // Audio mixer state
  const [audioLevels, setAudioLevels] = useState<AudioState>(() => journeyAudio.getState());

  // Interactive logic puzzle state for Programming chapter
  const [showLogicPuzzle, setShowLogicPuzzle] = useState(false);
  const [gateInputA, setGateInputA] = useState(false);
  const [gateInputB, setGateInputB] = useState(false);
  const [gateType, setGateType] = useState<"AND" | "XOR">("AND");
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem("journey-completed") ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const activeChapter = chapters[chapter];
  const requiredObjects = activeChapter.objects.filter((object) => object.required !== false);
  const requiredFound = requiredObjects.filter((object) => completed.includes(`${activeChapter.id}:${object.id}`)).length;
  const isComplete = requiredFound >= requiredObjects.length && reachedExit;

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  // Audio ducking: When dialogue is active, smoothly duck background music and voices
  useEffect(() => {
    dialogueRef.current = dialogue;
    journeyAudio.setDucking(dialogue !== null);
    setAudioLevels(journeyAudio.getState());
  }, [dialogue]);

  // Sync Audio Chapter & Soundscapes
  useEffect(() => {
    journeyAudio.setChapter(activeChapter.id);
  }, [activeChapter.id]);

  // Keyboard controls
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current.add(event.code);
      if (event.code === "KeyE" || event.code === "Space") event.preventDefault();
    };
    const up = (event: KeyboardEvent) => keys.current.delete(event.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Typewriter effect for dialogue
  useEffect(() => {
    if (!dialogue) return;
    const text = dialogue.lines[lineIndex] ?? "";
    const resetTimer = window.setTimeout(() => setTyped(""), 0);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 18);
    return () => {
      window.clearTimeout(resetTimer);
      window.clearInterval(timer);
    };
  }, [dialogue, lineIndex]);

  const advanceDialogue = () => {
    if (!dialogue) return;
    const line = dialogue.lines[lineIndex] ?? "";
    if (typed.length < line.length) {
      setTyped(line);
    } else if (lineIndex < dialogue.lines.length - 1) {
      setLineIndex((current) => current + 1);
    } else {
      setDialogue(null);
      setLineIndex(0);
    }
  };

  // Main Canvas Render & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const renderScene = (width: number, height: number, camX: number, t: number) => {
      const sCtx = { ctx: context, width, height, cameraX: camX, tick: t };
      switch (activeChapter.id) {
        case "childhood":
          renderChildhoodScene(sCtx);
          break;
        case "covid":
          renderCovidScene(sCtx);
          break;
        case "catching-up":
          renderCatchingUpScene(sCtx);
          break;
        case "grade-11":
          renderGrade11CorridorScene(sCtx);
          break;
        case "grade-12":
          renderGrade12RecoveryScene(sCtx);
          break;
        case "after-school":
          renderCollegeCampusScene(sCtx);
          break;
        case "programming":
          renderProgrammingScene(sCtx);
          break;
        case "devfest":
          renderDevFestScene(sCtx);
          break;
        case "community":
          renderCommunityScene(sCtx);
          break;
        case "present":
          renderPresentStudioScene(sCtx);
          break;
      }
    };

    const tick = () => {
      tickRef.current += 1;
      const t = tickRef.current;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const horizon = height * (activeChapter.id === "after-school" ? 0.58 : 0.62);

      const left = keys.current.has("ArrowLeft") || keys.current.has("KeyA");
      const right = keys.current.has("ArrowRight") || keys.current.has("KeyD");
      const jump = keys.current.has("ArrowUp") || keys.current.has("KeyW");

      if (dialogueRef.current) {
        player.current.walking = false;
        renderScene(width, height, camera.current, t);
        activeChapter.objects.forEach((object) =>
          drawInteractiveObject(context, object, camera.current, horizon, activeChapter.palette.accent, t, activeChapter.id)
        );
        drawChapterExit(context, activeChapter.id, activeChapter.exitX, camera.current, horizon, activeChapter.palette.accent);
        drawPlayer(context, player.current, player.current.x - camera.current, horizon, t);
        animation.current = window.requestAnimationFrame(tick);
        return;
      }

      // Walking physics & sound
      player.current.walking = left || right;
      if (left) {
        player.current.facing = "left";
        player.current.x -= 3.2;
      } else if (right) {
        player.current.facing = "right";
        player.current.x += 3.2;
      }
      player.current.x = Math.max(90, Math.min(activeChapter.exitX + 80, player.current.x));

      // Trigger realistic footsteps on chapter-specific surface
      const now = performance.now();
      if (player.current.walking && player.current.y === 0 && now - lastFootstepTime.current > 290) {
        journeyAudio.playFootstep(activeChapter.surface);
        lastFootstepTime.current = now;
      }

      // Jump physics
      if (jump && player.current.y === 0) {
        playerVelY.current = -9.5;
        journeyAudio.playFootstep(activeChapter.surface);
      }
      player.current.y += playerVelY.current;
      playerVelY.current += 0.46;
      if (player.current.y > 0) {
        player.current.y = 0;
        playerVelY.current = 0;
      }

      // 11th Grade scripted encounters
      if (activeChapter.id === "grade-11") {
        const scripted = activeChapter.objects.find((object) => object.trigger === "pass" && player.current.x >= object.x);
        if (scripted && !encounteredRef.current.has(scripted.id)) {
          encounteredRef.current.add(scripted.id);
          const memoryId = `${activeChapter.id}:${scripted.id}`;
          if (!completedRef.current.includes(memoryId)) {
            const next = [...completedRef.current, memoryId];
            completedRef.current = next;
            setCompleted(next);
            localStorage.setItem("journey-completed", JSON.stringify(next));
          }
          journeyAudio.play("memory");
          setDialogue({ speaker: scripted.label, lines: scripted.dialogue });
        }
      }

      // Exit detection
      if (player.current.x >= activeChapter.exitX && !reachedExitRef.current) {
        reachedExitRef.current = true;
        setReachedExit(true);
        journeyAudio.play("door");
        const requiredComplete = activeChapter.objects
          .filter((object) => object.required !== false)
          .every((object) => completedRef.current.includes(`${activeChapter.id}:${object.id}`));
        if (requiredComplete) justCompletedRef.current = true;
      }

      // Smooth camera follow
      camera.current += (player.current.x - width * 0.35 - camera.current) * 0.08;
      camera.current = Math.max(0, Math.min(Math.max(0, activeChapter.exitX - width * 0.6), camera.current));

      // Render layers
      renderScene(width, height, camera.current, t);

      // Objects
      activeChapter.objects.forEach((object) =>
        drawInteractiveObject(context, object, camera.current, horizon, activeChapter.palette.accent, t, activeChapter.id)
      );

      // Exit Doorway
      drawChapterExit(context, activeChapter.id, activeChapter.exitX, camera.current, horizon, activeChapter.palette.accent);

      // Player
      drawPlayer(context, player.current, player.current.x - camera.current, horizon, t);

      // Nearby object detection
      const nearest = activeChapter.objects
        .map((object) => ({ object, distance: Math.abs(object.x - player.current.x) }))
        .filter(({ object, distance }) => object.trigger !== "pass" && distance < 120)
        .sort((a, b) => a.distance - b.distance)[0]?.object ?? null;
      setNear(nearest);

      animation.current = window.requestAnimationFrame(tick);
    };

    animation.current = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", resize);
      if (animation.current) window.cancelAnimationFrame(animation.current);
    };
  }, [activeChapter]);

  useEffect(() => () => journeyAudio.dispose(), []);

  const recordCompletion = (memoryId: string) => {
    if (completedRef.current.includes(memoryId)) return;
    const next = [...completedRef.current, memoryId];
    completedRef.current = next;
    setCompleted(next);
    localStorage.setItem("journey-completed", JSON.stringify(next));
    const requiredComplete = requiredObjects.every((object) => next.includes(`${activeChapter.id}:${object.id}`));
    if (requiredComplete && reachedExitRef.current) justCompletedRef.current = true;
  };

  const interact = () => {
    if (!near || dialogue) return;

    if (activeChapter.id === "programming" && near.id === "logic") {
      setShowLogicPuzzle(true);
      journeyAudio.play("terminalBeep");
      return;
    }

    if (activeChapter.id === "devfest" && near.id === "stage") {
      journeyAudio.play("applause");
    } else if (near.id === "trophy") {
      journeyAudio.play("bell");
    } else if (near.id === "window") {
      journeyAudio.play("sparrow");
    } else if (near.id === "terminal") {
      journeyAudio.play("terminalBeep");
    } else {
      journeyAudio.play("memory");
    }

    const memoryId = `${activeChapter.id}:${near.id}`;
    recordCompletion(memoryId);
    setDialogue({ speaker: near.label, lines: near.dialogue });
  };

  // Auto transition to next chapter
  useEffect(() => {
    if (!isComplete || !justCompletedRef.current || dialogue || transitionRef.current) return;
    transitionRef.current = true;
    if (chapter === chapters.length - 1) return;
    const timer = window.setTimeout(() => {
      setChapter((current) => current + 1);
      player.current.x = 180;
      camera.current = 0;
      reachedExitRef.current = false;
      setReachedExit(false);
      encounteredRef.current.clear();
      justCompletedRef.current = false;
      transitionRef.current = false;
      setNear(null);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [chapter, dialogue, isComplete]);

  // Keybindings for interact & dialogue
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "KeyE" || event.code === "Space") {
        if (dialogue) advanceDialogue();
        else interact();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const selectChapter = (index: number) => {
    const item = chapters[index];
    const unlocked = index === 0 || completed.some((id) => id.startsWith(`${item.id}:`));
    if (!unlocked) return;
    setChapter(index);
    player.current.x = 180;
    camera.current = 0;
    reachedExitRef.current = false;
    setReachedExit(false);
    encounteredRef.current.clear();
    justCompletedRef.current = false;
    transitionRef.current = false;
    setNear(null);
    setChapterMenu(false);
  };

  // Logic Gate Puzzle solver handler
  const evaluateCircuit = (inA: boolean, inB: boolean, type: "AND" | "XOR") => {
    const output = type === "AND" ? inA && inB : inA !== inB;
    if (output) {
      setPuzzleSolved(true);
      journeyAudio.play("applause");
      recordCompletion("programming:logic");
    } else {
      journeyAudio.play("terminalBeep");
    }
  };

  const chapterStatus = useMemo(
    () =>
      chapters.map((item, index) => ({
        ...item,
        done: item.objects.filter((object) => object.required !== false).every((object) => completed.includes(`${item.id}:${object.id}`)),
        index,
      })),
    [completed]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white select-none">
      <canvas
        ref={canvasRef}
        className="h-[min(100vh,800px)] min-h-[560px] w-full block cursor-pointer"
        onPointerDown={interact}
      />

      {/* Top Header HUD (Responsive & overflow safe) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-6 md:p-8 max-w-full">
        <div className="min-w-0 max-w-full">
          <p
            className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{ color: activeChapter.palette.accent }}
          >
            THE JOURNEY // {String(chapter + 1).padStart(2, "0")} OF 10
          </p>
          <h1 className="mt-1 text-xl sm:text-2xl md:text-4xl font-black tracking-tight drop-shadow-md break-words max-w-full">
            {activeChapter.title}
          </h1>
          <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-white/70 max-w-md break-words leading-normal">
            {activeChapter.subtitle}
          </p>
        </div>

        {/* Audio & Menu Actions */}
        <div className="pointer-events-auto flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setAudioMenu((open) => !open)}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-3 py-2 font-mono text-[11px] uppercase tracking-wider backdrop-blur-md transition hover:bg-white/15 active:scale-95 shadow-lg"
          >
            <span>AUDIO ⚙</span>
            <span className={audioLevels.isMuted ? "text-red-400" : "text-emerald-400"}>
              {audioLevels.isMuted ? "MUTED" : `${Math.round(audioLevels.masterVolume * 100)}%`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setChapterMenu((open) => !open)}
            className="rounded-lg border border-white/20 bg-black/50 px-3 py-2 font-mono text-[11px] uppercase tracking-wider backdrop-blur-md transition hover:bg-white/15 active:scale-95 shadow-lg"
          >
            CHAPTERS
          </button>
        </div>
      </div>

      {/* Bottom Center Status & Objective Pill (Contained & non-overflowing) */}
      <div className="pointer-events-none absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 text-center w-[min(540px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)]">
        <div className="pointer-events-auto inline-block max-w-full truncate rounded-full border border-white/20 bg-black/60 px-4 sm:px-5 py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-white/90 shadow-2xl backdrop-blur-md transition hover:border-white/40">
          {near ? `[ E ] — Inspect ${near.label}` : "A / D Move · W Jump · E Interact"}
        </div>
        <p className="mt-1.5 text-[10px] sm:text-xs font-mono text-white/60 drop-shadow break-words leading-tight">
          {activeChapter.objective} · {requiredFound}/{requiredObjects.length} Found ·{" "}
          {reachedExit ? "Exit Reached ✓" : "Walk to Exit"}
        </p>
      </div>

      {/* Back to Portfolio Link */}
      <Link
        href="/"
        className="absolute bottom-5 sm:bottom-7 left-3 sm:left-5 rounded-lg border border-white/20 bg-black/50 px-3 py-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70 backdrop-blur-md transition hover:bg-white/20 hover:text-white shadow-lg"
      >
        ← PORTFOLIO
      </Link>

      {/* Dialogue Modal Overlay (Non-overflowing, handles math & equations cleanly) */}
      {dialogue && (
        <div
          role="dialog"
          aria-label="Dialogue"
          className="absolute inset-x-3 sm:inset-x-6 bottom-20 sm:bottom-24 z-20 mx-auto w-[min(740px,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)]"
        >
          <div
            onClick={advanceDialogue}
            className="cursor-pointer border-2 border-white/30 bg-[#0c1322]/95 p-4 sm:p-6 md:p-7 shadow-2xl shadow-black/80 backdrop-blur-xl rounded-2xl max-h-[55vh] overflow-y-auto box-border transition hover:border-white/45"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5 mb-3">
              <p
                className="font-mono text-xs font-bold uppercase tracking-[0.25em]"
                style={{ color: activeChapter.palette.accent }}
              >
                {dialogue.speaker}
              </p>
              <span className="font-mono text-[10px] text-white/50 tracking-wider">
                STEP {lineIndex + 1}/{dialogue.lines.length}
              </span>
            </div>
            <div className="min-h-[3.8rem] text-sm sm:text-base md:text-lg leading-relaxed text-white/95 font-sans break-words [overflow-wrap:anywhere]">
              {formatDialogueContent(typed)}
              <span className="inline-block animate-pulse text-cyan-400 font-mono ml-0.5">▮</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] sm:text-xs font-mono text-white/40 uppercase tracking-widest">
              <span>Click or press [ E ] to advance</span>
              <span>{lineIndex < dialogue.lines.length - 1 ? "Next ➜" : "Finish ✓"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Logic Gate Puzzle Modal (Programming Chapter) */}
      {showLogicPuzzle && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#09111e] p-5 sm:p-6 shadow-2xl shadow-cyan-900/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-mono text-xs sm:text-sm uppercase tracking-widest text-cyan-400 font-bold">
                LOGIC CIRCUIT PUZZLE
              </h3>
              <button
                type="button"
                onClick={() => setShowLogicPuzzle(false)}
                className="text-white/50 hover:text-white text-lg font-mono px-2 py-1"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 text-xs text-white/70 leading-relaxed">
              Toggle the circuit inputs so the output state equals{" "}
              <span className="text-cyan-400 font-bold font-mono">1 (TRUE)</span>.
            </p>

            {/* Circuit Diagram Visual */}
            <div className="my-5 rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs">
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const next = !gateInputA;
                    setGateInputA(next);
                    journeyAudio.play("terminalBeep");
                    evaluateCircuit(next, gateInputB, gateType);
                  }}
                  className={`rounded-lg px-3.5 py-2 font-bold transition shadow ${
                    gateInputA ? "bg-cyan-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  INPUT A: {gateInputA ? "1" : "0"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextType = gateType === "AND" ? "XOR" : "AND";
                    setGateType(nextType);
                    journeyAudio.play("inspect");
                    evaluateCircuit(gateInputA, gateInputB, nextType);
                  }}
                  className="rounded-lg border border-purple-400/50 bg-purple-900/40 px-3 py-2 text-purple-300 hover:bg-purple-800/60 transition shadow"
                >
                  GATE: {gateType}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !gateInputB;
                    setGateInputB(next);
                    journeyAudio.play("terminalBeep");
                    evaluateCircuit(gateInputA, next, gateType);
                  }}
                  className={`rounded-lg px-3.5 py-2 font-bold transition shadow ${
                    gateInputB ? "bg-cyan-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  INPUT B: {gateInputB ? "1" : "0"}
                </button>
              </div>

              <div className="mt-4 text-center border-t border-white/10 pt-3">
                <p className="text-[10px] text-white/50 uppercase tracking-widest">CIRCUIT OUTPUT</p>
                <p
                  className={`text-xl sm:text-2xl font-black mt-1 ${
                    puzzleSolved ? "text-emerald-400 animate-bounce" : "text-amber-400"
                  }`}
                >
                  {(gateType === "AND" ? gateInputA && gateInputB : gateInputA !== gateInputB)
                    ? "1 (SOLVED! ✓)"
                    : "0 (OFF)"}
                </p>
              </div>
            </div>

            {puzzleSolved && (
              <p className="text-center font-mono text-xs text-emerald-400">
                Circuit closed! Problem analyzed, broken down, and solved.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowLogicPuzzle(false)}
              className="mt-4 w-full rounded-lg bg-cyan-600/80 py-2.5 font-mono text-xs uppercase tracking-widest text-white hover:bg-cyan-500 transition"
            >
              {puzzleSolved ? "CONTINUE JOURNEY" : "CLOSE PUZZLE"}
            </button>
          </div>
        </div>
      )}

      {/* Audio Mixer / Settings Modal (Proper independent audio buses) */}
      {audioMenu && (
        <div className="absolute right-2 sm:right-6 top-16 sm:top-20 z-30 w-[min(360px,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/20 bg-[#0c1424]/95 p-4 sm:p-5 shadow-2xl shadow-black/90 backdrop-blur-2xl max-h-[82vh] overflow-y-auto box-border">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                AUDIO MIXER
              </h3>
              <p className="text-[10px] text-white/50">5-Bus Balanced Audio Architecture</p>
            </div>
            <button
              type="button"
              onClick={() => setAudioMenu(false)}
              className="text-white/50 hover:text-white text-base font-mono px-2 py-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 space-y-3.5">
            {/* Master Volume */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-white/80">
                <span>MASTER VOLUME</span>
                <span>{Math.round(audioLevels.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioLevels.masterVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  journeyAudio.setMasterVolume(val);
                  setAudioLevels(journeyAudio.getState());
                }}
                className="mt-1 w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Music Volume */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-white/80">
                <span>SOUNDTRACK / MUSIC</span>
                <span>{Math.round(audioLevels.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioLevels.musicVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  journeyAudio.setMusicVolume(val);
                  setAudioLevels(journeyAudio.getState());
                }}
                className="mt-1 w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Ambient Environment (Birds, Wind, Fans, Leaves) */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-white/80">
                <span>AMBIENT ENVIRONMENT (BIRDS/WIND/FAN)</span>
                <span>{Math.round(audioLevels.ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioLevels.ambientVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  journeyAudio.setAmbientVolume(val);
                  setAudioLevels(journeyAudio.getState());
                }}
                className="mt-1 w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Background Voices (Subtle, Distant) */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-white/80">
                <span>BACKGROUND VOICES (SUBTLE)</span>
                <span>{Math.round(audioLevels.voicesVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioLevels.voicesVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  journeyAudio.setVoicesVolume(val);
                  setAudioLevels(journeyAudio.getState());
                }}
                className="mt-1 w-full accent-blue-400 cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-white/80">
                <span>SOUND EFFECTS & FOOTSTEPS</span>
                <span>{Math.round(audioLevels.effectsVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={audioLevels.effectsVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  journeyAudio.setEffectsVolume(val);
                  setAudioLevels(journeyAudio.getState());
                }}
                className="mt-1 w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Dialogue Ducking status */}
            <div className="flex items-center justify-between text-[10px] font-mono rounded bg-white/5 px-2.5 py-1.5 border border-white/10">
              <span className="text-white/60">DIALOGUE DUCKING:</span>
              <span className={audioLevels.isDucked ? "text-cyan-300 font-bold" : "text-emerald-400"}>
                {audioLevels.isDucked ? "ACTIVE (DUCKED -60%)" : "READY"}
              </span>
            </div>

            {/* Current Active Soundscape info */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-[10px] font-mono space-y-1">
              <p className="text-white/40 uppercase tracking-widest">ACTIVE SOUNDSCAPE</p>
              <p className="text-emerald-300 font-bold break-words">{activeChapter.audioAmbienceDesc}</p>
              <p className="text-purple-300 break-words">{activeChapter.audioMusicDesc}</p>
            </div>

            {/* Mute Button */}
            <button
              type="button"
              onClick={() => {
                journeyAudio.toggleMute();
                setAudioLevels(journeyAudio.getState());
              }}
              className={`w-full rounded-lg py-2 font-mono text-xs uppercase tracking-widest transition ${
                audioLevels.isMuted
                  ? "bg-red-500/80 text-white hover:bg-red-500"
                  : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {audioLevels.isMuted ? "UNMUTE ALL AUDIO" : "MUTE ALL AUDIO"}
            </button>
          </div>
        </div>
      )}

      {/* Chapter Selection Menu (Responsive, non-overflowing) */}
      {chapterMenu && (
        <div className="absolute right-2 sm:right-6 top-16 sm:top-20 z-30 max-h-[75vh] w-[min(360px,calc(100vw-1.5rem))] max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-2xl border border-white/20 bg-[#0c1424]/95 p-3 shadow-2xl backdrop-blur-2xl box-border">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <p className="font-mono text-xs uppercase tracking-widest text-white/50">Select Chapter</p>
            <button
              type="button"
              onClick={() => setChapterMenu(false)}
              className="text-white/50 hover:text-white font-mono px-2 py-1"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {chapterStatus.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => selectChapter(item.index)}
                className={`flex w-full items-center justify-between rounded-xl p-3 text-left text-xs transition ${
                  item.index === chapter
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="font-mono text-[10px] text-white/40 mr-2">
                    {String(item.index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-bold">{item.title}</span>
                  <p className="text-[10px] text-white/45 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <span className={item.done ? "text-emerald-400 font-bold shrink-0" : "text-white/20 shrink-0"}>
                  {item.done ? "✓" : "·"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
