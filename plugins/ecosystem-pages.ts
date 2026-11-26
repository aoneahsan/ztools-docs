/**
 * One docs route per Zaions product: `/ecosystem/<id>`, rendered by `src/components/EcosystemDetail` with the product's
 * row from the vendored roster (ZTools itself is never there, and is filtered again here).
 */
import type {LoadContext, Plugin} from '@docusaurus/types';
import raw from '../src/data/ecosystem.json';
import {generatedModule} from './site-pages';

export default function ecosystemPages(context: LoadContext): Plugin {
  return {
    name: 'ecosystem-pages',
    async contentLoaded({actions}) {
      for (const product of raw.products.filter((p) => p.id !== 'ztools')) {
        // The alias, never the absolute path createData returns (site-pages.ts explains why).
        const data = generatedModule(context.generatedFilesDir, await actions.createData(`ecosystem-${product.id}.json`, JSON.stringify(product)));
        actions.addRoute({path: `/ecosystem/${product.id}`, component: '@site/src/components/EcosystemDetail/index.tsx', modules: {product: data}, exact: true});
      }
    },
  };
}
