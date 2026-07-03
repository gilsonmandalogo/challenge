import type { FlipRecord, FlipSide } from "@shared/types";

export type FlipPhase =
  | "idle"
  | "signing"
  | "pending"
  | "confirming"
  | "settled"
  | "failed";

export interface FlipContext {
  phase: FlipPhase;
  side: FlipSide | null;
  amount: number;
  flipId: string | null;
  result: FlipRecord | null;
  error: string | null;
  mockTxSignature: string | null;
}

export type FlipAction =
  | { type: "START"; side: FlipSide; amount: number }
  | { type: "SIGNED"; mockTxSignature: string }
  | { type: "SUBMITTED"; flipId: string }
  | { type: "CONFIRMING" }
  | { type: "SETTLED"; result: FlipRecord }
  | { type: "FAILED"; error: string }
  | { type: "RESET" };

export const initialFlipContext: FlipContext = {
  phase: "idle",
  side: null,
  amount: 0,
  flipId: null,
  result: null,
  error: null,
  mockTxSignature: null,
};

export function flipReducer(state: FlipContext, action: FlipAction): FlipContext {
  switch (action.type) {
    case "START":
      return {
        ...initialFlipContext,
        phase: "signing",
        side: action.side,
        amount: action.amount,
      };
    case "SIGNED":
      return { ...state, phase: "pending", mockTxSignature: action.mockTxSignature };
    case "SUBMITTED":
      return { ...state, phase: "confirming", flipId: action.flipId };
    case "CONFIRMING":
      return { ...state, phase: "confirming" };
    case "SETTLED":
      return { ...state, phase: "settled", result: action.result };
    case "FAILED":
      return { ...state, phase: "failed", error: action.error };
    case "RESET":
      return initialFlipContext;
    default:
      return state;
  }
}

export function getTxStep(phase: FlipPhase): number {
  switch (phase) {
    case "idle":
      return 0;
    case "signing":
      return 1;
    case "pending":
      return 2;
    case "confirming":
      return 3;
    case "settled":
    case "failed":
      return 4;
    default:
      return 0;
  }
}
