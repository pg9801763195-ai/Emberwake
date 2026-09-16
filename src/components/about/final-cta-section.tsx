"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/reveal";

interface FinalCtaSectionProps {
  onAwakenClick?: () => void;
}

export function FinalCtaSection({ onAwakenClick }: FinalCtaSectionProps) {
  const [hot, setHot] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (onAwakenClick) {
      e.preventDefault();
      onAwakenClick();
    }
  };

  return (
    <section aria-labelledby="ab-final-cta" className="relative py-32 px-4 text-center z-10 overflow-hidden">
      {/* Dynamic Background Fire FX */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        <div
          className="w-[500px] h-[500px] rounded-full blur-3xl opacity-20 transition-all duration-700"
          style={{
            background: "radial-gradient(circle, #d9772b 0%, #9e2a2b 40%, transparent 70%)",
            transform: hot ? "scale(1.3)" : "scale(1)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 text-[#c9aa71]/70 mb-4">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c9aa71]" />
          <svg width="14" height="14" className="text-[#c9aa71]">
            <use href="#i-sigil" />
          </svg>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c9aa71]" />
        </div>

        <Reveal as="h2" id="ab-final-cta" className="font-serif text-3xl md:text-6xl text-[#f6ecd2] tracking-wider mb-6 font-semibold">
          YOUR JOURNEY BEGINS WITH ONE DAY.
        </Reveal>

        <Reveal as="p" delay={90} className="text-[#a39787] font-serif text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          The bonfire is cold until you kindle it. Swear your first oath, claim your runes, and step into the Emberwake.
        </Reveal>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <a
            href="#signup"
            onClick={handleClick}
            onMouseEnter={() => setHot(true)}
            onMouseLeave={() => setHot(false)}
            onFocus={() => setHot(true)}
            onBlur={() => setHot(false)}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-[#9e2a2b] via-[#d9772b] to-[#9e2a2b] bg-size-200 hover:bg-pos-100 text-[#f6ecd2] font-serif font-bold text-base tracking-[0.25em] uppercase rounded-sm border border-[#e8d3a0]/50 shadow-[0_0_30px_rgba(217,119,43,0.4)] hover:shadow-[0_0_50px_rgba(217,119,43,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            AWAKEN
          </a>

          <a
            href="#signup"
            onClick={handleClick}
            className="w-full sm:w-auto px-8 py-4 bg-[#1e1915]/80 hover:bg-[#29221b] text-[#c9aa71] hover:text-[#f6ecd2] font-serif text-sm tracking-widest uppercase rounded-sm border border-[#4a3d2c] hover:border-[#c9aa71] transition-all duration-300"
          >
            Begin the Journey
          </a>
        </div>
      </div>
    </section>
  );
}
