import * as THREE from "three";

/**
 * Creates a circular glowing magical rune sigil with transparent alpha (NO box slabs).
 */
export function createCircularRuneTexture(label: string, symbol: string, colorHex = "#e8d3a0"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // Transparent background
  ctx.clearRect(0, 0, 256, 256);

  const cx = 128;
  const cy = 128;

  // Outer glowing ring
  ctx.shadowColor = colorHex;
  ctx.shadowBlur = 16;
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 3.5;

  ctx.beginPath();
  ctx.arc(cx, cy, 96, 0, Math.PI * 2);
  ctx.stroke();

  // Inner thin ring
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 82, 0, Math.PI * 2);
  ctx.stroke();

  // 4 Cardinal tick marks
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 78, cy + Math.sin(a) * 78);
    ctx.lineTo(cx + Math.cos(a) * 100, cy + Math.sin(a) * 100);
    ctx.stroke();
  }

  // Draw Specific Rune Glyph
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();

  switch (symbol) {
    case "strength":
      ctx.moveTo(cx - 32, cy - 20);
      ctx.lineTo(cx, cy - 52);
      ctx.lineTo(cx + 32, cy - 20);
      ctx.moveTo(cx, cy - 52);
      ctx.lineTo(cx, cy + 42);
      ctx.moveTo(cx - 24, cy + 12);
      ctx.lineTo(cx + 24, cy + 12);
      break;
    case "mind":
      ctx.arc(cx, cy - 10, 30, 0, Math.PI * 2);
      ctx.moveTo(cx, cy + 20);
      ctx.lineTo(cx, cy + 50);
      ctx.moveTo(cx - 20, cy + 38);
      ctx.lineTo(cx + 20, cy + 38);
      break;
    case "vigor":
      ctx.moveTo(cx, cy - 42);
      ctx.bezierCurveTo(cx + 28, cy - 42, cx + 42, cy - 14, cx + 42, cy + 8);
      ctx.bezierCurveTo(cx + 42, cy + 36, cx + 14, cy + 54, cx, cy + 58);
      ctx.bezierCurveTo(cx - 14, cy + 54, cx - 42, cy + 36, cx - 42, cy + 8);
      ctx.bezierCurveTo(cx - 42, cy - 14, cx - 28, cy - 42, cx, cy - 42);
      break;
    case "endurance":
      ctx.moveTo(cx - 36, cy - 42);
      ctx.lineTo(cx + 36, cy - 42);
      ctx.moveTo(cx - 36, cy + 42);
      ctx.lineTo(cx + 36, cy + 42);
      ctx.moveTo(cx - 24, cy - 42);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx - 24, cy + 42);
      ctx.moveTo(cx + 24, cy - 42);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + 24, cy + 42);
      break;
    case "dexterity":
      ctx.moveTo(cx - 36, cy - 36);
      ctx.lineTo(cx + 36, cy + 36);
      ctx.moveTo(cx + 36, cy - 36);
      ctx.lineTo(cx - 36, cy + 36);
      ctx.moveTo(cx, cy - 46);
      ctx.lineTo(cx, cy + 46);
      break;
    case "discipline":
      ctx.moveTo(cx, cy - 48);
      ctx.lineTo(cx + 32, cy);
      ctx.lineTo(cx, cy + 48);
      ctx.lineTo(cx - 32, cy);
      ctx.closePath();
      ctx.moveTo(cx, cy - 24);
      ctx.lineTo(cx, cy + 24);
      break;
    default: // flame / bonfire
      ctx.moveTo(cx, cy - 48);
      ctx.quadraticCurveTo(cx + 28, cy - 6, cx + 24, cy + 32);
      ctx.quadraticCurveTo(cx, cy + 52, cx, cy + 52);
      ctx.quadraticCurveTo(cx, cy + 52, cx - 24, cy + 32);
      ctx.quadraticCurveTo(cx - 28, cy - 6, cx, cy - 48);
      ctx.moveTo(cx, cy - 14);
      ctx.quadraticCurveTo(cx + 10, cy + 8, cx, cy + 32);
      ctx.quadraticCurveTo(cx - 10, cy + 8, cx, cy - 14);
      break;
  }
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates realistic flame tongue alpha texture for organic fire lick ribbons.
 */
export function createFlameTongueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 256, 512);

  // Vertical teardrop flame shape
  const grad = ctx.createLinearGradient(128, 512, 128, 0);
  grad.addColorStop(0, "rgba(255, 140, 40, 0.95)");
  grad.addColorStop(0.3, "rgba(255, 100, 20, 0.85)");
  grad.addColorStop(0.7, "rgba(220, 50, 10, 0.5)");
  grad.addColorStop(1, "rgba(120, 20, 5, 0)");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(128, 10);
  ctx.bezierCurveTo(200, 150, 230, 380, 128, 500);
  ctx.bezierCurveTo(26, 380, 56, 150, 128, 10);
  ctx.fill();

  // Hot inner core
  const coreGrad = ctx.createLinearGradient(128, 512, 128, 100);
  coreGrad.addColorStop(0, "rgba(255, 250, 220, 0.95)");
  coreGrad.addColorStop(0.5, "rgba(255, 200, 80, 0.6)");
  coreGrad.addColorStop(1, "rgba(255, 120, 20, 0)");

  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.moveTo(128, 120);
  ctx.bezierCurveTo(168, 220, 180, 420, 128, 490);
  ctx.bezierCurveTo(76, 420, 88, 220, 128, 120);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
