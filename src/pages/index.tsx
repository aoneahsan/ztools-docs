import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const APP_URL = 'https://ztools.zaions.com';
const GH_REPO = 'https://github.com/aoneahsan/ztools-docs';

const FEATURED_TOOLS = [
  {path: 'data/json-formatter', name: 'JSON Formatter', tag: 'Format JSON'},
  {path: 'generator/password-generator', name: 'Password Generator', tag: 'Generate passwords'},
  {path: 'encoding/qr-generator', name: 'QR Generator', tag: 'Make QR codes'},
  {path: 'image/image-compressor', name: 'Image Compressor', tag: 'Compress images'},
  {path: 'utility/regex-tester', name: 'Regex Tester', tag: 'Test patterns'},
  {path: 'pdf/merge-pdf', name: 'PDF Merger', tag: 'Merge PDFs'},
];

const PILLARS = [
  {
    label: 'Tools in one place',
    text: 'Find a JSON formatter, QR generator, PDF tool, and more without visiting a different site for each job.',
  },
  {
    label: 'Clear processing boundaries',
    text: 'Many tools work in your browser. AI and some other features send input to a server or provider.',
  },
  {
    label: 'Open documentation',
    text: 'Read use cases, examples, and FAQs for the tools in this catalog. The docs source is on GitHub.',
  },
  {
    label: 'A place to start',
    text: 'Many tools are ready without sign-in. Growth Suite needs an account and has plan limits.',
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
            <p className={styles.eyebrow}>ZTools docs</p>
            <h1 className={styles.title}>
              Useful tools.<br />
              <span className={styles.titleAccent}>One place.</span>
            </h1>
            <p className={styles.subtitle}>
              ZTools brings everyday digital tools together, from JSON formatting to QR codes and PDF work. Many run in your browser; AI and some other tools use a server or provider. Find use cases, examples, and FAQs to help you choose your next tool.
            </p>
            <div className={styles.actions}>
              <Link to="/docs/tools" className={styles.btnPrimary}>
                Browse tools
              </Link>
              <Link to="/docs/intro" className={styles.btnGhost}>
                Get started
              </Link>
              <a href={APP_URL} className={styles.btnGhost} target="_blank" rel="noopener">
                Open ZTools
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
            <h2 className={styles.sectionTitle}>Start with a tool</h2>
            <p className={styles.sectionLead}>
              Choose a tool to read its use cases, examples, and FAQs.
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
            <p className={styles.sectionEyebrow}>How ZTools works</p>
            <h2 className={styles.sectionTitle}>
              The tool for the next job is nearby
            </h2>
          </div>
          <div className={styles.philosophyText}>
            <p>
              Small digital jobs can send you through several sites. ZTools keeps the tools together. Find a JSON formatter, make a QR code, or move on to the next task in one catalog.
            </p>
            <p>
              Processing depends on the tool. Many work in your browser; AI and some other features may send the input you provide to ZTools or another provider. Some tools also need an account or connection.
            </p>
            <p>
              Each listed tool has use cases, examples, and FAQs. The docs source is on{' '}
              <a href={GH_REPO} target="_blank" rel="noopener">GitHub</a>, where you can review the pages and suggest a correction.
            </p>
          </div>
        </section>

        {/* AUTHOR */}
        <section className={styles.author}>
          <p className={styles.sectionEyebrow}>Built by</p>
          <h2 className={styles.authorName}>Ahsan Mahmood</h2>
          <p className={styles.authorBio}>
            Ahsan Mahmood built ZTools. He's a developer based in Pakistan. For questions, email{' '}
            <a href="mailto:aoneahsan@gmail.com">aoneahsan@gmail.com</a>{' '}
            or use the contact links below.
          </p>
          <p className={styles.authorBio}>
            <a href="https://wa.me/923046619706" target="_blank" rel="noopener">WhatsApp +92 304 6619706</a>.
          </p>
          <p className={styles.authorBio}>
            Find me on{' '}
            <a href="https://github.com/aoneahsan" target="_blank" rel="noopener">GitHub</a>,{' '}
            <a href="https://linkedin.com/in/aoneahsan" target="_blank" rel="noopener">LinkedIn</a>,{' '}
            <a href="https://npmjs.com/~aoneahsan" target="_blank" rel="noopener">NPM</a>, or{' '}
            <a href="https://aoneahsan.com" target="_blank" rel="noopener">aoneahsan.com</a>.
          </p>
        </section>
      </main>
    </Layout>
  );
}
