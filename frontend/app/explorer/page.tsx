"use client"
import React from 'react';
import { Blocks } from 'lucide-react';
import Header from '@/components/Header';

// Mock blockchain data
const mockBlockchain = [
  {
    index: 0,
    timestamp: '2025-01-01T00:00:00Z',
    transactions: [],
    previousHash: '0',
    hash: '000abc123def456',
    nonce: 0
  },
  {
    index: 1,
    timestamp: '2025-01-15T10:30:00Z',
    transactions: [
      {
        id: 'tx1',
        senderAddress: '00',
        recipientAddress: 'KC-a1b2c3d4e5f6',
        amount: 10,
        timestamp: '2025-01-15T10:30:00Z'
      }
    ],
    previousHash: '000abc123def456',
    hash: '000def789ghi012',
    nonce: 12543
  },
  {
    index: 2,
    timestamp: '2025-02-01T14:20:00Z',
    transactions: [
      {
        id: 'tx2',
        senderAddress: 'KC-a1b2c3d4e5f6',
        recipientAddress: 'KC-x9y8z7w6v5u4',
        amount: 25.5,
        timestamp: '2025-02-01T14:15:00Z'
      },
      {
        id: 'tx3',
        senderAddress: '00',
        recipientAddress: 'KC-m1n2o3p4q5r6',
        amount: 10,
        timestamp: '2025-02-01T14:20:00Z'
      }
    ],
    previousHash: '000def789ghi012',
    hash: '000jkl345mno678',
    nonce: 45231
  }
];

export default function ExplorerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Blockchain Explorer</h2>
          <p className="text-white/60">
            Explore the entire KCoin blockchain. Each block contains validated transactions and is cryptographically linked to the previous block.
          </p>
        </div>

        <div className="space-y-4">
          {mockBlockchain.map((block) => (
            <div key={block.index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
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

              <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-white/60 text-sm min-w-32">Hash:</span>
                  <code className="text-white text-sm break-all">{block.hash}</code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-white/60 text-sm min-w-32">Previous Hash:</span>
                  <code className="text-white text-sm break-all">{block.previousHash}</code>
                </div>
                {block.nonce !== undefined && (
                  <div className="flex items-start gap-2">
                    <span className="text-white/60 text-sm min-w-32">Nonce:</span>
                    <code className="text-white text-sm">{block.nonce}</code>
                  </div>
                )}
              </div>

              {block.transactions.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Transactions:</h4>
                  <div className="space-y-2">
                    {block.transactions.map((tx) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}