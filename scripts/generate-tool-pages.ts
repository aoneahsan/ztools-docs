/**
 * Generates one MDX file per enriched ZTools tool by reading the existing
 * `src/data/toolContent/batch*.ts` from the sibling ztools project.
 *
 * Single source of truth: the ZTools app data files. This script consumes
 * them and emits Docusaurus MDX so we never duplicate content between
 * the two projects.
 *
 * Tool identity (name, category, and above all the tool's real URL) comes
 * from `../ztools/dist/tools-registry.json`, which the app's build emits from
 * its own catalog. A tool's address is its `route`, never `/<id>` — the two
 * differ for many tools, and linking by id sends readers to a 404.
 *
 * Coverage is automatic: every registry tool with enriched content gets a
 * page. The run fails when content has no registry row or when a tool's
 * route has no built page in the app, so a wrong link cannot be published.
 */

import {readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/** A category id as a heading word: acronyms stay upper case ("PDF tools", "SEO tools"). */
const ACRONYMS = new Set(['pdf', 'seo']);
const categoryLabel = (cat: string): string =>
  ACRONYMS.has(cat) ? cat.toUpperCase() : `${cat[0].toUpperCase()}${cat.slice(1)}`;

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DOCS_ROOT = join(__dirname, '..', 'docs');
const ZTOOLS_REPO = join(__dirname, '..', '..', 'ztools');
const ZTOOLS_DATA = join(ZTOOLS_REPO, 'src', 'data', 'toolContent');
const ZTOOLS_DIST = join(ZTOOLS_REPO, 'dist');
const ZTOOLS_REGISTRY = join(ZTOOLS_DIST, 'tools-registry.json');
const APP_URL = 'https://ztools.zaions.com';

// ---------------------------------------------------------------------------
// Types mirror the ToolContent shape from the ztools app data files.
// ---------------------------------------------------------------------------
type UseCase = {title: string; body: string};
type Step = {step: string; detail: string};
type Example = {input: string; output: string};
type Faq = {q: string; a: string};

interface ToolContent {
  distinctTitle: string;
  distinctDescription: string;
  intro: string;
  useCases: UseCase[];
  howItWorks: Step[];
  examples: Example[];
  faq: Faq[];
  tips: string[];
  keywords: string[];
  lastUpdated: string;
  author: string;
}

type ToolMeta = {
  id: string;
  name: string;
  category: string;
  description?: string;
  route: string;
  isPaid: boolean;
  usesServer: boolean;
};

interface RegistryTool {
  id: string;
  title: string;
  description?: string;
  category: string;
  route: string;
  isPaid?: boolean;
  usesServer?: boolean;
}

// ---------------------------------------------------------------------------
// Load all enriched content via dynamic ESM imports.
// ---------------------------------------------------------------------------
async function loadContent(): Promise<Record<string, ToolContent>> {
  const merged: Record<string, ToolContent> = {};
  // Discover every batch*.ts dynamically so a new content batch in the app is
  // picked up automatically — no hardcoded count to drift out of date.
  const files = readdirSync(ZTOOLS_DATA)
    .filter((f) => /^batch\d+\.ts$/.test(f))
    .sort();

  for (const file of files) {
    const path = join(ZTOOLS_DATA, file);
    if (!existsSync(path)) continue;
    const mod = await import(path);
    const exportKey = Object.keys(mod).find((k) => k.endsWith('_CONTENT'));
    if (!exportKey) continue;
    Object.assign(merged, mod[exportKey]);
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Read tool identity from the app's built registry.
// ---------------------------------------------------------------------------
function loadToolMeta(): Record<string, ToolMeta> {
  if (!existsSync(ZTOOLS_REGISTRY)) {
    throw new Error(
      `Missing ${ZTOOLS_REGISTRY}. Run \`yarn build\` in ../ztools first — the registry is a build output.`,
    );
  }
  const registry = JSON.parse(readFileSync(ZTOOLS_REGISTRY, 'utf-8')) as {tools: RegistryTool[]};
  const meta: Record<string, ToolMeta> = {};
  for (const t of registry.tools) {
    meta[t.id] = {
      id: t.id,
      name: t.title,
      category: t.category,
      description: t.description,
      route: t.route,
      isPaid: Boolean(t.isPaid),
      usesServer: Boolean(t.usesServer),
    };
  }
  return meta;
}

/** True when the app's build contains a prerendered page for this route. */
function routeIsBuilt(route: string): boolean {
  const rel = route.replace(/^\/+|\/+$/g, '');
  return (
    /^\/[a-z0-9][a-z0-9\-/]*$/.test(route) &&
    (existsSync(join(ZTOOLS_DIST, `${rel}.html`)) || existsSync(join(ZTOOLS_DIST, rel, 'index.html')))
  );
}

// ---------------------------------------------------------------------------
// MDX-safe escaping. MDX is parsed as Markdown + JSX so:
//   - braces { } need escaping to avoid JSX interpretation
//   - quotes inside front-matter strings need escaping
// ---------------------------------------------------------------------------
// Escape characters MDX-3 interprets as JSX or Markdown structures:
//   { } start expressions; < starts a tag; > ends a tag;
//   ![alt](url) is Markdown image — escape the `!`;
//   ](url) is the Markdown-link tail; escape `](` so prose like
//     "[link](url)" used illustratively stays literal text.
//   Intentional links live OUTSIDE escapeMdx in the generator template,
//   so they survive this escape unaffected.
const escapeMdx = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/!\[/g, '\\![')
    .replace(/\]\(/g, '\\]\\(');
const yamlString = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

// ---------------------------------------------------------------------------
// Render one tool as MDX.
// ---------------------------------------------------------------------------
function renderToolMdx(id: string, content: ToolContent, meta: ToolMeta): string {
  const url = `${APP_URL}${meta.route}`;
  const ghEdit = `https://github.com/aoneahsan/ztools-docs/edit/main/docs/tools/${meta.category}/${id}.mdx`;

  const useCases = content.useCases
    .map((uc) => `### ${escapeMdx(uc.title)}\n\n${escapeMdx(uc.body)}`)
    .join('\n\n');

  const steps = content.howItWorks
    .map((s, i) => `${i + 1}. **${escapeMdx(s.step)}** — ${escapeMdx(s.detail)}`)
    .join('\n');

  const examples = content.examples
    .map(
      (ex) =>
        `**Input:** ${escapeMdx(ex.input)}\n\n**Output:** ${escapeMdx(ex.output)}`,
    )
    .join('\n\n---\n\n');

  const faqs = content.faq
    .map((f) => `<details>\n<summary>**${escapeMdx(f.q)}**</summary>\n\n${escapeMdx(f.a)}\n\n</details>`)
    .join('\n\n');

  const tips = content.tips.map((t) => `- ${escapeMdx(t)}`).join('\n');

  const paidNotice = meta.isPaid
    ? `\n:::info Growth Suite\n${meta.name} is part of Growth Suite. Sign in to see its current allowance and any connection or provider key it needs. Limits vary by plan; a limited Free plan is available.\n:::\n`
    : '';
  const tryItBody = meta.isPaid
    ? `Open ${meta.name} at **[${url}](${url})**. Sign in to check its allowance and setup requirements.`
    : meta.usesServer
      ? `Open ${meta.name} at **[${url}](${url})**. This tool may send input to a server for processing.`
      : `Open ${meta.name} at **[${url}](${url})** to use the tool.`;

  return `---
id: ${id}
title: ${yamlString(content.distinctTitle)}
description: ${yamlString(content.distinctDescription)}
sidebar_label: ${yamlString(meta.name)}
keywords:
${content.keywords.map((k) => `  - ${yamlString(k)}`).join('\n')}
last_update:
  date: ${content.lastUpdated}
  author: ${content.author}
---

import ToolCTA from '@site/src/components/ToolCTA';

# ${meta.name}

${escapeMdx(content.intro)}
${paidNotice}
<ToolCTA href="${url}" toolName=${yamlString(meta.name)} kind="${meta.isPaid ? 'paid' : meta.usesServer ? 'server' : 'browser'}" />

## Use cases

${useCases}

## How it works

${steps}

## Examples

${examples}

## Frequently asked questions

${faqs}

## Tips

${tips}

## Try it now

${tryItBody}

[Open the tool ↗](${url})

---

*Last updated: ${content.lastUpdated} · Author: ${content.author} · [Edit this page on GitHub](${ghEdit})*
`;
}

// ---------------------------------------------------------------------------
// Render the tools/index.mdx hub.
// ---------------------------------------------------------------------------
function renderHub(byCategory: Map<string, Array<{id: string; meta: ToolMeta}>>): string {
  const sections = Array.from(byCategory.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, tools]) => {
      const items = tools
        .map(
          (t) =>
            `- [**${t.meta.name}**](/docs/tools/${cat}/${t.id}) — ${(t.meta.description ?? '').replace(/\n/g, ' ').trim()}`,
        )
        .join('\n');
      return `## ${categoryLabel(cat)}\n\n${items}`;
    })
    .join('\n\n');

  const total = Array.from(byCategory.values()).reduce((n, t) => n + t.length, 0);
  const catCount = byCategory.size;
  const hasGrowth = byCategory.has('growth');

  return `---
id: index
title: ${yamlString(`Explore ZTools — ${total} tools in ${catCount} categories`)}
description: ${yamlString(`Browse ${total} ZTools tools across ${catCount} categories. Many work in your browser; some use a server or provider. Growth tools require sign-in and have plan limits.`)}
sidebar_label: All tools
sidebar_position: 0
slug: /tools
---

# Explore ZTools

A different site for each small job adds up. Find your next tool in a catalog of ${total} tools across ${catCount} categories, with use cases, examples, and FAQs for each one. Many tools work in your browser; others use a server or provider to process a request.${hasGrowth ? ` Growth Suite brings SEO, analytics, and AI tools into the same catalog. Sign in to check each tool's allowance and setup; some AI actions offer a shared daily allowance or a choice to use your own provider key.` : ''}

${sections}

---

[Open the app](${APP_URL}) · [GitHub](https://github.com/aoneahsan/ztools-docs)
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('▸ Loading content from ztools project...');
  const allContent = await loadContent();
  const meta = loadToolMeta();
  console.log(`  ${Object.keys(allContent).length} enriched tools available`);
  console.log(`  ${Object.keys(meta).length} tools with metadata\n`);

  const toolsDir = join(DOCS_ROOT, 'tools');

  const byCategory = new Map<string, Array<{id: string; meta: ToolMeta}>>();
  let written = 0;

  // Gates run before anything is written, so a failed run changes nothing.
  const orphanContent = Object.keys(allContent).filter((id) => !meta[id]);
  const unbuiltRoutes = Object.values(meta).filter((m) => !routeIsBuilt(m.route));
  const noContent = Object.keys(meta).filter((id) => !allContent[id]);
  if (noContent.length > 0) {
    console.warn(`  ⚠ ${noContent.length} registry tool(s) have no enriched content and get no page: ${noContent.join(', ')}`);
  }
  if (orphanContent.length > 0 || unbuiltRoutes.length > 0) {
    for (const id of orphanContent) console.error(`  ✗ content for "${id}" has no registry row`);
    for (const m of unbuiltRoutes) console.error(`  ✗ "${m.id}" links to ${m.route}, which the app build does not contain`);
    throw new Error('Link gate failed — no page was written.');
  }

  if (existsSync(toolsDir)) rmSync(toolsDir, {recursive: true, force: true});
  mkdirSync(toolsDir, {recursive: true});

  // Every enriched tool in the registry gets a page — no allowlist.
  for (const id of Object.keys(allContent).sort()) {
    const content = allContent[id];
    const m = meta[id];

    const dir = join(toolsDir, m.category);
    mkdirSync(dir, {recursive: true});
    const file = join(dir, `${id}.mdx`);
    writeFileSync(file, renderToolMdx(id, content, m), 'utf-8');

    const list = byCategory.get(m.category) ?? [];
    list.push({id, meta: m});
    byCategory.set(m.category, list);
    written++;
  }

  // Per-category index pages
  for (const [cat, tools] of byCategory) {
    // Use absolute slug paths — relative paths break because the category
    // index URL has no trailing slash so `./tool-id` collapses one level.
    const items = tools.map((t) => `- [${t.meta.name}](/docs/tools/${cat}/${t.id}) — ${(t.meta.description ?? '').trim().slice(0, 100).trimEnd()}`).join('\n');
    const indexFile = join(toolsDir, cat, 'index.mdx');
    writeFileSync(
      indexFile,
      `---
id: index
title: ${yamlString(`${categoryLabel(cat)} tools — ZTools`)}
description: ${yamlString(cat === 'growth' ? 'Browse ZTools Growth Suite tools for SEO, analytics, and AI. Sign-in and plan limits apply.' : `Browse ZTools ${cat} tools, with use cases and examples for each one.`)}
sidebar_label: ${yamlString(`${categoryLabel(cat)} tools`)}
sidebar_position: 0
slug: /tools/${cat}
---

# ${categoryLabel(cat)} tools

${cat === 'growth' ? ":::info Growth Suite\nGrowth Suite tools require a ZTools account and have plan limits. Some AI actions offer a shared daily allowance or a choice to use your own provider key. Other tools use external data services, so input handling varies by action.\n:::\n\n" : ''}${tools.length} tool${tools.length === 1 ? '' : 's'} in this category.

${items}
`,
      'utf-8',
    );
  }

  // Top-level tools/index.mdx
  writeFileSync(join(toolsDir, 'index.mdx'), renderHub(byCategory), 'utf-8');

  console.log(`\n✓ Wrote ${written} tool MDX files across ${byCategory.size} categories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
