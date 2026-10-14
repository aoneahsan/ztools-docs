import React from 'react';
import styles from './styles.module.css';

type ToolKind = 'browser' | 'paid' | 'server';

interface ToolCTAProps {
  /** The tool's real address in the app — its route, never its id. */
  href: string;
  toolName: string;
  kind?: ToolKind;
}

const LEAD: Record<ToolKind, string> = {
  browser: 'in ZTools.',
  paid: 'in Growth Suite. Sign-in required.',
  server: 'in ZTools. This tool may process input on a server.',
};

export default function ToolCTA({href, toolName, kind = 'browser'}: ToolCTAProps): React.ReactElement {
  return (
    <aside className={styles.cta} aria-label={`Open ${toolName}`}>
      <div className={styles.body}>
        <p className={styles.kicker}>Try it now</p>
        <p className={styles.lead}>
          Open <strong>{toolName}</strong> {LEAD[kind]}
        </p>
      </div>
      <a className={styles.button} href={href} target="_blank" rel="noopener">
        Open ZTools&nbsp;<span aria-hidden>↗</span>
      </a>
    </aside>
  );
}
