"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getChallenge } from "@/lib/benchmarks/challenges";
import {
  evaluateSubmission,
  type AgentFinding,
  type EvaluationResult,
  type ScoringBreakdown,
} from "@/lib/benchmarks/evaluator";
import { Code, Clock, StarBadge, Shield, CheckCircle, ArrowRight, ExternalLink } from "@/components/icons";

type Severity = "critical" | "high" | "medium" | "low";

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function BenchmarkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const challenge = getChallenge(id);

  const [findings, setFindings] = useState<AgentFinding[]>([]);
  const [currentFinding, setCurrentFinding] = useState<AgentFinding>({
    severity: "medium",
    description: "",
    file: "",
  });
  const [remediationNotes, setRemediationNotes] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer
  useEffect(() => {
    if (challenge) {
      setTimeLeft(challenge.timeLimitMinutes * 60);
    }
  }, [challenge]);

  const startTimer = useCallback(() => {
    setTimerActive(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Auto-start timer on first finding
  const addFinding = useCallback(() => {
    if (!currentFinding.description.trim() || !currentFinding.file.trim()) return;

    if (!timerActive) startTimer();

    setFindings((prev) => [...prev, { ...currentFinding }]);
    setCurrentFinding({ severity: "medium", description: "", file: "" });
    setShowAddForm(false);
  }, [currentFinding, timerActive, startTimer]);

  const removeFinding = useCallback((index: number) => {
    setFindings((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!challenge) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const submission = {
      challengeId: challenge.id,
      findings,
      remediationNotes: remediationNotes.trim() || undefined,
      timeSpentSeconds: challenge.timeLimitMinutes * 60 - timeLeft,
    };

    const evaluation = evaluateSubmission(
      challenge.goldenFindings,
      submission,
      challenge.passingScore
    );

    setResult(evaluation);
    setSubmitted(true);
  }, [challenge, findings, remediationNotes, timeLeft]);

  if (!challenge) {
    return (
      <main className="min-h-screen bg-navy pt-24">
        <div className="section-container py-16 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Challenge Not Found</h1>
          <Link href="/benchmarks" className="btn-primary">
            Back to Benchmarks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy pt-24">
      <div className="section-container py-8">
        {/* Back link */}
        <Link
          href="/benchmarks"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          ← Back to Benchmarks
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
                  {challenge.title}
                </h1>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    SEVERITY_COLORS[challenge.difficulty === 1 ? "low" : challenge.difficulty === 2 ? "medium" : "critical"]
                  }`}
                >
                  {challenge.difficulty === 1
                    ? "Beginner"
                    : challenge.difficulty === 2
                    ? "Intermediate"
                    : "Advanced"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/30">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {challenge.timeLimitMinutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <StarBadge size={14} /> {Math.round(challenge.passingScore * 100)}% to pass
                </span>
                <span className="flex items-center gap-1.5">
                  <Code size={14} /> {challenge.goldenFindings.length} hidden findings
                </span>
              </div>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-2xl font-bold ${
                timeLeft < 60
                  ? "bg-red-500/20 text-red-400"
                  : timeLeft < 300
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-navy-800/60 text-neon-cyan"
              } ${!timerActive ? "opacity-50" : ""}`}
            >
              <Clock size={22} />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-6 mb-6">
            <p className="text-white/50 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>
            <a
              href={challenge.codeRepository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-neon-cyan hover:text-neon-cyan-light transition-colors"
            >
              View Vulnerable Code on GitHub <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {!submitted ? (
          <>
            {/* Findings List */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">
                  Your Findings ({findings.length})
                </h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary !text-sm !py-2 !px-4"
                >
                  + Add Finding
                </button>
              </div>

              {showAddForm && (
                <div className="glass rounded-2xl p-6 mb-4">
                  <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
                    New Finding
                  </h3>

                  <div className="space-y-4">
                    {/* Severity */}
                    <div>
                      <label className="block text-sm text-white/40 mb-2">Severity</label>
                      <div className="flex gap-2">
                        {(["critical", "high", "medium", "low"] as Severity[]).map(
                          (sev) => (
                            <button
                              key={sev}
                              onClick={() =>
                                setCurrentFinding((f) => ({ ...f, severity: sev }))
                              }
                              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                                currentFinding.severity === sev
                                  ? SEVERITY_COLORS[sev] + " ring-2 ring-offset-1 ring-offset-navy-800"
                                  : "border-white/10 text-white/30 hover:border-white/20"
                              }`}
                            >
                              {SEVERITY_LABELS[sev]}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm text-white/40 mb-2">
                        Description
                      </label>
                      <textarea
                        value={currentFinding.description}
                        onChange={(e) =>
                          setCurrentFinding((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe the vulnerability, its impact, and how to exploit it..."
                        rows={3}
                        className="input-glass resize-none"
                      />
                    </div>

                    {/* File */}
                    <div>
                      <label className="block text-sm text-white/40 mb-2">
                        File Location
                      </label>
                      <input
                        type="text"
                        value={currentFinding.file}
                        onChange={(e) =>
                          setCurrentFinding((f) => ({
                            ...f,
                            file: e.target.value,
                          }))
                        }
                        placeholder="programs/token-vuln/src/lib.rs"
                        className="input-glass"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button onClick={addFinding} className="btn-primary !text-sm !py-2 !px-6">
                        Add Finding
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Findings */}
              {findings.length === 0 && !showAddForm && (
                <div className="glass rounded-2xl p-10 text-center">
                  <Code size={40} className="text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 mb-2">
                    No findings yet. Review the vulnerable code and add your first finding.
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="btn-primary !text-sm !py-2 !px-5 mt-4"
                  >
                    + Add First Finding
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="glass rounded-xl p-4 flex items-start gap-4 group"
                  >
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                        SEVERITY_COLORS[finding.severity]
                      }`}
                    >
                      {SEVERITY_LABELS[finding.severity]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-sm mb-1">
                        {finding.description}
                      </p>
                      <p className="text-white/20 text-xs font-mono">
                        {finding.file}
                        {finding.lineRange
                          ? ` [L${finding.lineRange[0]}-${finding.lineRange[1]}]`
                          : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFinding(idx)}
                      className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Remediation Notes */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">
                Remediation Notes (Optional)
              </h2>
              <textarea
                value={remediationNotes}
                onChange={(e) => setRemediationNotes(e.target.value)}
                placeholder="Any additional notes on how to fix the vulnerabilities..."
                rows={4}
                className="input-glass resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={findings.length === 0}
                className="btn-primary-pulse !text-lg !py-4 !px-10"
              >
                <span className="flex items-center gap-2">
                  <Shield size={20} />
                  Submit Findings for Scoring
                </span>
              </button>
            </div>
          </>
        ) : (
          /* Results */
          <div className="max-w-2xl mx-auto">
            {/* Pass/Fail Banner */}
            <div
              className={`rounded-2xl p-8 mb-8 text-center ${
                result!.passed
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  result!.passed ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {result!.passed ? (
                  <CheckCircle size={40} className="text-green-400" />
                ) : (
                  <span className="text-3xl">📋</span>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {result!.passed ? "Benchmark Passed! 🎉" : "Benchmark Not Passed"}
              </h2>
              <p className="text-white/40 mb-4">
                Score:{" "}
                <span
                  className={`text-3xl font-bold ${
                    result!.passed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {Math.round(result!.score * 100)}%
                </span>
                {" / "}
                <span className="text-white/50">
                  {Math.round(result!.passingThreshold * 100)}% required
                </span>
              </p>
            </div>

            {/* Breakdown */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                {result!.breakdown.map((bd) => (
                  <div key={bd.category} className="flex items-center gap-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border w-20 text-center ${
                        SEVERITY_COLORS[bd.category]
                      }`}
                    >
                      {SEVERITY_LABELS[bd.category]}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white/40">
                          {bd.found}/{bd.total} found
                        </span>
                        {bd.falsePositives > 0 && (
                          <span className="text-red-400 text-xs">
                            {bd.falsePositives} false positive{bd.falsePositives > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            bd.score >= 0.8
                              ? "bg-green-500"
                              : bd.score >= 0.5
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${Math.round(bd.score * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-mono text-white/60 w-12 text-right">
                      {Math.round(bd.score * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missed Findings */}
            {result!.missedFindings.length > 0 && (
              <div className="glass rounded-2xl p-6 mb-6 border border-red-500/10">
                <h3 className="text-lg font-bold text-red-400 mb-4">
                  Missed Findings ({result!.missedFindings.length})
                </h3>
                <div className="space-y-3">
                  {result!.missedFindings.map((mf, i) => (
                    <div key={i} className="bg-navy-800/40 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            SEVERITY_COLORS[mf.severity]
                          }`}
                        >
                          {SEVERITY_LABELS[mf.severity]}
                        </span>
                        <span className="text-xs text-white/20 font-mono">
                          {mf.cwe}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm">{mf.description}</p>
                      <p className="text-white/15 text-xs mt-1 font-mono">
                        {mf.file}:{mf.lineRange[0]}-{mf.lineRange[1]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* False Positives */}
            {result!.falsePositives.length > 0 && (
              <div className="glass rounded-2xl p-6 mb-6 border border-yellow-500/10">
                <h3 className="text-lg font-bold text-yellow-400 mb-4">
                  False Positives ({result!.falsePositives.length})
                </h3>
                <p className="text-white/30 text-sm mb-4">
                  These findings were not in the golden answer set. False positives reduce
                  your score.
                </p>
                <div className="space-y-2">
                  {result!.falsePositives.map((fp, i) => (
                    <div key={i} className="bg-navy-800/40 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            SEVERITY_COLORS[fp.severity]
                          }`}
                        >
                          {SEVERITY_LABELS[fp.severity]}
                        </span>
                      </div>
                      <p className="text-white/40 text-sm">{fp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <Link href="/benchmarks" className="btn-secondary">
                Back to Benchmarks
              </Link>
              {result!.passed && (
                <Link href="/onboarding" className="btn-primary">
                  Continue to Onboarding
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
