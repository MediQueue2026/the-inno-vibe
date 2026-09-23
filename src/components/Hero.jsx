import { Link } from 'react-router';
import { useMotionPaused } from '../motion.js';
import { services } from '../services.js';
import IdeaScene from './IdeaScene.jsx';

export default function Hero({ onToggleMotion }) {
  const paused = useMotionPaused();
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot"></span> TECHNOLOGY STARTUP. REAL-WORLD SOLUTIONS.</div>
        <h1>Think Beyond.<br />Build Better.<br /><span className="gradient-text">Vibe Different.</span></h1>
        <p>We’re TheInnoVibe, a technology startup turning<br className="desktop-break" /> real-world challenges into purposeful software.<br className="desktop-break" /> Built around people. Driven by innovation.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#services">Explore what we do <span aria-hidden="true">↗</span></a>
          <Link className="button button-secondary" to="/about">Meet TheInnoVibe <span aria-hidden="true">→</span></Link>
        </div>
        <ul className="hero-tags" aria-label="What we do">
          {services.map(service => <li key={service.id}>{service.title}</li>)}
        </ul>
      </div>
      <IdeaScene />
      <div className="hero-bottom">
        <button id="motion-toggle" type="button" aria-pressed={paused} onClick={onToggleMotion}>
          {paused ? <>Resume motion <span aria-hidden="true">▷</span></> : <>Pause motion <span aria-hidden="true">Ⅱ</span></>}
        </button>
        <span>THINK<span className="divider-dot">·</span>BUILD<span className="divider-dot">·</span>VIBE</span>
        <a href="#about">A little more about us <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
