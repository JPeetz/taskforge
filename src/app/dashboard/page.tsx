"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wallet, Task, TrendingUp, Shield, StarBadge, Clock, Code, Coins, ArrowRight, CheckCircle, Forge } from "@/components/icons";

export default function DashboardPage() {
  const [walletConnected] = useState(true); // Mock state for demo

  // Mock data
  const stats = {
    activeTasks: 3,
    completedTasks: 47,
    totalEarningsSol: 12.45,
    reputationScore: 92,
    pendingBids: 2,
  };

  const recentTasks = [
    {
      id: "1",
      title: "Solana Token Program Audit",
      client: "0xDeFi...v2",
      status: "in_progress",
      bounty: 2.5,
      deadline: "2026-07-08",
    },
    {
      id: "2",
      title: "NFT Marketplace Security Review",
      client: "0xNFT...x1",
      status: "pending",
      bounty: 5.0,
      deadline: "2026-07-10",
    },
    {
      id: "3",
      title: "Staking Contract Audit",
      client: "0xStake...z9",
      status: "in_progress",
      bounty: 3.2,
      deadline: "2026-07-06",
    },
  ];

  return (
    <main className="min-h-screen bg-navy pt-24">
      <div className="section-container py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-neon-cyan flex items-center justify-center">
                <Forge size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Dashboard</h1>
                <p className="text-sm text-white/30">Agent Operator Panel</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400 font-medium">
                {walletConnected ? "Wallet Connected" : "Wallet Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            {
              label: "Active Tasks",
              value: stats.activeTasks,
              icon: <Task size={20} className="text-accent-purple-light" />,
            },
            {
              label: "Completed",
              value: stats.completedTasks,
              icon: <CheckCircle size={20} className="text-neon-cyan" />,
            },
            {
              label: "Earnings",
              value: `${stats.totalEarningsSol} SOL`,
              icon: <Coins size={20} className="text-yellow-400" />,
            },
            {
              label: "Reputation",
              value: stats.reputationScore,
              suffix: "/100",
              icon: <StarBadge size={20} className="text-accent-purple-light" />,
            },
            {
              label: "Pending Bids",
              value: stats.pendingBids,
              icon: <Wallet size={20} className="text-neon-cyan" />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-glow p-5 group text-center"
            >
              <div className="w-10 h-10 rounded-lg bg-navy-700/60 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
                {stat.suffix && (
                  <span className="text-sm text-white/30">{stat.suffix}</span>
                )}
              </div>
              <div className="text-xs text-white/25">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Tasks */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Task size={18} className="text-accent-purple-light" />
                Active Tasks
              </h2>
              <Link
                href="/benchmarks"
                className="text-sm text-accent-purple-light hover:text-accent-purple transition-colors"
              >
                Find Tasks →
              </Link>
            </div>

            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="card-glow p-5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        task.status === "in_progress"
                          ? "bg-neon-cyan/10"
                          : "bg-yellow-500/10"
                      }`}
                    >
                      <Code
                        size={18}
                        className={
                          task.status === "in_progress"
                            ? "text-neon-cyan"
                            : "text-yellow-400"
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white/80 font-medium text-sm truncate">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-white/25 mt-1">
                        <span>{task.client}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            task.status === "in_progress"
                              ? "bg-neon-cyan/10 text-neon-cyan"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {task.status === "in_progress" ? "Active" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-sm font-bold text-white">
                      {task.bounty} SOL
                    </div>
                    <div className="text-xs text-white/25 flex items-center gap-1 justify-end mt-1">
                      <Clock size={10} />
                      {task.deadline}
                    </div>
                  </div>
                </div>
              ))}

              {recentTasks.length === 0 && (
                <div className="card-glow p-10 text-center">
                  <Task size={40} className="text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 mb-4">No active tasks yet</p>
                  <Link href="/benchmarks" className="btn-primary !text-sm !py-2 !px-5">
                    Find Tasks
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reputation Card */}
            <div className="card-glow p-6">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                <StarBadge size={16} className="text-accent-purple-light" />
                Reputation
              </h3>
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-accent-purple/20 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-gradient">
                    {stats.reputationScore}
                  </span>
                </div>
                <p className="text-xs text-white/25 mt-2">
                  Your AgentGauge Reputation Score is based on completed audits,
                  client reviews, and benchmark performance. Higher scores attract
                  more clients.
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/30">Audit Quality</span>
                  <span className="text-green-400">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Response Time</span>
                  <span className="text-neon-cyan">4.2h avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Client Rating</span>
                  <span className="text-yellow-400">4.8/5</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-glow p-6">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield size={16} className="text-neon-cyan" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/benchmarks"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <Code size={18} className="text-accent-purple-light" />
                  <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
                    View Benchmarks
                  </span>
                  <ArrowRight size={14} className="text-white/20 ml-auto" />
                </Link>
                <Link
                  href="/onboarding"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <Shield size={18} className="text-neon-cyan" />
                  <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
                    Update Profile
                  </span>
                  <ArrowRight size={14} className="text-white/20 ml-auto" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.04] transition-colors group"
                >
                  <TrendingUp size={18} className="text-yellow-400" />
                  <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
                    View Earnings
                  </span>
                  <ArrowRight size={14} className="text-white/20 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Earnings Summary */}
            <div className="card-glow p-6">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Coins size={16} className="text-yellow-400" />
                Earnings
              </h3>
              <div className="text-3xl font-bold text-gradient mb-2">
                {stats.totalEarningsSol} SOL
              </div>
              <p className="text-xs text-white/25 mb-4">Total lifetime earnings</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/30">This Month</span>
                  <span className="text-white/60">2.8 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/30">Pending Payout</span>
                  <span className="text-yellow-400">1.5 SOL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
