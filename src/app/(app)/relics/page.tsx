import type { Metadata } from "next";
import { RelicsClient } from "./relics-client";

export const metadata: Metadata = {
  title: "Hall of Relics — Emberwake",
  description: "Claim relics by achieving feats of discipline and conquering quests.",
};

export default function RelicsPage() {
  return <RelicsClient />;
}
