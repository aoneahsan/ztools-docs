import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const SITE_URL = 'https://ztools-docs.zaions.com';
const APP_URL = 'https://ztools.zaions.com';
const GH_REPO = 'https://github.com/aoneahsan/ztools-docs';

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
  onBrokenMarkdownLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {tagName: 'link', attributes: {rel: 'canonical', href: SITE_URL}},
    {tagName: 'meta', attributes: {name: 'author', content: 'Ahsan Mahmood'}},
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
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
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
            {label: 'aoneahsan.com', href: 'https://aoneahsan.com'},
            {label: 'LinkedIn', href: 'https://linkedin.com/in/aoneahsan'},
            {label: 'NPM', href: 'https://npmjs.com/~aoneahsan'},
            {label: 'GitHub', href: 'https://github.com/aoneahsan'},
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
    docs: {sidebar: {hideable: true, autoCollapseCategories: false}},
  } satisfies Preset.ThemeConfig,
};

export default config;
