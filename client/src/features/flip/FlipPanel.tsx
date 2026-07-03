import { useReducer, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FlipSide } from "../../types";
import { api } from "../../lib/api";
import { simulateSigning } from "../../lib/mockTx";
import { useWalletStore } from "../../state/walletStore";
import {
  flipReducer,
  initialFlipContext,
} from "../../state/flipMachine";
import { CoinDisplay } from "./CoinDisplay";
import { TxStepper } from "./TxStepper";
import { FairnessDrawer } from "./FairnessDrawer";

const MIN_BET = 0.01;

export function FlipPanel() {
  const queryClient = useQueryClient();
  const { connected, address, balance, deductBet, creditPayout } = useWalletStore();
  const [ctx, dispatch] = useReducer(flipReducer, initialFlipContext);

  const [selectedSide, setSelectedSide] = useState<FlipSide>("heads");
  const [betAmount, setBetAmount] = useState("0.1");

  const amount = parseFloat(betAmount);
  const isValidBet =
    connected &&
    Number.isFinite(amount) &&
    amount >= MIN_BET &&
    amount <= balance;
  const isBusy = ctx.phase !== "idle" && ctx.phase !== "settled" && ctx.phase !== "failed";

  const handleFlip = useCallback(async () => {
    if (!address || !isValidBet) return;

    dispatch({ type: "START", side: selectedSide, amount });

    try {
      deductBet(amount);

      const mockTxSignature = await simulateSigning();
      dispatch({ type: "SIGNED", mockTxSignature });

      dispatch({ type: "SUBMITTED", flipId: "pending" });
      dispatch({ type: "CONFIRMING" });

      const result = await api.createFlip({
        wallet: address,
        side: selectedSide,
        amount,
        mockTxSignature,
      });

      if (result.status === "confirmed") {
        if (result.won) {
          creditPayout(result.payout);
        }
        dispatch({ type: "SETTLED", result });
        queryClient.invalidateQueries({ queryKey: ["recentFlips"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      } else {
        dispatch({ type: "FAILED", error: "Transaction failed on-chain" });
      }
    } catch (err) {
      creditPayout(amount);
      dispatch({
        type: "FAILED",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [
    address,
    isValidBet,
    selectedSide,
    amount,
    deductBet,
    creditPayout,
    queryClient,
  ]);

  const handleReset = () => dispatch({ type: "RESET" });

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 glow-purple">
      <h2 className="text-xl font-bold gradient-text mb-1">Coin Flip</h2>
      <p className="text-sm text-slate-400 mb-6">Double or nothing — 50/50 odds</p>

      <CoinDisplay
        phase={ctx.phase}
        selectedSide={selectedSide}
        outcome={ctx.result?.outcome ?? null}
      />

      {ctx.phase === "settled" && ctx.result && (
        <div
          className={`text-center mb-4 p-3 rounded-lg ${
            ctx.result.won ? "bg-green/10 border border-green/30" : "bg-red/10 border border-red/30"
          }`}
        >
          <p className={`text-lg font-bold ${ctx.result.won ? "text-green" : "text-red"}`}>
            {ctx.result.won ? "You Won!" : "You Lost"}
          </p>
          <p className="text-sm text-slate-300">
            {ctx.result.won
              ? `+${ctx.result.payout.toFixed(4)} SOL`
              : `-${ctx.result.amount.toFixed(4)} SOL`}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Outcome: {ctx.result.outcome}
          </p>
        </div>
      )}

      <TxStepper phase={ctx.phase} error={ctx.error} />

      {ctx.phase === "settled" || ctx.phase === "failed" ? (
        <button
          onClick={handleReset}
          className="w-full mt-4 rounded-xl bg-purple py-3 font-semibold text-white hover:bg-purple-light transition-colors"
        >
          Flip Again
        </button>
      ) : (
        <>
          <div className="flex gap-3 mt-6">
            {(["heads", "tails"] as FlipSide[]).map((side) => (
              <button
                key={side}
                onClick={() => setSelectedSide(side)}
                disabled={isBusy}
                className={`flex-1 rounded-xl py-3 font-semibold capitalize transition-all border-2 ${
                  selectedSide === side
                    ? "border-purple bg-purple/20 text-purple-light"
                    : "border-border bg-surface-2 text-slate-400 hover:border-slate-500"
                } disabled:opacity-50`}
              >
                {side}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs text-slate-400 mb-1 block">Bet Amount (SOL)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={MIN_BET}
                step="0.01"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                disabled={isBusy || !connected}
                className="flex-1 rounded-lg bg-surface-2 border border-border px-4 py-2.5 text-white focus:outline-none focus:border-purple disabled:opacity-50"
              />
              {[0.1, 0.5, 1].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setBetAmount(String(preset))}
                  disabled={isBusy || !connected}
                  className="rounded-lg bg-surface-2 border border-border px-3 py-2 text-xs text-slate-400 hover:text-white hover:border-purple transition-colors disabled:opacity-50"
                >
                  {preset}
                </button>
              ))}
            </div>
            {!connected && (
              <p className="text-xs text-yellow mt-2">Connect wallet to play</p>
            )}
            {connected && amount > balance && (
              <p className="text-xs text-red mt-2">Insufficient balance</p>
            )}
          </div>

          <button
            onClick={handleFlip}
            disabled={!isValidBet || isBusy}
            className="w-full mt-6 rounded-xl bg-purple py-3.5 font-bold text-white text-lg hover:bg-purple-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isBusy
              ? ctx.phase === "signing"
                ? "Approve in wallet..."
                : ctx.phase === "pending"
                  ? "Submitting..."
                  : "Confirming..."
              : `Flip ${selectedSide}`}
          </button>
        </>
      )}

      <FairnessDrawer result={ctx.result} />
    </div>
  );
}
