// High-fidelity pixel art character and NPC renderers
// Features animated walk cycles, idle breathing, directional facing,
// and chapter-specific NPC designs (teachers, students, organizers, speakers, mentors).

export type PlayerState = {
  x: number;
  y: number;
  walking: boolean;
  facing: "left" | "right";
  stepFrame: number;
};

// Helper: draw pixel rectangle
function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// Draw player (Nandini) with fluid animation
export function drawPlayer(ctx: CanvasRenderingContext2D, player: PlayerState, screenX: number, horizon: number, tick: number) {
  const y = horizon + player.y;
  const isLeft = player.facing === "left";
  const walkCycle = player.walking ? Math.sin(tick * 0.28) : 0;
  const breath = !player.walking ? Math.sin(tick * 0.08) * 1.5 : 0;

  // Drop shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(screenX, horizon + 2, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  if (isLeft) {
    ctx.translate(screenX * 2, 0);
    ctx.scale(-1, 1);
  }

  // --- LEGS & SHOES ---
  const legOffset1 = walkCycle * 6;
  const legOffset2 = -walkCycle * 6;

  // Left leg (back)
  px(ctx, "#18182b", screenX - 8 + legOffset2, y - 18, 6, 18);
  px(ctx, "#ffffff", screenX - 9 + legOffset2, y - 3, 8, 4); // White sneaker
  px(ctx, "#7c3aed", screenX - 9 + legOffset2, y - 5, 8, 2); // Violet stripe

  // Right leg (front)
  px(ctx, "#262642", screenX + 2 + legOffset1, y - 18, 6, 18);
  px(ctx, "#ffffff", screenX + 1 + legOffset1, y - 3, 8, 4); // White sneaker
  px(ctx, "#7c3aed", screenX + 1 + legOffset1, y - 5, 8, 2);

  // --- TORSO / HOODIE ---
  // Purple/lavender cozy oversized developer hoodie
  px(ctx, "#6d44b8", screenX - 9, y - 42 + breath, 18, 24);
  px(ctx, "#8b5cf6", screenX - 7, y - 40 + breath, 14, 20); // Highlights
  px(ctx, "#5b21b6", screenX - 3, y - 30 + breath, 6, 10); // Hoodie pocket
  // Hoodie drawstrings
  px(ctx, "#ffffff", screenX - 2, y - 36 + breath, 1, 8);
  px(ctx, "#ffffff", screenX + 1, y - 36 + breath, 1, 8);

  // Arm
  const armSwing = player.walking ? -walkCycle * 5 : 0;
  px(ctx, "#7c3aed", screenX + 4 + armSwing, y - 38 + breath, 5, 16);
  // Hand
  px(ctx, "#d89c7a", screenX + 4 + armSwing, y - 22 + breath, 5, 5);

  // --- HEAD & HAIR ---
  // Neck
  px(ctx, "#c88b6a", screenX - 3, y - 45 + breath, 6, 4);

  // Face
  px(ctx, "#d89c7a", screenX - 6, y - 62 + breath, 14, 17);
  // Cheeks
  px(ctx, "#f4a261", screenX - 5, y - 52 + breath, 3, 3);
  px(ctx, "#f4a261", screenX + 4, y - 52 + breath, 3, 3);
  // Eyes
  px(ctx, "#1f1b24", screenX + 1, y - 56 + breath, 3, 4);
  px(ctx, "#ffffff", screenX + 2, y - 56 + breath, 1, 2); // Catchlight

  // Long flowing dark hair
  px(ctx, "#17121e", screenX - 8, y - 66 + breath, 17, 8); // Top hair
  px(ctx, "#17121e", screenX - 9, y - 62 + breath, 6, 22); // Back hair falling down
  px(ctx, "#261d33", screenX - 7, y - 65 + breath, 12, 4); // Hair shine
  px(ctx, "#17121e", screenX + 5, y - 63 + breath, 4, 12); // Front bangs

  ctx.restore();
}

// Draw specialized NPCs
export function drawNPC(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  horizon: number,
  type: "teacher" | "student" | "organizer" | "speaker" | "mentor" | "generic",
  tick: number,
  avoidable?: boolean
) {
  const breath = Math.sin(tick * 0.07 + screenX) * 1.5;

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(screenX, horizon + 2, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Social avoidance indicator
  if (avoidable) {
    ctx.fillStyle = "rgba(240, 171, 252, 0.5)";
    ctx.font = "bold 8px monospace";
    ctx.fillText("AVOID CLIQUE ➜", screenX - 30, horizon - 82);
  }

  switch (type) {
    case "teacher": {
      // School teacher in traditional saree/formal suit with glasses and grading clipboard
      px(ctx, "#1a365d", screenX - 8, horizon - 20, 16, 20); // Skirt / saree lower
      px(ctx, "#c53030", screenX - 8, horizon - 44 + breath, 16, 24); // Red/maroon formal blouse & shawl
      px(ctx, "#e2e8f0", screenX - 2, horizon - 40 + breath, 8, 18); // Shawl pleat
      // Head
      px(ctx, "#c88b6a", screenX - 6, horizon - 62 + breath, 12, 15);
      // Bun hair
      px(ctx, "#1a202c", screenX - 8, horizon - 66 + breath, 16, 8);
      px(ctx, "#1a202c", screenX - 11, horizon - 64 + breath, 4, 8); // Hair bun
      // Glasses & eyes (with occasional gentle blink)
      const isBlink = (tick + Math.floor(screenX)) % 130 < 4;
      px(ctx, "#ffd700", screenX - 2, horizon - 58 + breath, 6, 4);
      if (!isBlink) {
        px(ctx, "#222", screenX, horizon - 57 + breath, 2, 2);
      }
      // Clipboard
      px(ctx, "#a0522d", screenX + 5, horizon - 36 + breath, 8, 14);
      px(ctx, "#ffffff", screenX + 6, horizon - 34 + breath, 6, 10);
      break;
    }

    case "organizer": {
      // DevFest Organizer: GDG Black t-shirt with Google 4-color logo & prominent blue lanyard
      px(ctx, "#1e293b", screenX - 7, horizon - 18, 14, 18); // Dark jeans
      px(ctx, "#0f172a", screenX - 8, horizon - 42 + breath, 16, 24); // Black GDG tee
      // Google logo dots on chest
      px(ctx, "#4285f4", screenX - 4, horizon - 35 + breath, 2, 2);
      px(ctx, "#ea4335", screenX - 1, horizon - 35 + breath, 2, 2);
      px(ctx, "#fbbc05", screenX + 2, horizon - 35 + breath, 2, 2);
      px(ctx, "#34a853", screenX + 5, horizon - 35 + breath, 2, 2);
      // Blue Conference Lanyard
      px(ctx, "#00e5ff", screenX - 4, horizon - 40 + breath, 2, 16);
      px(ctx, "#00e5ff", screenX + 2, horizon - 40 + breath, 2, 16);
      px(ctx, "#ffffff", screenX - 3, horizon - 24 + breath, 6, 8); // DevFest Badge
      // Head
      px(ctx, "#e0a98b", screenX - 6, horizon - 60 + breath, 12, 15);
      px(ctx, "#261e1b", screenX - 7, horizon - 64 + breath, 14, 7); // Short hair
      // Eyes with occasional blink
      const isBlink = (tick + Math.floor(screenX)) % 140 < 4;
      if (!isBlink) {
        px(ctx, "#1e293b", screenX + 1, horizon - 55 + breath, 2, 3);
      }
      // Walkie-talkie on belt
      px(ctx, "#111", screenX - 10, horizon - 26 + breath, 3, 8);
      px(ctx, "#333", screenX - 9, horizon - 31 + breath, 1, 5);
      break;
    }

    case "speaker": {
      // Keynote Conference Speaker: Tech blazer, wireless headset microphone
      px(ctx, "#0f172a", screenX - 7, horizon - 18, 14, 18);
      px(ctx, "#334155", screenX - 8, horizon - 42 + breath, 16, 24); // Slate blazer
      px(ctx, "#ffffff", screenX - 3, horizon - 40 + breath, 6, 12); // Inner shirt
      // Wireless mic headset
      px(ctx, "#e0a98b", screenX - 6, horizon - 60 + breath, 12, 15);
      px(ctx, "#111", screenX + 2, horizon - 56 + breath, 5, 2); // Mic arm to mouth
      px(ctx, "#ff007f", screenX + 6, horizon - 56 + breath, 2, 2); // Mic tip
      // Hair
      px(ctx, "#3e2723", screenX - 7, horizon - 64 + breath, 14, 7);
      break;
    }

    case "mentor": {
      // Hackathon Mentor: Friendly green hoodie, tote bag, enthusiastic posture
      px(ctx, "#1e293b", screenX - 7, horizon - 18, 14, 18);
      px(ctx, "#059669", screenX - 8, horizon - 42 + breath, 16, 24); // Green hoodie
      px(ctx, "#10b981", screenX - 6, horizon - 38 + breath, 12, 16);
      // Head
      px(ctx, "#d89c7a", screenX - 6, horizon - 60 + breath, 12, 15);
      px(ctx, "#17121e", screenX - 7, horizon - 64 + breath, 14, 8);
      // Big smile
      px(ctx, "#ffffff", screenX - 1, horizon - 52 + breath, 4, 2);
      break;
    }

    case "student": {
      // School / College student in uniform or casual streetwear
      px(ctx, "#1e3a5f", screenX - 7, horizon - 18, 14, 18); // Navy pants
      px(ctx, "#f8fafc", screenX - 8, horizon - 42 + breath, 16, 24); // White school shirt
      px(ctx, "#be123c", screenX - 2, horizon - 40 + breath, 4, 14); // School tie
      // Backpack
      px(ctx, "#d97706", screenX - 11, horizon - 38 + breath, 5, 16);
      // Head
      px(ctx, "#d89c7a", screenX - 6, horizon - 60 + breath, 12, 15);
      px(ctx, "#262626", screenX - 7, horizon - 64 + breath, 14, 7);
      break;
    }

    default: {
      // Generic conference / campus attendee
      px(ctx, "#1f2937", screenX - 7, horizon - 18, 14, 18);
      px(ctx, "#3b82f6", screenX - 8, horizon - 42 + breath, 16, 24);
      px(ctx, "#d89c7a", screenX - 6, horizon - 60 + breath, 12, 15);
      px(ctx, "#111827", screenX - 7, horizon - 64 + breath, 14, 7);
      break;
    }
  }
}
