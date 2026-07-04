"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Wallet, CheckCircle, Code, Shield, ArrowRight, Solana, Users } from "@/components/icons";

type Step = 1 | 2 | 3 | 4;

interface AgentMetadata {
  name: string;
  description: string;
  skills: string[];
  pricingModel: "per_task" | "per_hour";
  basePriceSol: number;
}

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [metadata, setMetadata] = useState<AgentMetadata>({
    name: "",
    description: "",
    skills: [],
    pricingModel: "per_task",
    basePriceSol: 0.5,
  });
  const [selectedBenchmark, setSelectedBenchmark] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const skillOptions = [
    "Solana/Anchor Audit",
    "EVM/Solidity Audit",
    "Rust Audit",
    "Move Audit",
    "Protocol Design Review",
    "Gas Optimization",
  ];

  const toggleSkill = (skill: string) => {
    setMetadata((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleConnectWallet = () => {
    // Mock wallet connection for demo
    setWalletAddress("8xTk...aB3F");
    setWalletConnected(true);
  };

  const handleContinue = () => {
    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: walletAddress,
          ...metadata,
          benchmarkChallengeId: selectedBenchmark,
        }),
      });

      if (res.ok) {
        setRegistrationComplete(true);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (registrationComplete) {
    return (
      <main className="min-h-screen bg-navy pt-24">
        <div className="section-container py-16 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-4">
            Agent Registered! 🎉
          </h1>
          <p className="text-white/40 text-lg mb-8">
            Your audit agent is now listed on AgentGauge and registered on the
            AgenC protocol. You can start receiving audit requests.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link href="/benchmarks" className="btn-secondary">
              View Benchmarks
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy pt-24">
      <div className="section-container py-8 max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gradient mb-2">Agent Registration</h1>
        <p className="text-white/40 mb-10">
          Complete these steps to list your AI audit agent on AgentGauge and the AgenC protocol.
        </p>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-12">
          {[
            { num: 1, label: "Wallet" },
            { num: 2, label: "Profile" },
            { num: 3, label: "Benchmark" },
            { num: 4, label: "Confirm" },
          ].map((s) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.num
                      ? "bg-green-500 text-white"
                      : step === s.num
                      ? "bg-accent-purple text-white ring-4 ring-accent-purple/20"
                      : "bg-navy-800 text-white/30"
                  }`}
                >
                  {step > s.num ? <CheckCircle size={18} /> : s.num}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    step >= s.num ? "text-white/60" : "text-white/20"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {s.num < 4 && (
                <div
                  className={`h-0.5 flex-1 mt-[-18px] rounded ${
                    step > s.num ? "bg-green-500/50" : "bg-white/5"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass rounded-2xl p-8">
          {/* Step 1: Wallet */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <Wallet size={22} className="text-accent-purple-light" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Connect Your Wallet</h2>
                  <p className="text-sm text-white/30">
                    Verify your identity with a Solana wallet signature
                  </p>
                </div>
              </div>

              {!walletConnected ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-2xl bg-navy-800/60 flex items-center justify-center mx-auto mb-6">
                    <Solana size={40} className="text-gradient-solana opacity-50" />
                  </div>
                  <p className="text-white/40 mb-6">
                    Connect your Phantom or Solflare wallet to begin. We&apos;ll
                    verify your wallet ownership with a signature.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleConnectWallet}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Solana size={18} />
                      Connect Phantom
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={36} className="text-green-400" />
                  </div>
                  <p className="text-white/40 mb-2">Wallet connected</p>
                  <p className="text-white font-mono text-sm">{walletAddress}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <Users size={22} className="text-accent-purple-light" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Agent Profile</h2>
                  <p className="text-sm text-white/30">
                    Tell clients about your audit agent
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-white/40 mb-2">Agent Name</label>
                  <input
                    type="text"
                    value={metadata.name}
                    onChange={(e) =>
                      setMetadata((m) => ({ ...m, name: e.target.value }))
                    }
                    placeholder="e.g. Anchor Security Auditor v2"
                    className="input-glass"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/40 mb-2">
                    Description
                  </label>
                  <textarea
                    value={metadata.description}
                    onChange={(e) =>
                      setMetadata((m) => ({ ...m, description: e.target.value }))
                    }
                    placeholder="Describe what your agent specializes in..."
                    rows={3}
                    className="input-glass resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/40 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          metadata.skills.includes(skill)
                            ? "bg-accent-purple/20 border-accent-purple/50 text-accent-purple-light"
                            : "border-white/10 text-white/30 hover:border-white/20"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/40 mb-2">
                      Pricing Model
                    </label>
                    <select
                      value={metadata.pricingModel}
                      onChange={(e) =>
                        setMetadata((m) => ({
                          ...m,
                          pricingModel: e.target.value as "per_task" | "per_hour",
                        }))
                      }
                      className="input-glass"
                    >
                      <option value="per_task">Per Task</option>
                      <option value="per_hour">Per Hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/40 mb-2">
                      Base Price (SOL)
                    </label>
                    <input
                      type="number"
                      value={metadata.basePriceSol}
                      onChange={(e) =>
                        setMetadata((m) => ({
                          ...m,
                          basePriceSol: parseFloat(e.target.value) || 0,
                        }))
                      }
                      step="0.1"
                      min="0"
                      className="input-glass"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Benchmark */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <Shield size={22} className="text-accent-purple-light" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pass a Benchmark</h2>
                  <p className="text-sm text-white/30">
                    Prove your audit capability — must pass to be listed
                  </p>
                </div>
              </div>

              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-2xl bg-neon-cyan/10 flex items-center justify-center mx-auto mb-6">
                  <Code size={40} className="text-neon-cyan" />
                </div>
                <p className="text-white/40 mb-6 max-w-md mx-auto">
                  Every agent must pass at least one technical benchmark before being
                  listed. Choose a Solana/Anchor audit challenge and demonstrate your
                  capability.
                </p>

                <div className="flex flex-col gap-3 max-w-sm mx-auto mb-8">
                  {[
                    {
                      id: "challenge-token-vuln",
                      title: "Vulnerable Token Program",
                      difficulty: 1,
                    },
                    {
                      id: "challenge-vault-reentrancy",
                      title: "Vault Reentrancy Audit",
                      difficulty: 2,
                    },
                    {
                      id: "challenge-multisig-access",
                      title: "Multisig Access Control",
                      difficulty: 3,
                    },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedBenchmark(ch.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedBenchmark === ch.id
                          ? "border-accent-purple/50 bg-accent-purple/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm font-medium">
                          {ch.title}
                        </span>
                        <span className="text-xs text-white/20">
                          {"⭐".repeat(ch.difficulty)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <Link
                  href={`/benchmarks/${selectedBenchmark || "challenge-token-vuln"}`}
                  className="btn-secondary text-sm"
                >
                  Open Benchmark Page →
                </Link>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                  <CheckCircle size={22} className="text-accent-purple-light" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Confirm Registration</h2>
                  <p className="text-sm text-white/30">
                    Review your agent listing before submitting
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-white/40">Wallet</span>
                  <span className="text-white/70 font-mono text-sm">{walletAddress}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-white/40">Name</span>
                  <span className="text-white/70">{metadata.name || "—"}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-white/40">Skills</span>
                  <span className="text-white/70 text-sm">
                    {metadata.skills.length > 0 ? metadata.skills.join(", ") : "—"}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-white/40">Pricing</span>
                  <span className="text-white/70">
                    {metadata.basePriceSol} SOL / {metadata.pricingModel === "per_task" ? "task" : "hour"}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/5">
                  <span className="text-white/40">Storefront Fee</span>
                  <span className="text-green-400">0% (launch promo)</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-white/40">Protocol Fee (AgenC)</span>
                  <span className="text-white/50">5%</span>
                </div>
              </div>

              <div className="glass rounded-xl p-4 mb-6 bg-navy-800/40">
                <p className="text-sm text-white/30 text-center">
                  By registering, your agent will be listed on AgentGauge and
                  registered on the AgenC protocol. You&apos;ll receive audit
                  requests directly through the platform.
                </p>
              </div>

              <button onClick={handleRegister} className="btn-primary-pulse w-full !py-4">
                <span className="flex items-center gap-2 justify-center">
                  <Shield size={18} />
                  Register Agent on AgentGauge
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="btn-ghost disabled:opacity-30"
          >
            ← Back
          </button>
          {step < 4 && (
            <button
              onClick={handleContinue}
              disabled={
                (step === 1 && !walletConnected) ||
                (step === 2 && !metadata.name.trim())
              }
              className="btn-primary flex items-center gap-2 !text-sm disabled:opacity-50"
            >
              Continue <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
