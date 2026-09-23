import { Link } from 'react-router';
import { Reveal } from '../hooks/useReveal.jsx';
import { services } from '../services.js';

const icons = {
  software: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" /></>,
  web: <><rect x="2.5" y="4" width="15" height="12" rx="2" /><path d="M2.5 7.5h15" /><rect x="15" y="10" width="6.5" height="10" rx="1.5" /><path d="M6 12.5l-1.5 1.5L6 15.5M10 12.5l1.5 1.5L10 15.5" /></>,
  digital: <><path d="M7 17.5h10.5a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.4 8.1 4.7 4.7 0 0 0 7 17.5z" /><path d="M10 13.5h4M12.5 11.5l2 2-2 2" /></>
};

export default function Services({ number, heading = true, band = false }) {
  return (
    <section className={band ? 'services section-wrap band' : 'services section-wrap'} id="services">
      <span className="eyebrow"><span className="section-number">{number} /</span> WHAT WE DO</span>
      {heading && (
        <Reveal className="approach-heading">
          <h2>Crafting digital futures<span className="cyan">.</span></h2>
          <p>From elegant software to impactful websites, we turn ideas into innovation.</p>
        </Reveal>
      )}
      <div className="services-grid">
        {services.map(service => (
          <Reveal as="article" key={service.id} className="service-card">
            <span className="service-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icons[service.id]}</svg>
            </span>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </Reveal>
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
