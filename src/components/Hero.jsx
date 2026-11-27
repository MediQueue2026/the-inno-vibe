import { Link } from 'react-router';
import { services } from '../services.js';

// The headline steps forward line by line and gains brightness,
// like an idea coming into focus — the story the film below continues.
const HEADLINE = ['Think beyond.', 'Build better.', 'Vibe different.'];

export default function Hero() {
  return (
    <section className="hero section-wrap dark-hero" id="home" aria-labelledby="hero-title">
      <div className="hero-bg-animated" aria-hidden="true"></div>

      <div className="hero-copy">
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

      <nav className="hero-bottom" aria-label="What we build">
        <ul className="hero-services">
          {services.map(service => (
            <li key={service.id}>
              <a href="#services">{service.title}</a>
            </li>
          ))}
        </ul>
        <Link className="hero-about-link" to="/about">About us</Link>
      </nav>
    </section>
  );
}
