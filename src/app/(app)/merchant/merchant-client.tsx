"use client";

import { useState } from "react";
import { RARITY_COLOR, levelFor } from "@/lib/game/constants";
import { FEATURED_WARE_NAMES, WARES } from "@/lib/game/sample-data";
import { useGameActions, useGameState } from "@/lib/game/game-context";
import { RelicViewer3D, RELIC_LIST } from "@/components/3d/relic-viewer-3d";
import type { Ware } from "@/lib/game/types";
import styles from "./merchant.module.css";

const CATEGORIES = ["All", "Weapons", "Shields", "Armor", "Rings & Talismans", "Consumables"];

export function MerchantClient() {
  const state = useGameState();
  const { spend } = useGameActions();
  const [cat, setCat] = useState(0);
  const [inspectingWare, setInspectingWare] = useState<Ware | null>(null);
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);
  const level = levelFor(state.lifetime).level;

  const featured = WARES.filter((w) => FEATURED_WARE_NAMES.includes(w.name));

  const filteredWares = WARES.filter((w) => {
    if (cat === 0) return true;
    const catName = CATEGORIES[cat];
    if (catName === "Weapons") return w.slot === "Main Hand";
    if (catName === "Shields") return w.slot === "Off Hand";
    if (catName === "Armor") return w.slot === "Head" || w.slot === "Chest" || w.slot === "Legs";
    if (catName === "Rings & Talismans") return w.slot === "Ring" || w.slot === "Talisman";
    if (catName === "Consumables") return w.slot === "Consumable";
    return true;
  });

  const handleBuy = (w: Ware) => {
    if (state.held < w.price) {
      setPurchaseNotice(`You require ${w.price - state.held} more runes to purchase ${w.name}.`);
      setTimeout(() => setPurchaseNotice(null), 3500);
      return;
    }
    const success = spend(w.price, w.name);
    if (success) {
      setPurchaseNotice(`Acquired ${w.name}! Runes spent: ${w.price.toLocaleString()}.`);
      setTimeout(() => setPurchaseNotice(null), 3500);
    }
  };

  // Map ware name/slot to 3D relic model id for the 3D viewer
  const get3DModelIdForWare = (w: Ware): string => {
    if (w.slot === "Main Hand") return "iron-will";
    if (w.slot === "Off Hand") return "aegis-dawn";
    if (w.slot === "Head") return "ash-crown";
    if (w.slot === "Ring") return "oath-ring";
    return "vigil-seal";
  };

  return (
    <main className={`${styles.main} fx-fadein`}>
      {/* 1. Atmospheric Hooded Merchant Header */}
      <section className="relative w-full p-6 sm:p-8 rounded-sm bg-gradient-to-r from-[#17110c] via-[#211710] to-[#120d09] border border-[#c9aa71]/50 shadow-[0_0_40px_rgba(217,119,43,0.15)] mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-amber-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Merchant Silhouette / Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0d0a08] border-2 border-[#c9aa71] flex items-center justify-center shadow-[0_0_25px_rgba(201,170,113,0.3)] flex-shrink-0">
              <span className="text-4xl select-none animate-pulse">🧙‍♂️</span>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1b140e] border border-[#c9aa71] flex items-center justify-center text-xs">
                <span>🕯</span>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2a1d13] border border-[#c9aa71]/40 text-[#c9aa71] text-[10px] uppercase tracking-[0.25em] font-serif mb-1">
                <span>KEEPER OF WARES</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#fff5df] font-bold tracking-wider">
                The Wandering Merchant
              </h1>
              <p className="font-serif italic text-[#c4b59f] text-xs sm:text-sm mt-1 max-w-md">
                “I keep no ledger of where these came from. Only of what they cost in discipline.”
              </p>
            </div>
          </div>

          {/* Runes Held Badge */}
          <div className="flex items-center gap-3 px-6 py-3.5 bg-[#0e0b08] border border-[#c9aa71]/70 rounded-sm shadow-[0_0_20px_rgba(217,119,43,0.25)] flex-shrink-0">
            <span className="text-2xl text-amber-400">✦</span>
            <div>
              <div className="font-serif text-2xl text-[#f6ecd2] font-bold tracking-wider leading-none">
                {state.displayRunes.toLocaleString()}
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#a39787] font-serif mt-0.5">
                Runes in Pouch
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Notification Banner */}
        {purchaseNotice && (
          <div className="mt-4 p-3 bg-amber-950/80 border border-amber-600/70 rounded text-amber-200 text-xs font-serif flex items-center gap-2 animate-fadeIn">
            <span>⚔</span>
            <span>{purchaseNotice}</span>
          </div>
        )}
      </section>

      {/* 2. Featured Wares Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-[#f6ecd2] tracking-wider font-semibold flex items-center gap-2">
            <span>🔥</span>
            <span>Featured Wares</span>
            <span className="text-xs text-[#8c7a65] font-normal tracking-normal">(Rotates at dawn)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((w) => {
            const poor = state.held < w.price;
            const color = RARITY_COLOR[w.rarity];
            return (
              <div
                key={w.name}
                className="relative p-5 rounded-sm bg-gradient-to-b from-[#18130f] via-[#120e0b] to-[#0d0a07] border transition-all duration-300 hover:shadow-[0_0_25px_rgba(217,119,43,0.3)] group flex flex-col justify-between"
                style={{ borderColor: `${color}88` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2.5 py-0.5 text-[10px] font-serif uppercase tracking-[0.2em] rounded-sm border"
                      style={{ color, borderColor: `${color}66`, backgroundColor: `${color}15` }}
                    >
                      {w.rarity} · {w.slot}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspectingWare(w)}
                      className="text-[11px] text-[#c9aa71] hover:text-[#fff6df] font-serif tracking-wider underline decoration-[#c9aa71]/40 hover:decoration-[#c9aa71] cursor-pointer"
                    >
                      Inspect 3D ↗
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <svg width="32" height="32" aria-hidden="true" style={{ color }} className="flex-shrink-0">
                      <use href={`#${w.icon}`} />
                    </svg>
                    <h3 className="font-serif text-base text-[#f6ecd2] font-semibold">{w.name}</h3>
                  </div>

                  <p className="text-xs text-[#d4c7b2] font-serif mb-4">{w.bonus}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#3e3223]">
                  <span className="font-serif text-sm font-bold text-[#e8d3a0]">
                    {w.price.toLocaleString()} runes
                  </span>
                  <button
                    type="button"
                    disabled={poor}
                    onClick={() => handleBuy(w)}
                    className={`px-4 py-2 font-serif text-xs uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
                      poor
                        ? "bg-[#16120e] border-[#382c20] text-[#6b5947] cursor-not-allowed"
                        : "bg-gradient-to-r from-[#8b2324] via-[#b8581e] to-[#8b2324] text-[#fff6df] font-bold border-[#e8d3a0]/70 shadow-sm hover:shadow-[0_0_15px_rgba(217,119,43,0.5)] transform hover:scale-105"
                    }`}
                  >
                    {poor ? "Need Runes" : "Buy Ware"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Stall Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <aside className="lg:col-span-1 p-4 bg-[#120e0b] border border-[#3e3223] rounded-sm">
          <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-[#c9aa71] mb-3 pb-2 border-b border-[#3e3223]">
            Merchant Stall
          </h2>
          <div className="flex flex-col gap-1.5">
            {CATEGORIES.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setCat(i)}
                className={`py-2 px-3 text-left font-serif text-xs tracking-wider rounded-sm transition-all cursor-pointer ${
                  cat === i
                    ? "bg-[#241a12] text-[#fff6df] font-semibold border-l-2 border-[#c9aa71] shadow-sm"
                    : "text-[#8c7a65] hover:text-[#c4b59f] hover:bg-[#18130f]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Wares Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredWares.map((w) => {
            const locked = level < w.req;
            const poor = state.held < w.price;
            const off = locked || poor;
            const color = RARITY_COLOR[w.rarity];
            return (
              <div
                key={w.name}
                className={`p-5 rounded-sm bg-[#130f0c] border transition-all duration-300 flex flex-col justify-between ${
                  locked ? "opacity-60 grayscale-[40%]" : "hover:shadow-[0_0_20px_rgba(201,170,113,0.2)]"
                }`}
                style={{ borderColor: `${color}55` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <svg width="24" height="24" aria-hidden="true" style={{ color }}>
                        <use href={`#${w.icon}`} />
                      </svg>
                      <span className="text-xs font-serif font-bold uppercase tracking-wider" style={{ color }}>
                        {w.rarity}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectingWare(w)}
                      className="text-[11px] text-[#8c7a65] hover:text-[#e8d3a0] font-serif cursor-pointer"
                    >
                      3D View ↗
                    </button>
                  </div>

                  <h3 className="font-serif text-base text-[#f6ecd2] font-semibold mb-1">{w.name}</h3>
                  <p className="text-xs text-[#a39787] font-serif mb-2">{w.bonus}</p>

                  <div className="text-[11px] font-serif mb-4">
                    {locked ? (
                      <span className="text-red-400">🔒 Requires Character Level {w.req}</span>
                    ) : (
                      <span className="text-[#8c7a65]">Level {w.req} Req · {w.slot}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#2d2419]">
                  <span className="font-serif text-sm font-semibold text-[#e8d3a0]">
                    {w.price.toLocaleString()} runes
                  </span>
                  <button
                    type="button"
                    disabled={off}
                    onClick={() => handleBuy(w)}
                    className={`px-3.5 py-1.5 font-serif text-xs uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
                      locked
                        ? "bg-[#15110d] border-[#2e2318] text-[#554738] cursor-not-allowed"
                        : poor
                        ? "bg-[#19130f] border-[#382b1d] text-[#7a6753] cursor-not-allowed"
                        : "bg-[#251910] hover:bg-[#382618] border-[#c9aa71] text-[#fff5df] hover:shadow-[0_0_12px_rgba(217,119,43,0.4)]"
                    }`}
                  >
                    {locked ? "Level Locked" : poor ? "Need Runes" : "Buy Ware"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive 3D Inspection Modal */}
      {inspectingWare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setInspectingWare(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#14100c] border border-[#c9aa71] p-6 rounded-sm shadow-[0_0_50px_rgba(217,119,43,0.5)] animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectingWare(null)}
              className="absolute top-4 right-4 text-[#a39787] hover:text-[#f6ecd2] p-1 font-serif text-lg leading-none cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center mb-2">
              <span
                className="inline-block px-3 py-0.5 text-[10px] font-serif uppercase tracking-[0.25em] rounded-sm border mb-2"
                style={{
                  color: RARITY_COLOR[inspectingWare.rarity],
                  borderColor: RARITY_COLOR[inspectingWare.rarity],
                }}
              >
                {inspectingWare.rarity} · {inspectingWare.slot}
              </span>
              <h2 className="font-serif text-2xl text-[#f6ecd2] font-bold tracking-wider">
                {inspectingWare.name}
              </h2>
              <p className="font-serif text-xs text-[#c9aa71] mt-0.5">{inspectingWare.bonus}</p>
            </div>

            {/* Live 3D Inspect Canvas */}
            <div className="w-full bg-[#0a0806] border border-[#3e3223] rounded-sm overflow-hidden my-4 relative">
              <RelicViewer3D activeRelicId={get3DModelIdForWare(inspectingWare)} />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#8c7a65] font-serif uppercase tracking-widest pointer-events-none">
                ✦ Drag to Rotate 3D Artifact ✦
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-[#8c7a65] font-serif block">Price:</span>
                <span className="font-serif text-lg font-bold text-[#f6ecd2]">
                  {inspectingWare.price.toLocaleString()} runes
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setInspectingWare(null)}
                  className="px-4 py-2 bg-[#1b140e] border border-[#4a3d2c] text-[#a39787] hover:text-[#f6ecd2] font-serif text-xs uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={state.held < inspectingWare.price}
                  onClick={() => {
                    handleBuy(inspectingWare);
                    setInspectingWare(null);
                  }}
                  className={`px-5 py-2 font-serif text-xs uppercase tracking-wider rounded-sm border transition-all cursor-pointer ${
                    state.held < inspectingWare.price
                      ? "bg-[#18130e] border-[#382b1d] text-[#6b5847] cursor-not-allowed"
                      : "bg-gradient-to-r from-[#8b2324] via-[#b8581e] to-[#8b2324] text-[#fff6df] font-bold border-[#e8d3a0]/70 shadow-md hover:scale-105"
                  }`}
                >
                  {state.held < inspectingWare.price ? "Need More Runes" : "Buy Artifact"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
