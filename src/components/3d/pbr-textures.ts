import * as THREE from "three";

/**
 * Generates realistic Damascus Steel & Gold Runic Blade Texture.
 */
export function createSwordBladeTexture(): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  metalnessMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // 1. Base dark forged steel background
  ctx.fillStyle = "#1e1b18";
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Damascus steel wavy pattern
  ctx.strokeStyle = "rgba(180, 160, 130, 0.12)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 200; i++) {
    const y = i * 6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < 1024; x += 40) {
      ctx.quadraticCurveTo(
        x + 20,
        y + Math.sin(x * 0.04 + i) * 14,
        x + 40,
        y + Math.cos(x * 0.03) * 8
      );
    }
    ctx.stroke();
  }

  // 3. Central Runic Fuller Groove
  ctx.fillStyle = "#0c0a08";
  ctx.fillRect(490, 80, 44, 860);

  // 4. Gold Inlaid Ancient Runes inside the fuller groove
  ctx.shadowColor = "#e8d3a0";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#c9aa71";
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";

  const runes = [
    [512, 160],
    [512, 280],
    [512, 400],
    [512, 520],
    [512, 640],
    [512, 760],
    [512, 860],
  ];

  runes.forEach(([rx, ry], idx) => {
    ctx.beginPath();
    ctx.arc(rx, ry, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(rx - 8, ry - 14);
    ctx.lineTo(rx + 8, ry + 14);
    ctx.moveTo(rx + 8, ry - 14);
    ctx.lineTo(rx - 8, ry + 14);
    ctx.stroke();

    if (idx % 2 === 0) {
      ctx.beginPath();
      ctx.moveTo(rx, ry - 20);
      ctx.lineTo(rx, ry + 20);
      ctx.stroke();
    }
  });

  // 5. Sharpened Beveled Steel Edges
  const edgeGradL = ctx.createLinearGradient(0, 0, 120, 0);
  edgeGradL.addColorStop(0, "rgba(240, 230, 210, 0.65)");
  edgeGradL.addColorStop(1, "rgba(240, 230, 210, 0)");
  ctx.fillStyle = edgeGradL;
  ctx.fillRect(0, 0, 120, 1024);

  const edgeGradR = ctx.createLinearGradient(904, 0, 1024, 0);
  edgeGradR.addColorStop(0, "rgba(240, 230, 210, 0)");
  edgeGradR.addColorStop(1, "rgba(240, 230, 210, 0.65)");
  ctx.fillStyle = edgeGradR;
  ctx.fillRect(904, 0, 120, 1024);

  const map = new THREE.CanvasTexture(canvas);
  map.needsUpdate = true;

  // Bump map for surface roughness and chiseled edges
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext("2d")!;
  bCtx.fillStyle = "#808080";
  bCtx.fillRect(0, 0, 512, 512);

  // Groove recess
  bCtx.fillStyle = "#202020";
  bCtx.fillRect(245, 40, 22, 430);

  // Edges high relief
  bCtx.fillStyle = "#ffffff";
  bCtx.fillRect(0, 0, 30, 512);
  bCtx.fillRect(482, 0, 30, 512);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.needsUpdate = true;

  // Roughness Map (mirror-like edges, matte fuller)
  const roughCanvas = document.createElement("canvas");
  roughCanvas.width = 512;
  roughCanvas.height = 512;
  const rCtx = roughCanvas.getContext("2d")!;
  rCtx.fillStyle = "#404040"; // low roughness for shiny steel
  rCtx.fillRect(0, 0, 512, 512);
  rCtx.fillStyle = "#909090"; // matte center
  rCtx.fillRect(245, 40, 22, 430);
  rCtx.fillStyle = "#151515"; // ultra shiny edge
  rCtx.fillRect(0, 0, 40, 512);
  rCtx.fillRect(472, 0, 40, 512);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.needsUpdate = true;

  // Metalness map
  const metalCanvas = document.createElement("canvas");
  metalCanvas.width = 256;
  metalCanvas.height = 256;
  const mCtx = metalCanvas.getContext("2d")!;
  mCtx.fillStyle = "#f0f0f0"; // high metalness
  mCtx.fillRect(0, 0, 256, 256);
  const metalnessMap = new THREE.CanvasTexture(metalCanvas);
  metalnessMap.needsUpdate = true;

  return { map, bumpMap, roughnessMap, metalnessMap };
}

/**
 * Realistic ancient rock & granite texture with fractures.
 */
export function createRealisticRockTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#1b1713";
  ctx.fillRect(0, 0, 512, 512);

  // Rock mineral noise
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const val = Math.random();
    ctx.fillStyle = val > 0.6 ? "rgba(200, 180, 150, 0.08)" : "rgba(10, 8, 6, 0.15)";
    ctx.fillRect(x, y, Math.random() * 4 + 1, Math.random() * 4 + 1);
  }

  // Stone fissures & cracks
  ctx.strokeStyle = "rgba(10, 8, 6, 0.7)";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      x += (Math.random() - 0.5) * 80;
      y += (Math.random() - 0.5) * 80;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.needsUpdate = true;

  // Bump map
  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext("2d")!;
  bCtx.fillStyle = "#808080";
  bCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    bCtx.fillStyle = Math.random() > 0.5 ? "#a0a0a0" : "#505050";
    bCtx.fillRect(x, y, 3, 3);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.needsUpdate = true;

  return { map, bumpMap };
}

/**
 * Realistic Charred Wood Log Texture with glowing embers underneath.
 */
export function createRealisticWoodTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#110c08";
  ctx.fillRect(0, 0, 512, 512);

  // Bark grain lines
  ctx.strokeStyle = "#241810";
  ctx.lineWidth = 3;
  for (let x = 0; x < 512; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    for (let y = 0; y < 512; y += 40) {
      ctx.quadraticCurveTo(x + (Math.random() - 0.5) * 10, y + 20, x, y + 40);
    }
    ctx.stroke();
  }

  // Glowing charred cracks
  ctx.shadowColor = "#ff7b1a";
  ctx.shadowBlur = 8;
  ctx.strokeStyle = "#d9772b";
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * 512;
    ctx.beginPath();
    ctx.moveTo(x, Math.random() * 512);
    ctx.lineTo(x + (Math.random() - 0.5) * 60, Math.random() * 512);
    ctx.stroke();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.needsUpdate = true;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = 256;
  bumpCanvas.height = 256;
  const bCtx = bumpCanvas.getContext("2d")!;
  bCtx.fillStyle = "#404040";
  bCtx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 8) {
    bCtx.fillStyle = "#808080";
    bCtx.fillRect(x, 0, 3, 256);
  }
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.needsUpdate = true;

  return { map, bumpMap };
}

/**
 * Soft procedural radial ember particle texture with HDR center.
 */
export function createHighResParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.18, "rgba(255, 220, 140, 0.95)");
  grad.addColorStop(0.42, "rgba(235, 120, 30, 0.75)");
  grad.addColorStop(0.72, "rgba(160, 40, 10, 0.25)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
