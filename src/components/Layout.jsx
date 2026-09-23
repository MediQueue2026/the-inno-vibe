import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { MotionContext } from '../motion.js';
import Header from './Header.jsx';
import Connect from './Connect.jsx';
import Footer from './Footer.jsx';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Scrolls to the top on page changes, or to the #section named in the URL.
function useScrollOnNavigate() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash, key]);
}

export default function Layout() {
  const [paused, setPaused] = useState(reducedMotion.matches);
  useScrollOnNavigate();

  useEffect(() => {
    const onChange = event => setPaused(event.matches);
    reducedMotion.addEventListener('change', onChange);
    return () => reducedMotion.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('motion-paused', paused);
  }, [paused]);

  return (
    <MotionContext.Provider value={paused}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Outlet context={{ toggleMotion: () => setPaused(value => !value) }} />
        <Connect />
      </main>
      <Footer />
    </MotionContext.Provider>
  );
}
