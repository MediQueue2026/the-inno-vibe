import { Fragment } from 'react';
import { Link } from 'react-router';

// Splits text into words that animate in one after another (see .word in pages.css).
export function AnimatedWords({ text, start = 0 }) {
  // The space sits outside each inline-block word so it isn't collapsed.
  return text.split(' ').map((word, index) => (
    <Fragment key={index}>
      {index > 0 && ' '}
      <span className="word" style={{ '--w': start + index }}>{word}</span>
    </Fragment>
  ));
}

// Shared shell for inner page heroes. Each page picks a `variant`, which sets its own layout,
// background and motion in pages.css, and passes its own `visual`.
export default function PageHero({ variant = 'plain', eyebrow, crumb, title, children, actions, jumps, visual, decor, footer }) {
  return (
    <section className={`page-hero page-hero--${variant}`}>
      <div className="page-hero-bg" aria-hidden="true">
        <span className="aurora aurora-1"></span>
        <span className="aurora aurora-2"></span>
        {decor}
      </div>
      <div className="section-wrap page-hero-inner">
        <div className="page-hero-copy">
          {crumb && (
            <ol className="breadcrumb" aria-label="Breadcrumb">
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">{crumb}</li>
            </ol>
          )}
          <div className="eyebrow"><span className="status-dot"></span> {eyebrow}</div>
          <h1>{title}</h1>
          <p className="page-hero-lead">{children}</p>
          {actions && <div className="hero-actions page-hero-actions">{actions}</div>}
          {jumps && (
            <nav className="page-jumps" aria-label="On this page">
              <span>On this page</span>
              <ul>{jumps.map(jump => <li key={jump.href}><a href={jump.href}>{jump.label}</a></li>)}</ul>
            </nav>
          )}
        </div>
        {visual && <div className="page-hero-visual">{visual}</div>}
      </div>
      {footer}
    </section>
  );
}
