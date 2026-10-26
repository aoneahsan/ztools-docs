/**
 * Ejected from `@docusaurus/theme-classic` for ONE reason: the blog list page renders no `<h1>`; the theme uses
 * `blogTitle` only for the document `<title>`. (Ported from the LifeWell docs, 2026-10-26.)
 *
 * Why an eject and not a `--wrap`: wrapping `BlogListPage` puts the heading above the navbar, outside `<main>`,
 * because the component renders the whole `<Layout>`; wrapping `BlogPostItems` cannot read the blog's title, since
 * `useBlogMetadata()` throws on `/blog` and on tag pages. Here `metadata.blogTitle` arrives in props.
 *
 * The ONLY edit against the theme's source is the `<header>` block in `BlogListPageContent` (the blog's title and
 * description). `StructuredData` was not copied, so `@theme/` resolves it to the theme's original, and
 * `rel="canonical"` stays with `@theme/SiteMetadata` alone.
 *
 * This is forked theme code. Re-check it against
 * `node_modules/@docusaurus/theme-classic/lib/theme/BlogListPage/index.js` on every Docusaurus upgrade.
 */
import React, {type ReactNode} from 'react';
import clsx from 'clsx';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import Heading from '@theme/Heading';
import type {Props} from '@theme/BlogListPage';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';

function BlogListPageMetadata(props: Props): ReactNode {
  const {metadata} = props;
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent(props: Props): ReactNode {
  const {metadata, items, sidebar} = props;
  return (
    <BlogLayout sidebar={sidebar}>
      <header className="margin-bottom--xl">
        <Heading as="h1">{metadata.blogTitle}</Heading>
        <p>{metadata.blogDescription}</p>
      </header>
      <BlogPostItems items={items} />
      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
