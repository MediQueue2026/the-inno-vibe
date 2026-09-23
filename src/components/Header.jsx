import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
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
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        close();
        toggleRef.current.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    const desktop = matchMedia('(min-width: 861px)');
    const onChange = event => { if (event.matches) close(); };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <header className={scrolled || open ? 'site-header is-scrolled' : 'site-header'}>
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
        <nav id="navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Main navigation">
          {pages.map(page => <NavLink key={page.to} to={page.to} end onClick={close}>{page.label}</NavLink>)}
          <a className="button button-primary nav-cta" href="#connect" onClick={close}>Let’s connect <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
