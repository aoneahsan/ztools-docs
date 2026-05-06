import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const APP_URL = 'https://ztools.zaions.com';
const GH_REPO = 'https://github.com/aoneahsan/ztools-docs';

const FEATURED_TOOLS = [
  {path: 'data/json-formatter', name: 'JSON Formatter', tag: 'Most-used'},
  {path: 'utility/password-generator', name: 'Password Generator', tag: 'Crypto-RNG'},
  {path: 'generator/qr-generator', name: 'QR Generator', tag: 'Browser-only'},
  {path: 'image/image-compressor', name: 'Image Compressor', tag: 'Lossless'},
  {path: 'utility/regex-tester', name: 'Regex Tester', tag: 'Live preview'},
  {path: 'pdf/merge-pdf', name: 'PDF Merger', tag: 'No upload'},
];

const PILLARS = [
  {
    label: '520+ tools',
    text: 'Every developer & creator utility, from JSON formatter to QR generator to PDF merger.',
  },
  {
    label: 'Browser-only',
    text: 'Tools run on your device. Files never upload. Zero analytics on your inputs.',
  },
  {
    label: 'Open documentation',
    text: 'Every tool documented with use cases, examples, and FAQs. Source on GitHub.',
  },
  {
    label: 'No friction',
    text: 'No signup, no email gate, no paywall. Open the URL, paste, ship.',
  },
];

export default function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <main className={styles.shell}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>ZTools docs · v0.1</p>
            <h1 className={styles.title}>
              520+ tools.<br />
              <span className={styles.titleAccent}>One browser tab.</span>
            </h1>
            <p className={styles.subtitle}>
              ZTools is a free, browser-only collection of developer & creator
              tools. This site documents every one of them — use cases,
              examples, FAQs, and the honest framing the marketing pages skip.
            </p>
            <div className={styles.actions}>
              <Link to="/docs/intro" className={styles.btnPrimary}>
                Get started
              </Link>
              <Link to="/docs/tools" className={styles.btnGhost}>
                Browse all tools →
              </Link>
              <a href={APP_URL} className={styles.btnGhost} target="_blank" rel="noopener">
                Open the app ↗
              </a>
            </div>
          </div>

          {/* decorative grid */}
          <div className={styles.heroGrid} aria-hidden>
            {Array.from({length: 36}).map((_, i) => (
              <span key={i} className={styles.heroDot} style={{animationDelay: `${i * 60}ms`}} />
            ))}
          </div>
        </section>

        {/* PILLARS */}
        <section className={styles.pillars}>
          {PILLARS.map((p) => (
            <article key={p.label} className={styles.pillar}>
              <p className={styles.pillarLabel}>{p.label}</p>
              <p className={styles.pillarText}>{p.text}</p>
            </article>
          ))}
        </section>

        {/* FEATURED TOOLS */}
        <section className={styles.featured}>
          <header className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>Featured</p>
            <h2 className={styles.sectionTitle}>Start with the most-used tools</h2>
            <p className={styles.sectionLead}>
              Each links to its full documentation page. Click any to read the
              use cases, examples, and FAQs.
            </p>
          </header>
          <div className={styles.toolGrid}>
            {FEATURED_TOOLS.map((t) => (
              <Link
                key={t.path}
                to={`/docs/tools/${t.path}`}
                className={styles.toolCard}
              >
                <span className={styles.toolTag}>{t.tag}</span>
                <h3 className={styles.toolName}>{t.name}</h3>
                <p className={styles.toolMeta}>Read docs →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className={styles.philosophy}>
          <div>
            <p className={styles.sectionEyebrow}>Philosophy</p>
            <h2 className={styles.sectionTitle}>
              Free as in <em>actually</em> free
            </h2>
          </div>
          <div className={styles.philosophyText}>
            <p>
              Most "free online tools" charge in attention, data, or both. They
              upload your files to inspect them, run analytics on your inputs,
              gate features behind email signup, and bury the actual product
              under three layers of ads.
            </p>
            <p>
              ZTools is the opposite: <strong>browser-only processing</strong>,
              no signup gate, no analytics on your tool inputs (only on
              navigation, opt-out documented). The full documentation site
              you're reading is open-source on{' '}
              <a href={GH_REPO} target="_blank" rel="noopener">
                GitHub
              </a>{' '}
              — fork it, audit it, fix typos.
            </p>
            <p>
              When a tool has limits — JPG can't store transparency, GIF
              transparency is 1-bit, regex performance degrades on certain
              patterns — the docs say so. Honest framing earns more trust than
              marketing copy.
            </p>
          </div>
        </section>

        {/* AUTHOR */}
        <section className={styles.author}>
          <p className={styles.sectionEyebrow}>Built by</p>
          <h2 className={styles.authorName}>Ahsan Mahmood</h2>
          <p className={styles.authorBio}>
            Solo developer behind ZTools and several other side projects. Based
            in Pakistan; ships in code every day. Find me on{' '}
            <a href="https://github.com/aoneahsan" target="_blank" rel="noopener">GitHub</a>,{' '}
            <a href="https://linkedin.com/in/aoneahsan" target="_blank" rel="noopener">LinkedIn</a>, or{' '}
            <a href="https://aoneahsan.com" target="_blank" rel="noopener">aoneahsan.com</a>.
          </p>
        </section>
      </main>
    </Layout>
  );
}
