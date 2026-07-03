import { create } from "zustand";
import { generateMockPubkey } from "../lib/mockTx";

const INITIAL_BALANCE = 10;

interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: number;
  connect: () => Promise<void>;
  disconnect: () => void;
  deductBet: (amount: number) => void;
  creditPayout: (amount: number) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  connected: false,
  connecting: false,
  address: null,
  balance: INITIAL_BALANCE,

  connect: async () => {
    set({ connecting: true });
    await new Promise((r) => setTimeout(r, 800));
    set({
      connected: true,
      connecting: false,
      address: generateMockPubkey(),
      balance: INITIAL_BALANCE,
    });
  },

  disconnect: () => {
    set({
      connected: false,
      connecting: false,
      address: null,
      balance: INITIAL_BALANCE,
    });
  },

  deductBet: (amount: number) => {
    const { balance } = get();
    set({ balance: Math.max(0, balance - amount) });
  },

  creditPayout: (amount: number) => {
    const { balance } = get();
    set({ balance: balance + amount });
  },
}));
