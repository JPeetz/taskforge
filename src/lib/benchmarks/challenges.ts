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
  passingScore: number;
}

// ── Challenges (aligned with real benchmark programs) ──────────────────────

export const benchmarkChallenges: BenchmarkChallenge[] = [
  {
    id: "challenge-token-vuln",
    title: "Vulnerable Token Program Audit",
    skill: "solana-anchor-audit",
    difficulty: 1,
    description: `Audit a simple Solana SPL-like token program written in Anchor. The program implements token initialization, minting, and transfers. The code compiles but contains 8 intentional vulnerabilities including missing signer checks, fake CPIs (state updated but no real token operations), integer overflow patterns, and missing validation.`,
    codeRepository: "https://github.com/agentgauge/benchmark-token-vuln",
    goldenFindings: [
      {
        severity: "critical",
        description:
          "Missing signer check on mint authority — the `authority` field in MintTo is AccountInfo without Signer constraint. Handler checks key match but never verifies is_signer, allowing anyone to pass the authority's pubkey without that key signing the tx.",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [130, 140],
        cwe: "CWE-862",
      },
      {
        severity: "high",
        description:
          "Integer overflow in mint_to — `current_supply + amount` uses unchecked addition that can wrap past max_supply when overflow-checks are disabled.",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [48, 52],
        cwe: "CWE-190",
      },
      {
        severity: "high",
        description:
          "Fake token mint — mint_to updates PDA state but NEVER calls token::mint_to CPI. No real SPL tokens are ever minted; on-chain state is a lie.",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [52, 58],
        cwe: "CWE-710",
      },
      {
        severity: "high",
        description:
          "Fake token transfer — transfer function reads account balances but never calls token::transfer CPI. No actual token movement occurs.",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [65, 85],
        cwe: "CWE-710",
      },
      {
        severity: "high",
        description:
          "Arithmetic underflow in transfer — `from_balance - amount` can underflow if amount exceeds balance. No checked_sub used.",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [76, 78],
        cwe: "CWE-191",
      },
      {
        severity: "high",
        description:
          "Authority can be set to zero address — set_authority accepts any Pubkey including Pubkey::default(). Setting to zero permanently locks token minting.",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [90, 99],
        cwe: "CWE-674",
      },
      {
        severity: "medium",
        description:
          "Unchecked token account deserialization — TransferTokens struct accepts TokenAccount without validating they belong to the correct mint. Attacker can pass any SPL token account.",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [91, 105],
        cwe: "CWE-1287",
      },
      {
        severity: "low",
        description:
          "No event emissions — none of the instructions emit events. Off-chain indexers and monitoring tools cannot detect state changes (mints, transfers, authority changes).",
        file: "programs/token-vuln/src/lib.rs",
        lineRange: [1, 180],
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
    description: `Audit a Solana vault program with SOL deposits, withdrawals, and delegated CPI withdrawals. The vault supports third-party program delegation for withdrawals. The code contains critical CPI reentrancy vectors, client-timestamp manipulation for limit bypass, missing cleanup instructions, and input validation gaps.`,
    codeRepository: "https://github.com/agentgauge/benchmark-vault-reentrancy",
    goldenFindings: [
      {
        severity: "critical",
        description:
          "Arbitrary program CPI enables recursive reentrancy — withdraw_delegated performs a CPI to ANY program matching vault.delegate_program. delegation_active flag is set AFTER the CPI, so recursive calls see it as false. If delegate is set to the vault program itself, attacker drains 4x daily limit via CPI depth recursion.",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [95, 147],
        cwe: "CWE-1283",
      },
      {
        severity: "high",
        description:
          "Delegate program not validated — set_delegate accepts any Pubkey including Pubkey::default() and crate::ID (self). No whitelist. Enables the reentrancy attack above.",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [155, 165],
        cwe: "CWE-863",
      },
      {
        severity: "medium",
        description:
          "Withdrawal limit bypass via client-provided timestamp — current_day is passed as an argument instead of derived from on-chain Clock. Attacker can always pass last_withdrawal_day + 1 to reset the daily counter each tx, achieving unlimited withdrawals.",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [65, 85],
        cwe: "CWE-470",
      },
      {
        severity: "medium",
        description:
          "Missing close vault instruction — no way to close a vault PDA and reclaim rent. SOL is trapped in the vault forever once initialized.",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [1, 250],
        cwe: "CWE-459",
      },
      {
        severity: "medium",
        description:
          "Delegation flag lock — if finalize_delegation is never called, delegation_active stays true forever, permanently blocking all delegated withdrawals. No timeout or auto-reset mechanism.",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [149, 153],
        cwe: "CWE-664",
      },
      {
        severity: "low",
        description:
          "Zero-deposit accepted — deposit() does not validate amount > 0. Zero-SOL transactions waste compute budget with no state change.",
        file: "programs/vault-reentrancy/src/lib.rs",
        lineRange: [27, 44],
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
    description: `Audit a Solana multisig treasury program with M-of-N signers, proposal lifecycle, and CPI-based execution. The program implements proposal creation, approval, and execution with time delays. The code contains 9 vulnerabilities including same-transaction threshold manipulation, proposal replay, client-provided signer weights, clock manipulation, and authorization bypass on proposal closing.`,
    codeRepository: "https://github.com/agentgauge/benchmark-multisig-access",
    goldenFindings: [
      {
        severity: "critical",
        description:
          "Same-transaction threshold manipulation (TOCTOU) — update_threshold can be bundled with approve + execute in one atomic tx. Attacker lowers threshold→approves→executes→restores threshold. External observers see original threshold before and after.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [100, 135],
        cwe: "CWE-367",
      },
      {
        severity: "critical",
        description:
          "Proposal replay via non-atomic executed flag — proposal.executed is set AFTER the CPI transfer. Two execute_proposal instructions for the same proposal in one transaction both read executed=false before either writes, enabling double execution.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [170, 190],
        cwe: "CWE-294",
      },
      {
        severity: "critical",
        description:
          "Signer weight passed as untrusted argument — approve_proposal takes signer_weight as a caller-provided argument instead of reading from on-chain multisig state. Attacker can pass any weight to meet threshold in one approval.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [95, 135],
        cwe: "CWE-807",
      },
      {
        severity: "high",
        description:
          "Validator clock manipulation on execution delay — execute_proposal uses Clock::get() for delay check. Validators can manipulate the clock by ~1-2 seconds, enabling slightly-premature execution.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [160, 170],
        cwe: "CWE-1219",
      },
      {
        severity: "medium",
        description:
          "Unchecked treasury account owner — ExecuteProposal struct has no constraint verifying treasury.owner == multisig.key(). Attacker can pass any token account as treasury; PDA signs the transfer authorization.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [225, 235],
        cwe: "CWE-1287",
      },
      {
        severity: "medium",
        description:
          "Anyone can close proposals — close_proposal has no authorization check. Any signer can close any proposal, enabling censorship of pending transactions.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [230, 240],
        cwe: "CWE-862",
      },
      {
        severity: "medium",
        description:
          "Signer weight can be set to zero — update_signer_weight accepts new_weight=0, silently removing a signer without transparency of explicit removal.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [188, 202],
        cwe: "CWE-682",
      },
      {
        severity: "medium",
        description:
          "Incorrect transfer amount — execute_proposal transfers instruction_data.len() tokens instead of an explicit amount field. The transferred amount equals byte length of instruction data, which is nonsensical.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [173, 182],
        cwe: "CWE-1285",
      },
      {
        severity: "low",
        description:
          "No event emissions — create_multisig and propose_transaction never emit events. Off-chain monitoring and indexers cannot detect multisig creation or new proposals.",
        file: "programs/multisig-access/src/lib.rs",
        lineRange: [1, 350],
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
