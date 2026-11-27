/**
 * The build-output SEO contract (SA-P24, P26, P29, P30, P31): the build fails instead of a search console
 * finding it a month later. `yarn build` runs it last (`yarn seo:contract`), on the files GitHub Pages will
 * serve: a separate step, because Docusaurus runs plugins' `postBuild` hooks concurrently and the redirect pages
 * would not exist yet inside one.
 *
 * - `trailingSlash: true`: every page is `<route>/index.html`, so GitHub Pages 301s `/x` to `/x/` and never
 *   404s the slashed form (SA-P26).
 * - Every page: one `<title>`, one description, one self-canonical in the slashed form, no `noindex` except
 *   the 404 page and `/search`; every JSON-LD block parses (SA-P24, P29, P30).
 * - Every `sitemap.xml` URL is slashed and exists in the output.
 * - Every redirect the site promises exists, and lands on a page that exists (SA-P31).
 */
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {type Redirect, seoRedirects} from './seo-redirects.ts';

const PAGE_EXCEPTIONS = new Set(['404.html', 'search/index.html']);

function htmlFiles(dir: string, base = dir): string[] {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full, base);
    return entry.name.endsWith('.html') ? [path.relative(base, full)] : [];
  });
}

const count = (html: string, pattern: RegExp): number => html.match(pattern)?.length ?? 0;
const isRedirectPage = (html: string): boolean => /http-equiv=["']?refresh/i.test(html);

/**
 * Checks one built page against the contract.
 *
 * @param html - the page's HTML
 * @param file - its path relative to the locale's output folder
 * @param siteUrl - the site origin; a canonical on another origin (a page sharing a sister site's words) keeps
 *   that site's URL form, so only same-origin canonicals must be slashed
 * @returns the problems found, empty when the page passes
 */
export function pageProblems(html: string, file: string, siteUrl: string): string[] {
  if (PAGE_EXCEPTIONS.has(file) || isRedirectPage(html)) return [];
  const problems: string[] = [];
  const titles = count(html, /<title[\s>]/g);
  const descriptions = count(html, /<meta[^>]+name=["']?description["']?[\s>/]/g);
  const canonicals = [...html.matchAll(/<link[^>]+rel=["']?canonical["']?[^>]*>/g)];
  if (titles !== 1) problems.push(`${titles} <title> tags`);
  if (descriptions !== 1) problems.push(`${descriptions} meta descriptions`);
  if (canonicals.length !== 1) problems.push(`${canonicals.length} canonicals`);
  const href = /href=["']?([^"'\s>]+)/.exec(canonicals[0]?.[0] ?? '')?.[1] ?? '';
  if (canonicals.length === 1 && href.startsWith(siteUrl) && !href.endsWith('/')) problems.push(`canonical ${href} is not in the slashed form`);
  if (/<meta[^>]+name=["']?robots["']?[^>]+noindex/i.test(html)) problems.push('noindex on a public page');
  for (const [, json] of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json ?? '');
    } catch {
      problems.push('a JSON-LD block does not parse');
    }
  }
  return problems.map((problem) => `${file}: ${problem}`);
}

/**
 * Turns a route into the file GitHub Pages serves for it under `trailingSlash: true`.
 *
 * @param outDir - the locale's output folder
 * @param route - a route such as `/domains/health` or `/`
 * @returns the absolute path of `<route>/index.html`
 */
const servedFile = (outDir: string, route: string): string => path.join(outDir, route.replace(/^\/|\/$/g, ''), 'index.html');

/**
 * Checks one locale's output folder.
 *
 * @param params.outDir - the locale's output folder (`build` for English, `build/<locale>` otherwise)
 * @param params.prefix - the locale's path prefix (`''` or `/fr`)
 * @param params.siteUrl - the site origin
 * @param params.redirects - every redirect the site must serve
 * @param params.skip - top-level folders that belong to other locales
 * @returns the problems found
 */
export function checkLocale({outDir, prefix, siteUrl, redirects, skip}: {
  outDir: string; prefix: string; siteUrl: string; redirects: readonly Redirect[]; skip: ReadonlySet<string>;
}): string[] {
  const problems: string[] = [];
  const files = readdirSync(outDir, {withFileTypes: true}).flatMap((entry) => {
    if (entry.isDirectory()) return skip.has(entry.name) ? [] : htmlFiles(path.join(outDir, entry.name), outDir);
    return entry.name.endsWith('.html') ? [entry.name] : [];
  });
  for (const file of files) {
    const relative = file.split(path.sep).join('/');
    if (!relative.endsWith('index.html') && !PAGE_EXCEPTIONS.has(relative)) {
      problems.push(`${relative}: a page outside <route>/index.html is a 404 for its slashed address`);
    }
    problems.push(...pageProblems(readFileSync(path.join(outDir, file), 'utf8'), relative, siteUrl));
  }
  const sitemap = path.join(outDir, 'sitemap.xml');
  if (existsSync(sitemap)) {
    for (const [, loc = ''] of readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (!loc.startsWith(siteUrl)) continue;
      if (!loc.endsWith('/') && !/\.[a-z]+$/.test(loc)) problems.push(`sitemap: ${loc} is not in the slashed form`);
      const route = loc.slice(siteUrl.length);
      const own = route === prefix || route.startsWith(`${prefix}/`) ? route.slice(prefix.length) : null;
      if (own !== null && !/\.[a-z]+$/.test(own) && !existsSync(servedFile(outDir, own))) problems.push(`sitemap: ${loc} has no page in the output`);
    }
  }
  for (const {to, from} of redirects) {
    if (!existsSync(servedFile(outDir, to))) problems.push(`redirect target ${to} has no page`);
    for (const source of from) {
      const file = servedFile(outDir, source);
      if (!existsSync(file) || !isRedirectPage(readFileSync(file, 'utf8'))) problems.push(`redirect ${source} → ${to} was not written`);
    }
  }
  return problems.map((problem) => `${prefix || '/'} ${problem}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const config = readFileSync(path.join(siteDir, 'docusaurus.config.ts'), 'utf8');
  const siteUrl = /const SITE_URL = '([^']+)'/.exec(config)?.[1] ?? '';
  const problems: string[] = [];
  if (!/^\s*trailingSlash: true,/m.test(config)) problems.push('trailingSlash must be true: GitHub Pages 404s the slashed form otherwise');
  const buildDir = path.join(siteDir, 'build');
  const i18nDir = path.join(siteDir, 'i18n');
  const locales = existsSync(i18nDir) ? readdirSync(i18nDir).filter((locale) => locale !== 'en') : [];
  const builtLocales = locales.filter((locale) => existsSync(path.join(buildDir, locale, 'index.html')));
  const redirects = seoRedirects(siteDir);
  const skip = new Set(locales);
  problems.push(...checkLocale({outDir: buildDir, prefix: '', siteUrl, redirects, skip}));
  for (const locale of builtLocales) {
    problems.push(...checkLocale({outDir: path.join(buildDir, locale), prefix: `/${locale}`, siteUrl, redirects, skip: new Set()}));
  }
  if (problems.length > 0) {
    process.stderr.write(`seo-contract: ${problems.length} problem(s)\n${problems.slice(0, 60).join('\n')}\n`);
    process.exit(1);
  }
  process.stdout.write(`seo-contract: ${1 + builtLocales.length} locale(s) pass\n`);
}
