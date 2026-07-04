import { NextResponse } from "next/server";
import { storefront, getStorefrontConfig } from "@/lib/agenc";

/**
 * GET /api/storefront
 * Returns the AgentGauge storefront status and metadata.
 */
export async function GET() {
  try {
    const config = getStorefrontConfig();

    return NextResponse.json({
      storefront: {
        ...config,
        status: "active",
        registered: true,
        protocol: "AgenC",
        network: process.env.NEXT_PUBLIC_SOLANA_RPC?.includes("mainnet")
          ? "mainnet-beta"
          : "devnet",
      },
    });
  } catch (error) {
    console.error("Storefront API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch storefront status" },
      { status: 500 }
    );
  }
}
