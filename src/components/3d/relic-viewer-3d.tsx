"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createSwordBladeTexture, createHighResParticleTexture } from "./pbr-textures";

export interface RelicItem {
  id: string;
  name: string;
  type: string;
  rarity: "Legendary" | "Epic" | "Rare";
  lore: string;
  streakRequirement: string;
  bonus: string;
  modelType: "sword" | "shield" | "crown" | "medallion" | "ring";
  glowColor: string;
}

export const RELIC_LIST: RelicItem[] = [
  {
    id: "iron-will",
    name: "The Iron Will",
    type: "Colossal Greatsword",
    rarity: "Legendary",
    lore: "Forged in the crucible of thirty unbroken suns. Damascus steel that never dulls so long as the bearer refuses defeat.",
    streakRequirement: "30-Day Bonfire Streak",
    bonus: "+25% Rune Yield on Vigils",
    modelType: "sword",
    glowColor: "#ff9a3c",
  },
  {
    id: "aegis-dawn",
    name: "Aegis of the Dawn",
    type: "Heraldic Greatshield",
    rarity: "Epic",
    lore: "Carved from the bedrock of the ancient Keep. Absorbs the bitterness of missed opportunities and turns it to resolve.",
    streakRequirement: "14-Day Bonfire Streak",
    bonus: "+1 Extra Ember Flask Capacity",
    modelType: "shield",
    glowColor: "#4fa3e8",
  },
  {
    id: "ash-crown",
    name: "Crown of the Ashen Sovereign",
    type: "Regalia",
    rarity: "Legendary",
    lore: "Worn by those who have walked the path of 100 days through storm and trial. The embers in its crest never fade.",
    streakRequirement: "100-Day Bonfire Streak",
    bonus: "Title: Sovereign of the Unbroken Dawn",
    modelType: "crown",
    glowColor: "#f59e0b",
  },
  {
    id: "vigil-seal",
    name: "Medallion of the Long Vigil",
    type: "Talisman",
    rarity: "Rare",
    lore: "Given to those who conquer their daily oaths before high noon. It radiates a quiet, steady warmth.",
    streakRequirement: "7-Day Bonfire Streak",
    bonus: "+10 Focus points on Daybreak",
    modelType: "medallion",
    glowColor: "#34d399",
  },
  {
    id: "oath-ring",
    name: "Band of Unbroken Vows",
    type: "Signet Ring",
    rarity: "Epic",
    lore: "Every vice resisted etches a new golden facet into the obsidian band.",
    streakRequirement: "21-Day Vice-Free Streak",
    bonus: "Halves Rune Loss upon Falling",
    modelType: "ring",
    glowColor: "#a855f7",
  },
];

interface RelicViewer3DProps {
  activeRelicId: string;
}

export function RelicViewer3D({ activeRelicId }: RelicViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRelic = RELIC_LIST.find((r) => r.id === activeRelicId) || RELIC_LIST[0];
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const test = document.createElement("canvas");
      if (!window.WebGLRenderingContext || (!test.getContext("webgl") && !test.getContext("experimental-webgl"))) {
        return;
      }
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Calibrated Bloom
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.75, // balanced strength
      0.5,  // radius
      0.4   // threshold so only bright emissive spots glow
    );
    composer.addPass(bloomPass);

    // Studio 3-Point Lighting
    const ambient = new THREE.AmbientLight(0x302620, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 2.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x405570, 1.5);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const topRimLight = new THREE.DirectionalLight(0xc9aa71, 1.8);
    topRimLight.position.set(0, 6, -2);
    scene.add(topRimLight);

    const relicColor = new THREE.Color(activeRelic.glowColor);
    const glowLight = new THREE.PointLight(relicColor, 2.2, 8);
    glowLight.position.set(0, 0, 1.4);
    scene.add(glowLight);

    // Master Group
    const relicGroup = new THREE.Group();
    scene.add(relicGroup);

    // PBR Materials
    const goldPBR = new THREE.MeshStandardMaterial({
      color: 0xc9aa71,
      metalness: 0.9,
      roughness: 0.25,
    });

    const darkSteelPBR = new THREE.MeshStandardMaterial({
      color: 0x24201c,
      metalness: 0.82,
      roughness: 0.32,
    });

    const gemMat = new THREE.MeshStandardMaterial({
      color: relicColor,
      emissive: relicColor,
      emissiveIntensity: 0.65, // balanced glow
      roughness: 0.1,
      metalness: 0.2,
    });

    switch (activeRelic.modelType) {
      case "sword": {
        const bladePBR = createSwordBladeTexture();
        const bladeMat = new THREE.MeshStandardMaterial({
          map: bladePBR.map,
          bumpMap: bladePBR.bumpMap,
          bumpScale: 0.05,
          roughnessMap: bladePBR.roughnessMap,
          metalnessMap: bladePBR.metalnessMap,
        });

        // Tapered double-edged blade
        const bladeGeo = new THREE.BoxGeometry(0.32, 2.7, 0.06, 2, 16, 2);
        const pos = bladeGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          if (y > 0.8) {
            const factor = Math.max(0.05, 1.0 - (y - 0.8) / 0.55);
            pos.setX(i, pos.getX(i) * factor);
            pos.setZ(i, pos.getZ(i) * factor);
          }
        }
        bladeGeo.computeVertexNormals();

        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.35;
        relicGroup.add(blade);

        // Glowing runic fuller core
        const coreGeo = new THREE.BoxGeometry(0.035, 1.9, 0.065);
        const coreMesh = new THREE.Mesh(coreGeo, gemMat);
        coreMesh.position.y = 0.3;
        relicGroup.add(coreMesh);

        // Dragon-wing Crossguard
        const guardGroup = new THREE.Group();
        const mainGuardGeo = new THREE.BoxGeometry(1.1, 0.14, 0.16);
        const mainGuard = new THREE.Mesh(mainGuardGeo, goldPBR);
        guardGroup.add(mainGuard);

        for (const side of [-1, 1]) {
          const quillonGeo = new THREE.ConeGeometry(0.1, 0.35, 6);
          const quillon = new THREE.Mesh(quillonGeo, goldPBR);
          quillon.position.set(side * 0.55, 0.1, 0);
          quillon.rotation.z = side * -0.7;
          guardGroup.add(quillon);
        }
        guardGroup.position.y = -1.0;
        relicGroup.add(guardGroup);

        // Hilt
        const hiltGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.68, 16);
        const hilt = new THREE.Mesh(hiltGeo, darkSteelPBR);
        hilt.position.y = -1.4;
        relicGroup.add(hilt);

        // Wire spirals
        const wireGeo = new THREE.TorusGeometry(0.075, 0.012, 8, 24);
        for (let w = 0; w < 6; w++) {
          const wire = new THREE.Mesh(wireGeo, goldPBR);
          wire.position.y = -1.15 - w * 0.08;
          wire.rotation.x = Math.PI / 2;
          relicGroup.add(wire);
        }

        // Pommel
        const pommelGeo = new THREE.DodecahedronGeometry(0.16, 1);
        const pommel = new THREE.Mesh(pommelGeo, goldPBR);
        pommel.position.y = -1.82;
        relicGroup.add(pommel);

        const gemGeo = new THREE.OctahedronGeometry(0.08, 0);
        const gem = new THREE.Mesh(gemGeo, gemMat);
        gem.position.set(0, -1.82, 0.09);
        relicGroup.add(gem);

        relicGroup.rotation.z = Math.PI / 4.2;
        break;
      }

      case "shield": {
        // Complete Curved Kite Shield
        const shieldGroup = new THREE.Group();

        // 1. Solid Shield Face
        const shieldShape = new THREE.Shape();
        shieldShape.moveTo(-0.75, 1.2);
        shieldShape.lineTo(0.75, 1.2);
        shieldShape.bezierCurveTo(0.8, 0.3, 0.6, -0.6, 0.0, -1.4);
        shieldShape.bezierCurveTo(-0.6, -0.6, -0.8, 0.3, -0.75, 1.2);

        const extrudeSettings = {
          depth: 0.08,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 1,
          bevelSize: 0.04,
          bevelThickness: 0.04,
        };

        const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
        const shieldMesh = new THREE.Mesh(shieldGeo, darkSteelPBR);
        shieldMesh.position.z = -0.04;
        shieldGroup.add(shieldMesh);

        // 2. Gold Outer Border / Rim
        const rimGeo = new THREE.TorusGeometry(0.9, 0.045, 12, 32);
        const rimMesh = new THREE.Mesh(rimGeo, goldPBR);
        rimMesh.scale.set(0.82, 1.28, 1);
        rimMesh.position.set(0, -0.05, 0.06);
        shieldGroup.add(rimMesh);

        // 3. Central Cross Reinforcement
        const vBarGeo = new THREE.BoxGeometry(0.12, 2.2, 0.06);
        const vBar = new THREE.Mesh(vBarGeo, goldPBR);
        vBar.position.set(0, -0.05, 0.06);
        const hBarGeo = new THREE.BoxGeometry(1.35, 0.12, 0.06);
        const hBar = new THREE.Mesh(hBarGeo, goldPBR);
        hBar.position.set(0, 0.35, 0.06);
        shieldGroup.add(vBar, hBar);

        // 4. Center Radiant Gem Boss
        const bossGeo = new THREE.OctahedronGeometry(0.22, 1);
        const boss = new THREE.Mesh(bossGeo, gemMat);
        boss.position.set(0, 0.35, 0.15);
        shieldGroup.add(boss);

        // 5. Perimeter Steel Rivets
        for (let r = 0; r < 14; r++) {
          const a = (r / 14) * Math.PI * 2;
          const rivetGeo = new THREE.SphereGeometry(0.032, 8, 8);
          const rivet = new THREE.Mesh(rivetGeo, goldPBR);
          rivet.position.set(Math.cos(a) * 0.65, Math.sin(a) * 1.05 - 0.05, 0.09);
          shieldGroup.add(rivet);
        }

        relicGroup.add(shieldGroup);
        break;
      }

      case "crown": {
        const ringGeo = new THREE.CylinderGeometry(0.95, 0.9, 0.45, 32, 1, true);
        const ring = new THREE.Mesh(ringGeo, darkSteelPBR);
        relicGroup.add(ring);

        for (let i = 0; i < 7; i++) {
          const ang = (i / 7) * Math.PI * 2;
          const spikeHeight = 0.75 + (i % 2) * 0.35;
          const spikeGeo = new THREE.ConeGeometry(0.16, spikeHeight, 4);
          const spike = new THREE.Mesh(spikeGeo, goldPBR);
          spike.position.set(Math.cos(ang) * 0.92, 0.5, Math.sin(ang) * 0.92);
          spike.rotation.y = ang;
          relicGroup.add(spike);

          const crownGemGeo = new THREE.OctahedronGeometry(0.07, 1);
          const crownGem = new THREE.Mesh(crownGemGeo, gemMat);
          crownGem.position.set(Math.cos(ang) * 0.96, 0.2, Math.sin(ang) * 0.96);
          relicGroup.add(crownGem);
        }
        relicGroup.rotation.x = 0.42;
        break;
      }

      case "medallion": {
        const outerDiscGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.12, 36);
        const outerDisc = new THREE.Mesh(outerDiscGeo, goldPBR);
        outerDisc.rotation.x = Math.PI / 2;
        relicGroup.add(outerDisc);

        const innerRingGeo = new THREE.TorusGeometry(0.85, 0.05, 16, 32);
        const innerRing = new THREE.Mesh(innerRingGeo, darkSteelPBR);
        relicGroup.add(innerRing);

        const centerGemGeo = new THREE.DodecahedronGeometry(0.38, 1);
        const centerGem = new THREE.Mesh(centerGemGeo, gemMat);
        centerGem.position.z = 0.12;
        relicGroup.add(centerGem);
        break;
      }

      case "ring":
      default: {
        const ringGeo = new THREE.TorusGeometry(0.92, 0.24, 20, 48);
        const ring = new THREE.Mesh(ringGeo, darkSteelPBR);
        relicGroup.add(ring);

        const bandGeo = new THREE.TorusGeometry(0.92, 0.09, 16, 48);
        const band = new THREE.Mesh(bandGeo, goldPBR);
        relicGroup.add(band);

        const stoneMountGeo = new THREE.DodecahedronGeometry(0.34, 1);
        const stoneMount = new THREE.Mesh(stoneMountGeo, gemMat);
        stoneMount.position.set(0, 0.98, 0);
        relicGroup.add(stoneMount);

        relicGroup.rotation.x = 0.58;
        break;
      }
    }

    // High-Res Swirling Ember Particles
    const pTex = createHighResParticleTexture();
    const pCount = 45;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.9 + Math.random() * 0.9;
      pPos[i * 3] = Math.cos(a) * r;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      pPos[i * 3 + 2] = Math.sin(a) * r;
      pSpeeds[i] = 0.5 + Math.random() * 0.8;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.14,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: relicColor,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse tilt
    let mouseX = 0;
    let mouseY = 0;
    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("mousemove", handleMove);

    // Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      relicGroup.rotation.y += 0.012;
      relicGroup.rotation.x = THREE.MathUtils.lerp(
        relicGroup.rotation.x,
        mouseY * 0.35 + (activeRelic.modelType === "sword" ? 0.2 : 0),
        0.05
      );
      relicGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

      glowLight.intensity = 2.2 + Math.sin(elapsed * 3) * 0.8;

      // Swirl particles
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        const curX = arr[i * 3];
        const curZ = arr[i * 3 + 2];
        const ang = Math.atan2(curZ, curX) + 0.02 * pSpeeds[i];
        const rad = Math.sqrt(curX * curX + curZ * curZ);
        arr[i * 3] = Math.cos(ang) * rad;
        arr[i * 3 + 2] = Math.sin(ang) * rad;
        arr[i * 3 + 1] += 0.007 * pSpeeds[i];
        if (arr[i * 3 + 1] > 1.5) arr[i * 3 + 1] = -1.5;
      }
      pGeo.attributes.position.needsUpdate = true;

      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", handleMove);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeRelic]);

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[340px] md:h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-full blur-3xl opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${activeRelic.glowColor} 0%, transparent 70%)`,
          transform: isHovered ? "scale(1.2)" : "scale(1)",
        }}
      />
    </div>
  );
}
