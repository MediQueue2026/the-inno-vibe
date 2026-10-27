import { lazy, Suspense, useRef } from 'react';
import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { services } from '../services.js';

const ServiceModel = lazy(() => import('./ServiceModel.jsx'));

const icons = {
  software: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" /></>,
  web: <><rect x="2.5" y="4" width="15" height="12" rx="2" /><path d="M2.5 7.5h15" /><rect x="15" y="10" width="6.5" height="10" rx="1.5" /><path d="M6 12.5l-1.5 1.5L6 15.5M10 12.5l1.5 1.5L10 15.5" /></>,
  ai: <><path d="M9 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 2.8V11a3 3 0 0 0 1 5.8V18a3 3 0 0 0 3 3" /><path d="M15 3a3 3 0 0 1 3 3v1a3 3 0 0 1 2 2.8V11a3 3 0 0 1-1 5.8V18a3 3 0 0 1-3 3M9 3v18M15 3v18M9 8h6M9 16h6" /></>,
  systems: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" /></>
};

function updateCardPointer(event, pointer) {
  if (event.pointerType !== 'mouse') return;

  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;

  pointer.current.active = true;
  pointer.current.x = (x - 0.5) * 2;
  pointer.current.y = (y - 0.5) * 2;
  card.style.setProperty('--service-tilt-x', `${(0.5 - y) * 4}deg`);
  card.style.setProperty('--service-tilt-y', `${(x - 0.5) * 4}deg`);
  card.style.setProperty('--service-pointer-x', `${x * 100}%`);
  card.style.setProperty('--service-pointer-y', `${y * 100}%`);
}

function resetCardPointer(event, pointer) {
  pointer.current.active = false;
  pointer.current.x = 0;
  pointer.current.y = 0;
  const card = event.currentTarget;
  card.style.setProperty('--service-tilt-x', '0deg');
  card.style.setProperty('--service-tilt-y', '0deg');
  card.style.setProperty('--service-pointer-x', '50%');
  card.style.setProperty('--service-pointer-y', '50%');
}

function ServiceCard({ service, index, showModels }) {
  const pointer = useRef({ x: 0, y: 0, active: false });

  return (
    <Reveal
      as="article"
      className={`service-card service-card-${service.id}`}
      onPointerMove={event => updateCardPointer(event, pointer)}
      onPointerLeave={event => resetCardPointer(event, pointer)}
    >
      {showModels && (
        <div className="service-model" aria-hidden="true">
          <Suspense fallback={null}>
            <ServiceModel type={service.id} pointer={pointer} />
          </Suspense>
        </div>
      )}
      <span className="service-index">{String(index + 1).padStart(2, '0')} / CAPABILITY</span>
      {!showModels && (
        <span className="service-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icons[service.id]}</svg>
        </span>
      )}
      <h3>{service.title}</h3>
      <p>{service.text}</p>
    </Reveal>
  );
}

export default function Services({ number, heading = true, band = false, showModels = false }) {
  return (
    <section className={band ? 'services section-wrap band' : 'services section-wrap'} id="services">
      <span className="eyebrow"><span className="section-number">{number} /</span> WHAT WE DO</span>
      {heading && (
        <Reveal className="approach-heading">
          <h2>Crafting digital futures<span className="cyan">.</span></h2>
          <p>From elegant software to impactful digital products, we turn ideas into useful technology.</p>
        </Reveal>
      )}
      <div className="services-grid">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            showModels={showModels}
          />
        ))}
      </div>
      {heading && (
        <div className="section-footer">
          <Link className="text-link" to="/domains">See our domains & systems <span aria-hidden="true">→</span></Link>
        </div>
      )}
    </section>
  );
}
