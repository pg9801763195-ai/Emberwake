"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/reveal";
import { RelicViewer3D, RELIC_LIST } from "@/components/3d/relic-viewer-3d";

export function RelicsShowcaseSection() {
  const [selectedRelicId, setSelectedRelicId] = useState<string>("iron-will");
  const activeRelic = RELIC_LIST.find((r) => r.id === selectedRelicId) || RELIC_LIST[0];

  return (
    <section aria-labelledby="ab-relics" className="relative py-24 px-4 max-w-6xl mx-auto z-10">
      <div className="text-center mb-16">
        <Reveal as="p" className="eyebrow text-[#c9aa71] tracking-[0.3em] uppercase text-xs mb-3">
          The Hall of Artifacts
        </Reveal>
        <Reveal as="h2" id="ab-relics" className="font-serif text-3xl md:text-5xl text-[#f6ecd2] tracking-wider mb-4">
          Earn What You Deserve
        </Reveal>
        <div className="flex items-center justify-center gap-3 text-[#c9aa71]/70 mb-6">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c9aa71]" />
          <svg width="14" height="14" className="text-[#c9aa71]">
            <use href="#i-sigil" />
          </svg>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c9aa71]" />
        </div>
        <Reveal as="p" className="text-[#a39787] max-w-2xl mx-auto font-serif text-lg leading-relaxed">
          Discipline yields tangible spoils. Spend hard-won Runes at the Wandering Merchant, or unlock mythical 3D relics and armaments by maintaining unyielding consistency.
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Relic Viewport */}
        <div className="lg:col-span-7 bg-[#130f0d]/95 border border-[#3a3024] p-6 rounded-sm relative overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.8)] flex flex-col items-center">
          {/* Header */}
          <div className="w-full flex items-center justify-between border-b border-[#2c251d] pb-3 mb-4">
            <span className="text-xs uppercase tracking-widest text-[#c9aa71] font-serif">3D Artifact Inspection</span>
            <span
              className={`text-xs font-serif font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                activeRelic.rarity === "Legendary"
                  ? "bg-amber-950/40 text-amber-300 border-amber-500/40"
                  : activeRelic.rarity === "Epic"
                  ? "bg-purple-950/40 text-purple-300 border-purple-500/40"
                  : "bg-emerald-950/40 text-emerald-300 border-emerald-500/40"
              }`}
            >
              {activeRelic.rarity}
            </span>
          </div>

          {/* 3D WebGL Canvas */}
          <RelicViewer3D activeRelicId={selectedRelicId} />

          <p className="text-xs text-[#a39787]/70 font-serif italic mt-2">
            Click &amp; drag cursor to inspect 3D relic angles and reflection
          </p>
        </div>

        {/* Relic Selection & Details */}
        <div className="lg:col-span-5 space-y-5">
          {/* Relic Selector Badges */}
          <div className="grid grid-cols-5 gap-2">
            {RELIC_LIST.map((relic) => {
              const isSelected = selectedRelicId === relic.id;
              return (
                <button
                  key={relic.id}
                  type="button"
                  onClick={() => setSelectedRelicId(relic.id)}
                  title={relic.name}
                  className={`p-3 rounded border flex flex-col items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "bg-[#29231c] border-[#c9aa71] shadow-[0_0_15px_rgba(201,170,113,0.3)] scale-105"
                      : "bg-[#14100e] border-[#2c251d] hover:border-[#4a3d2c] opacity-70 hover:opacity-100"
                  }`}
                >
                  <svg
                    width="22"
                    height="22"
                    style={{ color: isSelected ? relic.glowColor : "#a39787" }}
                  >
                    <use
                      href={`#${
                        relic.modelType === "sword"
                          ? "i-sword"
                          : relic.modelType === "shield"
                          ? "i-shield"
                          : relic.modelType === "crown"
                          ? "i-sigil"
                          : relic.modelType === "medallion"
                          ? "i-seal"
                          : "i-ring"
                      }`}
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Selected Relic Deep Lore Card */}
          <div className="bg-gradient-to-b from-[#1e1915] to-[#120f0d] border border-[#3a3024] p-6 rounded-sm shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2c251d] pb-3 mb-4">
              <div>
                <h3 className="font-serif text-xl text-[#f6ecd2] font-semibold">{activeRelic.name}</h3>
                <span className="text-xs text-[#c9aa71] font-serif">{activeRelic.type}</span>
              </div>
            </div>

            <p className="text-sm text-[#d8cdb8] font-serif leading-relaxed italic mb-4">
              &quot;{activeRelic.lore}&quot;
            </p>

            <div className="bg-[#120e0c] p-3 rounded border border-[#2c251d] space-y-2 text-xs font-serif mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[#a39787]">Unlock Requirement:</span>
                <span className="text-[#e8d3a0] font-semibold">{activeRelic.streakRequirement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#a39787]">Inherent Blessing:</span>
                <span className="text-emerald-400 font-semibold">{activeRelic.bonus}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#a39787] font-serif">
              <span className="text-[#d9772b]">✦</span>
              <span>Permanent account unlock across all devices.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
