import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { pages } from '../navigation.js';
import Brand from './Brand.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);

    if (!open) return;

    // Lock scrolling completely when sidebar/menu is open
    const preventScroll = event => {
      event.preventDefault();
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        close();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', onKeyDown);
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
    };
  }, [open]);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 861px)');
    const onChange = event => { if (event.matches) close(); };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <header className={`site-header${scrolled || open ? ' is-scrolled' : ''}${scrolled ? ' is-compact' : ''}`}>
      <div className="header-inner">
        <Brand aria-label="TheInnoVibe home" onClick={close} />
        
        <button
          ref={toggleRef}
          className={open ? 'menu-toggle is-open' : 'menu-toggle'}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(value => !value)}
        >
          <span></span><span></span>
        </button>

        {/* Static Mobile Navigation Menu */}
        <nav id="navigation" className={`site-nav${open ? ' is-open' : ''}`} aria-label="Main navigation">
          <div className="sidebar-nav-links">
            {pages.map(page => (
              <NavLink key={page.to} to={page.to} end onClick={close}>
                <span>{page.label}</span>
                <span className="sidebar-nav-arrow" aria-hidden="true">&rarr;</span>
              </NavLink>
            ))}
          </div>

          <div className="sidebar-drawer-foot">
            <Link className="button button-primary nav-cta" to="/#connect" onClick={close}>
              Let’s connect <span aria-hidden="true">&rarr;</span>
            </Link>
            <div className="sidebar-motto">
              <span>THINK &bull; BUILD &bull; VIBE</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
