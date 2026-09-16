"use client";

import React from "react";
import Image from "next/image";
import { IntroSection } from "./intro-section";
import { QuestForgeSection } from "./quest-forge-section";
import { SkillTreeSection } from "./skill-tree-section";
import { StreakFlameSection } from "./streak-flame-section";
import { RelicsShowcaseSection } from "./relics-showcase-section";
import { StakesSection } from "./stakes-section";
import { FinalCtaSection } from "./final-cta-section";
import styles from "./about.module.css";

interface AboutSectionProps {
  onAwakenClick?: () => void;
}

/** The comprehensive cinematic storytelling journey across the Emberwake realm */
export function AboutSection({ onAwakenClick }: AboutSectionProps) {
  return (
    <div className={styles.wrap} id="explore">
      <Image src="/about-bg.png" alt="" aria-hidden="true" fill className={styles.bgPhoto} />
      <div className={styles.bgScrim} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />

      <div style={{ position: "relative" }}>
        {/* Intro Lore Prologue */}
        <IntroSection />

        {/* Section 2: Turn Habits into Quests */}
        <QuestForgeSection />

        {/* Section 3: Forge Your Attributes */}
        <SkillTreeSection />

        {/* Section 4: Protect the Flame (Living Streak & Flasks) */}
        <StreakFlameSection />

        {/* Stakes / The World Pushes Back */}
        <StakesSection />

        {/* Section 5: Earn What You Deserve (3D Relics & Armory) */}
        <RelicsShowcaseSection />

        {/* Section 6: Final Call to Action */}
        <FinalCtaSection onAwakenClick={onAwakenClick} />
      </div>

      <footer className={styles.footer}>
        EMBERWAKE · ALL ART ORIGINAL · ICONS UNDER CC-BY WHERE CREDITED · DISCIPLINE BECOMES POWER
      </footer>
    </div>
  );
}
