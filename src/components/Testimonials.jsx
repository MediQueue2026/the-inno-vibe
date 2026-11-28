import { Reveal } from '../hooks/useReveal.jsx';
import { testimonials } from '../testimonials.js';

// Client quotes and results from testimonials.js. Home.jsx only renders this section
// once there is at least one real testimonial; nothing here is ever invented.
export default function Testimonials({ number = '03' }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="proof section-wrap" id="proof" aria-labelledby="proof-title">
      <span className="eyebrow"><span className="section-number">{number} /</span> CLIENT RESULTS</span>
      <Reveal className="approach-heading">
        <h2 id="proof-title">
          What clients say<span className="cyan">.</span>
        </h2>
        <p>In their own words, with the results they saw.</p>
      </Reveal>

      <div className="proof-quotes">
          {testimonials.map(item => (
            <Reveal as="figure" className="proof-quote" key={`${item.name}-${item.quote.slice(0, 16)}`}>
              {item.result && <p className="proof-quote-result">{item.result}</p>}
              <blockquote>“{item.quote}”</blockquote>
              <figcaption>
                <strong>{item.name}</strong>
                <span>{[item.role, item.organisation].filter(Boolean).join(', ')}</span>
              </figcaption>
            </Reveal>
          ))}
      </div>
    </section>
  );
}
