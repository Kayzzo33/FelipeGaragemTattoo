// Meta Pixel integration with strict LGPD consent checking

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';

export function isConsentGranted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('cookie_consent') === 'granted';
}

export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  if (!isConsentGranted()) return;
  if (!PIXEL_ID) return;

  // Prevent multiple initializations
  if (window.fbq) {
    window.fbq('track', 'PageView');
    return;
  }

  // Base Meta Pixel Script
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  if (window.fbq) {
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

export function trackMetaLead(customData?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  if (!isConsentGranted()) return;

  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'Orcamento Tattoo',
      currency: 'BRL',
      ...customData,
    });
  }
}

export function trackMetaPageView(): void {
  if (typeof window === 'undefined') return;
  if (!isConsentGranted()) return;

  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
}
