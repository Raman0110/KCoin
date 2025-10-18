"use client"
import React, { useEffect, useState } from 'react';
import { Blocks } from 'lucide-react';
import Header from '@/components/Header';
import { blockchainAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Block } from '@/types';
import CoinLoader from '@/components/CoinLoader';

export default function ExplorerPage() {
  const [chain, setChain] = useState<Block[] | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  async function getBlockChain() {
    try {
      const response = await blockchainAPI.getChain();
      setChain(response.chain);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getBlockChain();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      <CoinLoader show={!chain} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Blockchain Explorer</h2>
          <p className="text-white/60">
            Explore the entire KCoin blockchain. Each block contains validated transactions and is cryptographically linked to the previous block.
          </p>
        </div>

        <div className="space-y-4">
          {chain?.map((block) => (
            <div
              key={block.index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 cursor-pointer hover:border-amber-300"
              onClick={() => setSelectedBlock(block)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Blocks className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Block #{block.index}</h3>
                  </div>
                  <p className="text-white/60 text-sm">
                    {new Date(block.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Transactions</p>
                  <p className="text-2xl font-bold text-white">{block.transactions.length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBlock && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full relative">
            <button
              className="cursor-pointer absolute top-3 right-3 text-white text-xl font-bold"
              onClick={() => setSelectedBlock(null)}
            >
              ×
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Block #{selectedBlock.index}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-white/60 mb-4">
                <span>Timestamp:</span>
                <span>{new Date(selectedBlock.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/60 break-all">
                <span className='min-w-[80px]'>Hash:</span>
                <code>{selectedBlock.hash}</code>
              </div>
              <div className="flex justify-between text-white/60 break-all">
                <span>Previous Hash:</span>
                <code>{selectedBlock.previousHash}</code>
              </div>
              {selectedBlock.nonce !== undefined && (
                <div className="flex justify-between text-white/60">
                  <span>Nonce:</span>
                  <span>{selectedBlock.nonce}</span>
                </div>
              )}
            </div>

            {selectedBlock.transactions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-white font-semibold mb-2">Transactions:</h4>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {selectedBlock.transactions.map((tx) => (
                    <div key={tx.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/60 text-sm">
                          {tx.senderAddress === '00' ? 'Mining Reward' : `From: ${tx.senderAddress}`}
                        </span>
                        <span className="text-yellow-400 font-semibold">{tx.amount} KC</span>
                      </div>
                      <p className="text-white/60 text-sm">To: {tx.recipientAddress}</p>
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
