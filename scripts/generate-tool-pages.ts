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

  // Honest paid/free framing: Growth Suite tools are paid + BYOK + call
  // external services, so they never carry the browser-only privacy claim.
  const paidNotice = meta.isPaid
    ? `\n:::info Paid feature — Growth Suite\n${meta.name} is part of the paid ZTools **Growth Suite**. It needs a free ZTools account and runs on metered plans — a limited Free tier, plus Pro and Ultimate for higher caps. Several Growth tools let you bring your own provider API key (BYOK). Unlike the free, browser-only tools, Growth Suite tools call external services to do their work.\n:::\n`
    : '';
  const tryItBody = meta.isPaid
    ? `The full ${meta.name} is part of the ZTools Growth Suite at **[${url}](${url})** — sign in and pick the plan that fits your limits (several Growth tools use your own provider API key, BYOK).`
    : id === 'dynamic-qr'
      ? `The full ${meta.name} runs at **[${url}](${url})** — the generator works entirely in your browser; only dynamic codes use a lightweight serverless redirect, so you can edit the destination later and see scan counts.`
      : meta.usesServer
        ? `The full ${meta.name} runs at **[${url}](${url})**. It can process your file on the ZTools server: the file is uploaded temporarily and deleted right after processing, and that mode needs a Google sign-in.`
        : `The full ${meta.name} runs in your browser at **[${url}](${url})** — no signup, no upload, no data leaves your device.`;

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
            `- [**${t.meta.name}**](/docs/tools/${cat}/${t.id}) — ${(t.meta.description ?? '').replace(/\n/g, ' ')}`,
        )
        .join('\n');
      return `## ${cat[0].toUpperCase()}${cat.slice(1)}\n\n${items}`;
    })
    .join('\n\n');

  const total = Array.from(byCategory.values()).reduce((n, t) => n + t.length, 0);
  const catCount = byCategory.size;
  const hasGrowth = byCategory.has('growth');

  return `---
id: index
title: ${yamlString(`All ZTools — ${total} developer & creator tools`)}
description: ${yamlString(`Browse the full ZTools catalog — ${total} tools across ${catCount} categories. Most run entirely in your browser (no signup, no upload, no data leaves your device); the Growth Suite adds AI-assisted SEO tools that need a sign-in and your own API key.`)}
sidebar_label: All tools
sidebar_position: 0
slug: /tools
---

# All ZTools

ZTools is a collection of **${total} developer & creator tools** across ${catCount} categories, each documented with use cases, examples, and FAQs. The vast majority run **entirely in your browser** — no signup, no upload, no data leaves your device.${hasGrowth ? ` A small **Growth Suite** adds AI-assisted SEO/AEO tools that require a sign-in and your own provider API key (BYOK, with optional paid tiers); those pages are clearly marked.` : ''}

${sections}

---

*Last updated: ${new Date().toISOString().slice(0, 10)} · [Open the app](${APP_URL}) · [GitHub](https://github.com/aoneahsan/ztools-docs)*
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
    const items = tools.map((t) => `- [${t.meta.name}](/docs/tools/${cat}/${t.id}) — ${(t.meta.description ?? '').slice(0, 100)}`).join('\n');
    const indexFile = join(toolsDir, cat, 'index.mdx');
    writeFileSync(
      indexFile,
      `---
id: index
title: ${yamlString(`${cat[0].toUpperCase()}${cat.slice(1)} tools — ZTools`)}
sidebar_label: ${yamlString(`${cat[0].toUpperCase()}${cat.slice(1)} tools`)}
sidebar_position: 0
slug: /tools/${cat}
---

# ${cat[0].toUpperCase()}${cat.slice(1)} tools

${cat === 'growth' ? ':::info Paid — Growth Suite\nThese tools require a ZTools account and your own provider API key (BYOK), with optional paid tiers. They call external AI/SEO services, so unlike the rest of ZTools they are not browser-only.\n:::\n\n' : ''}${tools.length} tool${tools.length === 1 ? '' : 's'} in this category.

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
