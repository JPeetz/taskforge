export type Severity = "critical" | "high" | "medium" | "low";

export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export interface GoldenFinding {
  severity: Severity;
  description: string;
  file: string;
  lineRange: [number, number];
  cwe: string;
}

export interface BenchmarkChallenge {
  id: string;
  title: string;
  skill: "solana-anchor-audit";
  difficulty: 1 | 2 | 3;
  description: string;
  codeRepository: string;
  goldenFindings: GoldenFinding[];
  timeLimitMinutes: number;
  passingScore: number; // e.g. 0.80 = 80%
}

// ── Challenges ─────────────────────────────────────────────────────────────

export const benchmarkChallenges: BenchmarkChallenge[] = [
  {
    id: "challenge-token-vuln",
    title: "Vulnerable Token Program Audit",
    skill: "solana-anchor-audit",
    difficulty: 1,
    description: `Audit a simple Solana SPL token program written in Anchor for common vulnerabilities. This program contains intentionally introduced bugs including an unchecked account, integer overflow, and missing signer validation. Your task is to find and classify each vulnerability.`,
    codeRepository: "https://github.com/agentgauge/benchmark-token-vuln",
    goldenFindings: [
      {
        severity: "critical",
        description:
          "Missing signer check on mint_to instruction — any caller can mint arbitrary tokens without authorization",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [42, 48],
        cwe: "CWE-862",
      },
      {
        severity: "high",
        description:
          "Integer overflow in reward calculation allows wrapping to bypass maximum supply cap",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [65, 72],
        cwe: "CWE-190",
      },
      {
        severity: "medium",
        description:
          "Unchecked account deserialization — transfer authority account is not validated to be the expected token account type",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [88, 94],
        cwe: "CWE-1287",
      },
      {
        severity: "low",
        description:
          "Missing event emission on transfer — no on-chain event emitted when tokens are transferred, reducing auditability",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [105, 110],
        cwe: "CWE-778",
      },
    ],
    timeLimitMinutes: 30,
    passingScore: 0.8,
  },
  {
    id: "challenge-vault-reentrancy",
    title: "Reentrancy in Vault Program",
    skill: "solana-anchor-audit",
    difficulty: 2,
    description: `Audit a Solana vault program that allows users to deposit and withdraw SOL. The program contains a cross-program invocation (CPI) reentrancy vulnerability, an incorrect PDA derivation, and a business logic flaw in withdrawal limits. Find all issues and classify their severity.`,
    codeRepository: "https://github.com/agentgauge/benchmark-vault-reentrancy",
    goldenFindings: [
      {
        severity: "critical",
        description:
          "CPI reentrancy vulnerability — withdraw function calls external program before updating vault state, allowing recursive withdrawals that drain the vault",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [78, 96],
        cwe: "CWE-841",
      },
      {
        severity: "high",
        description:
          "Incorrect PDA derivation — vault authority PDA uses user public key instead of program-derived seed, allowing unauthorized access to vault funds",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [35, 42],
        cwe: "CWE-1283",
      },
      {
        severity: "medium",
        description:
          "Withdrawal limit bypass — daily limit check uses timestamp from client-provided account which can be manipulated",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [55, 62],
        cwe: "CWE-470",
      },
      {
        severity: "medium",
        description:
          "Missing close instruction — no way to close vault accounts, leading to rent accumulation and potential state bloat",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [22, 28],
        cwe: "CWE-459",
      },
      {
        severity: "low",
        description:
          "Missing input validation on deposit amount — zero-deposit transactions waste compute without guard",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [50, 53],
        cwe: "CWE-20",
      },
    ],
    timeLimitMinutes: 45,
    passingScore: 0.75,
  },
  {
    id: "challenge-multisig-access",
    title: "Multisig Access Control Audit",
    skill: "solana-anchor-audit",
    difficulty: 3,
    description: `Audit a Solana multisig program with complex access control. The program manages a treasury that requires multiple signers for withdrawals. Issues include: signature replay vulnerability, threshold manipulation during execution, incorrect signer weight accounting, and a front-running opportunity in proposal execution timing.`,
    codeRepository: "https://github.com/agentgauge/benchmark-multisig-access",
    goldenFindings: [
      {
        severity: "critical",
        description:
          "Signature replay attack — proposal execution does not increment nonce or mark proposal as executed, allowing same proposal to be replayed indefinitely",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [120, 135],
        cwe: "CWE-294",
      },
      {
        severity: "critical",
        description:
          "Threshold manipulation — signer weight check queries mutable account state that can be modified within the same transaction as execution",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [95, 108],
        cwe: "CWE-367",
      },
      {
        severity: "high",
        description:
          "Incorrect weight accounting — duplicate signer detection fails for signers with zero or negative weights, allowing weight inflation",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [65, 78],
        cwe: "CWE-682",
      },
      {
        severity: "high",
        description:
          "Front-running in proposal execution — execution delay is enforced via on-chain clock which can be gamed by validators, allowing premature execution",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [145, 155],
        cwe: "CWE-1219",
      },
      {
        severity: "medium",
        description:
          "Unchecked account owner — treasury token account owner is not validated before transfer, allowing spoofed accounts to receive funds",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [160, 168],
        cwe: "CWE-1287",
      },
      {
        severity: "low",
        description:
          "Missing event for proposal creation — no on-chain event emitted when a new proposal is created, reducing off-chain monitoring capability",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [45, 52],
        cwe: "CWE-778",
      },
    ],
    timeLimitMinutes: 60,
    passingScore: 0.7,
  },
];

export function getChallenge(id: string): BenchmarkChallenge | undefined {
  return benchmarkChallenges.find((c) => c.id === id);
}

export function getChallenges(): BenchmarkChallenge[] {
  return [...benchmarkChallenges];
}
