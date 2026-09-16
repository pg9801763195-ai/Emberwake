"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createCircularRuneTexture, createFlameTongueTexture } from "./rune-glyph-texture";
import {
  createRealisticRockTexture,
  createRealisticWoodTexture,
  createHighResParticleTexture,
  createSwordBladeTexture,
} from "./pbr-textures";
import { createGroundTexture } from "./textures";

interface HeroBonfireSceneProps {
  isAwakening?: boolean;
  onAwakenComplete?: () => void;
  hoverAwaken?: boolean;
  onSelectRune?: (runeName: string) => void;
}

interface RuneGlyphData {
  id: string;
  name: string;
  symbol: string;
  color: string;
  angle: number;
  radius: number;
  height: number;
  baseAngle?: number;
  originalY?: number;
}

// Spaced out in an expansive, elegant orbital ring
const RUNES: RuneGlyphData[] = [
  { id: "vigor", name: "Vigor", symbol: "vigor", color: "#e88040", angle: 0, radius: 5.6, height: 1.5 },
  { id: "mind", name: "Mind", symbol: "mind", color: "#60a5fa", angle: (Math.PI * 2) / 7, radius: 5.8, height: 2.3 },
  { id: "endurance", name: "Endurance", symbol: "endurance", color: "#4ade80", angle: ((Math.PI * 2) / 7) * 2, radius: 5.4, height: 1.7 },
  { id: "strength", name: "Strength", symbol: "strength", color: "#f87171", angle: ((Math.PI * 2) / 7) * 3, radius: 5.7, height: 2.5 },
  { id: "dexterity", name: "Dexterity", symbol: "dexterity", color: "#c084fc", angle: ((Math.PI * 2) / 7) * 4, radius: 5.5, height: 1.9 },
  { id: "discipline", name: "Discipline", symbol: "discipline", color: "#e8d3a0", angle: ((Math.PI * 2) / 7) * 5, radius: 5.9, height: 2.6 },
  { id: "streak", name: "Bonfire", symbol: "streak", color: "#fbbf24", angle: ((Math.PI * 2) / 7) * 6, radius: 5.3, height: 1.6 },
];

export function HeroBonfireScene({
  isAwakening = false,
  onAwakenComplete,
  hoverAwaken = false,
  onSelectRune,
}: HeroBonfireSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  const isAwakeningRef = useRef(isAwakening);
  isAwakeningRef.current = isAwakening;

  const hoverAwakenRef = useRef(hoverAwaken);
  hoverAwakenRef.current = hoverAwaken;

  const handleRuneClick = useCallback((name: string) => {
    if (onSelectRune) onSelectRune(name);
  }, [onSelectRune]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const test = document.createElement("canvas");
      if (!window.WebGLRenderingContext || (!test.getContext("webgl") && !test.getContext("experimental-webgl"))) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Scene & Deep Atmospheric Fog (Softened so ground and background are clearly visible)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x120e0b, 0.032);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 90);
    camera.position.set(0, 2.0, 8.4);
    camera.lookAt(0, 1.25, 0);

    // 3. Renderer with ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Unreal Bloom Pass
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.65, // balanced bloom
      0.5,
      0.35
    );
    composer.addPass(bloomPass);

    // 5. Rich Dynamic Lighting (Reveals terrain, wood, rocks, and fallen warriors)
    const ambientLight = new THREE.AmbientLight(0x382c22, 1.6);
    scene.add(ambientLight);

    // Main Bonfire Dynamic Point Light (casts long warm shadows)
    const fireLight = new THREE.PointLight(0xff8420, 4.5, 26, 1.1);
    fireLight.position.set(0, 1.4, 0);
    scene.add(fireLight);

    // Ground Bounce Firelight
    const bounceLight = new THREE.PointLight(0xd95010, 3.2, 14, 1.4);
    bounceLight.position.set(0, 0.4, 0);
    scene.add(bounceLight);

    // Back Moon/Atmospheric Rim Light (catches edges of armor & ruins)
    const rimLight = new THREE.DirectionalLight(0x607088, 2.2);
    rimLight.position.set(-6, 9, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x403024, 1.4);
    fillLight.position.set(6, 4, 5);
    scene.add(fillLight);

    // 6. Ground Plane with Visible Texture & Magma Veins
    const groundTex = createGroundTexture();
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(2, 2);
    const groundGeo = new THREE.PlaneGeometry(40, 40, 48, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.82,
      metalness: 0.18,
      color: 0x32271f,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.05;
    scene.add(groundMesh);

    // 7. LOAD USER 3D CAMPFIRE MODEL (cgtrader_optimized_Campfire.fbx)
    const woodPBR = createRealisticWoodTexture();
    const rockPBR = createRealisticRockTexture();

    const campfireMat = new THREE.MeshStandardMaterial({
      map: woodPBR.map,
      bumpMap: woodPBR.bumpMap,
      bumpScale: 0.09,
      roughness: 0.8,
      metalness: 0.2,
      color: 0x4a382b,
    });

    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      "/cgtrader_optimized_Campfire.fbx",
      (fbx) => {
        fbx.scale.set(3.2, 3.2, 3.2);
        fbx.position.set(0, 0, 0);

        fbx.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = campfireMat;
          }
        });
        scene.add(fbx);
      },
      undefined,
      () => {
        // Fallback procedural base if needed
        const fallbackGroup = new THREE.Group();
        for (let i = 0; i < 14; i++) {
          const a = (i / 14) * Math.PI * 2;
          const sGeo = new THREE.DodecahedronGeometry(0.32, 1);
          const s = new THREE.Mesh(sGeo, campfireMat);
          s.position.set(Math.cos(a) * 1.35, 0.12, Math.sin(a) * 1.35);
          fallbackGroup.add(s);
        }
        scene.add(fallbackGroup);
      }
    );

    // Glowing Ember Coals at the Base
    const coalGeo = new THREE.ConeGeometry(1.2, 0.28, 24);
    const coalMat = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff4500,
      emissiveIntensity: 0.85,
      roughness: 0.85,
    });
    const coalMound = new THREE.Mesh(coalGeo, coalMat);
    coalMound.position.y = 0.08;
    scene.add(coalMound);

    // 8. THE ICONIC COILED GREATSWORD THRUST INTO BONFIRE
    const swordGroup = new THREE.Group();
    const bladePBR = createSwordBladeTexture();
    const swordBladeMat = new THREE.MeshStandardMaterial({
      map: bladePBR.map,
      bumpMap: bladePBR.bumpMap,
      bumpScale: 0.06,
      metalness: 0.92,
      roughness: 0.25,
    });
    const goldPBR = new THREE.MeshStandardMaterial({
      color: 0xd4b070,
      metalness: 0.94,
      roughness: 0.2,
    });
    const darkSteelPBR = new THREE.MeshStandardMaterial({
      color: 0x2c2622,
      metalness: 0.88,
      roughness: 0.3,
    });

    // 2.7m Colossal Blade
    const bladeGeo = new THREE.BoxGeometry(0.24, 2.7, 0.05, 2, 16, 2);
    const swordBlade = new THREE.Mesh(bladeGeo, swordBladeMat);
    swordBlade.position.y = 1.15;
    swordGroup.add(swordBlade);

    // Glowing Runic core along blade
    const swordCoreGeo = new THREE.BoxGeometry(0.032, 2.1, 0.058);
    const swordCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffaa33,
      emissive: 0xffaa33,
      emissiveIntensity: 0.9,
    });
    const swordCore = new THREE.Mesh(swordCoreGeo, swordCoreMat);
    swordCore.position.y = 1.15;
    swordGroup.add(swordCore);

    // Dragon-Wing Crossguard
    const swordGuardGeo = new THREE.BoxGeometry(0.92, 0.12, 0.14);
    const swordGuard = new THREE.Mesh(swordGuardGeo, goldPBR);
    swordGuard.position.y = 2.45;
    swordGroup.add(swordGuard);

    // Hilt & Wire Wrapping
    const swordHiltGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.65, 12);
    const swordHilt = new THREE.Mesh(swordHiltGeo, darkSteelPBR);
    swordHilt.position.y = 2.8;
    swordGroup.add(swordHilt);

    const swordPommelGeo = new THREE.DodecahedronGeometry(0.14, 1);
    const swordPommel = new THREE.Mesh(swordPommelGeo, goldPBR);
    swordPommel.position.y = 3.2;
    swordGroup.add(swordPommel);

    // Plunged diagonal tilt
    swordGroup.position.set(0.06, 0, 0);
    swordGroup.rotation.z = -0.14;
    swordGroup.rotation.x = 0.08;
    scene.add(swordGroup);

    // 9. REALISTIC FLAME TONGUE RIBBONS LICKING UP THE SWORD
    const flameTex = createFlameTongueTexture();
    const flameMat = new THREE.MeshBasicMaterial({
      map: flameTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const flameGroup = new THREE.Group();
    const flameRibbons: THREE.Mesh[] = [];

    for (let f = 0; f < 8; f++) {
      const fGeo = new THREE.PlaneGeometry(0.75 + (f % 3) * 0.2, 2.0 + (f % 4) * 0.3, 8, 12);
      const ribbon = new THREE.Mesh(fGeo, flameMat);
      const ang = (f / 8) * Math.PI * 2;
      const rad = 0.2 + (f % 2) * 0.12;
      ribbon.position.set(Math.cos(ang) * rad, 1.05 + (f % 3) * 0.2, Math.sin(ang) * rad);
      ribbon.rotation.y = ang + Math.PI / 4;
      flameGroup.add(ribbon);
      flameRibbons.push(ribbon);
    }
    scene.add(flameGroup);

    // 10. FALLEN WARRIORS & SCATTERED ARMOR IN THE BACKGROUND
    const armorSteelMat = new THREE.MeshStandardMaterial({
      color: 0x322c26,
      metalness: 0.85,
      roughness: 0.32,
    });
    const rustIronMat = new THREE.MeshStandardMaterial({
      color: 0x221a14,
      metalness: 0.75,
      roughness: 0.55,
    });

    const fallenGroup = new THREE.Group();

    // Helper: Create a slumped/fallen knight
    const createFallenKnight = (x: number, z: number, rotY: number, leanZ: number) => {
      const knight = new THREE.Group();

      // Torso / Plate Cuirass
      const torsoGeo = new THREE.CylinderGeometry(0.3, 0.24, 0.9, 10);
      const torso = new THREE.Mesh(torsoGeo, armorSteelMat);
      torso.position.y = 0.5;
      knight.add(torso);

      // Greathelm
      const helmGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.38, 10);
      const helm = new THREE.Mesh(helmGeo, armorSteelMat);
      helm.position.y = 1.05;
      helm.rotation.x = 0.3; // head tilted forward
      knight.add(helm);

      // Visor slit
      const visorGeo = new THREE.BoxGeometry(0.16, 0.03, 0.22);
      const visorMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const visor = new THREE.Mesh(visorGeo, visorMat);
      visor.position.set(0, 1.05, 0.08);
      knight.add(visor);

      // Pauldrons
      for (const side of [-1, 1]) {
        const pauldronGeo = new THREE.DodecahedronGeometry(0.18, 1);
        const pauldron = new THREE.Mesh(pauldronGeo, armorSteelMat);
        pauldron.position.set(side * 0.42, 0.85, 0);
        knight.add(pauldron);
      }

      // Greaves / legs on ground
      const legLGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.9, 8);
      const legL = new THREE.Mesh(legLGeo, armorSteelMat);
      legL.position.set(-0.25, 0.2, 0.35);
      legL.rotation.x = Math.PI / 2.5;
      const legR = new THREE.Mesh(legLGeo, armorSteelMat);
      legR.position.set(0.25, 0.2, 0.35);
      legR.rotation.x = Math.PI / 2.3;
      knight.add(legL, legR);

      // Grounded Greatsword / Weapon beside fallen knight
      const weaponBladeGeo = new THREE.BoxGeometry(0.08, 1.6, 0.02);
      const weaponBlade = new THREE.Mesh(weaponBladeGeo, rustIronMat);
      weaponBlade.position.set(0.65, 0.5, 0.2);
      weaponBlade.rotation.z = -0.6;
      weaponBlade.rotation.y = 0.3;
      knight.add(weaponBlade);

      // Broken Heraldic Shield resting against body
      const shieldGeo = new THREE.CylinderGeometry(0.55, 0.2, 1.1, 16, 1, false, 0, Math.PI);
      const shield = new THREE.Mesh(shieldGeo, goldPBR);
      shield.position.set(-0.55, 0.35, 0.25);
      shield.rotation.y = -Math.PI / 3;
      shield.rotation.z = 0.4;
      knight.add(shield);

      knight.position.set(x, 0, z);
      knight.rotation.y = rotY;
      knight.rotation.z = leanZ;
      return knight;
    };

    // Fallen Knight 1: Left background, slumped against ruined rock
    const knight1 = createFallenKnight(-3.2, -2.8, 0.7, 0.25);
    fallenGroup.add(knight1);

    // Fallen Knight 2: Right background, fallen on earth
    const knight2 = createFallenKnight(3.4, -3.2, -0.9, -0.3);
    fallenGroup.add(knight2);

    // Fallen Champion 3: Center far background kneeling
    const knight3 = createFallenKnight(0.8, -4.6, 0.2, 0.15);
    fallenGroup.add(knight3);

    // Scattered Swords & Broken Shields in perimeter
    const sword1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.4, 0.02), rustIronMat);
    sword1.position.set(-2.2, 0.4, 1.6);
    sword1.rotation.set(0.8, 0.4, -0.5);
    fallenGroup.add(sword1);

    const sword2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.5, 0.02), rustIronMat);
    sword2.position.set(2.4, 0.4, 1.4);
    sword2.rotation.set(-0.6, -0.3, 0.6);
    fallenGroup.add(sword2);

    scene.add(fallenGroup);

    // 11. ANCIENT RUINED MONOLITHS & GOTHIC PILLARS IN MIST
    const stoneRuinMat = new THREE.MeshStandardMaterial({
      map: rockPBR.map,
      bumpMap: rockPBR.bumpMap,
      bumpScale: 0.1,
      roughness: 0.88,
      metalness: 0.12,
      color: 0x362c24,
    });

    const ruinPillars = [
      [-5.5, 0, -5.0, 5.5, 0.6],
      [5.5, 0, -5.0, 5.0, 0.55],
      [-3.8, 0, -3.4, 2.8, 0.45], // Behind left fallen knight
      [4.0, 0, -3.8, 2.5, 0.45],  // Behind right fallen knight
      [-7.0, 0, -1.5, 4.2, 0.5],
      [7.0, 0, -1.5, 4.5, 0.5],
    ];

    ruinPillars.forEach(([px, py, pz, ph, pr]) => {
      const pGeo = new THREE.CylinderGeometry(pr * 0.9, pr * 1.1, ph, 10);
      const pillar = new THREE.Mesh(pGeo, stoneRuinMat);
      pillar.position.set(px, ph / 2 + py, pz);
      pillar.rotation.y = Math.random() * Math.PI;
      scene.add(pillar);
    });

    // 12. HIGH-RES RISING EMBERS & ASH SPRAY
    const particleTex = createHighResParticleTexture();
    const emberCount = 450;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities = new Float32Array(emberCount * 3);
    const emberScales = new Float32Array(emberCount);
    const emberLifes = new Float32Array(emberCount);
    const emberMaxLifes = new Float32Array(emberCount);

    for (let i = 0; i < emberCount; i++) {
      const radius = Math.random() * 0.85;
      const angle = Math.random() * Math.PI * 2;
      emberPositions[i * 3] = Math.cos(angle) * radius;
      emberPositions[i * 3 + 1] = 0.2 + Math.random() * 5.5;
      emberPositions[i * 3 + 2] = Math.sin(angle) * radius;

      emberVelocities[i * 3] = (Math.random() - 0.5) * 0.035;
      emberVelocities[i * 3 + 1] = 0.025 + Math.random() * 0.06;
      emberVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.035;

      emberScales[i] = 0.14 + Math.random() * 0.2;
      emberMaxLifes[i] = 3.0 + Math.random() * 3.0;
      emberLifes[i] = Math.random() * emberMaxLifes[i];
    }

    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
    emberGeo.setAttribute("scale", new THREE.BufferAttribute(emberScales, 1));

    const emberMat = new THREE.PointsMaterial({
      size: 0.22,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffa033,
    });
    const emberParticles = new THREE.Points(emberGeo, emberMat);
    scene.add(emberParticles);

    // 13. WIDE-ORBIT TRANSPARENT CIRCULAR RUNES (NO BOX SLABS)
    const runeMeshes: THREE.Mesh[] = [];
    const runeGroup = new THREE.Group();

    RUNES.forEach((r) => {
      const runeTex = createCircularRuneTexture(r.name, r.symbol, r.color);
      const runeGeo = new THREE.PlaneGeometry(1.0, 1.0);
      const rMat = new THREE.MeshBasicMaterial({
        map: runeTex,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const runeMesh = new THREE.Mesh(runeGeo, rMat);
      runeMesh.position.set(
        Math.cos(r.angle) * r.radius,
        r.height,
        Math.sin(r.angle) * r.radius
      );
      runeMesh.userData = { ...r, originalY: r.height, baseAngle: r.angle };

      runeGroup.add(runeMesh);
      runeMeshes.push(runeMesh);
    });
    scene.add(runeGroup);

    // 14. Mouse Parallax & Raycasting
    const mousePos = new THREE.Vector2();
    const mouseRef = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const hoveredMeshRef = { current: null as THREE.Mesh | null };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.targetX = mousePos.x;
      mouseRef.targetY = mousePos.y;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(runeMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData as RuneGlyphData;
        handleRuneClick(data.name);
      }
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    container.addEventListener("click", handleClick);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 15. ANIMATION LOOP
    let animId: number;
    const startTime = performance.now();
    let lastTime = performance.now();
    let awakenProgress = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      mouseRef.x += (mouseRef.targetX - mouseRef.x) * 0.05;
      mouseRef.y += (mouseRef.targetY - mouseRef.y) * 0.05;

      const isAwakeningNow = isAwakeningRef.current;
      const isHoveringAwaken = hoverAwakenRef.current;

      if (isAwakeningNow) {
        awakenProgress = Math.min(1, awakenProgress + delta * 0.85);
        camera.position.x = THREE.MathUtils.lerp(0, 0, Math.pow(awakenProgress, 2));
        camera.position.y = THREE.MathUtils.lerp(2.0, 1.25, Math.pow(awakenProgress, 2));
        camera.position.z = THREE.MathUtils.lerp(8.4, 1.2, Math.pow(awakenProgress, 2));
        camera.lookAt(0, 1.25, 0);

        fireLight.intensity = THREE.MathUtils.lerp(4.5, 18.0, awakenProgress);
        bounceLight.intensity = THREE.MathUtils.lerp(3.2, 14.0, awakenProgress);
        bloomPass.strength = THREE.MathUtils.lerp(0.65, 2.0, awakenProgress);

        if (awakenProgress >= 0.98 && onAwakenComplete) {
          onAwakenComplete();
        }
      } else {
        const baseCamX = Math.sin(elapsed * 0.3) * 0.18 - mouseRef.x * 0.55;
        const baseCamY = 2.0 + Math.cos(elapsed * 0.4) * 0.08 + mouseRef.y * 0.35;
        const baseCamZ = 8.4 + Math.sin(elapsed * 0.2) * 0.15;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, baseCamX, 0.06);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, baseCamY, 0.06);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseCamZ, 0.06);
        camera.lookAt(0, 1.25, 0);

        bloomPass.strength = isHoveringAwaken ? 0.95 : 0.65;
      }

      // Organic Multi-Frequency Firelight Flicker (sweeps light across fallen knights)
      const flicker =
        Math.sin(elapsed * 12) * 0.5 +
        Math.sin(elapsed * 23) * 0.35 +
        Math.sin(elapsed * 38) * 0.2;
      const boost = isHoveringAwaken ? 1.4 : 1.0;
      if (!isAwakeningNow) {
        fireLight.intensity = (4.5 + flicker) * boost;
        bounceLight.intensity = (3.2 + flicker * 0.8) * boost;
      }

      // Animate Flame Ribbons along the Sword
      flameRibbons.forEach((ribbon, i) => {
        const speed = 2.4 + (i % 3) * 0.5;
        ribbon.scale.y = 1.0 + Math.sin(elapsed * speed + i * 1.5) * 0.25;
        ribbon.scale.x = 0.9 + Math.cos(elapsed * speed * 0.8 + i) * 0.15;
        ribbon.rotation.z = Math.sin(elapsed * 1.8 + i) * 0.08;
      });

      // Particle physics
      const posAttr = emberGeo.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const pSpeed = isAwakeningNow ? 3.0 : isHoveringAwaken ? 1.6 : 1.0;

      for (let i = 0; i < emberCount; i++) {
        emberLifes[i] += delta * pSpeed;
        if (emberLifes[i] > emberMaxLifes[i] || posArr[i * 3 + 1] > 6.2) {
          emberLifes[i] = 0;
          const r = Math.random() * (0.65 + (isHoveringAwaken ? 0.35 : 0));
          const a = Math.random() * Math.PI * 2;
          posArr[i * 3] = Math.cos(a) * r;
          posArr[i * 3 + 1] = 0.2;
          posArr[i * 3 + 2] = Math.sin(a) * r;

          emberVelocities[i * 3] = (Math.random() - 0.5) * 0.035;
          emberVelocities[i * 3 + 1] = 0.025 + Math.random() * 0.055;
          emberVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.035;
        } else {
          const turb = Math.sin(elapsed * 3.5 + posArr[i * 3 + 1] * 2) * 0.006;
          posArr[i * 3] += (emberVelocities[i * 3] + turb) * pSpeed;
          posArr[i * 3 + 1] += emberVelocities[i * 3 + 1] * pSpeed;
          posArr[i * 3 + 2] += (emberVelocities[i * 3 + 2] + Math.cos(elapsed * 2.5 + i) * 0.005) * pSpeed;
        }
      }
      posAttr.needsUpdate = true;

      // Raycast Rune Hover
      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(runeMeshes);
      let currentHovered: THREE.Mesh | null = null;
      if (intersects.length > 0) {
        currentHovered = intersects[0].object as THREE.Mesh;
        container.style.cursor = "pointer";
      } else {
        container.style.cursor = "default";
      }
      hoveredMeshRef.current = currentHovered;

      // Animate Celestial Runes
      runeMeshes.forEach((mesh) => {
        const u = mesh.userData as RuneGlyphData;
        const baseAng = u.baseAngle ?? u.angle;
        const curAngle = baseAng + elapsed * 0.09;
        mesh.position.x = Math.cos(curAngle) * u.radius;
        mesh.position.z = Math.sin(curAngle) * u.radius;

        const isHovered = hoveredMeshRef.current === mesh;
        const origY = u.originalY ?? u.height;
        const targetY = origY + Math.sin(elapsed * 1.5 + u.angle) * 0.18 + (isHovered ? 0.3 : 0);
        mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, 0.1);

        mesh.lookAt(camera.position);

        const rMat = mesh.material as THREE.MeshBasicMaterial;
        const targetOpacity = isHovered ? 1.0 : isHoveringAwaken ? 0.95 : 0.8;
        rMat.opacity = THREE.MathUtils.lerp(rMat.opacity, targetOpacity, 0.1);

        const targetScale = isHovered ? 1.25 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      });

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("click", handleClick);

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
  }, [handleRuneClick]);

  if (!hasWebGL) {
    return (
      <div className="hero-3d-fallback" aria-hidden="true">
        <div className="fallback-bonfire-glow" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={mountRef} />
  );
}
