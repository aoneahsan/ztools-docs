import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {JOURNEY_DATES, OWNER_PERSON, OWN_REL, TOOL_COUNT, WEB_ORIGIN, copy, formatDate} from '@site/src/components/Ecosystem/data';
import styles from '@site/src/components/Ecosystem/styles.module.css';

/** A followed link to one of the owner's places, in a new tab. */
function Own({href, children, className}: {href: string; children: ReactNode; className?: string}): ReactNode {
  return (
    <a className={className} href={href} target="_blank" rel={OWN_REL}>
      {children} <span aria-hidden="true">↗</span><span className="sr-only"> {copy('ecosystem.newTab')}</span>
    </a>
  );
}

/** `/about-developer` on the docs site (dummy `about-developer.html`): the website's words, its canonical. */
export default function AboutDeveloper(): ReactNode {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: copy('aboutDev.seoTitle'),
    description: copy('aboutDev.seoDescription', {toolCount: TOOL_COUNT}),
    url: `${WEB_ORIGIN}/about-developer`,
    about: {'@type': 'SoftwareApplication', name: 'ZTools', url: WEB_ORIGIN},
    mainEntity: OWNER_PERSON,
  };
  return (
    <Layout title={copy('aboutDev.seoTitle')} description={copy('aboutDev.seoDescription', {toolCount: TOOL_COUNT})}>
      <Head>
        <link rel="canonical" href={`${WEB_ORIGIN}/about-developer`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <main className={`container ${styles.page}`}>
        <p>{copy('aboutDev.eyebrow')}</p>
        <Heading as="h1">{copy('aboutDev.title')}</Heading>
        <p className={styles.lead}>{copy('aboutDev.lead', {toolCount: TOOL_COUNT})}</p>
        <div className={styles.actions}>
          <Own href="https://aoneahsan.com" className={styles.primary}>{copy('aboutDev.portfolio')}</Own>
          <Own href="https://zaions.com" className={styles.quiet}>{copy('aboutDev.zaions')}</Own>
        </div>

        <Heading as="h2" className="margin-top--xl">{copy('aboutDev.ideaTitle')}</Heading>
        <p className={styles.lead}>{copy('aboutDev.ideaBody')}</p>
        <blockquote className={styles.quote}>
          <p>{copy('aboutDev.quote')}</p>
          <p>{copy('aboutDev.quoteBy', {date: formatDate('2026-11-07')})}</p>
        </blockquote>

        <Heading as="h2" className="margin-top--xl">{copy('aboutDev.journeyTitle')}</Heading>
        <ol className={styles.journey}>
          {JOURNEY_DATES.map((date) => (
            <li key={date}><time dateTime={date}>{formatDate(date)}</time><p>{copy(`aboutDev.j.${date}`)}</p></li>
          ))}
        </ol>

        <Heading as="h2" className="margin-top--xl">{copy('aboutDev.builtTitle')}</Heading>
        <ul>{['aboutDev.built1', 'aboutDev.built2', 'aboutDev.built3', 'aboutDev.built4'].map((key) => <li key={key}>{copy(key)}</li>)}</ul>

        <Heading as="h2" className="margin-top--xl">{copy('aboutDev.moreTitle')}</Heading>
        <ul>
          <li><Link to="/ecosystem">{copy('aboutDev.moreProducts')}</Link></li>
          <li><Own href="https://aoneahsan.com/projects">{copy('aboutDev.moreProjects')}</Own></li>
          <li><Own href="https://zaions.com">{copy('aboutDev.moreZaions')}</Own></li>
          <li><Own href="https://github.com/aoneahsan">{copy('aboutDev.moreGithub')}</Own></li>
          <li><Own href="https://www.linkedin.com/in/aoneahsan">{copy('aboutDev.moreLinkedin')}</Own></li>
        </ul>

        <Heading as="h2" className="margin-top--xl">{copy('aboutDev.contactTitle')}</Heading>
        <p>{copy('aboutDev.contactBody')}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={`${WEB_ORIGIN}/contact`}>{copy('aboutDev.contact')}</a>
          <a className={styles.quiet} href={`${WEB_ORIGIN}/support`}>{copy('aboutDev.support')}</a>
        </div>
      </main>
    </Layout>
  );
}
