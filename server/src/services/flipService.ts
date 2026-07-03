import type {
  CreateFlipRequest,
  FlipRecord,
} from "../types.js";
import { generateId, hashSeed, randomSide, store } from "../store/memoryStore.js";

const MIN_BET = 0.01;
const MAX_BET = 100;
const CONFIRM_DELAY_MS = 1500;
const pendingSeeds = new Map<string, string>();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getHouseEdge(): number {
  const edge = parseFloat(process.env.HOUSE_EDGE ?? "0.035");
  return Number.isFinite(edge) && edge >= 0 && edge < 1 ? edge : 0.035;
}

function validateRequest(req: CreateFlipRequest): string | null {
  if (!req.wallet || req.wallet.length < 8) {
    return "Invalid wallet address";
  }
  if (req.side !== "heads" && req.side !== "tails") {
    return "Side must be heads or tails";
  }
  if (!Number.isFinite(req.amount) || req.amount < MIN_BET || req.amount > MAX_BET) {
    return `Bet must be between ${MIN_BET} and ${MAX_BET} SOL`;
  }
  if (!req.mockTxSignature) {
    return "Missing transaction signature";
  }
  return null;
}

export async function createFlip(
  req: CreateFlipRequest
): Promise<FlipRecord | { error: string }> {
  const validationError = validateRequest(req);
  if (validationError) return { error: validationError };

  const id = generateId();
  const serverSeed = crypto.randomUUID();
  const serverSeedHash = hashSeed(serverSeed);
  const outcome = randomSide();
  const won = req.side === outcome;
  const houseEdge = getHouseEdge();
  const payout = won ? req.amount * 2 * (1 - houseEdge) : 0;

  const pending: FlipRecord = {
    id,
    wallet: req.wallet,
    side: req.side,
    amount: req.amount,
    outcome,
    won,
    payout,
    status: "pending",
    mockTxSignature: req.mockTxSignature,
    createdAt: new Date().toISOString(),
    fairness: { serverSeedHash },
  };

  store.add(pending);
  pendingSeeds.set(id, serverSeed);

  await delay(CONFIRM_DELAY_MS);

  pendingSeeds.delete(id);

  const confirmed: FlipRecord = {
    ...pending,
    status: "confirmed",
    confirmedAt: new Date().toISOString(),
    fairness: { serverSeedHash, serverSeed },
  };

  store.update(id, confirmed);
  return confirmed;
}

export function getFlip(id: string): FlipRecord | undefined {
  const flip = store.getById(id);
  if (!flip || flip.status !== "pending") return flip;

  const elapsed = Date.now() - new Date(flip.createdAt).getTime();
  if (elapsed >= CONFIRM_DELAY_MS) {
    const serverSeed = pendingSeeds.get(id);
    pendingSeeds.delete(id);
    return store.update(id, {
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
      fairness: {
        serverSeedHash: flip.fairness.serverSeedHash,
        serverSeed,
      },
    });
  }

  return flip;
}

export function getRecentFlips(limit: number): FlipRecord[] {
  return store.getRecent(limit);
}

export function getStats() {
  return store.getStats();
}

export function getWalletStreak(wallet: string) {
  return store.getWalletStreak(wallet);
}

export { MIN_BET, MAX_BET, getHouseEdge };
