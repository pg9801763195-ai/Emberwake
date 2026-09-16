import type { Attribute, Quest, RelicDef, Ware } from "./types";

/**
 * Baseline definitions for Emberwake:
 * Defines available class paths, merchant shop wares catalog,
 * unlockable relic achievements, and starting starter templates.
 */

// Fresh soul starts with an empty quest log (ready for user to forge their own)
export const SAMPLE_QUESTS: Quest[] = [];

// Merchant wares available for purchase in the shop
export const WARES: Ware[] = [
  { name: "Iron Warblade", rarity: "Common", slot: "Main Hand", bonus: "+2 Strength", price: 180, icon: "i-sword", req: 1 },
  { name: "Bulwark of the Pale Gate", rarity: "Rare", slot: "Off Hand", bonus: "+3 Endurance · +1 Vigor", price: 540, icon: "i-shield", req: 4 },
  { name: "Circlet of Nine Thoughts", rarity: "Epic", slot: "Head", bonus: "+5 Mind", price: 900, icon: "i-ring", req: 6 },
  { name: "Sovereign's Edge", rarity: "Legendary", slot: "Main Hand", bonus: "+8 Strength · +2 Dexterity", price: 2400, icon: "i-sword", req: 10 },
  { name: "Ember Flask", rarity: "Common", slot: "Consumable", bonus: "Refills one flask", price: 200, icon: "i-flask", req: 1 },
  { name: "Blessing of Plenty", rarity: "Rare", slot: "Consumable", bonus: "+25% runes for one hour", price: 300, icon: "i-scroll", req: 3 },
];

export const FEATURED_WARE_NAMES = ["Circlet of Nine Thoughts", "Ember Flask", "Bulwark of the Pale Gate"];

export const INDULGENCES: { title: string; price: number }[] = [
  { title: "One episode, no more", price: 150 },
  { title: "A long bath, door shut", price: 260 },
  { title: "The good coffee", price: 90 },
  { title: "A day of rest (no vigils)", price: 1500 },
];

// Relics available in the Realm (all start locked until unlocked by real deeds)
export const RELIC_DEFS: RelicDef[] = [
  { group: "First Steps", name: "First Light", criteria: "Complete the First Steps checklist.", icon: "i-sigil", progress: 0 },
  { group: "First Steps", name: "First Blood", criteria: "Complete your first quest.", icon: "i-skull", progress: 0 },
  { group: "First Steps", name: "Merchant's Favour", criteria: "Buy your first ware from the merchant.", icon: "i-ring", progress: 0 },
  { group: "First Steps", name: "Oathsworn", criteria: "Maintain 5 active Oaths.", icon: "i-seal", progress: 0 },
  { group: "Bonfires", name: "Seven Flames", criteria: "Keep the bonfire lit for 7 consecutive days.", icon: "i-chalice", progress: 0 },
  { group: "Bonfires", name: "Unbroken", criteria: "Keep the bonfire lit for 30 consecutive days.", icon: "i-flame", progress: 0 },
  { group: "Bonfires", name: "Rise Again", criteria: "Reclaim a Rune Cache after falling in battle.", icon: "i-flask", progress: 0 },
  { group: "Mastery", name: "Master of Mind", criteria: "Raise Mind to level 10.", icon: "i-mind", progress: 10 },
  { group: "Mastery", name: "Centurion", criteria: "Complete 100 total quests.", icon: "i-sword", progress: 0 },
  { group: "Mastery", name: "Ironbound", criteria: "Raise Strength to level 10.", icon: "i-strength", progress: 10 },
  { group: "Treasures", name: "Hoarder", criteria: "Hold 2,000 runes at once in your pouch.", icon: "i-scroll", progress: 0 },
  { group: "Treasures", name: "Fully Arrayed", criteria: "Equip items in every gear slot.", icon: "i-shield", progress: 0 },
  { group: "Secrets", name: "???", criteria: "Its criteria are hidden in the mists.", icon: "i-seal", progress: 0 },
  { group: "Secrets", name: "???", criteria: "Its criteria are hidden in the mists.", icon: "i-seal", progress: 0 },
];

export const RELIC_GROUPS = ["First Steps", "Bonfires", "Mastery", "Treasures", "Secrets"] as const;

export const SHELF_RELICS = [
  { name: "Seven Flames", icon: "i-chalice", unlocked: false },
  { name: "Centurion", icon: "i-sword", unlocked: false },
  { name: "Fully Arrayed", icon: "i-shield", unlocked: false },
  { name: "Unbroken", icon: "i-flame", unlocked: false },
  { name: "Master of Mind", icon: "i-mind", unlocked: false },
  { name: "Oathsworn", icon: "i-seal", unlocked: false },
];

export const CLASS_DEFS: { name: string; attr: Attribute; item: string }[] = [
  { name: "Knight", attr: "Strength", item: "A notched longsword, kept sharp by habit alone." },
  { name: "Scholar", attr: "Mind", item: "A candle that has outlasted three owners." },
  { name: "Ranger", attr: "Dexterity", item: "A yew shortbow, restrung with gut and patience." },
  { name: "Pilgrim", attr: "Vigor", item: "A walking staff worn smooth at the grip." },
  { name: "Sentinel", attr: "Endurance", item: "A tower shield, dented on the inside." },
];

export const STARTER_QUESTS: { title: string; kind: "Vigil" | "Oath"; diff: "Trivial" | "Standard" | "Hard" | "Legendary"; attr: string }[] = [
  { title: "Kindle the Morning", kind: "Vigil", diff: "Standard", attr: "Vigor" },
  { title: "Hour of the Scholar", kind: "Vigil", diff: "Hard", attr: "Mind" },
  { title: "Drink of the Well", kind: "Oath", diff: "Trivial", attr: "Vigor" },
  { title: "Walk the Long Road", kind: "Vigil", diff: "Standard", attr: "Endurance" },
  { title: "The Iron Vigil", kind: "Vigil", diff: "Legendary", attr: "Strength" },
  { title: "Practise the Strings", kind: "Oath", diff: "Standard", attr: "Dexterity" },
];

export const FIRST_STEPS_CHECKLIST: { label: string; done: boolean }[] = [
  { label: "Forge your first quest", done: false },
  { label: "Complete a quest", done: false },
  { label: "Allocate a stat point", done: false },
  { label: "Buy from the Merchant", done: false },
  { label: "Equip an item", done: false },
];

export const HEAT_COLORS = ["#1a1714", "#3f2c18", "#7a4a1c", "#b8691f", "#e89a3c"];

/** Builds clean 26 weeks x 7 days heatmap grid starting fresh for new users */
export function buildHeatmap(activeDays = 0): number[][] {
  const heat: number[][] = [];
  for (let w = 0; w < 26; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      // For a fresh user, only today has initial spark if active
      const isToday = w === 25 && d === 6;
      week.push(isToday && activeDays > 0 ? 2 : 0);
    }
    heat.push(week);
  }
  return heat;
}

export const RUNE_WEEKS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export const CHRONICLE_LOG: { title: string; attr: string; when: string; amount: string; good: boolean }[] = [];

export const RAVENS: { text: string; when: string; icon: string; color: string }[] = [
  {
    text: "Welcome to Emberwake, Wanderer. The gate has opened. Forge your first quest at the Camp to kindle your bonfire.",
    when: "just now",
    icon: "i-flame",
    color: "#d9772b",
  },
];
