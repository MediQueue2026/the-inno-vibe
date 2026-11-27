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
// Source frames are 1280x720; never render the canvas denser than that.
const SOURCE_WIDTH = 1280;
const SOURCE_HEIGHT = 720;
const STEP_LABEL_COUNT = String(framesData.length).padStart(2, '0');
// Budget for decoded frames kept in memory (each is canvas width x height x 4 bytes).
const DECODED_BUDGET_BYTES = 140 * 1024 * 1024;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Lower-end devices / data saver: scrub every other frame.
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  const connection = navigator.connection;
  return Boolean(
    connection?.saveData
    || /(^|-)2g$/.test(connection?.effectiveType ?? '')
    || (navigator.deviceMemory && navigator.deviceMemory <= 4)
    || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
  );
};

let webpSupport;
const detectWebp = () => {
  if (!webpSupport) {
    webpSupport = new Promise(resolve => {
      const probe = new Image();
      probe.onload = () => resolve(probe.width > 0);
      probe.onerror = () => resolve(false);
      probe.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
    });
  }
  return webpSupport;
};

// Coarse-to-fine order (every 16th frame, then every 8th, ...), so that while the
// sequence downloads, every scroll position already has a nearby frame to show.
const coarseToFineOrder = step => {
  const order = [];
  const seen = new Set();
  for (let stride = 16; stride >= step; stride /= 2) {
    for (let index = 0; index < FRAME_COUNT; index += stride) {
      if (!seen.has(index)) {
        seen.add(index);
        order.push(index);
      }
    }
  }
  return order;
};

// Decode an encoded frame off the main thread, cropped and scaled to exactly the
// canvas size so drawing it is a cheap 1:1 copy.
const decodeFrame = async (blob, width, height) => {
  if (typeof createImageBitmap === 'function') {
    const scale = Math.max(width / SOURCE_WIDTH, height / SOURCE_HEIGHT);
    const sourceWidth = Math.min(SOURCE_WIDTH, width / scale);
    const sourceHeight = Math.min(SOURCE_HEIGHT, height / scale);
    try {
      return await createImageBitmap(
        blob,
        (SOURCE_WIDTH - sourceWidth) / 2,
        (SOURCE_HEIGHT - sourceHeight) / 2,
        sourceWidth,
        sourceHeight,
        { resizeWidth: width, resizeHeight: height, resizeQuality: 'medium' }
      );
    } catch {
      // Older engines without crop/resize options: fall through.
    }
  }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    offscreen.getContext('2d').drawImage(
      image,
      (width - image.naturalWidth * scale) / 2,
      (height - image.naturalHeight * scale) / 2,
      image.naturalWidth * scale,
      image.naturalHeight * scale
    );
    return offscreen;
  } finally {
    URL.revokeObjectURL(url);
  }
};

export default function CinematicStory() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const frameIndicatorRef = useRef(null);
  const progressRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    if (!section || !canvas || !context) return undefined;

    const lowEnd = isLowEndDevice();
    const frameStep = lowEnd ? 2 : 1;
    const maxActiveFetches = 6;
    const maxActiveDecodes = lowEnd ? 2 : 3;
    const fetchAhead = 36; // frames fetched first in the scroll direction
    const lastFrame = Math.floor((FRAME_COUNT - 1) / frameStep) * frameStep;
    const backgroundOrder = coarseToFineOrder(frameStep);

    // Encoded frames (~55KB each as WebP) — the whole sequence fits comfortably.
    const blobs = new Array(FRAME_COUNT);
    const fetching = new Map();
    const failedFrames = new Set();
    // Decoded frames, sized to the canvas, within a memory budget around the playhead.
    const bitmaps = new Map();
    const decoding = new Set();
    let decodeGeneration = 0;
    let maxBitmaps = 24;
    let decodeAhead = 16;

    let extension = 'jpg';
    let started = false;
    let targetFrame = -1;
    let drawnFrame = -1;
    let indicatorFrame = -1;
    // The drawn frame eases toward the scroll target, so a wheel notch or touch fling
    // plays through the in-between frames instead of jumping several at once.
    let playhead = -1;
    let currentFrame = -1;
    let lastPaintTime = 0;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let renderRequest = 0;
    let disposed = false;
    let lastStoryIndex = -1;
    let scrollDirection = 1;
    // Layout values cached by measure(), so paint() never forces layout.
    let sectionTop = 0;
    let stickyTop = 0;
    let travel = 1;
    let visible = false;

    const measure = () => {
      stickyTop = document.querySelector('.site-header')?.offsetHeight ?? 0;
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(section.offsetHeight - window.innerHeight + stickyTop, 1);
    };

    const nearestBitmap = () => {
      const center = Math.max(currentFrame, 0);
      if (bitmaps.has(center)) return center;
      for (let distance = frameStep; distance <= FRAME_COUNT; distance += frameStep) {
        const ahead = center + distance * scrollDirection;
        const behind = center - distance * scrollDirection;
        if (bitmaps.has(ahead)) return ahead;
        if (bitmaps.has(behind)) return behind;
        if (ahead < 0 && behind < 0) break;
        if (ahead > lastFrame && behind > lastFrame) break;
      }
      return -1;
    };

    const paint = now => {
      renderRequest = 0;
      if (disposed) return;

      const targetProgress = clamp((window.scrollY + stickyTop - sectionTop) / travel, 0, 1);
      const nextTargetFrame = Math.round((targetProgress * lastFrame) / frameStep) * frameStep;
      if (nextTargetFrame !== targetFrame) {
        if (targetFrame >= 0) scrollDirection = nextTargetFrame > targetFrame ? 1 : -1;
        targetFrame = nextTargetFrame;
      }

      // Frame-rate independent easing toward the target (~70ms time constant).
      const elapsed = clamp(now - lastPaintTime, 0, 64);
      lastPaintTime = now;
      if (playhead < 0 || reducedMotion.matches) {
        playhead = targetFrame;
      } else {
        playhead += (targetFrame - playhead) * (1 - Math.exp(-elapsed / 70));
        if (Math.abs(targetFrame - playhead) < 0.5) playhead = targetFrame;
      }
      const nextFrame = Math.round(playhead / frameStep) * frameStep;
      if (nextFrame !== currentFrame) {
        currentFrame = nextFrame;
        if (started) {
          pumpFetches();
          pumpDecodes();
        }
      }
      if (indicatorFrame !== currentFrame) {
        indicatorFrame = currentFrame;
        if (frameIndicatorRef.current) {
          frameIndicatorRef.current.textContent = String(currentFrame + 1).padStart(4, '0');
        }
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${(currentFrame / lastFrame).toFixed(4)})`;
        }
      }
      const storyIndex = Math.min(Math.floor(targetProgress * framesData.length), framesData.length - 1);
      if (storyIndex !== lastStoryIndex) {
        lastStoryIndex = storyIndex;
        setActiveIndex(storyIndex);
      }

      const index = nearestBitmap();
      if (index >= 0 && index !== drawnFrame) {
        context.drawImage(bitmaps.get(index), 0, 0, canvas.width, canvas.height);
        drawnFrame = index;
      }

      // Keep easing until the playhead reaches the scroll position.
      if (playhead !== targetFrame && visible) renderRequest = requestAnimationFrame(paint);
    };

    const schedulePaint = () => {
      if (!visible || renderRequest) return;
      // Coming from idle: treat the first frame as one normal frame interval.
      lastPaintTime = performance.now() - 16.7;
      renderRequest = requestAnimationFrame(paint);
    };

    // ---- Network: fetch encoded frames, nearest-to-playhead first, then the rest coarse-to-fine.
    const nextFrameToFetch = () => {
      const center = Math.max(currentFrame, 0);
      const wanted = index => index >= 0 && index <= lastFrame
        && !blobs[index] && !fetching.has(index) && !failedFrames.has(index);
      for (let distance = 0; distance <= fetchAhead; distance += frameStep) {
        if (wanted(center + distance * scrollDirection)) return center + distance * scrollDirection;
        if (distance <= 8 && wanted(center - distance * scrollDirection)) return center - distance * scrollDirection;
      }
      return backgroundOrder.find(wanted) ?? -1;
    };

    function pumpFetches() {
      while (!disposed && started && fetching.size < maxActiveFetches) {
        const index = nextFrameToFetch();
        if (index < 0) return;
        const controller = new AbortController();
        fetching.set(index, controller);
        fetch(`/images/frame-${String(index + 1).padStart(4, '0')}.${extension}`, {
          signal: controller.signal,
          priority: Math.abs(index - currentFrame) <= 4 ? 'high' : 'low'
        })
          .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.blob();
          })
          .then(blob => {
            if (disposed) return;
            blobs[index] = blob;
            pumpDecodes();
          })
          .catch(error => {
            if (disposed || error?.name === 'AbortError') return;
            failedFrames.add(index);
            console.error(`Unable to load cinematic frame ${String(index + 1).padStart(4, '0')}.`, error);
          })
          .finally(() => {
            fetching.delete(index);
            pumpFetches();
          });
      }
    }

    // ---- Decode: keep a window of canvas-sized bitmaps around the playhead.
    const nextFrameToDecode = () => {
      const center = Math.max(currentFrame, 0);
      const wanted = index => index >= 0 && index <= lastFrame
        && blobs[index] && !bitmaps.has(index) && !decoding.has(index);
      for (let distance = 0; distance <= decodeAhead; distance += frameStep) {
        if (wanted(center + distance * scrollDirection)) return center + distance * scrollDirection;
        if (distance <= decodeAhead / 3 && wanted(center - distance * scrollDirection)) {
          return center - distance * scrollDirection;
        }
      }
      // Nothing decoded near the playhead yet (frames still arriving): decode the closest blob.
      if (nearestBitmap() < 0 || Math.abs(nearestBitmap() - center) > decodeAhead) {
        let best = -1;
        for (let index = 0; index <= lastFrame; index += frameStep) {
          if (wanted(index) && (best < 0 || Math.abs(index - center) < Math.abs(best - center))) best = index;
        }
        return best;
      }
      return -1;
    };

    function pumpDecodes() {
      while (!disposed && decoding.size < maxActiveDecodes) {
        const index = nextFrameToDecode();
        if (index < 0) return;
        decoding.add(index);
        const generation = decodeGeneration;
        const width = canvas.width;
        const height = canvas.height;
        decodeFrame(blobs[index], width, height)
          .then(bitmap => {
            if (disposed || generation !== decodeGeneration) {
              bitmap.close?.();
              return;
            }
            bitmaps.set(index, bitmap);
            pruneBitmaps();
            schedulePaint();
          })
          .catch(error => {
            if (disposed) return;
            blobs[index] = undefined;
            failedFrames.add(index);
            console.error(`Unable to decode cinematic frame ${String(index + 1).padStart(4, '0')}.`, error);
          })
          .finally(() => {
            decoding.delete(index);
            pumpDecodes();
          });
      }
    }

    function pruneBitmaps() {
      if (bitmaps.size <= maxBitmaps) return;
      const center = Math.max(currentFrame, 0);
      // Frames behind the scroll direction are cheaper to lose.
      const cost = index => Math.abs(index - center) * (Math.sign(index - center) === -scrollDirection ? 2 : 1);
      const byDistance = Array.from(bitmaps.keys()).sort((first, second) => cost(second) - cost(first));
      for (const index of byDistance) {
        if (bitmaps.size <= maxBitmaps) break;
        if (index === drawnFrame) continue;
        bitmaps.get(index).close?.();
        bitmaps.delete(index);
      }
    }

    const clearBitmaps = () => {
      decodeGeneration += 1;
      bitmaps.forEach(bitmap => bitmap.close?.());
      bitmaps.clear();
    };

    const resizeCanvas = () => {
      measure();
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      // The frame is drawn "cover"-scaled; cap the backing store at the source's
      // pixel density so nothing is ever upscaled on the CPU (the GPU scales the canvas).
      const coverScale = Math.max(bounds.width / SOURCE_WIDTH, bounds.height / SOURCE_HEIGHT);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, lowEnd ? 1 : 1.5, 1 / coverScale);
      const width = Math.max(1, Math.round(bounds.width * pixelRatio));
      const height = Math.max(1, Math.round(bounds.height * pixelRatio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      const bytesPerFrame = width * height * 4;
      maxBitmaps = clamp(Math.floor(DECODED_BUDGET_BYTES / bytesPerFrame), 16, lowEnd ? 32 : 64);
      decodeAhead = Math.floor(maxBitmaps * 0.6) * frameStep;
      // Bitmaps are sized to the canvas; re-decode at the new size (blobs stay cached).
      clearBitmaps();
      drawnFrame = -1;
      if (started) pumpDecodes();
      schedulePaint();
    };

    const onWindowResize = () => {
      // The canvas ResizeObserver handles canvas size; only re-measure scroll geometry here.
      measure();
      schedulePaint();
    };

    const start = () => {
      if (started) return;
      started = true;
      detectWebp().then(supported => {
        if (disposed) return;
        extension = supported ? 'webp' : 'jpg';
        measure();
        pumpFetches();
      });
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    // Content above the section (fonts, images) can shift it; re-measure when the page resizes.
    const layoutObserver = new ResizeObserver(measure);
    layoutObserver.observe(document.body);
    resizeCanvas();

    // Start fetching frames well before the film is reached.
    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        start();
        preloadObserver.disconnect();
      }
    }, { rootMargin: '150% 0px' });
    preloadObserver.observe(section);

    // Do no scroll or paint work while the film is out of view.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        start();
        schedulePaint();
      } else if (renderRequest) {
        cancelAnimationFrame(renderRequest);
        renderRequest = 0;
      }
    });
    visibilityObserver.observe(section);
    window.addEventListener('scroll', schedulePaint, { passive: true });
    window.addEventListener('resize', onWindowResize);

    return () => {
      disposed = true;
      if (renderRequest) cancelAnimationFrame(renderRequest);
      resizeObserver.disconnect();
      layoutObserver.disconnect();
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('scroll', schedulePaint);
      window.removeEventListener('resize', onWindowResize);
      fetching.forEach(controller => controller.abort());
      fetching.clear();
      clearBitmaps();
      blobs.fill(undefined);
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
            <span className="story-kicker-badge">{`Step ${activeIndex + 1} of ${framesData.length}`}</span>
            <span className="story-kicker-label">
              <span className="story-divider" aria-hidden="true">&bull;</span> {story.label}
            </span>
          </span>
          <h2>{story.title}</h2>
          <p className="story-desc">{story.text}</p>
          <ol className="story-chapters" aria-label={`Step ${activeIndex + 1} of ${framesData.length}`}>
            {framesData.map((item, idx) => (
              <li
                key={item.id}
                className={idx < activeIndex ? 'is-past' : idx === activeIndex ? 'is-current' : ''}
                aria-current={idx === activeIndex ? 'step' : undefined}
              >
                <span className="sr-only">{item.label}</span>
              </li>
            ))}
          </ol>
        </div>
        <button
          className="story-scroll-cue"
          type="button"
          aria-label="Scroll to the next step of the story"
          onClick={() => window.scrollBy({
            top: Math.round(window.innerHeight * 0.72),
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
          })}
        >
          <span className="story-scroll-mouse" aria-hidden="true"><i /></span>
          <span>SCROLL TO EXPLORE</span>
        </button>
        <div className="story-frame-count" aria-hidden="true">
          <span className="story-frame-step">{String(activeIndex + 1).padStart(2, '0')} / {STEP_LABEL_COUNT}</span>
          <span className="story-progress-track"><i ref={progressRef} /></span>
          <span className="story-frame-num"><span ref={frameIndicatorRef}>0001</span> / 0240</span>
        </div>
      </div>
    </section>
  );
}
