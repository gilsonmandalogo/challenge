import { useState } from "react";
import type { FlipRecord } from "@shared/types";

interface FairnessDrawerProps {
  result: FlipRecord | null;
}

export function FairnessDrawer({ result }: FairnessDrawerProps) {
  const [open, setOpen] = useState(false);

  if (!result) return null;

  return (
    <div className="mt-4 border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-2 hover:bg-surface text-sm text-left transition-colors"
      >
        <span className="text-slate-300">Provably Fair (Demo)</span>
        <span className="text-slate-500">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-surface text-xs space-y-2 font-mono">
          <div>
            <span className="text-slate-500">Server Seed Hash: </span>
            <span className="text-purple-light break-all">
              {result.fairness.serverSeedHash}
            </span>
          </div>
          {result.fairness.serverSeed && (
            <div>
              <span className="text-slate-500">Server Seed (revealed): </span>
              <span className="text-green break-all">{result.fairness.serverSeed}</span>
            </div>
          )}
          <div>
            <span className="text-slate-500">Tx Signature: </span>
            <span className="text-slate-400 break-all">{result.mockTxSignature.slice(0, 32)}...</span>
          </div>
          <p className="text-slate-500 pt-1">
            Demo only — production would use on-chain VRF (e.g. Chainlink) for verifiable randomness.
          </p>
        </div>
      )}
    </div>
  );
}
