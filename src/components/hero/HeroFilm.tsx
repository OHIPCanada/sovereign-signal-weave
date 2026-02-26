import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import neuralProfile from "@/assets/neural-profile.png";

// ─── Constants ───────────────────────────────────────────────────
const PARTICLE_COUNT = 3000;
const LOOP_DURATION = 17.5; // seconds
const DEPTH_LAYERS = 3;

// Scene timing (seconds)
const S1_END = 2.5;
const S2_END = 5.0;
const S3_END = 9.0;
const S4_END = 12.0;
const S5_END = 16.0;
const FADE_OUT = 17.5;

// Colors
const COOL_PURPLE = new THREE.Color("#6B3FA0");
const LAVENDER = new THREE.Color("#C084FC");
const CYAN = new THREE.Color("#00FFFF");
const CORAL = new THREE.Color("#D4616B");
const GOLD = new THREE.Color("#D4A853");
const WARM_WHITE = new THREE.Color("#F0E6D6");
const DIM_WHITE = new THREE.Color("#8888AA");

// ─── Image Sampler ──────────────────────────────────────────────
function sampleImagePositions(
  img: HTMLImageElement,
  count: number
): Float32Array {
  const canvas = document.createElement("canvas");
  const size = 256;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  // Collect bright pixels
  const candidates: [number, number][] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 40 && data[i + 3] > 100) {
        candidates.push([x, y]);
      }
    }
  }

  const positions = new Float32Array(count * 3);
  const scale = 4.0; // world units spread
  for (let i = 0; i < count; i++) {
    const [px, py] = candidates[Math.floor(Math.random() * candidates.length)];
    // Center and normalize
    positions[i * 3] = ((px / size) - 0.5) * scale;
    positions[i * 3 + 1] = ((1 - py / size) - 0.5) * scale; // flip Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3; // slight z spread
  }
  return positions;
}

// ─── Vertex Shader ──────────────────────────────────────────────
const vertexShader = `
  attribute vec3 randomPos;
  attribute vec3 targetPos;
  attribute float depthLayer;
  attribute float particleSize;
  attribute float particlePhase;
  
  uniform float uTime;
  uniform float uScene;
  uniform vec2 uMouse;
  uniform float uConverge;
  uniform float uFusion;
  
  varying float vDepth;
  varying float vScene;
  varying float vFusion;
  varying float vPhase;
  
  void main() {
    vDepth = depthLayer;
    vScene = uScene;
    vFusion = uFusion;
    vPhase = particlePhase;
    
    // Lerp between random and target based on convergence
    vec3 pos = mix(randomPos, targetPos, uConverge);
    
    // Scene 1: jitter
    if (uScene < 1.0) {
      float jitter = (1.0 - uScene) * 0.15;
      pos += vec3(
        sin(uTime * 3.0 + particlePhase * 6.28) * jitter,
        cos(uTime * 2.5 + particlePhase * 4.0) * jitter,
        sin(uTime * 1.5 + particlePhase * 3.0) * jitter * 0.5
      );
    }
    
    // Scene 5: dissolve outward
    if (uScene > 4.0) {
      float dissolve = (uScene - 4.0);
      float angle = particlePhase * 6.28;
      float radius = dissolve * 2.0;
      pos += vec3(
        cos(angle) * radius * 0.5,
        sin(angle) * radius * 0.3,
        sin(particlePhase * 3.14) * dissolve * 0.5
      );
    }
    
    // Parallax based on depth layer
    float parallaxStrength = depthLayer * 0.02;
    pos.x += uMouse.x * parallaxStrength;
    pos.y += uMouse.y * parallaxStrength;
    
    // Breathing in Scene 5
    if (uScene > 4.0) {
      float breath = sin(uTime * 0.8) * 0.02 * uFusion;
      pos *= 1.0 + breath;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    float size = particleSize * (1.0 + uFusion * 0.3);
    gl_PointSize = size * (300.0 / -mvPosition.z);
  }
`;

// ─── Fragment Shader ────────────────────────────────────────────
const fragmentShader = `
  varying float vDepth;
  varying float vScene;
  varying float vFusion;
  varying float vPhase;
  
  uniform vec3 uColor1; // purple
  uniform vec3 uColor2; // lavender/cyan
  uniform vec3 uColor3; // coral
  uniform vec3 uColor4; // gold
  uniform float uScene;
  
  void main() {
    // Soft circle
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d);
    
    // Color progression based on scene
    vec3 color;
    if (vScene < 1.0) {
      color = mix(uColor1, uColor2, vPhase);
    } else if (vScene < 2.0) {
      float t = vScene - 1.0;
      vec3 base = mix(uColor1, uColor2, vPhase);
      color = mix(base, uColor2, t * 0.5);
    } else if (vScene < 3.0) {
      float t = vScene - 2.0;
      vec3 base = mix(uColor2, uColor3, vPhase * 0.6);
      color = mix(uColor2, base, t);
    } else if (vScene < 4.0) {
      float t = vScene - 3.0;
      vec3 base = mix(uColor2, uColor3, vPhase * 0.5);
      color = mix(base, mix(uColor3, uColor4, t * 0.3), t);
    } else {
      vec3 base = mix(uColor2, uColor3, vPhase * 0.4);
      color = mix(base, uColor4, vFusion * 0.2);
    }
    
    // Depth-based brightness
    float depthDim = 0.5 + vDepth * 0.5;
    alpha *= depthDim;
    
    // Glow boost during convergence
    alpha *= 0.6 + vFusion * 0.4;
    
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

// ─── Grid Shader ────────────────────────────────────────────────
const gridVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFragmentShader = `
  varying vec2 vUv;
  uniform float uOpacity;
  uniform float uTime;
  
  void main() {
    vec2 grid = fract(vUv * 20.0);
    float line = smoothstep(0.02, 0.0, min(grid.x, grid.y));
    line += smoothstep(0.02, 0.0, min(1.0 - grid.x, 1.0 - grid.y));
    line = min(line, 1.0);
    
    // Radial fade
    float dist = length(vUv - vec2(0.5));
    float radialFade = smoothstep(0.6, 0.2, dist);
    
    float alpha = line * uOpacity * radialFade * 0.15;
    gl_FragColor = vec4(0.42, 0.38, 0.63, alpha);
  }
`;

// ─── Particles Component ────────────────────────────────────────
function Particles({ targetPositions }: { targetPositions: Float32Array | null }) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const startTime = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onTouch = (e: TouchEvent) => {
      if (!e.touches.length) return;
      mouseRef.current.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const { randomPositions, depthLayers, sizes, phases } = useMemo(() => {
    const rp = new Float32Array(PARTICLE_COUNT * 3);
    const dl = new Float32Array(PARTICLE_COUNT);
    const sz = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 4;
      rp[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      rp[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      rp[i * 3 + 2] = (Math.random() - 0.5) * 3;

      dl[i] = Math.floor(Math.random() * DEPTH_LAYERS) / (DEPTH_LAYERS - 1);
      sz[i] = 1.5 + Math.random() * 3;
      ph[i] = Math.random();
    }
    return { randomPositions: rp, depthLayers: dl, sizes: sz, phases: ph };
  }, []);

  const targets = useMemo(() => {
    if (targetPositions) return targetPositions;
    // Fallback: converge to center cluster
    const t = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.8;
      t[i * 3] = Math.cos(angle) * r;
      t[i * 3 + 1] = Math.sin(angle) * r;
      t[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return t;
  }, [targetPositions]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScene: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uConverge: { value: 0 },
      uFusion: { value: 0 },
      uColor1: { value: COOL_PURPLE },
      uColor2: { value: LAVENDER },
      uColor3: { value: CORAL },
      uColor4: { value: GOLD },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    if (startTime.current === 0) startTime.current = clock.elapsedTime;

    const elapsed = clock.elapsedTime - startTime.current;
    const loopTime = elapsed % LOOP_DURATION;
    const u = materialRef.current.uniforms;

    u.uTime.value = clock.elapsedTime;

    // Scene index (0-5)
    let scene = 0;
    if (loopTime < S1_END) scene = loopTime / S1_END;
    else if (loopTime < S2_END) scene = 1 + (loopTime - S1_END) / (S2_END - S1_END);
    else if (loopTime < S3_END) scene = 2 + (loopTime - S2_END) / (S3_END - S2_END);
    else if (loopTime < S4_END) scene = 3 + (loopTime - S3_END) / (S4_END - S3_END);
    else if (loopTime < S5_END) scene = 4 + (loopTime - S4_END) / (S5_END - S4_END);
    else scene = 4 + (loopTime - S4_END) / (FADE_OUT - S4_END);

    u.uScene.value = scene;

    // Convergence: 0 in S1, ramps up in S2, full by S3
    let converge = 0;
    if (loopTime >= S1_END && loopTime < S2_END) {
      converge = (loopTime - S1_END) / (S2_END - S1_END);
      converge = converge * converge; // ease-in
    } else if (loopTime >= S2_END && loopTime < S5_END) {
      converge = 1;
    } else if (loopTime >= S5_END) {
      converge = 1 - (loopTime - S5_END) / (FADE_OUT - S5_END);
    }
    u.uConverge.value = converge;

    // Fusion (breathing pulse in S5)
    let fusion = 0;
    if (loopTime >= S4_END && loopTime < FADE_OUT) {
      fusion = (loopTime - S4_END) / (S5_END - S4_END);
      fusion = Math.min(fusion, 1);
    }
    u.uFusion.value = fusion;

    // Smooth mouse
    u.uMouse.value.lerp(
      new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
      0.05
    );
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={randomPositions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-randomPos"
          array={randomPositions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPos"
          array={targets}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-depthLayer"
          array={depthLayers}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-particleSize"
          array={sizes}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-particlePhase"
          array={phases}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Infrastructure Grid ────────────────────────────────────────
function InfraGrid() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const startTime = useRef(0);

  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    if (startTime.current === 0) startTime.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - startTime.current;
    const loopTime = elapsed % LOOP_DURATION;
    const u = materialRef.current.uniforms;

    u.uTime.value = clock.elapsedTime;

    // Grid fades in during S1 (1.5-2.5s), sharpens in S2, dims in S5
    let opacity = 0;
    if (loopTime >= 1.5 && loopTime < S2_END) {
      opacity = (loopTime - 1.5) / (S2_END - 1.5);
    } else if (loopTime >= S2_END && loopTime < S5_END) {
      opacity = 1;
    } else if (loopTime >= S5_END) {
      opacity = 1 - (loopTime - S5_END) / (FADE_OUT - S5_END);
    }
    u.uOpacity.value = opacity;
  });

  return (
    <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[12, 12]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Cinematic Camera ───────────────────────────────────────────
function CinematicCamera() {
  const { camera } = useThree();
  const startTime = useRef(0);

  useFrame(({ clock }) => {
    if (startTime.current === 0) startTime.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - startTime.current;
    const loopTime = elapsed % LOOP_DURATION;

    // Camera push-in during convergence (S2-S3)
    let zoomTarget = 5;
    if (loopTime >= S1_END && loopTime < S3_END) {
      const t = (loopTime - S1_END) / (S3_END - S1_END);
      zoomTarget = 5 - t * 0.8; // push in
    } else if (loopTime >= S3_END && loopTime < S5_END) {
      zoomTarget = 4.2;
    } else if (loopTime >= S5_END) {
      const t = (loopTime - S5_END) / (FADE_OUT - S5_END);
      zoomTarget = 4.2 + t * 0.8; // pull back
    }

    camera.position.z += (zoomTarget - camera.position.z) * 0.03;
  });

  return null;
}

// ─── Cinematic Grain Overlay ────────────────────────────────────
function FilmGrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function HeroFilm() {
  const [targetPositions, setTargetPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const positions = sampleImagePositions(img, PARTICLE_COUNT);
      setTargetPositions(positions);
    };
    img.src = neuralProfile;
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        style={{ background: "transparent" }}
      >
        <CinematicCamera />
        <InfraGrid />
        <Particles targetPositions={targetPositions} />
      </Canvas>
      <FilmGrain />
    </div>
  );
}
