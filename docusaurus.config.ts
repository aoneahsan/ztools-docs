// Load .env BEFORE any process.env reads below.
// Locally: drop a .env file (gitignored) with the keys you want active.
// CI: GitHub Actions injects the same vars via the workflow's `env:` block.
// Either way, process.env.* below picks up the values.
import 'dotenv/config';

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const SITE_URL = 'https://ztools-docs.zaions.com';
const APP_URL = 'https://ztools.zaions.com';
const GH_REPO = 'https://github.com/aoneahsan/ztools-docs';

// Third-party tracking / monitoring — all optional via env vars.
// Set as GitHub Actions repo secrets to enable; absent vars cause the
// related script / SDK to be skipped entirely (no broken state, no
// console errors). Privacy disclosure at /docs/privacy.
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID || '';
const CLARITY_PROJECT_ID = process.env.CLARITY_PROJECT_ID || '';
const AMPLITUDE_API_KEY = process.env.AMPLITUDE_API_KEY || '';
const SENTRY_DSN = process.env.SENTRY_DSN || '';

// Microsoft Clarity inline snippet (their official install code).
// Only emitted when CLARITY_PROJECT_ID is set.
const clarityScript = (id: string) => `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${id}");
`.trim();

const config: Config = {
  title: 'ZTools Documentation',
  tagline: '520+ free, browser-only developer & creator tools — every page documented.',
  favicon: 'img/favicon.ico',

  url: SITE_URL,
  baseUrl: '/',

  organizationName: 'aoneahsan',
  projectName: 'ztools-docs',

  // Fail the build on broken links/markdown — keeps CI honest. Bumped from
  // 'warn' to 'throw' after audit confirmed clean state on 2026-05-06.
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {tagName: 'link', attributes: {rel: 'canonical', href: SITE_URL}},
    {tagName: 'meta', attributes: {name: 'author', content: 'Ahsan Mahmood'}},

    // ----- Favicons + iOS / Android home-screen icons ---------------------
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/img/favicon-16x16.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32x32.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '48x48', href: '/img/favicon-48x48.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/favicon-192x192.png'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '512x512', href: '/img/favicon-512x512.png'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png'}},
    {tagName: 'link', attributes: {rel: 'mask-icon', href: '/img/logo.svg', color: '#ffa840'}},
    {tagName: 'link', attributes: {rel: 'manifest', href: '/site.webmanifest'}},

    // ----- Theme + Microsoft tile color -----------------------------------
    {tagName: 'meta', attributes: {name: 'theme-color', content: '#ffa840'}},
    {tagName: 'meta', attributes: {name: 'msapplication-TileColor', content: '#ffa840'}},
    {tagName: 'meta', attributes: {name: 'msapplication-config', content: '/browserconfig.xml'}},
    {tagName: 'meta', attributes: {name: 'apple-mobile-web-app-title', content: 'ZTools Docs'}},
    {tagName: 'meta', attributes: {name: 'application-name', content: 'ZTools Docs'}},

    // ----- Open Graph (Facebook, LinkedIn, Slack, Discord, iMessage) -----
    {tagName: 'meta', attributes: {property: 'og:type', content: 'website'}},
    {tagName: 'meta', attributes: {property: 'og:site_name', content: 'ZTools Documentation'}},
    {tagName: 'meta', attributes: {property: 'og:url', content: SITE_URL}},
    {tagName: 'meta', attributes: {property: 'og:locale', content: 'en_US'}},
    {tagName: 'meta', attributes: {property: 'og:image', content: `${SITE_URL}/img/social-card.png`}},
    {tagName: 'meta', attributes: {property: 'og:image:type', content: 'image/png'}},
    {tagName: 'meta', attributes: {property: 'og:image:width', content: '1800'}},
    {tagName: 'meta', attributes: {property: 'og:image:height', content: '945'}},
    {tagName: 'meta', attributes: {property: 'og:image:alt', content: 'ZTools — 520+ free browser-only tools, every one documented'}},

    // ----- Twitter / X card ----------------------------------------------
    {tagName: 'meta', attributes: {name: 'twitter:card', content: 'summary_large_image'}},
    {tagName: 'meta', attributes: {name: 'twitter:site', content: '@aoneahsan'}},
    {tagName: 'meta', attributes: {name: 'twitter:creator', content: '@aoneahsan'}},
    {tagName: 'meta', attributes: {name: 'twitter:image', content: `${SITE_URL}/img/social-card.png`}},
    {tagName: 'meta', attributes: {name: 'twitter:image:alt', content: 'ZTools — 520+ free browser-only tools, every one documented'}},

    // Clarity — emitted only when CLARITY_PROJECT_ID env var is set
    ...(CLARITY_PROJECT_ID
      ? [
          {
            tagName: 'script' as const,
            attributes: {type: 'text/javascript'},
            innerHTML: clarityScript(CLARITY_PROJECT_ID),
          },
        ]
      : []),
  ],

  // Pass env-driven config to the client. Read from clientModules.
  customFields: {
    AMPLITUDE_API_KEY,
    SENTRY_DSN,
    CLARITY_PROJECT_ID,
  },

  // Client modules run in every page's bundle; we use one to init
  // Amplitude + Sentry when their respective env vars are set.
  clientModules: [
    require.resolve('./src/clientModules/third-party-analytics.ts'),
  ],

  // Mermaid diagrams — write graphs/flowcharts inline in MDX with
  // ```mermaid ... ``` fenced blocks. See docusaurus.io/docs/markdown-features/diagrams
  markdown: {
    mermaid: true,
    // Docusaurus v4 moves onBrokenMarkdownLinks under markdown.hooks.
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        // Indexes both docs and blog
        hashed: true,
        indexBlog: true,
        indexDocs: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
        blogRouteBasePath: '/blog',
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 12,
        searchResultContextMaxLength: 60,
        explicitSearchResultPath: true,
      }),
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: `${GH_REPO}/edit/main/`,
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: {
          showReadingTime: true,
          editUrl: `${GH_REPO}/edit/main/`,
          feedOptions: {type: ['rss', 'atom'], xslt: true},
          blogTitle: 'ZTools Blog',
          blogDescription: 'Release notes, tool spotlights, and dev journal.',
          postsPerPage: 10,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        // GA4 via the official preset's gtag option. Only ships the script
        // when GA_MEASUREMENT_ID is set at build time.
        ...(GA_MEASUREMENT_ID
          ? {
              gtag: {
                trackingID: GA_MEASUREMENT_ID,
                anonymizeIP: true,
              },
            }
          : {}),
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    announcementBar: {
      id: 'launch-2026-05',
      content:
        '🎉 ZTools docs site launched — every one of 520+ tools now has a dedicated documentation page. <a href="/docs/intro">Get started →</a>',
      backgroundColor: '#ffa840',
      textColor: '#0a0a0a',
      isCloseable: true,
    },
    metadata: [
      {name: 'keywords', content: 'developer tools, online tools, free tools, browser tools, ztools, json formatter, password generator, qr generator, image compressor, regex tester, base64, color picker'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    colorMode: {defaultMode: 'dark', respectPrefersColorScheme: true},
    navbar: {
      title: 'ZTools',
      logo: {alt: 'ZTools', src: 'img/logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'toolsSidebar', position: 'left', label: 'Tools'},
        {to: '/docs/intro', label: 'Get started', position: 'left'},
        {to: '/docs/guides', label: 'Guides', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {href: APP_URL, label: 'Open ZTools ↗', position: 'right'},
        {href: GH_REPO, label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Get started', to: '/docs/intro'},
            {label: 'All tools', to: '/docs/tools'},
            {label: 'Guides', to: '/docs/guides'},
            {label: 'Privacy', to: '/docs/privacy'},
          ],
        },
        {
          title: 'Product',
          items: [
            {label: 'Open ZTools', href: APP_URL},
            {label: 'Privacy', href: `${APP_URL}/privacy`},
            {label: 'Terms', href: `${APP_URL}/terms`},
            {label: 'Support the project', href: 'https://aoneahsan.com/payment?project-id=ztools&project-identifier=com.zaions.ztools'},
          ],
        },
        {
          title: 'Open source',
          items: [
            {label: 'GitHub', href: GH_REPO},
            {label: 'Issues', href: `${GH_REPO}/issues`},
            // Use absolute URLs for files generated post-link-check.
            // Docusaurus's link checker can't see /blog/rss.xml or /sitemap.xml
            // because they're emitted after MDX compilation.
            {label: 'RSS feed', href: `${SITE_URL}/blog/rss.xml`},
            {label: 'Sitemap', href: `${SITE_URL}/sitemap.xml`},
          ],
        },
        {
          title: 'Author',
          items: [
            {label: 'Ahsan Mahmood', href: 'https://aoneahsan.com'},
            {label: 'aoneahsan@gmail.com', href: 'mailto:aoneahsan@gmail.com'},
            {label: 'WhatsApp +923046619706', href: 'https://wa.me/923046619706'},
            {label: 'LinkedIn', href: 'https://linkedin.com/in/aoneahsan'},
            {label: 'GitHub', href: 'https://github.com/aoneahsan'},
            {label: 'NPM', href: 'https://npmjs.com/~aoneahsan'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} ZTools by Ahsan Mahmood / Zaions. Browser-only. Privacy-first.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'yaml', 'toml', 'diff', 'tsx', 'jsx'],
    },
    docs: {
      sidebar: {hideable: true, autoCollapseCategories: false},
      // Show breadcrumbs at the top of every doc page.
      // (Built into Docusaurus 3 — explicit declaration here for clarity.)
    },
    // Built-in TOC; tweak depth on long pages
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
