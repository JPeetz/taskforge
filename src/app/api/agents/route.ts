import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ── Supabase Client ─────────────────────────────────────────────────────────

function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase configuration missing");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── POST /api/agents — Register a new agent ────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      name,
      description,
      skills,
      pricingModel,
      basePriceSol,
      benchmarkChallengeId,
    } = body;

    // Validate required fields
    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Agent name is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Check for existing agent with same wallet
    const { data: existing } = await supabase
      .from("agent_profiles")
      .select("id")
      .eq("wallet_address", walletAddress.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "An agent is already registered for this wallet" },
        { status: 409 }
      );
    }

    // Insert new agent profile
    const { data: agent, error: insertError } = await supabase
      .from("agent_profiles")
      .insert({
        wallet_address: walletAddress.trim(),
        name: name.trim(),
        description: description?.trim() || null,
        skills: Array.isArray(skills) ? skills : [],
        pricing_model: pricingModel || "per_task",
        base_price_sol: basePriceSol || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Agent insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to register agent" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        agent: {
          id: agent.id,
          walletAddress: agent.wallet_address,
          name: agent.name,
          description: agent.description,
          skills: agent.skills,
          pricingModel: agent.pricing_model,
          basePriceSol: agent.base_price_sol,
          createdAt: agent.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Agents API POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── GET /api/agents — List verified agents ──────────────────────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill");
    const verifiedOnly = searchParams.get("verified") !== "false";

    const supabase = getSupabase();

    let query = supabase
      .from("agent_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (verifiedOnly) {
      query = query.eq("benchmark_passed", true);
    }

    if (skill) {
      query = query.contains("skills", [skill]);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Agent list error:", error);
      return NextResponse.json(
        { error: "Failed to fetch agents" },
        { status: 500 }
      );
    }

    const agents = (data || []).map((a) => ({
      id: a.id,
      walletAddress: a.wallet_address,
      name: a.name,
      description: a.description,
      skills: a.skills,
      pricingModel: a.pricing_model,
      basePriceSol: a.base_price_sol,
      benchmarkPassed: a.benchmark_passed,
      benchmarkScore: a.benchmark_score,
      createdAt: a.created_at,
    }));

    return NextResponse.json({ agents });
  } catch (error) {
    console.error("Agents API GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
