import { createContext, useContext } from 'react';

// True when ambient motion is paused, by the user or a reduced-motion preference.
export const MotionContext = createContext(false);
export const useMotionPaused = () => useContext(MotionContext);
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
