import React from 'react';
import styles from './styles.module.css';

interface ToolCTAProps {
  toolId: string;
  toolName: string;
}

const APP_URL = 'https://ztools.zaions.com';

export default function ToolCTA({toolId, toolName}: ToolCTAProps): React.ReactElement {
  const href = `${APP_URL}/${toolId}`;
  return (
    <aside className={styles.cta} aria-label={`Open ${toolName}`}>
      <div className={styles.body}>
        <p className={styles.kicker}>Try it now</p>
        <p className={styles.lead}>
          Run <strong>{toolName}</strong> in your browser. No signup, no upload.
        </p>
      </div>
      <a className={styles.button} href={href} target="_blank" rel="noopener">
        Open ZTools&nbsp;<span aria-hidden>↗</span>
      </a>
    </aside>
  );
}
