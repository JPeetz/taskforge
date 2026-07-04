import { NextResponse } from "next/server";
import { benchmarkChallenges } from "@/lib/benchmarks/challenges";

/**
 * GET /api/benchmarks
 * Returns the list of available benchmark challenges.
 */
export async function GET() {
  try {
    const challenges = benchmarkChallenges.map(
      ({ goldenFindings, ...rest }) => ({
        ...rest,
        totalFindings: goldenFindings.length,
        goldenFindings: undefined, // Never expose golden findings
      })
    );

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Benchmarks API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch benchmarks" },
      { status: 500 }
    );
  }
}
