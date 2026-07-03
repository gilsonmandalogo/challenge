import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { truncateAddress } from "../../lib/mockTx";
import { useWalletStore } from "../../state/walletStore";

export function ActivityPanel() {
  const { address } = useWalletStore();

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ["recentFlips"],
    queryFn: () => api.getRecentFlips(20),
    refetchInterval: 5000,
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.getStats(),
    refetchInterval: 5000,
  });

  const sessionFlips = recentData?.flips.filter((f) => f.wallet === address) ?? [];
  const sessionPnL = sessionFlips.reduce(
    (sum, f) => sum + (f.won ? f.payout - f.amount : -f.amount),
    0
  );

  let currentStreak = 0;
  let streakType: "win" | "loss" | "none" = "none";
  for (let i = sessionFlips.length - 1; i >= 0; i--) {
    const flip = sessionFlips[i];
    if (streakType === "none") {
      streakType = flip.won ? "win" : "loss";
      currentStreak = 1;
    } else if (
      (streakType === "win" && flip.won) ||
      (streakType === "loss" && !flip.won)
    ) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Flips" value={String(stats?.totalFlips ?? 0)} />
        <StatCard
          label="Biggest Win"
          value={`${(stats?.biggestWin ?? 0).toFixed(2)} SOL`}
        />
        <StatCard label="Top Streak" value={String(stats?.topStreak ?? 0)} />
        <StatCard
          label="Session P&L"
          value={`${sessionPnL >= 0 ? "+" : ""}${sessionPnL.toFixed(4)} SOL`}
          highlight={sessionPnL >= 0 ? "green" : "red"}
        />
      </div>

      {address && currentStreak > 0 && (
        <div className="rounded-lg bg-surface-2 border border-border px-4 py-2 text-sm">
          Your streak:{" "}
          <span className={streakType === "win" ? "text-green font-semibold" : "text-red font-semibold"}>
            {currentStreak} {streakType === "win" ? "wins" : "losses"}
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Plays</h3>
        {recentLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-surface-2 animate-pulse" />
            ))}
          </div>
        ) : recentData?.flips.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No flips yet — be the first!</p>
        ) : (
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {recentData?.flips.map((flip) => (
              <div
                key={flip.id}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  flip.wallet === address ? "bg-purple/10 border border-purple/20" : "bg-surface-2"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${flip.won ? "bg-green" : "bg-red"}`}
                  />
                  <span className="text-slate-400 font-mono text-xs">
                    {truncateAddress(flip.wallet, 3)}
                  </span>
                  <span className="text-slate-500 capitalize">{flip.side}</span>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${flip.won ? "text-green" : "text-red"}`}>
                    {flip.won ? "+" : "-"}
                    {flip.won ? flip.payout.toFixed(3) : flip.amount.toFixed(3)} SOL
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "green" | "red";
}) {
  return (
    <div className="rounded-xl bg-surface-2 border border-border px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`text-lg font-bold mt-0.5 ${
          highlight === "green"
            ? "text-green"
            : highlight === "red"
              ? "text-red"
              : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
