type GAParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: GAParams = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === 'function') {
    w.gtag('event', name, params);
  }
}

export const events = {
  claimFormView: () => trackEvent('claim_form_view'),
  claimFormSubmit: (businessType?: string) =>
    trackEvent('generate_lead', { lead_type: 'free_website', business_type: businessType ?? 'unknown' }),
  auditFormSubmit: () => trackEvent('generate_lead', { lead_type: 'free_audit' }),
  heroCtaClick: () => trackEvent('cta_click', { location: 'hero', target: 'claim' }),
  navCtaClick: () => trackEvent('cta_click', { location: 'nav', target: 'claim' }),
  whatsappClick: (location: string) => trackEvent('whatsapp_click', { location }),
  newsletterSubmit: () => trackEvent('newsletter_subscribe'),
  outboundLink: (url: string) => trackEvent('outbound_click', { url }),
};
