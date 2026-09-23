import * as THREE from 'three';
import { finePointer } from '../motion.js';

// Builds the rotating light bulb inside `host`. Returns { sync, dispose }.
export function createIdeaScene(host, { isPaused, onReadyChange }) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0xffffff, 0);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 60);
  camera.position.set(0, .25, 8.8);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8cdf5, 2.6));
  const accentLight = new THREE.PointLight(0x2f7cf2, 30);
  accentLight.position.set(-3, 2, 3);
  const violetLight = new THREE.PointLight(0x0b9ae0, 26);
  violetLight.position.set(3, 1, 2);
  scene.add(accentLight, violetLight);
  const idea = new THREE.Group();
  idea.rotation.z = -.14;
  scene.add(idea);

  // A lathed glass bulb, a glowing filament, and a machined screw base.
  const profile = [
    [0, 1.8], [.43, 1.75], [.84, 1.5], [1.06, 1.15], [1.13, .72],
    [1.04, .28], [.8, -.1], [.53, -.49], [.43, -.78], [.43, -.95]
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x5c93f5, metalness: .1, roughness: .12, transparent: true, opacity: .2, side: THREE.DoubleSide, depthWrite: false, clearcoat: 1 });
  idea.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 48), glass));
  idea.add(new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.LatheGeometry(profile, 16)), new THREE.LineBasicMaterial({ color: 0x1d5ce6, transparent: true, opacity: .32 })));
  const filamentMaterial = new THREE.MeshStandardMaterial({ color: 0x1d5ce6, emissive: 0x2f7cf2, emissiveIntensity: 1.2, roughness: .4 });
  const filamentPoints = [];
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    filamentPoints.push(new THREE.Vector3(Math.sin(t * Math.PI * 6) * .28, -.68 + t * 1.65, Math.cos(t * Math.PI * 6) * .28));
  }
  idea.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(filamentPoints), 100, .018, 6, false), filamentMaterial));
  const metal = new THREE.MeshStandardMaterial({ color: 0x8fa6d4, metalness: .7, roughness: .28 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.44, .33, .6, 40), metal);
  base.position.y = -1.22;
  idea.add(base);
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.41 - i * .018, .052, 8, 48), metal);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -.97 - i * .15;
    idea.add(ring);
  }
  const foot = new THREE.Mesh(new THREE.SphereGeometry(.23, 24, 12), metal);
  foot.scale.y = .5;
  foot.position.y = -1.58;
  idea.add(foot);

  const halo = new THREE.Group();
  halo.rotation.set(.65, .3, -.3);
  halo.add(new THREE.Mesh(new THREE.TorusGeometry(1.85, .008, 6, 100), new THREE.MeshBasicMaterial({ color: 0x1d5ce6, transparent: true, opacity: .25 })));
  scene.add(halo);
  const satellites = [];
  const colors = [0x1d5ce6, 0x0b9ae0, 0x5c93f5];
  for (let i = 0; i < 13; i++) {
    const size = .055 + (i % 4) * .025;
    const geometry = i % 2 ? new THREE.OctahedronGeometry(size) : new THREE.IcosahedronGeometry(size, 0);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: colors[i % 3], metalness: .45, roughness: .22 }));
    const angle = i * 2.399;
    const radius = 1.65 + (i % 3) * .25;
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(i * 1.6) * .7);
    scene.add(mesh);
    satellites.push({ mesh, y: mesh.position.y, phase: i });
  }

  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let lost = false;
  const pointer = { x: 0, y: 0 };
  function render(time = 0) {
    frame = 0;
    const paused = isPaused();
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    if (!paused) {
      elapsed += dt;
      const ease = 1 - Math.exp(-dt * 4);
      idea.rotation.y += (pointer.x * .4 + Math.sin(elapsed * .25) * .14 - idea.rotation.y) * ease;
      idea.rotation.x += (-pointer.y * .15 - idea.rotation.x) * ease;
      idea.position.y = Math.sin(elapsed * .85) * .075;
      halo.rotation.y = .3 + Math.sin(elapsed * .18) * .22;
      satellites.forEach(({ mesh, y, phase }) => {
        mesh.position.y = y + Math.sin(elapsed * .6 + phase) * .09;
        mesh.rotation.x = elapsed * .13 + phase;
        mesh.rotation.y = elapsed * .18;
      });
    }
    renderer.render(scene, camera);
    if (!paused && visible && !document.hidden && !lost) frame = requestAnimationFrame(render);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (visible && !document.hidden && !lost) render();
  }

  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height || lost) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    sync();
  });
  resizeObserver.observe(host);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, { rootMargin: '60px' });
  visibilityObserver.observe(host);
  const onPointerMove = event => {
    if (isPaused() || !finePointer.matches) return;
    const rect = host.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointer.y = (event.clientY - rect.top) / rect.height * 2 - 1;
  };
  const onPointerLeave = () => { pointer.x = 0; pointer.y = 0; };
  const onContextLost = event => {
    event.preventDefault();
    lost = true;
    sync();
    onReadyChange(false);
    renderer.domElement.style.opacity = '0';
  };
  const onContextRestored = () => {
    lost = false;
    renderer.domElement.style.opacity = '1';
    onReadyChange(true);
    sync();
  };
  document.addEventListener('visibilitychange', sync);
  host.addEventListener('pointermove', onPointerMove);
  host.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
  sync();
  onReadyChange(true);

  function dispose() {
    if (frame) cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    host.removeEventListener('pointermove', onPointerMove);
    host.removeEventListener('pointerleave', onPointerLeave);
    scene.traverse(object => {
      object.geometry?.dispose();
      object.material?.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { sync, dispose };
}
