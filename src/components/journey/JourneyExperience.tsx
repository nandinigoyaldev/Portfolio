"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { journeyAudio } from "./audioManager";

type ChapterId =
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

type SceneObject = {
  id: string;
  label: string;
  x: number;
  kind: "desk" | "book" | "laptop" | "document" | "terminal" | "booth" | "npc" | "door" | "microphone" | "plant" | "bench" | "window" | "noticeboard" | "stage" | "doorway";
  dialogue: string[];
  required?: boolean;
  trigger?: "proximity" | "pass";
  avoidable?: boolean;
};

type Chapter = {
  id: ChapterId;
  title: string;
  subtitle: string;
  objective: string;
  palette: { sky: string; back: string; mid: string; floor: string; accent: string };
  objects: SceneObject[];
  exitX: number;
};

const chapters: Chapter[] = [
  {
    id: "childhood",
    title: "Childhood",
    subtitle: "Before everything changed",
    objective: "Inspect three school memories.",
    palette: { sky: "#18243d", back: "#263c5a", mid: "#40566d", floor: "#263a42", accent: "#f6ca52" },
    exitX: 1080,
    objects: [
      { id: "blackboard", label: "blackboard", x: 620, kind: "desk", required: true, dialogue: ["I was usually in the top three at school.", "I liked the feeling of understanding something before the bell rang."] },
      { id: "book", label: "notebook", x: 340, kind: "book", required: true, dialogue: ["This is what confidence looked like back then: a notebook full of answers and plans."] },
      { id: "trophy", label: "trophy", x: 890, kind: "book", required: true, dialogue: ["Not a perfect story. Just a small reminder that I kept showing up."] },
    ],
  },
  {
    id: "covid",
    title: "COVID",
    subtitle: "Learning from a quiet room",
    objective: "Start the online class and finish the first lesson.",
    palette: { sky: "#0d1426", back: "#1d2b45", mid: "#293d54", floor: "#20293a", accent: "#72d9e8" },
    exitX: 980,
    objects: [
      { id: "laptop", label: "laptop", x: 590, kind: "laptop", required: true, dialogue: ["At first, my parents did not want online classes for 9th.", "Eventually we realised waiting would cost me a year. I began studying online by myself."] },
      { id: "lesson", label: "lesson notes", x: 350, kind: "book", required: true, dialogue: ["Ten days before the result, I finally joined school online.", "I crossed 80%. It was the first proof that I could learn without the old routine."] },
    ],
  },
  {
    id: "catching-up",
    title: "Catching Up",
    subtitle: "Starting from behind",
    objective: "Arrange the missed timetable pages.",
    palette: { sky: "#22233b", back: "#443c58", mid: "#66516a", floor: "#39344b", accent: "#f0abfc" },
    exitX: 1060,
    objects: [
      { id: "timetable", label: "timetable", x: 380, kind: "document", dialogue: ["I entered 10th after half the year had passed.", "A lot of the material felt like seeing it for the first time. I had to build a route through it."] },
      { id: "papers", label: "exam papers", x: 760, kind: "book", dialogue: ["I finished with 71%. It was difficult, but it was still a finish line."] },
    ],
  },
  {
    id: "grade-11",
    title: "11th Grade",
    subtitle: "A new school, a difficult room",
    objective: "Find a quiet place to breathe.",
    palette: { sky: "#1b182c", back: "#33243e", mid: "#4b3150", floor: "#2d263c", accent: "#d69bf1" },
    exitX: 1320,
    objects: [
      { id: "loud-group", label: "students by the noticeboard", x: 360, kind: "npc", required: false, avoidable: true, dialogue: ["A loud group filled the corridor. I could take the long route past the benches instead."] },
      { id: "shoulder-check", label: "passing student", x: 650, kind: "npc", required: true, trigger: "pass", dialogue: ["Some encounters were not avoidable. A shoulder caught mine as I passed.", "I kept walking. I did not have words for what was happening yet."] },
      { id: "quiet-bench", label: "quiet bench", x: 920, kind: "bench", required: true, dialogue: ["I found a quiet bench between classes. No friends, no conversation—just a minute to breathe."] },
      { id: "classroom-door", label: "classroom door", x: 1130, kind: "doorway", required: true, dialogue: ["The bell rang. Getting through the next room was the only goal."] },
    ],
  },
  {
    id: "grade-12",
    title: "12th Grade",
    subtitle: "The hardest stretch",
    objective: "Open the window and let the room breathe.",
    palette: { sky: "#171622", back: "#302d3a", mid: "#4c4146", floor: "#352f3c", accent: "#ed9a9a" },
    exitX: 1040,
    objects: [
      { id: "window", label: "window", x: 350, kind: "door", dialogue: ["Typhoid, dengue, stress, and the fear of returning to the same environment.", "I lost a lot of weight and my health suffered. Recovery did not happen quickly."] },
      { id: "calendar", label: "calendar", x: 780, kind: "document", dialogue: ["It took around two and a half years to feel like I was finding myself again. I am still recovering."] },
    ],
  },
  {
    id: "after-school",
    title: "After School",
    subtitle: "Asking for a way forward",
    objective: "Choose the next application.",
    palette: { sky: "#19223a", back: "#2d4161", mid: "#53627c", floor: "#314052", accent: "#8fe2c0" },
    exitX: 1120,
    objects: [
      { id: "ignou", label: "IGNOU form", x: 420, kind: "document", dialogue: ["I did not really understand what college was supposed to look like.", "I only knew I wanted to continue. Somehow, an IGNOU form from a cyber café became part of the route."] },
      { id: "iics", label: "IICS admission", x: 820, kind: "document", dialogue: ["I ended up in IICS and IGNOU together. It was not a perfect plan, but it was a beginning."] },
    ],
  },
  {
    id: "programming",
    title: "Learning Programming",
    subtitle: "Finding the right way to learn",
    objective: "Complete the tiny logic circuit.",
    palette: { sky: "#071525", back: "#102d45", mid: "#16475a", floor: "#102c37", accent: "#67e8f9" },
    exitX: 1120,
    objects: [
      { id: "terminal", label: "terminal", x: 430, kind: "terminal", dialogue: ["For a long time I studied random things because I did not know what tech really was.", "It took time to learn how to learn it properly."] },
      { id: "logic", label: "logic puzzle", x: 820, kind: "terminal", dialogue: ["Now I am building the skill one small problem at a time: understand, make, break, repeat."] },
    ],
  },
  {
    id: "devfest",
    title: "DevFest 2025",
    subtitle: "The map gets bigger",
    objective: "Talk to the organiser and visit the stage.",
    palette: { sky: "#17152e", back: "#30235a", mid: "#5b3e78", floor: "#352650", accent: "#f0abfc" },
    exitX: 1220,
    objects: [
      { id: "organiser", label: "organiser", x: 380, kind: "npc", dialogue: ["An online friend guided me to GDG Noida DevFest in 2025.", "That first event showed me a whole world of people building and learning together."] },
      { id: "stage", label: "stage", x: 820, kind: "microphone", dialogue: ["I did not know yet how much hosting, volunteering, mentoring and organising would become part of my life."] },
    ],
  },
  {
    id: "community",
    title: "Community",
    subtitle: "Finding my people",
    objective: "Help three community stations.",
    palette: { sky: "#0e202d", back: "#174452", mid: "#23716b", floor: "#194a4b", accent: "#75e0bd" },
    exitX: 1240,
    objects: [
      { id: "mentor", label: "mentor station", x: 340, kind: "npc", dialogue: ["I started mentoring and sharing what I knew, even while I was still learning myself."] },
      { id: "host", label: "host station", x: 620, kind: "microphone", dialogue: ["Hosting and organising taught me that making a space welcoming is a real technical skill too."] },
      { id: "hackathon", label: "hackathon table", x: 900, kind: "booth", dialogue: ["Hackathons, volunteering, open source and new contacts made tech feel less lonely."] },
    ],
  },
  {
    id: "present",
    title: "Present",
    subtitle: "Still becoming",
    objective: "Sit at the desk and save the next chapter.",
    palette: { sky: "#080d19", back: "#142238", mid: "#1e3a52", floor: "#162c39", accent: "#8ee7bb" },
    exitX: 1100,
    objects: [
      { id: "workspace", label: "developer desk", x: 510, kind: "terminal", dialogue: ["Right now I am balancing studies, programming, projects, content and community work.", "I still do not know exactly where it takes me. I am learning to be okay with that."] },
      { id: "plant", label: "small plant", x: 850, kind: "plant", dialogue: ["The journey is not finished. This is the save point, not the ending."] },
    ],
  },
];

function drawPixelScene(context: CanvasRenderingContext2D, width: number, height: number, chapter: Chapter, playerX: number) {
  context.imageSmoothingEnabled = false;
  const horizon = height * 0.6;
  context.fillStyle = chapter.palette.sky;
  context.fillRect(0, 0, width, height);
  const fill = (color: string, x: number, y: number, w: number, h: number) => {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
  };
  const stroke = (color: string, x: number, y: number, w: number, h: number) => {
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.strokeRect(x, y, w, h);
  };

  if (chapter.id === "childhood") {
    fill("#344c66", 0, horizon - 170, width, 170);
    fill("#9c744b", 0, horizon, width, height - horizon);
    for (let x = 30; x < width; x += 150) {
      fill("#b8e3ee", x, horizon - 140, 92, 56);
      stroke("#e8d6a4", x, horizon - 140, 92, 56);
      fill("#d8a65a", x + 44, horizon - 140, 4, 56);
    }
    fill("#5f4738", 0, horizon - 16, width, 16);
    for (let x = 70; x < width; x += 190) {
      fill("#6b4935", x, horizon - 34, 88, 12);
      fill("#6b4935", x + 12, horizon - 22, 8, 28);
      fill("#6b4935", x + 68, horizon - 22, 8, 28);
    }
  } else if (chapter.id === "covid") {
    fill("#25344c", 0, horizon - 210, width, 210);
    fill("#171e2e", 0, horizon, width, height - horizon);
    fill("#5c3b4b", 60, horizon - 180, 260, 100);
    fill("#1b263b", 80, horizon - 150, 220, 70);
    fill("#6e4f65", 45, horizon - 78, 290, 18);
    fill("#40365d", 0, horizon - 230, width, 10);
    fill("#202c3e", 720, horizon - 125, 170, 125);
    fill("#72d9e8", 740, horizon - 105, 130, 60);
    stroke("#a5eaf2", 740, horizon - 105, 130, 60);
    fill("#c99764", 680, horizon - 30, 250, 12);
  } else if (chapter.id === "catching-up") {
    fill("#56616e", 0, horizon - 180, width, 180);
    fill("#9a9b91", 0, horizon, width, height - horizon);
    fill("#3e4650", 0, horizon - 10, width, 10);
    for (let x = 0; x < width; x += 150) {
      fill("#727d88", x, horizon - 145, 90, 110);
      fill("#d0c59d", x + 14, horizon - 126, 62, 34);
      fill("#424a54", x + 105, horizon - 150, 5, 150);
    }
    fill("#4b5560", 0, horizon + 75, width, 8);
    context.globalAlpha = 0.35;
    context.beginPath();
    context.moveTo(0, horizon + 10);
    context.lineTo(width, horizon - 20);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.fill();
    context.globalAlpha = 1;
  } else if (chapter.id === "grade-11") {
    fill("#4c3b53", 0, horizon - 210, width, 210);
    fill("#8b7182", 0, horizon, width, height - horizon);
    fill("#302839", 0, horizon - 8, width, 8);
    for (let x = 30; x < width; x += 210) {
      fill("#3d3044", x, horizon - 175, 120, 115);
      stroke("#bc93b7", x, horizon - 175, 120, 115);
      fill("#d2ab67", x + 42, horizon - 140, 38, 34);
      fill("#644861", x + 8, horizon - 45, 104, 8);
    }
    for (let x = 110; x < width; x += 270) {
      fill("#6d4c50", x, horizon - 28, 110, 12);
      fill("#4b3944", x + 10, horizon - 16, 8, 35);
      fill("#4b3944", x + 92, horizon - 16, 8, 35);
    }
    fill("#e1b4c6", 30, horizon - 202, 180, 34);
    context.fillStyle = "#392b42";
    context.font = "12px monospace";
    context.fillText("NEW TERM / NEW ROOM", 42, horizon - 180);
  } else if (chapter.id === "grade-12") {
    fill("#3c3540", 0, horizon - 230, width, 230);
    fill("#5b4b4d", 0, horizon, width, height - horizon);
    fill("#20202d", 90, horizon - 195, 190, 130);
    fill("#9b7c88", 105, horizon - 180, 160, 100);
    stroke("#d8b8b2", 105, horizon - 180, 160, 100);
    fill("#312f3d", 500, horizon - 220, 300, 180);
    fill("#776273", 530, horizon - 190, 240, 120);
    fill("#bd9f75", 0, horizon - 10, width, 10);
    fill("#d3b3ac", 820, horizon - 155, 70, 125);
  } else if (chapter.id === "after-school") {
    fill("#6d8b9b", 0, horizon - 210, width, 210);
    fill("#61727c", 0, horizon, width, height - horizon);
    fill("#d7bd77", 0, horizon - 12, width, 12);
    for (let x = 50; x < width; x += 210) {
      fill("#e7e2ca", x, horizon - 160, 120, 95);
      stroke("#2d4352", x, horizon - 160, 120, 95);
      fill("#2d4352", x + 18, horizon - 138, 84, 18);
      fill("#3f5964", x + 20, horizon - 105, 80, 8);
    }
    fill("#355a6c", 0, horizon - 45, width, 25);
  } else if (chapter.id === "programming") {
    fill("#071525", 0, horizon - 220, width, 220);
    fill("#0b2637", 0, horizon, width, height - horizon);
    for (let x = -20; x < width; x += 80) {
      context.strokeStyle = "rgba(103,232,249,.12)";
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 40; y < horizon; y += 50) {
      context.strokeStyle = "rgba(103,232,249,.1)";
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    fill("#123f51", 90, horizon - 170, 300, 110);
    fill("#67e8f9", 108, horizon - 150, 264, 70);
    fill("#102c37", 540, horizon - 150, 230, 70);
    context.fillStyle = "#9cecf5";
    context.font = "14px monospace";
    context.fillText("> build();", 560, horizon - 115);
  } else if (chapter.id === "devfest") {
    fill("#34205e", 0, horizon - 220, width, 220);
    fill("#251a42", 0, horizon, width, height - horizon);
    fill("#f0abfc", 0, horizon - 205, width, 8);
    fill("#6b3f91", 150, horizon - 170, 260, 120);
    fill("#9d6bd0", 180, horizon - 150, 200, 80);
    fill("#c6f4f2", 620, horizon - 190, 220, 135);
    fill("#423064", 650, horizon - 170, 160, 90);
    fill("#f0abfc", 0, horizon - 12, width, 12);
    for (let x = 40; x < width; x += 180) fill("#4b3470", x, horizon - 35, 100, 20);
  } else if (chapter.id === "community") {
    fill("#1c555b", 0, horizon - 220, width, 220);
    fill("#1a3e45", 0, horizon, width, height - horizon);
    for (let x = 40; x < width; x += 210) {
      fill("#efcb85", x, horizon - 180, 150, 110);
      fill("#1c555b", x + 15, horizon - 160, 120, 70);
      fill("#75e0bd", x + 28, horizon - 145, 90, 8);
    }
    fill("#a8e7c7", 0, horizon - 12, width, 12);
    fill("#2d6c61", 100, horizon - 55, 100, 18);
    fill("#2d6c61", 420, horizon - 55, 100, 18);
    fill("#2d6c61", 740, horizon - 55, 100, 18);
  } else {
    fill("#172b40", 0, horizon - 220, width, 220);
    fill("#10232e", 0, horizon, width, height - horizon);
    fill("#29485b", 80, horizon - 170, 420, 120);
    fill("#8ee7bb", 110, horizon - 145, 360, 65);
    fill("#1b3341", 580, horizon - 190, 220, 140);
    fill("#263e4d", 600, horizon - 170, 180, 100);
    fill("#8ee7bb", 0, horizon - 10, width, 10);
    fill("#496d65", 830, horizon - 100, 30, 90);
    fill("#7abb82", 800, horizon - 130, 90, 45);
  }

  context.fillStyle = chapter.palette.accent;
  context.globalAlpha = 0.1;
  context.beginPath();
  context.arc(playerX, horizon - 90, 120, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function drawObject(context: CanvasRenderingContext2D, object: SceneObject, cameraX: number, horizon: number, accent: string) {
  const x = object.x - cameraX;
  if (x < -140 || x > 1100) return;
  context.fillStyle = "rgba(0,0,0,.2)";
  context.fillRect(x - 35, horizon + 28, 70, 10);
  context.strokeStyle = accent;
  context.lineWidth = 3;
  context.fillStyle = "#182033";

  if (object.kind === "desk" || object.kind === "book") {
    context.fillRect(x - 52, horizon - 30, 104, 18);
    context.fillRect(x - 42, horizon - 12, 8, 42);
    context.fillRect(x + 34, horizon - 12, 8, 42);
    if (object.kind === "book") {
      context.fillStyle = accent;
      context.fillRect(x - 20, horizon - 48, 40, 16);
    }
  } else if (object.kind === "laptop" || object.kind === "terminal") {
    context.fillRect(x - 45, horizon - 55, 90, 55);
    context.strokeRect(x - 45, horizon - 55, 90, 55);
    context.fillStyle = accent;
    context.fillRect(x - 31, horizon - 41, 62, 25);
    context.fillStyle = "#27374a";
    context.fillRect(x - 58, horizon, 116, 10);
  } else if (object.kind === "document") {
    context.fillStyle = "#f4ead4";
    context.fillRect(x - 28, horizon - 70, 56, 76);
    context.strokeRect(x - 28, horizon - 70, 56, 76);
    context.fillStyle = "#8c7d72";
    for (let line = 0; line < 4; line += 1) context.fillRect(x - 18, horizon - 53 + line * 12, 36, 3);
  } else if (object.kind === "door" || object.kind === "booth") {
    context.fillRect(x - 48, horizon - 150, 96, 150);
    context.strokeRect(x - 48, horizon - 150, 96, 150);
    context.fillStyle = accent;
    context.fillRect(x - 5, horizon - 78, 10, 10);
  } else if (object.kind === "microphone") {
    context.fillRect(x - 5, horizon - 104, 10, 104);
    context.beginPath();
    context.arc(x, horizon - 116, 22, 0, Math.PI * 2);
    context.fill();
  } else if (object.kind === "plant") {
    context.fillRect(x - 22, horizon - 10, 44, 38);
    context.fillStyle = accent;
    context.fillRect(x - 5, horizon - 75, 10, 66);
    context.fillRect(x - 42, horizon - 72, 42, 10);
    context.fillRect(x + 5, horizon - 50, 42, 10);
  } else if (object.kind === "bench") {
    context.fillStyle = "#6d4c50";
    context.fillRect(x - 58, horizon - 28, 116, 12);
    context.fillRect(x - 45, horizon - 16, 8, 34);
    context.fillRect(x + 37, horizon - 16, 8, 34);
  } else if (object.kind === "window") {
    context.fillStyle = "#9b7c88";
    context.fillRect(x - 55, horizon - 140, 110, 110);
    context.strokeRect(x - 55, horizon - 140, 110, 110);
    context.fillStyle = "#d6b5c5";
    context.fillRect(x - 48, horizon - 133, 96, 96);
  } else if (object.kind === "noticeboard") {
    context.fillStyle = "#8c694d";
    context.fillRect(x - 70, horizon - 120, 140, 90);
    context.fillStyle = accent;
    for (let note = 0; note < 4; note += 1) context.fillRect(x - 52 + note * 28, horizon - 100, 18, 22);
  } else if (object.kind === "stage") {
    context.fillStyle = "#6b3f91";
    context.fillRect(x - 80, horizon - 70, 160, 70);
    context.fillStyle = accent;
    context.fillRect(x - 65, horizon - 52, 130, 8);
    context.fillRect(x - 65, horizon - 32, 90, 8);
  } else if (object.kind === "doorway") {
    context.fillStyle = "#392b42";
    context.fillRect(x - 42, horizon - 150, 84, 150);
    context.strokeRect(x - 42, horizon - 150, 84, 150);
    context.fillStyle = accent;
    context.fillRect(x - 5, horizon - 78, 10, 10);
  } else if (object.kind === "npc") {
    const variant = object.id.length % 3;
    context.fillStyle = variant === 0 ? "#d29a83" : variant === 1 ? "#b97768" : "#e0b08f";
    context.fillRect(x - 13, horizon - 78, 26, 26);
    context.fillStyle = variant === 0 ? "#d05d75" : variant === 1 ? "#4c8ca4" : "#d5a94e";
    context.fillRect(x - 17, horizon - 52, 34, 36);
    context.fillStyle = "#252238";
    context.fillRect(x - 14, horizon - 16, 9, 20);
    context.fillRect(x + 5, horizon - 16, 9, 20);
    if (object.avoidable) {
      context.fillStyle = "rgba(255,255,255,.32)";
      context.fillRect(x - 25, horizon - 92, 50, 3);
    }
  } else {
    context.fillRect(x - 40, horizon - 100, 80, 100);
  }
}

function drawExit(context: CanvasRenderingContext2D, x: number, cameraX: number, horizon: number, accent: string) {
  const screenX = x - cameraX;
  if (screenX < -120 || screenX > 1100) return;
  context.fillStyle = "#182033";
  context.fillRect(screenX - 46, horizon - 154, 92, 154);
  context.strokeStyle = accent;
  context.lineWidth = 4;
  context.strokeRect(screenX - 46, horizon - 154, 92, 154);
  context.fillStyle = accent;
  context.fillRect(screenX - 6, horizon - 80, 12, 12);
  context.font = "11px monospace";
  context.fillText("EXIT", screenX - 19, horizon - 170);
}

export default function JourneyExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef(new Set<string>());
  const player = useRef({ x: 180, y: 0, velocityY: 0, walking: false });
  const camera = useRef(0);
  const animation = useRef<number | null>(null);
  const completedRef = useRef<string[]>([]);
  const dialogueRef = useRef<{ speaker: string; lines: string[] } | null>(null);
  const encounteredRef = useRef(new Set<string>());
  const reachedExitRef = useRef(false);
  const justCompletedRef = useRef(false);
  const transitionRef = useRef(false);
  const [chapter, setChapter] = useState(0);
  const [near, setNear] = useState<SceneObject | null>(null);
  const [dialogue, setDialogue] = useState<{ speaker: string; lines: string[] } | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(localStorage.getItem("journey-completed") ?? "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [chapterMenu, setChapterMenu] = useState(false);
  const [muted, setMuted] = useState(false);
  const [reachedExit, setReachedExit] = useState(false);

  const activeChapter = chapters[chapter];
  const requiredObjects = activeChapter.objects.filter((object) => object.required !== false);
  const requiredFound = requiredObjects.filter((object) => completed.includes(`${activeChapter.id}:${object.id}`)).length;
  const isComplete = requiredFound >= requiredObjects.length && reachedExit;

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useEffect(() => {
    dialogueRef.current = dialogue;
  }, [dialogue]);

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

  useEffect(() => {
    if (!dialogue) return;
    const text = dialogue.lines[lineIndex] ?? "";
    const resetTimer = window.setTimeout(() => setTyped(""), 0);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 22);
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

    const tick = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const left = keys.current.has("ArrowLeft") || keys.current.has("KeyA");
      const right = keys.current.has("ArrowRight") || keys.current.has("KeyD");
      const jump = keys.current.has("ArrowUp") || keys.current.has("KeyW");
      if (dialogueRef.current) {
        player.current.walking = false;
        drawPixelScene(context, width, height, activeChapter, player.current.x - camera.current);
        activeChapter.objects.forEach((object) => drawObject(context, object, camera.current, height * 0.6, activeChapter.palette.accent));
        animation.current = window.requestAnimationFrame(tick);
        return;
      }
      player.current.walking = left || right;
      player.current.x += (right ? 3 : left ? -3 : 0);
      player.current.x = Math.max(90, Math.min(activeChapter.exitX + 80, player.current.x));
      if (jump && player.current.y === 0) player.current.velocityY = -10;
      player.current.y += player.current.velocityY;
      player.current.velocityY += 0.45;
      if (player.current.y > 0) {
        player.current.y = 0;
        player.current.velocityY = 0;
      }
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
          journeyAudio.start();
          journeyAudio.play("memory");
          setDialogue({ speaker: scripted.label, lines: scripted.dialogue });
        }
      }
      if (player.current.x >= activeChapter.exitX && !reachedExitRef.current) {
        reachedExitRef.current = true;
        setReachedExit(true);
        const requiredComplete = activeChapter.objects
          .filter((object) => object.required !== false)
          .every((object) => completedRef.current.includes(`${activeChapter.id}:${object.id}`));
        if (requiredComplete) justCompletedRef.current = true;
      }

      camera.current += ((player.current.x - width * 0.35) - camera.current) * 0.08;
      camera.current = Math.max(0, Math.min(Math.max(0, activeChapter.exitX - width * 0.6), camera.current));
      drawPixelScene(context, width, height, activeChapter, player.current.x - camera.current);
      const horizon = height * 0.6;
      activeChapter.objects.forEach((object) => drawObject(context, object, camera.current, horizon, activeChapter.palette.accent));
      drawExit(context, activeChapter.exitX, camera.current, horizon, activeChapter.palette.accent);

      const characterX = player.current.x - camera.current;
      const characterY = horizon + player.current.y;
      context.fillStyle = "#c6866a";
      context.fillRect(characterX - 14, characterY - 62, 28, 28);
      context.fillStyle = "#6554c0";
      context.fillRect(characterX - 17, characterY - 34, 34, 32);
      context.fillStyle = "#20203b";
      context.fillRect(characterX - 15, characterY - 4, 10, 24);
      context.fillRect(characterX + 5, characterY - 4, 10, 24);
      context.fillStyle = "#231b2b";
      context.fillRect(characterX - 15, characterY - 66, 30, 8);

      const nearest = activeChapter.objects
        .map((object) => ({ object, distance: Math.abs(object.x - player.current.x) }))
        .filter(({ object, distance }) => object.trigger !== "pass" && distance < 130)
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
    const requiredComplete = requiredObjects
      .every((object) => next.includes(`${activeChapter.id}:${object.id}`));
    if (requiredComplete && reachedExitRef.current) justCompletedRef.current = true;
  };

  const interact = () => {
    if (!near || dialogue) return;
    journeyAudio.start();
    journeyAudio.play("memory");
    const memoryId = `${activeChapter.id}:${near.id}`;
    recordCompletion(memoryId);
    setDialogue({ speaker: near.label, lines: near.dialogue });
  };

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

  const chapterStatus = useMemo(() => chapters.map((item, index) => ({
    ...item,
    done: item.objects.filter((object) => object.required !== false).every((object) => completed.includes(`${item.id}:${object.id}`)),
    index,
  })), [completed]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">
      <canvas ref={canvasRef} className="h-[min(100vh,760px)] min-h-[560px] w-full" onPointerDown={interact} />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: activeChapter.palette.accent }}>THE JOURNEY // {String(chapter + 1).padStart(2, "0")}</p>
          <h1 className="mt-2 text-2xl font-black md:text-4xl">{activeChapter.title}</h1>
          <p className="mt-1 text-sm text-white/55">{activeChapter.subtitle}</p>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button type="button" onClick={() => setMuted(journeyAudio.toggleMute())} className="rounded border border-white/15 bg-black/30 px-3 py-2 font-mono text-[10px] uppercase tracking-widest">{muted ? "sound off" : "sound on"}</button>
          <button type="button" onClick={() => setChapterMenu((open) => !open)} className="rounded border border-white/15 bg-black/30 px-3 py-2 font-mono text-[10px] uppercase tracking-widest">chapters</button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 text-center">
        <div className="pointer-events-auto rounded-full border border-white/15 bg-black/35 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-white/70 backdrop-blur-md">
          {near ? `E — inspect ${near.label}` : "A / D or ← / → move · W / ↑ jump"}
        </div>
        <p className="mt-2 text-xs text-white/45">{activeChapter.objective} · {requiredFound}/{requiredObjects.length} · {reachedExit ? "exit reached" : "find the exit"}</p>
      </div>

      <Link href="/" className="absolute bottom-7 left-5 rounded border border-white/15 bg-black/30 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-white/60 backdrop-blur-md hover:text-white">← portfolio</Link>

      {dialogue && (
        <button type="button" onClick={advanceDialogue} className="absolute inset-x-4 bottom-24 z-10 text-left md:inset-x-auto md:left-1/2 md:w-[min(720px,calc(100%-3rem))] md:-translate-x-1/2">
          <div className="border-2 border-dashed border-white/35 bg-[#0b101b]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-md md:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: activeChapter.palette.accent }}>{dialogue.speaker}</p>
            <p className="mt-3 min-h-14 text-base leading-7 text-white/85 md:text-lg">{typed}<span className="animate-pulse text-cyan-300">▮</span></p>
            <p className="mt-4 text-right font-mono text-[10px] uppercase tracking-widest text-white/35">E / click to continue</p>
          </div>
        </button>
      )}

      {chapter === chapters.length - 1 && isComplete && !dialogue && (
        <div className="absolute right-5 top-32 max-w-xs border border-emerald-300/30 bg-[#081b18]/90 p-4 backdrop-blur-md">
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">Journey complete</p>
          <p className="mt-2 text-sm text-white/70">You reached the present. Thank you for walking through it.</p>
        </div>
      )}

      {chapterMenu && (
        <div className="absolute right-5 top-20 z-20 max-h-[70vh] w-72 overflow-y-auto border border-white/15 bg-[#0a101b]/95 p-3 backdrop-blur-xl">
          <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-widest text-white/40">Chapter select</p>
          {chapterStatus.map((item) => (
            <button type="button" key={item.id} onClick={() => selectChapter(item.index)} className={`mb-1 flex w-full items-center justify-between p-3 text-left text-sm transition hover:bg-white/10 ${item.index === chapter ? "bg-white/10" : ""}`}>
              <span><span className="mr-2 font-mono text-xs text-white/35">{String(item.index + 1).padStart(2, "0")}</span>{item.title}</span>
              <span className={item.done ? "text-emerald-300" : "text-white/25"}>{item.done ? "✓" : "·"}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
