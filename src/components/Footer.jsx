import { Link } from 'react-router';
import { pages } from '../navigation.js';
import { services } from '../services.js';
import Brand from './Brand.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-grid">
        <div className="footer-brand">
          <Brand size={40} />
          <p>Technology with purpose. Built with a different vibe.</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/the_innovibe/" target="_blank" rel="noopener" aria-label="TheInnoVibe on Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" /></svg>
            </a>
            <a href="https://www.linkedin.com/company/143891874/" target="_blank" rel="noopener" aria-label="TheInnoVibe on LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="3" /><line x1="7.5" y1="10" x2="7.5" y2="17" /><circle cx="7.5" cy="6.7" r="1" /><path d="M11.5 17v-4.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" /><line x1="11.5" y1="10.3" x2="11.5" y2="17" /></svg>
            </a>
          </div>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <ul>{pages.map(page => <li key={page.to}><Link to={page.to}>{page.label}</Link></li>)}</ul>
        </div>
        <div className="footer-column">
          <h2>What we do</h2>
          <ul>{services.map(service => <li key={service.id}><Link to="/domains#services">{service.title}</Link></li>)}</ul>
        </div>
        <div className="footer-column">
          <h2>Contact</h2>
          <ul>
            <li><a href="mailto:theinnovibe@gmail.com">theinnovibe@gmail.com</a></li>
            <li><a href="#connect">Start a conversation</a></li>
          </ul>
        </div>
      </div>
      <div className="section-wrap footer-bottom">
        <span>© {new Date().getFullYear()} TheInnoVibe. All rights reserved.</span>
        <span className="footer-motto">Think Beyond. Build Better. Vibe Different.</span>
        <a href="#main" className="back-top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0 }); }}>Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
