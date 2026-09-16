import * as THREE from "three";

/**
 * Creates an ancient rune canvas texture with glowing sigil and carved dark stone border.
 */
export function createRuneTexture(label: string, symbol: string, runeColor = "#e8d3a0"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background - dark ancient stone
  ctx.fillStyle = "#161311";
  ctx.fillRect(0, 0, 512, 512);

  // Stone texture noise
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.08;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(232, 211, 160, ${alpha})` : `rgba(0, 0, 0, ${alpha * 2})`;
    ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
  }

  // Chiseled border
  ctx.strokeStyle = "#4a3d2c";
  ctx.lineWidth = 14;
  ctx.strokeRect(24, 24, 464, 464);

  ctx.strokeStyle = "#2c251d";
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 440, 440);

  // Corner sigil marks
  ctx.strokeStyle = runeColor;
  ctx.lineWidth = 4;
  const corners = [
    [50, 50, 80, 50, 50, 80],
    [462, 50, 432, 50, 462, 80],
    [50, 462, 80, 462, 50, 432],
    [462, 462, 432, 462, 462, 432],
  ];
  corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x3, y3);
    ctx.stroke();
  });

  // Central Mystic Glyph / Sigil
  ctx.save();
  ctx.translate(256, 230);

  // Outer glowing ring
  ctx.shadowColor = runeColor;
  ctx.shadowBlur = 24;
  ctx.strokeStyle = runeColor;
  ctx.lineWidth = 6;

  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();

  // Inner diamond
  ctx.beginPath();
  ctx.moveTo(0, -110);
  ctx.lineTo(110, 0);
  ctx.lineTo(0, 110);
  ctx.lineTo(-110, 0);
  ctx.closePath();
  ctx.stroke();

  // Specific rune symbol drawing
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  switch (symbol) {
    case "strength":
      ctx.moveTo(-50, -30);
      ctx.lineTo(0, -75);
      ctx.lineTo(50, -30);
      ctx.moveTo(0, -75);
      ctx.lineTo(0, 60);
      ctx.moveTo(-40, 20);
      ctx.lineTo(40, 20);
      ctx.moveTo(-60, 60);
      ctx.lineTo(60, 60);
      break;
    case "mind":
      ctx.arc(0, -10, 45, 0, Math.PI * 2);
      ctx.moveTo(0, 35);
      ctx.lineTo(0, 75);
      ctx.moveTo(-30, 60);
      ctx.lineTo(30, 60);
      break;
    case "vigor":
      ctx.moveTo(0, -60);
      ctx.bezierCurveTo(40, -60, 60, -20, 60, 10);
      ctx.bezierCurveTo(60, 50, 20, 75, 0, 80);
      ctx.bezierCurveTo(-20, 75, -60, 50, -60, 10);
      ctx.bezierCurveTo(-60, -20, -40, -60, 0, -60);
      break;
    case "endurance":
      ctx.moveTo(-50, -60);
      ctx.lineTo(50, -60);
      ctx.moveTo(-50, 60);
      ctx.lineTo(50, 60);
      ctx.moveTo(-35, -60);
      ctx.lineTo(0, 0);
      ctx.lineTo(-35, 60);
      ctx.moveTo(35, -60);
      ctx.lineTo(0, 0);
      ctx.lineTo(35, 60);
      break;
    case "dexterity":
      ctx.moveTo(-50, -50);
      ctx.lineTo(50, 50);
      ctx.moveTo(50, -50);
      ctx.lineTo(-50, 50);
      ctx.moveTo(0, -65);
      ctx.lineTo(0, 65);
      break;
    case "discipline":
      ctx.moveTo(0, -70);
      ctx.lineTo(45, 0);
      ctx.lineTo(0, 70);
      ctx.lineTo(-45, 0);
      ctx.closePath();
      ctx.moveTo(0, -35);
      ctx.lineTo(0, 35);
      break;
    default: // streak / bonfire
      ctx.moveTo(0, -70);
      ctx.quadraticCurveTo(40, -10, 35, 45);
      ctx.quadraticCurveTo(0, 75, 0, 75);
      ctx.quadraticCurveTo(0, 75, -35, 45);
      ctx.quadraticCurveTo(-40, -10, 0, -70);
      ctx.moveTo(0, -20);
      ctx.quadraticCurveTo(15, 10, 0, 45);
      ctx.quadraticCurveTo(-15, 10, 0, -20);
      break;
  }
  ctx.stroke();
  ctx.restore();

  // Label text at bottom
  ctx.save();
  ctx.font = "bold 34px 'Cinzel', serif, Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = runeColor;
  ctx.shadowColor = runeColor;
  ctx.shadowBlur = 18;
  ctx.letterSpacing = "6px";
  ctx.fillText(label.toUpperCase(), 256, 420);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates soft procedural particle texture (ember spark & smoke glow).
 */
export function createEmberParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255, 240, 200, 1)");
  grad.addColorStop(0.25, "rgba(235, 130, 45, 0.9)");
  grad.addColorStop(0.6, "rgba(180, 50, 20, 0.4)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates dark ground ash texture.
 */
export function createGroundTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0c0a09";
  ctx.fillRect(0, 0, 512, 512);

  // Concentric cracked ground
  ctx.strokeStyle = "#251c14";
  ctx.lineWidth = 3;
  for (let r = 40; r < 250; r += 30) {
    ctx.beginPath();
    ctx.arc(256, 256, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radial crack lines
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
    ctx.beginPath();
    ctx.moveTo(256 + Math.cos(a) * 30, 256 + Math.sin(a) * 30);
    ctx.lineTo(256 + Math.cos(a) * 240, 256 + Math.sin(a) * 240);
    ctx.stroke();
  }

  // Glowing center ember cracks
  ctx.shadowColor = "#d9772b";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#ff9a3c";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(256, 256);
    ctx.lineTo(256 + Math.cos(ang) * 65, 256 + Math.sin(ang) * 65);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
