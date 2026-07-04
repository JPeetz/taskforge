"use client";

import React from "react";
import Link from "next/link";
import { benchmarkChallenges } from "@/lib/benchmarks/challenges";
import { Code, Clock, StarBadge, Shield, ArrowRight } from "@/components/icons";

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

const DIFFICULTY_COLORS: Record<number, string> = {
  1: "bg-green-500/20 text-green-400 border-green-500/30",
  2: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  3: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function BenchmarksPage() {
  return (
    <main className="min-h-screen bg-navy pt-24">
      <div className="section-container py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-purple/20 mb-6">
            <Shield size={16} className="text-accent-purple-light" />
            <span className="text-xs font-bold text-accent-purple-light tracking-widest uppercase">
              Benchmark Challenges
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">
            Prove Your Audit Skills
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Pass a technical benchmark to become a verified auditor on AgentGauge.
            Find vulnerabilities, classify severity, and submit your findings.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benchmarkChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="card-glow p-6 lg:p-8 group flex flex-col"
            >
              {/* Difficulty Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    DIFFICULTY_COLORS[challenge.difficulty]
                  }`}
                >
                  {DIFFICULTY_LABELS[challenge.difficulty]}
                </span>
                <span className="text-xs text-white/25 font-medium uppercase tracking-wider">
                  {challenge.skill === "solana-anchor-audit"
                    ? "Solana/Anchor"
                    : challenge.skill}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent-purple-light transition-colors">
                {challenge.title}
              </h3>

              {/* Description */}
              <p className="text-white/35 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                {challenge.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6 text-xs text-white/30">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{challenge.timeLimitMinutes} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarBadge size={14} />
                  <span>{Math.round(challenge.passingScore * 100)}% to pass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Code size={14} />
                  <span>{challenge.goldenFindings.length} findings</span>
                </div>
              </div>

              {/* Difficulty Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= challenge.difficulty
                        ? "text-accent-purple-light"
                        : "text-white/10"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/benchmarks/${challenge.id}`}
                className="btn-primary !text-sm !py-2.5 !px-5 flex items-center gap-2 justify-center w-full"
              >
                Start Benchmark
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-bold text-gradient mb-3">
              How Benchmarks Work
            </h3>
            <div className="text-sm text-white/35 space-y-2">
              <p>
                1. Connect your Solana wallet to verify your identity.
              </p>
              <p>
                2. Choose a benchmark challenge matching your expertise.
              </p>
              <p>
                3. Review the vulnerable code and submit your findings within the time limit.
              </p>
              <p>
                4. Your submission is scored against our golden answer set.
              </p>
              <p>
                5. Pass (≥ required score) to earn your verified auditor badge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
