import { randomInt } from "node:crypto";
import type { FlipRecord, FlipSide, StatsResponse } from "../../../shared/types.js";

const MAX_FLIPS = 500;

class MemoryStore {
  private flips: FlipRecord[] = [];

  add(flip: FlipRecord): void {
    this.flips.unshift(flip);
    if (this.flips.length > MAX_FLIPS) {
      this.flips = this.flips.slice(0, MAX_FLIPS);
    }
  }

  update(id: string, updates: Partial<FlipRecord>): FlipRecord | undefined {
    const index = this.flips.findIndex((f) => f.id === id);
    if (index === -1) return undefined;
    this.flips[index] = { ...this.flips[index], ...updates };
    return this.flips[index];
  }

  getById(id: string): FlipRecord | undefined {
    return this.flips.find((f) => f.id === id);
  }

  getRecent(limit: number): FlipRecord[] {
    return this.flips
      .filter((f) => f.status === "confirmed")
      .slice(0, limit);
  }

  getStats(): StatsResponse {
    const confirmed = this.flips.filter((f) => f.status === "confirmed");
    const totalFlips = confirmed.length;
    const biggestWin = confirmed.reduce((max, f) => Math.max(max, f.payout), 0);
    const totalVolume = confirmed.reduce((sum, f) => sum + f.amount, 0);

    let topStreak = 0;
    let currentStreak = 0;
    for (const flip of [...confirmed].reverse()) {
      if (flip.won) {
        currentStreak++;
        topStreak = Math.max(topStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return { totalFlips, biggestWin, topStreak, totalVolume };
  }

  getWalletStreak(wallet: string): { current: number; type: "win" | "loss" | "none" } {
    const walletFlips = this.flips
      .filter((f) => f.wallet === wallet && f.status === "confirmed")
      .reverse();

    if (walletFlips.length === 0) return { current: 0, type: "none" };

    const type = walletFlips[walletFlips.length - 1].won ? "win" : "loss";
    let current = 0;
    for (let i = walletFlips.length - 1; i >= 0; i--) {
      const won = walletFlips[i].won;
      if ((type === "win" && won) || (type === "loss" && !won)) {
        current++;
      } else {
        break;
      }
    }
    return { current, type };
  }
}

export const store = new MemoryStore();

export function generateId(): string {
  return crypto.randomUUID();
}

export function randomSide(): FlipSide {
  return randomInt(2) === 0 ? "heads" : "tails";
}

export function hashSeed(seed: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(seed);
  // Simple hash for demo purposes
  let hash = 0;
  for (const byte of data) {
    hash = ((hash << 5) - hash + byte) | 0;
  }
  return Math.abs(hash).toString(16).padStart(16, "0");
}
