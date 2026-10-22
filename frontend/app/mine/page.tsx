"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Blocks, LoaderCircle } from "lucide-react";
import Header from "@/components/Header";
import PageState from "@/components/PageState";
import MiningOverlay from "@/components/MiningOverlay";
import toast from "react-hot-toast";
import { blockchainAPI, getErrorMessage, transactionAPI } from "@/lib/api";
import { Transaction } from "@/types";

const MINING_DURATION = 4000;

export default function MinePage() {
  const [isMining, setIsMining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[] | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const getPendingTransactions = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setLoadError(null);
    try {
      const response = await transactionAPI.getPendingTransactions();
      if (response.success) setPendingTransactions(response.pendingTransactions);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void getPendingTransactions();
    return () => {
      if (progressRef.current) window.clearTimeout(progressRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [getPendingTransactions]);

  const startMiningProgress = () => {
    setProgress(0);
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    const start = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(90, Math.round((elapsed / MINING_DURATION) * 90));
      setProgress(pct);
    }, 100);
  };

  const handleMine = async () => {
    if (isMining) return;
    setIsMining(true);
    startMiningProgress();

    const minimumDelay = new Promise((resolve) => {
      progressRef.current = window.setTimeout(resolve, MINING_DURATION);
    });

    try {
      await Promise.all([blockchainAPI.mineBlock(), minimumDelay]);
      setProgress(100);
      toast.success("Block mined successfully! You earned 10 KCoin as a reward.");
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      await getPendingTransactions(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      if (progressRef.current) window.clearTimeout(progressRef.current);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      progressRef.current = null;
      intervalRef.current = null;
      setIsMining(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      <PageState
        loading={isLoading}
        error={loadError}
        loadingMessage="Loading pending transactions — the server may take a moment to wake up..."
        onRetry={() => void getPendingTransactions()}
      />

      {!isLoading && !loadError && pendingTransactions && (
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <section className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-lg sm:p-8">
            <Blocks className={`mx-auto mb-4 h-14 w-14 text-yellow-400 transition-transform sm:h-16 sm:w-16 ${isMining ? "animate-spin" : ""}`} />
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Mine New Block</h2>
            <p className="mx-auto mb-7 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Mine a new block and earn 10 KCoin as a reward. This process validates pending transactions and adds them to the blockchain.
            </p>

            <div className="mb-6 rounded-lg bg-white/5 p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-4 text-left min-[420px]:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-white/60">Pending Transactions</p>
                  <p className="text-2xl font-bold text-white">{pendingTransactions.length}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-white/60">Mining Reward</p>
                  <p className="text-2xl font-bold text-yellow-400">10 KC</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMine}
              disabled={isMining || pendingTransactions.length === 0}
              className="relative z-10 mx-auto flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-3 font-semibold text-gray-900 transition-all hover:from-yellow-500 hover:to-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isMining ? <LoaderCircle className="h-6 w-6 animate-spin" /> : <Blocks className="h-6 w-6" />}
              {isMining ? "Mining in progress..." : pendingTransactions.length === 0 ? "No transactions to mine" : "Start Mining"}
            </button>
          </section>

          <section className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg sm:p-6">
            <h3 className="mb-4 text-xl font-semibold text-white">Pending Transactions</h3>

            {pendingTransactions.length === 0 ? (
              <p className="py-8 text-center text-white/60">No pending transactions</p>
            ) : (
              <div className="space-y-3">
                {pendingTransactions.map((tx) => (
                  <div key={tx.id} className="rounded-lg bg-white/5 p-4">
                    <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <span className="break-all text-sm text-white/60">Transaction ID: {tx.id}</span>
                      <span className="shrink-0 font-semibold text-yellow-400">{tx.amount} KC</span>
                    </div>
                    <div className="space-y-1 break-all text-sm text-white/60">
                      <p>From: {tx.senderAddress}</p>
                      <p>To: {tx.recipientAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {isMining && <MiningOverlay progress={progress} />}
    </div>
  );
}
