import type { FlipPhase } from "../../state/flipMachine";
import type { FlipSide } from "../../types";
import { WinConfetti } from "./WinConfetti";

interface CoinDisplayProps {
  phase: FlipPhase;
  selectedSide: FlipSide | null;
  outcome?: FlipSide | null;
  won?: boolean;
}

export function CoinDisplay({ phase, selectedSide, outcome, won }: CoinDisplayProps) {
  const isSpinning = phase === "signing" || phase === "pending" || phase === "confirming";
  const showOutcome = phase === "settled" && outcome;
  const showConfetti = showOutcome && won === true;
  const isLoss = showOutcome && won === false;

  const displaySide = showOutcome ? outcome : selectedSide;
  const isHeads = displaySide === "heads";

  return (
    <div className="relative flex items-center justify-center py-6">
      <div
        className={`relative h-36 w-36 rounded-full border-4 flex items-center justify-center text-5xl font-bold transition-all duration-500 ${
          isSpinning ? "coin-spinning border-purple-light glow-purple" : "border-purple"
        } ${showOutcome ? (won ? "border-green glow-purple" : "border-red") : ""} ${
          showOutcome ? "coin-land" : ""
        } ${isLoss ? "coin-shake" : ""}`}
        style={{
          background: "linear-gradient(145deg, #1a1a26 0%, #2a2a3d 50%, #1a1a26 100%)",
        }}
      >
        {displaySide ? (
          <span className={isHeads ? "text-yellow" : "text-purple-light"}>
            {isHeads ? "H" : "T"}
          </span>
        ) : (
          <span className="text-slate-500 text-3xl">?</span>
        )}
      </div>
      {showConfetti && <WinConfetti />}
    </div>
  );
}
