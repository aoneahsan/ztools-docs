/**
 * The "More from Zaions" band (dummy `index.html`), rendered once before the docs footer by `src/theme/Footer`.
 * One slide every 10 s; hover, focus, the pause button, a hidden tab and reduced motion each stop it. The timer only
 * moves the view; nothing is fetched.
 */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {PRODUCTS, OWN_REL, copy, type EcosystemProduct} from './data';
import styles from './styles.module.css';

export function Logo({product, eager}: {product: EcosystemProduct; eager?: boolean}): React.ReactElement {
  return (
    <span className={styles.logo}>
      <img src={product.logo} alt="" width={40} height={40} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </span>
  );
}

export function Visit({product, className}: {product: EcosystemProduct; className: string}): React.ReactElement {
  return (
    <a className={className} href={product.url} target="_blank" rel={OWN_REL}>
      {copy('ecosystem.visit', {name: product.name})} <span aria-hidden="true">↗</span>
      <span className="sr-only"> {copy('ecosystem.newTab')}</span>
    </a>
  );
}

export default function EcosystemBand(): React.ReactElement | null {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const total = PRODUCTS.length;
  const paused = userPaused || hovering || focused || hidden;

  const show = useCallback((next: number) => {
    const target = (next + total) % total;
    setIndex(target);
    const track = trackRef.current;
    const slide = track?.children[target] as HTMLElement | undefined;
    if (!track || !slide) return;
    const rtl = getComputedStyle(track).direction === 'rtl';
    track.scrollTo({left: rtl ? slide.offsetLeft - track.clientWidth + slide.offsetWidth : slide.offsetLeft, behavior: 'smooth'});
  }, [total]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setUserPaused(motion.matches);
    setHidden(document.hidden);
    const onVisibility = () => setHidden(document.hidden);
    const onMotion = () => setUserPaused(motion.matches);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
    };
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setTimeout(() => show(index + 1), 10_000);
    return () => window.clearTimeout(timer);
  }, [paused, index, show]);

  if (total === 0) return null;
  return (
    <section
      className={styles.band}
      aria-roledescription="carousel"
      aria-labelledby="eco-band-title"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{copy('ecosystem.band.eyebrow')}</p>
            <h2 id="eco-band-title" className={styles.title}>{copy('ecosystem.title')}</h2>
            <p className={styles.intro}>{copy('ecosystem.band.intro')}</p>
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.round} aria-label={copy('ecosystem.band.previous')} onClick={() => show(index - 1)}><span className={styles.flip} aria-hidden="true">‹</span></button>
            <span className={styles.position} aria-live={paused ? 'polite' : 'off'}>{copy('ecosystem.band.position', {n: index + 1, total})}</span>
            <button type="button" className={styles.round} aria-label={copy('ecosystem.band.next')} onClick={() => show(index + 1)}><span className={styles.flip} aria-hidden="true">›</span></button>
            <button type="button" className={styles.round} aria-pressed={userPaused} aria-label={userPaused ? copy('ecosystem.band.play') : copy('ecosystem.band.pause')} onClick={() => setUserPaused((v) => !v)}>
              <span aria-hidden="true">{userPaused ? '▶' : '❚❚'}</span>
            </button>
          </div>
        </div>
        <div className={styles.track} ref={trackRef}>
          {PRODUCTS.map((product, i) => (
            <div key={product.id} className={styles.card} role="group" aria-roledescription="slide" aria-label={copy('ecosystem.band.slideLabel', {n: i + 1, total, name: product.name})}>
              <div className={styles.cardTop}>
                <Logo product={product} eager={i === 0} />
                <div><h3 className={styles.name}>{product.name}</h3><p className={styles.where}>{product.platforms.join(' · ')}</p></div>
              </div>
              <p className={styles.line}>{product.card}</p>
              <div className={styles.actions}>
                <Visit product={product} className={styles.visit} />
                <Link className={styles.details} to={`/ecosystem/${product.id}`} aria-label={copy('ecosystem.detailsLabel', {name: product.name})}>{copy('ecosystem.details')}</Link>
              </div>
            </div>
          ))}
        </div>
        <Link className={styles.all} to="/ecosystem">{copy('ecosystem.band.all')} <span className={styles.flip} aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
