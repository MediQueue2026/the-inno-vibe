import { useEffect, useRef, useState } from 'react';

const framesData = [
  {
    id: 'idea',
    frame: '01',
    label: 'THE IDEA',
    title: 'It Starts With an Idea.',
    text: 'Every great product begins with a spark.'
  },
  {
    id: 'challenges',
    frame: '02',
    label: 'CHALLENGES',
    title: 'But Reality Gets Complex.',
    text: 'Requirements change. New challenges appear. Systems get complicated.'
  },
  {
    id: 'break',
    frame: '03',
    label: 'BREAK IT DOWN',
    title: 'We Break It Down.',
    text: 'We analyze the problem, separate the complexity and find what really matters.'
  },
  {
    id: 'explore',
    frame: '04',
    label: 'EXPLORE & CONNECT',
    title: 'Ideas Move in Many Directions.',
    text: 'We investigate, experiment and connect the dots to find the right path.'
  },
  {
    id: 'solution',
    frame: '05',
    label: 'A SOLUTION EMERGES',
    title: 'The Right Path Takes Shape.',
    text: 'Through engineering, testing and insight, the solution becomes clear.'
  },
  {
    id: 'build',
    frame: '06',
    label: 'BUILD & UNITE',
    title: 'Putting Everything Back Together.',
    text: 'We turn the solution into reliable, scalable real-world technology.'
  },
  {
    id: 'impact',
    frame: '07',
    label: 'REAL IMPACT',
    title: 'Ideas That Create a Bigger World.',
    text: 'Your ideas can create real impact for people, businesses and communities.'
  }
];

const FRAME_COUNT = 240;
const MAX_CACHED_FRAMES = 36;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function CinematicStory() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndicatorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!section || !canvas || !context) return undefined;

    const images = new Array(FRAME_COUNT);
    let targetProgress = 0;
    let targetFrame = 0;
    let drawnFrame = -1;
    let renderRequest = 0;
    let disposed = false;
    let lastStoryIndex = -1;

    const paint = () => {
      renderRequest = 0;
      if (disposed) return;

      const rect = section.getBoundingClientRect();
      const stickyTop = document.querySelector('.site-header')?.offsetHeight ?? 0;
      const travel = Math.max(section.offsetHeight - window.innerHeight + stickyTop, 1);
      targetProgress = clamp((stickyTop - rect.top) / travel, 0, 1);
      targetFrame = Math.round(targetProgress * (FRAME_COUNT - 1));
      if (frameIndicatorRef.current) {
        frameIndicatorRef.current.textContent = String(targetFrame + 1).padStart(4, '0');
      }
      const storyIndex = Math.min(Math.floor(targetProgress * framesData.length), framesData.length - 1);
      if (storyIndex !== lastStoryIndex) {
        lastStoryIndex = storyIndex;
        setActiveIndex(storyIndex);
      }

      const firstFrame = Math.max(0, targetFrame - 4);
      const lastFrame = Math.min(FRAME_COUNT - 1, targetFrame + 12);
      for (let index = firstFrame; index <= lastFrame; index += 1) loadFrame(index);
      pruneFrames();

      let imageIndex = targetFrame;
      let image = images[targetFrame];
      if (!image?.complete || !image.naturalWidth) {
        for (let distance = 1; distance < FRAME_COUNT; distance++) {
          const before = images[targetFrame - distance];
          const after = images[targetFrame + distance];
          if (before?.complete && before.naturalWidth) {
            image = before;
            imageIndex = targetFrame - distance;
            break;
          }
          if (after?.complete && after.naturalWidth) {
            image = after;
            imageIndex = targetFrame + distance;
            break;
          }
        }
      }
      if (!image?.complete || !image.naturalWidth || drawnFrame === imageIndex) return;

      const width = canvas.width;
      const height = canvas.height;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.fillStyle = '#020611';
      context.fillRect(0, 0, width, height);
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      drawnFrame = imageIndex;
    };

    const schedulePaint = () => {
      if (!renderRequest) renderRequest = requestAnimationFrame(paint);
    };

    function loadFrame(index) {
      if (index < 0 || index >= FRAME_COUNT || images[index] || disposed) return;
      const image = new Image();
      images[index] = image;
      image.onload = () => {
        pruneFrames();
        schedulePaint();
      };
      image.onerror = () => {
        console.error(`Unable to load cinematic frame ${String(index + 1).padStart(4, '0')}.`);
      };
      image.src = `/images/frame-${String(index + 1).padStart(4, '0')}.jpg`;
    }

    function pruneFrames() {
      const cachedIndices = [];
      images.forEach((image, index) => {
        if (image) cachedIndices.push(index);
      });
      if (cachedIndices.length <= MAX_CACHED_FRAMES) return;

      const keep = new Set(cachedIndices
        .sort((first, second) => Math.abs(first - targetFrame) - Math.abs(second - targetFrame))
        .slice(0, MAX_CACHED_FRAMES));
      cachedIndices.forEach(index => {
        if (keep.has(index)) return;
        const image = images[index];
        image.onload = null;
        image.onerror = null;
        image.removeAttribute('src');
        images[index] = undefined;
      });
    }

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, matchMedia('(max-width: 640px)').matches ? 1 : 1.5);
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      drawnFrame = -1;
      schedulePaint();
    };

    loadFrame(0);
    for (let index = 1; index < 12; index += 1) loadFrame(index);
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();
    window.addEventListener('scroll', schedulePaint, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    return () => {
      disposed = true;
      if (renderRequest) cancelAnimationFrame(renderRequest);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedulePaint);
      window.removeEventListener('resize', resizeCanvas);
      images.forEach(image => {
        if (image) {
          image.onload = null;
          image.onerror = null;
          image.removeAttribute('src');
        }
      });
    };
  }, []);

  const story = framesData[activeIndex];

  return (
    <section className="cinematic-story" ref={sectionRef} aria-label="TheInnoVibe story timeline">
      <div className="story-stage">
        <div className="story-video-container" aria-hidden="true">
          <canvas ref={canvasRef} className="story-canvas" />
          <div className="story-video-fallback" />
        </div>
        <div className="story-copy" key={story.id}>
          <span className="story-kicker">
            {story.frame} <span className="story-divider">&bull;</span> {story.label}
          </span>
          <h2>{story.title}</h2>
          <p className="story-desc">{story.text}</p>
        </div>
        <button
          className="story-scroll-cue"
          type="button"
          aria-label="Scroll to explore the story"
          onClick={() => window.scrollBy({
            top: Math.round(window.innerHeight * 0.72),
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
          })}
        >
          <span className="story-scroll-mouse" aria-hidden="true"><i /></span>
          <span>SCROLL TO EXPLORE</span>
        </button>
        <div className="story-frame-count" aria-hidden="true">
          <span ref={frameIndicatorRef}>0001</span>
          <i />
          <span>0240</span>
        </div>
      </div>
    </section>
  );
}
