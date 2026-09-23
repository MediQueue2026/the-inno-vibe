import { Reveal } from '../hooks/useReveal.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { projects } from '../projects.js';
import PageHero from '../components/PageHero.jsx';
import lockup from '../assets/theinnovibe-brand-lockup.jpg';
import Services from '../components/Services.jsx';
import SystemsShowcase from '../components/SystemsShowcase.jsx';

const statusDot = status => status === 'In development' ? 'development-dot' : 'analysis-dot';

// The bulb with glowing lines drawn out to each product, like the brand poster.
function DomainMap() {
  return (
    <div className="domain-map">
      <div className="domain-map-bulb">
        <img src={lockup} alt="TheInnoVibe logo: a glowing blue light bulb above the TheInnoVibe wordmark" width="1000" height="1000" />
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
  return (
    <>
      <PageHero
        variant="domains"
        eyebrow="OUR DOMAINS & SYSTEMS"
        crumb="Domains & systems"
        title={<>Where we build,<br /><span className="gradient-text">and what we’re building.</span></>}
        actions={<>
          <a className="button button-primary" href="#systems">Explore our systems <span aria-hidden="true">↓</span></a>
          <a className="button button-secondary" href="#connect">Start a project</a>
        </>}
        jumps={[
          { href: '#services', label: 'What we do' },
          { href: '#domains', label: 'Our domains' },
          { href: '#systems', label: 'Our systems' }
        ]}
        visual={<DomainMap />}
      >
        We build custom software, websites and digital systems, and we’re working on our own products in healthcare, the home and education.
      </PageHero>

      <Services number="01" heading={false} />

      <section className="page-section section-wrap band" id="domains">
        <span className="eyebrow"><span className="section-number">02 /</span> OUR DOMAINS</span>
        <div className="card-grid card-grid-3">
          {projects.map(project => (
            <Reveal as="a" key={project.id} href={`#${project.id}`} className={`info-card domain-card ${project.id}`}>
              <span className={`product-icon ${project.iconClass}`} aria-hidden="true">{project.icon}</span>
              <h3>{project.domain}</h3>
              <p>{project.domainSummary}</p>
              <span className="domain-system">System: <strong>{project.title}</strong> <span aria-hidden="true">↓</span></span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-section section-wrap systems-section" id="systems">
        <span className="eyebrow"><span className="section-number">03 /</span> OUR SYSTEMS</span>
        <Reveal className="approach-heading">
          <h2>One purpose, three systems<span className="cyan">.</span></h2>
          <p>Choose a system to see the problem it solves and where it is in development.</p>
        </Reveal>
        <SystemsShowcase />
      </section>
    </>
  );
}
