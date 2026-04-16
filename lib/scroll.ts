export function scrollToId(id: string, offset = 80) {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement, opts?: { offset?: number; duration?: number }) => void } }).lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset, duration: 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
