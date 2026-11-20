/**
 * Every place ZTools is released — the ONLY place a store or surface URL lives in this docs site
 * (standard aoneahsan-cccs-platform-links). Each surface passed its release proof on `verified`:
 * the web app and the Chrome listing answered 200, the Play listing is on the owner's developer page.
 */
export type PlatformId = 'web' | 'android' | 'chrome' | 'docs';

export interface Platform {
  id: PlatformId;
  /** Store or surface name (a proper name, not copy). */
  name: string;
  href: string;
  /** What this surface is for, in ZTools's words. */
  title: string;
  text: string;
  cta: string;
  primary?: boolean;
  verified: string;
}

export const PLATFORMS: readonly Platform[] = [
  {id: 'web', name: 'ZTools web app', href: 'https://ztools.zaions.com', title: 'In your browser', text: 'The full catalogue of text, image, PDF, code and everyday tools, with nothing to install.', cta: 'Open ZTools', primary: true, verified: '2026-11-20'},
  {id: 'android', name: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.zaions.ztools', title: 'On your Android phone', text: 'The same tools on your phone, from Android 8.0.', cta: 'Get it on Google Play', verified: '2026-11-20'},
  {id: 'chrome', name: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/ztools-text-utility-tools/olkionpeobbpgmlfigafppbkniomelle', title: 'In Chrome', text: 'Text tools on a right-click, without leaving the tab.', cta: 'Add to Chrome', verified: '2026-11-20'},
  {id: 'docs', name: 'Documentation', href: 'https://ztools-docs.zaions.com', title: 'These docs', text: 'A guide for each tool, and how ZTools compares.', cta: 'Read the docs', verified: '2026-11-20'},
];

export const APPS_PAGE = {
  title: 'Get ZTools',
  description: 'Every place ZTools is released: the web app, the Android app on Google Play, the Chrome extension, and these docs.',
  lead: 'Use ZTools in the browser you have open, on your Android phone, or from Chrome\'s toolbar, with these guides a tab away.',
} as const;

/** This site is the docs surface. */
export const CURRENT_SURFACE: PlatformId = 'docs';
export const OTHER_PLATFORMS: readonly Platform[] = PLATFORMS.filter((platform) => platform.id !== CURRENT_SURFACE);
export const PRIMARY_PLATFORM: Platform = PLATFORMS.find((platform) => platform.primary) ?? PLATFORMS[0];
export function platformHref(id: PlatformId): string {
  const found = PLATFORMS.find((platform) => platform.id === id);
  if (!found) throw new Error(`Unknown platform: ${id}`);
  return found.href;
}
/** `/apps` changes only when this list does: its sitemap date is the newest proof date. */
export const APPS_LASTMOD: string = PLATFORMS.map((platform) => platform.verified).sort().at(-1) ?? '2026-11-20';
