import { create } from "zustand";
import type { FlipRecord, StatsResponse } from "../types";

function sortByDateDesc(a: FlipRecord, b: FlipRecord): number {
  const aTime = new Date(a.confirmedAt ?? a.createdAt).getTime();
  const bTime = new Date(b.confirmedAt ?? b.createdAt).getTime();
  return bTime - aTime;
}

function computeStats(flips: FlipRecord[]): StatsResponse {
  const confirmed = flips.filter((f) => f.status === "confirmed");
  const totalFlips = confirmed.length;
  const biggestWin = confirmed.reduce((max, f) => Math.max(max, f.payout), 0);
  const totalVolume = confirmed.reduce((sum, f) => sum + f.amount, 0);

  let topStreak = 0;
  let currentStreak = 0;
  for (const flip of [...confirmed].sort(sortByDateDesc).reverse()) {
    if (flip.won) {
      currentStreak++;
      topStreak = Math.max(topStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return { totalFlips, biggestWin, topStreak, totalVolume };
}

interface FlipHistoryState {
  flipsById: Record<string, FlipRecord>;
  addFlip: (flip: FlipRecord) => void;
  mergeRemoteFlips: (flips: FlipRecord[]) => void;
  getRecentFlips: (limit: number) => FlipRecord[];
  getStats: () => StatsResponse;
}

export const useFlipHistoryStore = create<FlipHistoryState>((set, get) => ({
  flipsById: {},

  addFlip: (flip) => {
    set((state) => ({
      flipsById: { ...state.flipsById, [flip.id]: flip },
    }));
  },

  mergeRemoteFlips: (flips) => {
    set((state) => {
      const next = { ...state.flipsById };
      for (const flip of flips) {
        const existing = next[flip.id];
        if (!existing) {
          next[flip.id] = flip;
          continue;
        }
        const existingTime = new Date(existing.confirmedAt ?? existing.createdAt).getTime();
        const incomingTime = new Date(flip.confirmedAt ?? flip.createdAt).getTime();
        if (incomingTime >= existingTime) {
          next[flip.id] = flip;
        }
      }
      return { flipsById: next };
    });
  },

  getRecentFlips: (limit) => {
    const { flipsById } = get();
    return Object.values(flipsById)
      .filter((f) => f.status === "confirmed")
      .sort(sortByDateDesc)
      .slice(0, limit);
  },

  getStats: () => {
    const { flipsById } = get();
    return computeStats(Object.values(flipsById));
  },
}));
