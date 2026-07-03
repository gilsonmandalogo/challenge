import { useMemo } from "react";

const COLORS = ["#fbbf24", "#22c55e", "#f472b6", "#22d3ee", "#a78bfa", "#fb923c"];

interface ConfettiPiece {
  id: number;
  tx: number;
  ty: number;
  rot: number;
  delay: number;
  color: string;
  width: number;
  height: number;
  round: boolean;
}

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = 60 + Math.random() * 80;
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance - 20,
      rot: Math.random() * 720 - 360,
      delay: Math.random() * 0.3,
      color: COLORS[i % COLORS.length],
      width: 4 + Math.random() * 6,
      height: Math.random() > 0.5 ? 4 + Math.random() * 6 : 2 + Math.random() * 3,
      round: Math.random() > 0.6,
    };
  });
}

export function WinConfetti() {
  const pieces = useMemo(() => generatePieces(36), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-burst absolute left-1/2 top-1/2"
          style={{
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            borderRadius: piece.round ? "50%" : "2px",
            ["--tx" as string]: `${piece.tx}px`,
            ["--ty" as string]: `${piece.ty}px`,
            ["--rot" as string]: `${piece.rot}deg`,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
