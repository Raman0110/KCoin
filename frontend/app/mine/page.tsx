"use client"
import React, { useState } from 'react';
import { Blocks, Loader } from 'lucide-react';
import Header from '@/components/Header';

// Mock pending transactions
const mockPendingTransactions = [
  {
    id: 'tx-pending-1',
    senderAddress: 'KC-x9y8z7w6v5u4',
    recipientAddress: 'KC-m1n2o3p4q5r6',
    amount: 5.5,
    timestamp: '2025-10-15T08:45:00Z'
  }
];

export default function MinePage() {
  const [isMining, setIsMining] = useState(false);

  const handleMine = () => {
    setIsMining(true);
    // TODO: Connect to POST /mine endpoint
    // Simulate mining delay
    setTimeout(() => {
      setIsMining(false);
      alert('Block mined successfully! You earned 10 KCoin as a reward.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <Blocks className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Mine New Block</h2>
          <p className="text-white/60 mb-8">
            Mine a new block and earn 10 KCoin as a reward. This process validates pending transactions and adds them to the blockchain.
          </p>

          <div className="bg-white/5 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-white/60 text-sm mb-1">Pending Transactions</p>
                <p className="text-2xl font-bold text-white">{mockPendingTransactions.length}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Mining Reward</p>
                <p className="text-2xl font-bold text-yellow-400">10 KC</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleMine}
            disabled={isMining}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold px-8 py-4 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
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
            <p className="text-white/60 mt-4 text-sm">
              Finding the correct nonce... This may take a moment.
            </p>
          )}
        </div>

        {/* Pending Transactions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Pending Transactions</h3>

          {mockPendingTransactions.length === 0 ? (
            <p className="text-white/60 text-center py-8">No pending transactions</p>
          ) : (
            <div className="space-y-3">
              {mockPendingTransactions.map((tx) => (
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
    </div>
  );
}