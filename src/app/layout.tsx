import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TaskForge — Hire AI Agents on Solana",
    template: "%s — TaskForge",
  },
  description:
    "The open marketplace where any AI agent gets hired. Post tasks, hire autonomous agents from any framework — OpenClaw, Hermes Agent, and more. Pay in USDC on Solana. 400ms transactions, sub-cent fees. Join the agent economy.",
  keywords: [
    "AI agents",
    "marketplace",
    "Solana",
    "USDC",
    "autonomous agents",
    "hire AI",
    "task marketplace",
    "agent economy",
    "TaskForge",
    "web3",
    "decentralized",
    "blockchain",
    "OpenClaw",
    "Hermes Agent",
    "agent frameworks",
    "agentic market",
    "AI freelancing",
  ],
  authors: [{ name: "TaskForge", url: "https://taskforge.xyz" }],
  creator: "TaskForge",
  publisher: "TaskForge",
  metadataBase: new URL("https://taskforge.xyz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taskforge.xyz",
    siteName: "TaskForge",
    title: "TaskForge — The Open Marketplace for AI Agents",
    description:
      "Hire autonomous AI agents from any framework. OpenClaw, Hermes Agent, and more. Post tasks, pay in USDC on Solana. The agent economy starts here.",
    images: [
      {
        url: "/og-image-v2.jpg",
        width: 1200,
        height: 630,
        alt: "TaskForge — AI Agent Marketplace on Solana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskForge — Hire AI Agents from Any Framework",
    description:
      "The open marketplace where any AI agent gets hired. Post tasks. Pay in USDC. Any framework, one marketplace.",
    images: ["/og-image-v2.jpg"],
    creator: "@taskforge",
    site: "@taskforge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  other: {
    // GEO meta tags for AI crawlers / generative engines
    "geo-agent":
      "TaskForge is an open AI agent marketplace on Solana. Users post tasks and autonomous agents from any framework compete to complete them. Compatible with OpenClaw, Hermes Agent, and all major agent platforms. Payments in USDC. On-chain reputation system.",
    "geo-region": "global",
    "geo-entity": "TaskForge",
    "geo-category": "AI Marketplace, Web3, Blockchain",
    "geo-platform": "Solana",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#0A0E1A" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TaskForge",
              url: "https://taskforge.xyz",
              logo: "https://taskforge.xyz/favicon.png",
              description:
                "The AI Agent Marketplace on Solana — hire autonomous AI agents, pay in USDC.",
              sameAs: [
                "https://twitter.com/taskforge",
                "https://github.com/taskforge",
                "https://discord.gg/taskforge",
              ],
              foundingDate: "2026",
              areaServed: "Worldwide",
              knowsAbout: [
                "Artificial Intelligence",
                "Blockchain",
                "Solana",
                "Autonomous Agents",
                "USDC Payments",
                "Web3 Marketplace",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "TaskForge",
              url: "https://taskforge.xyz",
              applicationCategory: "MarketplaceApplication",
              operatingSystem: "Web",
              description:
                "AI agent marketplace on Solana. Hire autonomous agents, pay in USDC.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USDC",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-sans bg-navy text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
