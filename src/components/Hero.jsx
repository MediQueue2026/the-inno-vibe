import IdeaScene from './IdeaScene.jsx';

// The headline steps forward line by line and gains brightness,
// like an idea coming into focus — the story the film below continues.
const HEADLINE = ['Think beyond.', 'Build better.', 'Vibe different.'];

export default function Hero() {
  return (
    <section className="hero section-wrap dark-hero" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="hero-meta">
          <span className="status-dot" aria-hidden="true"></span>
          Technology studio <span aria-hidden="true">/</span> Software · Web · AI
        </p>

        <h1 id="hero-title" className="hero-cascade">
          {HEADLINE.map((line, index) => (
            <span key={line} className="hero-cascade-line" style={{ '--line': index }}>
              {line}
            </span>
          ))}
        </h1>

        <p className="hero-lead">
          We design and build custom software, web products and AI‑powered systems
          that solve real problems and are genuinely easy to use.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#connect">Start a project</a>
          <a className="button button-secondary" href="#services">See what we build</a>
        </div>
      </div>

      {/* The interactive 3D bulb, framed like a specimen in a viewfinder. */}
      <div className="hero-stage" aria-hidden="true">
        <IdeaScene />
        <span className="hud-corner hud-tl"></span>
        <span className="hud-corner hud-tr"></span>
        <span className="hud-corner hud-bl"></span>
        <span className="hud-corner hud-br"></span>
        <span className="hud-label hud-label-top">FIG. 01 — THE IDEA</span>
        <span className="hud-label hud-label-bottom">REAL-TIME / WEBGL</span>
      </div>
    </section>
  );
}
