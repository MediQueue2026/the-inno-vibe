import { useContext, useEffect } from 'react';
import { Reveal } from '../hooks/useReveal.jsx';
import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { projects } from '../projects.js';
import PageHero from '../components/PageHero.jsx';
import lockup from '../assets/theinnovibe-brand-lockup.jpg';
import Services from '../components/Services.jsx';
import SystemsShowcase from '../components/SystemsShowcase.jsx';
import { MotionContext } from '../motion.js';

const statusDot = status => status === 'In development' ? 'development-dot'
  : /test|qa/i.test(status) ? 'testing-dot'
  : 'analysis-dot';

// The bulb with glowing lines drawn out to each product, like the brand poster.
function DomainMap() {
  return (
    <div className="domain-map">
      <div className="domain-map-bulb">
        <img
          src={lockup}
          alt="TheInnoVibe logo: a glowing blue light bulb above the TheInnoVibe wordmark"
          width="1000"
          height="1000"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <svg className="domain-map-lines" viewBox="0 0 560 380" aria-hidden="true">
        {projects.map((project, index) => {
          // Must match the card positions in page-heroes.css: top 12 + i * 138, height 104.
          const y = 12 + index * 138 + 52;
          const d = `M200,190 C250,190 240,${y} 290,${y}`;
          return (
            <g key={project.id} style={{ '--i': index }}>
              <path className="line-base" d={d} pathLength="1" />
              <path className="line-flow" d={d} pathLength="1" />
            </g>
          );
        })}
      </svg>
      <ul className="domain-map-cards">
        {projects.map((project, index) => (
          <li key={project.id} className={project.id} style={{ '--i': index }}>
            <a href={`#${project.id}`}>
              <span className={`product-icon ${project.iconClass}`} aria-hidden="true">{project.icon}</span>
              <span className="domain-map-text">
                <small>{project.domain}</small>
                <strong>{project.title}</strong>
                <span className="domain-map-status"><i className={statusDot(project.status)}></i> {project.status}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Domains() {
  usePageTitle('Domains & systems');
  const motionPaused = useContext(MotionContext);

  useEffect(() => {
    const body = document.body;
    const resetParallax = () => {
      body.style.setProperty('--domains-parallax-x', '0px');
      body.style.setProperty('--domains-parallax-y', '0px');
      body.style.setProperty('--domains-tilt-x', '0deg');
      body.style.setProperty('--domains-tilt-y', '0deg');
    };

    if (motionPaused) {
      resetParallax();
      return;
    }

    const handlePointerMove = event => {
      if (event.pointerType === 'touch') return;

      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      body.style.setProperty('--domains-parallax-x', `${-x * 24}px`);
      body.style.setProperty('--domains-parallax-y', `${-y * 18}px`);
      body.style.setProperty('--domains-tilt-x', `${-y * 1.2}deg`);
      body.style.setProperty('--domains-tilt-y', `${x * 1.2}deg`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('blur', resetParallax);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', resetParallax);
      resetParallax();
    };
  }, [motionPaused]);

  return (
    <>
      <PageHero
        variant="domains"
        eyebrow="OUR DOMAINS & SYSTEMS"
        crumb="Domains & systems"
        title={<>Where we build,<br /><span className="gradient-text">and what we’re building.</span></>}
        actions={<>
          <a className="button button-primary" href="#systems">Explore our systems <span aria-hidden="true">↓</span></a>
          <Link className="button button-secondary" to="/#connect">Start a project</Link>
        </>}
        jumps={[
          { href: '#services', label: 'What we do' },
          { href: '#domains', label: 'Our domains' },
          { href: '#systems', label: 'Our systems' }
        ]}
        visual={<DomainMap />}
      >
        We build custom software and proprietary products across healthcare, home management, and education.
      </PageHero>

      <Services number="01" heading={false} />

      <section className="page-section section-wrap band" id="domains">
        <span className="eyebrow"><span className="section-number">02 /</span> OUR DOMAINS</span>
        <Reveal className="approach-heading domain-section-heading">
          <h2>Focused on everyday life<span className="cyan">.</span></h2>
          <p>Three essential spaces where thoughtful software brings clarity and order.</p>
        </Reveal>
        <div className="card-grid card-grid-3 domain-grid">
          {projects.map((project, index) => (
            <Reveal as="a" key={project.id} href={`#${project.id}`} className={`info-card domain-card ${project.id}`}>
              <div className="domain-card-top">
                <span className={`product-icon ${project.iconClass}`} aria-hidden="true">{project.icon}</span>
                <span className="domain-index">0{index + 1} / DOMAIN</span>
              </div>
              <h3>{project.domain}</h3>
              <p>{project.domainSummary}</p>
              <span className="domain-system">
                <span>Featured system: <strong>{project.title}</strong></span>
                <span className="domain-system-arrow" aria-hidden="true">↓</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-section section-wrap systems-section" id="systems">
        <span className="eyebrow"><span className="section-number">03 /</span> OUR SYSTEMS</span>
        <Reveal className="approach-heading">
          <h2>One purpose, three systems<span className="cyan">.</span></h2>
          <p>Explore our active systems, current progress, and live deployments.</p>
        </Reveal>
        <SystemsShowcase />
      </section>
    </>
  );
}
