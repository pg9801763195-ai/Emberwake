"use client";

import React, { useState } from "react";
import { HeroBonfireScene } from "@/components/3d/hero-bonfire-scene";
import { GateModal } from "@/components/gate-modal";

interface HeroSectionProps {
  onAwakenClick?: () => void;
}

export function HeroSection({ onAwakenClick }: HeroSectionProps) {
  const [hoverAwaken, setHoverAwaken] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [internalShowModal, setInternalShowModal] = useState(false);

  const handleAwakenClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isAwakening) return;
    setIsAwakening(true);
  };

  const handleAwakenComplete = () => {
    setIsAwakening(false);
    if (onAwakenClick) {
      onAwakenClick();
    } else {
      setInternalShowModal(true);
    }
  };

  return (
    <section
      className="relative w-full h-screen min-h-[640px] flex flex-col justify-between overflow-hidden bg-[#0c0907]"
      aria-label="Emberwake"
    >
      {/* 1. Full-Screen 3D Interactive WebGL Scene (Unobstructed View) */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <HeroBonfireScene
          isAwakening={isAwakening}
          onAwakenComplete={handleAwakenComplete}
          hoverAwaken={hoverAwaken}
        />
      </div>

      {/* 2. Soft Atmospheric Vignette (Clear center to showcase 3D bonfire & background) */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_55%,#0c0907_98%)] opacity-35" />

      {/* 3. Top Section: Clean Title positioned high to never block the central 3D Bonfire */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-20 text-center flex flex-col items-center select-none pointer-events-none">
        {/* Subtle Subtitle */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181410]/70 border border-[#c9aa71]/40 text-[#c9aa71] text-[11px] uppercase tracking-[0.3em] font-serif shadow-md mb-3 backdrop-blur-sm">
          <span>A HABIT TRACKER FOR THE UNYIELDING</span>
        </div>

        {/* Elevated Title (Leaves entire middle open for 3D Bonfire & Sword) */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-[#fff5df] via-[#e8d3a0] to-[#b39154] font-bold tracking-[0.22em] leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
          EMBERWAKE
        </h1>

        {/* Single Punchy Tagline */}
        <p className="text-[#d8cdb8] font-serif text-base sm:text-lg tracking-wide max-w-lg mt-2 drop-shadow-md">
          Every habit is a battle. Every day, a bonfire.
        </p>
      </div>

      {/* 4. Center Area is 100% Clear for 3D Living Bonfire, Coiled Blade & Orbiting Runes */}
      <div className="flex-1 pointer-events-none" />

      {/* 5. Bottom Action Dock */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6 pb-12 flex flex-col sm:flex-row items-center justify-center gap-4 select-none">
        <button
          type="button"
          id="hero-awaken-btn"
          onClick={handleAwakenClick}
          onMouseEnter={() => setHoverAwaken(true)}
          onMouseLeave={() => setHoverAwaken(false)}
          onFocus={() => setHoverAwaken(true)}
          onBlur={() => setHoverAwaken(false)}
          disabled={isAwakening}
          className="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-[#8b2324] via-[#d9772b] to-[#8b2324] bg-size-200 hover:bg-pos-100 text-[#f6ecd2] font-serif font-bold text-sm tracking-[0.3em] uppercase rounded-sm border border-[#e8d3a0]/70 shadow-[0_0_25px_rgba(217,119,43,0.5)] hover:shadow-[0_0_45px_rgba(217,119,43,0.85)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{isAwakening ? "AWAKENING..." : "AWAKEN"}</span>
          <span className="text-amber-200 text-xs">⚔</span>
        </button>

        <a
          href="#explore"
          className="w-full sm:w-auto px-7 py-3.5 bg-[#181410]/80 hover:bg-[#241d17] text-[#c9aa71] hover:text-[#f6ecd2] font-serif text-xs tracking-[0.2em] uppercase rounded-sm border border-[#4a3d2c] hover:border-[#c9aa71] transition-all duration-300 text-center flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <span>EXPLORE REALM</span>
          <span className="text-xs">↓</span>
        </a>
      </div>

      {/* 6. Awaken Flash Overlay during transition */}
      {isAwakening && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-t from-amber-600/30 via-orange-500/40 to-yellow-100/20 backdrop-blur-[2px] animate-pulse transition-opacity duration-700" />
      )}

      {/* Gate Modal for Login / Signup fallback */}
      {!onAwakenClick && (
        <GateModal isOpen={internalShowModal} onClose={() => setInternalShowModal(false)} />
      )}
    </section>
  );
}
