import { Reveal } from '../hooks/useReveal.jsx';

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
    text: 'Every feature must earn its place by removing genuine everyday friction.'
  },
  {
    number: '03',
    tag: 'EXPERIENCE',
    title: 'Design for people',
    text: 'Intuitive, calm interfaces that anyone can pick up and use immediately.'
  },
  {
    number: '04',
    tag: 'LONGEVITY',
    title: "Build for what's next",
    text: 'Resilient architectures engineered to scale smoothly as your needs grow.'
  }
];

export default function WhyTheInnoVibe() {
  return (
    <section className="why-us section-wrap" id="why-us">
      <div className="why-intro">
        <span className="eyebrow"><span className="section-number">04 /</span> WHY THEINNOVIBE</span>
        <Reveal>
          <h2>Not just another<br />{' '}software company<span className="cyan">.</span></h2>
          <p>Clear thinking, clean design, and purposeful engineering for products that last.</p>
          <div className="why-highlights" aria-label="Core strengths">
            <span>Human-centered</span>
            <span>Engineered to last</span>
            <span>Built with care</span>
          </div>
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
