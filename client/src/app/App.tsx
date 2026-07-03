import { WalletButton } from "../features/wallet/WalletButton";
import { FlipPanel } from "../features/flip/FlipPanel";
import { ActivityPanel } from "../features/activity/ActivityPanel";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-purple flex items-center justify-center text-lg font-bold">
              ◎
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text leading-tight">Degen Flip</h1>
              <p className="text-xs text-slate-500">Improved Coin Flip Demo</p>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <FlipPanel />
          </div>
          <div className="lg:col-span-2">
            <ActivityPanel />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-surface mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Demo only — no real SOL or funds are used. This is a portfolio project inspired by{" "}
            <a
              href="https://degencoinflip.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-light hover:underline"
            >
              Degen Coin Flip
            </a>
            . Gamble responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
