"use client"
import React, { useState } from 'react';
import { Wallet, TrendingUp, ArrowRight, Copy, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';

// Mock data
const mockUser = {
  address: 'KC-a1b2c3d4e5f6',
  balance: 125.5
};

const mockStats = {
  totalBlocks: 3,
  pendingTransactions: 1,
  miningReward: 10
};

export default function DashboardPage() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [sendForm, setSendForm] = useState({ recipientAddress: '', amount: '' });

  const copyAddress = () => {
    navigator.clipboard.writeText(mockUser.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSendTransaction = () => {
    if (sendForm.recipientAddress && sendForm.amount) {
      // TODO: Connect to POST /transactions endpoint
      alert(`Transaction initiated: ${sendForm.amount} KCoin to ${sendForm.recipientAddress}`);
      setSendForm({ recipientAddress: '', amount: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Wallet Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <Wallet className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Your Wallet</h2>
            </div>

            <div className="mb-4">
              <p className="text-white/60 text-sm mb-2">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-white bg-white/5 px-3 py-2 rounded-lg flex-1 text-sm">
                  {mockUser.address}
                </code>
                <button
                  onClick={copyAddress}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copiedAddress ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/60" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-2">Balance</p>
              <p className="text-4xl font-bold text-yellow-400">{mockUser.balance} KC</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Network Stats</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-sm">Total Blocks</p>
                <p className="text-2xl font-bold text-white">{mockStats.totalBlocks}</p>
              </div>

              <div>
                <p className="text-white/60 text-sm">Pending Transactions</p>
                <p className="text-2xl font-bold text-white">{mockStats.pendingTransactions}</p>
              </div>

              <div>
                <p className="text-white/60 text-sm">Mining Reward</p>
                <p className="text-2xl font-bold text-yellow-400">{mockStats.miningReward} KC</p>
              </div>
            </div>
          </div>
        </div>

        {/* Send Transaction */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Send KCoin</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Recipient Address</label>
              <input
                type="text"
                value={sendForm.recipientAddress}
                onChange={(e) => setSendForm({ ...sendForm, recipientAddress: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                placeholder="KC-xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Amount (KC)</label>
              <input
                type="number"
                step="0.01"
                value={sendForm.amount}
                onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400"
                placeholder="0.00"
              />
            </div>

            <button
              onClick={handleSendTransaction}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Send Transaction
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}