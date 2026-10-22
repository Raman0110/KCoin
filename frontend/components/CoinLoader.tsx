import React from "react";
import { Coins } from "lucide-react";

interface CoinLoaderProps {
  show: boolean;
  label?: string;
}

export default function CoinLoader({ show, label = "Loading KCoin..." }: CoinLoaderProps) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-4 text-center backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <Coins className="w-20 h-20 text-yellow-400 animate-spin-slow" />
      <p className="mt-4 text-yellow-300 text-lg font-semibold animate-pulse">
        {label}
      </p>
    </div>
  );
}
