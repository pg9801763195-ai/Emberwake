"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ATTRIBUTES, BASE_RUNES } from "@/lib/game/constants";
import { CLASS_DEFS, FIRST_STEPS_CHECKLIST, STARTER_QUESTS } from "@/lib/game/sample-data";
import { useGameActions } from "@/lib/game/game-context";
import type { Attribute, QuestType } from "@/lib/game/types";
import { ClassEmblem } from "./class-emblem";
import styles from "./onboarding.module.css";

export function OnboardingClient() {
  const router = useRouter();
  const { forgeQuest } = useGameActions();
  const [cls, setCls] = useState(0); // Knight default
  const [picks, setPicks] = useState<boolean[]>([true, true, false, true, false, false]);

  const handleEnterCamp = () => {
    // Add selected starter oaths to user's real quest log
    STARTER_QUESTS.forEach((q, i) => {
      if (picks[i]) {
        forgeQuest({
          type: q.kind.toLowerCase() as QuestType,
          title: q.title,
          attr: q.attr as Attribute,
          diff: q.diff,
          notes: "Sworn during First Steps.",
        });
      }
    });

    router.push("/camp");
  };

  return (
    <main className={`${styles.main} fx-fadein`}>
      <p className={styles.eyebrow}>First Steps · I of III</p>
      <h1 className={styles.heading}>Choose Your Path</h1>
      <p className={styles.lede}>Five began this road. None finished it. Take up what they left behind.</p>

      {/* 1. Character Class Grid */}
      <div className={styles.classGrid} role="group" aria-label="Choose a class">
        {CLASS_DEFS.map((c, i) => {
          const meta = ATTRIBUTES[c.attr];
          const selected = cls === i;
          return (
            <button
              key={c.name}
              type="button"
              aria-pressed={selected}
              className={`${styles.classCard}${selected ? ` ${styles.classCardSelected}` : ""}`}
              onClick={() => setCls(i)}
            >
              <span className={styles.classArt} aria-hidden="true">
                <ClassEmblem name={c.name as "Knight" | "Scholar" | "Ranger" | "Pilgrim" | "Sentinel"} selected={selected} />
              </span>
              <span className={styles.classInfo}>
                <span className={styles.className}>{c.name}</span>
                <span className={styles.classAttr} style={{ color: meta.color }}>
                  <svg width="14" height="14" aria-hidden="true">
                    <use href={`#${meta.icon}`} />
                  </svg>
                  +2 {c.attr}
                </span>
                <span className={styles.classDivider} aria-hidden="true" />
                <span className={styles.classItem}>{c.item}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Swear Oaths & Checklist */}
      <div className={styles.detailGrid}>
        <section className={styles.oathsPanel}>
          <p className={styles.panelEyebrow}>II of III</p>
          <h2 className={styles.panelHeading}>Swear Your First Oaths</h2>
          <p className={styles.panelSub}>Select your starting resolves. They will be forged directly into your Quest Log.</p>
          <div className={styles.starterList}>
            {STARTER_QUESTS.map((q, i) => {
              const on = picks[i];
              const meta = ATTRIBUTES[q.attr as keyof typeof ATTRIBUTES];
              return (
                <button
                  key={q.title}
                  type="button"
                  aria-pressed={on}
                  className={`${styles.starterRow}${on ? ` ${styles.starterRowOn}` : ""}`}
                  style={{ borderLeftColor: on ? meta.color : undefined }}
                  onClick={() => setPicks((p) => p.map((v, idx) => (idx === i ? !v : v)))}
                >
                  <span className={`${styles.starterCheck}${on ? ` ${styles.starterCheckOn}` : ""}`}>
                    {on ? "✓" : ""}
                  </span>
                  <svg width="18" height="18" aria-hidden="true" style={{ flex: "none", color: on ? meta.color : "var(--border-mid)" }}>
                    <use href={`#${meta.icon}`} />
                  </svg>
                  <span className={styles.starterBody}>
                    <span className={`${styles.starterTitle}${on ? ` ${styles.starterTitleOn}` : ""}`}>{q.title}</span>
                    <span className={styles.starterKind}>
                      {q.kind} · {q.diff}
                    </span>
                  </span>
                  <span className={styles.starterRunes}>{BASE_RUNES[q.diff]} runes</span>
                </button>
              );
            })}
          </div>
          <button type="button" className={styles.enterButton} onClick={handleEnterCamp}>
            Enter the Camp & Forge Oaths
          </button>
        </section>

        <section className={styles.checklistPanel}>
          <p className={styles.panelEyebrow}>III of III</p>
          <h2 className={styles.checklistTitle}>First Steps</h2>
          <div className={styles.checkList}>
            {FIRST_STEPS_CHECKLIST.map((c) => (
              <div className={styles.checkRow} key={c.label}>
                <span className={`${styles.checkMark}${c.done ? ` ${styles.checkMarkDone}` : ""}`}>
                  {c.done ? "✓" : ""}
                </span>
                <span className={`${styles.checkLabel}${c.done ? ` ${styles.checkLabelDone}` : ""}`}>{c.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.rewardBlock}>
            <div className={styles.rewardHead}>
              <svg width="20" height="20" aria-hidden="true">
                <use href="#i-sigil" />
              </svg>
              <span>Reward</span>
            </div>
            <p className={styles.rewardText}>
              100 runes and the relic <em>First Light</em> upon completing all steps.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
