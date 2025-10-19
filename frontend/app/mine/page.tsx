"use client"
import React, { useEffect, useRef, useState } from "react";
import { Blocks, Loader } from "lucide-react";
import Header from "@/components/Header";
import toast from "react-hot-toast";
import { blockchainAPI, transactionAPI } from "@/lib/api";
import { Transaction } from "@/types";
import CoinLoader from "@/components/CoinLoader";
import MiningOverlay from "@/components/MiningOverlay";

export default function MinePage() {
  const [isMining, setIsMining] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[] | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const MINING_DURATION = 4000;

  async function getPendingTransactions() {
    try {
      const response = await transactionAPI.getPendingTransactions();
      if (response.success) {
        setPendingTransactions(response.pendingTransactions);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getPendingTransactions();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const startMiningProgress = (duration = MINING_DURATION) => {
    setProgress(0);
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    const start = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100 && intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 100);
  };

  const handleMine = async () => {
    setIsMining(true);
    startMiningProgress(MINING_DURATION);

    const simulatedDelay = new Promise((res) => {
      progressRef.current = window.setTimeout(res, MINING_DURATION);
    });

    try {
      const apiCall = blockchainAPI.mineBlock();

      await Promise.all([apiCall, simulatedDelay]);
      toast.success("Block mined successfully! You earned 10 KCoin as a reward.");
    } catch (error: any) {
      toast.error(error?.message || "Mining failed.");
    } finally {
      setProgress(100);
      await new Promise((r) => setTimeout(r, 300));
      setIsMining(false);
      setProgress(0);

      if (progressRef.current) {
        window.clearTimeout(progressRef.current);
        progressRef.current = null;
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      getPendingTransactions();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      <CoinLoader show={!pendingTransactions} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center relative overflow-hidden">
          {isMining && (
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center gap-6 pointer-events-none opacity-70"
            >
              <Blocks className="w-10 h-10 text-yellow-400 animate-bounce" />
              <Blocks className="w-10 h-10 text-yellow-400 animate-bounce delay-150" />
              <Blocks className="w-10 h-10 text-yellow-400 animate-bounce delay-300" />
            </div>
          )}

          <Blocks
            className={`w-16 h-16 text-yellow-400 mx-auto mb-4 transition-transform ${isMining ? "animate-spin" : ""}`}
          />
          <h2 className="text-3xl font-bold text-white mb-4">Mine New Block</h2>
          <p className="text-white/60 mb-8">
            Mine a new block and earn 10 KCoin as a reward. This process validates pending transactions and adds them to the blockchain.
          </p>

          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-white/60 text-sm mb-1">Pending Transactions</p>
                <p className="text-2xl font-bold text-white">{pendingTransactions?.length ?? "—"}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Mining Reward</p>
                <p className="text-2xl font-bold text-yellow-400">10 KC</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleMine}
            disabled={isMining || pendingTransactions?.length === 0}
            className="cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto relative z-10"
            aria-disabled={isMining}
          >
            {isMining ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Mining in Progress...
              </>
            ) : (
              <>
                <Blocks className="w-6 h-6" />
                Start Mining
              </>
            )}
          </button>

          {isMining && (
            <p className="text-white/60 mt-4 text-sm relative z-10">
              Finding the correct nonce... This may take a few seconds.
            </p>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mt-6 relative z-0">
          <h3 className="text-xl font-semibold text-white mb-4">Pending Transactions</h3>

          {pendingTransactions?.length === 0 ? (
            <p className="text-white/60 text-center py-8">No pending transactions</p>
          ) : (
            <div className="space-y-3">
              {pendingTransactions?.map((tx) => (
                <div key={tx.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Transaction ID: {tx.id}</span>
                    <span className="text-yellow-400 font-semibold">{tx.amount} KC</span>
                  </div>
                  <div className="text-sm text-white/60">
                    <p>From: {tx.senderAddress}</p>
                    <p>To: {tx.recipientAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isMining && <MiningOverlay progress={progress} />}
    </div>
  );
}