export type FlipSide = "heads" | "tails";
export type FlipStatus = "pending" | "confirmed" | "failed";
export type CreateFlipRequest = {
    wallet: string;
    side: FlipSide;
    amount: number;
    mockTxSignature: string;
};
export type CreateFlipResponse = {
    id: string;
    status: FlipStatus;
};
export type FlipRecord = {
    id: string;
    wallet: string;
    side: FlipSide;
    amount: number;
    outcome: FlipSide;
    won: boolean;
    payout: number;
    status: FlipStatus;
    mockTxSignature: string;
    createdAt: string;
    confirmedAt?: string;
    fairness: {
        serverSeedHash: string;
        serverSeed?: string;
    };
};
export type RecentFlipsResponse = {
    flips: FlipRecord[];
};
export type StatsResponse = {
    totalFlips: number;
    biggestWin: number;
    topStreak: number;
    totalVolume: number;
};
export type ApiError = {
    error: string;
    code?: string;
};
