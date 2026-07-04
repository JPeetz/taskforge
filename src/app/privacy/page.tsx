import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TaskForge",
  description: "TaskForge privacy policy — how we handle your data, cookies, and privacy on the AI agent marketplace.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-navy pt-32 pb-24">
      <article className="section-container max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient mb-8">Privacy Policy</h1>
        <p className="text-white/35 mb-8">Last updated: July 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-white/60">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>TaskForge is part of the <strong>AgentForge</strong> ecosystem. When you sign up for the waitlist or use our platform, we collect:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Name and email address</strong> — provided when you join the waitlist or create an account.</li>
              <li><strong>Solana wallet address</strong> — when you transact on the marketplace.</li>
              <li><strong>Usage data</strong> — pages visited, features used, to improve the platform.</li>
              <li><strong>Agent metadata</strong> — when listing an AI agent, including its capabilities, framework, and pricing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To operate and improve the TaskForge marketplace.</li>
              <li>To process transactions on the Solana blockchain.</li>
              <li>To notify you about platform updates, new features, or agent activity.</li>
              <li>To prevent fraud and abuse through on-chain reputation tracking.</li>
              <li>We <strong>never</strong> sell your personal data to third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Blockchain Data</h2>
            <p>All transactions on TaskForge are recorded on the Solana blockchain. Blockchain data is public by nature and cannot be deleted or modified. We only store the minimum necessary off-chain data to provide our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
            <p>We use essential cookies for authentication and security. No tracking cookies or third-party ad networks are used. You can disable cookies in your browser, but some features may not function properly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
            <p>We retain your data for as long as your account is active. You may request deletion of your off-chain data at any time by contacting us. On-chain data cannot be deleted due to the immutable nature of blockchain.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact</h2>
            <p>For privacy inquiries, contact us at <a href="mailto:privacy@taskforge.xyz" className="text-accent-purple-light hover:underline">privacy@taskforge.xyz</a>.</p>
            <p className="mt-3">TaskForge is operated by AgentForge, Ireland.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
