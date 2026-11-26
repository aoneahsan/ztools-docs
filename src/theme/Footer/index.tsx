/**
 * The docs footer, wrapped: "More from Zaions" sits directly above it on every page (ecosystem standard). The footer
 * itself is Docusaurus' own, configured in `docusaurus.config.ts`, which carries the Zaions credit and links.
 */
import React from 'react';
import Footer from '@theme-original/Footer';
import type FooterType from '@theme/Footer';
import type {WrapperProps} from '@docusaurus/types';
import EcosystemBand from '@site/src/components/Ecosystem';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): React.ReactElement {
  return (
    <>
      <EcosystemBand />
      <Footer {...props} />
    </>
  );
}
