"use client";

import { useRouter } from "next/navigation";
import { levelFor } from "@/lib/game/constants";
import { useGameActions, useGameState } from "@/lib/game/game-context";

export function MomentsClient() {
  const router = useRouter();
  const state = useGameState();
  const { previewAscension, previewFallen } = useGameActions();
  const level = levelFor(state.lifetime).level;

  const moments = [
    {
      id: "ascend",
      name: "Ascension of the Soul",
      icon: "⚡",
      badge: "Level Progression",
      cta: "Summon Ascension",
      body: "Crossing a lifetime rune threshold stops the realm in awe. A stat point is awarded, health fully restored, and an Ember Flask refilled.",
      stageBg: "radial-gradient(ellipse at center, rgba(232,211,160,.25) 0%, #120e0b 80%)",
      stageText: `LEVEL ${level + 1}`,
      stageFg: "#f6ecd2",
      beats: [
        { t: "0ms", what: "World dims, golden godrays bloom from the center" },
        { t: "200ms", what: "Blackletter “Ascension” emerges through smoke" },
        { t: "300ms", what: "Level numeral resolves with glowing gold aura" },
        { t: "1.1s", what: "Stat-point prompt unlocks for mastery allocation" },
      ],
      play: () => previewAscension(level + 1),
    },
    {
      id: "fallen",
      name: "Fallen to the Dark",
      icon: "💀",
      badge: "Health Depletion",
      cta: "Trigger Fallen State",
      body: "When health reaches zero from succumbing to vices, the world fades to black. Half of held runes drop into a 24-hour reclaimable cache.",
      stageBg: "radial-gradient(ellipse at center, rgba(158,42,43,.35) 0%, #0d0908 80%)",
      stageText: "YOU FELL",
      stageFg: "#e03e3e",
      beats: [
        { t: "0ms", what: "Slow desaturation and fade to darkness" },
        { t: "600ms", what: "Crimson ember-red title materializes" },
        { t: "1.1s", what: "“Rise Again” banner appears, full health restored" },
      ],
      play: () => previewFallen(),
    },
    {
      id: "clash",
      name: "The Clash of Will",
      icon: "⚔",
      badge: "Habit Conquest",
      cta: "Explore in Camp",
      body: "The core heartbeat of Emberwake. Completing a daily vigil slashes across the screen with molten sparks, rewarding runes and boosting streak.",
      stageBg: "linear-gradient(135deg, #2a1f16 0%, #3e2e1f 50%, #1a130e 100%)",
      stageText: "+45 RUNES",
      stageFg: "#e8d3a0",
      beats: [
        { t: "0ms", what: "Quest card compresses, golden blade slash strikes" },
        { t: "120ms", what: "Glint flash, flying ember sparks, and subtle impact" },
        { t: "520ms", what: "Rune counter rolls up dynamically in real-time" },
      ],
      play: () => router.push("/camp"),
    },
    {
      id: "relic",
      name: "Relic Consecration",
      icon: "🛡",
      badge: "Feat of Discipline",
      cta: "Visit Hall of Relics",
      body: "Maintaining unbroken streaks unlocks ancient 3D weapons, crowns, and shields in the Hall of Relics, immortalizing your discipline.",
      stageBg: "radial-gradient(ellipse at center, rgba(201,170,113,.22) 0%, #120e0a 80%)",
      stageText: "RELIC CLAIMED",
      stageFg: "#c9aa71",
      beats: [
        { t: "0ms", what: "Relic flips from cold stone to gleaming forged metal" },
        { t: "340ms", what: "Golden shimmer sweep passes across the blade/shield" },
        { t: "400ms", what: "Raven herald delivers the news to your codex" },
      ],
      play: () => router.push("/relics"),
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 fx-fadein">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181410] border border-[#c9aa71]/40 text-[#c9aa71] text-[11px] uppercase tracking-[0.25em] font-serif mb-2">
          <span>CINEMATIC ARCHIVES</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#fff5df] font-bold tracking-wider">
          Moments of Power
        </h1>
        <p className="font-serif italic text-[#c4b59f] text-sm mt-1 max-w-lg mx-auto">
          The four cinematic beats the entire Emberwake realm is built to deliver. Press any trial below to watch it unfold.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moments.map((m) => (
          <section
            key={m.name}
            className="relative p-6 sm:p-7 rounded-sm bg-gradient-to-b from-[#18130f]/95 via-[#120e0b]/98 to-[#0b0806]/98 border border-[#c9aa71]/50 shadow-[0_0_30px_rgba(217,119,43,0.15)] flex flex-col justify-between"
          >
            {/* Corner Filigrees */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t border-l border-[#c9aa71]/60 pointer-events-none" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-[#c9aa71]/60 pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-[#c9aa71]/60 pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r border-[#c9aa71]/60 pointer-events-none" />

            <div>
              {/* Visual Stage Banner */}
              <div
                className="w-full h-32 rounded-sm border border-[#3e3223] flex items-center justify-center relative overflow-hidden mb-5 shadow-inner"
                style={{ background: m.stageBg }}
              >
                <span
                  className="font-serif font-bold text-2xl sm:text-3xl tracking-[0.25em] select-none"
                  style={{ color: m.stageFg, textShadow: `0 0 30px ${m.stageFg}88` }}
                >
                  {m.stageText}
                </span>
              </div>

              {/* Title & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="font-serif text-xl text-[#f6ecd2] font-semibold flex items-center gap-2">
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </h2>
                <span className="text-[10px] font-serif uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-[#241a12] text-[#c9aa71] border border-[#4a3d2c]">
                  {m.badge}
                </span>
              </div>

              <p className="font-serif text-xs text-[#d4c7b2] leading-relaxed mb-4">
                {m.body}
              </p>

              {/* Beats Timeline */}
              <div className="space-y-1.5 p-3 bg-[#0c0907] border border-[#2d2318] rounded-sm mb-5">
                {m.beats.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[11px] font-serif">
                    <span className="text-amber-500/90 font-mono text-[10px] flex-shrink-0 w-12">{b.t}</span>
                    <span className="text-[#a39787]">{b.what}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={m.play}
              className="w-full py-3 bg-gradient-to-r from-[#8b2324] via-[#b8581e] to-[#8b2324] text-[#fff6df] font-serif font-bold text-xs uppercase tracking-[0.2em] rounded-sm border border-[#e8d3a0]/70 shadow-sm hover:shadow-[0_0_20px_rgba(217,119,43,0.6)] transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>⚔</span>
              <span>{m.cta}</span>
            </button>
          </section>
        ))}
      </div>
    </main>
  );
}
