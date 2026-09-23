import { useEffect, useRef, useState } from 'react';
import { useMotionPaused } from '../motion.js';

// The interactive 3D light bulb in the home page hero.
export default function IdeaScene() {
  const paused = useMotionPaused();
  const hostRef = useRef(null);
  const sceneRef = useRef(null);
  const pausedRef = useRef(paused);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import('../scene/createIdeaScene.js')
      .then(({ createIdeaScene }) => createIdeaScene(hostRef.current, {
        isPaused: () => pausedRef.current,
        onReadyChange: setReady
      }))
      .then(scene => {
        if (cancelled) scene.dispose();
        else sceneRef.current = scene;
      })
      .catch(error => console.info('The 3D illustration is unavailable.', error));
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    sceneRef.current?.sync();
  }, [paused]);

  return (
    <div className={ready ? 'hero-art scene-ready' : 'hero-art'}>
      <div id="idea-scene" ref={hostRef} aria-hidden="true"></div>
    </div>
  );
}
