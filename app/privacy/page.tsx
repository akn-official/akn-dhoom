import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Aspire Kinetic Network',
  description: 'How Aspire Kinetic Network collects, uses, and protects your personal data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1C] text-zinc-50">
      <section id="main-content" className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#2A8B9D] text-sm font-bold uppercase tracking-widest mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <h1 className="font-epilogue text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-500 mb-12">Last updated: 12 April 2026</p>

          <div className="prose prose-invert max-w-none prose-headings:font-epilogue prose-headings:text-white prose-a:text-[#2A8B9D] prose-strong:text-zinc-200">
            <h2>1. Who We Are</h2>
            <p>
              Aspire Kinetic Network (&ldquo;AKN&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a global digital growth studio.
              This policy explains how we handle personal data collected through{' '}
              <a href="https://aspirekineticnetwork.in">aspirekineticnetwork.in</a>.
            </p>

            <h2>2. Data We Collect</h2>
            <ul>
              <li><strong>Form submissions:</strong> name, phone, email, business name, business type, and any notes you share when requesting a free website or audit.</li>
              <li><strong>Newsletter:</strong> email address and optional name.</li>
              <li><strong>Analytics:</strong> pageviews, device type, approximate location, and Web Vitals (only after you accept cookies).</li>
            </ul>

            <h2>3. How We Use It</h2>
            <ul>
              <li>To respond to your request and deliver the service you asked for.</li>
              <li>To improve the website&apos;s performance and content.</li>
              <li>To send you updates you explicitly subscribed to — you can unsubscribe any time.</li>
            </ul>

            <h2>4. Who We Share It With</h2>
            <p>
              We use Supabase (EU-based infrastructure) to store form submissions and Google Analytics for aggregate traffic data.
              We do not sell your data or share it with advertisers.
            </p>

            <h2>5. How Long We Keep It</h2>
            <p>
              Contact submissions are retained for 24 months. Newsletter subscriptions are kept until you unsubscribe.
              Analytics data is retained per Google&apos;s default (14 months).
            </p>

            <h2>6. Your Rights (DPDPA 2023)</h2>
            <p>Under India&apos;s Digital Personal Data Protection Act, you can:</p>
            <ul>
              <li>Request a copy of your data.</li>
              <li>Ask us to correct or delete it.</li>
              <li>Withdraw consent for analytics cookies at any time by clearing site data.</li>
            </ul>
            <p>Email <a href="mailto:aspirekineticnetwork@gmail.com">aspirekineticnetwork@gmail.com</a> and we&apos;ll respond within 30 days.</p>

            <h2>7. Cookies</h2>
            <p>
              We only set analytics cookies after you click &ldquo;Accept&rdquo; on the consent banner. Essential cookies (form state, language preference) load by default.
            </p>

            <h2>8. Changes</h2>
            <p>
              If this policy changes materially, we&apos;ll update the &ldquo;Last updated&rdquo; date at the top and, for active clients, email a short note explaining what changed.
            </p>

            <h2>9. Contact</h2>
            <p>
              Questions? Email <a href="mailto:aspirekineticnetwork@gmail.com">aspirekineticnetwork@gmail.com</a> or WhatsApp{' '}
              <a href="https://wa.me/919840311092">+91 98403 11092</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
