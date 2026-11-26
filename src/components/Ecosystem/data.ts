/**
 * "More from Zaions" on the docs site: the rows and approved English words vendored from the ZTools app
 * (`ztools/src/data/ecosystem.json` and its catalogues, GATE 4 OD-035). ZTools itself is never in the roster; `PRODUCTS`
 * filters it again, so either layer alone keeps it out. The docs pages repeat the website's words, so each one names the
 * website's page as its canonical.
 */
import raw from '../../data/ecosystem.json';

export const SELF_PRODUCT_ID = 'ztools';
export const WEB_ORIGIN: string = raw.webOrigin;

export interface EcosystemProduct {
  id: string;
  name: string;
  url: string;
  platforms: string[];
  logo: string;
  card: string;
  title: string;
  intro: string;
  sections: string[][];
}

export const PRODUCTS: EcosystemProduct[] = (raw.products as EcosystemProduct[]).filter((p) => p.id !== SELF_PRODUCT_ID);

const COPY: Record<string, string> = raw.copy;

/** The English lookup with `{name}` style values; a missing key throws, so a page never ships an empty line. */
export function copy(key: string, values: Record<string, string | number> = {}): string {
  let text = COPY[key];
  if (text === undefined) throw new Error(`[ecosystem] missing copy ${key}`);
  for (const [name, value] of Object.entries(values)) text = text.replace(`{${name}}`, String(value));
  return text;
}

/** Our products and the owner's sites are followed links (the link law). */
export const OWN_REL = 'noopener';

/** The live catalogue size, read from the app's tools registry when the roster was vendored. */
export const TOOL_COUNT: number = raw.toolCount;

/** The dated journey on `/about-developer` (sources: `ztools/docs/story/gate4/2026-11-26-ecosystem-about-developer.md`). */
export const JOURNEY_DATES = ['2026-01-15', '2026-05-06', '2026-09-25', '2026-10-03', '2026-10-20', '2026-10-27', '2026-11-05', '2026-11-21', '2026-11-22'];

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC', numberingSystem: 'latn'}).format(new Date(`${iso}T00:00:00Z`));

/** The owner as a Person (`projects-finalization-record/ecosystem/owner-profile.json`). */
export const OWNER_PERSON = {
  '@type': 'Person',
  '@id': 'https://aoneahsan.com/#person',
  name: 'Ahsan Mahmood',
  alternateName: ['Ahsan', 'aoneahsan', 'a1ahsan', 'A1 Ahsan', 'AOne Ahsan'],
  url: 'https://aoneahsan.com',
  jobTitle: 'Founder and developer, Zaions',
  worksFor: {'@type': 'Organization', name: 'Zaions', url: 'https://zaions.com'},
  sameAs: ['https://aoneahsan.com', 'https://zaions.com', 'https://github.com/aoneahsan', 'https://www.linkedin.com/in/aoneahsan'],
};
