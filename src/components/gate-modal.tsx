"use client";

import React, { useEffect, useState } from "react";
import { GateForm } from "@/components/gate-form";

interface GateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GateModal({ isOpen, onClose }: GateModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gate of the Awoken"
    >
      {/* Ambient background particles and glowing flare */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-600/15 via-orange-950/10 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none" />
      </div>

      {/* Main Forged Modal Container */}
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#18130f]/98 via-[#120e0b]/98 to-[#0b0806]/98 border border-[#c9aa71]/60 p-6 sm:p-8 rounded-sm shadow-[0_0_60px_rgba(217,119,43,0.35),0_0_120px_rgba(0,0,0,0.95)] my-auto transition-all duration-300 transform scale-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ornate Corner Filigrees (Authentic Dark Fantasy Relic Style) */}
        <div className="absolute top-1.5 left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#c9aa71] pointer-events-none opacity-80" />
        <div className="absolute top-1.5 right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#c9aa71] pointer-events-none opacity-80" />
        <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#c9aa71] pointer-events-none opacity-80" />
        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#c9aa71] pointer-events-none opacity-80" />

        {/* Top Radiant Flame Accent */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-[#e8d3a0] to-transparent shadow-[0_0_12px_#e8d3a0]" />

        {/* Interactive Close Button with Rotating Rune Ring on Hover */}
        <button
          type="button"
          onClick={onClose}
          className="group absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-[#a39787] hover:text-[#f6ecd2] border border-[#3e3325] hover:border-[#c9aa71] bg-[#1a1410]/80 hover:bg-[#281e16] transition-all duration-300 cursor-pointer shadow-md z-20"
          aria-label="Close the Gate"
        >
          <span className="font-serif text-sm transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
            ✕
          </span>
        </button>

        {/* Embedded Interactive Gate Form */}
        <GateForm />
      </div>
    </div>
  );
}
