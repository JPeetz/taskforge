import React from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface IconProps {
  className?: string;
  size?: number;
}

function dim(size?: number) {
  return size ?? 24;
}

// ── Wrapper ────────────────────────────────────────────────────────────────

const IconWrap: React.FC<IconProps & { children: React.ReactNode }> = ({
  size,
  className,
  children,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={dim(size)}
    height={dim(size)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

// ── 1. RobotAgent ──────────────────────────────────────────────────────────

export const RobotAgent: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    {/* head */}
    <rect x="7" y="7" width="10" height="10" rx="4" />
    {/* antenna */}
    <line x1="12" y1="3" x2="12" y2="7" />
    <circle cx="12" cy="2.5" r="1" fill="currentColor" stroke="none" />
    {/* eyes */}
    <circle cx="9.5" cy="11" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.5" cy="11" r="1" fill="currentColor" stroke="none" />
    {/* mouth */}
    <line x1="10" y1="14.5" x2="14" y2="14.5" />
  </IconWrap>
);

// ── 2. Task ────────────────────────────────────────────────────────────────

export const Task: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    {/* document / clipboard */}
    <path d="M14 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7l-4-5Z" />
    <path d="M14 2v5h5" />
    {/* checkmarks */}
    <polyline points="9,13 11,15 15,10" />
  </IconWrap>
);

// ── 3. Competition ─────────────────────────────────────────────────────────

export const Competition: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    {/* left chevron / racer */}
    <polyline points="14,5 7,12 14,19" />
    {/* right chevron / racer */}
    <polyline points="10,5 17,12 10,19" />
  </IconWrap>
);

// ── 4. CheckCircle ─────────────────────────────────────────────────────────

export const CheckCircle: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="8,12 11,15 16,9" />
  </IconWrap>
);

// ── 5. Zap ─────────────────────────────────────────────────────────────────

export const Zap: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
  </IconWrap>
);

// ── 6. Coins ───────────────────────────────────────────────────────────────

export const Coins: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    {/* bottom coin */}
    <ellipse cx="12" cy="17.5" rx="8" ry="2.5" />
    <path d="M4 17.5v2c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-2" />
    {/* top coin */}
    <ellipse cx="12" cy="7.5" rx="8" ry="2.5" />
    <path d="M4 7.5v2c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-2" />
    {/* dollar sign */}
    <line x1="12" y1="5" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="19" />
    <path d="M10 9.5h2.5a1.5 1.5 0 0 1 0 3h-1a1.5 1.5 0 0 0 0 3H14" />
  </IconWrap>
);

// ── 7. Shield ──────────────────────────────────────────────────────────────

export const Shield: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10Z" />
    <polyline points="9,12 11,14 15,10" />
  </IconWrap>
);

// ── 8. Wallet ──────────────────────────────────────────────────────────────

export const Wallet: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <path d="M19 7H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-1" />
    <path d="M17 14.5h3.5" />
    <circle cx="18" cy="14.5" r="1.8" />
  </IconWrap>
);

// ── 9. Network ─────────────────────────────────────────────────────────────

export const Network: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="12" cy="18" r="2" />
    <line x1="7.3" y1="7.7" x2="10.7" y2="16.3" />
    <line x1="16.7" y1="7.7" x2="13.3" y2="16.3" />
    <line x1="6" y1="8" x2="18" y2="8" />
  </IconWrap>
);

// ── 10. StarBadge ──────────────────────────────────────────────────────────

export const StarBadge: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="12,5 14.5,10 20,10.5 15.5,14.5 16.5,20 12,17 7.5,20 8.5,14.5 4,10.5 9.5,10" />
  </IconWrap>
);

// ── 11. Mail ───────────────────────────────────────────────────────────────

export const Mail: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <polyline points="3,5 12,14 21,5" />
  </IconWrap>
);

// ── 12. ArrowRight ─────────────────────────────────────────────────────────

export const ArrowRight: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <line x1="4" y1="12" x2="19" y2="12" />
    <polyline points="14,7 19,12 14,17" />
  </IconWrap>
);

// ── 13. Search ─────────────────────────────────────────────────────────────

export const Search: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
  </IconWrap>
);

// ── 14. Code ───────────────────────────────────────────────────────────────

export const Code: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <polyline points="8,5 2,12 8,19" />
    <polyline points="16,5 22,12 16,19" />
  </IconWrap>
);

// ── 15. Globe ──────────────────────────────────────────────────────────────

export const Globe: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="4" ry="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a14 14 0 0 1 0 20" />
    <path d="M12 2a14 14 0 0 0 0 20" />
  </IconWrap>
);

// ── 16. Sparkle ────────────────────────────────────────────────────────────

export const Sparkle: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
  </IconWrap>
);

// ── 17. Clock ──────────────────────────────────────────────────────────────

export const Clock: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </IconWrap>
);

// ── 18. Users ──────────────────────────────────────────────────────────────

export const Users: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    {/* person 1 (left) */}
    <circle cx="9" cy="8" r="3" />
    <path d="M3 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
    {/* person 2 (right, behind) */}
    <circle cx="17" cy="10" r="2.5" />
    <path d="M12 21v-1a4 4 0 0 1 3-3.8" />
  </IconWrap>
);

// ── 19. TrendingUp ─────────────────────────────────────────────────────────

export const TrendingUp: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <polyline points="2,18 7,12 10,14 15,8 18,10 22,5" />
    <polyline points="18,5 22,5 22,9" />
  </IconWrap>
);

// ── 20. Menu (Mobile Nav) ──────────────────────────────────────────────────

export const MenuOpen: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </IconWrap>
);

export const MenuClose: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </IconWrap>
);

// ── 21. Solana ─────────────────────────────────────────────────────────────

export const Solana: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    {/* stylised abstract S / flow representing Solana */}
    <circle cx="12" cy="12" r="10" />
    <path d="M7.5 16 9 8l3 4 3-4 1.5 8" />
    <path d="M6.5 9 12 12l5.5-3" />
    <path d="M7 16l5-3 5 3" />
  </IconWrap>
);

// ── 22. USDC ───────────────────────────────────────────────────────────────

export const USDC: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 4v2" />
    <path d="M12 18v2" />
    <path d="M7.5 9.5A2.5 2.5 0 0 1 10 7h4a2.5 2.5 0 0 1 0 5h-4a2.5 2.5 0 1 0 0 5h4a2.5 2.5 0 0 0 2.5-2.5" />
  </IconWrap>
);

// ── 23. Forge (Brand Mark) ─────────────────────────────────────────────────

export const Forge: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    {/* anvil */}
    <path d="M6 20h12" />
    <path d="M8 20V10l2-5h4l2 5v10" />
    {/* hammer */}
    <path d="M21 2l-5 5" />
    <path d="M13 7h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2l-4-3Z" />
    <line x1="13" y1="7" x2="8.5" y2="20" />
  </IconWrap>
);

// ── 24. ExternalLink ───────────────────────────────────────────────────────

export const ExternalLink: React.FC<IconProps> = (props) => (
  <IconWrap {...props}>
    <path d="M17 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </IconWrap>
);

// ── Lookup Object ──────────────────────────────────────────────────────────

export const iconSet = {
  RobotAgent,
  Task,
  Competition,
  CheckCircle,
  Zap,
  Coins,
  Shield,
  Wallet,
  Network,
  StarBadge,
  Mail,
  ArrowRight,
  Search,
  Code,
  Globe,
  Sparkle,
  Clock,
  Users,
  TrendingUp,
  MenuOpen,
  MenuClose,
  Solana,
  USDC,
  Forge,
  ExternalLink,
} as const;

export type IconName = keyof typeof iconSet;
