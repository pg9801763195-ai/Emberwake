"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/reveal";
import { MiniBonfire3D } from "@/components/3d/mini-bonfire-3d";

interface StreakTier {
  days: number;
  title: string;
  lore: string;
  multiplier: string;
  flameIntensity: string;
}

const STREAK_TIERS: StreakTier[] = [
  {
    days: 1,
    title: "Nameless Wanderer",
    lore: "A lonely ember sparked against the damp chill. Fragile, yet burning.",
    multiplier: "1.00x Base Runes",
    flameIntensity: "Faint Spark",
  },
  {
    days: 7,
    title: "Oathkeeper",
    lore: "Seven unbroken dawns. The heat begins to warm the surrounding stones.",
    multiplier: "1.14x Bonus Runes",
    flameIntensity: "Steady Bonfire",
  },
  {
    days: 14,
    title: "Warden of the Flame",
    lore: "Two weeks of unrelenting discipline. The fire wards off creeping shadows.",
    multiplier: "1.28x Bonus Runes",
    flameIntensity: "Blazing Pyre",
  },
  {
    days: 30,
    title: "Knight of the Long Vigil",
    lore: "A month of continuous triumph. The blaze can be seen across the ruins.",
    multiplier: "1.60x Max Multiplier",
    flameIntensity: "Roaring Beacon",
  },
  {
    days: 100,
    title: "Sovereign of the Unbroken Dawn",
    lore: "Legendary mastery. The flame has become part of the land itself.",
    multiplier: "1.60x + Ascended Relics",
    flameIntensity: "Ethereal Inferno",
  },
];

export function StreakFlameSection() {
  const [streakDays, setStreakDays] = useState(14);
  const [flasks, setFlasks] = useState(3);

  // Find active tier
  const activeTier =
    [...STREAK_TIERS].reverse().find((t) => streakDays >= t.days) || STREAK_TIERS[0];

  const handleDrainFlask = () => {
    setFlasks((f) => Math.max(0, f - 1));
  };

  const handleRefillFlasks = () => {
    setFlasks(3);
  };

  return (
    <section aria-labelledby="ab-streak" className="relative py-24 px-4 max-w-6xl mx-auto z-10">
      <div className="text-center mb-16">
        <Reveal as="p" className="eyebrow text-[#c9aa71] tracking-[0.3em] uppercase text-xs mb-3">
          The Living Bonfire Engine
        </Reveal>
        <Reveal as="h2" id="ab-streak" className="font-serif text-3xl md:text-5xl text-[#f6ecd2] tracking-wider mb-4">
          Protect the Flame
        </Reveal>
        <div className="flex items-center justify-center gap-3 text-[#c9aa71]/70 mb-6">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c9aa71]" />
          <svg width="14" height="14" className="text-[#c9aa71]">
            <use href="#i-sigil" />
          </svg>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c9aa71]" />
        </div>
        <Reveal as="p" className="text-[#a39787] max-w-2xl mx-auto font-serif text-lg leading-relaxed">
          Gamification fails when nothing is at stake. In Emberwake, your streak is a living 3D bonfire that feeds on consistency. Miss a day, and an Ember Flask drains to safeguard your flame.
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: 3D Mini-Bonfire Simulation */}
        <div className="lg:col-span-6 bg-[#130f0d]/95 border border-[#3a3024] p-6 rounded-sm relative overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.75)] flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-[#2c251d] pb-3 mb-2">
            <span className="text-xs uppercase tracking-widest text-[#c9aa71] font-serif">Living Bonfire State</span>
            <span className="text-xs text-[#d9772b] font-mono font-bold">{activeTier.flameIntensity}</span>
          </div>

          {/* 3D Bonfire Canvas */}
          <div className="w-full">
            <MiniBonfire3D streak={streakDays} flasksRemaining={flasks} />
          </div>

          {/* Bonfire Status Banner */}
          <div className="w-full bg-[#1c1713] p-3 rounded border border-[#2c251d] mt-2 text-center">
            <span className="text-xs text-[#a39787] uppercase tracking-wider block font-serif">Earned Title:</span>
            <span className="text-base text-[#f6ecd2] font-serif font-bold tracking-wide">{activeTier.title}</span>
          </div>
        </div>

        {/* Right Side: Interactive Controls & Flask Mechanics */}
        <div className="lg:col-span-6 space-y-6">
          {/* Interactive Streak Slider */}
          <div className="bg-[#181410] border border-[#2c251d] p-6 rounded-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif text-[#f6ecd2] font-semibold tracking-wide">Adjust Streak Simulation:</span>
              <span className="font-mono text-xl text-[#d9772b] font-bold">{streakDays} Consecutive Days</span>
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={streakDays}
              onChange={(e) => setStreakDays(Number(e.target.value))}
              className="w-full h-2 bg-[#251f18] rounded-lg appearance-none cursor-pointer accent-[#d9772b]"
            />

            <div className="flex justify-between text-[11px] text-[#6b5836] font-mono mt-2">
              <span>Day 1 (Spark)</span>
              <span>Day 7</span>
              <span>Day 14</span>
              <span>Day 30</span>
              <span>Day 100 (Inferno)</span>
            </div>
          </div>

          {/* Ember Flask Defense Chamber */}
          <div className="bg-[#181410] border border-[#2c251d] p-6 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-serif text-[#f6ecd2] font-semibold text-sm">Ember Flasks (Streak Protection)</h4>
                <p className="text-xs text-[#a39787] font-serif">Carried: max 3 flasks</p>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((f) => (
                  <div
                    key={f}
                    className={`w-9 h-9 rounded border flex items-center justify-center transition-all duration-300 ${
                      f <= flasks
                        ? "bg-[#29231c] border-[#d9772b] text-[#ff9a3c] shadow-[0_0_12px_rgba(217,119,43,0.35)]"
                        : "bg-[#14110e] border-[#3a3024] text-[#4a3d2c]"
                    }`}
                  >
                    <svg width="18" height="18">
                      <use href="#i-flask" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#d8cdb8] font-serif leading-relaxed mb-4">
              {flasks > 0 ? (
                <>
                  If you miss a scheduled Vigil, <strong className="text-[#d9772b]">1 Ember Flask</strong> automatically drains to shield your streak from resetting.
                </>
              ) : (
                <span className="text-red-400 font-semibold">
                  ⚠️ All flasks drained! A missed day now extinguishes the bonfire and deals lethal damage to Health.
                </span>
              )}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDrainFlask}
                disabled={flasks === 0}
                className="flex-1 py-2 bg-[#201a15] hover:bg-[#2c221a] border border-[#4a3d2c] text-[#a39787] hover:text-[#f6ecd2] font-serif text-xs rounded transition-colors disabled:opacity-40"
              >
                Simulate Missed Day (-1 Flask)
              </button>
              <button
                type="button"
                onClick={handleRefillFlasks}
                className="py-2 px-4 bg-[#29231c] hover:bg-[#382f25] border border-[#c9aa71]/50 text-[#e8d3a0] font-serif text-xs rounded transition-colors"
              >
                Refill
              </button>
            </div>
          </div>

          {/* Reward Multiplier Callout */}
          <div className="p-4 bg-gradient-to-r from-[#1c1813] to-[#14100e] border-l-2 border-[#d9772b] rounded-r text-xs font-serif flex items-center justify-between">
            <span className="text-[#a39787]">Active Bonfire Bonus:</span>
            <span className="text-[#e8d3a0] font-mono font-bold text-sm">{activeTier.multiplier}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
