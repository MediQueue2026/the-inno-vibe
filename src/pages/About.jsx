import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { useCountUp } from '../hooks/useCountUp.js';
import PageHero, { AnimatedWords } from '../components/PageHero.jsx';
import lockup from '../assets/theinnovibe-brand-lockup.jpg';
import Approach from '../components/Approach.jsx';
import { services } from '../services.js';
import { projects } from '../projects.js';

const process = [
  { title: 'Understand', text: 'Spend time with the people and processes behind a challenge before deciding what to build.' },
  { title: 'Design', text: 'Shape the product around real workflows, so it feels familiar from the first use.' },
  { title: 'Build', text: 'Engineer reliable software in small, testable steps, alongside the people who will use it.' },
  { title: 'Refine', text: 'Listen to feedback, measure what helps, and keep improving the experience.' }
];

function Stat({ value, label }) {
  const shown = useCountUp(value);
  return <div><dt>{label}</dt><dd aria-label={String(value)}>{shown}</dd></div>;
}

function AboutOrbit() {
  const stats = [
    { value: services.length, label: 'Services' },
    { value: new Set(projects.map(project => project.domain)).size, label: 'Domains' },
    { value: projects.length, label: 'Products' }
  ];
  return (
    <div className="about-orbit">
      <div className="orbit-stage">
        <span className="orbit-ring orbit-ring-outer" aria-hidden="true"></span>
        <div className="orbit-ring orbit-ring-chips" aria-hidden="true">
          {['Think', 'Build', 'Vibe'].map((word, index) => (
            <span key={word} className={`orbit-chip orbit-chip-${index + 1}`}><span>{word}</span></span>
          ))}
        </div>
        <img
          className="orbit-medallion"
          src={lockup}
          alt="TheInnoVibe logo: a glowing blue light bulb above the TheInnoVibe wordmark and the tagline Think, Build, Vibe"
          width="1000"
          height="1000"
        />
      </div>
      <dl className="about-stats">
        {stats.map(stat => <Stat key={stat.label} {...stat} />)}
      </dl>
    </div>
  );
}

export default function About() {
  usePageTitle('About us');
  return (
    <>
      <PageHero
        variant="about"
        eyebrow="ABOUT US"
        crumb="About us"
        title={<><AnimatedWords text="A technology startup" /><br /><span className="gradient-text"><AnimatedWords text="building for real life." start={3} /></span></>}
        actions={<>
          <Link className="button button-primary" to="/domains">See what we build <span aria-hidden="true">→</span></Link>
          <Link className="button button-secondary" to="/team">Meet the team</Link>
        </>}
        jumps={[
          { href: '#who-we-are', label: 'Who we are' },
          { href: '#mission', label: 'Mission & vision' },
          { href: '#approach', label: 'How we build' },
          { href: '#process', label: 'Our process' }
        ]}
        visual={<AboutOrbit />}
      >
        TheInnoVibe turns real-world challenges into purposeful software. Built around people. Driven by innovation.
      </PageHero>

      <section className="about section-wrap" id="who-we-are">
        <Reveal className="section-heading">
          <span className="eyebrow"><span className="section-number">01 /</span> WHO WE ARE</span>
          <h2>Real challenges.<br />Fresh thinking.<br /><span className="muted">Engineered into solutions.</span></h2>
        </Reveal>
        <Reveal className="about-copy">
          <p>We’re TheInnoVibe — a technology startup building digital products that simplify complex, everyday workflows.</p>
          <p>Alongside custom software, web development and digital transformation work, our own products span healthcare, household management and education. We start by understanding the people and processes behind each challenge, then bring product design and software engineering together to develop practical solutions.</p>
          <Link className="text-link" to="/domains">See where we work <span aria-hidden="true">↗</span></Link>
        </Reveal>
      </section>

      <section className="page-section section-wrap band" id="mission">
        <span className="eyebrow"><span className="section-number">02 /</span> MISSION & VISION</span>
        <div className="card-grid">
          <Reveal as="article" className="info-card">
            <span className="value-icon" aria-hidden="true">◎</span>
            <h3>Our mission</h3>
            <p>To turn real-world challenges into purposeful software that is built around the people who use it every day.</p>
          </Reveal>
          <Reveal as="article" className="info-card">
            <span className="value-icon" aria-hidden="true">✧</span>
            <h3>Our vision</h3>
            <p>Everyday systems that feel calmer, clearer and simpler, starting with healthcare, the home and education.</p>
          </Reveal>
        </div>
      </section>

      <Approach />

      <section className="page-section section-wrap" id="process">
        <span className="eyebrow"><span className="section-number">04 /</span> OUR PROCESS</span>
        <Reveal className="approach-heading">
          <h2>From idea to impact<span className="cyan">.</span></h2>
          <p>Four steps we follow for every product.</p>
        </Reveal>
        <ol className="process-list">
          {process.map((step, index) => (
            <Reveal as="li" key={step.title}>
              <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </ol>
        <div className="page-links">
          <Link className="button button-secondary" to="/team">Meet the team <span aria-hidden="true">→</span></Link>
          <Link className="text-link" to="/domains">Explore our domains & systems <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </>
  );
}
