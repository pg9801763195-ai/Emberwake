"use client";

import React, { useState } from "react";

interface TutorialGuideProps {
  onForgeClick: () => void;
}

export function TutorialGuide({ onForgeClick }: TutorialGuideProps) {
  const [minimized, setMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<"vigils" | "oaths" | "bounties" | "bonfire">("vigils");

  if (minimized) {
    return (
      <div className="mb-6 p-3.5 bg-[#14100c] border border-[#c9aa71]/40 rounded-sm flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-serif text-[#e8d3a0]">
          <span className="text-amber-500">📜</span>
          <span>Wanderer’s Codex & Tutorial Guide</span>
        </div>
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="text-xs px-3 py-1 bg-[#1f1711] hover:bg-[#2e2319] border border-[#4a3d2c] hover:border-[#c9aa71] text-[#c9aa71] font-serif uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
        >
          Expand Guide ↓
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-5 sm:p-6 bg-gradient-to-b from-[#18130f] via-[#120e0b] to-[#0d0a07] border border-[#c9aa71]/60 rounded-sm shadow-[0_0_30px_rgba(217,119,43,0.15)] relative">
      {/* Corner Filigrees */}
      <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#c9aa71]/60 pointer-events-none" />
      <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#c9aa71]/60 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#c9aa71]/60 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#c9aa71]/60 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-400 text-[10px] uppercase tracking-[0.25em] font-serif mb-1">
            <span>BEGINNER CODEX</span>
          </div>
          <h2 className="font-serif text-lg sm:text-xl text-[#f6ecd2] tracking-wider font-semibold">
            The Three Pillars of Emberwake
          </h2>
          <p className="text-xs text-[#a39787] font-serif mt-0.5">
            Turn your daily routines into fuel. Here is how discipline becomes power in this realm:
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMinimized(true)}
          className="text-xs text-[#a39787] hover:text-[#f6ecd2] p-1 transition-colors cursor-pointer"
          title="Minimize Guide"
        >
          ✕ Minimize
        </button>
      </div>

      {/* Interactive Pillar Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 select-none">
        <button
          type="button"
          onClick={() => setActiveTab("vigils")}
          className={`p-2.5 text-left rounded-sm border transition-all cursor-pointer ${
            activeTab === "vigils"
              ? "bg-[#241a12] border-[#c9aa71] text-[#fff6df] shadow-[0_0_12px_rgba(217,119,43,0.3)]"
              : "bg-[#120e0b] border-[#382b1d] text-[#8c7a65] hover:border-[#68533b] hover:text-[#c4b59f]"
          }`}
        >
          <div className="text-sm font-serif font-semibold flex items-center gap-1.5">
            <span>🔥</span>
            <span>I. Vigils</span>
          </div>
          <div className="text-[11px] opacity-75 mt-0.5">Daily repeating habits</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("oaths")}
          className={`p-2.5 text-left rounded-sm border transition-all cursor-pointer ${
            activeTab === "oaths"
              ? "bg-[#241a12] border-[#c9aa71] text-[#fff6df] shadow-[0_0_12px_rgba(217,119,43,0.3)]"
              : "bg-[#120e0b] border-[#382b1d] text-[#8c7a65] hover:border-[#68533b] hover:text-[#c4b59f]"
          }`}
        >
          <div className="text-sm font-serif font-semibold flex items-center gap-1.5">
            <span>⚔</span>
            <span>II. Oaths</span>
          </div>
          <div className="text-[11px] opacity-75 mt-0.5">Virtues & vices (+/−)</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bounties")}
          className={`p-2.5 text-left rounded-sm border transition-all cursor-pointer ${
            activeTab === "bounties"
              ? "bg-[#241a12] border-[#c9aa71] text-[#fff6df] shadow-[0_0_12px_rgba(217,119,43,0.3)]"
              : "bg-[#120e0b] border-[#382b1d] text-[#8c7a65] hover:border-[#68533b] hover:text-[#c4b59f]"
          }`}
        >
          <div className="text-sm font-serif font-semibold flex items-center gap-1.5">
            <span>📜</span>
            <span>III. Bounties</span>
          </div>
          <div className="text-[11px] opacity-75 mt-0.5">Single-target tasks</div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bonfire")}
          className={`p-2.5 text-left rounded-sm border transition-all cursor-pointer ${
            activeTab === "bonfire"
              ? "bg-[#241a12] border-[#c9aa71] text-[#fff6df] shadow-[0_0_12px_rgba(217,119,43,0.3)]"
              : "bg-[#120e0b] border-[#382b1d] text-[#8c7a65] hover:border-[#68533b] hover:text-[#c4b59f]"
          }`}
        >
          <div className="text-sm font-serif font-semibold flex items-center gap-1.5">
            <span>🕯</span>
            <span>The Bonfire</span>
          </div>
          <div className="text-[11px] opacity-75 mt-0.5">Streaks & Mastery</div>
        </button>
      </div>

      {/* Dynamic Content Panel */}
      <div className="p-3.5 bg-[#0e0b08] border border-[#3e3223] rounded-sm text-xs font-serif leading-relaxed text-[#d4c7b2]">
        {activeTab === "vigils" && (
          <div>
            <h3 className="font-bold text-[#f6ecd2] text-sm mb-1 text-amber-400">🔥 Vigils (Recurring Cadences)</h3>
            <p>
              Vigils represent habits you swear to conquer regularly (e.g. morning workout, reading 20 pages, hydration).
              Completing daily vigils awards <strong>Runes</strong>, levels up your <strong>Attributes</strong> (Vigor, Mind, Endurance, Strength, Dexterity), and builds your <strong>Streak Multiplier</strong>.
            </p>
          </div>
        )}

        {activeTab === "oaths" && (
          <div>
            <h3 className="font-bold text-[#f6ecd2] text-sm mb-1 text-amber-400">⚔ Oaths (Virtues & Vices)</h3>
            <p>
              Oaths are ongoing standards of will. Triggering a <strong>Virtue (+)</strong> strengthens your resolve and awards runes. Succumbing to a <strong>Vice (−)</strong> deals damage to your health bar. If health drops to zero, you become Fallen and half your runes are dropped in a reclaimable cache!
            </p>
          </div>
        )}

        {activeTab === "bounties" && (
          <div>
            <h3 className="font-bold text-[#f6ecd2] text-sm mb-1 text-amber-400">📜 Bounties (Single-Target Tasks)</h3>
            <p>
              Bounties are one-off quests with checklists and due dates. Complete the sub-steps to claim a lump sum of runes upon conquest.
            </p>
          </div>
        )}

        {activeTab === "bonfire" && (
          <div>
            <h3 className="font-bold text-[#f6ecd2] text-sm mb-1 text-amber-400">🕯 The Living Bonfire</h3>
            <p>
              The Bonfire is a reflection of your discipline. Each consecutive day you conquer your vigils, the fire intensifies in 3D, unlocking higher streak titles (Sparks → Kindled → Raging → Eternal Flame) and relic achievements in the Hall of Relics.
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#3e3223]">
        <span className="text-xs text-[#8c7a65] font-serif">
          Ready to forge your first habit? Click below:
        </span>
        <button
          type="button"
          onClick={onForgeClick}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#8b2324] via-[#d9772b] to-[#8b2324] text-[#fff6df] font-serif font-bold text-xs uppercase tracking-[0.2em] rounded-sm border border-[#e8d3a0]/70 shadow-[0_0_15px_rgba(217,119,43,0.4)] hover:shadow-[0_0_25px_rgba(217,119,43,0.7)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>⚔</span>
          <span>Forge Your First Quest</span>
        </button>
      </div>
    </div>
  );
}
