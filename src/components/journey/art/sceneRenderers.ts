// High-fidelity pixel art scene renderers for all 10 chapters
// Each scene features unique architecture, perspective, color palette, lighting effects,
// background elements, foreground details, and animated atmospheric particles.

export type SceneRenderContext = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  cameraX: number;
  tick: number;
};

// Helper: draw pixel rectangle
function px(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// 1. CHILDHOOD — School Classroom
// Detailed classroom with wooden floorboards, blackboard, chalk diagrams, natural sunlight streaming
// through high windows, ceiling fan, student desks, and connected school corridor.
export function renderChildhoodScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Background wall (warm cream / classroom plaster)
  px(ctx, "#c9baa2", 0, 0, width, horizon);
  px(ctx, "#3b2a20", 0, horizon - 14, width, 14); // Wood wainscot chair rail
  px(ctx, "#877360", 0, horizon - 90, width, 76); // Lower wall wood paneling

  // Wood parquet floor
  px(ctx, "#855836", 0, horizon, width, height - horizon);
  for (let y = horizon; y < height; y += 18) {
    px(ctx, "#6d4325", 0, y, width, 2);
    const offset = Math.floor((y - horizon) / 18) % 2 === 0 ? 0 : 50;
    for (let x = -((cameraX + offset) % 100); x < width; x += 100) {
      px(ctx, "#5a341b", x, y, 2, 18);
    }
  }

  // Windows with outside trees and streaming sunlight
  for (let wx = 80; wx < 1400; wx += 360) {
    const sx = wx - cameraX;
    if (sx > -200 && sx < width + 100) {
      // Window frame
      px(ctx, "#5a4332", sx, 35, 140, horizon - 150);
      px(ctx, "#3e2c1e", sx + 6, 41, 128, horizon - 162);

      // Outside view: bright sky and lush school green trees
      px(ctx, "#7cc4eb", sx + 10, 45, 120, horizon - 170);
      px(ctx, "#448c3b", sx + 10, horizon - 195, 120, 25);
      px(ctx, "#2e6d27", sx + 25, horizon - 215, 90, 30);

      // Window panes & glass shine
      px(ctx, "#5a4332", sx + 68, 45, 4, horizon - 170);
      px(ctx, "#5a4332", sx + 10, 45 + (horizon - 170) / 2, 120, 4);

      // Sparrow flying gracefully outside window canopy
      const sparrowX = ((tick * 0.75 + wx * 2) % 450) - 50;
      if (sparrowX > 5 && sparrowX < 115) {
        const sparrowY = 55 + Math.sin(tick * 0.08 + wx) * 4;
        px(ctx, "#3b2a1a", sx + 10 + sparrowX, sparrowY, 5, 2);
        px(ctx, "#3b2a1a", sx + 8 + sparrowX, sparrowY - 2, 2, 2);
      }

      // Sunlight diagonal beam
      ctx.fillStyle = "rgba(255, 245, 200, 0.12)";
      ctx.beginPath();
      ctx.moveTo(sx + 10, 45);
      ctx.lineTo(sx + 130, 45);
      ctx.lineTo(sx + 240, horizon + 80);
      ctx.lineTo(sx + 40, horizon + 80);
      ctx.closePath();
      ctx.fill();

      // Subtle dust motes floating in sunbeam
      for (let d = 0; d < 3; d++) {
        const moteY = (tick * 0.18 + d * 35) % (horizon + 50 - 45);
        const moteX = sx + 30 + d * 30 + Math.sin(tick * 0.03 + d) * 6;
        ctx.fillStyle = "rgba(255, 250, 220, 0.4)";
        ctx.fillRect(moteX, 45 + moteY, 2, 2);
      }
    }
  }

  // Large Green Blackboard at Center
  const bbX = 540 - cameraX;
  if (bbX > -300 && bbX < width + 100) {
    // Wooden frame
    px(ctx, "#503823", bbX, 60, 280, 140);
    // Chalkboard surface
    px(ctx, "#1e3c28", bbX + 8, 68, 264, 124);
    px(ctx, "#244730", bbX + 12, 72, 256, 116);

    // Chalk illustrations and math equations (contained within chalkboard boundary)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px monospace";
    ctx.fillText("MATH & SCIENCE // 5th Grade", bbX + 22, 92);

    // Contained math expression box
    px(ctx, "#16301f", bbX + 22, 104, 120, 22);
    ctx.fillStyle = "#a3e635";
    ctx.font = "bold 11px monospace";
    ctx.fillText("(X² + B²) = C²", bbX + 28, 119);

    ctx.font = "10px monospace";
    ctx.fillStyle = "#e0e0b0";
    ctx.fillText("x² + y² = r²", bbX + 155, 119);
    ctx.fillText("Solar System: Mercury, Venus, Earth...", bbX + 22, 144);
    ctx.fillText("Top 3 Rank: 1. Nandini G. ★", bbX + 22, 166);

    // Chalk tray & chalk pieces
    px(ctx, "#6d4e33", bbX + 6, 192, 268, 8);
    px(ctx, "#ffffff", bbX + 40, 190, 12, 4);
    px(ctx, "#ffd700", bbX + 60, 190, 10, 4);
  }

  // Wall Clock above blackboard with moving second hand
  const clockX = 670 - cameraX;
  px(ctx, "#443121", clockX - 18, 20, 36, 36);
  px(ctx, "#f4eedb", clockX - 15, 23, 30, 30);
  px(ctx, "#222", clockX - 1, 28, 2, 10);
  const secAngle = (tick * 0.05) % (Math.PI * 2);
  ctx.save();
  ctx.translate(clockX, 38);
  ctx.rotate(secAngle);
  px(ctx, "#cc3333", -1, 0, 2, 11);
  ctx.restore();

  // Noticeboard with Star chart and Student art
  const nbX = 260 - cameraX;
  if (nbX > -200 && nbX < width + 100) {
    px(ctx, "#785338", nbX, 75, 120, 95);
    px(ctx, "#b98c5d", nbX + 6, 81, 108, 83);
    // Star chart & drawings
    px(ctx, "#fffef0", nbX + 12, 88, 44, 32);
    px(ctx, "#e05555", nbX + 16, 94, 8, 8);
    px(ctx, "#ffd700", nbX + 30, 94, 8, 8);
    px(ctx, "#55a0e0", nbX + 16, 106, 8, 8);
    px(ctx, "#40b560", nbX + 30, 106, 8, 8);

    px(ctx, "#fbf4c8", nbX + 64, 88, 44, 68);
    ctx.fillStyle = "#553a22";
    ctx.font = "8px monospace";
    ctx.fillText("HONOR ROLL", nbX + 68, 102);
    ctx.fillText("1. Nandini", nbX + 68, 116);
    ctx.fillText("2. Rohan", nbX + 68, 128);
    ctx.fillText("3. Priya", nbX + 68, 140);
  }

  // Ceiling Fan rotating
  const fanX = 460 - cameraX;
  const fanAngle = (tick * 0.15) % (Math.PI * 2);
  px(ctx, "#333", fanX - 2, 0, 4, 32);
  px(ctx, "#444", fanX - 8, 32, 16, 8);
  ctx.save();
  ctx.translate(fanX, 36);
  ctx.rotate(fanAngle);
  px(ctx, "#2b2b2b", -36, -3, 72, 6);
  px(ctx, "#2b2b2b", -3, -36, 6, 72);
  ctx.restore();

  // Classroom Door to hallway on right
  const doorX = 1120 - cameraX;
  if (doorX > -150 && doorX < width + 100) {
    px(ctx, "#4a3525", doorX, 50, 95, horizon - 50);
    px(ctx, "#78573d", doorX + 6, 56, 83, horizon - 56);
    px(ctx, "#a6d6ed", doorX + 16, 75, 63, 60); // Transom glass
    px(ctx, "#ffd700", doorX + 14, horizon - 75, 8, 8); // Brass handle
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.fillText("CORRIDOR ➜", doorX + 10, 42);
  }
}

// 2. COVID — Cozy Lockdown Home Bedroom / Study Room
// Soft bedroom walls, double-hung window with overcast rainy lockdown view, curtains,
// warm desk lamp, modern laptop on study table, bed with duvet, bookshelves, and clock.
export function renderCovidScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Modern home wallpaper / soft teal bedroom wall
  px(ctx, "#182333", 0, 0, width, horizon);
  // Wallpaper subtle stripe texture
  for (let x = -((cameraX) % 32); x < width; x += 32) {
    px(ctx, "#1c2b3e", x, 0, 16, horizon);
  }
  // Baseboard trim
  px(ctx, "#eee", 0, horizon - 8, width, 8);

  // Soft warm bedroom wooden floor with large woven rug
  px(ctx, "#3b2820", 0, horizon, width, height - horizon);
  for (let y = horizon; y < height; y += 14) {
    px(ctx, "#2e1e17", 0, y, width, 1);
  }
  // Large cozy woven teal rug
  px(ctx, "#213e4a", 160 - cameraX, horizon + 12, 640, height - horizon - 20);
  px(ctx, "#2a4f5f", 170 - cameraX, horizon + 20, 620, height - horizon - 36);
  px(ctx, "#f0e4b8", 160 - cameraX, horizon + 10, 640, 2);
  px(ctx, "#f0e4b8", 160 - cameraX, height - 9, 640, 2);

  // Cozy Bed on Left
  const bedX = 140 - cameraX;
  if (bedX > -250 && bedX < width + 100) {
    // Headboard
    px(ctx, "#4a3528", bedX - 10, horizon - 110, 20, 110);
    // Bed frame
    px(ctx, "#38261b", bedX, horizon - 35, 170, 35);
    // Mattress & duvet (warm yellow/teal blanket)
    px(ctx, "#d8caaf", bedX + 5, horizon - 60, 160, 35);
    px(ctx, "#346268", bedX + 45, horizon - 58, 120, 33);
    // Pillows
    px(ctx, "#faf8f0", bedX + 12, horizon - 78, 38, 22);
    px(ctx, "#ece4d0", bedX + 16, horizon - 72, 32, 14);
  }

  // Bedroom Window showing quiet lockdown sky and distant apartment blocks
  const winX = 400 - cameraX;
  if (winX > -250 && winX < width + 100) {
    // Window opening
    px(ctx, "#2a3442", winX, 35, 160, horizon - 95);
    // Overcast lockdown sky
    px(ctx, "#475c75", winX + 8, 43, 144, horizon - 111);
    // Distant city silhouette
    px(ctx, "#314154", winX + 15, horizon - 170, 35, 55);
    px(ctx, "#283747", winX + 55, horizon - 190, 40, 75);
    px(ctx, "#314154", winX + 100, horizon - 165, 45, 50);

    // Warm curtains framing window with gentle organic flutter
    const curtainWave = Math.sin(tick * 0.035) * 3;
    px(ctx, "#914444", winX - 18 + curtainWave * 0.5, 25, 24, horizon - 70);
    px(ctx, "#914444", winX + 154 - curtainWave * 0.5, 25, 24, horizon - 70);
    px(ctx, "#b05555", winX - 14 + curtainWave * 0.7, 30, 16, horizon - 80);
    px(ctx, "#b05555", winX + 158 - curtainWave * 0.7, 30, 16, horizon - 80);
    // Curtain rod
    px(ctx, "#c99a4e", winX - 25, 22, 210, 6);

    // Sparrow gliding past outside overcast window
    const birdX = ((tick * 0.55) % 400) - 50;
    if (birdX > 5 && birdX < 135) {
      px(ctx, "#263547", winX + 10 + birdX, horizon - 150 + Math.sin(tick * 0.07) * 3, 5, 2);
      px(ctx, "#263547", winX + 8 + birdX, horizon - 152 + Math.sin(tick * 0.07) * 3, 2, 2);
    }
  }

  // Bookshelf with textbooks, novels, and potted plant
  const shelfX = 640 - cameraX;
  if (shelfX > -200 && shelfX < width + 100) {
    px(ctx, "#593c27", shelfX, 40, 95, horizon - 40);
    // Shelves
    for (let sy = 85; sy < horizon - 40; sy += 45) {
      px(ctx, "#442d1c", shelfX + 4, sy, 87, 6);
      // Colorful books
      let bx = shelfX + 8;
      const colors = ["#b53b3b", "#3b6fb5", "#3bb569", "#d69838", "#883bb5", "#419999"];
      let cIdx = 0;
      while (bx < shelfX + 80) {
        const bw = 8 + (cIdx % 3) * 4;
        const bh = 28 + (cIdx % 4) * 3;
        px(ctx, colors[cIdx % colors.length], bx, sy - bh, bw, bh);
        bx += bw + 2;
        cIdx++;
      }
    }
    // Small potted succulent on top shelf
    px(ctx, "#b85c37", shelfX + 15, 28, 16, 12);
    px(ctx, "#449455", shelfX + 13, 16, 20, 12);
  }

  // Calendar on Wall: 2020 Lockdown
  const calX = 810 - cameraX;
  if (calX > -100 && calX < width + 100) {
    px(ctx, "#fffef2", calX, 60, 48, 55);
    px(ctx, "#cc3333", calX, 60, 48, 14);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 9px monospace";
    ctx.fillText("APR 2020", calX + 3, 71);
    // Crossed out days
    ctx.fillStyle = "#cc3333";
    ctx.font = "8px monospace";
    ctx.fillText("✕ ✕ ✕ ✕", calX + 5, 88);
    ctx.fillText("✕ ✕ ✕ ✕", calX + 5, 100);
  }

  // Study Desk Lamp Light Glow with soothing warm breathing
  const deskX = 590 - cameraX;
  const lampPulse = Math.sin(tick * 0.04) * 6;
  const gradient = ctx.createRadialGradient(deskX, horizon - 50, 10, deskX, horizon - 50, 140 + lampPulse);
  gradient.addColorStop(0, "rgba(255, 230, 150, 0.28)");
  gradient.addColorStop(0.7, "rgba(255, 220, 120, 0.08)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(deskX - 150, horizon - 200, 300, 210);
}

// 3. CATCHING UP — Late Night Study Session (10th Grade)
// Moody dark midnight atmosphere, glowing study lamp, towering textbook stacks,
// cramming timetable, starry night through window, and clock showing 2:30 AM.
export function renderCatchingUpScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Dark midnight blue study room walls
  px(ctx, "#101626", 0, 0, width, horizon);
  px(ctx, "#1c253b", 0, horizon - 8, width, 8);

  // Deep dark mahogany floor
  px(ctx, "#1c1410", 0, horizon, width, height - horizon);
  for (let y = horizon; y < height; y += 14) {
    px(ctx, "#140e0b", 0, y, width, 1);
  }

  // Night window with crescent moon and twinkling stars
  const winX = 240 - cameraX;
  if (winX > -200 && winX < width + 100) {
    px(ctx, "#1f2b3e", winX, 35, 130, horizon - 110);
    px(ctx, "#090d18", winX + 6, 41, 118, horizon - 122);
    // Twinkling stars
    for (let i = 0; i < 12; i++) {
      const starAlpha = 0.4 + 0.6 * Math.sin(tick * 0.05 + i * 1.3);
      ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
      ctx.fillRect(winX + 15 + ((i * 37) % 100), 50 + ((i * 23) % 80), 2, 2);
    }
    // Crescent moon
    px(ctx, "#fdfaa8", winX + 85, 55, 16, 16);
    px(ctx, "#090d18", winX + 81, 53, 16, 16);
  }

  // Giant Corkboard full of 10th Grade Revision Schedules & Formula Sheets
  const cbX = 460 - cameraX;
  if (cbX > -250 && cbX < width + 100) {
    px(ctx, "#593d22", cbX, 40, 280, 130);
    px(ctx, "#966f44", cbX + 6, 46, 268, 118);

    // Timetables and flashcards
    px(ctx, "#fdfcf0", cbX + 16, 55, 75, 98);
    ctx.fillStyle = "#8b2525";
    ctx.font = "bold 9px monospace";
    ctx.fillText("TARGET: 80%+", cbX + 20, 70);
    ctx.fillStyle = "#333";
    ctx.font = "8px monospace";
    ctx.fillText("• Science: Ch 1-8", cbX + 20, 85);
    ctx.fillText("• Math: Sample Pprs", cbX + 20, 98);
    ctx.fillText("• English: Grammar", cbX + 20, 111);
    ctx.fillText("• Social Studies", cbX + 20, 124);

    // Color-coded sticky notes
    const stickies = ["#ff7676", "#ffe066", "#70e090", "#76caff", "#d885ff"];
    stickies.forEach((col, idx) => {
      px(ctx, col, cbX + 110 + (idx % 3) * 48, 55 + Math.floor(idx / 3) * 44, 40, 36);
    });
  }

  // Digital Glowing Clock showing 02:45 AM
  const clockX = 780 - cameraX;
  if (clockX > -100 && clockX < width + 100) {
    px(ctx, "#0d1117", clockX, 55, 80, 38);
    px(ctx, "#05070a", clockX + 3, 58, 74, 32);
    ctx.fillStyle = "#ff4444";
    ctx.font = "bold 14px monospace";
    ctx.fillText("02:45 AM", clockX + 8, 80);
  }

  // Intense Study Lamp Cone
  const coneX = 720 - cameraX;
  const gradient = ctx.createRadialGradient(coneX, horizon - 60, 15, coneX, horizon - 60, 180);
  gradient.addColorStop(0, "rgba(255, 230, 170, 0.35)");
  gradient.addColorStop(0.6, "rgba(255, 210, 130, 0.1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(coneX - 180, horizon - 210, 360, 220);
}

// 4. 11th GRADE — School Corridor
// Dramatic corridor perspective with long vanishing lines, rows of metal lockers,
// polished reflective tile floor, groups of students, classroom doors with room numbers (11-A, 11-B).
export function renderGrade11CorridorScene({ ctx, width, height, cameraX }: SceneRenderContext) {
  const horizon = height * 0.6;

  // Upper corridor walls (institutional beige / pale mauve)
  px(ctx, "#44344d", 0, 0, width, horizon);

  // Polished corridor checkered tiles with reflections
  px(ctx, "#6d5875", 0, horizon, width, height - horizon);
  for (let y = horizon; y < height; y += 16) {
    const depthW = (y - horizon) / (height - horizon);
    px(ctx, "#56435e", 0, y, width, 2);
    for (let x = -((cameraX * 1.2) % 60); x < width; x += 60) {
      if ((Math.floor(x / 60) + Math.floor(y / 16)) % 2 === 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(x, y, 60, 16);
      }
    }
  }

  // Overhead fluorescent corridor tube lights
  for (let lx = 60; lx < 1600; lx += 220) {
    const sx = lx - cameraX;
    if (sx > -100 && sx < width + 100) {
      px(ctx, "#291f30", sx - 45, 12, 90, 8);
      px(ctx, "#ffffff", sx - 40, 20, 80, 4);
      // Light spill downward
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.beginPath();
      ctx.moveTo(sx - 30, 24);
      ctx.lineTo(sx + 30, 24);
      ctx.lineTo(sx + 70, horizon);
      ctx.lineTo(sx - 70, horizon);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Rows of Tall School Lockers with vents and handles
  for (let lockX = 120; lockX < 1500; lockX += 280) {
    const sx = lockX - cameraX;
    if (sx > -200 && sx < width + 100) {
      // 3 metal lockers bank
      for (let i = 0; i < 3; i++) {
        const lx = sx + i * 36;
        px(ctx, "#36263f", lx, 60, 34, horizon - 60);
        px(ctx, "#543d60", lx + 2, 64, 30, horizon - 68);
        // Vents
        for (let v = 72; v < 96; v += 6) {
          px(ctx, "#261a2c", lx + 8, v, 14, 2);
        }
        // Handle & padlock
        px(ctx, "#e0b060", lx + 24, horizon - 110, 4, 8);
        px(ctx, "#222", lx + 23, horizon - 100, 6, 8);
      }
    }
  }

  // Classroom Doors (Room 11-A, Room 11-B)
  const doors = [
    { x: 420, label: "ROOM 11-A" },
    { x: 980, label: "ROOM 11-B" },
  ];
  doors.forEach(({ x, label }) => {
    const sx = x - cameraX;
    if (sx > -120 && sx < width + 100) {
      px(ctx, "#261b2e", sx, 50, 85, horizon - 50);
      px(ctx, "#443050", sx + 5, 56, 75, horizon - 56);
      // Frosted transom window
      px(ctx, "#bfa7cc", sx + 12, 70, 61, 50);
      // Nameplate
      px(ctx, "#eed38b", sx + 12, 130, 61, 16);
      ctx.fillStyle = "#261b2e";
      ctx.font = "bold 9px monospace";
      ctx.fillText(label, sx + 15, 142);
      // Brass handle
      px(ctx, "#eed38b", sx + 10, horizon - 75, 6, 12);
    }
  });

  // Corridor Noticeboard
  const nbX = 740 - cameraX;
  if (nbX > -150 && nbX < width + 100) {
    px(ctx, "#332238", nbX, 70, 110, 80);
    px(ctx, "#785842", nbX + 4, 74, 102, 72);
    px(ctx, "#ffffff", nbX + 10, 82, 36, 44);
    px(ctx, "#fce080", nbX + 54, 82, 44, 30);
    ctx.fillStyle = "#222";
    ctx.font = "7px monospace";
    ctx.fillText("SENIOR WING", nbX + 12, 92);
    ctx.fillText("RULES & EXAMS", nbX + 12, 102);
  }
}

// 5. 12th GRADE — Recovery Room / Gentle Rest
// Healing bedroom environment with soft pastel morning light, warm blankets,
// medicine nightstand, open window with blowing sheer curtains, calendar marking recovery weeks.
export function renderGrade12RecoveryScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Soft muted lavender-rose plaster wall
  px(ctx, "#2d2633", 0, 0, width, horizon);
  px(ctx, "#e6d5d5", 0, horizon - 6, width, 6);

  // Warm light natural wood flooring
  px(ctx, "#423235", 0, horizon, width, height - horizon);
  for (let y = horizon; y < height; y += 14) {
    px(ctx, "#332527", 0, y, width, 1);
  }

  // Open healing window with morning sky & sunlight
  const winX = 350 - cameraX;
  if (winX > -200 && winX < width + 100) {
    px(ctx, "#3d323e", winX, 40, 140, horizon - 100);
    // Morning soft blue/amber sky
    const skyGrad = ctx.createLinearGradient(winX, 45, winX, horizon - 60);
    skyGrad.addColorStop(0, "#7ebbe6");
    skyGrad.addColorStop(1, "#f5d2b3");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX + 6, 46, 128, horizon - 112);

    // Sparrow outside in morning light
    const sparrowX = ((tick * 0.5) % 320) - 30;
    if (sparrowX > 10 && sparrowX < 115) {
      px(ctx, "#47302b", winX + 6 + sparrowX, horizon - 135 + Math.sin(tick * 0.06) * 3, 5, 2);
    }

    // Sheer curtains fluttering gently in morning breeze
    const flutter = Math.sin(tick * 0.04) * 4;
    px(ctx, "rgba(255, 255, 255, 0.4)", winX - 10, 32, 28 + flutter, horizon - 75);
    px(ctx, "rgba(255, 255, 255, 0.4)", winX + 122 - flutter, 32, 28 + flutter, horizon - 75);
    px(ctx, "#c49a7a", winX - 15, 30, 170, 5); // Curtain pole
  }

  // Recovery Bed with multiple warm quilts and pillows
  const bedX = 560 - cameraX;
  if (bedX > -250 && bedX < width + 100) {
    px(ctx, "#594348", bedX, horizon - 90, 16, 90); // Headboard
    px(ctx, "#443136", bedX, horizon - 35, 180, 35);
    // Pillows stacked for propping up
    px(ctx, "#fbf8f5", bedX + 16, horizon - 72, 38, 20);
    px(ctx, "#f2ece6", bedX + 22, horizon - 82, 34, 18);
    // Soft rose quilt
    px(ctx, "#966870", bedX + 45, horizon - 52, 130, 30);
    px(ctx, "#b58790", bedX + 50, horizon - 50, 120, 24);
  }

  // Nightstand with Medicine Bottles, Thermometer, and Herbal Tea with rising steam
  const nsX = 770 - cameraX;
  if (nsX > -150 && nsX < width + 100) {
    px(ctx, "#523c40", nsX, horizon - 65, 60, 65);
    px(ctx, "#694d52", nsX - 4, horizon - 69, 68, 6);
    // Glass water carafe & tumbler
    px(ctx, "rgba(180, 230, 255, 0.7)", nsX + 8, horizon - 92, 14, 22);
    px(ctx, "rgba(180, 230, 255, 0.7)", nsX + 26, horizon - 82, 8, 12);
    // Gentle steam wisps rising from tea cup
    const steamY = (tick * 0.35) % 18;
    const steamX = Math.sin(tick * 0.08) * 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.fillRect(nsX + 29 + steamX, horizon - 88 - steamY, 2, 4);

    // Amber medicine bottles
    px(ctx, "#b36224", nsX + 38, horizon - 86, 10, 16);
    px(ctx, "#ffffff", nsX + 39, horizon - 89, 8, 4); // Cap
    px(ctx, "#327da8", nsX + 51, horizon - 82, 8, 12);
  }

  // Recovery Calendar (Milestones marked)
  const calX = 220 - cameraX;
  if (calX > -100 && calX < width + 100) {
    px(ctx, "#fffef5", calX, 65, 55, 65);
    px(ctx, "#8a4f58", calX, 65, 55, 14);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px monospace";
    ctx.fillText("RECOVERY", calX + 6, 75);
    ctx.fillStyle = "#4a8a58";
    ctx.font = "8px monospace";
    ctx.fillText("✓ Wk 1", calX + 8, 92);
    ctx.fillText("✓ Wk 2", calX + 8, 104);
    ctx.fillText("★ Health", calX + 8, 116);
  }
}

// 6. AFTER SCHOOL / COLLEGE — Outdoor Campus
// Open sky, distant majestic brick university building with clock tower, green lawns,
// leafy shade trees, stone walkways, admission counseling booth, and campus noticeboards.
export function renderCollegeCampusScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.58;

  // Broad Open Sky with soft drifting clouds
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
  skyGrad.addColorStop(0, "#2b6399");
  skyGrad.addColorStop(0.7, "#6fa8dc");
  skyGrad.addColorStop(1, "#d6eaf8");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, horizon);

  // Drifting clouds
  for (let c = 0; c < 5; c++) {
    const cx = ((c * 320 + tick * 0.25) % (width + 400)) - 100;
    px(ctx, "rgba(255, 255, 255, 0.45)", cx, 30 + c * 25, 140, 28);
    px(ctx, "rgba(255, 255, 255, 0.6)", cx + 20, 24 + c * 25, 100, 36);
  }

  // Sparrow flying across open campus sky
  const skyBirdX = ((tick * 0.85) % (width + 300)) - 100;
  const skyBirdY = 55 + Math.sin(tick * 0.05) * 8;
  px(ctx, "#1e3a5f", skyBirdX, skyBirdY, 6, 2);
  px(ctx, "#1e3a5f", skyBirdX - 3, skyBirdY - 2, 3, 2);

  // Distant Brick University Hall with Arches and Clock Tower
  const uniX = 480 - cameraX * 0.4;
  if (uniX > -400 && uniX < width + 200) {
    // Main building
    px(ctx, "#6d3935", uniX - 160, horizon - 150, 320, 150);
    // Clock tower at center
    px(ctx, "#542a27", uniX - 35, horizon - 210, 70, 210);
    px(ctx, "#3b1d1b", uniX - 45, horizon - 225, 90, 18);
    // Tower clock
    px(ctx, "#faf8e8", uniX - 15, horizon - 195, 30, 30);
    px(ctx, "#222", uniX - 1, horizon - 188, 2, 10);
    px(ctx, "#222", uniX - 1, horizon - 180, 8, 2);
    // Colonnade arches
    for (let ax = uniX - 140; ax < uniX + 140; ax += 38) {
      px(ctx, "#381c1a", ax, horizon - 75, 24, 75);
    }
  }

  // Lush Green Grass Lawn
  px(ctx, "#3c7536", 0, horizon, width, height - horizon);
  px(ctx, "#2d5e28", 0, horizon, width, 14);

  // Stone Paved Walkway along foreground
  px(ctx, "#8f99a3", 0, horizon + 30, width, height - horizon - 30);
  for (let y = horizon + 30; y < height; y += 18) {
    px(ctx, "#6e7780", 0, y, width, 2);
    const offset = Math.floor((y - horizon) / 18) % 2 === 0 ? 0 : 35;
    for (let x = -((cameraX + offset) % 70); x < width; x += 70) {
      px(ctx, "#596169", x, y, 2, 18);
    }
  }

  // Occasional falling leaf drifting gently across stone path
  for (let leaf = 0; leaf < 2; leaf++) {
    const leafY = (tick * 0.45 + leaf * 70) % (height - horizon - 30);
    const leafX = ((tick * 0.3 + leaf * 280) % width) + Math.sin(tick * 0.05 + leaf) * 12;
    px(ctx, leaf === 0 ? "#d97706" : "#b45309", leafX, horizon + 35 + leafY, 3, 3);
  }

  // Shady Green Trees with leaves swaying in the breeze
  const trees = [140, 420, 960, 1340];
  trees.forEach((tx) => {
    const sx = tx - cameraX;
    if (sx > -150 && sx < width + 100) {
      const sway = Math.sin(tick * 0.025 + tx) * 2.5;
      // Trunk
      px(ctx, "#503622", sx - 8, horizon - 110, 16, 110);
      // Foliage clusters swaying gently
      px(ctx, "#245e28", sx - 50 + sway, horizon - 170, 100, 75);
      px(ctx, "#327d37", sx - 42 + sway * 1.2, horizon - 190, 84, 70);
      px(ctx, "#449e4a", sx - 30 + sway * 0.8, horizon - 180, 60, 50);
    }
  });

  // Outdoor Wooden Picnic Table & Bench
  const benchX = 280 - cameraX;
  if (benchX > -150 && benchX < width + 100) {
    px(ctx, "#6e4726", benchX, horizon + 15, 90, 10);
    px(ctx, "#543418", benchX + 10, horizon + 25, 8, 24);
    px(ctx, "#543418", benchX + 72, horizon + 25, 8, 24);
  }

  // Admission & Counselling Kiosk with Big Banner
  const kioskX = 740 - cameraX;
  if (kioskX > -200 && kioskX < width + 100) {
    // Booth canopy
    px(ctx, "#25537d", kioskX - 10, 60, 160, 30);
    px(ctx, "#ffffff", kioskX - 10, 90, 160, 8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px monospace";
    ctx.fillText("ADMISSIONS 2022-23", kioskX + 5, 80);
    // Columns
    px(ctx, "#456a8a", kioskX, 98, 10, horizon - 98);
    px(ctx, "#456a8a", kioskX + 130, 98, 10, horizon - 98);
    // Desk counter
    px(ctx, "#8a6642", kioskX - 5, horizon - 45, 150, 45);
    // Brochures & IGNOU forms
    px(ctx, "#fafafa", kioskX + 15, horizon - 52, 24, 7);
    px(ctx, "#ffeb3b", kioskX + 48, horizon - 52, 24, 7);
    px(ctx, "#90caf9", kioskX + 82, horizon - 52, 24, 7);
  }
}

// 7. PROGRAMMING — Digital Workspace & Logic Lab
// Cyberpunk / high-tech developer setup: triple glowing monitors, neon ambient lighting,
// mechanical keyboard, code flowcharts on whiteboard, and logic circuit graphics.
export function renderProgrammingScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Dark developer bunker room with neon matrix accents
  px(ctx, "#090d16", 0, 0, width, horizon);

  // Digital grid lines on back wall
  ctx.strokeStyle = "rgba(40, 180, 240, 0.08)";
  ctx.lineWidth = 1;
  for (let x = -((cameraX) % 40); x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, horizon);
    ctx.stroke();
  }
  for (let y = 0; y < horizon; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Dark industrial floor with LED edge strip
  px(ctx, "#0e131d", 0, horizon, width, height - horizon);
  px(ctx, "#00ffcc", 0, horizon, width, 2); // Neon cyan floor runner

  // LED Wall Strips (Purple & Cyan neon ambient glow)
  px(ctx, "#9933ff", 0, 12, width, 4);
  const wallGlow = ctx.createLinearGradient(0, 0, 0, 80);
  wallGlow.addColorStop(0, "rgba(153, 51, 255, 0.15)");
  wallGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = wallGlow;
  ctx.fillRect(0, 16, width, 64);

  // Giant Developer Whiteboard with System Architecture & DSA Flowchart
  const wbX = 140 - cameraX;
  if (wbX > -250 && wbX < width + 100) {
    px(ctx, "#2a3b4c", wbX, 40, 220, 130);
    px(ctx, "#f0f4f8", wbX + 5, 45, 210, 120);

    ctx.fillStyle = "#112233";
    ctx.font = "bold 10px monospace";
    ctx.fillText("ARCHITECTURE & LOGIC", wbX + 15, 62);

    // Flowchart boxes & arrows
    px(ctx, "#2196f3", wbX + 20, 75, 45, 22);
    px(ctx, "#4caf50", wbX + 85, 75, 50, 22);
    px(ctx, "#ff9800", wbX + 155, 75, 48, 22);

    ctx.fillStyle = "#fff";
    ctx.font = "8px monospace";
    ctx.fillText("INPUT", wbX + 26, 89);
    ctx.fillText("LOGIC", wbX + 94, 89);
    ctx.fillText("OUTPUT", wbX + 160, 89);

    // Connecting arrows
    px(ctx, "#333", wbX + 65, 85, 20, 2);
    px(ctx, "#333", wbX + 135, 85, 20, 2);

    // Code snippet on whiteboard
    ctx.fillStyle = "#1e3c72";
    ctx.font = "7px monospace";
    ctx.fillText("function solve(problem) {", wbX + 20, 115);
    ctx.fillText("  return breakDown(problem);", wbX + 26, 128);
    ctx.fillText("}", wbX + 20, 142);
  }

  // Triple Monitor Battlestation Desk
  const deskX = 520 - cameraX;
  if (deskX > -300 && deskX < width + 100) {
    // Monitor 1: Vertical Documentation / Discord (Left)
    px(ctx, "#111", deskX - 70, horizon - 130, 48, 85);
    px(ctx, "#0d2238", deskX - 67, horizon - 127, 42, 79);
    ctx.fillStyle = "#64b5f6";
    ctx.font = "6px monospace";
    for (let l = 0; l < 8; l++) {
      ctx.fillText("> docs.get(" + l + ");", deskX - 64, horizon - 115 + l * 9);
    }

    // Monitor 2: Giant Main Ultrawide IDE (Center)
    px(ctx, "#151515", deskX - 15, horizon - 145, 140, 95);
    px(ctx, "#1e1e1e", deskX - 11, horizon - 141, 132, 87);
    // VS Code UI layout
    px(ctx, "#252526", deskX - 11, horizon - 141, 22, 87); // Sidebar
    px(ctx, "#2d2d2d", deskX + 11, horizon - 141, 110, 14); // Tabs
    ctx.fillStyle = "#9cdcfe";
    ctx.font = "bold 7px monospace";
    ctx.fillText("main.py", deskX + 16, horizon - 131);

    // Syntax highlighted code lines
    const codeColors = ["#c586c0", "#4ec9b0", "#ce9178", "#dcdcaa", "#9cdcfe", "#b5cea8"];
    for (let c = 0; c < 7; c++) {
      ctx.fillStyle = codeColors[c % codeColors.length];
      ctx.fillRect(deskX + 16, horizon - 118 + c * 8, 20 + ((c * 17) % 65), 5);
    }

    // Monitor 3: Terminal with Matrix/Green text (Right)
    px(ctx, "#111", deskX + 130, horizon - 125, 65, 75);
    px(ctx, "#051405", deskX + 133, horizon - 122, 59, 69);
    ctx.fillStyle = "#00ff66";
    ctx.font = "6px monospace";
    ctx.fillText("PASS: 42/42", deskX + 136, horizon - 105);
    ctx.fillText("READY_>", deskX + 136, horizon - 92);

    // Sit-stand desk surface with cable grommets & RGB mousepad
    px(ctx, "#1e2430", deskX - 90, horizon - 45, 300, 45);
    px(ctx, "#00ffcc", deskX - 85, horizon - 45, 290, 3); // RGB mousepad trim
    // Mechanical keyboard with illuminated keycaps
    px(ctx, "#111", deskX + 15, horizon - 38, 70, 18);
    for (let k = 0; k < 6; k++) {
      px(ctx, "#00e5ff", deskX + 20 + k * 10, horizon - 35, 7, 5);
      px(ctx, "#ff007f", deskX + 20 + k * 10, horizon - 28, 7, 5);
    }
    // Ergonomic wireless mouse
    px(ctx, "#333", deskX + 95, horizon - 34, 14, 12);
  }

  // Bookshelf with O'Reilly-style Tech Books
  const bsX = 940 - cameraX;
  if (bsX > -150 && bsX < width + 100) {
    px(ctx, "#182030", bsX, 50, 90, horizon - 50);
    for (let sy = 90; sy < horizon - 50; sy += 45) {
      px(ctx, "#0d111a", bsX + 4, sy, 82, 6);
      const bks = ["#00bcd4", "#ff4081", "#ffeb3b", "#76ff03", "#e040fb"];
      bks.forEach((col, i) => {
        px(ctx, col, bsX + 8 + i * 14, sy - 30, 11, 30);
      });
    }
  }
}

// 8. DEVFEST 2025 — Grand Developer Conference
// Massive auditorium with stage truss lighting, multi-colored stage spotlights,
// giant LED keynote presentation screen, speaker at podium with mic, auditorium seating
// rows filled with hundreds of audience attendee silhouettes, registration desk with lanyards & swag bags,
// Google Cloud & Android sponsor demo booths with rollup banners, and vibrant networking crowds.
export function renderDevFestScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Dark industrial convention center hall ceiling & backdrop
  px(ctx, "#0f0c1a", 0, 0, width, horizon);

  // Heavy metal stage lighting truss hung from ceiling
  px(ctx, "#261e38", 0, 20, width, 16);
  for (let tx = 0; tx < width; tx += 28) {
    ctx.strokeStyle = "#463860";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, 20);
    ctx.lineTo(tx + 28, 36);
    ctx.lineTo(tx + 56, 20);
    ctx.stroke();
  }

  // Dramatic Stage Spotlights beaming down in festival colors (Cyan, Magenta, Gold, Purple)
  const spotColors = [
    "rgba(0, 240, 255, 0.12)",
    "rgba(255, 0, 180, 0.12)",
    "rgba(255, 215, 0, 0.12)",
    "rgba(160, 60, 255, 0.12)",
  ];
  for (let s = 0; s < 4; s++) {
    const spotX = 260 + s * 220 - cameraX;
    const sway = Math.sin(tick * 0.03 + s * 1.5) * 40;
    ctx.fillStyle = spotColors[s % spotColors.length];
    ctx.beginPath();
    ctx.moveTo(spotX, 36);
    ctx.lineTo(spotX + 15, 36);
    ctx.lineTo(spotX + 110 + sway, horizon);
    ctx.lineTo(spotX - 70 + sway, horizon);
    ctx.closePath();
    ctx.fill();
  }

  // Polished Convention Hall Floor
  px(ctx, "#181329", 0, horizon, width, height - horizon);
  // Red carpet stage runner
  px(ctx, "#781836", 0, horizon + 20, width, 40);
  px(ctx, "#a3264c", 0, horizon + 24, width, 32);

  // MAIN STAGE with Huge LED Keynote Screen
  const stageX = 620 - cameraX;
  if (stageX > -400 && stageX < width + 200) {
    // Stage elevated wooden/metal platform
    px(ctx, "#2b1c45", stageX - 180, horizon - 35, 360, 35);
    px(ctx, "#442e6d", stageX - 180, horizon - 38, 360, 4);
    // LED edge light
    px(ctx, "#00ffff", stageX - 180, horizon - 34, 360, 2);

    // GIANT LED KEYNOTE SCREEN
    px(ctx, "#0d0717", stageX - 150, 45, 300, horizon - 90);
    px(ctx, "#19112b", stageX - 144, 51, 288, horizon - 102);

    // Screen graphics: DevFest 2025 Branding
    const ledGrad = ctx.createLinearGradient(stageX - 140, 55, stageX + 140, horizon - 60);
    ledGrad.addColorStop(0, "#4285f4"); // Google Blue
    ledGrad.addColorStop(0.35, "#ea4335"); // Google Red
    ledGrad.addColorStop(0.7, "#fbbc05"); // Google Yellow
    ledGrad.addColorStop(1, "#34a853"); // Google Green
    ctx.fillStyle = ledGrad;
    ctx.fillRect(stageX - 140, 55, 280, 18);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px monospace";
    ctx.fillText("GDG DevFest 2025", stageX - 70, 70);

    // Presentation Slide Title & Diagram
    ctx.fillStyle = "#e0d6ff";
    ctx.font = "bold 11px monospace";
    ctx.fillText("Building Inclusive Tech Communities", stageX - 120, 100);
    ctx.font = "9px monospace";
    ctx.fillStyle = "#a899d6";
    ctx.fillText("Keynote: Growing from Learner to Leader", stageX - 120, 120);

    // Speaker Podium on Stage with Microphones
    px(ctx, "#1e1333", stageX + 70, horizon - 78, 38, 42);
    px(ctx, "#ff007f", stageX + 70, horizon - 78, 38, 3); // Neon edge
    // Mic goose-neck
    px(ctx, "#888", stageX + 85, horizon - 92, 2, 14);
    px(ctx, "#fff", stageX + 83, horizon - 94, 6, 4);
  }

  // AUDIENCE SEATING: Rows of conference attendees silhouettes in foreground
  const audX = 260 - cameraX;
  if (audX > -300 && audX < width + 100) {
    // 3 rows of audience seating
    for (let r = 0; r < 2; r++) {
      const ry = horizon - 20 + r * 16;
      for (let ax = audX; ax < audX + 220; ax += 26) {
        // Chair back
        px(ctx, "#211638", ax, ry, 20, 14);
        // Head silhouette
        px(ctx, "#140c24", ax + 4, ry - 10, 12, 10);
      }
    }
  }

  // SPONSOR & COMMUNITY BOOTHS with Rollup Banners & Swag
  const boothX = 1040 - cameraX;
  if (boothX > -250 && boothX < width + 100) {
    // Google Cloud / Tech sponsor booth
    px(ctx, "#261942", boothX, 65, 140, horizon - 65);
    px(ctx, "#432b70", boothX, 65, 140, 26);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px monospace";
    ctx.fillText("SPONSOR ZONE", boothX + 28, 82);

    // Rollup banner with Google Cloud colors
    px(ctx, "#ffffff", boothX + 10, 98, 35, horizon - 145);
    px(ctx, "#4285f4", boothX + 14, 105, 27, 8);
    px(ctx, "#ea4335", boothX + 14, 116, 27, 8);

    // Demo Table with Stickers, Laptops, Swag Bags
    px(ctx, "#39255e", boothX + 55, horizon - 45, 80, 45);
    px(ctx, "#00ffcc", boothX + 62, horizon - 52, 16, 8); // Stickers
    px(ctx, "#ff007f", boothX + 84, horizon - 52, 14, 8);
    px(ctx, "#ffeb3b", boothX + 105, horizon - 54, 18, 10); // Swag bag
  }

  // REGISTRATION & BADGE COUNTER on Left
  const regX = 120 - cameraX;
  if (regX > -200 && regX < width + 100) {
    px(ctx, "#2b1c47", regX, horizon - 55, 110, 55);
    px(ctx, "#f0abfc", regX, horizon - 55, 110, 4);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px monospace";
    ctx.fillText("REGISTRATION", regX + 16, horizon - 40);

    // Lanyard trees with colorful conference badges
    px(ctx, "#111", regX + 85, horizon - 95, 4, 40);
    px(ctx, "#4285f4", regX + 80, horizon - 90, 14, 16);
    px(ctx, "#ea4335", regX + 82, horizon - 78, 14, 16);
  }
}

// 9. COMMUNITY — Open Collaborative Workshop & Hackathon Hub
// Distinct industrial makerspace with exposed brick, large collaborative workbenches,
// whiteboard with sticky notes, mentor help desk, hackathon banner, pizza/refreshments, and lively vibe.
export function renderCommunityScene({ ctx, width, height, cameraX }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Warm exposed brick & industrial workshop space
  px(ctx, "#263f3c", 0, 0, width, horizon);
  // Exposed brick pattern
  for (let y = 10; y < horizon - 20; y += 14) {
    const offset = Math.floor(y / 14) % 2 === 0 ? 0 : 20;
    for (let x = -((cameraX + offset) % 40); x < width; x += 40) {
      px(ctx, "#213634", x, y, 38, 12);
    }
  }

  // Workshop concrete floor with vibrant teal geometric accents
  px(ctx, "#182a28", 0, horizon, width, height - horizon);
  px(ctx, "#4ecdc4", 0, horizon, width, 4);

  // Giant HACKATHON & COMMUNITY WORKSHOP Banner
  const banX = 460 - cameraX;
  if (banX > -300 && banX < width + 100) {
    px(ctx, "#142523", banX, 35, 320, 45);
    px(ctx, "#45b39d", banX + 4, 39, 312, 37);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px monospace";
    ctx.fillText("BUILD & MENTOR // HACKATHON 2025", banX + 22, 62);
  }

  // Giant Brainstorming Whiteboard full of colored sticky notes & wireframes
  const wbX = 160 - cameraX;
  if (wbX > -250 && wbX < width + 100) {
    px(ctx, "#446e68", wbX, 65, 210, 115);
    px(ctx, "#f7f9fa", wbX + 6, 71, 198, 103);

    ctx.fillStyle = "#264653";
    ctx.font = "bold 9px monospace";
    ctx.fillText("COMMUNITY PROJECT SPRINT", wbX + 16, 88);

    // Clusters of colorful brainstorming sticky notes
    const colors = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff", "#06d6a0"];
    colors.forEach((col, idx) => {
      const sx = wbX + 20 + (idx % 4) * 42;
      const sy = wbX > -999 ? 100 + Math.floor(idx / 4) * 32 : 100;
      px(ctx, col, sx, sy, 32, 26);
    });
  }

  // Collaborative Workbench 1: Hackathon Team Workspace
  const desk1X = 420 - cameraX;
  if (desk1X > -250 && desk1X < width + 100) {
    // Large heavy birch workbench
    px(ctx, "#a1724d", desk1X, horizon - 45, 180, 45);
    px(ctx, "#785133", desk1X + 10, horizon - 45, 12, 45);
    px(ctx, "#785133", desk1X + 158, horizon - 45, 12, 45);
    // Multiple open laptops with colorful stickers
    px(ctx, "#555", desk1X + 25, horizon - 65, 35, 20);
    px(ctx, "#81d4fa", desk1X + 27, horizon - 63, 31, 16);
    px(ctx, "#444", desk1X + 90, horizon - 65, 35, 20);
    px(ctx, "#a7ffeb", desk1X + 92, horizon - 63, 31, 16);
  }

  // Mentor Help Station & Refreshment Table
  const snackX = 780 - cameraX;
  if (snackX > -200 && snackX < width + 100) {
    px(ctx, "#8c603b", snackX, horizon - 45, 150, 45);
    // Pizza boxes & drinks
    px(ctx, "#e76f51", snackX + 20, horizon - 60, 36, 15);
    px(ctx, "#f4a261", snackX + 22, horizon - 68, 32, 8);
    // Coffee mugs & soda cans
    px(ctx, "#e63946", snackX + 75, horizon - 62, 10, 17);
    px(ctx, "#457b9d", snackX + 92, horizon - 62, 10, 17);
  }
}

// 10. PRESENT — Nandini's Personal Creator & Developer Studio
// Twilight skyline view out modern floor-to-ceiling windows, curved ultrawide monitor with GitHub & VS Code,
// podcast boom-arm microphone, monstera plant in ceramic pot, framed Google Cloud & GDG certificates,
// and warm fairy lights.
export function renderPresentStudioScene({ ctx, width, height, cameraX, tick }: SceneRenderContext) {
  const horizon = height * 0.62;

  // Modern floor-to-ceiling panoramic window overlooking city twilight skyline
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
  skyGrad.addColorStop(0, "#0c1524"); // Midnight
  skyGrad.addColorStop(0.5, "#2b1c47"); // Purple twilight
  skyGrad.addColorStop(1, "#c86846"); // Sunset orange glow
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, horizon);

  // Twinkling modern skyline towers through window
  const skylineTowers = [
    { x: 80, w: 75, h: 160 },
    { x: 180, w: 90, h: 210 },
    { x: 300, w: 65, h: 140 },
    { x: 420, w: 110, h: 240 },
    { x: 570, w: 85, h: 190 },
    { x: 690, w: 100, h: 220 },
    { x: 840, w: 70, h: 170 },
    { x: 960, w: 120, h: 250 },
    { x: 1140, w: 90, h: 200 },
  ];
  skylineTowers.forEach((tw) => {
    const sx = tw.x - cameraX * 0.3;
    if (sx > -150 && sx < width + 100) {
      px(ctx, "#131024", sx, horizon - tw.h, tw.w, tw.h);
      // Twinkling skyscraper windows
      for (let wy = horizon - tw.h + 12; wy < horizon - 10; wy += 12) {
        for (let wx = sx + 8; wx < sx + tw.w - 8; wx += 10) {
          if (Math.sin(wx * 2 + wy * 3 + tick * 0.05) > 0.1) {
            px(ctx, "#ffd580", wx, wy, 4, 6);
          }
        }
      }
    }
  });

  // Modern studio charcoal interior wall & trim
  px(ctx, "#18202d", 0, horizon - 8, width, 8);

  // Sleek Dark Oak Engineered Hardwood Flooring
  px(ctx, "#1a1820", 0, horizon, width, height - horizon);
  for (let y = horizon; y < height; y += 14) {
    px(ctx, "#121117", 0, y, width, 1);
  }

  // Warm Fairy Lights strung along ceiling
  for (let fx = 20; fx < 1400; fx += 55) {
    const sx = fx - cameraX;
    if (sx > -50 && sx < width + 50) {
      const droop = Math.sin((fx / 110) * Math.PI) * 12;
      px(ctx, "#ffd700", sx, 16 + droop, 6, 6);
      ctx.fillStyle = "rgba(255, 215, 0, 0.18)";
      ctx.beginPath();
      ctx.arc(sx + 3, 19 + droop, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Framed GDG Speaker & Community Achievements on Left Wall
  const certX = 140 - cameraX;
  if (certX > -200 && certX < width + 100) {
    // Frame 1
    px(ctx, "#d4af37", certX, 55, 60, 45); // Gold frame
    px(ctx, "#fff", certX + 4, 59, 52, 37);
    ctx.fillStyle = "#4285f4";
    ctx.font = "bold 6px monospace";
    ctx.fillText("GDG DevFest", certX + 8, 72);
    ctx.fillText("SPEAKER 2025", certX + 8, 83);

    // Frame 2
    px(ctx, "#d4af37", certX + 75, 55, 60, 45);
    px(ctx, "#fff", certX + 79, 59, 52, 37);
    ctx.fillStyle = "#34a853";
    ctx.font = "bold 6px monospace";
    ctx.fillText("COMMUNITY", certX + 83, 72);
    ctx.fillText("LEAD / MENTOR", certX + 83, 83);
  }

  // High-End Modern Studio Desk (Center)
  const deskX = 520 - cameraX;
  if (deskX > -300 && deskX < width + 100) {
    // Sit-stand walnut desktop
    px(ctx, "#3b2a1f", deskX - 90, horizon - 45, 260, 45);
    px(ctx, "#221812", deskX - 90, horizon - 45, 260, 4);

    // Curved Ultrawide Monitor displaying Portfolio & VS Code
    px(ctx, "#1a1a1a", deskX - 45, horizon - 135, 150, 90);
    px(ctx, "#0f172a", deskX - 40, horizon - 130, 140, 80);
    // Screen contents: GitHub contribution graph (green dots) + React code
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) {
        const greens = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
        px(ctx, greens[(row * 3 + col) % greens.length], deskX - 32 + col * 9, horizon - 120 + row * 8, 7, 6);
      }
    }
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 7px monospace";
    ctx.fillText("Portfolio 2026 // Active", deskX - 32, horizon - 78);

    // Studio Boom Arm Microphone (Shure SM7B style)
    px(ctx, "#222", deskX + 90, horizon - 110, 4, 65);
    px(ctx, "#444", deskX + 75, horizon - 120, 24, 12); // Mic body
    px(ctx, "#111", deskX + 68, horizon - 120, 7, 12); // Foam windscreen

    // Keyboard & Trackpad
    px(ctx, "#e2e8f0", deskX - 10, horizon - 38, 60, 16);
    px(ctx, "#cbd5e1", deskX + 55, horizon - 36, 18, 14);
  }

  // Lush Monstera Plant in Ceramic Pot on Right
  const plantX = 840 - cameraX;
  if (plantX > -150 && plantX < width + 100) {
    px(ctx, "#e0e0e0", plantX - 18, horizon - 35, 36, 35); // White ceramic pot
    // Large monstera leaves with slits
    px(ctx, "#1e5c30", plantX - 35, horizon - 95, 35, 45);
    px(ctx, "#2a7d42", plantX + 5, horizon - 105, 40, 50);
    px(ctx, "#3ba557", plantX - 15, horizon - 120, 45, 55);
  }
}
