import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { projects } from '../projects.js';

const mediqueue = projects.find(project => project.id === 'mediqueue');

const principles = [
  {
    number: '01',
    tag: 'DISCOVERY',
    title: 'Think first',
    text: 'We understand the root problem and real user needs before writing any code.'
  },
  {
    number: '02',
    tag: 'INTENTION',
    title: 'Build with purpose',
    text: 'Every feature must earn its place by removing genuine everyday friction.',
    // Proof lines only where they add something not already on the page.
    proof: mediqueue && { text: `${mediqueue.title}'s first release is held to ${mediqueue.focus.length} features, each tied to a waiting-room problem.`, to: `/domains#${mediqueue.id}` }
  },
  {
    number: '03',
    tag: 'EXPERIENCE',
    title: 'Design for people',
    text: 'Intuitive, calm interfaces that anyone can pick up and use immediately.',
    proof: mediqueue && { text: 'Patients follow their place in the queue on their own phone instead of watching a waiting-room screen.', to: `/domains#${mediqueue.id}` }
  },
  {
    number: '04',
    tag: 'LONGEVITY',
    title: "Build for what's next",
    text: 'Resilient architectures engineered to scale smoothly as your needs grow.'
  }
];

function Proof({ proof }) {
  const label = <span className="principle-proof-label">In practice</span>;
  const arrow = <span className="principle-proof-arrow" aria-hidden="true">{proof.href ? '↗' : '→'}</span>;
  return proof.href
    ? <a className="principle-proof" href={proof.href} target="_blank" rel="noopener noreferrer">{label}<span>{proof.text}</span>{arrow}</a>
    : <Link className="principle-proof" to={proof.to}>{label}<span>{proof.text}</span>{arrow}</Link>;
}

export default function WhyTheInnoVibe({ number = '06' }) {
  return (
    <section className="why-us section-wrap" id="why-us">
      <div className="why-intro">
        <span className="eyebrow"><span className="section-number">{number} /</span> WHY THEINNOVIBE</span>
        <Reveal>
          <h2>Not just another<br />{' '}software company<span className="cyan">.</span></h2>
          <p>Clear thinking, clean design, and purposeful engineering for products that last.</p>
        </Reveal>
      </div>
      <div className="principles-grid">
        {principles.map((principle, index) => (
          <Reveal as="article" className={`principle-card principle-card-${index + 1}`} key={principle.number}>
            <div className="principle-top">
              <span className="principle-number">{principle.number} <span className="principle-tag">/ {principle.tag}</span></span>
              <span className="principle-orbit" aria-hidden="true" />
            </div>
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
            {principle.proof && <Proof proof={principle.proof} />}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
