// Dedicated pixel art renderers for interactive objects across all 10 chapters
// Replaces generic rectangular boxes with handcrafted pixel art props.

import { SceneObject } from "../JourneyExperience";
import { drawNPC } from "./characterRenderers";

function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function drawInteractiveObject(
  ctx: CanvasRenderingContext2D,
  object: SceneObject,
  cameraX: number,
  horizon: number,
  accent: string,
  tick: number,
  chapterId: string
) {
  const x = object.x - cameraX;
  if (x < -160 || x > 1200) return;

  // Base shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(x, horizon + 2, 28, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight indicator when near
  const pulse = Math.sin(tick * 0.1) * 3;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(x, horizon - 95 + pulse);
  ctx.lineTo(x - 5, horizon - 105 + pulse);
  ctx.lineTo(x + 5, horizon - 105 + pulse);
  ctx.closePath();
  ctx.fill();

  // Chapter & Object-specific pixel rendering
  switch (object.id) {
    // --- 1. CHILDHOOD ---
    case "blackboard": {
      // Teacher's podium and desk with apple and globe
      px(ctx, "#5a3a22", x - 35, horizon - 38, 70, 38);
      px(ctx, "#442b17", x - 38, horizon - 42, 76, 5);
      // Spinning mini globe
      px(ctx, "#3b82f6", x - 25, horizon - 62, 16, 16);
      px(ctx, "#22c55e", x - 23, horizon - 58, 8, 8);
      px(ctx, "#cca43b", x - 26, horizon - 64, 18, 2); // Brass meridian
      px(ctx, "#cca43b", x - 18, horizon - 46, 2, 5); // Stand
      // Red apple
      px(ctx, "#ef4444", x + 15, horizon - 52, 10, 10);
      px(ctx, "#15803d", x + 19, horizon - 55, 3, 3); // Leaf
      // Pencil cup with colored pencils
      px(ctx, "#60a5fa", x - 2, horizon - 54, 8, 12);
      px(ctx, "#f59e0b", x - 1, horizon - 60, 2, 6);
      px(ctx, "#10b981", x + 2, horizon - 59, 2, 5);
      break;
    }

    case "book": {
      // Detailed open student notebook with handwritten notes and ruler
      px(ctx, "#6b4935", x - 28, horizon - 28, 56, 28);
      px(ctx, "#533725", x - 30, horizon - 32, 60, 5);
      // Open notebook
      px(ctx, "#fdfcf0", x - 16, horizon - 40, 32, 18);
      px(ctx, "#e2e8f0", x - 1, horizon - 40, 2, 18); // Spine
      ctx.fillStyle = "#3b82f6";
      for (let l = 0; l < 4; l++) {
        ctx.fillRect(x - 14, horizon - 37 + l * 4, 10, 1);
        ctx.fillRect(x + 3, horizon - 37 + l * 4, 10, 1);
      }
      // Wooden yellow ruler
      px(ctx, "#fbbf24", x + 10, horizon - 36, 18, 4);
      break;
    }

    case "trophy": {
      // Shimmering Golden Academic Trophy with blue ribbon
      px(ctx, "#78350f", x - 16, horizon - 16, 32, 16); // Wood plinth
      px(ctx, "#f59e0b", x - 12, horizon - 14, 24, 12); // Brass plaque
      // Gold cup body
      px(ctx, "#fbbf24", x - 14, horizon - 48, 28, 24);
      px(ctx, "#fef08a", x - 10, horizon - 44, 8, 16); // Shine
      px(ctx, "#d97706", x - 4, horizon - 24, 8, 10); // Stem
      // Cup handles
      px(ctx, "#f59e0b", x - 20, horizon - 46, 6, 14);
      px(ctx, "#f59e0b", x + 14, horizon - 46, 6, 14);
      // Blue academic ribbon
      px(ctx, "#2563eb", x - 8, horizon - 30, 6, 18);
      px(ctx, "#3b82f6", x + 2, horizon - 30, 6, 18);
      break;
    }

    // --- 2. COVID ---
    case "laptop": {
      // Modern laptop on study desk with Zoom/Meet video call grid
      px(ctx, "#4a3324", x - 36, horizon - 35, 72, 35);
      px(ctx, "#362418", x - 38, horizon - 39, 76, 5);
      // Silver laptop base
      px(ctx, "#cbd5e1", x - 22, horizon - 41, 44, 4);
      // Glowing laptop screen with 4 video call participant tiles
      px(ctx, "#1e293b", x - 20, horizon - 72, 40, 31);
      px(ctx, "#0284c7", x - 18, horizon - 70, 36, 27);
      // 4 video tiles
      px(ctx, "#38bdf8", x - 16, horizon - 68, 15, 10);
      px(ctx, "#f472b6", x + 1, horizon - 68, 15, 10);
      px(ctx, "#4ade80", x - 16, horizon - 56, 15, 10);
      px(ctx, "#fbbf24", x + 1, horizon - 56, 15, 10);
      // Green webcam indicator light
      px(ctx, "#22c55e", x - 1, horizon - 73, 2, 2);
      // Steaming coffee mug
      px(ctx, "#f8fafc", x + 22, horizon - 49, 10, 10);
      px(ctx, "rgba(255, 255, 255, 0.4)", x + 24, horizon - 56, 2, 5);
      break;
    }

    case "lesson": {
      // Online assignment printout with 80% mark
      px(ctx, "#4a3324", x - 24, horizon - 28, 48, 28);
      px(ctx, "#ffffff", x - 14, horizon - 38, 28, 32);
      ctx.fillStyle = "#334155";
      for (let l = 0; l < 4; l++) {
        ctx.fillRect(x - 10, horizon - 34 + l * 5, 20, 2);
      }
      // Green stamped 80%+
      ctx.fillStyle = "#16a34a";
      ctx.font = "bold 9px monospace";
      ctx.fillText("80% ✓", x - 10, horizon - 12);
      break;
    }

    // --- 3. CATCHING UP ---
    case "timetable": {
      // Giant color-coded timetable stand
      px(ctx, "#334155", x - 24, horizon - 55, 48, 55);
      px(ctx, "#fef08a", x - 20, horizon - 51, 40, 47);
      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 7px monospace";
      ctx.fillText("REVISION", x - 17, horizon - 41);
      ctx.fillStyle = "#1e293b";
      ctx.fillText("• Ch 1-14", x - 17, horizon - 30);
      ctx.fillText("• CBSE Papers", x - 17, horizon - 20);
      ctx.fillText("• Final Sprint", x - 17, horizon - 10);
      break;
    }

    case "papers": {
      // Towering stacks of sample exam papers
      px(ctx, "#1e293b", x - 25, horizon - 25, 50, 25);
      // Stack 1
      px(ctx, "#f8fafc", x - 18, horizon - 55, 22, 30);
      px(ctx, "#dc2626", x - 12, horizon - 45, 10, 4); // Red pen note
      // Stack 2
      px(ctx, "#f1f5f9", x + 2, horizon - 45, 20, 20);
      px(ctx, "#0284c7", x + 5, horizon - 38, 12, 3);
      break;
    }

    // --- 4. 11th GRADE ---
    case "loud-group": {
      // Group of students talking loudly
      drawNPC(ctx, x - 22, horizon, "student", tick, true);
      drawNPC(ctx, x + 4, horizon, "student", tick + 20, true);
      drawNPC(ctx, x + 28, horizon, "student", tick + 40, true);
      break;
    }

    case "shoulder-check": {
      // Student rushing down hallway
      drawNPC(ctx, x, horizon, "student", tick * 1.5, false);
      break;
    }

    case "quiet-bench": {
      // Quiet school hallway bench
      px(ctx, "#4c3444", x - 35, horizon - 25, 70, 8); // Seat
      px(ctx, "#30222b", x - 32, horizon - 17, 6, 17); // Legs
      px(ctx, "#30222b", x + 26, horizon - 17, 6, 17);
      // Small abandoned water bottle on bench
      px(ctx, "#38bdf8", x - 10, horizon - 36, 6, 11);
      break;
    }

    case "classroom-door": {
      // Transom doorway to classroom 11-A
      px(ctx, "#261a2c", x - 25, horizon - 80, 50, 80);
      px(ctx, "#c084fc", x - 20, horizon - 75, 40, 30); // Glowing transom glass
      px(ctx, "#ffd700", x + 12, horizon - 40, 5, 5); // Handle
      break;
    }

    // --- 5. 12th GRADE ---
    case "window": {
      // Window with soft morning light
      px(ctx, "#443438", x - 28, horizon - 75, 56, 75);
      px(ctx, "#fbcfe8", x - 24, horizon - 71, 48, 67);
      // Curtains
      px(ctx, "#f472b6", x - 26, horizon - 73, 10, 69);
      px(ctx, "#f472b6", x + 16, horizon - 73, 10, 69);
      break;
    }

    case "calendar": {
      // Wall progress calendar
      px(ctx, "#ffffff", x - 18, horizon - 50, 36, 45);
      px(ctx, "#be185d", x - 18, horizon - 50, 36, 10);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 6px monospace";
      ctx.fillText("HEALING", x - 14, horizon - 43);
      ctx.fillStyle = "#15803d";
      ctx.font = "8px monospace";
      ctx.fillText("★ HOPE", x - 14, horizon - 22);
      break;
    }

    // --- 6. AFTER SCHOOL / COLLEGE ---
    case "ignou": {
      // Official IGNOU Application dossier
      px(ctx, "#475569", x - 24, horizon - 25, 48, 25);
      px(ctx, "#fef3c7", x - 14, horizon - 45, 28, 35);
      px(ctx, "#b45309", x - 10, horizon - 40, 20, 6); // Header
      px(ctx, "#dc2626", x - 5, horizon - 22, 10, 10); // Official seal
      break;
    }

    case "iics": {
      // IICS tech admission brochure
      px(ctx, "#475569", x - 24, horizon - 25, 48, 25);
      px(ctx, "#dbeafe", x - 14, horizon - 45, 28, 35);
      px(ctx, "#1d4ed8", x - 10, horizon - 40, 20, 6);
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "bold 7px monospace";
      ctx.fillText("IICS IT", x - 12, horizon - 22);
      break;
    }

    // --- 7. PROGRAMMING ---
    case "terminal": {
      // Glowing CRT developer terminal
      px(ctx, "#0f172a", x - 28, horizon - 55, 56, 55);
      px(ctx, "#022c22", x - 24, horizon - 51, 48, 47);
      // Code matrix lines
      ctx.fillStyle = "#34d399";
      ctx.font = "6px monospace";
      ctx.fillText("> git init", x - 20, horizon - 40);
      ctx.fillText("> npm run dev", x - 20, horizon - 30);
      ctx.fillText("> Ready! 🚀", x - 20, horizon - 20);
      break;
    }

    case "logic": {
      // Interactive logic gate puzzle station
      px(ctx, "#111827", x - 28, horizon - 60, 56, 60);
      px(ctx, "#1e1b4b", x - 24, horizon - 56, 48, 52);
      // Logic gate symbol
      px(ctx, "#38bdf8", x - 18, horizon - 45, 14, 18);
      px(ctx, "#a855f7", x - 2, horizon - 45, 14, 18);
      // Signal wire pulsing
      const wireCol = Math.sin(tick * 0.15) > 0 ? "#00ffcc" : "#0284c7";
      px(ctx, wireCol, x + 12, horizon - 38, 8, 4);
      break;
    }

    // --- 8. DEVFEST ---
    case "organiser": {
      // GDG DevFest Organizer NPC
      drawNPC(ctx, x, horizon, "organizer", tick, false);
      break;
    }

    case "stage": {
      // Stage presenter podium with microphones & conference logos
      px(ctx, "#1e1136", x - 24, horizon - 55, 48, 55);
      px(ctx, "#9333ea", x - 24, horizon - 55, 48, 4); // LED edge
      // Dual wireless gooseneck mics
      px(ctx, "#64748b", x - 12, horizon - 70, 2, 16);
      px(ctx, "#64748b", x + 10, horizon - 70, 2, 16);
      px(ctx, "#f43f5e", x - 14, horizon - 72, 6, 4);
      px(ctx, "#f43f5e", x + 8, horizon - 72, 6, 4);
      // GDG logo on podium
      px(ctx, "#4285f4", x - 8, horizon - 35, 4, 4);
      px(ctx, "#ea4335", x - 2, horizon - 35, 4, 4);
      px(ctx, "#fbbc05", x + 4, horizon - 35, 4, 4);
      break;
    }

    // --- 9. COMMUNITY ---
    case "mentor": {
      // Friendly community mentor
      drawNPC(ctx, x, horizon, "mentor", tick, false);
      break;
    }

    case "host": {
      // Community host station with mic
      px(ctx, "#134e4a", x - 20, horizon - 50, 40, 50);
      px(ctx, "#2dd4bf", x - 20, horizon - 50, 40, 3);
      px(ctx, "#94a3b8", x - 2, horizon - 68, 4, 20); // Mic stand
      px(ctx, "#f8fafc", x - 4, horizon - 72, 8, 6);
      break;
    }

    case "hackathon": {
      // Hackathon project table with dual laptops, pizza, wires
      px(ctx, "#334155", x - 35, horizon - 35, 70, 35);
      px(ctx, "#0f172a", x - 37, horizon - 39, 74, 5);
      // Laptop 1
      px(ctx, "#64748b", x - 28, horizon - 55, 24, 18);
      px(ctx, "#38bdf8", x - 26, horizon - 53, 20, 14);
      // Laptop 2
      px(ctx, "#64748b", x + 4, horizon - 55, 24, 18);
      px(ctx, "#f43f5e", x + 6, horizon - 53, 20, 14);
      // Prototype circuit board
      px(ctx, "#15803d", x - 10, horizon - 42, 14, 6);
      break;
    }

    // --- 10. PRESENT ---
    case "workspace": {
      // Nandini's developer battle station
      px(ctx, "#1e293b", x - 35, horizon - 35, 70, 35);
      px(ctx, "#0f172a", x - 38, horizon - 39, 76, 5);
      // Curved screen
      px(ctx, "#020617", x - 28, horizon - 72, 56, 35);
      px(ctx, "#38bdf8", x - 25, horizon - 69, 50, 29);
      // Coffee mug
      px(ctx, "#f8fafc", x + 24, horizon - 48, 8, 10);
      break;
    }

    case "plant": {
      // Lush monstera plant
      px(ctx, "#cbd5e1", x - 12, horizon - 25, 24, 25);
      px(ctx, "#15803d", x - 22, horizon - 65, 22, 35);
      px(ctx, "#16a34a", x + 2, horizon - 72, 24, 38);
      px(ctx, "#22c55e", x - 10, horizon - 82, 26, 42);
      break;
    }

    default: {
      px(ctx, accent, x - 18, horizon - 40, 36, 40);
      break;
    }
  }
}
