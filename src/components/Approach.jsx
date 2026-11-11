import { useEffect, useRef, useState } from 'react';
import { Reveal } from '../hooks/useReveal.jsx';

const steps = [
  { label: 'Understand', detail: 'Research workflows & user needs', icon: '⌕' },
  { label: 'Plan', detail: 'Define architecture & scope', icon: '▤' },
  { label: 'Design', detail: 'Craft intuitive interfaces', icon: '✳' },
  { label: 'Build', detail: 'Engineer reliable systems', icon: '</>' },
  { label: 'Test', detail: 'Verify quality & edge cases', icon: '✓' },
  { label: 'Launch', detail: 'Deploy, measure & evolve', icon: '↗' }
];

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
            key={step.label}
            className={`${index <= activeStep ? 'is-active' : ''}${index === activeStep ? ' is-current' : ''}`}
            aria-current={index === activeStep ? 'step' : undefined}
          >
            <div className="process-card">
              <span className="process-node">
                <span className="process-icon" aria-hidden="true">{step.icon}</span>
                <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
              </span>
              <span className="process-label">{step.label}</span>
              <span className="process-detail">{step.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
