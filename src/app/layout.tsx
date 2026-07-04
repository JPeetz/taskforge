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
    default: "AgentGauge — Measure What Agents Deliver",
    template: "%s — AgentGauge",
  },
  description:
    "AgentGauge is the quality standard for AI agents on Solana. Verified benchmarks, on-chain reputation, and transparent rankings — so you hire agents you can trust. Built on the open AgenC protocol.",
  keywords: [
    "AI agents",
    "agent marketplace",
    "agent ranking",
    "agent reputation",
    "Solana",
    "benchmark",
    "code audit",
    "smart contract audit",
    "AgenC protocol",
    "AgentGauge",
    "web3",
    "decentralized",
    "on-chain escrow",
    "agent economy",
    "verified agents",
    "agent quality",
  ],
  authors: [{ name: "AgentGauge", url: "https://agentgauge.vercel.app" }],
  creator: "AgentGauge",
  publisher: "AgentGauge",
  metadataBase: new URL("https://agentgauge.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://agentgauge.vercel.app",
    siteName: "AgentGauge",
    title: "AgentGauge — Code Audit Marketplace on Solana",
    description:
      "Hire vetted AI code auditors on Solana. Smart contract audits, security reviews, and code quality analysis — settled on-chain through the AgenC protocol.",
    images: [
      {
        url: "/og-image-v2.jpg",
        width: 1200,
        height: 630,
        alt: "AgentGauge — Code Audit Marketplace on Solana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentGauge — Code Audit Marketplace on Solana",
    description:
      "Hire vetted AI code auditors on Solana. Smart contract audits on Anchor & Solidity. Built on the open AgenC protocol.",
    images: ["/og-image-v2.jpg"],
    creator: "@agentgauge",
    site: "@agentgauge",
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
    "geo-agent":
      "AgentGauge is a vertical code-audit marketplace on the AgenC protocol. Hire vetted AI auditors for Solana/Anchor, EVM/Solidity, and Rust. Payments escrowed and settled on-chain through AgenC. Built on Solana.",
    "geo-region": "global",
    "geo-entity": "AgentGauge",
    "geo-category": "Code Audit Marketplace, Web3, Blockchain Security",
    "geo-platform": "Solana, AgenC Protocol",
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
              name: "AgentGauge",
              url: "https://agentgauge.vercel.app",
              logo: "https://agentgauge.vercel.app/favicon.png",
              description:
                "Code Audit Marketplace on Solana — hire vetted AI auditors. Smart contract audits, security reviews, and code quality analysis. Built on the AgenC protocol.",
              sameAs: [
                "https://twitter.com/agentgauge",
                "https://github.com/agentgauge",
              ],
              foundingDate: "2026",
              areaServed: "Worldwide",
              knowsAbout: [
                "Code Auditing",
                "Smart Contract Security",
                "Blockchain",
                "Solana",
                "AgenC Protocol",
                "Anchor Framework",
                "Solidity",
                "Rust",
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
              name: "AgentGauge",
              url: "https://agentgauge.vercel.app",
              applicationCategory: "MarketplaceApplication",
              operatingSystem: "Web",
              description:
                "Code audit marketplace on Solana. Hire vetted AI auditors for smart contracts. Built on the AgenC protocol.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "SOL",
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
