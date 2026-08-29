// Advanced Meta Pixel Event & Behavioral Tracking
// Prevents duplicate pageviews, captures high-intent interactions (scroll depth, section visibility, video plays, form interactions, CTA clicks, UTMs, and device info)

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    _metaPageViewTracked?: boolean;
    _trackedEventsSet?: Set<string>;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '1017050918046609';

// Safe consent verification
export function isConsentGranted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('cookie_consent') !== 'denied';
}

// Get UTM parameters and referrer context for richer ad targeting
export function getTrafficContext(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const context: Record<string, string> = {};

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    utmKeys.forEach(k => {
      const val = params.get(k);
      if (val) context[k] = val;
    });

    if (document.referrer) {
      context.referrer = document.referrer.substring(0, 200);
    }
    context.device = window.innerWidth <= 768 ? 'mobile' : 'desktop';
    context.screen_res = `${window.screen.width}x${window.screen.height}`;
    return context;
  } catch {
    return {};
  }
}

// Initialize Meta Pixel without duplicating PageView
export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  if (!isConsentGranted()) return;
  if (!PIXEL_ID) return;

  if (window.fbq && !window._metaPageViewTracked) {
    trackMetaPageView();
    return;
  }

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

  if (window.fbq && !window._metaPageViewTracked) {
    try {
      window.fbq('init', PIXEL_ID);
      trackMetaPageView();
    } catch (e) {
      console.warn('Meta Pixel Init error:', e);
    }
  }
}

// De-duplicated PageView Tracker
export function trackMetaPageView(): void {
  if (typeof window === 'undefined') return;
  if (window._metaPageViewTracked) return; // Prevent duplicates in single session

  if (window.fbq) {
    try {
      window.fbq('track', 'PageView', {
        page_title: document.title,
        page_path: window.location.pathname,
        ...getTrafficContext(),
      });
      window._metaPageViewTracked = true;
    } catch (e) {
      console.warn('Meta Pixel PageView error:', e);
    }
  }
}

// Track custom/standard events safely with deduplication
export function trackCustomEvent(eventName: string, data?: Record<string, any>, dedupeKey?: string): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  if (!window._trackedEventsSet) {
    window._trackedEventsSet = new Set<string>();
  }

  if (dedupeKey) {
    if (window._trackedEventsSet.has(dedupeKey)) return;
    window._trackedEventsSet.add(dedupeKey);
  }

  try {
    window.fbq('trackCustom', eventName, {
      ...data,
      ...getTrafficContext(),
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.warn(`Meta Pixel custom event ${eventName} error:`, e);
  }
}

// Standard Lead tracking (High value conversion event)
export function trackMetaLead(customData?: Record<string, any>): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  try {
    window.fbq('track', 'Lead', {
      content_name: 'Orcamento Tattoo Autoral',
      currency: 'BRL',
      ...getTrafficContext(),
      ...customData,
    });
  } catch (e) {
    console.warn('Meta Pixel Lead tracking error:', e);
  }
}

// Standard Contact tracking (WhatsApp, Phone, Direct Links)
export function trackMetaContact(method: string = 'WhatsApp', locationInfo?: string): void {
  if (typeof window === 'undefined' || !window.fbq) return;

  try {
    window.fbq('track', 'Contact', {
      content_name: method,
      content_category: 'Direct Messaging',
      click_location: locationInfo || 'Unknown',
      ...getTrafficContext(),
    });
  } catch (e) {
    console.warn('Meta Pixel Contact tracking error:', e);
  }
}

// Track Form Initiation / Start Filling (Valuable mid-funnel event)
export function trackMetaInitiateForm(stepName: string = 'Start'): void {
  trackCustomEvent('FormInteraction', { step: stepName }, `form_step_${stepName}`);
}

// Track Section Engagement / High Interest Depth
export function trackSectionView(sectionName: string): void {
  trackCustomEvent('SectionView', { section: sectionName }, `section_${sectionName}`);
}

// Track Video View / Engagement
export function trackVideoPlay(videoTitle: string): void {
  trackCustomEvent('VideoPlay', { video: videoTitle }, `video_${videoTitle}`);
}

// Track High Intent Clicks (Portfolio image inspection, Pricing table open, etc.)
export function trackUserAction(actionName: string, label?: string): void {
  trackCustomEvent('UserInteraction', { action: actionName, label: label || '' });
}
