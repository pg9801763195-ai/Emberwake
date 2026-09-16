"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createFlameTongueTexture } from "./rune-glyph-texture";
import {
  createRealisticRockTexture,
  createRealisticWoodTexture,
  createHighResParticleTexture,
} from "./pbr-textures";

interface MiniBonfire3DProps {
  streak: number; // 0 to 100+
  flasksRemaining?: number; // 0 to 3
}

export function MiniBonfire3D({ streak, flasksRemaining = 3 }: MiniBonfire3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const streakFactor = Math.min(1.8, Math.max(0.35, 0.35 + (streak / 100) * 1.45));
  const isExtinguished = streak === 0 && flasksRemaining === 0;

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
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 280;
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 40);
    camera.position.set(0, 1.8, 4.2);
    camera.lookAt(0, 0.75, 0);

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

    // Unreal Bloom Pass
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.55 * streakFactor,
      0.45,
      0.4
    );
    composer.addPass(bloomPass);

    // Lighting
    const ambient = new THREE.AmbientLight(0x241d18, 1.0);
    scene.add(ambient);

    const firePointLight = new THREE.PointLight(
      isExtinguished ? 0x221100 : 0xff7a18,
      isExtinguished ? 0.2 : 2.4 * streakFactor,
      12
    );
    firePointLight.position.set(0, 1.0, 0);
    scene.add(firePointLight);

    // Load Campfire FBX Model
    const woodPBR = createRealisticWoodTexture();
    const campfireMat = new THREE.MeshStandardMaterial({
      map: woodPBR.map,
      bumpMap: woodPBR.bumpMap,
      bumpScale: 0.08,
      roughness: 0.85,
      metalness: 0.15,
      color: 0x3a2c22,
    });

    const fbxLoader = new FBXLoader();
    fbxLoader.load("/cgtrader_optimized_Campfire.fbx", (fbx) => {
      fbx.scale.set(2.4, 2.4, 2.4);
      fbx.position.set(0, 0, 0);
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = campfireMat;
        }
      });
      scene.add(fbx);
    });

    // Glowing Coals
    const coalGeo = new THREE.ConeGeometry(0.9, 0.2, 16);
    const coalMat = new THREE.MeshStandardMaterial({
      color: 0xff3a05,
      emissive: isExtinguished ? 0x110400 : 0xd94406,
      emissiveIntensity: isExtinguished ? 0.0 : 0.65 * streakFactor,
      roughness: 0.9,
    });
    const coalMesh = new THREE.Mesh(coalGeo, coalMat);
    coalMesh.position.y = 0.06;
    scene.add(coalMesh);

    // Flame Tongues
    const flameTex = createFlameTongueTexture();
    const flameMat = new THREE.MeshBasicMaterial({
      map: flameTex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const flameGroup = new THREE.Group();
    const flameRibbons: THREE.Mesh[] = [];

    if (!isExtinguished) {
      for (let f = 0; f < 6; f++) {
        const fGeo = new THREE.PlaneGeometry(0.55 * streakFactor, 1.5 * streakFactor, 6, 8);
        const ribbon = new THREE.Mesh(fGeo, flameMat);
        const ang = (f / 6) * Math.PI * 2;
        const rad = 0.15 * streakFactor;
        ribbon.position.set(Math.cos(ang) * rad, 0.7 * streakFactor, Math.sin(ang) * rad);
        ribbon.rotation.y = ang + Math.PI / 4;
        flameGroup.add(ribbon);
        flameRibbons.push(ribbon);
      }
      scene.add(flameGroup);
    }

    // High-Res Ember Particles
    const pTex = createHighResParticleTexture();
    const pCount = isExtinguished ? 0 : Math.round(90 * streakFactor);
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pVels = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 0.6 * streakFactor;
      pPos[i * 3 + 1] = 0.2 + Math.random() * 2.5 * streakFactor;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.6 * streakFactor;

      pVels[i * 3] = (Math.random() - 0.5) * 0.025;
      pVels[i * 3 + 1] = 0.025 + Math.random() * 0.05 * streakFactor;
      pVels[i * 3 + 2] = (Math.random() - 0.5) * 0.025;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.18,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0xffaa33,
      depthWrite: false,
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    if (!isExtinguished) scene.add(pMesh);

    // Animate
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      // Flame ribbon animation
      flameRibbons.forEach((ribbon, i) => {
        ribbon.scale.y = 1.0 + Math.sin(elapsed * 3 + i * 1.5) * 0.25;
        ribbon.scale.x = 0.9 + Math.cos(elapsed * 2.5 + i) * 0.15;
      });

      // Flicker
      const flicker = Math.sin(elapsed * 14) * 0.2 * streakFactor;
      if (!isExtinguished) {
        firePointLight.intensity = (2.4 + flicker) * streakFactor;
      }

      // Particles
      if (!isExtinguished) {
        const arr = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < pCount; i++) {
          arr[i * 3] += pVels[i * 3] + Math.sin(elapsed * 3 + arr[i * 3 + 1]) * 0.005;
          arr[i * 3 + 1] += pVels[i * 3 + 1];
          arr[i * 3 + 2] += pVels[i * 3 + 2];

          if (arr[i * 3 + 1] > 2.8 * streakFactor) {
            arr[i * 3] = (Math.random() - 0.5) * 0.45 * streakFactor;
            arr[i * 3 + 1] = 0.2;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 0.45 * streakFactor;
          }
        }
        pGeo.attributes.position.needsUpdate = true;
      }

      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
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
  }, [streak, streakFactor, isExtinguished, flasksRemaining]);

  return (
    <div ref={mountRef} className="relative w-full h-[260px] md:h-[300px] flex items-center justify-center select-none" />
  );
}
