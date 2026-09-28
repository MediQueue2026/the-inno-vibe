import { Reveal } from '../hooks/useReveal.jsx';

const principles = [
  {
    number: '01',
    title: 'Think first',
    text: 'Understand the real problem before building.'
  },
  {
    number: '02',
    title: 'Build with purpose',
    text: 'Technology should solve a real need.'
  },
  {
    number: '03',
    title: 'Design for people',
    text: 'Software should be useful and intuitive.'
  },
  {
    number: '04',
    title: "Build for what's next",
    text: 'Create systems that can evolve with the business.'
  }
];

export default function WhyTheInnoVibe() {
  return (
    <section className="why-us section-wrap" id="why-us">
      <div className="why-intro">
        <span className="eyebrow"><span className="section-number">04 /</span> WHY THEINNOVVIBE</span>
        <Reveal>
          <h2>Not just another<br />{' '}software company<span className="cyan">.</span></h2>
          <p>We bring clear thinking, thoughtful design and purposeful engineering to the work that matters.</p>
        </Reveal>
      </div>
      <div className="principles-grid">
        {principles.map(principle => (
          <Reveal as="article" className="principle-card" key={principle.number}>
            <span className="principle-number">{principle.number}</span>
            <span className="principle-orbit" aria-hidden="true" />
            <h3>{principle.title}</h3>
            <p>{principle.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
