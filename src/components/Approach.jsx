import { Reveal } from '../hooks/useReveal.jsx';

const values = [
  { icon: '✧', title: 'Think beyond.', text: 'Understand the problem before writing the code. Explore the workflows, question assumptions, and identify where technology can help.' },
  { icon: '⌘', title: 'Build better.', text: 'Connect thoughtful product design with purposeful engineering. Build, test, and refine with the people who will use the software.' },
  { icon: '≋', title: 'Vibe different.', text: 'Bring curiosity and collaboration to every iteration. Stay open to feedback and keep pushing for a better product experience.' }
];

export default function Approach({ number = '03' }) {
  return (
    <section className="approach section-wrap" id="approach">
      <span className="eyebrow"><span className="section-number">{number} /</span> HOW WE BUILD</span>
      <Reveal className="approach-heading">
        <h2>Think.Build.Vibe<span className="cyan">.</span></h2>
        <p>From understanding the problem to building the product.</p>
      </Reveal>
      <div className="values-grid">
        {values.map((value, index) => (
          <Reveal as="article" key={value.title}>
            <div className="value-top"><span className="value-icon" aria-hidden="true">{value.icon}</span><span>{String(index + 1).padStart(2, '0')}</span></div>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
