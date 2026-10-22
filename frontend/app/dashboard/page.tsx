"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { Wallet, TrendingUp, ArrowRight, Copy, CheckCircle, LoaderCircle } from 'lucide-react';
import Header from '@/components/Header';
import { authAPI, getErrorMessage, transactionAPI, walletAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { DashboardStat, UserWallet } from '@/types';
import PageState from '@/components/PageState';


export default function DashboardPage() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [sendForm, setSendForm] = useState({ recipientAddress: '', amount: '' });
  const [walletDetail, setWalletDetail] = useState<UserWallet | null>(null);
  const [dashboardDetail, setDashboardDetail] = useState<DashboardStat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const copyAddress = async () => {
    if (!walletDetail?.walletAddress) return;
    try {
      await navigator.clipboard.writeText(walletDetail.walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      toast.error("Unable to copy the wallet address");
    }
  };

  const loadDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setLoadError(null);

    try {
      const [userDetail, stats] = await Promise.all([
        walletAPI.getWallet(),
        authAPI.getDashboardData(),
      ]);
      setWalletDetail(userDetail);
      setDashboardDetail(stats);
    } catch (error: unknown) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleSendTransaction() {
    if (isSending) return;

    if (!sendForm.recipientAddress || !sendForm.amount) {
      toast.error("Enter wallet address and amount")
      return;
    }

    setIsSending(true);
    try {
      if (sendForm.recipientAddress === walletDetail?.walletAddress) {
        throw new Error("You cannot send KCoin to your own wallet address")
      }
      const response = await transactionAPI.createTransaction({ recipientAddress: sendForm.recipientAddress, amount: Number(sendForm.amount) });
      if (response.success) {
        toast.success(response.message)
        setSendForm({ recipientAddress: '', amount: '' })
        await loadDashboard(false);
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <Header />
      <PageState
        loading={isLoading}
        error={loadError}
        loadingMessage="Loading your wallet — the server may take a moment to wake up..."
        onRetry={() => void loadDashboard()}
      />
      {!isLoading && !loadError && walletDetail && dashboardDetail && (
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Wallet Info */}
          <section className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg sm:p-6">
            <div className="flex items-center mb-4">
              <Wallet className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Your Wallet</h2>
            </div>

            <div className="mb-4">
              <p className="text-white/60 text-sm mb-2">Wallet Address</p>
              <div className="flex min-w-0 items-center gap-2">
                <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white/5 px-3 py-2 text-sm text-white" title={walletDetail.walletAddress}>
                  {walletDetail?.walletAddress}
                </code>
                <button
                  type="button"
                  onClick={copyAddress}
                  aria-label="Copy wallet address"
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10"
                >
                  {copiedAddress ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/60 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-2">Balance</p>
              <p className="text-4xl font-bold text-yellow-400">{walletDetail?.balance} KC</p>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg sm:p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
              <h2 className="text-xl font-semibold text-white">Network Stats</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-white/60 text-sm">Total Blocks</p>
                <p className="text-2xl font-bold text-white">{dashboardDetail?.totalBlocks}</p>
              </div>

              <div>
                <p className="text-white/60 text-sm">Pending Transactions</p>
                <p className="text-2xl font-bold text-white">{dashboardDetail?.totalPendingTransaction}</p>
              </div>

              <div>
                <p className="text-white/60 text-sm">Mining Reward</p>
                <p className="text-2xl font-bold text-yellow-400">10 KC</p>
              </div>
            </div>
          </section>
        </div>

        {/* Send Transaction */}
        <section className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg sm:p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Send KCoin</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Recipient Address</label>
              <input
                type="text"
                value={sendForm.recipientAddress}
                onChange={(e) => setSendForm({ ...sendForm, recipientAddress: e.target.value })}
                disabled={isSending}
                autoComplete="off"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-yellow-400 focus:outline-none disabled:opacity-60"
                placeholder="KC-xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Amount (KC)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={sendForm.amount}
                onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
                placeholder="0.00"
                disabled={isSending}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-yellow-400 focus:outline-none disabled:opacity-60"
              />
            </div>

            <button
              disabled={isSending}
              onClick={handleSendTransaction}
              className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 font-semibold text-gray-900 transition-all hover:from-yellow-500 hover:to-yellow-600 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            >
              {isSending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {isSending ? "Sending..." : "Send Transaction"}
            </button>
          </div>
        </section>
      </main>
      )}
    </div>
  );
}
