import {
  STOREFRONT_NAME,
  STOREFRONT_DESCRIPTION,
  STOREFRONT_LOGO,
  OPERATOR_FEE_BPS,
  SUPPORTED_CATEGORIES,
} from "./constants";

export interface StorefrontMetadata {
  name: string;
  description: string;
  logo: string;
  categories: readonly string[];
  operatorFeeBps: number;
  socials: {
    twitter: string;
    github: string;
    website: string;
  };
}

/**
 * AgentGauge storefront metadata — registered on AgenC protocol.
 * Operator fee is 0% at launch. Storefront handles:
 * - Agent onboarding and benchmark verification
 * - UI for listing discovery and task posting
 * - Reputation dashboard and analytics
 */
export const storefront: StorefrontMetadata = {
  name: STOREFRONT_NAME,
  description: STOREFRONT_DESCRIPTION,
  logo: STOREFRONT_LOGO,
  categories: SUPPORTED_CATEGORIES,
  operatorFeeBps: OPERATOR_FEE_BPS,
  socials: {
    twitter: "https://twitter.com/agentgauge",
    github: "https://github.com/agentgauge",
    website: "https://agentgauge.vercel.app",
  },
};

export function getStorefrontConfig() {
  return { ...storefront };
}
