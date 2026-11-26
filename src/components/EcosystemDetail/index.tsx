/**
 * `/ecosystem/<id>` on the docs site (dummy `ecosystem-detail.html`). `plugins/ecosystem-pages.ts` adds one route per
 * product and hands it the product's row; the words are the website's, so the canonical is the website's page.
 */
import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {Logo, Visit} from '@site/src/components/Ecosystem';
import {OWNER_PERSON, WEB_ORIGIN, copy, type EcosystemProduct} from '@site/src/components/Ecosystem/data';
import styles from '@site/src/components/Ecosystem/styles.module.css';

export default function EcosystemDetail({product}: {product: EcosystemProduct}): ReactNode {
  const url = `${WEB_ORIGIN}/ecosystem/${product.id}`;
  const jsonLd = [
    {'@context': 'https://schema.org', '@type': 'SoftwareApplication', name: product.name, url: product.url, description: product.card, applicationCategory: 'UtilitiesApplication', operatingSystem: product.platforms.join(', '), creator: OWNER_PERSON},
    {'@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'ZTools', item: WEB_ORIGIN},
      {'@type': 'ListItem', position: 2, name: copy('ecosystem.page.title'), item: `${WEB_ORIGIN}/ecosystem`},
      {'@type': 'ListItem', position: 3, name: product.name, item: url},
    ]},
  ];
  return (
    <Layout title={`${product.title} · ZTools`} description={product.intro}>
      <Head>
        <link rel="canonical" href={url} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <main className={`container ${styles.page}`}>
        <nav aria-label={copy('ecosystem.detail.breadcrumb')}>
          <Link to="/">ZTools docs</Link> / <Link to="/ecosystem">{copy('ecosystem.page.title')}</Link> / <span aria-current="page">{product.name}</span>
        </nav>
        <div className={styles.detailHead}>
          <Logo product={product} eager />
          <div><p>{copy('ecosystem.detail.eyebrow')}</p><Heading as="h1">{product.title}</Heading></div>
        </div>
        <p className={styles.lead}>{product.intro}</p>
        <div className={styles.tags}>{product.platforms.map((t) => <span key={t}>{t}</span>)}</div>
        <div className={styles.actions} style={{marginBlockStart: '1.5rem'}}>
          <Visit product={product} className={styles.primary} />
          <Link className={styles.quiet} to="/ecosystem">{copy('ecosystem.detail.all')}</Link>
        </div>
        <div className={styles.qa}>
          {product.sections.map(([question, answer]) => (
            <section key={question}><Heading as="h2">{question}</Heading><p>{answer}</p></section>
          ))}
        </div>
      </main>
    </Layout>
  );
}
