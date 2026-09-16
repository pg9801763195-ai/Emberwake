"use client";

import React, { useState, useRef } from "react";
import { Reveal } from "@/components/reveal";
import styles from "./about.module.css";

interface HabitQuest {
  id: string;
  habit: string;
  questTitle: string;
  lore: string;
  attr: "Strength" | "Mind" | "Vigor" | "Endurance" | "Dexterity";
  attrIcon: string;
  diff: "Standard" | "Hard" | "Legendary";
  pips: number;
  runes: number;
  xp: number;
}

const SAMPLE_QUESTS: HabitQuest[] = [
  {
    id: "gym",
    habit: "Gym: Heavy squats & presses",
    questTitle: "The Iron Vigil",
    lore: "Carry the cold iron until your limbs remember what they were forged for.",
    attr: "Strength",
    attrIcon: "i-strength",
    diff: "Hard",
    pips: 3,
    runes: 40,
    xp: 4,
  },
  {
    id: "read",
    habit: "Read 30 minutes of history/code",
    questTitle: "The Scholar's Hour",
    lore: "Inscribe forgotten wisdom upon the mind before dusk claims the day.",
    attr: "Mind",
    attrIcon: "i-mind",
    diff: "Standard",
    pips: 2,
    runes: 25,
    xp: 3,
  },
  {
    id: "sleep",
    habit: "Sleep by 11:00 PM & 8hr rest",
    questTitle: "Rest at the Bonfire",
    lore: "Sheathe your weapons. The longest vigil cannot be fought without respite.",
    attr: "Vigor",
    attrIcon: "i-vigor",
    diff: "Standard",
    pips: 2,
    runes: 25,
    xp: 3,
  },
  {
    id: "run",
    habit: "5km dawn run in the rain",
    questTitle: "The Long March",
    lore: "Pave the highway with your strides until the dark fog yields to the sun.",
    attr: "Endurance",
    attrIcon: "i-endurance",
    diff: "Legendary",
    pips: 4,
    runes: 60,
    xp: 6,
  },
];

export function QuestForgeSection() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [activeStrike, setActiveStrike] = useState(false);
  const [runeCounter, setRuneCounter] = useState(1240);
  const [attrBonus, setAttrBonus] = useState<Record<string, number>>({
    Strength: 18,
    Mind: 22,
    Vigor: 15,
    Endurance: 12,
    Dexterity: 10,
  });

  const quest = SAMPLE_QUESTS[selectedIdx];
  const isCompleted = !!completedMap[quest.id];

  const handleComplete = (q: HabitQuest) => {
    if (completedMap[q.id]) return;
    setActiveStrike(true);

    setTimeout(() => {
      setCompletedMap((prev) => ({ ...prev, [q.id]: true }));
      setRuneCounter((r) => r + q.runes);
      setAttrBonus((prev) => ({
        ...prev,
        [q.attr]: prev[q.attr] + q.xp,
      }));
      setActiveStrike(false);
    }, 450);
  };

  const handleReset = (q: HabitQuest) => {
    setCompletedMap((prev) => ({ ...prev, [q.id]: false }));
  };

  return (
    <section aria-labelledby="ab-quests" className="relative py-24 px-4 max-w-6xl mx-auto z-10">
      <div className="text-center mb-16">
        <Reveal as="p" className="eyebrow text-[#c9aa71] tracking-[0.3em] uppercase text-xs mb-3">
          The Transmutation of Effort
        </Reveal>
        <Reveal as="h2" id="ab-quests" className="font-serif text-3xl md:text-5xl text-[#f6ecd2] tracking-wider mb-4">
          Turn Habits Into Quests
        </Reveal>
        <div className="flex items-center justify-center gap-3 text-[#c9aa71]/70 mb-6">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#c9aa71]" />
          <svg width="14" height="14" className="text-[#c9aa71]">
            <use href="#i-sigil" />
          </svg>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#c9aa71]" />
        </div>
        <Reveal as="p" className="text-[#a39787] max-w-2xl mx-auto font-serif text-lg leading-relaxed">
          Standard to-do apps reduce your life to dull checkboxes that mean nothing. In Emberwake, every disciplined choice is a battle won, rewarded with Runes, attribute growth, and living flame.
        </Reveal>
      </div>

      {/* Habit Switcher Tabs */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
        {SAMPLE_QUESTS.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setSelectedIdx(idx)}
            className={`px-4 py-2.5 rounded-sm font-serif text-sm tracking-wider transition-all duration-300 border ${
              selectedIdx === idx
                ? "bg-[#29231c] border-[#c9aa71] text-[#f6ecd2] shadow-[0_0_15px_rgba(201,170,113,0.25)]"
                : "bg-[#161310]/80 border-[#2c251d] text-[#a39787] hover:border-[#4a3d2c] hover:text-[#e6dcc8]"
            }`}
          >
            <span className="opacity-60 mr-2">0{idx + 1}.</span>
            {q.habit.split(":")[0]}
          </button>
        ))}
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* The Old Way */}
        <div className="lg:col-span-5 bg-[#120f0d]/90 border border-[#2c251d] p-7 rounded-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between border-b border-[#2c251d] pb-3 mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#6b5836] font-mono">Generic To-Do List</span>
              <span className="text-xs text-[#a39787]/50 font-serif italic">Zero Consequence</span>
            </div>

            <div className="space-y-4 font-sans text-sm text-[#8a7f72]">
              <div className="flex items-center gap-3 p-3 bg-[#181512]/60 border border-[#221c16] rounded">
                <input type="checkbox" disabled checked className="opacity-40 accent-[#6b5836]" />
                <span className="line-through opacity-50">{quest.habit}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#181512]/40 border border-[#221c16] rounded opacity-60">
                <input type="checkbox" disabled className="opacity-30" />
                <span>Drink 2L water (forgotten)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#181512]/20 border border-[#221c16] rounded opacity-30">
                <input type="checkbox" disabled className="opacity-20" />
                <span>Meditate 10 mins (abandoned)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#221c16]">
            <p className="text-xs text-[#a39787] font-serif italic">
              &quot;A silent checkbox. No feeling of accomplishment. Abandoned within two weeks.&quot;
            </p>
          </div>
        </div>

        {/* VS Divider badge */}
        <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center">
          <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-[#4a3d2c] to-transparent" />
          <div className="my-3 px-3 py-1.5 rounded-full border border-[#c9aa71]/50 bg-[#1e1a16] text-[#c9aa71] font-serif text-xs tracking-widest shadow-[0_0_12px_rgba(201,170,113,0.3)]">
            VS
          </div>
          <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-[#4a3d2c] to-transparent" />
        </div>

        {/* The Emberwake Way */}
        <div
          className={`lg:col-span-5 relative bg-gradient-to-b from-[#211b15] to-[#16120e] border ${
            isCompleted ? "border-[#c9aa71]" : "border-[#4a3d2c]"
          } p-7 rounded-sm shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between transition-all duration-500 overflow-hidden`}
        >
          {/* Top Filigree */}
          <svg className="absolute top-2 right-2 text-[#6b5836]/40 pointer-events-none" width="40" height="40">
            <use href="#i-fil" />
          </svg>

          {/* Active Slash FX */}
          {activeStrike && (
            <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-amber-500/10 backdrop-blur-[1px] animate-pulse">
              <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-[#f6ecd2] to-transparent rotate-[-25deg] shadow-[0_0_20px_#fff]" />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between border-b border-[#3a3024] pb-3 mb-5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#c9aa71] font-serif font-bold">
                The Emberwake Way
              </span>
              <div className="flex items-center gap-1.5 text-[#e8d3a0] font-mono text-sm bg-[#120f0d] px-2.5 py-1 rounded border border-[#4a3d2c]">
                <svg width="12" height="12" className="text-[#d9772b]">
                  <use href="#i-sigil" />
                </svg>
                <span>{runeCounter.toLocaleString()} Runes</span>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-sm bg-[#29231c] border border-[#c9aa71]/60 flex items-center justify-center text-[#e8d3a0] shadow-[0_0_15px_rgba(201,170,113,0.2)] shrink-0">
                <svg width="24" height="24">
                  <use href={`#${quest.attrIcon}`} />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#f6ecd2] font-semibold tracking-wide">{quest.questTitle}</h3>
                <p className="text-[#a39787] text-xs font-serif mt-0.5">{quest.lore}</p>
              </div>
            </div>

            {/* Quest Attributes & Difficulty */}
            <div className="grid grid-cols-2 gap-2 my-4 bg-[#14110e]/90 p-3 rounded border border-[#2c251d] text-xs font-serif">
              <div>
                <span className="text-[#a39787]">Difficulty: </span>
                <span className="text-[#e8d3a0] font-semibold">{quest.diff}</span>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map((p) => (
                    <span
                      key={p}
                      className={`w-2 h-2 rotate-45 border ${
                        p <= quest.pips ? "bg-[#d9772b] border-[#ff9a3c]" : "bg-[#251f18] border-[#3a3024]"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[#a39787]">Attribute: </span>
                <span className="text-[#f6ecd2] font-semibold">{quest.attr}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-[#1e1914] rounded-full overflow-hidden border border-[#3a3024]">
                    <div
                      className="h-full bg-gradient-to-r from-[#d9772b] to-[#e8d3a0] transition-all duration-500"
                      style={{ width: `${Math.min(100, attrBonus[quest.attr] * 3.5)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#c9aa71] font-mono">+{attrBonus[quest.attr]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-6 pt-4 border-t border-[#3a3024]">
            {!isCompleted ? (
              <button
                type="button"
                onClick={() => handleComplete(quest)}
                disabled={activeStrike}
                className="w-full py-3 bg-gradient-to-r from-[#9e2a2b] via-[#d9772b] to-[#9e2a2b] bg-size-200 hover:bg-pos-100 text-[#f6ecd2] font-serif font-bold text-sm tracking-widest uppercase rounded-sm border border-[#e8d3a0]/40 shadow-[0_0_20px_rgba(217,119,43,0.4)] hover:shadow-[0_0_30px_rgba(217,119,43,0.7)] transition-all duration-300 transform active:scale-95"
              >
                {activeStrike ? "Striking..." : "Conquer Quest"}
              </button>
            ) : (
              <div className="flex items-center justify-between bg-[#191512] p-2.5 rounded border border-[#c9aa71]/50">
                <span className="flex items-center gap-2 text-emerald-400 font-serif text-sm font-semibold tracking-wider">
                  <svg width="16" height="16">
                    <use href="#i-seal" />
                  </svg>
                  Victory Claimed (+{quest.runes} Runes)
                </span>
                <button
                  type="button"
                  onClick={() => handleReset(quest)}
                  className="text-xs text-[#a39787] hover:text-[#e8d3a0] underline font-serif tracking-wider"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
