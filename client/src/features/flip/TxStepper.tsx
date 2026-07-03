import { getTxStep, type FlipPhase } from "../../state/flipMachine";

const STEPS = ["Sign", "Submit", "Confirm", "Done"] as const;

interface TxStepperProps {
  phase: FlipPhase;
  error?: string | null;
}

export function TxStepper({ phase, error }: TxStepperProps) {
  const currentStep = getTxStep(phase);

  if (phase === "idle") return null;

  const progressPercent =
    currentStep <= 1 ? 0 : ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between mb-2">
        <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-border -z-0">
          <div
            className="h-full bg-purple transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {STEPS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = currentStep === stepNum;
          const isDone = currentStep > stepNum;
          const isFailed = phase === "failed" && isActive;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center flex-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  isFailed
                    ? "border-red bg-red/20 text-red"
                    : isDone
                      ? "border-green bg-green/20 text-green step-pop"
                      : isActive
                        ? "border-purple bg-purple/20 text-purple-light step-active-pulse"
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
