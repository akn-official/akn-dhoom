const STORAGE_KEY = 'akn-utm';
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export type UtmPayload = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
};

const EMPTY: UtmPayload = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  referrer: null,
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function captureUtm(): UtmPayload {
  if (!isBrowser()) return EMPTY;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl: UtmPayload = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
      referrer: document.referrer || null,
    };
    const hasUtm = Object.entries(fromUrl).some(([k, v]) => k.startsWith('utm_') && v);

    if (hasUtm) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), ...fromUrl }));
      } catch {
        // ignore
      }
      return fromUrl;
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UtmPayload & { ts: number };
        if (Date.now() - (parsed.ts || 0) < TTL_MS) {
          const { ts: _ts, ...rest } = parsed;
          return { ...EMPTY, ...rest, referrer: document.referrer || rest.referrer || null };
        }
      }
    } catch {
      // ignore
    }

    return { ...EMPTY, referrer: document.referrer || null };
  } catch {
    return EMPTY;
  }
}
