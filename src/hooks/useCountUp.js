import { useEffect, useRef, useState } from 'react';
import { useMotionPaused } from '../motion.js';

// Counts from 0 up to `target` once, unless motion is paused.
export function useCountUp(target, duration = 1100, delay = 500) {
  const paused = useMotionPaused();
  const pausedAtMount = useRef(paused);
  const [value, setValue] = useState(pausedAtMount.current ? target : 0);

  useEffect(() => {
    if (pausedAtMount.current) {
      setValue(target);
      return;
    }
    let frame;
    let start;
    const step = time => {
      start ??= time + delay;
      const progress = Math.min(Math.max((time - start) / duration, 0), 1);
      setValue(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, delay]);

  return value;
}
