import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { ACESFilmicToneMapping, CatmullRomCurve3, MathUtils, SRGBColorSpace, Vector3 } from 'three';
import { useMotionPaused } from '../motion.js';

const softwareModules = [
  { position: [-0.48, -0.25, -0.12], size: [0.42, 0.38, 0.34], phase: 0.8, direction: -1 },
  { position: [0.08, 0.12, 0.08], size: [0.52, 0.48, 0.42], phase: 2.4, direction: 1, core: true },
  { position: [0.5, -0.28, 0.02], size: [0.34, 0.31, 0.3], phase: 4.1, direction: 1 },
  { position: [0.52, 0.4, -0.18], size: [0.27, 0.25, 0.24], phase: 5.2, direction: -1 }
];

const systemModules = [
  { position: [-0.46, 0.28, -0.12], size: [0.34, 0.3, 0.28], phase: 0.5, direction: -1 },
  { position: [0.08, 0.33, 0.04], size: [0.42, 0.36, 0.34], phase: 1.7, direction: 1, core: true },
  { position: [-0.49, -0.28, 0.08], size: [0.4, 0.32, 0.34], phase: 3.1, direction: -1 },
  { position: [0.48, -0.26, -0.12], size: [0.31, 0.36, 0.3], phase: 4.5, direction: 1 },
  { position: [0.02, -0.49, 0], size: [0.3, 0.25, 0.27], phase: 5.7, direction: -1 }
];

function SoftShadow({ position = [0, -0.62, 0], scale = [0.8, 0.42, 1] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{ shadowColor: { value: new Vector3(0.02, 0.045, 0.085) } }}
        vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
        fragmentShader="uniform vec3 shadowColor; varying vec2 vUv; void main() { float d = length((vUv - 0.5) * 2.0); float alpha = (1.0 - smoothstep(0.05, 1.0, d)) * 0.16; gl_FragColor = vec4(shadowColor, alpha); }"
      />
    </mesh>
  );
}

function Module({ module, pointer }) {
  const group = useRef();
  const base = useMemo(() => new Vector3(...module.position), [module.position]);
  const originalRotation = useMemo(() => new Vector3(0.08, module.phase * 0.12, -0.07), [module.phase]);
  const accent = module.core ? '#45D9FF' : module.phase % 2 ? '#45D9FF' : '#8B5CF6';

  useFrame(({ clock }, delta) => {
    if (!group.current) return;

    const time = clock.elapsedTime + module.phase;
    const hover = pointer.current.active ? 1 : 0;
    const { x, y } = pointer.current;
    const spread = hover * module.direction * 0.075;
    const centralLift = module.core ? hover * 0.09 : 0;

    group.current.position.x = MathUtils.damp(group.current.position.x, base.x + spread * (module.core ? 0.15 : 1) + x * 0.025, 5, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, base.y + Math.sin(time * 0.72) * 0.025 + y * 0.018, 4, delta);
    group.current.position.z = MathUtils.damp(group.current.position.z, base.z + centralLift + (module.core ? 0 : hover * 0.025), 4, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, originalRotation.x + y * 0.12 + Math.sin(time * 0.4) * 0.025, 4, delta);
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, originalRotation.y + x * 0.16 + Math.sin(time * 0.45) * 0.035 + hover * module.direction * 0.08, 4, delta);
    group.current.rotation.z = MathUtils.damp(group.current.rotation.z, originalRotation.z + Math.sin(time * 0.5) * 0.025, 4, delta);
  });

  return (
    <group ref={group} position={module.position}>
      <RoundedBox args={module.size} radius={0.055} smoothness={5} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={module.core ? '#10243A' : '#0B1C32'}
          emissive={module.core ? '#0A2638' : '#071426'}
          emissiveIntensity={module.core ? 0.2 : 0.12}
          metalness={0.48}
          roughness={0.24}
          clearcoat={1}
          clearcoatRoughness={0.16}
          transmission={module.core ? 0.12 : 0.18}
          thickness={0.35}
          ior={1.36}
          envMapIntensity={2}
        />
      </RoundedBox>
      <RoundedBox
        args={[module.size[0] * 0.68, module.size[1] * 0.045, module.size[2] * 0.5]}
        radius={0.018}
        smoothness={4}
        position={[0, module.size[1] * 0.27, module.size[2] * 0.12]}
      >
        <meshPhysicalMaterial
          color="#0A1728"
          emissive={accent}
          emissiveIntensity={module.core ? 0.24 : 0.16}
          metalness={0.56}
          roughness={0.22}
          clearcoat={0.8}
        />
      </RoundedBox>
      <RoundedBox
        args={[module.size[0] * 0.58, module.size[1] * 0.5, module.size[2] * 0.018]}
        radius={0.028}
        smoothness={5}
        position={[0, 0, module.size[2] * 0.49]}
      >
        <meshPhysicalMaterial
          color="#050D1A"
          emissive={accent}
          emissiveIntensity={module.core ? 0.1 : 0.065}
          metalness={0.48}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.12}
          transmission={0.08}
          thickness={0.08}
          envMapIntensity={1.5}
        />
      </RoundedBox>
      <RoundedBox
        args={[module.size[0] * 0.34, module.size[1] * 0.018, module.size[2] * 0.012]}
        radius={0.008}
        smoothness={4}
        position={[0, module.size[1] * 0.13, module.size[2] * 0.505]}
      >
        <meshPhysicalMaterial
          color="#45D9FF"
          emissive="#45D9FF"
          emissiveIntensity={module.core ? 0.2 : 0.12}
          metalness={0.42}
          roughness={0.24}
        />
      </RoundedBox>
      <mesh position={[module.size[0] * 0.2, -module.size[1] * 0.12, module.size[2] * 0.505]}>
        <sphereGeometry args={[module.size[0] * 0.025, 12, 10]} />
        <meshPhysicalMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.18}
          metalness={0.35}
          roughness={0.24}
        />
      </mesh>
      <RoundedBox
        args={[module.size[0] * 0.52, module.size[1] * 0.012, module.size[2] * 0.012]}
        radius={0.006}
        smoothness={3}
        position={[0, module.size[1] * 0.49, 0]}
      >
        <meshPhysicalMaterial
          color="#2878FF"
          emissive="#2878FF"
          emissiveIntensity={0.045}
          metalness={0.65}
          roughness={0.24}
        />
      </RoundedBox>
      {[-1, 1].map(side => (
        <RoundedBox
          key={`edge-${side}`}
          args={[module.size[0] * 0.014, module.size[1] * 0.82, module.size[2] * 0.012]}
          radius={0.006}
          smoothness={3}
          position={[side * module.size[0] * 0.47, 0, module.size[2] * 0.505]}
        >
          <meshPhysicalMaterial
            color="#10243A"
            emissive={side < 0 ? '#45D9FF' : '#8B5CF6'}
            emissiveIntensity={side < 0 ? 0.22 : 0.1}
            metalness={0.6}
            roughness={0.2}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

function SoftwareModel({ pointer }) {
  return (
    <group>
      <SoftShadow />
      <CurvedLink start={softwareModules[1].position} end={softwareModules[0].position} color="#45D9FF" opacity={0.2} radius={0.004} />
      <CurvedLink start={softwareModules[1].position} end={softwareModules[2].position} color="#45D9FF" opacity={0.2} radius={0.004} />
      <CurvedLink start={softwareModules[1].position} end={softwareModules[3].position} color="#8B5CF6" opacity={0.12} radius={0.004} />
      {softwareModules.map((module, index) => (
        <Module key={index} module={module} pointer={pointer} />
      ))}
    </group>
  );
}

function Keyboard({ pointer }) {
  return (
    <group>
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 9 }, (_, column) => (
          <RoundedBox
            key={`${row}-${column}`}
            args={[0.084, 0.012, 0.052]}
            radius={0.008}
            smoothness={3}
            position={[-0.48 + column * 0.12, 0.05, -0.18 + row * 0.09]}
          >
            <meshPhysicalMaterial
              color="#071426"
              metalness={0.58}
              roughness={0.3}
              emissive="#45D9FF"
              emissiveIntensity={pointer.current.active ? 0.035 : 0.015}
            />
          </RoundedBox>
        ))
      )}
    </group>
  );
}

function LaptopModel({ pointer }) {
  const screen = useRef();
  const lid = useRef();

  useFrame((_, delta) => {
    const hover = pointer.current.active ? 1 : 0;
    if (screen.current) {
      screen.current.emissiveIntensity = MathUtils.damp(screen.current.emissiveIntensity, 0.16 + hover * 0.08, 4, delta);
    }
    if (lid.current) {
      lid.current.rotation.x = MathUtils.damp(lid.current.rotation.x, -0.12 - hover * 0.035, 3, delta);
    }
  });

  return (
    <group rotation={[-0.04, -0.18, 0]}>
      <SoftShadow position={[0, -0.55, -0.04]} scale={[0.88, 0.36, 1]} />
      <group position={[0, -0.17, 0]}>
        <RoundedBox args={[1.38, 0.075, 0.86]} radius={0.052} smoothness={7} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#071426"
            emissive="#0A1728"
            emissiveIntensity={0.08}
            metalness={0.78}
            roughness={0.25}
            clearcoat={0.95}
            clearcoatRoughness={0.18}
            envMapIntensity={1.35}
          />
        </RoundedBox>
        <RoundedBox args={[0.3, 0.006, 0.16]} radius={0.035} smoothness={5} position={[0, 0.041, 0.22]}>
          <meshPhysicalMaterial color="#050D1A" metalness={0.58} roughness={0.26} clearcoat={0.8} />
        </RoundedBox>
        <Keyboard pointer={pointer} />
        <RoundedBox args={[0.16, 0.025, 0.07]} radius={0.014} smoothness={4} position={[0, 0.054, -0.37]}>
          <meshPhysicalMaterial color="#071426" metalness={0.82} roughness={0.2} />
        </RoundedBox>
        <mesh position={[0, 0.04, -0.405]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 1.18, 20]} />
          <meshPhysicalMaterial color="#071426" metalness={0.84} roughness={0.22} />
        </mesh>
      </group>
      <group ref={lid} position={[0, -0.13, -0.35]} rotation={[-0.12, 0, 0]}>
        <RoundedBox args={[1.3, 0.82, 0.055]} radius={0.055} smoothness={7} castShadow>
          <meshPhysicalMaterial color="#071426" emissive="#0A1728" emissiveIntensity={0.08} metalness={0.72} roughness={0.2} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={1.5} />
        </RoundedBox>
        <RoundedBox args={[1.19, 0.7, 0.008]} radius={0.04} smoothness={6} position={[0, 0, 0.032]}>
          <meshPhysicalMaterial
            ref={screen}
            color="#071426"
            emissive="#45D9FF"
            emissiveIntensity={0.16}
            metalness={0.28}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.08}
            thickness={0.12}
          />
        </RoundedBox>
        <group position={[0, 0, 0.038]}>
          <RoundedBox args={[0.84, 0.022, 0.004]} radius={0.01} smoothness={3} position={[0, 0.18, 0]}>
            <meshPhysicalMaterial color="#071426" emissive="#45D9FF" emissiveIntensity={0.3} metalness={0.25} roughness={0.28} />
          </RoundedBox>
          <RoundedBox args={[0.44, 0.018, 0.004]} radius={0.008} smoothness={3} position={[-0.2, 0.12, 0]}>
            <meshPhysicalMaterial color="#071426" emissive="#2878FF" emissiveIntensity={0.22} metalness={0.3} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[0.68, 0.22, 0.004]} radius={0.025} smoothness={4} position={[0, -0.08, 0]}>
            <meshPhysicalMaterial color="#0A1728" emissive="#0A2638" emissiveIntensity={0.12} roughness={0.3} metalness={0.45} />
          </RoundedBox>
          <RoundedBox args={[0.26, 0.025, 0.004]} radius={0.01} smoothness={3} position={[-0.1, -0.1, 0.004]}>
            <meshPhysicalMaterial color="#071426" emissive="#45D9FF" emissiveIntensity={0.24} metalness={0.25} roughness={0.28} />
          </RoundedBox>
          <RoundedBox args={[0.38, 0.018, 0.004]} radius={0.008} smoothness={3} position={[0.06, -0.145, 0.004]}>
            <meshPhysicalMaterial color="#111827" emissive="#8B5CF6" emissiveIntensity={0.16} metalness={0.3} roughness={0.28} />
          </RoundedBox>
        </group>
      </group>
    </group>
  );
}

const aiNodes = [
  [-0.55, 0.2, 0.02],
  [-0.37, 0.5, -0.06],
  [0.06, 0.58, 0.08],
  [0.48, 0.37, -0.06],
  [0.58, -0.16, 0.04],
  [0.27, -0.5, -0.08],
  [-0.3, -0.48, 0.04],
  [-0.58, -0.16, -0.06],
  [0.03, 0.08, 0.52]
];

const aiLinks = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
  [0, 8], [2, 8], [4, 8], [6, 8]
];

function CurvedLink({ start, end, color, opacity = 0.38, radius = 0.006 }) {
  const curve = useMemo(() => {
    const midpoint = start.map((value, axis) => (value + end[axis]) / 2);
    midpoint[2] += 0.07;
    return new CatmullRomCurve3([new Vector3(...start), new Vector3(...midpoint), new Vector3(...end)]);
  }, [start, end]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 24, radius, 6, false]} />
      <meshPhysicalMaterial color={color} metalness={0.65} roughness={0.24} emissive={color} emissiveIntensity={0.08} transparent opacity={opacity} />
    </mesh>
  );
}

function IntelligenceCore({ pointer }) {
  const group = useRef();
  const core = useRef();
  const innerGlow = useRef();
  const inner = useRef();

  useFrame(({ clock }, delta) => {
    const hover = pointer.current.active ? 1 : 0;
    if (group.current) {
      group.current.rotation.y = MathUtils.damp(group.current.rotation.y, clock.elapsedTime * 0.12 + pointer.current.x * 0.18, 3, delta);
      group.current.rotation.x = MathUtils.damp(group.current.rotation.x, pointer.current.y * -0.13 + Math.sin(clock.elapsedTime * 0.38) * 0.025, 3, delta);
    }
    if (core.current) {
      core.current.material.emissiveIntensity = MathUtils.damp(core.current.material.emissiveIntensity, 0.26 + hover * 0.08, 3, delta);
    }
    if (innerGlow.current) {
      innerGlow.current.material.emissiveIntensity = MathUtils.damp(innerGlow.current.material.emissiveIntensity, 0.55 + hover * 0.12, 3, delta);
    }
    if (inner.current) {
      inner.current.material.emissiveIntensity = MathUtils.damp(inner.current.material.emissiveIntensity, 0.58 + hover * 0.12, 3, delta);
    }
  });

  return (
    <group ref={group}>
      <SoftShadow position={[0, -0.78, 0]} scale={[0.72, 0.36, 1]} />
      {aiLinks.map(([from, to], index) => (
        <CurvedLink key={index} start={aiNodes[from]} end={aiNodes[to]} color={index % 4 === 0 ? '#8B5CF6' : '#45D9FF'} opacity={index % 4 === 0 ? 0.16 : 0.28} />
      ))}
      <mesh ref={core}>
        <sphereGeometry args={[0.36, 40, 32]} />
        <meshPhysicalMaterial
          color="#10243A"
          emissive="#0A2638"
          emissiveIntensity={0.24}
          metalness={0.28}
          roughness={0.2}
          transmission={0.32}
          thickness={0.55}
          ior={1.38}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={2.4}
        />
      </mesh>
      <mesh ref={innerGlow} scale={0.46}>
        <sphereGeometry args={[0.36, 32, 24]} />
        <meshPhysicalMaterial
          color="#0A1728"
          emissive="#45D9FF"
          emissiveIntensity={0.38}
          metalness={0.18}
          roughness={0.24}
          transmission={0.12}
          thickness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh ref={inner} scale={0.68}>
        <icosahedronGeometry args={[0.36, 2]} />
        <meshPhysicalMaterial color="#17142A" emissive="#8B5CF6" emissiveIntensity={0.48} metalness={0.38} roughness={0.22} clearcoat={1} />
      </mesh>
      <mesh scale={1.09}>
        <sphereGeometry args={[0.36, 40, 32]} />
        <meshPhysicalMaterial color="#45D9FF" emissive="#45D9FF" emissiveIntensity={0.035} metalness={0.24} roughness={0.24} transparent opacity={0.07} side={2} clearcoat={1} />
      </mesh>
      {aiNodes.map((position, index) => (
        <mesh key={index} position={position} scale={index === 8 ? 1.18 : 1}>
          <sphereGeometry args={[index === 8 ? 0.075 : 0.052, 20, 16]} />
          <meshPhysicalMaterial
            color="#071426"
            metalness={0.62}
            roughness={0.22}
            clearcoat={1}
            emissive={index % 3 === 0 ? '#8B5CF6' : '#45D9FF'}
            emissiveIntensity={index === 8 ? 0.24 : 0.11}
          />
        </mesh>
      ))}
      <mesh rotation={[0.85, 0.2, 0.35]}>
        <torusGeometry args={[0.78, 0.006, 8, 96]} />
        <meshPhysicalMaterial color="#45D9FF" emissive="#45D9FF" emissiveIntensity={0.025} metalness={0.55} roughness={0.28} transparent opacity={0.24} />
      </mesh>
      <mesh rotation={[1.18, 0.7, -0.24]}>
        <torusGeometry args={[0.86, 0.005, 8, 96]} />
        <meshPhysicalMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.015} metalness={0.55} roughness={0.3} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function FlowingConnection({ start, end, pointer, phase, color }) {
  const curve = useMemo(() => {
    const midpoint = start.map((value, axis) => (value + end[axis]) / 2);
    midpoint[2] += 0.1;
    return new CatmullRomCurve3([new Vector3(...start), new Vector3(...midpoint), new Vector3(...end)]);
  }, [start, end]);
  const particle = useRef();

  useFrame(({ clock }, delta) => {
    if (!particle.current) return;
    const hover = pointer.current.active ? 1 : 0;
    const progress = (clock.elapsedTime * (0.12 + hover * 0.06) + phase) % 1;
    particle.current.position.copy(curve.getPointAt(progress));
    particle.current.material.opacity = MathUtils.damp(particle.current.material.opacity, 0.12 + hover * 0.12, 3, delta);
  });

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 32, 0.009, 7, false]} />
        <meshPhysicalMaterial color={color} metalness={0.55} roughness={0.3} emissive={color} emissiveIntensity={color === '#45D9FF' ? 0.045 : 0.018} transparent opacity={0.68} />
      </mesh>
      <mesh ref={particle}>
        <sphereGeometry args={[0.024, 12, 10]} />
        <meshBasicMaterial color="#45D9FF" transparent opacity={0.14} />
      </mesh>
    </>
  );
}

function BusinessSystemsModel({ pointer }) {
  const connections = [
    [systemModules[1].position, systemModules[0].position],
    [systemModules[1].position, systemModules[2].position],
    [systemModules[1].position, systemModules[3].position],
    [systemModules[2].position, systemModules[4].position],
    [systemModules[3].position, systemModules[4].position]
  ];

  return (
    <group>
      <SoftShadow position={[0, -0.72, 0]} scale={[0.88, 0.42, 1]} />
      {connections.map(([start, end], index) => (
        <FlowingConnection key={index} start={start} end={end} pointer={pointer} phase={index / connections.length} color={index === connections.length - 1 ? '#8B5CF6' : '#45D9FF'} />
      ))}
      {systemModules.map((module, index) => (
        <Module key={index} module={module} pointer={pointer} />
      ))}
    </group>
  );
}

function ServiceArt({ type, pointer }) {
  switch (type) {
    case 'software':
      return <SoftwareModel pointer={pointer} />;
    case 'web':
      return <LaptopModel pointer={pointer} />;
    case 'ai':
      return <IntelligenceCore pointer={pointer} />;
    case 'systems':
      return <BusinessSystemsModel pointer={pointer} />;
    default:
      return null;
  }
}

function AnimatedModel({ type, pointer }) {
  const group = useRef();
  const keyLight = useRef();
  const fillLight = useRef();
  const paused = useMotionPaused();

  useFrame(({ clock }, delta) => {
    if (paused || !group.current) return;

    const { x, y, active } = pointer.current;
    const hover = active ? 1 : 0;
    const sway = Math.sin(clock.elapsedTime * 0.45);

    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, (type === 'web' ? 0.06 : 0.12) + x * 0.12 + sway * 0.055, 3, delta);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, -y * 0.1 + Math.sin(clock.elapsedTime * 0.55) * 0.025, 3, delta);
    group.current.position.y = MathUtils.damp(group.current.position.y, Math.sin(clock.elapsedTime * 0.75) * 0.035 + hover * 0.045, 3, delta);

    if (keyLight.current) {
      keyLight.current.position.x = MathUtils.damp(keyLight.current.position.x, 1.1 + x * 0.5, 3, delta);
      keyLight.current.position.y = MathUtils.damp(keyLight.current.position.y, 1.2 + y * 0.35, 3, delta);
      keyLight.current.intensity = MathUtils.damp(keyLight.current.intensity, 8.5 + hover * 0.9, 3, delta);
    }
    if (fillLight.current) {
      fillLight.current.intensity = MathUtils.damp(fillLight.current.intensity, 3 + hover * 0.35, 3, delta);
    }
  });

  return (
    <>
      <group ref={group} scale={type === 'web' ? 0.96 : type === 'ai' ? 0.86 : 0.92}>
        <ServiceArt type={type} pointer={pointer} />
      </group>
      <directionalLight position={[3, 4, 4]} color="#F5F7FF" intensity={1.7} />
      <pointLight ref={keyLight} position={[1.1, 1.2, 1.8]} color="#45D9FF" intensity={8.5} distance={6} decay={2} />
      <pointLight ref={fillLight} position={[-1.7, -0.4, 0.5]} color="#8B5CF6" intensity={3} distance={5} decay={2} />
    </>
  );
}

export default function ServiceModel({ type, pointer }) {
  const paused = useMotionPaused();
  const mobile = matchMedia('(max-width: 700px)').matches;

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0.18, 0.16, 3.05], fov: 34 }}
      dpr={mobile ? 1 : [1, 1.5]}
      frameloop={paused ? 'demand' : 'always'}
      gl={{
        alpha: true,
        antialias: !mobile,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: SRGBColorSpace
      }}
    >
      <ambientLight intensity={0.62} color="#94A3B8" />
      <hemisphereLight args={['#2878FF', '#050D1A', 0.8]} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.1} color="#F5F7FF" position={[0, 3, 2]} scale={[4, 1.4, 1]} />
        <Lightformer form="rect" intensity={1.45} color="#45D9FF" position={[-3, 0.7, 1]} scale={[1.4, 3, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#8B5CF6" position={[3, -0.4, -1]} scale={[1.2, 2.5, 1]} />
      </Environment>
      <AnimatedModel type={type} pointer={pointer} />
    </Canvas>
  );
}
