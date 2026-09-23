import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';

export default function About() {
  return (
    <section className="about section-wrap" id="about">
      <Reveal className="section-heading">
        <span className="eyebrow"><span className="section-number">01 /</span> TECHNOLOGY WITH PURPOSE</span>
        <h2>Real challenges.<br />Fresh thinking.<br /><span className="muted">Engineered into solutions.</span></h2>
      </Reveal>
      <Reveal className="about-copy">
        <p>We’re TheInnoVibe — a technology startup building digital products that simplify complex, everyday workflows.</p>
        <p>We work across custom software, web development and digital transformation. We start by understanding the people and processes behind each challenge, then bring product design and software engineering together to develop practical solutions.</p>
        <Link className="text-link" to="/about">Read our story <span aria-hidden="true">↗</span></Link>
      </Reveal>
    </section>
  );
}
