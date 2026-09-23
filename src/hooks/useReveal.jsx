import { useLayoutEffect, useRef, useState } from 'react';
import { useMotionPaused } from '../motion.js';

// Reveals an element once, the first time it scrolls into view.
export function useReveal() {
  const ref = useRef(null);
  const paused = useMotionPaused();
  const pausedAtMount = useRef(paused);
  const [pending, setPending] = useState(false);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!pausedAtMount.current && element.getBoundingClientRect().top > innerHeight) setPending(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPending(false);
        observer.disconnect();
      }
    }, { threshold: .08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, pending ? 'reveal is-pending' : 'reveal'];
}

export function Reveal({ as: Tag = 'div', className, ...props }) {
  const [ref, revealClass] = useReveal();
  return <Tag ref={ref} className={className ? `${className} ${revealClass}` : revealClass} {...props} />;
}
