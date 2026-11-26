import React, {useEffect, useState, type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {useHistory, useLocation} from '@docusaurus/router';
import {Logo, Visit} from '@site/src/components/Ecosystem';
import {OWNER_PERSON, PRODUCTS, WEB_ORIGIN, copy, type EcosystemProduct} from '@site/src/components/Ecosystem/data';
import styles from '@site/src/components/Ecosystem/styles.module.css';

const VIEWS = ['grid', 'list', 'table'] as const;
type View = (typeof VIEWS)[number];

function Actions({product}: {product: EcosystemProduct}): ReactNode {
  return (
    <div className={styles.actions}>
      <Visit product={product} className={styles.primary} />
      <Link className={styles.quiet} to={`/ecosystem/${product.id}`} aria-label={copy('ecosystem.detailsLabel', {name: product.name})}>{copy('ecosystem.details')}</Link>
    </div>
  );
}

/** `/ecosystem` on the docs site (dummy `ecosystem.html`): the website's list, its words and its canonical. */
export default function Ecosystem(): ReactNode {
  const location = useLocation();
  const history = useHistory();
  // The prerendered HTML is the grid; the URL's view applies after hydration, so server and client agree first.
  const [view, setViewState] = useState<View>('grid');
  useEffect(() => {
    const requested = new URLSearchParams(location.search).get('view');
    setViewState((VIEWS as readonly string[]).includes(requested ?? '') ? (requested as View) : 'grid');
  }, [location.search]);
  const setView = (next: View) => history.replace({search: next === 'grid' ? '' : `?view=${next}`});
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy('ecosystem.page.title'),
    url: `${WEB_ORIGIN}/ecosystem`,
    author: OWNER_PERSON,
    mainEntity: {'@type': 'ItemList', numberOfItems: PRODUCTS.length, itemListElement: PRODUCTS.map((p, i) => ({'@type': 'ListItem', position: i + 1, url: `${WEB_ORIGIN}/ecosystem/${p.id}`, name: p.name}))},
  };
  return (
    <Layout title={copy('ecosystem.page.seoTitle')} description={copy('ecosystem.page.seoDescription')}>
      <Head>
        <link rel="canonical" href={`${WEB_ORIGIN}/ecosystem`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <main className={`container ${styles.page}`}>
        <Heading as="h1">{copy('ecosystem.page.title')}</Heading>
        <p className={styles.lead}>{copy('ecosystem.page.lead', {count: PRODUCTS.length})}</p>
        <div className={styles.bar}>
          <div className={styles.views} role="group" aria-label={copy('ecosystem.page.view')}>
            {VIEWS.map((option) => (
              <button key={option} type="button" aria-pressed={view === option} onClick={() => setView(option)}>{copy(`ecosystem.page.${option}`)}</button>
            ))}
          </div>
          <Link to="/about-developer">{copy('ecosystem.page.who')} →</Link>
        </div>
        {view === 'grid' && (
          <div className={styles.grid}>
            {PRODUCTS.map((p) => (
              <article key={p.id} className={styles.item}>
                <Logo product={p} />
                <Heading as="h2">{p.name}</Heading>
                <div className={styles.tags}>{p.platforms.map((t) => <span key={t}>{t}</span>)}</div>
                <p>{p.card}</p>
                <Actions product={p} />
              </article>
            ))}
          </div>
        )}
        {view === 'list' && (
          <div className={styles.list}>
            {PRODUCTS.map((p) => (
              <article key={p.id} className={styles.row}>
                <Logo product={p} />
                <div><Heading as="h2">{p.name}</Heading><p>{p.card}</p><div className={styles.tags}>{p.platforms.map((t) => <span key={t}>{t}</span>)}</div></div>
                <Actions product={p} />
              </article>
            ))}
          </div>
        )}
        {view === 'table' && (
          <div className={styles.tableWrap}>
            <table>
              <caption className="sr-only">{copy('ecosystem.page.title')}</caption>
              <thead><tr><th scope="col">{copy('ecosystem.page.colProduct')}</th><th scope="col">{copy('ecosystem.page.colFor')}</th><th scope="col">{copy('ecosystem.page.colWhere')}</th><th scope="col">{copy('ecosystem.page.colLinks')}</th></tr></thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.id}><th scope="row">{p.name}</th><td>{p.card}</td><td>{p.platforms.join(', ')}</td><td><Actions product={p} /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Layout>
  );
}
