import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Aspire Kinetic Network',
  description: 'The terms that govern your use of the Aspire Kinetic Network website and services.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-500 mb-12">Last updated: 12 April 2026</p>

          <div className="prose prose-invert max-w-none prose-headings:font-epilogue prose-headings:text-white prose-a:text-[#2A8B9D] prose-strong:text-zinc-200">
            <h2>1. Acceptance</h2>
            <p>
              By using <a href="https://aspirekineticnetwork.in">aspirekineticnetwork.in</a> or engaging AKN for services, you agree to these terms.
              If you don&apos;t, please don&apos;t use the site.
            </p>

            <h2>2. Our Services</h2>
            <p>
              AKN offers web design, local SEO, Google Business Profile management, social media strategy, content, and growth consulting.
              Scope, timeline, and deliverables for paid work are defined in a separate engagement agreement.
            </p>

            <h2>3. Free Website Program</h2>
            <p>We&apos;re building five free websites for early clients to start our portfolio. Terms:</p>
            <ul>
              <li>Eligibility is at AKN&apos;s discretion based on fit.</li>
              <li>You own the final website and its content.</li>
              <li>We may display the work publicly as part of our portfolio.</li>
              <li>Hosting, domain, and third-party tools remain your responsibility after handover.</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              The AKN brand, logo, and original site content are ours. Client work deliverables transfer to the client on final delivery and payment.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Scrape, reverse-engineer, or overload our site or APIs.</li>
              <li>Submit false information through our forms.</li>
              <li>Use our services to promote illegal activity, spam, or harassment.</li>
            </ul>

            <h2>6. Liability</h2>
            <p>
              We do our best work, but we can&apos;t guarantee specific outcomes like rankings, traffic, or revenue — these depend on many factors outside our control.
              AKN is not liable for indirect or consequential losses arising from use of the site.
            </p>

            <h2>7. Governing Law</h2>
            <p>These terms are governed by the laws of India. Disputes are subject to the jurisdiction of competent courts in India.</p>

            <h2>8. Changes</h2>
            <p>
              We may update these terms; material changes will be reflected in the &ldquo;Last updated&rdquo; date at the top.
              Continued use after changes means you accept them.
            </p>

            <h2>9. Contact</h2>
            <p>
              Questions? Email <a href="mailto:aspirekineticnetwork@gmail.com">aspirekineticnetwork@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
