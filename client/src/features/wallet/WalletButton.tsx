import { useWalletStore } from "../../state/walletStore";
import { truncateAddress } from "../../lib/mockTx";

export function WalletButton() {
  const { connected, connecting, address, balance, connect, disconnect } =
    useWalletStore();

  if (connected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs text-slate-400">Balance</span>
          <span className="text-sm font-semibold text-purple-light">
            {balance.toFixed(4)} SOL
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-surface-2 border border-border px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
          <span className="text-sm font-medium">{truncateAddress(address)}</span>
          <button
            onClick={disconnect}
            className="ml-1 text-xs text-slate-400 hover:text-red hover:underline transition-colors active:scale-95"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="btn-primary rounded-full px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
