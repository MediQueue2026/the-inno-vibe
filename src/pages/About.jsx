import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { useCountUp } from '../hooks/useCountUp.js';
import PageHero, { AnimatedWords } from '../components/PageHero.jsx';
import lockup from '../assets/theinnovibe-brand-lockup.jpg';
import { services } from '../services.js';
import { projects } from '../projects.js';

const values = [
  {
    number: '01',
    title: 'Empathy First',
    subtitle: 'UNDERSTAND BEFORE CODING',
    text: 'We study real workflows and user friction before writing a single line of code.'
  },
  {
    number: '02',
    title: 'Lean & Purposeful',
    subtitle: 'NO ARTIFICIAL BLOAT',
    text: 'Every screen and feature must earn its place by solving a genuine human need.'
  },
  {
    number: '03',
    title: 'Engineered to Last',
    subtitle: 'HIGH RELIABILITY',
    text: 'Clean architecture, thorough testing, and systems built to scale seamlessly.'
  },
  {
    number: '04',
    title: 'Iterative Growth',
    subtitle: 'SHIP & REFINE',
    text: 'We test early with real users, iterate fast, and continuously measure impact.'
  }
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
          { href: '#values', label: 'Our values' }
        ]}
        visual={<AboutOrbit />}
      >
        We turn complex challenges into purposeful digital systems built around people.
      </PageHero>

      <section className="about section-wrap" id="who-we-are">
        <Reveal className="about-intro-col">
          <span className="eyebrow about-eyebrow">
            <span className="about-pulse" aria-hidden="true"></span>
            <span className="section-number">01 /</span> WHO WE ARE
          </span>
          <h2>
            Real challenges.<br />
            Fresh thinking.<br />
            <span className="gradient-text">Engineered into solutions.</span>
          </h2>
          <div className="about-pillars" aria-label="Core pillars">
            <div className="about-pillar-item">
              <span className="pillar-dot" aria-hidden="true"></span>
              <div>
                <strong>Product Thinking</strong>
                <small>Grounding systems in real human workflows</small>
              </div>
            </div>
            <div className="about-pillar-item">
              <span className="pillar-dot" aria-hidden="true"></span>
              <div>
                <strong>Modern Engineering</strong>
                <small>Scalable, maintainable code built to endure</small>
              </div>
            </div>
            <div className="about-pillar-item">
              <span className="pillar-dot" aria-hidden="true"></span>
              <div>
                <strong>Human-Centered Design</strong>
                <small>Intuitive interfaces that remove daily friction</small>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="about-story-card">
          <div className="about-card-badge">THEINNOVIBE AT A GLANCE</div>
          <p className="about-lead">
            We’re TheInnoVibe — a technology studio creating software that simplifies everyday life.
          </p>
          <p className="about-body-text">
            We combine human-centered design and resilient engineering across healthcare, home management, and education to build systems that work effortlessly.
          </p>
          <div className="about-domains-strip">
            <span className="about-domains-label">Focus spaces:</span>
            <span className="about-domain-pill">Healthcare</span>
            <span className="about-domain-pill">Everyday living</span>
            <span className="about-domain-pill">Education</span>
          </div>
          <div className="about-card-actions">
            <Link className="button button-primary" to="/domains">
              See where we work <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-secondary" to="/team">
              Meet the team
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="page-section section-wrap band" id="mission">
        <span className="eyebrow"><span className="section-number">02 /</span> MISSION & VISION</span>
        <div className="card-grid">
          <Reveal as="article" className="info-card mission-card">
            <div className="info-card-top">
              <span className="value-icon" aria-hidden="true">◎</span>
              <span className="info-card-badge">01 / PURPOSE</span>
            </div>
            <h3>Our mission</h3>
            <p>To turn real-world challenges into purposeful software engineered for the people who use it every day.</p>
          </Reveal>
          <Reveal as="article" className="info-card vision-card">
            <div className="info-card-top">
              <span className="value-icon" aria-hidden="true">✧</span>
              <span className="info-card-badge">02 / DIRECTION</span>
            </div>
            <h3>Our vision</h3>
            <p>Everyday digital systems that feel calmer, clearer, and genuinely friction-free.</p>
          </Reveal>
        </div>
      </section>

      <section className="page-section section-wrap" id="values">
        <span className="eyebrow"><span className="section-number">03 /</span> OUR CORE VALUES</span>
        <Reveal className="approach-heading values-section-heading">
          <h2>Principles that guide<br /><span className="gradient-text">every product we build.</span></h2>
          <p>The engineering mindset, ethical standards, and cultural philosophy behind our work.</p>
        </Reveal>
        <div className="about-values-grid">
          {values.map(val => (
            <Reveal as="article" key={val.number} className="about-value-card">
              <div className="about-value-top">
                <span className="about-value-num">{val.number}</span>
                <span className="about-value-sub">{val.subtitle}</span>
              </div>
              <h3>{val.title}</h3>
              <p>{val.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="about-connect-banner">
          <div className="about-banner-copy">
            <h3>Ready to see what we’re building?</h3>
            <p>Explore our active domains and systems, or connect with the engineers and creators behind the vibe.</p>
          </div>
          <div className="about-banner-actions">
            <Link className="button button-primary" to="/domains">
              Explore our systems <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-secondary" to="/team">
              Meet the team
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
