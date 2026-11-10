/**
 * Wraps the local-search plugin's `/search` page for ONE reason: the plugin writes its noindex as
 * `<meta property="robots">`, which crawlers do not read. This adds the standard `name="robots"` form
 * (search audit SA-ZTOOLS-003, 2026-11-10). Re-check on every `@easyops-cn/docusaurus-search-local` upgrade
 * and delete this wrapper once the plugin writes `name="robots"` itself.
 */
import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import SearchPage from '@theme-original/SearchPage';

export default function SearchPageWrapper(props: Record<string, unknown>): ReactNode {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <SearchPage {...props} />
    </>
  );
}
