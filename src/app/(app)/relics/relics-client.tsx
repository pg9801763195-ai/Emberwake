"use client";

import React, { useState } from "react";
import { RELIC_DEFS, RELIC_GROUPS } from "@/lib/game/sample-data";
import { RelicViewer3D, RELIC_LIST } from "@/components/3d/relic-viewer-3d";
import styles from "./relics.module.css";

export function RelicsClient() {
  const [selectedRelicId, setSelectedRelicId] = useState<string>("iron-will");

  const activeRelic =
    RELIC_LIST.find((r) => r.id === selectedRelicId) || RELIC_LIST[0];

  const unlockedCount = RELIC_DEFS.filter((r) => !!r.unlockedOn).length;

  return (
    <div className={styles.wrap}>
      <div className={styles.bgScrim} aria-hidden="true" />

      <main className={`${styles.main} fx-fadein`}>
        {/* Header */}
        <h1 className="page-heading">Hall of Relics</h1>
        <p className="page-lede">
          {unlockedCount} of {RELIC_DEFS.length} claimed. The rest wait in the dark.
        </p>

        <div className="icon-sigil-divider" aria-hidden="true">
          <span />
          <svg width="11" height="11">
            <use href="#i-sigil" />
          </svg>
          <span />
        </div>

        {/* 1. Interactive 3D Showcase Chamber */}
        <section className="relative w-full my-8 p-6 sm:p-8 rounded-sm bg-gradient-to-b from-[#18130f]/95 via-[#120e0b]/98 to-[#0b0806]/98 border border-[#c9aa71]/70 shadow-[0_0_60px_rgba(217,119,43,0.25)]">
          {/* Corner Filigrees */}
          <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#c9aa71]" />
          <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#c9aa71]" />
          <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#c9aa71]" />
          <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#c9aa71]" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 3D Viewer */}
            <div className="w-full bg-[#0a0806] border border-[#3e3223] rounded-sm relative overflow-hidden flex flex-col items-center">
              <RelicViewer3D activeRelicId={selectedRelicId} />
              <div className="absolute bottom-2.5 text-[11px] text-[#8c7a65] font-serif uppercase tracking-widest pointer-events-none">
                ✦ Drag to Inspect Relic in 3D ✦
              </div>
            </div>

            {/* Relic Inscription & Lore */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#241a12] border border-[#c9aa71]/40 text-xs font-serif uppercase tracking-[0.2em] mb-3" style={{ color: activeRelic.glowColor }}>
                  <span>{activeRelic.rarity}</span>
                  <span>·</span>
                  <span>{activeRelic.type}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#fff5df] font-bold tracking-wider mb-2">
                  {activeRelic.name}
                </h2>

                <p className="font-serif italic text-[#c4b59f] text-sm leading-relaxed mb-4">
                  “{activeRelic.lore}”
                </p>

                <div className="space-y-2.5 p-4 bg-[#0e0b08] border border-[#382b1d] rounded-sm text-xs font-serif">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8c7a65]">Feat of Will:</span>
                    <span className="text-[#f6ecd2] font-semibold">{activeRelic.streakRequirement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8c7a65]">Ascension Perk:</span>
                    <span className="text-amber-400 font-semibold">{activeRelic.bonus}</span>
                  </div>
                </div>
              </div>

              {/* Quick Relic Selectors */}
              <div className="mt-6 pt-4 border-t border-[#382b1d]">
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#8c7a65] font-serif block mb-2">
                  Select 3D Artifact:
                </span>
                <div className="flex flex-wrap gap-2">
                  {RELIC_LIST.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRelicId(r.id)}
                      className={`px-3 py-1.5 text-xs font-serif rounded-sm border transition-all cursor-pointer ${
                        selectedRelicId === r.id
                          ? "bg-[#281c12] text-[#fff6df] font-bold border-[#c9aa71] shadow-[0_0_10px_rgba(217,119,43,0.4)]"
                          : "bg-[#14100c] text-[#8c7a65] border-[#382b1d] hover:border-[#68533b] hover:text-[#c4b59f]"
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Grouped Relics List */}
        {RELIC_GROUPS.map((group) => (
          <section className={styles.groupSection} key={group}>
            <h2 className={styles.groupTitle}>{group}</h2>
            <div className={styles.grid}>
              {RELIC_DEFS.filter((r) => r.group === group).map((r, i) => {
                const unlocked = !!r.unlockedOn;
                return (
                  <div
                    key={`${group}-${i}`}
                    className={`${styles.card}${unlocked ? ` ${styles.cardUnlocked}` : ""}`}
                  >
                    <span className={`${styles.disc}${unlocked ? ` ${styles.discUnlocked}` : ""}`}>
                      <svg width="32" height="32" aria-hidden="true" style={{ color: unlocked ? "var(--gold-bright)" : "var(--border-mid)" }}>
                        <use href={`#${r.icon}`} />
                      </svg>
                    </span>
                    <div className={`${styles.name}${unlocked ? ` ${styles.nameUnlocked}` : ""}`}>{r.name}</div>
                    <div className={styles.criteria}>{r.criteria}</div>
                    {unlocked ? (
                      <>
                        <div className={styles.claimed}>Claimed {r.unlockedOn}</div>
                        <span className="shimmer-sweep" aria-hidden="true" />
                      </>
                    ) : (
                      <span
                        className={styles.progressTrack}
                        role="progressbar"
                        aria-label={`${r.name} progress`}
                        aria-valuenow={r.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <span className={styles.progressFill} style={{ width: `${r.progress}%` }} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
