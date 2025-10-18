"use client";
import React, { useEffect, useState } from "react";
import { Coins } from "lucide-react";

interface CoinLoaderProps {
  show: boolean;
  minDuration?: number;
}

export default function CoinLoader({ show, minDuration = 400 }: CoinLoaderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (show) {
      setVisible(true);
    } else {
      timeout = setTimeout(() => setVisible(false), minDuration);
    }

    return () => clearTimeout(timeout);
  }, [show, minDuration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity">
      <Coins className="w-20 h-20 text-yellow-400 animate-spin-slow" />
      <p className="mt-4 text-yellow-300 text-lg font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
}
