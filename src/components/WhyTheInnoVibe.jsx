import { Reveal } from '../hooks/useReveal.jsx';

const principles = [
  {
    number: '01',
    tag: 'DISCOVERY',
    title: 'Think first',
    text: 'Understand the real problem and the people behind it before writing a single line of code.'
  },
  {
    number: '02',
    tag: 'INTENTION',
    title: 'Build with purpose',
    text: 'Every feature and decision should solve a genuine need and remove everyday friction.'
  },
  {
    number: '03',
    tag: 'EXPERIENCE',
    title: 'Design for people',
    text: 'Software should feel calm, clear and intuitive from the very first interaction.'
  },
  {
    number: '04',
    tag: 'LONGEVITY',
    title: "Build for what's next",
    text: 'Architect reliable, maintainable systems that scale and evolve with the business.'
  }
];

export default function WhyTheInnoVibe() {
  return (
    <section className="why-us section-wrap" id="why-us">
      <div className="why-intro">
        <span className="eyebrow"><span className="section-number">04 /</span> WHY THEINNOVIBE</span>
        <Reveal>
          <h2>Not just another<br />{' '}software company<span className="cyan">.</span></h2>
          <p>We bring clear thinking, thoughtful design and purposeful engineering to the work that matters.</p>
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
