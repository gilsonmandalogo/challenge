import type { FlipPhase } from "../../state/flipMachine";
import type { FlipSide } from "../../types";

interface CoinDisplayProps {
  phase: FlipPhase;
  selectedSide: FlipSide | null;
  outcome?: FlipSide | null;
}

export function CoinDisplay({ phase, selectedSide, outcome }: CoinDisplayProps) {
  const isSpinning = phase === "signing" || phase === "pending" || phase === "confirming";
  const showOutcome = phase === "settled" && outcome;

  const displaySide = showOutcome ? outcome : selectedSide;
  const isHeads = displaySide === "heads";

  return (
    <div className="relative flex items-center justify-center py-6">
      <div
        className={`relative h-36 w-36 rounded-full border-4 flex items-center justify-center text-5xl font-bold transition-all duration-500 ${
          isSpinning ? "coin-spinning border-purple-light glow-purple" : "border-purple"
        } ${showOutcome ? (outcome === selectedSide ? "border-green glow-purple" : "border-red") : ""}`}
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
      {showOutcome && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece absolute h-2 w-2 rounded-sm"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: "30%",
                backgroundColor: ["#7c3aed", "#22c55e", "#eab308", "#a78bfa"][i % 4],
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
