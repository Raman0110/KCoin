import React from "react";
import { Blocks } from "lucide-react";

interface MiningOverlayProps {
  progress: number;
}

export default function MiningOverlay({ progress }: MiningOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Mining in progress"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-5 shadow-xl sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center justify-center rounded-full bg-white/5 p-3">
            <Blocks className="h-8 w-8 animate-pulse text-yellow-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-lg font-semibold text-white">Mining Block</h4>
            <p className="text-sm text-white/70">Solving proof-of-work — validating transactions</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-yellow-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/60">
            <span>{progress >= 90 ? "Finalizing" : "Nonce search"}</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 sm:gap-3">
          <Blocks className="h-5 w-5 shrink-0 animate-bounce text-yellow-400 sm:h-6 sm:w-6" />
          <Blocks className="h-5 w-5 shrink-0 animate-bounce text-yellow-400 delay-150 sm:h-6 sm:w-6" />
          <Blocks className="h-5 w-5 shrink-0 animate-bounce text-yellow-400 delay-300 sm:h-6 sm:w-6" />
          <p className="ml-1 text-sm text-white/70 sm:ml-2">
            {progress >= 90 ? "Finalizing block..." : "Mining... please wait"}
          </p>
        </div>
      </div>
    </div>
  );
}
