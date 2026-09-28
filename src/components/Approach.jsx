import { useEffect, useRef, useState } from 'react';
import { Reveal } from '../hooks/useReveal.jsx';

const steps = ['Understand', 'Plan', 'Design', 'Build', 'Test', 'Launch'];

export default function Approach({ number = '03' }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let animationFrame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const rect = section.getBoundingClientRect();
        const travel = Math.max(rect.height - window.innerHeight * 0.45, 1);
        const progress = Math.min(Math.max((window.innerHeight * 0.72 - rect.top) / travel, 0), 1);
        const step = Math.min(Math.floor(progress * steps.length), steps.length - 1);
        track.style.setProperty('--process-progress', `${progress * 83.4}%`);
        setActiveStep(current => current === step ? current : step);
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <section className="approach section-wrap" id="approach" ref={sectionRef}>
      <span className="eyebrow"><span className="section-number">{number} /</span> HOW WE BUILD</span>
      <Reveal className="approach-heading">
        <h2>Think. Build. Vibe<span className="cyan">.</span></h2>
        <p>From understanding the problem to building a product that works in the real world.</p>
      </Reveal>
      <ol className="process-track" ref={trackRef} aria-label="Our six-step process">
        <span className="process-line" aria-hidden="true" />
        <span className="process-line-fill" aria-hidden="true" />
        {steps.map((step, index) => (
          <li
            key={step}
            className={index <= activeStep ? 'is-active' : ''}
            aria-current={index === activeStep ? 'step' : undefined}
          >
            <span className="process-node">
              <span className="process-icon" aria-hidden="true">{['⌕', '▤', '✳', '</>', '✓', '↗'][index]}</span>
              <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
            </span>
            <span className="process-label">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
