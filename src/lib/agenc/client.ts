"use client";

import type {
  PublicKey,
  Transaction,
  SendOptions,
} from "@solana/web3.js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import {
  STOREFRONT_NAME,
  OPERATOR_FEE_BPS,
  AGENC_PROGRAM_ID,
} from "./constants";

// ── Types ──────────────────────────────────────────────────────────────────

export interface AgenCConfig {
  rpcEndpoint: string;
  storefrontName: string;
  operatorFeeBps: number;
  programId: string;
}

export interface ServiceListing {
  id: string;
  agentAddress: string;
  title: string;
  description: string;
  skill: string;
  priceSol: number;
  operatorFeeBps: number;
  storefrontId: string;
}

export interface TaskResult {
  id: string;
  listingId: string;
  clientAddress: string;
  agentAddress: string;
  status: "pending" | "in_progress" | "completed" | "disputed" | "settled";
  amountSol: number;
  escrowAddress: string;
  createdAt: string;
  completedAt?: string;
}

export interface AgentProfile {
  walletAddress: string;
  name: string;
  skills: string[];
  benchmarkScore?: number;
  totalTasks: number;
  completedTasks: number;
  reputationScore: number;
}

export interface StorefrontConfig {
  name: string;
  description: string;
  logo: string;
  categories: string[];
  operatorWallet: string;
  operatorFeeBps: number;
}

// ── Wallet Adapter Interface ───────────────────────────────────────────────

export interface WalletAdapter {
  publicKey: PublicKey | null;
  connected: boolean;
  signTransaction(tx: Transaction): Promise<Transaction>;
  sendTransaction(
    tx: Transaction,
    connection: Connection,
    options?: SendOptions
  ): Promise<string>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
}

// ── AgenC Client ───────────────────────────────────────────────────────────

export class AgenCClient {
  private connection: Connection;
  private config: AgenCConfig;
  private storefrontId: string | null = null;

  constructor(wallet: WalletAdapter | null, configOverride?: Partial<AgenCConfig>) {
    this.config = {
      rpcEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("devnet"),
      storefrontName: STOREFRONT_NAME,
      operatorFeeBps: OPERATOR_FEE_BPS,
      programId: AGENC_PROGRAM_ID,
      ...configOverride,
    };
    this.connection = new Connection(this.config.rpcEndpoint, "confirmed");
  }

  getConnection(): Connection {
    return this.connection;
  }

  getConfig(): AgenCConfig {
    return { ...this.config };
  }

  // ── Service Listings ───────────────────────────────────────────────────

  /**
   * Create a new service listing on AgenC.
   * In production, this calls the AgenC on-chain program.
   * For devnet/testing, returns a mock response.
   */
  async createServiceListing(params: {
    wallet: WalletAdapter;
    title: string;
    description: string;
    skill: string;
    priceSol: number;
  }): Promise<{ listingId: string; signature: string }> {
    const { wallet, title, description, skill, priceSol } = params;

    if (!wallet.connected || !wallet.publicKey) {
      throw new Error("Wallet not connected");
    }

    // Mock: In production, build and send transaction to AgenC program
    const listingId = `listing_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const signature = `mock_sig_${Date.now()}`;

    return { listingId, signature };
  }

  /**
   * Get service listings from the storefront.
   */
  async getServiceListings(filters?: {
    skill?: string;
    agentAddress?: string;
  }): Promise<ServiceListing[]> {
    // Mock: In production, fetch from AgenC program accounts
    return [];
  }

  /**
   * Hire an agent from a listing and create an escrowed task.
   */
  async hireFromListing(params: {
    wallet: WalletAdapter;
    listingId: string;
    amountSol: number;
  }): Promise<{ taskId: string; escrowAddress: string; signature: string }> {
    const { wallet, listingId, amountSol } = params;

    if (!wallet.connected || !wallet.publicKey) {
      throw new Error("Wallet not connected");
    }

    // Mock: In production, create escrow and task account
    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const escrowAddress = `escrow_${Date.now()}`;
    const signature = `mock_sig_${Date.now()}`;

    return { taskId, escrowAddress, signature };
  }

  /**
   * Get tasks for an address (inbound/outbound).
   */
  async getTasks(address: string, role: "client" | "agent"): Promise<TaskResult[]> {
    // Mock: In production, fetch from AgenC program accounts
    return [];
  }

  // ── Storefront Registration ─────────────────────────────────────────────

  /**
   * Register or lookup the AgentGauge storefront on AgenC.
   */
  async getStorefront(): Promise<{
    id: string;
    config: StorefrontConfig;
    registered: boolean;
  }> {
    if (this.storefrontId) {
      return {
        id: this.storefrontId,
        config: {
          name: this.config.storefrontName,
          description: "Code Audit Marketplace on Solana",
          logo: "/favicon.png",
          categories: ["solana-anchor-audit", "evm-solidity-audit", "rust-audit"],
          operatorWallet: "",
          operatorFeeBps: this.config.operatorFeeBps,
        },
        registered: true,
      };
    }

    // Mock storefront ID (in production: derived from PDA)
    this.storefrontId = `storefront_${this.config.storefrontName.toLowerCase()}`;

    return {
      id: this.storefrontId,
      config: {
        name: this.config.storefrontName,
        description: "Code Audit Marketplace on Solana",
        logo: "/favicon.png",
        categories: ["solana-anchor-audit", "evm-solidity-audit", "rust-audit"],
        operatorWallet: "",
        operatorFeeBps: this.config.operatorFeeBps,
      },
      registered: true,
    };
  }

  // ── Agent Profiles ──────────────────────────────────────────────────────

  /**
   * Get an agent's on-chain profile from AgenC.
   */
  async getAgentProfile(walletAddress: string): Promise<AgentProfile | null> {
    // Mock: In production, fetch from AgenC program or off-chain indexer
    return {
      walletAddress,
      name: "Agent",
      skills: [],
      totalTasks: 0,
      completedTasks: 0,
      reputationScore: 0,
    };
  }
}

// ── Singleton ──────────────────────────────────────────────────────────────

let clientInstance: AgenCClient | null = null;

export function getAgenCClient(wallet?: WalletAdapter): AgenCClient {
  if (!clientInstance) {
    clientInstance = new AgenCClient(wallet || null);
  }
  return clientInstance;
}

export function resetAgenCClient(): void {
  clientInstance = null;
}
