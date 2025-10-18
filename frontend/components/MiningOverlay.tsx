import React from "react";
import { Blocks } from "lucide-react";

interface MiningOverlayProps {
  progress: number;
}

export default function MiningOverlay({ progress }: MiningOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Mining in progress"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md mx-4 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white/5 flex items-center justify-center">
            <Blocks className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white">Mining Block</h4>
            <p className="text-sm text-white/70">Solving proof-of-work — validating transactions</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-yellow-400 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-white/60">
            <span>Nonce search</span>
            <span>{progress}%</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Blocks className="w-6 h-6 text-yellow-400 animate-bounce" />
          <Blocks className="w-6 h-6 text-yellow-400 animate-bounce delay-150" />
          <Blocks className="w-6 h-6 text-yellow-400 animate-bounce delay-300" />
          <p className="ml-2 text-sm text-white/70">Mining... please wait</p>
        </div>
      </div>
    </div>
  );
}