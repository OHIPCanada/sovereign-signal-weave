import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  waveFieldVertex,
  waveFieldFragment,
  particleVertex,
  particleFragment,
} from "./shaders";

const LOOP = 12.5;

function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface SceneProps {
  mouseX: number;
  mouseY: number;
  isMobile: boolean;
  reducedMotion: boolean;
}

// ─── Wave Field (fullscreen quad) ───────────────────────
function WaveField({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { size } = useThree();
  const mx = useRef(0);
  const my = useRef(0);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: waveFieldVertex,
        fragmentShader: waveFieldFragment,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2() },
          uCoherence: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uLoopT: { value: 0 },
          uZoom: { value: 1 },
        },
        depthTest: false,
        depthWrite: false,
      }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const lt = (t % LOOP) / LOOP;

    mx.current = lerp(mx.current, (mouseX - 0.5) * 2, 0.05);
    my.current = lerp(my.current, (mouseY - 0.5) * 2, 0.05);

    material.uniforms.uTime.value = t;
    material.uniforms.uLoopT.value = lt;
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uMouse.value.set(mx.current, my.current);

    const pC = smoothstep(0.34, 0.57, lt);
    const pD = smoothstep(0.57, 0.83, lt);
    const pE = smoothstep(0.83, 1.0, lt);
    material.uniforms.uCoherence.value = Math.min(
      1,
      pC * 0.35 + pD * 0.85 + pE * 1.0
    );

    const fusionZoom =
      smoothstep(0.5, 0.75, lt) * (1 - smoothstep(0.85, 1.0, lt));
    material.uniforms.uZoom.value = 1.0 + fusionZoom * 0.08;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ─── Particle System (CPU simulation) ───────────────────
function ParticleSystem({
  mouseX,
  mouseY,
  isMobile,
}: Omit<SceneProps, "reducedMotion">) {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = isMobile ? 8000 : 20000;

  const { geometry, velocities, types, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const vels = new Float32Array(count * 2);
    const tp = new Float32Array(count);
    const sd = new Float32Array(count);
    const sizes = new Float32Array(count);
    const energies = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const isAI = i >= count / 2;
      tp[i] = isAI ? 1 : 0;
      sd[i] = Math.random();

      const spread = 0.3 + Math.random() * 3.2;
      positions[i * 3] = isAI ? spread : -spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.25;

      vels[i * 2] = (Math.random() - 0.5) * 0.004;
      vels[i * 2 + 1] = (Math.random() - 0.5) * 0.004;

      sizes[i] = 0.35 + Math.random() * 1.1;
      energies[i] = 0.25 + Math.random() * 0.75;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aType", new THREE.BufferAttribute(tp, 1));
    geo.setAttribute("aEnergy", new THREE.BufferAttribute(energies, 1));

    return { geometry: geo, velocities: vels, types: tp, seeds: sd };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: {
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    const lt = (t % LOOP) / LOOP;

    const posAttr = geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const energyAttr = geometry.getAttribute(
      "aEnergy"
    ) as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;
    const energy = energyAttr.array as Float32Array;

    const pB = smoothstep(0.18, 0.34, lt);
    const pC = smoothstep(0.34, 0.57, lt);
    const pD = smoothstep(0.57, 0.83, lt);
    const pE = smoothstep(0.83, 1.0, lt);
    const coherence = Math.min(1, pC * 0.35 + pD * 0.85 + pE);
    const converge = pB * 0.25 + pC * 0.7 + pD * 0.4;
    const damping = 0.986 - coherence * 0.055;
    const resetStr = smoothstep(0.93, 1.0, lt) * 0.06;

    const DT = 0.016;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iv = i * 2;
      const isAI = types[i] > 0.5;
      const seed = seeds[i];

      let x = pos[ix];
      let y = pos[ix + 1];
      let vx = velocities[iv];
      let vy = velocities[iv + 1];

      // Beat A: noise-driven drift
      const turbulence = isAI ? 0.25 : 0.55;
      const nx = Math.sin(t * 0.5 + seed * 97 + y * 2.1) * turbulence;
      const ny = Math.cos(t * 0.4 + seed * 193 + x * 1.8) * turbulence;
      vx += nx * DT * (1 - coherence * 0.65);
      vy += ny * DT * (1 - coherence * 0.65);

      // AI: subtle periodic oscillation
      if (isAI) {
        vx += Math.sin(t * 1.2 + seed * 50) * 0.04 * DT;
        vy += Math.cos(t * 0.9 + seed * 70) * 0.03 * DT;
      }

      // Beat B: attention field
      vx += -x * converge * DT * 0.14;
      vy += -y * converge * DT * 0.04;

      // Beat C: cross-boundary exchange
      if (pC > 0.05 && pC < 0.95) {
        const crossDir = isAI ? -1 : 1;
        vx +=
          crossDir * pC * DT * 0.28 * Math.max(0, 1 - Math.abs(x) * 0.18);
      }

      // Beat D: stabilize toward equilibrium
      if (pD > 0.2) {
        const eqX = (seed * 2 - 1) * 1.8 * (isAI ? 0.6 : -0.6);
        const eqY = (seed * 2 - 1) * 1.1;
        vx += (eqX - x) * pD * DT * 0.08;
        vy += (eqY - y) * pD * DT * 0.08;
      }

      // Beat E: loop reset
      if (resetStr > 0) {
        const homeX = isAI ? seed * 3.2 + 0.3 : -(seed * 3.2 + 0.3);
        const homeY = (seed - 0.5) * 3.2;
        vx += (homeX - x) * resetStr;
        vy += (homeY - y) * resetStr;
      }

      vx *= damping;
      vy *= damping;
      x += vx;
      y += vy;

      if (Math.abs(x) > 4.8) vx -= x * 0.025;
      if (Math.abs(y) > 3.2) vy -= y * 0.025;

      pos[ix] = x;
      pos[ix + 1] = y;
      velocities[iv] = vx;
      velocities[iv + 1] = vy;

      energy[i] =
        0.12 +
        0.35 * (1 - coherence) * Math.abs(Math.sin(t * 0.7 + seed * 47)) +
        coherence * 0.45 +
        pC * 0.3 * Math.abs(Math.sin(t * 2.2 + seed * 31));
    }

    posAttr.needsUpdate = true;
    energyAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} renderOrder={0}>
      <primitive object={material} attach="material" />
    </points>
  );
}

// ─── Scene Root ─────────────────────────────────────────
export default function HeroScene({
  mouseX,
  mouseY,
  isMobile,
  reducedMotion,
}: SceneProps) {
  return (
    <>
      <WaveField mouseX={mouseX} mouseY={mouseY} />
      {!reducedMotion && (
        <ParticleSystem mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />
      )}
    </>
  );
}
