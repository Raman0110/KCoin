"use client"

import React, { useCallback, useEffect, useState } from "react";
import { Blocks } from "lucide-react";
import Header from "@/components/Header";
import PageState from "@/components/PageState";
import { blockchainAPI, getErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";
import { Block } from "@/types";

export default function ExplorerPage() {
  const [chain, setChain] = useState<Block[] | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const getBlockChain = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await blockchainAPI.getChain();
      setChain(response.chain);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void getBlockChain();
  }, [getBlockChain]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      <PageState
        loading={isLoading}
        error={loadError}
        loadingMessage="Loading the blockchain — the server may take a moment to wake up..."
        onRetry={() => void getBlockChain()}
      />

      {!isLoading && !loadError && chain && (
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <section className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg sm:p-6">
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">Blockchain Explorer</h2>
            <p className="text-white/60">
              Explore the entire KCoin blockchain. Each block contains validated transactions and is cryptographically linked to the previous block.
            </p>
          </section>

          <div className="space-y-4">
            {chain.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                No blocks have been mined yet.
              </div>
            )}
            {chain.map((block) => (
              <button
                type="button"
                key={block.index}
                className="w-full cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-5 text-left backdrop-blur-lg transition-colors hover:border-amber-300 sm:p-6"
                onClick={() => setSelectedBlock(block)}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <Blocks className="h-5 w-5 shrink-0 text-yellow-400" />
                      <h3 className="text-xl font-bold text-white">Block #{block.index}</h3>
                    </div>
                    <p className="text-sm text-white/60">{new Date(block.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-white/60">Transactions</p>
                    <p className="text-2xl font-bold text-white">{block.transactions.length}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      )}

      {selectedBlock && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Block ${selectedBlock.index} details`}
        >
          <div className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-gray-900 p-5 sm:p-6">
            <button
              type="button"
              aria-label="Close block details"
              className="absolute right-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-2xl font-bold text-white hover:bg-white/10"
              onClick={() => setSelectedBlock(null)}
            >
              ×
            </button>

            <h3 className="mb-4 pr-12 text-xl font-bold text-white">Block #{selectedBlock.index}</h3>
            <div className="space-y-3">
              <div className="mb-4 flex flex-col gap-1 text-white/60 sm:flex-row sm:justify-between">
                <span>Timestamp:</span>
                <span>{new Date(selectedBlock.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1 break-all text-white/60 sm:flex-row sm:justify-between sm:gap-4">
                <span className="min-w-[80px]">Hash:</span>
                <code className="text-left sm:text-right">{selectedBlock.hash}</code>
              </div>
              <div className="flex flex-col gap-1 break-all text-white/60 sm:flex-row sm:justify-between sm:gap-4">
                <span>Previous Hash:</span>
                <code className="text-left sm:text-right">{selectedBlock.previousHash}</code>
              </div>
              {selectedBlock.nonce !== undefined && (
                <div className="flex justify-between text-white/60">
                  <span>Nonce:</span>
                  <span>{selectedBlock.nonce}</span>
                </div>
              )}
            </div>

            {selectedBlock.transactions.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-2 font-semibold text-white">Transactions:</h4>
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {selectedBlock.transactions.map((tx) => (
                    <div key={tx.id} className="rounded-lg bg-white/5 p-3">
                      <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <span className="break-all text-sm text-white/60">
                          {tx.senderAddress === "00" ? "Mining Reward" : `From: ${tx.senderAddress}`}
                        </span>
                        <span className="shrink-0 font-semibold text-yellow-400">{tx.amount} KC</span>
                      </div>
                      <p className="break-all text-sm text-white/60">To: {tx.recipientAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
