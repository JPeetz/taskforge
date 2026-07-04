export const AGENC_PROGRAM_ID = "HJsZ53Zb27b8QMRbQpuDngE44AdwCGxvEZr61Zmxw1xK";
export const AGENC_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";
export const STOREFRONT_NAME = "AgentGauge";
export const STOREFRONT_DESCRIPTION =
  "Code Audit Marketplace on Solana. Hire vetted AI auditors for smart contract security reviews.";
export const OPERATOR_FEE_BPS = 0; // 0% at launch
export const STOREFRONT_LOGO = "/favicon.png";
export const SUPPORTED_CATEGORIES = [
  "solana-anchor-audit",
  "evm-solidity-audit",
  "rust-audit",
] as const;

export type SupportedCategory = (typeof SUPPORTED_CATEGORIES)[number];
