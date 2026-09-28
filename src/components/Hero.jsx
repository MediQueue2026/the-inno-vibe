import { useMotionPaused } from '../motion.js';
import { services } from '../services.js';
import IdeaScene from './IdeaScene.jsx';

export default function Hero({ onToggleMotion }) {
  const paused = useMotionPaused();
  return (
    <section className="hero section-wrap dark-hero" id="home">
      <div className="hero-bg-animated" aria-hidden="true"></div>
      <div className="hero-copy">
        <div className="eyebrow">SOFTWARE &bull; AI &bull; ENGINEERING &bull; DIGITAL PRODUCTS</div>
        <h1>Think Beyond.<br />Build Better.<br /><span className="gradient-text">Vibe Different.</span></h1>
        <p>We turn your ideas and business problems into software people actually use.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#connect">Start a Project <span aria-hidden="true">&rarr;</span></a>
          <a className="button button-secondary" href="#work">See Our Work <span aria-hidden="true">&rarr;</span></a>
        </div>
        <ul className="hero-tags" aria-label="What we do">
          {services.map(service => <li key={service.id}>{service.title}</li>)}
        </ul>
      </div>
      <IdeaScene />
      <div className="hero-bottom">
        <button id="motion-toggle" type="button" aria-pressed={paused} onClick={onToggleMotion}>
          {paused ? <>Resume motion <span aria-hidden="true">&rarr;</span></> : <>Pause motion <span aria-hidden="true">&rarr;</span></>}
        </button>
        <span>THINK<span className="divider-dot">&bull;</span>BUILD<span className="divider-dot">&bull;</span>VIBE</span>
        <a href="#about">A little more about us <span aria-hidden="true">&rarr;</span></a>
      </div>
    </section>
  );
}
