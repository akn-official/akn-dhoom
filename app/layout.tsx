import type {Metadata} from 'next';
import { Epilogue, Manrope, Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SmoothScroll } from '@/components/smooth-scroll';
import { CustomCursor } from '@/components/custom-cursor';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { PageViewTracker } from '@/components/page-view-tracker';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';
import { WebVitalsReporter } from '@/components/web-vitals-reporter';
import { CookieConsent } from '@/components/cookie-consent';
import { ExitIntentPopup } from '@/components/exit-intent-popup';
import { StickyCta } from '@/components/sticky-cta';
import { BackToTop } from '@/components/back-to-top';
import { ToastProvider } from '@/lib/toast-context';
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Aspire Kinetic Network | Global Digital Growth Studio',
  description: 'A global digital growth studio. We help businesses get found, get followed, and grow — starting with a free website, no strings attached.',
  keywords: ['digital marketing', 'web design', 'local SEO', 'Google Business Profile', 'social media marketing', 'AKN', 'Aspire Kinetic Network', 'digital growth studio'],
  authors: [{ name: 'Aspire Kinetic Network' }],
  openGraph: {
    title: 'Aspire Kinetic Network | Global Digital Growth Studio',
    description: 'Built by builders, not suits. We help businesses get found, get followed, and grow.',
    url: 'https://aspirekineticnetwork.in',
    siteName: 'Aspire Kinetic Network',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aspire Kinetic Network | Global Digital Growth Studio',
    description: 'Built by builders, not suits. We help businesses get found, get followed, and grow.',
  },
  metadataBase: new URL('https://aspirekineticnetwork.in'),
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'AKN Insights' }],
    },
  },
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn("dark", epilogue.variable, manrope.variable, "font-sans", geist.variable)}>
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-PXTSG0915E" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              wait_for_update: 500,
            });
            gtag('config', 'G-PXTSG0915E');
            try {
              if (localStorage.getItem('akn-cookie-consent') === 'accepted') {
                gtag('consent', 'update', { analytics_storage: 'granted' });
              }
            } catch (e) {}
          `}
        </Script>
        {/* Structured Data — LocalBusiness + Services + FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://aspirekineticnetwork.in/#business",
                  "name": "Aspire Kinetic Network",
                  "alternateName": "AKN",
                  "description": "A global digital growth studio helping businesses with web design, SEO, and digital marketing.",
                  "url": "https://aspirekineticnetwork.in",
                  "email": "aspirekineticnetwork@gmail.com",
                  "telephone": ["+919840311092"],
                  "areaServed": "Worldwide",
                  "serviceType": ["Web Design", "Local SEO", "Google Business Profile Management", "Social Media Marketing", "Content Strategy", "Growth Consulting"]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://aspirekineticnetwork.in/#website",
                  "url": "https://aspirekineticnetwork.in",
                  "name": "Aspire Kinetic Network",
                  "publisher": { "@id": "https://aspirekineticnetwork.in/#business" }
                },
                {
                  "@type": "Service",
                  "serviceType": "Web Design & Development",
                  "provider": { "@id": "https://aspirekineticnetwork.in/#business" },
                  "areaServed": "Worldwide",
                  "description": "Custom, mobile-first websites built for conversion. Free for the first five clients."
                },
                {
                  "@type": "Service",
                  "serviceType": "Local SEO",
                  "provider": { "@id": "https://aspirekineticnetwork.in/#business" },
                  "areaServed": "Worldwide",
                  "description": "Rank in local search so nearby customers find your business first."
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Is the free website really free?",
                      "acceptedAnswer": { "@type": "Answer", "text": "Yes. We&apos;re building five free websites for early clients to establish our portfolio. No hidden fees, no upsells, no lock-in." }
                    },
                    {
                      "@type": "Question",
                      "name": "How long does delivery take?",
                      "acceptedAnswer": { "@type": "Answer", "text": "Typically 2—3 weeks from approval of the initial design direction." }
                    },
                    {
                      "@type": "Question",
                      "name": "Who owns the website?",
                      "acceptedAnswer": { "@type": "Answer", "text": "You do. All source code, content, and domain access transfer to you on delivery." }
                    },
                    {
                      "@type": "Question",
                      "name": "Do you work with businesses worldwide?",
                      "acceptedAnswer": { "@type": "Answer", "text": "Yes. AKN works with businesses globally. All engagements can run remotely — async-first, with live calls when needed." }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-manrope bg-background text-foreground antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <CustomCursor />
            <PageViewTracker />
            <WebVitalsReporter />
            <SiteNav />
            <SmoothScroll>
              {children}
              <SiteFooter />
            </SmoothScroll>
            <FloatingWhatsApp />
            <StickyCta />
            <BackToTop />
            <CookieConsent />
            <ExitIntentPopup />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
