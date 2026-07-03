import { getTxStep, type FlipPhase } from "../../state/flipMachine";

const STEPS = ["Sign", "Submit", "Confirm", "Done"] as const;

interface TxStepperProps {
  phase: FlipPhase;
  error?: string | null;
}

export function TxStepper({ phase, error }: TxStepperProps) {
  const currentStep = getTxStep(phase);

  if (phase === "idle") return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          const isFailed = phase === "failed" && isActive;

          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isFailed
                    ? "border-red bg-red/20 text-red"
                    : isDone
                      ? "border-green bg-green/20 text-green"
                      : isActive
                        ? "border-purple bg-purple/20 text-purple-light"
                        : "border-border bg-surface-2 text-slate-500"
                }`}
              >
                {isDone ? "✓" : isFailed ? "✕" : stepNum}
              </div>
              <span
                className={`mt-1 text-xs ${
                  isActive || isDone ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-center text-sm text-red mt-2">{error}</p>
      )}
    </div>
  );
}
