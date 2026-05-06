/**
 * Third-party analytics + monitoring — runs on every page load.
 *
 * Reads env-driven keys from siteConfig.customFields (set at build time
 * in docusaurus.config.ts from process.env). When a key is empty, the
 * corresponding SDK is NOT initialized — keeps the site usable for forks
 * and local dev where these secrets aren't set.
 *
 * Tools wired here:
 *   - Amplitude  → @amplitude/analytics-browser (product analytics)
 *   - Sentry     → @sentry/react (error monitoring)
 *
 * Microsoft Clarity ships as an inline <script> via headTags (see
 * docusaurus.config.ts). Google Analytics 4 ships via the classic
 * preset's gtag option.
 *
 * Privacy posture:
 *   - All four tools disclosed at /docs/privacy
 *   - IP anonymization on for GA4
 *   - Amplitude default tracking ENABLED but PII fields not captured
 *   - Sentry: no replay, no breadcrumb URLs from form fields
 *
 * Why a clientModule (not a plugin)?
 *   - Plugins are full Docusaurus integrations; we don't need that.
 *   - clientModule is the lightweight pattern for "run this on every page".
 */

import siteConfig from '@generated/docusaurus.config';

type CustomFields = {
  AMPLITUDE_API_KEY?: string;
  SENTRY_DSN?: string;
  CLARITY_PROJECT_ID?: string;
};

const customFields = (siteConfig.customFields ?? {}) as CustomFields;

// SSR guard: client modules can run during build. Skip everything
// browser-only when there's no window.
if (typeof window !== 'undefined') {
  // -------------------------------------------------------------------------
  // Amplitude
  // -------------------------------------------------------------------------
  const amplitudeKey = customFields.AMPLITUDE_API_KEY;
  if (amplitudeKey) {
    import('@amplitude/analytics-browser')
      .then((amplitude) => {
        amplitude.init(amplitudeKey, {
          // Default tracking covers page views + sessions + form
          // interactions. We disable form interactions because the docs
          // site has no forms worth tracking.
          autocapture: {
            attribution: true,
            pageViews: true,
            sessions: true,
            formInteractions: false,
            fileDownloads: true,
            elementInteractions: false,
          },
          // Don't capture IP — privacy
          trackingOptions: {ipAddress: false},
        });
      })
      .catch((err) => {
        // Fail open — broken Amplitude must never break the docs.
        // eslint-disable-next-line no-console
        console.warn('[ztools-docs] Amplitude init failed:', err);
      });
  }

  // -------------------------------------------------------------------------
  // Sentry
  // -------------------------------------------------------------------------
  const sentryDsn = customFields.SENTRY_DSN;
  if (sentryDsn) {
    import('@sentry/react')
      .then((Sentry) => {
        Sentry.init({
          dsn: sentryDsn,
          // Only sample 10% of transactions to stay within free tier.
          tracesSampleRate: 0.1,
          // No session replay — privacy + bundle size.
          replaysSessionSampleRate: 0,
          replaysOnErrorSampleRate: 0,
          // Strip URL search/hash from breadcrumbs — they may contain
          // user-typed text in search box.
          beforeBreadcrumb(breadcrumb) {
            if (breadcrumb.category === 'navigation' && breadcrumb.data?.to) {
              try {
                const u = new URL(breadcrumb.data.to as string, window.location.origin);
                breadcrumb.data.to = u.pathname;
              } catch {
                /* ignore malformed URL */
              }
            }
            return breadcrumb;
          },
          // Drop PII headers / cookies from any captured request.
          sendDefaultPii: false,
        });
      })
      .catch((err) => {
        // Fail open — broken Sentry must never break the docs.
        // eslint-disable-next-line no-console
        console.warn('[ztools-docs] Sentry init failed:', err);
      });
  }
}
