import { Reveal } from '../hooks/useReveal.jsx';

const EMAIL = 'theinnovibe@gmail.com';

const steps = [
  { title: 'Share the idea', text: 'Tell us the problem, the people it affects and where you want to go.' },
  { title: 'Shape the plan', text: 'We scope it together and map the clearest path from concept to launch.' },
  { title: 'Build it for real', text: 'We design, build and ship — then keep improving it with you.' }
];

const values = ['Ideas', 'Technology', 'People', 'Solutions'];

// Final call to action, shown once at the end of the home page.
export default function Connect() {
  return (
    <section className="connect" id="connect" aria-labelledby="connect-title">
      <div className="connect-bg" aria-hidden="true"></div>

      <Reveal className="connect-panel section-wrap">
        <div className="connect-copy">
          <span className="eyebrow connect-eyebrow">
            <span className="connect-pulse" aria-hidden="true"></span>
            LET&apos;S BUILD TOGETHER
          </span>
          <h2 id="connect-title">
            Have an idea <span className="connect-gradient">worth building?</span>
          </h2>
          <p className="connect-lead">
            Tell us the problem. We&apos;ll help turn it into something real — thoughtfully designed, carefully built.
          </p>
          <div className="connect-buttons">
            <a className="button button-primary" href={`mailto:${EMAIL}?subject=New%20project%20enquiry`}>
              Start a Project <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        <ol className="connect-steps" aria-label="How we work together">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className="connect-step-num" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="connect-values" aria-label="What we bring together">
          {values.map(value => <span key={value}>{value}</span>)}
          <span className="connect-values-arrow" aria-hidden="true">&rarr;</span>
          <strong>A brighter tomorrow</strong>
        </div>
      </Reveal>
    </section>
  );
}
