"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/reveal";

interface SkillNode {
  id: string;
  attr: "Strength" | "Mind" | "Vigor" | "Endurance" | "Dexterity";
  name: string;
  icon: string;
  level: number;
  domain: string;
  description: string;
  realWorldHabit: string;
  color: string;
  perks: string[];
}

const SKILL_NODES: SkillNode[] = [
  {
    id: "strength",
    attr: "Strength",
    name: "Iron Constitution",
    icon: "i-strength",
    level: 14,
    domain: "Physical Power & Force of Will",
    description: "Forged in the weight of heavy burdens. The physical shell hardens against fatigue and apathy.",
    realWorldHabit: "Gym workouts, resistance training, physical labor.",
    color: "#f87171",
    perks: ["+15% Physical Stamina", "Max Health +10", "Unlocks Colossal Weapons"],
  },
  {
    id: "mind",
    attr: "Mind",
    name: "Scholar's Clairvoyance",
    icon: "i-mind",
    level: 18,
    domain: "Knowledge, Code & Strategy",
    description: "Sharpened through dedicated study and deep focus. Allows the bearer to perceive clarity amidst chaos.",
    realWorldHabit: "Reading, software development, deliberate practice.",
    color: "#60a5fa",
    perks: ["+25 Max Focus (FP)", "Blessing: 2x Rune Multiplier", "Unlocks Sacred Tomes"],
  },
  {
    id: "vigor",
    attr: "Vigor",
    name: "The Eternal Spark",
    icon: "i-vigor",
    level: 20,
    domain: "Sleep, Nutrition & Vitality",
    description: "The fundamental flame that sustains all living vessels. Neglect it, and all other powers crumble.",
    realWorldHabit: "Consistent 8h sleep, hydration, clean nutrition.",
    color: "#e88040",
    perks: ["+30 Base Health", "Resist Fallen Penalties", "Faster Flask Recharge"],
  },
  {
    id: "endurance",
    attr: "Endurance",
    name: "The Unyielding March",
    icon: "i-endurance",
    level: 16,
    domain: "Cardio, Pacing & Resilience",
    description: "The grit to keep moving when inspiration has long withered. Turns fleeting motivation into granite habit.",
    realWorldHabit: "Running, distance cycling, daily step goals.",
    color: "#4ade80",
    perks: ["Bonfire Multiplier Cap +20%", "Unlocks Heavy Armor", "+20% Daily Stamina"],
  },
  {
    id: "dexterity",
    attr: "Dexterity",
    name: "Artisan's Precision",
    icon: "i-dexterity",
    level: 12,
    domain: "Craft, Art & Motor Control",
    description: "Grace and finesse born from thousands of deliberate repetitions. Turns tedious craft into effortless art.",
    realWorldHabit: "Writing, music practice, fine drawing, typing.",
    color: "#c084fc",
    perks: ["+10% Critical Rune Burst", "Speed Cast Relics", "Unlocks Master Signets"],
  },
];

export function SkillTreeSection() {
  const [activeNodeId, setActiveNodeId] = useState<string>("mind");
  const activeNode = SKILL_NODES.find((n) => n.id === activeNodeId) || SKILL_NODES[0];

  return (
    <section aria-labelledby="ab-attributes" className="relative py-24 px-4 max-w-6xl mx-auto z-10">
      <div className="text-center mb-16">
        <Reveal as="p" className="eyebrow text-[#c9aa71] tracking-[0.3em] uppercase text-xs mb-3">
          Character Progression
        </Reveal>
        <Reveal as="h2" id="ab-attributes" className="font-serif text-3xl md:text-5xl text-[#f6ecd2] tracking-wider mb-4">
          Forge Your Attributes
        </Reveal>
        <div className="flex items-center justify-center gap-3 text-[#c9aa71]/70 mb-6">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c9aa71]" />
          <svg width="14" height="14" className="text-[#c9aa71]">
            <use href="#i-sigil" />
          </svg>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c9aa71]" />
        </div>
        <Reveal as="p" className="text-[#a39787] max-w-2xl mx-auto font-serif text-lg leading-relaxed">
          Your real-world disciplines feed directly into five non-linear RPG attributes. Every completed quest grants experience to shape your warrior into a formidable champion.
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Interactive Constellation Skill Tree Visual */}
        <div className="lg:col-span-7 bg-[#14110e]/95 border border-[#2c251d] p-6 md:p-8 rounded-sm relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
          {/* Constellation background grid & stars */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#c9aa71_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* SVG Connection Web */}
          <div className="relative w-full aspect-[4/3] max-h-[380px] flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
              {/* Central Core Circle */}
              <circle cx="200" cy="150" r="28" fill="none" stroke="#4a3d2c" strokeWidth="1.5" />
              <circle
                cx="200"
                cy="150"
                r="38"
                fill="none"
                stroke="#c9aa71"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-spin-slow"
              />

              {/* Connecting lines to 5 attribute nodes */}
              {SKILL_NODES.map((node, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const nx = 200 + Math.cos(angle) * 105;
                const ny = 150 + Math.sin(angle) * 95;
                const isSelected = activeNodeId === node.id;

                return (
                  <g key={node.id}>
                    <line
                      x1="200"
                      y1="150"
                      x2={nx}
                      y2={ny}
                      stroke={isSelected ? node.color : "#3a3024"}
                      strokeWidth={isSelected ? "2.5" : "1.2"}
                      strokeDasharray={isSelected ? "none" : "3 3"}
                      className="transition-all duration-300"
                    />
                    {/* Secondary web links between adjacent nodes */}
                    {i < SKILL_NODES.length && (
                      <line
                        x1={nx}
                        y1={ny}
                        x2={200 + Math.cos(((i + 1) / 5) * Math.PI * 2 - Math.PI / 2) * 105}
                        y2={150 + Math.sin(((i + 1) / 5) * Math.PI * 2 - Math.PI / 2) * 95}
                        stroke="#251f18"
                        strokeWidth="1"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Central Sigil Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#1e1914] border border-[#c9aa71] flex items-center justify-center text-[#e8d3a0] shadow-[0_0_20px_rgba(201,170,113,0.3)] z-10">
              <svg width="22" height="22">
                <use href="#i-sigil" />
              </svg>
            </div>

            {/* 5 Interactive Attribute Node Buttons */}
            {SKILL_NODES.map((node, i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
              const xPercent = 50 + (Math.cos(angle) * 105) / 4;
              const yPercent = 50 + (Math.sin(angle) * 95) / 3;
              const isSelected = activeNodeId === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  onMouseEnter={() => setActiveNodeId(node.id)}
                  style={{
                    left: `${xPercent}%`,
                    top: `${yPercent}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center focus:outline-none z-20`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border ${
                      isSelected
                        ? "bg-[#29231c] scale-110 shadow-[0_0_25px_var(--glow)]"
                        : "bg-[#181410] border-[#3a3024] hover:border-[#6b5836] scale-100"
                    }`}
                    style={{
                      borderColor: isSelected ? node.color : undefined,
                      ["--glow" as string]: `${node.color}66`,
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      style={{ color: isSelected ? node.color : "#a39787" }}
                      className="transition-colors duration-300"
                    >
                      <use href={`#${node.icon}`} />
                    </svg>
                  </div>
                  <span
                    className={`mt-1.5 font-serif text-xs uppercase tracking-widest transition-colors duration-300 ${
                      isSelected ? "text-[#f6ecd2] font-semibold" : "text-[#a39787]/70"
                    }`}
                  >
                    {node.attr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Attribute Detail Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#1e1915] to-[#13100e] border border-[#3a3024] p-7 rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: activeNode.color }}
          />

          <div className="flex items-center justify-between border-b border-[#2c251d] pb-4 mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded bg-[#29231c] border flex items-center justify-center"
                style={{ borderColor: activeNode.color, color: activeNode.color }}
              >
                <svg width="20" height="20">
                  <use href={`#${activeNode.icon}`} />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#f6ecd2] font-semibold">{activeNode.attr}</h3>
                <p className="text-xs text-[#a39787] font-serif">{activeNode.domain}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl font-bold" style={{ color: activeNode.color }}>
                LV {activeNode.level}
              </span>
            </div>
          </div>

          <p className="text-[#d8cdb8] font-serif text-sm leading-relaxed mb-4">{activeNode.description}</p>

          <div className="bg-[#120f0d] p-3 rounded border border-[#2c251d] mb-4 text-xs font-serif">
            <span className="text-[#c9aa71] font-semibold block mb-1">Forged by Habits:</span>
            <span className="text-[#a39787] italic">{activeNode.realWorldHabit}</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#c9aa71] font-serif font-semibold block">
              Active Attribute Perks:
            </span>
            {activeNode.perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#e6dcc8] font-serif">
                <span className="text-amber-500">✦</span>
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
