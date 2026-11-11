import { Link } from 'react-router';
import HeroVisual from './HeroVisual.jsx';

export default function Hero() {
  return (
    <section className="hero section-wrap dark-hero" id="home">
      <div className="hero-bg-animated" aria-hidden="true"></div>
      
      <div className="hero-copy">
        <div className="eyebrow hero-eyebrow">
          <span className="hero-eyebrow-dot" aria-hidden="true"></span>
          DIGITAL INNOVATION &bull; WEB &bull; SMART SYSTEMS
        </div>

        <h1>
          <span className="hero-title-line">Think Beyond.</span>
          <span className="hero-title-line">Build Better.</span>
          <span className="hero-title-line gradient-text">Vibe Different.</span>
        </h1>

        <p>
          We design and build modern digital products, web experiences, and smart systems that solve real problems and are genuinely easy to use.
        </p>

        <div className="hero-actions">
          <a className="button button-primary" href="#connect">
            Start a Project <span aria-hidden="true">&rarr;</span>
          </a>
          <a className="button button-secondary" href="#services">
            Explore What We Do <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <div className="hero-right-stage">
        <HeroVisual />
      </div>

      <div className="hero-bottom">
        <span className="hero-motto">
          THINK<span className="divider-dot">&bull;</span>BUILD<span className="divider-dot">&bull;</span>VIBE
        </span>
        <Link className="hero-about-link" to="/about">
          A little more about us <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
