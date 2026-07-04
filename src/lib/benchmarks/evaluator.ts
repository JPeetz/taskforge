import type { Severity, GoldenFinding } from "./challenges";
import { SEVERITY_WEIGHTS } from "./challenges";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AgentFinding {
  severity: Severity;
  description: string;
  file: string;
  lineRange?: [number, number];
}

export interface BenchmarkSubmission {
  challengeId: string;
  findings: AgentFinding[];
  remediationNotes?: string;
  timeSpentSeconds?: number;
}

export interface ScoringBreakdown {
  category: Severity;
  found: number;
  total: number;
  score: number;
  weight: number;
  falsePositives: number;
}

export interface EvaluationResult {
  score: number; // 0..1
  passed: boolean;
  passingThreshold: number;
  breakdown: ScoringBreakdown[];
  falsePositives: AgentFinding[];
  missedFindings: GoldenFinding[];
  matchedFindings: Array<{
    golden: GoldenFinding;
    found: boolean;
  }>;
}

// ── Evaluator ──────────────────────────────────────────────────────────────

/**
 * Compare agent submission against golden findings.
 * Scoring: severity weight * coverage ratio per severity level.
 * Penalizes false positives (reported issues that don't exist).
 */
export function evaluateSubmission(
  goldenFindings: GoldenFinding[],
  submission: BenchmarkSubmission,
  passingThreshold: number
): EvaluationResult {
  const findings = submission.findings || [];

  // Group golden findings by severity
  const goldenBySeverity: Record<Severity, GoldenFinding[]> = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  for (const gf of goldenFindings) {
    goldenBySeverity[gf.severity].push(gf);
  }

  // Match agent findings to golden findings
  const matchedSet = new Set<number>(); // indices of golden findings that were matched
  const falsePositives: AgentFinding[] = [];

  for (const af of findings) {
    let matched = false;

    for (let i = 0; i < goldenFindings.length; i++) {
      if (matchedSet.has(i)) continue;

      const gf = goldenFindings[i];
      // Match by severity and keyword overlap in description
      if (af.severity === gf.severity && hasKeywordOverlap(af.description, gf.description)) {
        matchedSet.add(i);
        matched = true;
        break;
      }
    }

    // Try cross-severity match (e.g. agent rated medium but golden says high)
    if (!matched) {
      for (let i = 0; i < goldenFindings.length; i++) {
        if (matchedSet.has(i)) continue;
        const gf = goldenFindings[i];
        if (hasKeywordOverlap(af.description, gf.description)) {
          matchedSet.add(i);
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      falsePositives.push(af);
    }
  }

  // Calculate breakdown per severity
  const breakdown: ScoringBreakdown[] = [];
  let totalWeightedScore = 0;
  let totalMaxWeightedScore = 0;

  const ordered: Severity[] = ["critical", "high", "medium", "low"];
  for (const severity of ordered) {
    const goldenForSev = goldenBySeverity[severity];
    const totalForSev = goldenForSev.length;
    const weight = SEVERITY_WEIGHTS[severity];

    // Count how many of these golden findings were matched
    let foundCount = 0;
    for (let i = 0; i < goldenFindings.length; i++) {
      if (goldenFindings[i].severity === severity && matchedSet.has(i)) {
        foundCount++;
      }
    }

    // Count false positives at this severity
    const fpCount = falsePositives.filter((fp) => fp.severity === severity).length;

    // Coverage ratio for this severity
    const coverage = totalForSev > 0 ? foundCount / totalForSev : 1;

    // False positive penalty: each FP reduces score by 10% of its weighted value
    const fpPenalty = totalForSev > 0 ? (fpCount * 0.1 * weight) / (totalForSev * weight) : 0;
    const severityScore = Math.max(0, coverage - fpPenalty);

    totalWeightedScore += severityScore * weight * totalForSev;
    totalMaxWeightedScore += weight * totalForSev;

    breakdown.push({
      category: severity,
      found: foundCount,
      total: totalForSev,
      score: severityScore,
      weight,
      falsePositives: fpCount,
    });
  }

  const overallScore =
    totalMaxWeightedScore > 0
      ? Math.round((totalWeightedScore / totalMaxWeightedScore) * 10000) / 10000
      : 1;

  // Build missed findings list
  const missedFindings: GoldenFinding[] = [];
  for (let i = 0; i < goldenFindings.length; i++) {
    if (!matchedSet.has(i)) {
      missedFindings.push(goldenFindings[i]);
    }
  }

  // Build matched findings list
  const matchedFindings = goldenFindings.map((gf, i) => ({
    golden: gf,
    found: matchedSet.has(i),
  }));

  return {
    score: overallScore,
    passed: overallScore >= passingThreshold,
    passingThreshold,
    breakdown,
    falsePositives,
    missedFindings,
    matchedFindings,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Check if two descriptions share significant keywords,
 * accounting for different phrasing of the same vulnerability.
 */
function hasKeywordOverlap(agentDesc: string, goldenDesc: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const agentNormalized = normalize(agentDesc);
  const goldenNormalized = normalize(goldenDesc);

  // Extract significant words (3+ chars, not stop words)
  const stopWords = new Set([
    "the", "and", "for", "that", "this", "with", "from", "have",
    "are", "not", "but", "its", "can", "has", "was", "all",
  ]);

  const extractKeywords = (text: string): Set<string> => {
    const words = text.split(" ");
    return new Set(
      words.filter((w) => w.length >= 3 && !stopWords.has(w))
    );
  };

  const agentKeywords = extractKeywords(agentNormalized);
  const goldenKeywords = extractKeywords(goldenNormalized);

  if (agentKeywords.size === 0 || goldenKeywords.size === 0) return false;

  let overlapCount = 0;
  const agentKeywordArr = Array.from(agentKeywords);
  for (let i = 0; i < agentKeywordArr.length; i++) {
    if (goldenKeywords.has(agentKeywordArr[i])) overlapCount++;
  }

  // Need at least 3 keyword overlaps or 40% of golden keywords matched
  const overlapRatio = overlapCount / goldenKeywords.size;
  return overlapCount >= 3 || overlapRatio >= 0.4;
}
