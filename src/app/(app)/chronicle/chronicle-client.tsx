"use client";

import { useMemo, useState } from "react";
import { ATTRIBUTES } from "@/lib/game/constants";
import { useGameState } from "@/lib/game/game-context";
import { buildHeatmap, HEAT_COLORS } from "@/lib/game/sample-data";
import styles from "./chronicle.module.css";

const LOG_FILTERS = ["All", "Virtues", "Vices"];

export function ChronicleClient() {
  const state = useGameState();
  const [filter, setFilter] = useState(0);

  const completedQuests = state.quests.filter((q) => q.done);
  const heat = useMemo(() => buildHeatmap(state.streak), [state.streak]);

  const stats = [
    { value: state.streak.toString(), label: "Bonfire streak" },
    { value: completedQuests.length.toString(), label: "Quests conquered" },
    { value: state.held.toLocaleString(), label: "Runes in pouch" },
    { value: state.lifetime.toLocaleString(), label: "Lifetime runes (XP)" },
  ];

  // Derive log from real user quest completions
  const realLogs = completedQuests.map((q) => ({
    title: q.title,
    attr: q.attr,
    when: "today",
    amount: `+${q.streak * 10 || 15} runes`,
    good: true,
  }));

  const rows = realLogs.filter((r) => filter === 0 || (filter === 1 ? r.good : !r.good));

  return (
    <main className={`${styles.main} fx-fadein`}>
      <h1 className="page-heading">The Chronicle</h1>
      <p className="page-lede">Every fire you have lit, and every night you let one die.</p>

      {/* Real Stats Grid */}
      <div className={styles.statGrid}>
        {stats.map((s) => (
          <div className={styles.statTile} key={s.label}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bonfire Heatmap */}
      <section className={styles.heatSection}>
        <div className={styles.heatHead}>
          <h2 className={styles.panelTitle} style={{ margin: 0 }}>
            Bonfire Intensity · Calendar
          </h2>
          <div className={styles.legend}>
            <span>Unlit</span>
            {HEAT_COLORS.map((c) => (
              <span className={styles.legendSwatch} style={{ background: c }} key={c} />
            ))}
            <span>Blazing</span>
          </div>
        </div>
        <div role="img" aria-label="Bonfire calendar heatmap" className={styles.heatmap}>
          {heat.map((week, wi) => (
            <span className={styles.heatWeek} key={wi}>
              {week.map((cell, ci) => (
                <span className={styles.heatCell} style={{ background: HEAT_COLORS[cell] }} key={ci} />
              ))}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-[#8c7a65] font-serif mt-2.5">
          Conquer your daily Vigils at the Camp to ignite calendar sparks and turn cold days into blazing embers.
        </p>
      </section>

      <div className={styles.twoCol}>
        {/* Weekly Progress */}
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Rune Vault & Wealth</h2>
          <div className="py-6 px-4 text-center bg-[#100c09]/50 border border-[#3e3223] rounded-sm space-y-3">
            <div>
              <span className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#fff5df] to-[#c9aa71] font-bold block">
                {state.held.toLocaleString()} RUNES
              </span>
              <span className="text-[11px] font-serif uppercase tracking-widest text-[#a39787]">
                Spendable in Pouch
              </span>
            </div>
            <div className="pt-2 border-t border-[#2a2016] text-xs font-serif text-[#8c7a65]">
              <span>Lifetime Runes Earned: </span>
              <strong className="text-[#f6ecd2]">{state.lifetime.toLocaleString()}</strong>
            </div>
          </div>
        </section>

        {/* Real Quest History Log */}
        <section className={styles.panel}>
          <div className={styles.logHead}>
            <h2 className={styles.panelTitle} style={{ margin: 0 }}>
              Chronicle Log
            </h2>
            <div className={styles.logFilters}>
              {LOG_FILTERS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={filter === i}
                  className={`${styles.logFilter}${filter === i ? ` ${styles.logFilterActive}` : ""}`}
                  onClick={() => setFilter(i)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.logRows}>
            {rows.map((r, i) => {
              const meta = ATTRIBUTES[r.attr as keyof typeof ATTRIBUTES];
              return (
                <div className={styles.logRow} key={i}>
                  <svg width="17" height="17" aria-hidden="true" style={{ flex: "none", color: meta?.color || "var(--gold)" }}>
                    <use href={`#${meta?.icon || "i-flame"}`} />
                  </svg>
                  <span className={styles.logTitle}>{r.title}</span>
                  <span className={styles.logWhen}>{r.when}</span>
                  <span className={styles.logAmount} style={{ color: r.good ? "var(--gold)" : "#c4676a" }}>
                    {r.amount}
                  </span>
                </div>
              );
            })}
            {rows.length === 0 && (
              <div className="py-8 px-4 text-center text-[#8c7a65] font-serif text-xs">
                <span className="block text-xl mb-1 text-amber-500/60">📜</span>
                No entries recorded in the annals yet.
                <p className="text-[#685744] mt-1">Conquer your first quest in The Camp to write your legend.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
